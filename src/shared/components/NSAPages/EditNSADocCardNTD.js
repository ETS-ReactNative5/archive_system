import React from 'react';
import {Form, Col, Row, Icon} from 'antd';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { renderInput } from '../../utils/form_components';

const EditNSADocCardNTD = props => {
  const { t, openDialogBox, tofiConstants } = props;

  const addonEdit = (
    <Icon type="edit" onClick={openDialogBox} />
  );

  const lng = localStorage.getItem('i18nextLng');

  return (
    !!tofiConstants && <Form className="antForm-spaceBetween EditNSADocCard">
      <Row>
        <Col md={{ span:10, offset: 1 }} xs={{ span: 20, offset: 1 }}>
          <Field
            name="docName"
            component={ renderInput }
            readOnly
            label={ t('DOC_NAME') }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />
          {!!tofiConstants.docType && <Field
            name="docType"
            component={ renderInput }
            readOnly
            label={ tofiConstants.docType.name[lng] }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />}
          <Field
            name="fund"
            component={ renderInput }
            readOnly
            label={ t('FUND') }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name="inventory"
            component={ renderInput }
            readOnly
            label={ t('INVENTORY') }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />
          {!!tofiConstants.docCase && <Field
            name="docCase"
            component={ renderInput }
            readOnly
            label={ tofiConstants.docCase.name[lng] }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />}
          {!!tofiConstants.docDate && <Field
            name="caseNumberOfPages"
            component={ renderInput }
            readOnly
            label={ tofiConstants.docDate.name[lng] }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />}
          {!!tofiConstants.docPapers && <Field
            name="caseNumberOfPages"
            component={ renderInput }
            readOnly
            label={ tofiConstants.docPapers.name[lng] }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />}
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
            name="fio"
            component={ renderInput }
            readOnly
            label={ t('FIO') }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name="orgName"
            component={ renderInput }
            readOnly
            label={ t('ORG_NAME') }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />
          {!!tofiConstants.NTDClassifier && <Field
            name="caseNotes"
            component={ renderInput}
            readOnly
            label={ tofiConstants.NTDClassifier.name[lng] }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />}
          {!!tofiConstants.docRubric && <Field
            name="docRubric"
            component={renderInput}
            readOnly
            label={ tofiConstants.docRubric.name[lng] }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />}
        </Col>
        <Col md={{ span:10, offset: 1 }} xs={{ span: 20, offset: 1 }}>
          {!!tofiConstants.complexName && <Field
            name="complexName"
            component={renderInput}
            readOnly
            label={ tofiConstants.complexName.name[lng] }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />}
          {!!tofiConstants.projectName && <Field
            name="projectName"
            component={renderInput}
            readOnly
            label={ tofiConstants.projectName.name[lng] }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />}
          {!!tofiConstants.projectPartName && <Field
            name="projectPartName"
            component={renderInput}
            readOnly
            label={ tofiConstants.projectPartName.name[lng] }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />}
          {!!tofiConstants.drawingName && <Field
            name="drawingName"
            component={renderInput}
            readOnly
            label={ tofiConstants.drawingName.name[lng] }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />}
          {!!tofiConstants.objectLocation && <Field
            name="objectLocation"
            component={renderInput}
            readOnly
            label={ tofiConstants.objectLocation.name[lng] }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />}
        </Col>
      </Row>
    </Form>
  )
};

EditNSADocCardNTD.propTypes = {
  t: PropTypes.func.isRequired,
  tofiConstants: PropTypes.shape({
    docType: PropTypes.shape(),
    docCase: PropTypes.shape(),
    docDate: PropTypes.shape(),
    NTDClassifier: PropTypes.shape(),
    docRubric: PropTypes.shape(),
    complexName: PropTypes.shape(),
    projectName: PropTypes.shape(),
    projectPartName: PropTypes.shape(),
    drawingName: PropTypes.shape(),
    objectLocation: PropTypes.shape()
  }).isRequired,
  openDialogBox: PropTypes.func.isRequired
};

export default reduxForm({ form: 'EditNSADocCardNTD' })(EditNSADocCardNTD);
