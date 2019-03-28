import React, { Component } from 'react';
import {Button, Form, Table} from 'antd';
import { Field, reduxForm, initialize } from 'redux-form';
import {
  renderCheckbox, renderDatePicker, renderInput} from '../../../utils/form_components';
import {isEmpty} from 'lodash';
import {parseCube_new} from '../../../utils/cubeParser';

/*eslint eqeqeq:0*/
class ProviderInfo extends Component {

  state = {
    data: []
  };

  onSubmit = values => {
    console.log(values)
  };

  componentDidMount() {
    if(this.props.orgSourceCube) {
      const { doForOrgSource, dpForOrgSource } = this.props.tofiConstants;
      this.setState({
        data: parseCube_new(
          this.props.orgSourceCube['cube'],
          [],
          'dp',
          'do',
          this.props.orgSourceCube[`do_${doForOrgSource.id}`],
          this.props.orgSourceCube[`dp_${dpForOrgSource.id}`],
          `do_${doForOrgSource.id}`,
          `dp_${dpForOrgSource.id}`)[0] //only one element
      }, () => {
        const {dispatch, tofiConstants: {applicationDate, agreementDate, receiptDate, isDocumentsReceived, isFundDocsReceived, isFundProcessed,
          FundProcessedDate, assignedFundNumber, numberOfProcessedDocs, numberOfUnprocessedDocs, numberOfDescribedCases, numberOfEmployees} } = this.props;

        const applicationDateObj = this.state.data.props.find(element => element.prop == applicationDate.id),
          agreementDateObj = this.state.data.props.find(element => element.prop == agreementDate.id),
          receiptDateObj = this.state.data.props.find(element => element.prop == receiptDate.id),
          isDocumentsReceivedObj = this.state.data.props.find(element => element.prop == isDocumentsReceived.id),
          isFundDocsReceivedObj = this.state.data.props.find(element => element.prop == isFundDocsReceived.id),
          isFundProcessedObj = this.state.data.props.find(element => element.prop == isFundProcessed.id),
          FundProcessedObjDate= this.state.data.props.find(element => element.prop == FundProcessedDate.id),
          assignedFundNumberObj = this.state.data.props.find(element => element.prop == assignedFundNumber.id),
          numberOfProcessedDocsObj = this.state.data.props.find(element => element.prop == numberOfProcessedDocs.id),
          numberOfUnprocessedDocsObj = this.state.data.props.find(element => element.prop == numberOfUnprocessedDocs.id),
          numberOfDescribedCasesObj = this.state.data.props.find(element => element.prop == numberOfDescribedCases.id),
          numberOfEmployeesObj = this.state.data.props.find(element => element.prop == numberOfEmployees.id);

        const initialValues = {
          applicationDate: applicationDateObj ? applicationDateObj.refId || '' : '',
          agreementDate: agreementDateObj ? agreementDateObj.value || '' : '',
          receiptDate: receiptDateObj ? receiptDateObj.value || '' : '',
          isDocumentsReceived: isDocumentsReceivedObj ? isDocumentsReceivedObj.value || '' : '',
          isFundDocsReceived: isFundDocsReceivedObj ? isFundDocsReceivedObj.refId || '' : '',
          isFundProcessed: isFundProcessedObj ? isFundProcessedObj.refId || '' : '',
          FundProcessedDate: FundProcessedObjDate? FundProcessedObjDate.refId || '' : '',
          assignedFundNumber: assignedFundNumberObj ? assignedFundNumberObj.refId || '' : '',
          numberOfProcessedDocs: numberOfProcessedDocsObj ? numberOfProcessedDocsObj.refId || '' : '',
          numberOfUnprocessedDocs: numberOfUnprocessedDocsObj ? numberOfUnprocessedDocsObj.refId || '' : '',
          numberOfDescribedCases: numberOfDescribedCasesObj ? numberOfDescribedCasesObj.refId || '' : '',
          numberOfEmployees: numberOfEmployeesObj ? numberOfEmployeesObj.value || '' : ''
        };
        dispatch(initialize('ProviderInfo', initialValues));
      })
    }
  }

