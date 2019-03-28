import React from 'react';
import { Form, Col, Row, Icon } from 'antd';
import { Field, reduxForm} from 'redux-form';

import { renderInput } from '../../utils/form_components';
import {
  ORG_FUND_NUMBER, IS_ACTIVE,
  ORG_NUMBER, FORM_OF_ADMISSION, LEGAL_STATUS, ORG_ADDRESS, ORG_PHONE, ORG_FAX, ORG_EMAIL, ORG_FORMATION_DOCUMENT,
  ORG_REORGANIZATION_DOCUMENT, LEADER_FIO, LEADER_POSITION, LEADER_PHONE, DEP_LEADER_FIO, DEP_LEADER_POSITION,
  DEP_LEADER_PHONE, RESPONSIBLE_APPOINTMENT_DATE, RESPONSIBLE_PHONE, RESPONSIBLE_POSITION, RESPONSIBLE_FIO,
  ARCHIVE_LEADER_FIO, ARCHIVE_LEADER_POSITION, ARCHIVE_LEADER_PHONE, ARCHIVE_LEADER_APPOINTMENT_DATE,
  COMMISSION_LEADER_FIO, COMMISSION_LEADER_POSITION, COMMISSION_LEADER_PHONE, ORG_LOCATION
} from '../../constants/tofiConstants';

