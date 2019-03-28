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

class ReturnedDocsActs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          key: 'asdas',
          actReturnList: 'ads',
          numberActReturn: 'asdas',
          dateActReturn: 'asdas',
          numberOfReturnDocs: 'asdas'
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
                  numberActReturn: '',
                  dateActReturn: '',
                  numberOfReturnDocs: '',
                  dateEKActDel: ''
                }]
            })}/>
        <Button type='primary' icon={'upload'}>{this.props.t('ATTACH_FILE')}</Button>
      </div>
    )
  };
  render() {
    if(isEmpty(this.props.tofiConstants)) return null;
    const { t, tofiConstants: {numberActReturn, dateActReturn, numberOfReturnDocs} } = this.props;
    const lng = localStorage.getItem('i18nextLng');
    return <Table
      bordered
      columns={[
        {
          key: 'actReturnList',
          title: t('ACT_RETURN_LIST'),
          dataIndex: 'actReturnList',
          width: '30%',
          render: (obj, record) => this.renderColumns(obj, record, 'actReturnList'),
        }, {
          key: 'numberActReturn',
          title: numberActReturn.name[lng],
          dataIndex: 'numberActReturn',
          width: '20%',
          render: (text, record) => this.renderColumns(text, record, 'numberActReturn'),
        }, {
          key: 'dateActReturn',
          title: dateActReturn.name[lng],
          dataIndex: 'dateActReturn',
          width: '20%',
          render: (text, record) => this.renderColumns(text, record, 'dateActReturn'),
        }, {
          key: 'numberOfReturnDocs',
          title: numberOfReturnDocs.name[lng],
          dataIndex: 'numberOfReturnDocs',
          width: '20%',
          render: (text, record) => this.renderColumns(text, record, 'numberOfReturnDocs'),
        }, {
          key: 'action',
          title: '',
          dataIndex: '',
          width: '10%',
          render: (text, record) => {
            const { editable, numberActReturn, dateActReturn, numberOfReturnDocs, dateEKActDel, dend, actReturnList } = record;
            const disable = !actReturnList || !numberActReturn || !dateActReturn || !numberOfReturnDocs || !dateEKActDel || !dend;
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
      scroll={{x: 1200, y: 500}}
      style={{height: 'auto', minHeight: 'unset', marginLeft: '5px'}}
    />;
  }
}

export default ReturnedDocsActs;