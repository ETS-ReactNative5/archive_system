import React, { Component } from 'react';
import AntTable from "../../../AntTable";

class Table_invTypePerm_uprNTD extends Component {

  render() {

    this.filteredData = [];

    const {lng, loading, changeSelectedRow, tofiConstants: {
      fundNumber, caseDbeg, caseDend, pageNumberStart, turnoverSheetStart,
      pageNumberEnd, turnoverSheetEnd, documentPapers
    } } = this.props;
    return (
      <div className='EditCardCases__body'>
        <AntTable
          columns={
            [
              {
                key: 'fundNumber',
                title: fundNumber.name[lng],
                dataIndex: 'fundNumber',
                width: '10%'
              },
              {
                key: 'pageNumberStart',
                title: pageNumberStart.name[lng],
                dataIndex: 'pageNumberStart',
                width: '10%'
              },
              {
                key: 'turnoverSheetStart',
                title: turnoverSheetStart.name[lng],
                dataIndex: 'turnoverSheetStart',
                width: '10%'
              },
              {
                key: 'pageNumberEnd',
                title: pageNumberEnd.name[lng],
                dataIndex: 'pageNumberEnd',
                width: '10%'
              },
              {
                key: 'turnoverSheetEnd',
                title: turnoverSheetEnd.name[lng],
                dataIndex: 'turnoverSheetEnd',
                width: '10%'
              },
              {
                key: 'documentPapers',
                title: documentPapers.name[lng],
                dataIndex: 'documentPapers',
                width: '10%',
                render: obj => obj && obj.label
              },
              {
                key: 'caseDbeg',
                title: caseDbeg.name[lng],
                dataIndex: 'caseDbeg',
                width: '10%',
                render: obj => obj && obj.label
              },
              {
                key: 'caseDend',
                title: caseDend.name[lng],
                dataIndex: 'caseDend',
                width: '10%',
                render: obj => obj && obj.label
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

export default Table_invTypePerm_uprNTD;