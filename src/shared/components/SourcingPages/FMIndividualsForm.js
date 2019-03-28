import React, { Component } from 'react';
import {Button, Form} from 'antd';
import {Field, Fields, reduxForm} from 'redux-form';
import {required, requiredDate, requiredLabel, requiredLng} from '../../utils/form_validations';
import {
  renderAsyncSelect, renderDatePicker, renderDoubleDatePicker, renderFields, renderInput, renderInputLang,
  renderRadioGroup,
  renderSelect
} from '../../utils/form_components';
import {getPropValByConst, getAccessLevels} from '../../actions/actions';
import {four_digits} from '../../utils/form_normalizing';

class FMIndividualsForm extends Component {

  constructor(props) {
    super(props);

    const lng = localStorage.getItem('i18nextLng');
    this.state = {
      lang: {
        personLastName: lng,
        personName: lng,
        personPatronymic: lng,
        personAddress: lng,
        ownerLastName: lng,
        ownerName: lng,
        ownerPatronymic: lng,
        ownerAddress: lng,
      }
    };
  }

  changeLang = e => {
    this.setState({lang: {...this.state.lang, [e.target.name]: e.target.value}});
  };

  personLastNameValue = {kz: '', ru: '', en: ''};
  personNameValue = {kz: '', ru: '', en: ''};
  personPatronymicValue = {kz: '', ru: '', en: ''};
  personAddressValue = {kz: '', ru: '', en: ''};
  ownerLastNameValue = {kz: '', ru: '', en: ''};
  ownerNameValue = {kz: '', ru: '', en: ''};
  ownerPatronymicValue = {kz: '', ru: '', en: ''};
  ownerAddressValue = {kz: '', ru: '', en: ''};

  onSubmit = values => {
    console.log(values)
  };

  render() {
    if(!this.props.tofiConstants) return null;

    const lng = localStorage.getItem('i18nextLng');
    const { t, handleSubmit, reset, dirty, error, submitting, life, tofiConstants: {personLastName, personName, personPatronymic,
          dateOfBirth, dateOfDeath, personAcademicDegree, personAcademicTitle, personSpeciality, personAddress, personPhone, personEmail,
          ownerLastName, ownerName, ownerPatronymic, ownerStatus, ownerAddress, ownerPhone, ownerEmail, personLaborActivity,
          personLaborBeginYear, personLaborEndYear, personLaborPosition, personLaborOrg} } = this.props;
    const { lang } = this.state;
    return (
      <Form className="antForm-spaceBetween" onSubmit={handleSubmit(this.onSubmit)} style={dirty ? {paddingBottom: '43px'} : {}}>
        {personLastName && <Field
          name="personLastName"
          component={renderInputLang}
          format={value => (!!value ? value[lang.personLastName] : '')}
          parse={value => { this.personLastNameValue[lang.personLastName] = value; return {...this.personLastNameValue} }}
          label={personLastName.name[lng]}
          formItemClass="with-lang"
          changeLang={this.changeLang}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        {personName && <Field
          name="personName"
          component={renderInputLang}
          format={value => (!!value ? value[lang.personName] : '')}
          parse={value => { this.personNameValue[lang.personName] = value; return {...this.personNameValue} }}
          label={personName.name[lng]}
          formItemClass="with-lang"
          changeLang={this.changeLang}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        {personPatronymic && <Field
          name="personPatronymic"
          component={renderInputLang}
          format={value => (!!value ? value[lang.personPatronymic] : '')}
          parse={value => { this.personPatronymicValue[lang.personPatronymic] = value; return {...this.personPatronymicValue} }}
          label={personPatronymic.name[lng]}
          formItemClass="with-lang"
          changeLang={this.changeLang}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        {life && <Fields
          names={[ 'dateOfBirth', 'dateOfDeath' ]}
          component={renderDoubleDatePicker}
          label={life[lng]}
          format={null}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        {personAcademicDegree && <Field
          name="personAcademicDegree"
          component={ renderSelect }
          label={personAcademicDegree.name[lng]}
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
        {personAcademicTitle && <Field
          name="personAcademicTitle"
          component={ renderSelect }
          label={personAcademicTitle.name[lng]}
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
        {personSpeciality && <Field
          name="personSpeciality"
          component={ renderSelect }
          label={personSpeciality.name[lng]}
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
        {personAddress && <Field
          name="personAddress"
          component={renderInputLang}
          format={value => (!!value ? value[lang.personAddress] : '')}
          parse={value => { this.personAddressValue[lang.personAddress] = value; return {...this.personAddressValue} }}
          label={personAddress.name[lng]}
          formItemClass="with-lang"
          changeLang={this.changeLang}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        {personPhone && <Field
          name="personPhone"
          component={ renderInput }
          label={personPhone.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        {personEmail && <Field
          name="personEmail"
          component={ renderInput }
          label={personEmail.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        <Form.Item style={{marginBottom: '5px'}}><h2>{t('OWNER_INFO_INDIVIDUAL')}</h2></Form.Item>
        {ownerLastName && <Field
          name="ownerLastName"
          component={renderInputLang}
          format={value => (!!value ? value[lang.ownerLastName] : '')}
          parse={value => { this.ownerLastNameValue[lang.ownerLastName] = value; return {...this.ownerLastNameValue} }}
          label={ownerLastName.name[lng]}
          formItemClass="with-lang"
          changeLang={this.changeLang}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        {ownerName && <Field
          name="ownerName"
          component={renderInputLang}
          format={value => (!!value ? value[lang.ownerName] : '')}
          parse={value => { this.ownerNameValue[lang.ownerName] = value; return {...this.ownerNameValue} }}
          label={ownerName.name[lng]}
          formItemClass="with-lang"
          changeLang={this.changeLang}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        {ownerPatronymic && <Field
          name="ownerPatronymic"
          component={renderInputLang}
          format={value => (!!value ? value[lang.ownerPatronymic] : '')}
          parse={value => { this.ownerPatronymicValue[lang.ownerPatronymic] = value; return {...this.ownerPatronymicValue} }}
          label={ownerPatronymic.name[lng]}
          formItemClass="with-lang"
          changeLang={this.changeLang}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        {ownerStatus && <Field
          name="ownerStatus"
          component={ renderSelect }
          label={ownerStatus.name[lng]}
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
        {ownerAddress && <Field
          name="ownerAddress"
          component={renderInputLang}
          format={value => (!!value ? value[lang.ownerAddress] : '')}
          parse={value => { this.ownerAddressValue[lang.ownerAddress] = value; return {...this.ownerAddressValue} }}
          label={ownerAddress.name[lng]}
          formItemClass="with-lang"
          changeLang={this.changeLang}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        {ownerPhone && <Field
          name="ownerPhone"
          component={ renderInput }
          label={ownerPhone.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        {ownerEmail && <Field
          name="ownerEmail"
          component={ renderInput }
          label={ownerEmail.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
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

export default reduxForm({ form: 'FMIndividualsForm', enableReinitialize: true })(FMIndividualsForm);
