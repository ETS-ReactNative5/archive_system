import React from "react"
import {connect} from "react-redux";
import {
    CUBE_FOR_FUND_AND_IK,
    CUBE_FOR_ORG_FUNDMAKER,
    DO_FOR_FUND_AND_IK,
    DP_FOR_FUND_AND_IK,
    DT_FOR_FUND_AND_IK, FORM_OF_ADMISSION, FUND_MAKER_ARCHIVE
} from '../../constants/tofiConstants';
import Select from '../Select';

import {getCube, getPropVal, getIdGetObj, getUserInfo, getObjByObjVal, getUserInformation} from '../../actions/actions';
import {CSSTransition} from "react-transition-group";
import SiderCard from "../SiderCard";

import AntTable from "../AntTable";
import {Spin, Icon, Input, Checkbox, Button, message, DatePicker} from 'antd';
import moment from "moment";
import Axios from "axios"
import Card from "./Card/Card"
import {parseCube_new, parseForTable} from "../../utils/cubeParser";


class TablelegalEntities extends React.Component {

    state = {
        loading: false,
        openCard: false,
        dateReport: moment().format("DD-MM-YYYY"),
        selectedRow: null,
        data: [],
        filter: {
            name: '',
            sourceOrgList: '',
            dateIncludeOfIk: moment().format("DD-MM-YYYY"),
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
        idFundLisrKey: "",
    }


    renderTableData = (item, idx) => {
        const constArr = ["numberOfIK", "orgDocType", "formOfAdmission", "fundArchive", "dateIncludeOfIk", "dateExcludeOfIk", "fundmakerOfIK"];
        const result = {
            idss: idx + 1,
            id: item.id,
            name: item.name,

        };
        parseForTable(item.props, this.props.tofiConstants, result, constArr);
        return result;
    };

    async componentDidMount() {
        if (!!this.props.location.state) {
            this.setState({
                idFundLisrKey: this.props.location.state.key
            })
        }
        this.setState({
            loading: this
        })
        if (this.props.tofiConstants["userOfIK"].id === this.props.user.cls) {
            getUserInformation(this.props.user.obj)
                .then((res) => {
                    let userIkRef = res.idIK
                    getIdGetObj(userIkRef, 'doForFundAndIK').then(async (res) => {
                        let idDimObj = res.data.idDimObj;
                        const filters = {
                            filterDPAnd: [
                                {
                                    dimConst: 'dpForFundAndIK',
                                    concatType: "and",
                                    conds: [
                                        {
                                            consts:
                                                "numberOfIK,orgDocType,formOfAdmission,fundArchive,dateIncludeOfIk,dateExcludeOfIk,fundmakerOfIK"
                                        }
                                    ]
                                }
                            ],
                            filterDOAnd: [
                                {
                                    dimConst: 'doForFundAndIK',
                                    concatType: "and",
                                    conds: [
                                        {
                                            ids: String(idDimObj)
                                        }
                                    ]
                                }
                            ]
                        };
                        await  this.props.getCube('cubeForFundAndIK', JSON.stringify(filters), {customKey: 'orgSourceCube'});

                        const parsedCube = parseCube_new(this.props.orgSourceCube['cube'],
                            [],
                            'dp',
                            'do',
                            this.props.orgSourceCube['do_' + this.props.tofiConstants['doForFundAndIK'].id],
                            this.props.orgSourceCube['dp_' + this.props.tofiConstants['dpForFundAndIK'].id],
                            'do_' + this.props.tofiConstants['doForFundAndIK'].id,
                            'dp_' + this.props.tofiConstants['dpForFundAndIK'].id
                        ).map(this.renderTableData);
                        this.setState({
                            loading: false,
                            data: parsedCube
                        })
                    }).catch(e => {
                        console.log(e)
                    })

                }).catch(e => {
                console.log(e)
            })
        } else {
            const filters = {
                filterDPAnd: [
                    {
                        dimConst: 'dpForFundAndIK',
                        concatType: "and",
                        conds: [
                            {
                                consts:
                                    "numberOfIK,orgDocType,formOfAdmission,fundArchive,dateIncludeOfIk,dateExcludeOfIk,fundmakerOfIK"
                            }
                        ]
                    }
                ],
                filterDOAnd: [
                    {
                        dimConst: 'doForFundAndIK',
                        concatType: "and",
                        conds: [
                            {
                                clss: "sourceOrgList"
                            }
                        ]
                    }
                ]
            };
            await  this.props.getCube('cubeForFundAndIK', JSON.stringify(filters), {customKey: 'orgSourceCube'});

            const parsedCube = parseCube_new(this.props.orgSourceCube['cube'],
                [],
                'dp',
                'do',
                this.props.orgSourceCube['do_' + this.props.tofiConstants['doForFundAndIK'].id],
                this.props.orgSourceCube['dp_' + this.props.tofiConstants['dpForFundAndIK'].id],
                'do_' + this.props.tofiConstants['doForFundAndIK'].id,
                'dp_' + this.props.tofiConstants['dpForFundAndIK'].id
            ).map(this.renderTableData);
            this.setState({
                loading: false,
                data: parsedCube
            })
        }


    }


    changeSelectedRow = rec => {
        this.setState({
            selectedRow: rec,
            openCard: true
        });
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
    onFormOfAdateIncludeOfIkChange = (s, data) => {
        if (s === null) {
            return false
        }
        this.setState({
            dateReport: moment(data).format("DD-MM-YYYY")
        })
        this.setState({filter: {...this.state.filter, dateIncludeOfIk: moment(data).format("DD-MM-YYYY")}})
    };
    dateReport = (mom, data) => {
        if (mom === null) {
            return false
        }
        this.setState({
            dateReport: data
        })

    }
    showAllRender = (val) => {
        if (val.target.checked === false) {
            this.setState({
                filter: {
                    ...this.state.filter,
                    dateIncludeOfIk: moment(this.state.dateReport).format("DD-MM-YYYY")
                }
            })
        } else {
            this.setState({
                filter: {
                    ...this.state.filter,
                    dateIncludeOfIk: ""
                }
            })
        }
    }


    onInputChange = e => {
        this.setState({
            filter: {
                ...this.state.filter,
                [e.target.name]: e.target.value
            }
        })
    };
    filterDate = (filter, startDate, endDate) => {

        if (filter === "") {
            return true
        }
        if (!!startDate || !!endDate) {
            let data = moment(startDate.value, "DD-MM-YYYY").isBefore(moment(filter, "DD-MM-YYYY"))
            let data2
            if (!!endDate) {
                data2 = moment(endDate.value, "DD-MM-YYYY").isAfter(moment(filter, "DD-MM-YYYY"))

            } else {
                data2 = true
            }
            if (data === true && data2 === true) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }
    renderTableFooter = () => {
        const {t} = this.props;
        return (
            <div className="table-footer">
                <div className="flex">
                    <div className="data-length">
                        <div className="label">
                            <label htmlFor="">Всего</label>
                            <Input
                                size="small"
                                type="text"
                                readOnly
                                value={this.filteredData.length + " / " + this.state.data.length}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    getFunmarker = () => {
        getIdGetObj(this.state.selectedRow.fundmakerOfIK.value, 'doForOrgFundmakers').then(res => {
            let data = res.data, idDimObj
            this.props.history.push({
                pathname: `/sourcing/fundMaker`,
                state: {
                    data
                }
            })

        }).catch(e => {
            console.log(e)
        })
    }
    getfundsList = () => {

        this.props.history.push({
            pathname: `/archiveFund/fundsList`,
            state: {
                data: this.state.selectedRow.fundmakerOfIK.value
            }
        })

    }

    render() {
        const {t, tofiConstants, legalStatusOptions, fundmakerArchiveOptions, orgIndustryOptions, formOfAdmissionOptions} = this.props;
        const {legalStatus, fundmakerArchive, orgIndustry, formOfAdmission} = tofiConstants;

        const {loading, openCard, filter} = this.state;

        this.lng = localStorage.getItem("i18nextLng");

        if (!!this.state.idFundLisrKey) {
            this.filteredData = this.state.data.filter(item => {
                return (
                    ( this.filterDate(filter.dateIncludeOfIk, item.dateIncludeOfIk, item.dateExcludeOfIk)) &&
                    (item.fundmakerOfIK && String(item.fundmakerOfIK.value).toLowerCase().includes(String(this.props.location.state.key).toLowerCase())) &&
                    (item.name && String(item.name[localStorage.getItem('i18nextLng')]).toLowerCase().includes(String(filter.name).toLowerCase())) &&
                    ( filter.orgIndustry.length === 0 || filter.orgIndustry.some(p => item.orgIndustry.some(v => v.value === p.value))) &&
                    ( filter.legalStatus.length === 0 || filter.legalStatus.some(p => (item.legalStatus && p.value == item.legalStatus.value))) &&
                    ( filter.formOfAdmission.length === 0 || filter.formOfAdmission.some(p => (item.formOfAdmission && p.value == item.formOfAdmission.value)))
                )
            });
        } else {
            this.filteredData = this.state.data.filter(item => {
                return (
                    ( this.filterDate(filter.dateIncludeOfIk, item.dateIncludeOfIk, item.dateExcludeOfIk)) &&
                    (item.name && String(item.name[localStorage.getItem('i18nextLng')]).toLowerCase().includes(String(filter.name).toLowerCase())) &&
                    ( filter.orgIndustry.length === 0 || filter.orgIndustry.some(p => item.orgIndustry.some(v => v.value === p.value))) &&
                    ( filter.legalStatus.length === 0 || filter.legalStatus.some(p => (item.legalStatus && p.value == item.legalStatus.value))) &&
                    ( filter.formOfAdmission.length === 0 || filter.formOfAdmission.some(p => (item.formOfAdmission && p.value == item.formOfAdmission.value)))
                )
            });
        }
        return (
            <div className='Works'>

                <div className="Works__heading ">
                    <div className="table-header ">

                        <div className="label-select">
                            <Button type="primary" onClick={this.getFunmarker}
                                    disabled={this.state.selectedRow !== null ? false : true}>
                                Фондообразователь</Button>
                            <Button type="primary" onClick={this.getfundsList}
                                    disabled={this.state.selectedRow !== null ? false : true} style={{marginLeft: 10}}>
                                Фонд</Button>
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
                            <DatePicker
                                name="periodType"
                                onChange={this.onFormOfAdateIncludeOfIkChange}
                                style={{width: 290}}
                                value={moment(this.state.dateReport, "DD-MM-YYYY")}
                            />
                            <Checkbox style={{width: "50%"}}
                                      onChange={this.showAllRender}>Показать все</Checkbox>

                        </div>
                    </div>
                </div>
                <div className='LegalEntities__body'>

                    <AntTable

                        columns={[{
                            title: '№',
                            className: 'column-money',
                            dataIndex: 'idss',
                            key: "idss",
                            width: '5%',
                            sorter: (a, b) => a - b,
                            sortOrder: 'ascend'
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
                                            // ref={ele => this.name = ele}
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
                                width: '20%',
                                title: 'Вид принимаемой документации',
                                className: 'column-money',
                                dataIndex: 'orgDocType',
                                key: "orgDocType",
                                render: (obj) => {
                                    if (!!obj) {
                                        let newArr = []
                                        if (obj.length > 0) {
                                            for (let val of obj) {
                                                newArr.push(val.label)
                                            }
                                            let unique = newArr.filter(function (elem, index, self) {
                                                return index === self.indexOf(elem);
                                            })
                                            return unique.join(",")

                                        }
                                    }

                                }
                            },


                        ]}
                        dataSource={this.filteredData}
                        bordered
                        footer={this.renderTableFooter}
                        loading={this.state.loading}
                        onRowClick={this.changeSelectedRow}
                        rowClassName={record => {
                            return !!this.state.selectedRow && this.state.selectedRow.id === record.id ? 'row-selected' : ''
                        }}


                    />

                    <CSSTransition
                        in={this.state.openCard}
                        timeout={300}
                        classNames="card"
                        unmountOnExit
                    >
                        <SiderCard className="minW900px"
                                   closer={
                                       <Button
                                           type="danger"
                                           onClick={() => this.setState({openCard: false})}
                                           shape="circle"
                                           style={{left: 0, top: 20}}
                                           icon="arrow-right"
                                       />
                                   }
                        >
                            <Card className="minW900px" initialValues={this.state.selectedRow} {...this.props}
                                  dateIncludeOfIk={this.state.dateReport}/>
                        </SiderCard>
                    </CSSTransition>


                </div>


            </div>
        );
    }

}


function mapStateToProps(state) {
    return {
        tofiConstants: state.generalData.tofiConstants,
        orgSourceCube: state.cubes.orgSourceCube,
        fundmakerArchiveOptions: state.generalData[FUND_MAKER_ARCHIVE],
        user: state.auth.user,
        formOfAdmissionOptions: state.generalData[FORM_OF_ADMISSION],
        orgSourceCubeSingle: state.cubes.orgSourceCubeSingle,
        indSourceCubeSingle: state.cubes.indSourceCubeSingle,
        IK_FUNDMAKER_ACTIVE: state.generalData.IK_FUNDMAKER_ACTIVE
    }
}

export default connect(mapStateToProps, {getCube, getPropVal, getObjByObjVal})(TablelegalEntities);