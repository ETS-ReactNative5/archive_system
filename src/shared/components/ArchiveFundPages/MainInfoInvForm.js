import React, { Component } from 'react';
import {Button, Form} from 'antd';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import {
  renderCheckbox,
  renderDatePicker,
  renderFileUploadBtn,
  renderInput,
  renderInputLang,
  renderSelect,
  renderSelectVirt,
  renderTaggedSelect
} from '../../utils/form_components';
import {connect} from 'react-redux';
import moment from 'moment';
import {getAllObjOfCls, getObjByObjVal, getObjByProp, getObjChildsByConst, getPropVal} from '../../actions/actions';
import {isEqual, pickBy} from 'lodash';
import {required, requiredArr, requiredDate, requiredLabel, requiredLng} from '../../utils/form_validations';

/*eslint eqeqeq:0*/
class MainInfoFundForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      lang: {
        name: localStorage.getItem('i18nextLng'),
      },
      loading: {
        invCaseSystemLoading: false
      }
    };
  }

  changeLang = e => {
    this.setState({lang: {...this.state.lang, [e.target.name]: e.target.value}});
  };

  nameValue = {...this.props.initialValues.name} || {kz: '', ru: '', en: ''};

  onSubmit = values => {
    if(!this.props.initialValues.key) {
      return this.props.onCreateObj(
        {
          ...pickBy(values, (val, key) => !isEqual(val, this.props.initialValues[key])),
          accessLevel: values.accessLevel,
          fundFeature: values.fundFeature,
          invType: values.invType,
          invFund: {value: this.props.initialValues.fundId.split('_')[1]} //selected fond ID
        })
    } else {
      const { name, accessLevel, ...rest } = pickBy(values, (val, key) => !isEqual(val, this.props.initialValues[key]))
      const objData = {};
      if(name) {
        objData.name = name;
        objData.fullName = name;
      }
      if(accessLevel) objData.accessLevel = accessLevel;

      return this.props.onSaveCubeData(rest, this.props.initialValues.key, objData);
    }
  };
  loadClsObj = (cArr, propConsts, dte = moment().format('YYYY-MM-DD')) => {
    return () => {
      cArr.forEach(c => {
        if(!this.props[c + 'Options']) {
          this.setState({loading: { ...this.state.loading ,[c+'Loading']: true }});
          this.props.getAllObjOfCls(c, dte, propConsts)
            .then(() => this.setState({loading: { ...this.state.loading ,[c+'Loading']: false }}))
        }
      })
    }
  };
  loadOptions = c => {
    return () => {
      if(!this.props[c + 'Options']) {
        this.setState({loading: { ...this.state.loading, [c+'Loading']: true }});
        this.props.getPropVal(c)
          .then(() => this.setState({loading: { ...this.state.loading, [c+'Loading']: false }}))
      }
    }
  };
  loadOptionsArr = cArr => {
    return () => {
      cArr.forEach(c => {
        if(!this.props[c + 'Options']) {
          this.setState({loading: { ...this.state.loading ,[c+'Loading']: true }});
          this.props.getPropVal(c)
            .then(() => this.setState({loading: { ...this.state.loading ,[c+'Loading']: false }}))
        }
      });
    }
  };
  loadChilds = (c, props) => {
    return () => {
      if (!this.props[c + 'Options']) {
        this.setState({loading: {...this.state.loading, [c + 'Loading']: true}});
        this.props.getObjChildsByConst(c, props)
          .then(() => this.setState({loading: {...this.state.loading, [c + 'Loading']: false}}))
          .catch(err => console.error(err))
      }
    }
  };

  disabledStartDate = (startValue) => {
    const endValue = this.props.fundDendValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };
  disabledEndDate = (endValue) => {
    const startValue = this.props.fundDbegValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };
  componentDidUpdate(prevProps) {
    if(prevProps.initialValues !== this.props.initialValues) {
      this.nameValue = {...this.props.initialValues.name} || {kz: '', ru: '', en: ''};
    }
  }

  render() {

      if(!this.props.tofiConstants) return null;

    this.lng = localStorage.getItem('i18nextLng');
    const { t, handleSubmit, reset, dirty, error, submitting, fundFeatureOptions,caseStorageMultiOptions,rackMultiOptions,sectionMultiOptions,shelfMultiOptions,
      documentTypeOptions, invTypeOptions, accessLevelOptions, invCaseSystemOptions,
      tofiConstants: {invNumber, invDates, invCaseSystem, documentType, invType, invApprovalDate2, invApprovalDate1,
        invTypeValue, invAgreement2Date, fundFeature, invAgreementDate, invTypePerm, invFile, invStorage, invCont,
        agreementProtocol, agreement2Protocol, approvalProtocol,caseStorageMulti,rackMulti , sectionMulti, shelfMulti}} = this.props;
    const { lang, loading } = this.state;

    return (
      <Form className="antForm-spaceBetween" onSubmit={handleSubmit(this.onSubmit)} style={dirty ? {paddingBottom: '43px'} : {}}>
        {invNumber && <Field
          name='invNumber'
          colon
          component={renderInput}
          label={invNumber.name[this.lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
          validate={required}
        />}
          {invCont && (
          <Field
            name="invCont"
            component={renderCheckbox}
            format={v => !v}
            normalize={v => Number(!v)}
            label={invCont.name[this.lng]}
            formItemLayout={{
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }}
          />
        )}
        <Field
          name="name"
          component={ renderInputLang }
          format={value => (!!value ? value[lang.name] : '')}
          parse={value => { this.nameValue[lang.name] = value; return {...this.nameValue} }}
          label={t('NAME')}
          formItemClass="with-lang"
          changeLang={this.changeLang}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          validate={requiredLng}
          colon={true}
        />
        <Field
          name="accessLevel"
          component={ renderSelect }
          label={t('ACCESS_LEVEL')}
          formItemLayout={{
            labelCol: { span: 10 },
            wrapperCol: { span: 14 }
          }}
          isSearchable={false}
          data={accessLevelOptions ? accessLevelOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
          onMenuOpen={!accessLevelOptions ? this.props.getAccessLevels : undefined}
          colon={true}
          validate={requiredLabel}
        />
        {invType && <Field
          name='invType'
          component={renderSelect}
          label={invType.name[this.lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
          onMenuOpen={this.loadOptions('invType')}
          data={invTypeOptions ? invTypeOptions.map(option => ({
              value: option.id,
              label: option.name[this.lng]
          })) : []}
          colon
          validate={requiredLabel}
        />}
        {documentType && <Field
          name='documentType'
          component={renderSelect}
          label={documentType.name[this.lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
          onMenuOpen={this.loadOptions('documentType')}
          data={documentTypeOptions ? documentTypeOptions.map(option => ({
            value: option.id,
            label: option.name[this.lng]
          })) : []}
          colon
          validate={requiredLabel}
        />}
        {invDates && <Field
          name='invDates'
          component={renderTaggedSelect}
          label={invDates.name[this.lng]}
          format={val => val && val.map(it => it.value || '')}
          parse={val => val && val.map(str => ({value: str, mode: 'ins'}))}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
          colon={true}
          required={requiredArr}
        />}
          {fundFeature && <Field
              name="fundFeature"
              component={renderSelect}
              label={fundFeature.name[this.lng]}
              formItemLayout={{
                  labelCol: {span: 10},
                  wrapperCol: {span: 14}
              }}
              isLoading={loading.fundFeatureLoading}
              data={fundFeatureOptions ? fundFeatureOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
              onMenuOpen={this.loadOptions('fundFeature')}
              validate={requiredLabel}
              colon={true}
          />}
          {caseStorageMulti && <Field
          name="caseStorageMulti"
          component={renderSelect}
          isMulti
          label={caseStorageMulti.name[this.lng]}
          formItemLayout={{
              labelCol: {span: 10},
              wrapperCol: {span: 14}
          }}
          isLoading={loading.caseStorageMultiLoading}
          data={caseStorageMultiOptions ? caseStorageMultiOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
          onMenuOpen={this.loadOptions('caseStorageMulti')}
          />}
          {rackMulti && <Field
              name="rackMulti"
              component={renderSelect}
              isMulti
              label={rackMulti.name[this.lng]}
              formItemLayout={{
                  labelCol: {span: 10},
                  wrapperCol: {span: 14}
              }}
              isLoading={loading.rackMultiLoading}
              data={rackMultiOptions ? rackMultiOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
              onMenuOpen={this.loadOptions('rackMulti')}

          />}
          {sectionMulti && <Field
              name="sectionMulti"
              component={renderSelect}
              isMulti
              label={sectionMulti.name[this.lng]}
              formItemLayout={{
                  labelCol: {span: 10},
                  wrapperCol: {span: 14}
              }}
              isLoading={loading.sectionMultiLoading}
              data={sectionMultiOptions ? sectionMultiOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
              onMenuOpen={this.loadOptions('sectionMulti')}

          />}
          {shelfMulti && <Field
              name="shelfMultii"
              component={renderSelect}
              isMulti
              label={shelfMulti.name[this.lng]}
              formItemLayout={{
                  labelCol: {span: 10},
                  wrapperCol: {span: 14}
              }}
              isLoading={loading.shelfMultiiLoading}
              data={shelfMultiOptions ? shelfMultiOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
              onMenuOpen={this.loadOptions('shelfMulti')}

          />}
        {invCaseSystem && <Field
          name="invCaseSystem"
          component={renderSelect}
          label={invCaseSystem.name[this.lng]}
          formItemLayout={{
            labelCol: {span: 10},
            wrapperCol: {span: 14}
          }}
          isLoading={loading.invCaseSystemLoading}
          data={invCaseSystemOptions ? invCaseSystemOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
          onMenuOpen={this.loadOptions('invCaseSystem')}
          validate={requiredLabel}
          colon={true}
        />}
        {invAgreementDate && <Field
          name='invAgreementDate'
          component={renderDatePicker}
          disabled={!!this.props.initialValues.key}
          format={null}
          label={invAgreementDate.name[this.lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
        />}
        {invAgreement2Date && <Field
          name='invAgreement2Date'
          component={renderDatePicker}
          disabled={!!this.props.initialValues.key}
          format={null}
          label={invAgreement2Date.name[this.lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
        />}
        {invTypeValue && invTypeValue.value == invTypePerm.id && invApprovalDate1 && <Field
          name='invApprovalDate1'
          component={renderDatePicker}
          disabled={!!this.props.initialValues.key}
          format={null}
          label={invApprovalDate1.name[this.lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
        />}
        {invApprovalDate2 && <Field
          name='invApprovalDate2'
          component={renderDatePicker}
          disabled={!!this.props.initialValues.key}
          format={null}
          label={invApprovalDate2.name[this.lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
        />}
        {agreementProtocol && <Field
          name='agreementProtocol'
          component={renderFileUploadBtn}
          label={agreementProtocol.name[this.lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
        />}
        {agreement2Protocol && <Field
          name='agreement2Protocol'
          component={renderFileUploadBtn}
          label={agreement2Protocol.name[this.lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
        />}
        {approvalProtocol && <Field
          name='approvalProtocol'
          component={renderFileUploadBtn}
          label={approvalProtocol.name[this.lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
        />}
        {invFile && <Field
          name='invFile'
          component={renderFileUploadBtn}
          label={invFile.name[this.lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
        />}
        {invStorage && <Field
          name='invStorage'
          component={renderInput}
          disabled
          label={invStorage.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
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
    )
  }
}

const selector = formValueSelector('MainInfoFundForm');

export default connect(state => {
  const invTypeValue = selector(state, 'invType');
  return {
    invTypeValue,
      fundFeatureOptions: state.generalData.fundFeature,
      caseStorageMultiOptions: state.generalData.caseStorageMulti,
      rackMultiOptions: state.generalData.rackMulti,
      sectionMultiOptions: state.generalData.sectionMulti,
      shelfMultiOptions: state.generalData.shelfMulti,
    accessLevelOptions: state.generalData.accessLevel,
    invCaseSystemOptions: state.generalData.invCaseSystem,
    documentTypeOptions: state.generalData.documentType
  }
}, { getAllObjOfCls, getPropVal, getObjByObjVal, getObjChildsByConst })(reduxForm({ form: 'MainInfoFundForm', enableReinitialize: true })(MainInfoFundForm));
