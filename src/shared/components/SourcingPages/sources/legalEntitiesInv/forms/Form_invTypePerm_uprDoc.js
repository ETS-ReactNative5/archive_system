import React, {Component} from "react";
import {Button, Form, Row, Col} from "antd";
import {Field, formValueSelector, reduxForm} from "redux-form";
import moment from "moment";
import {isEqual, pickBy} from "lodash";
import {
  renderCheckbox,
  renderDatePicker,
  renderInput,
  renderSelect,
  renderTextarea
} from "../../../../../utils/form_components";
import {
  requiredDate,
  requiredLabel
} from "../../../../../utils/form_validations";
import {connect} from "react-redux";
import {CUBE_FOR_AF_CASE, DO_FOR_CASE, DP_FOR_CASE} from "../../../../../constants/tofiConstants";
import {SYSTEM_LANG_ARRAY} from "../../../../../constants/constants";
import {getObjChildsByConst} from "../../../../../actions/actions";

/*eslint eqeqeq:0*/
class Form_invTypePerm_uprDoc extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lang: {
        workListName: localStorage.getItem("i18nextLng")
      },
      loading: {
        uprDocObjLoading: false,
        inaccurateDateFeatureLoading: false,
        typeOfPaperCarrierLoading: false
      }
    };
  }

  changeLang = e => {
    this.setState({
      lang: {...this.state.lang, [e.target.name]: e.target.value}
    });
  };

  onSubmit = ({caseTitle, ...values}) => {
    if (!this.props.initialValues.caseKey) {
      return this.props.saveCase({
        objData: {caseTitle: caseTitle, parent: this.props.initialValues.parent},
        props: {
          ...pickBy(
            values, (val, key) => !isEqual(val, this.props.initialValues[key])
          ),
          fundIndex: values.fundIndex,
          fundFeature: String(this.props.tofiConstants.notIncluded.id),
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
      if(caseTitle) {
        objData.name = {};
        SYSTEM_LANG_ARRAY.forEach(lang => {
          objData.name[lang] = caseTitle
        });
      }
      return this.props.saveCaseProps({cube, caseNomenItemValue: values.caseNomenItem.value}, props, this.props.initialValues.caseKey, objData);
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
  loadObjChildsByConst = (c, props) => {
    return () => {
      if (!this.props[c + "Options"]) {
        this.setState({
          loading: {...this.state.loading, [c + "Loading"]: true}
        });
        this.props.getObjChildsByConst(c, props).then(() =>
          this.setState({
            loading: {...this.state.loading, [c + "Loading"]: false}
          })
        );
      }
    }
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

  render() {
    if (!this.props.tofiConstants) return null;

    this.lng = localStorage.getItem("i18nextLng");
    const {
      t,
      handleSubmit,
      reset,
      dirty,
      error,
      submitting,
      uprDocObjOptions,
      inaccurateDateFeatureOptions,
      typeOfPaperCarrierOptions,
      documentDateValue,
      inaccurateDateFeatureValue,
      tofiConstants: {
        fundNumber,
        caseDbeg,
        caseDend,
        caseNumberOfPages,
        caseOCD,
        caseOCDTrue,
        fundIndex,
        caseNotes,
        uprDocType,
        documentAuthor,
        addressee,
        question,
        terrain,
        documentDate,
        inaccurateDate,
        inaccurateDateFeature,
        day,
        month,
        year,
        numberOfOriginals,
        typeOfPaperCarrier,
        caseNomenItem
      }
    } = this.props;

    return (
      <Form
        className="antForm-spaceBetween"
        onSubmit={handleSubmit(this.onSubmit)}
        style={dirty ? {paddingBottom: "43px"} : {}}
      >
        <Row>
          <Col md={{span: 10, offset: 1}} xs={{span: 20, offset: 1}}>
            <Field
              name="caseTitle"
              component={renderTextarea}
              label={t("CASE_TITLE")}
              formItemLayout={{
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }}
            />
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
            {uprDocType && (
              <Field
                name="uprDocType"
                component={renderSelect}
                isSearchable
                matchProp="label"
                matchPos="start"
                label={uprDocType.name[this.lng]}
                optionHeight={40}
                formItemLayout={{
                  labelCol: {span: 10},
                  wrapperCol: {span: 14}
                }}
                isLoading={this.state.loading.uprDocObjLoading}
                onMenuOpen={this.loadObjChildsByConst('uprDocObj')}
                data={uprDocObjOptions ? uprDocObjOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
                // validate={requiredLabel}
                // colon={true}
              />
            )}
            {documentAuthor && (
              <Field
                name="documentAuthor"
                component={renderInput}
                label={documentAuthor.name[this.lng]}
                formItemLayout={{
                  labelCol: {span: 10},
                  wrapperCol: {span: 14}
                }}
              />
            )}
            {addressee && (
              <Field
                name="addressee"
                component={renderInput}
                label={addressee.name[this.lng]}
                formItemLayout={{
                  labelCol: {span: 10},
                  wrapperCol: {span: 14}
                }}
              />
            )}
            {question && (
              <Field
                name="question"
                component={renderInput}
                label={question.name[this.lng]}
                formItemLayout={{
                  labelCol: {span: 10},
                  wrapperCol: {span: 14}
                }}
              />
            )}
            {terrain && (
              <Field
                name="terrain"
                component={renderSelect}
                label={terrain.name[this.lng]}
                formItemLayout={{
                  labelCol: {span: 10},
                  wrapperCol: {span: 14}
                }}
              />
            )}
            {documentDate && (
              <Field
                name="documentDate"
                component={renderDatePicker}
                disabled={!!inaccurateDateFeatureValue}
                format={null}
                label={documentDate.name[this.lng]}
                formItemLayout={{
                  labelCol: {span: 10},
                  wrapperCol: {span: 14}
                }}
                // colon
                // validate={requiredDate}
              />
            )}
            <hr/>
            <Form.Item>
              <h3>{inaccurateDate.name[this.lng]}</h3>
            </Form.Item>
            {inaccurateDateFeature && (
              <Field
                name="inaccurateDateFeature"
                component={renderSelect}
                disabled={!!documentDateValue}
                label={inaccurateDateFeature.name[this.lng]}
                optionHeight={40}
                formItemLayout={{
                  labelCol: {span: 10},
                  wrapperCol: {span: 14}
                }}
                isLoading={this.state.loading.inaccurateDateFeatureLoading}
                onMenuOpen={this.loadOptions("inaccurateDateFeature")}
                data={
                  inaccurateDateFeatureOptions
                    ? inaccurateDateFeatureOptions.map(option => ({
                      value: option.id,
                      label: option.name[this.lng]
                    }))
                    : []
                }
                // validate={requiredLabel}
                // colon={true}
              />
            )}
            {day && (
              <Field
                name="day"
                component={renderInput}
                disabled={!inaccurateDateFeatureValue}
                label={day.name[this.lng]}
                formItemLayout={{
                  labelCol: {span: 10},
                  wrapperCol: {span: 14}
                }}
              />
            )}
            {month && (
              <Field
                name="month"
                component={renderInput}
                disabled={!inaccurateDateFeatureValue}
                label={month.name[this.lng]}
                formItemLayout={{
                  labelCol: {span: 10},
                  wrapperCol: {span: 14}
                }}
              />
            )}
            {year && (
              <Field
                name="year"
                component={renderInput}
                disabled={!inaccurateDateFeatureValue}
                label={year.name[this.lng]}
                formItemLayout={{
                  labelCol: {span: 10},
                  wrapperCol: {span: 14}
                }}
              />
            )}
            <hr/>
          </Col>
          <Col md={{span: 10, offset: 1}} xs={{span: 20, offset: 1}}>
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
            {caseNotes && (
              <Field
                name="caseNotes"
                component={renderInput}
                label={caseNotes.name[this.lng]}
                formItemLayout={{
                  labelCol: {span: 10},
                  wrapperCol: {span: 14}
                }}
              />
            )}
            {numberOfOriginals && (
              <Field
                name="numberOfOriginals"
                component={renderInput}
                label={numberOfOriginals.name[this.lng]}
                formItemLayout={{
                  labelCol: {span: 10},
                  wrapperCol: {span: 14}
                }}
              />
            )}
            {typeOfPaperCarrier && (
              <Field
                name="typeOfPaperCarrier"
                component={renderSelect}
                label={typeOfPaperCarrier.name[this.lng]}
                formItemLayout={{
                  labelCol: {span: 10},
                  wrapperCol: {span: 14}
                }}
                isLoading={this.state.typeOfPaperCarrierLoading}
                data={
                  typeOfPaperCarrierOptions
                    ? typeOfPaperCarrierOptions.map(option => ({
                      value: option.id,
                      label: option.name[this.lng]
                    }))
                    : []
                }
                onMenuOpen={this.loadOptions(["typeOfPaperCarrier"])}
                // validate={requiredLabel}
                // colon={true}
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
          </Col>
        </Row>
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

const selector = formValueSelector('Form_invTypePerm_uprDoc');

export default connect(state => {
  const documentDateValue = selector(state, 'documentDate');
  const inaccurateDateFeatureValue = selector(state, 'inaccurateDateFeature');
  return {
    documentDateValue,
    inaccurateDateFeatureValue,
    uprDocObjOptions: state.generalData.uprDocObj
  }
}, {getObjChildsByConst})(reduxForm({form: "Form_invTypePerm_uprDoc", enableReinitialize: true})(Form_invTypePerm_uprDoc));
