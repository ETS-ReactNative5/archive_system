import React from 'react';
import {Table, Input, Popconfirm, Button, Icon} from 'antd';
import uuid from 'uuid';
import {isEmpty} from 'lodash';

const EditableCell = ({ editable, value, onChange }) => (
  <div>
    {editable
      ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
      : value
    }
  </div>
);

class LegalEntitiesInventories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inv: {
        data: [
          {
            key: 'asdas',
            table: 'inv',
            invDend: 'asdas',
            invDbeg: 'asdas',
            invType: 'asdas',
            invList: 'inv 1',
            invNumber: '2',
          }
        ],
        selectedRow: {}
      },
      case: {
        data: [
          {
            key: 'asd',
            table: 'case',
            fundNumber: '2',
            caseName: 'cn',
            caseDbeg: '1111',
            caseDend: '2222',
            caseNumberOfPages: '20',
            caseStructuralSubdivision: 'css'
          }
        ]
      }
    };
  }

  renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.key, column, record.table)}
      />
    );
  }

  handleChange(value, key, column, table) {
    const newData = [...this.state[table].data];
    const target = newData.find(item => key === item.key);
    if (target) {
      target[column] = value;
      this.setState({ [table]: {...this.state[table], data: newData }});
    }
  }
  edit = (key, table) => {
    return e => {
      e.stopPropagation();
      const newData = [...this.state[table].data];
      const target = newData.find(item => key === item.key);
      if (target) {
        target.editable = true;
        this.setState({ [table]: {...this.state[table], data: newData }});
      }
    }
  };
  save = (key, table) => {
    return e => {
      e.stopPropagation();
      const newData = [...this.state[table].data];
      const target = newData.find(item => key === item.key);
      if (target) {
        target.key = uuid();
        delete target.editable;
        this.setState({ [table]: {...this.state[table], data: newData }});
      }
    }
  };
  remove = (key, table) => {
    const newData = this.state[table].data.filter(item => item.key !== key);
    this.setState({ [table]: {...this.state[table], data: newData }});
  };
  cancel = (key, table) => {
    const newData = [...this.state[table].data];
    if(key.includes('newData')) {
      this.setState({ [table]: {...this.state[table], data: newData.filter(item => item.key !== key), selectedRow: {} }});
      return;
    }
    const target = newData.find(item => key === item.key);
    if (target) {
      delete target.editable;
      this.setState({ [table]: {...this.state[table], data: newData, selectedRow: {} }});
    }
  };
  handleRowClick = rec => {
    this.setState({ [rec.table]: {...this.state[rec.table], selectedRow: rec} })
  };
  stopPropagation = e => {
    e.stopPropagation();
  };
  renderInvTableHeader = () => {
    return (
      <div className="flex">
        <Button
          style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '10px'}}
          type="primary"
          shape='circle'
          icon='plus'
          onClick={() =>
            this.setState({
              inv: {
                ...this.state.inv,
                data: [
                  ...this.state.inv.data,
                  {
                    key: `newData_${this.state.inv.data.length}`,
                    table: 'inv',
                    editable: true,
                    nomenDate1: '',
                    nomenDate2: '',
                    nomenDate3: '',
                    dbeg: '',
                    dend: ''
                  }]
              }
            })}/>
        <Button type='primary' disabled={!this.state.inv.selectedRow.invList || (this.state.inv.selectedRow.key && this.state.inv.selectedRow.key.includes('newData'))}>{this.props.t('MOVE_TO_STORAGE')}</Button>
      </div>
    )
  };
  renderCaseTableHeader = () => {
    return (
      <div className="flex">
        <Button
          style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '10px'}}
          type="primary"
          shape='circle'
          icon='plus'
          disabled={!this.state.inv.selectedRow.invList || (this.state.inv.selectedRow.key && this.state.inv.selectedRow.key.includes('newData'))}
          onClick={() =>
            this.setState({
              case: {
                ...this.state.inv,
                data: [
                  ...this.state.case.data,
                  {
                    key: `newData_${this.state.case.data.length}`,
                    table: 'case',
                    editable: true,
                    nomenDate1: '',
                    nomenDate2: '',
                    nomenDate3: '',
                    dbeg: '',
                    dend: ''
                  }]
              }
            })}/>
        {this.state.inv.selectedRow.invList && <h2>{this.state.inv.selectedRow.invList}</h2>}
      </div>
    )
  };
  render() {
    if(isEmpty(this.props.tofiConstants)) return null;
    const { t, tofiConstants: {invNumber, invType, invDbeg, invDend, invDate1, invDate2, invDate3,
        invDeadline, fundNumber, caseDbeg, caseDend, caseNumberOfPages, caseStructuralSubdivision} } = this.props;
    const lng = localStorage.getItem('i18nextLng');
    return <div className="LegalEntitiesInventories">
      <Table
        bordered
        columns={[
          {
            key: 'invNumber',
            title: invNumber.name[lng],
            dataIndex: 'invNumber',
            width: '5%',
            render: (obj, record) => this.renderColumns(obj, record, 'invNumber'),
          }, {
            key: 'invList',
            title: t('NAME'),
            dataIndex: 'invList',
            width: '15%',
            render: (obj, record) => this.renderColumns(obj, record, 'invList'),
          }, {
            key: 'invType',
            title: invType.name[lng],
            dataIndex: 'invType',
            width: '10%',
            render: (obj, record) => this.renderColumns(obj, record, 'invType'),
          }, {
            key: 'invDbeg',
            title: invDbeg.name[lng],
            dataIndex: 'invDbeg',
            width: '8%',
            render: (obj, record) => this.renderColumns(obj, record, 'invDbeg'),
          }, {
            key: 'invDend',
            title: invDend.name[lng],
            dataIndex: 'invDend',
            width: '8%',
            render: (obj, record) => this.renderColumns(obj, record, 'invDend'),
          }, {
            key: 'caseCount',
            title: t('CASE_COUNT'),
            dataIndex: 'caseCount',
            width: '8%',
            render: (obj, record) => this.renderColumns(obj, record, 'caseCount'),
          }, {
            key: 'invDate1',
            title: invDate1.name[lng],
            dataIndex: 'invDate1',
            width: '11%',
            render: (text, record) => this.renderColumns(text, record, 'invDate1'),
          }, {
            key: 'invDate2',
            title: invDate2.name[lng],
            dataIndex: 'invDate2',
            width: '11%',
            render: (text, record) => this.renderColumns(text, record, 'invDate2'),
          }, {
            key: 'invDate3',
            title: invDate3.name[lng],
            dataIndex: 'invDate3',
            width: '11%',
            render: (text, record) => this.renderColumns(text, record, 'invDate3'),
          }, {
            key: 'invDeadline',
            title: invDeadline.name[lng],
            dataIndex: 'invDeadline',
            width: '8%',
            render: (text, record) => this.renderColumns(text, record, 'invDeadline'),
          }, {
            key: 'action',
            title: '',
            dataIndex: '',
            width: '5%',
            render: (text, record) => {
              const { editable, invDate1, invDate2, invDate3 } = record;
              const disable = !invDate1 || !invDate2 || !invDate3;
              return (
                <div className="editable-row-operations">
                  {
                    editable ?
                      <span>
                      <a onClick={this.save(record.key, record.table)} disabled={disable}><Icon type="check"/></a>
                      <Popconfirm title="Отменить?" onConfirm={() => this.cancel(record.key, record.table)}>
                        <a style={{marginLeft: '5px'}} onClick={this.stopPropagation}><Icon type="close"/></a>
                      </Popconfirm>
                    </span>
                      : <span>
                      <a><Icon type="edit" style={{fontSize: '14px'}} onClick={this.edit(record.key, record.table)}/></a>
                      <Popconfirm title={this.props.t('CONFIRM_REMOVE')} onConfirm={() => this.remove(record.key, record.table)}>
                        <a style={{color: '#f14c34', marginLeft: '10px', fontSize: '14px'}} onClick={this.stopPropagation}><Icon type="delete" className="editable-cell-icon"/></a>
                      </Popconfirm>
                    </span>
                  }
                </div>
              );
            },
          }
        ]}
        dataSource={this.state.inv.data}
        size='small'
        title={this.renderInvTableHeader}
        pagination={false}
        scroll={{y: 350}}
        onRowClick={this.handleRowClick}
        style={{height: 'auto', minHeight: 'unset', marginLeft: '5px', marginBottom: '30px'}}
      />
      <Table
        bordered
        columns={[
          {
            key: 'fundNumber',
            title: fundNumber.name[lng],
            dataIndex: 'fundNumber',
            width: '10%',
            render: (text, record) => this.renderColumns(text, record, 'fundNumber'),
          }, {
            key: 'caseName',
            title: t('CASE_NAME'),
            dataIndex: 'caseName',
            width: '30%',
            render: (text, record) => this.renderColumns(text, record, 'caseName'),
          }, {
            key: 'caseDbeg',
            title: caseDbeg.name[lng],
            dataIndex: 'caseDbeg',
            width: '15%',
            render: (text, record) => this.renderColumns(text, record, 'caseDbeg'),
          }, {
            key: 'caseDend',
            title: caseDend.name[lng],
            dataIndex: 'caseDend',
            width: '15%',
            render: (text, record) => this.renderColumns(text, record, 'caseDend'),
          }, {
            key: 'caseNumberOfPages',
            title: caseNumberOfPages.name[lng],
            dataIndex: 'caseNumberOfPages',
            width: '10%',
            render: (text, record) => this.renderColumns(text, record, 'caseNumberOfPages'),
          }, {
            key: 'caseStructuralSubdivision',
            title: caseStructuralSubdivision.name[lng],
            dataIndex: 'caseStructuralSubdivision',
            width: '15%',
            render: (text, record) => this.renderColumns(text, record, 'caseStructuralSubdivision'),
          }, {
            key: 'action',
            title: '',
            dataIndex: '',
            width: '5%',
            render: (text, record) => {
              const { editable, caseStructuralSubdivision } = record;
              const disable = !caseStructuralSubdivision;
              return (
                <div className="editable-row-operations">
                  {
                    editable ?
                      <span>
                      <a onClick={this.save(record.key, record.table)} disabled={disable}><Icon type="check"/></a>
                      <Popconfirm title="Отменить?" onConfirm={() => this.cancel(record.key, record.table)}>
                        <a style={{marginLeft: '5px'}}><Icon type="close"/></a>
                      </Popconfirm>
                    </span>
                      : <span>
                      <a><Icon type="edit" style={{fontSize: '14px'}} onClick={this.edit(record.key, record.table)}/></a>
                      <Popconfirm title={this.props.t('CONFIRM_REMOVE')} onConfirm={() => this.remove(record.key, record.table)}>
                        <a style={{color: '#f14c34', marginLeft: '10px', fontSize: '14px'}}><Icon type="delete" className="editable-cell-icon"/></a>
                      </Popconfirm>
                    </span>
                  }
                </div>
              );
            },
          }
        ]}
        dataSource={this.state.case.data}
        size='small'
        title={this.renderCaseTableHeader}
        pagination={false}
        scroll={{y: 350}}
        style={{height: 'auto', minHeight: 'unset', marginLeft: '5px'}}
      />
    </div>
  }
}

export default LegalEntitiesInventories;