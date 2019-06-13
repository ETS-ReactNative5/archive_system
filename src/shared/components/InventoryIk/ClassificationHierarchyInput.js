import React, {Component} from 'react';
import {Button, Form} from 'antd';
import {
  renderInput,
} from "../../utils/form_components";
import {Field, formValueSelector, reduxForm} from "redux-form";
import connect from "react-redux/es/connect/connect";
import {getAllObjOfCls, getObjByObjVal, getPropVal} from "../../actions/actions";

class ClassificationHierarchyInput extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
      saveHide: false,
    }
  }

  save = () => {
    this.setState({saveHide:true})
    const data = { 
      referenceName:  this.props.referenceNameValue, 
      indexSceme:     this.props.indexScemeValue, 
      spellVariant:  this.props.vspellVariantValue
    };
    this.props.saveSection(data);
  }

  render() {

    this.lng = localStorage.getItem('i18nextLng');
    const { t, submitting, error, referenceNameValue, cancelInput } = this.props;
    const inputSaveDisabled = !referenceNameValue || this.state.saveHide;
    const inputCancelDisabled = this.state.saveHide;
    
    return (
      <Form className="antForm-spaceBetween" style={{height:'auto'}}>
        <Field
          name="referenceName"
          component={ renderInput }
          colon={true}
          label={t('SECTION')}
          autoComplete="off"
          format={(val)=>{
              return {value:val}
          }}
          formItemLayout={
            {
              labelCol: { span: 5 },
              wrapperCol: { span: 19 }
            }
          }
        />

        <Form.Item>
          <Button className="signup-form__btn" type="primary" htmlType="button" disabled={inputSaveDisabled} onClick={this.save}>
            {submitting ? t('LOADING...') : t('SAVE') }
          </Button>
          {error && <span className="message-error"><i className="icon-error" />{error}</span>}
          <Button className="signup-form__btn" type="danger" htmlType="button" disabled={inputCancelDisabled} style={{marginLeft: '10px'}} onClick={cancelInput}>
            {submitting ? t('LOADING...') : t('CANCEL') }
          </Button>
        </Form.Item>
      </Form>
    )
  }
}

const selector = formValueSelector('ClassificationHierarchyInput');

export default connect(state => {
  const referenceNameValue = selector(state, 'referenceName');
  const indexScemeValue = selector(state, 'indexSceme');
  const vspellVariantValue = selector(state, 'spellVariant');
  return {
    referenceNameValue,
    indexScemeValue,
    vspellVariantValue,
  }
}, { getPropVal })(reduxForm({ form: 'ClassificationHierarchyInput', enableReinitialize: true })(ClassificationHierarchyInput));