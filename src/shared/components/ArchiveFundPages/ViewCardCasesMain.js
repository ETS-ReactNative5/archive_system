import React from 'react';
import {Form, Col, Row, Icon} from 'antd';
import { Field, reduxForm } from 'redux-form';

import { renderInput, renderCheckboxGroup } from '../../utils/form_components';

const ViewCardCasesMain = props => {
  const { t, openDialogBox, tofiConstants: { fundNumber, caseNumberOfPages, caseNumberOfDocs, irreparablyDamaged, caseFundOfUse, caseInsurance, caseOCD,
    caseDbeg, caseDend, caseNotes, caseStatus, caseDateOfDeposit, caseBarcode, caseStructuralSubdivision, caseDocsLang } } = props;

  const addonEdit = (
    <Icon type="edit" onClick={openDialogBox} />
  );

  const lng = localStorage.getItem('i18nextLng');

  return (

    <Form className="antForm-spaceBetween">
      <Row>
        <Col md={{ span:10, offset: 1 }} xs={{ span: 20, offset: 1 }}>
          <Field
            name="fundNumber"
            component={ renderInput }
            readOnly
            label={ fundNumber.name[lng] }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name="caseName"
            component={ renderInput }
            readOnly
            label={ t('CASE_NAME') }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name="caseDbeg"
            component={ renderInput }
            readOnly
            label={ caseDbeg.name[lng] }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name="caseDend"
            component={ renderInput }
            readOnly
            label={ caseDend.name[lng] }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name="accessLevel"
            component={ renderInput }
            readOnly
            label={ t('ACCESS_LEVEL') }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name="caseNumberOfPages"
            component={ renderInput }
            readOnly
            label={ caseNumberOfPages.name[lng] }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name="caseNumberOfDocs"
            component={ renderInput }
            readOnly
            label={ caseNumberOfDocs.name[lng] }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name="caseNotes"
            component={ renderInput}
            readOnly
            label={ caseNotes.name[lng] }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name="caseStatus"
            component={ renderInput }
            readOnly
            label={ caseStatus.name[lng] }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name="caseDateOfDeposit"
            component={ renderInput }
            readOnly
            label={ caseDateOfDeposit.name[lng] }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name="caseStructuralSubdivision"
            component={ renderInput }
            readOnly
            label={ caseStructuralSubdivision.name[lng] }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name="caseDocsLang"
            component={ renderInput }
            readOnly
            label={ caseDocsLang.name[lng] }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />
        </Col>
        <Col md={{ span:10, offset: 1 }} xs={{ span: 20, offset: 1 }}>
          <Field
            name="caseProps"
            component={ renderCheckboxGroup }
            data={
              [
                { value: caseOCD.id, label: caseOCD.name[lng] },
                { value: caseInsurance.id, label: caseInsurance.name[lng] },
                { value: caseFundOfUse.id, label: caseFundOfUse.name[lng] },
                { value: irreparablyDamaged.id, label: irreparablyDamaged.name[lng] }
              ]
            }
            addonAfter={addonEdit}
          />
          <Form.Item>{ t('CASE_LOCATION') + ': ' }</Form.Item>
          <Field
            name="repository"
            component={renderInput}
            readOnly
            label={ t('REPOSITORY') }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name="rack"
            component={renderInput}
            readOnly
            label={ t('RACK') }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name="shelf"
            component={renderInput}
            readOnly
            label={ t('SHELF') }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name="caseBarcode"
            component={renderInput}
            readOnly
            label={ caseBarcode.name[lng] }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />
        </Col>
      </Row>
    </Form>
  )
};

export default reduxForm({ form: 'ViewCardCasesMain' })(ViewCardCasesMain);
