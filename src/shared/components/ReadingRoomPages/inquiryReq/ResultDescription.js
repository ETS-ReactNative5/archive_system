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
    this.resultDescriptionValue = {...this.props.initialValues.resultDescription};
  }

  changeLang = e => {
    this.setState({
      lang: {...this.state.lang, [e.target.name]: e.target.value}
    });
  };

  componentDidUpdate(prevProps) {
    if(prevProps.initialValues !== this.props.initialValues) {
      this.resultDescriptionValue = {...this.props.initialValues.resultDescription};
    }
  }
  onSubmit = values => {
    const { resultResearch ,...rest} = pickBy(values, (val, key) => !isEqual(val, this.props.initialValues[key]));
    const cube = {
      cubeSConst: 'cubeStudy',
      doConst: 'doCubeStudy',
      dpConst: 'dpCubeStudy'
    };
    const obj = {
      doItem: this.props.initialValues.key,
    };
    return this.props.saveProps({cube, obj}, {values: rest, oFiles: {resultResearch}}, this.props.tofiConstants);
  };
    fileToRedux = (val, prevVal, file, str) => {
        let newFile = val.filter(el => el instanceof File);
        if (newFile.length > 0) {
            var copyVal = prevVal ? [...prevVal] : [];
            newFile.map(el => {
                copyVal.push({
                    value: el
                });
            });
            return copyVal;
        } else {
            return val.length == 0 ? [] : val;
        }
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
            component={renderTextareaLang}
            format={value => (!!value ? value.valueLng[lang.resultDescription] : '')}
            label={resultDescription.name[this.lng]}

            normalize={(val, prevVal, obj, prevObj) => {
                let newVal = { ...prevVal };
                newVal.value = val;
                if (!!newVal.valueLng) {
                    newVal.valueLng[lang.resultDescription] = val;
                } else {
                    newVal["valueLng"] = { kz: "", en: "", ru: "" };
                    newVal.valueLng[lang.resultDescription] = val;
                }
                return newVal;
            }}
            formItemClass="with-lang--column"
            changeLang={this.changeLang}
          />
        )}
        {resultResearch && <Field
          name="resultResearch"
          component={ renderFileUploadBtn }
          cubeSConst="cubeStudy"

          label={resultResearch.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          normalize={this.fileToRedux}

        />}
        {dirty && <Form.Item className="ant-form-btns absolute-bottom">
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