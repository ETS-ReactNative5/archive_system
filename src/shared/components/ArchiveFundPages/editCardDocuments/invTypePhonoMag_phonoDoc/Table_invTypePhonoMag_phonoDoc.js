import React, { Component } from 'react';
import AntTabs from "../../../AntTabs";
import MainInfoCaseForm from "./MainInfoCaseForm";
import AntTable from "../../../AntTable";

class CardCase_invTypePhonoMag_phonoDoc extends Component {

  render() {

    this.filteredData = [];

    const {lng, loading, changeSelectedRow, tofiConstants: {dateForming, accountingUnitType, accountingUnitQuantity,
      soundingSpeed, nomenLastChangeDate, accountingUnitNumber, playingTime } } = this.props;
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
                key: 'soundingSpeed',
                title: soundingSpeed.name[lng],
                dataIndex: 'soundingSpeed',
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
        />
      </div>
    )
  }
}

export default CardCase_invTypePhonoMag_phonoDoc;