import React from 'react';
import {Button, Form} from 'antd';
import {Field, formValueSelector, reduxForm} from 'redux-form';
import moment from 'moment';

import {
  renderDatePicker,
  renderFileUploadBtn,
  renderInput,
  renderSelect,
  renderTaggedSelect
} from '../../../../utils/form_components';
import {required, requiredArr, requiredLabel} from '../../../../utils/form_validations';
import {SYSTEM_LANG_ARRAY} from '../../../../constants/constants';
import {CUBE_FOR_AF_INV, DO_FOR_INV, DP_FOR_INV} from '../../../../constants/tofiConstants';
import {connect} from 'react-redux';
import {isEqual, pickBy} from "lodash";

class LegalEntitiesInventoryProps extends React.Component {

  handleFormSubmit = ({name, accessLevel, ...rest}) => {
    const nameLng = {};
    SYSTEM_LANG_ARRAY.forEach(lang => {
      nameLng[lang] = name;
    });
    const obj = {
      name: nameLng,
      fullName: nameLng,
      clsConst: 'invList',
      accessLevel: String(accessLevel.value)
    };
    const cube = {
      cubeSConst: CUBE_FOR_AF_INV,
      doConst: DO_FOR_INV,
      dpConst: DP_FOR_INV
    };
    if(!this.props.initialValues.key) {
      const { agreementProtocol, agreement2Protocol, approvalProtocol, ...values } = rest;
      return this.props.createNewObj(
        {obj, cube},
        {
          values: {
            ...values,
            fundFeature: String(this.props.tofiConstants.notIncluded.id),
            invFund: this.props.record.key.split('_')[1],
            expert: String(this.props.user.obj),
            nomenLastChangeDate: moment().format('YYYY-MM-DD')
          },
          oFiles: {agreementProtocol, agreement2Protocol, approvalProtocol}
        });
    } else {
      const objData = {};
      if(name && name !== this.props.initialValues.name) {
        objData.name = nameLng;
        objData.fullName = nameLng;
      }
      if(accessLevel && accessLevel !== this.props.initialValues.accessLevel) objData.accessLevel = String(accessLevel.value);
      obj.doItem = this.props.initialValues.key;
      const { agreementProtocol, agreement2Protocol, approvalProtocol, ...values } = pickBy(rest, (val, key) => !isEqual(val, this.props.initialValues[key]));
      return this.props.saveProps(
        {
          obj,
          cube: {
            cubeSConst: CUBE_FOR_AF_INV,
            doConst: DO_FOR_INV,
            dpConst: DP_FOR_INV
          }
        },
        {values, oFiles: { agreementProtocol, agreement2Protocol, approvalProtocol }},
        this.props.tofiConstants,
        objData
      )
    }
  };

  invTypeDocTypeMap = {
    [this.props.tofiConstants.invTypePerm.id]: ["uprDoc", "uprNTD"],
    [this.props.tofiConstants.invTypeVideo.id]: ['videoDoc'],
    [this.props.tofiConstants.invTypeMovie.id]: ['movieDoc'],
    [this.props.tofiConstants.invTypePhonoGram.id]: ['phonoDoc'],
    [this.props.tofiConstants.invTypePhonoMag.id]: ['phonoDoc'],
    [this.props.tofiConstants.invTypeAlbum.id]: ['photoDoc'],
    [this.props.tofiConstants.invTypePhoto.id]: ['photoDoc'],
    [this.props.tofiConstants.invTypeDigital.id]: ['uprDoc'],
    [this.props.tofiConstants.invTypeLS.id]: ['LSDoc']
  };

