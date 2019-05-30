/**
 * Created by Konstantin.Tsay on 23.05.2019.**/
import React, {Component} from "react";
import axios from "axios";
import {Button, Form, Collapse} from "antd";
import {parseCube_new, parseForTable} from "../../utils/cubeParser";
import AntTable from "../AntTable";


class CaseDamage extends Component {
    state = {
        dmgReason:'',
        columnsDmg: [
            {
                key: "idx",
                title: "",
                dataIndex: 'idx',
                width: '5%'
            },
            {
                key: 'indexDamage',
                title: this.props.tofiConstants['indexDamage'].name.ru,
                dataIndex: 'indexDamage',
                render: (obj) => obj && obj.map(el => el.label).join(', '),
                width: '55%',

            },
            {
                key: 'descriptionDamage',
                title: this.props.tofiConstants['descriptionDamage'].name.ru,
                dataIndex: 'descriptionDamage',
                width: '40%',
                render: obj => obj && obj.value
            }
            
        ],
        tableDataDamage: '',
        tableDataIrrDmg: '',
        irrDmg: [{
            key: "idx",
            title: '#',
            dataIndex: 'idx',
            width: '10%'

        },
            {
                key: "irreparableDamage",
                title: this.props.tofiConstants['irreparableDamage'].name.ru,
                dataIndex: 'irreparableDamage',
                width: '40%',
                render: obj => obj ? obj.map(el => el.label).join(', ') : 'Отсутсвуют',

            }, {
                key: 'descriptionDamage',
                title: this.props.tofiConstants['descriptionDamage'].name.ru,
                dataIndex: 'descriptionDamage',
                width: '40%',
                render: obj => obj ? obj.value : 'Нет описания'
            }],
        noStorageReasonCase: ''
    };


    renderTableData = (item, idx) => {
        var constArr = ['descriptionDamage', 'noStorageReasonCase', 'irreparableDamage'];
        var result = {idx: idx + 1};
        parseForTable(item.props, this.props.tofiConstants, result, constArr);
        return result;
    };

    renderTableDataDamage = (item, idx) => {
        var constArr = ['descriptionDamage', 'indexDamage',  'deliveryPurpose'];
        debugger;
        var result = {
            key: item.id,
            idx: idx + 1
        };
        parseForTable(item.props, this.props.tofiConstants, result, constArr);
        return result;
    };

    buildComponent = () => {
        const {t, tofiConstants, saveProps, initialValues, keyInv, invType, docType} = this.props;
        var caseId = this.props.initialValues.key;

        /*Собираем неисправимые повреждения и причины из дела*/
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
        axios.post(`/${localStorage.getItem('i18nextLng')}/cube/getCubeData`, fd).then(res => {
            console.log(res);
            var cubeData = res.data.data;
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
            var dmgReason = tableData[0] && tableData[0].noStorageReasonCase ? tableData[0].noStorageReasonCase.label : 'Отсутсвует';
            this.setState({
                tableDataIrrDmg: tableData,
                dmgReason:dmgReason
            })
        });
        /*Закончили собирать неисправимые повреждения*/


        /*собираем повреждения через работы по данному делу*/
        var filterWorks = {
            filterDOAnd: [
                {
                    dimConst: 'doForWorks',
                    concatType: "and",
                    conds: [
                        {
                            clss: "casesForTemporaryUse",
                        },
                        {
                            data: {
                                dimPropConst: "dpForWorks",
                                propConst: "workRegCase",
                                valueRef: {id: String(caseId)}
                            }
                        },
                    ]
                }
            ],
            filterDPAnd: [
                {
                    dimConst: 'dpForWorks',
                    concatType: "and",
                    conds: [
                        {
                            consts: "descriptionDamage,indexDamage,deliveryPurpose"
                        }
                    ]
                }
            ],
        };
        const fd2 = new FormData();
        fd2.append("cubeSConst", 'cubeForWorks');
        fd2.append("filters", JSON.stringify(filterWorks));
        axios.post(`/${localStorage.getItem('i18nextLng')}/cube/getCubeData`, fd2).then(res2 => {
            var cubeData = res2.data.data;
            const parsedCube = parseCube_new(
            cubeData["cube"],
            [],
            "dp",
            "do",
            cubeData['do_' + this.props.tofiConstants.doForWorks.id],
            cubeData['dp_' + this.props.tofiConstants.dpForWorks.id],
            ['do_' + this.props.tofiConstants.doForWorks.id],
            ['dp_' + this.props.tofiConstants.dpForWorks.id]
            );
            debugger;
            var worksWithTarget = parsedCube.filter(el => {
                var deliveryPurpose = el.props.find(prop => prop.prop == this.props.tofiConstants.deliveryPurpose.id);
                if (!!deliveryPurpose.values) {
                    return el;
                }
            });
            debugger;
            var tableDataDamage = worksWithTarget.map(this.renderTableDataDamage);
            this.setState({
                tableDataDamage: tableDataDamage
            })
        });
    };


    componentDidMount() {
        this.buildComponent()
    }


    render() {
        const {t, tofiConstants, saveProps, initialValues, keyInv, invType, docType} = this.props;
        return (
        <div>
            <br/>
            <AntTable
            bordered
            columns={this.state.columnsDmg}
            dataSource={this.state.tableDataDamage}
            size='small'
            pagination={false}
            scroll={{y: '100%'}}
            />

            <br/> <br/>
            <AntTable
            bordered
            columns={this.state.irrDmg}
            dataSource={this.state.tableDataIrrDmg}
            size='small'
            pagination={false}
            scroll={{y: '100%'}}
            />
            <p>Причина по которой дело не подлежит хранению :<b>{this.state.dmgReason}</b></p>
        </div>
        )
    }
}


export default CaseDamage;