let EditSourcingMain = props => {
  const {
    t,
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
            name="orgName"
            readOnly
            component={ renderInput }
            label={t('ORG_NAME')}
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name="orgShortName"
            readOnly
            component={ renderInput }
            label={t('ORG_SHORT_NAME')}
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name='isActive'
            readOnly
            component={ renderInput }
            label={ tofiConstants[IS_ACTIVE] ? tofiConstants[IS_ACTIVE].name[lng] : '' }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name='orgNumber'
            readOnly
            component={ renderInput }
            label={ tofiConstants[ORG_NUMBER] ? tofiConstants[ORG_NUMBER].name[lng] : '' }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name='orgFundNumber'
            readOnly
            component={ renderInput }
            label={ tofiConstants[ORG_FUND_NUMBER] ? tofiConstants[ORG_FUND_NUMBER].name[lng] : '' }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name='formOfAdmission'
            readOnly
            component={ renderInput }
            label={ tofiConstants[FORM_OF_ADMISSION] ? tofiConstants[FORM_OF_ADMISSION].name[lng] : '' }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name='legalStatus'
            readOnly
            component={ renderInput }
            label={ tofiConstants[LEGAL_STATUS] ? tofiConstants[LEGAL_STATUS].name[lng] : '' }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name="orgLocation"
            readOnly
            component={renderInput}
            label={ tofiConstants[ORG_LOCATION] ? tofiConstants[ORG_LOCATION].name[lng] : '' }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name="orgAddress"
            readOnly
            component={ renderInput }
            label={ tofiConstants[ORG_ADDRESS] ? tofiConstants[ORG_ADDRESS].name[lng] : '' }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name='orgPhone'
            readOnly
            component={ renderInput }
            label={ tofiConstants[ORG_PHONE] ? tofiConstants[ORG_PHONE].name[lng] : '' }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name='orgFax'
            readOnly
            component={renderInput}
            label={ tofiConstants[ORG_FAX] ? tofiConstants[ORG_FAX].name[lng] : '' }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name='orgEmail'
            readOnly
            component={renderInput}
            label={ tofiConstants[ORG_EMAIL] ? tofiConstants[ORG_EMAIL].name[lng] : '' }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name='orgFormationDocument'
            readOnly
            component={renderInput}
            label={ tofiConstants[ORG_FORMATION_DOCUMENT] ? tofiConstants[ORG_FORMATION_DOCUMENT].name[lng] : '' }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name='orgReorganizationDocument'
            readOnly
            component={renderInput}
            label={ tofiConstants[ORG_REORGANIZATION_DOCUMENT] ? tofiConstants[ORG_REORGANIZATION_DOCUMENT].name[lng] : '' }
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
          <Form.Item>{t('LEADER')}</Form.Item>
          <Field
            name="leaderFIO"
            readOnly
            component={ renderInput }
            label={ tofiConstants[LEADER_FIO] ? tofiConstants[LEADER_FIO].name[lng] : '' }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name="leaderPosition"
            readOnly
            component={ renderInput }
            label={ tofiConstants[LEADER_POSITION] ? tofiConstants[LEADER_POSITION].name[lng] : '' }
            formItemLayout={
              {
                labelCol: { span: 10 },
                wrapperCol: { span: 14 }
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name="leaderPhone"
            readOnly
            component={renderInput}
            label={ tofiConstants[LEADER_PHONE] ? tofiConstants[LEADER_PHONE].name[lng] : '' }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />
          <Form.Item>{t('DEP_LEADER')}</Form.Item>
          <Field
            name="depLeaderFIO"
            readOnly
            component={renderInput}
            label={ tofiConstants[DEP_LEADER_FIO] ? tofiConstants[DEP_LEADER_FIO].name[lng] : '' }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name="depLeaderPosition"
            readOnly
            component={renderInput}
            label={ tofiConstants[DEP_LEADER_POSITION] ? tofiConstants[DEP_LEADER_POSITION].name[lng] : '' }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name="depLeaderPhone"
            readOnly
            component={renderInput}
            label={ tofiConstants[DEP_LEADER_PHONE] ? tofiConstants[DEP_LEADER_PHONE].name[lng] : '' }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />
          <Form.Item>{t('RESPONSIBLE')}</Form.Item>
          <Field
            name="responsibleFIO"
            readOnly
            component={renderInput}
            label={ tofiConstants[RESPONSIBLE_FIO] ? tofiConstants[RESPONSIBLE_FIO].name[lng] : '' }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name="responsiblePosition"
            readOnly
            component={renderInput}
            label={ tofiConstants[RESPONSIBLE_POSITION] ? tofiConstants[RESPONSIBLE_POSITION].name[lng] : '' }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name="responsiblePhone"
            readOnly
            component={renderInput}
            label={ tofiConstants[RESPONSIBLE_PHONE] ? tofiConstants[RESPONSIBLE_PHONE].name[lng] : '' }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name="responsibleAppointmentDate"
            readOnly
            component={renderInput}
            label={ tofiConstants[RESPONSIBLE_APPOINTMENT_DATE] ? tofiConstants[RESPONSIBLE_APPOINTMENT_DATE].name[lng] : '' }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />
          <Form.Item>{t('ARCHIVE_LEADER')}</Form.Item>
          <Field
            name="archiveLeaderFIO"
            readOnly
            component={renderInput}
            label={ tofiConstants[ARCHIVE_LEADER_FIO] ? tofiConstants[ARCHIVE_LEADER_FIO].name[lng] : '' }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name="archiveLeaderPosition"
            readOnly
            component={renderInput}
            label={ tofiConstants[ARCHIVE_LEADER_POSITION] ? tofiConstants[ARCHIVE_LEADER_POSITION].name[lng] : '' }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name="archiveLeaderPhone"
            readOnly
            component={renderInput}
            label={ tofiConstants[ARCHIVE_LEADER_PHONE] ? tofiConstants[ARCHIVE_LEADER_PHONE].name[lng] : '' }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name="archiveLeaderAppointmentDate"
            readOnly
            component={renderInput}
            label={ tofiConstants[ARCHIVE_LEADER_APPOINTMENT_DATE] ? tofiConstants[ARCHIVE_LEADER_APPOINTMENT_DATE].name[lng] : '' }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />
          <Form.Item>{t('COMMISSION_LEADER')}</Form.Item>
          <Field
            name="commissionLeaderFIO"
            readOnly
            component={renderInput}
            label={ tofiConstants[COMMISSION_LEADER_FIO] ? tofiConstants[COMMISSION_LEADER_FIO].name[lng] : '' }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name="commissionLeaderPosition"
            readOnly
            component={renderInput}
            label={ tofiConstants[COMMISSION_LEADER_POSITION] ? tofiConstants[COMMISSION_LEADER_POSITION].name[lng] : '' }
            formItemLayout={
              {
                labelCol: {span: 10},
                wrapperCol: {span: 14}
              }
            }
            addonAfter={addonEdit}
          />
          <Field
            name="commissionLeaderPhone"
            readOnly
            component={renderInput}
            label={ tofiConstants[COMMISSION_LEADER_PHONE] ? tofiConstants[COMMISSION_LEADER_PHONE].name[lng] : '' }
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

export default reduxForm({ form: 'EditSourcingMain', enableReinitialize: true })(EditSourcingMain);
