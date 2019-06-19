import React from 'react';
import {connect} from 'react-redux';
import {Button, Input, Icon, message, Popconfirm} from 'antd';
import CSSTransition from 'react-transition-group/CSSTransition'
import moment from 'moment';

import SelectVirt from '../../SelectVirt';
import Select from '../../Select';
import {
    FORM_OF_ADMISSION,
    LEGAL_STATUS,
    ORG_INDUSTRY,
    FUND_MAKER_ARCHIVE,
    IS_ACTIVE,
    CUBE_FOR_ORG_FUNDMAKER,
    CUBE_FOR_FUND_AND_IK,
    DO_FOR_ORG_FUNDMAKER,
    DO_FOR_FUND_AND_IK,
    DP_FOR_FUND_AND_IK,
    DP_FOR_ORG_FUNDMAKER
} from '../../../constants/tofiConstants';
import AntTable from '../../AntTable';
import SiderCard_FundMaker from './SiderCard_FundMaker';
import {isEmpty, isEqual, map} from 'lodash';
import {parseCube_new, onSaveCubeData, parseForTable} from '../../../utils/cubeParser';
import {
    getCube,
    getPropVal,
    updateCubeData,
    createObj,
    insPropVal,
    getPropValWithChilds, dFundMaker
} from '../../../actions/actions';
import SiderCard from "../../SiderCard";

