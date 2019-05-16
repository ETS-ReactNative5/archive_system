import React, { Component } from 'react';
import {Button, Form} from 'antd';
import { Field, reduxForm } from 'redux-form';
import {
  renderInput, renderInputLang} from '../../../utils/form_components';
import {isEmpty, isEqual, pickBy} from 'lodash';
import {normalizePhone} from '../../../utils/form_normalizing';
import {CUBE_FOR_ORG_FUNDMAKER, DO_FOR_ORG_FUNDMAKER, DP_FOR_ORG_FUNDMAKER} from "../../../constants/tofiConstants";
import moment from "moment";

class ManagingFormFundMaker extends Component {

  constructor(props) {
    super(props);

    const lng = localStorage.getItem('i18nextLng');
    this.state = {
      lang: {
        leaderFIO: lng,
        leaderPosition: lng,
        depLeaderFIO: lng,
        depLeaderPosition: lng,
        responsibleFIO: lng,
        responsiblePosition: lng,
        archiveLeaderFIO: lng,
        archiveLeaderPosition: lng,
        commissionLeaderFIO: lng,
        commissionLeaderPosition: lng
      }
    };
  }

    strToRedux = (val, prevVal, obj, prevObj, flag) => {
        if(!!flag){
            val = val.replace(/[^\d;]/g, '')
        }
        var newVal = {...prevVal};
        if (prevVal === null) {
            let objVal = {
                value: val,
                valueLng: {kz: val},
                valueLng: {ru: val},
                valueLng: {en: val}
            };
            return objVal
        } else {
            newVal.value = val;
            newVal['valueLng']={kz:val,ru:val,en:val}
            return (newVal)

        }
    };
    fileToRedux = (val, prevVal, file, str) => {
        let newFile = val.filter(el => el instanceof File);
        if (newFile.length > 0) {
            var copyVal = prevVal?[...prevVal]:[]
            newFile.map(el => {
                copyVal.push({
                    value: el
                })
            });
            return copyVal
        } else {
            return val.length == 0 ? [] : val
        }
    };
    selectToRedux = (val, prevVal, obj, prevObj) => {
        if (val !== undefined) {
            if (val === null) {
                let newValNull = {...prevVal};
                newValNull.label = null;
                newValNull.labelFull = null;
                newValNull.value = null;
                return newValNull
            } else {
                let newVal = {...prevVal};
                newVal.value = val.value;
                newVal.label = val.label;
                newVal.labelFull = val.label;
                return (newVal)
            }

        }
    };
    selectMultiToRedux = (val, prevVal, obj, prevObj) => {
        if (val !== undefined) {
            if (val.length > 0){
                let coppyPrevVal = prevVal?[...prevVal]:[]
                let coppyVal = [...val]
                if (coppyPrevVal.length > 0 ) {
                    for (let i = 0; i < coppyPrevVal.length; i++) {
                        if (coppyPrevVal[i].idDataPropVal == undefined) continue
                        if (coppyPrevVal[i].idDataPropVal !== undefined) {
                            let findePrevVal = this.state.optionMultiSelect.find((el) => el.idDataPropVal === coppyPrevVal[i].idDataPropVal)

                            if (findePrevVal === undefined) {
                                setTimeout(() => {
                                    this.setState({
                                        optionMultiSelect: this.state.optionMultiSelect.concat(coppyPrevVal[i])
                                    })
                                })

                            }
                        }

                    }
                }

                for (let i = 0; i < coppyVal.length; i++) {
                    if (coppyVal[i].idDataPropVal === undefined) {
                        let findVal = this.state.optionMultiSelect.find((el) => el.value === coppyVal[i].value)
                        if (findVal !== undefined) {
                            coppyVal.splice(i, 1)
                            coppyVal.push(findVal)
                        }
                    }
                }
                return coppyVal
            } else {
                return []
            }
        }
    };
    dateToRedux=(val , prev)=>{{
        let coppyPrev = {...prev}

        if (!!val){
            let newDate = moment(val).format("DD-MM-YYYY")
            if (!!coppyPrev.idDataPropVal){
                coppyPrev.value = newDate
                return coppyPrev
            }else {
                return {
                    value:newDate
                }
            }
        }else{
            if (!!coppyPrev.value){
                coppyPrev.value=""
                return coppyPrev
            }else{
                return {}
            }

        }

    }}


  changeLang = e => {
    this.setState({lang: {...this.state.lang, [e.target.name]: e.target.value}});
  };

