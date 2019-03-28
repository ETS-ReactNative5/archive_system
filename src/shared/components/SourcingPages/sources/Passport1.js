import React from 'react';
import {Icon, Input, Table} from 'antd';
import {parseCube_new} from '../../../utils/cubeParser';
import EditableCell from './EditableCell.js'

{/*class EditableCell extends React.Component {
  state = {
    value: this.props.value,
    editable: false,
  };
  handleChange = (e) => {
    const value = e.target.value;
    this.setState({ value });
  };
  check = () => {
    this.setState({ editable: false });
    if (this.props.onChange) {
      console.log(this.state.value);
    }
  };
  edit = () => {
    this.setState({ editable: true });
  };
  componentWillReceiveProps(nextProps) {
    if(nextProps.value) {
      this.setState({ value: nextProps.value })
    }
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
}*/}

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
    width: '10%'
  }, {
    title: this.props.t('UNITS_QUANTITY'),
    children: [{
      key: 'total',
      title: this.props.t('TOTAL'),
      width: '15%',
      dataIndex: 'total',
      render: (text, record) => (
        <EditableCell
          value={text}
        />
      )
    }, {
      title: this.props.t('DEADLINES'),
      children: [
        {
          key: 'dbeg',
          title: this.props.t('DBEG_CASES'),
          dataIndex: 'dbeg',
          width: '10%',
          render: (text, record) => (
            <EditableCell
              value={text}
            />
          )
        },
        {
          key: 'dend',
          title: this.props.t('DEND_CASES'),
          dataIndex: 'dend',
          width: '10%',
          render: (text, record) => (
            <EditableCell
              value={text}
            />
          )
        }
      ]
    }, {
      title: this.props.t('APPROVED'),
      children: [
        {
          key: 'totalApproved',
          title: this.props.t('TOTAL'),
          dataIndex: 'totalApproved',
          width: '10%',
          render: (text, record) => (
            <EditableCell
              value={text}
            />
          )
        },
        {
          title: this.props.t('DEADLINES'),
          children: [
            {
              key: 'dbegApproved',
              title: this.props.t('DBEG_APPROVED'),
              dataIndex: 'dbegApproved',
              width: '15%',
              render: (text, record) => (
                <EditableCell
                  value={text}
                />
              )
            },
            {
              key: 'dendApproved',
              title: this.props.t('DEND_APPROVED'),
              dataIndex: 'dendApproved',
              width: '15%',
              render: (text, record) => (
                <EditableCell
                  value={text}
                />
              )
            },
          ]
        }
      ]
    }, {
      key: 'storedCases',
      className: 'rotated-90',
      title: this.props.t('STORED_CASES'),
      dataIndex: 'storedCases',
      width: '5%',
      render: (text, record) => (
        <EditableCell
          value={text}
        />
      )
    }, {
      key: 'formedInYear',
      className: 'rotated-90',
      title: this.props.t('FORMED_IN_YEAR'),
      dataIndex: 'formedInYear',
      width: '5%',
      render: (text, record) => (
        <EditableCell
          value={text}
        />
      )
    }],
  }];

  renderTableHeader = () => {
    return <h3 style={{ fontWeight: 'bold' }}>{this.props.t('DOCS_INFO')}</h3>
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
      </div>
    )
  }
}

export default Passport1;