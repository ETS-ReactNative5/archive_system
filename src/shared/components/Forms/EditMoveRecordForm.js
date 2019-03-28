import React, { Component } from 'react';
import { Form } from 'antd';
import { Field, reduxForm } from 'redux-form';

import { renderFileUpload, renderInput, renderRadioGroup } from '../../utils/form_components';
import {countries} from '../../constants/constants';

class EditNewFundForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      type: 'income'
    }
  }

  render() {

    const { handleSubmit, t } = this.props;
    return (
      <Form onSubmit={handleSubmit} className="antForm-spaceBetween">
        <Field
          name="movementType"
          formItemClass="flex-center"
          component={ renderRadioGroup }
          data={
            [
              {label: t('INCOME'), value:'income'},
              {label: t('OUTCOME'), value: 'outcome'}
            ]
          }
          selectedValue={this.state.type}
          handleSelect={ e => this.setState({ type: e.target.value }) }
        />
        <Field
          name="fundNumb"
          component={ renderInput }
          type="text"
          placeholder=""
          label={ t('FUND_NUMB') }
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
        <Field
          name="inventNumb"
          component={ renderInput }
          type="text"
          placeholder=""
          label={ t('INVENT_NUMB') }
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
        <Field
          name="dbeg"
          component={ renderInput }
          type="date"
          placeholder=""
          label={ t('DBEG') }
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
        <Field
          name="dend"
          component={ renderInput }
          type="date"
          placeholder=""
          label={ t('DEND') }
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
        {/*{this.state.type === 'income' ? (
          <div>
            <Field
              name="formationDate"
              id="formationDate"
              component={ renderInput }
              type="date"
              label="Дата образования"
              formItemLayout={
                {
                  labelCol: {span: 10},
                  wrapperCol: {span: 14}
                }
              }
            />
            <Field
              name="eliminationDate"
              id="eliminationDate"
              component={renderInput}
              type="date"
              label="Дата ликвидации"
              formItemLayout={
                {
                  labelCol: {span: 10},
                  wrapperCol: {span: 14}
                }
              }
            />
          </div>
        ) : (
          <div>
            <Field
              name="birthDate"
              id="birthDate"
              component={renderInput}
              type="date"
              label="Дата рождения"
              formItemLayout={
                {
                  labelCol: {span: 10},
                  wrapperCol: {span: 14}
                }
              }
            />
            <Field
              name="deathDate"
              id="deathDate"
              component={renderInput}
              type="date"
              label="Дата смерти"
              formItemLayout={
                {
                  labelCol: {span: 10},
                  wrapperCol: {span: 14}
                }
              }
            />
          </div>
        )}*/}
        <Field
          name="casesQuantity"
          component={ renderInput }
          data={countries}
          label={ t('CASES_QUANTITY') }
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
        <Field
          name="inputOutputAct"
          component={ renderFileUpload }
          label={ t('INPUT_OUTPUT_ACT') }
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
        <Field
          name="note"
          component={ renderInput }
          label={ t('NOTE') }
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
      </Form>
    )
  }
}

export default reduxForm({ form: 'EditFundForm' })(EditNewFundForm);
