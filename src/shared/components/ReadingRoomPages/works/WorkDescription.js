import React from 'react';
import { Field, reduxForm } from 'redux-form';
import {Button, Form} from "antd";
import {renderTextareaLang} from "../../../utils/form_components";
import {CUBE_FOR_WORKS, DO_FOR_WORKS, DP_FOR_WORKS} from "../../../constants/tofiConstants";
import {isEqual, pickBy} from "lodash";

class WorkDescription extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      lang: {
        customerReqs: localStorage.getItem("i18nextLng"),
        reasonForRefusalCase: localStorage.getItem("i18nextLng"),
        reasonForRefusalCaseStorage: localStorage.getItem("i18nextLng")
      }
    }
  }

  componentDidMount() {
    this.customerReqsValue = {...this.props.initialValues.customerReqs};
    this.reasonForRefusalCaseValue = {...this.props.initialValues.reasonForRefusalCase};
    this.reasonForRefusalCaseStorageValue = {...this.props.initialValues.reasonForRefusalCaseStorage};
  }

  changeLang = e => {
    this.setState({
      lang: {...this.state.lang, [e.target.name]: e.target.value}
    });
  };

  componentDidUpdate(prevProps) {
    if(prevProps.initialValues !== this.props.initialValues) {
      this.customerReqsValue = {...this.props.initialValues.customerReqs};
      this.reasonForRefusalCaseValue = {...this.props.initialValues.reasonForRefusalCase};
      this.reasonForRefusalCaseStorageValue = {...this.props.initialValues.reasonForRefusalCaseStorage};
    }
  }
  onSubmit = values => {
    const rest = pickBy(values, (val, key) => !isEqual(val, this.props.initialValues[key]));
    const cube = {
      cubeSConst: CUBE_FOR_WORKS,
      doConst: DO_FOR_WORKS,
      dpConst: DP_FOR_WORKS
    };
    const obj = {
      doItem: this.props.initialValues.key,
    };
    return this.props.saveProps({cube, obj}, {values: rest}, this.props.tofiConstants);
  };

  render() {
    const { lang } = this.state;
    this.lng = localStorage.getItem('i18nextLng');

    const {  t, handleSubmit, reset, dirty, error, submitting,
      tofiConstants: {customerReqs, reasonForRefusalCase, reasonForRefusalCaseStorage} } = this.props;
    return (
      <Form className="antForm-spaceBetween" onSubmit={handleSubmit(this.onSubmit)}
            style={dirty ? {paddingBottom: '43px'} : {}}>
        {/*<Form.Item><h3>{t('CUSTOMER_REQUIREMENTS')}</h3></Form.Item>*/}
        {customerReqs && (
          <Field
            name="customerReqs"
            component={renderTextareaLang}
            format={value => (!!value ? value.valueLng[lang.customerReqs] : '')}
            // parse={value => { this.customerReqsValue[lang.customerReqs] = value; return {...this.customerReqsValue} }}
            normalize={(val, prevVal, obj, prevObj) => {
                let newVal = { ...prevVal };
                newVal.value = val;
                if (!!newVal.valueLng) {
                    newVal.valueLng[lang.customerReqs] = val;
                } else {
                    newVal["valueLng"] = { kz: "", en: "", ru: "" };
                    newVal.valueLng[lang.customerReqs] = val;
                }
                return newVal;
            }}
            label={customerReqs.name[this.lng]}
            formItemClass="with-lang--column"
            changeLang={this.changeLang}
            /*formItemLayout={{
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }}*/
          />
        )}
        {reasonForRefusalCase && (
          <Field
            name="reasonForRefusalCase"
            component={renderTextareaLang}
            format={value => (!!value ? value.valueLng[lang.reasonForRefusalCase] : '')}
            // parse={value => { this.reasonForRefusalCaseValue[lang.reasonForRefusalCase] = value; return {...this.reasonForRefusalCaseValue} }}
            normalize={(val, prevVal, obj, prevObj) => {
                let newVal = { ...prevVal };
                newVal.value = val;
                if (!!newVal.valueLng) {
                    newVal.valueLng[lang.reasonForRefusalCase] = val;
                } else {
                    newVal["valueLng"] = { kz: "", en: "", ru: "" };
                    newVal.valueLng[lang.reasonForRefusalCase] = val;
                }
                return newVal;
            }}
            label={reasonForRefusalCase.name[this.lng]}
            formItemClass="with-lang--column"
            changeLang={this.changeLang}
            /*formItemLayout={{
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }}*/
          />
        )}
        {reasonForRefusalCaseStorage && (
          <Field
            name="reasonForRefusalCaseStorage"
            component={renderTextareaLang}
            format={value => (!!value ? value.valueLng[lang.reasonForRefusalCaseStorage] : '')}
            // parse={value => { this.reasonForRefusalCaseStorageValue[lang.reasonForRefusalCaseStorage] = value; return {...this.reasonForRefusalCaseStorageValue} }}
            normalize={(val, prevVal, obj, prevObj) => {
                let newVal = { ...prevVal };
                newVal.value = val;
                if (!!newVal.valueLng) {
                    newVal.valueLng[lang.reasonForRefusalCaseStorage] = val;
                } else {
                    newVal["valueLng"] = { kz: "", en: "", ru: "" };
                    newVal.valueLng[lang.reasonForRefusalCaseStorage] = val;
                }
                return newVal;
            }}
            label={reasonForRefusalCaseStorage.name[this.lng]}
            formItemClass="with-lang--column"
            changeLang={this.changeLang}
            /*formItemLayout={{
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }}*/
          />
        )}
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

export default reduxForm({ form: 'WorkDescription', enableReinitialize: true })(WorkDescription);