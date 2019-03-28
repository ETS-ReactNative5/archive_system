import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Icon } from 'antd';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { required } from '../../shared/utils/form_validations';
import { renderInput } from '../../shared/utils/form_components';
import iconVisibilty from '../../shared/assets/icons/ic_visibility.svg';
import iconVisibiltyOff from '../../shared/assets/icons/ic_visibility_off.svg';
import iconError from '../../shared/assets/icons/ic_error.svg';

const { Item: FormItem } = Form;

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showPassword: false,
    };

    this.handleCheck = this.handleCheck.bind(this);
  }

  handleCheck() {
    this.setState({ showPassword: !this.state.showPassword });
  }

  render() {
    const { showPassword } = this.state;
    const { handleSubmit, error, submitting, onSubmit } = this.props;

    const iconEye = this.state.showPassword ? 'lock' : 'eye';
    const suffix = <Icon type={iconEye} style={{ fontSize: '16px' }} onClick={this.handleCheck} />;// eslint-disable-line

    return (
      <Form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        <Field
          name="login"
          className="login-form__input"
          component={renderInput}
          placeholder="Login"
          validate={required}
          autoFocus
        />
        <Field
          name="password"
          className="login-form__input"
          type={showPassword ? 'text' : 'password'}
          suffix={suffix}
          component={renderInput}
          placeholder="Password"
          validate={required}
        />
        <FormItem>
          <Link className="login-form__link" to="forgot_password">Забыли пароль?</Link>
        </FormItem>
        <FormItem>
          <Button className="login-form__btn" type="primary" htmlType="submit" disabled={submitting}>
            {submitting ? 'Загрузка...' : 'Войти'}
          </Button>
          {error && <span className="login-form__error"><img src={iconError} alt="error"/>{error}</span>}
        </FormItem>
        <FormItem>
          <Link className="login-form__link" to="signup">Регистрация</Link>
        </FormItem>
      </Form>
    );
  }
}

LoginForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  error: PropTypes.string,
  submitting: PropTypes.bool.isRequired,
};

LoginForm.defaultProps = { error: '' };

export default reduxForm({ form: 'loginForm' })(LoginForm);
