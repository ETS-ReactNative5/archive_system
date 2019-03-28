/**
 * Created by Mars on 19.11.2018.
 */
import React from 'react';
import { Table } from 'antd';

class Bibliography extends React.Component {

  render() {
    const { tofiConstants: { casesResearch, docsResearch } } = this.props;
    this.lng = localStorage.getItem('i18nextLng');

    return (
      <div className="double-table column">
        <Table
          size='small'
          pagination={false}
          scroll={{y: '100%'}}
          loading={false}
          dataSource={[]}
          columns={[
            {
              key: 'casesResearch',
              title: casesResearch.name[this.lng],
              dataIndex: 'casesResearch',
              width: '100%'
            }
          ]}
          />
        <Table
          size='small'
          pagination={false}
          scroll={{y: '100%'}}
          loading={false}
          dataSource={[]}
          columns={[
            {
              key: 'docsResearch',
              title: docsResearch.name[this.lng],
              dataIndex: 'docsResearch',
              width: '100%'
            }
          ]}
          />
      </div>
    )
  }
}

export default Bibliography;
