import React from 'react';
import {Icon, Input, Table, Button} from 'antd';
import { isEmpty, isEqual } from 'lodash';

class EditableCell extends React.Component {
  componentDidUpdate(prevProps) {
    if (!isEqual(this.props.record, prevProps.record)) {
      this.setState({
        value: this.props.value,
        editable: false,
        record: this.props.record,
      })
    }
  }

  state = {
    value: this.props.value,
    editable: false,
    record: this.props.record,
  }
  handleChange = (e) => {
    const value = e.target.value;
    this.setState({ value });
  }
  check = () => {
    this.setState({ editable: false });
    if (this.props.onChange) {
      this.props.onChange(this.state.record.key, this.state.value);
    }
  }
  edit = () => {
    this.setState({ editable: true });
  }
  render() {
    const { value, editable } = this.state;
    return (
      <div className="editable-cell">
        {
          editable ?
            <div className="editable-cell-input-wrapper">
              <Input
                value={value}
                onChange={this.handleChange}
                onPressEnter={this.check}
              />
              <Icon
                type="check"
                className="editable-cell-icon-check"
                onClick={this.check}
              />
            </div>
          :
            <div className="editable-cell-text-wrapper">
              {value || ' '}
              <Icon
                type="edit"
                className="editable-cell-icon"
                onClick={this.edit}
              />
            </div>
        }
      </div>
    );
  }
}

class Passport6 extends React.Component {
  
  state = {
    archive: {},
    initialValues: [],
    initialValues2: [],
    loading: false,
  };

  columns = [
    {
      key: 'pp',
      title: this.props.t('P/P'),
      dataIndex: 'pp',
      width: '5%',
    },
    {
      key: 'indicators',
      title: this.props.t('INDICATORS'),
      dataIndex: 'indicators',
      width: '25%'
    },
    {
      key: 'quatities',
      title: this.props.t('QUANTITY'),
      dataIndex: 'quatities',
      width: '25%',
      render: (text, record) => (
        <EditableCell
          value={text}
          record={record}
          onChange={this.changeArchive}
        />
      )
    },
  ];

  columns2 = [
    {
      key: 'pp',
      title: this.props.t('P/P'),
      dataIndex: 'pp',
      width: '5%',
    },
    {
      key: 'indicators',
      title: this.props.t('INDICATORS'),
      dataIndex: 'indicators',
      width: '25%'
    },
    {
      key: 'quatities',
      title: this.props.t('QUANTITY'),
      dataIndex: 'quatities',
      width: '25%',
      render: (text, record) => (
        <EditableCell
          value={text}
          record={record}
          onChange={this.changeArchive}
        />
      )
    },
  ];

  componentDidMount() {
    if (!isEmpty(this.props.archive)) {
      this.processArchiveRecord(this.props.archive);
    }
  };

  componentDidUpdate(prevProps) {
    if (!isEmpty(this.props.archive) && !isEqual(this.props.archive, prevProps.archive)) {
      this.processArchiveRecord(this.props.archive);
    }
  };

