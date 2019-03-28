import React, { Component } from 'react';
import {Button, Form} from 'antd';
import { Field, reduxForm } from 'redux-form';
import {
  renderAsyncSelect, renderAsyncSelectVirt, renderDatePicker, renderFileUpload, renderInputLang} from '../../../utils/form_components';
import {getPropValByConst} from '../../../actions/actions';

class WorksPropertyForm extends Component {

  constructor(props) {
    super(props);

    const lng = localStorage.getItem('i18nextLng');

    this.state = {
      lang: {
        checkResult: lng,
        checkOffering: lng,
        checkOfferingResult: lng
      }
    };
  }

  changeLang = e => {
    this.setState({lang: {...this.state.lang, [e.target.name]: e.target.value}});
  };

  checkResultValue = {kz: '', ru: '', en: ''};
  checkOfferingValue = {kz: '', ru: '', en: ''};
  checkOfferingResultValue = {kz: '', ru: '', en: ''};

  onSubmit = values => {
    console.log(values)
  };

  getCheckSourceOptions = () => getPropValByConst('checkSource')
    .then(json=>({
      options: json.data.map(item => (
        {value: item.id, label: item.name[this.lng]})
      )
    }));
  getCheckType = () => getPropValByConst('checkType')
    .then(json=>({
      options: json.data.map(item => (
        {value: item.id, label: item.name[this.lng]})
      )
    }));
  getCheckAuthorOptions = () => getPropValByConst('checkAuthor')
    .then(json=>({
      options: json.data.map(item => (
        {value: item.id, label: item.name[this.lng]})
      )
    }));

  render() {
    if(!this.props.tofiConstants) return null;

    this.lng = localStorage.getItem('i18nextLng');
    const { t, handleSubmit, reset, dirty, error, submitting, tofiConstants: {checkSource, checkDate,
      checkType, checkAuthor, checkResult, checkOffering, checkOfferingResult, checkFile} } = this.props;
    const { lang } = this.state;

    return (
      <Form className="antForm-spaceBetween" onSubmit={handleSubmit(this.onSubmit)} style={dirty ? {paddingBottom: '43px'} : {}}>
        {checkSource && <Field
          name="checkSource"
          component={ renderAsyncSelectVirt }
          label={checkSource.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          loadOptions={this.getCheckSourceOptions}
          // validate={required}
          // colon={true}
        />}
        {checkType && <Field
          name="checkType"
          component={ renderAsyncSelect }
          isSearchable={false}
          label={checkType.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          loadOptions={this.getCheckType}
          // validate={requiredLabel}
          // colon={true}
        />}
        {checkDate && <Field
          name="checkDate"
          component={ renderDatePicker }
          format={null}
          isSearchable={false}
          label={checkDate.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        {checkAuthor&& <Field
          name="checkAuthor"
          component={ renderAsyncSelectVirt }
          label={checkAuthor.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          loadOptions={this.getCheckAuthorOptions}
          // validate={requiredLabel}
          // colon={true}
        />}
        {checkResult && <Field
          name="checkResult"
          component={ renderInputLang }
          format={value => (!!value ? value[lang.checkResult] : '')}
          parse={value => { this.checkResultValue[lang.checkResult] = value; return {...this.checkResultValue} }}
          label={checkResult.name[this.lng]}
          formItemClass="with-lang"
          changeLang={this.changeLang}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          // validate={requiredLng}
          // colon={true}
        />}
        {checkOffering && <Field
          name="checkOffering"
          component={ renderInputLang }
          format={value => (!!value ? value[lang.checkOffering] : '')}
          parse={value => { this.checkOfferingValue[lang.checkOffering] = value; return {...this.checkOfferingValue} }}
          label={checkOffering.name[this.lng]}
          formItemClass="with-lang"
          changeLang={this.changeLang}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          // validate={requiredLng}
          // colon={true}
        />}
        {checkOfferingResult && <Field
          name="checkOfferingResult"
          component={ renderInputLang }
          format={value => (!!value ? value[lang.checkOfferingResult] : '')}
          parse={value => { this.checkOfferingResultValue[lang.checkOfferingResult] = value; return {...this.checkOfferingResultValue} }}
          label={checkOfferingResult.name[this.lng]}
          formItemClass="with-lang"
          changeLang={this.changeLang}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          // validate={requiredLng}
          // colon={true}
        />}
        {checkFile && <Field
          name="checkFile"
          component={renderFileUpload}
          format={null}
          label={checkFile.name[this.lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
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

export default reduxForm({ form: 'WorksPropertyForm', enableReinitialize: true })(WorksPropertyForm);
