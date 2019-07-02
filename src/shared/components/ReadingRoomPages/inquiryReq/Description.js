import React from 'react';
import { Field, reduxForm } from 'redux-form';
import {Button, Form} from "antd";
import {renderFileUploadBtn, renderSelectVirt, renderTextareaLang} from "../../../utils/form_components";
import {isEqual, pickBy} from "lodash";
import {connect} from "react-redux";
import {getPropVal} from "../../../actions/actions";

class Description extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      lang: {
        documentContent: localStorage.getItem("i18nextLng")
      },
      loading: {
        fundmakerOfIKLoading: false,
      }
    }
  }

  componentDidMount() {
    this.documentContentValue = {...this.props.initialValues.documentContent};
  }

  changeLang = e => {
    this.setState({
      lang: {...this.state.lang, [e.target.name]: e.target.value}
    });
  };

  loadOptions = c => {
    return () => {
      if (!this.props[c + 'Options']) {
        this.setState({loading: {...this.state.loading, [c + 'Loading']: true}});
        this.props.getPropVal(c)
          .then(() => this.setState({loading: {...this.state.loading, [c + 'Loading']: false}}))
      }
    }
  };

  componentDidUpdate(prevProps) {
    if(prevProps.initialValues !== this.props.initialValues) {
      this.documentContentValue = {...this.props.initialValues.documentContent};
    }
  }
  onSubmit = values => {
    const { formulationResearch, ...rest} = pickBy(values, (val, key) => !isEqual(val, this.props.initialValues[key]));
    const cube = {
      cubeSConst: 'cubeStudy',
      doConst: 'doCubeStudy',
      dpConst: 'dpCubeStudy'
    };
    const obj = {
      doItem: this.props.initialValues.key,
    };
    return this.props.saveProps({cube, obj}, {values: rest, oFiles: {formulationResearch}}, this.props.tofiConstants);
  };
    strToRedux = (val, prevVal, obj, prevObj, flag) => {
        if(!!flag){
            val = val.replace(/[^\d;]/g, '')
        }
        var newVal = { ...prevVal };
        if (prevVal === null) {
            let objVal = {
                value: val,
                valueLng: { kz: val },
                valueLng: { ru: val },
                valueLng: { en: val }
            };
            return objVal;
        } else {
            newVal.value = val;
            newVal["valueLng"] = { kz: val, ru: val, en: val };

            return newVal;
        }
    };
    selectToRedux = (val, prevVal, obj, prevObj) => {
        if (val !== undefined) {
            if (val === null) {
                let newValNull = { ...prevVal };
                newValNull.label = null;
                newValNull.labelFull = null;
                newValNull.value = null;
                return newValNull;
            } else {
                let newVal = { ...prevVal };
                newVal.value = val.value;
                newVal.label = val.label;
                newVal.labelFull = val.label;
                return newVal;
            }
        }
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

    let isEnabled = !!this.props.isEnabled;
    const {  t, handleSubmit, reset, dirty, error, submitting, fundmakerOfIKOptions,
      tofiConstants: {documentContent, formulationResearch, fundmakerOfIK} } = this.props;
    return (
      <Form className="antForm-spaceBetween" onSubmit={handleSubmit(this.onSubmit)}
            style={dirty ? {paddingBottom: '43px'} : {}}>
        {documentContent && (
          <Field
            name="documentContent"
            component={renderTextareaLang}
            format={value => (!!value ? value.valueLng[lang.documentContent] : '')}
            // parse={value => { this.documentContentValue[lang.documentContent] = value; return {...this.documentContentValue} }}

            normalize={(val, prevVal, obj, prevObj) => {
               let newVal = { ...prevVal };
                newVal.value = val;
                if (!!newVal.valueLng) {
                    newVal.valueLng[lang.documentContent] = val;
                } else {
                    newVal["valueLng"] = { kz: "", en: "", ru: "" };
                    newVal.valueLng[lang.documentContent] = val;
                }
                return newVal;
            }}

            label={documentContent.name[this.lng]}
            disabled = {!isEnabled}
            formItemClass="with-lang--column"
            changeLang={this.changeLang}
          />
        )}
        {fundmakerOfIK && <Field
          name="fundmakerOfIK"
          component={renderSelectVirt}
          isSearchable={true}
          label={fundmakerOfIK.name[this.lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
          isLoading={this.state.loading.fundmakerOfIKLoading}
          options={fundmakerOfIKOptions ? fundmakerOfIKOptions.map(option => ({
            value: option.id,
            label: option.name[this.lng]
          })) : []}
          normalize={this.selectToRedux}
          disabled = {!isEnabled}
          onFocus={this.loadOptions('fundmakerOfIK')}
        />}
        {formulationResearch && <Field
          name="formulationResearch"
          component={ renderFileUploadBtn }
          label={formulationResearch.name[this.lng]}
          normalize={this.fileToRedux}
          cubeSConst="cubeStudy"
          disabled = {!isEnabled}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
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

function mapStateToProps(state) {
  return {
    fundmakerOfIKOptions: state.generalData.fundmakerOfIK
  }
}

export default connect(mapStateToProps, { getPropVal })(reduxForm({ form: 'Description', enableReinitialize: true })(Description));