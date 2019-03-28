import React, { Component } from 'react';
import {Button, Form} from 'antd';
import {Field, formValueSelector, reduxForm} from 'redux-form';
import {
  renderDatePicker, renderFileUploadBtn, renderInput, renderInputLang, renderSelect
} from '../../../utils/form_components';
import {isEmpty, isEqual, pickBy} from 'lodash';
import {getAccessLevels, getPropVal, getObjChildsByConst, getPropValWithChilds, getCube} from '../../../actions/actions';
import {
  CUBE_FOR_ORG_FUNDMAKER,
  DO_FOR_ORG_FUNDMAKER,
  DP_FOR_ORG_FUNDMAKER,
  FORM_OF_ADMISSION, FUND_MAKER_ARCHIVE, IS_ACTIVE, LEGAL_STATUS, ORG_DOC_TYPE, ORG_INDUSTRY
} from '../../../constants/tofiConstants';
import {connect} from 'react-redux';
import {normalizePhone} from '../../../utils/form_normalizing';
import {requiredArr, requiredLabel, requiredLng} from "../../../utils/form_validations";
import {message} from "antd/lib/index";
import {getParents} from "../../../utils";
import {parseCube_new, parseForTable} from '../../../utils/cubeParser';
import moment from 'moment/moment';

class MainInfoFundMaker extends Component {

  constructor(props) {
    super(props);

    const lng = localStorage.getItem('i18nextLng');
    this.state = {
      lang: {
        shortName: lng,
        name: lng,
        orgAddress: lng,
        orgFormationDoc: lng,
        orgReorganizationDoc: lng,
        orgLiquidationDoc: lng,
      },
      loading: {
        legalStatusLoading: false,
        formOfAdmissionLoading: false,
        orgIndustryLoading: false,
        isActiveLoading: false,
        fundmakerArchiveLoading: false,
        orgDocTypeLoading: false,
        objSubordinationLoading: false
      }
    };
  }

