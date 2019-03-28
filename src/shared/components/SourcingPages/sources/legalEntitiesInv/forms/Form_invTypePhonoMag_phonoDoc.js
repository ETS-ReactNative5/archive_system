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
class Form_invTypePhonoMag_phonoDoc extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lang: {
        workListName: localStorage.getItem("i18nextLng")
      },
      loading: {
        uprDocTypeLoading: false,
        magneticTapeTypeLoading: false,
        genreLoading: false
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
      const { caseTitle, ...props } = pickBy(values, (val, key) => !isEqual(val, this.props.initialValues[key]));
      if(caseTitle) {
        objData.name = {};
        SYSTEM_LANG_ARRAY.forEach(lang => {
          objData.name[lang] = caseTitle
        });
      }
      return this.props.saveProps({cube, caseNomenItemValue: values.caseNomenItem.value}, props, this.props.initialValues.caseKey, objData);
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
      magneticTapeTypeOptions,
      genreOptions,
      tofiConstants: {
        magneticTapeType,
        fundNumber,
        fundIndex,
        caseDbeg,
        caseDend,
        soundingSpeed,
        accountingUnitNumber,
        mainContent,
        caseOCD,
        caseOCDTrue,
        eventLocation,
        caseNotes,
        original,
        numberOfOriginals,
        compositionOfTextDocumentation,
        documentLanguage,
        dateOfRecording,
        recordingPlace,
        documentDate,
        firstLine,
        documentAuthor,
        playingTime,
        numberOfVideoItems,
        copy,
        artistOfTheWork,
        initialsOfAuthors,
        initialsOfTranslators,
        genre,
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
            {accountingUnitNumber && (
              <Field
                name="accountingUnitNumber"
                component={renderInput}
                label={accountingUnitNumber.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
              />
            )}
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
            {mainContent && (
              <Field
                name="mainContent"
                component={renderInput}
                label={mainContent.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
              />
            )}
            {genre && (
              <Field
                name="genre"
                component={renderInput}
                label={genre.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
              />
            )}
            {eventLocation && (
              <Field
                name="eventLocation"
                component={renderSelect}
                label={eventLocation.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
              />
            )}
            {documentDate && (
              <Field
                name="documentDate"
                component={renderDatePicker}
                format={null}
                label={documentDate.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
              />
            )}
            {firstLine && (
              <Field
                name="firstLine"
                component={renderInput}
                label={firstLine.name[this.lng]}
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
            {artistOfTheWork && (
              <Field
                name="artistOfTheWork"
                component={renderInput}
                label={artistOfTheWork.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
              />
            )}
          </Col>
          <Col md={{ span: 10, offset: 1 }} xs={{ span: 20, offset: 1 }}>
            {initialsOfAuthors && (
              <Field
                name="initialsOfAuthors"
                component={renderInput}
                label={initialsOfAuthors.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
              />
            )}
            {initialsOfTranslators && (
              <Field
                name="initialsOfTranslators"
                component={renderInput}
                label={initialsOfTranslators.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
              />
            )}
            {documentLanguage && (
              <Field
                name="documentLanguage"
                component={renderSelect}
                label={documentLanguage.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
              />
            )}
            {dateOfRecording && (
              <Field
                name="dateOfRecording"
                component={renderDatePicker}
                format={null}
                label={dateOfRecording.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
              />
            )}
            TODO {/*create such constant*/}
            {recordingPlace && (
              <Field
                name="recordingPlace"
                component={renderInput}
                label={recordingPlace.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
              />
            )}
            {soundingSpeed && (
              <Field
                name="soundingSpeed"
                component={renderInput}
                label={soundingSpeed.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
              />
            )}
            {playingTime && (
              <Field
                name="playingTime"
                component={renderInput}
                label={playingTime.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
              />
            )}
            {magneticTapeType && (
              <Field
                name="magneticTapeType"
                component={renderInput}
                label={magneticTapeType.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
              />
            )}
            <Form.Item>
              <h3>{numberOfVideoItems.name[this.lng]}</h3>
            </Form.Item>
            {original && (
              <Field
                name="original"
                component={renderInput}
                label={original.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
              />
            )}
            {copy && (
              <Field
                name="copy"
                component={renderInput}
                label={copy.name[this.lng]}
                formItemLayout={{
                  labelCol: { span: 10 },
                  wrapperCol: { span: 14 }
                }}
              />
            )}
            {compositionOfTextDocumentation && (
              <Field
                name="compositionOfTextDocumentation"
                component={renderInput}
                label={compositionOfTextDocumentation.name[this.lng]}
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
  form: "Form_invTypePhonoMag_phonoDoc",
  enableReinitialize: true
})(Form_invTypePhonoMag_phonoDoc);
