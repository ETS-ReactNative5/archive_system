import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';

import AntTabs from '../AntTabs';

import EditResearchersTheResearcherTopics from './EditResearchersTheResearcherTopics';
import EditResearchersMain from './EditResearchersMain';

class EditResearcherPage extends Component {

  handleTabChange = (key) => {
    console.log(key);
  };

  render() {
    const { t, match } = this.props;
    return (
      <div className="editResearcherPage">
        <h2>{t('RESEARCHER') + ': '} <Link to="/readingRoomAdmin">{ match.params.idResearcher }</Link></h2>
        <AntTabs
          tabs={[
            {
              tabName: t('MAIN'),
              tabKey: 'main',
              tabContent: <EditResearchersMain t={ t }/>
            },
            {
              tabName: t('USERS_TOPICS'),
              tabKey: 'usersTopics',
              tabContent: <EditResearchersTheResearcherTopics t={ t }/>
            }
          ]}
          type="line"
          onChange={this.handleTabChange}
        />
      </div>
    )
  }
}

export default translate('readingRoomAdmin')(EditResearcherPage);
