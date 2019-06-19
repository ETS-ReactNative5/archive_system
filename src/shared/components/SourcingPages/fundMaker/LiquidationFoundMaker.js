import React from 'react';
import {Button, Form, message} from "antd";
import {Field, formValueSelector, reduxForm} from 'redux-form';
import {requiredArr, requiredLabel, requiredLng} from "../../../utils/form_validations";
import {
    renderDatePicker, renderFileUploadBtn, renderInput, renderInputLang, renderSelect, renderTextareaLang
} from '../../../utils/form_components';
import {
    FORM_OF_ADMISSION,
    FUND_MAKER_ARCHIVE,
    IS_ACTIVE,
    LEGAL_STATUS, ORG_DOC_TYPE,
    ORG_INDUSTRY
} from "../../../constants/tofiConstants";
import {connect} from "react-redux";
import {
    getAccessLevels,
    getCube,
    getObjChildsByConst,
    getPropVal,
    getPropValWithChilds
} from "../../../actions/actions";
import {isEqual, pickBy} from "lodash";
import moment from "./MainInfoFundMaker";
import {parseCube_new} from "../../../utils/cubeParser";
import Col from "antd/es/grid/col";
import Row from "antd/es/grid/row";


class LiquidationFoundMaker extends React.PureComponent {
    constructor(props) {
        super(props);

        const lng = localStorage.getItem('i18nextLng');
        this.state = {
            lang: {
                shortName: lng,
                name: lng,
                reasonFundmaker: lng,
            },
            loading: {
                legalStatusLoading: false,
                formOfAdmissionLoading: false,
                orgIndustryLoading: false,
                isActiveLoading: false,
                fundmakerArchiveLoading: false,
                orgDocTypeLoading: false,
                objSubordinationLoading: false
            },
            optionMultiSelect: []
        };
    }

    componentDidMount() {
        if (!this.props.accessLevelOptions) {
            this.props.getAccessLevels();
        }
        if (!this.props.orgIndustryOptions) {
            this.props.getPropValWithChilds('orgIndustry')
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.initialValues !== this.props.initialValues) {
            this.fundNumber = {...this.props.initialValues.fundNumber} || '';
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
            this.reasonFundmakerValue = {...this.props.initialValues.reasonFundmaker} || {
                kz: '',
                ru: '',
                en: ''
            };
        }
    }

        reasonFundmakerValue = {...this.props.initialValues.reasonFundmaker} || {
            kz: '',
            ru: '',
            en: ''
        };