/*eslint eqeqeq:0*/
class FundMaker extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            idfunMarker:"",
            filter: {
                name: '',
                legalStatus: [],
                legalStatusLoading: false,
                fundmakerArchive: [],
                fundmakerArchiveLoading: false,
                orgIndustry: [],
                orgIndustryChildren: [],
                orgIndustryLoading: false,
                formOfAdmission: [],
                formOfAdmissionLoading: false,
                isActive: [],
                isActiveLoading: false
            },

            openCard: false,
            loading: true,
            selectedRow: null,
            initialValues: {}
        }
    }

    getFundsList=()=>{
        this.props.history.push({
            pathname: `/archiveFund/fundsList`,
            state: {
                key:this.state.selectedRow.key.split("_")[1]
            }
        })
    }

    getTablelegalEntities=()=>{
        this.props.history.push({
            pathname: `/sourcing/sourcesMaintenance2`,
            state: {
                key:this.state.selectedRow.key.split("_")[1]
            }
        })
    }
    deleteObj =()=>{
        const hideLoading = message.loading(this.props.t('REMOVING'), 30);
        dFundMaker(this.state.selectedRow.key.split('_')[1])
            .then(res => {
                hideLoading();
                if (res.success) {
                    message.success(this.props.t('SUCCESSFULLY_REMOVED'));
                    this.remove(this.state.selectedRow.key)
                } else {
                    throw res
                }
            }).catch(err => {
            hideLoading();
            console.error(err);
            if (err.funds) {
                err.funds.forEach(err => message.error(`${this.props.t('EXISTS_FUND_1')} ${err.name[this.lng]} ${this.props.t('EXISTS_FUND_2')}`, 8))
            } else {
                message.error(this.props.t('REMOVING_ERROR'))
            }
        })
    }

    onLegalStatusChange = s => {
        this.setState({filter: {...this.state.filter, legalStatus: s}})
    };
    onOrgLocationChange = s => {
        this.setState({filter: {...this.state.filter, fundmakerArchive: s}})
    };
    onFormOfAdmissionChange = s => {
        this.setState({filter: {...this.state.filter, formOfAdmission: s}})
    };
    onOrgIndustryChange = s => {
        const getLastChildren = (dataArr, itemArr) => {
            const result = [];
            itemArr.forEach(it => {
                if (it.hasChild) {
                    result.push(it);
                    result.push(...getLastChildren(dataArr, getChildren(dataArr, it)))
                } else {
                    result.push(it);
                }
            });
            return result;
        };
        const getChildren = (dataArr, item) => {
            if (item.hasChild) return dataArr.filter(o => o.parent == item.value)
        };
        this.setState({
            filter: {
                ...this.state.filter,
                orgIndustry: s,
                orgIndustryChildren: getLastChildren(this.props.orgIndustryOptions, s)
            }
        })
    };
    onIsActiveChange = s => {
        this.setState({filter: {...this.state.filter, isActive: s}})
    };

    changeSelectedRow = rec => {
        var slctdRow = this.state.selectedRow;
        if ((!!slctdRow) && (!(slctdRow.key === rec.key)) && (this.state.openCard == true)) {
            this.setState({initialValues:rec,selectedRow: rec, openCard: false})
        } else if ((!!slctdRow) && (slctdRow.key === rec.key) && (this.state.openCard == true)) {
        } else if ((!!slctdRow) && (!(slctdRow.key === rec.key))) {
            this.setState({initialValues: rec, openCard: false, selectedRow: rec});
        } else {
            this.setState({initialValues: rec, openCard: true, selectedRow: rec});
        }
    };

    openCard = () => {
        const accessLevelObj = this.props.accessLevelOptions.find(al => al.id === 1);
        this.setState({
            selectedRow: null,
            openCard: true,
            initialValues: {
                accessLevel: {
                    value: accessLevelObj.id,
                    label: accessLevelObj.name[this.lng]
                }
            }
        })
    };

    closeCard = () => {
        this.setState({openCard: false})
    };
    loadOptions = (c, withChilds) => {
        return () => {
            if (!this.props[c + 'Options']) {
                this.setState({filter: {...this.state.filter, [c + 'Loading']: true}});
                !withChilds && this.props.getPropVal(c)
                .then(() => this.setState({
                    filter: {
                        ...this.state.filter,
                        [c + 'Loading']: false
                    }
                }))
                .catch(() => message.error('Ошибка загрузки данных'));
                withChilds && this.props.getPropValWithChilds(c)
                .then(() => this.setState({
                    filter: {
                        ...this.state.filter,
                        [c + 'Loading']: false
                    }
                }))
                .catch(() => message.error('Ошибка загрузки данных'));
            }
        }
    };
    onInputChange = e => {
        this.setState({
            filter: {
                ...this.state.filter,
                [e.target.name]: e.target.value
            }
        })
    };
    emitEmpty = e => {
        this.setState({
            filter: {
                ...this.state.filter,
                [e.target.dataset.name]: ''
            }
        })
    };
    stopPropagation = e => e.stopPropagation();

    componentDidMount() {
        this.loadOptions(IS_ACTIVE)();

        if (!isEmpty(this.props.tofiConstants)) {
            const isActiveTrue = this.props.tofiConstants.isActiveTrue;
            this.onIsActiveChange([{
                value: isActiveTrue.id,
                label: isActiveTrue.name[this.lng]
            }])
        }

        if (isEmpty(this.props.tofiConstants) || !this.props.cubeForOrgFundmaker) return;
        const {doForOrgFundmakers, dpForOrgFundmakers} = this.props.tofiConstants;
        this.setState(
        {
            loading: false,
            data: parseCube_new(
            this.props.cubeForOrgFundmaker['cube'],
            [],
            'dp',
            'do',
            this.props.cubeForOrgFundmaker[`do_${doForOrgFundmakers.id}`],
            this.props.cubeForOrgFundmaker[`dp_${dpForOrgFundmakers.id}`],
            `do_${doForOrgFundmakers.id}`,
            `dp_${dpForOrgFundmakers.id}`).map(this.renderTableData)
        },()=>{
                if (this.props.idfunMarker){
                    let data = this.state.data
                    let newobj = data.find(el=>el.key === this.props.idfunMarker)
                    this.setState({
                        selectedRow:newobj,

                    },()=>{
                        this.changeSelectedRow(newobj)
                    })

                }
            }
        )


    }

    componentWillReceiveProps(nextProps) {
        if (!isEmpty(nextProps.cubeForOrgFundmaker) && !isEmpty(nextProps.tofiConstants) && this.props.cubeForOrgFundmaker !== nextProps.cubeForOrgFundmaker) {
            const {doForOrgFundmakers, dpForOrgFundmakers} = nextProps.tofiConstants;
            this.setState({
                loading: false,
                openCard: false,
                data: parseCube_new(
                nextProps.cubeForOrgFundmaker['cube'],
                [],
                'dp',
                'do',
                nextProps.cubeForOrgFundmaker[`do_${doForOrgFundmakers.id}`],
                nextProps.cubeForOrgFundmaker[`dp_${dpForOrgFundmakers.id}`],
                `do_${doForOrgFundmakers.id}`,
                `dp_${dpForOrgFundmakers.id}`).map(this.renderTableData)
            },()=>{
                if (this.props.idfunMarker){
                    let data = this.state.data
                    let newobj = data.find(el=>el.key === this.props.idfunMarker)
                    this.setState({
                        selectedRow:newobj,
                    },()=>{
                        this.changeSelectedRow(newobj)

                    })

                }
            })

        }

    }

    renderTableData = (item, idx) => {
        const constArr = ['legalStatus', 'dateFormation', 'formOfAdmission', 'orgIndustry', 'fundmakerArchive',
            'isActive', 'orgAddress', 'orgPhone', 'orgFax', 'orgEmail', 'orgFormationDoc', 'orgReorganizationDoc', 'orgLiquidationDoc',
            'leaderFIO', 'leaderPosition', 'leaderPhone', 'depLeaderFIO', 'depLeaderPosition', 'depLeaderPhone', 'responsibleFIO', 'responsiblePosition', 'responsiblePhone',
            'responsibleAppointmentDate', 'archiveLeaderFIO', 'archiveLeaderPosition', 'archiveLeaderPhone', 'archiveLeaderAppointmentDate', 'subordination', 'jurisdiction',
            'commissionLeaderFIO', 'commissionLeaderPosition', 'commissionLeaderPhone', 'contractNumber', 'orgDocType', 'orgFunction', 'structure', 'fundNumber', 'corresOrg', 'corresOrgFile', 'letterDetails','fundmakerOfIK'];
        const accessLevelObj = this.props.accessLevelOptions.find(al => al.id === item.accessLevel);

        const result = {
            key: item.id,
            numb: idx + 1,
            shortName: item.name ? item.name : {kz: '', ru: '', en: ''},
            name: item.fullName ? item.fullName : {kz: '', ru: '', en: ''},
            dbeg: item.dbeg && moment(item.dbeg).isAfter('1800-01-01') ? moment(item.dbeg) : null,
            dend: item.dend && moment(item.dend).isBefore('3333-12-31') ? moment(item.dend) : null,
            dateFormation:  item.dateFormation ? item.dateFormation : null,
            accessLevel: accessLevelObj && {
                value: accessLevelObj.id,
                label: accessLevelObj.name[this.lng]
            },
        };
        parseForTable(item.props, this.props.tofiConstants, result, constArr);
        // because orgIndustry here is Array, but should behave like object. strange? I know 🤷
        result.orgIndustry = result.orgIndustry && result.orgIndustry.length ?
        result.orgIndustry.sort((a, b) => a.value > b.value)[result.orgIndustry.length - 1] :
        null;

        ['orgFormationDoc', 'orgReorganizationDoc', 'orgLiquidationDoc', 'leaderFIO', 'leaderPosition', 'depLeaderFIO',
            'depLeaderPosition', 'responsibleFIO', 'responsiblePosition', 'archiveLeaderFIO', 'orgAddress',
            'archiveLeaderPosition', 'commissionLeaderFIO', 'commissionLeaderPosition', 'fundNumber', 'letterDetails', 'corresOrg', 'corresOrgFile']
        .forEach(c => {
            result[c] = result[c + 'Lng']
        });
        //console.log('parseForTable', result);
        return result;
    };

    onCreateObj = async ({cube, obj}, v) => {
        let hideCreateObj;
        try {
            const objIK = {...obj, clsConst: 'sourceOrgList'};
            hideCreateObj = message.loading(this.props.t('CREATING_NEW_OBJECT'), 30);
            //Making two parallel request to create obj;
            const [resFM, resIK] = await Promise.all(
            [
                createObj({cubeSConst: CUBE_FOR_ORG_FUNDMAKER}, obj),
                createObj({cubeSConst: CUBE_FOR_FUND_AND_IK}, objIK)
            ]
            );
            const filters = {
                filterDOAnd: [
                    {
                        dimConst: DO_FOR_FUND_AND_IK,
                        concatType: "and",
                        conds: [
                            {
                                ids: resIK.data.idItemDO
                            }
                        ]
                    }
                ],
            };
            await this.props.getCube('cubeForFundAndIK', JSON.stringify(filters), {customKey: 'cubeForFundAndIKSingle'});
            await this.props.loadOrgFundmaker(resFM.data.idItemDO);
            hideCreateObj();
            if (!resFM.success) {
                resFM.errors.forEach(err => {
                    message.error(err.text)
                });
                return Promise.reject(resFM);
            }
            if (!resIK.success) {
                resIK.errors.forEach(err => {
                    message.error(err.text)
                });
                return Promise.reject(resIK);
            }
            // Capture newly created obj to be able to find it later
            this.newObj = resFM.data.idItemDO;
            // Saving IK prop separately, because of lack of IK cube here
            //console.log(this.props.cubeForFundAndIK);
            const cIK = {
                cube: {
                    cubeSConst: CUBE_FOR_FUND_AND_IK,
                    doConst: DO_FOR_FUND_AND_IK,
                    dpConst: DP_FOR_FUND_AND_IK,
                    data: this.props.cubeForFundAndIKSingle
                },
                obj: {doItem: resIK.data.idItemDO}
            };
            const {fundNumber, fundmakerArchive, formOfAdmission, legalStatus, orgIndustry, isActive} = v.values;
            const fundArchive = fundmakerArchive;
            const vIK = {
                values: {
                    fundNumber,
                    fundArchive,
                    formOfAdmission,
                    orgIndustry,
                    isActive,
                    fundmakerOfIK: resFM.data.idItemDO.split('_')[1]
                }
            };
            // Сохраняем значения свойств источника комплектования
            this.saveIKProps(cIK, vIK, this.props.tofiConstants);
            // Сохраняем значения свойств фондообразователя
            obj.doItem = resFM.data.idItemDO;
            return this.saveProps(
            {cube, obj},
            v,
            this.props.tofiConstants
            );
        }
        catch(e) {
            typeof hideCreateObj === 'function' && hideCreateObj();
            console.warn(e);
        }
    };

    saveIKProps = async (c, v, t, objData) => {
        try {
            const resSaveIK = await onSaveCubeData(c, v, t, objData);
            if (!resSaveIK.success) {
                message.error(this.props.t('PROPS_UPDATING_ERROR'));
                resSaveIK.errors.forEach(err => {
                    message.error(err.text)
                });
                return Promise.reject(resSaveIK);
            }
            message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'));
        }
        catch(e) {
            console.warn(e);
        }
    };

    saveProps = async (c, v, t, objData) => {
        let hideLoading;
        try {
            // Сохраняем значения свойств фондообразователя
            c.cube.data = this.props.cubeForOrgFundmakerSingle;
            hideLoading = message.loading(this.props.t('UPDATING_PROPS'), 0);
            const resSaveFM = await onSaveCubeData(c, v, t, objData);
            hideLoading();
            if (!resSaveFM.success) {
                message.error(this.props.t('PROPS_UPDATING_ERROR'));
                resSaveFM.errors.forEach(err => {
                    message.error(err.text)
                });
                return Promise.reject(resSaveFM);
            }
            message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'));
            // Перезагружаем куб фондообразователей, если изменились названия и 5 свойств фондообразователя.
            if ((objData && (objData.name || objData.fullName || objData.dbeg || objData.dend || objData.accessLevel)) ||
            v.values.fundmakerArchive || v.values.formOfAdmission || v.values.legalStatus || v.values.isActive || v.values.orgIndustry) {
                this.setState({loading: true, openCard: false});
                await this.props.loadOrgFundmaker();
                this.setState({loading: false, openCard: true});
            }
            return resSaveFM;
        }
        catch(e) {
            typeof hideLoading === 'function' && hideLoading();
            this.setState({loading: false});
            console.warn(e);
        }
    };

    remove = key => {
        const newData = this.state.data.filter(item => item.key !== key);
        this.setState({data: newData});
    };


    render() {

        if (isEmpty(this.props.tofiConstants) || isEmpty(this.props.accessLevelOptions)) return null;
        const {filter, data,idfunMarker, loading} = this.state;
        const {t, tofiConstants, legalStatusOptions, fundmakerArchiveOptions, orgIndustryOptions, formOfAdmissionOptions, isActiveOptions} = this.props;

        this.lng = localStorage.getItem('i18nextLng');
        const {legalStatus, formOfAdmission, orgIndustry, fundmakerArchive, isActive} = tofiConstants;
        if (!!this.props.idfunMarker){
            this.filteredData = data.filter(item => {
                return (
                    item.name[this.lng].toLowerCase().includes(filter.name.toLowerCase()) &&
                    item.key.toLowerCase().includes(this.props.idfunMarker.toLowerCase()) &&
                    ( filter.formOfAdmission.length === 0 || item.formOfAdmission && filter.formOfAdmission.some(p => p.value == item.formOfAdmission.value) ) &&
                    item.isActive &&
                    ( filter.isActive.length === 0 || item.isActive && filter.isActive.some(p => p.value == item.isActive.value) ) &&
                    ( filter.legalStatus.length === 0 || item.legalStatus && filter.legalStatus.some(p => p.value == item.legalStatus.value) ) &&
                    ( filter.fundmakerArchive.length === 0 || item.fundmakerArchive && filter.fundmakerArchive.some(p => p.value == item.fundmakerArchive.value) ) &&
                    ( filter.orgIndustryChildren.length === 0 || item.orgIndustry && filter.orgIndustryChildren.some(p => p.value == item.orgIndustry.value) )
                )
            }).map((item, idx) => ({...item, numb: idx + 1}));
        }else{

            this.filteredData = data.filter(item => {
                return (
                    item.name[this.lng].toLowerCase().includes(filter.name.toLowerCase()) &&
                    // item.key.toLowerCase().includes(this.props.idfunMarker.toLowerCase()) &&
                    ( filter.formOfAdmission.length === 0 || item.formOfAdmission && filter.formOfAdmission.some(p => p.value == item.formOfAdmission.value) ) &&
                    item.isActive &&
                    ( filter.isActive.length === 0 || item.isActive && filter.isActive.some(p => p.value == item.isActive.value) ) &&
                    ( filter.legalStatus.length === 0 || item.legalStatus && filter.legalStatus.some(p => p.value == item.legalStatus.value) ) &&
                    ( filter.fundmakerArchive.length === 0 || item.fundmakerArchive && filter.fundmakerArchive.some(p => p.value == item.fundmakerArchive.value) ) &&
                    ( filter.orgIndustryChildren.length === 0 || item.orgIndustry && filter.orgIndustryChildren.some(p => p.value == item.orgIndustry.value) )
                )
            }).map((item, idx) => ({...item, numb: idx + 1}));
        }

        if (this.newObj) {
            this.newObjIdx = this.filteredData.findIndex(obj => obj.key === this.newObj);
        }
        return (
        <div className="FundMaker">
            <div className="FundMaker__heading">
                <div className="table-header">
                    <div className="table-header-btns">
                        <Button onClick={this.openCard}>{this.props.t('ADD')}</Button>
                        <Button onClick={this.deleteObj} disabled={this.state.selectedRow!== null?false:true}>{this.props.t('DELETE')}</Button>
                        <Button onClick={this.getTablelegalEntities} disabled={this.state.selectedRow!== null?false:true}>{this.props.t('SOURCING')}</Button>
                        <Button onClick={this.getFundsList} disabled={this.state.selectedRow!== null?false:true}>{this.props.t('FUND')}</Button>
                    </div>
                    <div className="label-select">
                        <SelectVirt
                            selectClassName='long-selected-menu'
                            name="orgIndustry"
                            isMulti
                            isLoading={filter.orgIndustryLoading}
                            onMenuOpen={this.loadOptions(ORG_INDUSTRY, true)}
                            value={filter.orgIndustry}
                            onChange={this.onOrgIndustryChange}
                            options={orgIndustryOptions || []}
                            menuStyle={{minWidth: 200}}
                            menuContainerStyle={{minWidth: 202}}
                            placeholder={orgIndustry.name[this.lng]}
                        />
                        <Select
                            name="legalStatus"
                            isMulti
                            isSearchable={false}
                            value={filter.legalStatus}
                            onChange={this.onLegalStatusChange}
                            isLoading={filter.legalStatusLoading}
                            options={legalStatusOptions ? legalStatusOptions.map(option => ({
                                value: option.id,
                                label: option.name[this.lng]
                            })) : []}
                            placeholder={legalStatus.name[this.lng]}
                            onMenuOpen={this.loadOptions(LEGAL_STATUS)}
                            menuStyle={{minWidth: 200}}
                            menuContainerStyle={{minWidth: 202}}
                        />
                    </div>
                </div>
            </div>
            <div className="FundMaker__body">
                <AntTable
                loading={loading}
                key={this.state.data.length || 't'}
                columns={[
                    {
                        key: 'numb',
                        title: '№',
                        dataIndex: 'numb',
                        width: '5%'
                    },
                    {
                        key: 'name',
                        title: t('NAME'),
                        dataIndex: 'name',
                        width: '35%',
                        filterDropdown: (
                        <div className="custom-filter-dropdown">
                            <Input
                            name="name"
                            suffix={filter.name ?
                            <Icon type="close-circle" data-name="name"
                                  onClick={this.emitEmpty}/> : null}
                            ref={ele => this.name = ele}
                            placeholder="Поиск"
                            value={filter.name}
                            onChange={this.onInputChange}
                            />
                        </div>
                        ),
                        filterIcon: <Icon type="filter"
                                          style={{color: filter.name ? '#ff9800' : '#aaa'}}/>,
                        onFilterDropdownVisibleChange: (visible) => {
                            this.setState({
                                filterDropdownVisible: visible,
                            }, () => this.name.focus());
                        },
                        render: obj => obj && obj[this.lng]
                    },
                    {
                        key: 'orgIndustry',
                        title: orgIndustry.name[this.lng],
                        dataIndex: 'orgIndustry',
                        width: '19%',
                        render: value => value && value.label,
                    }
                ]}
                dataSource={this.filteredData}
                changeSelectedRow={this.changeSelectedRow}
                openedBy="FundMaker"
                newObj={this.newObj}
                pagination={{
                    pageSize: 20,
                    showQuickJumper: true,
                    showSizeChanger: true,
                    defaultCurrent: this.newObjIdx && ~this.newObjIdx && Math.ceil(Number(this.newObjIdx) / 20)
                }}
                />
                <CSSTransition
                in={this.state.openCard}
                timeout={300}
                classNames="card"
                unmountOnExit
                >
                    <SiderCard
                        closer={
                            <Button
                                type="danger"
                                onClick={this.closeCard}
                                shape="circle"
                                icon="arrow-right"
                            />
                        }
                    >
                        <SiderCard_FundMaker t={t} tofiConstants={tofiConstants}
                                             initialValues={this.state.initialValues} //eslint-disable-line
                                             saveProps={this.saveProps}
                                             saveIKProps={this.saveIKProps}
                                             onCreateObj={this.onCreateObj}
                                             loadOrgFundmaker={this.props.loadOrgFundmaker}
                                             cubeForOrgFundmakerSingle={this.props.cubeForOrgFundmakerSingle}
                                             accessLevelOptions={this.props.accessLevelOptions}

                        />
                    </SiderCard>
                </CSSTransition>
            </div>
        </div>
        );
    }
}

function mapStateToProps(state) {
    const lng = localStorage.getItem('i18nextLng');
    const orgIndOpts = state.generalData[ORG_INDUSTRY] && state.generalData[ORG_INDUSTRY]
    .map(option => ({
        value: option.id,
        label: option.name[lng],
        hasChild: option.hasChild,
        parent: option.parent
    }));
    return {
        cubeForOrgFundmakerSingle: state.cubes.cubeForOrgFundmakerSingle,
        cubeForFundAndIKSingle: state.cubes.cubeForFundAndIKSingle,
        legalStatusOptions: state.generalData[LEGAL_STATUS],
        fundmakerArchiveOptions: state.generalData[FUND_MAKER_ARCHIVE],
        orgIndustryOptions: orgIndOpts,
        formOfAdmissionOptions: state.generalData[FORM_OF_ADMISSION],
        isActiveOptions: state.generalData[IS_ACTIVE],
        accessLevelOptions: state.generalData.accessLevel
    }
}

export default connect(mapStateToProps, {
    getCube,
    getPropVal,
    getPropValWithChilds
})(FundMaker);