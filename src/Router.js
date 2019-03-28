import React from 'react';
import { Route, Switch } from 'react-router-dom';

import MainLayout from './shared/layouts/MainLayout';
import CollectionsLayout from './shared/layouts/CollectionsLayout';
import LayoutWithSider from './shared/layouts/LayoutWithSider';
import NotFoundScreen from './shared/containers/NotFoundScreen';
import HelpScreen from './shared/containers/HelpScreen';

const RouterComponent = () =>
  <Switch>
    <Route exact path="/main" component={MainLayout} />
    <Route exact path="/help" component={HelpScreen} />
    <Route exact path="/sider" component={LayoutWithSider} />
    <Route path="/" component={CollectionsLayout} />
    <Route path="/" component={NotFoundScreen} />
  </Switch>;

export default RouterComponent;
