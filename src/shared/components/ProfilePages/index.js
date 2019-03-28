import React from 'react';
import {Card, Col, Row, Button, Modal, Form, message} from 'antd';
import {translate} from "react-i18next";
import {connect} from "react-redux";
import {forEach, isEmpty, isEqual, pickBy} from "lodash";
import {push} from "react-router-redux";
import {reduxForm, Field, Fields, change, formValueSelector} from "redux-form";

import {SYSTEM_LANG_ARRAY} from '../../constants/constants'
import ChangePasswordForm from './ChangePasswordForm';
import {getPropVal, getObjChildsByConst, regNewUserSuccess, changePasswordAct} from "../../actions/actions";
import {required, requiredEmail, requiredLabel} from "../../utils/form_validations";
import AntModal from '../AntModal';
import {
  renderCreatableSelect,
  renderDatePicker, renderDoubleDateInput,
  renderFileUpload, renderInput,
  renderSelect
} from "../../utils/form_components";
import {digits, normalizePhone} from "../../utils/form_normalizing";

const validate = values => {
  const begin_less_end = {
    kz: 'Жылдар сәйкес келмейді',
    ru: 'Неподходящие интервалы',
    en: 'Unsuitable intervals'
  };
  const errors = {};
  if(values.chronologicalBegin &&
    values.chronologicalEnd &&
    (parseInt(values.chronologicalBegin) > parseInt(values.chronologicalEnd))
  ) errors.chronologicalBegin = begin_less_end[localStorage.getItem('i18nextLng')];
  return errors;
};

class ProfileForm extends React.Component {

  state = {
    loading: {
      genderLoading: false,
      nationalityLoading: false,
      formResultRealizationLoading: false,
      directUseDocumentLoading: false,
      personAcademicTitleLoading: false,
      personAcademicDegreeLoading: false,
      educationLoading: false,
      objStudyParentLoading: false
    },
    regulationsAcquainted: false,
    publishedWork: false,
    bibliographicInform: false,
    modal: {
      visible: false,
    }
  };

  loadOptions = c => {
    return () => {
      if (!this.props[c + 'Options']) {
        this.setState({loading: {...this.state.loading, [c + 'Loading']: true}});
        this.props.getPropVal(c)
          .then(() => this.setState({loading: {...this.state.loading, [c + 'Loading']: false}}))
          .catch(err => console.error(err))
      }
    }
  };
  loadChilds = (c, props) => {
    return () => {
      if (!this.props[c + 'Options']) {
        this.setState({loading: {...this.state.loading, [c + 'Loading']: true}});
        this.props.getObjChildsByConst(c, props)
          .then(() => this.setState({loading: {...this.state.loading, [c + 'Loading']: false}}))
          .catch(err => console.error(err))
      }
    }
  };

  handleCreate = inputValue => {
    this.props.change('theme', {label: inputValue, value: 0});
    this.props.change('directUseDocument', null);
    this.props.change('goalSprav', '');
    this.props.change('chronologicalBegin', null);
    this.props.change('chronologicalEnd', null);
    this.props.change('formResultRealization', null);
    // this.props.change('formResultRealizationFile', null);
  };
  onCheckboxChange = e => {
    this.setState({[e.target.name]: e.target.checked})
  };
  handleModalOk = () => {
    this.props.submitChangePassword();
  };

  changePassword = async values => {
    const res = await changePasswordAct(values.password, this.props.user.obj);
    //console.log(res);
    if(!res.success) {
      res.errors.forEach(err => {
        message.error(err.text, 8);
        return;
      })
    }
    this.setState({modal: {visible: false}});
    message.success(this.props.t('PASSWORD_CHANGED'))
  };

  handleModalCancel = () => {
    this.setState({
      modal: {
        visible: false
      }
    });
  };

