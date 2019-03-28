import React from 'react';
import {Button, Form, Input} from 'antd';
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

const FormItem = Form.Item;

class ClassificationInfo extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
      loading: {},
      record: {}
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
  
  onChange(value, name) {
    this.setState({record: { ...this.state.record, [name]: value }}, () => {
      this.props.onChange(name, value)
    })
  };
  
  render() {
    if(!this.props.tofiConstants) return null;

    this.lng = localStorage.getItem('i18nextLng');
    const { t, tofiConstants } = this.props;
    const formItemLayout={
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 18
      },
    }    
    return (
      <Form className="antForm-spaceBetween">
        <FormItem
          label={t('ARCHIVE_FUND_NAME')}
          colon={false}
          //{...formItemLayout}
        >
          <Input 
            placeholder=""
            readOnly 
            value={this.state.record.fundList}
          />
        </FormItem>        
      </Form>      
    )
  }
}

export default connect(state => {
  return {
  }
}, { getPropVal })(ClassificationInfo);