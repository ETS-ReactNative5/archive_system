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

  render() {
    const { lang } = this.state;
    this.lng = localStorage.getItem('i18nextLng');

    const {  tofiConstants: {customerReqs, reasonForRefusalCase, reasonForRefusalCaseStorage} } = this.props;
    return (
      <Form className="antForm-spaceBetween">
        {customerReqs && (
          <Field
            name="customerReqs"
            component={renderTextareaLang}
            disabled
            format={value => (!!value ? value[lang.customerReqs] : '')}
            parse={value => { this.customerReqsValue[lang.customerReqs] = value; return {...this.customerReqsValue} }}
            label={customerReqs.name[this.lng]}
            formItemClass="with-lang--column"
            changeLang={this.changeLang}
          />
        )}
        {reasonForRefusalCase && (
          <Field
            name="reasonForRefusalCase"
            component={renderTextareaLang}
            disabled
            format={value => (!!value ? value[lang.reasonForRefusalCase] : '')}
            parse={value => { this.reasonForRefusalCaseValue[lang.reasonForRefusalCase] = value; return {...this.reasonForRefusalCaseValue} }}
            label={reasonForRefusalCase.name[this.lng]}
            formItemClass="with-lang--column"
            changeLang={this.changeLang}
          />
        )}
        {reasonForRefusalCaseStorage && (
          <Field
            name="reasonForRefusalCaseStorage"
            component={renderTextareaLang}
            disabled
            format={value => (!!value ? value[lang.reasonForRefusalCaseStorage] : '')}
            parse={value => { this.reasonForRefusalCaseStorageValue[lang.reasonForRefusalCaseStorage] = value; return {...this.reasonForRefusalCaseStorageValue} }}
            label={reasonForRefusalCaseStorage.name[this.lng]}
            formItemClass="with-lang--column"
            changeLang={this.changeLang}
          />
        )}
      </Form>
    )
  }
}

export default reduxForm({ form: 'WorkDescription', enableReinitialize: true })(WorkDescription);