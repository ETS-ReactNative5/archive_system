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
          label={t('REFERENCE_NAME')}
          readOnly={true}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
        <Field
          name="referenceType"
          disabled={!isEmpty(this.props.initialValues.approvalDateMetodika)}
          component={ renderInput }
          label={t('ARCHIVE_REFERENCE_TYPE')}
          readOnly={true}
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
        />
        <Field
          name="protocol"
          component={ renderFileUploadBtn }
          disabled={!isEmpty(this.props.initialValues.approvalDateMetodika)}
          formItemClass="classificationInfo_uploadBtn"
          label={tofiConstants.protocol.name[this.lng]}
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
          disabled={!isEmpty(this.props.initialValues.approvalDateMetodika)}
          label={tofiConstants.lastChangeDateScheme.name[this.lng]}
          readOnly={true}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
        <Field
          name="changesAuthor"
          component={ renderInput }
          disabled={!isEmpty(this.props.initialValues.approvalDateMetodika)}
          label={tofiConstants.changesAuthor.name[this.lng]}
          readOnly={true}
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