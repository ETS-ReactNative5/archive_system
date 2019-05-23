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
import {required, requiredEmail, requiredLng, requiredLabel} from "../../utils/form_validations";
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
    if (values.chronologicalBegin &&
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
        optionMultiSelect: [],

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
    loadChilds2 = async (c, props) => {

        let data = await  this.props.getObjChildsByConst(c, props)
            .then((res) => {
                return res
            })
            .catch(err => console.error(err))
        return data
    }


    async componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.initialValues.propStudy !== prevProps.initialValues.propStudy) {
            if (this.props.initialValues.propStudy) {
                let data = await this.loadChilds2('objStudyParent', 'directUseDocument,goalSprav,chronologicalBegin,chronologicalEnd,formResultRealization,formResultRealizationFile')
                let item = !!data && data.data.find((el)=> el.id === this.props.initialValues.propStudy[0].value)
                setTimeout(()=>{
                    this.getOptonsInput(item)

                },1000)
            }

        }
    }

    getOptonsInput = (newValue) => {
        if (newValue && newValue.constructor === Object) {
            newValue.directUseDocument && newValue.directUseDocument.idRef ?
                this.props.change('directUseDocument', {
                    value: newValue.directUseDocument.idRef,
                    label: newValue.directUseDocument.name.ru
                })
                : this.props.change('directUseDocument', null);

            newValue.goalSprav && newValue.goalSprav.ru ?
                this.props.change('goalSprav', newValue.goalSprav.ru)
                : this.props.change('goalSprav', '');

            newValue.chronologicalBegin && newValue.chronologicalBegin.ru ?
                this.props.change('chronologicalBegin', newValue.chronologicalBegin.ru)
                : this.props.change('chronologicalBegin', '');

            newValue.chronologicalEnd && newValue.chronologicalEnd.ru ?
                this.props.change('chronologicalEnd', newValue.chronologicalEnd.ru)
                : this.props.change('chronologicalEnd', '');

            newValue.formResultRealization && newValue.formResultRealization.idRef ?
                this.props.change('formResultRealization', {
                    value: newValue.formResultRealization.idRef,
                    label: newValue.formResultRealization.name.ru
                })
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
    }
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
        if (!res.success) {
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

    onSubmit = ({phone, login, email, directUseDocument, goalSprav,chronologicalBegin, chronologicalEnd,propStudy, formResultRealization,  ...values}) => {
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
                name[lang] = `${pesonLastNameToSend.value} ${personNameToSend.value} ${personPatronymicToSend.value}`.trim();
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
    photoToRedux = (val, prevVal, file, str) => {
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

    fileToRedux = (val, prevVal, file, str) => {

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

            }else{
                return []
            }
        }

    };

    render() {
        if (isEmpty(this.props.tofiConstants)) return null;
        this.lng = localStorage.getItem('i18nextLng');
        const {
            iin, personLastName, personName, personPatronymic, dateOfBirth, gender, nationality,
            directUseDocument, goalSprav, formResultRealization, location, photo, copyUdl,
            personAcademicDegree, job, position, education, personAcademicTitle
        } = this.props.tofiConstants;
        const {
            handleSubmit, t, reset, submitting, dirty, genderLoading, genderOptions, objNationalityOptions, objNationalityLoading,
            directUseDocumentOptions, directUseDocumentLoading, formResultRealizationOptions, formResultRealizationLoading,
            educationOptions, educationLoading, personAcademicDegreeOptions, objStudyParentOptions,
            personAcademicDegreeLoading, personAcademicTitleOptions, personAcademicTitleLoading, themeValue
        } = this.props;
        return (
            <div className="signup-container">
                <Form onSubmit={handleSubmit(this.onSubmit)}
                      style={{background: '#FFF3E0', padding: '30px 50px 5px', minHeight: '100%'}}
                      className='antForm-spaceBetween'>
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
                                            normalize={this.strToRedux}
                                            colon={true}
                                            validate={requiredLng}
                                        />
                                        <Field
                                            name="personLastName"
                                            formItemClass="signup-form__input"
                                            component={renderInput}
                                            placeholder={t("LAST_NAME_PLACEHOLDER")}
                                            label={personLastName.name[this.lng]}
                                            normalize={this.strToRedux}

                                            formItemLayout={{
                                                labelCol: {span: 10},
                                                wrapperCol: {span: 14}
                                            }}
                                            colon={true}
                                            validate={requiredLng}
                                        />
                                        <Field
                                            name="personName"
                                            formItemClass="signup-form__input"
                                            component={renderInput}

                                            placeholder={t("FIRST_NAME_PLACEHOLDER")}
                                            label={personName.name[this.lng]}
                                            normalize={this.strToRedux}

                                            formItemLayout={{
                                                labelCol: {span: 10},
                                                wrapperCol: {span: 14}
                                            }}
                                            validate={requiredLng}
                                            colon={true}
                                        />
                                        <Field
                                            name="personPatronymic"
                                            formItemClass="signup-form__input"
                                            component={renderInput}
                                            placeholder={t("MIDDLE_NAME_PLACEHOLDER")}
                                            label={personPatronymic.name[this.lng]}
                                            normalize={this.strToRedux}

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
                                            normalize={this.dateToRedux}
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
                                            normalize={this.selectToRedux}

                                            formItemLayout={{
                                                labelCol: {span: 10},
                                                wrapperCol: {span: 14}
                                            }}
                                            data={genderOptions ? genderOptions.map(option => ({
                                                value: option.id,
                                                label: option.name[this.lng]
                                            })) : []}
                                            isLoading={genderLoading}
                                            onMenuOpen={this.loadOptions('gender')}
                                        />
                                        <Field
                                            name="nationality"
                                            formItemClass="signup-form__input"
                                            component={renderSelect}
                                            normalize={this.selectToRedux}

                                            label={nationality.name[this.lng]}
                                            formItemLayout={{
                                                labelCol: {span: 10},
                                                wrapperCol: {span: 14}
                                            }}
                                            data={objNationalityOptions ? objNationalityOptions.map(option => ({
                                                value: option.id,
                                                label: option.name[this.lng]
                                            })) : []}
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
                                            normalize={this.photoToRedux}

                                            uploadText={t('UPLOAD')}
                                        />
                                        <Field
                                            name="copyUdl"
                                            formItemClass="signup-form__input wrap-normal unset-lh"
                                            component={renderFileUpload}
                                            normalize={this.photoToRedux}

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
                                    name="propStudy"
                                    formItemClass="signup-form__input wrap-normal unset-lh"
                                    component={renderCreatableSelect}
                                    placeholder={t("THEME")}
                                    label={t("THEME")}
                                    normalize={this.selectMultiToRedux}

                                    formItemLayout={{
                                        labelCol: {span: 10},
                                        wrapperCol: {span: 14}
                                    }}
                                    onChange={(e, newValue) => {
                                        if (newValue && newValue.constructor === Object) {
                                            newValue.directUseDocument && newValue.directUseDocument.idRef ?
                                                this.props.change('directUseDocument', {
                                                    value: newValue.directUseDocument.idRef,
                                                    label: newValue.directUseDocument.name.ru
                                                })
                                                : this.props.change('directUseDocument', null);

                                            newValue.goalSprav && newValue.goalSprav.ru ?
                                                this.props.change('goalSprav', newValue.goalSprav.ru)
                                                : this.props.change('goalSprav', '');

                                            newValue.chronologicalBegin && newValue.chronologicalBegin.ru ?
                                                this.props.change('chronologicalBegin', newValue.chronologicalBegin.ru)
                                                : this.props.change('chronologicalBegin', '');

                                            newValue.chronologicalEnd && newValue.chronologicalEnd.ru ?
                                                this.props.change('chronologicalEnd', newValue.chronologicalEnd.ru)
                                                : this.props.change('chronologicalEnd', '');

                                            newValue.formResultRealization && newValue.formResultRealization.idRef ?
                                                this.props.change('formResultRealization', {
                                                    value: newValue.formResultRealization.idRef,
                                                    label: newValue.formResultRealization.name.ru
                                                })
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
                                    data={objStudyParentOptions ? objStudyParentOptions.map(option => ({
                                        ...option,
                                        value: option.id,
                                        label: option.name[this.lng]
                                    })) : []}
                                    isLoading={this.state.loading.objStudyParentLoading}
                                    onMenuOpen={this.loadChilds('objStudyParent', 'directUseDocument,goalSprav,chronologicalBegin,chronologicalEnd,formResultRealization,formResultRealizationFile')}
                                    onCreateOption={this.handleCreate}
                                    isValidNewOption={(v) => !!v}
                                    colon={true}
                                />
                                <Field
                                    name="directUseDocument"
                                    formItemClass="signup-form__input wrap-normal unset-lh"
                                    component={renderSelect}
                                    disabled
                                    label={directUseDocument.name[this.lng]}
                                    formItemLayout={{
                                        labelCol: {span: 10},
                                        wrapperCol: {span: 14}
                                    }}
                                    data={directUseDocumentOptions ? directUseDocumentOptions.map(option => ({
                                        value: option.id,
                                        label: option.name[this.lng]
                                    })) : []}
                                    isLoading={directUseDocumentLoading}
                                    onMenuOpen={this.loadOptions('directUseDocument')}
                                />
                                <Field
                                    name="goalSprav"
                                    formItemClass="signup-form__input wrap-normal unset-lh"
                                    component={renderInput}
                                    format={(val) => {
                                        return {value: val}
                                    }}
                                    validate={requiredLng}
                                    disabled
                                    label={goalSprav.name[this.lng]}
                                    formItemLayout={{
                                        labelCol: {span: 10},
                                        wrapperCol: {span: 14}
                                    }}
                                />
                                <Fields
                                    names={['chronologicalBegin', 'chronologicalEnd']}
                                    component={renderDoubleDateInput}

                                    disabledFields={{
                                        chronologicalBegin: true,
                                        chronologicalEnd: true
                                    }}
                                    normalizeFields={{
                                        chronologicalBegin: digits(4),
                                        chronologicalEnd: digits(4)
                                    }}
                                    label={t('start-end')}
                                    validate={requiredLng}
                                    formItemLayout={
                                        {
                                            labelCol: {span: 10},
                                            wrapperCol: {span: 14}
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
                                    data={formResultRealizationOptions ? formResultRealizationOptions.map(option => ({
                                        value: option.id,
                                        label: option.name[this.lng]
                                    })) : []}
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
                                    normalize={this.strToRedux}

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
                                    data={educationOptions ? educationOptions.map(option => ({
                                        value: option.id,
                                        label: option.name[this.lng]
                                    })) : []}
                                    isLoading={educationLoading}
                                    onMenuOpen={this.loadOptions('education')}
                                    normalize={this.selectToRedux}

                                />
                                <Field
                                    name="personAcademicDegree"
                                    formItemClass="signup-form__input"
                                    component={renderSelect}
                                    label={personAcademicDegree.name[this.lng]}
                                    normalize={this.selectToRedux}

                                    formItemLayout={{
                                        labelCol: {span: 10},
                                        wrapperCol: {span: 14}
                                    }}
                                    data={personAcademicDegreeOptions ? personAcademicDegreeOptions.map(option => ({
                                        value: option.id,
                                        label: option.name[this.lng]
                                    })) : []}
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
                                    data={personAcademicTitleOptions ? personAcademicTitleOptions.map(option => ({
                                        value: option.id,
                                        label: option.name[this.lng]
                                    })) : []}
                                    isLoading={personAcademicTitleLoading}
                                    onMenuOpen={this.loadOptions('personAcademicTitle')}
                                    normalize={this.selectToRedux}

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
                                    normalize={this.strToRedux}

                                    // colon={true}
                                    // validate={required}
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
                                    normalize={this.strToRedux}

                                    // colon={true}
                                    // validate={required}

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
                                    normalize={this.strToRedux}

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
                                    normalize={this.strToRedux}

                                />
                            </Card>
                        </Col>
                    </Row>
                    <div className='buttons'>
                        <Button type='primary' htmlType='button'
                                onClick={() => this.setState({modal: {visible: true}})}>{t('CHANGE_PASSWORD')}</Button>
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