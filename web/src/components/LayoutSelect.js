import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import { layouts } from '../keys';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

export default function KeyboardRow(props) {
  const classes = useStyles();

  return (
    <form className={classes.root} autoComplete="off">
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="layout">Layout</InputLabel>
        <Select
          value={props.layout}
          onChange={props.handleChange}
          inputProps={{
            name: 'layout',
            id: 'layout',
          }}
        >
          {Object.keys(layouts).map((layout, index) => (
            <MenuItem key={index} value={layout}>
              {layout}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </form>
  );
}
