import React, { Component } from 'react';
import {Button, DatePicker } from 'antd';
import AntTable from '../AntTable';

class Reports extends Component {

  constructor(props) {
    super(props);

    this.state = {
      startValue: null,
      endValue: null
    }
  }

  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };

  onStartChange = (value) => {
    this.onChange('startValue', value);
  };

  onEndChange = (value) => {
    this.onChange('endValue', value);
  };

  renderTableHeader = props => {
    const { t } = this.props;
    const { startValue, endValue } = this.state;
    return (
      <div className="Reports__heading">
        <DatePicker
          disabledDate={this.disabledStartDate}
          format="YYYY-MM-DD"
          value={startValue}
          placeholder="Start"
          onChange={this.onStartChange}
        />
        --
        <DatePicker
          disabledDate={this.disabledEndDate}
          format="YYYY-MM-DD"
          value={endValue}
          placeholder="End"
          onChange={this.onEndChange}
        />
        <Button>{ t('UPDATE') }</Button>
      </div>
    )
  };

  render() {
    const { t } = this.props;
    return (
      <div className="Reports">
        <div className="Reports__body">
          <AntTable
            loading={false}
            defaultExpandAllRows
            columns={[
              {
                key: 'visitsQuantity',
                title: t('VISITS_QUANTITY'),
                dataIndex: 'visitsQuantity'
              },
              {
                key: 'quantity',
                title: 'countable',
                dataIndex: 'quantity'
              }
            ]}
            dataSource={[
              {
                key: 'employee',
                visitsQuantity: 'сотрудники',
                quantity: '2',
                children: [
                  {
                    key: 'local',
                    visitsQuantity: 'через локальную сеть',
                    quantity: '1'
                  },
                  {
                    key: 'internet',
                    visitsQuantity: 'через интернет',
                    quantity: '1'
                  }
                ]
              }
            ]}
            title = { this.renderTableHeader }
          />
        </div>
        <div className="Reports__chart">
          <div className="Reports__chart__heading">
            <h3>{ t('READING_ROOM_VISITS_SCHEDULE') }</h3>
          </div>
          <div className="Reports__chart__body">
            <p>{ t('VISITS_QUANTITY') }</p>
            chart
          </div>
        </div>
      </div>
    )
  }
}

export default Reports;