  leaderFIOValue = {...this.props.initialValues.leaderFIO} || {kz: '', ru: '', en: ''};
  leaderPositionValue = {...this.props.initialValues.leaderPosition} || {kz: '', ru: '', en: ''};
  depLeaderFIOValue = {...this.props.initialValues.depLeaderFIO} || {kz: '', ru: '', en: ''};
  depLeaderPositionValue = {...this.props.initialValues.depLeaderPosition} || {kz: '', ru: '', en: ''};
  responsibleFIOValue = {...this.props.initialValues.responsibleFIO} || {kz: '', ru: '', en: ''};
  responsiblePositionValue = {...this.props.initialValues.responsiblePosition} || {kz: '', ru: '', en: ''};
  archiveLeaderFIOValue = {...this.props.initialValues.archiveLeaderFIO} || {kz: '', ru: '', en: ''};
  archiveLeaderPositionValue = {...this.props.initialValues.archiveLeaderPosition} || {kz: '', ru: '', en: ''};
  commissionLeaderFIOValue = {...this.props.initialValues.commissionLeaderFIO} || {kz: '', ru: '', en: ''};
  commissionLeaderPositionValue = {...this.props.initialValues.commissionLeaderPosition} || {kz: '', ru: '', en: ''};

  onSubmit = values => {
    const cube = {
      cubeSConst: CUBE_FOR_ORG_FUNDMAKER,
      doConst: DO_FOR_ORG_FUNDMAKER,
      dpConst: DP_FOR_ORG_FUNDMAKER,
    };
    const obj = {doItem: this.props.initialValues.key};
    //console.log('idDPV ', this.props.withIdDPV);
    return this.props.saveProps(
      {cube, obj},
      {values: pickBy(values, (val, key) => !isEqual(val, this.props.initialValues[key])), idDPV: this.props.withIdDPV},
      this.props.tofiConstants
    );
  };

