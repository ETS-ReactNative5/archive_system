import React from "react"
import {
    renderCheckbox,
    renderDatePicker, renderFileUploadBtn,
    renderInput, renderSelect
} from "../../../../utils/form_components";
import {Field, reduxForm} from "redux-form";
import {Button, Col} from "antd";
import {onSaveCubeData, parseCube_new, parseForTable} from "../../../../utils/cubeParser";
import {isEqual, pickBy} from 'lodash';
import  {message} from "antd";
import {connect} from "react-redux";
import axios from 'axios';
import moment from "moment";
import Form from "antd/es/form/Form";
import Row from "antd/es/grid/row";
import {requiredArr, requiredLabel} from "../../../../utils/form_validations";
import {getPropVal} from "../../../../actions/actions";
import ComplexContactTable from "./ComplexContactTable";

class StorageOptionsForm extends React.Component {
    state = {
        loading: {
            fundArchiveLoading: false,
            orgDocTypeLoading: false,
            lightingTypeLoading: false,
            materialOfLockersLoading: false,
            shelvingLoading: false

        },
        optionMultiSelect: []
    };
    checkboxToRedux = (val, prevVal) => {
        let newVal = {...prevVal};
        const {yes, irreparablyDamagedTrue, irreparablyDamagedFalse, no} = this.props.tofiConstants
        if (prevVal === null) {
            let objVal = {}
            if (val === true) {
                objVal = {
                    value: Number(irreparablyDamagedTrue.id),
                    kFromBase: val

                }
            } else {
                objVal = {
                    value: Number(irreparablyDamagedFalse.id),
                    kFromBase: val
                }
            }

            return (objVal)
        } else {
            if (val === true) {
                newVal.value = Number(irreparablyDamagedTrue.id)
                newVal.kFromBase = val
            } else {
                newVal.value = Number(irreparablyDamagedFalse.id)
                newVal.kFromBase = val
            }


            return (newVal)

        }
    }


