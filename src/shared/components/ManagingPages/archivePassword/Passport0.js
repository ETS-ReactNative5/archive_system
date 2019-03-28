import React from 'react';
import {Icon, Input, Table} from 'antd';
import {parseCube_new} from '../../../utils/cubeParser';
import { isEqual } from 'lodash';
import Select from '../../Select';

const EditableSelect = ({ value, onChange, options }) => (
  <div>
    <Select
      style={{ margin: '-5px 0' }}
      value={value}
      onChange={e => onChange(e)}
      options={options}
      optionHeight={40}
    />
  </div>
);

class Passport0 extends React.Component {

  state = {
    data: [],
    initialVal: {},
    tableData: [],
  };
  
  
  renderTableHeader = () => {
    return <h3 style={{ fontWeight: 'bold' }}>{this.props.t('CONTENT_OF_DOCUMENTS_ON_FUNDS')}</h3>
  };
  renderTableHeader2 = () => {
    return <h3 style={{ fontWeight: 'bold' }}>{this.props.t('VOLUME_OF_ACCOUNTING_UNITS')}</h3>
  };

  componentDidMount() {
    if (this.props.tableData) {
      this.setState({tableData: this.props.tableData})
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.tableData && !isEqual(nextProps.tableData, this.state.tableData)) {
      this.setState({tableData: nextProps.tableData})
    }
  };

  renderSelectColumns(value, record, options) {
    //const { clsPutev, clsKatalog, clsUkaz, clsObzor } = this.props.tofiConstants;
    //const referenceTypes = [clsPutev, clsKatalog, clsUkaz, clsObzor];
    return (
      <EditableSelect
        value={value}
        onChange={(value) => this.changeNumberFundDoc(value, record.fundId)}
        options={options}
      />
    );
  };
  changeNumberFundDoc = (value, fundId) => {
    this.setState({
      tableData: this.state.tableData.map((item) => {
        if (item.fundId === fundId) {
          const changed = item.numberFundDocInit ? isEqual(item.numberFundDocInit, value) : true; 
          if (changed) {
            this.props.onChangeNumberFundDoc(value, fundId)
          }
          return {...item, changed, numberFundDoc: value};
        };
        return item;
      }),
    })  
  };

  renderTableFooter = () => {
    const {countFund, countInv, countDelo, countDeloFile} = this.props.countData;
    return (
      <div className="table-footer">
        <div className="flex">
          <div className="label"><label htmlFor="">{this.props.t('COUNT_FUNDS')}</label><Input size='small' type="text" readOnly value={countFund}/></div>
          <div className="label"><label htmlFor="">{this.props.t('COUNT_INVENT')}</label><Input size='small' type="text" readOnly value={countInv}/></div>
          <div className="label"><label htmlFor="">{this.props.t('COUNT_CASES')}</label><Input size='small' type="text" readOnly value={countDelo}/></div>
          <div className="label"><label htmlFor="">{this.props.t('COUNT_CASES_WITH_ELECTR')}</label><Input size='small' type="text" readOnly value={countDeloFile}/></div>
        </div>
        <div className="data-length">
          {/* <div className="label"><label htmlFor="">Всего:</label><Input size='small' type="text" readOnly value={this.props.tableData}/></div> */}
        </div>
      </div>
    )
  };

