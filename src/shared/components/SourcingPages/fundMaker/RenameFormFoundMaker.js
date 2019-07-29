import React from 'react';
import {Button, Form, DatePicker, message, Modal, Input, Badge, Icon} from "antd";
import {isEmpty, isEqual, pickBy} from "lodash";
import AntTable from "../../AntTable";
import {Field, formValueSelector, reduxForm} from "redux-form";
import {
    addObjVer, dFile, getFile,getCube, getFileResolve, getObjVer, getObjVer_new,
    getValuesOfObjsWithProps2, updObjVer
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
import axios from "axios"
import Col from "antd/es/grid/col";
import Row from "antd/es/grid/row";
import {parseCube_new, parseForTable} from "../../../utils/cubeParser";

const FormItem = Form.Item;


class RenameFormFoundMaker extends React.PureComponent {

    state = {
        selectedRowKey: '',
        dataTable: [],
        dataTable2: [],
        newFileArr: "",
        dataIk:{},
        dataTableName:[],
        modalOpen: false,
        lang: {
            name: localStorage.getItem("i18nextLng"),
            shortNameValue: localStorage.getItem("i18nextLng"),
            shortName: localStorage.getItem("i18nextLng"),

        },
        addForm: false,
        showInputFiole: true,
        iditRename: false,
        saveForm: false

    }

    changeLang = e => {
        this.setState({
            lang: {...this.state.lang, [e.target.name]: e.target.value}
        });
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

    checkboxToRedux2 = (val, prevVal) => {
        let newVal = {...prevVal};
        const {caseInsuranceTrue, caseInsuranceFalce} = this.props.tofiConstants
        if (prevVal === null) {
            let objVal = {}
            if (val === true) {
                objVal = {
                    value: Number(caseInsuranceTrue.id),
                    kFromBase: val

                }
            } else {
                objVal = {
                    value: Number(caseInsuranceFalce.id),
                    kFromBase: val
                }
            }

            return (objVal)
        } else {
            if (val === true) {
                newVal.value = Number(caseInsuranceTrue.id)
                newVal.kFromBase = val
            } else {
                newVal.value = Number(caseInsuranceFalce.id)
                newVal.kFromBase = val
            }


            return (newVal)

        }
    }

    checkboxToRedux3 = (val, prevVal) => {
        let newVal = {...prevVal};
        const {caseFundOfUseTrue, caseFundOfUseFalce} = this.props.tofiConstants
        if (prevVal === null) {
            let objVal = {}
            if (val === true) {
                objVal = {
                    value: Number(caseFundOfUseTrue.id),
                    kFromBase: val

                }
            } else {
                objVal = {
                    value: Number(caseFundOfUseFalce.id),
                    kFromBase: val
                }
            }

            return (objVal)
        } else {
            if (val === true) {
                newVal.value = Number(caseFundOfUseTrue.id)
                newVal.kFromBase = val
            } else {
                newVal.value = Number(caseFundOfUseFalce.id)
                newVal.kFromBase = val
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

    adCoum = () => {
        this.props.resetinitialValues("")
        this.setState({
            newFileArr: "",
            iditRename: false,
            showInputFiole: true


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
        this.setState({
            newFileArr: "",
        })
        let mewinitialValues = {}
        if (!!selectedRowKey.dateRename) {
            mewinitialValues.dateRename = {
                dbeg: selectedRowKey.dateRename.dbeg,
                dend: selectedRowKey.dateRename.dend,
                idDataPropVal: selectedRowKey.dateRename.idDataPropVal,
                value: moment(selectedRowKey.dateRename.val, "YYYY-MM-DD")
            }
        }

        if (!!selectedRowKey.reasonFundmaker) {
            mewinitialValues.reasonFundmaker = {
                dbeg: selectedRowKey.reasonFundmaker.dbeg,
                dend: selectedRowKey.reasonFundmaker.dend,
                idDataPropVal: selectedRowKey.reasonFundmaker.idDataPropVal,
                value: selectedRowKey.reasonFundmaker.val.ru
            }
        }
        if (!!selectedRowKey.reasonFundmakerFile) {
            mewinitialValues.reasonFundmakerFile = selectedRowKey.reasonFundmakerFile
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
        mewinitialValues.conditionOfFundmaker = selectedRowKey.conditionOfFundmaker.filter(el => !!el.name && el.name.ru === "Переименование")
        mewinitialValues.name = selectedRowKey.fullName
        mewinitialValues.shortName = selectedRowKey.name
        mewinitialValues.key = this.props.initialValues.key
        mewinitialValues.dbeg = selectedRowKey.dbeg
        mewinitialValues.dend = selectedRowKey.dend
        mewinitialValues.verOwn = selectedRowKey.verOwn
        this.props.resetinitialValues(mewinitialValues)
        this.setState({
            addForm: true,
            iditRename: true,

        })
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

    componentDidMount() {
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

        this.renderDataTable()
        this.renderDataTable2()

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
                let oneNamw = newarr[0]
                oneNamw.number =1
                let rezulArr2 = [oneNamw]
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
                    dataTable: rezulArr,
                    dataTableName:rezulArr2
                })
            } else {
                message.info("Нет данных")
            }

        }).catch(e => {
            console.log(e)
        })
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
    editRename = (values) => {
        const hideLoading = message.loading(this.props.t('UPDATING_VERSION'), 0);
        const reasonFundmakerFile = this.state.newFileArr
        if (!!reasonFundmakerFile) {
            for (let val of reasonFundmakerFile) {

                val.value.dBeg = values.dateRename.value.format('YYYY-MM-DD')
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
        values.dateRename.dbeg = values.dateRename.value.format('YYYY-MM-DD')
        values.conditionOfFundmaker[0].dbeg = values.dateRename.value.format('YYYY-MM-DD')
        values.conditionOfFundmaker[0].value = values.conditionOfFundmaker[0].val

        rest.dateRename = values.dateRename
        rest.conditionOfFundmaker = values.conditionOfFundmaker
        if (!!values.reasonFundmaker ) {
            if (!!values.reasonFundmaker.idDataPropVal) {
                values.reasonFundmaker.dbeg = values.dateRename.value.format('YYYY-MM-DD')
                rest.reasonFundmaker = values.reasonFundmaker
            } else {
                values.reasonFundmaker.dbeg = values.dateRename.value.format('YYYY-MM-DD')
                values.reasonFundmaker.dend = values.dend
                rest.reasonFundmaker = values.reasonFundmaker
            }
        }
        obj.doItem = this.props.initialValues.key;
        const objData = {};
        const fd = new FormData();
        fd.append('objVerId', String(values.verOwn));
        fd.append('dimObjsConst', "doForOrgFundmakers");
        fd.append('dbeg', values.dateRename.value.format('YYYY-MM-DD'));
        fd.append('dend', values.dend);
        fd.append('name', JSON.stringify(values.shortName));
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
                        {values: rest, idDPV: this.props.withIdDPV, oFiles: {reasonFundmakerFile}},
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
        let oldpropsRename = this.state.dataTable.length > 0 ? this.state.dataTable[this.state.dataTable.length - 1] : ""
        let dataTableRegin = this.state.dataTable2.length > 0 ? this.state.dataTable2[this.state.dataTable2.length - 1] : ""
        if (!!oldpropsRename && !!oldpropsRename.dateRename) {
            if (oldpropsRename.dateRename.dend === "3333-12-31") {
                dataOldProps.push({
                    idDataPropVal: String(oldpropsRename.dateRename.idDataPropVal),
                    dEnd: moment(rest.dateRename.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
                })
            }
        }
        if (!!dataTableRegin && !!dataTableRegin.dateReorganization) {
            if (dataTableRegin.dateReorganization.dend === "3333-12-31") {
                dataOldProps.push({
                    idDataPropVal: String(dataTableRegin.dateReorganization.idDataPropVal),
                    dEnd: moment(rest.dateRename.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
                })
            }
        }
        if (!!oldProps.orgRightReceiver) {
            if (oldProps.orgRightReceiver.dend === "3333-12-31") {
                dataOldProps.push({
                    idDataPropVal: String(oldProps.orgRightReceiver.idDataPropVal),
                    dEnd: moment(rest.dateRename.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
                })
            }
            if (!!dataTableRegin) {
                if (!!dataTableRegin.orgRightReceiver) {
                    if (dataTableRegin.orgRightReceiver.dend === "3333-12-31") {
                        dataOldProps.push({
                            idDataPropVal: String(dataTableRegin.orgRightReceiver.idDataPropVal),
                            dEnd: moment(rest.dateRename.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
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
                        dEnd: moment(rest.dateRename.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
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
                            dEnd: moment(rest.dateRename.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
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
                        dEnd: moment(rest.dateRename.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
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
                        dEnd: moment(rest.dateRename.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
                    })
                }
            }
        }
        if (!!oldProps.legalStatus) {
            if (oldProps.legalStatus.dend === "3333-12-31") {
                dataOldProps.push({
                    idDataPropVal: String(oldProps.legalStatus.idDataPropVal),
                    dEnd: moment(rest.dateRename.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
                })
            }
            if (!!dataTableRegin) {
                if (!!dataTableRegin.legalStatus) {
                    if (dataTableRegin.legalStatus.dend === "3333-12-31") {
                        dataOldProps.push({
                            idDataPropVal: String(dataTableRegin.legalStatus.idDataPropVal),
                            dEnd: moment(rest.dateRename.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
                        })
                    }
                }
            }
        }
        if (!!oldProps.structureFundmaker) {
            if (oldProps.structureFundmaker.dend === "3333-12-31") {
                dataOldProps.push({
                    idDataPropVal: String(oldProps.structureFundmaker.idDataPropVal),
                    dEnd: moment(rest.dateRename.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
                })
            }
            if (!!dataTableRegin) {
                if (!!dataTableRegin.structureFundmaker) {
                    if (dataTableRegin.structureFundmaker.dend === "3333-12-31") {
                        dataOldProps.push({
                            idDataPropVal: String(dataTableRegin.structureFundmaker.idDataPropVal),
                            dEnd: moment(rest.dateRename.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
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
                        dEnd: moment(rest.dateRename.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
                    })
                }
            }
        }
        if (!!dataTableRegin) {
            if (!!dataTableRegin.structure) {
                if (dataTableRegin.structure.dend === "3333-12-31") {
                    dataOldProps.push({
                        idDataPropVal: String(dataTableRegin.structure.idDataPropVal),
                        dEnd: moment(rest.dateRename.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
                    })
                }
            }
        }
        if (!!oldProps.orgFunction) {
            for (let val of oldProps.orgFunction) {
                if (val.dend === "3333-12-31") {
                    dataOldProps.push({
                        idDataPropVal: String(val.idDataPropVal),
                        dEnd: moment(rest.dateRename.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
                    })
                }
            }
        }

        if (!!dataTableRegin) {
            if (!!dataTableRegin.orgFunction) {
                if (dataTableRegin.orgFunction.dend === "3333-12-31") {
                    dataOldProps.push({
                        idDataPropVal: String(dataTableRegin.orgFunction.idDataPropVal),
                        dEnd: moment(rest.dateRename.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
                    })
                }
            }
        }

        if (!!oldProps.departmentalAccessory) {
            if (oldProps.departmentalAccessory.dend === "3333-12-31") {
                dataOldProps.push({
                    idDataPropVal: String(oldProps.departmentalAccessory.idDataPropVal),
                    dEnd: moment(rest.dateRename.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
                })
            }

            if (!!dataTableRegin) {
                if (!!dataTableRegin.departmentalAccessory) {
                    if (dataTableRegin.departmentalAccessory.dend === "3333-12-31") {
                        dataOldProps.push({
                            idDataPropVal: String(dataTableRegin.departmentalAccessory.idDataPropVal),
                            dEnd: moment(rest.dateRename.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
                        })
                    }
                }
            }
        }
        if (!!oldProps.orgFunctionFundmaker) {
            if (oldProps.orgFunctionFundmaker.dend === "3333-12-31") {
                dataOldProps.push({
                    idDataPropVal: String(oldProps.orgFunctionFundmaker.idDataPropVal),
                    dEnd: moment(rest.dateRename.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
                })
            }

            if (!!dataTableRegin) {
                if (!!dataTableRegin.orgFunctionFundmaker) {
                    if (dataTableRegin.orgFunctionFundmaker.dend === "3333-12-31") {
                        dataOldProps.push({
                            idDataPropVal: String(dataTableRegin.orgFunctionFundmaker.idDataPropVal),
                            dEnd: moment(rest.dateRename.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
                        })
                    }
                }
            }
        }
        if (!!oldProps.reasonFundmaker) {
            if (oldProps.reasonFundmaker.dend === "3333-12-31") {
                dataOldProps.push({
                    idDataPropVal: String(oldProps.reasonFundmaker.idDataPropVal),
                    dEnd: moment(rest.dateRename.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
                })
            }
            if (!!oldpropsRename) {
                if (!!oldpropsRename.reasonFundmaker) {
                    if (oldpropsRename.reasonFundmaker.dend === "3333-12-31") {
                        dataOldProps.push({
                            idDataPropVal: String(oldpropsRename.reasonFundmaker.idDataPropVal),
                            dEnd: moment(rest.dateRename.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
                        })
                    }
                }
            }
            if (!!dataTableRegin) {
                if (!!dataTableRegin.reasonFundmaker) {
                    if (dataTableRegin.reasonFundmaker.dend === "3333-12-31") {
                        dataOldProps.push({
                            idDataPropVal: String(dataTableRegin.reasonFundmaker.idDataPropVal),
                            dEnd: moment(rest.dateRename.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
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
                        dEnd: moment(rest.dateRename.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
                    })
                }
            }
        }

        if (!!oldpropsRename) {
            if (!!oldpropsRename.reasonFundmakerFile) {
                if (oldpropsRename.reasonFundmakerFile.dend === "3333-12-31") {
                    dataOldProps.push({
                        idDataPropVal: String(oldpropsRename.reasonFundmakerFile.idDataPropVal),
                        dEnd: moment(rest.dateRename.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
                    })
                }
            }
        }
        if (!!dataTableRegin) {
            if (!!dataTableRegin.reasonFundmakerFile) {
                if (dataTableRegin.reasonFundmakerFile.dend === "3333-12-31") {
                    dataOldProps.push({
                        idDataPropVal: String(dataTableRegin.reasonFundmakerFile.idDataPropVal),
                        dEnd: moment(rest.dateRename.value, "DD-MM-YYYY").add(-1, 'days').format("YYYY-MM-DD")
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
            .then(() => {
                const parsedCube = parseCube_new(
                    this.props.cubeForFundAndIKSingle['cube'],
                    [],
                    'dp',
                    'do',
                    this.props.cubeForFundAndIKSingle[`do_${doForFundAndIK.id}`],
                    this.props.cubeForFundAndIKSingle[`dp_${dpForFundAndIK.id}`],
                    `do_${doForFundAndIK.id}`,
                    `dp_${dpForFundAndIK.id}`).map(this.renderTableDataIk)[0];
                    this.setState({
                        dataIk:parsedCube
                    })
            }).catch(e=>{
                console.log(e)
            })
        if (this.state.iditRename === true) {
            this.editRename(values)
        } else {
            const reasonFundmakerFile = this.state.newFileArr
            const {name, shortName, ...rest} = pickBy(values, (val, key) => !isEqual(val, this.props.initialValues[key]));

            await this.closeProps(rest)
            if (!!reasonFundmakerFile) {
                for (let val of reasonFundmakerFile) {
                    val.value.dBeg = moment(rest.dateRename.value, "DD-MM-YYYY").format("YYYY-MM-DD")
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
                rest.reasonFundmaker.dbeg = moment(rest.dateRename.value, "DD-MM-YYYY").format("YYYY-MM-DD")
            }
            if (!!rest.dateRename) {
                rest.dateRename.dbeg = moment(rest.dateRename.value, "DD-MM-YYYY").format("YYYY-MM-DD");
            }
            rest.conditionOfFundmaker = [{
                value: this.props.tofiConstants["renaming"].id,
                dbeg: moment(rest.dateRename.value, "DD-MM-YYYY").format("YYYY-MM-DD"),
                dend: "3333-12-31"
            }]
            const fd = new FormData();
            fd.append('obj', this.props.initialValues.key.split('_')[1]);
            fd.append('dimObjsConst', "doForOrgFundmakers");
            fd.append('dbeg', rest.dateRename.value.format('YYYY-MM-DD'));
            fd.append('dend', "3333-12-31");
            fd.append('name', JSON.stringify(shortName));
            fd.append('fullName', JSON.stringify(name));
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
                    this.props.saveProps3(
                        {cube, obj},
                        {values: rest, idDPV: this.props.withIdDPV, oFiles: {reasonFundmakerFile}},
                        this.props.tofiConstants,
                        objData
                    );
                    this.setState({
                        newFileArr: "",
                    })

                }).catch(e => {
                console.log(e)
            })

            const fd2 = new FormData();
            fd2.append('obj',this.state.dataIk.key.split('_')[1]);
            fd2.append('dimObjsConst', "doForFundAndIK");
            fd2.append('dbeg', rest.dateRename.value.format('YYYY-MM-DD'));
            fd2.append('dend', "3333-12-31");
            fd2.append('name', JSON.stringify(shortName));
            fd2.append('fullName', JSON.stringify(name));
            fd2.append('cmtVer', JSON.stringify({}));
            fd2.append('parent', null)

            await addObjVer(fd2)
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



        }

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
    onChangeFile = (e, c, i) => {
        let newFileArr = [{
            value: e.target.files[0]
        }]
        this.setState({
            newFileArr: newFileArr,
            saveForm: true
        })

    }
    delFile = async () => {
        const res = await dFile(this.state.selectedRowKey.reasonFundmakerFile.val.ru, "cubeForOrgFundmaker");
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
            saveForm: false
        })
    }
    shortNameValue = {...this.props.initialValues.shortName} || {kz: '', ru: '', en: ''};
    nameValue = {...this.props.initialValues.name} || {kz: '', ru: '', en: ''};

    render() {
        if (!this.props.tofiConstants) return null;
        const formItemLayout = {
            labelCol: {span: 10},
            wrapperCol: {span: 14},
        };
        const {lang,} = this.state;
        const lng = localStorage.getItem('i18nextLng');
        const {
            t, tofiConstants: {dateRename, reasonFundmaker, reasonFundmakerFile}
        } = this.props;
        const {submitting, error, reset, handleSubmit, dirty, tofiConstants, fundArchiveOptions, orgDocTypeOption, initialValues} = this.props;
        return (
            <div className="">
                <div className="table-header-btns" style={{marginTop: "1vw", marginLeft: '5px', marginRight: '5px'}}>
                    <Button onClick={this.adCoum}>{this.props.t('ADD')}</Button>
                    <Button onClick={this.editCoum}
                            disabled={this.state.selectedRowKey === ""}>{this.props.t('RENAME')}</Button>

                </div>
                <h4 style={{marginTop:"10px"}}>{t("ONENEMEFUNMARKER")}</h4>
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
                            key: 'fullName',
                            title: t('NAME'),
                            dataIndex: 'fullName',
                            width: '15%',
                            render: (obj, record) => {
                                return !!obj && obj[lng]
                            }
                        },
                        {
                            key: 'name',
                            title: t('SHORT_NAME'),
                            dataIndex: 'name',
                            width: '15%',
                            render: (obj, record) => {
                                return !!obj && obj[lng]
                            }
                        },
                        {
                            key: 'reasonFundmaker',
                            title: reasonFundmaker.name[lng],
                            dataIndex: 'reasonFundmaker',
                            width: '15%',
                            render: (obj, record) => {
                                return !!obj && !!obj.val && obj.val[lng]

                            }
                        },
                        {
                            key: 'reasonFundmakerFile',
                            title: reasonFundmakerFile.name[lng],
                            dataIndex: 'reasonFundmakerFile',
                            width: '15%',
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
                        }
                    ]}
                    hidePagination
                    dataSource={this.state.dataTableName}
                    bordered

                />


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
                            render: (obj, record) => {
                                return !!obj && !!obj.val && obj.val
                            }
                        }, {
                            key: 'fullName',
                            title: t('NAME'),
                            dataIndex: 'fullName',
                            width: '15%',
                            render: (obj, record) => {
                                return !!obj && obj[lng]
                            }
                        },
                        {
                            key: 'name',
                            title: t('SHORT_NAME'),
                            dataIndex: 'name',
                            width: '15%',
                            render: (obj, record) => {
                                return !!obj && obj[lng]
                            }
                        },
                        {
                            key: 'reasonFundmaker',
                            title: reasonFundmaker.name[lng],
                            dataIndex: 'reasonFundmaker',
                            width: '15%',
                            render: (obj, record) => {
                                return !!obj && !!obj.val && obj.val[lng]

                            }
                        },
                        {
                            key: 'reasonFundmakerFile',
                            title: reasonFundmakerFile.name[lng],
                            dataIndex: 'reasonFundmakerFile',
                            width: '15%',
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
                            disabled={this.state.iditRename}
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

                        <FormItem
                            {...formItemLayout}
                            label={"Основание (файл)"}
                        >
                            {!!this.state.showInputFiole ?
                                <label>
                                    <input
                                        type="file"
                                        style={{display: 'none'}}
                                        onChange={(e) => this.onChangeFile(e, "file3")}/>
                                    <span className='ant-btn ant-btn-primary'><Icon
                                        type='upload'/>
                        <Badge className="badgeInputFile"
                               count={this.state.newFileArr && this.state.newFileArr.length}>
                    </Badge>
                        <span>{this.props.t('UPLOAD_FILE')}</span></span>
                                </label> :
                                <Icon type="delete"
                                      onClick={this.delFile}
                                      style={{
                                          cursor: 'pointer',
                                          marginLeft: "10px",
                                          color: 'red'
                                      }}/>
                            }
                        </FormItem>

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
        cubeForFundAndIKSingle: state.cubes.cubeForFundAndIKSingle

    }
}, {getObjVer,getCube})(reduxForm({
    form: 'RenameFormFoundMaker',
    enableReinitialize: true,
})(RenameFormFoundMaker));