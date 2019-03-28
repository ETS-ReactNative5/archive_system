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

class CaseNomenclature extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          key: 'asdas',
          nomenName: 'ads',
          nomenDate1: 'asdas',
          nomenDate2: 'asdas',
          nomenDate3: 'asdas',
          dbeg: '1',
          dend: '2',
        }
      ]
    };
  }

  renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.key, column)}
      />
    );
  }

  handleChange(value, key, column) {
    const newData = [...this.state.data];
    const target = newData.find(item => key === item.key);
    if (target) {
      target[column] = value;
      this.setState({ data: newData });
    }
  }
  edit(key) {
    const newData = [...this.state.data];
    const target = newData.find(item => key === item.key);
    if (target) {
      target.editable = true;
      this.setState({ data: newData });
    }
  }
  save(key) {
    const newData = [...this.state.data];
    const target = newData.find(item => key === item.key);
    if (target) {
      target.key = uuid();
      delete target.editable;
      this.setState({ data: newData });
    }
  }
  remove = key => {
    const newData = this.state.data.filter(item => item.key !== key);
    this.setState({data: newData});
  };
  cancel = key => {
    const newData = [...this.state.data];
    if(key.includes('newData')) {
      this.setState({ data: newData.filter(item => item.key !== key) });
      return;
    }
    const target = newData.find(item => key === item.key);
    if (target) {
      delete target.editable;
      this.setState({ data: newData });
    }
  };
  renderTableHeader = () => {
    return (
      <div className="flex">
        <Button
          style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '10px'}}
          type="primary"
          shape='circle'
          icon='plus'
          onClick={() =>
            this.setState({
              data: [
                ...this.state.data,
                {
                  key: `newData_${this.state.data.length}`,
                  editable: true,
                  nomenDate1: '',
                  nomenDate2: '',
                  nomenDate3: '',
                  dbeg: '',
                  dend: ''
                }]
            })}/>
        <Button type='primary' icon={'upload'}>{this.props.t('UPLOAD_FILE')}</Button>
      </div>
    )
  };
  render() {
    if(isEmpty(this.props.tofiConstants)) return null;
    const { t } = this.props;
    return <Table
      bordered
      columns={[
        {
          key: 'nomenName',
          title: t('NAME'),
          dataIndex: 'nomenName',
          width: '20%',
          render: (obj, record) => this.renderColumns(obj, record, 'nomenName'),
        },
        /*{
          key: 'nomenDate1',
          title: nomenDate1.name[lng],
          dataIndex: 'nomenDate1',
          width: '14%',
          render: (text, record) => this.renderColumns(text, record, 'nomenDate1'),
        },
        {
          key: 'nomenDate2',
          title: nomenDate2.name[lng],
          dataIndex: 'nomenDate2',
          width: '14%',
          render: (text, record) => this.renderColumns(text, record, 'nomenDate2'),
        },
        {
          key: 'nomenDate3',
          title: nomenDate3.name[lng],
          dataIndex: 'nomenDate3',
          width: '14%',
          render: (text, record) => this.renderColumns(text, record, 'nomenDate3'),
        }, */
        {
          key: 'dbeg',
          title: t('DBEG'),
          dataIndex: 'dbeg',
          width: '15%',
          render: (text, record) => this.renderColumns(text, record, 'dbeg'),
        }, {
          key: 'dend',
          title: t('DEND'),
          dataIndex: 'dend',
          width: '15%',
          render: (text, record) => this.renderColumns(text, record, 'dend'),
        }, {
          key: 'action',
          title: '',
          dataIndex: '',
          width: '8%',
          render: (text, record) => {
            const { editable, dbeg, dend, nomenName } = record;
            const disable = !nomenName || !dbeg || !dend;
            return (
              <div className="editable-row-operations">
                {
                  editable ?
                    <span>
                      <a onClick={() => this.save(record.key)} disabled={disable}><Icon type="check"/></a>
                      <Popconfirm title="Отменить?" onConfirm={() => this.cancel(record.key)}>
                        <a style={{marginLeft: '5px'}}><Icon type="close"/></a>
                      </Popconfirm>
                    </span>
                    : <span>
                      <a><Icon type="edit" style={{fontSize: '14px'}} onClick={() => this.edit(record.key)}/></a>
                      <Popconfirm title={this.props.t('CONFIRM_REMOVE')} onConfirm={() => this.remove(record.key)}>
                        <a style={{color: '#f14c34', marginLeft: '10px', fontSize: '14px'}}><Icon type="delete" className="editable-cell-icon"/></a>
                      </Popconfirm>
                    </span>
                }
              </div>
            );
          },
        }
      ]}
      dataSource={this.state.data}
      size='small'
      title={this.renderTableHeader}
      pagination={false}
      scroll={{y: 500}}
      style={{height: 'auto', minHeight: 'unset', marginLeft: '5px'}}
    />;
  }
}

export default CaseNomenclature;