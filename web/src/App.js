import React from 'react';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';

import Title from './components/Title';
import LayoutSelect from './components/LayoutSelect';
import Keyboard from './components/Keyboard';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      layout: '',
      codeCounts: {},
    };

    this.handleLayoutChange = this.handleLayoutChange.bind(this);
  }

  componentDidMount() {
    fetch('/heatmap')
      .then(res => res.json())
      .then(body => this.setState({ codeCounts: body }));
  }

  handleLayoutChange(ev) {
    this.setState({ layout: ev.target.value });
  }

  render() {
    return (
      <Container>
        <CssBaseline />
        <Title>Heatmap</Title>
        <LayoutSelect
          handleChange={this.handleLayoutChange}
          layout={this.state.layout}
        />
        <Keyboard
          layout={this.state.layout}
          codeCounts={this.state.codeCounts}
        />
      </Container>
    );
  }
}
