import React from 'react';
import {connect} from 'react-redux'
import PropTypes from 'prop-types';
import {Breadcrumb, DatePicker} from 'antd';

import AntTabs from '../../AntTabs'
import LegalEntities from './LegalEntities';
import Individuals from './Individuals';
import moment from 'moment';
import {Link, Route, Switch} from 'react-router-dom';
import DocsStorageConditions from './DocsStorageConditions';
import {getCube, getObjByObjVal} from '../../../actions/actions';
import {
    CUBE_FOR_FUND_AND_IK,
    CUBE_FOR_ORG_FUNDMAKER,
    DO_FOR_FUND_AND_IK,
    DP_FOR_FUND_AND_IK,
    DT_FOR_FUND_AND_IK
} from '../../../constants/tofiConstants';
import DocsInfoPage from './DocsInfoPage';
import ProviderInfo from './ProviderInfo';
import Acts from './Acts';
import IndividualInventories from './IndividualInventories';
import LegalEntitiesInventoriesMain from './legalEntitiesInv/LegalEntitiesInventoriesMain';
import LegalEntitiesNomenclatureMain from './LegalEntitiesNomenclatureMain';
import LegalEntitiesNomenclatureMainEdit from './LegalEntitiesNomenclatureMainEdit';
import {isEmpty} from 'lodash';
import LegalEntitiesInventoriesMain_new from './legalEntitiesInv/LegalEntitiesInventoriesMain_new';

// Главная страница (табы) пункта меню "источники комплектования"
class SourcesMaintenancePage extends React.PureComponent {

    state = {
        loading: true,
        date: moment()
    };

    handleTabChange = () => {
        if (this.props.location.pathname !== '/sourcing/sourcesMaintenance')
            this.props.history.push('/sourcing/sourcesMaintenance');
    };

    onDateChange = date => {
        this.setState({date})
    };

    async componentDidMount() {
        try {
            if (isEmpty(this.props.tofiConstants) || this.props.orgSourceCube) return;
            /*    if (!this.props.orgSourceCube) {
             await this.props.getCube(CUBE_FOR_ORG_FUNDMAKER);
             }*/
            this.loadEntity()
                .then(() => {
                    this.setState({loading: false})
                });
        } catch (err) {
            console.error(err)
        }
    }
    // если id не задан, загружает из куба CUBE_FOR_FUND_AND_IK объекты класса sourceOrgList с 9 свойствами, если id задан, то загружает 1 объект со всеми свойствами.
    loadEntity = async (id, withDT) => {
        try {
            const filterDTOr = [{
                dimConst: DT_FOR_FUND_AND_IK,
                concatType: 'and',
                conds: [{
                    ids: this.state.date.startOf('year').format('YYYYMMDD') + this.state.date.endOf('year').format('YYYYMMDD')
                }]
            }];
            const filters = {
                filterDOAnd: !id ? [
                    {
                        dimConst: DO_FOR_FUND_AND_IK,
                        concatType: "and",
                        conds: [
                            {
                                clss: "sourceOrgList",

                            } ,
                            {
                                data: {
                                    dimPropConst: DP_FOR_FUND_AND_IK,
                                    propConst: 'isActive',
                                    valueRef: {id: String(['123_'+this.props.tofiConstants.isActiveTrue.id])}
                                }
                            }
                        ]
                    }
                ] : [{
                    dimConst: DO_FOR_FUND_AND_IK,
                    concatType: "and",
                    conds: [{
                        ids: id
                      }
                    ]}
                ],
                filterDPAnd: !id ? [
                    {
                        dimConst: DP_FOR_FUND_AND_IK,
                        concatType: "and",
                        conds: [
                            {
                                consts: 'isActive,fundArchive,fundmakerOfIK,fundNumber,formOfAdmission,legalStatus,orgIndustry,nomen,nomenCasesNote,normMethDocs'
                            }
                        ]
                    }
                ] : [],
                filterDTOr: withDT ? [] : filterDTOr,
            };
            return this.props.getCube(CUBE_FOR_FUND_AND_IK, JSON.stringify(filters), id ? {
                customKey: 'orgSourceCubeSingle',
                parent: id
            } : {customKey: 'orgSourceCube'});

        } catch (err) {
            return Promise.reject();
        }
    };

