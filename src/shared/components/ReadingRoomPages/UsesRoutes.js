import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { translate } from 'react-i18next';
//import UsesWorks from "./works/UsesWorks";
//import Researchers from "../AdministrationPages/researchers";
import InquiryReq from "../ReadingRoomPages/inquiryReq";
import ReadingRoom from '../../containers/ReadingRoom';
import ResearcherCabinet from '../ReadingRoomPages/ResearcherCabinet';


const UsesRoutes = ({t}) => {
  return (
    <Switch>
      <Route exact path="/uses/readingRoom" render={props => <ReadingRoom t={t} {...props}/>} />
      <Route exact path="/uses/inquiryReq" render={props => <InquiryReq t={t} {...props}/>} />
      <Route exact path="/uses/researcherCabinet" render={props => <ResearcherCabinet t={t} {...props}/>} />
    </Switch>
  )
};

export default translate('readingRoom')(UsesRoutes);