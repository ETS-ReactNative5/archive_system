import React, {Component} from 'react';
import {Button, Icon, Input, Modal,Spin, message, DatePicker} from 'antd';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {isEmpty, isEqual, map} from 'lodash';
import moment from "moment/moment";

import AntTable from '../AntTable';
import {
    getCube,
    getFundCountData,
    getObjChildsByConst,
    getPropVal,
    createObj,
    updateCubeData,
    getValueOfMultiText,
    accessConditionsOfFund,
} from '../../actions/actions';
import {getPropMeta, parseCube_new, onSaveCubeData, parseForTable} from '../../utils/cubeParser';
import {
    CUBE_FOR_FUND_AND_IK, DO_FOR_FUND_AND_IK, DP_FOR_FUND_AND_IK, DT_FOR_FUND_AND_IK,
    FUND_CATEGORY,
    FUND_FEATURE,
    FUND_TYPE
} from '../../constants/tofiConstants';
import Select from "../Select";
import SiderCard from "../SiderCard";
import {CSSTransition} from "react-transition-group";
import SearchNSACard from "./SearchNSACard";
import SearchNSAArchiveFund from "./SearchNSAArchiveFund";
const confirm = Modal.confirm;

/* eslint eqeqeq:0 */
class SearchNSA extends Component {
    constructor(props) {
        super(props);

        this.filteredData = [];

        this.state = {
            sortState: true,
            data: [],
            dataRec: [],
            selectedRow: {},
            search: '',
            loading: true,
            errors: {},
            openCard: false,
            modal: {
                visible: false,
                type: '',
                loading: false
            },
            countData: {
                countFund: 0,
                countInv: 0,
                countDelo: 0,
                countDeloFile: 0
            },
            filter: {
                fundNumber: '',
                fundList: '',
                fundIndex: '',
                surnameOriginator:'',
                fundDbeg: '',
                fundDend: '',
                fundIndustryObj: [],
                fundIndustryObjChildren: [],
                fundIndustryObjLoading: false,
                fundCategory: [],
                fundCategoryLoading: false,
                fundType: [],
                fundTypeLoading: false,
                fundFeature: [],
                fundFeatureLoading: false,
            },
            globalDate: moment(),
            sidebarActiveKey: 'archiveFund',
            annotationContentOfDocument: '',
            invMulti: '',
            fundHistoricalNoteMulti: '',
            lastChangeDateScheme: '',
            fundCaseFlags: {
                caseOCD: false,
                irreparablyDamaged: false,
                caseFundOfUse: false,
            },
            registryPeriod: moment(),
        }

    }

    componentDidMount() {
        if (isEmpty(this.props.tofiConstants)) return;
        this.filters = {
            filterDPAnd: [
                {
                    dimConst: DP_FOR_FUND_AND_IK,
                    concatType: "and",
                    conds: [
                        {
                            consts: 'fundNumber,fundHistoricalNote,fundHistoricalNoteMulti,lastChangeDateScheme,invFound,fundIndex,fundDbeg,fundDend,fundCategory,fundFeature,fundArchive,surnameOriginator',
                        }
                    ]
                }
            ],
            filterDOAnd: [
                {
                    dimConst: DO_FOR_FUND_AND_IK,
                    concatType: 'and',
                    conds: [
                        {
                            clss: 'fundOrg,fundLP,collectionOrg,collectionLP,jointOrg,jointLP'
                        }
                    ]
                }
            ],
            filterDTOr: [
                {
                    dimConst: DT_FOR_FUND_AND_IK,
                    concatType: 'and',
                    conds: [
                        {
                            ids: this.state.globalDate.startOf('year').format('YYYYMMDD') + this.state.globalDate.endOf('year').format('YYYYMMDD')
                        }
                    ]
                }
            ]
        };
        this.setState({
            loading: true,
            filter: {
                ...this.state.filter,
                fundFeature: [{
                    value: this.props.tofiConstants.included.id,
                    label: this.props.tofiConstants.included.name[this.lng]
                }]
            }
        });
        const dte = this.state.registryPeriod.format('YYYY-MM-DD');
        this.props.cubeForFundAndIK && this.populate();
        !this.props.cubeForFundAndIK && this.props.getCube(CUBE_FOR_FUND_AND_IK, JSON.stringify(this.filters), {}, dte);
        getFundCountData()
            .then(data => {
                this.setState({countData: {...data}})
            })
    }

    populate = () => {
        const {doForFundAndIK, dpForFundAndIK} = this.props.tofiConstants;
        this.setState(
            {
                loading: false,
                data: parseCube_new(this.props.cubeForFundAndIK['cube'], [], 'dp', 'do', this.props.cubeForFundAndIK[`do_${doForFundAndIK.id}`], this.props.cubeForFundAndIK[`dp_${dpForFundAndIK.id}`], `do_${doForFundAndIK.id}`, `dp_${dpForFundAndIK.id}`)
            }
        );
    };

