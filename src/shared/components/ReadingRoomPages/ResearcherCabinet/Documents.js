import React from 'react';
import {Button, InputNumber, Table} from 'antd';
import moment from "moment";
import {SYSTEM_LANG_ARRAY} from "../../../constants/constants";
import {parseForTable} from "../../../utils/cubeParser";
import { ArchiveFund } from '../../../utils/axios_config'

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
  rowSelectionChildWorks = (childWorks) => {
    const self = this;
    const selectedDocs = childWorks.reduce((acc, w) => acc.concat(w.docsResearch.map(obj => obj.value)), []);
    return {
      onSelect: (rec, selected) => {
        if(selectedDocs.includes(rec.key)) return;
        selected && self.setState(state => ({ selectedRowKeys: [...state.selectedRowKeys, rec.key] }) );
        !selected && self.setState(state => ({ selectedRowKeys: state.selectedRowKeys.filter(k => k !== rec.key) }));
      },
      selectedRowKeys: selectedDocs.map(String).concat(self.state.selectedRowKeys)
    }
  };

  renderTableHeader = () => {
    return (
      <div>
        <Button
          type='primary'
          disabled={!this.state.selectedRowKeys.length}
          onClick={async () => {
            const res = await ArchiveFund.getInvAndFundByCases(this.props.initialValues.workRegCase.value);
            const { idDelo, idFund, idInv } = res.data[0];
            const name = {};
            SYSTEM_LANG_ARRAY.forEach(lang => {
              name[lang] = 'orderCopyDoc_' + this.state.selectedRowKeys
                .slice()
                .splice(0,3)
                .join('_')
            });
            const obj = {
              name: name,
              fullName: name,
              clsConst: 'orderCopyDoc',
              parent: this.props.initialValues.key.split('_')[1]
            };
            this.props.onCreateObj(
              {obj},
              {
                values: {
                  workDate: moment().format('YYYY-MM-DD'),
                  dateAppointment: moment().format('YYYY-MM-DD'),
                  workAuthor: String(this.props.user.obj),
                  workStatusCopyDoc: String(this.props.tofiConstants.created.id),
                  workRegCase: String(idDelo),
                  workRegInv: String(idInv),
                  workRegFund: String(idFund),
                  docsResearch: this.state.selectedRowKeys.join(',')
                },
              })
          }}
        >
          {this.props.t('ORDER')}
        </Button>
      </div>
    )
  };

  componentDidUpdate(prevProps) {
    if(prevProps.docs !== this.props.docs) {
      this.populate();
    }
  }

  populate = () => {
    const { docs, initialValues: {workType} } = this.props;
    const data = workType && workType.workTypeClass !== 'orderCopyDoc'
      ? docs.map(this.renderTableData)
      : docs;
    this.setState({data})
  };

  renderTableData = item => {
    const constArr = ['fundNumber','pageNumberStart',
      'pageNumberEnd','archiveCipher','documentDate'];
    const result = {
      key: item.id.split('_')[1]
    };
    parseForTable(item.props, this.props.tofiConstants, result, constArr);
    return result;
  };

  render() {
    const { data } = this.state;
    const { t, loadingDocs, initialValues: {workType},
      tofiConstants: {fundNumber, archiveCipher, documentDate}, childWorks } = this.props;
    this.lng = localStorage.getItem('i18nextLng');
    return <Table
      loading={loadingDocs}
      size='small'
      pagination={false}
      dataSource={data}
      bordered
      scroll={{ y: '100%' }}
      rowSelection={workType && workType.workTypeClass !== 'orderCopyDoc'
        ? childWorks.length
          ? this.rowSelectionChildWorks(childWorks)
          : this.rowSelection()
        : null }
      title={workType && workType.workTypeClass !== 'orderCopyDoc'
        ? this.renderTableHeader
        : null}
      columns={[
        {
          key: 'fundNumber',
          title: fundNumber.name[this.lng],
          dataIndex: 'fundNumber',
          width: '10%',
          render: obj => obj && obj[this.lng]
        },
        {
          key: 'archiveCipher',
          title: archiveCipher.name[this.lng] + '/' + documentDate.name[this.lng],
          dataIndex: 'archiveCipher',
          width: '40%',
          render: (obj, rec) => obj + ' ' +(rec.documentDate ? rec.documentDate.format('DD-MM-YYYY') : '')
        },
        {
          key: 'pageNumberStart',
          title: t('PAGE_START'),
          dataIndex: 'pageNumberStart',
          width: '20%'
        },
        {
          key: 'pageNumberEnd',
          title: t('PAGE_END'),
          dataIndex: 'pageNumberEnd',
          width: '20%'
        },
        /*{
          key: 'from',
          title: t('ORDER_PAGE_START'),
          dataIndex: 'from',
          width: '10%',
          render: (obj, rec) => (
            <InputNumber
              style={{ width: '100%' }}
              min={Number(rec.pageNumberStart)}
              max={Number(rec.pageNumberEnd)}
              defaultValue={Number(rec.pageNumberStart)}
              disabled={!selectedRowKeys.includes(rec.key) || !rec.pageNumberStart || !rec.pageNumberEnd}
            />
          )
        },
        {
          key: 'to',
          title: t('ORDER_PAGE_END'),
          dataIndex: 'to',
          width: '10%',
          render: (obj, rec) => (
            <InputNumber
              style={{ width: '100%' }}
              min={Number(rec.pageNumberStart)}
              max={Number(rec.pageNumberEnd)}
              defaultValue={Number(rec.pageNumberEnd)}
              disabled={!selectedRowKeys.includes(rec.key) || !rec.pageNumberStart || !rec.pageNumberEnd}
            />
          )
        }*/
      ]}
    />
  }
}

export default Documents;