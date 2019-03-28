import React from 'react';
import {Form} from 'antd';
import { Field, reduxForm } from 'redux-form';

import { renderInput, renderSelect } from '../../utils/form_components';
import { countries } from '../../constants/constants';

const AddNewDocForm = props => {

  const { handleSubmit, t } = props;
  return (
    <Form onSubmit={handleSubmit} className="antForm-spaceBetween">

      <Field
        name="docNumb"
        component={ renderInput }
        type="text"
        placeholder=""
        label={ t('DOC_NUMB') }
        formItemLayout={
          {
            labelCol: { span: 10 },
            wrapperCol: { span: 14 }
          }
        }
      />
      <Field
        name="docName"
        component={ renderInput }
        type="text"
        placeholder=""
        label={ t('DOC_NAME') }
        formItemLayout={
          {
            labelCol: { span: 10 },
            wrapperCol: { span: 14 }
          }
        }
      />
      <Field
        name="docType"
        component={ renderSelect }
        data={ countries }
        label={ t('DOC_TYPE') }
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
        name="pagesQuantity"
        component={ renderInput }
        type="text"
        placeholder=""
        label={ t('PAGES_QUANTITY') }
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

export default reduxForm({ form: 'AddNewDocForm' })(AddNewDocForm);
