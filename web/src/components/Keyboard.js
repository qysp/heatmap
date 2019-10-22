import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import KeyboardRow from './KeyboardRow';
import { getLayout } from '../keys';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
    width: "100%",
  },
  row: {},
}));

export default function Keyboard(props) {
  const classes = useStyles();
  const layout = getLayout(props.layout);

  return (
    <Paper className={classes.root}>
      {layout !== undefined ? (
        layout.map((row, index) => (
          <KeyboardRow
            key={index}
            row={row}
            codeCounts={props.codeCounts}
          />
        ))
      ) : (
        <Typography>
          Select a layout <span role="img" aria-label="call me hand">🤙</span>
        </Typography>
      )}
    </Paper>
  );
}
