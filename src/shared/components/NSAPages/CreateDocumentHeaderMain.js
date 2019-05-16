import React from 'react';
import SelectVirt from "../SelectVirt";
import {
  renderSelect,
  renderInput,
  renderTextarea,
  renderDatePicker,
  renderFileUploadBtn
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

class CreateDocumentHeaderMain extends React.Component{

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

  onChange = (value, label) =>{
    const {onChange} = this.props;
    const {record} = this.state;
    const data = {
      ...record[label],
      value: value,
      valueLng: {
        ru: value,
        kz: value,
        en: value
      }
    };
    this.setState({
      record: {
        ...record,
        [label]: data
      },
    });
    onChange(label, data);
  };
  
  markAsUnkhown(checked, name, value) {
    if (!checked) return;
    this.setState({record: { ...this.state.record, [name]: value }})
    //this.setState({[name]: value})
  }

  render() {
    if(!this.props.tofiConstants) return null;

    this.lng = localStorage.getItem('i18nextLng');
    const { t, tofiConstants, objVidUDOptions, objEventLocationOptions } = this.props;
    const { loading } = this.state;
    
    this.lng = localStorage.getItem('i18nextLng');
    
    const formItemLayoutHalf={labelCol: {span: 9 }, wrapperCol: {span: 14}};
    
    //console.log(objEventLocationOptions);

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
                value={t('ORG_ARCHIVE')}
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
                value={this.props.record.extraInfo.invTypeName[this.lng]}
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
                isLoading={loading.objVidUD}
                onMenuOpen={this.loadOptionsChilds('objVidUD')}
                value={this.state.record.documentType && this.state.record.documentType}
                onChange={(item) => this.onChange(item,'documentType')}
                options={objVidUDOptions ? objVidUDOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
              />
            </FormItem> */}
					</Col>
				</Row>
        <Row gutter={16}>
          <Col span={12}>
            <FormItem 
              label="Автор"
              colon={false}
            >
              <Checkbox 
                disabled={this.state.record.parent !== '0'}
                checked={this.state.record.documentAuthor && this.state.record.documentAuthor.value !== '' ? false : true}
                // onChange={(e) => this.markAsUnkhown(e.target.checked, 'documentAuthor', '')}
                onChange ={(e) => this.onChange(e)}
              >
                не установлен
              </Checkbox>
              <Input
                disabled={this.state.record.parent !== '0'}
                placeholder="Фамилия Имя Отчество" 
                value={this.state.record.documentAuthor ? this.state.record.documentAuthor.value : ''}
                onChange={(e) => this.onChange(e.target.value, 'documentAuthor')}
              />
            </FormItem>        
          </Col>
          <Col span={12}>
            <FormItem 
              label="Адресат или корреспондент"
              colon={false}
            >
              <Checkbox 
                disabled={this.state.record.parent !== '0'}
                checked={this.state.record.addressee && this.state.record.addressee !== '' ? false : true}
                onChange={(e) => this.markAsUnkhown(e.target.checked, 'addressee', '')}
              >
                не установлен
              </Checkbox>
              <Input 
                disabled={this.state.record.parent !== '0'}
                placeholder="Наименование" 
                value={this.state.record.addressee ? this.state.record.addressee.value : ''}
                onChange={(e) => this.onChange(e.target.value, 'addressee')}
              />
            </FormItem>        
          </Col>
				</Row>
        <Row gutter={16}>
          <Col span={5}>
            <FormItem 
              label="Вопрос, предмет, тема"
              colon={false}
            ></FormItem>        
          </Col>
          <Col span={19}>
            <FormItem>
              <TextArea 
                disabled={this.state.record.parent !== '0'}
                autosize={{minRows:2,maxRows:4}}
                placeholder="" 
                value={this.state.record.question ? this.state.record.question.value : ''}
                onChange={(e) => this.onChange(e.target.value, 'question')}
              />
            </FormItem>        
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={5}>
            <FormItem 
              label="Событие"
              colon={false}
            ></FormItem>        
          </Col>
          <Col span={19}>
            <FormItem>
              <Input 
                disabled={this.state.record.parent !== '0'}
                placeholder="" 
                value={this.state.record.event ? this.state.record.event.value : ''}
                onChange={(e) => this.onChange(e.target.value, 'event')}
              />
            </FormItem>        
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={5}>
            <FormItem 
              label="Лицо"
              colon={false}
            ></FormItem>        
          </Col>
          <Col span={19}>
            <FormItem>
              <Input 
                disabled={this.state.record.parent !== '0'}
                placeholder="" 
                value={this.state.record.person ? this.state.record.person.value : ''}
                onChange={(e) => this.onChange(e.target.value, 'person')}
              />
            </FormItem>        
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            {/* <FormItem 
              label="Место события"
              colon={false}
            >
              <Checkbox
                checked={this.state.record.eventLocation === null ? true : false}
                onChange={(e) => this.markAsUnkhown(e.target.checked, 'eventLocation', null)}
              >
                не установлено
              </Checkbox>
              <SelectVirt
                name="eventLocation"
                isSearchable
                optionHeight={40}
                className="long-selected-menu"
                isLoading={loading.objEventLocation}
                onMenuOpen={this.loadOptionsChilds('objEventLocation')}
                value={this.state.record.eventLocation && this.state.record.eventLocation}
                onChange={(item) => this.onChange(item,'eventLocation')}
                options={ objEventLocationOptions ? objEventLocationOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
              />
            </FormItem> */}
            <br/><br/>
            <Field
              name="documentFile"
              component={ renderFileUploadBtn }
              disabled={this.state.record.parent !== '0'}
              formItemClass="classificationInfo_uploadBtn"
              value={this.state.record.documentFile}
              label={'Документ'}
              //onChange={(e) => this.onChangeFile(e, 'documentFile')}
              //onChange={(e) => console.log(e, 'event')}
              formItemLayout={
                {
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }
              }
            />
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
        <br/><br/>
        <Row gutter={16}>
          <Col span={5}>
            <FormItem 
              label="Составитель"
              colon={false}
            ></FormItem>        
          </Col>
          <Col span={19}>
            <FormItem>
              <Input 
                readOnly
                placeholder="" 
                value={this.state.record.surnameOriginator && this.state.record.surnameOriginator.label}
              />
            </FormItem>        
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={5}>
            <FormItem 
              label="Дата изменения"
              colon={false}
            ></FormItem>        
          </Col>
          <Col span={19}>
            <FormItem>
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
    objVidUDOptions: state.generalData.objVidUD,
    objEventLocationOptions: state.generalData.objEventLocation,
  }
}, { getPropVal, getObjChildsByConst })(reduxForm({ form: 'CreateDocumentHeaderMain', enableReinitialize: true })(CreateDocumentHeaderMain));