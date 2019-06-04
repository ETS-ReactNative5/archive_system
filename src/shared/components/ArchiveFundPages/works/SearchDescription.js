import React from 'react';
import {Button, message, Icon, Modal, Upload, Form} from "antd";
import {dFile, updateCubeData2} from "../../../actions/actions";
import FormItem from "antd/es/form/FormItem";
import DatePicker from "antd/es/date-picker/index";
import Input from "antd/es/input/Input";
import {onSaveCubeData} from '../../../utils/cubeParser';
import {connect} from "react-redux";
import {renderFileUploadBtn, renderInput} from "../../../utils/form_components";
import Field from "redux-form/es/Field";
import reduxForm from "redux-form/es/reduxForm";
import {isEqual, pickBy} from "lodash";

class SearchDescription extends React.Component {
    state = {
        dateAndNumberDeregistration: '',
        dateAndNumberDeregistrationDPV: null,
        dateNumberOrder: '',
        dateNumberOrderDPV: null,
        derigistrationFile: [],
        orderDirectorFile: [],
        fileList: [],
        uploading: false,
        visible: false,
        viewFile: '',
        fileType: '',
        data: {}
    };


    saveSearchDescription = async ({orderDirectorFile,derigistrationFile,...values}) => {


        const {name, accessLevel, ...rest} = pickBy(values, (val, key) => !isEqual(val, this.props.initialValues[key]))
        const objData = {};
        if (name) {
            objData.name = name;
            objData.fullName = name;
        }
        if (accessLevel) objData.accessLevel = accessLevel;




        console.log('save');

        let hideLoading
        try {

            let derigistrationFileNew = [];
            let orderDirectorFileNew = [];
            for (let val of this.state.derigistrationFile) {
                derigistrationFileNew.push({value: val})
            }
            for (let val of this.state.orderDirectorFile) {
                orderDirectorFileNew.push({value: val})
            }

            const c = {
                cube: {
                    cubeSConst: 'cubeForWorks',
                    doConst: 'doForWorks',
                    dpConst: 'dpForWorks',
                    data: this.props.cubeForWorks
                },
                obj: {
                    doItem: this.props.initialValues.key
                }
            };

            const v = {
                values: rest,
                complex: "",

                oFiles: {
                    orderDirectorFile: orderDirectorFile,
                    derigistrationFile: derigistrationFile
            }
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
            return this.props.getCube('cubeForWorks', JSON.stringify(this.filters))
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


    componentDidMount() {


        this.setState({
            data: this.props.initialValues,
        });


    }


    componentDidUpdate(prevProps) {
        if (prevProps.initialValues.key !== this.props.initialValues.key) {
            this.setState({
                data: this.props.initialValues
            })
        }
    }


    
    render() {
        this.lng = localStorage.getItem('i18nextLng');
        const {searchStatus, submitting,error,reset,handleSubmit, dirty, tofiConstants, t} = this.props;
        const {orderDirectorFile, derigistrationFile, dateNumberOrder,casesRecovery, dateAndNumberDeregistration} = this.props.tofiConstants;
        return (
        <div>
            <hr/>
            <h2>Описание результатов работы</h2>
            {  searchStatus.value == tofiConstants.notFound.id &&
            <div>

                <Form className="antForm-spaceBetween"
                      onSubmit={handleSubmit(this.saveSearchDescription)}
                      style={dirty ? {paddingBottom: '43px'} : {}}>


                    {derigistrationFile && <Field
                    name='derigistrationFile'
                    component={renderFileUploadBtn}
                    cubeSConst='cubeForWorks'
                    label={derigistrationFile.name[this.lng]}
                    normalize={this.fileToRedux}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }
                    />}


                    {dateAndNumberDeregistration && <Field
                    name='dateAndNumberDeregistration'
                    normalize={this.strToRedux}
                    component={renderInput}
                           label={dateAndNumberDeregistration.name[this.lng]}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }
                    />}


                    {orderDirectorFile && <Field
                    name='orderDirectorFile'
                    component={renderFileUploadBtn}
                    cubeSConst='cubeForWorks'
                    label={orderDirectorFile.name[this.lng]}
                    normalize={this.fileToRedux}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }
                    />}


                    {dateNumberOrder && <Field
                    name='dateNumberOrder'
                    component={renderInput}
                    normalize={this.strToRedux}
                    label={dateNumberOrder.name[this.lng]}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }

                    />}

                    {casesRecovery && <Field
                    name='casesRecovery'
                    component={renderInput}
                    normalize={this.strToRedux}
                    label={casesRecovery.name[this.lng]}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }


                    />}

                    {dirty && <Form.Item className="ant-form-btns">
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


            </div>
            }
        </div>
        )
    }
}


export default connect(state => {
    return {
        tofiConstants: state.generalData.tofiConstants,
        cubeForWorks: state.cubes.cubeForWorks
    }
}, {})(reduxForm({
    form: 'SearchDescriptionForm',
    enableReinitialize: true
})(SearchDescription));