    onSubmit = values => {
        const {doForFundAndIK, dpForFundAndIK} = this.props.tofiConstants;
        const {shortName,dateFormation, name, accessLevel, orgFunction, structure, ...rest} = pickBy(values, (val, key) => !isEqual(val, this.props.initialValues[key]));
        const cube = {
            cubeSConst: 'cubeForOrgFundmaker',
            doConst: 'doForOrgFundmakers',
            dpConst: 'dpForOrgFundmakers',
        };
        const obj = {
            name: shortName,
            fullName: name,
            clsConst: 'fundmakerOrg',
            accessLevel: String(values.accessLevel.value)
        };
        if (!this.props.initialValues.key) {
            return this.props.onCreateObj(
                {cube, obj},
                {values: rest, idDPV: this.props.withIdDPV, oFiles: {orgFunction, structure}},
            )
        }
        obj.doItem = this.props.initialValues.key;
        const objData = {};
        if (shortName) objData.name = shortName;
        if (name) objData.fullName = name;
        if (accessLevel) objData.accessLevel = accessLevel;
        // Сохраняем значения свойств fundNumber, fundmakerArchive (fundArchive для ИК), formOfAdmission, legalStatus, isActive для соответстующего источника комплектования, если хотя бы одно изменилось.
        if (shortName || name || accessLevel || rest.fundNumber || rest.fundmakerArchive || rest.formOfAdmission || rest.legalStatus || rest.isActive || rest.orgIndustry) {
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
                                    valueRef: {id: `wa_${obj.doItem.split('_')[1]}`}
                                }
                            }
                        ]
                    }
                ],
                filterDTOr: [
                    {
                        dimConst: 'dtForFundAndIK',
                        concatType: 'and',
                        conds: [
                            {
                                ids: moment().startOf('year').format('YYYYMMDD') + moment().endOf('year').format('YYYYMMDD')
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
                                consts: 'fundNumber,fundmakerOfIK,fundArchive,formOfAdmission,legalStatus,isActive,orgIndustry'
                            }
                        ]
                    }
                ]
            };
            this.props.getCube('cubeForFundAndIK', JSON.stringify(filters), {customKey: 'cubeForFundAndIKSingle'})
                .then(() => {
                    const constArr = ['fundNumber', 'fundmakerOfIK', 'fundArchive', 'formOfAdmission', 'legalStatus', 'isActive', 'orgIndustry'];
                    const parsedCube = parseCube_new(
                        this.props.cubeForFundAndIKSingle['cube'],
                        [],
                        'dp',
                        'do',
                        this.props.cubeForFundAndIKSingle[`do_${doForFundAndIK.id}`],
                        this.props.cubeForFundAndIKSingle[`dp_${dpForFundAndIK.id}`],
                        `do_${doForFundAndIK.id}`,
                        `dp_${dpForFundAndIK.id}`)[0];


                    const cIK = {
                        cube: {
                            cubeSConst: 'cubeForFundAndIK',
                            doConst: 'doForFundAndIK',
                            dpConst: 'dpForFundAndIK',
                            data: this.props.cubeForFundAndIKSingle
                        },
                        obj: {doItem: parsedCube.id}
                    };
                    const {fundNumber, fundmakerArchive, formOfAdmission, legalStatus, isActive, orgIndustry} = rest;
                    const fundArchive = fundmakerArchive;
                    const vIK = {
                        values: JSON.parse(JSON.stringify({
                            fundNumber: {
                                value: rest.fundNumber && rest.fundNumber.value,
                                propConst: "fundNumber",
                                idDataPropVal: parsedCube.props.find(el => el.prop == this.props.tofiConstants['fundNumber'].id) && parsedCube.props.find(el => el.prop == this.props.tofiConstants['fundNumber'].id).values.idDataPropVal
                            },
                            fundArchive,
                            formOfAdmission,
                            legalStatus,
                            isActive,
                            orgIndustry,
                            fundmakerOfIK: {
                                value: obj.doItem.split('_')[1], dbeg: "1800-01-01",
                                propConst: "fundmakerOfIK",
                                isUniq: 1,
                                periodDepend: 2,
                                dend: "3333-12-31",
                                idDataPropVal: parsedCube.props.find(el => el.prop == this.props.tofiConstants['fundmakerOfIK'].id) && parsedCube.props.find(el => el.prop == this.props.tofiConstants['fundmakerOfIK'].id).values.idDataPropVal
                            }
                        })),
                    };
                    this.props.saveIKProps(cIK, vIK, this.props.tofiConstants, objData);
                });
        }
        return this.props.saveProps(
            {cube, obj},
            {values: rest, idDPV: this.props.withIdDPV, oFiles: {orgFunction, structure}},
            this.props.tofiConstants,
            objData
        );
    };


    changeLang = e => {
        this.setState({lang: {...this.state.lang, [e.target.name]: e.target.value}});
    };


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

    render(){
        if (!this.props.tofiConstants) return null;
        const lng = localStorage.getItem('i18nextLng');
        const {t,handleSubmit, reset, dirty, error, submitting, orgIndustryOptions, legalStatusOptions,
            tofiConstants: {departmentalAccessory, structure, orgFunction, shortName, dateRename, orgIndustry, legalStatus, orgFunctionFundmaker, dateElimination, reasonFundmaker}
        } = this.props;
        const {lang, loading} = this.state;




        return(
            <div className="FundMaker">
                <Form className="antForm-spaceBetween" onSubmit={handleSubmit(this.onSubmit)}
                      style={dirty ? {paddingBottom: '43px'} : {}}>
                    <Field
                        name="dateElimination"
                        component={renderDatePicker}
                        disabledDate={this.disabledStartDate}
                        format={null}
                        label={t('DATE_ELIMINATION')}
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
                                label={reasonFundmaker.name[lng]}
                                component={renderTextareaLang}
                                format={value => (!!value ? value.valueLng[lang.reasonFundmaker] : "")}
                                normalize={(val, prevVal, obj, prevObj) => {
                                    let newVal = { ...prevVal };
                                    newVal.value = val;
                                    if (!!newVal.valueLng) {
                                        newVal.valueLng[lang.reasonFundmaker] = val;
                                    } else {
                                        newVal["valueLng"] = { kz: "", en: "", ru: "" };
                                        newVal.valueLng[lang.reasonFundmaker] = val;
                                    }
                                    return newVal;
                                }}
                                formItemClass="with-lang"
                                changeLang={this.changeLang}
                                formItemLayout={{
                                    labelCol: { span: 10 },
                                    wrapperCol: { span: 14 }
                                }}
                            />}
                        </Col>
                        <Col span={24}>
                            <Row>
                                <Col span={10}></Col>
                                <Col span={14}>
                                    {<Field
                                        name="reasonFundmaker"
                                        component={renderFileUploadBtn}
                                        cubeSConst='cubeForOrgFundmaker'
                                        normalize={this.fileToRedux}
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
            </div>
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
        formOfAdmissionOptions: state.generalData[FORM_OF_ADMISSION],
        orgIndustryOptions: orgIndOpts,
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
    {getPropVal, getCube, getAccessLevels, getObjChildsByConst, getPropValWithChilds}
)(reduxForm({form: 'LiquidationFoundMaker', enableReinitialize: true})(LiquidationFoundMaker));