    loadOptions = c => {
        return () => {
            if (!this.props[c + 'Options']) {
                this.setState({loading: {...this.state.loading, [c + 'Loading']: true}});
                this.props.getPropVal(c)
                .then(() => this.setState({
                    loading: {
                        ...this.state.loading,
                        [c + 'Loading']: false
                    }
                }))
            }
        }
    };
    dateToRedux = (val, prev) => {
        {
            let coppyPrev = {...prev};

            if (!!val) {
                let newDate = moment(val).format("DD-MM-YYYY");
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
    strToRedux = (val, prevVal, obj, prevObj) => {
        var newVal = {...prevVal};
        if (prevVal === null) {
            let objVal = {
                value: val,
                valueLng: {kz: val},
                valueLng: {ru: val},
                valueLng: {en: val}
            }
            return objVal
        } else {
            newVal.value = val;
            newVal['valueLng'] = {kz: val, ru: val, en: val}

            return (newVal)

        }
    };
    fileToRedux = (val, prevVal, file, str) => {
        let newFile = val.filter(el => el instanceof File);
        if (newFile.length > 0) {
            var copyVal = prevVal ? [...prevVal] : []
            newFile.map(el => {
                copyVal.push({
                    value: el
                })
            });
            return copyVal
        } else {
            return val.length == 0 ? [] : val
        }
    };
    selectToRedux = (val, prevVal, obj, prevObj) => {
        debugger;
        if (val !== undefined) {
            if (val === null) {
                let newValNull = {...prevVal};
                newValNull.label = null;
                newValNull.labelFull = null;
                newValNull.value = null;
                return newValNull
            } else {
                let newVal = {...prevVal};
                newVal.value = val.value;
                newVal.label = val.label;
                newVal.labelFull = val.label;
                return (newVal)
            }

        }
    };
    selectMultiToRedux = (val, prevVal, obj, prevObj) => {
        if (val !== undefined) {
            if (val.length > 0) {
                let coppyPrevVal = prevVal ? [...prevVal] : []
                let coppyVal = [...val]
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

                for (let i = 0; i < coppyVal.length; i++) {
                    if (coppyVal[i].idDataPropVal === undefined) {
                        let findVal = this.state.optionMultiSelect.find((el) => el.value === coppyVal[i].value)
                        if (findVal !== undefined) {
                            coppyVal.splice(i, 1)
                            coppyVal.push(findVal)
                        }
                    }
                }
                return coppyVal
            } else {
                return []
            }
        }
    };
    save = async ({contactPersonsComplex, contactPersonsComplexNum, contactPersonsComplexFio, contactPersonsComplexPosition, contactPersonsComplexPhone, contactPersonsComplexEmail, ...values}) => {

        const {name, accessLevel, ...rest} = pickBy(values, (val, key) => !isEqual(val, this.props.initialValues[key]));
        const objData = {};
        if (name) {
            objData.name = name;
            objData.fullName = name;
        }
        if (accessLevel) objData.accessLevel = accessLevel;

        let hideLoading;
        try {


            const c = {
                cube: {
                    cubeSConst: 'cubeForFundAndIK',
                    doConst: 'doForFundAndIK',
                    dpConst: 'dpForFundAndIK',
                    data: this.props.cubeData
                },
                obj: {
                    doItem: this.props.selectedIK.id
                }
            };

            const v = {
                values: rest,
                complex: "",
                oFiles: {}
            };

            const objData = {};
            const t = this.props.tofiConstants;

            hideLoading = message.loading(this.props.t('UPDATING_PROPS'), 0);
            const resSave = await onSaveCubeData(c, v, t, objData);
            hideLoading();
            if (!resSave.success) {
                message.error(this.props.t('PROPS_UPDATING_ERROR'));
                resSave.errors.forEach(err => {
                    message.error(err.text)
                });
                return Promise.reject(resSave);
            }
            message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'));
            return this.props.getCube('cubeForFundAndIK', JSON.stringify(this.filters))
            .then(() => {
                this.setState({loading: false, openCard: false});
                return {success: true}
            })


        } catch(e) {
            typeof hideLoading === 'function' && hideLoading();
            this.setState({loading: false});
            console.warn(e);
        }
    };

    render() {
        this.lng = localStorage.getItem('i18nextLng');
        const {submitting, error, reset, handleSubmit, dirty, tofiConstants, t, fundArchiveOptions, orgDocTypeOption, initialValues, shelvingOptions, lightingTypeOptions, materialOfLockersOptions} = this.props;
        const {hasArchiveStore, fireExtTools, irreparablyDamagedTrue, roomHeating, hasFireAlarm, hasSecurityAlarmSystem, hasDevices, lighting, lockers, hasReadingRoom, numberOfRooms, roomArea, roomOccupancy, lightingType, materialOfLockers, shelving} = this.props.tofiConstants;

        const formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 14}
        };
        const {loading} = this.state;
        const hasNot = this.props.tofiConstants['irreparablyDamagedFalse'].id;
        return (
        <div>
            <br/>
            <Form className="antForm-spaceBetween dBlock"
                  onSubmit={handleSubmit(this.save)}
                  style={dirty ? {paddingBottom: '43px'} : {}}>
                <hr/>
                <br/>
                <Row>
                    <Col span={12}>
                        {hasArchiveStore &&
                        <Field
                        name="hasArchiveStore"
                        component={renderCheckbox}
                        format={v => v && v.value === irreparablyDamagedTrue.id ? true : false}
                        normalize={this.checkboxToRedux}
                        label={hasArchiveStore.name[this.lng]}
                        formItemLayout={{
                            labelCol: {span: 20},
                            wrapperCol: {span: 4}
                        }}
                        />
                        }
                        {fireExtTools &&
                        <Field
                        name="fireExtTools"
                        component={renderCheckbox}
                        format={v => v && v.value === irreparablyDamagedTrue.id ? true : false}
                        normalize={this.checkboxToRedux}
                        label={fireExtTools.name[this.lng]}
                        formItemLayout={{
                            labelCol: {span: 20},
                            wrapperCol: {span: 4}
                        }}
                        />
                        }
                        {roomHeating &&
                        <Field
                        name="roomHeating"
                        component={renderCheckbox}
                        format={v => v && v.value === irreparablyDamagedTrue.id ? true : false}
                        normalize={this.checkboxToRedux}
                        label={roomHeating.name[this.lng]}
                        formItemLayout={{
                            labelCol: {span: 20},
                            wrapperCol: {span: 4}
                        }}
                        />
                        }
                        {hasFireAlarm &&
                        <Field
                        name="hasFireAlarm"
                        component={renderCheckbox}
                        format={v => v && v.value === irreparablyDamagedTrue.id ? true : false}
                        normalize={this.checkboxToRedux}
                        label={hasFireAlarm.name[this.lng]}
                        formItemLayout={{
                            labelCol: {span: 20},
                            wrapperCol: {span: 4}
                        }}
                        />
                        }
                        {hasSecurityAlarmSystem &&
                        <Field
                        name="hasSecurityAlarmSystem"
                        component={renderCheckbox}
                        format={v => v && v.value === irreparablyDamagedTrue.id ? true : false}
                        normalize={this.checkboxToRedux}
                        label={hasSecurityAlarmSystem.name[this.lng]}
                        formItemLayout={{
                            labelCol: {span: 20},
                            wrapperCol: {span: 4}
                        }}
                        />
                        }
                        {hasDevices &&
                        <Field
                        name="hasDevices"
                        component={renderCheckbox}
                        format={v => v && v.value === irreparablyDamagedTrue.id ? true : false}
                        normalize={this.checkboxToRedux}
                        label={hasDevices.name[this.lng]}
                        formItemLayout={{
                            labelCol: {span: 20},
                            wrapperCol: {span: 4}
                        }}
                        />
                        }
                        {lighting &&
                        <Field
                        name="lighting"
                        component={renderCheckbox}
                        format={v => v && v.value === irreparablyDamagedTrue.id ? true : false}
                        normalize={this.checkboxToRedux}
                        label={lighting.name[this.lng]}
                        formItemLayout={{
                            labelCol: {span: 20},
                            wrapperCol: {span: 4}
                        }}
                        />
                        }
                        {lockers &&
                        <Field
                        name="lockers"
                        component={renderCheckbox}
                        format={v => v && v.value === irreparablyDamagedTrue.id ? true : false}
                        normalize={this.checkboxToRedux}
                        label={lockers.name[this.lng]}
                        formItemLayout={{
                            labelCol: {span: 20},
                            wrapperCol: {span: 4}
                        }}
                        />
                        }
                        {hasReadingRoom &&
                        <Field
                        name="hasReadingRoom"
                        component={renderCheckbox}
                        format={v => v && v.value === irreparablyDamagedTrue.id ? true : false}
                        normalize={this.checkboxToRedux}
                        label={hasReadingRoom.name[this.lng]}
                        formItemLayout={{
                            labelCol: {span: 20},
                            wrapperCol: {span: 4}
                        }}
                        />
                        }
                    </Col>
                    <Col span={12}>
                        <div className="borderGroup">
                            <span className="borderGroupTitle">Помещение</span>

                            {numberOfRooms && (
                            <Field
                            name="numberOfRooms"
                            component={renderInput}
                            normalize={this.strToRedux}
                            label={numberOfRooms.name[this.lng]}
                            formItemLayout={{
                                labelCol: {span: 10},
                                wrapperCol: {span: 13}
                            }}
                            />
                            )}
                            {roomArea && (
                            <Field
                            name="roomArea"
                            component={renderInput}
                            normalize={this.strToRedux}
                            label={roomArea.name[this.lng]}
                            formItemLayout={{
                                labelCol: {span: 10},
                                wrapperCol: {span: 13}
                            }}
                            />
                            )}
                            {roomOccupancy && (
                            <Field
                            name="roomOccupancy"
                            component={renderInput}
                            normalize={this.strToRedux}
                            label={roomOccupancy.name[this.lng]}
                            formItemLayout={{
                                labelCol: {span: 10},
                                wrapperCol: {span: 13}
                            }}
                            />
                            )}

                            {lightingType && (
                            <Field
                            name="lightingType"
                            component={renderSelect}
                            normalize={this.selectToRedux}
                            label={lightingType.name[this.lng]}
                            formItemLayout={{
                                labelCol: {span: 10},
                                wrapperCol: {span: 14}
                            }}
                            isLoading={this.state.lightingTypeLoading}
                            data={
                                lightingTypeOptions
                                ? lightingTypeOptions.map(option => ({
                                    value: option.id,
                                    label: option.name[this.lng]
                                }))
                                : []
                            }
                            onMenuOpen={this.loadOptions(["lightingType"])}
                            // validate={requiredLabel}
                            // colon={true}
                            />
                            )}

                            {materialOfLockers && <Field
                            name="materialOfLockers"
                            component={renderSelect}
                            isMulti
                            normalize={this.selectMultiToRedux}
                            label={materialOfLockers.name[this.lng]}
                            formItemLayout={{
                                labelCol: {span: 10},
                                wrapperCol: {span: 14}
                            }}
                            isLoading={loading.materialOfLockersLoading}
                            data={materialOfLockersOptions ? materialOfLockersOptions.map(option => ({
                                value: option.id,
                                label: option.name[this.lng]
                            })) : []}
                            onMenuOpen={this.loadOptions('materialOfLockers')}
                            />}

                            {shelving && (
                            <Field
                            name="shelving"
                            component={renderSelect}
                            normalize={this.selectToRedux}
                            label={shelving.name[this.lng]}
                            formItemLayout={{
                                labelCol: {span: 10},
                                wrapperCol: {span: 14}
                            }}
                            isLoading={this.state.shelvingLoading}
                            data={
                                shelvingOptions
                                ? shelvingOptions.map(option => ({
                                    value: option.id,
                                    label: option.name[this.lng]
                                }))
                                : []
                            }
                            onMenuOpen={this.loadOptions(["shelving"])}
                            // validate={requiredLabel}
                            // colon={true}
                            />
                            )}

                        </div>
                    </Col>
                </Row>


                {dirty && <Form.Item className="ant-form-btns">
                    <Button className="signup-form__btn" type="primary" htmlType="submit"
                            disabled={submitting}>
                        {submitting ? t('LOADING...') : t('SAVE')}
                    </Button>
                    <Button className="signup-form__btn" type="danger" htmlType="button"
                            disabled={submitting}
                            style={{marginLeft: '10px'}} onClick={reset}>
                        {submitting ? t('LOADING...') : t('CANCEL')}
                    </Button>
                    {error && <span className="message-error"><i
                    className="icon-error"/>{error}</span>}
                </Form.Item>}
            </Form>
        </div>
        )
    }
}

export default connect(state => {
    return {
        lightingTypeOptions: state.generalData.lightingType,
        shelvingOptions: state.generalData.shelving,
        materialOfLockersOptions: state.generalData.materialOfLockers,
        tofiConstants: state.generalData.tofiConstants,
        fundArchiveOptions: state.generalData.fundArchive,
        orgDocTypeOption: state.generalData.orgDocType
    }
}, {getPropVal})(reduxForm({
    form: 'StorageOptionsForm',
    enableReinitialize: true,
})(StorageOptionsForm));