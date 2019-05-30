import React, {Component} from 'react';
import {Button, Form} from 'antd';
import {Field, reduxForm, formValueSelector, change } from 'redux-form';
import {
  renderDatePicker, renderInput, renderInputLang, renderSelect, renderSelectVirt
} from '../../../utils/form_components';
import {connect} from 'react-redux';
import moment from 'moment';
import {getAllObjOfCls, getObjByObjVal, getObjByProp, getObjChildsByConst, getPropVal} from '../../../actions/actions';
import {isEqual, pickBy} from 'lodash';
import {required, requiredArr, requiredLabel} from '../../../utils/form_validations';
import {
  CUBE_FOR_WORKS,
  DO_FOR_WORKS,
  DP_FOR_WORKS,
} from '../../../constants/tofiConstants';
import {SYSTEM_LANG_ARRAY} from "../../../constants/constants";

const FormItem = Form.Item;

class MainInfo extends Component {

  constructor(props) {
    super(props);

    this.state = {
      lang: {
        theme: localStorage.getItem('i18nextLng')
      },
      loading: {
          workAssignedToIPSLoading:false,
        objStudyParentLoading: false,
        themeLoading: false,
        requestSourceLoading: false,
        requestTypeLoading: false,
        caseDocsLangLoading: false,
        workAuthorLoading: false,
        workAssignedToLoading: false
      }
    };
  }

  themeValue = {...this.props.initialValues.theme};

  changeLang = e => {
    this.setState({lang: {...this.state.lang, [e.target.name]: e.target.value}});
  };

  componentDidUpdate(prevProps) {
    if(prevProps.initialValues !== this.props.initialValues) {
      this.themeValue = {...this.props.initialValues.theme};
    }
  }

