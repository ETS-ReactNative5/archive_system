import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import { translate } from 'react-i18next';
import Reports from './reports/index';
import Report2 from './reports/Report2';
import ArchivePassword from './archivePassword';

const AdminRoutes = ({t, tofiConstants}) => {
  return (
    <Switch>
      <Route exact path="/managing/archivePassport" render={props => <ArchivePassword t={t} {...props}/>} />
      <Route exact path="/managing/reports" render={props => <Reports t={t} {...props}/>} />
      <Route exact path="/managing/thisreport"  render={props => <Report2 t={t} {...props}/>}/>
    </Switch>
  )
};

export default translate('archiveFund   ')(AdminRoutes);