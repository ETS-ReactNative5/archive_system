import React from 'react';
import {Button, Col, Row, Select} from "antd";
import AntTable from "../../../AntTable";
import axios from "axios";
import {
    crashedAct, getAct1, getIdGetObj,
    lightToDestroy
} from "../../../../actions/actions";
import moment from "moment";
import {parseCube_new, parseForTable} from "../../../../utils/cubeParser";
import ReactDOMServer from 'react-dom/server';
import ReactToPrint from 'react-to-print';
import './PrintAct.css';
const { Option } = Select;

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
        orgName: '',
        page: 'ru',
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
            width: '12%'
        }, {
            title: 'Расшифровка описи',
            dataIndex: 'r1',
            key: 'r1',
            width: '20%',
        }, {
            title: 'Должность',
            dataIndex: 'd2',
            key: 'd2',
            width: '18%'
        }, {
            title: 'Подпись',
            dataIndex: 'p2',
            key: 'p2',
            width: '12%'
        }, {
            title: 'Расшифровка описи',
            dataIndex: 'r2',
            key: 'r2',
            width: '20%',
        }],

        columnsNSA: [{
            title: 'Порядковый номер',
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
            title: 'Количество экземпляров описи',
            dataIndex: 'copyQuantity',
            key: 'copyQuantity',
            width: '25%',
            render:obj=>obj && obj.value
        }, {
            title: 'Количество единиц хранения',
            dataIndex: 'caseCounts',
            key: 'caseCounts',
            width: '17%',
            render:obj => this.state.countCases
        }, {
            title: 'Примечание',
            dataIndex: 'caseNotes',
            key: 'caseNotes',
            width: '12%',
            render: obj => obj && obj.ru
        }],
        columnsNSAKaz: [{
            title: 'Реттік нөмірі',
            dataIndex: 'idx',
            key: 'idx',
            width: '10%',
            render: (obj, rec, i) => {
                return i + 1;
            }
        }, {
            title: 'Тізімдеменің атауы, нөмірі',
            dataIndex: 'workRegInv',
            key: 'workRegInv',
            width: '35%',
            render: obj => this.props.initialValues.workRegInv.label
        }, {
            title: 'Тізімдеме даналарының саны',
            dataIndex: 'copyQuantity',
            key: 'copyQuantity',
            width: '25%',
            render:obj=>obj && obj.value
        }, {
            title: 'Сақтау бірліктерінің саны',
            dataIndex: 'caseCounts',
            key: 'caseCounts',
            width: '17%',
            render:obj => this.state.countCases
        }, {
            title: 'Ескертпе',
            dataIndex: 'caseNotes',
            key: 'caseNotes',
            width: '12%',
            render: obj => obj && obj.ru
        }]
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

    onChangeLng = (value) => {debugger
        if(value !== this.state.page){
            this.setState({
                page: value
            });
        }
    }

    render() {
        const {t, tofiConstants, initialValues, workId} = this.props;
        const fundName = initialValues.workRegFund.labelFull;
        return (

        <div className="act_print">
            <Select
                style={{width:"8%", marginRight: '7px'}}
                name="fundmakerArchiveYear"
                isSearchable={false}
                onChange={this.onChangeLng}
                defaultValue={this.state.page}
            >
                <Option value='ru' selected={true}>Ru</Option>
                <Option value='kz'>Kz</Option>
            </Select>
            <ReactToPrint
                trigger={() => <Button type='primary'>Распечатать</Button>}
                content={() => this.componentRef}
            />
            {this.state.page === 'ru' ? (
                <PrintContent {...this.props} {...this.state} ref={el => (this.componentRef = el)}/>
            ) : (
                <PrintContentKaz {...this.props} {...this.state} ref={el => (this.componentRef = el)}/>
            )
            }

        </div>
        )
    }


}

