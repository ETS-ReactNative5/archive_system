import React, {Component} from 'react';
import {Button, Form} from 'antd';
import {Field, reduxForm, formValueSelector} from 'redux-form';
import {
    renderDatePicker, renderInput, renderSelect, renderSelectVirt
} from '../../../utils/form_components';
import {connect} from 'react-redux';
import moment from 'moment';
import {getAllObjOfCls, getObjByObjVal, getObjByProp, getPropVal} from '../../../actions/actions';
import {isEqual, pickBy} from 'lodash';
import {requiredDate, requiredLabel} from '../../../utils/form_validations';
import {WORK_PRIORITY} from '../../../constants/tofiConstants';

/*eslint eqeqeq:0*/
class WorksPropertyForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            lang: {
                workListName: localStorage.getItem('i18nextLng'),
            },
            loading: {
                sourceOrgListLoading: false,
                sourceLPListLoading: false,
                workAssignedToRegLoading: false,
                workPriorityLoading: false,
                fundOrgLodaing: false,
                fundLPLodaing: false,
                collectionOrgLodaing: false,
                collectionLPLodaing: false,
                jointOrgLodaing: false,
                jointLPLoading: false,
                workRegInvLoading: false,
                workRegCaseLoading: false,
                deliveryPurposeLoading: false,
                staffLoading: false
            },
            workRegInvOptions: [],
            workRegCaseOptions: []
        };
    }

    changeLang = e => {
        this.setState({lang: {...this.state.lang, [e.target.name]: e.target.value}});
    };

    workName = {...this.props.initialValues.workListName} || {kz: '', ru: '', en: ''};

    onSubmit = values => {
        if (!this.props.initialValues.key) {
            return this.props.onCreateObj(
                {
                    ...pickBy(values, (val, key) => !isEqual(val, this.props.initialValues[key])),
                    workStatusReg: values.workStatusReg,
                    workDate: values.workDate
                })
        } else {
            let workStatusReg = values.workStatusReg;
            if (['caseSearch', 'caseDisposal', 'caseRegistration', 'descriptionOfValuableDocs'].includes(values.workType.workTypeClass)) {
                workStatusReg = {
                    value: this.props.tofiConstants.appointed.id,
                    label: this.props.tofiConstants.appointed.name[this.lng]
                }
            }

            return this.props.onSaveCubeData({
                ...pickBy(values, (val, key) => !isEqual(val, this.props.initialValues[key])),
                workType: values.workType,
                workStatusReg,
                workDate: moment().format('YYYY-MM-DD'),

            });
        }
    };
    loadClsObj = (cArr, propConsts, dte = moment().format('YYYY-MM-DD')) => {
        return () => {
            cArr.forEach(c => {
                if (!this.props[c + 'Options']) {
                    this.setState({loading: {...this.state.loading, [c + 'Loading']: true}});
                    this.props.getAllObjOfCls(c, dte, propConsts)
                        .then(() => this.setState({loading: {...this.state.loading, [c + 'Loading']: false}}))
                }
            })
        }
    };
    loadOptions = c => {
        return () => {
            if (!this.props[c + 'Options']) {
                this.setState({loading: {...this.state.loading, [c + 'Loading']: true}});
                this.props.getPropVal(c)
                    .then(() => this.setState({loading: {...this.state.loading, [c + 'Loading']: false}}))
            }
        }
    };
    loadOptionsArr = cArr => {
        return () => {
            cArr.forEach(c => {
                if (!this.props[c + 'Options']) {
                    this.setState({loading: {...this.state.loading, [c + 'Loading']: true}});
                    this.props.getPropVal(c)
                        .then(() => this.setState({loading: {...this.state.loading, [c + 'Loading']: false}}))
                }
            });
        }
    };


    disabledStartDate = (startValue) => {
        const endValue = this.props.workPlannedEndDateValue;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    };
    disabledEndDate = (endValue) => {
        const startValue = this.props.workPlannedStartDateValue;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    };

    render() {
        if (!this.props.tofiConstants) return null;

        this.lng = localStorage.getItem('i18nextLng');
        const {
            t, handleSubmit, reset, dirty, error, submitting, workTypeValue, fundOrgOptions, fundLPOptions, collectionOrgOptions, staffOptions,
            collectionLPOptions, jointOrgOptions, jointLPOptions, checkingTypeOptions, workAssignedToRegOptions, workPriorityOptions, deliveryPurposeOptions,
            tofiConstants: {
                workPlannedEndDate, check, workPriority, workRegFund, workAuthor, workDate, workAssignedTo, checkingType, workRegInv,
                workPlannedStartDate, workRegCase, deliveryPurpose, workRecipient, retirementReason
            }
        } = this.props;
        const {loading: {workAssignedToRegLoading, workPriorityLoading, deliveryPurposeLoading, staffLoading}} = this.state;

        return (
            <Form className="antForm-spaceBetween" onSubmit={handleSubmit(this.onSubmit)}
                  style={dirty ? {paddingBottom: '43px'} : {}}>
                <Field
                    name="workType"
                    component={ renderSelect }
                    disabled={!!this.props.initialValues.key}
                    isSearchable={false}
                    label={t('WORK_TYPE')}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }
                    onChange={(e, newValue) => {
                        if (newValue) {
                            const statusConst = this.props.tofiConstants[this.props.clsFirstStatusMap[newValue.value]];
                            this.props.change('workStatusReg', {
                                value: statusConst.id,
                                label: statusConst.name[this.lng],
                                workType: workTypeValue
                            });
                        } else {
                            reset();
                        }
                    }}
                    data={['caseRegistration', 'caseDisposal', 'descriptionOfValuableDocs', 'caseAvailabilityCheck', 'casesForTemporaryUse', 'caseExamination', 'processedCases', 'caseSearch']
                        .map(cns => ({
                            value: this.props.tofiConstants[cns].id,
                            label: this.props.tofiConstants[cns].name[this.lng],
                            workTypeClass: cns
                        }))}
                    validate={requiredLabel}
                    colon={true}
                />
                {workRegFund && <Field
                    name="workRegFund"
                    disabled={!!this.props.initialValues.workActualStartDate}
                    component={ renderSelectVirt }
                    matchProp="label"
                    matchPos="start"
                    label={workRegFund.name[this.lng]}
                    optionHeight={40}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }
                    isLoading={['fundOrg', 'fundLP', 'collectionOrg', 'collectionLP', 'jointOrg', 'jointLP'].some(c => this.state.loading[c + 'Loading'])}
                    onFocus={ this.loadClsObj(['fundOrg', 'fundLP', 'collectionOrg', 'collectionLP', 'jointOrg', 'jointLP'], 'fundNumber,fundIndex,fundFeature') }
                    options={fundOrgOptions && fundLPOptions && collectionOrgOptions && collectionLPOptions && jointOrgOptions && jointLPOptions ?
                        [...fundOrgOptions, ...fundLPOptions, ...collectionOrgOptions, ...collectionLPOptions, ...jointOrgOptions, ...jointLPOptions]
                            .reduce((filtered, option) => {
                                if (option.fundFeature.idRef == this.props.tofiConstants.included.id) {
                                    filtered.push({
                                        value: option.id,
                                        label: `${option.fundNumber[this.lng] + option.fundIndex[this.lng]} - ${option.name[this.lng]}`
                                    })
                                }
                                function compare(a, b) {
                                    if (parseInt(a.label) < parseInt(b.label))
                                        return -1;
                                    if (parseInt(a.label) > parseInt(b.label))
                                        return 1;
                                    return 0;
                                }
                                filtered.sort(compare);
                                return filtered
                            }, []) : []}
                    validate={requiredLabel}
                    colon={true}
                />}
                {workRegInv && <Field
                    name="workRegInv"
                    component={ renderSelectVirt }
                    matchProp="label"
                    matchPos="start"
                    label={workRegInv.name[this.lng]}
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
                    options={this.state.workRegInvOptions.map(option => ({
                        value: option.id,
                        label: `${option.invNumber[this.lng]} - ${option.name[this.lng]}`
                    }))}
                    validate={requiredLabel}
                    colon={true}
                />}
                {workRegCase && workTypeValue && (workTypeValue.value == this.props.tofiConstants.casesForTemporaryUse.id ||
                workTypeValue.value == this.props.tofiConstants.caseSearch.id ||
                workTypeValue.value == this.props.tofiConstants.caseDisposal.id) && <Field
                    name="workRegCase"
                    component={ renderSelectVirt }
                    matchProp="label"
                    matchPos="start"
                    label={workRegCase.name[this.lng]}
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
                    options={this.state.workRegCaseOptions.map(option => ({
                        value: option.id,
                        label: `${option.fundNumber[this.lng]} - ${option.name[this.lng]}`
                    }))}
                    // validate={requiredLabel}
                    // colon={true}
                />}
                {workPlannedStartDate && <Field
                    name="workPlannedStartDate"
                    disabledDate={this.disabledStartDate}
                    component={renderDatePicker}
                    disabled={!!this.props.initialValues.workActualStartDate}
                    format={null}
                    label={workPlannedStartDate.name[this.lng]}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }
                />}
                {workPlannedEndDate && <Field
                    name="workPlannedEndDate"
                    disabledDate={this.disabledEndDate}
                    component={ renderDatePicker }
                    disabled={!!this.props.initialValues.workActualStartDate}
                    format={null}
                    isSearchable={false}
                    label={workPlannedEndDate.name[this.lng]}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }
                />}
                {workAssignedTo && <Field
                    name="workAssignedTo"
                    component={renderSelect}
                    disabled={!!this.props.initialValues.workActualStartDate}
                    label={workAssignedTo.name[this.lng]}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }
                    isLoading={workAssignedToRegLoading}
                    data={workAssignedToRegOptions ? workAssignedToRegOptions.map(option => ({
                        value: option.id,
                        label: option.name[this.lng]
                    })) : []}
                    onFocus={this.loadClsObj(['workAssignedToReg'])}
                />}
                {retirementReason && workTypeValue && workTypeValue.value == this.props.tofiConstants.caseDisposal.id &&
                <Field
                    name="retirementReason"
                    component={renderSelect}
                    disabled
                    label={retirementReason.name[this.lng]}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }
                    // validate={requiredDate}
                    // colon={true}
                />}
                {deliveryPurpose && workTypeValue && workTypeValue.value == this.props.tofiConstants.casesForTemporaryUse.id &&
                <Field
                    name="deliveryPurpose"
                    component={renderSelect}
                    disabled={(this.props.initialValues && !!this.props.initialValues.key) || !!this.props.initialValues.workActualStartDate}
                    label={deliveryPurpose.name[this.lng]}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }
                    isLoading={deliveryPurposeLoading}
                    data={deliveryPurposeOptions ? deliveryPurposeOptions.map(option => ({
                        value: option.id,
                        label: option.name[this.lng]
                    })) : []}
                    onFocus={this.loadOptions('deliveryPurpose')}
                />}
                {workRecipient && workTypeValue && workTypeValue.value == this.props.tofiConstants.casesForTemporaryUse.id &&
                <Field
                    name="workRecipient"
                    component={renderSelect}
                    disabled={!!this.props.initialValues.workActualStartDate}
                    label={workRecipient.name[this.lng]}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }
                    isLoading={staffLoading}
                    data={staffOptions ? staffOptions.map(option => ({
                        value: option.id,
                        label: option.name[this.lng]
                    })) : []}
                    onFocus={this.loadClsObj(['staff'])}
                />}
                {workPriority && <Field
                    name="workPriority"
                    component={ renderSelect }
                    disabled={!!this.props.initialValues.workActualStartDate}
                    isSearchable={false}
                    label={workPriority.name[this.lng]}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }
                    isLoading={workPriorityLoading}
                    data={workPriorityOptions ? workPriorityOptions.map(option => ({
                        value: option.id,
                        label: option.name[this.lng]
                    })) : []}
                    onFocus={this.loadOptions('workPriority')}
                    // validate={requiredLabel}
                    // colon={true}
                />}
                {workTypeValue && workTypeValue.value == check.id && checkingType && <Field //eslint-disable-line
                    name="checkingType"
                    component={ renderSelect }
                    disabled={!!this.props.initialValues.workActualStartDate}
                    isSearchable={false}
                    label={checkingType.name[this.lng]}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }
                    onFocus={this.loadOptions('checkingType')}
                    // validate={requiredLabel}
                    // colon={true}
                    data={checkingTypeOptions ? checkingTypeOptions.map(option => ({
                        value: option.id,
                        label: option.name[this.lng]
                    })) : []}
                />}
                <Field
                    name="workStatusReg"
                    disabled
                    component={ renderSelect }
                    isSearchable={false}
                    label={t('WORK_STATUS_REG')}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }
                    // onFocus={ this.loadOptionsArr(['workStatusDelivery','workStatusAdmissionAndExpertise','workStatusSearch','workStatusOCD','workStatusAvailabilityCheck']) }
                    // validate={requiredLabel}
                    // colon={true}
                    /*data={workTypeValue && workTypeValue.value == this.props.tofiConstants.caseRegistration.id ?
                     ( workStatusAddmissionAndExpertiseOptions ? workStatusAddmissionAndExpertiseOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : [] ) :
                     workTypeValue && workTypeValue.value == this.props.tofiConstants.caseDisposal.id ?
                     ( workStatusRetirementOptions ? workStatusRetirementOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : [] ) :
                     workTypeValue && workTypeValue.value == this.props.tofiConstants.descriptionOfValuableDocs.id ?
                     ( workStatusRetirementOptions ? workStatusRetirementOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : [] ) :
                     }*/
                />
                {workDate && <Field
                    name="workDate"
                    component={renderDatePicker}
                    disabled
                    format={null}
                    label={workDate.name[this.lng]}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }
                    // defaultValue={moment()}
                    // validate={requiredDate}
                    // colon={true}
                />}
                {workAuthor && <Field
                    name="workAuthor"
                    component={ renderInput }
                    disabled={!!this.props.initialValues.workActualStartDate}
                    readOnly
                    placeholder={t('USER_FIO_PLACEHOLDER')}
                    label={workAuthor.name[this.lng]}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }
                />}
                {dirty && <Form.Item className="ant-form-btns">
                    <Button className="signup-form__btn" type="primary" htmlType="submit" disabled={submitting}>
                        {submitting ? t('LOADING...') : t('SAVE') }
                    </Button>
                    <Button className="signup-form__btn" type="danger" htmlType="button" disabled={submitting}
                            style={{marginLeft: '10px'}} onClick={reset}>
                        {submitting ? t('LOADING...') : t('CANCEL') }
                    </Button>
                    {error && <span className="message-error"><i className="icon-error"/>{error}</span>}
                </Form.Item>}
            </Form>
        )
    }
}

