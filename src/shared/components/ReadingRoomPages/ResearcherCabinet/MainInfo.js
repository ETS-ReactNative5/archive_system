import React, {Component} from 'react';
import {Button, Form} from 'antd';
import {Field, reduxForm, formValueSelector} from 'redux-form';
import {renderDatePicker, renderInputLang, renderSelect} from '../../../utils/form_components';
import {connect} from 'react-redux';
import moment from 'moment';
import {getAllObjOfCls, getObjByObjVal, getObjChildsByConst, getPropVal} from '../../../actions/actions';
import {isEqual, pickBy} from 'lodash';
import {requiredLabel} from '../../../utils/form_validations';

const FormItem = Form.Item;

class MainInfo extends Component {

  constructor(props) {
    super(props);

    this.state = {
      lang: {
        name: localStorage.getItem('i18nextLng')
      },
      loading: {
        objStudyParentLoading: false,
        requestSubjectLoading: false
      }
    };
  }

  nameValue = {...this.props.initialValues.name};

  changeLang = e => {
    this.setState({lang: {...this.state.lang, [e.target.name]: e.target.value}});
  };

  componentDidUpdate(prevProps) {
    if(prevProps.initialValues !== this.props.initialValues) {
      this.nameValue = {...this.props.initialValues.name};
    }
  }

  onSubmit = values => {
    const {researchType, name, ...rest} = pickBy(values, (val, key) => !isEqual(val, this.props.initialValues[key]));
    const cube = {
      cubeSConst: 'cubeStudy',
      doConst: 'doCubeStudy',
      dpConst: 'dpCubeStudy'
    };
    const obj = {
      name: values.name,
      fullName: values.name,
      clsConst: values.researchType.researchTypeClass,
    };
    if (!this.props.initialValues.key) {
      return this.props.onCreateObj(
        {cube, obj},
        {
          values: rest
        })
    }
    const objData = {};
    if(name) {
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
          this.setState({loading: {...this.state.loading, [c + 'Loading']: true}});
          this.props.getAllObjOfCls(c, dte)
            .then(() => this.setState({loading: {...this.state.loading, [c + 'Loading']: false}}))
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
      requestSubjectOptions, requestSourceOptions,
      tofiConstants: {propStudy, requestSubject, workEndDate, requestSource}
    } = this.props;
    const { lang, objStudyParentLoading, requestSubjectLoading, requestSourceLoading } = this.state;

    return (
      <Form className="antForm-spaceBetween" onSubmit={handleSubmit(this.onSubmit)}
            style={dirty ? {paddingBottom: '43px'} : {}}>
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
        />
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
        {requestSubject && researchTypeValue && ['clsArchivalReferences'].includes(researchTypeValue.researchTypeClass) && <Field
          name="requestSubject"
          component={renderSelect}
          isSearchable={false}
          label={requestSubject.name[this.lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
          isLoading={requestSubjectLoading}
          data={requestSubjectOptions ? requestSubjectOptions.map(option => ({
            value: option.id,
            label: option.name[this.lng]
          })) : []}
          onFocus={this.loadOptions('requestSubject')}
        />}
        {workEndDate && <Field
          name="workEndDate"
          component={renderDatePicker}
          format={null}
          label={workEndDate.name[this.lng]}
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
        {dirty && <Form.Item className="ant-form-btns">
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
    requestSubjectOptions: state.generalData.requestSubject,
    requestSourceOptions: state.generalData.requestSource
  }
}

export default connect(mapStateToProps, {getAllObjOfCls, getPropVal, getObjByObjVal, getObjChildsByConst})(reduxForm({
  form: 'MainInfo',
  enableReinitialize: true
})(MainInfo));