class PrintContent extends React.Component{
    render(){
        let i = 0;      let j = 0;
        return (<div style={{padding: '40px 40px 40px 70px'}}>
            <Row>
                <Col style={{width: "47%", float: "left"}}>
                </Col>
                <Col style={{width: "43%", float: "right"}}>Утверждаю<br/><br/>
                    <p style={{borderBottom: '1px solid black',textAlign: 'center'}}></p><p style={{textAlign: 'center'}}><small>(наименование должности, фамилия,
                        инициалы руководителя архива )</small></p><br/>
                    <p style={{borderBottom: '1px solid black',textAlign: 'center'}}></p><p style={{textAlign: 'center'}}><small>(подпись руководителя архива )</small></p><br/>
                    <p style={{borderBottom: '1px solid black',textAlign: 'center'}}></p><p style={{textAlign: 'center'}}><small>(дата )</small></p>
                </Col>
            </Row><br/><br/>
            <h1 style={{textAlign: "center"}}>Акт приема-передачи документов на хранение</h1>
            <Row style={{textAlign: "center"}}>__________ № __________</Row>
            <Row style={{textAlign: "right"}}><Col style={{width: "46%", float: "left"}}>(дата)</Col></Row><br/>


            <Row style={{textAlign: "center"}}> <br/>
                <p style={{borderBottom: '1px solid black'}}></p>
                <span
                    style={{textAlign: 'center'}}><small>(основание передачи)</small></span></Row><br/>

            <Row
                style={{textAlign: "center"}}>
                <p style={{borderBottom: '1px solid black'}}>{this.props.initialValues.workRegFund.label}</p>
                <span
                    style={{textAlign: 'center'}}><small>(наименование передаваемого архивного фонда)</small></span></Row>
            <br/>
            <Row>
                <p
                    style={{borderBottom: '1px solid black',textAlign: 'center'}}> сдал,</p> <p
                style={{textAlign: 'center'}}>
                <small>(наименование организации-сдатчика)</small></p></Row>
            <br/>
            <Row> <p
                style={{borderBottom: '1px solid black',textAlign: 'center'}}>{this.props.fundArchive} принял</p>  <p
                style={{textAlign: 'center'}}>
                <small>(наименование архива)</small></p>
            </Row>

            <Row><span>документы названного фонда и научно-справочный аппарат к ним</span></Row><br/>

            {/*<AntTable pagination={false} loading={this.props.loading}*/}
            {/*          dataSource={this.props.tableDataNSA}*/}
            {/*          columns={this.props.columnsNSA} className='prntTbl'/>*/}
            <table className="tbltoprint" width="100%">
                <thead>
                <tr>
                    {
                        this.props.columnsNSA.map((el) => {
                            return(
                                <td style={{textAlign: 'center'}}><b>{el.title}</b></td>
                            );
                        })
                    }
                </tr>
                <tr>
                    {
                        this.props.columnsNSA.map((el) => {
                            j++;
                            return(
                                <td style={{textAlign: 'center'}}>{j}</td>
                            );
                        })
                    }
                </tr>
                </thead>
                <tbody>
                {
                    this.props.tableDataNSA.length > 0 ? (
                        this.props.tableDataNSA.map((el) => {
                            let lng = localStorage.getItem('i18nextLng');
                            i++;
                            return(
                                <tr>
                                    <td>{i}</td>
                                    <td>{this.props.initialValues.workRegInv.label}</td>
                                    <td>{!!el.copyQuantity ? el.copyQuantity : ''}</td>
                                    <td>{this.props.countCases}</td>
                                    <td>{!!el.caseNotes ? el.caseNotes[lng] : ''}</td>
                                </tr>
                            );
                        })
                    ) : (<tr><td colSpan='6' style={{textAlign: 'center'}}>нет данных</td></tr>)

                }
                </tbody>
            </table><br/><br/>
            <Row>Итого принято  <span style={{textDecoration: "underline"}}>{this.props.countCases}</span> единиц хранения.</Row>
            <br/>
            {/*<Row>Передачу произвели:                          <span className='a' style={{marginLeft:'50px'}}>Прием произвели:</span><br/><br/></Row>*/}

            {/*<AntTable pagination={false} loading={this.props.loading}*/}
            {/*          dataSource={this.props.tableDataTrans}*/}
            {/*          columns={this.props.columnsTrans} className='prntTbl'/>*/}

            <Row gutter={24}>
                <Col span={12}>
                    <p style={{borderBottom: '1px solid black'}}></p><p style={{textAlign: 'center'}}><small>(наименование должности, фамилия, инициалы, подпись лица, проводившего передачу)</small></p>
                    <p style={{borderBottom: '1px solid black'}}></p><p style={{textAlign: 'center'}}><small>(дата передачи)</small></p>

                </Col>
                <Col span={12}>
                    <p style={{borderBottom: '1px solid black'}}></p><p style={{textAlign: 'center'}}><small>(наименование должности, фамилия, инициалы, подпись лица, проводившего прием)</small></p>
                    <p style={{borderBottom: '1px solid black'}}></p><p style={{textAlign: 'center'}}><small>(дата приема)</small></p>

                </Col>
            </Row><br/><br/>
            <Row><p>Архивному фонду присвоен № _____.<br/>
                Изменения в учетные документы внесены.
            </p><br/></Row>
            <Row>
                <Col span={14}>
                    <p style={{borderBottom: '1px solid black'}}>{this.props.initialValues.workAssignedTo.label}</p><p style={{textAlign: 'center'}}><small>(наименование должности, фамилия, инициалы, подпись лиц (-а), внесшего изменения)</small></p>
                </Col>
            </Row><br/>
            <Row>
                <Col span={8}>
                    <p style={{borderBottom: '1px solid black'}}></p><p style={{textAlign: 'center'}}><small>(дата внесения изменения в учетные документы)</small></p>
                </Col>
            </Row><br/><br/>

            <Row>
                <Col style={{width: "43%", float: "left"}}>Утверждаю<br/><br/>
                    <p style={{borderBottom: '1px solid black',textAlign: 'center'}}></p><p style={{textAlign: 'center'}}><small>(наименование должности, фамилия,
                        инициалы руководителя архива )</small></p><br/>
                    <p style={{borderBottom: '1px solid black',textAlign: 'center'}}></p><p style={{textAlign: 'center'}}><small>(подпись руководителя архива )</small></p><br/>
                    <p style={{borderBottom: '1px solid black',textAlign: 'center'}}></p><p style={{textAlign: 'center'}}><small>(дата )</small></p>
                </Col>
            </Row>
        </div>)
    }
};