  disabledStartDate = (startValue) => {
    const endValue = this.props.dendValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEndDate = (endValue) => {
    const startValue = this.props.dbegValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };
  loadOptions = (c, withChilds) => {
    return () => {
      if(!this.props[c + 'Options']) {
        this.setState({loading: {...this.state.loading, [c+'Loading']: true}});
        !withChilds && this.props.getPropVal(c)
          .then(() => this.setState({loading: {...this.state.loading, [c+'Loading']: false}}))
          .catch(() => message.error('Ошибка загрузки данных'));
        withChilds && this.props.getPropValWithChilds(c)
          .then(() => this.setState({loading: {...this.state.loading, [c+'Loading']: false}}))
          .catch(() => message.error('Ошибка загрузки данных'));

      }
    }
  };
  loadChilds = c => {
    return () => {
      if (!this.props[c + 'Options']) {
        this.setState({loading: {...this.state.loading, [c + 'Loading']: true}});
        this.props.getObjChildsByConst(c)
          .then(() => this.setState({loading: {...this.state.loading, [c + 'Loading']: false}}))
          .catch(err => console.error(err))
      }
    }
  };

  componentDidMount() {
    if(!this.props.accessLevelOptions) {
      this.props.getAccessLevels();
    }
    if (!this.props.orgIndustryOptions) {
      this.props.getPropValWithChilds('orgIndustry')
    }
  }

  changeLang = e => {
    this.setState({lang: {...this.state.lang, [e.target.name]: e.target.value}});
  };

  shortNameValue = {...this.props.initialValues.shortName} || {kz: '', ru: '', en: ''};
  nameValue = {...this.props.initialValues.name} || {kz: '', ru: '', en: ''};
  orgAddressValue = {...this.props.initialValues.orgAddress} || {kz: '', ru: '', en: ''};
  orgFormationDocValue = {...this.props.initialValues.orgFormationDoc} || {kz: '', ru: '', en: ''};
  orgReorganizationDocValue = {...this.props.initialValues.orgReorganizationDoc} || {kz: '', ru: '', en: ''};
  orgLiquidationDocValue = {...this.props.initialValues.orgLiquidationDoc} || {kz: '', ru: '', en: ''};

  componentDidUpdate(prevProps) {
    if(prevProps.initialValues !== this.props.initialValues) {
      this.fundNumber = {...this.props.initialValues.fundNumber} || '';
      this.shortNameValue = {...this.props.initialValues.shortName} || {kz: '', ru: '', en: ''};
      this.nameValue = {...this.props.initialValues.name} || {kz: '', ru: '', en: ''};
      this.orgAddressValue = {...this.props.initialValues.orgAddress} || {kz: '', ru: '', en: ''};
      this.orgFormationDocValue = {...this.props.initialValues.orgFormationDoc} || {kz: '', ru: '', en: ''};
      this.orgReorganizationDocValue = {...this.props.initialValues.orgReorganizationDoc} || {kz: '', ru: '', en: ''};
      this.orgLiquidationDocValue = {...this.props.initialValues.orgLiquidationDoc} || {kz: '', ru: '', en: ''};
    }
  }

  onSubmit = values => {
    const { doForFundAndIK, dpForFundAndIK } = this.props.tofiConstants;
    const {shortName, name, dbeg, dend, accessLevel, orgFunction, structure, ...rest} = pickBy(values, (val, key) => !isEqual(val, this.props.initialValues[key]));
    const cube = {
      cubeSConst: 'cubeForOrgFundmaker',
      doConst: 'doForOrgFundmakers',
      dpConst: 'dpForOrgFundmakers',
    };
    const obj = {
      name: shortName,
      fullName: name,
      clsConst: 'fundmakerOrg',
      dbeg,
      dend,
      accessLevel: String(values.accessLevel.value)
    };
    //if(rest.orgIndustry) rest.orgIndustry = getParents(this.props.orgIndustryOptions, rest.orgIndustry);
    if(!this.props.initialValues.key) {
      return this.props.onCreateObj(
        {cube, obj},
        {values: rest, idDPV: this.props.withIdDPV, oFiles: {orgFunction, structure}},
      )
    }
    obj.doItem = this.props.initialValues.key;
    const objData = {};
    if(shortName) objData.name = shortName;
    if(name) objData.fullName = name;
    if(dbeg) objData.dbeg = dbeg;
    if(dend) objData.dend = dend;
    if(accessLevel) objData.accessLevel = accessLevel;
    // Сохраняем значения свойств fundNumber, fundmakerArchive (fundArchive для ИК), formOfAdmission, legalStatus, isActive для соответстующего источника комплектования, если хотя бы одно изменилось.
    if (shortName || name || dbeg || dend || accessLevel || rest.fundNumber || rest.fundmakerArchive || rest.formOfAdmission || rest.legalStatus || rest.isActive || rest.orgIndustry) {
      const filters = {
        filterDOAnd: [
          {
            dimConst: 'doForFundAndIK',
            concatType: "and",
            conds: [
              {
                data: {
                  dimPropConst: 'dpForFundAndIK',
                  propConst: 'fundmakerOfIK',
                  valueRef: { id: `wa_${obj.doItem.split('_')[1]}` }
                }
              }
            ]
          }
        ],
        filterDTOr: [
          {
            dimConst: 'dtForFundAndIK',
            concatType: 'and',
            conds: [
              {
                ids: moment().startOf('year').format('YYYYMMDD') + moment().endOf('year').format('YYYYMMDD')
              }
            ]
          }
        ]
      };
      this.props.getCube('cubeForFundAndIK',JSON.stringify(filters), {customKey: 'cubeForFundAndIKSingle'})
        .then(() => {
        const  constArr =['fundNumber', 'fundArchive', 'formOfAdmission', 'legalStatus', 'isActive', 'orgIndustry', 'fundmakerOfIK'];
          const parsedCube = parseCube_new(
            this.props.cubeForFundAndIKSingle['cube'],
            [],
            'dp',
            'do',
            this.props.cubeForFundAndIKSingle[`do_${doForFundAndIK.id}`],
            this.props.cubeForFundAndIKSingle[`dp_${dpForFundAndIK.id}`],
            `do_${doForFundAndIK.id}`,
            `dp_${dpForFundAndIK.id}`)[0];
            const idDPV = parseForTable(parsedCube.props, this.props.tofiConstants, {}, constArr);
          const cIK = {
            cube: {
              cubeSConst: 'cubeForFundAndIK',
              doConst: 'doForFundAndIK',
              dpConst: 'dpForFundAndIK',
              data: this.props.cubeForFundAndIKSingle
            },
            obj: { doItem: parsedCube.id }
          };
          const {fundNumber, fundmakerArchive, formOfAdmission, legalStatus, isActive, orgIndustry } = rest;
          const fundArchive = fundmakerArchive;
          const vIK = {
            values: JSON.parse(JSON.stringify({
              fundNumber, fundArchive, formOfAdmission, legalStatus, isActive, orgIndustry,
              fundmakerOfIK: obj.doItem.split('_')[1],
            })),
            idDPV
          };
          //console.log('vIK ', vIK);
          this.props.saveIKProps(cIK, vIK, this.props.tofiConstants, objData);
        });
    }
    return this.props.saveProps(
      {cube, obj},
      {values: rest, idDPV: this.props.withIdDPV, oFiles: {orgFunction, structure}},
      this.props.tofiConstants,
      objData
    );
  };

  render() {
    if(!this.props.tofiConstants) return null;

    const lng = localStorage.getItem('i18nextLng');
    const { tofiConstants: {legalStatus, fundNumber, formOfAdmission, orgIndustry, isActive, fundmakerArchive, orgPhone, orgFax,
        orgEmail, orgAddress, orgFormationDoc, orgReorganizationDoc, orgLiquidationDoc, contractNumber, orgDocType,
        subordination, jurisdiction, orgFunction, structure
      }, t, handleSubmit, reset, dirty, error, submitting, legalStatusOptions, accessLevelOptions, orgDocTypeOptions,
      formOfAdmissionOptions, orgIndustryOptions, isActiveOptions, fundmakerArchiveOptions, cubeSConst,
      objSubordinationOptions } = this.props;
    const { lang, loading } = this.state;
    //console.log('orgFormationDocValue ', this.orgFormationDocValue);
    return (
      <Form className="antForm-spaceBetween" onSubmit={handleSubmit(this.onSubmit)} style={dirty ? {paddingBottom: '43px'} : {}}>
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
          name="fundNumber"
          component={ renderInput }
          placeholder={t('NUMB_OF_IK')}
          label={t('NUMB_OF_IK')}
          formItemLayout={
              {
                  labelCol: {span: 10},
                  wrapperCol: {span: 14}
              }
          }
          validate={requiredLng}
          colon={true}
          />
          }
        <Field
          name="dbeg"
          component={ renderDatePicker }
          disabledDate={this.disabledStartDate}
          format={null}
          label={t('DBEG')}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
        <Field
          name="dend"
          component={ renderDatePicker }
          disabledDate={this.disabledEndDate}
          format={null}
          label={t('DEND')}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
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
          data={accessLevelOptions ? accessLevelOptions.map(option => ({value: option.id, label: option.name[lng]})) : []}
          onMenuOpen={!accessLevelOptions ? this.props.getAccessLevels : undefined}
          colon={true}
          validate={requiredLabel}
        />
        {contractNumber && <Field
          name="contractNumber"
          component={ renderInput }
          placeholder={contractNumber.name[lng]}
          label={contractNumber.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        {legalStatus && <Field
          name="legalStatus"
          component={ renderSelect }
          label={legalStatus.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          isSearchable={false}
          data={legalStatusOptions ? legalStatusOptions.map(option => ({value: option.id, label: option.name[lng]})) : []}
          onMenuOpen={this.loadOptions(LEGAL_STATUS)}
          isLoading={loading.legalStatusLoading}
          validate={requiredLabel}
          colon={true}
        />}
        {formOfAdmission && <Field
          name="formOfAdmission"
          component={ renderSelect }
          isSearchable={false}
          label={formOfAdmission.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          data={formOfAdmissionOptions ? formOfAdmissionOptions.map(option => ({value: option.id, label: option.name[lng]})) : []}
          onMenuOpen={this.loadOptions(FORM_OF_ADMISSION)}
          isLoading={loading.formOfAdmissionLoading}
          validate={requiredLabel}
          colon={true}
        />}
        {orgDocType && <Field
          name="orgDocType"
          isMulti
          component={ renderSelect }
          isSearchable={false}
          label={orgDocType.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          data={orgDocTypeOptions ? orgDocTypeOptions.map(option => ({value: option.id, label: option.name[lng]})) : []}
          onMenuOpen={this.loadOptions('orgDocType')}
          isLoading={loading.orgDocTypeLoading}
          validate={requiredArr}
          colon={true}
        />}
        {orgIndustry && <Field
          name="orgIndustry"
          component={ renderSelect }
          label={orgIndustry.name[lng]}
          isMulti
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          isSearchable={false}
          data={orgIndustryOptions || []}
          onMenuOpen={this.loadOptions(ORG_INDUSTRY, true)}
          isLoading={loading.orgIndustryLoading}
          validate={requiredArr}
          colon={true}
        />}
        {isActive && <Field
          name="isActive"
          component={ renderSelect }
          label={isActive.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          isSearchable={false}
          data={isActiveOptions ? isActiveOptions.map(option => ({value: option.id, label: option.name[lng]})) : []}
          onMenuOpen={this.loadOptions(IS_ACTIVE)}
          isLoading={loading.isActiveLoading}
          validate={requiredLabel}
          colon={true}
        />}
        {fundmakerArchive && <Field
          name="fundmakerArchive"
          component={ renderSelect }
          label={fundmakerArchive.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          data={fundmakerArchiveOptions ? fundmakerArchiveOptions.map(option => ({value: option.id, label: option.name[lng]})) : []}
          onMenuOpen={this.loadOptions('fundmakerArchive')}
          isLoading={loading.fundmakerArchiveLoading}
          validate={requiredLabel}
          colon={true}
        />}
 {/*       {subordination && <Field
          name="subordination"
          component={ renderSelect }
          label={subordination.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          isSearchable={false}
          data={objSubordinationOptions ? objSubordinationOptions.map(option => ({value: option.id, label: option.name[lng]})) : []}
          onMenuOpen={this.loadChilds('objSubordination')}
          isLoading={loading.objSubordinationLoading}
          // validate={requiredLabel}
          // colon={true}
        />}
        {jurisdiction && <Field
          name="jurisdiction"
          component={ renderSelect }
          label={jurisdiction.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          isSearchable={false}
          data={objSubordinationOptions ? objSubordinationOptions.map(option => ({value: option.id, label: option.name[lng]})) : []}
          onMenuOpen={this.loadChilds('objSubordination')}
          isLoading={loading.objSubordinationLoading}
          // validate={requiredLabel}
          // colon={true}
        />}*/}
        {orgFunction && <Field
          name="orgFunction"
          component={ renderFileUploadBtn }
          cubeSConst = 'cubeForOrgFundmaker'
          label={orgFunction.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          // validate={requiredLabel}
          // colon={true}
        />}
        {structure && <Field
          name="structure"
          component={ renderFileUploadBtn }
          cubeSConst = 'cubeForOrgFundmaker'
          label={structure.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          // validate={requiredLabel}
          // colon={true}
        />}
        {orgAddress && <Field
          name="orgAddress"
          component={ renderInputLang }
          format={value => (!!value ? value[lang.orgAddress] : '')}
          parse={value => { this.orgAddressValue[lang.orgAddress] = value; return {...this.orgAddressValue} }}
          label={orgAddress.name[lng]}
          formItemClass="with-lang"
          changeLang={this.changeLang}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        {orgPhone && <Field
          name="orgPhone"
          component={ renderInput }
          placeholder='+7 ('
          label={orgPhone.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          normalize={normalizePhone}
        />}
        {orgFax && <Field
          name="orgFax"
          component={ renderInput }
          placeholder='+7 ('
          label={orgFax.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          normalize={normalizePhone}
        />}
        {orgEmail && <Field
          name="orgEmail"
          component={ renderInput }
          placeholder='example@example.com'
          label={orgEmail.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        {orgFormationDoc && <Field
          name="orgFormationDoc"
          component={ renderInputLang }
          format={value => (!!value ? value[lang.orgFormationDoc] : '')}
          parse={value => { this.orgFormationDocValue[lang.orgFormationDoc] = value; return {...this.orgFormationDocValue} }}
          label={orgFormationDoc.name[lng]}
          formItemClass="with-lang"
          changeLang={this.changeLang}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        {orgReorganizationDoc && <Field
          name="orgReorganizationDoc"
          component={ renderInputLang }
          format={value => (!!value ? value[lang.orgReorganizationDoc] : '')}
          parse={value => { this.orgReorganizationDocValue[lang.orgReorganizationDoc] = value; return {...this.orgReorganizationDocValue} }}
          label={orgReorganizationDoc.name[lng]}
          formItemClass="with-lang"
          changeLang={this.changeLang}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        {orgLiquidationDoc && <Field
          name="orgLiquidationDoc"
          component={ renderInputLang }
          format={value => (!!value ? value[lang.orgLiquidationDoc] : '')}
          parse={value => { this.orgLiquidationDocValue[lang.orgLiquidationDoc] = value; return {...this.orgLiquidationDocValue} }}
          label={orgLiquidationDoc.name[lng]}
          formItemClass="with-lang"
          changeLang={this.changeLang}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        {dirty && <Form.Item className="ant-form-btns absolute-bottom">
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

const selector = formValueSelector('MainInfoFundMaker');
function mapStateToProps(state) {
  const dbegValue = selector(state, 'dbeg');
  const dendValue = selector(state, 'dend');
  const lng = localStorage.getItem('i18nextLng');
  const orgIndOpts = state.generalData[ORG_INDUSTRY] && state.generalData[ORG_INDUSTRY]
    .map(option => ({value: option.id, label: option.name[lng], hasChild: option.hasChild, parent: option.parent}));
  return {
    dbegValue,
    dendValue,
    legalStatusOptions: state.generalData[LEGAL_STATUS],
    formOfAdmissionOptions: state.generalData[FORM_OF_ADMISSION],
    orgIndustryOptions: orgIndOpts,
    isActiveOptions: state.generalData[IS_ACTIVE],
    fundmakerArchiveOptions: state.generalData[FUND_MAKER_ARCHIVE],
    orgDocTypeOptions: state.generalData[ORG_DOC_TYPE],
    objSubordinationOptions: state.generalData.objSubordination,
    accessLevelOptions: state.generalData.accessLevel,
    cubeForFundAndIKSingle: state.cubes.cubeForFundAndIKSingle
  }
}

export default connect(
  mapStateToProps,
  { getPropVal, getCube, getAccessLevels, getObjChildsByConst, getPropValWithChilds }
)(reduxForm({ form: 'MainInfoFundMaker', enableReinitialize: true })(MainInfoFundMaker));
