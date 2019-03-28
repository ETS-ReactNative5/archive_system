/**
 * Created by Mars on 19.11.2018.
 */
import React from 'react';
import {Button, Table} from 'antd';
import moment from "moment";
import {SYSTEM_LANG_ARRAY} from "../../../constants/constants";
import {parseForTable} from "../../../utils/cubeParser";

class Documents extends React.Component {

  state = {
    data: [],
    selectedRowKeys: []
  };

  rowSelection = () => {
    const self = this;
    return {
      onSelect: (rec, selected) => {
        selected && self.setState(state => ({ selectedRowKeys: [...state.selectedRowKeys, rec.key] }) )
        !selected && self.setState(state => ({ selectedRowKeys: state.selectedRowKeys.filter(k => k !== rec.key) }))
      },
      selectedRowKeys: self.state.selectedRowKeys
    }
  };

  componentDidUpdate(prevProps) {
    if(prevProps.docs !== this.props.docs) {
      this.populate();
    }
  }

  populate = () => {
    const data = this.props.docs.map(this.renderTableData);
    this.setState({data})
  };

  renderTableData = item => {
    const constArr = ['fundNumber','pageNumberStart','turnoverSheetStart','pageNumberEnd','turnoverSheetEnd'];
    const result = {
      key: item.id,
      name: item.name
    };
    parseForTable(item.props, this.props.tofiConstants, result, constArr);
    return result;
  };

  render() {
    const { docs, t, loadingDocs, initialValues: {workType},
      tofiConstants: {fundNumber, pageNumberStart, pageNumberEnd} } = this.props;
    this.lng = localStorage.getItem('i18nextLng');
    return <Table
      loading={loadingDocs}
      size='small'
      pagination={false}
      dataSource={this.state.data}
      bordered
      scroll={{ y: '100%' }}
      rowSelection={workType && workType.workTypeClass !== 'orderCopyDoc' ?
        this.rowSelection() : docs && {selectedRowKeys: docs.map(o => o.key)}}
      columns={[
        {
          key: 'fundNumber',
          title: fundNumber.name[this.lng],
          dataIndex: 'fundNumber',
          width: '15%',
          render: obj => obj && obj[this.lng]
        },
        {
          key: 'name',
          title: t('NAME'),
          dataIndex: 'name',
          width: '55%',
          render: obj => obj && obj[this.lng]
        },
        {
          key: 'pageNumberStart',
          title: t('PAGE_START'),
          dataIndex: 'pageNumberStart',
          width: '15%'
        },
        {
          key: 'pageNumberEnd',
          title: t('PAGE_END'),
          dataIndex: 'pageNumberEnd',
          width: '15%'
        }
      ]}
      />
  }
}

export default Documents;
