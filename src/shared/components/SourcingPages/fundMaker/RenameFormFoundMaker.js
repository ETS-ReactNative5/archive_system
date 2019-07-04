import React from 'react';
import {Button, Form,DatePicker,message,Modal, Input} from "antd";
import {isEmpty, isEqual, pickBy} from "lodash";
import AntTable from "../../AntTable";
import { Field, formValueSelector, reduxForm } from "redux-form";
import {
    addObjVer, getFile, getFileResolve, getObjVer, getObjVer_new,
    getValuesOfObjsWithProps2
} from '../../../actions/actions';

import "./css/RenameFormFoundMaker.css"
import {
    renderCheckbox,
    renderDatePicker,
    renderInput,
    renderFileUploadBtn,
    renderSelect,
    renderTextareaLang,
    renderSelectVirt,
    renderInputLang
} from "../../../utils/form_components";
import {connect} from "react-redux";
import moment from "moment";
import {requiredDate, requiredLng} from "../../../utils/form_validations";
import axios from"axios"
import Col from "antd/es/grid/col";
import Row from "antd/es/grid/row";


class RenameFormFoundMaker extends React.PureComponent {

    state = {
        selectedRowKey: '',
        dataTable:[],
        modalOpen: false,
        lang: {
            name: localStorage.getItem("i18nextLng"),
            shortNameValue: localStorage.getItem("i18nextLng"),
            shortName:localStorage.getItem("i18nextLng"),

        },
        addForm:false
    }

    changeLang = e => {
        this.setState({
            lang: { ...this.state.lang, [e.target.name]: e.target.value }
        });
    };

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

    checkboxToRedux=(val, prevVal)=>{
        let newVal = {...prevVal};
        const {yes,irreparablyDamagedTrue,irreparablyDamagedFalse, no} = this.props.tofiConstants
        if (prevVal === null) {
            let objVal ={}
            if (val=== true ){
                objVal = {
                    value: Number(irreparablyDamagedTrue.id),
                    kFromBase: val

                }
            }else {
                objVal = {
                    value: Number(irreparablyDamagedFalse.id),
                    kFromBase: val
                }
            }

            return (objVal)
        } else {
            if (val=== true ){
                newVal.value = Number(irreparablyDamagedTrue.id)
                newVal.kFromBase= val
            }else {
                newVal.value = Number(irreparablyDamagedFalse.id)
                newVal.kFromBase= val
            }


            return (newVal)

        }
    }

    checkboxToRedux2=(val, prevVal)=>{
        let newVal = {...prevVal};
        const {caseInsuranceTrue, caseInsuranceFalce} = this.props.tofiConstants
        if (prevVal === null) {
            let objVal ={}
            if (val=== true ){
                objVal = {
                    value: Number(caseInsuranceTrue.id),
                    kFromBase: val

                }
            }else {
                objVal = {
                    value: Number(caseInsuranceFalce.id),
                    kFromBase: val
                }
            }

            return (objVal)
        } else {
            if (val=== true ){
                newVal.value = Number(caseInsuranceTrue.id)
                newVal.kFromBase= val
            }else {
                newVal.value = Number(caseInsuranceFalce.id)
                newVal.kFromBase= val
            }


            return (newVal)

        }
    }

    checkboxToRedux3=(val, prevVal)=>{
        let newVal = {...prevVal};
        const {caseFundOfUseTrue, caseFundOfUseFalce} = this.props.tofiConstants
        if (prevVal === null) {
            let objVal ={}
            if (val=== true ){
                objVal = {
                    value: Number(caseFundOfUseTrue.id),
                    kFromBase: val

                }
            }else {
                objVal = {
                    value: Number(caseFundOfUseFalce.id),
                    kFromBase: val
                }
            }

            return (objVal)
        } else {
            if (val=== true ){
                newVal.value = Number(caseFundOfUseTrue.id)
                newVal.kFromBase= val
            }else {
                newVal.value = Number(caseFundOfUseFalce.id)
                newVal.kFromBase= val
            }


            return (newVal)

        }
    }

    showInput = arr => {
        return arr.some(
            el =>
                el.invType.id === this.props.invType &&
                el.docType.id === this.props.docType
        );
    };

