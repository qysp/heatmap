import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import Grid from '@material-ui/core/Grid';

import KeyboardKey from './KeyboardKey';

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
}));

export default function KeyboardRow(props) {
  const classes = useStyles();

  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      className={classes.root}
    >
      {props.row.map((key, index) => (
        <Grid item key={index}>
          <KeyboardKey {...key} codeCounts={props.codeCounts} />
        </Grid>
      ))}
    </Grid>
  );
}
