import React from 'react';
import {Button, Form, Icon, Input, message} from 'antd';
import {
  renderCheckbox,
  renderDatePicker,
  renderInput,
  renderFileUploadBtn,
  renderSelect,
  renderTextareaLang,
  renderSelectVirt,
  renderInputLang
} from "../../utils/form_components";

import {requiredLabel} from "../../utils/form_validations";
import {Field, formValueSelector, reduxForm} from "redux-form";
import { isEmpty, isEqual, map, pickBy, forOwn } from "lodash";
import connect from "react-redux/es/connect/connect";
import {getAllObjOfCls, getObjByObjVal, getPropVal} from "../../actions/actions";
import TextArea from 'antd/lib/input/TextArea';
import {CUBE_FOR_AF_CASE, CUBE_FOR_AF_INV, DO_FOR_CASE, DO_FOR_INV, DP_FOR_CASE} from "../../constants/tofiConstants";
import {SYSTEM_LANG_ARRAY} from "../../constants/constants";
import moment from "./ClassificationSchemas";
import {onSaveCubeData} from "../../utils/cubeParser";
import AntTable from "../AntTable";

const FormItem = Form.Item;

class ClassificationInfo extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
      lang: {
        resultDescription: localStorage.getItem("i18nextLng")
      },
      loading: {},
      record: {}
    }
  }


  onSaveCubeData = async (objVerData, {method, protocol, ...values}, doItemProp, objDataProp, valOld, quick) => {

    let hideLoading
    try {
      const c ={
        cube:{
          cubeSConst: "csClassificationShem",
          doConst: "doForSchemClas",
          dpConst: "dpForSchemClas",
          data:this.props[objVerData.cube.cubeSConst]
        },
        obj:{
          doItem:doItemProp
        }
      }

      const v ={
        values:values,
        complex:"",
        oFiles:{
          method:method,
          protocol:protocol,
        }
      }
      const objData = objDataProp
      const  t = this.props.tofiConstants
      this.setState({loading: true, });

      hideLoading = message.loading(this.props.t('UPDATING_PROPS'), 0);
      const resSave = await onSaveCubeData(c, v, t, objData);
      hideLoading();
      if(!resSave.success) {
        message.error(this.props.t('PROPS_UPDATING_ERROR'));
        resSave.errors.forEach(err => {
          message.error(err.text)
        });
        return Promise.reject(resSave);
      }
      message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'));
      return this.props.getCube('csClassificationShem', JSON.stringify(this.filters))
          .then(() => {
            if (quick) {
              this.setState({loading: false});
            } else {
              this.setState({loading: false, openCard: false});
            }
            return {success: true}
          })

    } catch (e) {
      typeof hideLoading === 'function' && hideLoading();
      this.setState({ loading: false });
      console.warn(e);
    }
  };

  refreshRecord = ({referenceName, ...props}) => {
    let selercrow = this.state.selectedRow
    let lastChangeDateScheme = selercrow.lastChangeDateScheme
    if(!!lastChangeDateScheme ){
      lastChangeDateScheme.value = moment()
    }else{
      lastChangeDateScheme = moment()
    }
    const cube = {
      cubeSConst: 'csClassificationShem',
      doConst: 'doForSchemClas',
      dpConst: 'dpForSchemClas'
    };
    return this.onSaveCubeData({cube}, {
      ...props,
      lastChangeDateScheme
    }, this.state.selectedTableRowKey)
  };

  changeLang = e => {
    this.setState({
      lang: {...this.state.lang, [e.target.name]: e.target.value}
    });
  };

  componentDidMount() {
    if (this.props.record && !isEqual(this.props.record, this.state.record)) {
      this.setState({ record: this.props.record });
    }


    this.filters = {
      filterDOAnd: [
        {
          dimConst: DO_FOR_INV,
          concatType: "and",
          conds: [
            {
              data: {
                valueRef: {
                  id: this.props.match.params.idFundCard
                }
              }
            }
          ]
        }
      ]
    };
    this.props.getCube(CUBE_FOR_AF_INV, JSON.stringify(this.filters))
        .then(() => this.setState({loading: false}))
        .catch(err => {
          console.error(err);
          this.setState({loading: false})
        })
  }
  componentDidUpdate(prevProps) {
    if(prevProps.initialValues !== this.props.initialValues) {
      this.nameValue = {...this.props.initialValues.name} || {kz: '', ru: '', en: ''};
      this.caseNotesValue = {...this.props.initialValues.caseNotes} || {kz: '', ru: '', en: ''};
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.record && !isEqual(nextProps.record, this.state.record)) {
      this.setState({ record: nextProps.record });
    }
  }

  renderTableFooter = () => {
    const {data, countData: {countFund, countDelo, countDeloFile}} = this.state;
    const {t} = this.props;
    return (
        <div className="table-footer">
          <div className="flex">
            <div className="label"><label htmlFor="">{t('COUNT_FUNDS')}</label><Input size='small' type="text"
                                                                                      readOnly
                                                                                      value={countFund}/></div>
            <div className="label"><label htmlFor="">{t('COUNT_INVENT')}</label><Input size='small' type="text"
                                                                                       readOnly
                                                                                       value={data.length}/>
            </div>
            <div className="label"><label htmlFor="">{t('COUNT_CASES')}</label><Input size='small' type="text"
                                                                                      readOnly
                                                                                      value={countDelo}/></div>
            <div className="label"><label htmlFor="">{t('COUNT_CASES_WITH_ELECTR')}</label><Input size='small'
                                                                                                  type="text"
                                                                                                  readOnly
                                                                                                  value={countDeloFile}/>
            </div>
          </div>
          <div className="data-length">
            <div className="label"><label htmlFor="">{t('COUNT_ITOG')}</label><Input size='small' type="text"
                                                                                     readOnly
                                                                                     value={this.filteredData.length + ' / ' + this.state.data.length}/>
            </div>
          </div>
        </div>
    )
  };

  onChange(value, name) {
    this.setState({record: { ...this.state.record, [name]: value }}, () => {
      this.props.onChange(name, value)
    })
  };

  onSubmit = ({ name,documentFile, ...values }) => {debugger;
    console.log(this.props.initialValues)
    if (!this.props.initialValues.key) {
      return this.props.onCreateObj({
        ...pickBy(values, (val, key) => !isEqual(val, this.props.initialValues[key])),

        name:name,
        documentFile:documentFile,
        caseInventory:this.props.keyInv,
        caseWorkProp:this.props.keyWork.split("_")[1]
        // objData: {
        //     name: name,
        // },
        // props: {
        //   ...pickBy(
        //     values,
        //     (val, key) => !isEqual(val, this.props.initialValues[key]),
        //
        //   ),
        //   // fundIndex: values.fundIndex,
        //   // caseNomenItem: values.caseNomenItem,
        //   // caseStructuralSubdivision: this.props.initialValues.parent.split(
        //   //   "_"
        //   // )[1],
        //   // caseInventory: this.props.initialValues.caseInventory.split("_")[1]
        // }
      });
    } else {
      const cube = {
        cubeSConst: CUBE_FOR_AF_CASE,
        doConst: DO_FOR_CASE,
        dpConst: DP_FOR_CASE,
      };
      const objData = {};
      const props = pickBy(
          values,
          (val, key) => !isEqual(val, this.props.initialValues[key])
      );
      if (name) {
        objData.name = name;
        objData.fullName = name;
      }
      let val = {
        values:props,
        oFiles:{
          documentFile:documentFile
        }
      }
      return this.props.saveProps(
          {
            cube,
          },
          val,
          this.props.tofiConstants,
          objData,
          this.props.initialValues.key
      );
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
    debugger;
    if (isEmpty(this.props.tofiConstants)) return null;
    const {data, selectedRow, filter} = this.state;
    const lng = localStorage.getItem('i18nextLng');
    this.lng = localStorage.getItem('i18nextLng');
    this.filteredData = data.map(this.renderTableData).filter(item => {
      return (
          item.name[this.lng].toLowerCase().includes(filter.name.toLowerCase()) &&
          item.invNumber.value.toLowerCase().includes(filter.invNumber.toLowerCase())
      )
    });
    if(!this.props.tofiConstants) return null;
    const { lang, loading } = this.state;
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
    const {
        error,
        reset,
        submitting,
        dirty,
        handleSubmit,
        invList
    } = this.props;
const {
  fundHistoricalNote,
  fundHistoricalNoteMulti,
  invFund,
  lastChangeDateScheme
  } = this.props.tofiConstants;
    return (
      <Form className="antForm-spaceBetween"
            onSubmit={handleSubmit(this.onSubmit)}
            style={dirty ? { paddingBottom: "43px" } : {}}
      >
        <FormItem
          label={t('ARCHIVE_FUND_NAME')}
          colon={false}
          //{...formItemLayout}
        >
          <Input
            placeholder=""
            // readOnly
              disabled
            value={this.state.record.fundList}
          />
        </FormItem>
        {fundHistoricalNoteMulti && (
            <Field
                name="fundHistoricalNoteMulti"
                component={renderTextareaLang}
                format={value => (!!value ? value.valueLng[lang.fundHistoricalNoteMulti] : "")}
                normalize={(val, prevVal, obj, prevObj) => {
                                let newVal = { ...prevVal };
                                  newVal.value = val;
                                 if (!!newVal.valueLng) {
                                       newVal.valueLng[lang.fundHistoricalNoteMulti] = val;
                                  } else {
                                        newVal["valueLng"] = { kz: "", en: "", ru: "" };
                                        newVal.valueLng[lang.fundHistoricalNoteMulti] = val;
                                    }
                                 return newVal;
                }}
                label={fundHistoricalNoteMulti.name[this.lng]}
                formItemClass="with-lang"
                changeLang={this.changeLang}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
            />
        )}
        {fundHistoricalNote && (
            <Field
                name="fundHistoricalNote"
                component={renderFileUploadBtn}
                normalize={this.fileToRedux}
                cubeSConst="CubeForAF_Case"
                label={fundHistoricalNote.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
            />
        )}
        {lastChangeDateScheme && <Field
            name="lastChangeDateScheme"
            component={ renderInput }
            label={lastChangeDateScheme.name[this.lng]}
            refreshRecord={this.refreshRecord}
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
        />}

        <AntTable
            columns={
              [
                {
                  key: 'invNumber',
                  title: t('INV_NUMB'),
                  dataIndex: 'invNumber',
                  width: '7%',
                  render:obj=>obj && obj.value,
                  sorter: (a, b) => ((a.invNumber.value).replace(/[^0-9]/g, '')) - ((b.invNumber.value).replace(/[^0-9]/g, '')),
                  filterDropdown: (
                      <div className="custom-filter-dropdown">
                        <Input
                            name="invNumber"
                            suffix={filter.name ? <Icon type="close-circle" data-name="invNumber"
                                                        onClick={this.emitEmpty}/> : null}
                            ref={ele => this.invNumber = ele}
                            placeholder="Поиск"
                            value={filter.invNumber}
                            onChange={this.onInputChange}
                        />
                      </div>
                  ),
                  filterIcon: <Icon type="filter"
                                    style={{color: filter.invNumber ? '#ff9800' : '#aaa'}}/>,
                  onFilterDropdownVisibleChange: (visible) => {
                    this.setState({
                      filterDropdownVisible: visible,
                    }, () => this.invNumber.focus());
                  },
                },
                {
                  key: 'name',
                  title: invList.name[lng],
                  dataIndex: 'name',
                  width: '25%',
                  filterDropdown: (
                      <div className="custom-filter-dropdown">
                        <Input
                            name="name"
                            suffix={filter.name ? <Icon type="close-circle" data-name="name"
                                                        onClick={this.emitEmpty}/> : null}
                            ref={ele => this.name = ele}
                            placeholder="Поиск"
                            value={filter.name}
                            onChange={this.onInputChange}
                        />
                      </div>
                  ),
                  filterIcon: <Icon type="filter" style={{color: filter.name ? '#ff9800' : '#aaa'}}/>,
                  onFilterDropdownVisibleChange: (visible) => {
                    this.setState({
                      filterDropdownVisible: visible,
                    }, () => this.name.focus());
                  },
                  render: obj => obj && obj[this.lng]
                },
              ]
            }
            openedBy="invFund"
            changeSelectedRow={this.changeSelectedRow}
            loading={loading}
            dataSource={this.filteredData}
            footer={this.renderTableFooter}
        />




        {dirty && (
            <Form.Item className="ant-form-btns absolute-bottom">
              <Button
                  className="signup-form__btn"
                  type="primary"
                  htmlType="submit"
                  disabled={submitting}
              >
                {submitting ? t("LOADING...") : t("SAVE")}
              </Button>
              {error && (
                  <span className="message-error">
                <i className="icon-error" />
                    {error}
              </span>
              )}
            </Form.Item>
        )}
      </Form>      
    )
  }
}

export default connect( state => {
  return {
  };
},
    { getPropVal }
)(
    reduxForm({
      form: "ClassificationInfo",
      enableReinitialize: true
    })(ClassificationInfo)
);