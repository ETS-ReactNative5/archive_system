import React from 'react';
import {Form} from 'antd';
import { reduxForm, Field } from 'redux-form';
import {isEmpty} from "lodash";
import {renderFileUploadBtn, renderInputLang, renderSelect, renderTextareaLang} from "../../utils/form_components";

class DescriptiveInfo extends React.PureComponent {

  lng = localStorage.getItem('i18nextLng');
  state = {
    lang: {
      annotationContentOfDocument: this.lng,
      invMulti: this.lng,
      fundHistoricalNoteMulti: this.lng,
      locationOfSupplementaryMaterials: this.lng,
    }
  };

  render() {
    const { lang } = this.state;
    if(isEmpty(this.props.tofiConstants)) return null;
    const { annotationContentOfDocument, fundAnnotationFile, invMulti, invFile,
      fundHistoricalNote, fundHistoricalNoteMulti, accessDocument, locationOfSupplementaryMaterials } = this.props.tofiConstants;
    return (
      <Form>
        <Field
          name='annotationContentOfDocument'
          component={renderTextareaLang}
          format={value => (value ? value[lang.annotationContentOfDocument] : '')}
          formItemClass="with-lang"
          disabled
          label={annotationContentOfDocument.name[this.lng]}
          formItemLayout={{
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
          }}
        />
        <Field
          name='fundAnnotationFile'
          component={renderFileUploadBtn}
          disabled
          label={fundAnnotationFile.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
        <Field
          name='invMulti'
          component={renderTextareaLang}
          format={value => (value ? value[lang.invMulti] : '')}
          formItemClass="with-lang"
          disabled
          label={invMulti.name[this.lng]}
          formItemLayout={{
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
          }}
        />
        <Field
          name='invFile'
          component={renderFileUploadBtn}
          disabled
          label={invFile.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
        <Field
          name='fundHistoricalNoteMulti'
          component={renderTextareaLang}
          format={value => (value ? value[lang.fundHistoricalNoteMulti] : '')}
          formItemClass="with-lang"
          disabled
          label={fundHistoricalNoteMulti.name[this.lng]}
          formItemLayout={{
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
          }}
        />
        <Field
          name='fundHistoricalNote'
          component={renderFileUploadBtn}
          label={fundHistoricalNote.name[this.lng]}
          disabled
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />
        {accessDocument && <Field
          name="accessDocument"
          component={renderSelect}
          disabled
          label={accessDocument.name[this.lng]}
          formItemLayout={{
            labelCol: {span: 10},
            wrapperCol: {span: 14}
          }}
        />}
        {locationOfSupplementaryMaterials && <Field
          name='locationOfSupplementaryMaterials'
          component={ renderInputLang }
          format={value => (value ? value[lang.locationOfSupplementaryMaterials] : '')}
          formItemClass="with-lang"
          disabled
          label={locationOfSupplementaryMaterials.name[this.lng]}
          formItemLayout={{
            labelCol: {span: 10},
            wrapperCol: {span: 14}
          }}
        /> }
      </Form>
    )
  }
}

export default reduxForm({form: 'DescriptiveInfo', enableReinitialize: true})(DescriptiveInfo);