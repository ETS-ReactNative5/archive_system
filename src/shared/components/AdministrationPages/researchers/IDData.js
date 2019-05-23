import React from "react";
import {Field, reduxForm} from "redux-form";

import {required, requiredLng, requiredEmail} from "../../../utils/form_validations";
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
   const photoToRedux = (val, prevVal, file, str) => {
        let newFile = val instanceof File;
        if (!!newFile) {
            let filele = val
            let copyVal
            if (Array.isArray(prevVal)){
                copyVal = prevVal[0] ;
            }else {
                copyVal = prevVal ? {...prevVal} : {};

            }
            copyVal.value = filele
            return copyVal
        } else {
            return {};
        }
    };

   const fileToRedux = (val, prevVal, file, str) => {

        let newFile = val.filter(el => el instanceof File);
        if (newFile.length > 0) {
            var copyVal = prevVal ? [...prevVal] : [];
            newFile.map(el => {
                copyVal.push({
                    value: el
                });
            });
            return copyVal;
        } else {
            return val.length == 0 ? [] : val;
        }
    };

   const strToRedux = (val, prevVal, obj, prevObj, flag) => {
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

   const selectToRedux = (val, prevVal, obj, prevObj) => {
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
   const dateToRedux = (val, prev) => {
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
   const selectMultiToRedux = (val, prevVal, obj, prevObj) => {
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

            }else{
                return []
            }
        }

    };
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
            normalize={strToRedux}
            colon={true}
            validate={requiredLng}
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
            normalize={strToRedux}
            colon={true}
            validate={requiredLng}
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
            normalize={strToRedux}
            validate={requiredLng}
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
            normalize={strToRedux}

          />
          <Field
            name="dateOfBirth"
            formItemClass="signup-form__input"
            component={renderDatePicker}
            format={null}
            normalize={dateToRedux}

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
            normalize={selectToRedux}

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
            normalize={selectToRedux}
          />
        </Col>
        <Col span={8} push={2}>
          <Field
            name="photo"
            formItemClass="signup-form__input wrap-normal unset-lh"
            component={renderFileUpload}
            label={photo.name[this.lng]}
            normalize={photoToRedux}

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
            normalize={photoToRedux}

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
