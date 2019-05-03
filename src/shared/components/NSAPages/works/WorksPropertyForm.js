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
import {requiredLabel} from '../../../utils/form_validations';
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
      lang: {
        workListName: localStorage.getItem('i18nextLng'),
      },
      loading: {
        sourceOrgListLoading: false,
        sourceLPListLoading: false,
        workAssignedToNIDLoading: false,
        workPriorityLoading: false,
      }
    };
  }

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
    if (!this.props.initialValues.key) {
      return this.props.onCreateObj(
        {cube, obj},
        {
          values: {
            ...rest,
            workAuthor: String(values.workAuthor.value),
            nsaWorkStatus: values.nsaWorkStatus,
          }
        })
    }
    obj.doItem = this.props.initialValues.key;
    return this.props.saveProps({cube, obj}, {values: rest}, this.props.tofiConstants);
  };
  loadClsObj = (cArr, dte = moment().format('YYYY-MM-DD')) => {
    return () => {
      cArr.forEach(c => {
        if (!this.props[c + 'Options']) {
          this.setState({loading: {...this.state.loading, [c + 'Loading']: true}});
          this.props.getAllObjOfCls(c, dte)
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

  render() {
    if (!this.props.tofiConstants) return null;

    const lng = localStorage.getItem('i18nextLng');
    const {
      t, handleSubmit, reset, dirty, error, submitting, workTypeValue, fundArchiveValue, fundArchiveOptions,
      workAssignedToNIDOptions, workPriorityOptions, directoryTypeOptions,
      tofiConstants: { workPlannedEndDate, fundArchive, tookUser, workPriority, nsaWorkStatus, workRegInv,
        workAuthor, workDate, workAssignedTo, nsaWorkStatusOptions, dateAppointment, appointedUser,
        workPlannedStartDate, workRegFund, created, appointed, workRegCase, directoryType, nameDirectory
      }
    } = this.props;
    const { workRegFundOptions,
      loading: {workAssignedToNIDLoading, workPriorityLoading, fundArchiveLoading}} = this.state;

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
          data={['creatingArchiveReference', 'descriptionOfCases', 'descriptionOfFunds', 'documentDescpiption', 'inventoryEditing', 'inventoryProcessing']
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
          onMenuOpen={this.loadOptions('workPriority')}
        />}
        {nsaWorkStatus && <Field
          name="nsaWorkStatus"
          disabled
          normalize={this.selectToRedux}
          component={renderSelect}
          isSearchable={false}
          label={nsaWorkStatus.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
          onMenuOpen={this.loadOptions('nsaWorkStatus')}
          data={nsaWorkStatusOptions ? nsaWorkStatusOptions.map(option => ({value: option.id, label: option.name[lng]})) : []}
        />}
        {workDate && <Field
          name="workDate"
          colon={true}
          normalize={this.dateToRedux}
          component={renderDatePicker}
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
          format={null}
          normalize={this.dateToRedux}
          label={dateAppointment.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
        />}
        <FormItem>
          <h3>{t('WORK_OBJECT')}</h3>
          <hr/>
        </FormItem>
        {fundArchive && !['creatingArchiveReference'].includes(workTypeValue.workTypeClass) && <Field
          name="fundArchive"
          normalize={this.selectToRedux}
          component={renderSelect}
          label={fundArchive.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
          validate={requiredLabel}
          colon={true}
          isLoading={fundArchiveLoading}
          data={fundArchiveOptions ? fundArchiveOptions.map(option => ({
            value: option.id,
            label: option.name[lng]
          })) : []}
          onMenuOpen={this.loadOptions('fundArchive')}
        />}
        {workRegFund && ['inventoryProcessing', 'descriptionOfCases', 'documentDescpiption', 'inventoryEditing']
          .includes(workTypeValue.workTypeClass) && <Field
          name="workRegFund"
          disabled={!!this.props.initialValues.workActualStartDate || !fundArchiveValue}
          component={ renderSelectVirt }
          normalize={this.selectToRedux}
          matchProp="label"
          matchPos="start"
          label={workRegFund.name[lng]}
          optionHeight={40}
          formItemLayout={{
            labelCol: { span: 10 },
            wrapperCol: { span: 14 }
          }}
          isLoading={!!this.state.workRegFundLoading}
          onMenuOpen={ () => {
            const fd = new FormData();
            fd.append('clsConsts', 'fundOrg,fundLP,collectionOrg,collectionLP,jointOrg,jointLP');
            fd.append('propConst', 'fundArchive');
            fd.append('withProps', 'fundNumber,fundIndex,fundFeature');
            fd.append('value', fundArchiveValue.value);
            this.setState({ workRegFundLoading: true });
            getObjByProp(fd)
              .then(res => {
                this.setState({ workRegFundLoading: false });
                if(res.success) {
                  this.setState({ workRegFundOptions: res.data.filter(option => option.fundFeature.idRef == this.props.tofiConstants.included.id) })
                } else {
                  throw res
                }
              }).catch(err => {
                this.setState({ workRegFundLoading: false });
                console.error(err)
            })
          } }
          options={workRegFundOptions ? workRegFundOptions
              .map(opt => ({
                value: opt.id,
                label: `${opt.fundNumber[lng]+opt.fundIndex[lng]} - ${opt.name[lng]}`})
              )
              : []}
          validate={requiredLabel}
          colon={true}
        />}
        {workRegInv && ['descriptionOfCases', 'documentDescpiption', 'inventoryEditing'].includes(workTypeValue.workTypeClass) && <Field
          name="workRegInv"
          component={ renderSelectVirt }
          normalize={this.selectToRedux}
          matchProp="label"
          matchPos="start"
          label={workRegInv.name[lng]}
          disabled={!this.props.workRegFundValue || !!this.props.initialValues.workActualStartDate}
          optionHeight={40}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          isLoading={this.state.loading.workRegInvLoading}
          onMenuOpen={() => {
            const fd = new FormData();
            fd.append('clsConsts', 'invList');
            fd.append('propConst', 'invFund');
            fd.append('withProps', 'invNumber,fundFeature');
            fd.append('value', this.props.workRegFundValue.value);
            getObjByProp(fd)
              .then(res => {
                if(res.success) {
                  this.setState({ workRegInvOptions: res.data.filter(option => option.fundFeature.idRef == this.props.tofiConstants.included.id) })
                } else {
                  throw res
                }
              }).catch(err => console.log(err))
          }}
          options={this.state.workRegInvOptions ?
            this.state.workRegInvOptions
              .map(option => ({value: option.id, label: `${option.invNumber[lng]} - ${option.name[lng]}`})) :
            []}
          validate={requiredLabel}
          colon={true}
        />}
        {workRegCase && ['documentDescpiption'].includes(workTypeValue.workTypeClass) && <Field
          name="workRegCase"
          component={ renderSelectVirt }
          normalize={this.selectMultiToRedux}
          matchProp="label"
          matchPos="start"
          label={workRegCase.name[lng]}
          disabled={!this.props.workRegInvValue || !!this.props.initialValues.workActualStartDate}
          optionHeight={40}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          isLoading={this.state.loading.workRegCaseLoading}
          onMenuOpen={() => {
            const fd = new FormData();
            fd.append('clsConsts', 'caseList');
            fd.append('propConst', 'caseInventory');
            fd.append('withProps', 'fundNumber,fundFeature');
            fd.append('value', this.props.workRegInvValue.value);
            getObjByProp(fd)
              .then(res => {
                if(res.success) {
                  this.setState({ workRegCaseOptions: res.data.filter(option => option.fundFeature.idRef == this.props.tofiConstants.included.id) })
                } else {
                  throw res
                }
              }).catch(err => console.log(err))
          }}
          options={this.state.workRegCaseOptions ?
            this.state.workRegCaseOptions
              .map(option => ({value: option.id, label: `${option.fundNumber[lng]} - ${option.name[lng]}`})) :
            []}
          validate={requiredLabel}
          colon={true}
        />}
        {directoryType && ['creatingArchiveReference'].includes(workTypeValue.workTypeClass) && <Field
          name="directoryType"
          component={renderSelect}
          normalize={this.selectToRedux}
          label={directoryType.name[lng]}
          formItemLayout={{
            labelCol: {span: 10},
            wrapperCol: {span: 14}
          }}
          isLoading={!!this.state.directoryTypeLoading}
          data={directoryTypeOptions ?
            directoryTypeOptions.map(opt => ({value: opt.id, label: opt.name[lng]})) : []}
          onMenuOpen={this.loadOptions(['directoryType'])}
        />}
        {nameDirectory && ['creatingArchiveReference'].includes(workTypeValue.workTypeClass) && <Field
          name="nameDirectory"
          component={renderInput}
          normalize={this.strToRedux}
          label={nameDirectory.name[lng]}
          formItemLayout={{
            labelCol: {span: 10},
            wrapperCol: {span: 14}
          }}
        />}
        <FormItem>
          <h3>{t('PARTICIPANTS')}</h3>
          <hr/>
        </FormItem>
        {workAuthor && <Field
          name="workAuthor"
          component={renderSelect}
          disabled
          normalize={this.selectToRedux}
          label={workAuthor.name[lng]}
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
          normalize={this.selectToRedux}
          label={workAssignedTo.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
          onChange={(e, newValue) => {
            const user = this.props.user;
            if (newValue) {
              this.props.change('appointedUser', {value: user.obj, label: user.name,
                  idDataPropVal: this.props.nsaWorkStatusIDDpv.WorksPropertyForm.values.appointedUser &&
                  this.props.nsaWorkStatusIDDpv.WorksPropertyForm.values.appointedUser.idDataPropVal});
              this.props.change('nsaWorkStatus', {value: appointed.id, label: appointed.name[lng],
                  idDataPropVal:this.props.nsaWorkStatusIDDpv.WorksPropertyForm.values.nsaWorkStatus.idDataPropVal})
            } else {
              this.props.change('appointedUser', null);
              this.props.change('nsaWorkStatus', {value: created.id, label: created.name[lng]})
            }
          }}
          isLoading={workAssignedToNIDLoading}
          data={workAssignedToNIDOptions ? workAssignedToNIDOptions.map(option => ({
            value: option.id,
            label: option.name[lng]
          })) : []}
          onMenuOpen={this.loadClsObj(['workAssignedToNID'])}
        />}
        {appointedUser && <Field
          name="appointedUser"
          component={renderSelect}
          normalize={this.selectToRedux}
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
          disabled
          label={tookUser.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
        />}
        <FormItem>
          <h3>{t('PLANNED_DATES')}</h3>
          <hr/>
        </FormItem>
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
          component={renderDatePicker}
          normalize={this.dateToRedux}
          format={null}
          label={workPlannedEndDate.name[lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
        />}
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

const selector = formValueSelector('WorksPropertyForm');

function mapStateToProps(state) {
  const workTypeValue = selector(state, 'workType') || {};
  const fundArchiveValue = selector(state, 'fundArchive');
  const workRegFundValue = selector(state, 'workRegFund');
  const workRegInvValue = selector(state, 'workRegInv');
  return {
    workTypeValue,
    fundArchiveValue,
    workRegFundValue,
    workRegInvValue,
    user: state.auth.user,
    fundArchiveOptions: state.generalData.fundArchive,
    workAssignedToNIDOptions: state.generalData.workAssignedToNID,
    workPriorityOptions: state.generalData[WORK_PRIORITY],
    directoryTypeOptions: state.generalData.directoryType,
    nsaWorkStatusOptions: state.generalData.nsaWorkStatus,
      nsaWorkStatusIDDpv:state.form
  }
}

export default connect(mapStateToProps, {getAllObjOfCls, getPropVal, getObjByObjVal})(reduxForm({
  form: 'WorksPropertyForm',
  enableReinitialize: true
})(WorksPropertyForm));
