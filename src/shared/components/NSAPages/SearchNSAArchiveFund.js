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
    getCube,
    getValueOfMultiText,
    saveValueOfMultiText,
    getObjChildsByConst,
    getPropVal,
} from "../../actions/actions";
import {
    CUBE_FOR_AF_CASE,
    CUBE_FOR_AF_INV, CUBE_FOR_FUND_AND_IK,
    DO_FOR_CASE, DO_FOR_FUND_AND_IK,
    DO_FOR_INV,
    DP_FOR_CASE,
    DP_FOR_FUND_AND_IK, DT_FOR_FUND_AND_IK
} from "../../constants/tofiConstants";
import AntTable from "../AntTable";
import {onSaveCubeData, parseCube_new, parseForTable, parseForTableComplex} from "../../utils/cubeParser";
import axios from "axios";
import moment from 'moment';
import SearchNSACard from "./SearchNSACard";
import SearchNSA from "./SearchNSA";
import RadioGroup from "antd/es/radio/group";
import RadioButton from "antd/es/radio/radioButton";
import TextArea from "antd/es/input/TextArea";

const FormItem = Form.Item;

class SearchNSAArchiveFund extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            flaot: false,
            fundHistoricalNoteMulti: {
                kz: '',
                en: '',
                ru: ''
            },
            lang: {
                name: localStorage.getItem("i18nextLng"),
                fundHistoricalNoteMulti: localStorage.getItem("i18nextLng")
            },
            lange: localStorage.getItem('i18nextLng'),
            tableData:'',
            loading: {},
            multiTextDPV: '',
            tableLoader:false,
            record: {},
            fundList:'',
            sidebarActiveKey: 'archiveFund',
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

       getValueOfMultiText(String(this.props.initialValues.key.split('_')[1]), 'fundHistoricalNoteMulti').then(
           res => {
               !!res.data[0] && this.setState({
                   multiTextDPV: res.data[0].idDataPropVal,
                   fundHistoricalNoteMulti: {
                       kz: res.data[0].valueMultiStr.kz,
                       en: res.data[0].valueMultiStr.en,
                       ru: res.data[0].valueMultiStr.ru
                   },

               })
           }
       )
       if (this.props.record && !isEqual(this.props.record, this.state.record)) {
                 this.setState({ record: this.props.record });
       }
    }

    changeLang = e => {
        this.setState({
            fundHistoricalNoteMulti: {
                ...this.state.fundHistoricalNoteMulti,
                [this.state.lange]: e.target.value
            },
            dirty: true
        })
    };
    savefundHistoricalNoteMulti = () => {
        const dataToSend = [];
        var mod = 'ins';
        if (!!this.state.multiTextDPV) {
            mod = 'upd'
        }
        ;
        dataToSend.push(
            {
                propConst: 'fundHistoricalNoteMulti',
                vals: [
                    {
                        idDataPropVal: this.state.multiTextDPV,
                        mode: mod,
                        val: {
                            kz: this.state.fundHistoricalNoteMulti.kz,
                            ru: this.state.fundHistoricalNoteMulti.ru,
                            en: this.state.fundHistoricalNoteMulti.en,
                        }
                    }
                ],
            },
        );
        if (dataToSend.length > 0) {
            let data = JSON.stringify(dataToSend);
            saveValueOfMultiText(this.props.initialValues.key.split('_')[1], data, moment().format('YYYY-DD-MM')).then(res => {
                message.success(this.props.t("PROPS_SUCCESSFULLY_UPDATED"));
            }).catch(err => {
                console.warn(err);
            })
        }
    };

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
    componentWillReceiveProps(nextProps) {
        if (nextProps.record && !isEqual(nextProps.record, this.state.record)) {
            this.setState({record: nextProps.record});
        }
    }

    onSubmit = ({fundHistoricalNote, ...values}) => {
        if (!this.props.initialValues.key) {
        } else {
            const cube = {
                cubeSConst: CUBE_FOR_FUND_AND_IK,
                doConst: DO_FOR_FUND_AND_IK,
                dpConst: DP_FOR_FUND_AND_IK,
            };
            const objData = {};
            const props = pickBy(
                values,
                (val, key) => !isEqual(val, this.props.initialValues[key])
            );
            let val = {
                values: props,
                oFiles: {
                    fundHistoricalNote: fundHistoricalNote
                }
            }
            return this.saveProps(
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
    onChange = e => {
        this.setState({
            float: true,
            fundHistoricalNoteMulti: {
                ...this.state.fundHistoricalNoteMulti,
                [this.state.lange]: e.target.value
            },
            dirty: true
        })
    };
    onLangChange = e => {
        this.setState({lange: e.target.value})
    };
    saveProps = async (c, v, t = this.props.tofiConstants, objData, key) => {
        debugger;
        let hideLoading;
        try {
            if (!c.cube) c.cube = {
                cubeSConst: CUBE_FOR_FUND_AND_IK,
                doConst: DO_FOR_FUND_AND_IK,
                dpConst: DP_FOR_FUND_AND_IK,
            };
            if (!c.cube.data) c.cube.data = this.props.cubeForFundAndIK;
            c["obj"] = {
                doItem: key
            }
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
            this.savefundHistoricalNoteMulti()
            message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'));
            return resSave;
        }
        catch (e) {
            typeof hideLoading === 'function' && hideLoading();
            this.setState({loading: false});
            console.warn(e);
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
            invFound,
        } = this.props.tofiConstants;
        const {
            handleSubmit,
            reset,
            submitting,
            error,
            t,
            dirty,
            tofiConstants:
                {
                    invList
                },
        } = this.props;
        return (
            <div>
                <Form className="antForm-spaceBetween">
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
                </Form>
                <div className="work-description" style={{ marginLeft: '.5vw', marginRight: '.5vw'}}>
                    <TextArea placeholder="Description" autosize={{minRows: 2}}
                              value={this.state.fundHistoricalNoteMulti[this.state.lange]} onChange={this.onChange}
                              style={{marginTop: '10px'}}/>
                    <RadioGroup onChange={this.onLangChange} style={{marginTop: '0.5vw'}} defaultValue="ru" size="large">
                        <RadioButton value="kz">KZ</RadioButton>
                        <RadioButton value="ru">RU</RadioButton>
                        <RadioButton value="en">EN</RadioButton>
                    </RadioGroup>
                </div>
                <div style={{marginTop: '1vw', marginLeft: '1vw', marginRight: '1vw'}}>
                    <span>Перечень внутрифондового НСА</span>
                    <AntTable
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
                </div>
                <Form
                    className="antForm-spaceBetween"
                    style={dirty ? {paddingBottom: "43px"} : {}}
                    onSubmit={handleSubmit(this.onSubmit)}
                >
                    {fundHistoricalNote && (
                        <Field
                            name="fundHistoricalNote"
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
                    {lastChangeDateScheme && (
                        <Field
                            name="lastChangeDateScheme"
                            component={renderDatePicker}
                            format={null}
                            normalize={this.dateToRedux}
                            onTabClick={this.onSideBarTabClick}
                            label={lastChangeDateScheme.name[this.lng]}
                            formItemLayout={{
                                labelCol: {span: 10},
                                wrapperCol: {span: 14}
                            }}
                        />
                    )}
                    {(dirty || this.state.float) && (
                        <Form.Item className="ant-form-btns absolute-bottom">
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
                                    <i className="icon-error"/>
                                    {error}
                                </span>
                            )}
                        </Form.Item>
                    )}
                </Form>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        tofiConstants: state.generalData.tofiConstants,
        CubeForAF_Inv: state.cubes[CUBE_FOR_AF_INV],
        cubeForFundAndIK: state.cubes["cubeForFundAndIK"],
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