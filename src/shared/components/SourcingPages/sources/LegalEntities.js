import React from 'react'
import PropTypes from 'prop-types';
import {isEmpty, uniq} from 'lodash';
import {Button, Icon, Input, Spin, Cascader, Modal} from 'antd';
import Select from '../../Select';
import SelectVirt from '../../SelectVirt';

import AntTable from '../../AntTable';
import {parseCube_new, parseForTable} from '../../../utils/cubeParser';
import {
    LEGAL_STATUS,
    FORM_OF_ADMISSION,
    FUND_MAKER_ARCHIVE,
    ORG_INDUSTRY,
    DP_FOR_ORG_FUNDMAKER,
    DO_FOR_INV,
    DP_FOR_INV,
    CUBE_FOR_AF_INV,
    DP_FOR_FUND_AND_IK
} from '../../../constants/tofiConstants';
import {
    getCube,
    getObjByProp,
    getObjListNew,
    getPropVal,
    getPropValWithChilds
} from '../../../actions/actions';
import {connect} from 'react-redux';
import {CSSTransition} from 'react-transition-group';
import SiderCardLegalEntities from './SiderCardLegalEntities';
import DocsStorageConditions from './DocsStorageConditions';
import LegalEntitiesInventoriesSmall from './legalEntitiesInv/LegalEntitiesInventoriesSmall';
import LegalEntitiesNomenclatureSmall from './LegalEntitiesNomenclatureSmall';
import NMDocsSmall from './NMDocsSmall';
import {message} from "antd/lib/index";
import AntModal from "../../AntModal";
import Viewer from "../../Viewer";

/*eslint eqeqeq:0*/
class LegalEntities extends React.PureComponent {

