/**
 * Created by Mars on 19.11.2018.
 */
import React from 'react';
import {Field, reduxForm} from 'redux-form';
import {Button, Form} from "antd";
import {renderFileUploadBtn, renderTextareaLang} from "../../../utils/form_components";
import {isEqual, pickBy} from "lodash";
import {General} from "../../../utils/axios_config";
import {catchErrors} from "../../../utils/handleAsync";
import {message, Modal} from "antd/lib/index";
import {regNewUserWithECP} from "../../../actions/actions";
import {sign} from "../../../utils";

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
  componentWillUnmount() {
    // cleaning
    delete window.signXmlBack;
    delete window.showFileChooserCall;
  }

  changeLang = e => {
    this.setState({
      lang: {...this.state.lang, [e.target.name]: e.target.value}
    });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.initialValues !== this.props.initialValues) {
      this.resultDescriptionValue = {...this.props.initialValues.resultDescription};
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
  submitSign = async () => {
    const { resultDescription, resultResearch } = this.props.initialValues;
    const data = { resultDescription };
    const files = resultResearch && resultResearch.map(f => f.name);
    return sign('signXmlBackVS', data, files);
  };

  render() {
    const {lang} = this.state;
    this.lng = localStorage.getItem('i18nextLng');
    const {
      t, handleSubmit, reset, dirty, error, submitting,
      tofiConstants: {resultDescription, resultResearch}
    } = this.props;
    return (
      <Form className="antForm-spaceBetween" onSubmit={handleSubmit(this.onSubmit)}
            style={dirty ? {paddingBottom: '43px'} : {}}>
        {resultDescription && (
          <Field
            name="resultDescription"
            component={renderTextareaLang}
            format={value => (!!value ? value.valueLng[lang.resultDescription] : '')}
            // parse={value => {
            //   this.resultDescriptionValue[lang.resultDescription] = value;
            //   return {...this.resultDescriptionValue}
            // }}
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
            label={resultDescription.name[this.lng]}
            formItemClass="with-lang--column"
            changeLang={this.changeLang}
          />
        )}
        {resultResearch && <Field
          name="resultResearch"
          component={renderFileUploadBtn}
          normalize={this.fileToRedux}
          label={resultResearch.name[this.lng]}
          cubeSConst="cubeForWorks"

          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
        />}
        <Form.Item
          className="ant-form-btns absolute-bottom"
        >
          <div style={{ display: 'flex', justifyContent: dirty ? 'space-between' : 'flex-end' }}>
            {dirty && <div>
              <Button className="signup-form__btn" type="primary" htmlType="submit" disabled={submitting}>
                {submitting ? t('LOADING...') : t('SAVE')}
              </Button>
              <Button className="signup-form__btn" type="danger" htmlType="button" disabled={submitting}
                      style={{marginLeft: '10px'}} onClick={reset}>
                {submitting ? t('LOADING...') : t('CANCEL')}
              </Button>
            </div>}
            {/*<Button type='primary' onClick={catchErrors(this.submitSign)}>{t('SIGN')}</Button>*/}
            {error && <span className="message-error"><i className="icon-error"/>{error}</span>}
          </div>
        </Form.Item>
      </Form>
    )
  }
}

export default reduxForm({form: 'ResultDescription', enableReinitialize: true})(ResultDescription);