const selector = formValueSelector('WorksPropertyForm');

export default connect(state => {
    const workTypeValue = selector(state, 'workType');
    const workRegFundValue = selector(state, 'workRegFund');
    const workRegInvValue = selector(state, 'workRegInv');
    const workPlannedStartDateValue = selector(state, 'workPlannedStartDate');
    const workPlannedEndDateValue = selector(state, 'workPlannedEndDate');
    return {
        workTypeValue,
        workRegFundValue,
        workRegInvValue,
        workPlannedStartDateValue,
        workPlannedEndDateValue,
        user: state.auth.user,
        workAssignedToRegOptions: state.generalData.workAssignedToReg,
        workPriorityOptions: state.generalData[WORK_PRIORITY],
        fundOrgOptions: state.generalData.fundOrg,
        fundLPOptions: state.generalData.fundLP,
        collectionOrgOptions: state.generalData.collectionOrg,
        collectionLPOptions: state.generalData.collectionLP,
        jointOrgOptions: state.generalData.jointOrg,
        jointLPOptions: state.generalData.jointLP,
        deliveryPurposeOptions: state.generalData.deliveryPurpose,
        staffOptions: state.generalData.staff
        // workStatusDeliveryOptions: state.generalData.workStatusDelivery,
        // workStatusAdmissionAndExpertiseOptions: state.generalData.workStatusAdmissionAndExpertise,
        // workStatusSearchOptions: state.generalData.workStatusSearch,
        // workStatusAvailabilityCheckOptions: state.generalData.worksStatusAvailabilityCheck,
        // workStatusOCDOptions: state.generalData.workStatusOCD
    }
}, {getAllObjOfCls, getPropVal, getObjByObjVal})(reduxForm({
    form: 'WorksPropertyForm',
    enableReinitialize: true
})(WorksPropertyForm));
