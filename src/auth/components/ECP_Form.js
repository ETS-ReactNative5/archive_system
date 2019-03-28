import React from 'react';
import { Field, reduxForm } from 'redux-form';
import {Button, Form, message} from 'antd';
import {required, requiredEmail} from "../../shared/utils/form_validations";
import {renderInput, renderSelect, renderTextarea} from "../../shared/utils/form_components";
import {showFileChooser, signXml} from "../../shared/utils/ncaLayers";
import {isEmpty} from "lodash";

class ECP_Form extends React.Component {

  componentDidMount() {
    window.signXmlBack = function signXmlBack(result) {
      // typeof this.loading === 'function' && this.loading();
      if (result['code'] === "500") {
        alert(result['message']);
      } else if (result['code'] === "200") {
        const res = result['responseObject'];
        this.props.change('signedXml', res);
        // if we would have to use refs
        // this.signedXml.val(res);
      }
    };
    window.showFileChooserCall = function showFileChooserCall() {
      showFileChooser("ALL", "", "showFileChooserBack");
    };

    // don't know how to use it
    // window.showFileChooserBack = function showFileChooserBack(result) {
    //   if (result['code'] === "500") {
    //     alert(result['message']);
    //   } else if (result['code'] === "200") {
    //     var res = result['responseObject'];
    //     $("#filePath").val(res);
    //   }
    // }
  }

  componentWillUnmount() {
    // cleaning
    delete window.signXmlBack;
    delete window.showFileChooserCall;
  }

  onSubmit = values => {
    const xmlToSign = "<xml><sval>" + values.personLastName +
      "</sval><fval>" + values.personName + "</fval><emval>" + values.email + "</emval></xml>";
    // this.loading = message.loading('Loading', 0);
    signXml(values.selectedStorage.value, "SIGNATURE", xmlToSign, "signXmlBack");
  };

  render() {
    if(isEmpty(this.props.tofiConstants)) return null;
    this.lng = localStorage.getItem('i18nextLng');
    const { t, handleSubmit, tofiConstants: { personLastName, personName } } = this.props;
    return (
      <Form onSubmit={handleSubmit(this.onSubmit)} className='ECP_Form antForm-spaceBetween'>
        <Field
          name='selectedStorage'
          component={renderSelect}
          formItemClass='hidden'
          data={[{ value: 'PKCS12', label: 'PKCS12' }]}
        />
        <Field
          name="personLastName"
          formItemClass="signup-form__input"
          component={renderInput}
          placeholder={t("LAST_NAME_PLACEHOLDER")}
          label={personLastName.name[this.lng]}
          formItemLayout={{
            labelCol: {span: 10},
            wrapperCol: {span: 14}
          }}
          colon={true}
          validate={required}
        />
        <Field
          name="personName"
          formItemClass="signup-form__input"
          component={renderInput}
          placeholder={t("FIRST_NAME_PLACEHOLDER")}
          label={personName.name[this.lng]}
          formItemLayout={{
            labelCol: {span: 10},
            wrapperCol: {span: 14}
          }}
          validate={required}
          colon={true}
        />
        <Field
          name="email"
          formItemClass="signup-form__input"
          component={renderInput}
          label={t('EMAIL')}
          formItemLayout={{
            labelCol: {span: 10},
            wrapperCol: {span: 14}
          }}
          colon={true}
          validate={requiredEmail}
        />
        <Form.Item>
          <Button className="signup-form__btn" type="primary" htmlType="submit">
            {t('SIGN')}
          </Button>
        </Form.Item>
        <Field
          name='signedXml'
          component={renderTextarea}
          disabled
          formItemLayout={{
            labelCol: {span: 10},
            wrapperCol: {span: 14}
          }}
          label={t('SIGNED_XML')}
        />
      </Form>
    )
  }

}

export default reduxForm({form: 'ECP_FORM', initialValues: { selectedStorage: { value: 'PKCS12', label: 'PKCS12' } }})(ECP_Form);