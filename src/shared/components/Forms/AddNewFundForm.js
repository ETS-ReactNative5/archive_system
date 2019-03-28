import React, { Component } from 'react';
import { Form } from 'antd';
import {Field, formValueSelector, reduxForm} from 'redux-form';
import {required, requiredLabel, requiredLng} from '../../utils/form_validations';
import { renderDatePicker, renderInput, renderInputLang, renderSelect, renderSelectVirt } from '../../utils/form_components';
import {getPropValByConst, getAccessLevels, getAllObjOfCls, getPropVal} from '../../actions/actions';
import {connect} from 'react-redux';
import moment from 'moment';

/*eslint eqeqeq:0*/
class AddNewFundForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      fundCategory: '',
      accessLevel: '',
      lng: {
        fundName: localStorage.getItem('i18nextLng'),
        fundShortName: localStorage.getItem('i18nextLng')
      },
      loading: {
        fundmakerOrgLoading: false,
        fundmakerLPLoading: false
      }
    };
  }

  getCategories = () => {
    return getPropValByConst('fundCategory')
      .then(json=>({
        options: json.data.map(item => (
          {value: item.id, label: item.name[localStorage.getItem('i18nextLng')]})
        )})
      )
  };

  getFundMakers = () => {
    return getPropValByConst('fundMaker')
      .then(json=>({
        options: json.data.map(item => (
          {value: item.id, label: item.name[localStorage.getItem('i18nextLng')]})
        )})
      )
  };

  getAccessLevels = () => {
    return getAccessLevels()
      .then(json=>({
        options: json.map(item => (
          {value: item.id, label: item.name[localStorage.getItem('i18nextLng')]})
        )})
      )
  };

  changeLang = e => {
    this.setState({lng: {...this.state.lng, [e.target.name]: e.target.value}});
  };

  loadClsObj = (cArr, dte = moment().format('YYYY-MM-DD')) => {
    return () => {
      cArr.forEach(c => {
        if(!this.props[c + 'Options']) {
          this.setState({loading: { ...this.state.loading ,[c+'Loading']: true }});
          this.props.getAllObjOfCls(c, dte)
            .then(() => this.setState({loading: { ...this.state.loading ,[c+'Loading']: false }}))
        }
      })
    }
  };
  loadOptions = c => {
    return () => {
      if(!this.props[c + 'Options']) {
        this.setState({loading: { ...this.state.loading ,[c+'Loading']: true }});
        this.props.getPropVal(c)
          .then(() => this.setState({loading: { ...this.state.loading ,[c+'Loading']: false }}))
      }
    }
  };

  fundName = {kz: '', ru: '', en: ''};
  fundShortName = {kz: '', ru: '', en: ''};

  render() {
    const { t, clsFundConstValue, fundmakerOrgOptions, fundmakerLPOptions, fundFeatureOptions, accessLevelOptions, fundIndustryOptions,
      tofiConstants: {fundFeature, fundCategory, fundIndex, fundNumber, fundIndustry} } = this.props;
    const { lng: {fundName, fundShortName} } = this.state;
    this.lng = localStorage.getItem('i18nextLng');

    return (
      <Form className="antForm-spaceBetween">
        <Field
          name="clsFundConst"
          component={ renderSelect }
          data={['fundOrg','fundLP','collectionOrg','collectionLP','jointOrg','jointLP'].map(c =>
            ({value: this.props.tofiConstants[c].id, label: this.props.tofiConstants[c].name[this.lng]})
          )}
          label={t('FUND_TYPE')+':'}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
        <Field
          name="fundName"
          component={ renderInputLang }
          format={value => (!!value ? value[fundName] : '')}
          parse={value => { this.fundName[fundName] = value; return {...this.fundName} }}
          label={t('FUND_NAME')}
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
          name="fundShortName"
          component={ renderInputLang }
          format={value => (!!value ? value[fundShortName] : '')}
          parse={value => { this.fundShortName[fundShortName] = value; return {...this.fundShortName} }}
          formItemClass="with-lang"
          label={t('FUND_SHORT_NAME')}
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
          name="fundNumber"
          component={ renderInput }
          label={fundNumber.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          validate={required}
          colon={true}
        />
        <Field
          name="fundIndex"
          component={ renderInput }
          type="text"
          placeholder=""
          label={fundIndex.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
        {
          clsFundConstValue && ['fundOrg','collectionOrg','jointOrg'].some(c => this.props.tofiConstants[c].id == clsFundConstValue.value) ?
            <Field
              name="fundMaker"
              component={ renderSelectVirt }
              isMulti={clsFundConstValue && clsFundConstValue.value != this.props.tofiConstants.fundOrg.id}
              optionHeight={40}
              label={t('FUND_MAKER')}
              isLoading={this.state.fundmakerOrgLoading}
              onMenuOpen={this.loadClsObj(['fundmakerOrg'])}
              options={fundmakerOrgOptions ? fundmakerOrgOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : [] }
              formItemLayout={
                {
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }
              }
              validate={requiredLabel}
              colon={true}
            /> :
            <Field
              name="fundMaker"
              component={ renderSelect }
              isMulti={clsFundConstValue && clsFundConstValue.value != this.props.tofiConstants.fundLP.id}
              label={t('FUND_MAKER')}
              isLoading={this.state.fundmakerLPLoading}
              onMenuOpen={this.loadClsObj(['fundmakerLP'])}
              data={ fundmakerLPOptions ? fundmakerLPOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : [] }
              formItemLayout={
                {
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }
              }
              validate={requiredLabel}
              colon={true}
            />
        }

        {/*<Field
          name="dbeg"
          component={ renderInput }
          type="text"
          placeholder=""
          label={t('DBEG')}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          normalize={four_digits}
        />
        <Field
          name="dend"
          component={ renderInput }
          type="text"
          placeholder=""
          label={t('DEND')}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          normalize={four_digits}
        />*/}
        <Field
          name="fundCategory"
          component={ renderSelect }
          isSearchable={false}
          label={fundCategory.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          validate={requiredLabel}
          colon={true}
          onMenuOpen={this.getCategories}
        />
        <Field
          name="fundFeature"
          component={ renderSelect }
          isSearchable={false}
          onMenuOpen={this.loadOptions('fundFeature')}
          data={fundFeatureOptions ? fundFeatureOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
          label={fundFeature.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          validate={requiredLabel}
          colon={true}
        />
        <Field
          name="formationDate"
          component={renderDatePicker}
          format={null}
          label={ clsFundConstValue && ['fundOrg','collectionOrg','jointOrg'].some(c => this.props.tofiConstants[c].id == clsFundConstValue.value) ? t('FORMATION_DATE') : t('BIRTH_DATE')}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
          // validate={requiredDate}
          // colon={true}
        />
        <Field
          name="eliminationDate"
          component={renderDatePicker}
          format={null}
          label={ clsFundConstValue && ['fundOrg','collectionOrg','jointOrg'].some(c => this.props.tofiConstants[c].id == clsFundConstValue.value) ? t('ELIMINATION_DATE') : t('DEATH_DATE')}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
        />
        <Field
          name="fundIndustry"
          component={ renderSelectVirt }
          isSearchable={false}
          optionHeight={40}
          onMenuOpen={this.loadOptions('fundIndustry')}
          options={fundIndustryOptions ? fundIndustryOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
          label={fundIndustry.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          validate={requiredLabel}
          colon={true}
        />
        <Field
          name="accessLevel"
          id="accessLevel"
          component={ renderSelect }
          isSearchable={false}
          onMenuOpen={!accessLevelOptions ? this.props.getAccessLevels : undefined}
          data={accessLevelOptions ? accessLevelOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
          label={t('ACCESS_LEVEL')}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          validate={requiredLabel}
          colon={true}
        />
      </Form>
    )
  }
}

const selector = formValueSelector('AddNewFundForm');

export default connect(state => {
  const clsFundConstValue = selector(state, 'clsFundConst');
  return {
    clsFundConstValue,
    fundmakerOrgOptions: state.generalData.fundmakerOrg,
    fundmakerLPOptions: state.generalData.fundmakerLP,
    fundFeatureOptions: state.generalData.fundFeature,
    fundIndustryOptions: state.generalData.fundIndustry,
    accessLevelOptions: state.generalData.accessLevel
  }
}, { getAllObjOfCls, getPropVal, getAccessLevels })(reduxForm({ form: 'AddNewFundForm' })(AddNewFundForm));