    adCoum=()=>{
        if(this.state.addForm === false){
            this.setState({
                addForm:true
            })
        }

    }
    editCoum=()=>{
        console.log(this.state.selectedRowKey)
        console.log(this.props.initialValues)
        let obj = {...this.state.selectedRowKey}
        let editObj ={...this.props.initialValues}
        editObj.dateRename.value= moment(obj.dateRename,"YYYY-MM-DD").format("DD-MM-YYYY")
        editObj.name = obj.fullName
        editObj.shortName =obj.name


    }
    changeSelectedRow = rec => {
            this.setState({
                selectedRowKey: rec,
            })
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
        }
    }

    async  componentDidMount(){
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

        const data = new FormData();
        data.append('objId', String(this.props.initialValues.key.split('_')[1]));
        data.append('propConsts', 'reasonFundmaker,reasonFundmakerFile,dateRename,conditionOfFundmaker');
        data.append('allValues', String(1));

        await getValuesOfObjsWithProps2(data).then(res=>{
              if (res.success===false && res.errors){
                for(let val of  res.errors){
                    message.error(val.text)
                }
                return false
            }
            if( !!res.data && !!res.data.owner){
                let newarr = [...res.data.owner]
                for (let val of newarr){
                    let dateRename = !!res.data.dateRename && res.data.dateRename.find(el => val.verOwn === el.verOwn)
                    if(!!dateRename){
                        val.dateRename = dateRename
                    }
                    let reasonFundmaker = !!res.data.reasonFundmaker && res.data.reasonFundmaker.find(el => val.verOwn === el.verOwn)
                    if(!!reasonFundmaker){
                        val.reasonFundmaker = reasonFundmaker
                    }
                    let reasonFundmakerFile = !!res.data.reasonFundmakerFile && res.data.reasonFundmakerFile.find(el => val.verOwn === el.verOwn)
                    if(!!reasonFundmakerFile){
                        val.reasonFundmakerFile = reasonFundmakerFile
                    }
                    let conditionOfFundmaker = !!res.data.conditionOfFundmaker && res.data.conditionOfFundmaker.filter(el => val.verOwn === el.verOwn)
                    if(!!conditionOfFundmaker){
                        val.conditionOfFundmaker = conditionOfFundmaker
                    }
                }
                let rezulArr = []
                let  i = 1
                for (let val of newarr){
                    if (!!val.conditionOfFundmaker){
                        for (let item of val.conditionOfFundmaker){
                            if (!!item.name && item.name.ru === "Переименование"){
                                val.number= i
                                i++
                                rezulArr.push(val)
                            }
                        }
                    }
                }
                this.setState({
                    dataTable:rezulArr
                })
            }else {
                message.info("Нет данных")
            }

        }).catch (e=>{
            console.log(e)
        })

    }
    updateTable = async ()=>{
        const data = new FormData();
        data.append('objId', String(this.props.initialValues.key.split('_')[1]));
        data.append('propConsts', 'reasonFundmaker,reasonFundmakerFile,dateRename,conditionOfFundmaker');
        data.append('allValues', String(1));

        await getValuesOfObjsWithProps2(data).then(res=>{
            if (res.success===false && res.errors){
                for(let val of  res.errors){
                    message.error(val.text)
                }
                return false
            }
            if( !!res.data && !!res.data.owner){
                let newarr = [...res.data.owner]
                for (let val of newarr){
                    let dateRename = !!res.data.dateRename && res.data.dateRename.find(el => val.verOwn === el.verOwn)
                    if(!!dateRename){
                        val.dateRename = dateRename
                    }
                    let reasonFundmaker = !!res.data.reasonFundmaker && res.data.reasonFundmaker.find(el => val.verOwn === el.verOwn)
                    if(!!reasonFundmaker){
                        val.reasonFundmaker = reasonFundmaker
                    }
                    let reasonFundmakerFile = !!res.data.reasonFundmakerFile && res.data.reasonFundmakerFile.find(el => val.verOwn === el.verOwn)
                    if(!!reasonFundmakerFile){
                        val.reasonFundmakerFile = reasonFundmakerFile
                    }
                    let conditionOfFundmaker = !!res.data.conditionOfFundmaker && res.data.conditionOfFundmaker.filter(el => val.verOwn === el.verOwn)
                    if(!!conditionOfFundmaker){
                        val.conditionOfFundmaker = conditionOfFundmaker
                    }
                }
                let rezulArr = []
                let  i = 1
                for (let val of newarr){
                    if (!!val.conditionOfFundmaker){
                        for (let item of val.conditionOfFundmaker){
                            if (!!item.name && item.name.ru === "Переименование"){
                                val.number= i
                                i++
                                rezulArr.push(val)
                            }
                        }
                    }
                }
                this.setState({
                    dataTable:rezulArr
                })
            }else {
                message.info("Нет данных")
            }

        }).catch (e=>{
            console.log(e)
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
    onSubmit= async (values)=>{
        const {reasonFundmakerFile, name,shortName, ...rest} = pickBy(values, (val, key) => !isEqual(val, this.props.initialValues[key]));
        let prevProps = {...this.props.dataPrev}
        console.log(this.props.dataPrev)
        let closeProp = {}
        if (!!prevProps.reasonFundmaker && prevProps.reasonFundmaker.dend == "3333-12-31"){
            closeProp.reasonFundmaker=prevProps.reasonFundmaker
            closeProp.reasonFundmaker.dend=moment().add(-1, 'days').format("YYYY-MM-DD");
        }
        if (!!prevProps.dateRename && prevProps.dateRename.dend == "3333-12-31"){
            closeProp.dateRename=prevProps.dateRename
            closeProp.dateRename.dend=moment().add(-1, 'days').format("YYYY-MM-DD");
        }

        const cube = {
            cubeSConst: 'cubeForOrgFundmaker',
            doConst: 'doForOrgFundmakers',
            dpConst: 'dpForOrgFundmakers',
        };
        const obj = {
            clsConst: 'fundmakerOrg',
        };

        obj.doItem = this.props.initialValues.key;
        const objData = {};
        if (!!rest.reasonFundmaker){
            rest.reasonFundmaker.dbeg=moment(rest.dateRename.value ,"DD-MM-YYYY").format("YYYY-MM-DD")
        }
        if (!!rest.dateRename){
            rest.dateRename.dbeg=moment(rest.dateRename.value ,"DD-MM-YYYY").format("YYYY-MM-DD");
        }
        if (Object.keys(closeProp).length != 0){
             await this.props.saveProps3(
                {cube, obj},
                {values: closeProp, idDPV: this.props.withIdDPV,},
                this.props.tofiConstants,
                objData
            );
            rest.conditionOfFundmaker=[{
                value:this.props.tofiConstants["renaming"].id
            }]
            const fd = new FormData();
            fd.append('obj', this.props.initialValues.key.split('_')[1]);
            fd.append('dimObjsConst', "doForOrgFundmakers");
            fd.append('dbeg', rest.dateRename.value.format('YYYY-MM-DD'));
            fd.append('dend', "3333-12-31");
            fd.append('name',JSON.stringify(shortName));
            fd.append('fullName', JSON.stringify(name));
            fd.append('cmtVer', JSON.stringify({}));
            fd.append('parent', null)

            addObjVer(fd)
                .then( async (res)=>{
                    if (res.success===false && res.errors){
                        for(let val of  res.errors){
                            message.error(val.text)
                        }
                        return false
                    }
                     await this.props.saveProps3(
                         {cube, obj},
                         {values: rest, idDPV: this.props.withIdDPV, oFiles: {reasonFundmakerFile}},
                         this.props.tofiConstants,
                         objData
                     );

                }).catch(e=>{
                console.log(e)
            })
        }else {
            rest.conditionOfFundmaker=[{
                value:this.props.tofiConstants["renaming"].id
            }]
            const fd = new FormData();
            fd.append('obj', this.props.initialValues.key.split('_')[1]);
            fd.append('dimObjsConst', "doForOrgFundmakers");
            fd.append('dbeg', rest.dateRename.value.format('YYYY-MM-DD'));
            fd.append('dend', "3333-12-31");
            fd.append('name',JSON.stringify(shortName));
            fd.append('fullName', JSON.stringify(name));
            fd.append('cmtVer', JSON.stringify({}));
            fd.append('parent', null)

            addObjVer(fd)
                .then( async (res)=>{
                    if (res.success===false && res.errors){
                        for(let val of  res.errors){
                            message.error(val.text)
                        }
                        return false
                    }
                     this.props.saveProps3(
                         {cube, obj},
                         {values: rest, idDPV: this.props.withIdDPV, oFiles: {reasonFundmakerFile}},
                         this.props.tofiConstants,
                         objData
                     );

                }).catch(e=>{
                console.log(e)
            })
        }

    }
    shortNameValue = {...this.props.initialValues.shortName} || {kz: '', ru: '', en: ''};
    nameValue = {...this.props.initialValues.name} || {kz: '', ru: '', en: ''};
    render() {
        if (!this.props.tofiConstants) return null;
        const { lang, } = this.state;
        const lng = localStorage.getItem('i18nextLng');
        const {
            t, tofiConstants: {dateRename, reasonFundmaker, reasonFundmakerFile}
        } = this.props;
        const {submitting, error, reset, handleSubmit, dirty, tofiConstants, fundArchiveOptions, orgDocTypeOption, initialValues} = this.props;
        return (
            <div  className="">
                <div className="table-header-btns"  style={{marginTop: "1vw", marginLeft: '5px', marginRight: '5px'}} >
                    <Button onClick={this.adCoum} >{this.props.t('ADD')}</Button>
                    <Button onClick={this.editCoum} disabled={this.state.selectedRowKey ===""} >{this.props.t('RENAME')}</Button>

                </div>
                <AntTable
                    style={{marginTop: "1vw"}}
                    loading={false}
                    columns={[
                        {
                            key: 'number',
                            title: '№',
                            dataIndex: 'number',
                            width: '5%'
                        },
                        {
                            key: 'dateRename',
                            title: dateRename.name[lng],
                            dataIndex: 'dateRename',
                            width: '15%',
                            render:(obj, record)=>{
                                return !!obj && !!obj.val && obj.val
                            }
                        }, {
                            key: 'fullName',
                            title: t('NAME'),
                            dataIndex: 'fullName',
                            width: '15%',
                            render:(obj, record)=>{
                                return !!obj && obj[lng]
                            }
                        },
                        {
                            key: 'name',
                            title: t('SHORT_NAME'),
                            dataIndex: 'name',
                            width: '15%',
                            render:(obj, record)=>{
                                return !!obj && obj[lng]
                            }
                        },
                        {
                            key: 'reasonFundmaker',
                            title: reasonFundmaker.name[lng],
                            dataIndex: 'reasonFundmaker',
                            width: '15%',
                            render:(obj, record)=>{
                                return !!obj && !!obj.val && obj.val[lng]

                            }
                        },
                        {
                            key: 'reasonFundmakerFile',
                            title: reasonFundmakerFile.name[lng],
                            dataIndex: 'reasonFundmakerFile',
                            width: '15%',
                            render:(obj, record)=>{
                                if (!!obj && !!obj.val) {
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
                                                onClick={() => this.showFile(obj.val.ru)}> </Button>)
                                }
                            }
                        }
                    ]}
                    hidePagination
                    dataSource={this.state.dataTable}
                    onRowClick={this.changeSelectedRow}
                    rowClassName={record => this.state.selectedRowKey.verOwn === record.verOwn ? 'row-selected' : ''}
                    bordered
                    pagination={{
                        pageSize: 20,
                        showQuickJumper: true,
                        showSizeChanger: true,
                    }}
                />
                {this.state.addForm === true ?
                    <Form className="antForm-spaceBetween" onSubmit={handleSubmit(this.onSubmit)}
                          style={dirty ? {paddingBottom: '43px'} : {}}>
                        <Field
                            name="dateRename"
                            component={renderDatePicker}
                            format={null}
                            label={t('DATE_RENAME')}
                            validate={requiredDate}
                            normalize={this.dateToRedux}
                            colon={true}
                            formItemLayout={
                                {
                                    labelCol: {span: 10},
                                    wrapperCol: {span: 14}
                                }
                            }
                        />
                        <Field
                            name="name"
                            component={renderInputLang}
                            format={value => (!!value ? value[lang.name] : '')}
                            parse={value => {
                                this.nameValue[lang.name] = value;
                                return {...this.nameValue}
                            }}
                            label={t('NAME')}
                            formItemClass="with-lang"
                            changeLang={this.changeLang}
                            formItemLayout={
                                {
                                    labelCol: {span: 10},
                                    wrapperCol: {span: 14}
                                }
                            }
                            validate={requiredLng}
                            colon={true}
                        />
                        <Field
                            name="shortName"
                            component={renderInputLang}
                            format={value => (!!value ? value[lang.shortName] : '')}
                            parse={value => {
                                this.shortNameValue[lang.shortName] = value;
                                return {...this.shortNameValue}
                            }}
                            label={t('SHORT_NAME')}
                            formItemClass="with-lang"
                            changeLang={this.changeLang}
                            formItemLayout={
                                {
                                    labelCol: {span: 10},
                                    wrapperCol: {span: 14}
                                }
                            }
                            validate={requiredLng}
                            colon={true}
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
        orgDocTypeOption: state.generalData.orgDocType
    }
}, {getObjVer})(reduxForm({
    form: 'RenameFormFoundMaker',
    enableReinitialize: true,
})(RenameFormFoundMaker));