    componentWillReceiveProps(nextProps) {
        if (!isEmpty(nextProps.cubeForFundAndIK) && !isEmpty(nextProps.tofiConstants) && this.props.cubeForFundAndIK !== nextProps.cubeForFundAndIK) {
            const {doForFundAndIK, dpForFundAndIK} = nextProps.tofiConstants;
            this.setState(
                {
                    loading: false,
                    data: parseCube_new(nextProps.cubeForFundAndIK['cube'], [], 'dp', 'do', nextProps.cubeForFundAndIK[`do_${doForFundAndIK.id}`], nextProps.cubeForFundAndIK[`dp_${dpForFundAndIK.id}`], `do_${doForFundAndIK.id}`, `dp_${dpForFundAndIK.id}`)
                }
            );
        } else {
            this.setState({loading: false});
        }
        if (!isEmpty(nextProps.cubeForFundAndIKRecord) && !isEmpty(nextProps.tofiConstants) && this.props.cubeForFundAndIKRecord !== nextProps.cubeForFundAndIKRecord) {
            const {doForFundAndIK, dpForFundAndIK} = nextProps.tofiConstants;
            const parseCubeData = parseCube_new(
                nextProps.cubeForFundAndIKRecord['cube'],
                [], 'dp', 'do',
                nextProps.cubeForFundAndIKRecord[`do_${doForFundAndIK.id}`],
                nextProps.cubeForFundAndIKRecord[`dp_${dpForFundAndIK.id}`],
                `do_${doForFundAndIK.id}`,
                `dp_${dpForFundAndIK.id}`
            ).map(this.renderRecordData)[0]
            const {fundToGuidbook} = parseCubeData;
            const fundToGuidbookFlag = fundToGuidbook && Array.isArray(fundToGuidbook) ? fundToGuidbook.length > 0 : false;
            this.setState(
                {
                    loading: false,
                    dataRec: parseCubeData,
                    fundCaseFlags: {...this.state.fundCaseFlags, includedInNSA: fundToGuidbookFlag},
                }
            );
        } else {
            this.setState({loading: false});
        }
    }

    loadChilds = (c, props) => {
        return () => {
            if (!this.props[c + 'Options']) {
                this.setState({filter: {...this.state.filter, [c + 'Loading']: true}});
                this.props.getObjChildsByConst(c, props)
                    .then(() => this.setState({filter: {...this.state.filter, [c + 'Loading']: false}}))
                    .catch(err => console.error(err))
            }
        }
    };
    loadOptions = c => {
        return () => {
            if (!this.props[c + 'Options']) {
                this.setState({filter: {...this.state.filter, [c + 'Loading']: true}});
                this.props.getPropVal(c)
                    .then(() => this.setState({filter: {...this.state.filter, [c + 'Loading']: false}}));
            }
        }
    };

    onCreateObj = ({fundType, shortName, name, accessLevel, ...values}) => {

        const cube = {
            cubeSConst: CUBE_FOR_FUND_AND_IK
        };
        const obj = {
            name: shortName,
            fullName: name,
            clsConst: fundType.fundTypeClass,
            accessLevel
        };

        const hideCreateObj = message.loading(this.props.t('CREATING_NEW_OBJECT'), 0);
        return createObj(cube, obj)
            .then(res => {
                hideCreateObj();
                if (res.success) {
                    return this.onSaveCubeData(values, res.data.idItemDO, {})
                } else {
                    if (res.errors) {
                        res.errors.forEach(err => {
                            message.error(err.text)
                        })
                    }
                }
            }).catch(err => {
                console.error(err)
            })
    };

    /*
      onSaveCubeData= (objVerData, prefix, {method, protocol, ...values}, doItemProp, objDataProp, valOld) => {
        let datas = [];
        this.setState({loading:true})
        try {
          datas = [{
            own: [{doConst: objVerData.cube.doConst, doItem: doItemProp, isRel: "0", objData: objDataProp }],
            props: map(values, (val, key) => {
              console.log(values, val, key)
              const propMetaData = getPropMeta(this.props[objVerData.cube.cubeSConst + prefix]["dp_" + this.props.tofiConstants[objVerData.cube.dpConst].id], this.props.tofiConstants[key]);
              console.log(val, valOld, valOld[key], key);
              let value = val;
              let oldValue = valOld[key];
              if((propMetaData.typeProp === 315 || propMetaData.typeProp === 311 || propMetaData.typeProp === 317) && typeof val === 'string'){
                value = {kz: val, ru: val, en: val};
                oldValue = oldValue && {kz: valOld[key], ru: valOld[key], en: valOld[key]};
              }
              if(propMetaData.typeProp === 312 && typeof value === 'string') {
                value = value.split('-').reverse().join('-');
                oldValue = oldValue && oldValue.split('-').reverse().join('-');
              }
              if(val && typeof val === 'object' && val.value) {
                value = String(val.value);
                oldValue = oldValue && String(valOld[key].value);
              }
              if(val && typeof val === 'object' && val.mode) propMetaData.mode = val.mode;
              if(propMetaData.isUniq === 2 && val[0] && val[0].value) {
                propMetaData.mode = val[0].mode;
                value = val.map(v => String(v.value)).join(",");
                oldValue = oldValue && valOld[key].map(v => String(v.value)).join(",");
              }
              return {propConst: key, val: value, oldValue, typeProp: String(propMetaData.typeProp), periodDepend: String(propMetaData.periodDepend), isUniq: String(propMetaData.isUniq), mode: propMetaData.mode }
            }),
            periods: [{ periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31' }]
          }];
        } catch(err) {
          console.error(err);
          return err;
        }
        const hideLoading = message.loading(this.props.t('UPDATING_PROPS'), 0);
        return updateCubeData(objVerData.cube.cubeSConst, moment().format('YYYY-MM-DD'), JSON.stringify(datas), {}, {method, protocol})
          .then(res => {
            hideLoading();
            if(res.success) {
              message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'));
              if(this.filters) {
                this.setState({loading: true});
                const dte = this.state.registryPeriod.format('YYYY-MM-DD');
                return this.props.getCube('cubeDocuments', JSON.stringify(this.filters), {}, dte)
                  .then(() => {
                    this.setState({loading: false, openCard: false, flagSave: false});
                    return {success: true}
                  })
              } else {
                return {success: true}
              }
            } else {
              message.error(this.props.t('PROPS_UPDATING_ERROR'));
              if(res.errors) {
                res.errors.forEach(err => {
                  message.error(err.text);
                });
                return {success: false}
              }
            }
          })
      };
    */

