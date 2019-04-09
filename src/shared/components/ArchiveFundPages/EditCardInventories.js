import React, {Component} from 'react';
import {Button, Icon, Input, Popconfirm} from 'antd';
import {connect} from 'react-redux';
import {isEmpty, isEqual, map} from 'lodash';
import axios from "axios"
import AntTable from '../AntTable';
import {createObj, dObj, getCasesCount, getCube, getPropVal, updateCubeData} from '../../actions/actions';
import {getPropMeta, parseCube_new, parseForTable} from '../../utils/cubeParser';
import {
    CUBE_FOR_AF_INV,
    DO_FOR_INV, DP_FOR_INV
} from '../../constants/tofiConstants';
import SiderCard from "../SiderCard";
import InventoriesListCard from "./InventoriesListCard";
import {CSSTransition} from "react-transition-group";
import {Link} from "react-router-dom";
import Select from "../Select";
import {message} from "antd/lib/index";
import moment from "moment/moment";

/*eslint eqeqeq:0*/
class EditCardInventories extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            numberFull: [],
            loading: true,
            openCard: false,
            search: '',
            selectedRow: {},
            countData: {
                countFund: 0,
                countDelo: 0,
                countDeloFile: 0
            },
            filter: {
                invType: [],
                invTypeLoading: false,
                documentType: [],
                documentTypeLoading: false,
                name: '',
                invNumber: '',
                invDates: ''
            }
        }
    }

    componentDidMount() {
        this.filters = {
            filterDOAnd: [
                {
                    dimConst: DO_FOR_INV,
                    concatType: "and",
                    conds: [
                        {
                            data: {
                                valueRef: {
                                    id: this.props.match.params.idFundCard
                                }
                            }
                        }
                    ]
                }
            ]
        };
        this.props.getCube(CUBE_FOR_AF_INV, JSON.stringify(this.filters))
            .then(() => this.setState({loading: false}))
            .catch(err => {
                console.error(err);
                this.setState({loading: false})
            })


    }

    componentWillReceiveProps(nextProps) {
        if (isEmpty(this.props.tofiConstants)) return;
        const {doForInv, dpForInv} = nextProps.tofiConstants;
        this.setState(
            {
                loading: false,
                data: parseCube_new(nextProps.CubeForAF_Inv['cube'], [], 'dp', 'do', nextProps.CubeForAF_Inv[`do_${doForInv.id}`], nextProps.CubeForAF_Inv[`dp_${dpForInv.id}`], `do_${doForInv.id}`, `dp_${dpForInv.id}`)
            }, () => {
                this.state.data.map((el) => {
                    let fdGetCountFund = new FormData();
                    fdGetCountFund.append('idInv', el.id.split('_')[1]);
                    axios.post(`/${localStorage.getItem('i18nextLng')}/archiveFund/countCasesOfInv`, fdGetCountFund).then(res => {
                        if (res.data.success === true) {
                            this.setState({
                                numberFull: this.state.numberFull.concat({
                                    key: el.id.split('_')[1],
                                    value: res.data.data.countCasesOfInv
                                })
                            })
                        }
                    })
                })

            }
        );
        try {
            const ids = nextProps.CubeForAF_Inv[`do_${nextProps.tofiConstants.doForInv.id}`].map(dimObj => dimObj.id);
            getCasesCount(JSON.stringify(ids), 'CubeForAF_Inv', 'doForInv')
                .then(caseData => {
                    if (caseData) {
                        this.setState({
                            countData: {
                                ...this.state.countData,
                                countFund: 1,
                                countDelo: caseData.cntCases,
                                countDeloFile: caseData.cntEO
                            }
                        })
                    }
                })
        } catch (err) {
            console.warn(err);
        }
    }

    changeSelectedRow = rec => {
        if (isEmpty(this.state.selectedRow) || !isEqual(this.state.selectedRow, rec)) {
            this.setState({selectedRow: rec})
        } else {
            this.setState({openCard: true})
        }
    };
    onDocumentTypeChange = s => this.setState(state => ({filter: {...state.filter, documentType: s}}));
    onInvTypeChange = s => this.setState(state => ({filter: {...state.filter, invType: s}}));
    remove = id => {
        const newData = this.state.data.filter(item => item.id !== id);
        this.setState({data: newData});
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
    loadOptions = c => {
        return () => {
            if (!this.props[c + 'Options']) {
                this.setState({filter: {...this.state.filter, [c + 'Loading']: true}});
                this.props.getPropVal(c)
                    .then(() => this.setState({filter: {...this.state.filter, [c + 'Loading']: false}}));
            }
        }
    };

    onCreateObj = ({name, accessLevel, ...values}) => {

        const cube = {
            cubeSConst: CUBE_FOR_AF_INV
        };

        const obj = {
            name: name,
            fullName: name,
            clsConst: 'invList',
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

    onSaveCubeData = ({approvalProtocol, invFile, agreement2Protocol, agreementProtocol, ...values}, doItemProp, objDataProp) => {
        let datas = [];
        try {
            datas = [{
                own: [{doConst: DO_FOR_INV, doItem: doItemProp, isRel: "0", objData: objDataProp}],
                props: map(values, (val, key) => {
                    const propMetaData = getPropMeta(this.props.CubeForAF_Inv["dp_" + this.props.tofiConstants[DP_FOR_INV].id], this.props.tofiConstants[key]);
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
        return updateCubeData(CUBE_FOR_AF_INV, moment().format('YYYY-MM-DD'), JSON.stringify(datas), {}, {
            approvalProtocol,
            invFile,
            agreement2Protocol,
            agreementProtocol
        })
            .then(res => {
                hideLoading();
                if (res.success) {
                    message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'));
                    this.setState({loading: true});
                    return this.props.getCube(CUBE_FOR_AF_INV, JSON.stringify(this.filters))
                        .then(() => {
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

    renderTableData = item => {
        const constArr = ['invNumber', 'invDates', 'invType', 'invStorage', 'fundNumberOfCases', "caseStorageMulti", "rackMulti", "sectionMulti", "shelfMulti", 'fundNumberOfCasesWithFiles',
            'documentType', 'fundFeature', 'invCaseSystem', 'invApprovalDate2', 'invApprovalDate1', 'invAgreement2Date',
            'invAgreementDate', 'agreementProtocol', 'agreement2Protocol', 'approvalProtocol', 'invCont'];

        const accessLevelObj = this.props.accessLevelOptions.find(al => al.id === item.accessLevel);


        const result = {
            key: item.id,
            name: item.name,
            accessLevel: accessLevelObj && {value: accessLevelObj.id, label: accessLevelObj.name[this.lng]},
        };
        parseForTable(item.props, this.props.tofiConstants, result, constArr);
        result.invDates = result.invDates ? result.invDates.map(str => ({value: str})) : [];
        return result;
    };

    renderTableFooter = () => {
        const {data, countData: {countFund, countDelo, countDeloFile}} = this.state;
        const {t} = this.props;
        return (
            <div className="table-footer">
                <div className="flex">
                    <div className="label"><label htmlFor="">{t('COUNT_FUNDS')}</label><Input size='small' type="text"
                                                                                              readOnly
                                                                                              value={countFund}/></div>
                    <div className="label"><label htmlFor="">{t('COUNT_INVENT')}</label><Input size='small' type="text"
                                                                                               readOnly
                                                                                               value={data.length}/>
                    </div>
                    <div className="label"><label htmlFor="">{t('COUNT_CASES')}</label><Input size='small' type="text"
                                                                                              readOnly
                                                                                              value={countDelo}/></div>
                    <div className="label"><label htmlFor="">{t('COUNT_CASES_WITH_ELECTR')}</label><Input size='small'
                                                                                                          type="text"
                                                                                                          readOnly
                                                                                                          value={countDeloFile}/>
                    </div>
                </div>
                <div className="data-length">
                    <div className="label"><label htmlFor="">{t('COUNT_ITOG')}</label><Input size='small' type="text"
                                                                                             readOnly
                                                                                             value={this.filteredData.length + ' / ' + this.state.data.length}/>
                    </div>
                </div>
            </div>
        )
    };


    render() {
        if (isEmpty(this.props.tofiConstants)) return null;
        const {loading, data, selectedRow, filter} = this.state;
        const lng = localStorage.getItem('i18nextLng');
        const {
            t, tofiConstants, invTypeOptions, documentTypeOptions, location,
            tofiConstants: {invNumber, invDates, invList, invType, documentType, fundNumberOfCases, fundNumberOfCasesWithFiles}
        } = this.props;

        this.lng = localStorage.getItem('i18nextLng');
        this.filteredData = data.map(this.renderTableData).filter(item => {
            return (
                item.name[this.lng].toLowerCase().includes(filter.name.toLowerCase()) &&
                item.invDates.join(', ').includes(filter.invDates.toLowerCase()) &&
                item.invNumber.toLowerCase().includes(filter.invNumber.toLowerCase()) &&
                ( filter.invType.length === 0 || filter.invType.some(p => (item.invType && p.value == item.invType.value)) ) &&
                ( filter.documentType.length === 0 || filter.documentType.some(p => (item.documentType && p.value == item.documentType.value)) )
            )
        });

        return (
            <div className="EditCardInventories">
                <div className="table-header">
                    <Button onClick={() => {
                        const accessLevelObj = this.props.accessLevelOptions.find(al => al.id === 1);
                        this.setState({
                            openCard: true,
                            selectedRow: {
                                fundId: this.props.match.params.idFundCard,
                                accessLevel: {value: accessLevelObj.id, label: accessLevelObj.name[this.lng]},
                                fundFeature: {
                                    value: this.props.tofiConstants.included.id,
                                    label: this.props.tofiConstants.included.name[this.lng]
                                },
                                invType: {
                                    value: this.props.tofiConstants.invOCD.id,
                                    label: this.props.tofiConstants.invOCD.name[this.lng]
                                }
                            }
                        })
                    }}>{t('ADD')}</Button>
                    <Link to={{
                        pathname: `/archiveFund/editFundCard/${this.props.match.params.idFundCard}/${selectedRow.key}`,
                        state: {
                            fund: {
                                key: location.state && location.state.fund && location.state.fund.key,
                                name: location.state && location.state.fund && location.state.fund.name
                            },
                            inv: {
                                key: selectedRow.key,
                                name: selectedRow.name,
                                invType: selectedRow.invType && selectedRow.invType.value,
                                docType: selectedRow.documentType && selectedRow.documentType.value
                            },
                            title: t('CASE')
                        }
                    }}>
                        <Button disabled={isEmpty(selectedRow) || !selectedRow.key}>{t('VIEW_CASES')}</Button>
                    </Link>
                    <Button icon="printer">{t('REPORTS')}</Button>
                    <div className="label-select">
                        <Select
                            name="invType"
                            isMulti
                            isSearchable={false}
                            value={filter.invType}
                            onChange={this.onInvTypeChange}
                            isLoading={filter.invTypeLoading}
                            options={invTypeOptions ? invTypeOptions.map(option => ({
                                value: option.id,
                                label: option.name[this.lng]
                            })) : []}
                            placeholder={invType.name[this.lng]}
                            onMenuOpen={this.loadOptions('invType')}
                        />
                    </div>
                    <div className="label-select">
                        <Select
                            name="documentType"
                            isMulti
                            isSearchable={false}
                            value={filter.documentType}
                            onChange={this.onDocumentTypeChange}
                            isLoading={filter.documentTypeLoading}
                            options={documentTypeOptions ? documentTypeOptions.map(option => ({
                                value: option.id,
                                label: option.name[this.lng]
                            })) : []}
                            placeholder={documentType.name[this.lng]}
                            onMenuOpen={this.loadOptions('documentType')}
                        />
                    </div>
                </div>
                <div className="EditCardInventories__body">
                    <AntTable
                        columns={
                            [
                                {
                                    key: 'invNumber',
                                    title: t('INV_NUMB'),
                                    dataIndex: 'invNumber',
                                    width: '7%',

                                    sorter: (a, b) => ((a.invNumber).replace(/[^0-9]/g, '')) - ((b.invNumber).replace(/[^0-9]/g, '')),
                                    filterDropdown: (
                                        <div className="custom-filter-dropdown">
                                            <Input
                                                name="invNumber"
                                                suffix={filter.name ? <Icon type="close-circle" data-name="invNumber"
                                                                            onClick={this.emitEmpty}/> : null}
                                                ref={ele => this.invNumber = ele}
                                                placeholder="Поиск"
                                                value={filter.invNumber}
                                                onChange={this.onInputChange}
                                            />
                                        </div>
                                    ),
                                    filterIcon: <Icon type="filter"
                                                      style={{color: filter.invNumber ? '#ff9800' : '#aaa'}}/>,
                                    onFilterDropdownVisibleChange: (visible) => {
                                        this.setState({
                                            filterDropdownVisible: visible,
                                        }, () => this.invNumber.focus());
                                    },
                                },
                                {
                                    key: 'name',
                                    title: invList.name[lng],
                                    dataIndex: 'name',
                                    width: '25%',
                                    filterDropdown: (
                                        <div className="custom-filter-dropdown">
                                            <Input
                                                name="name"
                                                suffix={filter.name ? <Icon type="close-circle" data-name="name"
                                                                            onClick={this.emitEmpty}/> : null}
                                                ref={ele => this.name = ele}
                                                placeholder="Поиск"
                                                value={filter.name}
                                                onChange={this.onInputChange}
                                            />
                                        </div>
                                    ),
                                    filterIcon: <Icon type="filter" style={{color: filter.name ? '#ff9800' : '#aaa'}}/>,
                                    onFilterDropdownVisibleChange: (visible) => {
                                        this.setState({
                                            filterDropdownVisible: visible,
                                        }, () => this.name.focus());
                                    },
                                    render: obj => obj && obj[this.lng]
                                },
                                {
                                    key: 'invDates',
                                    title: invDates.name[lng],
                                    dataIndex: 'invDates',
                                    width: '10%',
                                    filterDropdown: (
                                        <div className="custom-filter-dropdown">
                                            <Input
                                                name="invDates"
                                                suffix={filter.invDates ? <Icon type="close-circle" data-name="invDates"
                                                                                onClick={this.emitEmpty}/> : null}
                                                ref={ele => this.invDates = ele}
                                                placeholder="Поиск"
                                                value={filter.invDates}
                                                onChange={this.onInputChange}
                                            />
                                        </div>
                                    ),
                                    filterIcon: <Icon type="filter"
                                                      style={{color: filter.invDates ? '#ff9800' : '#aaa'}}/>,
                                    onFilterDropdownVisibleChange: (visible) => {
                                        this.setState({
                                            filterDropdownVisible: visible,
                                        }, () => this.invDates.focus());
                                    },
                                    render: arr => arr && arr.map(o => o.value).join(', ')
                                },
                                {
                                    key: 'invType',
                                    title: invType.name[lng],
                                    dataIndex: 'invType',
                                    width: '10%',
                                    render: obj => obj && obj.label
                                },
                                {
                                    key: 'documentType',
                                    title: documentType.name[lng],
                                    dataIndex: 'documentType',
                                    width: '10%',
                                    render: obj => obj && obj.label
                                },
                                {
                                    key: 'fundNumberOfCases',
                                    title: fundNumberOfCases.name[lng],
                                    dataIndex: 'fundNumberOfCases',
                                    width: '15%',
                                    render: (text, record) => {
                                        let rezul = this.state.numberFull.find((el) => record.key.split('_')[1] === el.key)
                                        if (rezul === undefined)return false
                                        return rezul.value
                                    }
                                },
                                {
                                    key: 'fundNumberOfCasesWithFiles',
                                    title: fundNumberOfCasesWithFiles.name[lng],
                                    dataIndex: 'fundNumberOfCasesWithFiles',
                                    width: '15%'
                                },
                                {
                                    key: 'action',
                                    title: '',
                                    dataIndex: '',
                                    width: '8%',
                                    render: (text, record) => {
                                        return (
                                            <div className="editable-row-operations" style={{display: 'flex'}}>
                                                <Button icon="edit" className="green-btn" style={{marginRight: '5px'}}
                                                        disabled={selectedRow.key !== record.key}/>
                                                <Popconfirm title={this.props.t('CONFIRM_REMOVE')} onConfirm={() => {
                                                    const fd = new FormData();
                                                    fd.append("cubeSConst", CUBE_FOR_AF_INV);
                                                    fd.append("dimObjConst", DO_FOR_INV);
                                                    fd.append("objId", record.key.split('_')[1]);
                                                    const hideLoading = message.loading(this.props.t('REMOVING'), 30);
                                                    dObj(fd)
                                                        .then(res => {
                                                            hideLoading();
                                                            if (res.success) {
                                                                message.success(this.props.t('SUCCESSFULLY_REMOVED'));
                                                                this.setState({loading: true});
                                                                this.remove(record.key)
                                                            } else {
                                                                throw res
                                                            }
                                                        })
                                                        .then(() => this.setState({loading: false, openCard: false}))
                                                        .catch(err => {
                                                            console.log(err);
                                                            message.error(this.props.t('REMOVING_ERROR'))
                                                        })
                                                }}>
                                                    <Button title="Удалить" icon="delete"
                                                            onClick={e => e.stopPropagation()}
                                                            className="green-btn yellow-bg"
                                                            disabled={selectedRow.key !== record.key}/>
                                                </Popconfirm>
                                            </div>
                                        );
                                    },
                                }
                            ]
                        }
                        openedBy="ArchiveFundInvList"
                        changeSelectedRow={this.changeSelectedRow}
                        loading={loading}
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
                            <InventoriesListCard
                                t={t}
                                tofiConstants={tofiConstants}
                                initialValues={selectedRow}
                                onCreateObj={this.onCreateObj}
                                onSaveCubeData={this.onSaveCubeData}
                            />
                        </SiderCard>
                    </CSSTransition>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        tofiConstants: state.generalData.tofiConstants,
        CubeForAF_Inv: state.cubes[CUBE_FOR_AF_INV],
        accessLevelOptions: state.generalData.accessLevel,
        invTypeOptions: state.generalData.invType,
        documentTypeOptions: state.generalData.documentType,
    }
}

export default connect(mapStateToProps, {getCube, getPropVal})(EditCardInventories);
