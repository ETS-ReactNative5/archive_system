import React from 'react';
import {Button, Col, Row} from "antd";
import AntTable from "../../../AntTable";
import axios from "axios";
import {
    crashedAct, getAct1, getIdGetObj,
    lightToDestroy
} from "../../../../actions/actions";
import moment from "moment";
import {parseCube_new, parseForTable} from "../../../../utils/cubeParser";
import ReactDOMServer from 'react-dom/server';

class TransferAct extends React.Component {
    state = {
        fundArchive: 'state Архив',
        date: 'state Date',
        number: 'state Number',
        podpis: 'state Расшифрока подписи',
        fundNumber: 'state fundNumber',
        workRegFund: 'state workRegFund',
        invNumber: 'state invNumber',
        startDate: 'state startDate',
        endDate: 'state endDate',
        caseAvailabilityCheck: 'state caseAvailabilityCheck',
        caseStorageMulti: 'state caseStorageMulti',
        total: 'state total',
        year: '2019',
        nacladDate: '',
        nacladNumb: '',
        savedList: '0',
        orgName: '',
        loading: true,
        savedList: '',
        tableDataNSA: [],
        tableDataTrans: [{
           d2:this.props.initialValues.workAssignedTo.label
        }],
        nmDocsLinks: 'state nmDocsLinks',
        columnsTrans: [{
            title: 'Должность',
            dataIndex: 'd1',
            key: 'd1',
            width: '18%'
        }, {
            title: 'Подпись',
            dataIndex: 'p1',
            key: 'p1',
            width: '16%'
        }, {
            title: 'Расшифровка описи',
            dataIndex: 'r1',
            key: 'r1',
            width: '16%',
        }, {
            title: 'Должность',
            dataIndex: 'd2',
            key: 'd2',
            width: '18%'
        }, {
            title: 'Подпись',
            dataIndex: 'p2',
            key: 'p2',
            width: '16%'
        }, {
            title: 'Расшифровка описи',
            dataIndex: 'r2',
            key: 'r2',
            width: '16%',
        }],

        columnsNSA: [{
            title: 'п/п №',
            dataIndex: 'idx',
            key: 'idx',
            width: '10%',
            render: (obj, rec, i) => {
                return i + 1;
            }
        }, {
            title: 'Название, номер описи',
            dataIndex: 'workRegInv',
            key: 'workRegInv',
            width: '35%',
            render: obj => this.props.initialValues.workRegInv.label
        }, {
            title: 'Кол-во экземпляров описи',
            dataIndex: 'copyQuantity',
            key: 'copyQuantity',
            width: '20%',
            render:obj=>obj && obj.value
        }, {
            title: 'Кол-во ед. хр.',
            dataIndex: 'caseCounts',
            key: 'caseCounts',
            width: '10%',
            render:obj => this.state.countCases
        }, {
            title: 'Примечание',
            dataIndex: 'caseNotes',
            key: 'caseNotes',
            width: '25%',
            render: obj => obj && obj.ru
        }]
    };

    printContent = () => {
        return (<div>
            <h2 className="text-center" style={{textAlign: "center"}}>
                Акт приема-передачи документов на хранение</h2>


            <Row>
                <Col style={{width: "41.6%", float: "left"}}>Утверждаю</Col> <Col
            style={{width: "41.6%", float: "right"}}>Утверждаю<br/>Директор</Col>
            </Row>


            <Row style={{clear: "both"}}>
                <Col style={{width: "41.6%", float: "left"}}>
                    <span
                    style={{textDecoration: "underline"}}>________________________</span><br/>(Наименование
                    должности руководителя организации-сдатчика)</Col>

                <Col style={{width: "41.6%", float: "right"}}>
                    <span
                    style={{textDecoration: "underline"}}>{this.state.fundArchive}</span><br/>Название
                    архива</Col>
            </Row>


            <Row style={{clear: "both"}}>

                <Col
                style={{width: "41.6%", float: "left"}}>_________________________<br/>Подпись
                    Расшифровка подписи Дата Печать</Col>


                <Col
                style={{width: "41.6%", float: "right"}}>_________________________<br/>Подпись
                    Расшифровка подписи Дата Печать</Col>
            </Row>


            <Row>
                <h1 className="text-center upp-case"
                    style={{textAlign: "center", textTransform: "uppercase"}}>Акт</h1>
            </Row>
            <Row>
                <Col style={{width: "50%", float: "left"}}> <span
                style={{textDecoration: "underline"}}>{this.props.initialValues.workActualEndDate.value} </span>№
                    <span
                    style={{textDecoration: "underline"}}> {this.props.actNumber}</span>
                    <br/>(Дата)</Col>
            </Row>

            <br/>
            <h2 style={{textAlign: "center"}}>приема-передачи документов на хранение</h2>


            <Row style={{textAlign: "center"}}> <br/>
                <p style={{borderBottom: '1px solid black'}}></p>
                <span
                style={{textAlign: 'center'}}>(основание передачи)</span></Row>

            <Row
            style={{textAlign: "center"}}>{this.props.initialValues.workRegFund.label}
                <br/><span
                style={{textAlign: 'center'}}>(Название передаваемого фонда)</span></Row>

            <Row>
                <span
                style={{textDecoration: "underline"}}> </span>
                сдал,<br/>(название организации, сдатчика)</Row>

            <Row> <span
            style={{textDecoration: "underline"}}>{this.state.fundArchive}</span> принял
                <br/>(название архива)
            </Row>

            <br/>

            <Row>Документы названного фонда и научно-справочный аппарат к ним:</Row>
            <AntTable pagination={false} loading={this.state.loading}
                      dataSource={this.state.tableDataNSA}
                      columns={this.state.columnsNSA}/>
            <br/>
            <Row>Итого принято  <span style={{textDecoration: "underline"}}>{this.state.countCases}</span> ед.хр.</Row>
            <br/>
            <Row>Передачу произвели:                          <span style={{marginLeft:'50px'}}>Прием произвели:</span></Row>
            <AntTable pagination={false} loading={this.state.loading}
                      dataSource={this.state.tableDataTrans}
                      columns={this.state.columnsTrans}/>


            <Row>
                Фонду присвоен №_____________________________ <span
            style={{textDecoration: "underline"}}>{this.state.countCases}</span> ед.хр.
            </Row>


            <h3><br/>Изменения в учетные документы внесены</h3>
            <Row>
                <Col col={24}>{this.props.initialValues.workAssignedTo.label}</Col>
            </Row>
        </div>)
    };

