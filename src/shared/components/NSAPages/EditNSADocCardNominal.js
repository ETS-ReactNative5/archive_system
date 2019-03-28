import React from 'react';
import {Form, Col, Row, Icon} from 'antd';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { renderInput } from '../../utils/form_components';

const EditNSADocCardNominal = props => {
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
            name="docDate"
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
            name="docPapers"
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
          {!!tofiConstants.fullName && <Field
            name="fullName"
            component={renderInput}
            readOnly
            label={ tofiConstants.fullName.name[lng] }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />}
          {!!tofiConstants.name && <Field
            name="name"
            component={renderInput}
            readOnly
            label={ tofiConstants.name.name[lng] }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />}
          {!!tofiConstants.patronymic && <Field
            name="patronymic"
            component={renderInput}
            readOnly
            label={ tofiConstants.patronymic.name[lng] }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />}
          {!!tofiConstants.personPublicPosition && <Field
            name="personPublicPosition"
            component={renderInput}
            readOnly
            label={ tofiConstants.personPublicPosition.name[lng] }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />}
          {!!tofiConstants.eventLocation && <Field
            name="eventLocation"
            component={renderInput}
            readOnly
            label={ tofiConstants.eventLocation.name[lng] }
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
          {!!tofiConstants.docLanguage && <Field
            name="docLanguage"
            component={renderInput}
            readOnly
            label={ tofiConstants.docLanguage.name[lng] }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />}
          {!!tofiConstants.docPlaybackMethod && <Field
            name="docPlaybackMethod"
            component={renderInput}
            readOnly
            label={ tofiConstants.docPlaybackMethod.name[lng] }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />}
          {!!tofiConstants.docContent && <Field
            name="caseNotes"
            component={ renderInput}
            readOnly
            label={ tofiConstants.docContent.name[lng] }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />}
        </Col>
      </Row>
    </Form>
  )
};

EditNSADocCardNominal.propTypes = {
  t: PropTypes.func.isRequired,
  tofiConstants: PropTypes.shape({
    docType: PropTypes.shape(),
    docCase: PropTypes.shape(),
    docDate: PropTypes.shape(),
    docPapers: PropTypes.shape(),
    fullName: PropTypes.shape(),
    name: PropTypes.shape(),
    patronymic:PropTypes.shape(),
    personPublicPosition: PropTypes.shape(),
    eventLocation: PropTypes.shape(),
    docLanguage: PropTypes.shape(),
    docPlaybackMethod: PropTypes.shape(),
    movieVariant: PropTypes.shape(),
    docContent: PropTypes.shape(),
  }).isRequired,
  openDialogBox: PropTypes.func.isRequired
};

export default reduxForm({ form: 'EditNSADocCardNominal' })(EditNSADocCardNominal);
