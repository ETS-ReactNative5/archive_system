import React from 'react';
import { Form, Col, Row, Icon } from 'antd';
import { Field, reduxForm} from 'redux-form';

import { renderInput } from '../../utils/form_components';

let MainInfoFirstForm = props => {
  const {
    openDialogBox,
    tofiConstants } = props;

  const lng = localStorage.getItem('i18nextLng');

  const addonEdit = (
    <Icon type="edit" onClick={openDialogBox} />
  );

  return (
    !!tofiConstants && <Form className="antForm-spaceBetween IndividualsMainInfo__first-form">
      <Row>
        <Col md={{ span:10, offset: 1 }} xs={{ span: 20, offset: 1 }}>
          <Field
            name='1'
            readOnly
            component={ renderInput }
            label={ tofiConstants[1] ? tofiConstants[1].name[lng] : '' }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name='2'
            readOnly
            component={ renderInput }
            label={ tofiConstants[2] ? tofiConstants[2].name[lng] : '' }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name='3'
            readOnly
            component={ renderInput }
            label={ tofiConstants[3] ? tofiConstants[3].name[lng] : '' }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name='4'
            readOnly
            component={ renderInput }
            label={ tofiConstants[4] ? tofiConstants[4].name[lng] : '' }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name='5'
            readOnly
            component={ renderInput }
            label={ tofiConstants[5] ? tofiConstants[5].name[lng] : '' }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name="6"
            readOnly
            component={renderInput}
            label={ tofiConstants[6] ? tofiConstants[6].name[lng] : '' }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name="7"
            readOnly
            component={ renderInput }
            label={ tofiConstants[7] ? tofiConstants[7].name[lng] : '' }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />
        </Col>
        <Col md={{ span:10, offset: 1 }} xs={{ span: 20, offset: 1 }}>
          <Field
            name=""
            readOnly
            component={ renderInput }
            // label={ tofiConstants[] ? tofiConstants[].name[lng] : '' }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name=""
            readOnly
            component={ renderInput }
            // label={ tofiConstants[LEADER_POSITION] ? tofiConstants[LEADER_POSITION].name[lng] : '' }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name=""
            readOnly
            component={renderInput}
            // label={ tofiConstants[LEADER_PHONE] ? tofiConstants[LEADER_PHONE].name[lng] : '' }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name=""
            readOnly
            component={renderInput}
            // label={ tofiConstants[DEP_LEADER_FIO] ? tofiConstants[DEP_LEADER_FIO].name[lng] : '' }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name=""
            readOnly
            component={renderInput}
            // label={ tofiConstants[DEP_LEADER_POSITION] ? tofiConstants[DEP_LEADER_POSITION].name[lng] : '' }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />
        </Col>
      </Row>
    </Form>
  )
};

export default reduxForm({ form: 'MainInfoFirstForm', enableReinitialize: true })(MainInfoFirstForm);
