import React, {Component} from 'react';
import {Button, Form} from 'antd';
import {Field, reduxForm} from 'redux-form';
import {renderDatePicker, renderInput, renderSelect, renderSelectVirt} from '../../../utils/form_components';
import {connect} from 'react-redux';
import moment from 'moment';
import {
  getAllObjOfCls, getFile,
  getObjByObjVal,
  getObjChildsByConst,
  getPropVal,
  getValuesOfObjsWithProps
} from '../../../actions/actions';
import {isEqual, pickBy} from 'lodash';
import {requiredLabel} from '../../../utils/form_validations';
import {digits, normalizePhone} from "../../../utils/form_normalizing";

const FormItem = Form.Item;

class Applicant extends Component {

  constructor(props) {
    super(props);
    this.state = {
        optionMultiSelect:[],
      lang: {
        name: localStorage.getItem('i18nextLng')
      },
      loading: {
        usersOfSystemLoading: false,
        nationalityLoading: false
      },
      applicantId:'',
      iin:'',
        defaultUsersOfSystem:''
    };
  }

  nameValue = {...this.props.initialValues.name};

  changeLang = e => {
    this.setState({lang: {...this.state.lang, [e.target.name]: e.target.value}});
  };

  componentDidUpdate(prevProps) {
    if(prevProps.initialValues !== this.props.initialValues) {
      this.nameValue = {...this.props.initialValues.name};
    }
  }

    loadOptions = c => {
        return () => {
            if (!this.props[c + 'Options']) {
                this.setState({loading: {...this.state.loading, [c + 'Loading']: true}});
                this.props.getPropVal(c)
                .then(() => this.setState({loading: {...this.state.loading, [c + 'Loading']: false}}))
            }
        }
    };
    loadChilds = (c, props) => {
        return () => {
            if (!this.props[c + 'Options']) {
                this.setState({loading: {...this.state.loading, [c + 'Loading']: true}});
                this.props.getObjChildsByConst(c, props)
                .then(() => this.setState({loading: {...this.state.loading, [c + 'Loading']: false}}))
                .catch(err => console.error(err))
            }
        }
    };

    componentDidMount(){
console.log("didMount in Applicant")
        if(this.props.user.cls==this.props.tofiConstants['clsResearchers'].id) {
            var datas = [{
                objs: String(this.props.user.obj),
                propConsts: 'iin,personLastName,personName,personPatronymic,nameOfOrganizationDeveloper,dateOfBirth,gender,nationality,copyUdl,photo'
            }];
            const userFD = new FormData();
            userFD.append('datas', JSON.stringify(datas));
            getValuesOfObjsWithProps(userFD).then(res=> {
                if(res.success === true)
                {
                    this.props.change('iin', res.data[0].iin.ru);
                    this.props.change('personLastName', res.data[0].personLastName[this.lng]);
                    this.props.change('personName', res.data[0].personName[this.lng]);
                    this.props.change('personPatronymic', res.data[0].personPatronymic[this.lng]);
                    this.props.change('dateOfBirth', moment(res.data[0].dateOfBirth));

                }
            })
        }
    }

  onSubmit = values => {
    const {researchType, name, ...rest} = pickBy(values, (val, key) => !isEqual(val, this.props.initialValues[key]));
    const cube = {
      cubeSConst: 'cubeStudy',
      doConst: 'doCubeStudy',
      dpConst: 'dpCubeStudy'
    };
    const obj = {
      name: values.name,
      fullName: values.name,
      clsConst: values.researchType.researchTypeClass,
    };
    if (!this.props.initialValues.key) {
      return this.props.onCreateObj(
        {cube, obj},
        {
          values: rest
        })
    }
    const objData = {};
    if(name) {
      objData.name = name;
      objData.fullName = name;
    }
    obj.doItem = this.props.initialValues.key;
    return this.props.saveProps({cube, obj}, {values: rest}, this.props.tofiConstants, objData);
  };
  loadClsObj = (cArr, dte = moment().format('YYYY-MM-DD')) => {
    return () => {
      cArr.forEach(c => {
        if (!this.props[c + 'Options']) {
          this.setState({loading: {...this.state.loading, [c + 'Loading']: true}});
          this.props.getAllObjOfCls(c, dte)
            .then(() => this.setState({loading: {...this.state.loading, [c + 'Loading']: false}}))
        }
      })
    }
  };




