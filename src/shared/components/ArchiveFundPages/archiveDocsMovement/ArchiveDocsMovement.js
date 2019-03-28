import React from 'react';
import {Button, DatePicker, Table} from 'antd';
import Select from '../../Select';

class ArchiveDocsMovement extends React.Component {

  state = {
    fund: null,
    inv: null,
    reports: null,
    cases: null
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
  onCaseChange = s => {this.setState({cases: s})};

  renderTableHeader = () => {
    const { fund, inv, reports, cases } = this.state;
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
        <p>{t('CASE')}</p>
        <Select
          name="cases"
          isSearchable={false}
          value={cases}
          onChange={this.onCaseChange}
          options={[
            { value: 'one', label: 'One' },
            { value: 'two', label: 'Two' },
          ]}
        />
      </div>
      <div className="label-select">
        <p>{t('OUTCOMMING_DATE')}</p>
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

  stopPropagation = e => {
    e.stopPropagation();
  };

  render() {
    const { t } = this.props;
    return (
      <div className="ArchiveDocsReceiving">
        <h2>Выдача и возврат архивных документов</h2>
        <Table
          columns={[
            {
              key: 'fundNumb',
              title: t('FUND_NUMB'),
              dataIndex: 'fundNumb',
              width: '8%'
            },
            {
              key: 'invNumb',
              title: t('INV_NUMB'),
              dataIndex: 'invNumb',
              width: '8%'
            },
            {
              key: 'caseNumb',
              title: t('CASE_NUMB'),
              dataIndex: 'caseNumb',
              width: '8%'
            },
            {
              key: 'caseTitle',
              title: t('CASE_TITLE'),
              dataIndex: 'caseTitle',
              width: '8%'
            },
            {
              key: 'plannedIssueDate',
              title: t('PLANNED_ISSUE_DATE'),
              dataIndex: 'plannedIssueDate',
              width: '8%'
            },
            {
              key: 'issueDate',
              title: t('ISSUE_DATE'),
              dataIndex: 'issueDate',
              width: '8%'
            },
            {
              key: 'issueGoal',
              title: t('ISSUE_GOAL'),
              dataIndex: 'issueGoal',
              width: '8%'
            },
            {
              key: 'issuedBy',
              title: t('ISSUED_BY'),
              dataIndex: 'issuedBy',
              width: '8%'
            },
            {
              key: 'issuedTo',
              title: t('ISSUED_TO'),
              dataIndex: 'issuedTo',
              width: '7%'
            },
            {
              key: 'returnDate',
              title: t('RETURN_DATE'),
              dataIndex: 'returnDate',
              width: '7%'
            },
            {
              key: 'status',
              title: t('STATUS'),
              dataIndex: 'status',
              width: '7%'
            },
            {
              key: 'note',
              title: t('NOTE'),
              dataIndex: 'note',
              width: '7%'
            },
            {
              key: 'action',
              title: '',
              dataIndex: '',
              width: '8%',
              render: (text, record) => {
                return (
                  <div className="editable-row-operations">
                      <span>
                        <Button icon="to-top" onClick={this.stopPropagation}/>
                        <Button icon="inbox" className='green-btn' onClick={this.stopPropagation}/>
                      </span>
                  </div>
                );
              },
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
          title={this.renderTableHeader}
        />
      </div>
    )
  }
}

export default ArchiveDocsMovement;