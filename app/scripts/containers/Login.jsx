import React from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { shouldComponentUpdate } from 'utils/helpers';

import { login } from 'actions';

export class Login extends React.Component {
  static propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    user: React.PropTypes.object.isRequired
  };

  shouldComponentUpdate = shouldComponentUpdate;

  @autobind
  onClickLogin(e) {
    e.preventDefault();
    const { provider } = e.currentTarget.dataset;

    this.props.dispatch(login(provider));
  }

  render() {
    const { user } = this.props;
    let message;

    if (user.authenticated && !user.isAdmin) {
      message = (<div>Invalid credentials</div>);
    }

    return (
      <div key="Login" className="app__login app__route">
        <div className="app__container">
          <div className="app__login__wrapper">
            <a
              href="#login"
              onClick={this.onClickLogin}
              className="btn btn-lg btn-primary btn-icon"
              data-provider="github">
              <i className="i-github" />
              <span>Login</span>
            </a>

            <a
              href="#login"
              onClick={this.onClickLogin}
              className="btn btn-lg btn-primary btn-icon"
              data-provider="facebook">
              <i className="i-facebook" />
              <span>Login</span>
            </a>
            {message}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { user: state.user };
}

export default connect(mapStateToProps)(Login);
