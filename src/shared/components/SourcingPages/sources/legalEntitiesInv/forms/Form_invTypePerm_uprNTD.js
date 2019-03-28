import React, { Component } from "react";
import { Button, Form, Row, Col } from "antd";
import { Field, reduxForm } from "redux-form";
import moment from "moment";
import { isEqual, pickBy } from "lodash";
import {
  renderCheckbox,
  renderDatePicker,
  renderInput,
  renderSelect,
  renderSelectVirt, renderTextarea
} from "../../../../../utils/form_components";
import {
  requiredDate,
  requiredLabel
} from "../../../../../utils/form_validations";
import {CUBE_FOR_AF_CASE, DO_FOR_CASE, DP_FOR_CASE} from "../../../../../constants/tofiConstants";
import { SYSTEM_LANG_ARRAY } from '../../../../../constants/constants';

/*eslint eqeqeq:0*/
class Form_invTypePerm_uprNTD extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lang: {
        workListName: localStorage.getItem("i18nextLng")
      },
      loading: {
        uprDocTypeLoading: false,
        inaccurateDateFeatureLoading: false,
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

  loadClsObj = (cArr, propConsts, dte = moment().format("YYYY-MM-DD")) => {
    return () => {
      cArr.forEach(c => {
        if (!this.props[c + "Options"]) {
          this.setState({
            loading: { ...this.state.loading, [c + "Loading"]: true }
          });
          this.props.getAllObjOfCls(c, dte, propConsts).then(() =>
            this.setState({
              loading: { ...this.state.loading, [c + "Loading"]: false }
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
  loadOptionsArr = cArr => {
    return () => {
      cArr.forEach(c => {
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
      uprDocTypeOptions,
      typeOfPaperCarrierOptions,
      tofiConstants: {
        fundNumber,
        caseDbeg,
        caseDend,
        caseNumberOfPages,
        caseOCD,
        fundIndex,
        caseNotes,
        uprDocType,
        objectCode,
        projectName,
        projectStage,
        projectPartName,
        volumeNumber,
        documentAuthor,
        caseOCDTrue,
        yearOfCompletion,
        numberOfOriginals,
        typeOfPaperCarrier,
        caseNomenItem
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
              component={renderTextarea}
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
            {uprDocType && (
              <Field
                name="uprDocType"
                component={renderSelectVirt}
                isSearchable
                matchProp="label"
                matchPos="start"
                label={uprDocType.name[this.lng]}
                optionHeight={40}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
                isLoading={this.state.loading.uprDocTypeLoading}
                onMenuOpen={this.loadOptions("uprDocType")}
                options={
                  uprDocTypeOptions
                    ? uprDocTypeOptions.map(option => ({
                        value: option.id,
                        label: option.name[this.lng]
                      }))
                    : []
                }
                // validate={requiredLabel}
                // colon={true}
              />
            )}
            {objectCode && (
              <Field
                name="objectCode"
                component={renderInput}
                label={objectCode.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
              />
            )}
            {projectName && (
              <Field
                name="projectName"
                component={renderInput}
                label={projectName.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
              />
            )}
            {projectStage && (
              <Field
                name="projectStage"
                component={renderInput}
                label={projectStage.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
              />
            )}
            {projectPartName && (
              <Field
                name="projectPartName"
                component={renderInput}
                label={projectPartName.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
              />
            )}
            {volumeNumber && (
              <Field
                name="volumeNumber"
                component={renderInput}
                label={volumeNumber.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
              />
            )}
            {documentAuthor && (
              <Field
                name="documentAuthor"
                component={renderInput}
                label={documentAuthor.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
              />
            )}
          </Col>
          <Col md={{ span: 10, offset: 1 }} xs={{ span: 20, offset: 1 }}>
            {yearOfCompletion && (
              <Field
                name="yearOfCompletion"
                component={renderInput}
                label={yearOfCompletion.name[this.lng]}
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
  form: "Form_invTypePerm_uprNTD",
  enableReinitialize: true
})(Form_invTypePerm_uprNTD);
