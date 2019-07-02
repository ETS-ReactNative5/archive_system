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
      customerReqsValue: '',
      reasonForRefusalCaseValue: '',
      reasonForRefusalCaseStorageValue: '',
      lang: {
        customerReqs: localStorage.getItem("i18nextLng"),
        reasonForRefusalCase: localStorage.getItem("i18nextLng"),
        reasonForRefusalCaseStorage: localStorage.getItem("i18nextLng")
      }
    }
  }

  componentDidMount() {
    this.setState({
      customerReqsValue : {...this.props.initialValues.customerReqs},
      reasonForRefusalCaseValue : {...this.props.initialValues.reasonForRefusalCase},
      reasonForRefusalCaseStorageValue : {...this.props.initialValues.reasonForRefusalCaseStorage}
    })
  }

  changeLang = e => {
    this.setState({
      lang: {...this.state.lang, [e.target.name]: e.target.value}
    });
  };

  componentDidUpdate(prevProps) {
    if(prevProps.initialValues !== this.props.initialValues) {
      this.setState({
        customerReqsValue : {...this.props.initialValues.customerReqs},
        reasonForRefusalCaseValue : {...this.props.initialValues.reasonForRefusalCase},
        reasonForRefusalCaseStorageValue : {...this.props.initialValues.reasonForRefusalCaseStorage}
      })
    }
  }

  render() {
    const { lang } = this.state;
    this.lng = localStorage.getItem('i18nextLng');

    const {  tofiConstants: {customerReqs, reasonForRefusalCase, reasonForRefusalCaseStorage} } = this.props;
    debugger
    return (
      <Form className="antForm-spaceBetween">
        {customerReqs && (
          <Field
            name="customerReqs"
            component={renderTextareaLang}
            disabled
            format={value => (!!value ? value.valueLng[lang.customerReqs] : '')}
            // parse={value => { this.state.customerReqsValue[lang.customerReqs] = value; return {...this.state.customerReqsValue} }}
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
            format={value => (!!value ? value.valueLng[lang.reasonForRefusalCase] : '')}
            // parse={value => { this.state.reasonForRefusalCaseValue[lang.reasonForRefusalCaseValue] = value; return {...this.state.reasonForRefusalCaseValue} } }
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
            format={value => (!!value ? value.valueLng[lang.reasonForRefusalCaseStorage] : '')}
            // parse={value => { this.state.reasonForRefusalCaseStorageValue[lang.reasonForRefusalCaseStorage] = value; return {...this.state.reasonForRefusalCaseStorageValue} }}
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