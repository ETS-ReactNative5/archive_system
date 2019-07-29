import React from 'react';
import {Button, Form, DatePicker, message, Modal, Input} from "antd";
import {isEmpty, isEqual, pickBy} from "lodash";
import AntTable from "../../AntTable";
import {Field, formValueSelector, reduxForm} from "redux-form";
import {
    getFile,
    getFileResolve,
    getObjVer,
    getAllObjOfCls,
    getObjVer_new,
    getValuesOfObjsWithProps,
    getPropValWithChilds,
    getPropVal,
    getValuesOfObjsWithProps2,getCube, addObjVer, updObjVer, dFile, saveValueOfMultiText
} from '../../../actions/actions';
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
import axios from "axios"
import Col from "antd/es/grid/col";
import Row from "antd/es/grid/row";
import FormItem from "antd/es/form/FormItem";
import Icon from "antd/es/icon/index";
import Badge from "antd/es/badge/index";
import {parseCube_new, parseForTable} from "../../../utils/cubeParser";


class ReorganizationFoundMaker extends React.PureComponent {
    constructor(props) {
        super(props);
        const lng = localStorage.getItem('i18nextLng');
        this.state = {
            selectedRowKey: '',
            dataTable: [],
            dataTableRename: [],
            newFileArr: "",
            newFileArrStructura: "",
            newFileArrFunc: "",
            optionMultiSelect: [],
            modalOpen: false,
            loading: {
                orgRightReceiverLoading: false,
                loadReceiver: '',
            },
            lang: {
                orgFunctionFundmaker: localStorage.getItem("i18nextLng"),
                structureFundmaker: localStorage.getItem("i18nextLng"),
                name: localStorage.getItem("i18nextLng"),
                shortNameValue: localStorage.getItem("i18nextLng"),
                departmentalAccessory: lng,
            },
            addForm: false,
            showInputFiole: true,
            showInputFioleStrurtura: true,
            showInputFioleFunc: true,
            iditRename: false,
            saveForm: false
        }
    }

    changeLang = e => {
        this.setState({
            lang: {...this.state.lang, [e.target.name]: e.target.value}
        });
    };