    onSaveCubeData = (values, doItemProp, objDataProp) => {
        let datas = [];
        try {
            datas = [{
                own: [{doConst: DO_FOR_FUND_AND_IK, doItem: doItemProp, isRel: "0", objData: objDataProp}],
                props: map(values, (val, key) => {
                    const propMetaData = getPropMeta(this.props.cubeForFundAndIKRecord["dp_" + this.props.tofiConstants[DP_FOR_FUND_AND_IK].id], this.props.tofiConstants[key]);
                    let value = val;
                    if ((propMetaData.typeProp === 315 || propMetaData.typeProp === 311 || propMetaData.typeProp === 317) && typeof val === 'string') value = {
                        kz: val,
                        ru: val,
                        en: val
                    };
                    if (val && typeof val === 'object' && val.value) value = String(val.value);
                    if (val && typeof val === 'object' && val.mode) propMetaData.mode = val.mode;
                    if (propMetaData.isUniq === 2 && val[0] && val[0].value) {
                        propMetaData.mode = val[0].mode;
                        value = val.map(v => String(v.value)).join(",");
                    }
                    return {
                        propConst: key,
                        val: value,
                        typeProp: String(propMetaData.typeProp),
                        periodDepend: String(propMetaData.periodDepend),
                        isUniq: String(propMetaData.isUniq),
                        mode: propMetaData.mode
                    }
                }),
                periods: [{periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31'}]
            }];
        } catch (err) {
            console.error(err);
            return Promise.reject();
        }
        const hideLoading = message.loading(this.props.t('UPDATING_PROPS'), 30);
        return updateCubeData(CUBE_FOR_FUND_AND_IK, moment().format('YYYY-MM-DD'), JSON.stringify(datas))
            .then(res => {
                hideLoading();
                if (res.success) {
                    message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'));
                    this.setState({loading: true});
                    const dte = this.state.registryPeriod.format('YYYY-MM-DD');
                    return this.props.getCube(CUBE_FOR_FUND_AND_IK, JSON.stringify(this.filters), {}, dte)
                        .then(() => {
                            message.success(this.props.t("PROPS_SUCCESSFULLY_UPDATED"));

                            this.setState({loading: false, openCard: false});
                            return {success: true}
                        })
                } else {
                    message.error(this.props.t('PROPS_UPDATING_ERROR'));
                    if (res.errors) {
                        res.errors.forEach(err => {
                            message.error(err.text);
                        });
                        return Promise.reject();
                    }
                }
            })
    };

    refreshRecord = (values) => {

        const cube = {
            cubeSConst: 'cubeForFundAndIK',
            doConst: 'doForFundAndIK',
            dpConst: 'dpForFundAndIK',
            data: this.props.cubeForFundAndIKRecord
        };
        const obj = {
            doItem: this.state.selectedRow.key
        };
        const hideLoading = message.loading(this.props.t('UPDATING_PROPS'), 30);

        return onSaveCubeData({cube, obj}, {values: values, idDPV: this.withIdDPV}, this.props.tofiConstants)
            .then(res => {
                hideLoading();
                if (res.success) {
                    message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'));
                }else {
                    message.error(this.props.t('PROPS_UPDATING_ERROR'));
                    if (res.errors) {
                        res.errors.forEach(err => {
                            message.error(err.text);
                        });

                    }
                }

            })
        //return onSaveCubeData({cube, obj}, {oFiles: values}, this.props.tofiConstants)
    };

    refreshRecord2 = (values) => {
        const cube = {
            cubeSConst: 'cubeForFundAndIK',
            doConst: 'doForFundAndIK',
            dpConst: 'dpForFundAndIK',
            data: this.props.cubeForFundAndIKRecord
        };
        const obj = {
            doItem: this.state.selectedRow.key
        };
        const hideLoading = message.loading(this.props.t('UPDATING_PROPS'), 30);

        return onSaveCubeData({cube, obj}, {oFiles: values, idDPV: this.withIdDPV}, this.props.tofiConstants)
            .then(res => {
                hideLoading();
                if (res.success) {
                    message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'));
                }else {
                    message.error(this.props.t('PROPS_UPDATING_ERROR'));
                    if (res.errors) {
                        res.errors.forEach(err => {
                            message.error(err.text);
                        });

                    }
                }

            })
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

    onFundCategoryChange = s => {
        this.setState({filter: {...this.state.filter, fundCategory: s}})
    };
    onFundTypeChange = s => {
        this.setState({filter: {...this.state.filter, fundType: s}})
    };
    onFundFeatureChange = s => {
        this.setState({filter: {...this.state.filter, fundFeature: s}})
    };
    onFundIndustryObjChange = s => {
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
                fundIndustryObj: s,
                fundIndustryObjChildren: getLastChildren(this.props.fundIndustryObjOptions, s)
            }
        })
        // this.setState({ filter: {...this.state.filter, fundIndustryObj: s} })
    };

    remove = id => {
        const newData = this.state.data.filter(item => item.id !== id);
        this.setState({data: newData});
    };

