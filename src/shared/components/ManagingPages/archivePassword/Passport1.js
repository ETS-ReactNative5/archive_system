import React from 'react';
import {Icon, Input, Table} from 'antd';
import {parseCube_new} from '../../../utils/cubeParser';

class Passport1 extends React.Component {

  state = {
    data: [],
    initialVal: {}
  };

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
    key: 'indicators1',
    title: this.props.t('FUNDS_QUANTITY'),
    dataIndex: 'indicators',
    width: '10%'
  }, {
    title: this.props.t('UNITS_QUANTITY'),
    children: [{
      key: 'total',
      title: this.props.t('TOTAL'),
      dataIndex: 'total',
    }, {
      title: this.props.t('INCLUDING'),
      children: [
        {
          key: 'dbeg',
          title: this.props.t('INCLUDED_IN_THE_INVENTORY'),
          dataIndex: 'dbeg',
          width: '15%',
        },
        {
          key: 'dbeg1',
          title: this.props.t('IN_THE_STATE_LANGUAGE'),
          dataIndex: 'dbeg',
          width: '15%',
        },
        {
          key: 'dend',
          title: this.props.t('ACCOUNTED_FOR_ESPECIALLY_VALUABLE'),
          dataIndex: 'dend',
          width: '15%',
        }
      ]
    }],
  }, {
    key: 'indicators2',
    title: this.props.t('NUMBER_UNITS_TEMP_STORAGE'),
    dataIndex: 'indicators2',
    width: '10%'
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
    key: 'indicators1',
    title: this.props.t('FUNDS_QUANTITY'),
    dataIndex: 'indicators',
    width: '10%'
  }, {
    title: this.props.t('UNITS_ACCOUNTING_QUANTITY'),
    children: [{
      key: 'total',
      title: this.props.t('TOTAL'),
      dataIndex: 'total',
    }, {
      key: 'dbeg',
      title: this.props.t('INCLUDING') + ' ' + this.props.t('INCLUDED_IN_THE_INVENTORY'),
      dataIndex: 'dbeg',
      width: '15%',
    }],
  }];
  
  renderTableHeader = () => {
    return <h3 style={{ fontWeight: 'bold' }}>{this.props.t('PASSPORT_1')}</h3>
  };
  renderTableHeader2 = () => {
    return <h3 style={{ fontWeight: 'bold' }}>{this.props.t('VOLUME_OF_ACCOUNTING_UNITS')}</h3>
  };

  componentDidMount() {
    if(this.props.orgSourceCubeSingle) {
      const arr = [];
      const constArr = ['permCases', 'permCasesDbeg', 'permCasesDend', 'permCasesInv', 'permCasesInvDbeg', 'permCasesInvDend', 'storedPermCases', 'inYearPermCases',
        'staffCases', 'staffCasesDbeg', 'staffCasesDend', 'staffCasesInv', 'staffCasesInvDbeg', 'staffCasesInvDend', 'storedStaffCases', 'inYearStaffCases', 'doForFundAndIK', 'dpForFundAndIK'];
      const initialVal = {};
      constArr.forEach(c => arr.push(this.props.tofiConstants[c]));
      const { doForFundAndIK, dpForFundAndIK } = this.props.tofiConstants;
      this.setState({
        data: parseCube_new(
          this.props.orgSourceCubeSingle['cube'],
          [],
          'dp',
          'do',
          this.props.orgSourceCubeSingle[`do_${doForFundAndIK.id}`],
          this.props.orgSourceCubeSingle[`dp_${dpForFundAndIK.id}`],
          `do_${doForFundAndIK.id}`,
          `dp_${dpForFundAndIK.id}`)[0]
      }, () => {
        arr.forEach(con => {
          const propObj = this.state.data.props.find(element => element.prop == con.id); // eslint-disable-line eqeqeq
          if(propObj) {
            initialVal[con.constName] = propObj.value || '';
          }
        });
        this.setState({ initialVal });
      })
    }
  }

  render() {
    return (
      <div style={{height: '100%', overflow: 'auto'}} className="passport">
        <Table
          style={{height: 'auto'}}
          bordered
          size='small'
          columns={this.columns}
          dataSource={[
            {
              key: '1',
              pp: '1',
              indicators: 'Постоянного хранения',
              total: this.state.initialVal.permCases || '',
              dbeg: this.state.initialVal.permCasesDbeg || '',
              dend: this.state.initialVal.permCasesDend || '',
              totalApproved: this.state.initialVal.permCasesInv || '',
              dbegApproved: this.state.initialVal.permCasesInvDbeg || '',
              dendApproved: this.state.initialVal.permCasesInvDend || '',
              storedCases: this.state.initialVal.storedPermCases || '',
              formedInYear: this.state.initialVal.inYearPermCases || ''
            },
            {
              key: '2',
              pp: '2',
              indicators: 'По личному составу',
              total: this.state.initialVal.staffCases || '',
              dbeg: this.state.initialVal.staffCasesDbeg || '',
              dend: this.state.initialVal.staffCasesDend || '',
              totalApproved: this.state.initialVal.staffCasesInv || '',
              dbegApproved: this.state.initialVal.staffCasesInvDbeg || '',
              dendApproved: this.state.initialVal.staffCasesInvDend || '',
              storedCases: this.state.initialVal.storedStaffCases || '',
              formedInYear: this.state.initialVal.inYearStaffCases || ''
            }
          ]}
          scroll={{x: 1200}}
          title={this.renderTableHeader}
          pagination={false}
        />
        <Table
          style={{height: 'auto'}}
          bordered
          size='small'
          columns={this.columns2}
          dataSource={[]}
          scroll={{x: 1200}}
          title={this.renderTableHeader2}
          pagination={false}
        />
      </div>
    )
  }
}

export default Passport1;