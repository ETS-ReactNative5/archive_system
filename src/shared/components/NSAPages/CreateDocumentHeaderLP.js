import React from 'react';
import SelectVirt from "../SelectVirt";
import {
  renderSelect,
  renderInput,
  renderTextarea,
  renderDatePicker,
  renderFileUpload, renderFileUploadBtn
} from "../../utils/form_components";

import {Button, Form, Input, Radio, Checkbox, DatePicker} from 'antd';
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

class ClassificationInfo extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
      loading: {},
      objVidLPD: {},
      eventLocation: {value:'value',label:'label'},
    }
  }
  
  loadOptionsChilds = c => {
    return () => {
      if(!this.props[c + 'Options']) {
        this.setState({loading: { ...this.state.loading ,[c]: true }});
        this.props.getObjChildsByConst(c)
          .then(() => this.setState({loading: { ...this.state.loading ,[c]: false }}))
      }
    }
  };
  
  markAsUnkhown(checked, name, value) {
    if (!checked) return;
    this.setState({[name]: value})
  }

  render() {
    if(!this.props.tofiConstants) return null;

    this.lng = localStorage.getItem('i18nextLng');
    const { t, tofiConstants, objVidLPDOptions, objEventLocationOptions } = this.props;
    const { loading } = this.state;
    
    this.lng = localStorage.getItem('i18nextLng');
    
    const formItemLayoutHalf={labelCol: {span: 9 }, wrapperCol: {span: 14}}
    
    return (
      <Form className="antForm-spaceBetween">
				<Row gutter={16}>
					<Col span={12}>
              <FormItem
              label="Происхождение документа"
              {...formItemLayoutHalf}
              colon={false}
            >
              <Input
                readOnly
                value={t('LP_ARCHIVE')}
              />
            </FormItem>        
					</Col>
					<Col span={12}>
            <FormItem
              label="Тип описи"
              {...formItemLayoutHalf}
              colon={false}
            >
              <Input
                readOnly
              />
            </FormItem>        
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={12}>
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
					<Col span={12}>
            {/* <FormItem
              label="Вид документа"
              {...formItemLayoutHalf}
              colon={false}
            >
              <SelectVirt
                name="objVidUD"
                isSearchable
                optionHeight={40}
                className="long-selected-menu"
                isLoading={loading.objVidLPD}
                onMenuOpen={this.loadOptionsChilds('objVidLPD')}
                value={this.state.documentType && this.state.documentType}
                //onChange={(item) => this.onChangeFundmakerArchive(item)}
                options={objVidLPDOptions ? objVidLPDOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
              />
            </FormItem> */}
					</Col>
				</Row>
        <br/>
				<Row gutter={16}>
					<Col span={12}>
            <FormItem
              label="Фамилия"
              {...formItemLayoutHalf}
              colon={false}
            >
              <Input />
            </FormItem>        
					</Col>
					<Col span={12}>
            <FormItem
              label="Общественное положение"
              {...formItemLayoutHalf}
              colon={false}
            >
              <Input />
            </FormItem>        
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={12}>
            <FormItem
              label="Имя"
              {...formItemLayoutHalf}
              colon={false}
            >
              <Input />
            </FormItem>        
					</Col>
					<Col span={12}>
            <FormItem
              label="Национальность"
              {...formItemLayoutHalf}
              colon={false}
            >
              <Input />
            </FormItem>        
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={12}>
            <FormItem
              label="Отчество"
              {...formItemLayoutHalf}
              colon={false}
            >
              <Input />
            </FormItem>        
					</Col>
				</Row>
        <br/>        
        <Row gutter={16}>
          <Col span={8}>
            {/* <FormItem 
              label="Место события"
              colon={false}
            >
              <Checkbox
                checked={this.state.eventLocation === null ? true : false}
                onChange={(e) => this.markAsUnkhown(e.target.checked, 'eventLocation', null)}
              >
                не установлено
              </Checkbox>
              <SelectVirt
                name="objVidUD"
                isSearchable
                optionHeight={40}
                className="long-selected-menu"
                isLoading={loading.objEventLocation}
                onMenuOpen={this.loadOptionsChilds('objEventLocation')}
                value={this.state.eventLocation && this.state.eventLocation}
                //onChange={(item) => this.onChangeFundmakerArchive(item)}
                options={objEventLocationOptions ? objEventLocationOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
              />
            </FormItem> */}
            <br/><br/>
            <Button>Прикрепить документ</Button>
          </Col>
          <Col span={4} offset={4}>
            {/* <FormItem 
              label="Дата события"
              colon={false}
            >
              <RadioGroup>
                <Radio style={{display:'block'}} value={1}>без даты</Radio>
                <Radio style={{display:'block'}} value={2}>явная дата</Radio>
                <Radio style={{display:'block'}} value={3}>неявная дата</Radio>
              </RadioGroup>
            </FormItem>        
            <FormItem>
              <Col span={22} offset={2}>
                <RadioGroup>
                  <Radio style={{display:'block'}} value={1}>не раннее</Radio>
                  <Radio style={{display:'block'}} value={2}>не позднее</Radio>
                  <Radio style={{display:'block'}} value={3}>не точно</Radio>
                </RadioGroup>
              </Col>
            </FormItem> */}
          </Col>
          <Col span={6}>
            <br/><br/>
            {/* <FormItem>
              <DatePicker
                format="DD-MM-YYYY"
              />
            </FormItem> */}
          </Col>
				</Row>
      </Form>      
    )
  }
}

export default connect(state => {
  return {
    objVidLPDOptions: state.generalData.objVidLPD,
    objEventLocationOptions: state.generalData.eventLocation,
  }
}, { getPropVal, getObjChildsByConst })(ClassificationInfo);