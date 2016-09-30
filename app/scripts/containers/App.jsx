import React from 'react';
import { connect } from 'react-redux';
import { shouldComponentUpdate } from 'utils/helpers';

import { initFirebase } from 'actions';

export class App extends React.Component {
  static propTypes = {
    children: React.PropTypes.object.isRequired,
    dispatch: React.PropTypes.func.isRequired
  };

  shouldComponentUpdate = shouldComponentUpdate;

  componentWillMount() {
    this.props.dispatch(initFirebase());
  }

  render() {
    return this.props.children;
  }
}

function mapStateToProps(state) {
  return { firebase: state.firebase };
}

export default connect(mapStateToProps)(App);
