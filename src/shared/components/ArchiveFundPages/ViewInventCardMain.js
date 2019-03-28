import React from 'react';
import { Form, Upload, Button, Icon } from 'antd';
import { Field, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';

import {renderInput} from '../../utils/form_components';

const ViewInventCardMain = props => {

  const uploadBtn = () => {
    const props = {
      action: '/',
      defaultFileList: []
    };

    return (
      <Form.Item
        label={ t('INVENT_FOREWORD') }
        formItemLayout={
          {
            labelCol: { span: 10 },
            wrapperCol: { span: 14 }
          }
        }
      >
        <Upload {...props}>
          <Button>
            <Icon type="upload"/> Upload
          </Button>
        </Upload>
      </Form.Item>
    )
  };

  const lng = localStorage.getItem('i18nextLng');

  const { t, tofiConstants: { invNumber, invList, invType, invDates, invCaseSystem }, openDialogBox } = props;
  const addonEdit = (
    <Icon type="edit" onClick={openDialogBox}/>
  );

  return (

    <Form className="antForm-spaceBetween" id="ViewInventCardMainForm">
      <div className="general-form">
        <Field
          name="invNumber"
          component={ renderInput }
          readOnly
          label={invNumber.name[lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          addonAfter={addonEdit}
        />
        <Field
          name="inventName"
          component={ renderInput }
          readOnly
          label={ invList.name[lng] }
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          addonAfter={addonEdit}
        />
        <Field
          name="invType"
          component={ renderInput }
          readOnly
          label={ invType.name[lng] }
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          addonAfter={addonEdit}
        />
        <Field
          name="invDates"
          component={ renderInput }
          readOnly
          label={ invDates.name[lng] }
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          addonAfter={addonEdit}
        />
        <Field
          name="invCaseSystem"
          component={ renderInput }
          readOnly
          label={ invCaseSystem.name[lng] }
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          addonAfter={addonEdit}
        />
        <Field
          name="accessLevel"
          component={ renderInput }
          readOnly
          label={ t('ACCESS_LEVEL') }
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          addonAfter={addonEdit}
        />
      </div>
      <div className="image-viewer">
        <div className="image-viewer-list">
          <Field
            name="inventForeword"
            component={ uploadBtn }
          />
        </div>
        <div className="image-viewer-show">
        </div>
      </div>
    </Form>
  )
};

ViewInventCardMain.propTypes = {
  openDialogBox: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  tofiConstants: PropTypes.shape().isRequired
};

export default reduxForm({ form: 'ViewInventCardMain', enableReinitialize: true })(ViewInventCardMain);