    changeSelectedRow = rec => {
        if (isEmpty(this.state.selectedRow) || (!this.state.openCard && !isEqual(this.state.selectedRow, rec))) {
            this.setState({selectedRow: rec, sidebarActiveKey: 'archiveFund'});
            return;
        }
        if (!this.state.openCard && isEqual(this.state.selectedRow, rec)) {
            this.requestAccessConditionsOfFund(rec);
            this.requestRecord(rec);
            this.setState({openCard: true, sidebarActiveKey: 'archiveFund'});
        }
        if (this.state.openCard && !isEqual(this.state.selectedRow, rec)) {
            this.requestRecord(rec);
            this.requestAccessConditionsOfFund(rec);
            this.setState({selectedRow: rec, sidebarActiveKey: 'archiveFund'});
        }
    };

    requestRecord(rec) {
        const year = this.state.registryPeriod.format('YYYY');
        const dte = year + '0101' + year + '1231';
        const dte2 = this.state.registryPeriod.format('YYYY-MM-DD');
        const options = {
            customKey: 'cubeForFundAndIKRecord',
        };
        this.filterRec = {
            filterDOAnd: [
                {
                    dimConst: 'doForFundAndIK',
                    concatType: "and",
                    conds: [
                        {
                            ids: rec.key
                        }
                    ]
                }
            ],
            filterDTOr: [
                {
                    dimConst: 'dtForFundAndIK',
                    conds: [
                        {
                            ids: dte,
                        }
                    ]
                }
            ]
        };
        this.props.getCube('cubeForFundAndIK', JSON.stringify(this.filterRec), options, dte2);
    };

    requestAccessConditionsOfFund(rec) {
        accessConditionsOfFund(String(rec.key.split('_')[1]))
            .then(data => {
                if (data) {
                    this.setState({
                        fundCaseFlags: {
                            caseOCD: data.NOCD,
                            irreparablyDamaged: data.NP,
                            caseFundOfUse: data.NU,
                        }
                    })
                }
            })
            .catch(err => console.error(err))
    };

    renderTableFooter = () => {
        const {countFund, countInv, countDelo, countDeloFile} = this.state.countData;
        return (
            <div className="table-footer">
                <div className="flex">
                    <div className="label"><label htmlFor="">{this.props.t('COUNT_FUNDS')}</label><Input size='small'
                                                                                                         type="text"
                                                                                                         readOnly
                                                                                                         value={countFund}/>
                    </div>
                    <div className="label"><label htmlFor="">{this.props.t('COUNT_INVENT')}</label><Input size='small'
                                                                                                          type="text"
                                                                                                          readOnly
                                                                                                          value={countInv}/>
                    </div>
                    <div className="label"><label htmlFor="">{this.props.t('COUNT_CASES')}</label><Input size='small'
                                                                                                         type="text"
                                                                                                         readOnly
                                                                                                         value={countDelo}/>
                    </div>
                    <div className="label"><label htmlFor="">{this.props.t('COUNT_CASES_WITH_ELECTR')}</label><Input
                        size='small' type="text" readOnly value={countDeloFile}/></div>
                </div>
                <div className="data-length">
                    <div className="label"><label htmlFor="">Всего:</label><Input size='small' type="text" readOnly
                                                                                  value={this.filteredData.length + ' / ' + this.state.data.length}/>
                    </div>
                </div>
            </div>
        )
    };

