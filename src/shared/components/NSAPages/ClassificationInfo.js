import React from 'react';
import {Button, Form} from 'antd';
import AntModal from '../AntModal';
import {
  renderSelect,
  renderInput,
  renderTextarea,
  renderDatePicker,
  renderFileUploadBtn
} from "../../utils/form_components";

import {requiredLabel} from "../../utils/form_validations";
import {Field, formValueSelector, reduxForm} from "redux-form";
import { isEmpty, isEqual, map, pickBy, forOwn } from "lodash";
import connect from "react-redux/es/connect/connect";
import {getAllObjOfCls, getObjByObjVal, getPropVal} from "../../actions/actions";
import moment from "moment";

class ClassificationInfo extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      modal: false,
      valuesToSave: {},
      loading: {
        vidGuidebookLoading: false,
        oblastPutevLoading: false,
        rubrikPutevLoading: false,
        
        vidKatalogLoading: false,
        oblastKatalogLoading: false,
        
        vidUkazLoading: false,
        oblastUkazLoading: false,
        rubrikUkazLoading: false,
        
        vidObzoraLoading: false,
        oblastObzorLoading: false,
        
        groupLoading: false,
      }
    }
  }

  loadOptions = c => {
    return () => {
      if(!this.props[c + 'Options']) {
        this.setState({loading: { ...this.state.loading ,[c+'Loading']: true }});
        this.props.getPropVal(c)
          .then(() => this.setState({loading: { ...this.state.loading ,[c+'Loading']: false }}))
      }
    }
  };

  showFieldTheme() {
    const { tofiConstants, vidGuidebookValue, vidKatalogValue, vidObzoraValue, vidUkazValue } = this.props;
    const constNames = ['themGuidFund', 'thematicHistoryOrgKatalog', 'thematicAtdKatalog', 'thematicOtherKatalog', 'subjectThematicUkaz', 'thematicObzor']; 
    
    let fields = [];
    vidGuidebookValue &&  fields.push(vidGuidebookValue.value);
    vidKatalogValue &&    fields.push(vidKatalogValue.value);
    vidObzoraValue &&     fields.push(vidObzoraValue.value);
    vidUkazValue &&       fields.push(vidUkazValue.value);
    
    for (let i=0; i<fields.length; i++) {
      for (let j=0; j<constNames.length; j++) {
        if (fields[i] === tofiConstants[constNames[j]].id) {
          return true;
        }
      }
    }
    return false;
  };

  onSubmit = values => {
    const boolApprovalDateNew = isEmpty(values['approvalDateMetodika']);
    const boolApprovalDateOld = isEmpty(this.props.initialValues['approvalDateMetodika']);
    if (!boolApprovalDateNew && boolApprovalDateOld) {
      // предупреждение о закрытии записи для редактирования
      this.setState({modal:true,valuesToSave:values});
      return;
    }
    return this.props.refreshRecord({...pickBy(values, (val, key) => !isEqual(val, this.props.initialValues[key]))});
  };
  
  submitContinue = () => {
    if (this.state.modal) this.setState({modal:false});
    return this.props.refreshRecord({...pickBy(this.state.valuesToSave, (val, key) => !isEqual(val, this.props.initialValues[key]))});
  };
  closeModal = () => {
    this.setState({modal:false})
  };
    dateToRedux = (val, prev) => {
        {
            let coppyPrev = { ...prev };

            if (!!val) {
                let newDate = moment(val).format("DD-MM-YYYY");
                if (!!coppyPrev.idDataPropVal) {
                    coppyPrev.value = newDate;
                    return coppyPrev;
                } else {
                    return {
                        value: newDate
                    };
                }
            } else {
                if (!!coppyPrev.value) {
                    coppyPrev.value = "";
                    return coppyPrev;
                } else {
                    return {};
                }
            }
        }
    };
    strToRedux = (val, prevVal, obj, prevObj, flag) => {

        if(!!flag){
            val = val.replace(/[^\d;]/g, '')
        }
        var newVal = { ...prevVal };
        if (prevVal === null) {
            let objVal = {
                value: val,
                valueLng: { kz: val },
                valueLng: { ru: val },
                valueLng: { en: val }
            };
            return objVal;
        } else {
            newVal.value = val;
            newVal["valueLng"] = { kz: val, ru: val, en: val };

            return newVal;
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
    selectToRedux = (val, prevVal, obj, prevObj) => {
        if (val !== undefined) {
            if (val === null) {
                let newValNull = { ...prevVal };
                newValNull.label = null;
                newValNull.labelFull = null;
                newValNull.value = null;
                return newValNull;
            } else {
                let newVal = { ...prevVal };
                newVal.value = val.value;
                newVal.label = val.label;
                newVal.labelFull = val.label;
                return newVal;
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
        const {yes,irreparablyDamagedTrue,irreparablyDamagedFalse, no} = this.props.tofiConstants
        if (prevVal === null) {
            let objVal ={}
            if (val=== true ){
                objVal = {
                    value: Number(irreparablyDamagedTrue.id),
                    kFromBase: val

                }
            }else {
                objVal = {
                    value: Number(irreparablyDamagedFalse.id),
                    kFromBase: val
                }
            }

            return (objVal)
        } else {
            if (val=== true ){
                newVal.value = Number(irreparablyDamagedTrue.id)
                newVal.kFromBase= val
            }else {
                newVal.value = Number(irreparablyDamagedFalse.id)
                newVal.kFromBase= val
            }


            return (newVal)

        }
    }
    checkboxToRedux2=(val, prevVal)=>{
        let newVal = {...prevVal};
        const {caseInsuranceTrue, caseInsuranceFalce} = this.props.tofiConstants
        if (prevVal === null) {
            let objVal ={}
            if (val=== true ){
                objVal = {
                    value: Number(caseInsuranceTrue.id),
                    kFromBase: val

                }
            }else {
                objVal = {
                    value: Number(caseInsuranceFalce.id),
                    kFromBase: val
                }
            }

            return (objVal)
        } else {
            if (val=== true ){
                newVal.value = Number(caseInsuranceTrue.id)
                newVal.kFromBase= val
            }else {
                newVal.value = Number(caseInsuranceFalce.id)
                newVal.kFromBase= val
            }


            return (newVal)

        }
    }
    checkboxToRedux3=(val, prevVal)=>{
        let newVal = {...prevVal};
        const {caseFundOfUseTrue, caseFundOfUseFalce} = this.props.tofiConstants
        if (prevVal === null) {
            let objVal ={}
            if (val=== true ){
                objVal = {
                    value: Number(caseFundOfUseTrue.id),
                    kFromBase: val

                }
            }else {
                objVal = {
                    value: Number(caseFundOfUseFalce.id),
                    kFromBase: val
                }
            }

            return (objVal)
        } else {
            if (val=== true ){
                newVal.value = Number(caseFundOfUseTrue.id)
                newVal.kFromBase= val
            }else {
                newVal.value = Number(caseFundOfUseFalce.id)
                newVal.kFromBase= val
            }


            return (newVal)

        }
    }
  render() {
    if(!this.props.tofiConstants) return null;

    this.lng = localStorage.getItem('i18nextLng');
    const { t, tofiConstants, handleSubmit, dirty, submitting, error, record,
            vidGuidebookOptions, oblastPutevOptions, rubrikPutevOptions,
            vidKatalogOptions, oblastKatalogOptions,
            vidUkazOptions, oblastUkazOptions, rubrikUkazOptions,
            vidObzoraOptions, oblastObzorOptions,
            groupOptions,
          } = this.props;
    const { loading } = this.state;
    
    return (
      <Form className="antForm-spaceBetween" onSubmit={handleSubmit(this.onSubmit)} style={dirty ? {paddingBottom: '43px'} : {}}>
        <Field
          name="referenceName"
          disabled={!isEmpty(this.props.initialValues.approvalDateMetodika)}
          component={ renderInput }

          normalize={this.strToRedux}

          label={t('REFERENCE_NAME')}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
        <Field
          name="referenceType"
          component={ renderInput }
          label={t('ARCHIVE_REFERENCE_TYPE')}
          normalize={this.strToRedux}
          disabled
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
        {record && record.referenceType.referenceTypeObj === 'clsPutev' &&
          <span>
            <Field
              name="vidGuidebook"
              component={ renderSelect }
              isDisabled={!isEmpty(this.props.initialValues.approvalDateMetodika)}
              label={tofiConstants.vidGuidebook.name[this.lng]}
              formItemLayout={
                {
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }
              }
              normalize={this.selectToRedux}

              isLoading={loading.vidGuidebookLoading}
              onMenuOpen={this.loadOptions('vidGuidebook')}
              data={vidGuidebookOptions ? vidGuidebookOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
            />
            <Field
              name="oblastPutev"
              component={ renderSelect }
              isDisabled={!isEmpty(this.props.initialValues.approvalDateMetodika)}
              label={tofiConstants.oblastPutev.name[this.lng]}
              formItemLayout={
                {
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }
              }
              normalize={this.selectToRedux}

              isLoading={loading.oblastPutevLoading}
              onMenuOpen={this.loadOptions('oblastPutev')}
              data={oblastPutevOptions ? oblastPutevOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
            />
            <Field
              name="rubrikPutev"
              component={ renderSelect }
              isDisabled={!isEmpty(this.props.initialValues.approvalDateMetodika)}
              label={tofiConstants.rubrikPutev.name[this.lng]}
              formItemLayout={
                {
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }
              }
              normalize={this.selectToRedux}
              isLoading={loading.rubrikPutevLoading}
              onMenuOpen={this.loadOptions('rubrikPutev')}
              data={rubrikPutevOptions ? rubrikPutevOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
            />
          </span>
        }
        {record && record.referenceType.referenceTypeObj === 'clsKatalog' &&
          <span>
            <Field
              name="vidKatalog"
              component={ renderSelect }
              isDisabled={!isEmpty(this.props.initialValues.approvalDateMetodika)}
              label={tofiConstants.vidKatalog.name[this.lng]}
              formItemLayout={
                {
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }
              }
              normalize={this.selectToRedux}

              isLoading={loading.vidKatalogLoading}
              onMenuOpen={this.loadOptions('vidKatalog')}
              data={vidKatalogOptions ? vidKatalogOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
            />
            <Field
              name="oblastKatalog"
              component={ renderSelect }
              isDisabled={!isEmpty(this.props.initialValues.approvalDateMetodika)}
              label={tofiConstants.oblastKatalog.name[this.lng]}
              formItemLayout={
                {
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }
              }
              normalize={this.selectToRedux}

              isLoading={loading.oblastKatalogLoading}
              onMenuOpen={this.loadOptions('oblastKatalog')}
              data={oblastKatalogOptions ? oblastKatalogOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
            />
          </span>
        }
        {record && record.referenceType.referenceTypeObj === 'clsUkaz' &&
          <span>
            <Field
              name="vidUkaz"
              component={ renderSelect }
              isDisabled={!isEmpty(this.props.initialValues.approvalDateMetodika)}
              label={tofiConstants.vidUkaz.name[this.lng]}
              formItemLayout={
                {
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }
              }
              normalize={this.selectToRedux}

              isLoading={loading.vidUkazLoading}
              onMenuOpen={this.loadOptions('vidUkaz')}
              data={vidUkazOptions ? vidUkazOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
            />
            <Field
              name="oblastUkaz"
              component={ renderSelect }
              isDisabled={!isEmpty(this.props.initialValues.approvalDateMetodika)}
              label={tofiConstants.oblastUkaz.name[this.lng]}
              formItemLayout={
                {
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }
              }
              normalize={this.selectToRedux}
              isLoading={loading.oblastUkazLoading}
              onMenuOpen={this.loadOptions('oblastUkaz')}
              data={oblastUkazOptions ? oblastUkazOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
            />
            <Field
              name="rubrikUkaz"
              component={ renderSelect }
              isDisabled={!isEmpty(this.props.initialValues.approvalDateMetodika)}
              label={tofiConstants.rubrikUkaz.name[this.lng]}
              formItemLayout={
                {
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }
              }
              normalize={this.selectToRedux}

              isLoading={loading.rubrikUkazLoading}
              onMenuOpen={this.loadOptions('rubrikUkaz')}
              data={rubrikUkazOptions ? rubrikUkazOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
            />
          </span>
        }
        {record && record.referenceType.referenceTypeObj === 'clsObzor' &&
          <span>
            <Field
              name="vidObzora"
              component={ renderSelect }
              isDisabled={!isEmpty(this.props.initialValues.approvalDateMetodika)}
              label={tofiConstants.vidObzora.name[this.lng]}
              formItemLayout={
                {
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }
              }
              normalize={this.selectToRedux}

              isLoading={loading.vidObzoraLoading}
              onMenuOpen={this.loadOptions('vidObzora')}
              data={vidObzoraOptions ? vidObzoraOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
            />
            <Field
              name="oblastObzor"
              component={ renderSelect }
              isDisabled={!isEmpty(this.props.initialValues.approvalDateMetodika)}
              label={tofiConstants.oblastObzor.name[this.lng]}
              formItemLayout={
                {
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }
              }
              normalize={this.selectToRedux}

              isLoading={loading.oblastObzorLoading}
              onMenuOpen={this.loadOptions('oblastObzor')}
              data={oblastObzorOptions ? oblastObzorOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
            />
          </span>
        }
        <Field
          name="group"
          component={ renderSelect }
          isDisabled={!isEmpty(this.props.initialValues.approvalDateMetodika)}
          label={tofiConstants.group.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          normalize={this.selectToRedux}

          isLoading={loading.groupLoading}
          onMenuOpen={this.loadOptions('group')}
          data={groupOptions ? groupOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
        />
        {this.showFieldTheme() &&
          <Field
          name="theme"
          component={ renderInput }
          autoComplete="off"
          disabled={!isEmpty(this.props.initialValues.approvalDateMetodika)}
          label={tofiConstants.theme.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          normalize={this.strToRedux}

          />
        }
        <Field
          name="goalSprav"
          component={ renderTextarea }
          disabled={!isEmpty(this.props.initialValues.approvalDateMetodika)}
          label={tofiConstants.goalSprav.name[this.lng]}

          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          normalize={this.strToRedux}

        />
        <Field
          name="method"
          component={ renderFileUploadBtn }
          disabled={!isEmpty(this.props.initialValues.approvalDateMetodika)}
          formItemClass="classificationInfo_uploadBtn"
          label={tofiConstants.method.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          normalize={this.fileToRedux}
        />
        <Field
          name="metodikaText"
          component={ renderTextarea }
          disabled={!isEmpty(this.props.initialValues.approvalDateMetodika)}
          label={tofiConstants.metodikaText.name[this.lng]}

          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          normalize={this.strToRedux}

        />
        <Field
          name="approvalDateMetodika"
          component={ renderDatePicker }
          disabled={!isEmpty(this.props.initialValues.approvalDateMetodika)}
          label={tofiConstants.approvalDateMetodika.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          normalize={this.dateToRedux}

        />
        <Field
          name="protocol"
          component={ renderFileUploadBtn }
          disabled={!isEmpty(this.props.initialValues.approvalDateMetodika)}
          formItemClass="classificationInfo_uploadBtn"
          label={tofiConstants.protocol.name[this.lng]}
          normalize={this.fileToRedux}

          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
        <Field
          name="lastChangeDateScheme"
          component={ renderInput }
          label={tofiConstants.lastChangeDateScheme.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          disabled
        />
        <Field
          name="changesAuthor"
          component={ renderInput }
          disabled
          label={tofiConstants.changesAuthor.name[this.lng]}
          format={(val)=>{
              return !!val ? {value:val.label} :""
          }}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }

        />
        {dirty && <Form.Item className="ant-form-btns">
          <Button className="signup-form__btn" type="primary" htmlType="submit" disabled={submitting}>
            {submitting ? t('LOADING...') : t('SAVE') }
          </Button>
          {error && <span className="message-error"><i className="icon-error" />{error}</span>}
        </Form.Item>}
        <AntModal
          onOk={this.submitContinue}
          onCancel={this.closeModal}
          visible={this.state.modal}
          width={400}
          title={'Внимание'}
        >
          <h2>При вводе даты утверждения методики, запись становится недоступна для изменения</h2>
          {/* { modal.type === 'addForm' && <AddNewActForm t={ t }/> } */}
          {/* { modal.type === 'editForm' && <EditActDataForm t={ t }/> } */}
        </AntModal>
      </Form>
    )
  }
}

const selector = formValueSelector('ClassificationInfo');

export default connect(state => {
  const vidGuidebookValue = selector(state, 'vidGuidebook');
  const vidKatalogValue = selector(state, 'vidKatalog');
  const vidObzoraValue = selector(state, 'vidObzora');
  const vidUkazValue = selector(state, 'vidUkaz');
  return {
    vidGuidebookValue,
    vidKatalogValue,
    vidObzoraValue,
    vidUkazValue,
    vidGuidebookOptions: state.generalData.vidGuidebook,
    oblastPutevOptions: state.generalData.oblastPutev,
    rubrikPutevOptions: state.generalData.rubrikPutev,
    
    vidKatalogOptions: state.generalData.vidKatalog,
    oblastKatalogOptions: state.generalData.oblastKatalog,
    
    vidUkazOptions: state.generalData.vidUkaz,
    oblastUkazOptions: state.generalData.oblastUkaz,
    rubrikUkazOptions: state.generalData.rubrikUkaz,
    
    vidObzoraOptions: state.generalData.vidObzora,
    oblastObzorOptions: state.generalData.oblastObzor,

    groupOptions: state.generalData.group,
  }
}, { getPropVal })(reduxForm({ form: 'ClassificationInfo', enableReinitialize: true })(ClassificationInfo));