import React from 'react';
import AntTable from '../AntTable';

class Schedule extends React.PureComponent {

  renderTableHeader = () => {
    return (
      <div className="table-header">
        title
      </div>
    )
  };

  render() {
    return (
      <div className="Schedule">
        <AntTable
          loading={false}
          columns={[
            {
              key: 'numb',
              title: '№',
              dataIndex: 'numb',
              width: '5%'
            },
            {
              key: 'sourcing',
              title: 'Sourcing',
              dataIndex: 'sourcing',
              width: '15%'
            },
            {
              key: 'invNumb',
              title: 'invNumb',
              dataIndex: 'invNumb',
              width: '10%'
            },
            {
              key: 'dbeg',
              title: 'dbeg',
              dataIndex: 'dbeg',
              width: '10%'
            },
            {
              key: 'dend',
              title: 'dend',
              dataIndex: 'dend',
              width: '10%'
            },
            {
              key: 'caseQuantity',
              title: 'caseQuantity',
              dataIndex: 'caseQuantity',
              width: '10%'
            },
            {
              key: '1-quarter',
              title: '1-quarter',
              dataIndex: '1-quarter',
              width: '10%'
            },
            {
              key: '2-quarter',
              title: '2-quarter',
              dataIndex: '2-quarter',
              width: '10%'
            },
            {
              key: '3-quarter',
              title: '3-quarter',
              dataIndex: '3-quarter',
              width: '10%'
            },
            {
              key: '4-quarter',
              title: '4-quarter',
              dataIndex: '4-quarter',
              width: '10%'
            }
          ]}
          dataSource={[]}
          title={this.renderTableHeader}
        />
      </div>
    )
  }
}

export default Schedule;