import React, {Component} from "react";
import {Button, Form} from "antd";
import {Field, formValueSelector, reduxForm} from "redux-form";
import moment from "moment";
import {isEqual, pickBy} from "lodash";
import {
  renderCheckbox,
  renderDatePicker,
  renderInput,
  renderSelect, renderTextareaLang,
  renderInputLang
} from "../../../../utils/form_components";
import {
  requiredDate
} from "../../../../utils/form_validations";
import {connect} from "react-redux";
import {CUBE_FOR_AF_CASE, DO_FOR_CASE, DP_FOR_CASE} from "../../../../constants/tofiConstants";
import {SYSTEM_LANG_ARRAY} from "../../../../constants/constants";
import {getObjChildsByConst, getPropVal} from "../../../../actions/actions";
import {requiredLng} from "../../../../utils/form_validations";

/*eslint eqeqeq:0*/
class MainInfoCaseForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lang: {
        name: localStorage.getItem("i18nextLng"),
        caseNotes: localStorage.getItem("i18nextLng"),
        authorTitle: localStorage.getItem("i18nextLng"),
        cameraOperator: localStorage.getItem("i18nextLng"),
        artistOfTheWork: localStorage.getItem("i18nextLng"),
        TypeAndFormatOfRecording: localStorage.getItem('i18nextLng'),
        compositionOfTextDocumentation: localStorage.getItem('i18nextLng')
      },
      loading: {
        caseDocLangObjLoading: false,
        uprDocTypeLoading: false,
        inaccurateDateFeatureLoading: false,
        typeOfPaperCarrierLoading: false
      }
    };
  }

  nameValue = {...this.props.initialValues.name};
  authorTitleValue = {...this.props.initialValues.authorTitle};
  cameraOperatorValue = {...this.props.initialValues.cameraOperator};
  artistOfTheWorkValue = {...this.props.initialValues.artistOfTheWork};
  caseNotesValue = {...this.props.initialValues.caseNotes};
  TypeAndFormatOfRecordingValue = {...this.props.initialValues.TypeAndFormatOfRecording};
  compositionOfTextDocumentationValue = {...this.props.initialValues.compositionOfTextDocumentation};

  changeLang = e => {
    this.setState({
      lang: {...this.state.lang, [e.target.name]: e.target.value}
    });
  };

  onSubmit = ({caseTitle, ...values}) => {
    if (!this.props.initialValues.caseKey) {
      return this.props.save({
        objData: {caseTitle: caseTitle, parent: this.props.initialValues.parent},
        props: {
          ...pickBy(
            values, (val, key) => !isEqual(val, this.props.initialValues[key])
          ),
          fundIndex: values.fundIndex,
          caseNomenItem: values.caseNomenItem,
          caseStructuralSubdivision: this.props.initialValues.parent.split('_')[1],
          caseInventory: this.props.initialValues.caseInventory.split('_')[1]
        }
      });
    } else {
      const cube = {
        cubeSConst: CUBE_FOR_AF_CASE,
        doConst: DO_FOR_CASE,
        dpConst: DP_FOR_CASE
      };
      const objData = {};
      const props = pickBy(values, (val, key) => !isEqual(val, this.props.initialValues[key]));
      if (caseTitle) {
        objData.name = {};
        SYSTEM_LANG_ARRAY.forEach(lang => {
          objData.name[lang] = caseTitle
        });
      }
      return this.props.saveProps({
        cube,
        caseNomenItemValue: values.caseNomenItem.value
      }, props, this.props.initialValues.caseKey, objData);
    }
  };

  loadClsObj = (cArr, propConsts, dte = moment().format("YYYY-MM-DD")) => {
    return () => {
      cArr.forEach(c => {
        if (!this.props[c + "Options"]) {
          this.setState({
            loading: {...this.state.loading, [c + "Loading"]: true}
          });
          this.props.getAllObjOfCls(c, dte, propConsts).then(() =>
            this.setState({
              loading: {...this.state.loading, [c + "Loading"]: false}
            })
          );
        }
      });
    };
  };
  loadOptions = c => {
    return () => {
      if (!this.props[c + "Options"]) {
        this.setState({
          loading: {...this.state.loading, [c + "Loading"]: true}
        });
        this.props.getPropVal(c).then(() =>
          this.setState({
            loading: {...this.state.loading, [c + "Loading"]: false}
          })
        );
      }
    };
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
  loadOptionsArr = cArr => {
    return () => {
      cArr.forEach(c => {
        if (!this.props[c + "Options"]) {
          this.setState({
            loading: {...this.state.loading, [c + "Loading"]: true}
          });
          this.props.getPropVal(c).then(() =>
            this.setState({
              loading: {...this.state.loading, [c + "Loading"]: false}
            })
          );
        }
      });
    };
  };

  disabledStartDate = startValue => {
    const endValue = this.props.workPlannedEndDateValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };
  disabledEndDate = endValue => {
    const startValue = this.props.workPlannedStartDateValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  componentDidUpdate(prevProps) {
    if(prevProps.initialValues !== this.props.initialValues) {
      this.nameValue = {...this.props.initialValues.name};
      this.authorTitleValue = {...this.props.initialValues.authorTitle};
      this.cameraOperatorValue = {...this.props.initialValues.cameraOperator};
      this.artistOfTheWorkValue = {...this.props.initialValues.artistOfTheWork};
      this.caseNotesValue = {...this.props.initialValues.caseNotes};
      this.TypeAndFormatOfRecordingValue = {...this.props.initialValues.TypeAndFormatOfRecording};
      this.compositionOfTextDocumentationValue = {...this.props.initialValues.compositionOfTextDocumentation};
    }
  }

  render() {
    if (!this.props.tofiConstants) return null;

    const lang = this.state.lang;

    this.lng = localStorage.getItem("i18nextLng");
    const {
      t,
      handleSubmit,
      reset,
      dirty,
      error,
      submitting,
      inaccurateDateFeatureValue,
      caseDocLangObjOptions, shelfOptions, rackOptions, caseStorageOptions,
      tofiConstants: {fundNumber, caseDbeg, caseInsuranceTrue, caseDend, caseNumberOfPages, caseStructuralSubdivision, caseOCD,
        caseOCDTrue, fundIndex, caseNotes, timingOfVideoRecording, original, copy, numberOfVideoItems, dateOfRecording,
        TypeAndFormatOfRecording, propAuthenticity, compositionOfTextDocumentation, authorTitle,caseDateOfDeposit,caseInsurance,
        caseNomenItem, caseDocsLang, shelf, rack, caseStorage, caseFundOfUse, irreparablyDamaged, irreparablyDamagedTrue,
        cameraOperator, artistOfTheWork
      }
    } = this.props;

    return (
      <Form
        className="antForm-spaceBetween"
        onSubmit={handleSubmit(this.onSubmit)}
        style={dirty ? {paddingBottom: "43px"} : {}}
      >
        {fundNumber && (
          <Field
            name="fundNumber"
            component={renderInput}
            label={fundNumber.name[this.lng]}
            formItemLayout={{
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }}
          />
        )}
        {fundIndex && (
          <Field
            name="fundIndex"
            component={renderInput}
            label={fundIndex.name[this.lng]}
            formItemLayout={{
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }}
          />
        )}
        <Field
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
          validate={requiredLng}
          colon={true}
        />
        {caseDbeg && (
          <Field
            name="caseDbeg"
            disabledDate={this.disabledStartDate}
            component={renderDatePicker}
            format={null}
            label={caseDbeg.name[this.lng]}
            formItemLayout={{
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }}
            // colon
            // validate={requiredDate}
          />
        )}
        {caseDend && (
          <Field
            name="caseDend"
            disabledDate={this.disabledEndDate}
            component={renderDatePicker}
            format={null}
            isSearchable={false}
            label={caseDend.name[this.lng]}
            formItemLayout={{
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }}
            colon
            validate={requiredDate}
          />
        )}
        {caseNumberOfPages && (
          <Field
            name="caseNumberOfPages"
            component={renderInput}
            label={caseNumberOfPages.name[this.lng]}
            formItemLayout={{
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }}
          />
        )}
        {caseStructuralSubdivision && <Field
          name="caseStructuralSubdivision"
          component={renderSelect}
          label={caseStructuralSubdivision.name[this.lng]}
          formItemLayout={{
            labelCol: {span: 10},
            wrapperCol: {span: 14}
          }}
        />}
        {caseNotes && (
          <Field
            name="caseNotes"
            component={renderTextareaLang}
            format={value => (!!value ? value[lang.caseNotes] : '')}
            parse={value => { this.caseNotesValue[lang.caseNotes] = value; return {...this.caseNotesValue} }}
            label={caseNotes.name[this.lng]}
            formItemClass="with-lang"
            changeLang={this.changeLang}
            formItemLayout={{
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }}
          />
        )}
        {caseDocsLang && (
          <Field
            name="caseDocsLang"
            component={renderSelect}
            label={caseDocsLang.name[this.lng]}
            formItemLayout={{
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }}
            isLoading={this.state.loading.caseDocLangObjLoading}
            data={caseDocLangObjOptions ? caseDocLangObjOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
            onMenuOpen={this.loadChilds('caseDocLangObj')}
          />
        )}


          {caseDateOfDeposit && (
              <Field
                  name="caseDateOfDeposit"
                  disabledDate={this.caseDateOfDeposit}
                  component={renderDatePicker}
                  format={null}
                  isSearchable={false}
                  label={caseDend.name[this.lng]}
                  formItemLayout={{
                      labelCol: {span: 10},
                      wrapperCol: {span: 14}
                  }}
                  colon
                  validate={requiredDate}
              />
          )}

        {irreparablyDamaged && (
          <Field
            name="irreparablyDamaged"
            component={renderCheckbox}
            label={irreparablyDamaged.name[this.lng]}
            normalize={v => v && String(irreparablyDamagedTrue.id)}
            formItemLayout={{
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }}
          />
        )}

        {caseOCD && (
          <Field
            name="caseOCD"
            component={renderCheckbox}
            label={caseOCD.name[this.lng]}
            normalize={v => v && String(caseOCDTrue.id)}
            formItemLayout={{
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }}
          />
        )}

          {caseInsurance && (
              <Field
                  name="caseInsurance"
                  component={renderCheckbox}
                  label={caseInsurance.name[this.lng]}
                  normalize={v => v && String(caseInsuranceTrue.id)}
                  formItemLayout={{
                      labelCol: {span: 10},
                      wrapperCol: {span: 14}
                  }}
              />
          )}


          {caseFundOfUse && (
              <Field
                  name="caseFundOfUse"
                  component={renderCheckbox}
                  label={caseFundOfUse.name[this.lng]}
                  normalize={Number}
                  formItemLayout={{
                      labelCol: {span: 10},
                      wrapperCol: {span: 14}
                  }}
              />
          )}


        {caseStorage && (
          <Field
            name="caseStorage"
            component={renderSelect}
            label={caseStorage.name[this.lng]}
            formItemLayout={{
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }}
            isLoading={this.state.caseStorageLoading}
            data={
              caseStorageOptions
                ? caseStorageOptions.map(option => ({
                  value: option.id,
                  label: option.name[this.lng]
                }))
                : []
            }
            onMenuOpen={this.loadOptions(["caseStorage"])}
            // validate={requiredLabel}
            // colon={true}
          />
        )}
        {rack && (
          <Field
            name="rack"
            component={renderSelect}
            label={rack.name[this.lng]}
            formItemLayout={{
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }}
            isLoading={this.state.rackLoading}
            data={
              rackOptions
                ? rackOptions.map(option => ({
                  value: option.id,
                  label: option.name[this.lng]
                }))
                : []
            }
            onMenuOpen={this.loadOptions(["rack"])}
            // validate={requiredLabel}
            // colon={true}
          />
        )}
        {shelf && (
          <Field
            name="shelf"
            component={renderSelect}
            label={shelf.name[this.lng]}
            formItemLayout={{
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }}
            isLoading={this.state.shelfLoading}
            data={
              shelfOptions
                ? shelfOptions.map(option => ({
                  value: option.id,
                  label: option.name[this.lng]
                }))
                : []
            }
            onMenuOpen={this.loadOptions(["shelf"])}
            // validate={requiredLabel}
            // colon={true}
          />
        )}
        {authorTitle && (
          <Field
            name="authorTitle"
            component={renderInputLang}
            format={value => (!!value ? value[lang.authorTitle] : '')}
            parse={value => { this.authorTitleValue[lang.authorTitle] = value; return {...this.authorTitleValue} }}
            label={authorTitle.name[this.lng]}
            formItemClass="with-lang"
            changeLang={this.changeLang}
            formItemLayout={{
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }}
          />
        )}



        {cameraOperator && (
          <Field
            name="cameraOperator"
            component={renderInputLang}
            format={value => (!!value ? value[lang.cameraOperator] : '')}
            parse={value => { this.cameraOperatorValue[lang.cameraOperator] = value; return {...this.cameraOperatorValue} }}
            label={cameraOperator.name[this.lng]}
            formItemClass="with-lang"
            changeLang={this.changeLang}
            formItemLayout={{
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }}
          />
        )}
        {artistOfTheWork && (
          <Field
            name="artistOfTheWork"
            component={renderInputLang}
            format={value => (!!value ? value[lang.artistOfTheWork] : '')}
            parse={value => { this.artistOfTheWorkValue[lang.artistOfTheWork] = value; return {...this.artistOfTheWorkValue} }}
            label={artistOfTheWork.name[this.lng]}
            formItemClass="with-lang"
            changeLang={this.changeLang}
            formItemLayout={{
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }}
          />
        )}
        {dateOfRecording && (
          <Field
            name="dateOfRecording"
            component={renderDatePicker}
            disabled={!!inaccurateDateFeatureValue}
            format={null}
            label={dateOfRecording.name[this.lng]}
            formItemLayout={{
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }}
            // colon
            // validate={requiredDate}
          />
        )}
        {timingOfVideoRecording && (
          <Field
            name="timingOfVideoRecording"
            component={renderInput}
            label={timingOfVideoRecording.name[this.lng]}
            formItemLayout={{
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }}
          />
        )}
        {TypeAndFormatOfRecording && (
          <Field
            name="TypeAndFormatOfRecording"
            component={renderInputLang}
            format={value => (!!value ? value[lang.TypeAndFormatOfRecording] : '')}
            parse={value => { this.TypeAndFormatOfRecordingValue[lang.TypeAndFormatOfRecording] = value; return {...this.TypeAndFormatOfRecordingValue} }}
            label={TypeAndFormatOfRecording.name[this.lng]}
            formItemClass="with-lang"
            changeLang={this.changeLang}
            formItemLayout={{
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }}
          />
        )}
          {numberOfVideoItems && (
              <Field
                  name="numberOfVideoItems"
                  component={renderInput}
                  label={numberOfVideoItems.name[this.lng]}
                  formItemLayout={{
                      labelCol: {span: 10},
                      wrapperCol: {span: 14}
                  }}
              />
          )}

        {original && (
          <Field
            name="original"
            component={renderInput}
            label={original.name[this.lng]}
            formItemLayout={{
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }}
          />
        )}
        {copy && (
          <Field
            name="copy"
            component={renderInput}
            label={copy.name[this.lng]}
            formItemLayout={{
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }}
          />
        )}

        {compositionOfTextDocumentation && (
          <Field
            name="compositionOfTextDocumentation"
            component={renderTextareaLang}
            format={value => (!!value ? value[lang.compositionOfTextDocumentation] : '')}
            parse={value => { this.compositionOfTextDocumentationValue[lang.compositionOfTextDocumentation] = value; return {...this.compositionOfTextDocumentationValue} }}
            label={compositionOfTextDocumentation.name[this.lng]}
            formItemClass="with-lang"
            changeLang={this.changeLang}
            formItemLayout={{
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }}
          />
        )}
        {caseNomenItem && (
          <Field
            name="caseNomenItem"
            disabled
            component={renderSelect}
            label={caseNomenItem.name[this.lng]}
            formItemLayout={{
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }}
          />
        )}
          {propAuthenticity && (
              <Field
                  name="propAuthenticity"
                  disabled
                  component={renderSelect}
                  label={propAuthenticity.name[this.lng]}
                  formItemLayout={{
                      labelCol: {span: 10},
                      wrapperCol: {span: 14}
                  }}
              />
          )}

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
            <Button
              className="signup-form__btn"
              type="danger"
              htmlType="button"
              disabled={submitting}
              style={{marginLeft: "10px"}}
              onClick={reset}
            >
              {submitting ? t("LOADING...") : t("CANCEL")}
            </Button>
            {error && (
              <span className="message-error">
                <i className="icon-error"/>
                {error}
              </span>
            )}
          </Form.Item>
        )}
      </Form>
    );
  }
}

const selector = formValueSelector('MainInfoCaseForm');

export default connect(state => {
  const inaccurateDateFeatureValue = selector(state, 'inaccurateDateFeature');
  return {
    inaccurateDateFeatureValue,
    caseDocsLangOptions: state.generalData.caseDocsLang,
    inaccurateDateFeatureOptions: state.generalData.inaccurateDateFeature,
    shelfOptions: state.generalData.shelf,
    rackOptions: state.generalData.rack,
    caseStorageOptions: state.generalData.caseStorage,
  }
}, {getObjChildsByConst, getPropVal, })(reduxForm({form: "MainInfoCaseForm", enableReinitialize: true})(MainInfoCaseForm));
