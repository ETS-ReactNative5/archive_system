import React from 'react';
import {Upload, Button, Form, Row, Col} from 'antd';
import { Field, reduxForm } from 'redux-form';
import {renderFileUpload, renderInput, renderSelect} from '../../utils/form_components';
import {cities, countries, researchs} from '../../constants/constants';

const EditResearchersMain = props => {

  const { handleSubmit, t } = props;
  return (
    <div className="editResearchersMain">
      <div className="editResearchersMain__heading">
        <Button type='primary'>{ t('SAVE') }</Button>
        <Upload><Button>{ t('CHANGE_PHOTO') }</Button></Upload>
        <Button>{ t('CHANGE_PASSWORD') }</Button>
        <Button>{ t('FORM_TICKET') }</Button>
      </div>
      <div className="editResearchersMain__body">
        <Row>
          <Col sm={{span: 12}}>
            <Form onSubmit={handleSubmit} className="antForm-spaceBetween">
              <Field
                name="lastName"
                className="signup-form__input"
                component={renderInput}
                placeholder={ t('LAST_NAME_PLACEHOLDER') }
                label={ t('LASTNAME') + ':' }
                formItemLayout={
                  {
                    labelCol: {span: 10},
                    wrapperCol: {span: 12}
                  }
                }
              />
              <Field
                name="firstName"
                className="signup-form__input"
                component={renderInput}
                placeholder={ t('FIRST_NAME_PLACEHOLDER') }
                label={ t('FIRSTNAME') }
                formItemLayout={
                  {
                    labelCol: {span: 10},
                    wrapperCol: {span: 12}
                  }
                }
              />
              <Field
                name="middleName"
                className="signup-form__input"
                component={ renderInput }
                placeholder={ t('MIDDLE_NAME_PLACEHOLDER') }
                label={ t('MIDDLENAME') }
                formItemLayout={
                  {
                    labelCol: {span: 10},
                    wrapperCol: {span: 12}
                  }
                }
              />
              <Field
                name="login"
                className="signup-form__input"
                component={renderInput}
                placeholder="login@email.com"
                label={ t('LOGIN') }
                formItemLayout={
                  {
                    labelCol: {span: 10},
                    wrapperCol: {span: 12}
                  }
                }
              />
              <Field
                name="personalCaseNumb"
                className="signup-form__input"
                component={renderInput}
                type="number"
                placeholder='111222333'
                label={ t('PERSONAL_CASE_NUMB') }
                formItemLayout={
                  {
                    labelCol: {span: 10},
                    wrapperCol: {span: 12}
                  }
                }
              />
              <Field
                name="idNumb"
                className="signup-form__input"
                component={renderInput}
                placeholder="111222333"
                label={ t('ID_NUMB') }
                formItemLayout={
                  {
                    labelCol: {span: 10},
                    wrapperCol: {span: 12}
                  }
                }
              />
              <Field
                name="Identity"
                className="signup-form__input"
                component={ renderFileUpload }
                label={ t('IDENTITY') }
                formItemLayout={
                  {
                    labelCol: {span: 10},
                    wrapperCol: {span: 12}
                  }
                }
              />
              <Field
                name="Country"
                className="signup-form__input"
                label={ t('COUNTRY') }
                formItemLayout={
                  {
                    labelCol: {span: 10},
                    wrapperCol: {span: 12}
                  }
                }
                component={renderSelect}
                placeholder={ t('COUNTRY_PLACEHOLDER') }
                data={countries}
              />
              <Field
                name="City"
                className="signup-form__input"
                label={ t('CITY') }
                formItemLayout={
                  {
                    labelCol: {span: 10},
                    wrapperCol: {span: 12}
                  }
                }
                component={renderSelect}
                handleSelect={(value) => this.setState({ city: value })}
                data={cities}
                placeholder={ t('CITY_PLACEHOLDER') }
              />
              <Field
                name="Research"
                className="signup-form__input"
                label={ t('RESEARCH') }
                formItemLayout={
                  {
                    labelCol: {span: 10},
                    wrapperCol: {span: 12}
                  }
                }
                component={renderSelect}
                handleSelect={(value) => this.setState({ research: value })}
                data={researchs}
                placeholder="Вид исследования"
              />
              <Field
                name="Address"
                className="signup-form__input"
                label={ t('ADDRESS') }
                formItemLayout={
                  {
                    labelCol: {span: 10},
                    wrapperCol: {span: 12}
                  }
                }
                component={renderInput}
                placeholder="Арай, 53"
              />
              <Field
                name="phone"
                className="signup-form__input"
                label={ t('PHONE') }
                formItemLayout={
                  {
                    labelCol: {span: 10},
                    wrapperCol: {span: 12}
                  }
                }
                component={renderInput}
                placeholder="+7 (XXX)-111-11-11"
              />
              <Field
                name="email"
                className="signup-form__input"
                label='email'
                formItemLayout={
                  {
                    labelCol: {span: 10},
                    wrapperCol: {span: 12}
                  }
                }
                component={renderInput}
                placeholder="login@email.com"
              />
            </Form>
          </Col>
          <Col sm={{span: 12}}>
            photo
          </Col>
        </Row>

      </div>
    </div>
  );
};

export default reduxForm({ form: 'EditResearchersMain' })(EditResearchersMain);
