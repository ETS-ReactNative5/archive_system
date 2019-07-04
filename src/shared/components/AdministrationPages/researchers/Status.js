import React from "react";
import {Field, reduxForm} from "redux-form";

import {required, requiredEmail, requiredLabel} from "../../../utils/form_validations";
import {
  renderInput,
  renderSelect
} from "../../../utils/form_components";
import {Button, Form} from "antd";
import {intersection} from "lodash";

class Status  extends React.Component {
    state={
        optionMultiSelect:[]
    }
     strToRedux = (val, prevVal, obj, prevObj, flag) => {
        if (!!flag) {
            val = val.replace(/[^\d;]/g, '')
        }
        var newVal = {...prevVal};
        if (prevVal === null) {
            let objVal = {
                value: val,
                valueLng: {kz: val},
                valueLng: {ru: val},
                valueLng: {en: val}
            };
            return objVal;
        } else {
            newVal.value = val;
            newVal["valueLng"] = {kz: val, ru: val, en: val};

            return newVal;
        }
    };

    selectToRedux = (val, prevVal, obj, prevObj) => {
        if (val !== undefined) {
            if (val === null) {
                let newValNull = {...prevVal};
                newValNull.label = null;
                newValNull.labelFull = null;
                newValNull.value = null;
                return newValNull;
            } else {
                let newVal = {...prevVal};
                newVal.value = val.value;
                newVal.label = val.label;
                newVal.labelFull = val.label;
                return newVal;
            }
        }
    };
    dateToRedux = (val, prev) => {
        {
            let coppyPrev = {...prev};

            if (!!val) {

                let newDate = val
                if (!!coppyPrev.idDataPropVal) {
                    coppyPrev.value = newDate;
                    return coppyPrev;
                } else {
                    return {
                        value: newDate
                    };
                }
            } else {
                if (!!coppyPrev.value) {
                    coppyPrev.value = "";
                    return coppyPrev;
                } else {
                    return {};
                }
            }
        }
    };
    selectMultiToRedux = (val, prevVal, obj, prevObj) => {
        if (val !== undefined) {
            if (!!val) {
                let coppyPrevVal = prevVal ? [...prevVal] : []
                let coppyVal = {...val}
                if (coppyPrevVal.length > 0) {
                    for (let i = 0; i < coppyPrevVal.length; i++) {
                        if (coppyPrevVal[i].idDataPropVal == undefined) continue
                        if (coppyPrevVal[i].idDataPropVal !== undefined) {
                            let findePrevVal = this.state.optionMultiSelect.find((el) => el.idDataPropVal === coppyPrevVal[i].idDataPropVal)

                            if (findePrevVal === undefined) {
                                setTimeout(() => {
                                    this.setState({
                                        optionMultiSelect: this.state.optionMultiSelect.concat(coppyPrevVal[i])
                                    })
                                })

                            }
                        }

                    }
                }

                if (coppyVal.idDataPropVal === undefined) {
                    let findVal = this.state.optionMultiSelect.find((el) => el.value === coppyVal.value)

                }
                return coppyVal

            } else {
                return []
            }
        }

    };

    render() {
        this.lng = localStorage.getItem('i18nextLng');
        console.log(this.props.initialValues)
        debugger;
        const {personAcademicDegree, job, position, education, personAcademicTitle} = this.props.tofiConstants;
        const {
            handleSubmit, t, loadOptions, tofiConstants,
            educationOptions, educationLoading, personAcademicDegreeOptions, personAcademicDegreeLoading,
            personAcademicTitleOptions, personAcademicTitleLoading, rolesLoading, rolesOptions,
            dirty, error, submitting, reset, onSubmit, loadRolesOptions, staffRoleOptions, staffRoleLoading
        } = this.props;

        return (
            <Form onSubmit={handleSubmit(onSubmit)} className='antForm-spaceBetween'
                  style={dirty ? {paddingBottom: '43px'} : {}}>
                <Field
                    name="job"
                    formItemClass="signup-form__input"
                    component={renderInput}
                    label={job.name[this.lng]}
                    normalize={this.strToRedux}

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
                    normalize={this.strToRedux}

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
                    normalize={this.selectToRedux}

                    data={educationOptions ? educationOptions.map(option => ({
                        value: option.id,
                        label: option.name[this.lng]
                    })) : []}
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
                    data={personAcademicDegreeOptions ? personAcademicDegreeOptions.map(option => ({
                        value: option.id,
                        label: option.name[this.lng]
                    })) : []}
                    isLoading={personAcademicDegreeLoading}
                    onMenuOpen={loadOptions('personAcademicDegree')}
                    normalize={this.selectToRedux}

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
                    data={personAcademicTitleOptions ? personAcademicTitleOptions.map(option => ({
                        value: option.id,
                        label: option.name[this.lng]
                    })) : []}
                    isLoading={personAcademicTitleLoading}
                    onMenuOpen={loadOptions('personAcademicTitle')}
                    normalize={this.selectToRedux}

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
                    .map(c => ({
                        value: tofiConstants[c].id,
                        label: tofiConstants[c].name[this.lng],
                        researcherClass: c
                    }))}
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
                    data={staffRoleOptions ? staffRoleOptions.map(option => ({
                        value: option.id,
                        label: option.name[this.lng]
                    })) : []}
                    isLoading={staffRoleLoading}
                    normalize={this.selectToRedux}

                />}
                <Field
                    name="roles"
                    component={renderSelect}
                    normalize={this.selectToRedux}
                    isMulti
                    label={t('ROLES')}
                    formItemLayout={{
                        labelCol: { span: 10 },
                        wrapperCol: { span: 14 }
                    }}
                    isLoading={rolesLoading}
                    data={rolesOptions ? rolesOptions.map(option => ({
                        value: option.id,
                        label: option.name[this.lng]
                    })) : []}
                    onMenuOpen={loadRolesOptions}
                />

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
}

export default reduxForm({
  form: "Status",
  enableReinitialize: true
})(Status);