    state = {
        data: [],
        openCard: false,
        siderCardChildren: null,
        loading: true,
        selectedRow: {},
        filter: {
            name: '',
            sourceOrgList: '',
            legalStatus: [],
            legalStatusLoading: false,
            fundmakerArchive: [],
            fundmakerArchiveLoading: false,
            formOfAdmission: [],
            formOfAdmissionLoading: false,
            orgIndustry: [],
            orgIndustryChildren: [],
            orgIndustryLoading: false
        },
        openModal: false,
        viewerList: []
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

    onDelete = key => {
        return function inter(e) {
            e.preventDefault();
        }
    };

    changeSelectedRow = rec => {
        this.setState({selectedRow: rec})
    };

    handleClick = (rec, name) => {
        return async () => {
            // e.stopPropagation();
            switch(name) {
                case 'nmDocs':
                    this.setState({openCard: true, siderCardChildren: <Spin />});
                    await this.props.loadEntity(rec.key);
                    this.setState({
                        openCard: true,
                        siderCardChildren: <NMDocsSmall
                        tofiConstants={this.props.tofiConstants}
                        t={this.props.t}
                        openViewer={files => {this.setState({openModal: true, viewerList: files})}}
                        />
                    });
                    this.selectedKey = rec.key;
                    break;
                case 'storageConditions':
                    this.setState({openCard: true, siderCardChildren: <Spin />});
                    await this.props.loadEntity(rec.key);
                    this.setState({
                        openCard: true,
                        siderCardChildren: <DocsStorageConditions
                        tofiConstants={this.props.tofiConstants}
                        t={this.props.t}
                        />
                    });
                    this.selectedKey = rec.key;
                    break;
                case 'docsInfo':
                    this.selectedKey !== rec.key && this.props.loadEntity(rec.key, true);
                    this.props.history.push(`/sourcing/sourcesMaintenance/legalEntities/${rec.key}/docsInfo`);
                    this.selectedKey = rec.key;
                    break;
                case 'inventories': {
                    this.setState({openCard: true, siderCardChildren: <Spin />});
                    const filters = {
                        filterDOAnd: [
                            {
                                dimConst: DO_FOR_INV,
                                concatType: "and",
                                conds: [
                                    {
                                        data: {
                                            valueRef: {
                                                id: rec.key
                                            }
                                        }
                                    }
                                ]
                            }
                        ],
                        filterDPAnd: [
                            {
                                dimConst: DP_FOR_INV,
                                concatType: "and",
                                conds: [
                                    {
                                        consts: 'invNumber,invType,fundNumberOfCases,invDates,invAgreement2Date,invApprovalDate2,'
                                    }
                                ]
                            }
                        ]
                    };
                    this.props.getCube(CUBE_FOR_AF_INV, JSON.stringify(filters))
                    .then(res => {
                        if (res.cube) {
                            this.setState({
                                openCard: true,
                                siderCardChildren: <LegalEntitiesInventoriesSmall
                                record={rec}
                                tofiConstants={this.props.tofiConstants}
                                t={this.props.t}
                                CubeForAF_Inv={this.props.CubeForAF_Inv}

                                />
                            });
                        } else {
                            throw res;
                        }
                    }).catch(err => {
                        console.warn(err);
                        this.setState({
                            openCard: true,
                            siderCardChildren: <LegalEntitiesInventoriesSmall
                            record={rec}
                            tofiConstants={this.props.tofiConstants}
                            t={this.props.t}

                            />
                        });
                    });
                    this.selectedKey = rec.key;
                    break;
                }
                case 'nomenclature':
                    this.setState({openCard: true, siderCardChildren: <Spin />});
                    const dataRec = this.state.data.find(o => o.id === rec.key);
                    const prop = dataRec ? dataRec.props.find(p => p.prop == this.props.tofiConstants.nomen.id) : null;
                    const obj = prop && prop.values ? uniq(prop.values.map(p => p.value)).join(',') : '';
                    if (obj) {
                        const filters = {
                            filterDOAnd: [
                                {
                                    dimConst: 'dimObjNomen',
                                    concatType: "and",
                                    conds: [
                                        {
                                            obj
                                        }
                                    ]
                                }
                            ]
                        };
                        this.props.getCube('cubeSNomen', JSON.stringify(filters))
                        .then(res => {
                            if (res.cube) {
                                this.setState({
                                    openCard: true,
                                    siderCardChildren: <LegalEntitiesNomenclatureSmall
                                    record={rec}
                                    filters={filters}
                                    getCube={this.props.getCube}
                                    closeCard={this.closeCard}
                                    tofiConstants={this.props.tofiConstants}
                                    t={this.props.t}
                                    openViewer={files => {this.setState({openModal: true, viewerList: files})}}

                                    />
                                });
                            }
                            ;
                        })
                    } else {
                        this.setState({
                            openCard: true,
                            siderCardChildren: <LegalEntitiesNomenclatureSmall
                            record={rec}
                            closeCard={this.closeCard}
                            tofiConstants={this.props.tofiConstants}
                            t={this.props.t}
                            openViewer={files => {this.setState({openModal: true, viewerList: files})}}

                            />
                        });
                    }
                    // this.siderCardChildren = <LegalEntitiesInventoriesSmall tofiConstants={this.props.tofiConstants} t={this.props.t} />;
                    this.selectedKey = rec.key;
                    break;
                default:
                    break;
            }
        }
    };

    closeCard = () => {
        this.setState({openCard: false})
    };
    stopPropagation = e => {
        e.stopPropagation();
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

    async componentDidMount() {
        if (isEmpty(this.props.tofiConstants) || !this.props.orgSourceCube) return;
        await this.props.loadEntity();
        const {doForFundAndIK, dpForFundAndIK, fundmakerOfIK, doForOrgFundmakers, dpForOrgFundmakers} = this.props.tofiConstants;

        const data = parseCube_new(this.props.orgSourceCube['cube'], [], 'dp', 'do', this.props.orgSourceCube[`do_${doForFundAndIK.id}`], this.props.orgSourceCube[`dp_${dpForFundAndIK.id}`], `do_${doForFundAndIK.id}`, `dp_${dpForFundAndIK.id}`);

        if (this.props.orgSourceCube) {
            this.filteredOrgSourceCubeDP = this.props.orgSourceCube[`dp_${this.props.tofiConstants[DP_FOR_FUND_AND_IK].id}`].filter(dpItem => {
                return ['orgIndustry', 'formOfAdmission', 'legalStatus', 'fundmakerArchive'].some(c =>
                `_P_${dpItem.prop}` === this.props.tofiConstants[c].cod
                );
            });
            this.filteredOrgSourceCubeDO = this.props.orgSourceCube[`do_${doForFundAndIK.id}`].filter(doItem =>
            data.some(item => {
                const fundmakerOfIKObj = item.props.find(element => element.prop == fundmakerOfIK.id);
                return fundmakerOfIKObj.cube.idRef && doItem.id.includes(fundmakerOfIKObj.cube.idRef);
            })
            );
            this.filteredOrgSourceCubeTF = this.props.orgSourceCube.cube.filter(tf => {
                return this.filteredOrgSourceCubeDP.some(dpItem => tf[`dp_${dpForFundAndIK.id}`] == dpItem.id) && this.filteredOrgSourceCubeDO.some(doItem => tf[`do_${doForFundAndIK.id}`] == doItem.id)
            });
            this.filteredOrgSourceCube = parseCube_new(this.filteredOrgSourceCubeTF, [], 'dp', 'do', this.filteredOrgSourceCubeDO, this.filteredOrgSourceCubeDP, `do_${doForFundAndIK.id}`, `dp_${dpForFundAndIK.id}`);
        }
        this.setState(
        {
            loading: false,
            data
        }
        );
    }

    componentWillReceiveProps(nextProps) {
        if (!isEmpty(nextProps.orgSourceCube) && !isEmpty(nextProps.tofiConstants) && this.props.orgSourceCube !== nextProps.orgSourceCube) {
            const {doForFundAndIK, dpForFundAndIK, fundmakerOfIK, doForOrgFundmakers, dpForOrgFundmakers} = this.props.tofiConstants;

            const data = parseCube_new(nextProps.orgSourceCube['cube'], [], 'dp', 'do', nextProps.orgSourceCube[`do_${doForFundAndIK.id}`], nextProps.orgSourceCube[`dp_${dpForFundAndIK.id}`], `do_${doForFundAndIK.id}`, `dp_${dpForFundAndIK.id}`);
            if (this.props.orgSourceCube) {
                this.filteredOrgSourceCubeDP = this.props.orgSourceCube[`dp_${this.props.tofiConstants[DP_FOR_FUND_AND_IK].id}`].filter(dpItem => {
                    return ['orgIndustry', 'formOfAdmission', 'legalStatus', 'fundmakerArchive'].some(c =>
                    `_P_${dpItem.prop}` === this.props.tofiConstants[c].cod
                    );
                });

                this.filteredOrgSourceCubeDO = this.props.orgSourceCube[`do_${doForFundAndIK.id}`].filter(doItem =>
                data.some(item => {
                    const fundmakerOfIKObj = item.props.find(element => element.prop == fundmakerOfIK.id);
                    //TODO fundmaker should be single valued
                    return fundmakerOfIKObj.cube.idRef && doItem.id.includes(fundmakerOfIKObj.cube.idRef);
                })
                );
                this.filteredOrgSourceCubeTF = this.props.orgSourceCube.cube.filter(tf => {
                    return this.filteredOrgSourceCubeDP.some(dpItem => tf[`dp_${dpForFundAndIK.id}`] == dpItem.id) && this.filteredOrgSourceCubeDO.some(doItem => tf[`do_${doForFundAndIK.id}`] == doItem.id)
                });
                this.filteredOrgSourceCube = parseCube_new(this.filteredOrgSourceCubeTF, [], 'dp', 'do', this.filteredOrgSourceCubeDO, this.filteredOrgSourceCubeDP, `do_${doForFundAndIK.id}`, `dp_${dpForFundAndIK.id}`)
            }

            this.setState(
            {
                loading: false,
                data
            }
            );
        } else if (this.props.loading !== nextProps.loading) {
            this.setState({loading: nextProps.loading});
        }

    }

    renderTableData = (item, idx) => {
        const constArr = ['sourceOrgList', 'fundNumber','formOfAdmission', 'orgIndustry', 'legalStatus', 'fundmakerArchive'];
        const {fundNumber} = this.props.tofiConstants;

        var numbIK = item.props.find(element => element.prop == fundNumber.id);
        const result = {
            key: item.id,
            fundNumber: numbIK ? numbIK.value : '',
            name: item.name,
        };

        parseForTable(item.props, this.props.tofiConstants, result, constArr);
        return result;
    };


    render() {
        const {loading, openCard, filter} = this.state;
        const {t, tofiConstants, legalStatusOptions, fundmakerArchiveOptions, orgIndustryOptions, formOfAdmissionOptions} = this.props;
        if (isEmpty(tofiConstants)) return null;
        const {legalStatus, fundmakerArchive, orgIndustry, formOfAdmission} = tofiConstants;
        this.lng = localStorage.getItem('i18nextLng');
        this.filteredData = this.state.data.map(this.renderTableData).filter(item => {
            return (
            (item.name && String(item.name[localStorage.getItem('i18nextLng')]).toLowerCase().includes(String(filter.name).toLowerCase())) &&
            ( filter.orgIndustry.length === 0 || filter.orgIndustry.some(p => item.orgIndustry.some(v => v.value === p.value))) &&
            ( filter.legalStatus.length === 0 || filter.legalStatus.some(p => (item.legalStatus && p.value == item.legalStatus.value))) &&
            ( filter.formOfAdmission.length === 0 || filter.formOfAdmission.some(p => (item.formOfAdmission && p.value == item.formOfAdmission.value)))
            )
        });
        return (
        <div className="LegalEntities">
            <div className="LegalEntities__heading">
                <div className="table-header">
                    <div className="label-select">
                        <Select
                        name="formOfAdmission"
                        isMulti
                        isSearchable={false}
                        value={filter.formOfAdmission}
                        onChange={this.onFormOfAdmissionChange}
                        onMenuOpen={this.loadOptions(FORM_OF_ADMISSION)}
                        isLoading={filter.formOfAdmissionLoading}
                        options={formOfAdmissionOptions ? formOfAdmissionOptions.map(option => ({
                            value: option.id,
                            label: option.name[this.lng]
                        })) : []}
                        placeholder={formOfAdmission.name[this.lng]}
                        />
                    </div>
                    <div className="label-select">
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
                        />
                    </div>
                    <div className="label-select">
                        <Select
                        name="fundmakerArchive"
                        isMulti
                        isSearchable
                        optionHeight={40}
                        isLoading={filter.fundmakerArchiveLoading}
                        onMenuOpen={this.loadOptions(FUND_MAKER_ARCHIVE)}
                        value={filter.fundmakerArchive}
                        onChange={this.onOrgLocationChange}
                        options={fundmakerArchiveOptions ? fundmakerArchiveOptions.map(option => ({
                            value: option.id,
                            label: option.name[this.lng]
                        })) : []}
                        placeholder={fundmakerArchive.name[this.lng]}
                        />
                    </div>
                    <div className="label-select">
                        <SelectVirt
                        name="orgIndustry"
                        isMulti
                        isSearchable
                        optionHeight={40}
                        isLoading={filter.orgIndustryLoading}
                        onMenuOpen={this.loadOptions(ORG_INDUSTRY, true)}
                        value={filter.orgIndustry}
                        onChange={this.onOrgIndustryChange}
                        options={orgIndustryOptions || []}
                        placeholder={orgIndustry.name[this.lng]}
                        />
                    </div>
                </div>
            </div>
            <div className="LegalEntities__body">
                <AntTable
                columns={[
                    {
                        key: 'fundNumber',     //numb - стандартный номер
                        title: '№',
                        dataIndex: 'fundNumber',  //fundNumber
                        width: '5%',
                        render: fundNumber => fundNumber ? fundNumber : '',
                        sorter: (a, b) => a.fundNumber - b.fundNumber,
                        sortOrder:'ascend'
                        
                    },
                    {
                        key: 'name',
                        title: t('NAME'),
                        dataIndex: 'name',
                        width: '35%',
                        render: obj => obj && obj[this.lng],
                        filterDropdown: (
                        <div className="custom-filter-dropdown">
                            <Input
                            disabled={this.state.openCard}
                            name="name"
                            suffix={filter.name && !this.state.openCard ?
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
                    },
                    {
                        key: 'orgIndustry',
                        title: orgIndustry.name[this.lng],
                        dataIndex: 'orgIndustry',
                        width: '20%',
                        render: obj => obj && obj.map(label => label.label).join(',')
                    },
                    {
                        key: 'nmDocs',
                        title: 'Нормативно-методические документы',
                        className: 'td-center td-btn-half',
                        dataIndex: '',
                        width: '8%',
                        render: (text, record) => (
                        <Button icon="right-square" className='green-btn'
                                onClick={this.handleClick(record, 'nmDocs')}/>
                        )
                    },
                    {
                        key: 'storageConditions',
                        title: 'Условия хранения документов',
                        className: 'td-center td-btn-half',
                        dataIndex: '',
                        width: '8%',
                        render: (text, record) => (
                        <Button icon="right-square" className='green-btn'
                                onClick={this.handleClick(record, 'storageConditions')}/>
                        )
                    },
                    {
                        key: 'docsInfo',
                        title: 'Сведения о документах',
                        className: 'td-center td-btn-half',
                        dataIndex: '',
                        width: '8%',
                        render: (text, record) => (
                        <Button icon="right-square" className='green-btn'
                                onClick={this.handleClick(record, 'docsInfo')}/>
                        )
                    },
                    {
                        key: 'inventories',
                        title: 'Описи',
                        className: 'td-center td-btn-half',
                        dataIndex: '',
                        width: '8%',
                        render: (text, record) => (
                        <Button icon="right-square" className='green-btn'
                                onClick={this.handleClick(record, 'inventories')}/>
                        )
                    },
                    {
                        key: 'nomenclature',
                        title: 'Номенклатура дел',
                        className: 'td-center td-btn-half',
                        dataIndex: '',
                        width: '8%',
                        render: (text, record) => (
                        <Button icon="right-square" className='green-btn'
                                onClick={this.handleClick(record, 'nomenclature')}/>
                        )
                    }
                ]}
                loading={loading}
                dataSource={this.filteredData}
                openedBy="LegalEntities"
                changeSelectedRow={this.changeSelectedRow}
                />
                <CSSTransition
                in={openCard}
                timeout={300}
                classNames="card"
                unmountOnExit
                >
                    <SiderCardLegalEntities
                    closer={<Button type='danger' onClick={this.closeCard} shape="circle"
                                    icon="arrow-right"/>}>
                        {this.state.siderCardChildren}
                    </SiderCardLegalEntities>
                </CSSTransition>
            </div>
            <Modal
            visible={this.state.openModal}
            footer={null}
            title={t('VIEWER')}
            wrapClassName={'full-screen'}
            onCancel={() => this.setState({openModal: false})}
            >
                <Viewer key={this.state.viewerList.toString()}
                        t={t}
                        viewerList={this.state.viewerList}/>
            </Modal>
        </div>
        )
    }
}

LegalEntities.propTypes = {
    t: PropTypes.func.isRequired,
    orgSourceCube: PropTypes.shape()
};

function mapStateToProps(state) {
    const lng = localStorage.getItem('i18nextLng');
    const orgIndOpts = state.generalData[ORG_INDUSTRY] && state.generalData[ORG_INDUSTRY]
    .map(option => ({
        value: option.id,
        label: option.name[lng],
        isLeaf: !option.hasChild
    }));
    return {
      legalStatusOptions: state.generalData[LEGAL_STATUS],
      fundmakerArchiveOptions: state.generalData[FUND_MAKER_ARCHIVE],
      orgIndustryOptions: orgIndOpts,
      formOfAdmissionOptions: state.generalData[FORM_OF_ADMISSION],
      cubeSNomen: state.cubes.cubeSNomen,
      CubeForAF_Inv: state.cubes[CUBE_FOR_AF_INV],
      orgSourceCubeSingle: state.cubes.orgSourceCubeSingle
    }
}

export default connect(mapStateToProps, {
    getCube,
    getPropVal,
    getPropValWithChilds
})(LegalEntities);