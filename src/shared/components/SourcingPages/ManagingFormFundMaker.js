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

class ManagingFormFundMaker extends Component {

  constructor(props) {
    super(props);

    const lng = localStorage.getItem('i18nextLng');
    this.state = {
      lang: {
        leaderFIO: lng,
        leaderPosition: lng,
        depLeaderFIO: lng,
        depLeaderPosition: lng,
        responsibleFIO: lng,
        responsiblePosition: lng,
        archiveLeaderFIO: lng,
        archiveLeaderPosition: lng,
        commissionLeaderFIO: lng,
        commissionLeaderPosition: lng
      }
    };
  }

  changeLang = e => {
    this.setState({lang: {...this.state.lang, [e.target.name]: e.target.value}});
  };

  leaderFIOValue = {kz: '', ru: '', en: ''};
  leaderPositionValue = {kz: '', ru: '', en: ''};
  depLeaderFIOValue = {kz: '', ru: '', en: ''};
  depLeaderPositionValue = {kz: '', ru: '', en: ''};
  responsibleFIOValue = {kz: '', ru: '', en: ''};
  responsiblePositionValue = {kz: '', ru: '', en: ''};
  archiveLeaderFIOValue = {kz: '', ru: '', en: ''};
  archiveLeaderPositionValue = {kz: '', ru: '', en: ''};
  commissionLeaderFIOValue = {kz: '', ru: '', en: ''};
  commissionLeaderPositionValue = {kz: '', ru: '', en: ''};

  onSubmit = values => {
    console.log(values)
  };

