import React from 'react';
import AntTabs from '../../AntTabs';
import TransInventories from './TransInventories';
import DiscardingCasesActs from './DiscardingCasesActs';
import ReturnedDocsActs from './ReturnedDocsActs';
import DocsTransferringActs from './DocsTransferringActs';

class Acts extends React.PureComponent {

  render() {
    const { t, tofiConstants } = this.props;
    return (
      <div className="Acts">
        <AntTabs tabs={[
          {
            tabKey: 'transInventories',
            tabName: t('TRANS_INVENTORIES'),
            tabContent: <TransInventories t={t} tofiConstants={tofiConstants}/>
          },
          {
            tabKey: 'discardingCasesActs',
            tabName: t('DISCARDING_CASES_ACTS'),
            tabContent: <DiscardingCasesActs t={t} tofiConstants={tofiConstants}/>
          },
          {
            tabKey: 'returnedDocsActs',
            tabName: t('RETURNED_DOCS_ACTS'),
            tabContent: <ReturnedDocsActs t={t} tofiConstants={tofiConstants} />
          },
          {
            tabKey: 'docsTransferringActs',
            tabName: t('DOCS_TRANSFERRING_ACTS'),
            tabContent: <DocsTransferringActs t={t} tofiConstants={tofiConstants}/>
          }
        ]}/>
      </div>
    )
  }
}

export default Acts;