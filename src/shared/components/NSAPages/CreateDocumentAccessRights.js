import React from 'react';
import {Button, Form, Input, Checkbox} from 'antd';
import Select from '../Select';
import {
  renderSelect,
  renderInput,
  renderTextarea,
  renderDatePicker,
  renderFileUpload, renderFileUploadBtn
} from "../../utils/form_components";

import {requiredLabel} from "../../utils/form_validations";
import {Field, formValueSelector, reduxForm} from "redux-form";
import { isEmpty, isEqual, map, pickBy, forOwn } from "lodash";
import connect from "react-redux/es/connect/connect";
import {getAllObjOfCls, getObjByObjVal, getPropVal} from "../../actions/actions";
import TextArea from 'antd/lib/input/TextArea';
import SelectVirt from '../SelectVirt';

const FormItem = Form.Item;

class ClassificationInfo extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
      record: {},
      loading: {},
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
  
  isIncludedToReferences = () => {
    const { record } = this.props;
    const linkToKatalogBool = (record && record.linkToKatalog && record.linkToKatalog && record.linkToKatalog.length > 0);
    const linkToUkazBool = (record && record.linkToUkaz && record.linkToUkaz && record.linkToUkaz.length > 0);
    const linkToObzorBool = (record && record.linkToObzor && record.linkToObzor && record.linkToObzor.length > 0);
    return linkToKatalogBool || linkToUkazBool || linkToObzorBool;
  }
  
  onChange(value, name) {
    this.setState({record: { ...this.state.record, [name]: value }}, () => {
      this.props.onChange(name, value)
    })
  };
  
  render() {
    if(!this.props.tofiConstants) return null;
    
    this.lng = localStorage.getItem('i18nextLng');

    const { t, tofiConstants, caseList, record, propAuthenticityOptions, typeOfPaperCarrierOptions } = this.props;
    const { loading } = this.state;
    const formItemLayout={
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 20
      },
    }    
    const propAuthenticityOptions1 = [
      {value:'1402', label:this.props.tofiConstants['FvOriginal'].name[this.lng]},
      {value:'1403', label:this.props.tofiConstants['FvCopy'].name[this.lng]},
    ]
    const typeOfPaperCarrierOptions1 = [
      {value:'1399', label:this.props.tofiConstants['FvPaper'].name[this.lng]},
      {value:'1400', label:this.props.tofiConstants['FvVellum'].name[this.lng]},
      {value:'1401', label:this.props.tofiConstants['FvParchment'].name[this.lng]},
    ]
    
    return (
      <Form className="antForm-spaceBetween" layout='horizontal'>
        <FormItem>
          <Checkbox
            checked={this.props.caseList && this.props.caseList.caseOCD && this.props.caseList.caseOCD.idRef === tofiConstants['caseOCDTrue'].id}
          >особо ценный документ</Checkbox>
        </FormItem>        
        <FormItem>
          <Checkbox
            checked={this.props.caseList && this.props.caseList.irreparablyDamaged && this.props.caseList.irreparablyDamaged.idRef === tofiConstants['irreparablyDamagedTrue'].id}
          >неудовлетворительное физическое состояние</Checkbox>
        </FormItem>        
        <FormItem>
          <Checkbox
            checked={this.props.caseList && this.props.caseList.caseFundOfUse && this.props.caseList.caseFundOfUse.idRef === tofiConstants['caseFundOfUseTrue'].id}
          >наличие фонда использования</Checkbox>
        </FormItem>        
        <FormItem>
          <Checkbox
            checked={this.isIncludedToReferences()}
          >включение информации в систему НСА</Checkbox>
        </FormItem>        
        <FormItem
          label="подлинность / копийность"
          colon={false}
          //{...formItemLayout}
        >
          <Select 
            name="propAuthenticity"
            //className="long-selected-menu"
            value={this.state.record.propAuthenticity && this.state.record.propAuthenticity}
            onChange={(item) => this.onChange(item,'propAuthenticity')}
            onMenuOpen={this.loadOptions('propAuthenticity')}
            isLoading={loading.propAuthenticityLoading}
            options={propAuthenticityOptions ? propAuthenticityOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
            placeholder={''}
          />
        </FormItem>        
        <FormItem
          label="вид носителя или способ воспроизведения"
          colon={false}
          //{...formItemLayout}
        >
          <Select 
            name="typeOfPaperCarrier"
            //className="long-selected-menu"
            value={this.state.record.typeOfPaperCarrier && this.state.record.typeOfPaperCarrier}
            onChange={(item) => this.onChange(item,'typeOfPaperCarrier')}
            onMenuOpen={this.loadOptions('typeOfPaperCarrier')}
            isLoading={loading.typeOfPaperCarrierLoading}
            options={typeOfPaperCarrierOptions ? typeOfPaperCarrierOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
            placeholder={''}
          />
        </FormItem>        
      </Form>      
    )
  }
}

export default connect(state => {
  return {
    propAuthenticityOptions: state.generalData.propAuthenticity,
    typeOfPaperCarrierOptions: state.generalData.typeOfPaperCarrier,
  }
}, { getPropVal })(ClassificationInfo);