  render() {
    if(!this.props.tofiConstants) return null;

    const lng = localStorage.getItem('i18nextLng');
    const { t, handleSubmit, reset, dirty, error, submitting, tofiConstants: {leaderFIO, leaderPosition, leaderPhone,
      depLeaderFIO, depLeaderPosition, depLeaderPhone, responsibleFIO, responsiblePosition, responsiblePhone,
      responsibleAppointmentDate, archiveLeaderFIO, archiveLeaderPosition, archiveLeaderPhone, archiveLeaderAppointmentDate,
      commissionLeaderFIO, commissionLeaderPosition, commissionLeaderPhone} } = this.props;
    const { lang } = this.state;

    return (
      <Form className="antForm-spaceBetween" onSubmit={handleSubmit(this.onSubmit)} style={dirty ? {paddingBottom: '43px'} : {}}>
        <Form.Item style={{marginBottom: '5px'}}><h2>{t('LEADER')}</h2></Form.Item>
        {leaderFIO && <Field
          name="leaderFIO"
          component={ renderInputLang }
          format={value => (!!value ? value[lang.leaderFIO] : '')}
          parse={value => { this.leaderFIOValue[lang.leaderFIO] = value; return {...this.leaderFIOValue} }}
          label={leaderFIO.name[lng]}
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
        {leaderPosition && <Field
          name="leaderPosition"
          component={ renderInputLang }
          format={value => (!!value ? value[lang.leaderPosition] : '')}
          parse={value => { this.leaderPositionValue[lang.leaderPosition] = value; return {...this.leaderPositionValue} }}
          label={leaderPosition.name[lng]}
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
        {leaderPhone && <Field
          name="leaderPhone"
          component={ renderInput }
          label={leaderPhone.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        <Form.Item style={{marginBottom: '5px'}}><h2>{t('DEP_LEADER')}</h2></Form.Item>
        {depLeaderFIO && <Field
          name="depLeaderFIO"
          component={ renderInputLang }
          format={value => (!!value ? value[lang.depLeaderFIO] : '')}
          parse={value => { this.depLeaderFIOValue[lang.depLeaderFIO] = value; return {...this.depLeaderFIOValue} }}
          label={depLeaderFIO.name[lng]}
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
        {depLeaderPosition && <Field
          name="depLeaderPosition"
          component={ renderInputLang }
          format={value => (!!value ? value[lang.depLeaderPosition] : '')}
          parse={value => { this.depLeaderPositionValue[lang.depLeaderPosition] = value; return {...this.depLeaderPositionValue} }}
          label={depLeaderPosition.name[lng]}
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
        {depLeaderPhone && <Field
          name="depLeaderPhone"
          component={ renderInput }
          label={depLeaderPhone.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        <Form.Item style={{marginBottom: '5px'}}><h2>{t('RESPONSIBLE')}</h2></Form.Item>
        {responsibleFIO && <Field
          name="responsibleFIO"
          component={ renderInputLang }
          format={value => (!!value ? value[lang.responsibleFIO] : '')}
          parse={value => { this.responsibleFIOValue[lang.responsibleFIO] = value; return {...this.responsibleFIOValue} }}
          label={responsibleFIO.name[lng]}
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
        {responsiblePosition && <Field
          name="responsiblePosition"
          component={ renderInputLang }
          format={value => (!!value ? value[lang.responsiblePosition] : '')}
          parse={value => { this.responsiblePositionValue[lang.responsiblePosition] = value; return {...this.responsiblePositionValue} }}
          label={responsiblePosition.name[lng]}
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
        {responsiblePhone && <Field
          name="responsiblePhone"
          component={ renderInput }
          label={responsiblePhone.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        {responsibleAppointmentDate && <Field
          name="responsibleAppointmentDate"
          component={ renderInput }
          label={responsibleAppointmentDate.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        <Form.Item style={{marginBottom: '5px'}}><h2>{t('ARCHIVE_LEADER')}</h2></Form.Item>
        {archiveLeaderFIO && <Field
          name="archiveLeaderFIO"
          component={ renderInputLang }
          format={value => (!!value ? value[lang.archiveLeaderFIO] : '')}
          parse={value => { this.archiveLeaderFIOValue[lang.archiveLeaderFIO] = value; return {...this.archiveLeaderFIOValue} }}
          label={archiveLeaderFIO.name[lng]}
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
        {archiveLeaderPosition && <Field
          name="archiveLeaderPosition"
          component={ renderInputLang }
          format={value => (!!value ? value[lang.archiveLeaderPosition] : '')}
          parse={value => { this.archiveLeaderPositionValue[lang.archiveLeaderPosition] = value; return {...this.archiveLeaderPositionsValu} }}
          label={archiveLeaderPosition.name[lng]}
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
        {archiveLeaderPhone && <Field
          name="archiveLeaderPhone"
          component={ renderInput }
          label={archiveLeaderPhone.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        {archiveLeaderAppointmentDate && <Field
          name="archiveLeaderAppointmentDate"
          component={ renderInput }
          label={archiveLeaderAppointmentDate.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        <Form.Item style={{marginBottom: '5px'}}><h2>{t('COMMISSION_LEADER')}</h2></Form.Item>
        {commissionLeaderFIO && <Field
          name="commissionLeaderFIO"
          component={ renderInputLang }
          format={value => (!!value ? value[lang.commissionLeaderFIO] : '')}
          parse={value => { this.commissionLeaderFIOValue[lang.commissionLeaderFIO] = value; return {...this.commissionLeaderFIOValue} }}
          label={commissionLeaderFIO.name[lng]}
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
        {commissionLeaderPosition && <Field
          name="commissionLeaderPosition"
          component={ renderInputLang }
          format={value => (!!value ? value[lang.commissionLeaderPosition] : '')}
          parse={value => { this.commissionLeaderPositionValue[lang.commissionLeaderPosition] = value; return {...this.commissionLeaderPositionValue} }}
          label={commissionLeaderPosition.name[lng]}
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
        {commissionLeaderPhone && <Field
          name="commissionLeaderPhone"
          component={ renderInput }
          label={commissionLeaderPhone.name[lng]}
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

export default reduxForm({ form: 'ManagingFormFundMaker', enableReinitialize: true })(ManagingFormFundMaker);