    renderTableData = (item, idx) => {
        const {
            fundDbeg, fundDend, fundNumber, fundIndex, fundCategory, fundFeature,
            fundIndustry, fundmakerOfIK, fundmakerMulti, fundExitDate, fundExitReason, fundToGuidbook,
            fundFirstDocFlow, fundDateOfLastCheck, collectionCreateDate, creationConds,
            creationReason, creationPrinciple, collectionLocation,lastChangeDateScheme,
            caseOCD, irreparablyDamaged, caseFundOfUse, propAuthenticity, typeOfPaperCarrier,fundHistoricalNoteMulti,fundHistoricalNote,surnameOriginator,
            // fundAnnotationFile, invFile,
        } = this.props.tofiConstants;
        const fundNumbObj = item.props.find(element => element.prop == fundNumber.id).values,
            fundIndexObj = item.props.find(element => element.prop == fundIndex.id),
            fundCategoryObj = item.props.find(element => element.prop == fundCategory.id),
            fundFeatureObj = item.props.find(element => element.prop == fundFeature.id),
            fundDbegObj = item.props.find(element => element.prop == fundDbeg.id),
            fundDendObj = item.props.find(element => element.prop == fundDend.id),
            fundIndustryObj = item.props.find(element => element.prop == fundIndustry.id),
            fundToGuidbookObj = item.props.find(element => element.prop == fundToGuidbook.id),
            fundmakerOfIKObj = item.props.find(element => element.prop == fundmakerOfIK.id),
            fundmakerMultiObj = item.props.find(element => element.prop == fundmakerMulti.id),
            fundExitDateObj = item.props.find(element => element.prop == fundExitDate.id),
            fundExitReasonObj = item.props.find(element => element.prop == fundExitReason.id),
            fundFirstDocFlowObj = item.props.find(element => element.prop == fundFirstDocFlow.id),
            fundDateOfLastCheckObj = item.props.find(element => element.prop == fundDateOfLastCheck.id),
            collectionCreateDateObj = item.props.find(element => element.prop == collectionCreateDate.id),
            creationCondsObj = item.props.find(element => element.prop == creationConds.id),
            creationReasonObj = item.props.find(element => element.prop == creationReason.id),
            creationPrincipleObj = item.props.find(element => element.prop == creationPrinciple.id),
            collectionLocationObj = item.props.find(element => element.prop == collectionLocation.id),
            lastChangeDateSchemeObj=item.props.find(element => element.prop == lastChangeDateScheme.id),
            fundHistoricalNoteObj=item.props.find(element => element.prop ==  fundHistoricalNote.id),
            fundHistoricalNoteMultiObj= item.props.find(element => element.prop == fundHistoricalNoteMulti.id),
            surnameOriginatorObj = item.props.find(element => element.prop === surnameOriginator.id),
            fundTypeObj = this.props.tofiConstants[
                ['fundOrg', 'fundLP', 'collectionOrg', 'collectionLP', 'jointOrg', 'jointLP']
                    .find(c => this.props.tofiConstants[c].id == item.clsORtr)];

        const accessLevelObj = this.props.accessLevelOptions.find(al => al.id === item.accessLevel);

        const caseOCDObj = item.props.find(element => element.prop === caseOCD.id);
        const irreparablyDamagedObj = item.props.find(element => element.prop === irreparablyDamaged.id);
        const caseFundOfUseObj = item.props.find(element => element.prop === caseFundOfUse.id);
        const propAuthenticityObj = item.props.find(element => element.prop === propAuthenticity.id);
        return {
            key: item.id,
            shortName: item.name,
            name: item.fullName,
            accessLevel: accessLevelObj && {value: accessLevelObj.id, label: accessLevelObj.name[this.lng]},
            fundmakerOfIK: fundmakerOfIKObj && fundmakerOfIKObj.cube && fundmakerOfIKObj.cube.idRef ? {
                value: fundmakerOfIKObj.cube.idRef,
                label: fundmakerOfIKObj.value
            } : {},
            fundToGuidbook: fundToGuidbookObj && fundToGuidbookObj.values ? fundToGuidbookObj.values : [],
            fundmakerMulti: fundmakerMultiObj && fundmakerMultiObj.values ? fundmakerMultiObj.values : [],
            fundExitDate: fundExitDateObj && fundExitDateObj.value ? moment(fundExitDateObj.value, 'DD-MM-YYYY') : null,
            fundFirstDocFlow: fundFirstDocFlowObj && fundFirstDocFlowObj.value ? moment(fundFirstDocFlowObj.value, 'DD-MM-YYYY') : null,
            fundDateOfLastCheck: fundDateOfLastCheckObj && fundDateOfLastCheckObj.value ? moment(fundDateOfLastCheckObj.value, 'DD-MM-YYYY') : null,
            collectionCreateDate: collectionCreateDateObj && collectionCreateDateObj.value ? moment(collectionCreateDateObj.value, 'DD-MM-YYYY') : null,
            fundType: fundTypeObj ? {
                value: fundTypeObj.id,
                label: fundTypeObj.name[this.lng],
                fundTypeClass: fundTypeObj.constName
            } : {},
            fundList: item.name ? item.name[this.lng] || '' : '',
            fundNumber: fundNumbObj ? fundNumbObj || '' : '',
            fundIndex: fundIndexObj && fundIndexObj.values ? fundIndexObj.values || '' : '',
            fundDend: fundDendObj.values ? fundDendObj.values || '' : '',
            fundDbeg: fundDbegObj.values ? fundDbegObj.values || '' : '',
            fundCategory: fundCategoryObj && fundCategoryObj.values ? fundCategoryObj.values : {},
            fundFeature: fundFeatureObj && fundFeatureObj.values ? fundFeatureObj.values : {},
            fundExitReason: fundExitReasonObj && fundExitReasonObj.valueLng,
            creationConds: creationCondsObj && creationCondsObj.valueLng,
            creationReason: creationReasonObj && creationReasonObj.valueLng,
            creationPrinciple: creationPrincipleObj && creationPrincipleObj.valueLng,
            collectionLocation: collectionLocationObj && collectionLocationObj.valueLng,
            fundIndustry: fundIndustryObj && fundIndustryObj.values && fundIndustryObj.values.length > 0 ? fundIndustryObj.values.sort((a, b) => a.value > b.value)[fundIndustryObj.values.length - 1] : {},
            lastChangeDateScheme:lastChangeDateSchemeObj && lastChangeDateSchemeObj.values ? lastChangeDateSchemeObj.values : {value : moment().format("DD-MM-YYYY")},
            fundHistoricalNoteMulti:fundHistoricalNoteMultiObj && fundHistoricalNoteMultiObj.values ? fundHistoricalNoteMultiObj.values : [],
            fundHistoricalNote:fundHistoricalNoteObj && fundHistoricalNoteObj.values ? fundHistoricalNoteObj.values : [],
            surnameOriginator: surnameOriginatorObj && surnameOriginatorObj.values ? surnameOriginatorObj.values.label : "" ,
        }
    };
    renderRecordData = (item) => {
        const constArr = ['fundToGuidbook', 'accessDocument', 'locationOfSupplementaryMaterials',
            'fundAnnotationFile', 'invFile', 'fundHistoricalNote','fundHistoricalNote','fundHistoricalNoteMulti','lastChangeDateScheme','invFound'];
        const result = {
            key: item.id
        };
        this.withIdDPV = parseForTable(item.props, this.props.tofiConstants, result, constArr)
        return result;
    };

