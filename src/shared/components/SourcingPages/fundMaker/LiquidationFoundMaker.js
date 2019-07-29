import React from 'react';
import {Button, Form, message} from "antd";
import {Field, formValueSelector, reduxForm} from "redux-form";
import {
    renderDatePicker,
    renderFileUploadBtn,
    renderInput,
    renderInputLang,
    renderSelect
} from "../../../utils/form_components";
import {requiredDate, requiredLabel, requiredLng} from "../../../utils/form_validations";
import Row from "antd/es/grid/row";
import Col from "antd/es/grid/col";
import {isEqual, pickBy} from "lodash";
import moment from 'moment/moment';
import "./css/RenameFormFoundMaker.css"
import {parseCube_new} from "../../../utils/cubeParser";
import {
    CUBE_FOR_ORG_FUNDMAKER,
    DO_FOR_ORG_FUNDMAKER,
    DP_FOR_ORG_FUNDMAKER,
    FORM_OF_ADMISSION,
    FUND_MAKER_ARCHIVE,
    ORG_RIGHT_RECEIVER,
    IS_ACTIVE,
    LEGAL_STATUS,
    ORG_DOC_TYPE,
    ORG_INDUSTRY
} from "../../../constants/tofiConstants";
import {connect} from "react-redux";
import {
    getAccessLevels,
    getCube,
    getObjChildsByConst,
    getPropVal,
    getPropValWithChilds,
    getAllObjOfCls, getValuesOfObjsWithProps2
} from "../../../actions/actions";
import axios from "axios"

