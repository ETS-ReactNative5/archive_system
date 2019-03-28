import React, { Component } from 'react';

import AntTabs from '../AntTabs';
import ResearchersActive from './ResearchersActive';
import ResearchersTemporary from './ResearchersTemporary';

class Researchers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loading: true,
      errors: {},
      modal: {
        visible: false,
        type: ''
      }
    }
  }

  handleTabChange = () => {
   // console.log('tab changed');
  };

  render() {
    const { t } = this.props;
    return (
      <div className="researchers">
        <div className="researchers__heading">
          heading
        </div>
        <div className="researchers__body">
          <AntTabs
            tabs={[
              {
                tabName: t('ALL_RESEARCHERS'),
                tabKey: 'AllResearches',
                tabContent: <ResearchersActive t={ t }/>
              },
              {
                tabName: t('TEMPORARY'),
                tabKey: 'Temporary',
                tabContent: <ResearchersTemporary t={ t }/>
              }
            ]}
            type="line"
            onChange={this.handleTabChange}
          />
        </div>
      </div>
    )
  }
}

export default Researchers;
