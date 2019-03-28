import React from 'react';

import AntTable from '../../AntTable';
import {CUBE_FOR_AF_INV, DO_FOR_INV} from "../../../constants/tofiConstants";
import {message} from "antd/lib/index";
import {dObj} from "../../../actions/actions";
import {Button, Popconfirm} from "antd";

class Table_invTypePhonoGram_phonoDoc extends React.Component {

  render() {

    const { t, lng, tofiConstants: {fundNumber, fundIndex, caseDbeg, caseDend, caseNotes, caseStructuralSubdivision, dateForming,
      accountingUnitType, accountingUnitQuantity, soundingSpeed, nomenLastChangeDate, accountingUnitNumber, playingTime }
    } = this.props;
    return (
      <div className='double-table'>
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
                key: 'fundIndex',
                title: fundIndex.name[lng],
                dataIndex: 'fundIndex',
                width: '10%'
              },
              {
                key: 'name',
                title: t('CASE_NAME'),
                dataIndex: 'name',
                width: '25%',
                /*filterDropdown: (
                  <div className="custom-filter-dropdown">
                    <Input
                      name="name"
                      suffix={filter.name ? <Icon type="close-circle" data-name="name" onClick={this.emitEmpty} /> : null}
                      ref={ele => this.name = ele}
                      placeholder="Поиск"
                      value={filter.name}
                      onChange={this.onInputChange}
                    />
                  </div>
                ),
                filterIcon: <Icon type="filter" style={{ color: filter.name ? '#ff9800' : '#aaa' }} />,
                onFilterDropdownVisibleChange: (visible) => {
                  this.setState({
                    filterDropdownVisible: visible,
                  }, () => this.name.focus());
                },
                render: obj => obj && obj[this.lng]*/
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
              },
              {
                key: 'caseStructuralSubdivision',
                title: caseStructuralSubdivision.name[lng],
                dataIndex: 'caseStructuralSubdivision',
                width: '15%',
              },
              {
                key: 'caseNotes',
                title: caseNotes.name[lng],
                dataIndex: 'caseNotes',
                width: '20%',
                render: obj => obj && obj.label
              }
            ]
          }
          openedBy="Cases"
          changeSelectedRow={ this.changeSelectedRow }
          // loading={loading}
          dataSource={ this.filteredData }
          footer={ this.renderTableFooter }
        />
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
          changeSelectedRow={ this.changeSelectedRow }
          // loading={loading}
          dataSource={ this.filteredData }
          footer={ this.renderTableFooter }
        />
      </div>
    )
  }
}

export default Table_invTypePhonoGram_phonoDoc;