    toPrint = (printThis) => {
        const htmlString = ReactDOMServer.renderToString(printThis);
        var win = window.open();
        win.document.open();
        win.document.write('<' + 'html' + '><' + 'body' + '>');
        win.document.write(htmlString);
        win.document.write('<' + '/body' + '><' + '/html' + '>');
        win.document.close();
        win.print();
        win.close();
    };

    componentDidMount() {
        getAct1((this.props.workId).split('_')[1]).then(res => {
            let data = res.data;
            this.setState({
                fundNumber: data.fundNumber,
                fundArchive: data.fundArchive.ru,
                invNumber: data.invNumber,

            })
        });

        getIdGetObj(this.props.initialValues.workRegInv.value, 'doForInv').then(res => {
            console.log(res);
            var invId = res.data.idDimObj;


            const filters = {
                filterDOAnd: [
                    {
                        dimConst: 'doForInv',
                        concatType: "and",
                        conds: [
                            {
                                ids: String(invId)
                            }

                        ]
                    }
                ],
                filterDPAnd: [
                    {
                        dimConst: 'dpForInv',
                        concatType: "and",
                        conds: [
                            {
                                consts: "copyQuantity"
                            }
                        ]
                    }
                ]
            };
            const fd = new FormData();
            fd.append("cubeSConst", 'CubeForAF_Inv');
            fd.append("filters", JSON.stringify(filters));
            axios.post(`/${localStorage.getItem('i18nextLng')}/cube/getCubeData`, fd).then(res => {
                var cubeData = res.data.data;
                const parsedCube = parseCube_new(
                cubeData["cube"],
                [],
                "dp",
                "do",
                cubeData['do_' + this.props.tofiConstants.doForInv.id],
                cubeData['dp_' + this.props.tofiConstants.dpForInv.id],
                ['do_' + this.props.tofiConstants.doForInv.id],
                ['dp_' + this.props.tofiConstants.dpForInv.id]
                );

                var tableDataNSA = parsedCube.map(this.renderTableData);
                this.setState({
                    tableDataNSA:tableDataNSA
                })



                /*получаем дела из работы*/
                const filters = {
                    filterDOAnd: [
                        {
                            dimConst: 'doForCase',
                            concatType: "and",
                            conds: [
                                {
                                    data: {
                                        dimPropConst: 'dpForCase',
                                        propConst: 'caseInventory',
                                        valueRef: {id: String(invId)}
                                    }
                                },
                            ]
                        }
                    ],
                    filterDPAnd: [
                        {
                            dimConst: 'dpForCase',
                            concatType: "and",
                            conds: [
                                {
                                    consts: "caseInventory,fundFeature"
                                }
                            ]
                        }
                    ]
                };
                const fd2 = new FormData();
                fd2.append("cubeSConst", 'CubeForAF_Case');
                fd2.append("filters", JSON.stringify(filters));
                axios.post(`/${localStorage.getItem('i18nextLng')}/cube/getCubeData`, fd2).then(res => {
                var countCases=res.data.data.cube.filter(el=>el.idRef==this.props.tofiConstants.included.id).length;
                this.setState({
                    countCases:countCases,
                    loading: false
                })
                })

            })
        })
    }


    renderTableData = (item, idx) => {
        const constArr = ['copyQuantity'];
        const result = {
            idx: idx + 1,
            id: item.id,
            name: item.name.ru,
            workRegFund: this.props.initialValues.workRegFund.label
        };
        parseForTable(item.props, this.props.tofiConstants, result, constArr);
        return result;
    };

    componentDidUpdate(prevProps) {

    }

    render() {
        const {t, tofiConstants, initialValues, workId} = this.props;
        var fundName = initialValues.workRegFund.labelFull;
        return (

        <div className="act_print">
            <Button type='primary' onClick={() => this.toPrint(this.printContent())}>Распечатать</Button>
            {this.printContent()}
        </div>
        )
    }


}


export
default
TransferAct;