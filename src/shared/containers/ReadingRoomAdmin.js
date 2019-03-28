import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { translate } from 'react-i18next';

import AntTabs from '../components/AntTabs';
import Researchers from '../components/ReadingRoomAdminPages/Researchers';
import Requests from '../components/ReadingRoomAdminPages/Requests';
import Reports from '../components/ReadingRoomAdminPages/Reports';
import EditResearcherPage from '../components/ReadingRoomAdminPages/EditResearcherPage';

class ReadingRoomAdmin extends React.Component {

  constructor(props) {
    super (props);

    this.state = {}
  }

  handleTabChange = key => {
    console.log(key);
  };

  handleTabClick = key => {
    if(key === 'fundList') {
      this.props.history.push('/readingRoomAdmin');
    }
  };

  render() {

    const { t } = this.props;

    return (
      <div className="readingRoomAdmin">
        <div className="readingRoomAdmin__heading flex">
          <h1>{t('READING_ROOM_ADMIN')}</h1>
        </div>
        <AntTabs
          tabs={[
            {
              tabName: t('RESEARCHERS'),
              tabKey: 'researchers',
              tabContent: (
                <Switch>
                  <Route exact path="/readingRoomAdmin" component={() => <Researchers t={t}/>}/>
                  <Route exact path="/readingRoomAdmin/editResearcher/:idResearcher" component={ EditResearcherPage } />
                </Switch>
              )
            },
            {
              tabName: t('RESEARCHERS_REQUESTS'),
              tabKey: 'requests',
              tabContent: <Requests t={ t } />
            },
            {
              tabName: t('REPORTS'),
              tabKey: 'reports',
              tabContent: <Reports t={ t } />
            }
          ]}
          type="card"
          onChange={this.handleTabChange}
          onTabClick={ this.handleTabClick }
        />
      </div>
    );
  }
}

export default translate('readingRoomAdmin')(ReadingRoomAdmin);