  handleChangeSelect = event => {
    var datas = [{
      objs: String(event.value),
      propConsts: 'iin,personLastName,personName,personPatronymic,dateOfBirth,gender,nationality,copyUdl,photo'
    }];
    const userFD = new FormData();
    userFD.append('datas', JSON.stringify(datas));

    getValuesOfObjsWithProps(userFD).then(res=> {
      if(res.success === true)
      {
        this.props.change('iin', res.data[0].iin.ru);
        this.props.change('personLastName', res.data[0].personLastName[this.lng]);
        this.props.change('personName', res.data[0].personName[this.lng]);
        this.props.change('personPatronymic', res.data[0].personPatronymic[this.lng]);
        this.props.change('dateOfBirth', moment(res.data[0].dateOfBirth));

      }
    }
    );
  };

    dateToRedux = (val, prev) => {
        {
            let coppyPrev = { ...prev };

            if (!!val) {
                let newDate = moment(val).format("DD-MM-YYYY");
                if (!!coppyPrev.idDataPropVal) {
                    coppyPrev.value = newDate;
                    return coppyPrev;
                } else {
                    return {
                        value: newDate
                    };
                }
            } else {
                if (!!coppyPrev.value) {
                    coppyPrev.value = "";
                    return coppyPrev;
                } else {
                    return {};
                }
            }
        }
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
    showInput = arr => {
        return arr.some(
            el =>
                el.invType.id === this.props.invType &&
                el.docType.id === this.props.docType
        );
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
    checkboxToRedux=(val, prevVal)=>{
        let newVal = {...prevVal};
        const {yes,irreparablyDamagedTrue,irreparablyDamagedFalse, no} = this.props.tofiConstants
        if (prevVal === null) {
            let objVal ={}
            if (val=== true ){
                objVal = {
                    value: Number(irreparablyDamagedTrue.id),
                    kFromBase: val

                }
            }else {
                objVal = {
                    value: Number(irreparablyDamagedFalse.id),
                    kFromBase: val
                }
            }

            return (objVal)
        } else {
            if (val=== true ){
                newVal.value = Number(irreparablyDamagedTrue.id)
                newVal.kFromBase= val
            }else {
                newVal.value = Number(irreparablyDamagedFalse.id)
                newVal.kFromBase= val
            }


            return (newVal)

        }
    }
    checkboxToRedux2=(val, prevVal)=>{
        let newVal = {...prevVal};
        const {caseInsuranceTrue, caseInsuranceFalce} = this.props.tofiConstants
        if (prevVal === null) {
            let objVal ={}
            if (val=== true ){
                objVal = {
                    value: Number(caseInsuranceTrue.id),
                    kFromBase: val

                }
            }else {
                objVal = {
                    value: Number(caseInsuranceFalce.id),
                    kFromBase: val
                }
            }

            return (objVal)
        } else {
            if (val=== true ){
                newVal.value = Number(caseInsuranceTrue.id)
                newVal.kFromBase= val
            }else {
                newVal.value = Number(caseInsuranceFalce.id)
                newVal.kFromBase= val
            }


            return (newVal)

        }
    }
    checkboxToRedux3=(val, prevVal)=>{
        let newVal = {...prevVal};
        const {caseFundOfUseTrue, caseFundOfUseFalce} = this.props.tofiConstants
        if (prevVal === null) {
            let objVal ={}
            if (val=== true ){
                objVal = {
                    value: Number(caseFundOfUseTrue.id),
                    kFromBase: val

                }
            }else {
                objVal = {
                    value: Number(caseFundOfUseFalce.id),
                    kFromBase: val
                }
            }

            return (objVal)
        } else {
            if (val=== true ){
                newVal.value = Number(caseFundOfUseTrue.id)
                newVal.kFromBase= val
            }else {
                newVal.value = Number(caseFundOfUseFalce.id)
                newVal.kFromBase= val
            }


            return (newVal)

        }
    }



  render() {
    if (!this.props.tofiConstants) return null;

    let isEnabled = !!this.props.isEnabled;

    this.lng = localStorage.getItem('i18nextLng');
    const {
      t, handleSubmit, reset, dirty, error, submitting, usersOfSystemOptions, nationalityOptions,
      tofiConstants: {iin, usersOfSystem, nameOfOrganizationDeveloper, personPatronymic,
        personLastName, personName, dateOfBirth, nationality, personAddress, personPhone}
    } = this.props;
    const { lang, loading: {usersOfSystemLoading, nationalityLoading} } = this.state;
    return (
      <Form className="antForm-spaceBetween" onSubmit={handleSubmit(this.onSubmit)}
            style={dirty ? {paddingBottom: '43px'} : {}}>
        {usersOfSystem && <Field
            name="usersOfSystem"
            component={renderSelectVirt}
            normalize={this.selectToRedux}

            isSearchable={true}
            label={usersOfSystem.name[this.lng]}
            // disabled={this.props.user.cls==this.props.tofiConstants['clsResearchers'].id}
            disabled = {!isEnabled}
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }

            isLoading={usersOfSystemLoading}
            options={usersOfSystemOptions ? usersOfSystemOptions.map(option => ({
              value: option.id,
              label: option.name[this.lng]
            })) : []}
            onFocus={this.loadOptions('usersOfSystem')}
            // onChange={this.handleChangeSelect}
        />}

        {iin && <Field
          value={this.state.iin}
          name='iin'
          component={renderInput}
          label={iin.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          normalize={this.strToRedux}
          disabled = {!isEnabled}
        />}

        {nameOfOrganizationDeveloper && <Field
          name='nameOfOrganizationDeveloper'
          component={renderInput}
          label={t('NAME_ORGANIZATION')}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          normalize={this.strToRedux}
          disabled = {!isEnabled}
        />}
        {personLastName && <Field
          name='personLastName'
          component={renderInput}
          label={personLastName.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          normalize={this.strToRedux}
          disabled = {!isEnabled}
        />}
        {personName && <Field
          name='personName'
          component={renderInput}
          label={personName.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          normalize={this.strToRedux}
          disabled = {!isEnabled}
        />}
        {personPatronymic && <Field
          name='personPatronymic'
          component={renderInput}
          label={personPatronymic.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          normalize={this.strToRedux}
          disabled = {!isEnabled}
        />}
        {/*<Field
          name="name"
          component={ renderInputLang }
          format={value => (!!value ? value[lang.name] : '')}
          parse={value => { this.nameValue[lang.name] = value; return {...this.nameValue} }}
          label={t('NAME')}
          formItemClass="with-lang"
          changeLang={this.changeLang}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />*/}
        {dateOfBirth && <Field
          name="dateOfBirth"
          component={renderDatePicker}
          format={null}
          label={dateOfBirth.name[this.lng]}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
          normalize={this.dateToRedux}
          disabled = {!isEnabled}
        />}
        {nationality && <Field
          name="nationality"
          component={renderSelect}
          isSearchable={false}
          label={t('NATIONALITY')}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
          normalize={this.selectToRedux}

          isLoading={nationalityLoading}
          data={nationalityOptions ? nationalityOptions.map(option => ({
            value: option.id,
            label: option.name[this.lng]
          })) : []}
          onFocus={this.loadOptions('nationality')}
          disabled = {!isEnabled}
        />}
        {personAddress && <Field
          name='personAddress'
          component={renderInput}
          label={personAddress.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          normalize={this.strToRedux}
          disabled = {!isEnabled}
        />}
        {personPhone && <Field
          name='personPhone'
          component={renderInput}
          label={personPhone.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          normalize={this.strToRedux}
          disabled = {!isEnabled}
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
    user: state.auth.user,
    usersOfSystemOptions: state.generalData.usersOfSystem,
    nationalityOptions: state.generalData.nationality
  }
}

export default connect(mapStateToProps, {getAllObjOfCls, getPropVal, getObjByObjVal, getObjChildsByConst})(reduxForm({
  form: 'Applicant',
  enableReinitialize: true
})(Applicant));
