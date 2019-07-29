import React, { Component } from 'react';
import {Button, Form, Input} from "antd";
import './ArchiveManagements.css';
import {renderInput} from "../../../utils/form_components";
import {Field, reduxForm} from "redux-form";
import {connect} from "react-redux";
import {isEqual, pickBy} from "lodash";
import {CUBE_FOR_AF_CASE, DO_FOR_CASE, DP_FOR_CASE} from "../../../constants/tofiConstants";

const { Option } = Input;
class ArchiveManagementsCard extends Component {

    constructor(props){
        super(props);
        this.state = {
            data: []
        };
    }

    componentDidUpdate(previousProps) {
        if(previousProps.initialValues !== this.props.initialValues){
            this.setState({
                data: this.props.initialValues
            });
        }
    }

    strToRedux = (val, prevVal, obj, prevObj, flag) => {
        if(!!flag){
            val = val.replace(/[^\d;]/g, '')
        }
        var newVal = { ...prevVal };
        if (prevVal === null) {
            let objVal = {
                value: val,
                valueLng: { kz: val },
                valueLng: { ru: val },
                valueLng: { en: val }
            };
            return objVal;
        } else {
            newVal.value = val;
            newVal["valueLng"] = { kz: val, ru: val, en: val };

            return newVal;
        }
    };

    onSave = ({ ...values }) => {

            const cube = {
                cubeSConst: "cubeArchive",
                doConst: "doCubeArchive",
                dpConst: "dpCubeArchive",
            };
            const objData = {};
            const props = pickBy(
                values,
                (val, key) => !isEqual(val, this.props.initialValues[key])
            );
            let val = {
                values:props
            }
            return this.props.saveProps(
                {
                    cube,
                },
                val,
                this.props.tofiConstants,
                objData,
                this.props.initialValues.id
            );

    };

