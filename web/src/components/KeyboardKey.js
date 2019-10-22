import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { defaultWidth } from '../keys';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    margin: theme.spacing(0.5),
    padding: theme.spacing(0.5),
    height: defaultWidth,
    whiteSpace: 'pre-line',
    boxShadow: 'rgba(0, 0, 0, 0.1) 0px -1px 0px 3px inset, rgba(0, 0, 0, 0.3) 0px 0px 0px 1px;',
    justifyContent: 'center',
    alignItems: 'center',
    WebkitBoxAlign: 'center',
  },
}));

export default function KeyboardKey(props) {
  const classes = useStyles();
  const total = Object.values(props.codeCounts).reduce((acc, cur) => acc + cur, 0);
  const count = props.codeCounts[props.code] || 0;

  return (
    <Paper
      className={classes.root}
      title={props.name}
      style={{
        width: props.width,
        background: `rgba(183, 28, 28, ${(count / total) * 10})`,
      }}
    >
      <Typography variant="body2">
        {props.display}
      </Typography>
    </Paper>
  );
}
