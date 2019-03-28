import React from 'react';
import { Form } from 'antd';
import { Field, reduxForm } from 'redux-form';

import { required } from '../../utils/form_validations';
import {renderFileUpload, renderInput, renderSelect} from '../../utils/form_components';
import {cities, countries, researchs} from '../../constants/constants';

const AddNewDocForm = props => {

  const { handleSubmit, t } = props;
  return (
    <Form onSubmit={handleSubmit} className="antForm-spaceBetween">
      <Field
        name="lastName"
        className="signup-form__input"
        component={renderInput}
        placeholder={ t('LAST_NAME_PLACEHOLDER') }
        label={ t('LASTNAME') }
        formItemLayout={
          {
            labelCol: {span: 14},
            wrapperCol: {span: 10}
          }
        }
        validate={required}
        colon={true}
      />
      <Field
        name="firstName"
        className="signup-form__input"
        component={renderInput}
        placeholder={ t('FIRST_NAME_PLACEHOLDER') }
        label={ t('FIRSTNAME') }
        formItemLayout={
          {
            labelCol: {span: 14},
            wrapperCol: {span: 10}
          }
        }
        validate={required}
        colon={true}
      />
      <Field
        name="middleName"
        className="signup-form__input"
        component={ renderInput }
        placeholder={ t('MIDDLE_NAME_PLACEHOLDER') }
        label={ t('MIDDLENAME') }
        formItemLayout={
          {
            labelCol: {span: 14},
            wrapperCol: {span: 10}
          }
        }
      />
      <Field
        name="idNumb"
        className="signup-form__input"
        component={renderInput}
        placeholder="111222333"
        label={ t('ID_NUMB') }
        formItemLayout={
          {
            labelCol: {span: 14},
            wrapperCol: {span: 10}
          }
        }
      />
      <Field
        name="Identity"
        component={ renderFileUpload }
        label={ t('IDENTITY') }
        formItemLayout={
          {
            labelCol: {span: 14},
            wrapperCol: {span: 10}
          }
        }
      />
      <Field
        name="Country"
        className="signup-form__input"
        label={ t('COUNTRY') }
        formItemLayout={
          {
            labelCol: {span: 14},
            wrapperCol: {span: 10}
          }
        }
        component={renderSelect}
        placeholder={ t('COUNTRY_PLACEHOLDER') }
        data={countries}
        validate={required}
        colon={true}
      />
      <Field
        name="City"
        className="signup-form__input"
        label={ t('CITY') }
        formItemLayout={
          {
            labelCol: {span: 14},
            wrapperCol: {span: 10}
          }
        }
        component={renderSelect}
        handleSelect={(value) => this.setState({ city: value })}
        data={cities}
        placeholder={ t('CITY_PLACEHOLDER') }
        validate={required}
        colon={true}
      />
      <Field
        name="Research"
        label={ t('RESEARCH') }
        formItemLayout={
          {
            labelCol: {span: 14},
            wrapperCol: {span: 10}
          }
        }
        component={renderSelect}
        handleSelect={(value) => this.setState({ research: value })}
        data={researchs}
        placeholder="Вид исследования"
      />
      <Field
        name="photo"
        label={ t('PHOTO') }
        component={ renderFileUpload }
        formItemLayout={
          {
            labelCol: {span: 14},
            wrapperCol: {span: 10}
          }
        }
      />
      <Field
        name="Address"
        label={ t('ADDRESS') }
        formItemLayout={
          {
            labelCol: {span: 14},
            wrapperCol: {span: 10}
          }
        }
        component={renderInput}
        placeholder="Арай, 53"
      />
      <Field
        name="phone"
        label={ t('PHONE') }
        formItemLayout={
          {
            labelCol: {span: 14},
            wrapperCol: {span: 10}
          }
        }
        component={renderInput}
        placeholder="+7 (XXX)-111-11-11"
        validate={required}
        colon={true}
      />
      <Field
        name="email"
        className="signup-form__input"
        label='email'
        formItemLayout={
          {
            labelCol: {span: 14},
            wrapperCol: {span: 10}
          }
        }
        component={renderInput}
        placeholder="login@email.com"
        validate={required}
        colon={true}
      />
      <Field
        name="login"
        className="signup-form__input"
        component={renderInput}
        placeholder="login@email.com"
        validate={required}
        colon={true}
        label={ t('LOGIN') }
        formItemLayout={
          {
            labelCol: {span: 14},
            wrapperCol: {span: 10}
          }
        }
      />
      <Field
        name="password"
        className="signup-form__input"
        label={ t('PASSWORD') }
        formItemLayout={
          {
            labelCol: {span: 14},
            wrapperCol: {span: 10}
          }
        }
        component={renderInput}
        placeholder={ t('PASSWORD_PLACEHOLDER') }
        validate={required}
        colon={true}
      />
      <Field
        name="confirmPassword"
        className="signup-form__input"
        label={ t('CONFIRM_PASSWORD') }
        formItemLayout={
          {
            labelCol: {span: 14},
            wrapperCol: {span: 10}
          }
        }
        component={renderInput}
        validate={required}
        colon={true}
      />
    </Form>
  )
};

export default reduxForm({ form: 'AddNewDocForm' })(AddNewDocForm);
