import React, {Component} from 'react';
import {Button, Form, Input, Popover} from 'antd';
import {Field, reduxForm, formValueSelector} from 'redux-form';
import {
    renderDatePicker, renderInput, renderSelect, renderSelectVirt
} from '../../../utils/form_components';
import {connect} from 'react-redux';
import moment from 'moment';
import {
    getAllObjOfCls,
    getObjByObjVal,
    getObjByProp,
    getObjChildsByConst,
    getPropVal, getRolesUser
} from '../../../actions/actions';
import {isEqual, pickBy} from 'lodash';
import {requiredArr, requiredLabel} from '../../../utils/form_validations';
import {
    CUBE_FOR_WORKS,
    DO_FOR_WORKS,
    DP_FOR_WORKS,
    WORK_PRIORITY,
    WORK_STATUS
} from '../../../constants/tofiConstants';
import {SYSTEM_LANG_ARRAY} from "../../../constants/constants";

const FormItem = Form.Item;

class WorksPropertyForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            rolesUser: [],
            roles:[],
            lang: {
                workListName: localStorage.getItem('i18nextLng'),
            },
            loading: {
                sourceOrgListLoading: false,
                sourceLPListLoading: false,
                workAssignedToNIDLoading: false,
                clsHeadLoading: false,
                workPriorityLoading: false,
                linkToWorkLoading: false,
                linkToUkazLoading: false
            }
        };
    }


    changeLang = e => {
        this.setState({lang: {...this.state.lang, [e.target.name]: e.target.value}});
    };

    workName = {...this.props.initialValues.workListName} || {kz: '', ru: '', en: ''};

    strToRedux = (val, prevVal, obj, prevObj) => {
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
                newVal.workTypeClass=val.workTypeClass;
                return (newVal)
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

    }};

    onSubmit = values => {
        const mappedStatus = this.props.clsStatusMap[values.workType.value];
        const {workType, workStatusUses, ...rest} = pickBy(values, (val, key) => !isEqual(val, this.props.initialValues[key]));
        if (workStatusUses) rest[mappedStatus] = values.workStatusUses;
        const cube = {
            cubeSConst: CUBE_FOR_WORKS,
            doConst: DO_FOR_WORKS,
            dpConst: DP_FOR_WORKS
        };
        const name = {};
        SYSTEM_LANG_ARRAY.forEach(lang => {
            name[lang] = values.workType.label
        });
        const obj = {
            name,
            fullName: name,
            clsConst: values.workType.workTypeClass,
        };
        if (!this.props.initialValues.key) {
            return this.props.onCreateObj(
                {cube, obj},
                {
                    values: {
                        ...rest,
                        workAuthor: String(values.workAuthor.value),
                        [mappedStatus]: values.workStatusUses,
                        workDate: values.workDate
                    }
                })
        }
        obj.doItem = this.props.initialValues.key;
        return this.props.saveProps({
            cube,
            obj
        }, {values: rest}, this.props.tofiConstants);
    };
    loadClsObj = (cArr, dte = moment().format('YYYY-MM-DD')) => {
        return () => {
            cArr.forEach(c => {
                if (!this.props[c + 'Options']) {
                    this.setState({
                        loading: {
                            ...this.state.loading,
                            [c + 'Loading']: true
                        }
                    });
                    this.props.getAllObjOfCls(c, dte)
                        .then(() => this.setState({
                            loading: {
                                ...this.state.loading,
                                [c + 'Loading']: false
                            }
                        }))
                }
            })
        }
    };
    loadOptions = c => {
        return () => {
            if (!this.props[c + 'Options']) {
                this.setState({loading: {...this.state.loading, [c + 'Loading']: true}});
                this.props.getPropVal(c)
                    .then(() => this.setState({
                        loading: {
                            ...this.state.loading,
                            [c + 'Loading']: false
                        }
                    }))
            }
        }
    };
    loadChilds = (c, props) => {
        return () => {
            if (!this.props[c + 'Options']) {
                this.setState({loading: {...this.state.loading, [c + 'Loading']: true}});
                this.props.getObjChildsByConst(c, props)
                    .then(() => this.setState({
                        loading: {
                            ...this.state.loading,
                            [c + 'Loading']: false
                        }
                    }))
                    .catch(err => console.error(err))
            }
        }
    };

    componentDidUpdate(prevProps) {
        if (prevProps.initialValues != this.props.initialValues) {
            this.getRolUser();
        }
    }

    componentDidMount() {
        this.getRolUser();

    }

    getRolUser = () => {
        getRolesUser(this.props.initialValues.workAuthor.value)
            .then(res => {
                this.setState({
                    rolesUser: res.data.map(o => ({value: o.id, label: o.name[this.lng]}))
                },()=>{
                    let str = this.state.rolesUser.map((el) => {
                        return el.label
                    })

                    this.setState({
                        roles:str
                    })
                })
            })
            .catch(err => console.warn(err))
    }

    render() {
        debugger;
        const content = (
            <div>{this.state.roles.join(', ')}</div>
        )
        this.lng = localStorage.getItem('i18nextLng');

        if (!this.props.tofiConstants) return null;
        const lng = localStorage.getItem('i18nextLng');
        const {
            t, handleSubmit, reset, dirty, error, submitting, workTypeValue, fundArchiveValue, fundArchiveOptions, workRegCaseValue, initialValues,
            user, workAssignedToValue, workAssignedToNIDOptions, clsHeadOptions, workPriorityOptions, objStudyParentOptions, workAssignedToIPSOptions,
            workAssignedToRegOptions, workAssignedToSourceOptions, clsDepInformTechOptions, tofiConstants,
            tofiConstants: {
                fundArchive, tookUser, workPriority,
                workRegInv, workAuthor, workDate, workAssignedTo, dateAppointment, appointedUser,
                workRegFund, created, appointed, workRegCase, linkToWork, linkToUkaz, propResearcheRequests
            }
        } = this.props;
        const {
            workRegFundOptions, linkToWorkOptions,
            loading: {
                workAssignedToNIDLoading, clsHeadLoading, workPriorityLoading, fundArchiveLoading, clsDepInformTechLoading,
                workAssignedToIPSLoading, workAssignedToRegLoading, workAssignedToSourceLoading
            }
        } = this.state;

        return (
            <Form className="antForm-spaceBetween" onSubmit={handleSubmit(this.onSubmit)}
                  style={dirty ? {paddingBottom: '43px'} : {}}>
                <FormItem>
                    <h3>{t('WORK')}</h3>
                    <hr/>
                </FormItem>
                <Field
                    name="workType"
                    component={renderSelect}
                    disabled={!!this.props.initialValues.key}
                    isSearchable={false}
                    label={t('WORK_TYPE')}
                    normalize={this.selectToRedux}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }
                    data={['caseDeliveryToRR', 'responseToRequest', 'performPaidReq', 'conductResearch']
                        .map(cns => ({
                            value: this.props.tofiConstants[cns].id,
                            label: this.props.tofiConstants[cns].name[lng],
                            workTypeClass: cns
                        }))}
                    validate={requiredLabel}
                    colon={true}
                />
                {workPriority && <Field
                    name="workPriority"
                    component={renderSelect}
                    normalize={this.selectToRedux}
                    isSearchable={false}
                    label={workPriority.name[lng]}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }
                    isLoading={workPriorityLoading}
                    data={workPriorityOptions ? workPriorityOptions.map(option => ({
                        value: option.id,
                        label: option.name[lng]
                    })) : []}
                    onFocus={this.loadOptions('workPriority')}
                />}
                {<Field
                    name="workStatusUses"
                    disabled
                    component={renderSelect}
                    normalize={this.selectToRedux}
                    isSearchable={false}
                    label={t('WORK_STATUS_USES')}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }
                />}
                {workDate && <Field
                    name="workDate"
                    component={renderDatePicker}
                    normalize={this.dateToRedux}
                    format={null}
                    label={workDate.name[lng]}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }
                />}
                {dateAppointment && <Field
                    name="dateAppointment"
                    component={renderDatePicker}
                    normalize={this.dateToRedux}
                    format={null}
                    label={dateAppointment.name[lng]}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }
                />}
                <FormItem>
                    <h3>{t('PARTICIPANTS')}</h3>
                    <hr/>
                </FormItem>
                {workAuthor && <Field
                    name="workAuthor"
                    normalize={this.selectToRedux}
                    component={renderSelect}
                    disabled
                    label={workAuthor.name[lng]}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }
                />}
                <FormItem>

                    <div className="ant-col-10 ant-form-item-label">
                        {t('ROLES')}
                    </div>
                    <div className="ant-col-14 ant-form-item-control-wrapper">
                        <Popover content={content} title={t('ROLES')}>
                            <Input disabled value={this.state.roles}/>

                        </Popover>
                    </div>


                </FormItem>
                {workAssignedTo && <Field
                    name="workAssignedTo"
                    component={renderSelect}
                    normalize={this.selectToRedux}
                    label={workAssignedTo.name[lng]}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }
                    onChange={(e, newValue) => {
                        debugger;
                        const user = this.props.user;
                        if (newValue) {
                            this.props.change('appointedUser', {
                                value: user.obj,
                                label: user.name,
                                idDataPropVal: this.props.formReduxState.WorksPropertyForm.values.appointedUser &&
                                this.props.formReduxState.WorksPropertyForm.values.appointedUser.idDataPropVal
                            });
                            this.props.change('tookUser', {
                                value: newValue.value,
                                label: newValue.label,
                                idDataPropVal: this.props.formReduxState.WorksPropertyForm.values.tookUser &&
                                this.props.formReduxState.WorksPropertyForm.values.tookUser.idDataPropVal
                            });
                            this.props.change('workStatusUses', {
                                value: appointed.id,
                                label: appointed.name[lng],
                                idDataPropVal:this.props.formReduxState.WorksPropertyForm.values.workStatusUses.idDataPropVal
                            });
                            this.props.change('dateAppointment',{
                                value:moment(),
                                idDataPropVal: this.props.formReduxState.WorksPropertyForm.values.dateAppointment &&
                                this.props.formReduxState.WorksPropertyForm.values.dateAppointment.idDataPropVal
                            })
                        } else {
                            this.props.change('appointedUser', {
                                value:null,
                                idDataPropVal: this.props.formReduxState.WorksPropertyForm.values.appointedUser &&
                                this.props.formReduxState.WorksPropertyForm.values.appointedUser.idDataPropVal
                            });
                            this.props.change('tookUser', {
                                value:null,
                                idDataPropVal: this.props.formReduxState.WorksPropertyForm.values.tookUser &&
                                this.props.formReduxState.WorksPropertyForm.values.tookUser.idDataPropVal
                            });
                            this.props.change('workStatusUses', {
                                value: created.id,
                                label: created.name[lng],
                                idDataPropVal:this.props.formReduxState.WorksPropertyForm.values.workStatusUses.idDataPropVal
                            })
                            this.props.change('dateAppointment', null);
                        }
                    }}
                    isLoading={this.props.initialValues.workType &&
                    this.props.initialValues.workType.workTypeClass == 'responseToRequest' ? (workAssignedToIPSLoading) : (workAssignedToNIDLoading || clsHeadLoading || workAssignedToIPSLoading || workAssignedToRegLoading || workAssignedToSourceLoading || clsDepInformTechLoading
                    )
                    }
                    data={this.props.initialValues.workType &&
                    this.props.initialValues.workType.workTypeClass == 'responseToRequest' ?
                        (workAssignedToIPSOptions ? [...workAssignedToIPSOptions].map(option => ({
                                value: option.id,
                                label: option.name[lng]
                            }))
                            : [] )
                        : (
                            workAssignedToNIDOptions && clsHeadOptions && workAssignedToSourceOptions && workAssignedToRegOptions && workAssignedToIPSOptions && clsDepInformTechOptions ?
                                [...workAssignedToNIDOptions, ...clsHeadOptions, ...workAssignedToSourceOptions, ...workAssignedToRegOptions, ...workAssignedToIPSOptions, ...clsDepInformTechOptions]
                                    .map(option => ({
                                        value: option.id,
                                        label: option.name[lng]
                                    })) : [])}
                    onFocus={this.loadClsObj(['workAssignedToNID', 'clsHead', 'workAssignedToSource', 'workAssignedToReg', 'workAssignedToIPS', 'clsDepInformTech'])}
                />}
                {appointedUser && <Field
                    name="appointedUser"
                    normalize={this.selectToRedux}
                    component={renderSelect}
                    disabled
                    label={appointedUser.name[lng]}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }
                />}
                {tookUser && <Field
                    name="tookUser"
                    component={renderSelect}
                    normalize={this.selectToRedux}
                    disabled={!workAssignedToValue || workAssignedToValue.value != user.obj}
                    label={tookUser.name[lng]}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }
                    isLoading={workAssignedToNIDLoading || clsHeadLoading || workAssignedToIPSLoading || workAssignedToRegLoading || workAssignedToSourceLoading || clsDepInformTechLoading}
                    data={workAssignedToNIDOptions && clsHeadOptions && workAssignedToSourceOptions && workAssignedToRegOptions && workAssignedToIPSOptions && clsDepInformTechOptions ?
                        [...workAssignedToNIDOptions, ...clsHeadOptions, ...workAssignedToSourceOptions, ...workAssignedToRegOptions, ...workAssignedToIPSOptions, ...clsDepInformTechOptions]
                            .map(option => ({
                                value: option.id,
                                label: option.name[lng]
                            })) : []}
                    onFocus={this.loadClsObj(['workAssignedToNID', 'clsHead', 'workAssignedToSource', 'workAssignedToReg', 'workAssignedToIPS', 'clsDepInformTech'])}
                />}
                {['caseDeliveryToRR', 'orderCopyDoc', 'responseToRequest', 'performPaidReq', 'conductResearch'].includes(workTypeValue.workTypeClass) &&
                <FormItem>
                    <h3>{t('WORK_OBJECT')}</h3>
                    <hr/>
                </FormItem>}
                {fundArchive && ['caseDeliveryToRR', 'orderCopyDoc'].includes(workTypeValue.workTypeClass) &&
                <Field
                    name="fundArchive"
                    normalize={this.selectToRedux}
                    component={renderSelect}
                    label={fundArchive.name[lng]}
                    disabled={!!this.props.initialValues.fundArchive}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }
                    isLoading={fundArchiveLoading}
                    data={fundArchiveOptions ? fundArchiveOptions.map(option => ({
                        value: option.id,
                        label: option.name[lng]
                    })) : []}
                    onFocus={this.loadOptions('fundArchive')}
                />}
                {workRegFund && ['caseDeliveryToRR', 'orderCopyDoc'].includes(workTypeValue.workTypeClass) &&
                <Field
                    name="workRegFund"
                    normalize={this.selectToRedux}
                    disabled={!!this.props.initialValues.workActualStartDate || !fundArchiveValue}
                    component={renderSelectVirt}
                    label={workRegFund.name[lng]}
                    optionHeight={40}
                    formItemLayout={{
                        labelCol: {span: 10},
                        wrapperCol: {span: 14}
                    }}
                    isLoading={this.state.workRegFundLoading}
                    onFocus={() => {
                        const fd = new FormData();
                        fd.append('clsConsts', 'fundOrg,fundLP,collectionOrg,collectionLP,jointOrg,jointLP');
                        fd.append('propConst', 'fundArchive');
                        fd.append('withProps', 'fundNumber,fundIndex,fundFeature');
                        fd.append('value', fundArchiveValue.value);
                        this.setState({workRegFundLoading: true});
                        getObjByProp(fd)
                            .then(res => {
                                this.setState({workRegFundLoading: false});
                                if (res.success) {
                                    this.setState({workRegFundOptions: res.data.filter(option => option.fundFeature.idRef == this.props.tofiConstants.included.id)})
                                } else {
                                    throw res
                                }
                            }).catch(err => {
                            this.setState({workRegFundLoading: false});
                            console.error(err)
                        })
                    }}
                    options={workRegFundOptions ? workRegFundOptions
                            .map(opt => ({
                                    value: opt.id,
                                    label: `${opt.fundNumber[lng] + opt.fundIndex[lng]} - ${opt.name[lng]}`
                                })
                            )
                        : []}
                    validate={requiredLabel}
                    colon={true}
                />}
                {workRegInv && ['caseDeliveryToRR', 'orderCopyDoc'].includes(workTypeValue.workTypeClass) &&
                <Field
                    name="workRegInv"
                    component={renderSelectVirt}
                    normalize={this.selectToRedux}
                    label={workRegInv.name[lng]}
                    disabled={!this.props.workRegFundValue || !!this.props.initialValues.workActualStartDate}
                    optionHeight={40}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }
                    isLoading={this.state.loading.workRegInvLoading}
                    onFocus={() => {
                        const fd = new FormData();
                        fd.append('clsConsts', 'invList');
                        fd.append('propConst', 'invFund');
                        fd.append('withProps', 'invNumber,fundFeature');
                        fd.append('value', this.props.workRegFundValue.value);
                        getObjByProp(fd)
                            .then(res => {
                                if (res.success) {
                                    this.setState({workRegInvOptions: res.data.filter(option => option.fundFeature.idRef == this.props.tofiConstants.included.id)})
                                } else {
                                    throw res
                                }
                            }).catch(err => console.log(err))
                    }}
                    options={this.state.workRegInvOptions ?
                        this.state.workRegInvOptions
                            .map(option => ({
                                value: option.id,
                                label: `${option.invNumber[lng]} - ${option.name[lng]}`
                            })) :
                        []}
                    validate={requiredLabel}
                    colon={true}
                />}
                {workRegCase && ['caseDeliveryToRR', 'orderCopyDoc'].includes(workTypeValue.workTypeClass) &&
                <Field
                    name="workRegCase"
                    normalize={this.selectToRedux}
                    component={renderSelectVirt}
                    label={workRegCase.name[lng]}
                    disabled={!this.props.workRegInvValue || !!this.props.initialValues.workActualStartDate}
                    optionHeight={40}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }
                    isLoading={this.state.loading.workRegCaseLoading}
                    onFocus={() => {
                        const fd = new FormData();
                        fd.append('clsConsts', 'caseList');
                        fd.append('propConst', 'caseInventory');
                        fd.append('withProps', 'fundNumber,fundFeature');
                        fd.append('value', this.props.workRegInvValue.value);
                        getObjByProp(fd)
                            .then(res => {
                                if (res.success) {
                                    this.setState({workRegCaseOptions: res.data.filter(option => option.fundFeature.idRef == this.props.tofiConstants.included.id)})
                                } else {
                                    throw res
                                }
                            }).catch(err => console.log(err))
                    }}
                    options={this.state.workRegCaseOptions ?
                        this.state.workRegCaseOptions
                            .map(option => ({
                                value: option.id,
                                label: `${option.fundNumber[lng]} - ${option.name[lng]}`
                            })) :
                        []}
                    validate={requiredLabel}
                    colon={true}
                />}
                {linkToUkaz && ['caseDeliveryToRR'].includes(workTypeValue.workTypeClass) &&
                <Field
                normalize={this.selectMultiToRedux}
                    name="linkToUkaz"
                    isMulti
                    component={renderSelect}
                    label={linkToUkaz.name[lng]}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }
                    isLoading={this.state.loading.linkToUkazLoading}
                    onFocus={this.loadChilds('objStudyParent')}
                    data={objStudyParentOptions ?
                        objStudyParentOptions
                            .map(option => ({value: option.id, label: option.name[lng]})) :
                        []}
                />}
                {linkToWork && ['caseDeliveryToRR'].includes(workTypeValue.workTypeClass) &&
                <Field
                    name="linkToWork"
                    normalize={this.selectMultiToRedux}
                    isMulti
                    component={renderSelectVirt}
                    label={linkToWork.name[lng]}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }
                    isLoading={this.state.loading.linkToWorkLoading}
                    onFocus={() => {
                        this.setState({loading: {linkToWorkLoading: true}});
                        const fd = new FormData();
                        const idClassNameMap = {};
                        ['conductResearch', 'performPaidReq', 'responseToRequest'].forEach(c => {
                            idClassNameMap[tofiConstants[c].id] = tofiConstants[c].name[lng]
                        });
                        fd.append('clsConsts', 'conductResearch,performPaidReq,responseToRequest');
                        fd.append('propConst', 'workAssignedTo');
                        fd.append('value', user.obj);
                        getObjByProp(fd)
                            .then(res => {
                                this.setState({
                                    loading: {linkToWorkLoading: false},
                                    linkToWorkOptions: res.data
                                        .map(opt => ({
                                            value: opt.id,
                                            label: `${opt.id}-${idClassNameMap[opt.cls]}`
                                        }))
                                })
                            })
                    }}
                    options={linkToWorkOptions}
                />}
                {propResearcheRequests && ['responseToRequest', 'performPaidReq', 'conductResearch'].includes(workTypeValue.workTypeClass) &&
                <Field
                    name='propResearcheRequests'
                    component={renderInput}
                    label={propResearcheRequests.name[lng]}
                    normalize={this.strToRedux}
                    readOnly
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }
                />}
                {dirty && <Form.Item className="ant-form-btns absolute-bottom">
                    <Button className="signup-form__btn" type="primary" htmlType="submit"
                            disabled={submitting}>
                        {submitting ? t('LOADING...') : t('SAVE')}
                    </Button>
                    <Button className="signup-form__btn" type="danger" htmlType="button"
                            disabled={submitting}
                            style={{marginLeft: '10px'}} onClick={reset}>
                        {submitting ? t('LOADING...') : t('CANCEL')}
                    </Button>
                    {error &&
                    <span className="message-error"><i className="icon-error"/>{error}</span>}
                </Form.Item>}
            </Form>
        )
    }
}

