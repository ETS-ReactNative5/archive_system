import React from "react";
import {Field, reduxForm} from "redux-form";

import {required, requiredEmail, requiredLabel} from "../../../utils/form_validations";
import {
  renderInput,
  renderSelect
} from "../../../utils/form_components";
import {Button, Form} from "antd";
import {intersection} from "lodash";

const Status = props => {

  this.lng = localStorage.getItem('i18nextLng');

  const { personAcademicDegree, job, position, education, personAcademicTitle } = props.tofiConstants;
  const {handleSubmit, t, loadOptions, tofiConstants,
    educationOptions, educationLoading, personAcademicDegreeOptions, personAcademicDegreeLoading,
    personAcademicTitleOptions, personAcademicTitleLoading, rolesLoading, rolesOptions,
    dirty, error, submitting, reset, onSubmit, loadRolesOptions, staffRoleOptions, staffRoleLoading
  } = props;
  
  return (
    <Form onSubmit={handleSubmit(onSubmit)} className='antForm-spaceBetween' style={dirty ? {paddingBottom: '43px'} : {}}>
      <Field
        name="job"
        formItemClass="signup-form__input"
        component={renderInput}
        label={job.name[this.lng]}
        formItemLayout={{
          labelCol: {span: 10},
          wrapperCol: {span: 14}
        }}
      />
      <Field
        name="position"
        formItemClass="signup-form__input"
        component={renderInput}
        label={position.name[this.lng]}
        formItemLayout={{
          labelCol: {span: 10},
          wrapperCol: {span: 14}
        }}
      />
      <Field
        name="education"
        formItemClass="signup-form__input"
        component={renderSelect}
        label={education.name[this.lng]}
        formItemLayout={{
          labelCol: {span: 10},
          wrapperCol: {span: 14}
        }}
        data={educationOptions ? educationOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
        isLoading={educationLoading}
        onMenuOpen={loadOptions('education')}
      />
      <Field
        name="personAcademicDegree"
        formItemClass="signup-form__input"
        component={renderSelect}
        label={personAcademicDegree.name[this.lng]}
        formItemLayout={{
          labelCol: {span: 10},
          wrapperCol: {span: 14}
        }}
        data={personAcademicDegreeOptions ? personAcademicDegreeOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
        isLoading={personAcademicDegreeLoading}
        onMenuOpen={loadOptions('personAcademicDegree')}
      />
      <Field
        name="personAcademicTitle"
        formItemClass="signup-form__input"
        component={renderSelect}
        label={personAcademicTitle.name[this.lng]}
        formItemLayout={{
          labelCol: {span: 10},
          wrapperCol: {span: 14}
        }}
        data={personAcademicTitleOptions ? personAcademicTitleOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
        isLoading={personAcademicTitleLoading}
        onMenuOpen={loadOptions('personAcademicTitle')}
      />
      {/* {['administrator', 'leader'].some(v => props.user.privs.includes(v)) && */} <Field
        name="researcherClassObj"
        formItemClass="signup-form__input"
        component={renderSelect}
        label={t('RESEARCHER_CLASS')}
        formItemLayout={{
          labelCol: {span: 10},
          wrapperCol: {span: 14}
        }}
        data={['clsResearchers', 'clsHead', 'clsAdminDepartment', 'clsDepInformTech', 'staff',
          'clsTempUsers', 'workAssignedToReg', 'workAssignedToNID', 'workAssignedToSource', 'workAssignedToIPS']
          .map(c => ({value: tofiConstants[c].id, label: tofiConstants[c].name[this.lng], researcherClass: c}))}
      />{/* } */}
      {<Field
        name="staffRole"
        formItemClass="signup-form__input"
        component={renderSelect}
        label={tofiConstants.staffRole.name[this.lng]}
        formItemLayout={{
          labelCol: {span: 10},
          wrapperCol: {span: 14}
        }}
        onMenuOpen={loadOptions('staffRole')}
        data={staffRoleOptions ? staffRoleOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
        isLoading={staffRoleLoading}
      />}

      {<Field
        name="roles"
        formItemClass="signup-form__input"
        component={renderSelect}
        isMulti
        label={t('ROLES')}
        formItemLayout={{
          labelCol: {span: 10},
          wrapperCol: {span: 14}
        }}
        onMenuOpen={loadRolesOptions}
        data={rolesOptions ? rolesOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
        isLoading={rolesLoading}
      />}
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
  form: "Status",
  enableReinitialize: true
})(Status);
