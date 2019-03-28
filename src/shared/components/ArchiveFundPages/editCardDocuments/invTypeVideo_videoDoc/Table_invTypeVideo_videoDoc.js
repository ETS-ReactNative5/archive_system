import React, { Component } from 'react';
import AntTable from "../../../AntTable";

class CardCase_invTypeVideo_videoDoc extends Component {

  render() {

    this.filteredData = [];
    const {lng, loading, changeSelectedRow, tofiConstants: {dateForming,
      accountingUnitType, accountingUnitQuantity, nomenLastChangeDate,
      accountingUnitNumber, timingOfVideoRecording } } = this.props;
    return (
      <div>
        <AntTable
          columns={
            [
              {
                key: 'accountingUnitNumber',
                title: accountingUnitNumber.name[lng],
                dataIndex: 'accountingUnitNumber',
                width: '20%'
              },
              {
                key: 'accountingUnitType',
                title: accountingUnitType.name[lng],
                dataIndex: 'accountingUnitType',
                width: '20%'
              },
              {
                key: 'accountingUnitQuantity',
                title: accountingUnitQuantity.name[lng],
                dataIndex: 'accountingUnitQuantity',
                width: '20%'
              },
              {
                key: 'timingOfVideoRecording',
                title: timingOfVideoRecording.name[lng],
                dataIndex: 'timingOfVideoRecording',
                width: '10%'
              },
              {
                key: 'dateForming',
                title: dateForming.name[lng],
                dataIndex: 'dateForming',
                width: '15%'
              },
              {
                key: 'nomenLastChangeDate',
                title: nomenLastChangeDate.name[lng],
                dataIndex: 'nomenLastChangeDate',
                width: '15%'
              }
            ]
          }
          openedBy="Cases"
          changeSelectedRow={ changeSelectedRow }
          loading={loading}
          dataSource={ this.filteredData }
        />
      </div>
    )
  }
}

export default CardCase_invTypeVideo_videoDoc;