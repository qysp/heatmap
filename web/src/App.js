import React from 'react';
import Container from '@material-ui/core/Container';

import Title from './components/Title';
import LayoutSelect from './components/LayoutSelect';
import Keyboard from './components/Keyboard';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      codeCounts: {},
      layout: '',
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    fetch('/heatmap')
      .then(res => res.json())
      .then(body => this.setState({ codeCounts: body }));
  }

  handleChange(ev) {
    this.setState({ layout: ev.target.value });
  }

  render() {
    return (
      <Container>
        <Title>Heatmap</Title>
        <LayoutSelect
          handleChange={this.handleChange}
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
