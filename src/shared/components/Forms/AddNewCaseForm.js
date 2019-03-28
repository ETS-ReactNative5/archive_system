import React from 'react';
import {Form} from 'antd';
import { Field, reduxForm } from 'redux-form';

import { renderInput, renderSelect } from '../../utils/form_components';
import { countries } from '../../constants/constants';

const AddNewCaseForm = props => {

  const { handleSubmit, t } = props;
  return (
    <Form onSubmit={handleSubmit} className="antForm-spaceBetween">

      <Field
        name="caseNumb"
        component={ renderInput }
        type="text"
        placeholder=""
        label={ t('CASE_NUMB') }
        formItemLayout={
          {
            labelCol: { span: 10 },
            wrapperCol: { span: 14 }
          }
        }
      />
      <Field
        name="caseName"
        component={ renderInput }
        type="text"
        placeholder=""
        label={ t('CASE_NAME') }
        formItemLayout={
          {
            labelCol: { span: 10 },
            wrapperCol: { span: 14 }
          }
        }
      />
      <Field
        name="dbeg"
        component={ renderInput }
        type="date"
        placeholder=""
        label={ t('DBEG') }
        formItemLayout={
          {
            labelCol: { span: 10 },
            wrapperCol: { span: 14 }
          }
        }
      />
      <Field
        name="dend"
        component={ renderInput }
        type="date"
        placeholder=""
        label={ t('DEND') }
        formItemLayout={
          {
            labelCol: { span: 10 },
            wrapperCol: { span: 14 }
          }
        }
      />
      <Field
        name="accessLevel"
        component={ renderSelect }
        data={ countries }
        label={ t('ACCESS_LEVEL') }
        formItemLayout={
          {
            labelCol: { span: 10 },
            wrapperCol: { span: 14 }
          }
        }
      />
    </Form>
  )
};

export default reduxForm({ form: 'AddNewCaseForm' })(AddNewCaseForm);