  render() {
    const {
      tofiConstants, lng, submitting, error, reset, dirty, accessLevelOptions,
      t, handleSubmit, loadOptions, getNomenOptions, nomenOptions,
      invTypeOptions, invCaseSystemOptions, invTypeValue, documentTypeOptions
    } = this.props;

    const {
      invNumber, invType, invCaseSystem, invNomen, casesQuantity, invTypePerm, approvalProtocol, agreementProtocol, fundNumberOfCases,
      invDeadline, invApprovalDate1, invApprovalDate2, invAgreementDate, lastChangeDate, invDates, documentType, expert, invAgreement2Date, agreement2Protocol
    } = tofiConstants;

    return (
      <Form className="antForm-spaceBetween" onSubmit={handleSubmit(this.handleFormSubmit)}>
        {invNumber && <Field
          name='invNumber'
          colon
          component={renderInput}
          label={invNumber.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 12},
              wrapperCol: {span: 12}
            }
          }
          validate={required}
        />}
        <Field
          name='name'
          component={renderInput}
          label={t('NAME')}
          formItemLayout={
            {
              labelCol: {span: 12},
              wrapperCol: {span: 12}
            }
          }
          colon
          validate={required}
        />
        <Field
          name="accessLevel"
          component={ renderSelect }
          label={t('ACCESS_LEVEL')}
          formItemLayout={
            {
              labelCol: { span: 12 },
              wrapperCol: { span: 12 }
            }
          }
          isSearchable={false}
          data={accessLevelOptions ? accessLevelOptions.map(option => ({value: option.id, label: option.name[lng]})) : []}
          onMenuOpen={!accessLevelOptions ? this.props.getAccessLevels : undefined}
          colon={true}
          validate={requiredLabel}
        />
        {invType && <Field
          name='invType'
          component={renderSelect}
          label={invType.name[lng]}
          disabled={!!this.props.initialValues.key}
          formItemLayout={
            {
              labelCol: {span: 12},
              wrapperCol: {span: 12}
            }
          }
          onMenuOpen={loadOptions('invType')}
          data={invTypeOptions ? invTypeOptions.map(option => ({value: option.id, label: option.name[lng]})) : []}
          colon
          validate={requiredLabel}
        />}
        {documentType && <Field
          name='documentType'
          component={renderSelect}
          disabled={!invTypeValue || !!this.props.initialValues.key}
          label={documentType.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 12},
              wrapperCol: {span: 12}
            }
          }
          onMenuOpen={loadOptions('documentType')}
          data={invTypeValue && documentTypeOptions
            ?
            documentTypeOptions
              .filter(o => this.invTypeDocTypeMap[invTypeValue.value] &&
                this.invTypeDocTypeMap[invTypeValue.value]
                  .some(c => tofiConstants[c].id == o.id) )
              .map(option => ({
                value: option.id,
                label: option.name[lng]
              })) :
            []
          }
          colon
          validate={requiredLabel}
        />}
        {fundNumberOfCases && <Field
          name='fundNumberOfCases'
          disabled
          component={renderInput}
          label={fundNumberOfCases.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 12},
              wrapperCol: {span: 12}
            }
          }
        />}
        {invDates && <Field
          name='invDates'
          component={renderTaggedSelect}
          label={invDates.name[lng]}
          format={val => val && val.map(it => it.value || '')}
          parse={val => val && val.map(str => ({value: str, mode: 'ins'}))}
          formItemLayout={
            {
              labelCol: {span: 12},
              wrapperCol: {span: 12}
            }
          }
          validate={requiredArr}
          colon={true}
        />}
        {invNomen && <Field
          name='invNomen'
          component={renderSelect}
          isMulti
          label={invNomen.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 12},
              wrapperCol: {span: 12}
            }
          }
          onMenuOpen={getNomenOptions}
          data={nomenOptions}
          colon
          validate={requiredArr}
        />}
        {invCaseSystem && <Field
          name='invCaseSystem'
          component={renderSelect}
          label={invCaseSystem.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 12},
              wrapperCol: {span: 12}
            }
          }
          onMenuOpen={loadOptions('invCaseSystem')}
          data={invCaseSystemOptions ? invCaseSystemOptions.map(option => ({
            value: option.id,
            label: option.name[lng]
          })) : []}
        />}
        {casesQuantity && <Field
          name='casesQuantity'
          component={renderInput}
          label={casesQuantity.name[lng]}
          type="number"
          formItemLayout={
            {
              labelCol: {span: 12},
              wrapperCol: {span: 12}
            }
          }
        />}
        {invDeadline && <Field
          name='invDeadline'
          component={renderDatePicker}
          format={null}
          label={invDeadline.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 12},
              wrapperCol: {span: 12}
            }
          }
        />}
        {invAgreementDate && <Field
          name='invAgreementDate'
          component={renderDatePicker}
          format={null}
          label={invAgreementDate.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 12},
              wrapperCol: {span: 12}
            }
          }
        />}
        {invAgreement2Date && <Field
          name='invAgreement2Date'
          component={renderDatePicker}
          format={null}
          label={invAgreement2Date.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 12},
              wrapperCol: {span: 12}
            }
          }
        />}
        {invTypeValue && invTypeValue.value == invTypePerm.id && invApprovalDate1 && <Field
          name='invApprovalDate1'
          component={renderDatePicker}
          format={null}
          label={invApprovalDate1.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 12},
              wrapperCol: {span: 12}
            }
          }
        />}
        {invApprovalDate2 && <Field
          name='invApprovalDate2'
          component={renderDatePicker}
          format={null}
          label={invApprovalDate2.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 12},
              wrapperCol: {span: 12}
            }
          }
        />}
        {lastChangeDate && <Field
          name='lastChangeDate'
          component={renderDatePicker}
          format={null}
          label={lastChangeDate.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 12},
              wrapperCol: {span: 12}
            }
          }
        />}
        {agreementProtocol && <Field
          name='agreementProtocol'
          component={renderFileUploadBtn}
          label={agreementProtocol.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 12},
              wrapperCol: {span: 12}
            }
          }
        />}
        {agreement2Protocol && <Field
          name='agreement2Protocol'
          component={renderFileUploadBtn}
          label={agreement2Protocol.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 12},
              wrapperCol: {span: 12}
            }
          }
        />}
        {approvalProtocol && <Field
          name='approvalProtocol'
          component={renderFileUploadBtn}
          label={approvalProtocol.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 12},
              wrapperCol: {span: 12}
            }
          }
        />}
        { dirty && <Form.Item className="ant-form-btns">
          <Button className="signup-form__btn" type="primary" htmlType="submit" disabled={submitting}>
            {submitting ? t('LOADING...') : t('SAVE')}
          </Button>
          <Button className="signup-form__btn" type="danger" htmlType="button" disabled={submitting}
                  style={{marginLeft: '10px'}} onClick={reset}>
            {submitting ? t('LOADING...') : t('CANCEL')}
          </Button>
          {error && <span className="message-error"><i className="icon-error"/>{error}</span>}
        </Form.Item> }
      </Form>
    );
  }
};

const selector = formValueSelector('LegalEntitiesInventoryProps');

export default connect(state => {
  const invTypeValue = selector(state, 'invType');
  return {
    invTypeValue,
    accessLevelOptions: state.generalData.accessLevel
  };
})(reduxForm({ form: 'LegalEntitiesInventoryProps', enableReinitialize: true })(LegalEntitiesInventoryProps));