    loadOptions = (c, withChilds) => {
        return () => {
            if (!this.props[c + 'Options']) {
                this.setState({loading: {...this.state.loading, [c + 'Loading']: true}});
                !withChilds && this.props.getPropVal(c)
                    .then(() => this.setState({
                        loading: {
                            ...this.state.loading,
                            [c + 'Loading']: false
                        }
                    }))
                    .catch(() => message.error('Ошибка загрузки данных'));
                withChilds && this.props.getPropValWithChilds(c)
                    .then(() => this.setState({
                        loading: {
                            ...this.state.loading,
                            [c + 'Loading']: false
                        }
                    }))
                    .catch(() => message.error('Ошибка загрузки данных'));

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

    changeSelectedRow = rec => {
        this.setState({
            selectedRowKey: rec,
        })
    };

    departmentalAccessoryValue = {...this.props.initialValues.departmentalAccessory} || {
        kz: '',
        ru: '',
        en: ''
    };

    adCoum = () => {
        this.props.resetinitialValues2("")
        this.setState({
            newFileArr: "",
            newFileArrStructura: "",
            newFileArrFunc: "",
        })
        if (this.state.addForm === false) {
            this.setState({
                addForm: true,
                iditRename: false,
            })
        }
    }

    editCoum = () => {
        let selectedRowKey = {...this.state.selectedRowKey}
        const lng = localStorage.getItem('i18nextLng');
        this.setState({
            newFileArr: "",
            newFileArrStructura: "",
            newFileArrFunc: "",
        })
        let reorInitialValues = {}
        if (!!selectedRowKey.dateReorganization) {
            reorInitialValues.dateReorganization = {
                dbeg: selectedRowKey.dateReorganization.dbeg,
                dend: selectedRowKey.dateReorganization.dend,
                idDataPropVal: selectedRowKey.dateReorganization.idDataPropVal,
                value: moment(selectedRowKey.dateReorganization.val, "YYYY-MM-DD")
            }
        }

        if (!!selectedRowKey.reasonFundmaker) {
            reorInitialValues.reasonFundmaker = {
                dbeg: selectedRowKey.reasonFundmaker.dbeg,
                dend: selectedRowKey.reasonFundmaker.dend,
                idDataPropVal: selectedRowKey.reasonFundmaker.idDataPropVal,
                value: selectedRowKey.reasonFundmaker.val[lng]
            }
        }

        if (!!selectedRowKey.orgRightReceiver) {
            reorInitialValues.orgRightReceiver = {
                dbeg: selectedRowKey.orgRightReceiver.dbeg,
                dend: selectedRowKey.orgRightReceiver.dend,
                idDataPropVal: selectedRowKey.orgRightReceiver.idDataPropVal,
                value: selectedRowKey.orgRightReceiver.val,
                label: selectedRowKey.orgRightReceiver.name[lng]
            }
        }

        if (!!selectedRowKey.orgIndustry) {
            let newArr = []
            for (let val of selectedRowKey.orgIndustry){
                newArr.push({
                    dbeg: val.dbeg,
                    dend: val.dend,
                    idDataPropVal: val.idDataPropVal,
                    value: val.val,
                    label:val.name[lng]
                })
            }
            reorInitialValues.orgIndustry =newArr
        }

        if (!!selectedRowKey.legalStatus) {
            reorInitialValues.legalStatus = {
                dbeg: selectedRowKey.legalStatus.dbeg,
                dend: selectedRowKey.legalStatus.dend,
                idDataPropVal: selectedRowKey.legalStatus.idDataPropVal,
                value: selectedRowKey.legalStatus.val,
                label:selectedRowKey.legalStatus.name[lng]
            }
        }

        if (!!selectedRowKey.structureFundmaker) {
            reorInitialValues.structureFundmaker = {
                dbeg: selectedRowKey.structureFundmaker.dbeg,
                dend: selectedRowKey.structureFundmaker.dend,
                idDataPropVal: selectedRowKey.structureFundmaker.idDataPropVal,
                value: selectedRowKey.structureFundmaker.val,
                valueLng:selectedRowKey.structureFundmaker.val
            }
        }

        if (!!selectedRowKey.orgFunctionFundmaker) {
            reorInitialValues.orgFunctionFundmaker = {
                dbeg: selectedRowKey.orgFunctionFundmaker.dbeg,
                dend: selectedRowKey.orgFunctionFundmaker.dend,
                idDataPropVal: selectedRowKey.orgFunctionFundmaker.idDataPropVal,
                value: selectedRowKey.orgFunctionFundmaker.val,
                valueLng:selectedRowKey.orgFunctionFundmaker.val

            }
        }

        if (!!selectedRowKey.departmentalAccessory) {
            reorInitialValues.departmentalAccessory = {
                dbeg: selectedRowKey.departmentalAccessory.dbeg,
                dend: selectedRowKey.departmentalAccessory.dend,
                idDataPropVal: selectedRowKey.departmentalAccessory.idDataPropVal,
                value: selectedRowKey.departmentalAccessory.val,
                valueLng: {
                    ru:selectedRowKey.departmentalAccessory.val.ru,
                    kz:selectedRowKey.departmentalAccessory.val.kz,
                    en:selectedRowKey.departmentalAccessory.val.en,
                }
            }
        }

        if (!!selectedRowKey.reasonFundmakerFile) {
            reorInitialValues.reasonFundmakerFile = selectedRowKey.reasonFundmakerFile
        }
        if (!!selectedRowKey.reasonFundmakerFile) {
            this.setState({
                showInputFiole: false
            })
        } else {
            this.setState({
                showInputFiole: true
            })
        }

        if (!!selectedRowKey.orgFunction) {
            reorInitialValues.orgFunction = selectedRowKey.orgFunction
        }
        if (!!selectedRowKey.orgFunction) {
            this.setState({
                showInputFioleFunc: false
            })
        } else {
            this.setState({
                showInputFioleFunc: true
            })
        }

        if (!!selectedRowKey.structure) {
            reorInitialValues.structure = selectedRowKey.structure
        }
        if (!!selectedRowKey.structure) {
            this.setState({
                showInputFioleStrurtura: false
            })
        } else {
            this.setState({
                showInputFioleStrurtura: true
            })
        }

        reorInitialValues.conditionOfFundmaker = selectedRowKey.conditionOfFundmaker.filter(el => !!el.name && el.name.ru === "Реорганизация")
        reorInitialValues.name = selectedRowKey.fullName
        reorInitialValues.shortName = selectedRowKey.name
        reorInitialValues.key = this.props.initialValues.key
        reorInitialValues.dbeg = selectedRowKey.dbeg
        reorInitialValues.dend = selectedRowKey.dend
        reorInitialValues.verOwn = selectedRowKey.verOwn
        this.props.resetinitialValues2(reorInitialValues)
        this.setState({
            addForm: true,
            iditRename: true,

        })
    }

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

    componentDidMount() {
        this.renderDataTable()
        this.renderDataTable2()
    }


    renderDataTable2 = async () => {
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
                    dataTableRename: rezulArr
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
                    dataTable: rezulArr
                })
            } else {
                message.info("Нет данных")
            }

        }).catch(e => {
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

                getFile(key).then(blob => {

                    if (res.data.type === "pdf"|| res.data.type === "docx" ) {

                        const url = URL.createObjectURL(new Blob([blob.data], {type: 'application/pdf'}));
                        this.setState({
                            modalOpen: true,
                            file: <iframe src={`${url}#toolbar=0`} frameBorder="0"/>
                        })
                    }
                    else {
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

    editRename = async(values) => {
        const hideLoading = message.loading(this.props.t('UPDATING_VERSION'), 0);
        const reasonFundmakerFile = this.state.newFileArr
        if (!!reasonFundmakerFile) {
            for (let val of reasonFundmakerFile) {

                val.value.dBeg = values.dateReorganization.value.format('YYYY-MM-DD')
                val.value.dEnd = values.dend
            }
        }
        const structure = this.state.newFileArrStructura
        if (!!structure) {
            for (let val of structure) {
                val.value.dBeg = values.dateReorganization.value.format('YYYY-MM-DD')
                val.value.dEnd = values.dend
            }
        }
        const orgFunction = this.state.newFileArrFunc
        if (!!orgFunction) {
            for (let val of orgFunction) {
                val.value.dBeg = values.dateReorganization.value.format('YYYY-MM-DD')
                val.value.dEnd = values.dend
            }
        }
        const cube = {
            cubeSConst: 'cubeForOrgFundmaker',
            doConst: 'doForOrgFundmakers',
            dpConst: 'dpForOrgFundmakers',
        };
        const obj = {
            clsConst: 'fundmakerOrg',
        };
        let rest = {}

        values.dateReorganization.dbeg = values.dateReorganization.value.format('YYYY-MM-DD')
        values.conditionOfFundmaker[0].dbeg = values.dateReorganization.value.format('YYYY-MM-DD')
        values.conditionOfFundmaker[0].value = values.conditionOfFundmaker[0].val

        rest.dateReorganization = values.dateReorganization
        rest.conditionOfFundmaker = values.conditionOfFundmaker
        if (!!values.reasonFundmaker ){
            if (!!values.reasonFundmaker.idDataPropVal) {
                values.reasonFundmaker.dbeg = values.dateReorganization.value.format('YYYY-MM-DD')
                rest.reasonFundmaker = values.reasonFundmaker
            } else {
                values.reasonFundmaker.dbeg = values.dateReorganization.value.format('YYYY-MM-DD')
                values.reasonFundmaker.dend = values.dend
                rest.reasonFundmaker = values.reasonFundmaker
            }
        }

        if (!!values.legalStatus ) {
            if (!!values.legalStatus.idDataPropVal) {
                values.legalStatus.dbeg = values.dateReorganization.value.format('YYYY-MM-DD')
                rest.legalStatus = values.legalStatus
            } else {
                values.legalStatus.dbeg = values.dateReorganization.value.format('YYYY-MM-DD')
                values.reasonFundmaker.dend = values.dend
                rest.legalStatus = values.legalStatus
            }
        }
        if (values.orgIndustry.length>0 ) {
            let newArr  =[]
            for (let val of values.orgIndustry){
                if(!!val.idDataPropVal){
                    val.dbeg = values.dateReorganization.value.format('YYYY-MM-DD')
                }else {
                    val.dbeg = values.dateReorganization.value.format('YYYY-MM-DD')
                    val.dend = values.dend
                }
                newArr.push(val)
            }

            rest.reasonFundmaker = newArr
        }
        if (!!values.orgRightReceiver ) {
            if (!!values.orgRightReceiver.idDataPropVal) {
                values.orgRightReceiver.dbeg = values.dateReorganization.value.format('YYYY-MM-DD')
                rest.orgRightReceiver = values.orgRightReceiver
            } else {
                values.orgRightReceiver.dbeg = values.dateReorganization.value.format('YYYY-MM-DD')
                values.orgRightReceiver.dend = values.dend
                rest.orgRightReceiver = values.orgRightReceiver
            }
        }

        if (!!values.structureFundmaker ) {
            if ( !!values.structureFundmaker.idDataPropVal) {
                values.structureFundmaker.dbeg = values.dateReorganization.value.format('YYYY-MM-DD')
                rest.structureFundmaker = values.structureFundmaker
            } else {
                values.structureFundmaker.dbeg = values.dateReorganization.value.format('YYYY-MM-DD')
                values.structureFundmaker.dend = values.dend
                rest.structureFundmaker = values.structureFundmaker
            }
            await this.saveMultiText2(values.structureFundmaker, 'structureFundmaker')

        }
        if (!!values.orgFunctionFundmaker ){
            if (!!values.orgFunctionFundmaker.idDataPropVal) {
                values.orgFunctionFundmaker.dbeg = values.dateReorganization.value.format('YYYY-MM-DD')

            } else {
                values.orgFunctionFundmaker.dbeg = values.dateReorganization.value.format('YYYY-MM-DD')
                values.orgFunctionFundmaker.dend = values.dend

            }
            await this.saveMultiText2(values.orgFunctionFundmaker, 'orgFunctionFundmaker')
        }
        if (!!values.departmentalAccessory ){
            if (!!values.departmentalAccessory.idDataPropVal) {
                values.departmentalAccessory.dbeg = values.dateReorganization.value.format('YYYY-MM-DD')
                rest.departmentalAccessory = values.departmentalAccessory
            } else {
                values.departmentalAccessory.dbeg = values.dateReorganization.value.format('YYYY-MM-DD')
                values.departmentalAccessory.dend = values.dend
                rest.departmentalAccessory = values.departmentalAccessory
            }
        }

        obj.doItem = this.props.initialValues.key;
        const objData = {};
        const fd = new FormData();
        fd.append('objVerId', String(values.verOwn));
        fd.append('dimObjsConst', "doForOrgFundmakers");
        fd.append('dbeg', values.dateReorganization.value.format('YYYY-MM-DD'));
        fd.append('dend', values.dend);
        fd.append('name',JSON.stringify(values.shortName));
        fd.append('fullName', JSON.stringify(values.name));
        fd.append('cmtVer', JSON.stringify({}));
        fd.append('parent', null)

        updObjVer(fd)
            .then(res => {
                hideLoading();
                if (res.success) {
                    message.success(this.props.t('OBJ_VER_UPDATED'));
                    this.props.saveProps3(
                        {cube, obj},
                        {
                            values: rest,
                            idDPV: this.props.withIdDPV,
                            oFiles: {reasonFundmakerFile, structure, orgFunction}
                        },
                        this.props.tofiConstants,
                        objData
                    );
                } else {
                    res.errors.forEach(err => {
                        message.error(err.text, 5)
                    })
                }
            }).catch(err => {
            console.log(err);
            hideLoading();
        });
    }
    closeProps = async (rest) => {
        let dataOldProps = []
        let oldProps = {...this.props.dataPrev}
        let oldpropsRename = this.state.dataTableRename.length > 0 ? this.state.dataTableRename[this.state.dataTableRename.length - 1] : ""
        let dataTableRegin = this.state.dataTable.length > 0 ? this.state.dataTable[this.state.dataTable.length - 1] : ""
        if (!!oldpropsRename && !!oldpropsRename.dateRename) {
            if (oldpropsRename.dateRename.dend === "3333-12-31") {
                dataOldProps.push({
                    idDataPropVal: String(oldpropsRename.dateRename.idDataPropVal),
                    dEnd: moment(rest.dateReorganization.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
                })
            }
        }
        if (!!dataTableRegin && !!dataTableRegin.dateReorganization) {
            if (dataTableRegin.dateReorganization.dend === "3333-12-31") {
                dataOldProps.push({
                    idDataPropVal: String(dataTableRegin.dateReorganization.idDataPropVal),
                    dEnd: moment(rest.dateReorganization.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
                })
            }
        }
        if (!!oldProps.orgRightReceiver) {
            if (oldProps.orgRightReceiver.dend === "3333-12-31") {
                dataOldProps.push({
                    idDataPropVal: String(oldProps.orgRightReceiver.idDataPropVal),
                    dEnd: moment(rest.dateReorganization.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
                })
            }
            if (!!dataTableRegin) {
                if (!!dataTableRegin.orgRightReceiver) {
                    if (dataTableRegin.orgRightReceiver.dend === "3333-12-31") {
                        dataOldProps.push({
                            idDataPropVal: String(dataTableRegin.orgRightReceiver.idDataPropVal),
                            dEnd: moment(rest.dateReorganization.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
                        })
                    }
                }
            }
        }

        if (!!oldProps.orgIndustry) {
            for (let val of oldProps.orgIndustry) {
                if (val.dend === "3333-12-31") {
                    dataOldProps.push({
                        idDataPropVal: String(val.idDataPropVal),
                        dEnd: moment(rest.dateReorganization.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
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
                            dEnd: moment(rest.dateReorganization.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
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
                        dEnd: moment(rest.dateReorganization.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
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
                        dEnd: moment(rest.dateReorganization.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
                    })
                }
            }
        }
        if (!!oldProps.legalStatus) {
            if (oldProps.legalStatus.dend === "3333-12-31") {
                dataOldProps.push({
                    idDataPropVal: String(oldProps.legalStatus.idDataPropVal),
                    dEnd: moment(rest.dateReorganization.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
                })
            }
            if (!!dataTableRegin) {
                if (!!dataTableRegin.legalStatus) {
                    if (dataTableRegin.legalStatus.dend === "3333-12-31") {
                        dataOldProps.push({
                            idDataPropVal: String(dataTableRegin.legalStatus.idDataPropVal),
                            dEnd: moment(rest.dateReorganization.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
                        })
                    }
                }
            }
        }
        if (!!oldProps.structureFundmaker) {
            if (oldProps.structureFundmaker.dend === "3333-12-31") {
                dataOldProps.push({
                    idDataPropVal: String(oldProps.structureFundmaker.idDataPropVal),
                    dEnd: moment(rest.dateReorganization.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
                })
            }
            if (!!dataTableRegin) {
                if (!!dataTableRegin.structureFundmaker) {
                    if (dataTableRegin.structureFundmaker.dend === "3333-12-31") {
                        dataOldProps.push({
                            idDataPropVal: String(dataTableRegin.structureFundmaker.idDataPropVal),
                            dEnd: moment(rest.dateReorganization.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
                        })
                    }
                }
            }
        }
        if (!!oldProps.structure) {
            for (let val of oldProps.structure) {
                if (val.dend === "3333-12-31") {
                    dataOldProps.push({
                        idDataPropVal: String(val.idDataPropVal),
                        dEnd: moment(rest.dateReorganization.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
                    })
                }
            }
        }
        if (!!dataTableRegin) {
            if (!!dataTableRegin.structure) {
                if (dataTableRegin.structure.dend === "3333-12-31") {
                    dataOldProps.push({
                        idDataPropVal: String(dataTableRegin.structure.idDataPropVal),
                        dEnd: moment(rest.dateReorganization.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
                    })
                }
            }
        }
        if (!!oldProps.orgFunction) {
            for (let val of oldProps.orgFunction) {
                if (val.dend === "3333-12-31") {
                    dataOldProps.push({
                        idDataPropVal: String(val.idDataPropVal),
                        dEnd: moment(rest.dateReorganization.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
                    })
                }
            }
        }

        if (!!dataTableRegin) {
            if (!!dataTableRegin.orgFunction) {
                if (dataTableRegin.orgFunction.dend === "3333-12-31") {
                    dataOldProps.push({
                        idDataPropVal: String(dataTableRegin.orgFunction.idDataPropVal),
                        dEnd: moment(rest.dateReorganization.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
                    })
                }
            }
        }

        if (!!oldProps.departmentalAccessory) {
            if (oldProps.departmentalAccessory.dend === "3333-12-31") {
                dataOldProps.push({
                    idDataPropVal: String(oldProps.departmentalAccessory.idDataPropVal),
                    dEnd: moment(rest.dateReorganization.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
                })
            }

            if (!!dataTableRegin) {
                if (!!dataTableRegin.departmentalAccessory) {
                    if (dataTableRegin.departmentalAccessory.dend === "3333-12-31") {
                        dataOldProps.push({
                            idDataPropVal: String(dataTableRegin.departmentalAccessory.idDataPropVal),
                            dEnd: moment(rest.dateReorganization.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
                        })
                    }
                }
            }
        }
        if (!!oldProps.orgFunctionFundmaker) {
            if (oldProps.orgFunctionFundmaker.dend === "3333-12-31") {
                dataOldProps.push({
                    idDataPropVal: String(oldProps.orgFunctionFundmaker.idDataPropVal),
                    dEnd: moment(rest.dateReorganization.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
                })
            }

            if (!!dataTableRegin) {
                if (!!dataTableRegin.orgFunctionFundmaker) {
                    if (dataTableRegin.orgFunctionFundmaker.dend === "3333-12-31") {
                        dataOldProps.push({
                            idDataPropVal: String(dataTableRegin.orgFunctionFundmaker.idDataPropVal),
                            dEnd: moment(rest.dateReorganization.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
                        })
                    }
                }
            }
        }
        if (!!oldProps.reasonFundmaker) {
            if (oldProps.reasonFundmaker.dend === "3333-12-31") {
                dataOldProps.push({
                    idDataPropVal: String(oldProps.reasonFundmaker.idDataPropVal),
                    dEnd: moment(rest.dateReorganization.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
                })
            }
            if (!!oldpropsRename) {
                if (!!oldpropsRename.reasonFundmaker) {
                    if (oldpropsRename.reasonFundmaker.dend === "3333-12-31") {
                        dataOldProps.push({
                            idDataPropVal: String(oldpropsRename.reasonFundmaker.idDataPropVal),
                            dEnd: moment(rest.dateReorganization.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
                        })
                    }
                }
            }
            if (!!dataTableRegin) {
                if (!!dataTableRegin.reasonFundmaker) {
                    if (dataTableRegin.reasonFundmaker.dend === "3333-12-31") {
                        dataOldProps.push({
                            idDataPropVal: String(dataTableRegin.reasonFundmaker.idDataPropVal),
                            dEnd: moment(rest.dateReorganization.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
                        })
                    }
                }
            }
        }
        if (!!oldProps.reasonFundmakerFile) {
            for (let val of oldProps.reasonFundmakerFile) {
                if (val.dend === "3333-12-31") {
                    dataOldProps.push({
                        idDataPropVal: String(val.idDataPropVal),
                        dEnd: moment(rest.dateReorganization.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
                    })
                }
            }
        }

        if (!!oldpropsRename) {
            if (!!oldpropsRename.reasonFundmakerFile) {
                if (oldpropsRename.reasonFundmakerFile.dend === "3333-12-31") {
                    dataOldProps.push({
                        idDataPropVal: String(oldpropsRename.reasonFundmakerFile.idDataPropVal),
                        dEnd: moment(rest.dateReorganization.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
                    })
                }
            }
        }
        if (!!dataTableRegin) {
            if (!!dataTableRegin.reasonFundmakerFile) {
                if (dataTableRegin.reasonFundmakerFile.dend === "3333-12-31") {
                    dataOldProps.push({
                        idDataPropVal: String(dataTableRegin.reasonFundmakerFile.idDataPropVal),
                        dEnd: moment(rest.dateReorganization.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
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
    onSubmit = async (values) => {

        if (this.state.iditRename === true) {
            this.editRename(values)
        } else {
            const reasonFundmakerFile = this.state.newFileArr
            const orgFunction = this.state.newFileArrFunc
            const structure = this.state.newFileArrStructura
            const {name, shortName, orgFunctionFundmaker, structureFundmaker, ...rest} = pickBy(values, (val, key) => !isEqual(val, this.props.initialValues[key]));
            await this.closeProps(rest)
            if (!!reasonFundmakerFile) {
                for (let val of reasonFundmakerFile) {
                    val.value.dBeg = moment(rest.dateReorganization.value, "DD-MM-YYYY").format("YYYY-MM-DD")
                    val.value.dEnd = "3333-12-31"
                }
            }
            if (!!structure) {
                for (let val of structure) {
                    val.value.dBeg = moment(rest.dateReorganization.value, "DD-MM-YYYY").format("YYYY-MM-DD")
                    val.value.dEnd = "3333-12-31"
                }
            }
            if (!!orgFunction) {
                for (let val of orgFunction) {
                    val.value.dBeg = moment(rest.dateReorganization.value, "DD-MM-YYYY").format("YYYY-MM-DD")
                    val.value.dEnd = "3333-12-31"
                }
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
            if (!!rest.reasonFundmaker) {
                rest.reasonFundmaker.dbeg = moment(rest.dateReorganization.value, "DD-MM-YYYY").format("YYYY-MM-DD")
            }
            if (!!rest.dateReorganization) {
                rest.dateReorganization.dbeg = moment(rest.dateReorganization.value, "DD-MM-YYYY").format("YYYY-MM-DD");
            }
            if (!!rest.orgRightReceiver) {
                rest.orgRightReceiver.dbeg = moment(rest.dateReorganization.value, "DD-MM-YYYY").format("YYYY-MM-DD")
            }
            if (!!rest.orgIndustry) {
                for (let val of rest.orgIndustry) {
                    val.dbeg = moment(rest.dateReorganization.value, "DD-MM-YYYY").format("YYYY-MM-DD")
                }
            }
            if (!!rest.legalStatus) {
                rest.legalStatus.dbeg = moment(rest.dateReorganization.value, "DD-MM-YYYY").format("YYYY-MM-DD")
            }
            if (!!rest.structureFundmaker) {
                rest.structureFundmaker.dbeg = moment(rest.dateReorganization.value, "DD-MM-YYYY").format("YYYY-MM-DD")
            }
            if (!!rest.orgFunctionFundmaker) {
                rest.orgFunctionFundmaker.dbeg = moment(rest.dateReorganization.value, "DD-MM-YYYY").format("YYYY-MM-DD")
            }
            if (!!rest.departmentalAccessory) {
                rest.departmentalAccessory.dbeg = moment(rest.dateReorganization.value, "DD-MM-YYYY").format("YYYY-MM-DD")
            }

            rest.conditionOfFundmaker = [{
                value: this.props.tofiConstants["reorganization"].id,
                dbeg: moment(rest.dateReorganization.value, "DD-MM-YYYY").format("YYYY-MM-DD"),
                dend: "3333-12-31"
            }]
            const fd = new FormData();
            fd.append('obj', this.props.initialValues.key.split('_')[1]);
            fd.append('dimObjsConst', "doForOrgFundmakers");
            fd.append('dbeg', rest.dateReorganization.value.format('YYYY-MM-DD'));
            fd.append('dend', "3333-12-31");
            fd.append('name', JSON.stringify(this.props.initialValues.name))
            fd.append('fullName', JSON.stringify(this.props.initialValues.fullName))
            fd.append('cmtVer', JSON.stringify({}));
            fd.append('parent', null)
            await this.addNewVerIk(rest)

            await addObjVer(fd)
                .then(async (res) => {
                    if (res.success === false && res.errors) {
                        for (let val of  res.errors) {
                            message.error(val.text)
                        }
                        return false
                    }
                    this.props.saveProps3(
                        {cube, obj},
                        {
                            values: rest,
                            idDPV: this.props.withIdDPV,
                            oFiles: {reasonFundmakerFile, structure, orgFunction}
                        },
                        this.props.tofiConstants,
                        objData
                    );
                    if (!!orgFunctionFundmaker) {
                        this.saveMultiText(orgFunctionFundmaker, 'orgFunctionFundmaker', rest)
                    }
                    if (!!structureFundmaker) {
                        this.saveMultiText(structureFundmaker, 'structureFundmaker', rest)
                    }

                }).catch(e => {
                console.log(e)
            })

        }
    }

    addNewVerIk=async(value)=>{
        const { legalStatus, orgIndustry} = value;
        const {doForFundAndIK, dpForFundAndIK} = this.props.tofiConstants;

        const filters = {
            filterDOAnd: [
                {
                    dimConst: 'doForFundAndIK',
                    concatType: "and",
                    conds: [
                        {
                            data: {
                                dimPropConst: 'dpForFundAndIK',
                                propConst: 'fundmakerOfIK',
                                valueRef: {id: `wa_${this.props.initialValues.key.split('_')[1]}`}
                            }
                        }
                    ]
                }
            ],

            filterDPAnd: [
                {
                    dimConst: 'dpForFundAndIK',
                    concatType: "and",
                    conds: [
                        {
                            consts: 'orgIndustry,legalStatus'
                        }
                    ]
                }
            ]
        };
        await this.props.getCube('cubeForFundAndIK', JSON.stringify(filters), {customKey: 'cubeForFundAndIKSingle'})
            .then(async() => {
                const parsedCube = parseCube_new(
                    this.props.cubeForFundAndIKSingle['cube'],
                    [],
                    'dp',
                    'do',
                    this.props.cubeForFundAndIKSingle[`do_${doForFundAndIK.id}`],
                    this.props.cubeForFundAndIKSingle[`dp_${dpForFundAndIK.id}`],
                    `do_${doForFundAndIK.id}`,
                    `dp_${dpForFundAndIK.id}`).map(this.renderTableDataIk)[0];
                let dataOldProps =[]
                const data = new FormData();
                data.append('objId', String(parsedCube.key.split('_')[1]));
                data.append('propConsts', 'legalStatus,orgIndustry');
                data.append('allValues', String(1));

                await getValuesOfObjsWithProps2(data).then(async(res) => {
                    if (res.success === false && res.errors) {
                        for (let val of  res.errors) {
                            message.error(val.text)
                        }
                        return false
                    }
                    if (!!res.data && !!res.data.owner) {
                        let newarr = [...res.data.owner]
                        for (let val of newarr) {
                            let orgIndustry = !!res.data.orgIndustry && res.data.orgIndustry.filter(el => val.verOwn === el.verOwn && !!el.val)
                            if (!!orgIndustry) {
                                val.orgIndustry = orgIndustry
                            }
                            let legalStatus = !!res.data.legalStatus && res.data.legalStatus.find(el => val.verOwn === el.verOwn && !!el.val)
                            if (!!legalStatus) {
                                val.legalStatus = legalStatus
                            }
                        }
                        let data = newarr.length > 0 ? newarr[newarr.length - 1] : ""
                        if (!!data.legalStatus) {
                            if (data.legalStatus.dend === "3333-12-31") {
                                dataOldProps.push({
                                    idDataPropVal: String(data.legalStatus.idDataPropVal),
                                    dEnd: moment(value.dateReorganization.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
                                })
                            }
                        }

                        if (!!data.orgIndustry && data.orgIndustry.length>0) {
                            for (let val of data.orgIndustry) {
                                if (val.dend === "3333-12-31") {
                                    dataOldProps.push({
                                        idDataPropVal: String(val.idDataPropVal),
                                        dEnd: moment(value.dateReorganization.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
                                    })
                                }
                            }
                        }
                        if (dataOldProps.length !== 0) {

                            const fd2 = new FormData();
                            fd2.append('own',parsedCube.key.split('_')[1]);
                            fd2.append('cubeSConst', "cubeForFundAndIK")
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


                    } else {
                        message.info("Нет данных")
                    }

                }).catch(e => {
                    console.log(e)
                })


                const fd = new FormData();
                fd.append('obj', parsedCube.key.split('_')[1]);
                fd.append('dimObjsConst', "doForFundAndIK");
                fd.append('dbeg', value.dateReorganization.value.format('YYYY-MM-DD'));
                fd.append('dend', "3333-12-31");
                fd.append('name', JSON.stringify(this.props.initialValues.name))
                fd.append('fullName', JSON.stringify(this.props.initialValues.fullName))
                fd.append('cmtVer', JSON.stringify({}));
                fd.append('parent', null)

                await addObjVer(fd)
                    .then(async (res) => {
                        if (res.success === false && res.errors) {
                            for (let val of  res.errors) {
                                message.error(val.text)
                            }
                            return false
                        }
                    }).catch(e=>{
                        console.log(e)
                    })


                let objData={}
                const cIK = {
                    cube: {
                        cubeSConst: 'cubeForFundAndIK',
                        doConst: 'doForFundAndIK',
                        dpConst: 'dpForFundAndIK',
                        data: this.props.cubeForFundAndIKSingle
                    },
                    obj: {doItem:parsedCube.key}
                };

                const vIK = {
                    values: JSON.parse(JSON.stringify({
                        legalStatus:legalStatus,
                        orgIndustry,
                    })),
                };
                //console.log('vIK ', vIK);
                this.props.saveIKProps(cIK, vIK, this.props.tofiConstants, objData);
            }).catch(e=>{
                console.log(e)
            })
    }

    renderTableDataIk = (item, ids) => {
        const constArr = ['orgIndustry', 'legalStatus'];
        const result = {
            key: item.id,
            ids: ids + 1,
            name: item.name,
            fullName: item.fullName

        };
        parseForTable(item.props, this.props.tofiConstants, result, constArr);
        return result;
    }
    saveMultiText = (value, key, rest) => {
        const dataToSend = [];
        var mod = 'ins';
        if (!!value.idDataPropVal) {
            mod = 'upd'
        }
        ;
        dataToSend.push(
            {
                propConst: key,
                vals: [
                    {
                        idDataPropVal: value.idDataPropVal,
                        mode: mod,
                        dBeg: moment(rest.dateReorganization.value, "DD-MM-YYYY").format("YYYY-MM-DD"),
                        val: {
                            kz: value.valueLng.kz,
                            ru: value.valueLng.ru,
                            en: value.valueLng.en,
                        }
                    }
                ],
            },
        );
        if (dataToSend.length > 0) {
            let data = JSON.stringify(dataToSend);
            saveValueOfMultiText(this.props.initialValues.key.split('_')[1], data).then(res => {
                message.success(this.props.t("PROPS_SUCCESSFULLY_UPDATED"));
                //console.log(res)
            }).catch(err => {
                console.warn(err);
            })
        }
    }
    saveMultiText2 = (value, key, ) => {
        const dataToSend = [];
        var mod = 'ins';
        if (!!value.idDataPropVal) {
            mod = 'upd'
        }
        ;
        dataToSend.push(
            {
                propConst: key,
                vals: [
                    {
                        idDataPropVal: value.idDataPropVal,
                        mode: mod,
                        dBeg: value.dbeg,
                        dEnd: value.dend,
                        val: {
                            kz: !!value.valueLng.kz ? value.valueLng.kz : "",
                            ru: !!value.valueLng.ru ? value.valueLng.ru : "",
                            en: !!value.valueLng.en ? value.valueLng.en : ""
                        }
                    }
                ],
            },
        );
        if (dataToSend.length > 0) {
            let data = JSON.stringify(dataToSend);
            saveValueOfMultiText(this.props.initialValues.key.split('_')[1], data).then(res => {
                message.success(this.props.t("PROPS_SUCCESSFULLY_UPDATED"));
                //console.log(res)
            }).catch(err => {
                console.warn(err);
            })
        }
    }


    onChangeFile = (e, c, i) => {
        if (c === "newFileArr") {

            let newFileArr = [{
                value: e.target.files[0]
            }]
            this.setState({
                newFileArr: newFileArr,
                saveForm: true
            })
        }
        if (c === "structura") {

            let newFileArr = [{
                value: e.target.files[0]
            }]
            this.setState({
                newFileArrStructura: newFileArr,
                saveForm: true
            })
        }
        if (c === "func") {
            let newFileArr = [{
                value: e.target.files[0]
            }]
            this.setState({
                newFileArrFunc: newFileArr,
                saveForm: true
            })
        }

    }

    delFile = async (c) => {
        const res = await dFile(this.state.selectedRowKey[c].val.ru, "cubeForOrgFundmaker");
        if (!res.success) {
            //  on fail stop here with message;
            res.errors.forEach(err => {
                message.error(err.text);
            })
        } else {
            this.setState({
                showInputFiole: true
            })
            this.renderDataTable()
        }
    }
    reset = () => {
        this.props.reset()
        this.setState({
            newFileArr: "",
            newFileArrStructura: "",
            newFileArrFunc: "",
            saveForm: false
        })
    }

    render() {
        const formItemLayout = {
            labelCol: {span: 10},
            wrapperCol: {span: 14},
        };
        if (!this.props.tofiConstants) return null;
        const {lang, loading} = this.state;
        const lng = localStorage.getItem('i18nextLng');
        const {
            t, submitting, error, reset, handleSubmit, dirty, fundArchiveOptions, orgDocTypeOption, initialValues, orgIndustryOptions, orgRightReceiverOptions, legalStatusOptions,
            tofiConstants: {reasonFundmaker, orgIndustry, reasonFundmakerFile, legalStatus, orgFunction, structure, dateReorganization, structureFundmaker, orgRightReceiver, orgFunctionFundmaker, departmentalAccessory,}
        } = this.props;
        return (
            <div className="">
                <div className="table-header-btns" style={{marginTop: "1vw", marginLeft: '5px', marginRight: '5px'}}>
                    <Button onClick={this.adCoum} style={{marginRight: '5px'}}>{this.props.t('ADD')}</Button>
                    <Button onClick={this.editCoum}
                            disabled={this.state.selectedRowKey === ""}>{this.props.t('EDIT')}</Button>
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
                            render: (obj, record) => {
                                return !!obj && !!obj.val && obj.val
                            }
                        },
                        {
                            key: 'orgRightReceiver',
                            title: t('ORG_RIGHT_RECEIVER'),
                            dataIndex: 'orgRightReceiver',
                            width: '14%',
                            render: (obj, record) => {
                                return !!obj && !!obj.name && obj.name[lng]
                            }
                        },
                        {
                            key: 'reasonFundmaker',
                            title: reasonFundmaker.name[lng],
                            dataIndex: 'reasonFundmaker',
                            width: '14%',
                            render: (obj, record) => {
                                return !!obj && !!obj.val && obj.val[lng]
                            }
                        },
                        {
                            key: 'reasonFundmakerFile',
                            title: reasonFundmakerFile.name[lng],
                            dataIndex: 'reasonFundmakerFile',
                            width: '8%',
                            render: (obj, record) => {
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
                        },
                        {
                            key: 'orgIndustry',
                            title: orgIndustry.name[lng],
                            dataIndex: 'orgIndustry',
                            width: '6%',
                            render: (obj, record) => {
                                let arrName = []
                                if (!!obj) {
                                    for (let val of obj) {
                                        if (!!val.name) {
                                            arrName.push(val.name[lng])
                                        }
                                    }
                                }

                                return arrName.length > 0 ? arrName.join(",") : ""
                            }
                        },
                        {
                            key: 'legalStatus',
                            title: legalStatus.name[lng],
                            dataIndex: 'legalStatus',
                            width: '8%',
                            render: (obj, record) => {
                                return !!obj && !!obj.name && obj.name[lng]
                            }
                        },
                        {
                            key: 'structureFundmaker',
                            title: structureFundmaker.name[lng],
                            dataIndex: 'structureFundmaker',
                            width: '6%',
                            render: (obj, record) => {
                                let regex = /(<([^>]+)>)/ig
                                let text = !!obj && !!obj.val && obj.val[lng].replace(regex, " ");
                                if (!!text) {
                                    return text.replace("&nbsp;", " ");
                                }
                            }
                        }, {
                            key: 'structure',
                            title: structure.name[lng],
                            dataIndex: 'structure',
                            width: '6%',
                            render: (obj, record) => {
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
                        },
                        {
                            key: 'orgFunctionFundmaker',
                            title: orgFunctionFundmaker.name[lng],
                            dataIndex: 'orgFunctionFundmaker',
                            width: '6%',
                            render: (obj, record) => {
                                let regex = /(<([^>]+)>)/ig
                                let text = !!obj && !!obj.val && obj.val[lng].replace(regex, " ");
                                if (!!text) {
                                    return text.replace("&nbsp;", " ");
                                }


                            }
                        },
                        {
                            key: 'orgFunction',
                            title: orgFunction.name[lng],
                            dataIndex: 'orgFunction',
                            width: '6%',
                            render: (obj, record) => {
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
                        },
                        {
                            key: 'departmentalAccessory',
                            title: departmentalAccessory.name[lng],
                            dataIndex: 'departmentalAccessory',
                            width: '8%',
                            render: (obj, record) => {
                                return !!obj && !!obj.val && obj.val[lng]
                            }
                        },
                    ]}
                    hidePagination
                    dataSource={this.state.dataTable}
                    onRowClick={this.changeSelectedRow}
                    rowClassName={record => this.state.selectedRowKey.verOwn === record.verOwn ? 'row-selected' : ''}
                    bordered
                />
                {this.state.addForm === true ?
                    <Form className="antForm-spaceBetween" onSubmit={handleSubmit(this.onSubmit)}
                          style={dirty ? {paddingBottom: '43px'} : {}}>
                        <Field
                            name="dateReorganization"
                            component={renderDatePicker}
                            disabled={this.state.iditRename}
                            normalize={this.dateToRedux}
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
                            onMenuOpen={() => this.loadOptionsReceiver()}
                            isLoading={loading.orgRightReceiverLoading}
                        />
                        <Row>
                            <Col span={24}>
                                {reasonFundmaker && <Field
                                    name="reasonFundmaker"
                                    component={renderInput}
                                    placeholder={reasonFundmaker.name[lng]}
                                    normalize={(val, prevVal, obj, prevObj) => this.strToRedux(val, prevVal, obj, prevObj)}
                                    label={reasonFundmaker.name[lng]}
                                    formItemLayout={
                                        {
                                            labelCol: {span: 10},
                                            wrapperCol: {span: 14}
                                        }
                                    }
                                />}
                            </Col>

                        </Row>
                        <FormItem
                            {...formItemLayout}
                            label={"Основание (файл)"}
                        >
                            {!!this.state.showInputFiole ?
                                <label>
                                    <input
                                        type="file"
                                        style={{display: 'none'}}
                                        onChange={(e) => this.onChangeFile(e, "newFileArr")}/>
                                    <span className='ant-btn ant-btn-primary'><Icon
                                        type='upload'/>
                        <Badge className="badgeInputFile"
                               count={this.state.newFileArr && this.state.newFileArr.length}>
                    </Badge>
                        <span>{this.props.t('UPLOAD_FILE')}</span></span>
                                </label> :
                                <Icon type="delete"
                                      onClick={()=>this.delFile("reasonFundmakerFile")}
                                      style={{
                                          cursor: 'pointer',
                                          marginLeft: "10px",
                                          color: 'red'
                                      }}/>
                            }
                        </FormItem>

                        <Field
                            name="orgIndustry"
                            component={renderSelect}
                            normalize={this.selectMultiToRedux}
                            isMulti
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
                            validate={requiredArr}
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
                            onMenuOpen={this.loadOptions("legalStatus")}
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
                        </Row>
                        <FormItem
                            {...formItemLayout}
                            label={"Структура (файл)"}
                        >
                            {!!this.state.showInputFioleStrurtura ?
                                <label>
                                    <input
                                        type="file"
                                        style={{display: 'none'}}
                                        onChange={(e) => this.onChangeFile(e, "structura")}/>
                                    <span className='ant-btn ant-btn-primary'><Icon
                                        type='upload'/>
                        <Badge className="badgeInputFile"
                               count={this.state.newFileArrStructura && this.state.newFileArrStructura.length}>
                    </Badge>
                        <span>{this.props.t('UPLOAD_FILE')}</span></span>
                                </label> :
                                <Icon type="delete"
                                      onClick={()=>this.delFile("structure")}
                                      style={{
                                          cursor: 'pointer',
                                          marginLeft: "10px",
                                          color: 'red'
                                      }}/>
                            }
                        </FormItem>

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

                        </Row>
                        <FormItem
                            {...formItemLayout}
                            label={"Функции (файл)"}
                        >
                            {!!this.state.showInputFioleFunc ?
                                <label>
                                    <input
                                        type="file"
                                        style={{display: 'none'}}
                                        onChange={(e) => this.onChangeFile(e, "func")}/>
                                    <span className='ant-btn ant-btn-primary'><Icon
                                        type='upload'/>
                        <Badge className="badgeInputFile"
                               count={this.state.newFileArrFunc && this.state.newFileArrFunc.length}>
                    </Badge>
                        <span>{this.props.t('UPLOAD_FILE')}</span></span>
                                </label> :
                                <Icon type="delete"
                                      onClick={()=>this.delFile("orgFunction")}
                                      style={{
                                          cursor: 'pointer',
                                          marginLeft: "10px",
                                          color: 'red'
                                      }}/>
                            }
                        </FormItem>
                        <Field
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
                        />
                        {(!!this.state.saveForm || dirty) &&
                        <Form.Item style={{position: "inherit"}} className="ant-form-btns">
                            <Button className="signup-form__btn" type="primary" htmlType="submit"
                                    disabled={submitting}>
                                {submitting ? t('LOADING...') : t('SAVE')}
                            </Button>
                            <Button className="signup-form__btn" type="danger" htmlType="button"
                                    disabled={submitting}
                                    style={{marginLeft: '10px'}} onClick={this.reset}>
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
        cubeForFundAndIKSingle: state.cubes.cubeForFundAndIKSingle

    }
}, {getObjVer, getPropVal,getCube, getPropValWithChilds, getAllObjOfCls})(reduxForm({
    form: 'ReorganizationFoundMaker',
    enableReinitialize: true,
})(ReorganizationFoundMaker));