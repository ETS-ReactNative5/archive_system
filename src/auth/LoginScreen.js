import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LoginForm from './components/LoginForm';

import { parseFormErrors } from '../shared/utils/form_errors';

import { login, getAllConstants } from '../shared/actions/actions';

class LoginScreen extends Component {

  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(values) {
    return this.props.login(values.login, values.password)
      .then(() => {
          this.props.getAllConstants();
          /*if(data.user) {
            if(data.user.privs.includes('readingroom')) {
              //load rr cube
            }
          }*/
      })
      .catch(err => {
        parseFormErrors(err);
      })
  }


  render() {
    return (
      <div className="login-container">
        <LoginForm onSubmit={this.onSubmit} />
      </div>
    );
  }
}

LoginScreen.propTypes = {
  login: PropTypes.func.isRequired,
  getAllConstants: PropTypes.func.isRequired
};


export default connect(null, { login, getAllConstants })(LoginScreen);
