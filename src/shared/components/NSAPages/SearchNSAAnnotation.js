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
import {getAllObjOfCls, getObjByObjVal, getPropVal, saveValueOfMultiText, updateCubeData} from "../../actions/actions";
import TextArea from 'antd/lib/input/TextArea';
import {CUBE_FOR_FUND_AND_IK, DO_FOR_FUND_AND_IK} from "../../constants/tofiConstants";
import * as uuid from "uuid";

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
        fundBiographArcheographNote:[],
      fundHistoricalNoteMulti: '',
        fundBiographArcheographNoteMulti:"",
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
      if (this.props.fundBiographArcheographNoteMulti) {
          this.setState({ fundBiographArcheographNoteMulti: this.props.fundBiographArcheographNoteMulti.value });
      }
  }
  
  componentWillReceiveProps(nextProps) {
    if ((nextProps.annotationContentOfDocument.value !== this.props.annotationContentOfDocument.value )) {
      this.setState({ annotationContentOfDocument: nextProps.annotationContentOfDocument.value, flagSave: false });
    }
    if ((nextProps.invMulti.value !== this.props.invMulti.value)) {
      this.setState({ invMulti: nextProps.invMulti.value, flagSave: false });
    }
    if ((nextProps.fundHistoricalNoteMulti.value !== this.props.fundHistoricalNoteMulti.value)) {
      this.setState({ fundHistoricalNoteMulti: nextProps.fundHistoricalNoteMulti.value, flagSave: false });
    }
      if ((nextProps.fundBiographArcheographNoteMulti.value !== this.props.fundBiographArcheographNoteMulti.value)) {
          this.setState({ fundBiographArcheographNoteMulti: nextProps.fundBiographArcheographNoteMulti.value, flagSave: false });
      }

  }
  
  onChange(value, name) {
    this.setState({
      [name]: value,
    }, () => {
      const flagSave = this.state.annotationContentOfDocument !== this.props.annotationContentOfDocument.value ||
                        this.state.invMulti !== this.props.invMulti.value ||
          this.state.fundHistoricalNoteMulti !== this.props.fundHistoricalNoteMulti.value||
          this.state.fundBiographArcheographNoteMulti !== this.props.fundBiographArcheographNoteMulti.value
      this.setState({flagSave:flagSave})
    });
  };
  
  onSave = (values) => {
       message.info(this.props.t('UPDATING_PROPS'), 5);
       let fundAnnotationFile  =[]

      if (!!values.fundAnnotationFile){
        for (let val of values.fundAnnotationFile){
            if (!!val.idDataPropVal) continue
          fundAnnotationFile.push(val.value)
        }
      }
      let invFile  =[]
      if (!!values.invFile){
          for (let val of values.invFile){
              if (!!val.idDataPropVal) continue

              invFile.push(val.value)
          }
      }
      let fundBiographArcheographNote  =[]
      if (!!values.fundBiographArcheographNote){
          for (let val of values.fundBiographArcheographNote){
              if (!!val.idDataPropVal) continue

              fundBiographArcheographNote.push(val.value)
          }
      }
      let fundHistoricalNote  =[]
      if (!!values.fundHistoricalNote){
          for (let val of values.fundHistoricalNote){
              if (!!val.idDataPropVal) continue

              fundHistoricalNote.push(val.value)
          }
      }



      let datas = [];
      try {

          datas = [{
              own: [{doConst: DO_FOR_FUND_AND_IK, doItem:this.props.dataRec.key, isRel: "0", objData: {}}],
              props: [

              ],
              periods: [{periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31'}]
          }];
      } catch (err) {


          console.error(err);
      }
      updateCubeData(CUBE_FOR_FUND_AND_IK, moment().format('YYYY-MM-DD'), JSON.stringify(datas),{},{
          fundAnnotationFile,
          invFile,
          fundBiographArcheographNote,
          fundHistoricalNote
      })
          .then(res => {

              if (res.success) {
                  message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'));
                  this.props.closeCard()

              } else {

                  message.error(this.props.t('PROPS_UPDATING_ERROR'));
                  if (res.errors) {
                      res.errors.forEach(err => {
                          message.error(err.text);
                      });

                  }
              }
          })

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
      if (this.state.fundBiographArcheographNoteMulti !== this.props.fundBiographArcheographNoteMulti.value) {
          dataToSend.push(
              {
                  propConst: 'fundBiographArcheographNoteMulti',
                  vals:[
                      {
                          idDataPropVal: String(this.props.fundBiographArcheographNoteMulti.idDataPropVal),
                          mode: '',
                          val: {
                              kz: this.state.fundBiographArcheographNoteMulti,
                              ru: this.state.fundBiographArcheographNoteMulti,
                              en: this.state.fundBiographArcheographNoteMulti,
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
          message.success(this.props.t("PROPS_SUCCESSFULLY_UPDATED"));
          this.props.closeCard()

          //console.log(res)
      }).catch(err => {
        console.warn(err);
      })
    } else {

    }

      let data = {};
      if (!!this.props.initialValues2.surnameOriginator2){
          let surnameOriginator2 = {...this.props.initialValues2.surnameOriginator2}
          surnameOriginator2.value=this.props.user.obj
          data.surnameOriginator=surnameOriginator2
      }else {
          data.surnameOriginator={
              value:this.props.user.obj
          }
      }
      if (!!this.props.initialValues2.lastChangeDateScheme.idDataPropVal){
          let lastChangeDateScheme = {...this.props.initialValues2.lastChangeDateScheme}
          lastChangeDateScheme.value=moment()
          data.lastChangeDateScheme=lastChangeDateScheme
      }else {
          data.lastChangeDateScheme={
              value:moment()
          }
      }
      this.props.onSave(data);
    this.setState({flagSave: false});
    if (this.state.flagSaveFile === false) return;
    if (!isEqual(this.state.fundAnnotationFile, this.props.dataRec.fundAnnotationFile)) {
      data.fundAnnotationFile = this.state.fundAnnotationFile;
    };
    if (!isEqual(this.state.invFile, this.props.dataRec.invFile)) {
      data.invFile = this.state.invFile;
    };
      if (!isEqual(this.state.fundBiographArcheographNote, this.props.dataRec.fundBiographArcheographNote)) {
          data.fundBiographArcheographNote = this.state.fundBiographArcheographNote;
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
        !isEqual(this.state.fundBiographArcheographNote, this.props.dataRec.fundBiographArcheographNote) ||
        !isEqual(this.state.fundHistoricalNote, this.props.dataRec.fundHistoricalNote)
      ); 
      this.setState({flagSaveFile: flagSaveFile})
    });
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

    reset=()=>{
        if (this.props.annotationContentOfDocument) {
            this.setState({ annotationContentOfDocument: this.props.annotationContentOfDocument.value });
        }
        if (this.props.invMulti) {
            this.setState({ invMulti: this.props.invMulti.value });
        }
        if (this.props.fundHistoricalNoteMulti) {
            this.setState({ fundHistoricalNoteMulti: this.props.fundHistoricalNoteMulti.value });
        }
        if (this.props.fundBiographArcheographNoteMulti) {
            this.setState({ fundBiographArcheographNoteMulti: this.props.fundBiographArcheographNoteMulti.value });
        }
        this.props.reset()
        this.setState({flagSave:false})

    }

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
      <Form className="antForm-spaceBetween"  onSubmit={this.props.handleSubmit(this.onSave)}>
        <FormItem
          label={t('ARCHIVE_FUND_NAME')}
          colon={false}
          //{...formItemLayout}
        >
          <Input 
            placeholder="" 
            // readOnly
              disabled
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
          cubeSConst={CUBE_FOR_FUND_AND_IK}
          component={ renderFileUploadBtn }
          formItemClass="classificationInfo_uploadBtn"
          label={''}
          normalize={this.fileToRedux}
            //onChange={(e) => this.onChangeFile(e, 'documentFile')}
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
          label={''}
          cubeSConst={CUBE_FOR_FUND_AND_IK}

          normalize={this.fileToRedux}
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
          label={''}
          cubeSConst={CUBE_FOR_FUND_AND_IK}

          normalize={this.fileToRedux}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
          <FormItem
              label={tofiConstants["fundBiographArcheographNoteMulti"].name[this.lng]}
              //{...formItemLayout}
          >
          <TextArea
              autosize={{minRows:5,maxRows:10}}
              placeholder=""
              value={this.state.fundBiographArcheographNoteMulti}
              onChange={(e) => this.onChange(e.target.value, 'fundBiographArcheographNoteMulti')}
          />
          </FormItem>
          <Field
              name="fundBiographArcheographNote"
              component={ renderFileUploadBtn }
              formItemClass="classificationInfo_uploadBtn"
              label={''}
              cubeSConst={CUBE_FOR_FUND_AND_IK}

              normalize={this.fileToRedux}
              formItemLayout={
                  {
                      labelCol: { span: 10 },
                      wrapperCol: { span: 14 }
                  }
              }
          />
        <br/><br/><br/>        
        {(flagSave || flagSaveFile || this.props.dirty)  &&
          <div className="ant-form-btns">
            <Button className="signup-form__btn" htmlType="submit" type="primary" >
              {t('SAVE')}
            </Button>
              <Button
                  className="signup-form__btn"
                  type="danger"
                  htmlType="button"
                  style={{ marginLeft: "10px" }}
                  onClick={this.reset}
              >
                  { t("CANCEL")}

              </Button>
          </div>
        }
      </Form>      
    )
  }
}

export default connect(state => {
  return {
      user: state.auth.user,

  }
}, { getPropVal })(reduxForm({ form: 'SearchNSAAnnotation', enableReinitialize: true })(SearchNSAAnnotation));