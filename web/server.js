const http = require('http');
const { readFile } = require('fs').promises;

const HEATMAP_PATH = '/var/log/heatmap.log';

http.createServer(async (_, res) => {
  const content = await readFile(HEATMAP_PATH, { encoding: 'utf8' }).catch((err) => {
    console.error(err);
    return '';
  });

  const codes = [];
  if (typeof content === 'string' && content.length > 0) {
    codes.push(...content.split(' '));
    codes.pop();
  }

  const mappedCodes = codes.reduce((mapped, code) => ({
    ...mapped,
    [code]: mapped.hasOwnProperty(code) ? mapped[code]+1 : 1,
  }), {});

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(mappedCodes));
}).listen(1337);