import React from "react"
import {connect} from "react-redux";
import { FORM_OF_ADMISSION, FUND_MAKER_ARCHIVE
} from '../../constants/tofiConstants';

import {getCube, getPropVal, getIdGetObj, getUserInfo, getObjByObjVal, getUserInformation} from '../../actions/actions';
import Button from "antd/es/button/button";
import moment from "moment/moment";
import Select from "../Select";
import DatePicker from "antd/es/date-picker/index";
import Checkbox from "antd/es/checkbox/Checkbox";
import {parseCube_new, parseForTable} from "../../utils/cubeParser";
import {message} from "antd/lib/index";
import Input from "antd/es/input/Input";


class EntitiesIndividuals extends React.Component {
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

    render(){
        const {t, tofiConstants, fundmakerArchiveOptions, formOfAdmissionOptions} = this.props;
        const { fundmakerArchive, formOfAdmission} = tofiConstants;

        const {filter} = this.state;

        this.lng = localStorage.getItem("i18nextLng");

        return(
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


            </div>
        )
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

export default connect(mapStateToProps, {getCube, getPropVal, getObjByObjVal})(EntitiesIndividuals);