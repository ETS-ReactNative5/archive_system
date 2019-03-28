import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { translate } from 'react-i18next';
import Researchers from './researchers';

const AdminRoutes = ({t, tofiConstants}) => {
  return (
    <Switch>
      <Route exact path="/admin/users" render={props => <Researchers t={t} {...props}/>} />
    </Switch>
  )
};

export default translate('archiveFund')(AdminRoutes);