class LiquidationFoundMaker extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            dataTable2:[],
            dataTable:[],
            loading: {
                orgRightReceiverLoading: false,
                loadReceiver: '',
            },
        };
    }

    onSubmit = async(values) => {
        const {doForFundAndIK, dpForFundAndIK} = this.props.tofiConstants;
        const {reasonFundmakerFile, ...rest} = pickBy(values, (val, key) => !isEqual(val, this.props.initialValues[key]));
        const cube = {
            cubeSConst: 'cubeForOrgFundmaker',
            doConst: 'doForOrgFundmakers',
            dpConst: 'dpForOrgFundmakers',
        };
        const obj = {
            clsConst: 'fundmakerOrg',
        };
        await this.closeProps(rest)
        if (rest.dateElimination){
            rest.dateElimination.dend= moment(values.dateElimination.value, "DD-MM-YYYY").format("YYYY-MM-DD")
        }
        if (rest.orgRightReceiver){
            rest.orgRightReceiver.dend= moment(values.dateElimination.value, "DD-MM-YYYY").format("YYYY-MM-DD")
        }
        if (rest.reasonFundmaker){
            rest.reasonFundmaker.dend= moment(values.dateElimination.value, "DD-MM-YYYY").format("YYYY-MM-DD")
        }
        if (!!reasonFundmakerFile){
            for (let val of reasonFundmakerFile){
                if (!!val.idDataPropVal){

                }else {
                    val.value.dEnd= moment(values.dateElimination.value, "DD-MM-YYYY").format("YYYY-MM-DD")
                }
            }
        }



        if (!this.props.initialValues.key) {
            return this.props.onCreateObj(
                {cube, obj},
                {values: rest, idDPV: this  .props.withIdDPV, oFiles: {reasonFundmakerFile}},
            )
        }
        obj.doItem = this.props.initialValues.key;
        const objData = {};
        if (!!rest.dateElimination){
            objData.dEnd=rest.dateElimination.value.format("YYYY-MM-DD")
        }

        rest.conditionOfFundmaker=[{
            value:this.props.tofiConstants["liquidation"].id
        }]
            return this.props.saveProps(
                {cube, obj},
                {values: rest, idDPV: this.props.withIdDPV, oFiles: {reasonFundmakerFile}},
                this.props.tofiConstants,
                objData
            );
        };




    componentDidUpdate(prevProps) {
        if (prevProps.initialValues !== this.props.initialValues) {

        }
    }

    disabledStartDate = (startValue) => {
        const endValue = this.props.dendValue;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    };

    loadOptionsReceiver = () => {
        this.props.getAllObjOfCls('fundmakerOrg', moment().format('YYYY-MM-DD'), 'nomenList').then(res => {
            this.setState({
                loadReceiver: res.objects
            })
        }).catch(err => console.log(err))
    }

    fileToRedux = (val, prevVal, file, str) => {
        let newFile = val.filter(el => el instanceof File);
        if (newFile.length > 0) {
            var copyVal = prevVal?[...prevVal]:[]
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

    dateToRedux=(val , prev)=>{{
        let coppyPrev = {...prev}
        if (!!val){
            let newDate = moment(val).format("DD-MM-YYYY")
            if (!!coppyPrev.idDataPropVal){
                coppyPrev.value = newDate
                return coppyPrev
            }else {
                return {
                    value:newDate
                }
            }
        }else{
            if (!!coppyPrev.value){
                coppyPrev.value=""
                return coppyPrev
            }else{
                return {}
            }
        }
    }}

    strToRedux = (val, prevVal, obj, prevObj, flag) => {
        if(!!flag){
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
            return objVal
        } else {
            newVal.value = val;
            newVal['valueLng']={kz:val,ru:val,en:val}
            return (newVal)

        }
    };


    selectToRedux = (val, prevVal, obj, prevObj) => {
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
    componentDidMount() {

        this.renderDataTable()
        this.renderDataTable2()

    }

    renderDataTable2 = async () => {
        const data = new FormData();
        data.append('objId', String(this.props.initialValues.key.split('_')[1]));
        data.append('propConsts', 'reasonFundmaker,reasonFundmakerFile,dateReorganization,orgIndustry,orgFunction,legalStatus,structureFundmaker,structure,orgRightReceiver,orgFunctionFundmaker,departmentalAccessory,conditionOfFundmaker');
        data.append('allValues', String(1));

        await getValuesOfObjsWithProps2(data).then(res => {
            if (res.success === false && res.errors) {
                for (let val of  res.errors) {
                    message.error(val.text)
                }
                return false
            }
            if (!!res.data && !!res.data.owner) {
                let newarr = [...res.data.owner]
                for (let val of newarr) {
                    let dateReorganization = !!res.data.dateReorganization && res.data.dateReorganization.find(el => val.verOwn === el.verOwn && !!el.val)
                    if (!!dateReorganization) {
                        val.dateReorganization = dateReorganization
                    }
                    let reasonFundmaker = !!res.data.reasonFundmaker && res.data.reasonFundmaker.find(el => val.verOwn === el.verOwn && !!el.val)
                    if (!!reasonFundmaker) {
                        val.reasonFundmaker = reasonFundmaker
                    }
                    let reasonFundmakerFile = !!res.data.reasonFundmakerFile && res.data.reasonFundmakerFile.find(el => val.verOwn === el.verOwn && !!el.val)
                    if (!!reasonFundmakerFile) {
                        val.reasonFundmakerFile = reasonFundmakerFile
                    }
                    let orgIndustry = !!res.data.orgIndustry && res.data.orgIndustry.filter(el => val.verOwn === el.verOwn && !!el.val)
                    if (!!orgIndustry) {
                        val.orgIndustry = orgIndustry
                    }
                    let legalStatus = !!res.data.legalStatus && res.data.legalStatus.find(el => val.verOwn === el.verOwn && !!el.val)
                    if (!!legalStatus) {
                        val.legalStatus = legalStatus
                    }
                    let structureFundmaker = !!res.data.structureFundmaker && res.data.structureFundmaker.find(el => val.verOwn === el.verOwn && !!el.val)
                    if (!!structureFundmaker) {
                        val.structureFundmaker = structureFundmaker
                    }
                    let structure = !!res.data.structure && res.data.structure.find(el => val.verOwn === el.verOwn && !!el.val)
                    if (!!structure) {
                        val.structure = structure
                    }
                    let orgRightReceiver = !!res.data.orgRightReceiver && res.data.orgRightReceiver.find(el => val.verOwn === el.verOwn && !!el.val)
                    if (!!orgRightReceiver) {
                        val.orgRightReceiver = orgRightReceiver
                    }
                    let orgFunctionFundmaker = !!res.data.orgFunctionFundmaker && res.data.orgFunctionFundmaker.find(el => val.verOwn === el.verOwn && !!el.val)
                    if (!!orgFunctionFundmaker) {
                        val.orgFunctionFundmaker = orgFunctionFundmaker
                    }
                    let orgFunction = !!res.data.orgFunction && res.data.orgFunction.find(el => val.verOwn === el.verOwn && !!el.val)
                    if (!!orgFunction) {
                        val.orgFunction = orgFunction
                    }
                    let departmentalAccessory = !!res.data.departmentalAccessory && res.data.departmentalAccessory.find(el => val.verOwn === el.verOwn && !!el.val)
                    if (!!departmentalAccessory) {
                        val.departmentalAccessory = departmentalAccessory
                    }
                    let conditionOfFundmaker = !!res.data.conditionOfFundmaker && res.data.conditionOfFundmaker.filter(el => val.verOwn === el.verOwn)
                    if (!!conditionOfFundmaker) {
                        val.conditionOfFundmaker = conditionOfFundmaker
                    }
                }
                let rezulArr = []
                let i = 1
                for (let val of newarr) {
                    if (!!val.conditionOfFundmaker) {
                        for (let item of val.conditionOfFundmaker) {
                            if (!!item.name && item.name.ru === "Реорганизация") {
                                val.number = i
                                i++
                                rezulArr.push(val)
                            }
                        }
                    }
                }
                this.setState({
                    dataTable2: rezulArr
                })
            } else {
                message.info("Нет данных")
            }

        }).catch(e => {
            console.log(e)
        })
    }
    renderDataTable = async () => {
        const data = new FormData();
        data.append('objId', String(this.props.initialValues.key.split('_')[1]));
        data.append('propConsts', 'reasonFundmaker,reasonFundmakerFile,dateRename,conditionOfFundmaker');
        data.append('allValues', String(1));

        await getValuesOfObjsWithProps2(data).then(res => {
            if (res.success === false && res.errors) {
                for (let val of  res.errors) {
                    message.error(val.text)
                }
                return false
            }
            if (!!res.data && !!res.data.owner) {
                let newarr = [...res.data.owner]
                for (let val of newarr) {
                    let dateRename = !!res.data.dateRename && res.data.dateRename.find(el => val.verOwn === el.verOwn && !!el.val)
                    if (!!dateRename) {
                        val.dateRename = dateRename
                    }
                    let reasonFundmaker = !!res.data.reasonFundmaker && res.data.reasonFundmaker.find(el => val.verOwn === el.verOwn && !!el.val)
                    if (!!reasonFundmaker) {
                        val.reasonFundmaker = reasonFundmaker
                    }
                    let reasonFundmakerFile = !!res.data.reasonFundmakerFile && res.data.reasonFundmakerFile.find(el => val.verOwn === el.verOwn && !!el.val)
                    if (!!reasonFundmakerFile) {
                        val.reasonFundmakerFile = reasonFundmakerFile
                    }
                    let conditionOfFundmaker = !!res.data.conditionOfFundmaker && res.data.conditionOfFundmaker.filter(el => val.verOwn === el.verOwn)
                    if (!!conditionOfFundmaker) {
                        val.conditionOfFundmaker = conditionOfFundmaker
                    }
                }
                let rezulArr = []
                let i = 1
                for (let val of newarr) {
                    if (!!val.conditionOfFundmaker) {
                        for (let item of val.conditionOfFundmaker) {
                            if (!!item.name && item.name.ru === "Переименование") {
                                val.number = i
                                i++
                                rezulArr.push(val)
                            }
                        }
                    }
                }
                this.setState({
                    dataTable: rezulArr
                })
            } else {
                message.info("Нет данных")
            }

        }).catch(e => {
            console.log(e)
        })
    }
    closeProps = async (rest) => {
        let dataOldProps = []
        let oldpropsRename = this.state.dataTable.length > 0 ? this.state.dataTable[this.state.dataTable.length - 1] : ""
        let dataTableRegin = this.state.dataTable2.length > 0 ? this.state.dataTable2[this.state.dataTable2.length - 1] : ""
        if (!!oldpropsRename && !!oldpropsRename.dateRename) {
            if (oldpropsRename.dateRename.dend === "3333-12-31") {
                dataOldProps.push({
                    idDataPropVal: String(oldpropsRename.dateRename.idDataPropVal),
                    dEnd: moment(rest.dateElimination.value, "DD-MM-YYYY").format("YYYY-MM-DD")
                })
            }
        }
        if (!!dataTableRegin && !!dataTableRegin.dateReorganization) {
            if (dataTableRegin.dateReorganization.dend === "3333-12-31") {
                dataOldProps.push({
                    idDataPropVal: String(dataTableRegin.dateReorganization.idDataPropVal),
                    dEnd: moment(rest.dateElimination.value, "DD-MM-YYYY").format("YYYY-MM-DD")
                })
            }
        }
            if (!!dataTableRegin) {
                if (!!dataTableRegin.orgRightReceiver) {
                    if (dataTableRegin.orgRightReceiver.dend === "3333-12-31") {
                        dataOldProps.push({
                            idDataPropVal: String(dataTableRegin.orgRightReceiver.idDataPropVal),
                            dEnd: moment(rest.dateElimination.value, "DD-MM-YYYY").format("YYYY-MM-DD")
                        })
                    }
                }
            }
        if (!!dataTableRegin) {
            if (!!dataTableRegin.orgIndustry) {
                for (let val of dataTableRegin.orgIndustry) {
                    if (val.dend === "3333-12-31") {
                        dataOldProps.push({
                            idDataPropVal: String(val.idDataPropVal),
                            dEnd: moment(rest.dateElimination.value, "DD-MM-YYYY").format("YYYY-MM-DD")
                        })
                    }
                }
            }
        }


        if (!!oldpropsRename) {
            if (!!oldpropsRename.conditionOfFundmaker) {
                let findtobj = oldpropsRename.conditionOfFundmaker.find(el => !!el.name && el.name.ru === "Переименование")
                if (findtobj.dend === "3333-12-31") {
                    dataOldProps.push({
                        idDataPropVal: String(findtobj.idDataPropVal),
                        dEnd: moment(rest.dateElimination.value, "DD-MM-YYYY").format("YYYY-MM-DD")
                    })
                }
            }
        }
        if (!!dataTableRegin) {
            if (!!dataTableRegin.conditionOfFundmaker) {
                let findtobj = dataTableRegin.conditionOfFundmaker.find(el => !!el.name && el.name.ru === "Реорганизация")

                if (findtobj.dend === "3333-12-31") {
                    dataOldProps.push({
                        idDataPropVal: String(findtobj.idDataPropVal),
                        dEnd: moment(rest.dateElimination.value, "DD-MM-YYYY").format("YYYY-MM-DD")
                    })
                }
            }
        }
            if (!!dataTableRegin) {
                if (!!dataTableRegin.legalStatus) {
                    if (dataTableRegin.legalStatus.dend === "3333-12-31") {
                        dataOldProps.push({
                            idDataPropVal: String(dataTableRegin.legalStatus.idDataPropVal),
                            dEnd: moment(rest.dateElimination.value, "DD-MM-YYYY").format("YYYY-MM-DD")
                        })
                    }
                }
            }

            if (!!dataTableRegin) {
                if (!!dataTableRegin.structureFundmaker) {
                    if (dataTableRegin.structureFundmaker.dend === "3333-12-31") {
                        dataOldProps.push({
                            idDataPropVal: String(dataTableRegin.structureFundmaker.idDataPropVal),
                            dEnd: moment(rest.dateElimination.value, "DD-MM-YYYY").format("YYYY-MM-DD")
                        })
                    }
                }
            }


        if (!!dataTableRegin) {
            if (!!dataTableRegin.structure) {
                if (dataTableRegin.structure.dend === "3333-12-31") {
                    dataOldProps.push({
                        idDataPropVal: String(dataTableRegin.structure.idDataPropVal),
                        dEnd: moment(rest.dateElimination.value, "DD-MM-YYYY").format("YYYY-MM-DD")
                    })
                }
            }
        }


        if (!!dataTableRegin) {
            if (!!dataTableRegin.orgFunction) {
                if (dataTableRegin.orgFunction.dend === "3333-12-31") {
                    dataOldProps.push({
                        idDataPropVal: String(dataTableRegin.orgFunction.idDataPropVal),
                        dEnd: moment(rest.dateElimination.value, "DD-MM-YYYY").format("YYYY-MM-DD")
                    })
                }
            }
        }


            if (!!dataTableRegin) {
                if (!!dataTableRegin.departmentalAccessory) {
                    if (dataTableRegin.departmentalAccessory.dend === "3333-12-31") {
                        dataOldProps.push({
                            idDataPropVal: String(dataTableRegin.departmentalAccessory.idDataPropVal),
                            dEnd: moment(rest.dateElimination.value, "DD-MM-YYYY").format("YYYY-MM-DD")
                        })
                    }
                }
            }


            if (!!dataTableRegin) {
                if (!!dataTableRegin.orgFunctionFundmaker) {
                    if (dataTableRegin.orgFunctionFundmaker.dend === "3333-12-31") {
                        dataOldProps.push({
                            idDataPropVal: String(dataTableRegin.orgFunctionFundmaker.idDataPropVal),
                            dEnd: moment(rest.dateElimination.value, "DD-MM-YYYY").format("YYYY-MM-DD")
                        })
                    }
                }
            }

            if (!!oldpropsRename) {
                if (!!oldpropsRename.reasonFundmaker) {
                    if (oldpropsRename.reasonFundmaker.dend === "3333-12-31") {
                        dataOldProps.push({
                            idDataPropVal: String(oldpropsRename.reasonFundmaker.idDataPropVal),
                            dEnd: moment(rest.dateElimination.value, "DD-MM-YYYY").format("YYYY-MM-DD")
                        })
                    }
                }
            }
            if (!!dataTableRegin) {
                if (!!dataTableRegin.reasonFundmaker) {
                    if (dataTableRegin.reasonFundmaker.dend === "3333-12-31") {
                        dataOldProps.push({
                            idDataPropVal: String(dataTableRegin.reasonFundmaker.idDataPropVal),
                            dEnd: moment(rest.dateElimination.value, "DD-MM-YYYY").format("YYYY-MM-DD")
                        })
                    }
                }
            }



        if (!!oldpropsRename) {
            if (!!oldpropsRename.reasonFundmakerFile) {
                if (oldpropsRename.reasonFundmakerFile.dend === "3333-12-31") {
                    dataOldProps.push({
                        idDataPropVal: String(oldpropsRename.reasonFundmakerFile.idDataPropVal),
                        dEnd: moment(rest.dateElimination.value, "DD-MM-YYYY").format("YYYY-MM-DD")
                    })
                }
            }
        }
        if (!!dataTableRegin) {
            if (!!dataTableRegin.reasonFundmakerFile) {
                if (dataTableRegin.reasonFundmakerFile.dend === "3333-12-31") {
                    dataOldProps.push({
                        idDataPropVal: String(dataTableRegin.reasonFundmakerFile.idDataPropVal),
                        dEnd: moment(rest.dateElimination.value, "DD-MM-YYYY").format("YYYY-MM-DD")
                    })
                }
            }
        }


        if (dataOldProps.length !== 0) {

            const fd2 = new FormData();
            fd2.append('own', this.props.initialValues.key.split('_')[1]);
            fd2.append('cubeSConst', "cubeForOrgFundmaker")
            fd2.append('datas', JSON.stringify(dataOldProps))
            await axios.post(`/${localStorage.getItem('i18nextLng')}/entity/changeValueOfDend`, fd2)
                .then(res => {
                    if (res.data.success === false && res.data.errors) {
                        for (let val of  res.data.errors) {
                            message.error(val.text)
                        }
                        return false
                    }
                })
        }
    }


    render(){
        if (!this.props.tofiConstants) return null;
        const lng = localStorage.getItem('i18nextLng');
        const {lang, loading} = this.state;
        const {tofiConstants: {dateElimination,reasonFundmaker,orgRightReceiver}, t,orgRightReceiverOptions, handleSubmit, reset, dirty, error, submitting} = this.props;
        return(
            <Form className="antForm-spaceBetween btnFF" onSubmit={handleSubmit(this.onSubmit)}
                  style={dirty ? {paddingBottom: '43px'} : {}}>
                {
                    dateElimination && <Field
                        name="dateElimination"
                        normalize={this.dateToRedux}
                        component={renderDatePicker}
                        disabledDate={this.disabledStartDate}
                        label={dateElimination.name[lng]}
                        format={null}
                        validate={requiredDate}
                        colon={true}
                        formItemLayout={
                            {
                                labelCol: {span: 10},
                                wrapperCol: {span: 14}
                            }
                        }
                    />
                }
                {orgRightReceiver && <Field
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
                />}
                <Row>
                    <Col span={24}>
                        {reasonFundmaker && <Field
                            name="reasonFundmaker"
                            component={renderInput}
                            label={reasonFundmaker.name[lng]}
                            normalize={this.strToRedux}
                            formItemLayout={
                                {
                                    labelCol: { span: 10 },
                                    wrapperCol: { span: 14 }
                                }
                            }
                        />}
                    </Col>
                    <Col span={24}>
                        <Row>
                            <Col span={10}></Col>
                            <Col span={14}>
                                <Field
                                    name="reasonFundmakerFile"
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
                {dirty && <Form.Item className="ant-form-btns absolute-bottom">
                    <Button className="signup-form__btn" type="primary" htmlType="submit"
                            disabled={submitting}>
                        {submitting ? t('LOADING...') : t('SAVE')}
                    </Button>
                    <Button className="signup-form__btn" type="danger" htmlType="button"
                            disabled={submitting} style={{marginLeft: '10px'}}
                            onClick={reset}>
                        {submitting ? t('LOADING...') : t('CANCEL')}
                    </Button>
                    {error &&
                    <span className="message-error"><i className="icon-error"/>{error}</span>}
                </Form.Item>}
            </Form>

        );
    }
}



const selector = formValueSelector('LiquidationFoundMaker');

function mapStateToProps(state) {
    const lng = localStorage.getItem('i18nextLng');
    const orgIndOpts = state.generalData[ORG_INDUSTRY] && state.generalData[ORG_INDUSTRY]
        .map(option => ({
            value: option.id,
            label: option.name[lng],
            hasChild: option.hasChild,
            parent: option.parent
        }));
    return {
        legalStatusOptions: state.generalData[LEGAL_STATUS],
        orgRightReceiverOptions: state.generalData[ORG_RIGHT_RECEIVER],
        formOfAdmissionOptions: state.generalData[FORM_OF_ADMISSION],
        isActiveOptions: state.generalData[IS_ACTIVE],
        fundmakerArchiveOptions: state.generalData[FUND_MAKER_ARCHIVE],
        orgDocTypeOptions: state.generalData[ORG_DOC_TYPE],
        objSubordinationOptions: state.generalData.objSubordination,
        accessLevelOptions: state.generalData.accessLevel,
        cubeForFundAndIKSingle: state.cubes.cubeForFundAndIKSingle
    }
}

export default connect(
    mapStateToProps,
    {getPropVal, getCube, getAccessLevels, getObjChildsByConst, getAllObjOfCls, getPropValWithChilds}
)(reduxForm({form: 'LiquidationFoundMaker', enableReinitialize: true})(LiquidationFoundMaker));