    onSideBarTabClick = (key) => {
        if (this.state.sidebarActiveKey === key) return;
        switch (key) {
            case 'annotation': {
                const result = {
                    annotationContentOfDocument: {},
                    invMulti: {},
                    fundHistoricalNoteMulti: {},
                }
                getValueOfMultiText(
                    this.state.selectedRow.key.split('_')[1],
                    'annotationContentOfDocument,invMulti,fundHistoricalNoteMulti'
                ).then(res => {
                    if (res.success) {
                        ['annotationContentOfDocument', 'invMulti', 'fundHistoricalNoteMulti'].forEach(c => {
                            const obj = res.data.find(o => o.prop == this.props.tofiConstants[c].id);
                            if (obj === undefined) {
                                result[c] = {idDataPropVal: '', value: ''};
                            } else {
                                result[c] = {idDataPropVal: obj.idDataPropVal, value: obj.valueMultiStr[this.lng]};
                            }
                        });
                        this.setState({
                            annotationContentOfDocument: result.annotationContentOfDocument,
                            invMulti: result.invMulti,
                            fundHistoricalNoteMulti: result.fundHistoricalNoteMulti,
                        })

                    } else {
                        res.errors.forEach(err => message.error(err.text))
                    }
                }).catch(err => {
                    console.warn(err);
                })
                break;
            }
        }
        this.setState({sidebarActiveKey: key});
    };

    onChangePeriod = (value) => {
        if (value === null) value = moment();
        if (value === this.state.registryPeriod) return;
        this.setState({registryPeriod: value}, () => {
            this.setState({
                loading: true,
                //filter: {
                //  ...this.state.filter,
                //  fundFeature: [{value: this.props.tofiConstants.included.id, label: this.props.tofiConstants.included.name[this.lng]}]
                //}
            });
            const dte = this.state.registryPeriod.format('YYYY-MM-DD');
            this.props.getCube(CUBE_FOR_FUND_AND_IK, JSON.stringify(this.filters), {}, dte);
            getFundCountData()
                .then(data => {
                    this.setState({countData: {...data}})
                })
        });
    };
    onChange = (pagination, filters, sorter) => {
        if (sorter.columnKey === "fundNumber") {
            this.setState({sortState: !this.state.sortState});
        }
    }

    closeCard=()=>{
        this.setState({openCard: false})
    }