class PrintContentKaz extends React.Component{
    render(){
        let i = 0;      let j = 0;
        return (<div style={{padding: '40px 40px 40px 70px'}}>
            <Row>
                <Col style={{width: "47%", float: "left"}}>
                </Col>
                <Col style={{width: "43%", float: "right"}}>Бекітемін<br/><br/>
                    <p style={{borderBottom: '1px solid black',textAlign: 'center'}}></p><p style={{textAlign: 'center'}}><small>(архив басшысы лауазымының атауы,
                        тегі, аты-жөні )</small></p><br/>
                    <p style={{borderBottom: '1px solid black',textAlign: 'center'}}></p><p style={{textAlign: 'center'}}><small>(ұйым басшысының қолтаңбасы)</small></p><br/>
                    <p style={{borderBottom: '1px solid black',textAlign: 'center'}}></p><p style={{textAlign: 'center'}}><small>(күні )</small></p>
                </Col>
            </Row><br/><br/>
            <h1 style={{textAlign: "center"}}>Құжаттарды сақтауға қабылдау-беру актісі</h1>
            <Row style={{textAlign: "center"}}>__________ № __________</Row>
            <Row style={{textAlign: "right"}}><Col style={{width: "46%", float: "left"}}>(күні)</Col></Row><br/>


            <Row style={{textAlign: "center"}}> <br/>
                <p style={{borderBottom: '1px solid black'}}></p>
                <span
                    style={{textAlign: 'center'}}><small>(беру негіздемесі)</small></span></Row><br/>

            <Row
                style={{textAlign: "center"}}>
                <p style={{borderBottom: '1px solid black'}}>{this.props.initialValues.workRegFund.label}</p>
                <span
                    style={{textAlign: 'center'}}><small>(берілетін архив қорының атауы)</small></span></Row>
            <br/>
            <Row><span>аталған қордың құжаттары мен оларға ғылыми-анықтамалық аппаратты </span></Row><br/>
            <Row>
                <p
                    style={{borderBottom: '1px solid black',textAlign: 'center'}}> тапсырды,</p> <p
                style={{textAlign: 'center'}}>
                <small>(тапсырушы ұйымның атауы)</small></p></Row>
            <br/>
            <Row> <p
                style={{borderBottom: '1px solid black',textAlign: 'center'}}>{this.props.fundArchive} қабылдады</p>  <p
                style={{textAlign: 'center'}}>
                <small>(архивтің атауы)</small></p>
            </Row>



            {/*<AntTable pagination={false} loading={this.props.loading}*/}
            {/*          dataSource={this.props.tableDataNSA}*/}
            {/*          columns={this.props.columnsNSA} className='prntTbl'/>*/}
            <table className="tbltoprint" width="100%">
                <thead>
                <tr>
                    {
                        this.props.columnsNSAKaz.map((el) => {
                            return(
                                <td style={{textAlign: 'center'}}><b>{el.title}</b></td>
                            );
                        })
                    }
                </tr>
                <tr>
                    {
                        this.props.columnsNSAKaz.map((el) => {
                            j++;
                            return(
                                <td style={{textAlign: 'center'}}>{j}</td>
                            );
                        })
                    }
                </tr>
                </thead>
                <tbody>
                {
                    this.props.tableDataNSA.length > 0 ? (
                        this.props.tableDataNSA.map((el) => {
                            let lng = localStorage.getItem('i18nextLng');
                            i++;
                            return(
                                <tr>
                                    <td>{i}</td>
                                    <td>{this.props.initialValues.workRegInv.label}</td>
                                    <td>{!!el.copyQuantity ? el.copyQuantity : ''}</td>
                                    <td>{this.props.countCases}</td>
                                    <td>{!!el.caseNotes ? el.caseNotes[lng] : ''}</td>
                                </tr>
                            );
                        })
                    ) : (<tr><td colSpan='6' style={{textAlign: 'center'}}>мәліметтер жоқ</td></tr>)

                }
                </tbody>
            </table><br/><br/>
            <Row>Жиыны   <span style={{textDecoration: "underline"}}>{this.props.countCases}</span> сақтау бірлігі қабылданды.</Row>
            <br/>
            {/*<Row>Передачу произвели:                          <span className='a' style={{marginLeft:'50px'}}>Прием произвели:</span><br/><br/></Row>*/}

            {/*<AntTable pagination={false} loading={this.props.loading}*/}
            {/*          dataSource={this.props.tableDataTrans}*/}
            {/*          columns={this.props.columnsTrans} className='prntTbl'/>*/}

            <Row gutter={24}>
                <Col span={12}>
                    <p style={{borderBottom: '1px solid black'}}></p><p style={{textAlign: 'center'}}><small>(беруді жүргізген тұлға (-лар) лауазымының атауы, тегі, аты-жөні, қолтаңбасы)</small></p>
                    <p style={{borderBottom: '1px solid black'}}></p><p style={{textAlign: 'center'}}><small>(беру күні)</small></p>

                </Col>
                <Col span={12}>
                    <p style={{borderBottom: '1px solid black'}}></p><p style={{textAlign: 'center'}}><small>(қабылдауды жүргізген тұлға (-лар) лауазымының атауы, тегі, аты-жөні, қолтаңбасы)</small></p>
                    <p style={{borderBottom: '1px solid black'}}></p><p style={{textAlign: 'center'}}><small>(қабылдау күні)</small></p>

                </Col>
            </Row><br/><br/>
            <Row><p>Архивтік қорға № ____________________ берілді.<br/>
                Есепке алу құжаттарына өзгерістер енгізілді.
            </p><br/></Row>
            <Row>
                <Col span={14}>
                    <p style={{borderBottom: '1px solid black'}}>{this.props.initialValues.workAssignedTo.label}</p><p style={{textAlign: 'center'}}><small>(өзгерістер енгізген тұлға (-лар) лауазымының атауы, тегі, аты-жөні, қолтаңбасы)</small></p>
                </Col>
            </Row><br/>
            <Row>
                <Col span={8}>
                    <p style={{borderBottom: '1px solid black'}}></p><p style={{textAlign: 'center'}}><small>(есепке алу құжаттарына өзгерістер енгізілген күн)</small></p>
                </Col>
            </Row><br/><br/>

            <Row>
                <Col style={{width: "43%", float: "left"}}>Бекітемін<br/><br/>
                    <p style={{borderBottom: '1px solid black',textAlign: 'center'}}></p><p style={{textAlign: 'center'}}><small>(архив басшысы лауазымының атауы,
                        тегі, аты-жөні )</small></p><br/>
                    <p style={{borderBottom: '1px solid black',textAlign: 'center'}}></p><p style={{textAlign: 'center'}}><small>(ұйым басшысының қолтаңбасы)</small></p><br/>
                    <p style={{borderBottom: '1px solid black',textAlign: 'center'}}></p><p style={{textAlign: 'center'}}><small>(күні )</small></p>
                </Col>
            </Row>
        </div>)
    }
};

export
default
TransferAct;