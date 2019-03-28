import React from 'react';
import {Button, Form, Input, message} from 'antd';
import {
  renderSelect,
  renderInput,
  renderTextarea,
  renderDatePicker,
  renderFileUpload, renderFileUploadBtn
} from "../../utils/form_components";
import moment from "moment/moment";

import {requiredLabel} from "../../utils/form_validations";
import {Field, formValueSelector, reduxForm} from "redux-form";
import { isEmpty, isEqual, map, pickBy, forOwn } from "lodash";
import connect from "react-redux/es/connect/connect";
import {getAllObjOfCls, getObjByObjVal, getPropVal, saveValueOfMultiText} from "../../actions/actions";
import TextArea from 'antd/lib/input/TextArea';

const FormItem = Form.Item;

class SearchNSAAnnotation extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
      loading: {},
      record: {},
      annotationContentOfDocument: '',
      fundAnnotationFile: [],
      invMulti: '',
      invFile: [],
      fundHistoricalNoteMulti: '',
      fundHistoricalNote: [],
      flagSave: false,
      flagSaveFile: false,
    }
  }
  
  componentDidMount() {
    if (this.props.annotationContentOfDocument) {
      this.setState({ annotationContentOfDocument: this.props.annotationContentOfDocument.value });
    }
    if (this.props.invMulti) {
      this.setState({ invMulti: this.props.invMulti.value });
    }
    if (this.props.fundHistoricalNoteMulti) {
      this.setState({ fundHistoricalNoteMulti: this.props.fundHistoricalNoteMulti.value });
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if ((nextProps.annotationContentOfDocument.value !== this.props.annotationContentOfDocument)) {
      this.setState({ annotationContentOfDocument: nextProps.annotationContentOfDocument.value, flagSave: false });
    }
    if ((nextProps.invMulti.value !== this.state.invMulti)) {
      this.setState({ invMulti: nextProps.invMulti.value, flagSave: false });
    }
    if ((nextProps.fundHistoricalNoteMulti.value !== this.state.fundHistoricalNoteMulti)) {
      this.setState({ fundHistoricalNoteMulti: nextProps.fundHistoricalNoteMulti.value, flagSave: false });
    }
  }
  
  onChange(value, name) {
    this.setState({
      [name]: value,
    }, () => {
      const flagSave = this.state.annotationContentOfDocument !== this.props.annotationContentOfDocument.value ||
                        this.state.invMulti !== this.props.invMulti.value ||
                        this.state.fundHistoricalNoteMulti !== this.props.fundHistoricalNoteMulti.value
      this.setState({flagSave:flagSave})
    });
  };
  
  onSave = () => {
    let hideLoading;
    hideLoading = message.loading(this.props.t('UPDATING_PROPS'), 0);
    const dataToSend = [];
    if (this.state.annotationContentOfDocument !== this.props.annotationContentOfDocument.value) {
      dataToSend.push(
        {
          propConst: 'annotationContentOfDocument',
          vals:[
            {
              idDataPropVal: String(this.props.annotationContentOfDocument.idDataPropVal),
              mode: '',
              val: {
                kz: this.state.annotationContentOfDocument, 
                ru: this.state.annotationContentOfDocument, 
                en: this.state.annotationContentOfDocument,
              }
            }
          ],
        },
      )
    }
    if (this.state.invMulti !== this.props.invMulti.value) {
      dataToSend.push(
        {
          propConst: 'invMulti',
          vals:[
            {
              idDataPropVal: String(this.props.invMulti.idDataPropVal),
              mode: '',
              val: {
                kz: this.state.invMulti, 
                ru: this.state.invMulti, 
                en: this.state.invMulti,
              }
            }
          ],
        },
      )
    }
    if (this.state.fundHistoricalNoteMulti !== this.props.fundHistoricalNoteMulti.value) {
      dataToSend.push(
        {
          propConst: 'fundHistoricalNoteMulti',
          vals:[
            {
              idDataPropVal: String(this.props.fundHistoricalNoteMulti.idDataPropVal),
              mode: '',
              val: {
                kz: this.state.fundHistoricalNoteMulti, 
                ru: this.state.fundHistoricalNoteMulti, 
                en: this.state.fundHistoricalNoteMulti,
              }
            }
          ],
        },
      )
    }
    if (dataToSend.length > 0) {
      saveValueOfMultiText(
        this.props.record.key.split('_')[1], JSON.stringify(dataToSend), moment().format('YYYY-DD-MM')
      ).then(res => {
        hideLoading();
        //console.log(res)
      }).catch(err => {
        console.warn(err);
      })
    } else {
      hideLoading();
    }
    
    this.setState({flagSave: false});
    if (this.state.flagSaveFile === false) return;

    let data = {};
    if (!isEqual(this.state.fundAnnotationFile, this.props.dataRec.fundAnnotationFile)) {
      data.fundAnnotationFile = this.state.fundAnnotationFile;
    };
    if (!isEqual(this.state.invFile, this.props.dataRec.invFile)) {
      data.invFile = this.state.invFile;
    };
    if (!isEqual(this.state.fundHistoricalNote, this.props.dataRec.fundHistoricalNote)) {
      data.fundHistoricalNote = this.state.fundHistoricalNote;
    };
    this.props.onSave2(data);
    this.setState({flagSaveFile: false});
  };
  
  filesListRefresh = (list, name) => {
    let wasLast = false;
    let i = 0;
    let arr1 = []
    do {
      if (list[i]) {
        arr1.push(list[i]);
        i += 1;
      } else {
        wasLast = true;
      }
    }
    while (wasLast === false);
    this.setState({[name]: arr1}, () => {
      const flagSaveFile = (
        !isEqual(this.state.fundAnnotationFile, this.props.dataRec.fundAnnotationFile) ||
        !isEqual(this.state.invFile, this.props.dataRec.invFile) ||
        !isEqual(this.state.fundHistoricalNote, this.props.dataRec.fundHistoricalNote)
      ); 
      this.setState({flagSaveFile: flagSaveFile})
    });
  };

  render() {
    if(!this.props.tofiConstants) return null;

    const { flagSave, flagSaveFile } = this.state;
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
            value={this.props.record ? this.props.record.fundList: ''}
          />
        </FormItem>        
        <FormItem
          label={t('ANNOTATION')}
          //{...formItemLayout}
        >
          <TextArea 
            autosize={{minRows:5,maxRows:10}}
            placeholder="" 
            value={this.state.annotationContentOfDocument}
            onChange={(e) => this.onChange(e.target.value, 'annotationContentOfDocument')}
          />
        </FormItem>        
        <Field
          name="fundAnnotationFile"
          component={ renderFileUploadBtn }
          formItemClass="classificationInfo_uploadBtn"
          value={this.state.record.documentFile}
          label={''}
          //onChange={(e) => this.onChangeFile(e, 'documentFile')}
          onChange={(list) => this.filesListRefresh(list, 'fundAnnotationFile')}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
        <FormItem
          label={t('FOREWORD')}
          //{...formItemLayout}
        >
          <TextArea 
            autosize={{minRows:5,maxRows:10}}
            placeholder="" 
            value={this.state.invMulti}
            onChange={(e) => this.onChange(e.target.value, 'invMulti')}
          />
        </FormItem>        
        <Field
          name="invFile"
          component={ renderFileUploadBtn }
          formItemClass="classificationInfo_uploadBtn"
          value={this.state.record.documentFile}
          label={''}
          onChange={(list) => this.filesListRefresh(list, 'invFile')}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
        <FormItem
          label={t('HISTORICAL_REFERENCE')}
          //{...formItemLayout}
        >
          <TextArea 
            autosize={{minRows:5,maxRows:10}}
            placeholder="" 
            value={this.state.fundHistoricalNoteMulti}
            onChange={(e) => this.onChange(e.target.value, 'fundHistoricalNoteMulti')}
          />
        </FormItem>
        <Field
          name="fundHistoricalNote"
          component={ renderFileUploadBtn }
          formItemClass="classificationInfo_uploadBtn"
          value={this.state.record.documentFile}
          label={''}
          onChange={(list) => this.filesListRefresh(list, 'fundHistoricalNote')}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
        <br/><br/><br/>        
        {(flagSave || flagSaveFile) &&
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
  }
}, { getPropVal })(reduxForm({ form: 'SearchNSAAnnotation', enableReinitialize: true })(SearchNSAAnnotation));