import React from 'react';
import {message} from 'antd';
import AntTabs from "../../AntTabs";
import {connect} from "react-redux";
import {onSaveCubeData} from "../../../utils/cubeParser";
import {createObj, getCube} from "../../../actions/actions";
import {isEmpty, isEqual} from "lodash";
import {CUBE_FOR_WORKS, DO_FOR_WORKS, DP_FOR_WORKS} from "../../../constants/tofiConstants";
import Requests from "./Requests";
import RequestsUser from "./RequestsUser";

import InquiryRegResearcher from "./InquiryRegResearcher";

class ResearcherCabinet extends React.Component {

    state = {
        loading: false
    };

    componentDidMount() {
        if (this.searchUser() === true) {
            this.getCubeAct('casesForTemporaryUse');

        } else {
            this.getCubeAct('caseDeliveryToRR,orderCopyDoc,userRegistration');
        }
    }

    searchUser = () => {
        let constants = ['workAssignedToSource', 'workAssignedToReg', 'workAssignedToIPS', 'workAssignedToNID', 'clsDepInformTech']
        for (let value of constants) {
            if (this.props.tofiConstants[value].id === this.props.user.cls) {
                return true
            }
        }
    };

    getCubeAct = clss => {
        this.setState({loading: true});
        this.filters = {
            filterDOAnd: [
                {
                    dimConst: DO_FOR_WORKS,
                    concatType: "and",
                    conds: [
                        {
                            clss
                        },
                        {
                            data: {
                                valueRef: {
                                    id: `wa_${this.props.user.obj}`
                                }
                            }
                        }
                    ]
                }
            ],
            filterDPAnd: [
                {
                    dimConst: DP_FOR_WORKS,
                    concatType: "and",
                    conds: [
                        {
                            consts: "permitionDate,workAuthor,workDate,linkToUkaz,reasonForRefusalCaseStorage,workPriority,linkToDoc," +
                            "workAssignedTo,tookUser,reasonForRefusalCase,acceptanceDate,workActualEndDate,appointedUser,workActualStartDate," +
                            "workRegCase,workDescription,workStatusCreateRequirement,workRegFund,workRegInv,dateAppointment,fundArchive," +
                            "workStatusCopyDoc,docsResearch,workStatusRegistration,resultDescription,resultResearch,customerReqs"
                        }
                    ]
                }
            ]
        };
        this.props.getCube(CUBE_FOR_WORKS, JSON.stringify(this.filters), {customKey: 'requests'})
            .then(() => this.setState({loading: false}));
    };

    changeSelectedRow = rec => {
        if (isEmpty(this.state.selectedRow) || (!isEqual(this.state.selectedRow, rec) && !this.state.openCard)) {
            this.setState({selectedRow: rec})
        } else {
            this.setState({initialValues: rec, openCard: true, selectedRow: rec})
        }
    };

    onCreateObj = async ({cube, obj}, v) => {
        let hideCreateObj;
        try {
            hideCreateObj = message.loading(this.props.t('CREATING_NEW_OBJECT'), 0);
            const res = await createObj({cubeSConst: 'cubeForWorks'}, obj);
            hideCreateObj();
            if (!res.success) {
                res.errors.forEach(err => {
                    message.error(err.text)
                });
                return Promise.reject(res)
            }
            obj.doItem = res.data.idItemDO;
            return this.saveProps(
                {cube, obj},
                v,
                this.props.tofiConstants
            );
        } catch (e) {
            typeof hideCreateObj === 'function' && hideCreateObj();
            console.warn(e)
        }
    };
    saveProps = async (c, v, t = this.props.tofiConstants, objData) => {
        let hideLoading;
        try {
            if (!c.cube) c.cube = {
                cubeSConst: 'cubeForWorks',
                doConst: 'doForWorks',
                dpConst: 'dpForWorks',
            };
            if (!c.cube.data) c.cube.data = this.props.cubeForWorks;
            hideLoading = message.loading(this.props.t('UPDATING_PROPS'), 0);
            const resSave = await onSaveCubeData(c, v, t, objData);
            hideLoading();
            if (!resSave.success) {
                message.error(this.props.t('PROPS_UPDATING_ERROR'));
                resSave.errors.forEach(err => {
                    message.error(err.text)
                });
                return Promise.reject(resSave);
            }
            message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'));
            this.setState({loading: true, openCard: false});
            await this.getCubeAct();
            return resSave;
        }
        catch (e) {
            typeof hideLoading === 'function' && hideLoading();
            this.setState({loading: false});
            console.warn(e);
        }
    };

    render() {
        this.lng = localStorage.getItem('i18nextLng');
        const {loading, search} = this.state;
        const {t, tofiConstants, cubeForWorks} = this.props;
        return (
            <div className='CabinetCard'>
                <div className="title">
                    <h2>{t('RESEARCHER_CABINET')}</h2>
                </div>
                <AntTabs
                    onChange={this.handleTabChange}
                    tabs={[
                        {
                            tabKey: "requests",
                            tabName: t("REQUESTS"),
                            tabContent:
                                (this.searchUser() === true ? <RequestsUser
                                    user={this.props.user}
                                    cubeForWorks={cubeForWorks}
                                    search={search}
                                    t={t}
                                    tofiConstants={tofiConstants}
                                    loading={loading}
                                    onCreateObj={this.onCreateObj}
                                /> : <Requests
                                    user={this.props.user}
                                    cubeForWorks={cubeForWorks}
                                    search={search}
                                    t={t}
                                    tofiConstants={tofiConstants}
                                    loading={loading}
                                    onCreateObj={this.onCreateObj}
                                /> ),
                            priv: 'requests'
                        },
                        {
                            tabKey: "queries",
                            tabName: t("QUERIES"),
                            tabContent: (
                                <InquiryRegResearcher
                                    changeSelectedRowChild={this.changeSelectedRowChild}
                                    search={search}
                                    t={t}
                                    tofiConstants={tofiConstants}
                                    loading={loading}
                                />
                            ),
                            priv: 'queries'
                        }
                    ]}
                />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        cubeForWorks: state.cubes.requests,
        user: state.auth.user,
        tofiConstants: state.generalData.tofiConstants
    }
}

export default connect(mapStateToProps, {getCube})(ResearcherCabinet);