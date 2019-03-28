import React from 'react';
import {Table, Input, Popconfirm, Button, Icon} from 'antd';
import {four_digits} from '../../utils/form_normalizing';
import uuid from 'uuid';

const EditableCell = ({ editable, value, onChange }) => (
  <div>
    {editable
      ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
      : value
    }
  </div>
);

const EditableYearCell = ({ editable, value: {personLaborBeginYear, personLaborEndYear}, onChange }) => (
    editable
      ? <div style={{display: 'flex', alignItems: 'center'}}>
          <Input style={{ margin: '-5px 0' }} size='small' value={personLaborBeginYear} onChange={onChange} name="personLaborBeginYear" placeholder="yyyy"/>
          <span> - </span>
          <Input style={{ margin: '-5px 0' }} size='small' value={personLaborEndYear} onChange={onChange} name="personLaborEndYear" placeholder="yyyy"/>
      </div>
      : <span>{personLaborBeginYear} - {personLaborEndYear}</span>
);

/*const EditCell = ({ value, onChange, record: {editable, key} }) => (
  editable
    ?
    <div>
      <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
      <span>
        <a onClick={() => this.save(key)}><Icon type="check"/></a>
        <Popconfirm title="Отменить?" onConfirm={() => this.cancel(key)}>
          <a style={{marginLeft: '5px'}}><Icon type="close"/></a>
        </Popconfirm>
      </span>
    </div>
    :
    <div>
      <span>value</span>
      <span>
        <a><Icon type="edit" className="editable-cell-icon" onClick={() => this.edit(key)}/></a>
        <a style={{color: '#f14c34', marginLeft: '10px'}}><Icon type="delete" className="editable-cell-icon" onClick={() => this.edit(key)}/></a>
      </span>
    </div>
);*/

class LaborInfoTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          key: 'asdas',
          years: {
            personLaborBeginYear: '1111',
            personLaborEndYear: '2222'
          },
          personLaborPosition: 'asdas',
          personLaborOrg: 'asdas'
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
  renderColumnYears(obj, record, column) {
    return <EditableYearCell
      editable={record.editable}
      value={obj}
      onChange={e => this.handleChangeYears(e, record.key, column)}
    />
  }
  handleChange(value, key, column) {
    const newData = [...this.state.data];
    const target = newData.find(item => key === item.key);
    if (target) {
      target[column] = value;
      this.setState({ data: newData });
    }
  }
  handleChangeYears(e, key, column) {
    const newData = [...this.state.data];
    const target = newData.find(item => key === item.key);
    if (target) {
      target[column][e.target.name] = four_digits(e.target.value);
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
      target.key = uuid()
      delete target.editable;
      this.setState({ data: newData });
      this.cacheData = newData.map(item => ({ ...item }));
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
      Object.assign(target, this.cacheData.find(item => key === item.key));
      delete target.editable;
      this.setState({ data: newData });
    }
  };
  renderTableHeader = () => {
    return (
      <div className="flex">
        <Button
          style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
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
                  years: {
                    personLaborBeginYear: '',
                    personLaborEndYear: ''
                  },
                  personLaborPosition: '',
                  personLaborOrg: ''
                }]
            })}/>
      </div>
    )
  };
  render() {
    const { personLaborPosition, personLaborOrg } = this.props.tofiConstants;
    const lng = localStorage.getItem('i18nextLng');
    return <Table
      bordered
      columns={[
        {
          key: 'years',
          title: this.props.year && this.props.year[lng],
          dataIndex: 'years',
          width: '20%',
          render: (obj, record) => this.renderColumnYears(obj, record, 'years'),
        }, {
          key: 'personLaborPosition',
          title: personLaborPosition.name[lng],
          dataIndex: 'personLaborPosition',
          width: '35%',
          render: (text, record) => this.renderColumns(text, record, 'personLaborPosition'),
        }, {
          key: 'personLaborOrg',
          title: personLaborOrg.name[lng],
          dataIndex: 'personLaborOrg',
          widht: '35%',
          render: (text, record) => this.renderColumns(text, record, 'personLaborOrg'),
        }, {
          key: 'action',
          title: '',
          dataIndex: '',
          width: '10%',
          render: (text, record) => {
            const { editable, personLaborPosition, personLaborOrg, years: {personLaborBeginYear, personLaborEndYear} } = record;
            const disable = !personLaborPosition | !personLaborOrg | !personLaborBeginYear | !personLaborEndYear;
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

export default LaborInfoTable;