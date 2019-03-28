import React from 'react';
import {Link, Route, Switch} from 'react-router-dom';
import { translate } from 'react-i18next';
import {Breadcrumb, DatePicker} from 'antd'
import moment from 'moment'

import FundsList from '../components/ArchiveFundPages/FundsList';
import ViewCardCases from '../components/ArchiveFundPages/ViewCardCasesPage';
import ViewCardDocuments from '../components/ArchiveFundPages/ViewCardDocumentsPage';
import EditCardInventories from "../components/ArchiveFundPages/EditCardInventories";
import EditCardCases from "../components/ArchiveFundPages/editCardCases_new";
import EditCardDocs from "../components/ArchiveFundPages/editCardDocuments";

class ArchiveFund extends React.Component {

  constructor(props) {
    super (props);

    this.state = {
      date: moment()
    }
  }

  onDateChange = (date) => {
    this.setState({ date })
  };

  render() {
    const { t, location } = this.props;

    this.lng = localStorage.getItem('i18nextLng');
    return (
      <div className="archiveFund">
        <div className="title">
          <h2>{t('ARCHIVE_FUND')} &#8614; {location && location.state && location.state.title}</h2>
          { location.pathname === '/archiveFund/fundsList' && <DatePicker onChange={this.onDateChange} value={this.state.date} style={{ marginBottom: '3px' }}/> }
        </div>
        {location && location.state && location.state.fund && <Breadcrumb>
          <Breadcrumb.Item>
            <Link
              to={{
                pathname: '/archiveFund/fundsList',
                state: { title: t('FUND') }
              }}
            >
              &#8602; {location.state.fund.name && location.state.fund.name[this.lng]}
            </Link>
          </Breadcrumb.Item>
          {location.state.inv && <Breadcrumb.Item>
            <Link
              to={{
                pathname: `/archiveFund/editFundCard/${location.state.fund.key}`,
                state: {
                  fund: {
                    key: location.state.fund.key,
                    name: location.state.fund.name
                  },
                  title: t('INVENTORY')
                }
              }}
            >
              &#8592; {location.state.inv.name[this.lng]}
            </Link>
          </Breadcrumb.Item>}
          {location.state.cases && <Breadcrumb.Item>
            <Link
              to={{
                pathname: `/archiveFund/editFundCard/${location.state.fund.key}/${location.state.inv.key}`,
                state: {...location.state, cases: null, title: t('CASES')}
              }}
            >
              &#8592; {location.state.cases.name[this.lng]}
            </Link>
          </Breadcrumb.Item>}
          {/*{location.state.case && <Breadcrumb.Item><Link to={`/archiveFund/fundsList/${location.state.fund.key}/${location.state.inv.key}`}>{location.state.inv.name}</Link></Breadcrumb.Item>}*/}
        </Breadcrumb>}
        <Switch>
          <Route exact path="/archiveFund/fundsList" render={props => <FundsList globalDate={this.state.date} t={t} {...props}/>} />
          <Route exact path="/archiveFund/editFundCard/:idFundCard" render={props => <EditCardInventories t={t} {...props}/>} />
          <Route exact path="/archiveFund/editFundCard/:idFundCard/:idInventCard" render={props =>
            <EditCardCases
              invType={location && location.state && location.state.inv && location.state.inv.invType}
              docType={location && location.state && location.state.inv && location.state.inv.docType}
              t={t}
              {...props}
            /> }
          />
          <Route exact path="/archiveFund/editFundCard/:idFundCard/:idInventCard/:idCaseCard" render={props =>
            <EditCardDocs
              invType={location && location.state && location.state.inv && location.state.inv.invType}
              docType={location && location.state && location.state.inv && location.state.inv.docType}
              t={t}
              {...props}
            /> }
          />
        </Switch>
      </div>
    );
  }
}

export default translate('archiveFund')(ArchiveFund);