  render() {
    if(!this.props.tofiConstants) return null;

    const lng = localStorage.getItem('i18nextLng');
    const { t, handleSubmit, reset, dirty, error, submitting, tofiConstants: {leaderFIO, leaderPosition, leaderPhone,
      depLeaderFIO, depLeaderPosition, depLeaderPhone, responsibleFIO, responsiblePosition, responsiblePhone,
      responsibleAppointmentDate, archiveLeaderFIO, archiveLeaderPosition, archiveLeaderPhone, archiveLeaderAppointmentDate,
      commissionLeaderFIO, commissionLeaderPosition, commissionLeaderPhone} } = this.props;
    const { lang } = this.state;
console.log('leaderFIO ', this.props.initialValues.leaderFIO);
    console.log('leaderFIOValue ', this.leaderFIOValue);
    return (
      <Form className="antForm-spaceBetween" onSubmit={handleSubmit(this.onSubmit)} style={dirty ? {paddingBottom: '43px'} : {}}>
        <Form.Item style={{marginBottom: '5px'}}><h3>{t('LEADER')}</h3></Form.Item>
        {leaderFIO && <Field
          name="leaderFIO"
          component={ renderInputLang }
          format={value => (!!value ? value.valueLng[lang.leaderFIO] : '')}
          normalize={(val, prevVal, obj, prevObj) => {
              let newVal = {...prevVal}; newVal.value = val;
              if (!!newVal.valueLng){newVal.valueLng[lang.leaderFIO] = val;}else
              {newVal['valueLng']={kz:'',en:'',ru:''};newVal.valueLng[lang.leaderFIO] = val;}
              return newVal;
          }}
          label={leaderFIO.name[lng]}
          formItemClass="with-lang"
          changeLang={this.changeLang}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          // validate={requiredLng}
          // colon={true}
        />}
        {leaderPosition && <Field
          name="leaderPosition"
          component={ renderInputLang }
          format={value => (!!value ? value.valueLng[lang.leaderPosition] : '')}
          normalize={(val, prevVal, obj, prevObj) => {
              let newVal = {...prevVal}; newVal.value = val;
              if (!!newVal.valueLng){newVal.valueLng[lang.leaderPosition] = val;}else
              {newVal['valueLng']={kz:'',en:'',ru:''};newVal.valueLng[lang.leaderPosition] = val;}
              return newVal;
          }}
          label={leaderPosition.name[lng]}
          formItemClass="with-lang"
          changeLang={this.changeLang}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          // validate={requiredLng}
          // colon={true}
        />}
        {leaderPhone && <Field
          name="leaderPhone"
          component={renderInput }
          label={leaderPhone.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          placeholder='+7 ('
          normalize={(val, prevVal, obj, prevObj)=>this.strToRedux(val, prevVal, obj, prevObj, true)}
        />}
        <Form.Item style={{marginBottom: '5px'}}><h3>{t('DEP_LEADER')}</h3></Form.Item>
        {depLeaderFIO && <Field
          name="depLeaderFIO"
          component={ renderInputLang }
          format={value => (!!value ? value.valueLng[lang.depLeaderFIO] : '')}
          normalize={(val, prevVal, obj, prevObj) => {
              let newVal = {...prevVal}; newVal.value = val;
              if (!!newVal.valueLng){newVal.valueLng[lang.depLeaderFIO] = val;}else
              {newVal['valueLng']={kz:'',en:'',ru:''};newVal.valueLng[lang.depLeaderFIO] = val;}
              return newVal;
          }}
          label={depLeaderFIO.name[lng]}
          formItemClass="with-lang"
          changeLang={this.changeLang}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          // validate={requiredLng}
          // colon={true}
        />}
        {depLeaderPosition && <Field
          name="depLeaderPosition"
          component={ renderInputLang }
          format={value => (!!value ? value.valueLng[lang.depLeaderPosition] : '')}
          normalize={(val, prevVal, obj, prevObj) => {
              let newVal = {...prevVal}; newVal.value = val;
              if (!!newVal.valueLng){newVal.valueLng[lang.depLeaderPosition] = val;}else
              {newVal['valueLng']={kz:'',en:'',ru:''};newVal.valueLng[lang.depLeaderPosition] = val;}
              return newVal;
          }}
          label={depLeaderPosition.name[lng]}
          formItemClass="with-lang"
          changeLang={this.changeLang}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          // validate={requiredLng}
          // colon={true}
        />}
        {depLeaderPhone && <Field
          name="depLeaderPhone"
          component={ renderInput }
          label={depLeaderPhone.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          placeholder='+7 ('
          normalize={(val, prevVal, obj, prevObj)=>this.strToRedux(val, prevVal, obj, prevObj, true)}
        />}
        <Form.Item style={{marginBottom: '5px'}}><h3>{t('RESPONSIBLE')}</h3></Form.Item>
        {responsibleFIO && <Field
          name="responsibleFIO"
          component={ renderInputLang }
          format={value => (!!value ? value[lang.responsibleFIO] : '')}
          parse={value => { this.responsibleFIOValue[lang.responsibleFIO] = value; return {...this.responsibleFIOValue} }}
          label={responsibleFIO.name[lng]}
          formItemClass="with-lang"
          changeLang={this.changeLang}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          // validate={requiredLng}
          // colon={true}
        />}
        {responsiblePosition && <Field
          name="responsiblePosition"
          component={ renderInputLang }
          format={value => (!!value ? value.valueLng[lang.responsiblePosition] : '')}
          normalize={(val, prevVal, obj, prevObj) => {
              let newVal = {...prevVal}; newVal.value = val;
              if (!!newVal.valueLng){newVal.valueLng[lang.responsiblePosition] = val;}else
              {newVal['valueLng']={kz:'',en:'',ru:''};newVal.valueLng[lang.responsiblePosition] = val;}
              return newVal;
          }}
          label={responsiblePosition.name[lng]}
          formItemClass="with-lang"
          changeLang={this.changeLang}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          // validate={requiredLng}
          // colon={true}
        />}
        {responsiblePhone && <Field
          name="responsiblePhone"
          component={ renderInput }
          label={responsiblePhone.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          placeholder='+7 ('
          normalize={(val, prevVal, obj, prevObj)=>this.strToRedux(val, prevVal, obj, prevObj, true)}
        />}
        {responsibleAppointmentDate && <Field
          name="responsibleAppointmentDate"
          component={ renderInput }
          normalize={this.strToRedux()}
          label={responsibleAppointmentDate.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        <Form.Item style={{marginBottom: '5px'}}><h3>{t('ARCHIVE_LEADER')}</h3></Form.Item>
        {archiveLeaderFIO && <Field
          name="archiveLeaderFIO"
          component={ renderInputLang }
          format={value => (!!value ? value.valueLng[lang.archiveLeaderFIO] : '')}
          normalize={(val, prevVal, obj, prevObj) => {
              let newVal = {...prevVal}; newVal.value = val;
              if (!!newVal.valueLng){newVal.valueLng[lang.archiveLeaderFIO] = val;}else
              {newVal['valueLng']={kz:'',en:'',ru:''};newVal.valueLng[lang.archiveLeaderFIO] = val;}
              return newVal;
          }}
          label={archiveLeaderFIO.name[lng]}
          formItemClass="with-lang"
          changeLang={this.changeLang}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          // validate={requiredLng}
          // colon={true}
        />}
        {archiveLeaderPosition && <Field
          name="archiveLeaderPosition"
          component={ renderInputLang }
          format={value => (!!value ? value.valueLng[lang.archiveLeaderPosition] : '')}
          normalize={(val, prevVal, obj, prevObj) => {
              let newVal = {...prevVal}; newVal.value = val;
              if (!!newVal.valueLng){newVal.valueLng[lang.archiveLeaderPosition] = val;}else
              {newVal['valueLng']={kz:'',en:'',ru:''};newVal.valueLng[lang.archiveLeaderPosition] = val;}
              return newVal;
          }}
          label={archiveLeaderPosition.name[lng]}
          formItemClass="with-lang"
          changeLang={this.changeLang}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          // validate={requiredLng}
          // colon={true}
        />}
        {archiveLeaderPhone && <Field
          name="archiveLeaderPhone"
          component={ renderInput }
          label={archiveLeaderPhone.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          placeholder='+7 ('
          normalize={(val, prevVal, obj, prevObj)=>this.strToRedux(val, prevVal, obj, prevObj, true)}
        />}
        {archiveLeaderAppointmentDate && <Field
          name="archiveLeaderAppointmentDate"
          component={ renderInput }
          normalize={this.strToRedux}
          label={archiveLeaderAppointmentDate.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        <Form.Item style={{marginBottom: '5px'}}><h3>{t('COMMISSION_LEADER')}</h3></Form.Item>
        {commissionLeaderFIO && <Field
          name="commissionLeaderFIO"
          component={ renderInputLang }
          format={value => (!!value ? value.valueLng[lang.commissionLeaderFIO] : '')}
          normalize={(val, prevVal, obj, prevObj) => {
              let newVal = {...prevVal}; newVal.value = val;
              if (!!newVal.valueLng){newVal.valueLng[lang.commissionLeaderFIO] = val;}else
              {newVal['valueLng']={kz:'',en:'',ru:''};newVal.valueLng[lang.commissionLeaderFIO] = val;}
              return newVal;
          }}
          label={commissionLeaderFIO.name[lng]}
          formItemClass="with-lang"
          changeLang={this.changeLang}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          // validate={requiredLng}
          // colon={true}
        />}
        {commissionLeaderPosition && <Field
          name="commissionLeaderPosition"
          component={ renderInputLang }
          format={value => (!!value ? value.valueLng[lang.commissionLeaderPosition] : '')}
          normalize={(val, prevVal, obj, prevObj) => {
              let newVal = {...prevVal}; newVal.value = val;
              if (!!newVal.valueLng){newVal.valueLng[lang.commissionLeaderPosition] = val;}else
              {newVal['valueLng']={kz:'',en:'',ru:''};newVal.valueLng[lang.commissionLeaderPosition] = val;}
              return newVal;
          }}
          label={commissionLeaderPosition.name[lng]}
          formItemClass="with-lang"
          changeLang={this.changeLang}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          // validate={requiredLng}
          // colon={true}
        />}
        {commissionLeaderPhone && <Field
          name="commissionLeaderPhone"
          component={ renderInput }
          label={commissionLeaderPhone.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          placeholder='+7 ('
          normalize={(val, prevVal, obj, prevObj)=>this.strToRedux(val, prevVal, obj, prevObj, true)}
        />}
        {dirty && <Form.Item className="ant-form-btns">
          <Button className="signup-form__btn" type="primary" htmlType="submit" disabled={submitting}>
            {submitting ? t('LOADING...') : t('SAVE') }
          </Button>
          <Button className="signup-form__btn" type="danger" htmlType="button" disabled={submitting} style={{marginLeft: '10px'}} onClick={reset}>
            {submitting ? t('LOADING...') : t('CANCEL') }
          </Button>
          {error && <span className="message-error"><i className="icon-error" />{error}</span>}
        </Form.Item>}
      </Form>
    )
  }
}

export default reduxForm({ form: 'ManagingFormFundMaker', enableReinitialize: true })(ManagingFormFundMaker);