    render() {
        if (isEmpty(this.props.tofiConstants)) return null;
        const {loading, selectedRow, data, filter, fundCaseFlags} = this.state;
        const {annotationContentOfDocument, invMulti, fundHistoricalNoteMulti,lastChangeDateScheme} = this.state;
        const {
            t, tofiConstants,
            tofiConstants: {fundNumber, fundDbeg, fundDend, fundIndex, fundCategory, fundFeature, fundIndustry}
        } = this.props;
        this.filteredData = data.map(this.renderTableData).filter(item => {

            return (
                (!!item.fundIndex ? item.fundIndex.value.toLowerCase().includes(filter.fundIndex.toLowerCase()) : true) &&
                (!!item.fundNumber ? String(item.fundNumber.value.toLowerCase()).includes(String(filter.fundNumber.toLowerCase())) : true) &&
                item.fundList.toLowerCase().includes(filter.fundList.toLowerCase()) &&
                (!!item.fundDbeg ? item.fundDbeg.value.toLowerCase().includes(filter.fundDbeg.toLowerCase()) : true) &&
                (!!item.fundDend ? item.fundDend.value.toLowerCase().includes(filter.fundDend.toLowerCase()) : true) &&
                ( filter.fundCategory.length === 0 || filter.fundCategory.some(p => (item.fundCategory && p.value == item.fundCategory.value)) ) &&
                ( filter.fundFeature.length === 0 || filter.fundFeature.some(p => (item.fundFeature && p.value == item.fundFeature.value)) ) &&
                ( filter.fundType.length === 0 || filter.fundType.some(p => (item.fundType && p.value == item.fundType.value)) ) &&
                ( filter.fundIndustryObjChildren.length === 0 || filter.fundIndustryObjChildren.some(p => p.value == item.fundIndustry.value) )
            )
        });
        this.lng = localStorage.getItem('i18nextLng');

        return (
            <div className="fundsList" ref={node => this.fundList = node}>
                <div className="title">
                    <h2>{t('DESCRIPTION_FUNDS')}</h2>
                    <DatePicker
                        disabled={this.state.openCard || loading}
                        value={this.state.registryPeriod}
                        onChange={this.onChangePeriod}
                    />
                </div>
                <div className="fundsList__heading">
                    {/* <div className="fundsList__heading-buttons">
            <Button onClick={() => {
              const accessLevelObj = this.props.accessLevelOptions.find(al => al.id === 1);
              this.setState({
                openCard: true,
                selectedRow: {
                  accessLevel: {value: accessLevelObj.id, label: accessLevelObj.name[this.lng]},
                  fundFeature: {value: this.props.tofiConstants.included.id, label: this.props.tofiConstants.included.name[this.lng]}
                } })
            }}>{t('ADD')}</Button>
            <Link to={{
              pathname: `/archiveFund/editFundCard/${selectedRow.key}`,
              state: {
                fund: {
                  key: selectedRow.key,
                  name: selectedRow.name
                }
              }
            }}><Button disabled={ isEmpty(selectedRow) }>{t('VIEW_INVENTORIES')}</Button>
            </Link>
            <Button icon='printer'>Отчеты</Button>
          </div> */}
                    <div className="label-select">
                        <Select
                            name="fundCategory"
                            isMulti
                            isSearchable={false}
                            disabled={this.state.openCard || loading}
                            value={filter.fundCategory}
                            onChange={this.onFundCategoryChange}
                            isLoading={filter.fundCategoryLoading}
                            options={this.props.fundCategoryOptions ? this.props.fundCategoryOptions.map(option => ({
                                value: option.id,
                                label: option.name[this.lng]
                            })) : []}
                            placeholder={fundCategory.name[this.lng]}
                            onMenuOpen={this.loadOptions(FUND_CATEGORY)}
                        />
                    </div>
                    <div className="label-select">
                        <Select
                            name="fundType"
                            isMulti
                            isSearchable={false}
                            disabled={this.state.openCard || loading}
                            value={filter.fundType}
                            onChange={this.onFundTypeChange}
                            options={
                                ['fundOrg', 'fundLP', 'collectionOrg', 'collectionLP', 'jointOrg', 'jointLP']
                                    .map(c => ({
                                        value: this.props.tofiConstants[c].id,
                                        label: this.props.tofiConstants[c].name[this.lng]
                                    }))
                            }
                            placeholder={t('FUND_TYPE')}
                        />

                    </div>
                    <div className="label-select">
                        <Select
                            name="fundFeature"
                            isMulti
                            isSearchable={false}
                            disabled={this.state.openCard || loading}
                            value={filter.fundFeature}
                            onChange={this.onFundFeatureChange}
                            isLoading={filter.fundFeatureLoading}
                            options={this.props.fundFeatureOptions ? this.props.fundFeatureOptions.map(option => ({
                                value: option.id,
                                label: option.name[this.lng]
                            })) : []}
                            placeholder={fundFeature.name[this.lng]}
                            onMenuOpen={this.loadOptions('fundFeature')}
                        />
                    </div>
                    <div className="label-select">
                        {/* <Select
              name="fundIndustry"
              isMulti
              value={filter.fundIndustryObj}
              onChange={this.onFundIndustryObjChange}
              isLoading={filter.fundIndustryObjLoading}
              options={this.props.fundIndustryObjOptions ? this.props.fundIndustryObjOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
              placeholder={fundIndustry.name[this.lng]}
              onMenuOpen={this.loadChilds('fundIndustryObj')}
            /> */}
                    </div>
                </div>
                <div className="fundsList__body">
                    <AntTable
                        onChange={this.onChange}
                        columns={
                            [
                                {
                                    key: 'fundNumber',
                                    title: t('FUND_NUMB'),
                                    dataIndex: 'fundNumber',
                                    width: "8%",
                                    sortOrder: this.state.sortState ? 'ascend' : 'descend',
                                    filterDropdown: (
                                        <div className="custom-filter-dropdown">
                                            <Input
                                                name="fundNumber"
                                                suffix={filter.fundNumber ?
                                                    <Icon type="close-circle" data-name="fundNumber"
                                                          onClick={this.emitEmpty}/> : null}
                                                ref={ele => this.fundNumber = ele}
                                                placeholder="Поиск"
                                                value={filter.fundNumber}
                                                onChange={this.onInputChange}
                                            />
                                        </div>
                                    ),
                                    filterIcon: <Icon type="filter"
                                                      style={{color: filter.fundNumber ? '#ff9800' : '#aaa'}}/>,
                                    onFilterDropdownVisibleChange: (visible) => {
                                        this.setState({
                                            filterDropdownVisible: visible,
                                        }, () => this.fundNumber.focus());
                                    },
                                    sorter: (a, b) => ((a.fundNumber.value && a.fundNumber.value).replace(/[^0-9]/g, '')) - ((b.fundNumber.value && b.fundNumber.value).replace(/[^0-9]/g, '')),
                                    render: obj => !!obj.value ? obj.value : ""
                                },

                                {
                                    key: 'fundIndex',
                                    title: fundIndex.name[this.lng] || '',
                                    dataIndex: 'fundIndex',
                                    width: "8%",
                                    render: obj => !!obj.value ? obj.value : "",

                                    filterDropdown: (
                                        <div className="custom-filter-dropdown">
                                            <Input
                                                name="fundIndex"
                                                suffix={filter.fundIndex ?
                                                    <Icon type="close-circle" data-name="fundIndex"
                                                          onClick={this.emitEmpty}/> : null}
                                                ref={ele => this.fundIndex = ele}
                                                placeholder="Поиск"
                                                value={filter.fundIndex}
                                                onChange={this.onInputChange}
                                            />
                                        </div>
                                    ),
                                    filterIcon: <Icon type="filter"
                                                      style={{color: filter.fundIndex ? '#ff9800' : '#aaa'}}/>,
                                    onFilterDropdownVisibleChange: (visible) => {
                                        this.setState({
                                            filterDropdownVisible: visible,
                                        }, () => this.fundIndex.focus());
                                    }
                                },
                                {
                                    key: 'fundList',
                                    title: 'Название фонда',
                                    dataIndex: 'fundList',
                                    width: "25%",
                                    sorter: (a, b) => b.fundList.localeCompare(a.fundList),
                                    filterDropdown: (
                                        <div className="custom-filter-dropdown">
                                            <Input
                                                name="fundList"
                                                suffix={filter.fundList ? <Icon type="close-circle" data-name="fundList"
                                                                                onClick={this.emitEmpty}/> : null}
                                                ref={ele => this.fundList = ele}
                                                placeholder="Поиск"
                                                value={filter.fundList}
                                                onChange={this.onInputChange}
                                            />
                                        </div>
                                    ),
                                    filterIcon: <Icon type="filter"
                                                      style={{color: filter.fundList ? '#ff9800' : '#aaa'}}/>,
                                    onFilterDropdownVisibleChange: (visible) => {
                                        this.setState({
                                            filterDropdownVisible: visible,
                                        }, () => this.fundList.focus());
                                    }
                                },
                                {
                                    key: 'fundDbeg',
                                    title: fundDbeg.name[this.lng] || '',
                                    dataIndex: 'fundDbeg',
                                    width: "13%",
                                    render: obj => !!obj.value ? obj.value : "",

                                    filterDropdown: (
                                        <div className="custom-filter-dropdown">
                                            <Input
                                                name="fundDbeg"
                                                suffix={filter.fundDbeg ? <Icon type="close-circle" data-name="fundDbeg"
                                                                                onClick={this.emitEmpty}/> : null}
                                                ref={ele => this.fundDbeg = ele}
                                                placeholder="Поиск"
                                                value={filter.fundDbeg}
                                                onChange={this.onInputChange}
                                            />
                                        </div>
                                    ),
                                    filterIcon: <Icon type="filter"
                                                      style={{color: filter.fundDbeg ? '#ff9800' : '#aaa'}}/>,
                                    onFilterDropdownVisibleChange: (visible) => {
                                        this.setState({
                                            filterDropdownVisible: visible,
                                        }, () => this.fundDbeg.focus());
                                    }
                                },
                                {
                                    key: 'fundDend',
                                    title: fundDend.name[this.lng] || '',
                                    dataIndex: 'fundDend',
                                    render: obj => !!obj.value ? obj.value : "",

                                    width: "13%",
                                    filterDropdown: (
                                        <div className="custom-filter-dropdown">
                                            <Input
                                                name="fundDend"
                                                suffix={filter.fundDend ? <Icon type="close-circle" data-name="fundDend"
                                                                                onClick={this.emitEmpty}/> : null}
                                                ref={ele => this.fundDend = ele}
                                                placeholder="Поиск"
                                                value={filter.fundDend}
                                                onChange={this.onInputChange}
                                            />
                                        </div>
                                    ),
                                    filterIcon: <Icon type="filter"
                                                      style={{color: filter.fundDend ? '#ff9800' : '#aaa'}}/>,
                                    onFilterDropdownVisibleChange: (visible) => {
                                        this.setState({
                                            filterDropdownVisible: visible,
                                        }, () => this.fundDend.focus());
                                    }
                                },
                                {
                                    key: 'fundCategory',
                                    title: fundCategory.name[this.lng] || '',
                                    dataIndex: 'fundCategory',
                                    width: "13%",
                                    render: obj => obj && obj.label
                                },
                                {
                                    key: 'fundType',
                                    title: 'Тип фонда',
                                    dataIndex: 'fundType',
                                    width: "13%",
                                    render: obj => obj && obj.label
                                },
                                // {
                                //   key: 'action',
                                //   title: '',
                                //   dataIndex: '',
                                //   width: '9%',
                                //   render: (text, record) => {
                                //     return (
                                //       <div className="editable-row-operations" style={{ display: 'flex' }}>
                                //         <Button icon="edit" className="green-btn" style={{marginRight: '5px'}} disabled={selectedRow.key !== record.key}/>
                                //       </div>
                                //     );
                                //   },
                                // }
                            ]
                        }
                        scroll={{y: '100%'}}
                        loading={loading}
                        openedBy="ArchiveFundList"
                        changeSelectedRow={this.changeSelectedRow}
                        dataSource={this.filteredData}
                        footer={this.renderTableFooter}
                    />
                    <CSSTransition
                        in={this.state.openCard}
                        timeout={300}
                        classNames="card"
                        unmountOnExit
                    >
                        <SiderCard
                            closer={<Button type='danger' onClick={() => this.setState({openCard: false})}
                                            shape="circle" icon="arrow-right"/>}
                        >
                            <SearchNSACard
                                t={t}
                                tofiConstants={tofiConstants}
                                initialValues={selectedRow}
                                record={this.state.selectedRow}
                                dataRec={this.state.dataRec}
                                onTabClick={this.onSideBarTabClick}
                                onSave={this.refreshRecord}
                                onSave2={this.refreshRecord2}
                                activeKey={this.state.sidebarActiveKey}
                                annotationContentOfDocument={annotationContentOfDocument}
                                invMulti={invMulti}
                                closeCard={this.closeCard}
                                withIdDPV={this.withIdDPV}
                                fundHistoricalNoteMulti={fundHistoricalNoteMulti}
                                fundCaseFlags={fundCaseFlags}
                            />
                        </SiderCard>
                    </CSSTransition>
                </div>
            </div>
        )
    }
}

SearchNSA.propTypes = {
    t: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired,
    tofiConstants: PropTypes.shape()
};

function mapStateToProps(state) {
    return {
        cubeForFundAndIK: state.cubes[CUBE_FOR_FUND_AND_IK],
        cubeForFundAndIKRecord: state.cubes['cubeForFundAndIKRecord'],
        tofiConstants: state.generalData.tofiConstants,
        fundCategoryOptions: state.generalData[FUND_CATEGORY],
        fundFeatureOptions: state.generalData[FUND_FEATURE],
        fundIndustryObjOptions: state.generalData.fundIndustryObj,
        accessLevelOptions: state.generalData.accessLevel,
        user: state.auth.user,
    }
}

export default connect(mapStateToProps, {getCube, getPropVal, getObjChildsByConst, accessConditionsOfFund})(SearchNSA);
