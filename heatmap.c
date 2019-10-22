#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <fcntl.h>
#include <signal.h>
#include <linux/input.h>
#include <sys/stat.h>
#include <sys/types.h>

#define PROGNAME  "heatmap"
#define PID_FILE  "/var/run/heatmap.pid"
#define LOG_FILE  "/var/log/heatmap.log"
#define DEV_EVENT "/dev/input/event"
#define KEYDOWN   1

static void usage(void);
static void signal_handler();
static int write_pid_file(const int pid);
static int loop(const int fd, FILE* const fp);
static int start_daemon(const char *event_id);
static int stop_daemon(void);

static int stop_loop = 0;

int main(int argc, char *argv[]) {
    int exit_status = EXIT_FAILURE;

    if (getuid() != 0) {
        fprintf(stderr, "[-] need root privileges\n");
        goto error;
    }

    if (argc < 2) {
        usage();
        goto error;
    }

    if (strcmp(argv[1], "stop") == 0) {
        exit_status = stop_daemon();
    }
    else if (strcmp(argv[1], "start") == 0 && argc > 2) {
        exit_status = start_daemon(argv[2]);
    }
    else {
        usage();
    }

error:
    return exit_status;
}

static void usage(void) {
    fprintf(stderr, "[i] usage: ./%s <start|stop> [eventid]\n", PROGNAME);
}

static void signal_handler() {
    stop_loop = 1;
}

static int write_pid_file(const int pid) {
    FILE *fp = NULL;
    if ((fp = fopen(PID_FILE, "w")) == NULL) {
        return -1;
    }
    fprintf(fp, "%d\n", pid);
    fclose(fp);
    return 0;
}

static int loop(const int fd, FILE* const fp) {
    struct input_event ev;

    setbuf(fp, NULL);
    while (!stop_loop) {
        if (read(fd, &ev, sizeof ev) == -1) {
            return -1;
        }
        if (ev.type == EV_KEY && ev.value == KEYDOWN) {
            if (fprintf(fp, "%d ", ev.code) == -1) {
                return -1;
            }
        }
    }

    return 0;
}

static int start_daemon(const char *event_id) {
    int exit_status = EXIT_FAILURE;
    FILE *fp = NULL;

    signal(SIGTERM, signal_handler);

    char devname[sizeof DEV_EVENT + sizeof (char*)];
    snprintf(devname, sizeof devname, "%s%s", DEV_EVENT, event_id);
    int fd = open(devname, O_RDONLY);
    if (fd == -1) {
        fprintf(stderr, "[-] could not read event file\n");
        goto error;
    }

    fp = fopen(LOG_FILE, "a");
    if (fp == NULL) {
        fprintf(stderr, "[-] could not open or create file\n");
        goto error;
    }

    const int status = chmod(LOG_FILE, S_IRUSR);
    if (status == -1) {
        goto error;
    }

    int pid;
    switch ((pid = fork())) {
    case 0:
        printf("[+] daemon created\n");
        break;
    case -1:
        fprintf(stderr, "[-] daemon creation failed\n");
        goto error;
    default:
        if (write_pid_file(pid) == -1) {
            fprintf(stderr, "[-] unable to write in %s\n", PID_FILE);
            goto error;
        }
        return EXIT_SUCCESS;
    }

    if (loop(fd, fp) == -1) {
        fprintf(stderr, "[-] something went wrong\n");
    } else {
        exit_status = EXIT_SUCCESS;
    }

error:
    if (fd != -1) {
        close(fd);
    }
    if (fp != NULL) {
        fclose(fp);
    }
    unlink(PID_FILE);

    return exit_status;
}

static int stop_daemon(void) {
    int exit_status = EXIT_FAILURE;
    FILE *fp = NULL;
    int pid;
    struct stat sb;

    if (stat(PID_FILE, &sb) == -1) {
        fprintf(stderr, "[-] could not stat pid file\n");
        goto error;
    }
    if (!S_ISREG(sb.st_mode)) {
        fprintf(stderr, "[-] pid file is not a regular file\n");
        goto error;
    }

    if ((fp = fopen(PID_FILE, "r")) == NULL) {
        fprintf(stderr, "[-] could not open pid file\n");
        goto error;
    }

    if (fscanf(fp, "%d", &pid) == -1) {
        fprintf(stderr, "[-] could not read pid file\n");
        goto error;
    }

    if (kill(pid, SIGTERM) == -1) {
        fprintf(stderr, "[-] could not kill forked child\n");
        goto error;
    }

    exit_status = EXIT_SUCCESS;
    printf("[+] daemon stopped\n");

error:
    if (fp != NULL) {
        fclose(fp);
    }
    return exit_status;
}