import React from 'react';
import {Icon, Input, Table} from 'antd';

class Passport2 extends React.Component {

  columns = [{
    key: 'pp',
    title: this.props.t('P/P'),
    dataIndex: 'pp',
    width: '5%',
  }, {
    key: 'indicators',
    title: this.props.t('INDICATORS'),
    dataIndex: 'indicators',
    width: '20%'
  }, {
    title: this.props.t('UNITS_ACCOUNTING_QUANTITY'),
    children: [{
      key: 'total',
      title: this.props.t('COPIED_FOR_INSURANCE_FUND'),
      dataIndex: 'total',
    }, {
      key: 'dbeg',
      title: this.props.t('HAVING_FUND_OF_USE'),
      dataIndex: 'dbeg',
      width: '15%',
    }],
  }, {
    title: this.props.t('VALUE_OF_INSURANCE_FUND'),
    children: [{
      key: 'total2',
      title: this.props.t('NUMBER_OF_NEGATIVE_FRAMES'),
      dataIndex: 'total',
    }, {
      key: 'dbeg2',
      title: this.props.t('NUMBER_OF_STORAGE_UNITS_OF_THE_INSURANCE_FUND'),
      dataIndex: 'dbeg',
      width: '15%',
    }],
  }];
  
  renderTableHeader = (name) => {
    return function a() {
     return <h3 style={{ fontWeight: 'bold' }}>{name}</h3>
    }
  };

  render() {
    return (
      <div style={{ height: '100%', overflow: 'auto' }} className="passport">
        <Table
          bordered
          style={{height: 'auto', marginBottom: '40px'}}
          size='small'
          columns={this.columns}
          dataSource={[]}
          scroll={{x: 1200}}
          title={this.renderTableHeader(this.props.t('PASSPORT_2'))}
          pagination={false}
        />
      </div>
    )
  }
}

export default Passport2;