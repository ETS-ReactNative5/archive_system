import React from 'react';
import {Route, Switch} from 'react-router-dom';
import {translate} from 'react-i18next';

import UsesWorks from "./ReadingRoomPages/works/UsesWorks";
import ArchiveFundWorks from './ArchiveFundPages/works/ArchiveFundWorks';
import Works from '../components/SourcingPages/works/Works';
import NSAWorks from "../components/NSAPages/works/NSAWorks";


const WorksRoutes = ({t}) => {
  return (
    <Switch>
      <Route exact path="/works/acquisitionWorks" render={props => <Works t={t} {...props}/>}/> />
      <Route exact path="/works/storageWorks" render={props => <ArchiveFundWorks t={t} {...props}/>}/>
      <Route exact path="/works/archiveServiceWorks" render={props => <UsesWorks t={t} {...props}/>}/>
      <Route exact path="/works/nsaWorks" render={props => <NSAWorks t={t} {...props}/>}/>
      <Route exact path="/works/controlWorks" render={props => <NSAWorks t={t} {...props}/>}/>
    </Switch>
  )
};

export default translate('archiveFund')(WorksRoutes);