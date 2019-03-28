import React, { Component } from 'react';
import {Button, Form, message} from 'antd';
import { Field, reduxForm, initialize } from 'redux-form';
import {renderInput, renderSelect} from '../../../utils/form_components';
import {getPropVal} from '../../../actions/actions';
import {isEmpty, pickBy, isEqual} from 'lodash';
import {parseCube_new, parseForTable, onSaveCubeData} from '../../../utils/cubeParser';
import {connect} from 'react-redux';
import {
  HAS_ARCHIVE_STORE, HAS_DEVICES, HAS_FIRE_ALARM, HAS_READING_ROOM, HAS_SECURITY_ALARM_SYSTEM, LOCKERS,
  ROOM_HEATING, SHELVING, CUBE_FOR_FUND_AND_IK, DO_FOR_FUND_AND_IK, DP_FOR_FUND_AND_IK} from '../../../constants/tofiConstants';
import moment from 'moment';

/*eslint eqeqeq:0*/
class DocsStorageConditions extends Component {

  state = {
    filter: {
      [HAS_DEVICES + 'Loading']: false,
      [HAS_READING_ROOM + 'Loading']: false,
      [HAS_SECURITY_ALARM_SYSTEM + 'Loading']: false,
      [HAS_FIRE_ALARM + 'Loading']: false,
      [LOCKERS + 'Loading']: false,
      [SHELVING + 'Loading']: false,
      [ROOM_HEATING + 'Loading']: false,
      [HAS_ARCHIVE_STORE + 'Loading']: false,
      fireExtToolsLoading: false,
      lightingLoading: false
    }
  };

  onSubmit = values => {
    const rest = pickBy(values, (val, key) => !isEqual(val, this.props.initialValues[key]));
    const obj = {doItem: values.key};

    return this.saveProps({obj}, {values: rest, idDPV: this.props.withIdDPV});
  };

  saveProps = async (c, v, t = this.props.tofiConstants, objData) => {
    let hideLoading;
    try {
      if (!c.cube) c.cube = {
        cubeSConst: CUBE_FOR_FUND_AND_IK,
        doConst: DO_FOR_FUND_AND_IK,
        dpConst: DP_FOR_FUND_AND_IK,
      };
      if (!c.cube.data) c.cube.data = this.props.orgSourceCubeSingle;
      const periods = [{ periodType: "0", dbeg: moment().format("YYYY-MM-DD"), dend: "3333-12-31" }]
      hideLoading = message.loading(this.props.t('UPDATING_PROPS'), 0);
      const resSave = await onSaveCubeData(c, v, t, objData, periods);
      hideLoading();
      if (!resSave.success) {
        message.error(this.props.t('PROPS_UPDATING_ERROR'));
        resSave.errors.forEach(err => {
          message.error(err.text)
        });
        return Promise.reject(resSave);
      }
      message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'));
//      this.setState({loading: true, openCard: false});
//      await this.getCubeAct();
      return resSave;
    }
    catch (e) {
      typeof hideLoading === 'function' && hideLoading();
      this.setState({loading: false});
      console.warn(e);
    }
  };

  loadOptions = c => {
    return () => {
      if(!this.props[c + 'Options']) {
        this.setState({filter: {...this.state.filter, [c+'Loading']: true}});
        this.props.getPropVal(c)
          .then(() => this.setState({filter: {...this.state.filter, [c+'Loading']: false}}));
      }
    }
  };

