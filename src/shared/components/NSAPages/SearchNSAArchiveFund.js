import React from 'react';
import {Button, Form, Icon, Input, message} from 'antd';
import {
    renderSelect,
    renderInput,
    renderTextarea,
    renderDatePicker,
    renderFileUpload,
    renderFileUploadBtn,
    renderTextareaLang
} from "../../utils/form_components";

import {Field, formValueSelector, reduxForm} from "redux-form";
import {isEmpty, isEqual, map, pickBy, forOwn} from "lodash";
import connect from "react-redux/es/connect/connect";
import {
    createObj,
    getAllObjOfCls, getCasesCount,
    getCube,
    getObjByObjVal,
    getObjChildsByConst,
    getPropVal
} from "../../actions/actions";
import TextArea from 'antd/lib/input/TextArea';
import {
    CUBE_FOR_AF_CASE,
    CUBE_FOR_AF_INV,
    DO_FOR_CASE, DO_FOR_FUND_AND_IK,
    DO_FOR_INV,
    DP_FOR_CASE,
    DP_FOR_FUND_AND_IK, DT_FOR_FUND_AND_IK
} from "../../constants/tofiConstants";
import AntTable from "../AntTable";
import {parseCube_new, parseForTable, parseForTableComplex} from "../../utils/cubeParser";
import axios from "axios";
import moment from "../ArchiveFundPages/MainInfoInvForm";

const FormItem = Form.Item;

