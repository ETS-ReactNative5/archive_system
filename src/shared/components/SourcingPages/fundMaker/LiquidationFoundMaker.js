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
import {requiredLabel, requiredLng} from "../../../utils/form_validations";
import Row from "antd/es/grid/row";
import Col from "antd/es/grid/col";
import {isEqual, pickBy} from "lodash";
import moment from 'moment/moment';
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
    getAllObjOfCls
} from "../../../actions/actions";


class LiquidationFoundMaker extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: {
                orgRightReceiverLoading: false,
                loadReceiver: '',
            },
        };
    }

    onSubmit = values => {
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
        if (!this.props.initialValues.key) {
            return this.props.onCreateObj(
                {cube, obj},
                {values: rest, idDPV: this  .props.withIdDPV, oFiles: {reasonFundmakerFile}},
            )
        }
        obj.doItem = this.props.initialValues.key;
        const objData = {};
        // Сохраняем значения свойств fundNumber, fundmakerArchive (fundArchive для ИК), formOfAdmission, legalStatus, isActive для соответстующего источника комплектования, если хотя бы одно изменилось.
        if (rest.orgRightReceiver) {
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
                                consts: 'fundmakerOfIK,formOfAdmission,orgRightReceiver,isActive'
                            }
                        ]
                    }
                ]
            };
            this.props.getCube('cubeForFundAndIK', JSON.stringify(filters), {customKey: 'cubeForFundAndIKSingle'})
                .then(() => {
                    const constArr = ['fundNumber', 'fundmakerOfIK', 'formOfAdmission', 'orgRightReceiver'];
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
                    const {orgRightReceiver} = rest;
                    const vIK = {
                        values: JSON.parse(JSON.stringify({
                            orgRightReceiver,
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
                    // this.props.saveIKProps(cIK, vIK, this.props.tofiConstants, objData);
                });
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

    render(){
        if (!this.props.tofiConstants) return null;
        const lng = localStorage.getItem('i18nextLng');
        const {lang, loading} = this.state;
        const {tofiConstants: {dateElimination,reasonFundmaker,orgRightReceiver}, t,orgRightReceiverOptions, handleSubmit, reset, dirty, error, submitting} = this.props;
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
