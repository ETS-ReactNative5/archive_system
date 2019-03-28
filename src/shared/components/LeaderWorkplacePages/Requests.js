import React, { Component } from 'react';
import { Checkbox, Button } from 'antd';
import AntTable from '../AntTable';

class Requests extends Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { t } = this.props;
    return (
      <div id="Requests">
        <div className="requests-heading">
          <Checkbox>За 30 дней</Checkbox>
          <Button>{t('APPROVE')}</Button>
          <Button>{t('REJECT')}</Button>
          <Button>{t('CANCEL')}</Button>
        </div>
        <div className="requests-body">
          <AntTable
            loading={true}
            columns={
              [
                {
                  key: 'researcher',
                  title: 'Исследователь',
                  dataIndex: 'researcher'
                },
                {
                  key: 'requestName',
                  title: 'Наименование требования',
                  dataIndex: 'requestName'
                },
                {
                  key: 'topic',
                  title: 'Тема',
                  dataIndex: 'topic'
                },
                {
                  key: 'requestData',
                  title: 'Дата требования',
                  dataIndex: 'requestData'
                },
                {
                  key: 'accessBeg',
                  title: 'Начало доступа',
                  dataIndex: 'accessStart'
                },
                {
                  key: 'accessEnd',
                  title: 'Окончание доступа',
                  dataIndex: 'accessStart'
                },
                {
                  key: 'status',
                  title: 'Статус',
                  dataIndex: 'status'
                },
                {
                  key: 'commentaries',
                  title: 'Коментарий',
                  dataIndex: 'commentaries'
                },
              ]
            }
          />
        </div>
      </div>
    );
  }
}

export default Requests;