class SearchNSAArchiveFund extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            lang: {
                name: localStorage.getItem("i18nextLng"),
                foundHistoricalNoteMulti: localStorage.getItem("i18nextLng")
            },
            tableData:'',
            loading: {},
            tableLoader:false,
            record: {}
        }
    }


    componentDidMount() {
        this.buildComponent()
    }

    buildComponent=()=>{
        this.setState({
            tableLoader:true
        });
        var filters = {
            filterDOAnd: [
                {
                    dimConst: 'doForInv',
                    concatType: 'and',
                    conds: [
                        {
                            data: {
                                dimPropConst: 'dpForInv',
                                propConst: 'invFund',
                                valueRef: {id: this.props.initialValues.key}
                            }
                        }
                    ]
                }
            ],
            filterDPAnd: [
                {
                    dimConst: 'dpForInv',
                    concatType: "and",
                    conds: [
                        {
                            consts: "invFund,fundNumber"
                        }
                    ]
                }
            ],
        };

        const fd = new FormData();
        fd.append("cubeSConst", 'CubeForAF_Inv');
        fd.append("filters", JSON.stringify(filters));
        axios.post(`/${localStorage.getItem('i18nextLng')}/cube/getCubeData`, fd).then(res2 => {
            var cubeData = res2.data.data;
            var result = parseCube_new(
                cubeData.cube,
                [],
                'dp',
                'do',
                cubeData['do_' + this.props.tofiConstants.doForInv.id],
                cubeData['dp_' + this.props.tofiConstants.dpForInv.id],
                ['do_' + this.props.tofiConstants.doForInv.id],
                ['dp_' + this.props.tofiConstants.dpForInv.id]).map(this.renderTableData);

            this.setState({
                tableData:result,
                tableLoader:false
            })
        })
    }

    componentDidUpdate(prevProps){
        if(prevProps.initialValues.key!==this.props.initialValues.key){
            this.buildComponent()
        }
    }

    renderTableData = item => {
        const constArr = ['invFund','fundNumber'];
        const result = {
            key: item.id,
            name:item.name
        };
        parseForTable(item.props, this.props.tofiConstants, result, constArr);
        console.log(result);
        return result;

    };

    onChange(value, name) {
        this.setState({record: {...this.state.record, [name]: value}}, () => {
            this.props.onChange(name, value)
        })
    };

    changeLang = e => {
        this.setState({
            lang: {...this.state.lang, [e.target.name]: e.target.value}
        });
    };

    onSubmit = ({name, documentFile, ...values}) => {
        if (!this.props.initialValues.key) {
            return this.props.onCreateObj({
                ...pickBy(values, (val, key) => !isEqual(val, this.props.initialValues[key])),

                name: name,
                documentFile: documentFile,
                caseInventory: this.props.keyInv,
                caseWorkProp: this.props.keyWork.split("_")[1]
            });
        } else {
            const cube = {
                cubeSConst: CUBE_FOR_AF_CASE,
                doConst: DO_FOR_CASE,
                dpConst: DP_FOR_CASE,
            };
            const objData = {};
            const props = pickBy(
                values,
                (val, key) => !isEqual(val, this.props.initialValues[key])
            );
            if (name) {
                objData.name = name;
                objData.fullName = name;
            }
            let val = {
                values: props,
                oFiles: {
                    documentFile: documentFile
                }
            }
            return this.props.saveProps(
                {
                    cube,
                },
                val,
                this.props.tofiConstants,
                objData,
                this.props.initialValues.key
            );
        }
    };

    onCreateObj = ({name, accessLevel, ...values}) => {

        const cube = {
            cubeSConst: CUBE_FOR_AF_INV
        };

        const obj = {
            name: name,
            fullName: name,
            clsConst: 'invList',
            accessLevel
        };

        const hideCreateObj = message.loading(this.props.t('CREATING_NEW_OBJECT'), 0);
        return createObj(cube, obj)
            .then(res => {
                hideCreateObj();
                if (res.success) {
                    return this.onSaveCubeData(values, res.data.idItemDO, {})
                } else {
                    if (res.errors) {
                        res.errors.forEach(err => {
                            message.error(err.text)
                        })
                    }
                }
            }).catch(err => {
                console.error(err)
            })
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

    render() {
        if (!this.props.tofiConstants) return null;
        const {lang} = this.state;
        const lng = localStorage.getItem('i18nextLng');
        this.lng = localStorage.getItem("i18nextLng");
        const {
            fundHistoricalNote,
            fundHistoricalNoteMulti,
            lastChangeDateScheme,
            invFound
        } = this.props.tofiConstants;
        const {
            tofiConstants:
                {
                    invList
                },
            submitting,
            error,
            t,
            dirty
        } = this.props;

        console.log('fundHistoricalNoteMulti:', fundHistoricalNoteMulti);
        return (
                <Form
                    className="antForm-spaceBetween"
                    style={dirty ? {paddingBottom: "43px"} : {}}
                >
                    <FormItem
                        label={t('ARCHIVE_FUND_NAME')}
                        colon={false}
                    >
                        <Input
                            placeholder=""
                            disabled
                            value={this.state.record.fundList}
                        />
                    </FormItem>
                    {fundHistoricalNoteMulti && (
                        <Field
                            name="fundHistoricalNoteMulti"
                            component={renderTextareaLang}
                            format={value => (!!value ? value.valueLng[lang.fundHistoricalNoteMulti] : "")}
                            normalize={(val, prevVal, obj, prevObj) => {
                                let newVal = {...prevVal};
                                newVal.value = val;
                                if (!!newVal.valueLng) {
                                    newVal.valueLng[lang.fundHistoricalNoteMulti] = val;
                                } else {
                                    newVal["valueLng"] = {kz: "", en: "", ru: ""};
                                    newVal.valueLng[lang.fundHistoricalNoteMulti] = val;
                                }
                                return newVal;
                            }}
                            label={fundHistoricalNoteMulti.name[this.lng]}
                            formItemClass="with-lang"
                            changeLang={this.changeLang}
                            formItemLayout={{
                                labelCol: {span: 10},
                                wrapperCol: {span: 14}
                            }}
                        />
                    )}
                    {lastChangeDateScheme && (
                        <Field
                            name="lastChangeDateScheme"
                            component={renderDatePicker}
                            format={null}
                            value = {moment().format('DD-MM-YYYY')}
                            normalize={this.dateToRedux}
                            label={lastChangeDateScheme.name[this.lng]}
                            formItemLayout={{
                                labelCol: {span: 10},
                                wrapperCol: {span: 14}
                            }}
                        />
                    )}
                    {fundHistoricalNote && (
                        <Field
                            name="documentFile"
                            component={renderFileUploadBtn}
                            normalize={this.fileToRedux}
                            cubeSConst="CubeForAF_Case"
                            label={fundHistoricalNote.name[this.lng]}
                            formItemLayout={{
                                labelCol: {span: 10},
                                wrapperCol: {span: 14}
                            }}
                        />
                    )}
                    <span>Перечень внутрифондового НСА</span>
                    <AntTable
                        style={{margin: '0.5vw'}}
                        loading={this.state.tableLoader}
                        dataSource={this.state.tableData}
                        columns={
                            [
                                {
                                    key: 'fundNumber',
                                    title: t('fundNumber'),
                                    dataIndex: 'fundNumber',
                                    width: '7%',
                                    render: obj => obj && obj.value,
                                },
                                {
                                    key: 'name',
                                    title: invList.name[lng],
                                    dataIndex: 'name',
                                    width: '25%',
                                    render: obj => obj && obj[this.lng]
                                },
                            ]
                        }
                    />
                    {dirty && (
                        <Form.Item className="ant-form-btns absolute-bottom">
                            <Button
                                className="signup-form__btn"
                                type="primary"
                                htmlType="submit"
                                disabled={submitting}
                            >
                                {submitting ? t("LOADING...") : t("SAVE")}
                            </Button>
                            {error && (
                                <span className="message-error">
                    <i className="icon-error"/>
                                    {error}
                  </span>
                            )}
                        </Form.Item>
                    )}
                </Form>
        )
    }
}

function mapStateToProps(state) {
    return {
        tofiConstants: state.generalData.tofiConstants,
        CubeForAF_Inv: state.cubes[CUBE_FOR_AF_INV],
        accessLevelOptions: state.generalData.accessLevel,
        invTypeOptions: state.generalData.invType,
        documentTypeOptions: state.generalData.documentType,
    }
}

export default connect(mapStateToProps, {getPropVal, getCube, getObjChildsByConst}
)(
    reduxForm({
        form: "SearchNSAArchiveFund",
        enableReinitialize: true
    })(SearchNSAArchiveFund)
);