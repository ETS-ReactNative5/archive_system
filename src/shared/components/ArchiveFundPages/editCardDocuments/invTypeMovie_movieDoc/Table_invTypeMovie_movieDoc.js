import React, { Component } from 'react';
import AntTable from "../../../AntTable";

class CardCase_invTypeMovie_movieDoc extends Component {

  render() {

    this.filteredData = [];

    const {lng, changeSelectedRow, loading, tofiConstants: {dateForming, accountingUnitType,
      accountingUnitQuantity, nomenLastChangeDate, accountingUnitNumber,
      timingOfVideoRecording, playingTime } } = this.props;
    return (
      <div className='EditCardCases__body'>
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
                key: 'playingTime',
                title: playingTime.name[lng],
                dataIndex: 'playingTime',
                width: '10%'
              },
              {
                key: 'dateForming',
                title: dateForming.name[lng],
                dataIndex: 'dateForming',
                width: '10%'
              },
              {
                key: 'nomenLastChangeDate',
                title: nomenLastChangeDate.name[lng],
                dataIndex: 'nomenLastChangeDate',
                width: '10%'
              }
            ]
          }
          openedBy="Cases"
          changeSelectedRow={ changeSelectedRow }
          loading={loading}
          dataSource={ this.filteredData }
          // footer={ this.renderTableFooter }
        />
      </div>
    )
  }
}

export default CardCase_invTypeMovie_movieDoc;