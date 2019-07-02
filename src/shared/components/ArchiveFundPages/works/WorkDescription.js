import React from 'react';
import {Button, Icon, Input, Modal, Radio, Table} from 'antd';
import {getIdGetObj, getPropValByConst} from '../../../actions/actions'
import AntTable from "../../AntTable";
import PrintAct from "./PrintAct.js";
import axios from 'axios';
import {parseCube_new, parseForTable} from "../../../utils/cubeParser";
import SearchDescription from "./SearchDescription";
import GetWorkDescription from "../../SourcingPages/works/GetWorkDescription";

const TextArea = Input.TextArea;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;


const columns = [
    {
        width: '4%',
        title: '#',
        dataIndex: 'idx',
        key: 'idx',
        render: (text, rec, i) => {
            return i + 1
        }
    },
    {
        width: '75%',
        title: 'Наименование акта',
        dataIndex: 'name',
        key: 'name',
    },
    {
        width: '13%',
        title: '№ Акта',
        dataIndex: 'actNumber',
        key: 'actNumber',
    },
    {
        width: '8%',
        title: '',
        dataIndex: "showAct",
        key: 'showAct'
    }
];


class WorkDescription extends React.PureComponent {
    state = {
        irrDmg: [{
            key: "irreparableDamage",
            title: this.props.tofiConstants['irreparableDamage'].name.ru,
            dataIndex: 'irreparableDamage',
            width: '40%',
            render: obj => obj && obj.map(el => el.label).join(', '),

        }, {
            key: 'noStorageReasonCase',
            title: this.props.tofiConstants['noStorageReasonCase'].name.ru,
            dataIndex: 'noStorageReasonCase',
            render: obj => obj && obj.label,
            width: '40%'

        }, {
            key: 'descriptionDamage',
            title: this.props.tofiConstants['descriptionDamage'].name.ru,
            dataIndex: 'descriptionDamage',
            width: '20%',
            render: obj => obj && obj.value
        }],
        tableDataIrrDmg: [],
        columnsDmg: [
            {
                key: "idx",
                title: "",
                dataIndex: 'idx',
                width: '5%',
                render: ('')
            },
            {
                key: 'indexDamage',
                title: this.props.tofiConstants['indexDamage'].name.ru,
                dataIndex: 'indexDamage',
                render: (obj) => this.props.initialValues.indexDamage && this.props.initialValues.indexDamage.map(el => el.label).join(', '),
                width: '55%',

            },
            {
                key: 'descriptionDamage',
                title: this.props.tofiConstants['descriptionDamage'].name.ru,
                dataIndex: 'descriptionDamage',
                width: '40%',
                render: obj => this.props.initialValues.descriptionDamage
            }
        ],
        showOnlySearch: false,
        showOnlyLP: false,
        visible: false,
        selectedRow: '',
        workDescription: {
            kz: '',
            en: '',
            ru: ''
        },
        dataSource: [],
        tableDataDMG: [{idx: ''}],
        lang: localStorage.getItem('i18nextLng'),
        dirty: false,
        type: ''
    };
    handleOk = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };
    onLangChange = e => {
        this.setState({lang: e.target.value})
    };

    onChange = e => {
        this.setState({
            workDescription: {
                ...this.state.workDescription,
                [this.state.lang]: e.target.value
            },
            dirty: true
        })
    };


    renderTableData = item => {
        const constArr = ['descriptionDamage', 'noStorageReasonCase', 'irreparableDamage'];
        const result = {
            key: item.id
        };
        parseForTable(item.props, this.props.tofiConstants, result, constArr);
        return result;
    };

    renderIrrDmg = () => {
        if (!!this.props.initialValues.workRegCase){
            getIdGetObj(this.props.initialValues.workRegCase.value, 'doForCase').then(
                res => {
                    var caseId = res.data.idDimObj;
                    var getCaseFilter = {
                        filterDOAnd: [
                            {
                                dimConst: 'doForCase',
                                concatType: "and",
                                conds: [
                                    {
                                        ids: String(caseId),
                                    }
                                ]
                            }
                        ],
                        filterDPAnd: [
                            {
                                dimConst: 'dpForCase',
                                concatType: "and",
                                conds: [
                                    {
                                        consts: "noStorageReasonCase,descriptionDamage,irreparableDamage"
                                    }
                                ]
                            }
                        ],
                    };
                    const fd = new FormData();
                    fd.append("cubeSConst", 'CubeForAF_Case');
                    fd.append("filters", JSON.stringify(getCaseFilter));
                    axios.post(`/${localStorage.getItem('i18nextLng')}/cube/getCubeData`, fd).then(res2 => {
                        console.log(res2);
                        var cubeData = res2.data.data;
                        const parsedCube = parseCube_new(
                            cubeData["cube"],
                            [],
                            "dp",
                            "do",
                            cubeData['do_' + this.props.tofiConstants.doForCase.id],
                            cubeData['dp_' + this.props.tofiConstants.dpForCase.id],
                            ['do_' + this.props.tofiConstants.doForCase.id],
                            ['dp_' + this.props.tofiConstants.dpForCase.id]
                        );
                        var tableData = parsedCube.map(this.renderTableData);
                        this.setState({
                            tableDataIrrDmg: tableData
                        })
                    })
                }
            )
        }

    };


    showAct = (type, actNumber) => {
        console.log(this.props.initialValues.key, type);
        this.setState({visible: true, type: type, actNumber: actNumber})
    };

    componentDidMount() {
        this.props.initialValues.workType.workTypeClass == 'caseDisposal' && this.renderIrrDmg();

        getIdGetObj(this.props.initialValues.workRegFund.value, 'doForFundAndIK').then(res => {
            console.log(res);
            var fundID = res.data.idDimObj;


            var filterFundType = {
                filterDOAnd: [
                    {
                        dimConst: 'doForFundAndIK',
                        concatType: "and",
                        conds: [
                            {
                                ids: String(fundID),
                            }
                        ]
                    }
                ],
                filterDPAnd: [
                    {
                        dimConst: 'dpForFundAndIK',
                        concatType: "and",
                        conds: [
                            {
                                consts: "fundNumber"
                            }
                        ]
                    }
                ],
            };
            const fd = new FormData();
            var doForFund = this.props.tofiConstants.doForFundAndIK.id;
            var fundLPConstId = this.props.tofiConstants.fundLP.id;
            var notFoundId = this.props.tofiConstants.notFound.id;
            fd.append("cubeSConst", 'cubeForFundAndIK');
            fd.append("filters", JSON.stringify(filterFundType));
            axios.post(`/${localStorage.getItem('i18nextLng')}/cube/getCubeData`, fd).then(res2 => {
                console.log(res2);
                res2.data.data['do_' + doForFund][0].clsORtr == fundLPConstId && this.setState({
                    showOnlyLP: true
                });

                this.props.initialValues.workStatusReg && this.props.initialValues.workStatusReg.value == notFoundId && this.setState({
                    showOnlySearch: true
                });
                console.log(this.props.initialValues);
                var fundName = this.props.initialValues.workRegFund.labelFull;
                var workType = this.props.initialValues.workType.workTypeClass;
                var filterOfActs = [];
                var parentId = this.props.initialValues.parent;
                var getParentClass = {
                    filterDOAnd: [
                        {
                            dimConst: 'doForWorks',
                            concatType: "and",
                            conds: [
                                {
                                    ids: String(parentId),
                                }
                            ]
                        }
                    ],
                    filterDPAnd: [
                        {
                            dimConst: 'dpForWorks',
                            concatType: "and",
                            conds: [
                                {
                                    consts: "workDate"
                                }
                            ]
                        }
                    ],
                };
                const fd = new FormData();
                fd.append("cubeSConst", 'cubeForWorks');
                fd.append("filters", JSON.stringify(getParentClass));
                axios.post(`/${localStorage.getItem('i18nextLng')}/cube/getCubeData`, fd).then(res3 => {
                    console.log(res3);
                    var workTypeId = res3.data.data['do_' + this.props.tofiConstants.doForWorks.id][0].clsORtr;
                    var caseSearchId = this.props.tofiConstants.caseSearch.id;
                    var caseExaminationId = this.props.tofiConstants.caseExamination.id;
                    workType == 'caseAvailabilityCheck' && filterOfActs.push({
                        idx: '1',
                        name: 'Акт проверки наличия и состояния архивных документов: ' + fundName,
                        actNumber: this.props.initialValues.key.slice(-4) + '_1',
                        showAct: <Button
                        onClick={() => this.showAct('damage', this.props.initialValues.key.slice(-4) + '_1')}
                        type="primary"
                        shape="circle"><Icon type="eye"/></Button>
                    });
                    workType == 'caseAvailabilityCheck' && filterOfActs.push({
                        idx: '2',
                        name: 'Акт об обнаружении архивных документов',
                        actNumber: this.props.initialValues.key.slice(-4) + '_2',
                        showAct: <Button
                        onClick={() => this.showAct('irrDamage', this.props.initialValues.key.slice(-4) + '_2')}
                        type="primary"
                        shape="circle"><Icon type="eye"/></Button>
                    });
                    if (workType == 'caseExamination') {
                        filterOfActs.push({
                            idx: '3',
                            name: 'Акт о выделении к уничтожению документов, не подлежащих хранению',
                            actNumber: this.props.initialValues.key.slice(-4) + '_3',
                            showAct: <Button
                            onClick={() => this.showAct('lightToDestroy', this.props.initialValues.key.slice(-4) + '_3')}
                            type="primary"
                            shape="circle"><Icon type="eye"/></Button>
                        });
                    }
                    if (workType == 'caseExamination') {
                        filterOfActs.push({
                            idx: '4',
                            name: 'Акт о неисправимых повреждениях документов',
                            actNumber: this.props.initialValues.key.slice(-4) + '_4',
                            showAct: <Button
                            onClick={() => this.showAct('CrashedAct', this.props.initialValues.key.slice(-4) + '_4')}
                            type="primary"
                            shape="circle"><Icon type="eye"/></Button>
                        })
                    }
                    if (workTypeId == caseSearchId && workType == 'caseDisposal') {
                        filterOfActs.push({
                            idx: '8',
                            name: 'Акт о не обнаружении документов, пути розыска которых исчерпаны',
                            actNumber: parentId.slice(-4) + '_8',
                            showAct: <Button
                            onClick={() => this.showAct('SearchAct', parentId.slice(-4) + '_8')}
                            type="primary"
                            shape="circle"><Icon type="eye"/></Button>
                        })
                    }
                    ;
                    if (workTypeId == caseExaminationId && workType == 'caseDisposal') {
                        filterOfActs.push({
                            idx: '3',
                            name: 'Акт о выделении к уничтожению документов, не подлежащих хранению',
                            actNumber: parentId.slice(-4) + '_3',
                            showAct: <Button
                            onClick={() => this.showAct('lightToDestroy', parentId.slice(-4) + '_3')}
                            type="primary"
                            shape="circle"><Icon type="eye"/></Button>
                        });
                        filterOfActs.push({
                            idx: '4',
                            name: 'Акт о неисправимых повреждениях документов',
                            actNumber: parentId.slice(-4) + '_4',
                            showAct: <Button
                            onClick={() => this.showAct('CrashedAct', parentId.slice(-4) + '_4')}
                            type="primary"
                            shape="circle"><Icon type="eye"/></Button>
                        })
                    }
                    (this.state.showOnlyLP === false && workType === 'caseRegistration') && filterOfActs.push({
                        idx: '5',
                        name: 'Акт приема-передачи документов на хранение',
                        actNumber: this.props.initialValues.key.slice(-4) + '_5',
                        showAct: <Button
                        onClick={() => this.showAct('TransferAct', this.props.initialValues.key.slice(-4) + '_5')}
                        type="primary"
                        shape="circle"><Icon type="eye"/></Button>
                    });
                    (this.state.showOnlyLP === true && workType === 'caseRegistration') && filterOfActs.push({
                        idx: '6',
                        name: 'Акт приема на хранение документов личного происхождения',
                        actNumber: this.props.initialValues.key.slice(-4) + '_6',
                        showAct: <Button
                        onClick={() => this.showAct('TransferLPAct', this.props.initialValues.key.slice(-4) + '_6')}
                        type="primary"
                        shape="circle"><Icon type="eye"/></Button>
                    });
                    (workType === 'casesForTemporaryUse') && filterOfActs.push({
                        idx: '7',
                        name: 'Акт о выдаче архивных документов во временное пользование',
                        actNumber: this.props.initialValues.key.slice(-4) + '_7',
                        showAct: <Button
                        onClick={() => this.showAct('GiveToAct', this.props.initialValues.key.slice(-4) + '_7')}
                        type="primary"
                        shape="circle"><Icon type="eye"/></Button>
                    });
                    (this.state.showOnlySearch === true && workType === 'caseSearch') && filterOfActs.push({
                        idx: '8',
                        name: 'Акт о не обнаружении документов, пути розыска которых исчерпаны',
                        actNumber: this.props.initialValues.key.slice(-4) + '_8',
                        showAct: <Button
                        onClick={() => this.showAct('SearchAct', this.props.initialValues.key.slice(-4) + '_8')}
                        type="primary"
                        shape="circle"><Icon type="eye"/></Button>
                    });
                    this.setState({
                        dataSource: filterOfActs
                    });
                });
            });
        });


        getPropValByConst('workDescription')
        .then(data => console.log(data))
        .catch(err => console.error(err))
    }

    componentDidUpdate(prevProps) {
        if (prevProps.initialValues.key !== this.props.initialValues.key) {
            console.log(document.getElementById("root"));
        }
    }

    initialState = this.state;


    cancel = () => {
        this.setState(this.initialState);
    };

    changeSelectedRow = record => {
        this.setState({selectedRow: record})
    };


    render() {
        this.lng = localStorage.getItem('i18nextLng');
        const {t} = this.props;
        return (
        <div>
            <div className="work-description p20">
                <GetWorkDescription
                t={t}
                initialValues={this.props.initialValues}
                />
            </div>
            {this.props.initialValues.workType.workTypeClass == 'caseSearch' &&
            <SearchDescription
            t={t}
            tofiConstants={this.props.tofiConstants}
            initialValues={this.props.initialValues}
            searchStatus={this.props.initialValues.workStatusReg}
            />
            }
            {

                this.props.initialValues.workType.workTypeClass == 'casesForTemporaryUse' &&
                <div>
                    <br/>
                    <hr/>
                    <br/>
                    <AntTable
                    bordered
                    columns={this.state.columnsDmg}
                    dataSource={this.state.tableDataDMG}
                    size='small'
                    pagination={false}
                    scroll={{y: '100%'}}
                    />
                </div>
            }

            {


                this.props.initialValues.workType.workTypeClass == 'caseDisposal' &&
                <div><br/>
                    <hr/>
                    <br/>

                    <AntTable
                    bordered
                    columns={this.state.irrDmg}
                    dataSource={this.state.tableDataIrrDmg}
                    size='small'
                    pagination={false}
                    scroll={{y: '100%'}}
                    />
                </div>
            }


            <div>

                {this.props.initialValues.workStatusReg && (
                this.props.initialValues.workStatusReg.value == this.props.tofiConstants.accepted.id ||
                this.props.initialValues.workStatusReg.value == this.props.tofiConstants.issued.id ||
                this.props.initialValues.workStatusReg.value == this.props.tofiConstants.returned.id ||
                this.props.initialValues.workStatusReg.value == this.props.tofiConstants.notFound.id
                ) ?
                <AntTable
                size='small'
                rowClassName={record => this.state.selectedRow && this.state.selectedRow.key === record.key ? 'row-selected' : ''}
                dataSource={this.state.dataSource} columns={columns}/> : '' }
            </div>
            <Modal
            className="ant-modal w-845"
            visible={this.state.visible}
            cancelText="Закрыть"
            onCancel={this.handleCancel}
            footer={false}
            >

                <PrintAct
                tofiConstants={this.props.tofiConstants}
                initialValues={this.props.initialValues}
                workId={this.props.initialValues.key}
                type={this.state.type}
                actNumber={this.state.actNumber}
                />
            </Modal>
        </div>
        )
    }
}

export default WorkDescription;