import React, { Component } from 'react';
import AntTable from "../../../AntTable";

class CardCase_invTypeDigital_uprDoc extends Component {

  render() {

    this.filteredData = [];

    const {lng, changeSelectedRow, loading,
      tofiConstants: { caseDbeg, caseDend, electronicDocumentsFormat, dateForming,
      nomenLastChangeDate, accountingUnitNumber} } = this.props;
    return (
      <div className='EditCardCases__body'>
        <AntTable
          columns={
            [
              {
                key: 'accountingUnitNumber',
                title: accountingUnitNumber.name[lng],
                dataIndex: 'accountingUnitNumber',
                width: '15%'
              },
              {
                key: 'caseDbeg',
                title: caseDbeg.name[lng],
                dataIndex: 'caseDbeg',
                width: '15%'
              },
              {
                key: 'caseDend',
                title: caseDend.name[lng],
                dataIndex: 'caseDend',
                width: '15%'
              },
              {
                key: 'electronicDocumentsFormat',
                title: electronicDocumentsFormat.name[lng],
                dataIndex: 'electronicDocumentsFormat',
                width: '15%'
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
          // footer={ this.renderTableFooter }
        />
      </div>
    )
  }
}

export default CardCase_invTypeDigital_uprDoc;