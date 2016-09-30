import React from 'react';
import { connect } from 'react-redux';
import { shouldComponentUpdate } from 'utils/helpers';

import Header from 'components/Header';
import Footer from 'components/Footer';
import SystemNotifications from 'components/SystemNotifications';

export class AppPublic extends React.Component {
  static propTypes = {
    app: React.PropTypes.object.isRequired,
    children: React.PropTypes.node.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    firebase: React.PropTypes.object.isRequired
  };

  shouldComponentUpdate = shouldComponentUpdate;

  render() {
    const { app, firebase, dispatch } = this.props;

    return (
      <div key="app" className="app app--public">
        <Header app={app} dispatch={dispatch} firebase={firebase} />
        <main className="app__main">
          {this.props.children}
        </main>
        <Footer dispatch={dispatch} />
        <SystemNotifications />
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    app: state.app,
    firebase: state.firebase
  };
}

export default connect(mapStateToProps)(AppPublic);

