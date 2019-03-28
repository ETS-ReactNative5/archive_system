import React from 'react';
import { reduxForm, Field } from 'redux-form';
import {Button, Form} from 'antd';
import {renderSelect, renderTextareaLang} from "../../../../utils/form_components";

class DescriptiveInfo extends React.Component {

  state = {
    lang: {
      documentContent: localStorage.getItem("i18nextLng")
    }
  };

  documentContentValue = {...this.props.initialValues.documentContent};
  changeLang = e => {
    this.setState({
      lang: {...this.state.lang, [e.target.name]: e.target.value}
    });
  };

  componentDidUpdate(prevProps) {
    if(prevProps.initialValues !== this.props.initialValues) {
      this.documentContentValue = {...this.props.initialValues.documentContent};
    }
  }

  render() {

    this.lng = localStorage.getItem('i18nextLng');
    const { lang } = this.state;
    const { t, dirty, error, reset, submitting, tofiConstants: { linkToKatalog, linkToUkaz, linkToObzor, documentContent } } = this.props;

    return (
      <Form>
        {linkToKatalog && <Field
          name='linkToKatalog'
          disabled
          component={renderSelect}
          label={linkToKatalog.name[this.lng]}
          formItemLayout={{
            labelCol: {span: 10},
            wrapperCol: {span: 14}
          }}
        />}
        {linkToUkaz && <Field
          name='linkToUkaz'
          disabled
          component={renderSelect}
          label={linkToUkaz.name[this.lng]}
          formItemLayout={{
            labelCol: {span: 10},
            wrapperCol: {span: 14}
          }}
        />}
        {linkToObzor && <Field
          name='linkToObzor'
          disabled
          component={renderSelect}
          label={linkToObzor.name[this.lng]}
          formItemLayout={{
            labelCol: {span: 10},
            wrapperCol: {span: 14}
          }}
        />}
        {documentContent && (
          <Field
            name="documentContent"
            component={renderTextareaLang}
            format={value => (!!value ? value[lang.documentContent] : '')}
            parse={value => { this.documentContentValue[lang.documentContent] = value; return {...this.documentContentValue} }}
            label={documentContent.name[this.lng]}
            formItemClass="with-lang"
            changeLang={this.changeLang}
            formItemLayout={{
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }}
          />
        )}
        {dirty && (
          <Form.Item className="ant-form-btns absolute-bottom">
            <Button
              className="signup-form__btn"
              type="primary"
              htmlType="submit"
              disabled={submitting}
            >
              {submitting ? t("LOADING...") : t("SAVE")}
            </Button>
            <Button
              className="signup-form__btn"
              type="danger"
              htmlType="button"
              disabled={submitting}
              style={{marginLeft: "10px"}}
              onClick={reset}
            >
              {submitting ? t("LOADING...") : t("CANCEL")}
            </Button>
            {error && (
              <span className="message-error">
                <i className="icon-error"/>
                {error}
              </span>
            )}
          </Form.Item>
        )}
      </Form>
    )
  }
}

export default reduxForm({ form: 'DescriptiveInfo' })(DescriptiveInfo);