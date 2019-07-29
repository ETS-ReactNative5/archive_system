import React from 'react';
import {Button, Form} from 'antd';
import {Field, reduxForm, formValueSelector} from 'redux-form';
import {
    renderCheckbox,
    renderDatePicker,
    renderFileUploadBtn,
    renderInput,
    renderInputLang,
    renderSelect,
    renderSelectVirt,
    renderTaggedSelect
} from '../../utils/form_components';
import {connect} from 'react-redux';
import moment from 'moment';
import {getAllObjOfCls, getObjByObjVal, getObjByProp, getObjChildsByConst, getPropVal} from '../../actions/actions';
import {isEqual, pickBy} from 'lodash';
import {required, requiredArr, requiredDate, requiredLabel, requiredLng} from '../../utils/form_validations';

/*eslint eqeqeq:0*/
class MainInfoFundForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            lang: {
                name: localStorage.getItem('i18nextLng'),
            },
            loading: {
                invCaseSystemLoading: false
            },
            optionMultiSelect: []
        };
    }

    changeLang = e => {
        this.setState({lang: {...this.state.lang, [e.target.name]: e.target.value}});
    };

    nameValue = {...this.props.initialValues.name} || {kz: '', ru: '', en: ''};

    onSubmit = values => {
        if (!this.props.initialValues.key) {
            return this.props.onCreateObj(
                {
                    ...pickBy(values, (val, key) => !isEqual(val, this.props.initialValues[key])),
                    accessLevel: values.accessLevel,
                    fundFeature: values.fundFeature,
                    invType: values.invType,
                    invFund: {value: this.props.initialValues.fundId.split('_')[1]} //selected fond ID
                })
        } else {
            const {name, accessLevel, ...rest} = pickBy(values, (val, key) => !isEqual(val, this.props.initialValues[key]))
            const objData = {};
            if (name) {
                objData.name = name;
                objData.fullName = name;
            }
            if (accessLevel) objData.accessLevel = accessLevel;

            return this.props.onSaveCubeData(rest, this.props.initialValues.key, objData);
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
    loadChilds = (c, props) => {
        return () => {
            if (!this.props[c + 'Options']) {
                this.setState({loading: {...this.state.loading, [c + 'Loading']: true}});
                this.props.getObjChildsByConst(c, props)
                    .then(() => this.setState({loading: {...this.state.loading, [c + 'Loading']: false}}))
                    .catch(err => console.error(err))
            }
        }
    };

    disabledStartDate = (startValue) => {
        const endValue = this.props.fundDendValue;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    };
    disabledEndDate = (endValue) => {
        const startValue = this.props.fundDbegValue;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    };

    componentDidUpdate(prevProps) {
        if (prevProps.initialValues !== this.props.initialValues) {
            this.nameValue = {...this.props.initialValues.name} || {kz: '', ru: '', en: ''};
        }
    }

    taggedSelectToRedux = (val, prevVal) => {
        if (!!val) {
            if (val.length > 0) {
                let coppyPrevVal = [...prevVal]
                let coppyVal = [...val]
                let newArr = [];
                let i;
                let arrState = this.state.optionMultiSelect
                // debugger
                if (coppyPrevVal.length > 0) {
                    for (let i = 0; i < coppyPrevVal.length; i++) {
                        if (coppyPrevVal[i].value === undefined) continue
                        if (coppyPrevVal[i].value.idDataPropVal !== undefined) {
                            let findePrevVal = this.state.optionMultiSelect.find((el) => el.value.idDataPropVal === coppyPrevVal[i].value.idDataPropVal)

                            if (findePrevVal === undefined) {
                                arrState.push(coppyPrevVal[i])
                            }
                        }

                    }

                }
                for (let i = 0; i < coppyVal.length; i++) {

                    if (coppyVal[i].value === undefined) {
                        // let selectArr = this.state.optionMultiSelect;
                        let selectArr = arrState;
                        let findVal = selectArr.find((el) => el.value.value === coppyVal[i])
                        if (findVal !== undefined) {

                            newArr.push(findVal)
                        } else {
                            newArr.push({
                                value: {value: coppyVal[i]}
                            })

                        }
                    }
                }


                if (coppyPrevVal.length > 0) {
                    this.setState({
                        optionMultiSelect: arrState
                    })
                }


                for (i = 0; i < coppyPrevVal.length; i++) {
                    let value = coppyPrevVal[i].value.value;
                    if (coppyVal.indexOf(value) == -1){
                        coppyPrevVal[i].value.value = ""
                        newArr.push(coppyPrevVal[i])
                    }
                }
                let  newArr2 = newArr.filter(function(elem, index, self) {
                    return index === self.indexOf(elem);
                })
                return newArr2

            } else {
                return []
            }
        }
    }
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

    strToRedux = (val, prevVal, obj, prevObj) => {debugger;
        var newVal = {...prevVal};
        if (prevVal === null) {
            let objVal = {
                value: val,
                valueLng: {kz: val},
                valueLng: {ru: val},
                valueLng: {en: val}
            }
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
    checkboxToRedux=(val, prevVal)=>{
        let newVal = {...prevVal};
        if (prevVal === null) {
            let objVal = {
                value: Number(val),
                kFromBase: Number(val)

            }
            return objVal
        } else {
            newVal.value = Number(val)
            newVal.kFromBase= Number(val)


            return (newVal)

        }
    }

    render() {

        if (!this.props.tofiConstants) return null;

        this.lng = localStorage.getItem('i18nextLng');
        const {
            t, handleSubmit, reset, dirty, error, submitting, fundFeatureOptions, caseStorageMultiOptions, rackMultiOptions, sectionMultiOptions, shelfMultiOptions,
            documentTypeOptions, invTypeOptions, accessLevelOptions, invCaseSystemOptions,
            tofiConstants: {
                invNumber,copyQuantity, invDates, invCaseSystem, documentType, invType, invApprovalDate2, invApprovalDate1,
                invTypeValue, invAgreement2Date, fundFeature, invAgreementDate, invTypePerm, invFile, invStorage, invCont,
                agreementProtocol, agreement2Protocol, approvalProtocol, caseStorageMulti, rackMulti, sectionMulti, shelfMulti
            }
        } = this.props;
        const {lang, loading} = this.state;

        return (
            <Form className="antForm-spaceBetween" onSubmit={handleSubmit(this.onSubmit)}
                  style={dirty ? {paddingBottom: '43px'} : {}}>
                {invNumber && <Field
                    name='invNumber'
                    normalize={this.strToRedux}
                    colon
                    component={renderInput}
                    disabled={!!this.props.initialValues.key}
                    label={invNumber.name[this.lng]}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }
                    validate={requiredLng}
                />}
                {invCont &&
                    <Field
                        name="invCont"
                        component={renderCheckbox}
                        format={v => v && v.value}
                        normalize={this.checkboxToRedux}
                        label={invCont.name[this.lng]}
                        formItemLayout={{
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }}
                    />
                }
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
                    name="accessLevel"
                    component={renderSelect}
                    label={t('ACCESS_LEVEL')}
                    normalize={this.selectToRedux}
                    formItemLayout={{
                        labelCol: {span: 10},
                        wrapperCol: {span: 14}
                    }}
                    isSearchable={false}
                    data={accessLevelOptions ? accessLevelOptions.map(option => ({
                        value: option.id,
                        label: option.name[this.lng]
                    })) : []}
                    onMenuOpen={!accessLevelOptions ? this.props.getAccessLevels : undefined}
                    colon={true}
                    validate={requiredLabel}
                />
                {invType && <Field
                    name='invType'
                    component={renderSelect}
                    label={invType.name[this.lng]}
                    normalize={this.selectToRedux}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }
                    onMenuOpen={this.loadOptions('invType')}
                    data={invTypeOptions ? invTypeOptions.map(option => ({
                        value: option.id,
                        label: option.name[this.lng]
                    })) : []}
                    colon
                    validate={requiredLabel}
                />}
                {documentType && <Field
                    name='documentType'
                    component={renderSelect}
                    normalize={this.selectToRedux}
                    label={documentType.name[this.lng]}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }
                    onMenuOpen={this.loadOptions('documentType')}
                    data={documentTypeOptions ? documentTypeOptions.map(option => ({
                        value: option.id,
                        label: option.name[this.lng]
                    })) : []}
                    colon
                    validate={requiredLabel}
                />}
                {invDates && <Field
                    name='invDates'
                    component={renderTaggedSelect}
                    label={invDates.name[this.lng]}

                    // format={val => { val && val.map(str => str.value)}}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }
                     normalize={this.taggedSelectToRedux}

                     colon={true}
                     required={requiredArr}
                />}
                {copyQuantity && <Field
                    name='copyQuantity'
                    normalize={this.strToRedux}
                    component={renderInput}
                    label={copyQuantity.name[this.lng]}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }
                />}
                {fundFeature && <Field
                    name="fundFeature"
                    component={renderSelect}
                    label={fundFeature.name[this.lng]}
                    normalize={this.selectToRedux}
                    formItemLayout={{
                        labelCol: {span: 10},
                        wrapperCol: {span: 14}
                    }}
                    isLoading={loading.fundFeatureLoading}
                    data={fundFeatureOptions ? fundFeatureOptions.map(option => ({
                        value: option.id,
                        label: option.name[this.lng]
                    })) : []}
                    onMenuOpen={this.loadOptions('fundFeature')}
                    validate={requiredLabel}
                    colon={true}
                />}
                {caseStorageMulti && <Field
                    name="caseStorageMulti"
                    component={renderSelect}
                    isMulti
                    normalize={this.selectMultiToRedux}
                    label={caseStorageMulti.name[this.lng]}
                    formItemLayout={{
                        labelCol: {span: 10},
                        wrapperCol: {span: 14}
                    }}
                    isLoading={loading.caseStorageMultiLoading}
                    data={caseStorageMultiOptions ? caseStorageMultiOptions.map(option => ({
                        value: option.id,
                        label: option.name[this.lng]
                    })) : []}
                    onMenuOpen={this.loadOptions('caseStorageMulti')}
                />}
                {rackMulti && <Field
                    name="rackMulti"
                    component={renderSelect}
                    isMulti
                    normalize={this.selectMultiToRedux}
                    label={rackMulti.name[this.lng]}
                    formItemLayout={{
                        labelCol: {span: 10},
                        wrapperCol: {span: 14}
                    }}
                    isLoading={loading.rackMultiLoading}
                    data={rackMultiOptions ? rackMultiOptions.map(option => ({
                        value: option.id,
                        label: option.name[this.lng]
                    })) : []}
                    onMenuOpen={this.loadOptions('rackMulti')}

                />}
                {sectionMulti && <Field
                    name="sectionMulti"
                    component={renderSelect}
                    isMulti
                    normalize={this.selectMultiToRedux}
                    label={sectionMulti.name[this.lng]}
                    formItemLayout={{
                        labelCol: {span: 10},
                        wrapperCol: {span: 14}
                    }}
                    isLoading={loading.sectionMultiLoading}
                    data={sectionMultiOptions ? sectionMultiOptions.map(option => ({
                        value: option.id,
                        label: option.name[this.lng]
                    })) : []}
                    onMenuOpen={this.loadOptions('sectionMulti')}

                />}
                {shelfMulti && <Field
                    name="shelfMulti"
                    component={renderSelect}
                    isMulti
                    normalize={this.selectMultiToRedux}

                    label={shelfMulti.name[this.lng]}
                    formItemLayout={{
                        labelCol: {span: 10},
                        wrapperCol: {span: 14}
                    }}
                    isLoading={loading.shelfMultiLoading}
                    data={shelfMultiOptions ? shelfMultiOptions.map(option => ({
                        value: option.id,
                        label: option.name[this.lng]
                    })) : []}
                    onMenuOpen={this.loadOptions('shelfMulti')}

                />}
                {invCaseSystem && <Field
                    name="invCaseSystem"
                    component={renderSelect}
                    label={invCaseSystem.name[this.lng]}
                    formItemLayout={{
                        labelCol: {span: 10},
                        wrapperCol: {span: 14}
                    }}
                    isLoading={loading.invCaseSystemLoading}
                    data={invCaseSystemOptions ? invCaseSystemOptions.map(option => ({
                        value: option.id,
                        label: option.name[this.lng]
                    })) : []}
                    onMenuOpen={this.loadOptions('invCaseSystem')}
                    validate={requiredLabel}
                    normalize={this.selectToRedux}
                    colon={true}
                />}
                {invAgreementDate && <Field
                    name='invAgreementDate'
                    component={renderDatePicker}
                    disabled={!!this.props.initialValues.key}
                    format={val=> {return val && val.value}}
                    normalize={this.dateToRedux}
                    label={invAgreementDate.name[this.lng]}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }
                />}
                {invAgreement2Date && <Field
                    name='invAgreement2Date'
                    component={renderDatePicker}
                    disabled={!!this.props.initialValues.key}
                    format={val=> {return val && val.value}}
                    normalize={this.dateToRedux}
                    label={invAgreement2Date.name[this.lng]}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }
                />}
                {invApprovalDate1 && <Field
                    name='invApprovalDate1'
                    component={renderDatePicker}
                    disabled={!!this.props.initialValues.key}
                    format={val=> {return val && val.value}}
                    normalize={this.dateToRedux}
                    label={invApprovalDate1.name[this.lng]}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }
                />}
                {invApprovalDate2 && <Field
                    name='invApprovalDate2'
                    component={renderDatePicker}
                    disabled={!!this.props.initialValues.key}
                    format={val=> {return val && val.value}}
                    normalize={this.dateToRedux}
                    label={invApprovalDate2.name[this.lng]}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }
                />}
                {agreementProtocol && <Field
                    name='agreementProtocol'
                    component={renderFileUploadBtn}
                    cubeSConst='CubeForAF_Inv'
                    label={agreementProtocol.name[this.lng]}
                    normalize={this.fileToRedux}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }
                />}
                {agreement2Protocol && <Field
                    name='agreement2Protocol'
                    component={renderFileUploadBtn}
                    cubeSConst='CubeForAF_Inv'
                    normalize={this.fileToRedux}
                    label={agreement2Protocol.name[this.lng]}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }
                />}
                {approvalProtocol && <Field
                    name='approvalProtocol'
                    component={renderFileUploadBtn}
                    normalize={this.fileToRedux}
                    cubeSConst='CubeForAF_Inv'
                    label={approvalProtocol.name[this.lng]}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }
                />}
                {invFile && <Field
                    name='invFile'
                    component={renderFileUploadBtn}
                    normalize={this.fileToRedux}
                    cubeSConst='CubeForAF_Inv'
                    label={invFile.name[this.lng]}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }
                />}
                {/*invStorage && <Field
                    name='invStorage'
                    component={renderInput}
                    disabled

                    label={invStorage.name[this.lng]}
                    formItemLayout={
                        {
                            labelCol: {span: 10},
                            wrapperCol: {span: 14}
                        }
                    }
                />*/}
                {dirty && <Form.Item className="ant-form-btns">
                    <Button className="signup-form__btn" type="primary" htmlType="submit" disabled={submitting}>
                        {submitting ? t('LOADING...') : t('SAVE')}
                    </Button>
                    <Button className="signup-form__btn" type="danger" htmlType="button" disabled={submitting}
                            style={{marginLeft: '10px'}} onClick={reset}>
                        {submitting ? t('LOADING...') : t('CANCEL')}
                    </Button>
                    {error && <span className="message-error"><i className="icon-error"/>{error}</span>}
                </Form.Item>}
            </Form>
        )
    }
}

const selector = formValueSelector('MainInfoFundForm');

export default connect(state => {
    const invTypeValue = selector(state, 'invType');
    return {
        invTypeValue,
        fundFeatureOptions: state.generalData.fundFeature,
        caseStorageMultiOptions: state.generalData.caseStorageMulti,
        rackMultiOptions: state.generalData.rackMulti,
        invTypeOptions: state.generalData.invType,
        sectionMultiOptions: state.generalData.sectionMulti,
        shelfMultiOptions: state.generalData.shelfMulti,
        accessLevelOptions: state.generalData.accessLevel,
        invCaseSystemOptions: state.generalData.invCaseSystem,
        documentTypeOptions: state.generalData.documentType
    }
}, {getAllObjOfCls, getPropVal, getObjByObjVal, getObjChildsByConst})(reduxForm({
    form: 'MainInfoFundForm',
    enableReinitialize: true
})(MainInfoFundForm));
