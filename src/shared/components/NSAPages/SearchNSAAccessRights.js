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
      dataRec: {},
      loading: {},
      flagSave: false,
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
    if (this.props.dataRec && !isEqual(this.props.dataRec, this.state.dataRec)) {
      this.setState({ dataRec: this.props.dataRec, flagSave: false });
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.record && !isEqual(nextProps.record, this.state.record)) {
      this.setState({ record: nextProps.record });
    }
    if (nextProps.dataRec && !isEqual(nextProps.dataRec, this.state.dataRec)) {
      this.setState({ dataRec: nextProps.dataRec, flagSave: false });
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
      let newVal = {...this.state.dataRec}
      if (newVal.accessDocument === null){
          newVal.accessDocument={}
      }
      if (value === null){
          newVal.accessDocument["label"] = ""
          newVal.accessDocument["value"] = ""
      }else{
          newVal.accessDocument["label"] = value.label
          newVal.accessDocument["value"] = value.value
      }


    this.setState({dataRec: { ...this.state.dataRec, [name]: newVal[name] }}, () => {
      this.setState({flagSave:true })
    })
  };

    onChange2(value, name) {
        let newVal = {...this.state.dataRec}
        if (newVal[name] === null){
            newVal[name]={}
        }
        if (value === null){
            newVal[name]["value"] = ""
            newVal[name]['valueLng']={
                kz:value,
                ru:value,
                en:value
            }
        }else {
            newVal[name]["value"] = value
            newVal[name]['valueLng']={
                kz:value,
                ru:value,
                en:value
            }
        }


        this.setState({dataRec: { ...this.state.dataRec, [name]: newVal[name] }}, () => {
            this.setState({flagSave:true })
        })
    };


    onSave = () => {

    let data = {};
      if (!!this.state.dataRec.accessDocument){
          data.accessDocument = this.state.dataRec.accessDocument;

      }
      if(!!this.state.dataRec.locationOfSupplementaryMaterials){
          data.locationOfSupplementaryMaterials = this.state.dataRec.locationOfSupplementaryMaterials ;
      }

    this.props.onSave(data);
  };

  render() {
    if(!this.props.tofiConstants) return null;
    
    this.lng = localStorage.getItem('i18nextLng');

    const { t, tofiConstants, caseList, record, accessDocumentOptions, fundCaseFlags } = this.props;
    const { dataRec, loading, flagSave } = this.state;
    const formItemLayout={
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 20
      },
    }    
    // console.log(record.fundToGuidbook)
    return (
      <Form className="antForm-spaceBetween" layout='horizontal'>
        <FormItem
          label={t('ARCHIVE_FUND_NAME')}
          colon={false}
          //{...formItemLayout}
        >
          <Input 
            placeholder="" 
            // readOnly
              disabled
            value={this.state.record.fundList}
          />
        </FormItem>        
        <FormItem>
          <Checkbox
              disabled

              checked={fundCaseFlags.caseOCD}
          >имеются особо ценные документы</Checkbox>
        </FormItem>        
        <FormItem>
          <Checkbox
              disabled

              checked={fundCaseFlags.irreparablyDamaged}
            >имеются дела в неудовлетворительном физическом состоянии</Checkbox>
        </FormItem>        
        <FormItem>
          <Checkbox
              disabled

              checked={fundCaseFlags.caseFundOfUse}
            >присутствует в фонде использования</Checkbox>
        </FormItem>        
        <FormItem>
          <Checkbox
              disabled

              checked={record && record.fundToGuidbook && record.fundToGuidbook.length > 0}
          >включен в систему НСА</Checkbox>
        </FormItem>        
        <FormItem
          label="доступ к документам"
          colon={false}
          //{...formItemLayout}
        >
          <Select 
            name="accessDocument"
            //className="long-selected-menu"
            value={dataRec.accessDocument && dataRec.accessDocument}
            onMenuOpen={this.loadOptions('accessDocument')}
            onChange={(item) => this.onChange(item,'accessDocument')}
            isLoading={loading.accessDocumentLoading}
            options={accessDocumentOptions ? accessDocumentOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
            placeholder={''}
          />
        </FormItem>        
        <FormItem
          label="местонахождение коллекции до поступления в архив"
          colon={false}
          //{...formItemLayout}
        >
          <Input
            name="locationOfSupplementaryMaterials" 
            value={dataRec.locationOfSupplementaryMaterials && dataRec.locationOfSupplementaryMaterials.value}
            onChange={(item) => this.onChange2(item.target.value,'locationOfSupplementaryMaterials')}
            placeholder={''}
          />
        </FormItem>        
        <br/><br/><br/>        
        {flagSave &&
          <div className="ant-form-btns">
            <Button className="signup-form__btn" type="primary" onClick={this.onSave}>
              {t('SAVE')}
            </Button>
          </div>
        }
      </Form>      
    )
  }
}

export default connect(state => {
  return {
    accessDocumentOptions: state.generalData.accessDocument,
  }
}, { getPropVal })(ClassificationInfo);