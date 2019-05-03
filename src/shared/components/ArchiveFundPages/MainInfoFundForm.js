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
      stateDate:{},
        optionMultiSelect:[],
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
      this.fundNumber={...this.props.initialValues.fundNumber}
      this.shortNameValue = {...this.props.initialValues.shortName} || {kz: '', ru: '', en: ''};
      this.nameValue = {...this.props.initialValues.name} || {kz: '', ru: '', en: ''};
      this.fundExitReasonValue = {...this.props.initialValues.fundExitReason} || {kz: '', ru: '', en: ''};
      this.creationCondsValue = {...this.props.initialValues.creationConds} || {kz: '', ru: '', en: ''};
      this.creationReasonValue = {...this.props.initialValues.creationReason} || {kz: '', ru: '', en: ''};
      this.creationPrincipleValue = {...this.props.initialValues.creationPrinciple} || {kz: '', ru: '', en: ''};
      this.collectionLocationValue = {...this.props.initialValues.collectionLocation} || {kz: '', ru: '', en: ''};
    }
  }
    dateToRedux=(val , prev)=>{{
      let coppyPrev = {...prev}

      if (!!val){
          let newDate = moment(val).format("DD-MM-YYYY")
          if (!!coppyPrev.idDataPropVal){
            coppyPrev.value = newDate
              return coppyPrev
          }else {
            return {
              value:newDate
            }
          }
      }else{
        if (!!coppyPrev.value){
            coppyPrev.value=""
            return coppyPrev
        }else{
          return {}
        }

      }

    }}
    strToRedux = (val, prevVal, obj, prevObj) => {
        var newVal = {...prevVal};
        if (prevVal === null) {
            let objVal = {
                value: val,
                valueLng: {kz: val},
                valueLng: {ru: val},
                valueLng: {en: val}
            }
            return objVal
        } else {
            newVal.value = val;
            newVal['valueLng']={kz:val,ru:val,en:val}
            return (newVal)

        }
    };

    selectToRedux = (val, prevVal, obj, prevObj) => {
        if (val !== undefined) {
            if (val === null) {
                let newValNull = {...prevVal};
                newValNull.label = null;
                newValNull.labelFull = null;
                newValNull.value = null;
                return newValNull
            } else {
                let newVal = {...prevVal};
                newVal.value = val.value;
                newVal.label = val.label;
                newVal.fundTypeClass= val.fundTypeClass ? val.fundTypeClass :''
                newVal.labelFull = val.label;
                return (newVal)
            }

        }
    };
    selectMultiToRedux = (val, prevVal, obj, prevObj) => {
        if (val !== undefined) {
            if (val.length > 0){
                let coppyPrevVal = prevVal?[...prevVal]:[]
                let coppyVal = [...val]
                if (coppyPrevVal.length > 0 ) {
                    for (let i = 0; i < coppyPrevVal.length; i++) {
                        if (coppyPrevVal[i].idDataPropVal == undefined) continue
                        if (coppyPrevVal[i].idDataPropVal !== undefined) {
                            let findePrevVal = this.state.optionMultiSelect.find((el) => el.idDataPropVal === coppyPrevVal[i].idDataPropVal)

                            if (findePrevVal === undefined) {
                                setTimeout(() => {
                                    this.setState({
                                        optionMultiSelect: this.state.optionMultiSelect.concat(coppyPrevVal[i])
                                    })
                                })

                            }
                        }

                    }
                }

                for (let i = 0; i < coppyVal.length; i++) {
                    if (coppyVal[i].idDataPropVal === undefined) {
                        let findVal = this.state.optionMultiSelect.find((el) => el.value === coppyVal[i].value)
                        if (findVal !== undefined) {
                            coppyVal.splice(i, 1)
                            coppyVal.push(findVal)
                        }
                    }
                }
                return coppyVal
            } else {
                return []
            }
        }
    };


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
          normalize={this.selectToRedux}
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
          normalize={this.selectToRedux}
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
          normalize={this.strToRedux}
          label={fundNumber.name[this.lng]}
          formItemLayout={{
            labelCol: {span: 10},
            wrapperCol: {span: 14}
          }}
          colon={true}
          validate={requiredLng}
        />}
        {fundIndex && <Field
          name='fundIndex'
          component={renderInput}
          label={fundIndex.name[this.lng]}
          normalize={this.strToRedux}
          formItemLayout={{
            labelCol: {span: 10},
            wrapperCol: {span: 14}
          }}
        />}
        {fundmakerOfIK && fundTypeValue && ['fundOrg', 'fundLP'].includes(fundTypeValue.fundTypeClass) && <Field
          name="fundmakerOfIK"
          component={ renderSelectVirt }
          normalize={this.selectToRedux}
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
          onMenuOpen={this.loadClsObj([this.mapFundFM[fundTypeValue.fundTypeClass]])}
          validate={requiredLabel}
          colon={true}
        />}

        {fundmakerMulti && fundTypeValue && !['fundOrg', 'fundLP'].includes(fundTypeValue.fundTypeClass) && <Field
          name="fundmakerMulti"
          component={ renderSelectVirt }
          isMulti
          normalize={this.selectMultiToRedux}
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
          onMenuOpen={this.loadClsObj([this.mapFundFM[fundTypeValue.fundTypeClass]])}
          validate={requiredArr}
          colon={true}
        />}
        {fundCategory && <Field
          name="fundCategory"
          component={renderSelect}
          normalize={this.selectToRedux}

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
          normalize={this.selectToRedux}
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
              normalize={this.selectMultiToRedux}
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
              normalize={this.selectMultiToRedux}
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
              normalize={this.selectMultiToRedux}
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
              name="shelfMulti"
              component={renderSelect}
              normalize={this.selectMultiToRedux}
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
          format={val=> {return val && val.value}}
          normalize={this.dateToRedux}
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
          format={value => (!!value ? value.valueLng[lang.fundExitReason] : '')}
          normalize={(val, prevVal, obj, prevObj) => {
              let newVal = {...prevVal}; newVal.value = val;
              if (!!newVal.valueLng){newVal.valueLng[lang.fundExitReason] = val;}else
              {newVal['valueLng']={kz:'',en:'',ru:''};newVal.valueLng[lang.fundExitReason] = val;}
              return newVal;
          }}

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
          isMulti
          normalize={this.selectMultiToRedux}
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
          validate={requiredArr}
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
          normalize={this.selectMultiToRedux}
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
          normalize={this.strToRedux}
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
          normalize={this.strToRedux}
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
          normalize={this.selectToRedux}
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
          format={val=> val && val.value}
          normalize={this.dateToRedux}
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
          format={val=> {return val && val.value}}
          label={fundDateOfLastCheck.name[this.lng]}
          normalize={this.dateToRedux}
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
          normalize={this.dateToRedux}
          format={val=> {return val && val.value}}
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
          format={value => (!!value ? value.valueLng[lang.creationConds] : '')}
          normalize={(val, prevVal, obj, prevObj) => {
              let newVal = {...prevVal}; newVal.value = val;
              if (!!newVal.valueLng){newVal.valueLng[lang.creationConds] = val;}else
              {newVal['valueLng']={kz:'',en:'',ru:''};newVal.valueLng[lang.creationConds] = val;}
              return newVal;
          }}
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
          format={value => (!!value ? value.valueLng[lang.creationReason] : '')}
          normalize={(val, prevVal, obj, prevObj) => {
              let newVal = {...prevVal}; newVal.value = val;
              if (!!newVal.valueLng){newVal.valueLng[lang.creationReason] = val;}else
              {newVal['valueLng']={kz:'',en:'',ru:''};newVal.valueLng[lang.creationReason] = val;}
              return newVal;
          }}
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
          format={value => (!!value ? value.valueLng[lang.creationPrinciple] : '')}
          normalize={(val, prevVal, obj, prevObj) => {
              let newVal = {...prevVal}; newVal.value = val;
              if (!!newVal.valueLng){newVal.valueLng[lang.creationPrinciple] = val;}else
              {newVal['valueLng']={kz:'',en:'',ru:''};newVal.valueLng[lang.creationPrinciple] = val;}
              return newVal;
          }}
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
          format={value => (!!value ? value.valueLng[lang.collectionLocation] : '')}
          normalize={(val, prevVal, obj, prevObj) => {
              let newVal = {...prevVal}; newVal.value = val;
              if (!!newVal.valueLng){newVal.valueLng[lang.collectionLocation] = val;}else
              {newVal['valueLng']={kz:'',en:'',ru:''};newVal.valueLng[lang.collectionLocation] = val;}
              return newVal;
          }}
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
          normalize={this.strToRedux}
          label={lastReceivedYear.name[this.lng]}
          formItemLayout={{
            labelCol: {span: 10},
            wrapperCol: {span: 14}
          }}
          placeholder='dddd'
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