  render() {
    if(isEmpty(this.props.tofiConstants)) return null;
    this.lng = localStorage.getItem('i18nextLng');
    const { t, handleSubmit, dirty, submitting, error, reset, tofiConstants: {applicationDate, agreementDate, receiptDate, isDocumentsReceived, isFundDocsReceived, isFundProcessed,
      FundProcessedDate, assignedFundNumber, numberOfProcessedDocs, numberOfUnprocessedDocs, numberOfDescribedCases} } = this.props;

    return (
      <div className="ProviderInfo">
        <Form className="antForm-spaceBetween" onSubmit={handleSubmit(this.onSubmit)}>
          {applicationDate && <Field
            name="applicationDate"
            component={ renderDatePicker }
            format={null}
            isSearchable={false}
            label={applicationDate.name[this.lng]}
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            // validate={required}
            // colon={true}
          />}
          {agreementDate && <Field
            name="agreementDate"
            component={ renderDatePicker }
            format={null}
            isSearchable={false}
            label={agreementDate.name[this.lng]}
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
          />}
          {receiptDate && <Field
            name="receiptDate"
            component={ renderDatePicker }
            format={null}
            isSearchable={false}
            label={receiptDate.name[this.lng]}
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
          />}
          {isDocumentsReceived && <Field
            name="isDocumentsReceived"
            component={ renderCheckbox }
            label={isDocumentsReceived.name[this.lng]}
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
          />}
          {isFundDocsReceived && <Field
            name="isFundDocsReceived"
            component={ renderCheckbox }
            label={isFundDocsReceived.name[this.lng]}
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            // validate={requiredLabel}
            // colon={true}
          />}
          <Form.Item><h2>{t('FUND_STATE')}</h2></Form.Item>
          {isFundProcessed && <Field
            name="isFundProcessed"
            component={ renderCheckbox }
            label={isFundProcessed.name[this.lng]}
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            // validate={requiredLabel}
            // colon={true}
          />}
          {FundProcessedDate && <Field
            name="FundProcessedDate"
            component={ renderDatePicker }
            format={null}
            isSearchable={false}
            label={FundProcessedDate.name[this.lng]}
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            // validate={requiredLabel}
            // colon={true}
          />}
          {assignedFundNumber && <Field
            name="assignedFundNumber"
            component={renderInput}
            label={assignedFundNumber.name[this.lng]}
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            // validate={requiredDate}
            // colon={true}
          />}
          {numberOfProcessedDocs && <Field
            name="numberOfProcessedDocs"
            component={renderInput}
            label={numberOfProcessedDocs.name[this.lng]}
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            // validate={requiredDate}
            // colon={true}
          />}
          {numberOfUnprocessedDocs && <Field
            name="numberOfUnprocessedDocs"
            component={renderInput}
            label={numberOfUnprocessedDocs.name[this.lng]}
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            // validate={requiredDate}
            // colon={true}
          />}
          {numberOfDescribedCases && <Field
            name="numberOfDescribedCases"
            component={renderInput}
            label={numberOfDescribedCases.name[this.lng]}
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            // validate={requiredDate}
            // colon={true}
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
        <Table
          bordered
          size='small'
          pagination={false}
          columns={[
            {
              key: 'indicators',
              title: t('INDICATORS'),
              dataIndex: 'indicators',
              width: '70%'
            },
            {
              key: 'quantity',
              title: t('QUANTITY'),
              dataIndex: 'quantity',
              width: '30%'
            }
          ]}
          dataSource={[
            {
              key: 'acceptedDocs',
              indicators: 'Количество принятых документов',
            },
            {
              key: 'paperDocs',
              indicators: 'документы на бумажной основе',
            },
            {
              key: 'photoDocsPos',
              indicators: 'фотодокументы позитивы',
            },
            {
              key: 'photoDocsNeg',
              indicators: 'фотодокументы негативы',
            },
            {
              key: 'photoAlbum',
              indicators: 'фото в альбомах',
            },
            {
              key: 'audioDocs',
              indicators: 'аудиодокументы',
            },
            {
              key: 'videoDocs',
              indicators: 'видеодокументы',
            },
            {
              key: 'acceptedEDocs',
              indicators: 'Количество принятых электронных документов',
            },
            {
              key: 'acceptedFiles',
              indicators: 'Количество принятых файлов электронных документов',
            },
            {
              key: 'acceptedEDocsSize',
              indicators: 'Объем принятых электронных документов (Мб)',
            },
          ]}
        />
      </div>
    )
  }
}

export default reduxForm({ form: 'ProviderInfo', enableReinitialize: true })(ProviderInfo);
