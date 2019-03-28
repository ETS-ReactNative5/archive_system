import React from 'react';
import SelectVirt from "../SelectVirt";
import {
  renderSelect,
  renderInput,
  renderTextarea,
  renderDatePicker,
  renderFileUpload, renderFileUploadBtn
} from "../../utils/form_components";

import {Button, Form, Input, InputNumber, Radio, Checkbox, DatePicker} from 'antd';
import { Row, Col } from 'antd';
import 'antd/es/col/style/css';
import 'antd/es/row/style/css';

import {requiredLabel} from "../../utils/form_validations";
import {Field, formValueSelector, reduxForm} from "redux-form";
import { isEmpty, isEqual, map, pickBy, forOwn } from "lodash";
import connect from "react-redux/es/connect/connect";
import {getAllObjOfCls, getObjByObjVal, getPropVal, getObjChildsByConst} from "../../actions/actions";
import TextArea from 'antd/lib/input/TextArea';
import RadioGroup from 'antd/lib/radio/group';

const FormItem = Form.Item;

class CreateDocumentHeaderNTD extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
      loading: {},
      record: {},
    }
  }

  componentDidMount() {
    if (this.props.record && !isEqual(this.props.record, this.state.record)) {
      this.setState({ record: this.props.record });
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.record && !isEqual(nextProps.record, this.state.record)) {
      this.setState({ record: nextProps.record });
    }
  }
  
  loadOptionsChilds = c => {
    return () => {
      if(!this.props[c + 'Options']) {
        this.setState({loading: { ...this.state.loading, [c]: true }});
        this.props.getObjChildsByConst(c)
          .then(() => this.setState({loading: { ...this.state.loading ,[c]: false }}))
      }
    }
  };
  
  onChange(value, name) {
    this.setState({record: { ...this.state.record, [name]: value }}, () => {
      this.props.onChange(name, value)
    })
  };

  render() {
    if(!this.props.tofiConstants) return null;

    this.lng = localStorage.getItem('i18nextLng');
    const { t, tofiConstants, objVidNTDOptions } = this.props;
    const { loading } = this.state;
    
    //console.log(tofiConstants);
    
    this.lng = localStorage.getItem('i18nextLng');
    
    const formItemLayoutHalf={labelCol: {span: 12 }, wrapperCol: {span: 12}}

    return (
      <Form className="antForm-spaceBetween">
				<Row gutter={16}>
					<Col span={16}>
            <FormItem
              label="Происхождение документа"
              {...formItemLayoutHalf}
              colon={false}
            >
              <Input
                readOnly
                value={t('ORG_ARCHIVE')}
                />
            </FormItem>        
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={16}>
            <FormItem
              label="Тип описи"
              {...formItemLayoutHalf}
              colon={false}
            >
              <Input
                readOnly
                value={this.props.record.extraInfo.invTypeName[this.lng]}
              />
            </FormItem>        
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={16}>
            <FormItem
              label="Тип документации"
              {...formItemLayoutHalf}
              colon={false}
            >
              <Input
                readOnly
                value={this.props.record.extraInfo.docTypeName[this.lng]}
              />
            </FormItem>        
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={16}>
            {/* <FormItem
              label="Вид документа"
              {...formItemLayoutHalf}
              colon={false}
              >
              <SelectVirt
                name="objVidNTD"
                isSearchable
                optionHeight={40}
                className="long-selected-menu"
                isLoading={loading.objVidNTD}
                onMenuOpen={this.loadOptionsChilds('objVidNTD')}
                value={this.state.record.documentType && this.state.record.documentType}
                onChange={(item) => this.onChange(item,'documentType')}
                options={objVidNTDOptions ? objVidNTDOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
              />
            </FormItem> */}
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={16}>
            <FormItem
              label="Шифр объекта"
              {...formItemLayoutHalf}
              colon={false}
            >
              <Input 
                disabled={this.state.record.parent !== '0'}
                placeholder="" 
                value={this.state.record.objectCode}
                onChange={(e) => this.onChange(e.target.value, 'objectCode')}
              />
            </FormItem>        
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={16}>
            <FormItem
              label="Наименование проекта"
              {...formItemLayoutHalf}
              colon={false}
            >
              <Input 
                disabled={this.state.record.parent !== '0'}
                placeholder="" 
                value={this.state.record.projectName}
                onChange={(e) => this.onChange(e.target.value, 'projectName')}
              />
            </FormItem>        
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={16}>
            <FormItem
              label="Стадия, этап НИР, ОКР"
              {...formItemLayoutHalf}
              colon={false}
            >
              <Input 
                disabled={this.state.record.parent !== '0'}
                placeholder="" 
                value={this.state.record.projectStage}
                onChange={(e) => this.onChange(e.target.value, 'projectStage')}
              />
            </FormItem>        
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={16}>
            <FormItem
              label="Наименование части проекта"
              {...formItemLayoutHalf}
              colon={false}
            >
              <Input 
                disabled={this.state.record.parent !== '0'}
                placeholder="" 
                value={this.state.record.projectPartName}
                onChange={(e) => this.onChange(e.target.value, 'projectPartName')}
              />
            </FormItem>        
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={16}>
            <FormItem
              label="Наименование чертежа"
              {...formItemLayoutHalf}
              colon={false}
            >
              <Input 
                disabled={this.state.record.parent !== '0'}
                placeholder="" 
                value={this.state.record.drawingName}
                onChange={(e) => this.onChange(e.target.value, 'drawingName')}
              />
            </FormItem>        
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={16}>
            <FormItem
              label="Наименование тома"
              {...formItemLayoutHalf}
              colon={false}
            >
              <Input 
                disabled={this.state.record.parent !== '0'}
                placeholder="" 
                value={this.state.record.volumeNumber}
                onChange={(e) => this.onChange(e.target.value, 'volumeNumber')}
              />
            </FormItem>        
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={16}>
            <FormItem
              label="ФИО автора"
              {...formItemLayoutHalf}
              colon={false}
            >
              <Input 
                disabled={this.state.record.parent !== '0'}
                placeholder="" 
                value={this.state.record.documentNTDFIO}
                onChange={(e) => this.onChange(e.target.value, 'documentNTDFIO')}
              />
            </FormItem>        
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={16}>
            <FormItem
              label="Год окончания разработки"
              {...formItemLayoutHalf}
              colon={false}
            >
              <InputNumber 
                disabled={this.state.record.parent !== '0'}
                min={0}
                value={this.state.record.yearOfCompletion}
                //onChange={(e) => console.log(e)}
                onChange={(value) => this.onChange(String(value), 'yearOfCompletion')}
              />
            </FormItem>        
					</Col>
				</Row>
        <br/><br/>
        <Row gutter={16}>
          <Col span={8}>
            <Field
              name="documentFile"
              component={ renderFileUploadBtn }
              disabled={this.state.record.parent !== '0'}
              formItemClass="classificationInfo_uploadBtn"
              value={this.state.record.documentFile}
              label={'Документ'}
              formItemLayout={
                {
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }
              }
            />
          </Col>
				</Row>
        <br/><br/>
				<Row gutter={16}>
					<Col span={16}>
            <FormItem
              label="Составитель"
              {...formItemLayoutHalf}
              colon={false}
            >
              <Input 
                readOnly
                placeholder="" 
                value={this.state.record.surnameOriginator && this.state.record.surnameOriginator.label}
              />
            </FormItem>        
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={16}>
            <FormItem
              label="Дата изменения"
              {...formItemLayoutHalf}
              colon={false}
            >
              <Input 
                readOnly
                placeholder="" 
                value={this.state.record.nomenLastChangeDate && this.state.record.nomenLastChangeDate.format('DD-MM-YYYY')}
              />
            </FormItem>
					</Col>
				</Row>
      </Form>      
    )
  }
}

export default connect(state => {
  return {
    objVidNTDOptions: state.generalData.objVidNTD,
  }
}, { getPropVal, getObjChildsByConst })(reduxForm({ form: 'CreateDocumentHeaderNTD', enableReinitialize: true })(CreateDocumentHeaderNTD));
