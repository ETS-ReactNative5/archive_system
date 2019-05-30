import React from 'react';
import {Button, message, Icon, Modal, Upload, Form} from "antd";
import {dFile, updateCubeData2} from "../../../actions/actions";
import FormItem from "antd/es/form/FormItem";
import DatePicker from "antd/es/date-picker/index";
import Input from "antd/es/input/Input";
import {onSaveCubeData} from '../../../utils/cubeParser';
import {connect} from "react-redux";

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

    dateAndNumberDeregistrationValue = (e) => {
        console.log(e.target.value);
        this.setState({
            dateAndNumberDeregistration: e.target.value,

        });
        let data = {...this.state.data};
        if (!!data.dateAndNumberDeregistration.values) {
            data.dateAndNumberDeregistration.values.value = e.target.value;
            data.dateAndNumberDeregistration.values.valueLng = {
                en: e.target.value,
                kz: e.target.value,
                ru: e.target.value
            }

        } else {
            data.dateAndNumberDeregistration.values = {};
            data.dateAndNumberDeregistration.values.value = e.target.value;
            data.dateAndNumberDeregistration.values.valueLng = {
                en: e.target.value,
                kz: e.target.value,
                ru: e.target.value
            }
        }
        this.setState({
            data: data
        })
    };
    dateNumberOrderValue = (e) => {
        let data = {...this.state.data};
        if (!!data.dateNumberOrder.values) {
            data.dateNumberOrder.values.value = e.target.value;
            data.dateNumberOrder.values.valueLng = {
                en: e.target.value,
                kz: e.target.value,
                ru: e.target.value
            }
        } else {
            data.dateNumberOrder.values = {};
            data.dateNumberOrder.values.value = e.target.value;
            data.dateNumberOrder.values.valueLng = {
                en: e.target.value,
                kz: e.target.value,
                ru: e.target.value
            }
        }
        this.setState({
            data: data
        })
    };
    saveSearchDescription = async () => {
        let values = {
            dateAndNumberDeregistration: this.state.data.dateAndNumberDeregistration.values,
            dateNumberOrder: this.state.data.dateNumberOrder.values
        };


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
                values: values,
                complex: "",
                oFiles: {
                    derigistrationFile: derigistrationFileNew,
                    orderDirectorFile: orderDirectorFileNew
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

    componentDidMount() {

        var derigistrationFile=[];
        derigistrationFile = this.props.initialValues.derigistrationFile && this.props.initialValues.derigistrationFile.values && this.props.initialValues.derigistrationFile.values.map(el=>{
            return el.value;
        });

        this.setState({
            data: this.props.initialValues,
            derigistrationFile:derigistrationFile
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

        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        };
        const orderDirectorFileProps = {
            action: '//file/set',
            accept: 'image/*, application/pdf',
            onRemove: (file) => {
                this.setState(({orderDirectorFile}) => {
                    const index = orderDirectorFile.indexOf(file);
                    const newOrderDirectorFile = orderDirectorFile.slice();
                    newOrderDirectorFile.splice(index, 1);
                    return {
                        orderDirectorFile: newOrderDirectorFile,
                    };
                });
            },
            beforeUpload: (file) => {
                this.setState(({orderDirectorFile}) => ({
                    orderDirectorFile: [...orderDirectorFile, file],
                }));
                return false;
            },
            orderDirectorFile: this.state.orderDirectorFile,
        };

        console.log(this.state.derigistrationFile);
        const derigistrationFileProps = {

            action: '//file/set',
            accept: 'image/*, application/pdf',
            onRemove: (file) => {
                this.setState(({derigistrationFile}) => {
                    const index = derigistrationFile.indexOf(file);
                    const newDerigistrationFile = derigistrationFile.slice();
                    newDerigistrationFile.splice(index, 1);
                    return {
                        derigistrationFile: newDerigistrationFile,
                    };
                });
            },
            beforeUpload: (file) => {
                this.setState(({derigistrationFile}) => ({
                    derigistrationFile: [...derigistrationFile, file],
                }));
                return false;
            },
            derigistrationFile: this.state.derigistrationFile,
        };
        console.log(derigistrationFileProps);

        const {searchStatus, tofiConstants, t} = this.props;
        return (
        <div>
            <hr/>
            <h2>Описание результатов работы</h2>
            {  searchStatus.value == tofiConstants.notFound.id &&
            <div>
                <Form>
                    { /*Разрешение  уполномоченного  органа на снятие с учета*/}
                    <FormItem
                    label={tofiConstants.derigistrationFile.name[this.lng]}
                    {...formItemLayout}>
                        <Upload
                        onPreview={this.handlePreview}  {...derigistrationFileProps}>
                            <Button>
                                <Icon type="upload"/> Выберите файл
                            </Button>
                        </Upload>
                    </FormItem>

                    Дата и номер разрешения
                    <FormItem
                    label={tofiConstants.dateAndNumberDeregistration.name[this.lng]}
                    {...formItemLayout}>
                        <Input
                        value={this.state.data.dateAndNumberDeregistration && this.state.data.dateAndNumberDeregistration.values ? this.state.data.dateAndNumberDeregistration.values.value : ''}
                        onChange={this.dateAndNumberDeregistrationValue}/>
                    </FormItem>

                         приказ директора
                    <FormItem
                    label={tofiConstants.orderDirectorFile.name[this.lng]}
                    {...formItemLayout}>
                        <Upload
                        onPreview={this.handlePreview}  {...orderDirectorFileProps}>
                            <Button>
                                <Icon type="upload"/> Выберите файл
                            </Button>
                        </Upload>
                    </FormItem>

                    Дата и Номер приказа
                    <FormItem
                    label={tofiConstants.dateNumberOrder.name[this.lng]}
                    {...formItemLayout}>
                        <Input
                        value={this.state.data.dateNumberOrder && this.state.data.dateNumberOrder.values ? this.state.data.dateNumberOrder.values.value : ''}
                        onChange={this.dateNumberOrderValue}/>
                    </FormItem>
                    <FormItem>
                        <Button style={{
                            marginRight: 'auto',
                            marginBottom: '15px',
                            marginTop: '5px'
                        }} onClick={this.saveSearchDescription}
                                className="signup-form__btn" type="primary">
                            {t('SAVE')}
                        </Button>
                    </FormItem>
                </Form>
            </div>
            }
        </div>
        )
    }
}


function mapStateToProps(state) {
    return {
        tofiConstants: state.generalData.tofiConstants,
        cubeForWorks: state.cubes.cubeForWorks
    }
}

export default connect(mapStateToProps, {})(SearchDescription);