    loadInd = (id, withDT) => {
      try {
        const filterDTOr = [{
          dimConst: DT_FOR_FUND_AND_IK,
          concatType: 'and',
          conds: [{
            ids: this.state.date.startOf('year').format('YYYYMMDD') + this.state.date.endOf('year').format('YYYYMMDD')
          }]
        }];
        const filters = {
          filterDOAnd: !id ? [
            {
              dimConst: DO_FOR_FUND_AND_IK,
              concatType: "and",
              conds: [
                {
                  clss: "sourceLPList",

                } ,
              ]
            }
          ] : [{
            dimConst: DO_FOR_FUND_AND_IK,
            concatType: "and",
            conds: [{
              ids: id
            }
            ]}
          ],
          filterDPAnd: !id ? [
            {
              dimConst: DP_FOR_FUND_AND_IK,
              concatType: "and",
              conds: [
                {
                  consts: 'fundArchive, fundmakerOfIK, fundNumber, legalStatus, nomen, nomenCasesNote'
                }
              ]
            }
          ] : [],
          filterDTOr: withDT ? [] : filterDTOr,
        };
        return this.props.getCube(CUBE_FOR_FUND_AND_IK, JSON.stringify(filters), id ? {
          customKey: 'indSourceCubeSingle',
          parent: id
        } : {customKey: 'indSourceCube'});

      } catch (err) {
        return Promise.reject();
      }
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
                    defaultActiveKey={this.props.location.pathname.includes('individuals') ? 'individuals' : 'legalEntities'}
                    tabs={[
                        {
                            tabKey: 'legalEntities',
                            tabName: t('LEGAL_ENTITIES'),
                            tabContent: <div
                                style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                                {this.props.location.pathname.split('/').length >= 5 &&
                                <Breadcrumb>
                                    <Breadcrumb.Item><Link to={{
                                        pathname: "/sourcing/sourcesMaintenance",
                                        state: {tabKey: 'legalEntities'}
                                    }}>{t('SOURCING')}</Link></Breadcrumb.Item>
                                    <Breadcrumb.Item><b>{(this.props.location.state && this.props.location.state.record && this.props.location.state.record.sourceOrgList) || ''}</b></Breadcrumb.Item>
                                </Breadcrumb>}
                                <Switch>
                                    <Route exact path="/sourcing/sourcesMaintenance"
                                           render={props => <LegalEntities
                                                              loading={this.state.loading}
                                                              t={t}
                                                              tofiConstants={tofiConstants}
                                                              {...props}
                                                              loadEntity={this.loadEntity}
                                                              orgSourceCube={orgSourceCube}/>}/>
                                    <Route exact path="/sourcing/sourcesMaintenance/legalEntities/:id/storageConditions"
                                           render={props => <DocsStorageConditions
                                               orgSourceCube={orgSourceCubeSingle}
                                               tofiConstants={tofiConstants}
                                               t={t}
                                               {...props}/>}/>
                                    <Route exact
                                           path="/sourcing/sourcesMaintenance/legalEntities/:id/docsInfo"
                                           render={props => <DocsInfoPage
                                                              tofiConstants={tofiConstants} t={t} {...props}
                                                              orgSourceCubeSingle={orgSourceCubeSingle}/>}/>
                                    <Route exact
                                           path="/sourcing/sourcesMaintenance/legalEntities/:id/inventories/:invId"
                                           render={props => <LegalEntitiesInventoriesMain t={t}
                                                              tofiConstants={tofiConstants} {...props}/>}/>
                                    <Route exact
                                           path="/sourcing/sourcesMaintenance/legalEntities/:id/inventories"
                                           render={props => <LegalEntitiesInventoriesMain_new
                                               t={t}
                                               tofiConstants={tofiConstants} {...props}/>}/>
                                    <Route exact
                                           path="/sourcing/sourcesMaintenance/legalEntities/:id/nomenclature"
                                           render={props => <LegalEntitiesNomenclatureMain t={t}
                                                               tofiConstants={tofiConstants} {...props}/>}/>
                                    <Route exact
                                           path="/sourcing/sourcesMaintenance/legalEntities/:id/nomenclature/:key"
                                           render={props => <LegalEntitiesNomenclatureMainEdit
                                               t={t}
                                               tofiConstants={tofiConstants} {...props}/>}/>
                                </Switch>
                            </div>
                        },
                        {
                            tabKey: 'individuals',
                            tabName: t('INDIVIDUALS'),
                            tabContent: <div
                                style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                                <Breadcrumb>
                                    {this.props.location.pathname.split('/').length >= 5 &&
                                    <Breadcrumb.Item><Link to={{
                                        pathname: "/sourcing/sourcesMaintenance",
                                        state: {tabKey: 'individuals'}
                                    }}>{t('SOURCING')}</Link></Breadcrumb.Item>}
                                </Breadcrumb>
                                <Switch>
                                    <Route exact path="/sourcing/sourcesMaintenance"
                                           render={props => <Individuals
                                               loading={this.state.loading}
                                               t={t}
                                               loadInd={this.loadInd}
                                               tofiConstants={tofiConstants}
                                               indSourceCube={indSourceCube}
                                               {...props}/>}/>
                                    {/*<Route exact path="/sourcing/sourcesMaintenance/individuals/:id" render={props => <IndividualsCard t={t} {...props}/>}/>*/}
                                    <Route exact path="/sourcing/sourcesMaintenance/individuals/:id/providerInfo"
                                           render={props => <ProviderInfo
                                             t={t}
                                             {...props}
                                            tofiConstants={tofiConstants}
                                            indSourceCubeSingle={indSourceCubeSingle}/>}/>
                                    <Route exact path="/sourcing/sourcesMaintenance/individuals/:id/acts"
                                           render={props => <Acts t={t} {...props}
                                           tofiConstants={tofiConstants}
                                           indSourceCubeSingle={indSourceCubeSingle}/>}/>
                                    <Route exact path="/sourcing/sourcesMaintenance/individuals/:id/inventories"
                                           render={props => <IndividualInventories
                                           t={t}
                                           {...props}
                                           tofiConstants={tofiConstants}
                                           indSourceCubeSingle={indSourceCubeSingle}/>}/>
                                </Switch>
                            </div>
                        }
                    ]}
                    type="card"
                    onChange={this.handleTabChange}
                />
            </div>
        )
    }
}

SourcesMaintenancePage.propTypes = {
    t: PropTypes.func.isRequired,
    tofiConstants: PropTypes.shape()
};

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

export default connect(mapStateToProps, { getCube, getObjByObjVal })(SourcesMaintenancePage);