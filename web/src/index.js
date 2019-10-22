import React from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider, createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles'
import blueGrey from '@material-ui/core/colors/blueGrey';
import deepOrange from '@material-ui/core/colors/deepOrange';
import indigo from '@material-ui/core/colors/indigo';
import App from './App';

const theme = responsiveFontSizes(
  createMuiTheme({
    palette: {
      primary: indigo,
      secondary: deepOrange,
      background: blueGrey[900],
    },
  })
);

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <App />
  </MuiThemeProvider>,
  document.getElementById('root')
);