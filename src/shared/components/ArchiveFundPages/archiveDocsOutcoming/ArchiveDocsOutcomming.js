import React from 'react';
import {DatePicker, Table} from 'antd';
// import {getPropValByConst} from '../../../actions/actions';
import Select from '../../Select';

class ArchiveDocsOutcomming extends React.Component {

  state = {
    fund: null,
    inv: null,
    reports: null
  };

  /* getFundOptions = () => getPropValByConst('workType')
     .then(json=>({
       options: json.data.map(item => (
         {value: item.id, label: item.name[localStorage.getItem('i18nextLng')]})
       )
     }));*/

  onFundChange = s => {this.setState({fund: s})};
  onInvChange = s => {this.setState({inv: s})};
  onReportsChange = s => {this.setState({reports: s})};

  renderFirstTableData = () => {
    const { fund, inv, reports } = this.state;
    const { t } = this.props;
    return <div className="table-header">
      <div className="label-select">
        <p>{t('FUND')}</p>
        <Select
          name="fund"
          isSearchable={false}
          value={fund}
          onChange={this.onFundChange}
          options={[
            { value: 'one', label: 'One' },
            { value: 'two', label: 'Two' },
          ]}
        />
      </div>
      <div className="label-select">
        <p>{t('INVENTORY')}</p>
        {/*<SelectVirt
          name="inv"
          isSearchable
          className="long-selected-menu"
          async
          optionHeight={45}
          value={inv}
          onChange={this.onInvChange}
          loadOptions={this.getInvOptions}
        />*/}
        <Select
          name="inv"
          isSearchable={false}
          value={inv}
          onChange={this.onInvChange}
          options={[
            { value: 'one', label: 'One' },
            { value: 'two', label: 'Two' },
          ]}
        />
      </div>
      <div className="label-select">
        <p>{t('PLANNED_DATE')}</p>
        <DatePicker />
      </div>
      <div className="label-select">
        <p>{t('ACTUAL_DATE')}</p>
        <DatePicker />
      </div>
      <div className="label-select">
        <p>{t('REPORTS')}</p>
        <Select
          name="reports"
          isSearchable={false}
          value={reports}
          onChange={this.onReportsChange}
          options={[
            { value: 'one', label: 'One' },
            { value: 'two', label: 'Two' },
          ]}
        />
      </div>
    </div>
  };

  render() {
    const { t } = this.props;
    return (
      <div className="ArchiveDocsReceiving">
        <h2>Выбытие архивных документов</h2>
        <Table
          columns={[
            {
              key: 'fundNumb',
              title: t('FUND_NUMB'),
              dataIndex: 'fundNumb',
              width: '10%'
            },
            {
              key: 'invNumb',
              title: t('INV_NUMB'),
              dataIndex: 'invNumb',
              width: '10%'
            },
            {
              key: 'dbeg',
              title: t('DBEG'),
              dataIndex: 'dbeg',
              width: '15%'
            },
            {
              key: 'dend',
              title: t('DEND'),
              dataIndex: 'dend',
              width: '15%'
            },
            {
              key: 'casesQuantity',
              title: t('CASES_QUANTITY'),
              dataIndex: 'casesQuantity',
              width: '15%'
            },
            {
              key: 'plannedDate',
              title: t('PLANNED_DATE'),
              dataIndex: 'plannedDate',
              width: '15%'
            },
            {
              key: 'actualDate',
              title: t('ACTUAL_DATE'),
              dataIndex: 'actualDate',
              width: '20%'
            }
          ]}
          title={this.renderFirstTableData}
          bordered
          scroll={{y: 500, x: 1200}}
          size='small'
          pagination={false}
          dataSource={[
            {
              key: 'first',
              fundNumb: '12',
              invNumb: '1',
              dbeg: '2005',
              dend: '2006',
              casesQuantity: '156',
              plannedDate: '01.01.2018',
              actualDate: ''
            }
          ]}
        />
        <Table
          columns={[
            {
              key: 'caseNumb',
              title: t('CASE_NUMB'),
              dataIndex: 'caseNumb',
              width: '8%'
            },
            {
              key: 'caseName',
              title: t('CASE_NAME'),
              dataIndex: 'caseName',
              width: '8%'
            },
            {
              key: 'dbeg',
              title: t('DBEG'),
              dataIndex: 'dbeg',
              width: '8%'
            },
            {
              key: 'dend',
              title: t('DEND'),
              dataIndex: 'dend',
              width: '8%'
            },
            {
              key: 'pagesQuantity',
              title: t('PAGES_QUANTITY'),
              dataIndex: 'pagesQuantity',
              width: '8%'
            },
            {
              key: 'structuralSubdivision',
              title: t('STRUCTURAL_SUBDIVISION'),
              dataIndex: 'structuralSubdivision',
              width: '8%'
            },
            {
              key: 'inStock',
              title: t('IN_STOCK'),
              dataIndex: 'inStock',
              width: '8%'
            },
            {
              key: 'requiresDisinfection',
              title: t('REQUIRES_DISINFECTION'),
              dataIndex: 'requiresDisinfection',
              width: '8%'
            },
            {
              key: 'requiresDisinfestation',
              title: t('REQUIRES_DISINFESTATION'),
              dataIndex: 'requiresDisinfestation',
              width: '8%'
            },
            {
              key: 'requiresRestoration',
              title: t('REQUIRES_RESTORATION'),
              dataIndex: 'requiresRestoration',
              width: '8%'
            },
            {
              key: 'requiresBindingAndFiling',
              title: t('REQUIRES_BINDING_AND_FILING'),
              dataIndex: 'requiresBindingAndFiling',
              width: '8%'
            },
            {
              key: 'requiresRestorationOfFadingText',
              title: t('REQUIRES_RESTORATION_OF_FADING_TEXT'),
              dataIndex: 'requiresRestorationOfFadingText',
              width: '6%'
            },
            {
              key: 'damaged',
              title: t('DAMAGED'),
              dataIndex: 'damaged',
              width: '6%'
            }
          ]}
          bordered
          scroll={{y: 500, x: 1200}}
          size='small'
          pagination={false}
          dataSource={[
            {
              key: 'first',
              caseName: '12',
              requiresRestoration: '1',
              dbeg: '2005',
              dend: '2006',
              requiresBindingAndFiling: '156',
              requiresRestorationOfFadingText: '01.01.2018',
              damaged: ''
            }
          ]}
        />
      </div>
    )
  }
}

export default ArchiveDocsOutcomming;