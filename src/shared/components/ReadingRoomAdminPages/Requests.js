import React from 'react';
import AntTable from '../AntTable';
import { Button, Input } from 'antd';

const Requests = props => {
  const { t } = props;

  const renderRequestsTableHeading = () => {
    return (
      <div className="Requests__table-heading">
        <div className="Requests__table-heading__buttons">
          <Button>{ t('UPDATE') }</Button>
        </div>
        <Input.Search />
      </div>
    )
  };

  const renderContentTableHeading = () => {
    return (
      <div className="Requests__C_table-heading">
        <div className="Requests__C_table-heading__buttons">
          <Button>{ t('APPROVE') }</Button>
          <Button>{ t('REJECT') }</Button>
          <Button>{ t('CANCEL') }</Button>
          <Button>{ t('COMMENTARY') }</Button>
        </div>
        <div className="Requests__C_table-heading__access-btns">
          <Button>{ t('UNLOAD_REQUESTS') }</Button>
          <Button>{ t('VIEW_CONTENT') }</Button>
        </div>
      </div>
    )
  };

  return (
    <div className="Requests">
      <AntTable
        loading={false}
        columns={[
          {
            key: 'name',
            title: t('NAME'),
            dataIndex: 'name'
          },
          {
            key: 'users',
            title: t('USERS'),
            dataIndex: 'users'
          },
          {
            key: 'requestDate',
            title: t('REQUEST_DATE'),
            dataIndex: 'requestDate'
          },
          {
            key: 'requestTopic',
            title: t('REQUEST_TOPIC'),
            dataIndex: 'requestTopic'
          }
        ]}
        title={renderRequestsTableHeading}
      />
      <div className="Requests__content">
        <h4 className="Requests__content__heading">{ t('REQUEST_CONTENT') }</h4>
        <AntTable
          loading={false}
          columns={[
            {
              key: 'fund',
              title: t('FUND'),
              dataIndex: 'fund'
            },
            {
              key: 'inventory',
              title: t('INVENTORY'),
              dataIndex: 'inventory'
            },
            {
              key: 'caseNumb',
              title: t('CASE_NUMB'),
              dataIndex: 'caseNumb'
            },
            {
              key: 'caseTitle',
              title: t('CASE_TITLE'),
              dataIndex: 'caseTitle'
            },
            {
              key: 'status',
              title: t('STATUS'),
              dataIndex: 'status'
            },
            {
              key: 'eDoc',
              title: t('E_DOC'),
              dataIndex: 'eDoc'
            },
            {
              key: 'accessDBEG',
              title: t('ACCESS_DBEG'),
              dataIndex: 'accessDBEG'
            },
            {
              key: 'accessDEND',
              title: t('ACCESS_DEND'),
              dataIndex: 'accessDEND'
            },
            {
              key: 'commentaries',
              title: t('COMMENTARIES'),
              dataIndex: 'commentaries'
            }
          ]}
          title={renderContentTableHeading}
        />
      </div>
    </div>
  )
};

export default Requests;
