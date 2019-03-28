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
    title: this.props.t('NUMBER_OF_INVENTORIES_PLUS'),
    children: [{
      key: 'total',
      title: this.props.t('TOTAL'),
      dataIndex: 'total',
    }, {
      key: 'dbeg',
      title: this.props.t('OF_THEM_IN_THE_COMPLETE_SET'),
      dataIndex: 'dbeg',
      width: '15%',
    }],
  }, {
    title: this.props.t('CATALOGED'),
    children: [{
      key: 'total1',
      title: this.props.t('FUNDS_QUANTITY'),
      dataIndex: 'total',
    }, {
      key: 'dbeg1',
      title: this.props.t('UNITS_QUANTITY'),
      dataIndex: 'dbeg',
      width: '15%',
    }, {
      title: this.props.t('NUMBERS_OF_CARDS_COMPLETED'),
      children: [{
        key: 'total2',
        title: this.props.t('TOTAL'),
        dataIndex: 'total',
      }, {
        key: 'dbeg2',
        title: this.props.t('INCLUDED_IN_THE_CATALOGS'),
        dataIndex: 'dbeg',
        width: '15%',
      }],
    }],
    }, {
    title: this.props.t('DATABASES_ON_DOCUMENTS_CONTENT'),
    children: [{
      key: 'total2',
      title: this.props.t('NUMBER_OF_DB'),
      dataIndex: 'total',
    }, {
      key: 'dbeg2',
      title: this.props.t('VALUME_IN_MEGABYTES'),
      dataIndex: 'dbeg',
      width: '15%',
    }],
  }];

  columns2 = [{
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
    key: 'indicators',
    title: this.props.t('QUANTITY'),
    dataIndex: 'indicators',
    width: '20%'
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
          title={this.renderTableHeader(this.props.t('PASSPORT_3'))}
          pagination={false}
        />
        <Table
          bordered
          style={{height: 'auto', marginBottom: '40px'}}
          size='small'
          columns={this.columns2}
          dataSource={[]}
          scroll={{x: 1200}}
          title={this.renderTableHeader(this.props.t('REFERENCE_INFORMATIONAL_PUBLICATIONS'))}
          pagination={false}
        />
      </div>
    )
  }
}

export default Passport2;