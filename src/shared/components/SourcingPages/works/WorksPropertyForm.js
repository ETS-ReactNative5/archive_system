import React, { Component } from 'react';
import {Button, Form} from 'antd';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import {
  renderDatePicker, renderInput, renderSelect, renderSelectVirt
} from '../../../utils/form_components';
import {connect} from 'react-redux';
import moment from 'moment';
import {getAllObjOfCls, getObjByObjVal, getPropVal} from '../../../actions/actions';
import {isEqual, pickBy} from 'lodash';
import {requiredLabel} from '../../../utils/form_validations';
import {
  CHECKING_TYPE,
  CUBE_FOR_WORKS,
  DO_FOR_WORKS,
  DP_FOR_WORKS,
  WORK_PRIORITY,
  WORK_STATUS
} from '../../../constants/tofiConstants';
import {SYSTEM_LANG_ARRAY} from "../../../constants/constants";

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
        workAssignedToSourceLoading: false,
        workPriorityLoading: false,
      }
    };
  }

  changeLang = e => {
    this.setState({lang: {...this.state.lang, [e.target.name]: e.target.value}});
  };

  workName = {...this.props.initialValues.workListName} || {kz: '', ru: '', en: ''};

  onSubmit = values => {
    const {workType, ...rest} = pickBy(values, (val, key) => !isEqual(val, this.props.initialValues[key]));
    const cube = {
      cubeSConst: CUBE_FOR_WORKS,
      doConst: DO_FOR_WORKS,
      dpConst: DP_FOR_WORKS
    };
    const name = {};
    SYSTEM_LANG_ARRAY.forEach(lang => {
      name[lang] = (values.workType ? values.workType.label : '') + ' ' +
        (values.workSource ? values.workSource.label : '')
    });
    const obj = {
      name,
      fullName: name,
      clsConst: values.workType.workTypeClass,
    };
    if(!this.props.initialValues.key) {
      return this.props.onCreateObj(
        {cube, obj},
        { values: {
            ...rest,
            workAuthor: String(this.props.user.obj),
            workStatusSource: values.workStatusSource,
            workDate: values.workDate
          }
        })
    }
    obj.doItem = this.props.initialValues.key;
    return this.props.saveProps({cube, obj}, {values: rest}, this.props.tofiConstants);
  };
  loadClsObj = (cArr, dte = moment().format('YYYY-MM-DD')) => {
    return () => {
      cArr.forEach(c => {
        if(!this.props[c + 'Options']) {
          this.setState({loading: { ...this.state.loading ,[c+'Loading']: true }});
          this.props.getAllObjOfCls(c, dte)
            .then(() => this.setState({loading: { ...this.state.loading ,[c+'Loading']: false }}))
        }
      })
    }
  };
  loadOptions = c => {
    return () => {
      if(!this.props[c + 'Options']) {
        this.setState({loading: { ...this.state.loading ,[c+'Loading']: true }});
        this.props.getPropVal(c)
          .then(() => this.setState({loading: { ...this.state.loading ,[c+'Loading']: false }}))
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

    }}
    strToRedux = (val, prevVal, obj, prevObj) => {
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
                newVal.workTypeClass= val.workTypeClass ? val.workTypeClass :''
                newVal.labelFull = val.label;
                return (newVal)
            }

        }
    };



  render() {

    if(!this.props.tofiConstants) return null;

    const lng = localStorage.getItem('i18nextLng');
    const { t, handleSubmit, reset, dirty, error, submitting, workTypeValue, tofiConstants: {workPlannedEndDate, check,
      workPriority, workStatusSource, workSource, workAuthor, workDate, workAssignedTo, checkingType, workStatusOptions,
      workPlannedStartDate}, sourceLPListOptions, checkingTypeOptions, workAssignedToSourceOptions, workPriorityOptions, IK_FUNDMAKER_ACTIVE } = this.props;
    const { loading: { sourceLPListLoading, workAssignedToSourceLoading, workPriorityLoading } } = this.state;

    return (
      <Form className="antForm-spaceBetween" onSubmit={handleSubmit(this.onSubmit)} style={dirty ? {paddingBottom: '43px'} : {}}>
        {/*{workListName && <Field
          name="workListName"
          component={ renderInputLang }
          format={value => (!!value ? value[lang.workListName] : '')}
          parse={value => { this.workName[lang.workListName] = value; return {...this.workName} }}
          label={workListName.name[lng]}
          formItemClass="with-lang"
          changeLang={this.changeLang}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          // validate={requiredLng}
          // colon={true}
        />}*/}
        {/*{workType && <Field
          name="workType"
          component={ renderAsyncSelect }
          isSearchable={false}
          label={workType.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          loadOptions={this.getWorkTypeOptions}
          // validate={required}
          // colon={true}
        />}*/}
        <Field
          name="workType"
          component={ renderSelect }
          disabled={!!this.props.initialValues.key}
          isSearchable={false}
          normalize={this.selectToRedux}

          label={t('WORK_TYPE')}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          data={["createAndEditFundmaker", "createAndEditNomen", "createAndEditInv", "check", "createAndEditDocuments", "createPassport", "advising"]
            .map(cns => ({value: this.props.tofiConstants[cns].id, label: this.props.tofiConstants[cns].name[lng], workTypeClass: cns}))}
          validate={requiredLabel}
          colon={true}
        />
        {workSource && <Field
          name="workSource"
          component={ renderSelectVirt }
          normalize={this.selectToRedux}

          label={workSource.name[lng]}
          optionHeight={40}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          isLoading={sourceLPListLoading}
          onMenuOpen={() => {
            this.loadClsObj(["sourceLPList"])();
            if(!IK_FUNDMAKER_ACTIVE) {
              const fd = new FormData();
              fd.append('clsConst', 'sourceOrgList');
              fd.append('propConst', 'fundmakerOfIK');
              fd.append('propConstOfVal', 'isActive');
              fd.append('idRef', this.props.tofiConstants.isActiveTrue.id);
              fd.append('valueType', 'factorVal');
              this.props.getObjByObjVal(fd, 'IK_FUNDMAKER_ACTIVE')
            }
          }}
          options={sourceLPListOptions && IK_FUNDMAKER_ACTIVE ? [...IK_FUNDMAKER_ACTIVE, ...sourceLPListOptions].map(option => ({value: option.id, label: option.name[lng]})): []}
          validate={requiredLabel}
          colon={true}
        />}

        {workPlannedStartDate && <Field
          name="workPlannedStartDate"
          component={renderDatePicker}
          normalize={this.dateToRedux}

          format={null}
          label={workPlannedStartDate.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
        />}
        {workPlannedEndDate && <Field
          name="workPlannedEndDate"
          component={ renderDatePicker }
          normalize={this.dateToRedux}

          format={null}
          isSearchable={false}
          label={workPlannedEndDate.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
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
          // validate={requiredDate}
          // colon={true}
          isLoading={workAssignedToSourceLoading}
          data={workAssignedToSourceOptions ? workAssignedToSourceOptions.map(option => ({value: option.id, label: option.name[lng]})) : []}
          onMenuOpen={this.loadClsObj(['workAssignedToSource'])}
        />}
        {workPriority && <Field
          name="workPriority"
          component={ renderSelect }
          normalize={this.selectToRedux}

          isSearchable={false}
          label={workPriority.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          isLoading={workPriorityLoading}
          data={workPriorityOptions ? workPriorityOptions.map(option => ({value: option.id, label: option.name[lng]})) : []}
          onMenuOpen={this.loadOptions('workPriority')}
          // validate={requiredLabel}
          // colon={true}
        />}
        {/*{workActualStartDate && <Field
          name="workActualStartDate"
          component={renderDatePicker}
          format={null}
          label={workActualStartDate.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
        />}
        {workActualEndDate && <Field
          name="workActualEndDate"
          component={renderDatePicker}
          format={null}
          label={workActualEndDate.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
        />}
        {acceptanceDate && <Field
          name="acceptanceDate"
          component={renderDatePicker}
          format={null}
          label={acceptanceDate.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
        />}*/}
        {workTypeValue && workTypeValue.value == check.id && checkingType && <Field //eslint-disable-line
          name="checkingType"
          component={ renderSelect }
          normalize={this.selectToRedux}
          isSearchable={false}
          label={checkingType.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          onMenuOpen={this.loadOptions('checkingType')}
          // validate={requiredLabel}
          // colon={true}
          data={checkingTypeOptions ? checkingTypeOptions.map(option => ({value: option.id, label: option.name[lng]})) : []}
        />}
        {workStatusSource && <Field
          name="workStatusSource"
          disabled
          component={ renderSelect }
          isSearchable={false}
          label={workStatusSource.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          onMenuOpen={this.loadOptions('workStatusSource')}
          // validate={requiredLabel}
          // colon={true}
          data={workStatusOptions ? workStatusOptions.map(option => ({value: option.id, label: option.name[lng]})) : []}
        />}
        {workDate && <Field
          name="workDate"
          component={renderDatePicker}
          disabled
          format={null}
          label={workDate.name[lng]}
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
          component={ renderSelect }
          disabled
          placeholder={t('USER_FIO_PLACEHOLDER')}
          label={workAuthor.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        {dirty && <Form.Item className="ant-form-btns">
          <Button className="signup-form__btn" type="primary" htmlType="submit" disabled={submitting}>
            {submitting ? t('LOADING...') : t('SAVE') }
          </Button>
          <Button className="signup-form__btn" type="danger" htmlType="button" disabled={submitting} style={{marginLeft: '10px'}} onClick={reset}>
            {submitting ? t('LOADING...') : t('CANCEL') }
          </Button>
          {error && <span className="message-error"><i className="icon-error" />{error}</span>}
        </Form.Item>}
      </Form>
    )
  }
}

const selector = formValueSelector('WorksPropertyForm');

export default connect(state => {
  const workTypeValue = selector(state, 'workType');
  return {
    workTypeValue,
    user: state.auth.user,
    sourceOrgListOptions: state.generalData['sourceOrgList'],
    sourceLPListOptions: state.generalData['sourceLPList'],
    workAssignedToSourceOptions: state.generalData.workAssignedToSource,
    checkingTypeOptions: state.generalData[CHECKING_TYPE],
    workPriorityOptions: state.generalData[WORK_PRIORITY],
    workStatusOptions: state.generalData[WORK_STATUS],
    IK_FUNDMAKER_ACTIVE: state.generalData.IK_FUNDMAKER_ACTIVE
  }
}, { getAllObjOfCls, getPropVal, getObjByObjVal })(reduxForm({ form: 'WorksPropertyForm', enableReinitialize: true })(WorksPropertyForm));
