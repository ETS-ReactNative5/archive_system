import React from 'react';
import {Button, Form} from "antd";
import {Field, formValueSelector, reduxForm} from "redux-form";
import {renderDatePicker, renderFileUploadBtn, renderInput, renderInputLang} from "../../../utils/form_components";
import {requiredLng} from "../../../utils/form_validations";
import Row from "antd/es/grid/row";
import Col from "antd/es/grid/col";
import {isEqual, pickBy} from "lodash";
import moment from 'moment/moment';
import {parseCube_new} from "../../../utils/cubeParser";
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


class LiquidationFoundMaker extends React.PureComponent {
    constructor(props) {
        super(props);
        const lng = localStorage.getItem('i18nextLng');
        this.state = {
            lang: {
                orgRightReceiver: lng,
            },
        };
    }

    onSubmit = values => {
        const {doForFundAndIK, dpForFundAndIK} = this.props.tofiConstants;
        const {orgRightReceiver,reasonFundmakerFile, ...rest} = pickBy(values, (val, key) => !isEqual(val, this.props.initialValues[key]));
        const cube = {
            cubeSConst: 'cubeForOrgFundmaker',
            doConst: 'doForOrgFundmakers',
            dpConst: 'dpForOrgFundmakers',
        };
        const obj = {
            name: orgRightReceiver,
            fullName: orgRightReceiver,
            clsConst: 'fundmakerOrg',
        };
        if (!this.props.initialValues.key) {
            return this.props.onCreateObj(
                {cube, obj},
                {values: rest, idDPV: this.props.withIdDPV, oFiles: {reasonFundmakerFile}},
            )
        }
        obj.doItem = this.props.initialValues.key;
        const objData = {};
        if (orgRightReceiver) objData.name = orgRightReceiver;
        if (orgRightReceiver) objData.fullName = orgRightReceiver;
        // Сохраняем значения свойств fundNumber, fundmakerArchive (fundArchive для ИК), formOfAdmission, legalStatus, isActive для соответстующего источника комплектования, если хотя бы одно изменилось.
        if (orgRightReceiver) {
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
                    const {formOfAdmission, legalStatus, isActive, orgIndustry} = rest;
                    const vIK = {
                        values: JSON.parse(JSON.stringify({
                            fundNumber: {
                                value: rest.fundNumber && rest.fundNumber.value,
                                propConst: "fundNumber",
                                idDataPropVal: parsedCube.props.find(el => el.prop == this.props.tofiConstants['fundNumber'].id) && parsedCube.props.find(el => el.prop == this.props.tofiConstants['fundNumber'].id).values.idDataPropVal
                            },
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
                    //console.log('vIK ', vIK);

                    this.props.saveIKProps(cIK, vIK, this.props.tofiConstants, objData);
                });
        }
        return this.props.saveProps(
            {cube, obj},
            {values: rest, idDPV: this.props.withIdDPV, oFiles: {reasonFundmakerFile}},
            this.props.tofiConstants,
            objData
        );
    };




    componentDidUpdate(prevProps) {
        if (prevProps.initialValues !== this.props.initialValues) {
            this. orgRightReceiverValue = {...this.props.initialValues. orgRightReceiver} || {
                kz: '',
                ru: '',
                en: ''
            };
        }
    }
    orgRightReceiverValue = {...this.props.initialValues.orgRightReceiver} || {kz: '', ru: '', en: ''};

    disabledStartDate = (startValue) => {
        const endValue = this.props.dendValue;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
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


    render(){
        if (!this.props.tofiConstants) return null;
        const lng = localStorage.getItem('i18nextLng');
        const {lang} = this.state;
        const {tofiConstants: {dateElimination,reasonFundmaker}, t, handleSubmit, reset, dirty, error, submitting} = this.props;
        return(
            <Form className="antForm-spaceBetween" onSubmit={handleSubmit(this.onSubmit)}
                  style={dirty ? {paddingBottom: '43px'} : {}}>
                {
                    dateElimination && <Field
                        name="dateElimination"
                        normalize={this.dateToRedux}
                        component={renderDatePicker}
                        disabledDate={this.disabledStartDate}
                        label={dateElimination.name[lng]}
                        format={null}
                        formItemLayout={
                            {
                                labelCol: {span: 10},
                                wrapperCol: {span: 14}
                            }
                        }
                    />
                }
                <Field
                    name="orgRightReceiver"
                    component={renderInputLang}
                    format={value => (!!value ? value[lang.orgRightReceiver] : '')}
                    parse={value => {
                        this.orgRightReceiverValue[lang.orgRightReceiver] = value;
                        return {...this.orgRightReceiverValue}
                    }}
                    label={t('ORG_RIGHT_RECEIVER')}
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
