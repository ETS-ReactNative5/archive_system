import React, { Component } from 'react';
import AntTable from "../../../AntTable";

class CardCase_invTypePhoto_photoDoc extends Component {

  render() {

    this.filteredData = [];

    const {lng, loading, changeSelectedRow, tofiConstants: {
      accountingUnitType, accountingUnitQuantity, dateForming, nomenLastChangeDate, accountingUnitNumber
    } } = this.props;
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
                key: 'dateForming',
                title: dateForming.name[lng],
                dataIndex: 'dateForming',
                width: '20%'
              },
              {
                key: 'nomenLastChangeDate',
                title: nomenLastChangeDate.name[lng],
                dataIndex: 'nomenLastChangeDate',
                width: '20%'
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

export default CardCase_invTypePhoto_photoDoc;