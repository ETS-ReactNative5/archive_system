import React from 'react';
import {Icon, Input, Table} from 'antd';

class EditableCell extends React.Component {
  state = {
    value: this.props.value,
    editable: false,
  }
  handleChange = (e) => {
    const value = e.target.value;
    this.setState({ value });
  }
  check = () => {
    this.setState({ editable: false });
    if (this.props.onChange) {
      console.log(this.state.value);
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

class Passport3 extends React.Component {

  state = {
    data: [],
    initialValues: {}
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
      dataIndex: 'indicators',
      width: '25%'
    },
  ];

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
          title={this.renderTableHeader(this.props.t('PASSPORT_4'))}
          pagination={false}
        />
      </div>
    )
  }
}

export default Passport3;