import React from 'react';
import {Card, Col, Row, Button, Modal, Form, message, Checkbox} from 'antd';
import {translate} from "react-i18next";
import {connect} from "react-redux";
import {forEach, isEmpty} from "lodash";
import {push} from "react-router-redux";
import {submit, reduxForm, Field, Fields, change, formValueSelector} from "redux-form";

import {getPropVal, getObjChildsByConst, regNewUserSuccess, regNewUserWithECP} from "../../../shared/actions/actions";
import {required, requiredEmail, requiredLabel} from "../../../shared/utils/form_validations";
import AntModal from '../../../shared/components/AntModal';
import {
  renderCreatableSelect,
  renderDatePicker, renderDoubleDateInput,
  renderDoubleDatePicker,
  renderFileUpload, renderFileUploadBtn,
  renderInput,
  renderSelect
} from "../../../shared/utils/form_components";
import {digits, normalizePhone} from "../../../shared/utils/form_normalizing";
import {Link} from "react-router-dom";
import {sign} from "../../../shared/utils";
// import {showFileChooser, signXml} from "../../../shared/utils/ncaLayers";

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

class SignupForm extends React.Component {

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

  componentDidMount() {
    const self = this;
    window.signXmlBack = function signXmlBack(result) {
      if (result['code'] === "500") {
        alert(result['message']);
      } else if (result['code'] === "200") {
        const hideLoading = message.loading(self.props.t('REGGING_NEW_USER'), 60);
        const res = result['responseObject'];
        const fd = new FormData();
        fd.append('xml_values', res);
        regNewUserWithECP(fd)
          .then(res => res.data)
          .then(data => {
            hideLoading();
            data.success
              ? Modal.success({
                title: self.props.t("REGISTRATION_SUCCESS_TITLE"),
                content: self.props.t("REGISTRATION_SUCCESS_CONTENT"),
                onOk: () => {
                  self.props.push("/");
                }
              })
              : Modal.error({
                title: self.props.t("REGISTRATION_FAILED_TITLE"),
                content: data.errors[0].text
              });
          })
          .catch(err => {
            hideLoading()
            console.warn(err);
            Modal.error({
              title: self.props.t("REGISTRATION_FAILED_TITLE"),
              content: self.props.t("REGISTRATION_FAILED_CONTENT")
            });
          });
      }
    };
  }
  componentWillUnmount() {
    // cleaning
    delete window.signXmlBack;
    delete window.showFileChooserCall;
  }

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
    this.setState({
      modal: {
        visible: false
      },
      regulationsAcquainted: true
    });
  };

  handleModalCancel = () => {
    console.log('cancel');
    this.setState({
      modal: {
        visible: false
      }
    });
  };

  onSubmit = async ({scanCopyLetter, ecp, ...values}) => {
    const fd = new FormData();
    scanCopyLetter && scanCopyLetter.forEach((f, idx) => {
      f && fd.append(`files_scanCopyLetter_${idx+1}`, f)
    });

    ['regulationsAcquainted', 'publishedWork', 'bibliographicInform'].forEach(c => {
      this.state[c]
        ? fd.append(c, String(this.props.tofiConstants.yes.id))
        : fd.append(c, String(this.props.tofiConstants.no.id));
    });
    forEach(values, (value, key) => {
      if((values.theme[key] && (values.theme[key].ru || values.theme[key].idRef))) return;
      if(key === 'theme') {
        value.value && fd.append('themeId', String(value.value));
        !value.value && value.label && fd.append('themeName', String(value.label))
      }
      else if(value && value.value && typeof value === 'object') {
        fd.append(key, String(value.value))
      }
      else if(value && typeof value === 'object' && value.format && value.format('YYYY-MM-DD')) {
        fd.append(key, value.format('YYYY-MM-DD'));
      }
      else {
        value && fd.append(key, value);
      }
    });
    if(ecp) {
      const data = {};
      // add files
      for (let [key,value] of fd.entries()) {
        data[key] = value;
      }
      return sign('signXmlBackVS2', data);
    }
    const hideLoading = message.loading(this.props.t('REGGING_NEW_USER'), 60);
    return this.props.regNewUserSuccess(fd)
      .then(res => res.data)
      .then(data => {
        hideLoading();
        data.success
          ? Modal.success({
            title: this.props.t("REGISTRATION_SUCCESS_TITLE"),
            content: this.props.t("REGISTRATION_SUCCESS_CONTENT"),
            onOk: () => {
              this.props.push("/");
            }
          })
          : Modal.error({
            title: this.props.t("REGISTRATION_FAILED_TITLE"),
            content: data.errors[0].text
          });
      })
      .catch(err => {
        hideLoading()
        console.warn(err);
        Modal.error({
          title: this.props.t("REGISTRATION_FAILED_TITLE"),
          content: this.props.t("REGISTRATION_FAILED_CONTENT")
        });
      });
  };

  render() {
    if(isEmpty(this.props.tofiConstants)) return null;
    this.lng = localStorage.getItem('i18nextLng');

    const { iin, personLastName, personName, personPatronymic, dateOfBirth, gender, nationality,
      directUseDocument, goalSprav, formResultRealization, location, photo, copyUdl,
      personAcademicDegree, job, position, education, personAcademicTitle, scanCopyLetter,
      regulationsAcquainted, publishedWork, bibliographicInform } = this.props.tofiConstants;
    const {handleSubmit, t, submitting, reset, genderLoading, genderOptions, objNationalityOptions, objNationalityLoading,
      directUseDocumentOptions, directUseDocumentLoading, formResultRealizationOptions, formResultRealizationLoading,
      educationOptions, educationLoading, personAcademicDegreeOptions, objStudyParentOptions,
      personAcademicDegreeLoading, personAcademicTitleOptions, personAcademicTitleLoading, themeValue} = this.props;
    return (
      <div className="signup-container">
        <Form onSubmit={handleSubmit(this.onSubmit)} style={{background: '#F3F3F3', padding: '30px 50px 5px', minHeight: '100%'}} className='antForm-spaceBetween'>
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
              </Card>
            </Col>
            <Col sm={24} md={12}>
              <Card title={t('RESEARCHER')} className='card'>
                <Field
                  name="theme"
                  formItemClass="signup-form__input wrap-normal unset-lh"
                  component={renderCreatableSelect}
                  placeholder={t("THEME")}
                  label={t("THEME")}
                  formItemLayout={{
                    labelCol: {span: 10},
                    wrapperCol: {span: 14}
                  }}
                  onChange={(e, newValue) => {
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
                  colon={true}
                  validate={requiredLabel}
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
                {/*<Field
                  name='formResultRealizationFile'
                  component={renderFileUpload}
                  disabled={!themeValue || Boolean(themeValue && themeValue.formResultRealizationFile && Number(themeValue.formResultRealizationFile.ru))}
                  formItemClass="signup-form__input wrap-normal unset-lh"
                  label={formResultRealizationFile.name[this.lng]}
                  formItemLayout={
                    {
                      labelCol: {span: 10},
                      wrapperCol: {span: 14}
                    }
                  }
                />*/}
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
                  label={t('PHONE')}
                  formItemLayout={{
                    labelCol: {span: 10},
                    wrapperCol: {span: 14}
                  }}
                  colon={true}
                  validate={required}
                  normalize={normalizePhone}
                />
                <Field
                  name="login"
                  formItemClass="signup-form__input"
                  component={renderInput}
                  label={t('LOGIN')}
                  formItemLayout={{
                    labelCol: {span: 10},
                    wrapperCol: {span: 14}
                  }}
                  colon={true}
                  validate={required}
                />
                <Field
                  name="email"
                  formItemClass="signup-form__input"
                  component={renderInput}
                  label={t('EMAIL')}
                  formItemLayout={{
                    labelCol: {span: 10},
                    wrapperCol: {span: 14}
                  }}
                  colon={true}
                  validate={requiredEmail}
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
          <div className='flex'>
            <div className='checkbox-group'>
              <Checkbox checked={!isEmpty(this.props.scanCopyLetterValue)}>{t('LETTER_ISSUE')}</Checkbox>
              <Checkbox name='regulationsAcquainted' checked={this.state.regulationsAcquainted} onChange={this.onCheckboxChange}>{regulationsAcquainted.name[this.lng]}</Checkbox>
              <Checkbox name='publishedWork' checked={this.state.publishedWork} onChange={this.onCheckboxChange}>{publishedWork.name[this.lng]}</Checkbox>
              <Checkbox name='bibliographicInform' checked={this.state.bibliographicInform} onChange={this.onCheckboxChange}>{bibliographicInform.name[this.lng]}</Checkbox>
            </div>
            <div className='file-upload'>
              <Field
                key={this.lng}
                name='scanCopyLetter'
                component={renderFileUploadBtn}
                label={scanCopyLetter.name[this.lng]}
              />
            </div>
          </div>
          <div className='buttons'>
            <Button type='primary' htmlType='button' onClick={() => this.setState({ modal: {visible: true} })}>{t('READING_ROOM_RULES')}</Button>
            <Button.Group style={{ margin: '0 10px'}}>
              <Button htmlType='submit' disabled={!this.state.regulationsAcquainted}>{t('REGISTER')}</Button>
              <Button disabled={!this.state.regulationsAcquainted} onClick={handleSubmit(vals => this.onSubmit({...vals, ecp: true}))}>{t('SIGNUP_WITH_ECP')}</Button>
            </Button.Group>
            <Button htmlType='button' onClick={reset}>{t('CANCEL')}</Button>
          </div>
          <Form.Item>
            {t('ALREADY_HAVE_ACCOUNT')} {' '}
            <Link className="signup-form__link" to="/login">
              {t('LOGIN')}
            </Link>
          </Form.Item>
        </Form>
        <AntModal
          allowFullScreen={true}
          onOk={this.handleModalOk}
          onCancel={this.handleModalCancel}
          visible={this.state.modal.visible}
          width={'70%'}
          okBtnText={t('AGREE')}
          title={t('READING_ROOM_RULES')}
        >
          <iframe title="signupform" src={process.env.PUBLIC_URL + '/Правила работы в читальном зале.pdf'} frameBorder="0" width='100%' height='550px'/>
        </AntModal>
      </div>
    )
  }
}

const selector = formValueSelector('signUpForm');

function mapStateToProps(state) {
  const themeValue = selector(state, 'theme');
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
    objStudyParentOptions: state.generalData.objStudyParent
  }
}

export default connect(mapStateToProps, {submit, change, push, getPropVal, getObjChildsByConst, regNewUserSuccess})(reduxForm({
  form: "signUpForm",
  validate,
  initialValues: {iin: '950223350036', personLastName: 'Izbassar', personName: 'Nurbek', email: 'nurbek-2395@mail.ru', phone: '87071723132', login: 'Nur'}
})(translate('signUpForm')(SignupForm)));