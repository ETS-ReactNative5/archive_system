import React from 'react';
import {Form, Col, Row, Icon} from 'antd';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { renderInput } from '../../utils/form_components';

const EditNSADocCardMovie = props => {
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
          {!!tofiConstants.docContent && <Field
            name="docContent"
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
        <Col md={{ span:10, offset: 1 }} xs={{ span: 20, offset: 1 }}>
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
          {!!tofiConstants.movieType && <Field
            name="movieType"
            component={renderInput}
            readOnly
            label={ tofiConstants.movieType.name[lng] }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />}
          {!!tofiConstants.movieVariant && <Field
            name="movieVariant"
            component={renderInput}
            readOnly
            label={ tofiConstants.movieVariant.name[lng] }
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

EditNSADocCardMovie.propTypes = {
  t: PropTypes.func.isRequired,
  tofiConstants: PropTypes.shape({
    docType: PropTypes.shape(),
    docCase: PropTypes.shape(),
    docDate: PropTypes.shape(),
    docPapers: PropTypes.shape(),
    docContent: PropTypes.shape(),
    eventLocation: PropTypes.shape(),
    docRubric: PropTypes.shape(),
    docLanguage: PropTypes.shape(),
    movieType: PropTypes.shape(),
    movieVariant: PropTypes.shape()
  }).isRequired,
  openDialogBox: PropTypes.func.isRequired
};

export default reduxForm({ form: 'EditNSADocCardMovie' })(EditNSADocCardMovie);
