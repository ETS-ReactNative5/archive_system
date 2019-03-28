import React from 'react';
import {Form} from 'antd';
import { Field, reduxForm } from 'redux-form';

import {renderFileUpload, renderInput} from '../../utils/form_components';

const AddNewActForm = props => {

    const { handleSubmit, t } = props;
    return (
      <Form onSubmit={handleSubmit} className="antForm-spaceBetween">

        <Field
          name="actNumb"
          component={ renderInput }
          type="text"
          placeholder=""
          label={t('ACT_NAME')}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
        <Field
          name="actName"
          component={ renderInput }
          type="text"
          placeholder=""
          label={t('ACT_NUMB')}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
        <Field
          name="actDate"
          component={ renderInput }
          type="data"
          placeholder=""
          label={t('ACT_DATE')}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
        <Field
          name="actEView"
          component={ renderFileUpload }
          label={t('ACT_E_VIEW')}
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

export default reduxForm({ form: 'AddNewActForm' })(AddNewActForm);
