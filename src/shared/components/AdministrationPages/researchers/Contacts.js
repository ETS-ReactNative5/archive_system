import React from "react";
import {Field, reduxForm} from "redux-form";
import { Button, Form } from 'antd';

import {required, requiredEmail} from "../../../utils/form_validations";
import {renderInput} from "../../../utils/form_components";
import {normalizePhone} from '../../../utils/form_normalizing'

const Contacts = props => {

  this.lng = localStorage.getItem('i18nextLng');

  const {handleSubmit, t, tofiConstants: {location},
          dirty, error, submitting, reset, onSubmit,} = props;
  return (
    <Form onSubmit={handleSubmit(onSubmit)} className='antForm-spaceBetween'>
      <Field
        name="phone"
        formItemClass="signup-form__input"
        component={renderInput}
        label={t('PHONE')}
        formItemLayout={{
          labelCol: {span: 10},
          wrapperCol: {span: 14}
        }}
        colon={true}
        validate={required}
        normalize={normalizePhone}
      />
      <Field
        name="login"
        formItemClass="signup-form__input"
        component={renderInput}
        label={t('LOGIN')}
        formItemLayout={{
          labelCol: {span: 10},
          wrapperCol: {span: 14}
        }}
        colon={true}
        validate={required}
      />
      <Field
        name="email"
        formItemClass="signup-form__input"
        component={renderInput}
        label={t('EMAIL')}
        formItemLayout={{
          labelCol: {span: 10},
          wrapperCol: {span: 14}
        }}
        colon={true}
        validate={requiredEmail}
      />
      <Field
        name="location"
        formItemClass="signup-form__input"
        component={renderInput}
        label={location.name[this.lng]}
        formItemLayout={{
          labelCol: {span: 10},
          wrapperCol: {span: 14}
        }}
      />
      {dirty && <Form.Item className="ant-form-btns">
        <Button className="signup-form__btn" type="primary" htmlType="submit" disabled={submitting}>
          {submitting ? t('LOADING...') : t('SAVE')}
        </Button>
        <Button className="signup-form__btn" type="danger" htmlType="button" disabled={submitting}
                style={{marginLeft: '10px'}} onClick={reset}>
          {submitting ? t('LOADING...') : t('CANCEL')}
        </Button>
        {error && <span className="message-error"><i className="icon-error"/>{error}</span>}
      </Form.Item>}
    </Form>
  );
};

export default reduxForm({
  form: "Contacts",
  enableReinitialize: true,
})(Contacts);