const selector = formValueSelector('WorksPropertyForm');

function mapStateToProps(state) {
    const workTypeValue = selector(state, 'workType') || {};
    const fundArchiveValue = selector(state, 'fundArchive');
    const workRegFundValue = selector(state, 'workRegFund');
    const workRegInvValue = selector(state, 'workRegInv');
    const workRegCaseValue = selector(state, 'workRegCase');
    const workAssignedToValue = selector(state, 'workAssignedTo');
    return {
        workTypeValue,
        fundArchiveValue,
        workRegFundValue,
        workRegInvValue,
        workRegCaseValue,
        workAssignedToValue,
        user: state.auth.user,
        fundArchiveOptions: state.generalData.fundArchive,
        workAssignedToNIDOptions: state.generalData.workAssignedToNID,
        clsHeadOptions: state.generalData.clsHead,
        workAssignedToSourceOptions: state.generalData.workAssignedToSource,
        workAssignedToRegOptions: state.generalData.workAssignedToReg,
        workAssignedToIPSOptions: state.generalData.workAssignedToIPS,
        clsDepInformTechOptions: state.generalData.clsDepInformTech,
        workPriorityOptions: state.generalData[WORK_PRIORITY],
        objStudyParentOptions: state.generalData.objStudyParent,
        formReduxState:state.form
    }
}

export default connect(mapStateToProps, {
    getAllObjOfCls,
    getPropVal,
    getObjByObjVal,
    getObjChildsByConst
})(reduxForm({
    form: 'WorksPropertyForm',
    enableReinitialize: true
})(WorksPropertyForm));
