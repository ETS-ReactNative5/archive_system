import React from 'react';
import AntTabs from '../AntTabs';
import MainInfoFundMaker from './MainInfoFundMaker';
import ManagingFormFundMaker from './ManagingFormFundMaker';

class SiderCard_FundMaker extends React.PureComponent {

  render() {
    const { t, tofiConstants, initialValues } = this.props;

    return (
      <div className="card">
        {this.props.closer}
        <AntTabs tabs={[
          {
            tabKey: 'props',
            tabName: t('MAIN_INFO'),
            tabContent: <MainInfoFundMaker tofiConstants={tofiConstants} t={t} initialValues={{...initialValues }}/>
          },
          {
            tabKey: 'Description',
            tabName: t('MANAGING'),
            tabContent: <ManagingFormFundMaker tofiConstants={tofiConstants} t={t}/>
          }
        ]}/>
      </div>
    )
  }
}

export default SiderCard_FundMaker;
