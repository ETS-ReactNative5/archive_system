/**
 * Created by Mars on 19.11.2018.
 */
import React from 'react';
import { Field, reduxForm } from 'redux-form';
import {Button, Form} from "antd";
import {renderFileUploadBtn, renderTextareaLang} from "../../../utils/form_components";
import {isEqual, pickBy} from "lodash";

class ResultDescription extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      lang: {
        resultDescription: localStorage.getItem("i18nextLng")
      }
    }
  }

  componentDidMount() {
    this.resultDescriptionValue = !!this.props.initialValues.resultDescription&& {...this.props.initialValues.resultDescription.valueLng};
}

changeLang = e => {
  this.setState({
    lang: {...this.state.lang, [e.target.name]: e.target.value}
});
};

componentDidUpdate(prevProps) {
  if(prevProps.initialValues !== this.props.initialValues) {
      this.resultDescriptionValue = !!this.props.initialValues.resultDescription&& {...this.props.initialValues.resultDescription.valueLng};
}
}
onSubmit = values => {
  const {resultResearch, ...rest} = pickBy(values, (val, key) => !isEqual(val, this.props.initialValues[key]));
  const cube = {
    cubeSConst: 'cubeForWorks',
    doConst: 'doForWorks',
    dpConst: 'dpForWorks'
  };
  const obj = {
    doItem: this.props.initialValues.key,
  };

  return this.props.saveProps({cube, obj}, {values: rest, oFiles: {resultResearch}}, this.props.tofiConstants);
};

render() {
  const { lang } = this.state;
  this.lng = localStorage.getItem('i18nextLng');

  const {  t, handleSubmit, reset, dirty, error, submitting,
    tofiConstants: {resultDescription, resultResearch} } = this.props;
  return (
    <Form className="antForm-spaceBetween" onSubmit={handleSubmit(this.onSubmit)}
          style={dirty ? {paddingBottom: '43px'} : {}}>
      {resultDescription && (
        <Field
          name="resultDescription"
          disabled
          component={renderTextareaLang}
          format={value => {  return (!!value ? value.valueLng[lang.resultDescription] : '')}}
          parse={value => { this.resultDescriptionValue[lang.resultDescription] = value; return {...this.resultDescriptionValue} }}
          label={resultDescription.name[this.lng]}
          formItemClass="with-lang--column"
          changeLang={this.changeLang}
          />
      )}
      {resultResearch && <Field
        name="resultResearch"
        disabled
        component={ renderFileUploadBtn }
        label={resultResearch.name[this.lng]}
        formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
      {dirty && <Form.Item className="ant-form-btns">
        <Button className="signup-form__btn" type="primary" htmlType="submit" disabled={submitting}>
          {submitting ? t('LOADING...') : t('SAVE')}
        </Button>
        <Button className="signup-form__btn" type="danger" htmlType="button" disabled={submitting}
                style={{marginLeft: '10px'}} onClick={reset}>
          {submitting ? t('LOADING...') : t('CANCEL')}
        </Button>
        {error && <span className="message-error"><i className="icon-error"/>{error}</span>}
      </Form.Item>}
    </Form>
  )
}
}

export default reduxForm({ form: 'ResultDescription', enableReinitialize: true })(ResultDescription);
