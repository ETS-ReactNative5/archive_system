import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { translate } from 'react-i18next';
import ArchiveFund from '../../containers/ArchiveFund';
//import ArchiveFundWorks from './works/ArchiveFundWorks';
import ArchiveDocsMovement from './archiveDocsMovement/ArchiveDocsMovement';
import ArchiveChecking from './archiveChecking/ArchiveChecking';
import ArchiveFundWorksChecking from './works/ArchiveFundWorksChecking';
import ArchiveFundWorksCaseAccounting from './works/ArchiveFundWorksCaseAccounting';
import ArchiveFundWorksExpertize from './works/ArchiveFundWorksExpertize';
import ArchiveFundReports from './reports/ArchiveFundReports.js';

const ArchiveFundRoutes = ({t, tofiConstants}) => {
  return (
    <Switch>
      {/*<Route exact path="/archiveFund/works" render={props => <ArchiveFundWorks t={t} {...props}/>} />*/}
      <Route exact path="/archiveFund/works/checking/:fund" render={props => <ArchiveFundWorksChecking t={t} tofiConstants={tofiConstants} {...props}/>} />
      <Route exact path="/archiveFund/works/accounting/:fund" render={props => <ArchiveFundWorksCaseAccounting t={t} tofiConstants={tofiConstants} {...props}/>} />
      <Route exact path="/archiveFund/works/expertize/:fund" render={props => <ArchiveFundWorksExpertize t={t} tofiConstants={tofiConstants} {...props}/>} />
      {/*<Route exact path="/archiveFund/receiving" render={props => <ArchiveDocsReceiving t={t} {...props}/>} />*/}
      <Route exact path="/archiveFund/checking" render={props => <ArchiveChecking t={t} {...props} />} />
      {/*<Route exact path="/archiveFund/outcome" render={props => <ArchiveDocsOutcomming t={t} {...props}/>} />*/}
      <Route exact path="/archiveFund/movement" render={props => <ArchiveDocsMovement t={t} {...props}/>} />
      <Route path="/archiveFund" render={props => <ArchiveFund t={t} {...props}/>} />
      <Route exact path = "/archiveFund/reports" render = {props => <ArchiveFundReports t = {t} {...props} /> } />
    </Switch>
  )
};

export default translate('archiveFund')(ArchiveFundRoutes);