  render() {
    this.lng = localStorage.getItem('i18nextLng');

    const columns = [{
      key: 'index',
      title: this.props.t('P/P'),
      dataIndex: 'index',
      width: '3%',
    }, {
      key: 'fundName',
      title: this.props.t('FUND'),
      dataIndex: 'fundName',
      width: '32%',
      render: (obj) => obj[this.lng],
    }, {
      key: 'total',
      title: this.props.t('TOTAL'),
      dataIndex: 'total',
      width: '5%'
    }, {
      key: '1002',
      title: this.props.tofiConstants ? this.props.tofiConstants['uprDoc'].name[this.lng] : '',
      dataIndex: '1002',
      width: '5%'
    }, {
      key: '1004',
      title: this.props.tofiConstants ? this.props.tofiConstants['uprNTD'].name[this.lng] : '',
      dataIndex: '1004',
      width: '5%'
    }, {
      key: '1009',
      title: this.props.tofiConstants ? this.props.tofiConstants['videoDoc'].name[this.lng] : '',
      dataIndex: '1009',
      width: '5%'
    }, {
      key: '1006',
      title: this.props.tofiConstants ? this.props.tofiConstants['movieDoc'].name[this.lng] : '',
      dataIndex: '1006',
      width: '5%'
    }, {
      key: '1007',
      title: this.props.tofiConstants ? this.props.tofiConstants['photoDoc'].name[this.lng] : '',
      dataIndex: '1007',
      width: '5%'
    }, {
      key: '1008',
      title: this.props.tofiConstants ? this.props.tofiConstants['phonoDoc'].name[this.lng] : '',
      dataIndex: '1008',
      width: '5%'
    }, {
      key: '1010',
      title: this.props.tofiConstants ? this.props.tofiConstants['macReadDoc'].name[this.lng] : '',
      dataIndex: '1010',
      width: '5%'
    }, {
      key: '1003',
      title: this.props.tofiConstants ? this.props.tofiConstants['lpDoc'].name[this.lng] : '',
      dataIndex: '1003',
      width: '5%'
    }, {
      key: '1005',
      title: this.props.tofiConstants ? this.props.tofiConstants['LSDoc'].name[this.lng] : '',
      dataIndex: '1005',
      width: '5%'
    }, {
      key: 'numberFundDoc',
      title: '',
      dataIndex: 'numberFundDoc',
      width: '15%',
      render: (obj, record) => this.renderSelectColumns(obj, record, options),
    }];

    const options = (
      this.props.tofiConstants ?
        [
          {value: this.props.tofiConstants['uprDoc'].id,      label: this.props.tofiConstants['uprDoc'].name[this.lng]},
          {value: this.props.tofiConstants['uprNTD'].id,      label: this.props.tofiConstants['uprNTD'].name[this.lng]},
          {value: this.props.tofiConstants['videoDoc'].id,    label: this.props.tofiConstants['videoDoc'].name[this.lng]},
          {value: this.props.tofiConstants['movieDoc'].id,    label: this.props.tofiConstants['movieDoc'].name[this.lng]},
          {value: this.props.tofiConstants['photoDoc'].id,    label: this.props.tofiConstants['photoDoc'].name[this.lng]},
          {value: this.props.tofiConstants['phonoDoc'].id,    label: this.props.tofiConstants['phonoDoc'].name[this.lng]},
          {value: this.props.tofiConstants['macReadDoc'].id,  label: this.props.tofiConstants['macReadDoc'].name[this.lng]},
          {value: this.props.tofiConstants['lpDoc'].id,       label: this.props.tofiConstants['lpDoc'].name[this.lng]},
          {value: this.props.tofiConstants['LSDoc'].id,       label: this.props.tofiConstants['LSDoc'].name[this.lng]},
        ]
      :
        []
    );

    return (
     <div className="searchNSAReferenceByTypeMainDiv">
      {/* <div style={{height: '100%', overflow: 'auto'}} className="passport"> */}
      {/* <div className="fundsList__body"> */}
        <Table
          scroll={{y: '100%'}}
          pagination={{ pageSize: 20, showQuickJumper: true }}
          //style={{height: 'auto'}}
          bordered
          size='small'
          columns={columns}
          dataSource={this.state.tableData}
          //scroll={{x: 1200}}
          title={this.renderTableHeader}
          loading={this.props.loading}
          footer={this.renderTableFooter}
          ////// rowClassName={(record, index) => { if (record.changed) { return 'markedTableRow'}}}
          // rowClassName={(record) => record.color.replace('#', '')}
          //// rowClassName={(record, index) => ({backgroundColor: '#009688'})}
        />
      </div>
    )
  }
}

export default Passport0;