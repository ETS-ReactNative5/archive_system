import React from 'react';
import { Form, Col } from 'antd';
import { Field, reduxForm } from 'redux-form';

import { renderInput, renderSelect, renderCheckboxGroup, renderTextarea } from '../../utils/form_components';
import { countries } from '../../constants/constants';

const ViewCardDocumentsMain = props => {
  const { t } = props;
  return (

    <Form className="antForm-spaceBetween">
      <Col md={{ span:10, offset: 1 }} xs={{ span: 20, offset: 1 }}>
        <Field
          name="docNumb"
          component={ renderInput }
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
          name="dbeg"
          component={ renderInput }
          type="date"
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
        <Field
          name="pagesQuantity"
          component={ renderInput }
          label={ t('PAGES_QUANTITY') }
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
        <Field
          name="docNote"
          component={ renderTextarea }
          label={ t('DOC_NOTE') }
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
        <Field
          name="docLang"
          component={ renderSelect }
          data={ countries }
          label={ t('DOC_LANG') }
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
        <Field
          name="docAuthor"
          component={ renderInput }
          label={ t('DOC_AUTHOR') }
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
        />
        <Field
          name="geoIndex"
          component={ renderSelect }
          data={ countries }
          label={ t('GEO_INDEX') }
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
        />
        <Field
          name="keywords"
          component={ renderTextarea }
          label={ t('KEYWORDS') }
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
      </Col>
      <Col md={{ span:10, offset: 1 }} xs={{ span: 20, offset: 1 }}>
        <Field
          name="docProps"
          component={ renderCheckboxGroup }
          data={
            [
              { value: 'valuableCase', label: t('VALUABLE_DOC') },
              { value: 'inInsuranceFund', label: t('IN_INSURANCE_FUND') },
              { value: 'inUseFund', label: t('IN_USE_FUND') }
            ]
          }
        />
        <Field
          name="eventDate"
          component={ renderInput }
          type="date"
          label={ t('EVENT_DATE') }
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
        />
        <Field
          name="eventPlace"
          component={ renderSelect }
          label={ t('EVENT_PLACE') }
          data={ countries }
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
        />
        <Field
          name="personalities"
          component={ renderSelect }
          label={ t('PERSONALITIES') }
          data={ countries }
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
        />
        <Field
          name="reprodMethod"
          component={ renderSelect }
          label={ t('REPROD_METHOD') }
          data={ countries }
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
        />
        <Field
          name="headings"
          component={ renderSelect }
          label={ t('HEADINGS') }
          data={ countries }
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
        />
      </Col>
    </Form>
  )
};

export default reduxForm({ form: 'ViewCardDocumentsMain' })(ViewCardDocumentsMain);