  processArchiveRecord(archive) {
    const initialValues = [
      {
        key: 'booksBrochures',
        pp: 1,
        indicators: this.props.tofiConstants ? this.props.tofiConstants['booksBrochures'].name[this.props.lng] : 'booksBrochures',
        quatities: archive.booksBrochures,
      },
      {
        key: 'newspapers',
        pp: 2,
        indicators: this.props.tofiConstants ? this.props.tofiConstants['newspapers'].name[this.props.lng] : 'newspapers',
        quatities: archive.newspapers,
      },
      {
        key: 'journal',
        pp: 3,
        indicators: this.props.tofiConstants ? this.props.tofiConstants['journal'].name[this.props.lng] : 'journal',
        quatities: archive.journal,
      },
      {
        key: 'typePrintedProducts',
        pp: 4,
        indicators: this.props.tofiConstants ? this.props.tofiConstants['typePrintedProducts'].name[this.props.lng] : 'typePrintedProducts',
        quatities: archive.typePrintedProducts,
      },
    ];
    const initialValues2 = [
      {
        key: 'archiveBuildings',
        pp: 1,
        indicators: this.props.tofiConstants ? this.props.tofiConstants['archiveBuildings'].name[this.props.lng] : 'archiveBuildings',
        quatities: archive.archiveBuildings,
      },
      {
        key: 'specialRooms',
        pp: 2,
        indicators: this.props.tofiConstants ? this.props.tofiConstants['specialRooms'].name[this.props.lng] : 'specialRooms',
        quatities: archive.specialRooms,
      },
      {
        key: 'fittedRooms',
        pp: 3,
        indicators: this.props.tofiConstants ? this.props.tofiConstants['fittedRooms'].name[this.props.lng] : 'fittedRooms',
        quatities: archive.fittedRooms,
      },
      {
        key: 'archivalUtilRate',
        pp: 4,
        indicators: this.props.tofiConstants ? this.props.tofiConstants['archivalUtilRate'].name[this.props.lng] : 'archivalUtilRate',
        quatities: archive.archivalUtilRate,
      },
      {
        key: 'buildSecAlarm',
        pp: 5,
        indicators: this.props.tofiConstants ? this.props.tofiConstants['buildSecAlarm'].name[this.props.lng] : 'buildSecAlarm',
        quatities: archive.buildSecAlarm,
      },
      {
        key: 'fireBuildEquipment',
        pp: 6,
        indicators: this.props.tofiConstants ? this.props.tofiConstants['fireBuildEquipment'].name[this.props.lng] : 'fireBuildEquipment',
        quatities: archive.fireBuildEquipment,
      },
      {
        key: 'lengthMetalShelving',
        pp: 7,
        indicators: this.props.tofiConstants ? this.props.tofiConstants['lengthMetalShelving'].name[this.props.lng] : 'lengthMetalShelving',
        quatities: archive.lengthMetalShelving,
      },
      {
        key: 'lengthWoodenShelving',
        pp: 8,
        indicators: this.props.tofiConstants ? this.props.tofiConstants['lengthWoodenShelving'].name[this.props.lng] : 'lengthWoodenShelving',
        quatities: archive.lengthWoodenShelving,
      },
      {
        key: 'outlinedDocuments',
        pp: 9,
        indicators: this.props.tofiConstants ? this.props.tofiConstants['outlinedDocuments'].name[this.props.lng] : 'outlinedDocuments',
        quatities: archive.outlinedDocuments,
      },
    ];
    this.setState({ archive: archive, initialValues: initialValues, initialValues2: initialValues2 }, 
      //() => console.log(this.state)
    );
  };

  changeArchive = (key, value) => {
    this.setState({
      archive: { ...this.state.archive, [key]: value }
    });
  };

  onSave = () => {

    const oldVal = this.props.archive;
    const newVal = this.state.archive;
    const isChanged = {
      booksBrochures: oldVal.booksBrochures !== newVal.booksBrochures, 
      newspapers: oldVal.newspapers !== newVal.newspapers, 
      journal: oldVal.journal !== newVal.journal, 
      typePrintedProducts: oldVal.typePrintedProducts !== newVal.typePrintedProducts, 
      archiveBuildings: oldVal.archiveBuildings !== newVal.archiveBuildings, 
      specialRooms: oldVal.specialRooms !== newVal.specialRooms, 
      fittedRooms: oldVal.fittedRooms !== newVal.fittedRooms, 
      archivalUtilRate: oldVal.archivalUtilRate !== newVal.archivalUtilRate, 
      buildSecAlarm: oldVal.buildSecAlarm !== newVal.buildSecAlarm, 
      fireBuildEquipment: oldVal.fireBuildEquipment !== newVal.fireBuildEquipment, 
      lengthMetalShelving: oldVal.lengthMetalShelving !== newVal.lengthMetalShelving, 
      lengthWoodenShelving: oldVal.lengthWoodenShelving !== newVal.lengthWoodenShelving, 
      outlinedDocuments: oldVal.outlinedDocuments !== newVal.outlinedDocuments, 
    }
    const toSend = {} 
    for (let key in isChanged) {
      if (isChanged[key]) {
        toSend[key] = newVal[key];
      }
    }
    console.log(toSend);
    this.props.onSaveArchiveInfo(newVal.id, toSend);  
  
  };

  renderTableHeader = (name) => {
    const { props, state, onSave } = this;
    return function a() {
      return (
      <div>
        <h3 style={{ fontWeight: 'bold' }}>
          {name}
          {!isEqual(props.archive, state.archive) &&
            <Button style={{float: 'right'}} onClick={onSave}>{props.t('SAVE')}</Button>
          }
        </h3>
      </div>
      )
    }
  };

  render() {
    const { archive } = this.props;
    return (
      <div style={{ height: '100%', overflow: 'auto' }} className="passport">
        <Table
          bordered
          loading={this.props.loading} 
          style={{height: 'auto', marginBottom: '40px'}}
          size='small'
          columns={this.columns}
          dataSource={this.state.initialValues}
          scroll={{x: 1200}}
          title={this.renderTableHeader(this.props.t('PASSPORT_4'))}
          pagination={false}
        />
        <Table
          bordered
          loading={this.props.loading} 
          style={{height: 'auto', marginBottom: '40px'}}
          size='small'
          columns={this.columns2}
          dataSource={this.state.initialValues2}
          scroll={{x: 1200}}
          title={this.renderTableHeader(this.props.t('PASSPORT_5'))}
          pagination={false}
        />
      </div>
    )
  }
}

export default Passport6;