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
      name[lang] = values.regNumber;
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
        />}
        {workDate && <Field
          name="workDate"
          component={renderDatePicker}
          format={null}
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
          format={value => (!!value ? value[lang.theme] : '')}
          parse={value => { this.themeValue[lang.theme] = value; return {...this.themeValue} }}
          label={theme.name[this.lng]}
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
        />}
        {workAuthor && <Field
          name="workAuthor"
          component={renderSelect}load
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
