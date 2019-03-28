import React from "react";
import {Field, Fields, reduxForm} from "redux-form";
import { Form } from 'antd'

import {renderDoubleDateInput, renderInput, renderSelect, renderSelectVirt} from "../../../utils/form_components";
import {digits} from '../../../utils/form_normalizing'
import {requiredLabel} from "../../../utils/form_validations";
import {renderCreatableSelect} from "../../../utils/form_components";

const Researches = props => {

  this.lng = localStorage.getItem('i18nextLng');

  const { directUseDocument, goalSprav, formResultRealization } = props.tofiConstants;
  const {handleSubmit, t, loadOptions, loadChilds, themeValue, objStudyParentOptions, objStudyParentLoading,
    directUseDocumentOptions, directUseDocumentLoading, formResultRealizationOptions, formResultRealizationLoading} = props;
  return (
    <Form onSubmit={handleSubmit} className='antForm-spaceBetween'>
      <Field
        name="theme"
        formItemClass="signup-form__input wrap-normal unset-lh"
        component={renderSelectVirt}
        placeholder={t("THEME")}
        label={t("THEME")}
        formItemLayout={{
          labelCol: {span: 10},
          wrapperCol: {span: 14}
        }}
        onChange={(e, newValue) => {
          if(newValue && newValue.constructor === Object) {
            newValue.directUseDocument.idRef ?
              props.change('directUseDocument', {value: newValue.directUseDocument.idRef, label: newValue.directUseDocument.name.ru})
              : props.change('directUseDocument', null);

            newValue.goalSprav.ru ?
              props.change('goalSprav', newValue.goalSprav.ru)
              : props.change('goalSprav', '');

            newValue.chronologicalBegin.ru ?
              props.change('chronologicalBegin', newValue.chronologicalBegin.ru)
              : props.change('chronologicalBegin', '');

            newValue.chronologicalEnd.ru ?
              props.change('chronologicalEnd', newValue.chronologicalEnd.ru)
              : props.change('chronologicalEnd', '');

            newValue.formResultRealization.idRef ?
              props.change('formResultRealization', {value: newValue.formResultRealization.idRef, label: newValue.formResultRealization.name.ru})
              : props.change('formResultRealization', null);

            /*newValue.formResultRealizationFile.ru ?
              props.change('formResultRealizationFile', newValue.formResultRealizationFile.ru)
            : props.change('formResultRealizationFile', null);*/
          } else {
            props.change('directUseDocument', null);
            props.change('goalSprav', '');
            props.change('chronologicalBegin', '');
            props.change('chronologicalEnd', '');
            props.change('formResultRealization', null);
            // props.change('formResultRealizationFile', null);
          }
        }}
        options={objStudyParentOptions ? objStudyParentOptions.map(option => ({...option, value: option.id, label: option.name[this.lng]})) : []}
        //data={objStudyParentOptions ? objStudyParentOptions.map(option => ({...option, value: option.id, label: option.name[this.lng]})) : []}
        isLoading={objStudyParentLoading}
        isMulti={true}
        onFocus={loadChilds('objStudyParent', 'directUseDocument,goalSprav,chronologicalBegin,chronologicalEnd,formResultRealization,formResultRealizationFile')}
        //onMenuOpen={loadChilds('objStudyParent', 'directUseDocument,goalSprav,chronologicalBegin,chronologicalEnd,formResultRealization,formResultRealizationFile')}
        onCreateOption={this.handleCreate}
        isValidNewOption={(v) => !!v}
        colon={true}
        validate={requiredLabel}
      />
      <Field
        name="directUseDocument"
        formItemClass="signup-form__input wrap-normal unset-lh"
        component={renderSelect}
        disabled={!themeValue || Boolean(themeValue && themeValue.directUseDocument && themeValue.directUseDocument.idRef)}
        label={directUseDocument.name[this.lng]}
        formItemLayout={{
          labelCol: {span: 10},
          wrapperCol: {span: 14}
        }}
        data={directUseDocumentOptions ? directUseDocumentOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
        isLoading={directUseDocumentLoading}
        onMenuOpen={loadOptions('directUseDocument')}
      />
      <Field
        name="goalSprav"
        formItemClass="signup-form__input wrap-normal unset-lh"
        component={renderInput}
        disabled={!themeValue || Boolean(themeValue && themeValue.goalSprav && themeValue.goalSprav.ru)}
        label={goalSprav.name[this.lng]}
        formItemLayout={{
          labelCol: {span: 10},
          wrapperCol: {span: 14}
        }}
      />
      <Fields
        names={[ 'chronologicalBegin', 'chronologicalEnd' ]}
        component={renderDoubleDateInput}
        disabledFields={{
          chronologicalBegin: !themeValue || !!(themeValue && themeValue.chronologicalBegin && themeValue.chronologicalBegin.ru),
          chronologicalEnd: !themeValue || !!(themeValue && themeValue.chronologicalEnd && themeValue.chronologicalEnd.ru)
        }}
        normalizeFields={{
          chronologicalBegin: digits(4),
          chronologicalEnd: digits(4)
        }}
        label={t('start-end')}
        format={null}
        formItemLayout={
          {
            labelCol: { span: 10 },
            wrapperCol: { span: 14 }
          }
        }
      />
      <Field
        name="formResultRealization"
        formItemClass="signup-form__input wrap-normal unset-lh"
        component={renderSelect}
        disabled={!themeValue || Boolean(themeValue && themeValue.formResultRealization && themeValue.formResultRealization.idRef)}
        label={formResultRealization.name[this.lng]}
        formItemLayout={{
          labelCol: {span: 10},
          wrapperCol: {span: 14}
        }}
        data={formResultRealizationOptions ? formResultRealizationOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
        isLoading={formResultRealizationLoading}
        onMenuOpen={loadOptions('formResultRealization')}
      />
    </Form>
  );
};

export default reduxForm({
  form: "Researches",
  enableReinitialize: true
})(Researches);
