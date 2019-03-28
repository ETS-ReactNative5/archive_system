import React from 'react';
import { Form, Col, Row, Icon } from 'antd';
import { Field, reduxForm} from 'redux-form';

import { renderInput } from '../../utils/form_components';
import {
  IS_AVAILABLE_SEPARATE_ROOM,
  NUMBER_OF_ROOMS, ROOM_SQUARE, ROOM_OCCUPANCY, ROOM_HEATING, IS_AVAILABLE_DEVICES, IS_AVAILABLE_SECURITY_ALARM_SYSTEM,
  MEANS_OF_FIRE_EXTINGUISHING, HAS_READING_ROOM, IS_AVAILABLE_FIRE_ALARM
} from '../../constants/tofiConstants';

let EditSourcingArchiveInfo = props => {
  const {
    openDialogBox,
    tofiConstants } = props;

  const lng = localStorage.getItem('i18nextLng');

  const addonEdit = (
    <Icon type="edit" onClick={openDialogBox} />
  );

  return (
    !!tofiConstants && <Form className="antForm-spaceBetween">
      <Row>
        <Col md={{ span:10, offset: 1 }} xs={{ span: 20, offset: 1 }}>
          <Field
            name='isAvailableSeparateRoom'
            readOnly
            component={ renderInput }
            label={ tofiConstants[IS_AVAILABLE_SEPARATE_ROOM] ? tofiConstants[IS_AVAILABLE_SEPARATE_ROOM].name[lng] : '' }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name='numberOfRooms'
            readOnly
            component={ renderInput }
            label={ tofiConstants[NUMBER_OF_ROOMS] ? tofiConstants[NUMBER_OF_ROOMS].name[lng] : '' }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name='roomSquare'
            readOnly
            component={ renderInput }
            label={ tofiConstants[ROOM_SQUARE] ? tofiConstants[ROOM_SQUARE].name[lng] : '' }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name='roomOccupancy'
            readOnly
            component={ renderInput }
            label={ tofiConstants[ROOM_OCCUPANCY] ? tofiConstants[ROOM_OCCUPANCY].name[lng] : '' }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name='roomHeating'
            readOnly
            component={ renderInput }
            label={ tofiConstants[ROOM_HEATING] ? tofiConstants[ROOM_HEATING].name[lng] : '' }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name="isAvailableDevices"
            readOnly
            component={renderInput}
            label={ tofiConstants[IS_AVAILABLE_DEVICES] ? tofiConstants[IS_AVAILABLE_DEVICES].name[lng] : '' }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name="isAvailableSecurityAlarmSystem"
            readOnly
            component={ renderInput }
            label={ tofiConstants[IS_AVAILABLE_SECURITY_ALARM_SYSTEM] ? tofiConstants[IS_AVAILABLE_SECURITY_ALARM_SYSTEM].name[lng] : '' }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name="isAvailableFireAlarm"
            readOnly
            component={ renderInput }
            label={ tofiConstants[IS_AVAILABLE_FIRE_ALARM] ? tofiConstants[IS_AVAILABLE_FIRE_ALARM].name[lng] : '' }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name='meansOfFireExtinguishing'
            readOnly
            component={ renderInput }
            label={ tofiConstants[MEANS_OF_FIRE_EXTINGUISHING] ? tofiConstants[MEANS_OF_FIRE_EXTINGUISHING].name[lng] : '' }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name='hasReadingRoom'
            readOnly
            component={renderInput}
            label={ tofiConstants[HAS_READING_ROOM] ? tofiConstants[HAS_READING_ROOM].name[lng] : '' }
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

export default reduxForm({ form: 'EditSourcingArchiveInfo', enableReinitialize: true })(EditSourcingArchiveInfo);
