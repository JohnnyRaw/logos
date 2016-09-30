import React from 'react';
import { connect } from 'react-redux';
import { shouldComponentUpdate } from 'utils/helpers';
import { restore } from 'actions';

import SystemNotifications from 'components/SystemNotifications';

export class AppPrivate extends React.Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired,
    dispatch: React.PropTypes.func.isRequired,
    user: React.PropTypes.object.isRequired
  };

  shouldComponentUpdate = shouldComponentUpdate;

  componentWillMount() {
    if (!this.props.user.authenticated) {
      this.props.dispatch(restore());
    }
  }

  render() {
    return (
      <div key="app" className="app app--private">
        <main className="app__main">
          {this.props.children}
        </main>
        <SystemNotifications />
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return { user: state.user };
}

export default connect(mapStateToProps)(AppPrivate);
