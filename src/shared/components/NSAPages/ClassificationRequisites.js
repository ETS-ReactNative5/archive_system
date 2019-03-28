import React from 'react';
import {Button, Form} from 'antd';
import {renderCheckbox} from "../../utils/form_components";
import {Field, formValueSelector, reduxForm} from "redux-form";
import connect from "react-redux/es/connect/connect";

class ClassificationRequisites extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loading: false,

    }
  }

  render() {
    if(!this.props.tofiConstants) return null;

    this.lng = localStorage.getItem('i18nextLng');
    const { t, handleSubmit, dirty, data, tofiConstants} = this.props;
    const { loading } = this.state;
    
    console.log(data);
    
    return (
      <Form className="antForm-spaceBetween" style={dirty ? {paddingBottom: '43px'} : {}}>
        <Field
          name="workType"
          component={ renderCheckbox }
          // disabled={!!this.props.initialValues.key}
          label={t('WORK_TYPE')}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
      </Form>
    )
  }
}

export default connect(state => {
  return {

  }
}, { })(reduxForm({ form: 'ClassificationRequisites', enableReinitialize: true })(ClassificationRequisites));