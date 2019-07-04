import React, { Component } from "react";
import { Button, Form,message, Collapse } from "antd";
import { Field, formValueSelector, reduxForm } from "redux-form";
import moment from "moment";
import { isEqual,isEmpty, pickBy } from "lodash";
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
import { requiredDate, requiredLabel } from "../../utils/form_validations";
import { connect } from "react-redux";
import {
  CUBE_FOR_AF_CASE,
  DO_FOR_CASE,
  DP_FOR_CASE
} from "../../constants/tofiConstants";
import { SYSTEM_LANG_ARRAY } from "../../constants/constants";
import { getObjChildsByConst,getCube,getObjListNew, getPropVal } from "../../actions/actions";
import { requiredLng } from "./../../utils/form_validations";
import {parseCube_new, parseForTable} from "../../utils/cubeParser";

const Panel = Collapse.Panel;

/*eslint eqeqeq:0*/
class MainInfoCaseForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data:[],
        Options:[],
        optionMultiSelect:[],
      lang: {
        name: localStorage.getItem("i18nextLng"),
        caseNotes: localStorage.getItem("i18nextLng")
      },
      loading: {
        caseDocLangObjLoading: false,
        uprDocTypeLoading: false,
        inaccurateDateFeatureLoading: false,
        typeOfPaperCarrierLoading: false,
        caseStorageLoading: false,
        rackLoading: false,
        shelfLoading: false,
        documentTypeLoading: false,
        propAuthenticityLoading: false
      }
    };
  }

  nameValue = this.props.initialValues.name && { ...this.props.initialValues.name } || {
    kz: "",
    ru: "",
    en: ""
  };
  caseNotesValue = this.props.initialValues.caseNotes && { ...this.props.initialValues.caseNotes } || {
    kz: "",
    ru: "",
    en: ""
  };

  changeLang = e => {
    this.setState({
      lang: { ...this.state.lang, [e.target.name]: e.target.value }
    });
  };

  onSubmit = ({ name,documentFile, ...values }) => {
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
    loadOptionsGet = async(c, id) => {
        const fd = new FormData();
        fd.append('parent', this.props.keyInvFund.split('_')[1]);
        fd.append('clsConsts', 'structuralSubdivisionList');
        const res = await getObjListNew(fd);
        if (!res.success) {
            res.errors.forEach(err => {
                message.error(err.text);

            })
        }
        this.setState({
            Options: res.data
        })
    };
  loadChilds = (c, props) => {
    return () => {
      if (!this.props[c + "Options"]) {
        this.setState({
          loading: { ...this.state.loading, [c + "Loading"]: true }
        });
        this.props
          .getObjChildsByConst(c, props)
          .then(() =>
            this.setState({
              loading: {
                ...this.state.loading,
                [c + "Loading"]: false
              }
            })
          )
          .catch(err => console.error(err));
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

  componentDidUpdate(prevProps) {
    if (prevProps.initialValues !== this.props.initialValues) {

      this.nameValue = { ...this.props.initialValues.name } || {
        kz: "",
        ru: "",
        en: ""
      };
      this.caseNotesValue = { ...this.props.initialValues.caseNotes } || {
        kz: "",
        ru: "",
        en: ""
      };
    }
  }



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
    const { lang, loading } = this.state;
    this.lng = localStorage.getItem("i18nextLng");
    const {
      t,
      handleSubmit,
      reset,
      dirty,
      invType,
      docType,
      error,
      submitting,
      uprDocTypeOptions,
      inaccurateDateFeatureOptions,
      typeOfPaperCarrierOptions,
      documentDateValue,
      inaccurateDateFeatureValue,
      caseDocLangObjOptions,
      documentTypefOptions,
      documentTypeOptions,
      rackOptions,
      caseStorageOptions,
      shelfOptions,
      linkToKatalogOptions,
      linkToUkazOptions,
      linkToObzorOptions,
      surnameOriginatorOptions,
      uprDocObjOptions,
      storageUnitTypeOptions,
      caseNomenItemOptions,
      objEventLocationOptions,
      accountingUnitTypeOptions,
      shootPlaceOptions,
      eventLocationOptions,
      propNationalityOptions,
      manufacturePlaceOptions,
      electronicDocumentsFormatOptions,
      recordPlaceOptions,
      terrainOptions,
      propAuthenticityOptions,
      fundFeatureOptions,
      dateAccuracyOptions,
      movieVariantOptions,
      publicPositionOfPersonOptions,
      documentLanguageOptions,
      documentPlaybackMethodOptions,
        caseOCDOptions,
        caseStructuralSubdivisionOption,
        sectionOptions,
        bunchCasesOptions,
      tofiConstants: {
        uprDoc,
        uprNTD,
          section,
        videoDoc,
        movieDoc,
        phonoDoc,
          bunchCases,
        photoDoc,
          yes,
        macReadDoc,
        lpDoc,
        microformDoc,
        microfilmsDoc,
        invTypeDigital,
        caseDateOfDeposit,
        caseNumber,
        caseDbeg,
        serialNumber,
        uprDocObj,
        caseDend,
        invTypePerm,
        invTypeVideo,
        invTypeMovie,
        invTypePhonoGram,
        invTypePhonoMag,
        invTypeAlbum,
        invTypeLS,
        invTypeLP,
        invTypePhoto,
        invOCD,
        LPDoc,
        caseDocLangObj,
        caseNumberOfPages,
        caseStructuralSubdivision,
        caseOCD,
        caseOCDTrue,
          irreparablyDamagedFalse,
        fundIndex,
        caseNotes,
        uprDocType,
        caseInsurance,
        caseInsuranceTrue,
        documentAuthor,
        addressee,
        question,
        terrain,
        irreparablyDamaged,
        irreparablyDamagedTrue,
        documentDate,
        inaccurateDate,
        inaccurateDateFeature,
        day,
        month,
        documentFile,
        year,
        numberOfOriginals,
        typeOfPaperCarrier,
        caseNomenItem,
        caseDocsLang,
        caseFundOfUse,
        caseFundOfUseTrue,
        caseStorage,
        fundFeature,
        dateForming,
        rack,
        linkToKatalog,
        shelf,
        documentType,
        linkToUkaz,
        storageUnitType,
        linkToObzor,
        propAuthenticity,
        storageUnitQuantity,
        accountingUnitType,
        surnameOriginator,
        dateAccuracy,
        objectCode,
        projectName,
        volumeNumber,
        projectStage,
        projectPartName,
        cameraOperator,
        yearOfCompletion,
        authorTitle,
        artistOfTheWork,
        dateOfRecording,
        timingOfVideoRecording,
        TypeAndFormatOfRecording,
        accountingUnitNumber,
        numberOfVideoItems,
        original,
        copy,
        shootingDate,
        shootPlace,
        movieVariant,
        formatAndBase,
        numberOfMovieItems,
        movieNegative,
        doubleNegative,
        phonogramNegative,
        phonogramMagnetic,
        intermediatePositive,
        positive,
        colorPassports,
        playingTime,
        mainContent,
        genre,
        eventLocation,
        firstLine,
        initialsOfAuthors,
        initialsOfTranslators,
        manufactureDate,
        manufacturePlace,
        numberOfPhonoItems,
        gremoriginal,
        gramplastine,
        recordPlace,
        soundingSpeed,
        magneticTapeType,
        photoDescription,
        documentShootAuthor,
        numberOfPhotoPrints,
        externalFeatures,
        productionNumber,
        numberOfPhotoItems,
        photoNegative,
        photoDoubleNegative,
        photoPositive,
        photocast,
        slide,
        filmStrip,
        electronicDocumentsFormat,
        personLastName,
        personName,
        personPatronymic,
        publicPositionOfPerson,
        propNationality,
        documentLanguage,
        compositionOfTextDocumentation,
        documentPlaybackMethod
      }
    } = this.props;
    return (

      <Form
        className="antForm-spaceBetween"
        onSubmit={handleSubmit(this.onSubmit)}
        style={dirty ? { paddingBottom: "43px" } : {}}
      >
        {caseNumber && (
          <Field
            name="caseNumber"
            component={renderInput}
            normalize={this.strToRedux}
            label={caseNumber.name[this.lng]}
            formItemLayout={{
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }}
          />
        )}
        {fundIndex &&
          this.showInput([
            {
              invType: invTypePerm,
              docType: uprDoc
            },
            {
              invType: invTypePerm,
              docType: uprNTD
            },
            {
              invType: invTypeVideo,
              docType: videoDoc
            },
            {
              invType: invTypeMovie,
              docType: movieDoc
            },
            {
              invType: invTypePhonoGram,
              docType: phonoDoc
            },
            {
              invType: invTypePhonoMag,
              docType: phonoDoc
            },
            {
              invType: invTypeLS,
              docType: lpDoc
            }
          ]) && (
            <Field
              name="fundIndex"
              component={renderInput}
              normalize={this.strToRedux}
              label={fundIndex.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
            />
          )}
        <Field
          name="name"
          component={renderInputLang}
          format={value => (!!value ? value[lang.name] : "")}
          parse={value => {
            this.nameValue[lang.name] = value;
            return { ...this.nameValue };
          }}
          label={t("NAME")}
          formItemClass="with-lang"
          changeLang={this.changeLang}
          formItemLayout={{
            labelCol: { span: 10 },
            wrapperCol: { span: 14 }
          }}
          validate={requiredLng}
          colon={true}
        />
        {caseDbeg &&
          this.showInput([
            {
              invType: invTypePerm,
              docType: uprDoc
            },
            {
              invType: invTypePerm,
              docType: uprNTD
            },
            {
              invType: invTypeAlbum,
              docType: photoDoc
            },
            {
              invType: invTypeDigital,
              docType: uprDoc
            },
            {
              invType: invTypeLS,
              docType: lpDoc
            },
            {
              invType: invTypeLP,
              docType: lpDoc
            }
          ]) && (
            <Field
              name="caseDbeg"
              disabledDate={this.disabledStartDate}
              component={renderDatePicker}
              normalize={this.dateToRedux}
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
        {caseDend &&
          this.showInput([
            {
              invType: invTypePerm,
              docType: uprDoc
            },
            {
              invType: invTypePerm,
              docType: uprNTD
            },
            {
              invType: invTypeAlbum,
              docType: photoDoc
            },
            {
              invType: invTypeDigital,
              docType: uprDoc
            },
            {
              invType: invTypeLS,
              docType: lpDoc
            },
            {
              invType: invTypeLP,
              docType: lpDoc
            }
          ]) && (
            <Field
              name="caseDend"
              disabledDate={this.disabledEndDate}
              component={renderDatePicker}
              normalize={this.dateToRedux}
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
        {caseNumberOfPages &&
          this.showInput([
            {
              invType: invTypePerm,
              docType: uprDoc
            },
            {
              invType: invTypePerm,
              docType: uprNTD
            },
            {
              invType: invTypeLS,
              docType: lpDoc
            }
          ]) && (
            <Field
              name="caseNumberOfPages"
              component={renderInput}
              label={caseNumberOfPages.name[this.lng]}
              normalize={(val, prevVal, obj, prevObj)=>this.strToRedux(val, prevVal, obj, prevObj, true)}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
            />
          )}
        {caseStructuralSubdivision && (
          <Field
            name="caseStructuralSubdivision"
            component={renderSelect}
            normalize={this.selectToRedux}
            label={caseStructuralSubdivision.name[this.lng]}
            formItemLayout={{
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }}
            isLoading={loading.caseStructuralSubdivision}
            data={
                this.state.Options
                ? this.state.Options.map(option => ({
                    value: option.id,
                    label: option.name[this.lng]
                  }))
                : []
            }
            onMenuOpen={()=>this.loadOptionsGet("caseStructuralSubdivision")}
          />
        )}
        {caseNotes && (
          <Field
            name="caseNotes"
            component={renderTextareaLang}
            format={value => (!!value ? value.valueLng[lang.caseNotes] : "")}
            normalize={(val, prevVal, obj, prevObj) => {
              let newVal = { ...prevVal };
              newVal.value = val;
              if (!!newVal.valueLng) {
                newVal.valueLng[lang.caseNotes] = val;
              } else {
                newVal["valueLng"] = { kz: "", en: "", ru: "" };
                newVal.valueLng[lang.caseNotes] = val;
              }
              return newVal;
            }}
            label={caseNotes.name[this.lng]}
            formItemClass="with-lang"
            changeLang={this.changeLang}
            formItemLayout={{
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }}
          />
        )}
        {caseDocsLang && (
          <Field
            name="caseDocsLang"
            component={renderSelect}
            isMulti
            normalize={this.selectMultiToRedux}
            label={caseDocsLang.name[this.lng]}
            formItemLayout={{
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }}
            isLoading={this.state.loading.caseDocLangObjLoading}
            data={
              caseDocLangObjOptions
                ? caseDocLangObjOptions.map(option => ({
                    value: option.id,
                    label: option.name[this.lng]
                  }))
                : []
            }
            onMenuOpen={this.loadChilds("caseDocLangObj")}
          />
        )}
        {irreparablyDamaged && (
          <Field
            name="irreparablyDamaged"
            component={renderCheckbox}
            label={irreparablyDamaged.name[this.lng]}
            format={v => v && v.value===irreparablyDamagedTrue.id ? true : false}
            normalize={this.checkboxToRedux}
            formItemLayout={{
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }}
          />
        )}
        {caseOCD && (
          <Field
            name="caseOCD"
            component={renderSelect}
            normalize={this.selectToRedux}
            label={caseOCD.name[this.lng]}
            formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
            }}
            isLoading={this.state.caseStorageLoading}
            data={
                caseOCDOptions
                    ? caseOCDOptions.map(option => ({
                        value: option.id,
                        label: option.name[this.lng]
                    }))
                    : []
            }
            onMenuOpen={this.loadOptions(["caseOCD"])}
          />
        )}
        {caseInsurance && (
          <Field
            name="caseInsurance"
            component={renderCheckbox}
            label={caseInsurance.name[this.lng]}
            format={v => v && v.value===caseInsuranceTrue.id?true:false }
            normalize={this.checkboxToRedux2}
            formItemLayout={{
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }}
          />
        )}
        {caseFundOfUse && (
          <Field
            name="caseFundOfUse"
            component={renderCheckbox}
            label={caseFundOfUse.name[this.lng]}
            format={v => v && v.value===caseFundOfUseTrue.id?true:false }
            normalize={this.checkboxToRedux3}
            formItemLayout={{
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }}
          />
        )}
        {bunchCases && (
          <Field
            name="bunchCases"
            component={renderSelect}
            normalize={this.selectToRedux}
            label={bunchCases.name[this.lng]}
            formItemLayout={{
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }}
            isLoading={this.state.caseStorageLoading}
            data={
                this.state.Options
                ? this.state.Options.map(option => ({
                    value: option.id,
                    label: option.name[this.lng]
                  }))
                : []
            }
            onMenuOpen={()=>this.loadOptionsGet(["bunchCases"])}
            // validate={requiredLabel}
            // colon={true}
          />
        )}
          {caseStorage && (
              <Field
                  name="caseStorage"
                  component={renderSelect}
                  normalize={this.selectToRedux}
                  label={caseStorage.name[this.lng]}
                  formItemLayout={{
                      labelCol: { span: 10 },
                      wrapperCol: { span: 14 }
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
            normalize={this.selectToRedux}
            label={rack.name[this.lng]}
            formItemLayout={{
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
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

          {section && (
              <Field
                  name="section"
                  component={renderSelect}
                  normalize={this.selectToRedux}
                  label={section.name[this.lng]}
                  formItemLayout={{
                      labelCol: { span: 10 },
                      wrapperCol: { span: 14 }
                  }}
                  isLoading={this.state.rackLoading}
                  data={
                      sectionOptions
                          ? sectionOptions.map(option => ({
                              value: option.id,
                              label: option.name[this.lng]
                          }))
                          : []
                  }
                  onMenuOpen={this.loadOptions(["section"])}
                  // validate={requiredLabel}
                  // colon={true}
              />
          )}

        {shelf && (
          <Field
            name="shelf"
            component={renderSelect}
            normalize={this.selectToRedux}
            label={shelf.name[this.lng]}
            formItemLayout={{
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
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
        {propAuthenticity && (
          <Field
            name="propAuthenticity"
            component={renderSelect}
            normalize={this.selectToRedux}

            label={propAuthenticity.name[this.lng]}
            formItemLayout={{
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }}
            isLoading={this.state.shelfLoading}
            data={
              propAuthenticityOptions
                ? propAuthenticityOptions.map(option => ({
                    value: option.id,
                    label: option.name[this.lng]
                  }))
                : []
            }
            onMenuOpen={this.loadOptions(["propAuthenticity"])}
            // validate={requiredLabel}
            // colon={true}
          />
        )}
        {fundFeature && (
          <Field
            name="fundFeature"
            component={renderSelect}
            normalize={this.selectToRedux}
            label={fundFeature.name[this.lng]}
            formItemLayout={{
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }}
            isLoading={this.state.shelfLoading}
            data={
              fundFeatureOptions
                ? fundFeatureOptions.map(option => ({
                    value: option.id,
                    label: option.name[this.lng]
                  }))
                : []
            }
            onMenuOpen={this.loadOptions(["fundFeature"])}
            // validate={requiredLabel}
            // colon={true}
          />
        )}
        {caseDateOfDeposit && (
          <Field
            name="caseDateOfDeposit"
            disabledDate={this.disabledEndDate}
            component={renderDatePicker}
            normalize={this.dateToRedux}
            format={null}
            isSearchable={false}
            label={caseDateOfDeposit.name[this.lng]}
            formItemLayout={{
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }}
          />
        )}
        {documentFile && (
          <Field
            name="documentFile"
            component={renderFileUploadBtn}
            normalize={this.fileToRedux}
            cubeSConst="CubeForAF_Case"
            label={documentFile.name[this.lng]}
            formItemLayout={{
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }}
          />
        )}
        {dateForming && (
          <Field
            name="dateForming"
            disabledDate={this.disabledEndDate}
            component={renderDatePicker}
            format={null}
            normalize={this.dateToRedux}
            isSearchable={false}
            label={dateForming.name[this.lng]}
            formItemLayout={{
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }}
          />
        )}
        {linkToKatalog && (
          <Field
            name="linkToKatalog"
            component={renderSelect}
            isMulti
            normalize={this.selectMultiToRedux}
            label={linkToKatalog.name[this.lng]}
            formItemLayout={{
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }}
            isLoading={this.state.shelfLoading}
            data={
              linkToKatalogOptions
                ? linkToKatalogOptions.map(option => ({
                    value: option.id,
                    label: option.name[this.lng]
                  }))
                : []
            }
            onMenuOpen={this.loadOptions(["linkToKatalog"])}
            // validate={requiredLabel}
            // colon={true}
          />
        )}
        {linkToUkaz && (
          <Field
            name="linkToUkaz"
            component={renderSelect}
            isMulti
            normalize={this.selectMultiToRedux}
            label={linkToUkaz.name[this.lng]}
            formItemLayout={{
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }}
            isLoading={this.state.shelfLoading}
            data={
              linkToUkazOptions
                ? linkToUkazOptions.map(option => ({
                    value: option.id,
                    label: option.name[this.lng]
                  }))
                : []
            }
            onMenuOpen={this.loadOptions(["linkToUkaz"])}
            // validate={requiredLabel}
            // colon={true}
          />
        )}
        {linkToObzor && (
          <Field
            name="linkToObzor"
            component={renderSelect}
            isMulti
            normalize={this.selectMultiToRedux}
            label={linkToObzor.name[this.lng]}
            formItemLayout={{
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }}
            isLoading={this.state.shelfLoading}
            data={
              linkToObzorOptions
                ? linkToObzorOptions.map(option => ({
                    value: option.id,
                    label: option.name[this.lng]
                  }))
                : []
            }
            onMenuOpen={this.loadOptions(["linkToObzor"])}
            // validate={requiredLabel}
            // colon={true}
          />
        )}
        {surnameOriginator && (
          <Field
            name="surnameOriginator"
            component={renderSelect}
            normalize={this.selectToRedux}
            label={surnameOriginator.name[this.lng]}
            formItemLayout={{
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }}
            isLoading={this.state.shelfLoading}
            data={
              surnameOriginatorOptions
                ? surnameOriginatorOptions.map(option => ({
                    value: option.id,
                    label: option.name[this.lng]
                  }))
                : []
            }
            onMenuOpen={this.loadOptions(["surnameOriginator"])}
            // validate={requiredLabel}
            // colon={true}
          />
        )}
        {/*<Field*/}
          {/*name="fix"*/}
          {/*disabledDate={this.disabledEndDate}*/}
          {/*component={renderDatePicker}*/}
          {/*format={null}*/}
          {/*isSearchable={false}*/}
          {/*label={"Дата последнего описания"}*/}
          {/*formItemLayout={{*/}
            {/*labelCol: { span: 10 },*/}
            {/*wrapperCol: { span: 14 }*/}
          {/*}}*/}
        {/*/>*/}
        {uprDocType &&
          this.showInput([
            {
              invType: invTypePerm,
              docType: uprDoc
            },
            {
              invType: invTypeDigital,
              docType: uprDoc
            }
          ]) && (
            <Field
              name="uprDocType"
              component={renderSelect}
              normalize={this.selectToRedux}
              label={uprDocType.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
              isLoading={this.state.loading.uprDocObjLoading}
              data={
                uprDocObjOptions
                  ? uprDocObjOptions.map(option => ({
                      value: option.id,
                      label: option.name[this.lng]
                    }))
                  : []
              }
              onMenuOpen={this.loadChilds("uprDocObj")}
            />
          )}
        {storageUnitType && (
          <Field
            name="storageUnitType"
            component={renderSelect}
            normalize={this.selectToRedux}
            label={storageUnitType.name[this.lng]}
            formItemLayout={{
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }}
            isLoading={this.state.loading.uprDocObjLoading}
            data={
              storageUnitTypeOptions
                ? storageUnitTypeOptions.map(option => ({
                    value: option.id,
                    label: option.name[this.lng]
                  }))
                : []
            }
            onMenuOpen={this.loadChilds("storageUnitType")}
          />
        )}
        {caseNomenItem &&
          this.showInput([
            {
              invType: invTypePerm,
              docType: uprDoc
            },
            {
              invType: invTypePerm,
              docType: uprNTD
            }
          ]) && (
            <Field
              name="caseNomenItem"
              component={renderSelect}
              normalize={this.selectToRedux}
              label={caseNomenItem.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
              isLoading={this.state.loading.uprDocObjLoading}
              data={
                caseNomenItemOptions
                  ? caseNomenItemOptions.map(option => ({
                      value: option.id,
                      label: option.name[this.lng]
                    }))
                  : []
              }
              onMenuOpen={this.loadChilds("caseNomenItem")}
            />
          )}
        {accountingUnitType && (
          <Field
            name="accountingUnitType"
            component={renderSelect}
            label={accountingUnitType.name[this.lng]}
            normalize={this.selectToRedux}
            formItemLayout={{
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }}
            isLoading={this.state.loading.uprDocObjLoading}
            data={
              accountingUnitTypeOptions
                ? accountingUnitTypeOptions.map(option => ({
                    value: option.id,
                    label: option.name[this.lng]
                  }))
                : []
            }
            onMenuOpen={this.loadChilds("accountingUnitType")}
          />
        )}
        {numberOfOriginals && (
          <Field
            name="numberOfOriginals"
            normalize={(val, prevVal, obj, prevObj)=>this.strToRedux(val, prevVal, obj, prevObj, true)}
            component={renderInput}
            label={numberOfOriginals.name[this.lng]}
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
            normalize={this.strToRedux}
            label={compositionOfTextDocumentation.name[this.lng]}
            formItemLayout={{
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }}
          />
        )}
        {storageUnitQuantity && (
          <Field
            name="storageUnitQuantity"
            component={renderInput}
            normalize={(val, prevVal, obj, prevObj)=>this.strToRedux(val, prevVal, obj, prevObj, true)}
            label={storageUnitQuantity.name[this.lng]}
            formItemLayout={{
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }}
          />
        )}
        {documentAuthor &&
          this.showInput([
            {
              invType: invTypePerm,
              docType: uprDoc
            },
            {
              invType: invTypePerm,
              docType: uprNTD
            },
            {
              invType: invTypePhonoGram,
              docType: phonoDoc
            },
            {
              invType: invTypePhonoMag,
              docType: phonoDoc
            },
            {
              invType: invTypeDigital,
              docType: uprDoc
            }
          ]) && (
            <Field
              name="documentAuthor"
              component={renderInput}
              normalize={this.strToRedux}
              label={documentAuthor.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
            />
          )}
        {addressee &&
          this.showInput([
            {
              invType: invTypePerm,
              docType: uprDoc
            },
            {
              invType: invTypeDigital,
              docType: uprDoc
            }
          ]) && (
            <Field
              name="addressee"
              component={renderInput}
              normalize={this.strToRedux}
              label={addressee.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
            />
          )}
        {question &&
          this.showInput([
            {
              invType: invTypePerm,
              docType: uprDoc
            },
            {
              invType: invTypeDigital,
              docType: uprDoc
            }
          ]) && (
            <Field
              name="question"
              normalize={this.strToRedux}
              component={renderInput}
              label={question.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
            />
          )}
        {terrain &&
          this.showInput([
            {
              invType: invTypePerm,
              docType: uprDoc
            },
            {
              invType: invTypeDigital,
              docType: uprDoc
            }
          ]) && (
            <Field
              name="terrain"
              component={renderSelect}
              normalize={this.selectToRedux}
              label={terrain.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
              isLoading={this.state.loading.uprDocObjLoading}
              data={
                objEventLocationOptions
                  ? objEventLocationOptions.map(option => ({
                      value: option.id,
                      label: option.name[this.lng]
                    }))
                  : []
              }
              onMenuOpen={this.loadChilds("terrain")}
            />
          )}
        {documentDate &&
          this.showInput([
            {
              invType: invTypePerm,
              docType: uprDoc
            },
            {
              invType: invTypePhonoGram,
              docType: phonoDoc
            },
            {
              invType: invTypePhonoMag,
              docType: phonoDoc
            },
            {
              invType: invTypeDigital,
              docType: uprDoc
            }
          ]) && (
            <Field
              name="documentDate"
              disabledDate={this.disabledEndDate}
              component={renderDatePicker}
              normalize={this.dateToRedux}
              format={null}
              isSearchable={false}
              label={documentDate.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
            />
          )}
        {dateAccuracy &&
          this.showInput([
            {
              invType: invTypePerm,
              docType: uprDoc
            },
            {
              invType: invTypeDigital,
              docType: uprDoc
            }
          ]) && (
            <Field
              name="dateAccuracy"
              component={renderSelect}
              normalize={this.selectToRedux}
              label={dateAccuracy.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
              isLoading={this.state.shelfLoading}
              data={
                dateAccuracyOptions
                  ? dateAccuracyOptions.map(option => ({
                      value: option.id,
                      label: option.name[this.lng]
                    }))
                  : []
              }
              onMenuOpen={this.loadOptions(["dateAccuracy"])}
              // validate={requiredLabel}
              // colon={true}
            />
          )}

        {inaccurateDateFeature &&
          this.showInput([
            {
              invType: invTypePerm,
              docType: uprDoc
            },
            {
              invType: invTypeDigital,
              docType: uprDoc
            }
          ]) && (
            <div>
                <hr />
                <Form.Item>
                    <h3>{inaccurateDate.name[this.lng]}</h3>
                </Form.Item>
            <Field
              name="inaccurateDateFeature"
              component={renderSelect}
              normalize={this.selectToRedux}
              label={inaccurateDateFeature.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
              isLoading={this.state.shelfLoading}
              data={
                inaccurateDateFeatureOptions
                  ? inaccurateDateFeatureOptions.map(option => ({
                      value: option.id,
                      label: option.name[this.lng]
                    }))
                  : []
              }
              onMenuOpen={this.loadOptions(["inaccurateDateFeature"])}
              // validate={requiredLabel}
              // colon={true}
            />
            </div>
          )}
        {day &&
          this.showInput([
            {
              invType: invTypePerm,
              docType: uprDoc
            },
            {
              invType: invTypeDigital,
              docType: uprDoc
            }
          ]) && (
            <Field
              name="day"
              component={renderInput}
              normalize={(val, prevVal, obj, prevObj)=>this.strToRedux(val, prevVal, obj, prevObj, true)}
              disabled={!inaccurateDateFeatureValue}
              label={day.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
            />
          )}
        {month &&
          this.showInput([
            {
              invType: invTypePerm,
              docType: uprDoc
            },
            {
              invType: invTypeDigital,
              docType: uprDoc
            }
          ]) && (
            <Field
              name="month"
              component={renderInput}
              normalize={(val, prevVal, obj, prevObj)=>this.strToRedux(val, prevVal, obj, prevObj, true)}
              disabled={!inaccurateDateFeatureValue}
              label={month.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
            />
          )}
        {year &&
          this.showInput([
            {
              invType: invTypePerm,
              docType: uprDoc
            },
            {
              invType: invTypeDigital,
              docType: uprDoc
            }
          ]) && (
            <Field
              name="year"
              component={renderInput}
              normalize={(val, prevVal, obj, prevObj)=>this.strToRedux(val, prevVal, obj, prevObj, true)}
              disabled={!inaccurateDateFeatureValue}
              label={year.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
            />
          )}
        <hr />
        {typeOfPaperCarrier &&
          this.showInput([
            {
              invType: invTypePerm,
              docType: uprDoc
            },
            {
              invType: invTypePerm,
              docType: uprNTD
            },
            {
              invType: invTypeLS,
              docType: lpDoc
            }
          ]) && (
            <Field
              name="typeOfPaperCarrier"
              component={renderSelect}
              normalize={this.selectToRedux}
              label={typeOfPaperCarrier.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
              isLoading={this.state.shelfLoading}
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
        {objectCode &&
          this.showInput([
            {
              invType: invTypePerm,
              docType: uprNTD
            }
          ]) && (
            <Field
              name="objectCode"
              component={renderInput}
              normalize={this.strToRedux}
              label={objectCode.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
            />
          )}
        {projectName &&
          this.showInput([
            {
              invType: invTypePerm,
              docType: uprNTD
            }
          ]) && (
            <Field
              name="projectName"
              component={renderInput}
              normalize={this.strToRedux}
              label={projectName.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
            />
          )}
        {projectStage &&
          this.showInput([
            {
              invType: invTypePerm,
              docType: uprNTD
            }
          ]) && (
            <Field
              name="projectStage"
              component={renderInput}
              normalize={this.strToRedux}
              label={projectStage.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
            />
          )}
        {projectPartName &&
          this.showInput([
            {
              invType: invTypePerm,
              docType: uprNTD
            }
          ]) && (
            <Field
              name="projectPartName"
              component={renderInput}
              normalize={this.strToRedux}
              label={projectPartName.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
            />
          )}
        {volumeNumber &&
          this.showInput([
            {
              invType: invTypePerm,
              docType: uprNTD
            }
          ]) && (
            <Field
              name="volumeNumber"
              component={renderInput}
              normalize={this.strToRedux}
              label={volumeNumber.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
            />
          )}
        {yearOfCompletion &&
          this.showInput([
            {
              invType: invTypePerm,
              docType: uprNTD
            }
          ]) && (
            <Field
              name="yearOfCompletion"
              component={renderInput}
              normalize={this.strToRedux}
              label={yearOfCompletion.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
            />
          )}
        {accountingUnitNumber &&
          this.showInput([
            {
              invType: invTypeVideo,
              docType: videoDoc
            },
            {
              invType: invTypeMovie,
              docType: movieDoc
            },
            {
              invType: invTypePhonoGram,
              docType: phonoDoc
            },
            {
              invType: invTypePhonoMag,
              docType: phonoDoc
            }
          ]) && (
            <Field
              name="accountingUnitNumber"
              component={renderInput}
              normalize={this.strToRedux}
              label={accountingUnitNumber.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
            />
          )}
        {authorTitle &&
          this.showInput([
            {
              invType: invTypeVideo,
              docType: videoDoc
            },
            {
              invType: invTypeMovie,
              docType: movieDoc
            }
          ]) && (
            <Field
              name="authorTitle"
              component={renderInput}
              normalize={this.strToRedux}
              label={authorTitle.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
            />
          )}
        {cameraOperator &&
          this.showInput([
            {
              invType: invTypeVideo,
              docType: videoDoc
            },
            {
              invType: invTypeMovie,
              docType: movieDoc
            }
          ]) && (
            <Field
              name="cameraOperator"
              normalize={this.strToRedux}
              component={renderInput}
              label={cameraOperator.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
            />
          )}
        {artistOfTheWork &&
          this.showInput([
            {
              invType: invTypeVideo,
              docType: videoDoc
            },
            {
              invType: invTypePhonoGram,
              docType: phonoDoc
            },
            {
              invType: invTypePhonoMag,
              docType: phonoDoc
            }
          ]) && (
            <Field
              name="artistOfTheWork"
              component={renderInput}
              normalize={this.strToRedux}
              label={artistOfTheWork.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
            />
          )}
        {dateOfRecording &&
          this.showInput([
            {
              invType: invTypeVideo,
              docType: videoDoc
            },
            {
              invType: invTypePhonoMag,
              docType: phonoDoc
            }
          ]) && (
            <Field
              name="dateOfRecording"
              disabledDate={this.disabledEndDate}
              component={renderDatePicker}
              normalize={this.dateToRedux}
              format={null}
              isSearchable={false}
              label={dateOfRecording.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
            />
          )}
        {timingOfVideoRecording &&
          this.showInput([
            {
              invType: invTypeVideo,
              docType: videoDoc
            }
          ]) && (
            <Field
              name="timingOfVideoRecording"
              component={renderInput}
              normalize={this.strToRedux}
              label={timingOfVideoRecording.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
            />
          )}
        {TypeAndFormatOfRecording &&
          this.showInput([
            {
              invType: invTypeVideo,
              docType: videoDoc
            }
          ]) && (
            <Field
              name="TypeAndFormatOfRecording"
              component={renderInput}
              normalize={this.strToRedux}
              label={TypeAndFormatOfRecording.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
            />
          )}
        {numberOfVideoItems &&
          this.showInput([
            {
              invType: invTypeVideo,
              docType: videoDoc
            },
            {
              invType: invTypePhonoMag,
              docType: phonoDoc
            }
          ]) && (
            <Collapse accordion>
              <Panel
                header={numberOfVideoItems.name[this.lng]}
                style={{ marginBottom: "10px" }}
                key="1"
              >
                <Field
                  name="numberOfVideoItems"
                  component={renderInput}
                  normalize={this.strToRedux}
                  label={numberOfVideoItems.name[this.lng]}
                  formItemLayout={{
                    labelCol: { span: 10 },
                    wrapperCol: { span: 14 }
                  }}
                />
                {original &&
                  this.showInput([
                    {
                      invType: invTypeVideo,
                      docType: videoDoc
                    },
                    {
                      invType: invTypePhonoMag,
                      docType: phonoDoc
                    }
                  ]) && (
                    <Field
                      name="original"
                      component={renderInput}
                      normalize={this.strToRedux}
                      label={original.name[this.lng]}
                      formItemLayout={{
                        labelCol: { span: 10 },
                        wrapperCol: { span: 14 }
                      }}
                    />
                  )}
                {copy &&
                  this.showInput([
                    {
                      invType: invTypeVideo,
                      docType: videoDoc
                    },
                    {
                      invType: invTypePhonoMag,
                      docType: phonoDoc
                    }
                  ]) && (
                    <Field
                      name="copy"
                      component={renderInput}
                      normalize={this.strToRedux}
                      label={copy.name[this.lng]}
                      formItemLayout={{
                        labelCol: { span: 10 },
                        wrapperCol: { span: 14 }
                      }}
                    />
                  )}
              </Panel>
            </Collapse>
          )}
        {shootingDate &&
          this.showInput([
            {
              invType: invTypeMovie,
              docType: movieDoc
            },
            {
              invType: invTypePhoto,
              docType: photoDoc
            }
          ]) && (
            <Field
              name="shootingDate"
              disabledDate={this.disabledEndDate}
              component={renderDatePicker}
              normalize={this.dateToRedux}
              format={null}
              isSearchable={false}
              label={shootingDate.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
            />
          )}
        {shootPlace &&
          this.showInput([
            {
              invType: invTypeMovie,
              docType: movieDoc
            },
            {
              invType: invTypeAlbum,
              docType: photoDoc
            },
            {
              invType: invTypePhoto,
              docType: photoDoc
            }
          ]) && (
            <Field
              name="shootPlace"
              component={renderSelect}
              normalize={this.selectToRedux}
              label={shootPlace.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
              isLoading={this.state.shelfLoading}
              data={
                shootPlaceOptions
                  ? shootPlaceOptions.map(option => ({
                      value: option.id,
                      label: option.name[this.lng]
                    }))
                  : []
              }
              onMenuOpen={this.loadOptions(["shootPlace"])}
              // validate={requiredLabel}
              // colon={true}
            />
          )}
        {movieVariant &&
          this.showInput([
            {
              invType: invTypeMovie,
              docType: movieDoc
            }
          ]) && (
            <Field
              name="movieVariant"
              component={renderSelect}
              normalize={this.selectToRedux}
              label={movieVariant.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
              isLoading={this.state.shelfLoading}
              data={
                movieVariantOptions
                  ? movieVariantOptions.map(option => ({
                      value: option.id,
                      label: option.name[this.lng]
                    }))
                  : []
              }
              onMenuOpen={this.loadOptions(["movieVariant"])}
              // validate={requiredLabel}
              // colon={true}
            />
          )}
        {formatAndBase &&
          this.showInput([
            {
              invType: invTypeMovie,
              docType: movieDoc
            },
            {
              invType: invTypeAlbum,
              docType: photoDoc
            },
            {
              invType: invTypePhoto,
              docType: photoDoc
            }
          ]) && (
            <Field
              name="formatAndBase"
              component={renderInput}
              normalize={this.strToRedux}
              label={formatAndBase.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
            />
          )}
        {numberOfMovieItems &&
          this.showInput([
            {
              invType: invTypeMovie,
              docType: movieDoc
            }
          ]) && (
            <Collapse accordion>
              <Panel
                header={numberOfMovieItems.name[this.lng]}
                style={{ marginBottom: "10px" }}
                key="1"
              >
                <Field
                  name="numberOfMovieItems"
                  component={renderInput}
                  normalize={this.strToRedux}
                  label={numberOfMovieItems.name[this.lng]}
                  formItemLayout={{
                    labelCol: { span: 10 },
                    wrapperCol: { span: 14 }
                  }}
                />
                {movieNegative &&
                  this.showInput([
                    {
                      invType: invTypeMovie,
                      docType: movieDoc
                    }
                  ]) && (
                    <Field
                      name="movieNegative"
                      component={renderInput}
                      normalize={this.strToRedux}
                      label={movieNegative.name[this.lng]}
                      formItemLayout={{
                        labelCol: { span: 10 },
                        wrapperCol: { span: 14 }
                      }}
                    />
                  )}
                {doubleNegative &&
                  this.showInput([
                    {
                      invType: invTypeMovie,
                      docType: movieDoc
                    }
                  ]) && (
                    <Field
                      name="doubleNegative"
                      component={renderInput}
                      normalize={this.strToRedux}
                      label={doubleNegative.name[this.lng]}
                      formItemLayout={{
                        labelCol: { span: 10 },
                        wrapperCol: { span: 14 }
                      }}
                    />
                  )}
                {phonogramNegative &&
                  this.showInput([
                    {
                      invType: invTypeMovie,
                      docType: movieDoc
                    }
                  ]) && (
                    <Field
                      name="phonogramNegative"
                      component={renderInput}
                      normalize={this.strToRedux}
                      label={phonogramNegative.name[this.lng]}
                      formItemLayout={{
                        labelCol: { span: 10 },
                        wrapperCol: { span: 14 }
                      }}
                    />
                  )}
                {phonogramMagnetic &&
                  this.showInput([
                    {
                      invType: invTypeMovie,
                      docType: movieDoc
                    }
                  ]) && (
                    <Field
                      name="phonogramMagnetic"
                      component={renderInput}
                      normalize={this.strToRedux}
                      label={phonogramMagnetic.name[this.lng]}
                      formItemLayout={{
                        labelCol: { span: 10 },
                        wrapperCol: { span: 14 }
                      }}
                    />
                  )}
                {intermediatePositive &&
                  this.showInput([
                    {
                      invType: invTypeMovie,
                      docType: movieDoc
                    }
                  ]) && (
                    <Field
                      name="intermediatePositive"
                      component={renderInput}
                      normalize={this.strToRedux}
                      label={intermediatePositive.name[this.lng]}
                      formItemLayout={{
                        labelCol: { span: 10 },
                        wrapperCol: { span: 14 }
                      }}
                    />
                  )}
                {positive &&
                  this.showInput([
                    {
                      invType: invTypeMovie,
                      docType: movieDoc
                    }
                  ]) && (
                    <Field
                      name="positive"
                      component={renderInput}
                      normalize={this.strToRedux}
                      label={positive.name[this.lng]}
                      formItemLayout={{
                        labelCol: { span: 10 },
                        wrapperCol: { span: 14 }
                      }}
                    />
                  )}
                {colorPassports &&
                  this.showInput([
                    {
                      invType: invTypeMovie,
                      docType: movieDoc
                    }
                  ]) && (
                    <Field
                      name="colorPassports"
                      component={renderInput}
                      normalize={this.strToRedux}
                      label={colorPassports.name[this.lng]}
                      formItemLayout={{
                        labelCol: { span: 10 },
                        wrapperCol: { span: 14 }
                      }}
                    />
                  )}
              </Panel>
            </Collapse>
          )}
        {playingTime &&
          this.showInput([
            {
              invType: invTypeMovie,
              docType: movieDoc
            },
            {
              invType: invTypePhonoGram,
              docType: phonoDoc
            },
            {
              invType: invTypePhonoMag,
              docType: phonoDoc
            }
          ]) && (
            <Field
              name="playingTime"
              component={renderInput}
              normalize={this.strToRedux}
              label={playingTime.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
            />
          )}
        {mainContent &&
          this.showInput([
            {
              invType: invTypePhonoGram,
              docType: phonoDoc
            },
            {
              invType: invTypePhonoMag,
              docType: phonoDoc
            }
          ]) && (
            <Field
              name="mainContent"
              component={renderInput}
              normalize={this.strToRedux}
              label={mainContent.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
            />
          )}
        {genre &&
          this.showInput([
            {
              invType: invTypePhonoGram,
              docType: phonoDoc
            },
            {
              invType: invTypePhonoMag,
              docType: phonoDoc
            }
          ]) && (
            <Field
              name="genre"
              component={renderInput}
              normalize={this.strToRedux}
              label={genre.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
            />
          )}
        {eventLocation &&
          this.showInput([
            {
              invType: invTypePhonoGram,
              docType: phonoDoc
            },
            {
              invType: invTypePhonoMag,
              docType: phonoDoc
            }
          ]) && (
            <Field
              name="eventLocation"
              component={renderSelect}
              normalize={this.selectToRedux}
              label={eventLocation.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
              isLoading={this.state.shelfLoading}
              data={
                eventLocationOptions
                  ? eventLocationOptions.map(option => ({
                      value: option.id,
                      label: option.name[this.lng]
                    }))
                  : []
              }
              onMenuOpen={this.loadOptions(["eventLocation"])}
              // validate={requiredLabel}
              // colon={true}
            />
          )}
        {firstLine &&
          this.showInput([
            {
              invType: invTypePhonoGram,
              docType: phonoDoc
            },
            {
              invType: invTypePhonoMag,
              docType: phonoDoc
            }
          ]) && (
            <Field
              name="firstLine"
              component={renderInput}
              normalize={this.strToRedux}
              label={firstLine.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
            />
          )}
        {initialsOfAuthors &&
          this.showInput([
            {
              invType: invTypePhonoGram,
              docType: phonoDoc
            },
            {
              invType: invTypePhonoMag,
              docType: phonoDoc
            }
          ]) && (
            <Field
              name="initialsOfAuthors"
              component={renderInput}
              normalize={this.strToRedux}
              label={initialsOfAuthors.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
            />
          )}
        {initialsOfTranslators &&
          this.showInput([
            {
              invType: invTypePhonoGram,
              docType: phonoDoc
            },
            {
              invType: invTypePhonoMag,
              docType: phonoDoc
            }
          ]) && (
            <Field
              name="initialsOfTranslators"
              component={renderInput}
              normalize={this.strToRedux}
              label={initialsOfTranslators.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
            />
          )}
        {manufactureDate &&
          this.showInput([
            {
              invType: invTypePhonoGram,
              docType: phonoDoc
            }
          ]) && (
            <Field
              name="manufactureDate"
              disabledDate={this.disabledEndDate}
              component={renderDatePicker}
              normalize={this.dateToRedux}
              format={null}
              isSearchable={false}
              label={manufactureDate.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
            />
          )}
        {manufacturePlace &&
          this.showInput([
            {
              invType: invTypePhonoGram,
              docType: phonoDoc
            }
          ]) && (
            <Field
              name="manufacturePlace"
              component={renderSelect}
              normalize={this.selectToRedux}
              label={manufacturePlace.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
              isLoading={this.state.shelfLoading}
              data={
                manufacturePlaceOptions
                  ? manufacturePlaceOptions.map(option => ({
                      value: option.id,
                      label: option.name[this.lng]
                    }))
                  : []
              }
              onMenuOpen={this.loadOptions(["manufacturePlace"])}
              // validate={requiredLabel}
              // colon={true}
            />
          )}
        {serialNumber &&
          this.showInput([
            {
              invType: invTypePhonoGram,
              docType: phonoDoc
            }
          ]) && (
            <Field
              name="serialNumber"
              component={renderInput}
              normalize={this.strToRedux}
              label={serialNumber.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
            />
          )}
        {numberOfPhonoItems &&
          this.showInput([
            {
              invType: invTypePhonoGram,
              docType: phonoDoc
            }
          ]) && (
            <Collapse accordion>
              <Panel
                header={numberOfPhonoItems.name[this.lng]}
                style={{ marginBottom: "10px" }}
                key="1"
              >
                <Field
                  name="numberOfPhonoItems"
                  component={renderInput}
                  normalize={this.strToRedux}
                  label={numberOfPhonoItems.name[this.lng]}
                  formItemLayout={{
                    labelCol: { span: 10 },
                    wrapperCol: { span: 14 }
                  }}
                />

                {gremoriginal &&
                  this.showInput([
                    {
                      invType: invTypePhonoGram,
                      docType: phonoDoc
                    }
                  ]) && (
                    <Field
                      name="gremoriginal"
                      component={renderInput}
                      normalize={this.strToRedux}
                      label={gremoriginal.name[this.lng]}
                      formItemLayout={{
                        labelCol: { span: 10 },
                        wrapperCol: { span: 14 }
                      }}
                    />
                  )}
                {gramplastine &&
                  this.showInput([
                    {
                      invType: invTypePhonoGram,
                      docType: phonoDoc
                    }
                  ]) && (
                    <Field
                      name="gramplastine"
                      component={renderInput}
                      normalize={this.strToRedux}
                      label={gramplastine.name[this.lng]}
                      formItemLayout={{
                        labelCol: { span: 10 },
                        wrapperCol: { span: 14 }
                      }}
                    />
                  )}
              </Panel>
            </Collapse>
          )}
        {recordPlace &&
          this.showInput([
            {
              invType: invTypePhonoMag,
              docType: phonoDoc
            }
          ]) && (
            <Field
              name="recordPlace"
              component={renderSelect}
              normalize={this.selectToRedux}
              label={recordPlace.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
              isLoading={this.state.shelfLoading}
              data={
                recordPlaceOptions
                  ? recordPlaceOptions.map(option => ({
                      value: option.id,
                      label: option.name[this.lng]
                    }))
                  : []
              }
              onMenuOpen={this.loadOptions(["recordPlace"])}
              // validate={requiredLabel}
              // colon={true}
            />
          )}
        {soundingSpeed &&
          this.showInput([
            {
              invType: invTypePhonoMag,
              docType: phonoDoc
            }
          ]) && (
            <Field
              name="soundingSpeed"
              component={renderInput}
              normalize={this.strToRedux}
              label={soundingSpeed.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
            />
          )}
        {magneticTapeType &&
          this.showInput([
            {
              invType: invTypePhonoMag,
              docType: phonoDoc
            }
          ]) && (
            <Field
              name="magneticTapeType"
              component={renderInput}
              normalize={this.strToRedux}
              label={magneticTapeType.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
            />
          )}
        {photoDescription &&
          this.showInput([
            {
              invType: invTypeAlbum,
              docType: photoDoc
            }
          ]) && (
            <Field
              name="photoDescription"
              component={renderInput}
              normalize={this.strToRedux}
              label={photoDescription.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
            />
          )}{" "}
        {documentShootAuthor &&
          this.showInput([
            {
              invType: invTypeAlbum,
              docType: photoDoc
            },
            {
              invType: invTypePhoto,
              docType: photoDoc
            }
          ]) && (
            <Field
              name="documentShootAuthor"
              component={renderInput}
              normalize={this.strToRedux}
              label={documentShootAuthor.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
            />
          )}{" "}
        {numberOfPhotoPrints &&
          this.showInput([
            {
              invType: invTypeAlbum,
              docType: photoDoc
            }
          ]) && (
            <Field
              name="numberOfPhotoPrints"
              component={renderInput}
              normalize={this.strToRedux}
              label={numberOfPhotoPrints.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
            />
          )}{" "}
        {externalFeatures &&
          this.showInput([
            {
              invType: invTypeAlbum,
              docType: photoDoc
            }
          ]) && (
            <Field
              name="externalFeatures"
              component={renderInput}
              normalize={this.strToRedux}
              label={externalFeatures.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
            />
          )}
        {productionNumber &&
          this.showInput([
            {
              invType: invTypePhoto,
              docType: photoDoc
            }
          ]) && (
            <Field
              name="productionNumber"
              component={renderInput}
              normalize={this.strToRedux}
              label={productionNumber.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
            />
          )}
        {numberOfPhotoItems &&
          this.showInput([
            {
              invType: invTypePhoto,
              docType: photoDoc
            }
          ]) && (
            <Collapse accordion>
              <Panel
                header={numberOfPhotoItems.name[this.lng]}
                style={{ marginBottom: "10px" }}
                key="1"
              >
                <Field
                  name="numberOfPhotoItems"
                  component={renderInput}
                  normalize={this.strToRedux}
                  label={numberOfPhotoItems.name[this.lng]}
                  formItemLayout={{
                    labelCol: { span: 10 },
                    wrapperCol: { span: 14 }
                  }}
                />
                {photoNegative &&
                  this.showInput([
                    {
                      invType: invTypePhoto,
                      docType: photoDoc
                    }
                  ]) && (
                    <Field
                      name="photoNegative"
                      component={renderInput}
                      normalize={this.strToRedux}
                      label={photoNegative.name[this.lng]}
                      formItemLayout={{
                        labelCol: { span: 10 },
                        wrapperCol: { span: 14 }
                      }}
                    />
                  )}
                {photoDoubleNegative &&
                  this.showInput([
                    {
                      invType: invTypePhoto,
                      docType: photoDoc
                    }
                  ]) && (
                    <Field
                      name="photoDoubleNegative"
                      component={renderInput}
                      normalize={this.strToRedux}
                      label={photoDoubleNegative.name[this.lng]}
                      formItemLayout={{
                        labelCol: { span: 10 },
                        wrapperCol: { span: 14 }
                      }}
                    />
                  )}
                {photoPositive &&
                  this.showInput([
                    {
                      invType: invTypePhoto,
                      docType: photoDoc
                    }
                  ]) && (
                    <Field
                      name="photoPositive"
                      component={renderInput}
                      normalize={this.strToRedux}
                      label={photoPositive.name[this.lng]}
                      formItemLayout={{
                        labelCol: { span: 10 },
                        wrapperCol: { span: 14 }
                      }}
                    />
                  )}
                {photocast &&
                  this.showInput([
                    {
                      invType: invTypePhoto,
                      docType: photoDoc
                    }
                  ]) && (
                    <Field
                      name="photocast"
                      component={renderInput}
                      normalize={this.strToRedux}
                      label={photocast.name[this.lng]}
                      formItemLayout={{
                        labelCol: { span: 10 },
                        wrapperCol: { span: 14 }
                      }}
                    />
                  )}
                {slide &&
                  this.showInput([
                    {
                      invType: invTypePhoto,
                      docType: photoDoc
                    }
                  ]) && (
                    <Field
                      name="slide"
                      component={renderInput}
                      normalize={this.strToRedux}
                      label={slide.name[this.lng]}
                      formItemLayout={{
                        labelCol: { span: 10 },
                        wrapperCol: { span: 14 }
                      }}
                    />
                  )}
                {filmStrip &&
                  this.showInput([
                    {
                      invType: invTypePhoto,
                      docType: photoDoc
                    }
                  ]) && (
                    <Field
                      name="filmStrip"
                      component={renderInput}
                      normalize={this.strToRedux}
                      label={filmStrip.name[this.lng]}
                      formItemLayout={{
                        labelCol: { span: 10 },
                        wrapperCol: { span: 14 }
                      }}
                    />
                  )}
              </Panel>
            </Collapse>
          )}
        {terrain &&
          this.showInput([
            {
              invType: invTypePerm,
              docType: uprDoc
            },
            {
              invType: invTypeDigital,
              docType: uprDoc
            }
          ]) && (
            <Field
              name="terrain"
              component={renderSelect}
              normalize={this.selectToRedux}
              label={terrain.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
              isLoading={this.state.typeOfPaperCarrierLoading}
              data={
                terrainOptions
                  ? terrainOptions.map(option => ({
                      value: option.id,
                      label: option.name[this.lng]
                    }))
                  : []
              }
              onMenuOpen={this.loadOptions(["terrain"])}
              // validate={requiredLabel}
              // colon={true}
            />
          )}
        {electronicDocumentsFormat &&
          this.showInput([
            {
              invType: invTypeDigital,
              docType: uprDoc
            },
            {
              invType: invTypeDigital,
              docType: uprDoc
            }
          ]) && (
            <Field
              name="electronicDocumentsFormat"
              component={renderSelect}
              normalize={this.selectToRedux}
              label={electronicDocumentsFormat.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
              isLoading={this.state.typeOfPaperCarrierLoading}
              data={
                electronicDocumentsFormatOptions
                  ? electronicDocumentsFormatOptions.map(option => ({
                      value: option.id,
                      label: option.name[this.lng]
                    }))
                  : []
              }
              onMenuOpen={this.loadOptions(["electronicDocumentsFormat"])}
              // validate={requiredLabel}
              // colon={true}
            />
          )}
        {personLastName &&
          this.showInput([
            {
              invType: invTypeLP,
              docType: lpDoc
            }
          ]) && (
            <Field
              name="personLastName"
              component={renderInput}
              normalize={this.strToRedux}
              label={personLastName.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
            />
          )}
        {personName &&
          this.showInput([
            {
              invType: invTypeLP,
              docType: lpDoc
            }
          ]) && (
            <Field
              name="personName"
              component={renderInput}
              normalize={this.strToRedux}
              label={personName.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
            />
          )}
        {personPatronymic &&
          this.showInput([
            {
              invType: invTypeLP,
              docType: lpDoc
            }
          ]) && (
            <Field
              name="personPatronymic"
              component={renderInput}
              normalize={this.strToRedux}
              label={personPatronymic.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
            />
          )}
        {publicPositionOfPerson &&
          this.showInput([
            {
              invType: invTypeLP,
              docType: lpDoc
            }
          ]) && (
            <Field
              name="publicPositionOfPerson"
              component={renderSelect}
              normalize={this.selectToRedux}
              label={terrain.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
              isLoading={this.state.typeOfPaperCarrierLoading}
              data={
                publicPositionOfPersonOptions
                  ? publicPositionOfPersonOptions.map(option => ({
                      value: option.id,
                      label: option.name[this.lng]
                    }))
                  : []
              }
              onMenuOpen={this.loadOptions(["publicPositionOfPerson"])}
              // validate={requiredLabel}
              // colon={true}
            />
          )}
        {propNationality &&
          this.showInput([
            {
              invType: invTypeLP,
              docType: lpDoc
            }
          ]) && (
            <Field
              name="propNationality"
              component={renderSelect}
              normalize={this.selectToRedux}
              label={propNationality.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
              isLoading={this.state.shelfLoading}
              data={
                propNationalityOptions
                  ? propNationalityOptions.map(option => ({
                      value: option.id,
                      label: option.name[this.lng]
                    }))
                  : []
              }
              onMenuOpen={this.loadOptions(["propNationality"])}
              // validate={requiredLabel}
              // colon={true}
            />
          )}
        {documentLanguage &&
          this.showInput([
            {
              invType: invTypeVideo,
              docType: videoDoc
            },
            {
              invType: invTypeMovie,
              docType: movieDoc
            },
            {
              invType: invTypePhonoGram,
              docType: phonoDoc
            },
            {
              invType: invTypePhonoMag,
              docType: phonoDoc
            }
          ]) && (
            <Field
              name="documentLanguage
"
              component={renderSelect}
              normalize={this.selectToRedux}
              label={documentLanguage.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
              isLoading={this.state.shelfLoading}
              data={
                documentLanguageOptions
                  ? documentLanguageOptions.map(option => ({
                      value: option.id,
                      label: option.name[this.lng]
                    }))
                  : []
              }
              onMenuOpen={this.loadOptions(["documentLanguageOptions"])}
              // validate={requiredLabel}
              // colon={true}
            />
          )}
        {documentPlaybackMethod &&
          this.showInput([
            {
              invType: invTypeVideo,
              docType: videoDoc
            }
          ]) && (
            <Field
              name="documentPlaybackMethod

"
              component={renderSelect}
              normalize={this.selectToRedux}
              label={documentPlaybackMethod.name[this.lng]}
              formItemLayout={{
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }}
              isLoading={this.state.shelfLoading}
              data={
                documentPlaybackMethodOptions
                  ? documentPlaybackMethodOptions.map(option => ({
                      value: option.id,
                      label: option.name[this.lng]
                    }))
                  : []
              }
              onMenuOpen={this.loadOptions(["documentPlaybackMethod"])}
              // validate={requiredLabel}
              // colon={true}
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

const selector = formValueSelector("MainInfoCaseForm");

export default connect(
  state => {
    const documentDateValue = selector(state, "documentDate");
    const inaccurateDateFeatureValue = selector(state, "inaccurateDateFeature");
    return {
      documentDateValue,
      inaccurateDateFeatureValue,
        caseStructuralSubdivisionOption:
        state.generalData.caseStructuralSubdivision,
      caseStorageOptions: state.generalData.caseStorage,
      rackOptions: state.generalData.rack,
      shelfOptions: state.generalData.shelf,
      inaccurateDateFeatureOptions: state.generalData.inaccurateDateFeature,
      typeOfPaperCarrierOptions: state.generalData.typeOfPaperCarrier,
        caseDocLangObjOptions: state.generalData.caseDocLangObj,
        bunchCasesOptions: state.generalData.bunchCases,

      linkToKatalogOptions: state.generalData.linkToKatalog,
      linkToUkazOptions: state.generalData.linkToUkaz,
      linkToObzorOptions: state.generalData.linkToObzor,
      surnameOriginatorOptions: state.generalData.surnameOriginator,
        caseOCDOptions: state.generalData.caseOCD,
        sectionOptions: state.generalData.section,
        uprDocObjOptions: state.generalData.uprDocObj,
      storageUnitTypeOptions: state.generalData.storageUnitType,
      caseNomenItemOptions: state.generalData.caseNomenItem,
      objEventLocationOptions: state.generalData.objEventLocation,
      accountingUnitTypeOptions: state.generalData.accountingUnitType,
      shootPlaceOptions: state.generalData.shootPlace,
      eventLocationOptions: state.generalData.eventLocationOptions,
      propNationalityOptions: state.generalData.propNationality,
      documentLanguageOptions: state.generalData.documentLanguage,
      documentPlaybackMethodOptions: state.generalData.documentPlaybackMethod,
      manufacturePlaceOptions: state.generalData.manufacturePlace,
      electronicDocumentsFormatOptions:
        state.generalData.electronicDocumentsFormat,
      recordPlaceOptions: state.generalData.recordPlace,
      terrainOptions: state.generalData.terrain,
      propAuthenticityOptions: state.generalData.propAuthenticity,
      fundFeatureOptions: state.generalData.fundFeature,
      dateAccuracyOptions: state.generalData.dateAccuracy,
      movieVariantOptions: state.generalData.movieVariant,
      publicPositionOfPersonOptions: state.generalData.publicPositionOfPerson,
        s:state,
        CubeForAF_Case: state.cubes[CUBE_FOR_AF_CASE],

    };
  },
  { getObjChildsByConst,getCube, getPropVal }
)(
  reduxForm({
    form: "MainInfoCaseForm",
    enableReinitialize: true
  })(MainInfoCaseForm)
);
