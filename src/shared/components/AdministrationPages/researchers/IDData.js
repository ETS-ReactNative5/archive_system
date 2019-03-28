import React from "react";
import {Field, reduxForm} from "redux-form";

import {required, requiredEmail} from "../../../utils/form_validations";
import {
  renderDatePicker,
  renderFileUpload,
  renderInput,
  renderSelect
} from "../../../utils/form_components";
import {digits} from '../../../utils/form_normalizing'
import {Button, Col, Form, Row} from "antd";

const IDData = props => {
  
  this.lng = localStorage.getItem('i18nextLng');

  const { iin, personLastName, personName, personPatronymic, dateOfBirth, gender, nationality, copyUdl, photo } = props.tofiConstants;
  const {handleSubmit, t, loadOptions, loadChilds,
    genderLoading, genderOptions, objNationalityOptions, objNationalityLoading,
    dirty, error, submitting, reset, onSubmit,
  } = props;
  return (
    <Form onSubmit={handleSubmit(onSubmit)} className='antForm-spaceBetween' style={dirty ? {paddingBottom: '43px' } : {}}>
      <Row gutter={8}>
        <Col span={16}>
          <Field
            name="iin"
            formItemClass="signup-form__input"
            component={renderInput}
            autoComplete="off"
            placeholder="yymmddxxxxxx"
            label={iin.name[this.lng]}
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            normalize={digits(12)}
            colon={true}
            validate={required}
          />
          <Field
            name="personLastName"
            autoComplete="off"
            formItemClass="signup-form__input"
            component={renderInput}
            //placeholder={t("LAST_NAME_PLACEHOLDER")}
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
            autoComplete="off"
            formItemClass="signup-form__input"
            component={renderInput}
            //placeholder={t("FIRST_NAME_PLACEHOLDER")}
            label={personName.name[this.lng]}
            formItemLayout={{
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }}
            validate={required}
            colon={true}
          />
          <Field
            name="personPatronymic"
            autoComplete="off"
            formItemClass="signup-form__input"
            component={renderInput}
            //placeholder={t("MIDDLE_NAME_PLACEHOLDER")}
            label={personPatronymic.name[this.lng]}
            formItemLayout={{
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }}
          />
          <Field
            name="dateOfBirth"
            formItemClass="signup-form__input"
            component={renderDatePicker}
            format={null}
            label={dateOfBirth.name[this.lng]}
            formItemLayout={{
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }}
          />
          <Field
            name="gender"
            formItemClass="signup-form__input"
            component={renderSelect}
            label={gender.name[this.lng]}
            formItemLayout={{
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }}
            data={genderOptions ? genderOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
            isLoading={genderLoading}
            onMenuOpen={loadOptions('gender')}
          />
          <Field
            name="nationality"
            formItemClass="signup-form__input"
            component={renderSelect}
            label={nationality.name[this.lng]}
            formItemLayout={{
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }}
            data={objNationalityOptions ? objNationalityOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
            isLoading={objNationalityLoading}
            onMenuOpen={loadChilds('objNationality')}
          />
        </Col>
        <Col span={8} push={2}>
          <Field
            name="photo"
            formItemClass="signup-form__input wrap-normal unset-lh"
            component={renderFileUpload}
            label={photo.name[this.lng]}
            uploadText={t('UPLOAD')}
            /*formItemLayout={{
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }}*/

          />
          <Field
            name="copyUdl"
            formItemClass="signup-form__input wrap-normal unset-lh"
            component={renderFileUpload}
            label={copyUdl.name[this.lng]}
            uploadText={t('UPLOAD')}
            /*formItemLayout={{
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }}*/
          />
        </Col>
      </Row>
      {dirty && <Form.Item className="ant-form-btns absolute-bottom">
        <Button className="signup-form__btn" type="primary" htmlType="submit" disabled={submitting}>
          {submitting ? t('LOADING...') : t('SAVE')}
        </Button>
        <Button className="signup-form__btn" type="danger" htmlType="button" disabled={submitting}
                style={{marginLeft: '10px'}} onClick={reset}>
          {submitting ? t('LOADING...') : t('CANCEL')}
        </Button>
        {error && <span className="message-error"><i className="icon-error"/>{error}</span>}
      </Form.Item>}
    </Form>
  );
};

export default reduxForm({
  form: "IDData",
  enableReinitialize: true
})(IDData);
