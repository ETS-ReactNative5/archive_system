import React from 'react';
import {Button, Form,DatePicker,message,Modal, Input} from "antd";
import {isEmpty, isEqual, pickBy} from "lodash";
import AntTable from "../../AntTable";
import { Field, formValueSelector, reduxForm } from "redux-form";
import {getFile, getFileResolve, getObjVer,getAllObjOfCls, getObjVer_new, getValuesOfObjsWithProps,getPropValWithChilds} from '../../../actions/actions';
import "./css/RenameFormFoundMaker.css";
import {
    LEGAL_STATUS
} from '../../../constants/tofiConstants';
import {
    renderDatePicker,
    renderInput,
    renderFileUploadBtn,
    renderSelect,
    renderTextareaLang,
    renderInputLang
} from "../../../utils/form_components";
import {connect} from "react-redux";
import moment from "moment";
import {requiredDate, requiredArr, requiredLabel} from "../../../utils/form_validations";
import axios from"axios"
import Col from "antd/es/grid/col";
import Row from "antd/es/grid/row";


class ReorganizationFoundMaker extends React.PureComponent {
    constructor(props) {
        super(props);
        const lng = localStorage.getItem('i18nextLng');
        this.state = {
            selectedRowKey: '',
            loading: {
                orgRightReceiverLoading: false,
                loadReceiver: '',
            },
            dataTable: [],
            modalOpen: false,
            lang: {
                orgFunctionFundmaker: localStorage.getItem("i18nextLng"),
                structureFundmaker: localStorage.getItem("i18nextLng"),
                name: localStorage.getItem("i18nextLng"),
                shortNameValue: localStorage.getItem("i18nextLng"),
                departmentalAccessory: lng,
            },
            addForm: false
        }
    }

    changeLang = e => {
        this.setState({
            lang: { ...this.state.lang, [e.target.name]: e.target.value }
        });
    };

    loadOptions = (c, propConsts, dte = moment().format('YYYY-MM-DD')) => {
        return () => {
            if (!this.props[c + 'Options']) {
                this.setState({filterLoading: {...this.state.filterLoading, [c]: true}});
                this.props.getAllObjOfCls(c, dte, propConsts)
                    .then(() => this.setState({
                        filterLoading: {
                            ...this.state.filterLoading,
                            [c]: false
                        }
                    }))
            }
        }
    };

    loadOptionsReceiver = () => {
        this.props.getAllObjOfCls('fundmakerOrg', moment().format('YYYY-MM-DD'), 'nomenList').then(res => {
            this.setState({
                loadReceiver: res.objects
            })
        }).catch(err => console.log(err))
    }

