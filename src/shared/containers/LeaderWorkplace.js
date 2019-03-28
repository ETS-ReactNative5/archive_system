import React, { Component } from 'react';
import AntTabs from '../components/AntTabs';
import { translate } from 'react-i18next';
import Requests from '../components/LeaderWorkplacePages/Requests';
import Indicators from '../components/LeaderWorkplacePages/Indicators';

class LeaderWorkplace extends Component {

  constructor(props) {
    super(props);

    this.state = {

    }
  }

  render() {

    const { t } = this.props;

    return (
      <div id="LeaderWorkplace">
        <AntTabs
          tabs={[
            {
              tabName: t('REQUESTS'),
              tabKey: 'Tab 1',
              tabContent: <Requests t={ t }/>
            },
            {
              tabName: t('INDICATORS'),
              tabKey: 'Tab 2',
              tabContent: <Indicators />
            }
          ]}
          type="card"
          onChange={this.handleTabChange}
        />
      </div>
    )
  }
}

export default translate('leaderWorkplace')(LeaderWorkplace);
