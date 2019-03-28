import React, { Component } from "react";
import { Button, Form, Row, Col } from "antd";
import { Field, reduxForm } from "redux-form";
import moment from "moment";
import { isEqual, pickBy } from "lodash";
import {
  renderCheckbox,
  renderDatePicker,
  renderInput,
  renderSelect
} from "../../../../../utils/form_components";
import {
  requiredDate} from "../../../../../utils/form_validations";
import {CUBE_FOR_AF_CASE, DO_FOR_CASE, DP_FOR_CASE} from "../../../../../constants/tofiConstants";
import { SYSTEM_LANG_ARRAY } from '../../../../../constants/constants';

/*eslint eqeqeq:0*/
class Form_invTypeLS_LSDoc extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lang: {
        workListName: localStorage.getItem("i18nextLng")
      },
      loading: {
        typeOfPaperCarrierLoading: false
      }
    };
  }

  changeLang = e => {
    this.setState({
      lang: { ...this.state.lang, [e.target.name]: e.target.value }
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
      const { caseTitle, ...props } = pickBy(values, (val, key) => !isEqual(val, this.props.initialValues[key]));
      if(caseTitle) {
        objData.name = {};
        SYSTEM_LANG_ARRAY.forEach(lang => {
          objData.name[lang] = caseTitle
        });
      }
      return this.props.saveCaseProps({cube, caseNomenItemValue: values.caseNomenItem.value}, props, this.props.initialValues.caseKey, objData);
    }
  };

  loadOptions = c => {
    return () => {
      if (!this.props[c + "Options"]) {
        this.setState({
          loading: { ...this.state.loading, [c + "Loading"]: true }
        });
        this.props.getPropVal(c).then(() =>
          this.setState({
            loading: { ...this.state.loading, [c + "Loading"]: false }
          })
        );
      }
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
      typeOfPaperCarrierOptions,
      lsDocTypeOptions,
      tofiConstants: {
        fundNumber,
        caseDbeg,
        caseDend,
        caseOCD,
        caseOCDTrue,
        caseNumberOfPages,
        fundIndex,
        caseNotes,
        numberOfOriginals,
        typeOfPaperCarrier,
        caseNomenItem,
        lsDocType
      }
    } = this.props;


    return (
      <Form
        className="antForm-spaceBetween"
        onSubmit={handleSubmit(this.onSubmit)}
        style={dirty ? { paddingBottom: "43px" } : {}}
      >
        <Row>
          <Col md={{ span: 10, offset: 1 }} xs={{ span: 20, offset: 1 }}>
            <Field
              name="caseTitle"
              component={renderInput}
              label={t("CASE_TITLE")}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
            />
            {fundNumber && (
              <Field
                name="fundNumber"
                component={renderInput}
                label={fundNumber.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
              />
            )}
            {fundIndex && (
              <Field
                name="fundIndex"
                component={renderInput}
                label={fundIndex.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
              />
            )}
            {caseOCD && (
              <Field
                name="caseOCD"
                component={renderCheckbox}
                normalize={v => v && String(caseOCDTrue.id)}
                label={caseOCD.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
              />
            )}
            {caseDbeg && (
              <Field
                name="caseDbeg"
                disabledDate={this.disabledStartDate}
                component={renderDatePicker}
                format={null}
                label={caseDbeg.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
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
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
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
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
              />
            )}
            {lsDocType && (
              <Field
                name="lsDocType"
                component={renderSelect}
                label={lsDocType.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
                isLoading={!!this.state.lsDocTypeLoading}
                data={
                  lsDocTypeOptions
                    ? lsDocTypeOptions.map(option => ({
                      value: option.id,
                      label: option.name[this.lng]
                    }))
                    : []
                }
                onMenuOpen={this.loadOptions("lsDocType")}
              />
            )}
            {caseNotes && (
              <Field
                name="caseNotes"
                component={renderInput}
                label={caseNotes.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
              />
            )}
            {numberOfOriginals && (
              <Field
                name="numberOfOriginals"
                component={renderInput}
                label={numberOfOriginals.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
              />
            )}
            {typeOfPaperCarrier && (
              <Field
                name="typeOfPaperCarrier"
                component={renderSelect}
                label={typeOfPaperCarrier.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
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
                onMenuOpen={this.loadOptions("typeOfPaperCarrier")}
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
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
              />
            )}
          </Col>
        </Row>
        {dirty && (
          <Form.Item className="ant-form-btns">
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
              style={{ marginLeft: "10px" }}
              onClick={reset}
            >
              {submitting ? t("LOADING...") : t("CANCEL")}
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
    );
  }
}

export default reduxForm({
  form: "Form_invTypeLS_LSDoc",
  enableReinitialize: true
})(Form_invTypeLS_LSDoc);
