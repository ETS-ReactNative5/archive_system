import React from 'react';
import { reduxForm, Field } from 'redux-form';
import {Form} from "antd";
import {renderInput} from "../../utils/form_components";
import {password, equalsTo, required} from "../../utils/form_validations";

const validate = values => {
  const errors = {};
  if (password(values.password)) {
    errors.password = password(values.password);
  }
  if (required(values.confirmPassword)) {
    errors.confirmPassword = required(values.confirmPassword);
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Password mismatched' ;
  }
  return errors;
};

const ChangePasswordForm = ({t}) => {
  return (
    <Form>
      <Field
        name='password'
        autoFocus
        component={renderInput}
        type='password'
        label={t('NEW_PASSWORD')}
        formItemLayout={{
          labelCol: {span: 10},
          wrapperCol: {span: 14}
        }}
      />
      <Field
        name='confirmPassword'
        component={renderInput}
        type='password'
        label={t('CONFIRM_PASSWORD')}
        formItemLayout={{
          labelCol: {span: 10},
          wrapperCol: {span: 14}
        }}
      />
    </Form>
  )
};

export default reduxForm({ form: 'ChangePasswordForm', validate })(ChangePasswordForm);
