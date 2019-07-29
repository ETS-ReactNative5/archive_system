import React from 'react';
import {connect} from 'react-redux'
import PropTypes from 'prop-types';
import {Breadcrumb, DatePicker} from 'antd';

import AntTabs from '../AntTabs'
import moment from 'moment';
import {Link, Route, Switch} from 'react-router-dom';
import {getCube, getObjByObjVal} from '../../actions/actions';

import {isEmpty} from 'lodash';
import  TablelegalEntities from "./TablelegalEntities";
import EntitiesIndividuals from "./EnitiesIndividuals";
// Главная страница (табы) пункта меню "источники комплектования"
class Index extends React.PureComponent {

    state = {
        loading: false,
        date: moment()
    };




    render() {
        const {t, tofiConstants, orgSourceCubeSingle, indSourceCubeSingle, orgSourceCube, indSourceCube} = this.props;
        return (
            <div className="SourcesMaintenancePage">
                <div className="title">
                    <h2> {t("SOURCINGS")} </h2>
                    <DatePicker onChange={this.onDateChange} value={this.state.date}/>
                </div>
                <AntTabs
                    tabs={[
                        {
                            tabKey: 'legalEntities',
                            tabName: t('LEGAL_ENTITIES'),
                            tabContent:<TablelegalEntities {...this.props}/>
                        },
                        {
                            tabKey: 'individuals',
                            tabName: t('INDIVIDUALS'),
                            tabContent:<EntitiesIndividuals {...this.props}/>

                        }
                    ]}
                    type="card"
                    onChange={this.handleTabChange}
                />
            </div>
        )
    }
}


function mapStateToProps(state) {
    return {
        tofiConstants: state.generalData.tofiConstants,
        orgSourceCube: state.cubes.orgSourceCube,
        indSourceCube: state.cubes.indSourceCube,
        orgSourceCubeSingle: state.cubes.orgSourceCubeSingle,
        indSourceCubeSingle: state.cubes.indSourceCubeSingle,
        IK_FUNDMAKER_ACTIVE: state.generalData.IK_FUNDMAKER_ACTIVE
    }
}

export default connect(mapStateToProps, { getCube, getObjByObjVal })(Index);