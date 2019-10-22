import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/styles/makeStyles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  title: {
    padding: theme.spacing(1),
  }
}));

export default function Title(props) {
  const classes = useStyles();

  return (
    <Typography className={classes.title} variant="h3">
      {props.children}
    </Typography>
  );
}

Title.propTypes = {
  children: PropTypes.node,
};
