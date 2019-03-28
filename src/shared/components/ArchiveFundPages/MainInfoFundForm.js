import React, { Component } from 'react';
import {Button, Form} from 'antd';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import {
  renderDatePicker, renderInput, renderInputLang, renderSelect, renderSelectVirt
} from '../../utils/form_components';
import {connect} from 'react-redux';
import moment from 'moment';
import {getAllObjOfCls, getObjByObjVal, getObjByProp, getObjChildsByConst,getPropValWithChilds, getPropVal} from '../../actions/actions';
import {isEqual, pickBy} from 'lodash';
import {required, requiredArr, requiredDate, requiredLabel, requiredLng} from '../../utils/form_validations';
import {digits} from "../../utils/form_normalizing";

/*eslint eqeqeq:0*/
class MainInfoFundForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      lang: {
        name: localStorage.getItem('i18nextLng'),
        shortName: localStorage.getItem('i18nextLng'),
        fundExitReason: localStorage.getItem('i18nextLng'),
        creationConds: localStorage.getItem('i18nextLng'),
        creationReason: localStorage.getItem('i18nextLng'),
        creationPrinciple: localStorage.getItem('i18nextLng'),
        collectionLocation: localStorage.getItem('i18nextLng')
      },
      loading: {
        fundmakerOfIKLoading: false,
        fundmakerMultiLoading: false,
        fundIndustryLoading: false,
        fundToGuidbookObjLoading: false,
      }
    };

    this.mapFundFM = {
      fundOrg: "fundmakerOrg",
      fundLP: "fundmakerLP",
      collectionOrg: "fundmakerOrg",
      collectionLP: "fundmakerLP",
      jointOrg: "fundmakerOrg",
      jointLP: "fundmakerLP"
    }
  }

  changeLang = e => {
    this.setState({lang: {...this.state.lang, [e.target.name]: e.target.value}});
  };

  shortNameValue = {...this.props.initialValues.shortName} || {kz: '', ru: '', en: ''};
  nameValue = {...this.props.initialValues.name} || {kz: '', ru: '', en: ''};
  fundExitReasonValue = {...this.props.initialValues.fundExitReason} || {kz: '', ru: '', en: ''};
  creationCondsValue = {...this.props.initialValues.creationConds} || {kz: '', ru: '', en: ''};
  creationReasonValue = {...this.props.initialValues.creationReason} || {kz: '', ru: '', en: ''};
  creationPrincipleValue = {...this.props.initialValues.creationPrinciple} || {kz: '', ru: '', en: ''};
  collectionLocationValue = {...this.props.initialValues.collectionLocation} || {kz: '', ru: '', en: ''};

  onSubmit = values => {
    if(!this.props.initialValues.key) {
      return this.props.onCreateObj(
        {
          ...pickBy(values, (val, key) => !isEqual(val, this.props.initialValues[key])),
          accessLevel: values.accessLevel,
          fundFeature: values.fundFeature,
          //fundArchive: {value: String(this.props.tofiConstants.fundArchiveObj.id)}
        })
    } else {
      const { fundType, shortName, name, accessLevel, ...rest } = pickBy(values, (val, key) => !isEqual(val, this.props.initialValues[key]))
      const objData = {};
      if(fundType) objData.clsConst = fundType.fundTypeClass;
      if(shortName) objData.name = shortName;
      if(name) objData.fullName = name;
      if(accessLevel) objData.accessLevel = accessLevel;

      return this.props.onCreateObj(rest, this.props.initialValues.key, objData);
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
        this.setState({loading: { ...this.state.loading ,[c+'Loading']: true }});
        this.props.getPropVal(c)
          .then(() => this.setState({loading: { ...this.state.loading ,[c+'Loading']: false }}))
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

    loadChilds2 = (c, props) => {
        return () => {
            if (!this.props[c + 'Options']) {
                this.setState({loading: {...this.state.loading, [c + 'Loading']: true}});
                this.props.getPropValWithChilds(c, props)
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
      this.shortNameValue = {...this.props.initialValues.shortName} || {kz: '', ru: '', en: ''};
      this.nameValue = {...this.props.initialValues.name} || {kz: '', ru: '', en: ''};
      this.fundExitReasonValue = {...this.props.initialValues.fundExitReason} || {kz: '', ru: '', en: ''};
      this.creationCondsValue = {...this.props.initialValues.creationConds} || {kz: '', ru: '', en: ''};
      this.creationReasonValue = {...this.props.initialValues.creationReason} || {kz: '', ru: '', en: ''};
      this.creationPrincipleValue = {...this.props.initialValues.creationPrinciple} || {kz: '', ru: '', en: ''};
      this.collectionLocationValue = {...this.props.initialValues.collectionLocation} || {kz: '', ru: '', en: ''};
    }
  }

  render() {
    if(!this.props.tofiConstants) return null;

    this.lng = localStorage.getItem('i18nextLng');
    const { t, handleSubmit, reset, dirty, error, submitting, fundCategoryOptions, fundFeatureOptions,caseStorageMultiOptions,rackMultiOptions,sectionMultiOptions,shelfMultiOptions,
      fundIndustryOptions, fundToGuidbookObjOptions, accessLevelOptions, fundFeatureValue, fundTypeValue,
      affiliationOptions, fundArchiveOptions,
      tofiConstants: {fundDbeg, fundDend, creationConds, fundmakerOfIK, fundExitReason, creationReason, creationPrinciple, collectionLocation,
        fundExitDate, fundCategory, fundFeature, fundNumber, fundIndex, fundIndustry, fundmakerMulti, lastReceivedYear,
      fundToGuidbook, fundFirstDocFlow, fundDateOfLastCheck, collectionCreateDate, excluded, affiliation, fundArchive,caseStorageMulti,rackMulti , sectionMulti, shelfMulti}} = this.props;
    const { lang, loading } = this.state;

    return (
      <Form className="antForm-spaceBetween" onSubmit={handleSubmit(this.onSubmit)} style={dirty ? {paddingBottom: '43px'} : {}}>
        <Field
          name="fundArchive"
          component={ renderSelect }
          disabled={!!this.props.initialValues.key}
          isSearchable={false}
          label={fundArchive.name[this.lng]}
          formItemLayout={
              {
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
              }
          }
          data={fundArchiveOptions ? fundArchiveOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
          onFocus={this.loadOptions(['fundArchive'])}
          isLoading={loading.fundArchiveLoading}
          validate={requiredLabel}
          colon={true}
        />
        <Field
          name="fundType"
          component={ renderSelect }
          disabled={!!this.props.initialValues.key}
          isSearchable={false}
          label={t('FUND_TYPE')}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          /*onChange={(e, newValue) => {
            if(newValue) {
              const statusConst = this.props.tofiConstants[this.props.clsFirstStatusMap[newValue.value]];
              this.props.change('workStatusReg', {value: statusConst.id, label: statusConst.name[this.lng], fundType: fundTypeValue });
            } else {
              reset();
            }
          }}*/
          data={['fundOrg','fundLP','collectionOrg','collectionLP','jointOrg','jointLP']
            .map(cns => ({value: this.props.tofiConstants[cns].id, label: this.props.tofiConstants[cns].name[this.lng], fundTypeClass: cns}))}
          validate={requiredLabel}
          colon={true}
        />
        <Field
          name="shortName"
          component={ renderInputLang }
          format={value => (!!value ? value[lang.shortName] : '')}
          parse={value => { this.shortNameValue[lang.shortName] = value; return {...this.shortNameValue} }}
          label={t('SHORT_NAME')}
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
        {fundNumber && <Field
          name='fundNumber'
          component={renderInput}
          label={fundNumber.name[this.lng]}
          formItemLayout={{
            labelCol: {span: 10},
            wrapperCol: {span: 14}
          }}
          colon={true}
          validate={required}
        />}
        {fundIndex && <Field
          name='fundIndex'
          component={renderInput}
          label={fundIndex.name[this.lng]}
          formItemLayout={{
            labelCol: {span: 10},
            wrapperCol: {span: 14}
          }}
        />}
        {fundmakerOfIK && fundTypeValue && ['fundOrg', 'fundLP'].includes(fundTypeValue.fundTypeClass) && <Field
          name="fundmakerOfIK"
          component={ renderSelectVirt }
          matchProp="label"
          matchPos="start"
          label={fundmakerOfIK.name[this.lng]}
          optionHeight={40}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          isLoading={loading[this.mapFundFM[fundTypeValue.fundTypeClass] + 'Loading']}
          options={
            this.props[this.mapFundFM[fundTypeValue.fundTypeClass] + 'Options'] ?
              this.props[this.mapFundFM[fundTypeValue.fundTypeClass] + 'Options'].map(o => ({ value: o.id, label: o.name[this.lng] }))
              : []
          }
          onFocus={this.loadClsObj([this.mapFundFM[fundTypeValue.fundTypeClass]])}
          validate={requiredLabel}
          colon={true}
        />}
        {fundmakerMulti && fundTypeValue && !['fundOrg', 'fundLP'].includes(fundTypeValue.fundTypeClass) && <Field
          name="fundmakerMulti"
          component={ renderSelectVirt }
          isMulti
          matchProp="label"
          matchPos="start"
          label={fundmakerMulti.name[this.lng]}
          optionHeight={40}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          isLoading={loading[this.mapFundFM[fundTypeValue.fundTypeClass] + 'Loading']}
          options={
            this.props[this.mapFundFM[fundTypeValue.fundTypeClass] + 'Options'] ?
              this.props[this.mapFundFM[fundTypeValue.fundTypeClass] + 'Options'].map(o => ({ value: o.id, label: o.name[this.lng] }))
              : []
          }
          onFocus={this.loadClsObj([this.mapFundFM[fundTypeValue.fundTypeClass]])}
          validate={requiredArr}
          colon={true}
        />}
        {fundCategory && <Field
          name="fundCategory"
          component={renderSelect}
          label={fundCategory.name[this.lng]}
          formItemLayout={{
              labelCol: {span: 10},
              wrapperCol: {span: 14}
          }}
          isLoading={loading.fundCategoryLoading}
          data={fundCategoryOptions ? fundCategoryOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
          onFocus={this.loadOptions(['fundCategory'])}
          validate={requiredLabel}
          colon={true}
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
          onFocus={this.loadOptions(['fundFeature'])}
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
        {fundExitDate && fundFeatureValue && fundFeatureValue.value === excluded.id && <Field
          name="fundExitDate"
          component={renderDatePicker}
          disabled={!!this.props.initialValues.workActualStartDate}
          format={null}
          label={fundExitDate.name[this.lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
          colon
          validate={requiredDate}
        />}
        {fundExitReason && fundFeatureValue && fundFeatureValue.value === excluded.id && <Field
          name="fundExitReason"
          component={ renderInputLang }
          format={value => (!!value ? value[lang.fundExitReason] : '')}
          parse={value => { this.fundExitReasonValue[lang.fundExitReason] = value; return {...this.fundExitReasonValue} }}
          label={fundExitReason.name[this.lng]}
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
        />}
        {fundIndustry && fundTypeValue && !['fundLP', 'collectionLP', 'jointLP'].includes(fundTypeValue.fundTypeClass) && <Field
          name="fundIndustry"
          component={ renderSelectVirt }
          matchProp="label"
          matchPos="start"
          label={fundIndustry.name[this.lng]}
          optionHeight={40}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          isLoading={loading.fundIndustryLoading}
          options={fundIndustryOptions ? fundIndustryOptions.map(o => ({ value: o.id, label: o.name[this.lng] })) : []}
          onFocus={this.loadChilds2('fundIndustry')}
          validate={requiredLabel}
          colon={true}
        />}
{/*        {affiliation && <Field
          name="affiliation"
          component={renderSelect}
          label={affiliation.name[this.lng]}
          formItemLayout={{
            labelCol: {span: 10},
            wrapperCol: {span: 14}
          }}
          isLoading={loading.affiliationLoading}
          data={affiliationOptions ? affiliationOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
          onFocus={this.loadOptions('affiliation')}
        />}*/}
        {this.props.initialValues.key && fundToGuidbook && <Field
          name="fundToGuidbook"
          disabled
          component={renderSelect}
          isMulti
          label={fundToGuidbook.name[this.lng]}
          formItemLayout={{
            labelCol: {span: 10},
            wrapperCol: {span: 14}
          }}
          isLoading={loading.fundToGuidbookObjLoading}
          data={fundToGuidbookObjOptions ? fundToGuidbookObjOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
          onFocus={this.loadChilds(['fundToGuidbookObj'])}
        />}
        {fundDbeg && <Field
          name="fundDbeg"
          component={ renderInput }
          label={fundDbeg.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        {fundDend && <Field
          name="fundDend"
          component={ renderInput }
          label={fundDend.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        <Field
          name="accessLevel"
          component={ renderSelect }
          label={t('ACCESS_LEVEL')}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          isSearchable={false}
          data={accessLevelOptions ? accessLevelOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
          onFocus={!accessLevelOptions ? this.props.getAccessLevels : undefined}
          colon={true}
          validate={requiredLabel}
        />
        {fundFirstDocFlow && <Field
          name="fundFirstDocFlow"
          component={renderDatePicker}
          format={null}
          label={fundFirstDocFlow.name[this.lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
          colon
          validate={requiredDate}
        />}
        {fundDateOfLastCheck && <Field
          name="fundDateOfLastCheck"
          component={renderDatePicker}
          format={null}
          label={fundDateOfLastCheck.name[this.lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
          colon
          validate={requiredDate}
        />}
        {collectionCreateDate && fundTypeValue && ['collectionOrg', 'collectionLP'].includes(fundTypeValue.fundTypeClass) && <Field
          name="collectionCreateDate"
          component={renderDatePicker}
          format={null}
          label={collectionCreateDate.name[this.lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
          colon
          validate={requiredDate}
        />}
        {creationConds && fundTypeValue && ['collectionOrg', 'collectionLP'].includes(fundTypeValue.fundTypeClass) && <Field
          name="creationConds"
          component={ renderInputLang }
          format={value => (!!value ? value[lang.creationConds] : '')}
          parse={value => { this.creationCondsValue[lang.creationConds] = value; return {...this.creationCondsValue} }}
          label={creationConds.name[this.lng]}
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
        />}
        {creationReason && fundTypeValue && ['collectionOrg', 'collectionLP'].includes(fundTypeValue.fundTypeClass) &&  <Field
          name="creationReason"
          component={ renderInputLang }
          format={value => (!!value ? value[lang.creationReason] : '')}
          parse={value => { this.creationReasonValue[lang.creationReason] = value; return {...this.creationReasonValue} }}
          label={creationReason.name[this.lng]}
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
        />}
        {creationPrinciple && fundTypeValue && ['collectionOrg', 'collectionLP'].includes(fundTypeValue.fundTypeClass) &&  <Field
          name="creationPrinciple"
          component={ renderInputLang }
          format={value => (!!value ? value[lang.creationPrinciple] : '')}
          parse={value => { this.creationPrincipleValue[lang.creationPrinciple] = value; return {...this.creationPrincipleValue} }}
          label={creationPrinciple.name[this.lng]}
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
        />}
        {collectionLocation && fundTypeValue && ['collectionOrg', 'collectionLP'].includes(fundTypeValue.fundTypeClass) &&  <Field
          name="collectionLocation"
          component={ renderInputLang }
          format={value => (!!value ? value[lang.collectionLocation] : '')}
          parse={value => { this.collectionLocationValue[lang.collectionLocation] = value; return {...this.collectionLocationValue} }}
          label={collectionLocation.name[this.lng]}
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
        />}
        {lastReceivedYear && <Field
          name='lastReceivedYear'
          component={renderInput}
          label={lastReceivedYear.name[this.lng]}
          formItemLayout={{
            labelCol: {span: 10},
            wrapperCol: {span: 14}
          }}
          placeholder='dddd'
          normalize={digits(4)}
        />}
        {dirty && <Form.Item className="ant-form-btns">
          <Button className="signup-form__btn" type="primary" htmlType="submit" disabled={submitting}>
            {submitting ? t('LOADING...') : t('SAVE') }
          </Button>
          <Button className="signup-form__btn" type="danger" htmlType="button" disabled={submitting} style={{marginLeft: '10px'}} onClick={reset}>
            {submitting ? t('LOADING...') : t('CANCEL') }
          </Button>
          {error && <span className="message-error"><i className="icon-error" />{error}</span>}
        </Form.Item>}
      </Form>
    )
  }
}

const selector = formValueSelector('MainInfoFundForm');

export default connect(state => {
  const fundTypeValue = selector(state, 'fundType');
  const fundFeatureValue = selector(state, 'fundFeature');
  const fundDbegValue = selector(state, 'fundDbeg');
  const fundDendValue = selector(state, 'fundDend');
  return {
    fundTypeValue,
    fundFeatureValue,
    fundDbegValue,
    fundDendValue,
    user: state.auth.user,
    fundArchiveOptions: state.generalData.fundArchive,
    fundIndustryOptions: state.generalData.fundIndustry,
    fundmakerOrgOptions: state.generalData.fundmakerOrg,
    affiliationOptions: state.generalData.affiliation,
    fundmakerLPOptions: state.generalData.fundmakerLP,
    fundmakerMultiOptions: state.generalData.fundmakerMulti,
    fundCategoryOptions: state.generalData.fundCategory,
    fundFeatureOptions: state.generalData.fundFeature,
      caseStorageMultiOptions: state.generalData.caseStorageMulti,
      rackMultiOptions: state.generalData.rackMulti,
      sectionMultiOptions: state.generalData.sectionMulti,
      shelfMultiOptions: state.generalData.shelfMulti,
    fundToGuidbookObjOptions: state.generalData.fundToGuidbookObj,
    accessLevelOptions: state.generalData.accessLevel
  }
}, { getAllObjOfCls, getPropVal, getObjByObjVal, getObjChildsByConst, getPropValWithChilds })(reduxForm({ form: 'MainInfoFundForm', enableReinitialize: true })(MainInfoFundForm));
