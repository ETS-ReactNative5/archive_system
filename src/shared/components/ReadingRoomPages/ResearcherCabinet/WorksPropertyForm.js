import React, {Component} from 'react';
import {Form} from 'antd';
import {Field, reduxForm} from 'redux-form';
import {
  renderDatePicker, renderSelect, renderSelectVirt
} from '../../../utils/form_components';
import {isEqual, pickBy} from 'lodash';

const FormItem = Form.Item;

class WorksPropertyForm extends Component {

  render() {
    if (!this.props.tofiConstants) return null;

    const lng = localStorage.getItem('i18nextLng');
    const {
      t, dirty, tofiConstants: {fundArchive, tookUser, workPriority, workStatusCreateRequirement,
        workRegInv, workAuthor, workDate, workAssignedTo, dateAppointment, appointedUser,
        workRegFund, workRegCase, linkToDoc, linkToUkaz}
    } = this.props;

    return (
      <Form className="antForm-spaceBetween"
            style={dirty ? {paddingBottom: '43px'} : {}}>
        <FormItem>
          <h3>{t('WORK')}</h3>
          <hr/>
        </FormItem>
        <Field
          name="workType"
          component={renderSelect}
          disabled
          isSearchable={false}
          label={t('WORK_TYPE')}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
        />
        {workPriority && <Field
          name="workPriority"
          component={renderSelect}
          disabled
          isSearchable={false}
          label={workPriority.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
        />}
        {<Field
          name="workStatusCreateRequirement"
          disabled
          component={renderSelect}
          isSearchable={false}
          label={workStatusCreateRequirement.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
        />}
        {workDate && <Field
          name="workDate"
          component={renderDatePicker}
          disabled
          format={null}
          label={workDate.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
        />}
        {dateAppointment && <Field
          name="dateAppointment"
          component={renderDatePicker}
          disabled
          format={null}
          label={dateAppointment.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
        />}
        <FormItem>
          <h3>{t('WORK_OBJECT')}</h3>
          <hr/>
        </FormItem>
        {fundArchive && <Field
          name="fundArchive"
          component={renderSelect}
          label={fundArchive.name[lng]}
          disabled
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
        />}
        {workRegFund && <Field
          name="workRegFund"
          component={ renderSelectVirt }
          label={workRegFund.name[lng]}
          optionHeight={40}
          formItemLayout={{
            labelCol: { span: 10 },
            wrapperCol: { span: 14 }
          }}
        />}
        {workRegInv && <Field
          name="workRegInv"
          component={ renderSelectVirt }
          label={workRegInv.name[lng]}
          disabled
          optionHeight={40}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        {workRegCase && <Field
          name="workRegCase"
          component={ renderSelectVirt }
          label={workRegCase.name[lng]}
          disabled
          optionHeight={40}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        {/*{linkToDoc && <Field
          name="linkToDoc"
          isMulti
          component={ renderSelectVirt }
          label={linkToDoc.name[lng]}
          disabled
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}*/}
        {linkToUkaz && <Field
          name="linkToUkaz"
          isMulti
          disabled
          component={ renderSelect }
          label={linkToUkaz.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        <FormItem>
          <h3>{t('PARTICIPANTS')}</h3>
          <hr/>
        </FormItem>
        {workAuthor && <Field
          name="workAuthor"
          component={renderSelect}
          disabled
          label={workAuthor.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
        />}
        {workAssignedTo && <Field
          name="workAssignedTo"
          component={renderSelect}
          label={workAssignedTo.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
          disabled
        />}
        {appointedUser && <Field
          name="appointedUser"
          component={renderSelect}
          disabled
          label={appointedUser.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
        />}
        {tookUser && <Field
          name="tookUser"
          component={renderSelect}
          disabled
          label={tookUser.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
        />}
      </Form>
    )
  }
}

export default reduxForm({
  form: 'WorksPropertyForm',
  enableReinitialize: true
})(WorksPropertyForm);