    render(){
        const lng = localStorage.getItem('i18nextLng');
        const {handleSubmit, dirty,t,error, reset, submitting, tofiConstants: { publicGuidebook,publicDirectoryAdm,publicDirectoryHistory,publicDirectoryOther,booksBrochures,
            newspapers,journal,typePrintedProducts,archiveBuildings,specialRooms,fittedRooms,archivalUtilRate,
            buildSecAlarm,fireBuildEquipment,lengthMetalShelving,lengthWoodenShelving,outlinedDocuments}} = this.props;

        return(
            <div><Form className="antForm-spaceBetween" onSubmit={handleSubmit(this.onSave)}>
                <fieldset className="state__border">
                    <legend className="state__border-text" style={{margin:".5vw", width:"20%", borderBottom:"none", color:"#000"}}>Справочно-информационные издания</legend>
                    <div className="state__border-body">
                        <Field
                            name="publicGuidebook"
                            component={renderInput}
                            normalize={this.strToRedux}
                            label={publicGuidebook.name[lng]}
                            formItemLayout={{
                                labelCol: { span: 8 },
                                wrapperCol: { span: 2 }
                            }}
                        />
                        <Field
                            name="publicDirectoryAdm"
                            component={renderInput}
                            normalize={this.strToRedux}
                            label={publicDirectoryAdm.name[lng]}
                            formItemLayout={{
                                labelCol: { span: 8 },
                                wrapperCol: { span: 2 }
                            }}
                        />
                        <Field
                            name="publicDirectoryHistory"
                            component={renderInput}
                            normalize={this.strToRedux}
                            label={publicDirectoryHistory.name[lng]}
                            formItemLayout={{
                                labelCol: { span: 8 },
                                wrapperCol: { span: 2 }
                            }}
                        />
                        <Field
                            name="publicDirectoryOther"
                            component={renderInput}
                            normalize={this.strToRedux}
                            label={publicDirectoryOther.name[lng]}
                            formItemLayout={{
                                labelCol: { span: 8 },
                                wrapperCol: { span: 2 }
                            }}
                        />
                        {/*<div className='inpt-cnt'>*/}
                        {/*    <label className='inpt'>*/}
                        {/*        {t('AMOUNT')}*/}
                        {/*        <Input*/}
                        {/*            name="AMOUNT"*/}
                        {/*            label={t('AMOUNT')}*/}
                        {/*            className='inptLbl'*/}
                        {/*            disabled={true}*/}
                        {/*            value=''*/}
                        {/*        />*/}
                        {/*    </label>*/}
                        {/*</div>*/}
                        <Field
                            name="summa"
                            component={renderInput}
                            normalize={this.strToRedux}
                            label={t('AMOUNT')}
                            formItemLayout={{
                                labelCol: { span: 8 },
                                wrapperCol: { span: 2 }
                            }}
                            disabled={true}
                        />
                    </div>
                </fieldset>
                <fieldset className="state__border" style={{marginTop:".5vw"}}>
                    <legend className="state__border-text" style={{margin:".5vw", width:"25%", borderBottom:"none", color:"#000"}}>Состав и объем научно-справочной библиотеки</legend>
                    <div className="state__border-body">
                        <Field
                            name="booksBrochures"
                            component={renderInput}
                            normalize={this.strToRedux}
                            label={booksBrochures.name[lng]}
                            formItemLayout={{
                                labelCol: { span: 8 },
                                wrapperCol: { span: 2 }
                            }}
                        />
                        <Field
                            name="newspapers"
                            component={renderInput}
                            normalize={this.strToRedux}
                            label={newspapers.name[lng]}
                            formItemLayout={{
                                labelCol: { span: 8 },
                                wrapperCol: { span: 2 }
                            }}
                        />
                        <Field
                            name="journal"
                            component={renderInput}
                            normalize={this.strToRedux}
                            label={journal.name[lng]}
                            formItemLayout={{
                                labelCol: { span: 8 },
                                wrapperCol: { span: 2 }
                            }}
                        />
                        <Field
                            name="typePrintedProducts"
                            component={renderInput}
                            normalize={this.strToRedux}
                            label={typePrintedProducts.name[lng]}
                            formItemLayout={{
                                labelCol: { span: 8 },
                                wrapperCol: { span: 2 }
                            }}
                        />
                    </div>
                </fieldset>
                <fieldset className="state__border" style={{marginTop:".5vw"}}>
                    <legend className="state__border-text" style={{margin:".5vw", width:"18%", borderBottom:"none", color:"#000"}}>Условия хранения документов</legend>
                    <div className="state__border-body">
                        <Field
                            name="archiveBuildings"
                            component={renderInput}
                            normalize={this.strToRedux}
                            label={archiveBuildings.name[lng]}
                            formItemLayout={{
                                labelCol: { span: 8 },
                                wrapperCol: { span: 2 }
                            }}
                        />
                        <Field
                            name="specialRooms"
                            component={renderInput}
                            normalize={this.strToRedux}
                            label={specialRooms.name[lng]}
                            formItemLayout={{
                                labelCol: { span: 8 },
                                wrapperCol: { span: 2 }
                            }}
                        />
                        <Field
                            name="fittedRooms"
                            component={renderInput}
                            normalize={this.strToRedux}
                            label={fittedRooms.name[lng]}
                            formItemLayout={{
                                labelCol: { span: 8 },
                                wrapperCol: { span: 2 }
                            }}
                        />
                        <Field
                            name="archivalUtilRate"
                            component={renderInput}
                            normalize={this.strToRedux}
                            label={archivalUtilRate.name[lng]}
                            formItemLayout={{
                                labelCol: { span: 8 },
                                wrapperCol: { span: 2 }
                            }}
                        />
                        <Field
                            name="buildSecAlarm"
                            component={renderInput}
                            normalize={this.strToRedux}
                            label={buildSecAlarm.name[lng]}
                            formItemLayout={{
                                labelCol: { span: 8 },
                                wrapperCol: { span: 2 }
                            }}
                        />
                        <Field
                            name="fireBuildEquipment"
                            component={renderInput}
                            normalize={this.strToRedux}
                            label={fireBuildEquipment.name[lng]}
                            formItemLayout={{
                                labelCol: { span: 8 },
                                wrapperCol: { span: 2 }
                            }}
                        />
                        <Field
                            name="lengthMetalShelving"
                            component={renderInput}
                            normalize={this.strToRedux}
                            label={lengthMetalShelving.name[lng]}
                            formItemLayout={{
                                labelCol: { span: 8 },
                                wrapperCol: { span: 2 }
                            }}
                        />
                        <Field
                            name="outlinedDocuments"
                            component={renderInput}
                            normalize={this.strToRedux}
                            label={outlinedDocuments.name[lng]}
                            formItemLayout={{
                                labelCol: { span: 8 },
                                wrapperCol: { span: 2 }
                            }}
                        />
                        {dirty && (
                            <Form.Item className="ant-form-btns btn-archive">
                                <Button
                                    className="signup-form__btn"
                                    type="primary"
                                    htmlType="submit"
                                    disabled={submitting}
                                >
                                    {submitting ? t("LOADING...") : t("SAVE")}
                                </Button>
                                <Button
                                    className="signup-form__btn"
                                    type="danger"
                                    htmlType="button"
                                    disabled={submitting}
                                    style={{ marginLeft: "10px" }}
                                    onClick={reset}
                                >
                                    {submitting ? t("LOADING...") : t("CANCEL")}
                                </Button>
                                {error && (
                                    <span className="message-error">
                                        <i className="icon-error" />
                                           {error}
                                    </span>
                                )}
                            </Form.Item>
                        )}
                    </div>
                </fieldset>

            </Form></div>
        )
    }
}


export default connect()(reduxForm({
            form: "ArchiveManagementsCard",
            enableReinitialize: true
            })(ArchiveManagementsCard)
);