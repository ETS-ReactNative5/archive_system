import React, { Component } from 'react';
import {Button, Form} from 'antd';
import { Field, reduxForm } from 'redux-form';
import {required, requiredDate, requiredLabel, requiredLng} from '../../utils/form_validations';
import {
  renderAsyncSelect, renderDatePicker, renderInput, renderInputLang, renderRadioGroup,
  renderSelect
} from '../../utils/form_components';
import {getPropValByConst, getAccessLevels} from '../../actions/actions';
import {four_digits} from '../../utils/form_normalizing';

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
        orgLiquidationDoc: lng
      }
    };
  }

  changeLang = e => {
    this.setState({lang: {...this.state.lang, [e.target.name]: e.target.value}});
  };

  shortNameValue = {kz: '', ru: '', en: ''};
  nameValue = {kz: '', ru: '', en: ''};
  orgAddressValue = {kz: '', ru: '', en: ''};
  orgFormationDocValue = {kz: '', ru: '', en: ''};
  orgReorganizationDocValue = {kz: '', ru: '', en: ''};
  orgLiquidationDocValue = {kz: '', ru: '', en: ''};

  onSubmit = values => {
   // console.log(values)
  };

  render() {
    if(!this.props.tofiConstants) return null;

    const lng = localStorage.getItem('i18nextLng');
    const { t, handleSubmit, reset, dirty, error, submitting, tofiConstants: {legalStatus,
      formOfAdmission, orgIndustry, isActive, orgLocation, orgPhone, orgFax, orgEmail, orgAddress,
      orgFormationDoc, orgReorganizationDoc, orgLiquidationDoc} } = this.props;
    const { lang } = this.state;

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
          // validate={requiredLng}
          // colon={true}
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
          // validate={requiredLng}
          // colon={true}
        />
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
          data={[
            {label: 'one', value: '1'}
          ]}
          // validate={required}
          // colon={true}
        />}
        {formOfAdmission && <Field
          name="formOfAdmission"
          component={ renderSelect }
          data={[
            {label: 'one', value: '1'}
          ]}
          isSearchable={false}
          label={formOfAdmission.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          // validate={requiredLabel}
          // colon={true}
        />}
        {orgIndustry && <Field
          name="orgIndustry"
          component={ renderSelect }
          data={[
            {label: 'one', value: '1'}
          ]}
          isSearchable={false}
          label={orgIndustry.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          // validate={requiredLabel}
          // colon={true}
        />}
        {isActive && <Field
          name="isActive"
          component={ renderSelect }
          data={[
            {label: 'one', value: '1'}
          ]}
          isSearchable={false}
          label={isActive.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          // validate={requiredLabel}
          // colon={true}
        />}
        {orgLocation && <Field
          name="orgLocation"
          component={ renderSelect }
          data={[
            {label: 'one', value: '1'}
          ]}
          isSearchable={false}
          label={orgLocation.name[lng]}
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
          // validate={requiredLng}
          // colon={true}
        />}
        {orgPhone && <Field
          name="orgPhone"
          component={ renderInput }
          placeholder={t('USER_FIO_PLACEHOLDER')}
          label={orgPhone.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        {orgFax && <Field
          name="orgFax"
          component={ renderInput }
          placeholder={t('USER_FIO_PLACEHOLDER')}
          label={orgFax.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        {orgEmail && <Field
          name="orgEmail"
          component={ renderInput }
          placeholder={t('USER_FIO_PLACEHOLDER')}
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
          // validate={requiredLng}
          // colon={true}
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
          // validate={requiredLng}
          // colon={true}
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
          // validate={requiredLng}
          // colon={true}
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

export default reduxForm({ form: 'MainInfoFundMaker', enableReinitialize: true })(MainInfoFundMaker);