  onSubmit = values => {
    const {photo, copyUdl, ...toSend} = pickBy(values, (val, key) => !isEqual(val, this.props.initialValues[key]));
    const cube = {
      cubeSConst: 'cubeUsers',
      doConst: 'doUsers',
      dpConst: 'dpUsers'
    };
    const obj = {doItem: this.props.initialValues.key};
    const objData = {};
    if (toSend.personLastName || toSend.personName || toSend.personPatronymic) {
      const {
        personLastName: personLastNameInit,
        personName: personNameInit,
        personPatronymic: personPatronymicInit
      } = this.props.initialValues;
      const name = {};
      const pesonLastNameToSend = toSend.personLastName || personLastNameInit;
      const personNameToSend = toSend.personName || personNameInit;
      const personPatronymicToSend = toSend.personPatronymic || personPatronymicInit;
      SYSTEM_LANG_ARRAY.forEach(lang => {
        name[lang] = `${pesonLastNameToSend} ${personNameToSend} ${personPatronymicToSend}`.trim();
      });
      objData.name = name;
      objData.fullName = name;
    }
    // set roles as a side-effect if changed
    return this.props.saveProps({cube, obj}, {
      values: toSend,
      idDPV: this.props.withIdDPV,
      oFiles: {photo: [photo], copyUdl: [copyUdl]}
    }, this.props.tofiConstants, objData);
  };

