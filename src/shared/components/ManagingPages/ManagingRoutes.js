import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { translate } from 'react-i18next';
import Reports from './reports';
import ArchivePassword from './archivePassword';

const AdminRoutes = ({t, tofiConstants}) => {
  return (
    <Switch>
      <Route exact path="/managing/archivePassport" render={props => <ArchivePassword t={t} {...props}/>} />
      <Route exact path="/managing/reports" render={props => <Reports t={t} {...props}/>} />
    </Switch>
  )
};

export default translate('archiveFund')(AdminRoutes);