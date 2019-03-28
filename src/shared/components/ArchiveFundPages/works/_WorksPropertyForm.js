import React, { Component } from 'react';
import {Button, Form} from 'antd';
import { Field, reduxForm } from 'redux-form';
import {required, requiredDate, requiredLabel, requiredLng} from '../../../utils/form_validations';
import {
  renderAsyncSelect, renderAsyncSelectVirt, renderDatePicker, renderInput, renderInputLang, renderRadioGroup,
  renderSelect
} from '../../../utils/form_components';
import {getPropValByConst, getAccessLevels} from '../../../actions/actions';
import {four_digits} from '../../../utils/form_normalizing';

class WorksPropertyForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      lang: {
        workListName: localStorage.getItem('i18nextLng'),
      }
    };
  }

  changeLang = e => {
    this.setState({lang: {...this.state.lang, [e.target.name]: e.target.value}});
  };

  getWorkTypeOptions = () => getPropValByConst('workType')
    .then(json=>({
      options: json.data.map(item => (
        {value: item.id, label: item.name[localStorage.getItem('i18nextLng')]})
      )
    }));
  getWorkPriorityOptions = () => getPropValByConst('workPriority')
    .then(json=>({
      options: json.data.map(item => (
        {value: item.id, label: item.name[localStorage.getItem('i18nextLng')]})
      )
    }));
  getWorkStatusOptions = () => getPropValByConst('workStatus')
    .then(json=>({
      options: json.data.map(item => (
        {value: item.id, label: item.name[localStorage.getItem('i18nextLng')]})
      )
    }));
  getWorkSourceOptions = () => getPropValByConst('workSource')
    .then(json=>({
      options: json.data.map(item => (
        {value: item.id, label: item.name[localStorage.getItem('i18nextLng')]})
      )
    }));
  getWorkAssignedToOptions = () => getPropValByConst('workAssignedTo')
    .then(json=>({
      options: json.data.map(item => (
        {value: item.id, label: item.name[localStorage.getItem('i18nextLng')]})
      )
    }));

  workName = {...this.props.initialValues.workListName} || {kz: '', ru: '', en: ''};

  onSubmit = values => {
    this.props.addNew(values);
  };

  render() {
    if(!this.props.tofiConstants) return null;

    const lng = localStorage.getItem('i18nextLng');
    const { t, handleSubmit, reset, dirty, error, submitting, tofiConstants: {workListName, workType, workPlannedEndDate,
      workPriority, workStatus, workSource, workAuthor, workDate, workAssignedTo,
      workPlannedStartDate, workActualStartDate, workActualEndDate, acceptanceDate} } = this.props;
    const { lang } = this.state;

    return (
      <Form className="antForm-spaceBetween" onSubmit={handleSubmit(this.onSubmit)} style={dirty ? {paddingBottom: '43px'} : {}}>
        {workListName && <Field
          name="workListName"
          component={ renderInputLang }
          format={value => (!!value ? value[lang.workListName] : '')}
          parse={value => { this.workName[lang.workListName] = value; return {...this.workName} }}
          label={workListName.name[lng]}
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
        {workType && <Field
          name="workType"
          component={ renderAsyncSelect }
          isSearchable={false}
          label={workType.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          loadOptions={this.getWorkTypeOptions}
          // validate={required}
          // colon={true}
        />}
        {workPlannedEndDate && <Field
          name="workPlannedEndDate"
          component={ renderDatePicker }
          format={null}
          isSearchable={false}
          label={workPlannedEndDate.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        {workPriority && <Field
          name="workPriority"
          component={ renderAsyncSelect }
          loadOptions={this.getWorkPriorityOptions}
          isSearchable={false}
          label={workPriority.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          // validate={requiredLabel}
          // colon={true}
        />}
        {workStatus && <Field
          name="workStatus"
          component={ renderAsyncSelect }
          loadOptions={this.getWorkStatusOptions}
          isSearchable={false}
          label={workStatus.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          // validate={requiredLabel}
          // colon={true}
        />}
        {workSource && <Field
          name="workSource"
          component={ renderAsyncSelectVirt }
          loadOptions={this.getWorkSourceOptions}
          label={workSource.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          // validate={requiredLabel}
          // colon={true}
        />}
        {workAuthor && <Field
          name="workAuthor"
          component={ renderInput }
          placeholder={t('USER_FIO_PLACEHOLDER')}
          label={workAuthor.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        {workDate && <Field
          name="workDate"
          component={renderDatePicker}
          format={null}
          label={workDate.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
          // defaultValue={moment()}
          // validate={requiredDate}
          // colon={true}
        />}
        {workAssignedTo && <Field
          name="workAssignedTo"
          component={renderAsyncSelect}
          loadOptions={this.getWorkAssignedToOptions}
          label={workAssignedTo.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
          // validate={requiredDate}
          // colon={true}
        />}
        {workPlannedStartDate && <Field
          name="workPlannedStartDate"
          component={renderDatePicker}
          format={null}
          label={workPlannedStartDate.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
        />}
        {workActualStartDate && <Field
          name="workActualStartDate"
          component={renderDatePicker}
          format={null}
          label={workActualStartDate.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
        />}
        {workActualEndDate && <Field
          name="workActualEndDate"
          component={renderDatePicker}
          format={null}
          label={workActualEndDate.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
        />}
        {acceptanceDate && <Field
          name="acceptanceDate"
          component={renderDatePicker}
          format={null}
          label={acceptanceDate.name[lng]}
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