  onSubmit = values => {
    const {researchType, ...rest} = pickBy(values, (val, key) => !isEqual(val, this.props.initialValues[key]));
    const cube = {
      cubeSConst: 'cubeStudy',
      doConst: 'doCubeStudy',
      dpConst: 'dpCubeStudy'
    };
    const name = {};

    SYSTEM_LANG_ARRAY.forEach(lang => {
      name[lang] = !!values.regNumber? values.regNumber.value:"";
    });
    const obj = {
      name,
      fullName: name,
      clsConst: values.researchType.researchTypeClass,
      dbeg: moment().format('YYYY-MM-DD'),
    };

    if (!this.props.initialValues.key) {
      return this.props.onCreateObj(
        {cube, obj},
        {
          values: {
            ...rest,
            workAuthor: values.workAuthor,
            workDate: values.workDate
          }
        })
    }
    const objData = {};
    if(rest.regNumber) {
      objData.name = name;
      objData.fullName = name;
    }


    obj.doItem = this.props.initialValues.key;
    return this.props.saveProps({cube, obj}, {values: rest}, this.props.tofiConstants, objData);
  };
  loadClsObj = (cArr, dte = moment().format('YYYY-MM-DD')) => {
      return () => {
          cArr.forEach(c => {
              if (!this.props[c + 'Options']) {
                  this.setState({
                      loading: {
                          ...this.state.loading,
                          [c + 'Loading']: true
                      }
                  });
                  this.props.getAllObjOfCls(c, dte)
                  .then(() => this.setState({
                      loading: {
                          ...this.state.loading,
                          [c + 'Loading']: false
                      }
                  }))
              }
          })
      }
  };
  loadOptions = c => {
    return () => {
      if (!this.props[c + 'Options']) {
        this.setState({loading: {...this.state.loading, [c + 'Loading']: true}});
        this.props.getPropVal(c)
          .then(() => this.setState({loading: {...this.state.loading, [c + 'Loading']: false}}))
      }
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


    dateToRedux = (val, prev) => {
        {
            let coppyPrev = { ...prev };

            if (!!val) {
                let newDate = moment(val).format("DD-MM-YYYY");
                if (!!coppyPrev.idDataPropVal) {
                    coppyPrev.value = newDate;
                    return coppyPrev;
                } else {
                    return {
                        value: newDate
                    };
                }
            } else {
                if (!!coppyPrev.value) {
                    coppyPrev.value = "";
                    return coppyPrev;
                } else {
                    return {};
                }
            }
        }
    };

    strToRedux = (val, prevVal, obj, prevObj, flag) => {
        if(!!flag){
            val = val.replace(/[^\d;]/g, '')
        }
        var newVal = { ...prevVal };
        if (prevVal === null) {
            let objVal = {
                value: val,
                valueLng: { kz: val },
                valueLng: { ru: val },
                valueLng: { en: val }
            };
            return objVal;
        } else {
            newVal.value = val;
            newVal["valueLng"] = { kz: val, ru: val, en: val };

            return newVal;
        }
    };
    fileToRedux = (val, prevVal, file, str) => {
        let newFile = val.filter(el => el instanceof File);
        if (newFile.length > 0) {
            var copyVal = prevVal ? [...prevVal] : [];
            newFile.map(el => {
                copyVal.push({
                    value: el
                });
            });
            return copyVal;
        } else {
            return val.length == 0 ? [] : val;
        }
    };
    selectToRedux = (val, prevVal, obj, prevObj) => {
        if (val !== undefined) {
            if (val === null) {
                let newValNull = { ...prevVal };
                newValNull.label = null;
                newValNull.labelFull = null;
                newValNull.value = null;
                return newValNull;
            } else {
                let newVal = { ...prevVal };
                newVal.value = val.value;
                newVal.label = val.label;
                newVal.labelFull = val.label;
                return newVal;
            }
        }
    };
    showInput = arr => {
        return arr.some(
            el =>
                el.invType.id === this.props.invType &&
                el.docType.id === this.props.docType
        );
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
    checkboxToRedux=(val, prevVal)=>{
        let newVal = {...prevVal};
        const {yes,irreparablyDamagedTrue,irreparablyDamagedFalse, no} = this.props.tofiConstants
        if (prevVal === null) {
            let objVal ={}
            if (val=== true ){
                objVal = {
                    value: Number(irreparablyDamagedTrue.id),
                    kFromBase: val

                }
            }else {
                objVal = {
                    value: Number(irreparablyDamagedFalse.id),
                    kFromBase: val
                }
            }

            return (objVal)
        } else {
            if (val=== true ){
                newVal.value = Number(irreparablyDamagedTrue.id)
                newVal.kFromBase= val
            }else {
                newVal.value = Number(irreparablyDamagedFalse.id)
                newVal.kFromBase= val
            }


            return (newVal)

        }
    }
    checkboxToRedux2=(val, prevVal)=>{
        let newVal = {...prevVal};
        const {caseInsuranceTrue, caseInsuranceFalce} = this.props.tofiConstants
        if (prevVal === null) {
            let objVal ={}
            if (val=== true ){
                objVal = {
                    value: Number(caseInsuranceTrue.id),
                    kFromBase: val

                }
            }else {
                objVal = {
                    value: Number(caseInsuranceFalce.id),
                    kFromBase: val
                }
            }

            return (objVal)
        } else {
            if (val=== true ){
                newVal.value = Number(caseInsuranceTrue.id)
                newVal.kFromBase= val
            }else {
                newVal.value = Number(caseInsuranceFalce.id)
                newVal.kFromBase= val
            }


            return (newVal)

        }
    }
    checkboxToRedux3=(val, prevVal)=>{
        let newVal = {...prevVal};
        const {caseFundOfUseTrue, caseFundOfUseFalce} = this.props.tofiConstants
        if (prevVal === null) {
            let objVal ={}
            if (val=== true ){
                objVal = {
                    value: Number(caseFundOfUseTrue.id),
                    kFromBase: val

                }
            }else {
                objVal = {
                    value: Number(caseFundOfUseFalce.id),
                    kFromBase: val
                }
            }

            return (objVal)
        } else {
            if (val=== true ){
                newVal.value = Number(caseFundOfUseTrue.id)
                newVal.kFromBase= val
            }else {
                newVal.value = Number(caseFundOfUseFalce.id)
                newVal.kFromBase= val
            }


            return (newVal)

        }
    }




    render() {
    if (!this.props.tofiConstants) return null;

    this.lng = localStorage.getItem('i18nextLng');
    const {
      t, handleSubmit, reset, dirty, error, submitting, user, researchTypeValue, objStudyParentOptions,
      themeOptions, requestSourceOptions,workAssignedToIPSOptions, requestTypeOptions, caseDocsLangOptions, workAuthorOptions,
      workAssignedToOptions,
      tofiConstants: {propStudy, theme, workEndDate, requestSource, workAuthor, workAssignedTo,
        regNumber,outNumber, workDate, requestType, caseDocsLang, caseDbeg, caseDend, workPlannedEndDate}
    } = this.props;
    const { lang, loading: {workAssignedToIPSLoading,objStudyParentLoading, themeLoading, requestSourceLoading,
      requestTypeLoading, caseDocsLangLoading, workAuthorLoading, workAssignedToLoading} } = this.state;

    return (
      <Form className="antForm-spaceBetween" onSubmit={handleSubmit(this.onSubmit)}
            style={dirty ? {paddingBottom: '43px'} : {}}>


        {outNumber && <Field
            name='outNumber'
            component={renderInput}
            label={outNumber.name[this.lng]}
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            normalize={this.strToRedux}

        />}

        <Field
          name="researchType"
          component={renderSelect}
          disabled={!!this.props.initialValues.key}
          isSearchable={false}
          label={t('RESEARCH_TYPE')}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }


          data={['clsResearches', 'clsOrders', 'clsArchivalReferences']
            .map(cns => ({
              value: this.props.tofiConstants[cns].id,
              label: this.props.tofiConstants[cns].name[this.lng],
              researchTypeClass: cns
            }))}
          validate={requiredLabel}
          colon={true}
        />
        {regNumber && <Field
          name='regNumber'
          component={renderInput}
          label={regNumber.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          normalize={this.strToRedux}

        />}
        {workDate && <Field
          name="workDate"
          component={renderDatePicker}
          format={null}
          normalize={this.dateToRedux}

          label={t('REG_DATE')}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
        />}
        {requestSource && researchTypeValue && ['clsArchivalReferences'].includes(researchTypeValue.researchTypeClass) && <Field
          name="requestSource"
          component={renderSelect}
          isSearchable={false}
          label={requestSource.name[this.lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
          normalize={this.selectToRedux}

          isLoading={requestSourceLoading}
          data={requestSourceOptions ? requestSourceOptions.map(option => ({
            value: option.id,
            label: option.name[this.lng]
          })) : []}
          onFocus={this.loadOptions('requestSource')}
        />}
        {requestType && researchTypeValue && ['clsArchivalReferences'].includes(researchTypeValue.researchTypeClass) && <Field
          name="requestType"
          component={renderSelect}
          isSearchable={false}
          label={requestType.name[this.lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
          normalize={this.selectToRedux}

          isLoading={requestTypeLoading}
          data={requestTypeOptions ? requestTypeOptions.map(option => ({
            value: option.id,
            label: option.name[this.lng]
          })) : []}
          onFocus={this.loadOptions('requestType')}
        />}
        {caseDocsLang && <Field
          name="caseDocsLang"
          component={renderSelect}
          isSearchable={false}
          isMulti
          label={t('LANGUAGE_OF_QUERY')}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }

          isLoading={caseDocsLangLoading}
          data={caseDocsLangOptions ? caseDocsLangOptions.map(option => ({
            value: option.id,
            label: option.name[this.lng]
          })) : []}
          onFocus={this.loadOptions('caseDocsLang')}
        />}
        {theme && researchTypeValue && ['clsArchivalReferences'].includes(researchTypeValue.researchTypeClass) && <Field
          name="theme"
          component={ renderInputLang }
          format={value => (!!value ?value.valueLng[lang.theme] : '')}
          // parse={value => { this.themeValue[lang.theme] = value; return {...this.themeValue} }}
          label={theme.name[this.lng]}
          normalize={(val, prevVal, obj, prevObj) => {
              let newVal = { ...prevVal };
              newVal.value = val;
              if (!!newVal.valueLng) {
                  newVal.valueLng[lang.theme] = val;
              } else {
                  newVal["valueLng"] = { kz: "", en: "", ru: "" };
                  newVal.valueLng[lang.theme] = val;
              }
              return newVal;
          }}
          formItemClass="with-lang"
          changeLang={this.changeLang}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        {propStudy && researchTypeValue && ['clsOrders', 'clsResearches'].includes(researchTypeValue.researchTypeClass) && <Field
          name="propStudy"
          component={renderSelect}
          isSearchable={false}
          isMulti
          label={propStudy.name[this.lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
          isLoading={objStudyParentLoading}
          data={objStudyParentOptions ? objStudyParentOptions.map(option => ({
            value: option.id,
            label: option.name[this.lng]
          })) : []}
          onFocus={this.loadChilds('objStudyParent')}
        />}
        {/*{theme && researchTypeValue && ['clsArchivalReferences'].includes(researchTypeValue.researchTypeClass) && <Field
          name="theme"
          component={renderSelect}
          isSearchable={false}
          label={theme.name[this.lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
          isLoading={themeLoading}
          data={themeOptions ? themeOptions.map(option => ({
            value: option.id,
            label: option.name[this.lng]
          })) : []}
          onFocus={this.loadOptions('theme')}
        />}*/}
        {caseDbeg && <Field
          name="caseDbeg"
          component={renderDatePicker}
          format={null}
          label={t('PERIOD_IN')}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
          normalize={this.dateToRedux}

        />}
        {caseDend && <Field
          name="caseDend"
          component={renderDatePicker}
          format={null}
          label={t('PERIOD_OUT')}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
          normalize={this.dateToRedux}

        />}
        {workAuthor && <Field
          name="workAuthor"
          component={renderSelect}
          load
          label={workAuthor.name[this.lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
          isLoading={workAuthorLoading}
          data={workAuthorOptions ? workAuthorOptions.map(option => ({
            value: option.id,
            label: option.name[this.lng]
          })) : []}
          onFocus={this.loadOptions('workAuthor')}
          normalize={this.selectToRedux}

        />}
        {workAssignedTo && <Field
          name="workAssignedTo"
          component={renderSelect}
          label={workAssignedTo.name[this.lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
          normalize={this.selectToRedux}

          isLoading={workAssignedToIPSLoading}
          data={workAssignedToIPSOptions ? [...workAssignedToIPSOptions].map(option => ({
              value: option.id,
              label: option.name[this.lng]
          })) : []}
          onFocus={this.loadClsObj(['workAssignedToIPS'])}
        />}
        {workPlannedEndDate && <Field
          name="workPlannedEndDate"
          component={renderDatePicker}
          format={null}
          normalize={this.dateToRedux}

          label={t('PLANNED_END_DATE')}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
        />}
        {workEndDate && <Field
          name="workEndDate"
          component={renderDatePicker}
          format={null}
          normalize={this.dateToRedux}

          label={t('FACT_END_DATE')}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
        />}
        {dirty && <Form.Item className="ant-form-btns absolute-bottom">
          <Button className="signup-form__btn" type="primary" htmlType="submit" disabled={submitting}>
            {submitting ? t('LOADING...') : t('SAVE')}
          </Button>
          <Button className="signup-form__btn" type="danger" htmlType="button" disabled={submitting}
                  style={{marginLeft: '10px'}} onClick={reset}>
            {submitting ? t('LOADING...') : t('CANCEL')}
          </Button>
          {error && <span className="message-error"><i className="icon-error"/>{error}</span>}
        </Form.Item>}
      </Form>
    )
  }
}

const selector = formValueSelector('MainInfo');

function mapStateToProps(state) {
  const researchTypeValue = selector(state, 'researchType') || {};
  return {
    researchTypeValue,
    user: state.auth.user,
    objStudyParentOptions: state.generalData.objStudyParent,
    themeOptions: state.generalData.theme,
    requestSourceOptions: state.generalData.requestSource,
    requestTypeOptions: state.generalData.requestType,
    caseDocsLangOptions: state.generalData.caseDocsLang,
    workAuthorOptions: state.generalData.workAuthor,
    workAssignedToOptions: state.generalData.workAssignedTo,
    workAssignedToIPSOptions: state.generalData.workAssignedToIPS
}
}

export default connect(mapStateToProps, {getAllObjOfCls, getPropVal, getObjByObjVal, getObjChildsByConst})(reduxForm({
  form: 'MainInfo',
  enableReinitialize: true
})(MainInfo));
