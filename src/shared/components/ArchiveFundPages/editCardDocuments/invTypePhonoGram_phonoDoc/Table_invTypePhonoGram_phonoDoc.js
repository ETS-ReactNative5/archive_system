import React, { Component } from 'react';
import AntTable from "../../../AntTable";

class CardCase_invTypePhonoGram_phonoDoc extends Component {

  render() {

    const {lng, loading, changeSelectedRow, tofiConstants: {dateForming, accountingUnitType,
      accountingUnitQuantity, nomenLastChangeDate, accountingUnitNumber, playingTime } } = this.props;
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
                key: 'playingTime',
                title: playingTime.name[lng],
                dataIndex: 'playingTime',
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

export default CardCase_invTypePhonoGram_phonoDoc;