import React, { Component } from 'react';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types'

import LegalEntities from '../components/SourcingPages/sources/LegalEntities';
import Individuals from '../components/SourcingPages/sources/Individuals';
//import Works from '../components/SourcingPages/works/Works';
import {Route, Switch} from 'react-router-dom';
import EditSourcingPage from '../components/SourcingPages/EditSourcingPage';
import IndividualsMainInfo from '../components/SourcingPages/IndividualsMainInfo';
import {connect} from 'react-redux';
import Schedule from '../components/SourcingPages/schedule/Schedule';
import FundMakerPage from '../components/SourcingPages/fundMaker/FundMakerPage';
import SourcesMaintenancePage from '../components/SourcingPages/sources/SourcesMaintenancePage';
import SourcesMaintenancePage2 from '../components/sourcesMaintenance2';
import CheckingPlan from '../components/SourcingPages/checking/CheckingPlan';
import WorksChecking from '../components/SourcingPages/works/WorksChecking';
import AcquisitionReports from '../components/SourcingPages/Reports/AcquisitionReports';
import Inventory from "../components/InventoryIk"
class Sourcing extends Component {

  /*shouldComponentUpdate(nextProps) {
    // console.log(this.props.i18n, nextProps.i18n, localStorage.getItem('i18nextLng'));
    return (this.props.location !== nextProps.location || this.props.i18n.language !== nextProps.i18n.language);
    // return true;
  }*/

  render() {
    const { t, tofiConstants } = this.props;

    return (
      <div className="Sourcing">
        <Switch>
          {/*<Route exact path="/sourcing/works" render={props => <Works t={t} {...props}/>} />*/}
          <Route exact path="/sourcing/works/checking/:sourcing" render={props => <WorksChecking t={t} {...props}/>} />
          <Route path="/sourcing/sourcesMaintenance" render={props => <SourcesMaintenancePage t={t} {...props}/>} />
          <Route path="/sourcing/sourcesMaintenance2" render={props => <SourcesMaintenancePage2 t={t} {...props}/>} />
          <Route path="/sourcing/inventory" render={props => <Inventory t={t} {...props}/>} />
          <Route exact path="/sourcing/schedule" render={props => <Schedule t={t} {...props}/>} />
          <Route exact path="/sourcing/checking" render={props => <CheckingPlan t={t} {...props} tofiConstants={tofiConstants}/>} />
          <Route exact path="/sourcing/fundMaker" render={props => <FundMakerPage t={t} {...props}/>} />
          {/*<Route exact path="/sourcing/legalEntities" component={LegalEntities} />*/}
          {/*<Route exact path="/sourcing/legalEntities/:id" component={EditSourcingPage} />*/}
          <Route exact path="/sourcing/individuals" render={props => <Individuals t={t} tofiConstants={tofiConstants} {...props}/>} />
          <Route exact path="/sourcing/individuals/:id" render={props => <IndividualsMainInfo t={t} tofiConstants={tofiConstants} {...props}/>} />
{/*
          <Route exact path = "/sourcing/reports" render = {props => <AcquisitionReports t={t} tofiConstants={tofiConstants} {...props}/> } />
*/}

        </Switch>
      </div>
    )
  }
}

Sourcing.propTypes = {
  t: PropTypes.func.isRequired,
  tofiConstants: PropTypes.shape()
};

function mapStateToProps(state) {
  return {
    tofiConstants: state.generalData.tofiConstants
  }
}

export default connect(mapStateToProps)(translate('sourcing')(Sourcing));