  render() {
    if(isEmpty(this.props.tofiConstants)) return null;
    this.lng = localStorage.getItem('i18nextLng');
    const { t, handleSubmit, dirty, submitting, error, reset, tofiConstants: {hasArchiveStore, numberOfRooms, roomArea, roomOccupancy, roomHeating, shelving,
      lockers, hasFireAlarm, hasSecurityAlarmSystem, hasReadingRoom, hasDevices, numberOfEmployees, fireExtTools, lighting},
      hasArchiveStoreOptions, roomHeatingOptions, shelvingOptions, lockersOptions, hasFireAlarmOptions,
      hasSecurityAlarmSystemOptions, hasReadingRoomOptions, hasDevicesOptions, fireExtToolsOptions, lightingOptions} = this.props;

    return (
      <Form className="antForm-spaceBetween" onSubmit={handleSubmit(this.onSubmit)}
            style={dirty
              ? {padding: '10px 15px', paddingBottom: '43px', overflow: 'auto'}
              : {padding: '10px 15px', overflow: 'auto'}}>
        {hasArchiveStore && <Field
          name="hasArchiveStore"
          component={ renderSelect }
          isSearchable={false}
          label={hasArchiveStore.name[this.lng]}
          onMenuOpen={this.loadOptions(HAS_ARCHIVE_STORE)}
          isLoading={this.state.filter[HAS_ARCHIVE_STORE + 'Loading']}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          data={hasArchiveStoreOptions ? hasArchiveStoreOptions.map(opt => ({ value: opt.id, label: opt.name[this.lng] })) : []}
        />}
        {lighting && <Field
          name="lighting"
          component={ renderSelect }
          isSearchable={false}
          label={lighting.name[this.lng]}
          onMenuOpen={this.loadOptions('lighting')}
          isLoading={this.state.filter.lighting}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          data={lightingOptions ? lightingOptions.map(opt => ({ value: opt.id, label: opt.name[this.lng] })) : []}
          // validate={required}
          // colon={true}
        />}
        {fireExtTools && <Field
          name="fireExtTools"
          component={ renderSelect }
          isSearchable={false}
          label={fireExtTools.name[this.lng]}
          onMenuOpen={this.loadOptions('fireExtTools')}
          isLoading={this.state.filter.fireExtTools}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          data={fireExtToolsOptions ? fireExtToolsOptions.map(opt => ({ value: opt.id, label: opt.name[this.lng] })) : []}
          // validate={required}
          // colon={true}
        />}
        {numberOfRooms && <Field
          name="numberOfRooms"
          component={ renderInput }
          placeholder={t('USER_FIO_PLACEHOLDER')}
          label={numberOfRooms.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        {roomArea && <Field
          name="roomArea"
          component={ renderInput }
          label={roomArea.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        {roomOccupancy && <Field
          name="roomOccupancy"
          component={ renderInput }
          label={roomOccupancy.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        {roomHeating && <Field
          name="roomHeating"
          component={ renderSelect }
          isSearchable={false}
          label={roomHeating.name[this.lng]}
          onMenuOpen={this.loadOptions(ROOM_HEATING)}
          isLoading={this.state.filter[ROOM_HEATING + 'Loading']}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          data={roomHeatingOptions ? roomHeatingOptions.map(opt => ({ value: opt.id, label: opt.name[this.lng] })) : []}
          // validate={requiredLabel}
          // colon={true}
        />}
        {shelving && <Field
          name="shelving"
          component={ renderSelect }
          label={shelving.name[this.lng]}
          onMenuOpen={this.loadOptions(SHELVING)}
          isLoading={this.state.filter[SHELVING + 'Loading']}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          
          data={shelvingOptions ? shelvingOptions.map(opt => ({ value: opt.id, label: opt.name[this.lng] })) : []}
        />}
        {lockers && <Field
          name="lockers"
          component={ renderSelect }
          label={lockers.name[this.lng]}
          onMenuOpen={this.loadOptions(LOCKERS)}
          isLoading={this.state.filter[LOCKERS + 'Loading']}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
          data={lockersOptions ? lockersOptions.map(opt => ({ value: opt.id, label: opt.name[this.lng] })) : []}
        />}
        {hasFireAlarm && <Field
          name="hasFireAlarm"
          component={renderSelect}
          label={hasFireAlarm.name[this.lng]}
          onMenuOpen={this.loadOptions(HAS_FIRE_ALARM)}
          isLoading={this.state.filter[HAS_FIRE_ALARM + 'Loading']}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
          data={hasFireAlarmOptions ? hasFireAlarmOptions.map(opt => ({ value: opt.id, label: opt.name[this.lng] })) : []}
          // validate={requiredDate}
          // colon={true}
        />}
        {hasSecurityAlarmSystem && <Field
          name="hasSecurityAlarmSystem"
          component={renderSelect}
          label={hasSecurityAlarmSystem.name[this.lng]}
          onMenuOpen={this.loadOptions(HAS_SECURITY_ALARM_SYSTEM)}
          isLoading={this.state.filter[HAS_SECURITY_ALARM_SYSTEM + 'Loading']}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
          data={hasSecurityAlarmSystemOptions ? hasSecurityAlarmSystemOptions.map(opt => ({ value: opt.id, label: opt.name[this.lng] })) : []}
          // validate={requiredDate}
          // colon={true}
        />}
        {hasReadingRoom && <Field
          name="hasReadingRoom"
          component={renderSelect}
          label={hasReadingRoom.name[this.lng]}
          onMenuOpen={this.loadOptions(HAS_READING_ROOM)}
          isLoading={this.state.filter[HAS_READING_ROOM + 'Loading']}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
          data={hasReadingRoomOptions ? hasReadingRoomOptions.map(opt => ({ value: opt.id, label: opt.name[this.lng] })) : []}
          // validate={requiredDate}
          // colon={true}
        />}
        {hasDevices && <Field
          name="hasDevices"
          component={renderSelect}
          label={hasDevices.name[this.lng]}
          onMenuOpen={this.loadOptions(HAS_DEVICES)}
          isLoading={this.state.filter[HAS_DEVICES + 'Loading']}
          formItemLayout={
            {
              labelCol: {span: 10},
              wrapperCol: {span: 14}
            }
          }
          data={hasDevicesOptions ? hasDevicesOptions.map(opt => ({ value: opt.id, label: opt.name[this.lng] })) : []}
          // validate={requiredDate}
          // colon={true}
        />}
        {numberOfEmployees && <Field
          name="numberOfEmployees"
          component={ renderInput }
          label={numberOfEmployees.name[this.lng]}
          formItemLayout={
            {
              labelCol: { span: 10 },
              wrapperCol: { span: 14 }
            }
          }
        />}
        {dirty && <Form.Item className="ant-form-btns absolute-bottom">
          <Button className="signup-form__btn" type="primary" htmlType="submit" disabled={submitting}>
            {submitting ? t('LOADING...') : t('SAVE') }
          </Button>
          <Button className="signup-form__btn" type="danger" htmlType="button" disabled={submitting} style={{marginLeft: '10px'}} onClick={reset}>
            {submitting ? t('LOADING...') : t('CANCEL') }
          </Button>
          {error && <span className="message-error"><i className="icon-error" />{error}</span>}
        </Form.Item>}
      </Form>
    )
  }
}

const DocsStorageConditionsForm =
  reduxForm({ form: 'DocsStorageConditions', enableReinitialize: true })(DocsStorageConditions);

class DocsStorageConditionsContainer extends React.Component {

  state = {
    initialValues: null
  };

  componentDidMount() {
    if(this.props.orgSourceCubeSingle) {
      this.populate()
    }
  }
  populate = () => {
    const { doForFundAndIK, dpForFundAndIK } = this.props.tofiConstants;
    const parsedData = parseCube_new(
      this.props.orgSourceCubeSingle['cube'],
      [],
      'dp',
      'do',
      this.props.orgSourceCubeSingle[`do_${doForFundAndIK.id}`],
      this.props.orgSourceCubeSingle[`dp_${dpForFundAndIK.id}`],
      `do_${doForFundAndIK.id}`,
      `dp_${dpForFundAndIK.id}`
    )[0];
    const result = {key: parsedData.id};
    const constArr = ['hasArchiveStore', 'numberOfRooms', 'roomArea', 'roomOccupancy', 'roomHeating', 'shelving',
      'lockers', 'hasFireAlarm', 'hasSecurityAlarmSystem', 'hasReadingRoom', 'hasDevices', 'numberOfEmployees',
      'fireExtTools', 'lighting'];
      this.withIdDPV = parseForTable(parsedData.props, this.props.tofiConstants, result, constArr);
    this.setState({initialValues: result});
  };

  componentDidUpdate(prevProps) {
    if(prevProps.orgSourceCubeSingle !== this.props.orgSourceCubeSingle) {
      this.populate();
    }
  }
  render() {
    return <DocsStorageConditionsForm {...this.props} withIdDPV = {this.withIdDPV} initialValues={this.state.initialValues}/>
  }
}

function mapStateToProps(state) {
  return {
    orgSourceCubeSingle: state.cubes.orgSourceCubeSingle,
    hasDevicesOptions: state.generalData[HAS_DEVICES],
    hasReadingRoomOptions: state.generalData[HAS_READING_ROOM],
    hasSecurityAlarmSystemOptions: state.generalData[HAS_SECURITY_ALARM_SYSTEM],
    hasFireAlarmOptions: state.generalData[HAS_FIRE_ALARM],
    lockersOptions: state.generalData[LOCKERS],
    shelvingOptions: state.generalData[SHELVING],
    roomHeatingOptions: state.generalData[ROOM_HEATING],
    hasArchiveStoreOptions: state.generalData[HAS_ARCHIVE_STORE],
    lightingOptions: state.generalData.lighting,
    fireExtToolsOptions: state.generalData.fireExtTools,
    orgSourceSingle : state.cubes.orgSourceCube
  }
}

export default connect(mapStateToProps, { getPropVal })(DocsStorageConditionsContainer);