  render() {
    if(isEmpty(this.props.tofiConstants)) return null;
    this.lng = localStorage.getItem('i18nextLng');
    const { iin, personLastName, personName, personPatronymic, dateOfBirth, gender, nationality,
      directUseDocument, goalSprav, formResultRealization, location, photo, copyUdl,
      personAcademicDegree, job, position, education, personAcademicTitle} = this.props.tofiConstants;
    const {handleSubmit, t, reset, submitting, dirty, genderLoading, genderOptions, objNationalityOptions, objNationalityLoading,
      directUseDocumentOptions, directUseDocumentLoading, formResultRealizationOptions, formResultRealizationLoading,
      educationOptions, educationLoading, personAcademicDegreeOptions, objStudyParentOptions,
      personAcademicDegreeLoading, personAcademicTitleOptions, personAcademicTitleLoading, themeValue} = this.props;
    return (
      <div className="signup-container">
        <Form onSubmit={handleSubmit(this.onSubmit)} style={{background: '#FFF3E0', padding: '30px 50px 5px', minHeight: '100%'}} className='antForm-spaceBetween'>
          <Row gutter={16} type='flex'>
            <Col sm={24} md={12}>
              <Card title={t('IDENTIFICATION_DATA')} className='card'>
                <Row gutter={8}>
                  <Col span={16}>
                    <Field
                      name="iin"
                      formItemClass="signup-form__input"
                      component={renderInput}
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
                      formItemClass="signup-form__input"
                      component={renderInput}
                      placeholder={t("LAST_NAME_PLACEHOLDER")}
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
                      formItemClass="signup-form__input"
                      component={renderInput}
                      placeholder={t("FIRST_NAME_PLACEHOLDER")}
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
                      formItemClass="signup-form__input"
                      component={renderInput}
                      placeholder={t("MIDDLE_NAME_PLACEHOLDER")}
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
                      onMenuOpen={this.loadOptions('gender')}
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
                      onMenuOpen={this.loadChilds('objNationality')}
                    />
                  </Col>
                  <Col span={8} push={2}>
                    <Field
                      name="photo"
                      formItemClass="signup-form__input wrap-normal unset-lh"
                      component={renderFileUpload}
                      label={photo.name[this.lng]}
                      uploadText={t('UPLOAD')}
                    />
                    <Field
                      name="copyUdl"
                      formItemClass="signup-form__input wrap-normal unset-lh"
                      component={renderFileUpload}
                      label={copyUdl.name[this.lng]}
                      uploadText={t('UPLOAD')}
                      isMulti="true"
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col sm={24} md={12}>
              <Card title={t('RESEARCHER')} className='card'>
                <Field
                  id='propStudy'
                  name="propStudy"
                  //disabled
                  formItemClass="signup-form__input wrap-normal unset-lh"
                  component={renderCreatableSelect}
                  placeholder={t("THEME")}
                  label={t("THEME")}
                  formItemLayout={{
                    labelCol: {span: 10},
                    wrapperCol: {span: 14}
                  }}
                  onChange={(e, newValue) => {
                    //console.log('newValues', newValue);
                    if(newValue && newValue.constructor === Object) {
                      newValue.directUseDocument.idRef ?
                        this.props.change('directUseDocument', {value: newValue.directUseDocument.idRef, label: newValue.directUseDocument.name.ru})
                        : this.props.change('directUseDocument', null);

                      newValue.goalSprav.ru ?
                        this.props.change('goalSprav', newValue.goalSprav.ru)
                        : this.props.change('goalSprav', '');

                      newValue.chronologicalBegin.ru ?
                        this.props.change('chronologicalBegin', newValue.chronologicalBegin.ru)
                        : this.props.change('chronologicalBegin', '');

                      newValue.chronologicalEnd.ru ?
                        this.props.change('chronologicalEnd', newValue.chronologicalEnd.ru)
                        : this.props.change('chronologicalEnd', '');

                      newValue.formResultRealization.idRef ?
                        this.props.change('formResultRealization', {value: newValue.formResultRealization.idRef, label: newValue.formResultRealization.name.ru})
                        : this.props.change('formResultRealization', null);

                      /*newValue.formResultRealizationFile.ru ?
                        this.props.change('formResultRealizationFile', newValue.formResultRealizationFile.ru)
                      : this.props.change('formResultRealizationFile', null);*/
                    } else {
                      this.props.change('directUseDocument', null);
                      this.props.change('goalSprav', '');
                      this.props.change('chronologicalBegin', '');
                      this.props.change('chronologicalEnd', '');
                      this.props.change('formResultRealization', null);
                      // this.props.change('formResultRealizationFile', null);
                    }
                  }}
                  data={objStudyParentOptions ? objStudyParentOptions.map(option => ({...option, value: option.id, label: option.name[this.lng]})) : []}
                  isLoading={this.state.loading.objStudyParentLoading}
                  onMenuOpen={this.loadChilds('objStudyParent', 'directUseDocument,goalSprav,chronologicalBegin,chronologicalEnd,formResultRealization,formResultRealizationFile')}
                  onCreateOption={this.handleCreate}
                  isValidNewOption={(v) => !!v}
                  // colon={true}
                  // validate={requiredLabel}
                />
                <Field
                  name="directUseDocument"
                  formItemClass="signup-form__input wrap-normal unset-lh"
                  component={renderSelect}
                  disabled={!themeValue || Boolean(themeValue && themeValue.directUseDocument && themeValue.directUseDocument.idRef)}
                  label={directUseDocument.name[this.lng]}
                  formItemLayout={{
                    labelCol: {span: 10},
                    wrapperCol: {span: 14}
                  }}
                  data={directUseDocumentOptions ? directUseDocumentOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
                  isLoading={directUseDocumentLoading}
                  onMenuOpen={this.loadOptions('directUseDocument')}
                />
                <Field
                  name="goalSprav"
                  formItemClass="signup-form__input wrap-normal unset-lh"
                  component={renderInput}
                  disabled={!themeValue || Boolean(themeValue && themeValue.goalSprav && themeValue.goalSprav.ru)}
                  label={goalSprav.name[this.lng]}
                  formItemLayout={{
                    labelCol: {span: 10},
                    wrapperCol: {span: 14}
                  }}
                />
                <Fields
                  names={[ 'chronologicalBegin', 'chronologicalEnd' ]}
                  component={renderDoubleDateInput}
                  disabledFields={{
                    chronologicalBegin: !themeValue || !!(themeValue && themeValue.chronologicalBegin && themeValue.chronologicalBegin.ru),
                    chronologicalEnd: !themeValue || !!(themeValue && themeValue.chronologicalEnd && themeValue.chronologicalEnd.ru)
                  }}
                  normalizeFields={{
                    chronologicalBegin: digits(4),
                    chronologicalEnd: digits(4)
                  }}
                  label={t('start-end')}
                  format={null}
                  formItemLayout={
                    {
                      labelCol: { span: 10 },
                      wrapperCol: { span: 14 }
                    }
                  }
                />
                <Field
                  name="formResultRealization"
                  formItemClass="signup-form__input wrap-normal unset-lh"
                  component={renderSelect}
                  disabled={!themeValue || Boolean(themeValue && themeValue.formResultRealization && themeValue.formResultRealization.idRef)}
                  label={formResultRealization.name[this.lng]}
                  formItemLayout={{
                    labelCol: {span: 10},
                    wrapperCol: {span: 14}
                  }}
                  data={formResultRealizationOptions ? formResultRealizationOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
                  isLoading={formResultRealizationLoading}
                  onMenuOpen={this.loadOptions('formResultRealization')}
                />
              </Card>
            </Col>
          </Row>
          <Row gutter={16} type='flex'>
            <Col sm={24} md={12}>
              <Card title={t('STATUS')} className='card'>
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
                  onMenuOpen={this.loadOptions('education')}
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
                  onMenuOpen={this.loadOptions('personAcademicDegree')}
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
                  onMenuOpen={this.loadOptions('personAcademicTitle')}
                />
              </Card>
            </Col>
            <Col sm={24} md={12}>
              <Card title={t('CONTACTS')} className='card'>
                <Field
                  name="phone"
                  formItemClass="signup-form__input"
                  component={renderInput}
                  //disabled
                  label={t('PHONE')}
                  formItemLayout={{
                    labelCol: {span: 10},
                    wrapperCol: {span: 14}
                  }}
                  normalize={normalizePhone}
                  // colon={true}
                  // validate={required}
                />
                <Field
                  name="login"
                  formItemClass="signup-form__input"
                  component={renderInput}
                  disabled
                  label={t('LOGIN')}
                  formItemLayout={{
                    labelCol: {span: 10},
                    wrapperCol: {span: 14}
                  }}
                  // colon={true}
                  // validate={required}
                />
                <Field
                  name="email"
                  formItemClass="signup-form__input"
                  component={renderInput}
                  disabled
                  label={t('EMAIL')}
                  formItemLayout={{
                    labelCol: {span: 10},
                    wrapperCol: {span: 14}
                  }}
                  // colon={true}
                  // validate={requiredEmail}
                />
                <Field
                  name="location"
                  formItemClass="signup-form__input"
                  component={renderInput}
                  label={location.name[this.lng]}
                  formItemLayout={{
                    labelCol: {span: 10},
                    wrapperCol: {span: 14}
                  }}
                />
              </Card>
            </Col>
          </Row>
          <div className='buttons'>
            <Button type='primary' htmlType='button' onClick={() => this.setState({ modal: {visible: true} })}>{t('CHANGE_PASSWORD')}</Button>
            <Button htmlType='submit' disabled={!dirty || submitting}>{t('SAVE')}</Button>
            <Button htmlType='button' onClick={reset}>{t('CANCEL')}</Button>
          </div>
        </Form>
        <AntModal
          onOk={this.handleModalOk}
          onCancel={this.handleModalCancel}
          visible={this.state.modal.visible}
          width={'500px'}
          okBtnText={t('SAVE')}
          title={t('FORGOT_PASSWORD')}
        >
          <ChangePasswordForm t={t} onSubmit={this.changePassword}/>
        </AntModal>
      </div>
    )
  }
}

const selector = formValueSelector('profileForm');

function mapStateToProps(state) {
  const themeValue = selector(state, 'propStudy');
  const scanCopyLetterValue = selector(state, 'scanCopyLetter');
  return {
    themeValue,
    scanCopyLetterValue,
    tofiConstants: state.generalData.tofiConstants,
    genderOptions: state.generalData.gender,
    objNationalityOptions: state.generalData.objNationality,
    directUseDocumentOptions: state.generalData.directUseDocument,
    formResultRealizationOptions: state.generalData.formResultRealization,
    personAcademicTitleOptions: state.generalData.personAcademicTitle,
    personAcademicDegreeOptions: state.generalData.personAcademicDegree,
    educationOptions: state.generalData.education,
    objStudyParentOptions: state.generalData.objStudyParent,
    user: state.auth.user
  }
}

export default connect(mapStateToProps, {change, push, getPropVal, getObjChildsByConst, regNewUserSuccess})
(reduxForm({
  form: "profileForm",
  enableReinitialize: true,
  validate
})(translate('signUpForm')(ProfileForm)));