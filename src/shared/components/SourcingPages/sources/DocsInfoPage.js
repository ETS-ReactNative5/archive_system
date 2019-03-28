import React from 'react';
import AntTabs from '../../AntTabs';
import Passport1 from './Passport1';
import Passport2 from './Passport2';
import Passport3 from './Passport3';

class DocsInfoPage extends React.Component {

  render() {
    const { t, tofiConstants, orgSourceCubeSingle } = this.props;
    return (
      <AntTabs
        tabs={[
          {
            tabKey: 'passport_1',
            tabName: t('PASSPORT_1'),
            tabContent: <Passport1 t={t} tofiConstants={tofiConstants} orgSourceCubeSingle={orgSourceCubeSingle}/>
          },
          {
            tabKey: 'passport_2',
            tabName: t('PASSPORT_2'),
            tabContent: <Passport2 t={t} tofiConstants={tofiConstants} />
          },
          {
            tabKey: 'passport_3',
            tabName: t('PASSPORT_3'),
            tabContent: <Passport3 t={t} tofiConstants={tofiConstants} />
          }
        ]}
      />
    );
  }
}

export default DocsInfoPage;