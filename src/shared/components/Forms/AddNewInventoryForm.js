import React from 'react';
import { Form } from 'antd';
import { Field, reduxForm } from 'redux-form';

import {renderCheckbox, renderInput, renderSelect} from '../../utils/form_components';
import {countries} from '../../constants/constants';

const AddNewInventoryForm = props => {

  const { handleSubmit, t } = props;
  return (
    <Form onSubmit={handleSubmit} className="antForm-spaceBetween">

      <Field
        name="inventNumb"
        component={ renderInput }
        type="text"
        placeholder=""
        label={t('INVENT_NUMB')}
        formItemLayout={
          {
            labelCol: { span: 10 },
            wrapperCol: { span: 14 }
          }
        }
      />
      <Field
        name="isInventContinuation"
        component={ renderCheckbox }
        label={ t('IS_INVENT_CONTINUATION') }
        formItemLayout={
          {
            labelCol: { span: 10 },
            wrapperCol: { span: 14 }
          }
        }
      />
      <Field
        name="inventName"
        component={ renderInput }
        type="text"
        placeholder=""
        label={t('INVENT_NAME')}
        formItemLayout={
          {
            labelCol: { span: 10 },
            wrapperCol: { span: 14 }
          }
        }
      />
      <Field
        name="inventType"
        component={ renderSelect }
        data={countries}
        label={t('INVENT_TYPE')}
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
        type="text"
        placeholder=""
        label={t('DBEG')}
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
        type="text"
        placeholder=""
        label={t('DEND')}
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
        data={countries}
        label={t('ACCESS_LEVEL')}
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

export default reduxForm({ form: 'AddNewInventoryForm' })(AddNewInventoryForm);
