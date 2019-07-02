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
import {signXML, sign} from "../../../utils";
import {prepareXml, saveSignedXMLForWork} from "../../../actions/actions";

class ResultDescription extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      lang: {
        resultDescription: localStorage.getItem("i18nextLng")
      },
      signing: false
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
      dpConst: 'dpForWorks',
      data: this.props.cubeForWorksSingle
    };
    const obj = {
      doItem: this.props.initialValues.key,
    };
    if (!!this.props.initialValues.resultResearchStatus) {
      if (this.props.initialValues.resultResearchStatus.value == this.props.tofiConstants.signed.id
      || this.props.initialValues.resultResearchStatus.value == this.props.tofiConstants.fvResultSended.id) {
        ////{"resultDescription":{"value":"СРРРРРРРРРРРРд ждфлоыж адфылвожадолфывдафыв ввввуувввыы  s",
        // "idDataPropVal":19541278,"periodType":0,"dbeg":"1800-01-01","dend":"3333-12-31"}}"

        // idDataPropVal: 20004208
        // propVal: 6807256
        // value: 1600

        let tmp = JSON.parse(JSON.stringify(this.props.initialValues.resultResearchStatus));
        tmp.value = this.props.tofiConstants.fvSignDenied.id;
        delete tmp.propVal;
        delete tmp.label;
        delete tmp.labelFull;
        rest["resultResearchStatus"] = tmp;
      }
    }
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

  // old code
  // submitSign = async () => {
    //   const { resultDescription, resultResearch, resultResearchStatus } = this.props.initialValues;
  //   const data = { resultDescription };
  //   const files = resultResearch && resultResearch.map(f => f.name);
  //   return sign('signXmlBackVS', data, files);
  // };

  receiveSignedXML = (res) => {
    if (res.code == "200") {
      // let signedXML = encodeURI(res.responseObject);
      let signedXML = res.responseObject;
      this.saveSignedXML(signedXML)
    } else {
      this.setState({ signing: false});
      alert("Ошибка/Отмена подписания");
    }
  };

  saveSignedXML = async(signedXML) => {
    let workId = this.props.initialValues.key;
    const hideLoading = message.loading(this.props.t("SAVE_SIGNED_XML"), 60);
    let cbResult = await saveSignedXMLForWork(workId, signedXML);
    hideLoading();
    if (!!cbResult.success) {
      Modal.success(
        {
          title: this.props.t("SAVE_SIGNED_XML_SUCCESS"),
          content: this.props.t("SAVE_SIGNED_XML_SUCCESS_CONTENT"),
          okText: "Закрыть",
          onOk: ()=>{
            this.props.updateCard();
          },
        }
      );
    }
    else {
      let errText = ""
      let i;
      for(i = 0; i < cbResult.errors.length; i++) {
        let error_code = cbResult.errors[i].text
        if (!!error_code) errText += this.props.t(error_code);
      }
      Modal.error(
        {
          title: this.props.t("SAVE_SIGNED_XML_ERROR"),
          content: errText,
          // cancelText: "Закрыть",
          okText: "Закрыть",
          // onCancel: ()=>{},
          onOk: ()=>{},
        }
      );
    }
    this.setState({ signing: false});
  };

  submitSign = async () => {
    this.setState({ signing: true});
    let workId = this.props.initialValues.key;
    const hideLoading = message.loading(this.props.t("PREPARE_XML_FOR_SIGN"), 60);
    let xml = await prepareXml(workId);
    hideLoading();
    var recCBThis = this;
    window.cb_receiveSignedXML = function (result) {
      recCBThis.receiveSignedXML(result);
    };
    signXML('cb_receiveSignedXML', xml);
  };

  render() {
    const {lang} = this.state;
    this.lng = localStorage.getItem('i18nextLng');

    const {
      t, handleSubmit, reset, dirty, error, submitting,
      tofiConstants: {resultDescription, resultResearch, resultResearchStatus},
      initialValues
    } = this.props;
    let show_sign_button = this.props.user.privs.indexOf('sign_auth') != -1;

    let signing = this.state.signing;
    // this.props.tofiConstants.fvSignDenied -- отменена
    // this.props.tofiConstants.fvResultSended -- отправлено исследователю
    // this.props.tofiConstants.signed - подписано
    // this.props.tofiConstants.notSigned - не подписано

    if (show_sign_button) {

      if (!!this.props.initialValues.resultResearchStatus) {
        // -- нет данных
        switch (this.props.initialValues.resultResearchStatus.value) {
          case this.props.tofiConstants.fvSignDenied.id:
            show_sign_button = !dirty
            break;
          case this.props.tofiConstants.notSigned.id:
            show_sign_button = !dirty
            break;
          case this.props.tofiConstants.fvResultSended.id:
            show_sign_button = false;
            break;
          case this.props.tofiConstants.signed.id:
            show_sign_button = false;
            break;
        }
      }
    }

    let isSignButtonDisabled = signing || !(!!this.props.initialValues.workActualEndDate && (this.props.initialValues.workActualEndDate.value != null))
    if (!isSignButtonDisabled)
      isSignButtonDisabled = signing || dirty;

    let signStatusText = 'Не подписан';
    let resultStatusCaption = resultResearchStatus.name[this.lng];
    if (!!this.props.initialValues.resultResearchStatus) {
      signStatusText = this.props.initialValues.resultResearchStatus.label
    }

    // this.props.initialValues.
    return (
      <Form className="antForm-spaceBetween" onSubmit={handleSubmit(this.onSubmit)}
            style={dirty ? {paddingBottom: '43px'} : {}}>
        <p style={{color: 'rgba(0, 0, 0, 0.85)', paddingTop: '8px', paddingBottom:'13px', whiteSpace: 'nowrap'}}>{resultStatusCaption}:
           &nbsp;<font style={{cursor: 'default', userSelect: 'none', color:'red'}}>{signStatusText}
            </font>
          </p>
        {resultDescription && (
          <Field
            name="resultDescription"
            component={renderTextareaLang}
            format={value => (!!value ? value.valueLng[lang.resultDescription] : '')}
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
            { show_sign_button &&
              <Button type='primary' disabled={isSignButtonDisabled} onClick={catchErrors(this.submitSign)}>{t('SIGN')}</Button>
            }
            {error && <span className="message-error"><i className="icon-error"/>{error}</span>}
          </div>
        </Form.Item>
      </Form>
    )
  }
}

export default reduxForm({form: 'ResultDescription', enableReinitialize: true})(ResultDescription);
