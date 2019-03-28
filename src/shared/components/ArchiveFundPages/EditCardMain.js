import React from 'react';
import { Form, Col, Row, Icon} from 'antd';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';

import {
  renderInput} from '../../utils/form_components';
import { four_digits } from '../../utils/form_normalizing';
import {
  FUND_CATEGORY, FUND_DATE_OF_LAST_CHECK, FUND_DBEG, FUND_DEND, FUND_FIRST_DOC_FLOW, FUND_INDEX,
  FUND_NUMBER, LEGAL_STATUS} from '../../constants/tofiConstants';

let EditCardMain = props => {
  const {
    t,
    exitNoteVal,
    openDialogBox,
    tofiConstants } = props;

  const lng = localStorage.getItem('i18nextLng');

  const addonEdit = (
    <Icon type="edit" onClick={openDialogBox} />
  );

  return (
    <Form className="antForm-spaceBetween">
      <Row>
        <Col md={{ span:10, offset: 1 }} xs={{ span: 20, offset: 1 }}>
          <Field
            name="fundName"
            readOnly
            component={ renderInput }
            label={ t('FUND_NAME') }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name="fundShortName"
            readOnly
            component={ renderInput }
            label={t('FUND_SHORT_NAME')}
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name="fundShortName"
            readOnly
            component={ renderInput }
            label={t('FUND_TYPE')}
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
          />
          <Field
            name='fundNumber'
            readOnly
            component={ renderInput }
            label={ tofiConstants[FUND_NUMBER] ? tofiConstants[FUND_NUMBER].name[lng] : '' }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name='fundIndex'
            readOnly
            component={ renderInput }
            label={ tofiConstants[FUND_INDEX] ? tofiConstants[FUND_INDEX].name[lng] : '' }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name='fundDbeg'
            readOnly
            component={ renderInput }
            label={ tofiConstants[FUND_DBEG] ? tofiConstants[FUND_DBEG].name[lng] : '' }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
            normalize={four_digits}
          />
          <Field
            name='fundDend'
            readOnly
            component={ renderInput }
            label={ tofiConstants[FUND_DEND] ? tofiConstants[FUND_DEND].name[lng] : '' }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
            normalize={four_digits}
          />
          <Field
            name='fundCategory'
            readOnly
            component={ renderInput }
            label={ tofiConstants[FUND_CATEGORY] ? tofiConstants[FUND_CATEGORY].name[lng] : '' }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name='fundFeature'
            readOnly
            component={ renderInput }
            label={ tofiConstants.fundFeature ? tofiConstants.fundFeature.name[lng] : '' }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />
          {Math.random() > .1 && <Field
            name='orgType'
            readOnly
            component={ renderInput }
            label={ tofiConstants[LEGAL_STATUS] ? tofiConstants[LEGAL_STATUS].name[lng] : '' }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}

          /> }
          <Field
            name="accessLevel"
            readOnly
            component={ renderInput}
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
            name="fundExitDate"
            readOnly
            component={ renderInput }
            type="text"
            label={ tofiConstants.fundExitDate ? tofiConstants.fundExitDate.name[lng] : '' }
            // disabled={ !exitNoteVal }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name="fundExitReason"
            readOnly
            component={ renderInput }
            label={ tofiConstants.fundExitReason ? tofiConstants.fundExitReason.name[lng] : '' }
            disabled={ !exitNoteVal }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />
        </Col>
        <Col md={{ span:10, offset: 1 }} xs={{ span: 20, offset: 1 }}>
          {/*<Field
            name="fundSphere"
            readOnly
            component={ renderInput }
            label={ tofiConstants[FUND_SPHERE] ? tofiConstants[FUND_SPHERE].name[lng] : '' }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />*/}
          <Field
            name="fundIndustry"
            readOnly
            component={renderInput}
            label={ tofiConstants['fundIndustry'] ? tofiConstants['fundIndustry'].name[lng] : '' }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name="fundFirstDocFlow"
            readOnly
            component={renderInput}
            label={ tofiConstants[FUND_FIRST_DOC_FLOW] ? tofiConstants[FUND_FIRST_DOC_FLOW].name[lng] : '' }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name="fundDateOfLastCheck"
            readOnly
            component={renderInput}
            label={ tofiConstants[FUND_DATE_OF_LAST_CHECK] ? tofiConstants[FUND_DATE_OF_LAST_CHECK].name[lng] : '' }
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

// export default reduxForm({ form: 'EditCardMain' })(connect(state => ({form: state.form}))(EditCardMain));

EditCardMain = reduxForm({ form: 'EditCardMain', enableReinitialize: true })(EditCardMain);
const selector = formValueSelector('EditCardMain');
EditCardMain = connect(
  state => {
    const exitNoteVal = selector(state, 'fundExitNote');
    // const unitedFundVal = selector(state, 'unitedFund');
    return {
      exitNoteVal,
      tofiConstants: state.generalData.tofiConstants
    }
  }
)(EditCardMain);

export default EditCardMain;
