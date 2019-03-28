import React from 'react';
import { Form, Col } from 'antd';
import { Field, reduxForm } from 'redux-form';

import {renderCheckboxWithInput, renderCheckbox} from '../../utils/form_components';

const ViewCardCasesState = props => {
  const {
    tofiConstants: { requiresDisinfection, requiresDisinfestation, requiresBindingAndFiling,
      irreparablyDamaged, requiresRenumbering, requiresCoverReplacement, requiresRestoration,
      requiresRestorationOfFadingText, requiresTranslation }
  } = props;

  const lng = localStorage.getItem('i18nextLng');

  return (
    <Form className="antForm-spaceBetween">
      <Col md={{ span:10, offset: 1 }} xs={{ span: 20, offset: 1 }}>
        {/*<Field
          name="caseStateBool"
          component={ renderCheckboxGroup }
          data={
            [
              { value: 'needDisinfection', label: t('NEED_DISINFECTION') },
              { value: 'needDisinfestation', label: t('NEED_DISINFESTATION') },
              { value: 'needBinding', label: t('NEED_BINDING') },
              { value: 'irreparablyDamaged', label: t('ERREPAREBLY_DAMAGED') },
              { value: 'needRenumbering', label: t('NEED_RENUMBERING') },
              { value: 'needCoverReplacement', label: t('NEED_COVER_REPLACEMENT') }
            ]
          }
        />*/}
        <Field
          name="requiresDisinfection"
          component={ renderCheckbox }
          label={ requiresDisinfection.name[lng] }
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
        <Field
          name="requiresDisinfestation"
          component={ renderCheckbox }
          label={ requiresDisinfestation.name[lng] }
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
        <Field
          name="requiresBindingAndFiling"
          component={ renderCheckbox }
          label={ requiresBindingAndFiling.name[lng] }
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
        <Field
          name="irreparablyDamaged"
          component={ renderCheckbox }
          label={ irreparablyDamaged.name[lng] }
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
        <Field
          name="requiresRenumbering"
          component={ renderCheckbox }
          label={ requiresRenumbering.name[lng] }
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
        <Field
          name="requiresCoverReplacement"
          component={ renderCheckbox }
          label={ requiresCoverReplacement.name[lng] }
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
          name="requiresRestoration"
          component={ renderCheckboxWithInput }
          type="number"
          label={ requiresRestoration.name[lng] }
          formItemClass="checkbox-input"
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
        <Field
          name="requiresRestorationOfFadingText"
          component={ renderCheckboxWithInput }
          type="number"
          label={ requiresRestorationOfFadingText.name[lng] }
          formItemClass="checkbox-input"
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
        <Field
          name="requiresTranslation"
          component={ renderCheckboxWithInput }
          type="number"
          label={ requiresTranslation.name[lng] }
          formItemClass="checkbox-input"
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
      </Col>
    </Form>
  )
};

export default reduxForm({ form: 'ViewCardCasesState' })(ViewCardCasesState);