    dateToRedux = (val, prev) => {
        {
            let coppyPrev = { ...prev };

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

    selectToRedux = (val, prevVal, obj, prevObj) => {
        if (val !== undefined) {
            if (val === null) {
                let newValNull = { ...prevVal };
                newValNull.label = null;
                newValNull.labelFull = null;
                newValNull.value = null;
                return newValNull;
            } else {
                let newVal = { ...prevVal };
                newVal.value = val.value;
                newVal.label = val.label;
                newVal.labelFull = val.label;
                return newVal;
            }
        }
    };

    selectMultiToRedux = (val, prevVal, obj, prevObj) => {
        if (val !== undefined) {
            if (val.length > 0){
                let coppyPrevVal = prevVal?[...prevVal]:[]
                let coppyVal = [...val]
                if (coppyPrevVal.length > 0 ) {
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

    adCoum=()=>{
        if(this.state.addForm === false){
            this.setState({
                addForm:true
            })
        }

    }

    changeSelectedRow = rec => {
        if(isEmpty(this.state.selectedRow) || !isEqual(this.state.selectedRow, rec)){
            this.setState({
                selectedRowKey: rec.key,
            })
        } else {
            this.props.history.push(`/sra/createDocument/${this.state.selectedRow.number}/${this.state.selectedRow.key}`);
        }
    };


    departmentalAccessoryValue = {...this.props.initialValues.departmentalAccessory} || {
        kz: '',
        ru: '',
        en: ''
    };
    componentDidUpdate(prevProps) {
        if (prevProps.initialValues !== this.props.initialValues) {
            this.shortNameValue = {...this.props.initialValues.shortName} || {
                kz: '',
                ru: '',
                en: ''
            };
            this.nameValue = {...this.props.initialValues.name} || {
                kz: '',
                ru: '',
                en: ''
            };
            this.departmentalAccessoryValue = {...this.props.initialValues.departmentalAccessory} || {
                kz: '',
                ru: '',
                en: ''
            };

        }
    }

    async  componentDidMount(){
        getObjVer_new(this.props.initialValues.key.split('_')[1])
            .then(async res => {
                if(res.success) {
                    let datas = [{
                        objs: String(this.props.initialValues.key.split('_')[1]),
                        propConsts: 'reasonFundmaker,reasonFundmakerFile,orgIndustry,conditionOfFundmaker,dateReorganization,legalStatus,structureFundmaker,orgRightReceiver,orgFunctionFundmaker,departmentalAccessory'
                    }];
                    const data = new FormData();
                    data.append('datas', JSON.stringify(datas));
                    await getValuesOfObjsWithProps(data).then(ress=>{
                        if (ress.success===false && ress.errors){
                            for(let val of  ress.errors){
                                message.error(val.text)
                            }
                            return false
                        }

                        let newarr = []

                        let  i = 1
                        let dataProp = [...ress.data]
                        for(let val of res.data){
                            val.number=i
                            i++
                            for (let valProp of dataProp){
                                if (val.dend === valProp.reasonFundmaker_dend && val.dbeg === valProp.reasonFundmaker_dbeg ){
                                    val.reasonFundmaker = valProp.reasonFundmaker
                                }
                                if (val.dend === valProp.reasonFundmakerFile_dend && val.dbeg === valProp.reasonFundmakerFile_dbeg ){
                                    val.reasonFundmakerFile = valProp.reasonFundmakerFile
                                }
                                if (val.dend === valProp.dateReorganization_dend && val.dbeg === valProp.dateReorganization_dbeg ){
                                    val.dateReorganizatio = valProp.dateReorganizatio
                                }
                                if (val.dend === valProp.orgIndustry_dend && val.dbeg === valProp.orgIndustry_dbeg ){
                                    val.orgIndustry = valProp.orgIndustry
                                }
                                if (val.dend === valProp.legalStatus_dend && val.dbeg === valProp.legalStatus_dbeg ){
                                    val.legalStatu = valProp.legalStatu
                                }
                                if (val.dend === valProp.structureFundmaker_dend && val.dbeg === valProp.structureFundmaker_dbeg ){
                                    val.structureFundmaker = valProp.structureFundmaker
                                }
                                if (val.dend === valProp.orgRightReceiver_dend && val.dbeg === valProp.orgRightReceiver_dbeg ){
                                    val.orgRightReceiver = valProp.orgRightReceiver
                                }
                                if (val.dend === valProp.orgFunctionFundmaker_dend && val.dbeg === valProp.orgFunctionFundmaker_dbeg ){
                                    val.orgFunctionFundmaker = valProp.orgFunctionFundmaker
                                }
                                if (val.dend === valProp.departmentalAccessory_dend && val.dbeg === valProp.departmentalAccessory_dbeg ){
                                    val.departmentalAccessory = valProp.departmentalAccessory
                                }
                                if (val.dend === valProp.conditionOfFundmaker_dend && val.dbeg === valProp.conditionOfFundmaker_dbeg ){
                                    val.conditionOfFundmaker = valProp.conditionOfFundmaker
                                }
                            }
                            if(val.conditionOfFundmaker.ru ==="Реорганизация"){
                                newarr.push(val)

                            }
                        }
                        this.setState({
                            dataTable:newarr
                        })

                    })
                } else {
                    message.error('Ошибка загрузки версий объекта')
                }
            })

    }

    handleOk = (e) => {
        this.setState({
            modalOpen: false
        })
    };

    handleCancel = (e) => {
        this.setState({
            modalOpen: false
        })
    }

    showFile = (key) => {
        if (!!key) {
            let typeFile = ''//key.name.ru.split(".")[1]
            getFileResolve(key).then(res => {

                getFile(key).then(blob =>{

                    if (res.data.type ==="pdf"){

                        const url = URL.createObjectURL(new Blob([blob.data], {type: 'application/pdf'}));
                        this.setState({
                            modalOpen: true,
                            file:  <iframe src={`${url}#toolbar=0`} frameBorder="0"/>
                        })
                    }
                    else{
                        const url = URL.createObjectURL(new Blob([blob.data]));
                        this.setState({
                            modalOpen: true,
                            file: <img src={`${url}#toolbar=0`}/>
                        })
                    }



                })


            }).catch(e => {
                console.log(e)
                message.error("Файл не найден")
            })
        } else {
            message.error("Файл не найден")
        }

    };

    onSubmit=()=>{
    }

    render() {
        if (!this.props.tofiConstants) return null;
        const { lang,loading } = this.state;
        const lng = localStorage.getItem('i18nextLng');
        const {t,submitting, error, reset, handleSubmit, dirty, fundArchiveOptions, orgDocTypeOption, initialValues,orgIndustryOptions,orgRightReceiverOptions,legalStatusOptions,
            tofiConstants: {reasonFundmaker,orgIndustry,reasonFundmakerFile,legalStatus,dateReorganization,structureFundmaker,orgRightReceiver,orgFunctionFundmaker,departmentalAccessory,}
        } = this.props;
        return (
            <div  className="">
                <div className="table-header-btns"  style={{marginTop: "1vw", marginLeft: '5px', marginRight: '5px'}} >
                    <Button onClick={this.adCoum} >{this.props.t('ADD_REORGANIZATION')}</Button>
                </div>
                <AntTable
                    style={{marginTop: "1vw"}}
                    loading={false}
                    columns={[

                        {
                            key: 'number',
                            title: '№',
                            dataIndex: 'number',
                            width: '4%',
                        },
                        {
                            key: 'dateReorganization',
                            title: t('DATE_REORGANIZATION'),
                            dataIndex: 'dateReorganization',
                            width: '8%',
                            render:(obj, record)=>{

                                return !!obj && obj
                            }
                        },
                        {
                            key: 'orgRightReceiver',
                            title: t('ORG_RIGHT_RECEIVER'),
                            dataIndex: 'orgRightReceiver',
                            width: '14%',
                            render: (obj, record) => { return !!obj && obj}
                        },
                        {
                            key: 'reasonFundmaker',
                            title: reasonFundmaker.name[lng],
                            dataIndex: 'reasonFundmaker',
                            width: '14%',
                            render:(obj, record)=>{
                                return !!obj && obj[lng]

                            }
                        },
                        {
                            key: 'reasonFundmakerFile',
                            title: reasonFundmakerFile.name[lng],
                            dataIndex: 'reasonFundmakerFile',
                            width: '8%',
                            render:(obj, record)=>{
                                if (!!obj) {
                                    return (
                                        <Button type="primary"
                                                className="centerIcon"
                                                icon="eye"
                                                shape='circle'
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    margin: '0 auto'
                                                }}
                                                onClick={() => this.showFile(obj.ru)}> </Button>)
                                }
                            }
                        },
                        {
                            key: 'orgIndustry',
                            title: orgIndustry.name[lng],
                            dataIndex: 'orgIndustry',
                            width: '6%',
                            render: (obj, record) => {return !!obj && obj}
                        },
                        {
                            key: 'legalStatus',
                            title: legalStatus.name[lng],
                            dataIndex: 'legalStatus',
                            width: '8%',
                            render: (obj, record) => {return !!obj && obj}
                        },
                        {
                            key: 'structureFundmaker',
                            title: structureFundmaker.name[lng],
                            dataIndex: 'structureFundmaker',
                            width: '6%',
                            render: (obj, record) => {return !!obj && obj}
                        },{
                            key: 'structure',
                            title: structureFundmaker.name[lng],
                            dataIndex: 'structureFundmaker',
                            width: '6%',
                            render: (obj, record) => {return !!obj && obj}
                        },
                        {
                            key: 'orgFunctionFundmaker',
                            title: orgFunctionFundmaker.name[lng],
                            dataIndex: 'orgFunctionFundmaker',
                            width: '6%',
                            render: (obj, record) => {return !!obj && obj}
                        },
                        {
                            key: 'departmentalAccessory',
                            title: departmentalAccessory.name[lng],
                            dataIndex: 'departmentalAccessory',
                            width: '8%',
                            render: (obj, record) => {return !!obj && obj}
                        },
                    ]}
                    hidePagination
                    dataSource={this.state.dataTable}
                    changeSelectedRow={this.changeSelectedRow}
                    rowClassName={record => this.state.selectedRowKey === record.key ? 'row-selected' : ''}
                    bordered
                />
                {this.state.addForm === true ?
                    <Form className="antForm-spaceBetween" onSubmit={handleSubmit(this.onSubmit)}
                          style={dirty ? {paddingBottom: '43px'} : {}}>
                        <Field
                            name="dateReorganization"
                            component={renderDatePicker}
                            disabledDate={this.disabledStartDate}
                            format={null}
                            label={t('DATE_REORGANIZATION')}
                            validate={requiredDate}
                            colon={true}
                            formItemLayout={
                                {
                                    labelCol: {span: 10},
                                    wrapperCol: {span: 14}
                                }
                            }
                        />
                        <Field
                            name="orgRightReceiver"
                            component={renderSelect}
                            normalize={this.selectToRedux}
                            label={t('ORG_RIGHT_RECEIVER')}
                            formItemLayout={
                                {
                                    labelCol: {span: 10},
                                    wrapperCol: {span: 14}
                                }
                            }
                            isSearchable={false}
                            data={this.state.loadReceiver ? this.state.loadReceiver.map(option => ({
                                value: option.id,
                                label: option.name[lng]
                            })) : []}
                            onMenuOpen={()=>this.loadOptionsReceiver()}
                            isLoading={loading.orgRightReceiverLoading}
                            validate={requiredLabel}
                        />
                        <Row>
                            <Col span={24}>
                                {reasonFundmaker && <Field
                                    name="reasonFundmaker"
                                    component={renderInput}
                                    placeholder={reasonFundmaker.name[lng]}
                                    normalize={(val, prevVal, obj, prevObj)=>this.strToRedux(val, prevVal, obj, prevObj)}
                                    label={reasonFundmaker.name[lng]}
                                    formItemLayout={
                                        {
                                            labelCol: {span: 10},
                                            wrapperCol: {span: 14}
                                        }
                                    }
                                />}
                            </Col>
                            <Col span={24}>
                                <Row>
                                    <Col span={10}></Col>
                                    <Col span={14}>
                                        {<Field
                                            name="reasonFundmakerFile"
                                            component={renderFileUploadBtn}
                                            cubeSConst='cubeForOrgFundmaker'
                                            normalize={this.fileToRedux}
                                            style={{height: '70px !important', minHeight: '70px !important'}}
                                            formItemLayout={
                                                {
                                                    labelCol: {span: 10},
                                                    wrapperCol: {span: 14}
                                                }
                                            }
                                        />
                                        }
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Field
                            name="orgIndustry"
                            component={renderSelect}
                            normalize={this.selectToRedux}
                            label={orgIndustry.name[lng]}
                            formItemLayout={
                                {
                                    labelCol: {span: 10},
                                    wrapperCol: {span: 14}
                                }
                            }
                            isSearchable={false}
                            data={orgIndustryOptions ? orgIndustryOptions.map(option => ({
                                value: option.id,
                                label: option.name[lng]
                            })) : []}
                            onMenuOpen={this.loadOptions("orgIndustry")}
                            validate={requiredLabel}
                            colon={true}
                        />
                        <Field
                        name="legalStatus"
                        component={renderSelect}
                        normalize={this.selectToRedux}
                        label={legalStatus.name[lng]}
                        formItemLayout={
                        {
                        labelCol: {span: 10},
                        wrapperCol: {span: 14}
                        }
                        }
                        isSearchable={false}
                        data={legalStatusOptions ? legalStatusOptions.map(option => ({
                        value: option.id,
                        label: option.name[lng]
                        })) : []}
                        onMenuOpen={this.loadOptions(LEGAL_STATUS)}
                        validate={requiredLabel}
                        colon={true}
                        />
                        <Row>
                            <Col span={24}>
                                {structureFundmaker && <Field
                                    name="structureFundmaker"
                                    label={structureFundmaker.name[lng]}
                                    style={{height: '70px !important', minHeight: '70px !important'}}
                                    component={renderTextareaLang}
                                    format={value => (!!value ? value.valueLng[lang.structureFundmaker] : "")}
                                    normalize={(val, prevVal, obj, prevObj) => {
                                        let newVal = {...prevVal};
                                        newVal.value = val;
                                        if (!!newVal.valueLng) {
                                            newVal.valueLng[lang.structureFundmaker] = val;
                                        } else {
                                            newVal["valueLng"] = {kz: "", en: "", ru: ""};
                                            newVal.valueLng[lang.structureFundmaker] = val;
                                        }
                                        return newVal;
                                    }}
                                    formItemClass="with-lang"
                                    changeLang={this.changeLang}
                                    formItemLayout={{
                                        labelCol: {span: 10},
                                        wrapperCol: {span: 14}
                                    }}
                                />}

                            </Col>
                            <Col span={24}>
                                <Row>
                                    <Col span={10}></Col>
                                    <Col span={14}>
                                        <Field
                                            name="structure"
                                            label=''
                                            component={renderFileUploadBtn}
                                            cubeSConst='cubeForOrgFundmaker'
                                            normalize={this.fileToRedux}
                                            formItemLayout={
                                                {
                                                    labelCol: {span: 0},
                                                    wrapperCol: {span: 24}
                                                }
                                            }
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                {orgFunctionFundmaker && <Field
                                    name="orgFunctionFundmaker"
                                    label={orgFunctionFundmaker.name[lng]}
                                    component={renderTextareaLang}
                                    format={value => (!!value ? value.valueLng[lang.orgFunctionFundmaker] : '')}
                                    normalize={(val, prevVal, obj, prevObj) => {
                                        let newVal = {...prevVal};
                                        newVal.value = val;
                                        if (!!newVal.valueLng) {
                                            newVal.valueLng[lang.orgFunctionFundmaker] = val;
                                        } else {
                                            newVal["valueLng"] = {kz: "", en: "", ru: ""};
                                            newVal.valueLng[lang.orgFunctionFundmaker] = val;
                                        }
                                        return newVal;
                                    }}
                                    formItemClass="with-lang"
                                    changeLang={this.changeLang}
                                    formItemLayout={{
                                        labelCol: {span: 10},
                                        wrapperCol: {span: 14}
                                    }}
                                />}

                            </Col>
                            <Col span={24}>
                                <Row>
                                    <Col span={10}></Col>
                                    <Col span={14}>
                                        <Field
                                            name="orgFunction"
                                            label=''
                                            component={renderFileUploadBtn}
                                            cubeSConst='cubeForOrgFundmaker'
                                            normalize={this.fileToRedux}
                                            formItemLayout={
                                                {
                                                    labelCol: {span: 0},
                                                    wrapperCol: {span: 24}
                                                }
                                            }
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        {departmentalAccessory && <Field
                            name="departmentalAccessory"
                            component={renderInputLang}
                            format={value => (!!value ? value.valueLng[lang.departmentalAccessory] : '')}
                            normalize={(val, prevVal, obj, prevObj) => {
                                let newVal = {...prevVal};
                                newVal.value = val;
                                if (!!newVal.valueLng) {
                                    newVal.valueLng[lang.departmentalAccessory] = val;
                                } else {
                                    newVal['valueLng'] = {kz: '', en: '', ru: ''};
                                    newVal.valueLng[lang.departmentalAccessory] = val;
                                }
                                return newVal;
                            }}
                            label={departmentalAccessory.name[lng]}
                            formItemClass="with-lang"
                            changeLang={this.changeLang}
                            formItemLayout={
                                {
                                    labelCol: {span: 10},
                                    wrapperCol: {span: 14}
                                }
                            }
                        />}
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
                    </Form> : ""
                }
                <Modal visible={this.state.modalOpen}
                       onOk={this.handleOk}
                       onCancel={this.handleCancel}
                       cancelText="Закрыть"
                       className="w80">
                    <div className="Viewer-window h70vh">
                        {this.state.file}
                    </div>
                </Modal>
            </div>
        )
    }
}
export default connect(state => {
    return {
        tofiConstants: state.generalData.tofiConstants,
        fundArchiveOptions: state.generalData.fundArchive,
        orgDocTypeOption: state.generalData.orgDocType,
        orgRightReceiverOptions: state.generalData["orgRightReceiver"],
        orgIndustryOptions: state.generalData["orgIndustry"],
        legalStatusOptions: state.generalData["legalStatus"],
    }
}, {getObjVer,getPropValWithChilds,getAllObjOfCls})(reduxForm({
    form: 'ReorganizationFoundMaker',
    enableReinitialize: true,
})(ReorganizationFoundMaker));