import React from 'react';
import {Button, Col, Row, Select} from "antd";
import AntTable from "../../../AntTable";
import axios from "axios";
import {getAct1, getIdGetObj} from "../../../../actions/actions";
import moment from "moment";
import {parseCube_new, parseForTable} from "../../../../utils/cubeParser";
import ReactDOMServer from 'react-dom/server';
import ReactToPrint from "react-to-print";
import './PrintAct.css';
const { Option } = Select;

class IrrDamageAct extends React.Component {
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
        page: 'ru',
        tableData: [],
        loading: true,
        columns: [{
            title: 'Порядковый номер',
            dataIndex: 'idx',
            key: 'idx',
            width: '5%'
        }, {
            title: 'Заголовок единиц хранения',
            dataIndex: 'name',
            key: 'name',
            width: '20%'
        }, {
            title: 'Шифр(если есть)',
            dataIndex: 'archiveCipher',
            key: 'archiveCipher',
            render: obj => obj && obj.value,
            width: '17%'
        }, {
            title: 'Крайние даты',
            dataIndex: 'date',
            key: 'date',
            render: (obj, rec) => rec.caseDbeg && rec.caseDend ? [rec.caseDbeg.value + ' - ' + rec.caseDend.value] : '',
            width: '15%'
        }, {
            title: 'Количество листов (время звучания, метраж)',
            dataIndex: 'caseNumberOfPages',
            key: 'caseNumberOfPages',
            render: obj => obj && obj.value,
            width: '13%'
        }, {
            title: 'К какому архивному  фонду относится (новый шифр)',
            dataIndex: 'workRegFund',
            key: 'workRegFund',
            width: '15%'
        }, {
            title: 'Примечание',
            dataIndex: 'description',
            key: 'description',
            width: '15%'
        }],
        columnsKaz: [{
            title: 'Реттік нөмірі',
            dataIndex: 'idx',
            key: 'idx',
            width: '5%'
        }, {
            title: 'Сақтау бірлігінің тақырыбы',
            dataIndex: 'name',
            key: 'name',
            width: '20%'
        }, {
            title: 'Шифр(бар болған жағдайда)',
            dataIndex: 'archiveCipher',
            key: 'archiveCipher',
            render: obj => obj && obj.value,
            width: '17%'
        }, {
            title: 'Соңғы даталары',
            dataIndex: 'date',
            key: 'date',
            render: (obj, rec) => rec.caseDbeg && rec.caseDend ? [rec.caseDbeg.value + ' - ' + rec.caseDend.value] : '',
            width: '15%'
        }, {
            title: 'Парақтар саны (дыбысталу уақыты, метражы)',
            dataIndex: 'caseNumberOfPages',
            key: 'caseNumberOfPages',
            render: obj => obj && obj.value,
            width: '13%'
        }, {
            title: 'Қай архив қорына жатады(жаңа шифр)',
            dataIndex: 'workRegFund',
            key: 'workRegFund',
            width: '15%'
        }, {
            title: 'Ескертпе',
            dataIndex: 'description',
            key: 'description',
            width: '15%'
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
                startDate: data.workActualStartDate,
                endDate: data.workActualEndDate,
                caseAvailabilityCheck: this.props.initialValues.workType.label
            })
        });
        const filters = {
            filterDOAnd: [
                {
                    dimConst: 'doForCase',
                    concatType: "and",
                    conds: [
                        {
                            data: {
                                dimPropConst: 'dpForCase',
                                propConst: 'caseWorkProp',
                                valueRef: {id: String(this.props.workId)}
                            }
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
                            consts: "archiveCipher,caseDbeg,caseDend,caseNumberOfPages,caseNotes,caseStorage"
                        }
                    ]
                }
            ]
        };
        const fd = new FormData();
        fd.append("cubeSConst", 'CubeForAF_Case');
        fd.append("filters", JSON.stringify(filters));
        axios.post(`/${localStorage.getItem('i18nextLng')}/cube/getCubeData`, fd).then(res => {
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
            this.setState({
                tableData: tableData,
                loading: false,
                total: tableData.length,
                caseStorageMulti: tableData.map(el => el.caseStorage && el.caseStorage.label).join(',')

            })
        });


    }


    renderTableData = (item, idx) => {
        const constArr = ['archiveCipher', 'caseDbeg', 'caseDend', 'caseNumberOfPages', 'caseNotes', 'caseStorage'];
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
        var fundName = initialValues.workRegFund.labelFull;
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
                <Col style={{width: "47%", float: "left"}}> <span
                >{this.props.fundArchive} </span>
                </Col>
                <Col style={{width: "43%", float: "right"}}>Утверждаю<br/><br/>
                    <p style={{borderBottom: '1px solid black',textAlign: 'center'}}></p><p style={{textAlign: 'center'}}><small>(наименование должности, фамилия,
                        инициалы руководителя архива )</small></p><br/>
                    <p style={{borderBottom: '1px solid black',textAlign: 'center'}}></p><p style={{textAlign: 'center'}}><small>(подпись руководителя архива )</small></p><br/>
                    <p style={{borderBottom: '1px solid black',textAlign: 'center'}}></p><p style={{textAlign: 'center'}}><small>(дата )</small></p>
                </Col>
            </Row><br/><br/>
            <h1 style={{textAlign: "center"}}>Акт об обнаружении архивных документов</h1>
            <Row style={{textAlign: "center"}}>__________ № __________</Row>
            <Row style={{textAlign: "right"}}><Col style={{width: "45%", float: "left"}}>(дата)</Col></Row><br/>
            <Row style={{clear: "both"}}>
                <Col style={{width: "100%"}}>
                    В ходе
                    <span
                        style={{textDecoration: "underline"}}> {this.props.caseAvailabilityCheck} </span>
                    было обнаружено <span style={{}}>
                {this.props.fundNumber}, {this.props.caseStorageMulti}
            </span> </Col>
            </Row><br/>
            {/*<AntTable pagination={false} loading={this.props.loading}*/}
            {/*          dataSource={this.props.tableData} columns={this.props.columns} className='prntTbl'/>*/}
            <table className="tbltoprint" width="100%">
                <thead>
                <tr>
                    {
                        this.props.columns.map((el) => {
                            return(
                                <td style={{textAlign: 'center'}}><b>{el.title}</b></td>
                            );
                        })
                    }
                </tr>
                <tr>
                    {
                        this.props.columns.map((el) => {
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
                    this.props.tableData.length > 0 ? (
                        this.props.tableData.map((el) => {
                            let lng = localStorage.getItem('i18nextLng');

                            return(
                                <tr>
                                    <td>{el.idx}</td>
                                    <td>{!!el.name ? el.name : ''}</td>
                                    <td>{!!el.archiveCipher ? el.archiveCipher.value : ''}</td>
                                    <td>{!!el.caseDbeg ? el.caseDbeg.value + ' : ' + el.caseDend.value : ''}</td>
                                    <td>{!!el.caseNumberOfPages ? el.caseNumberOfPages.value : ''}</td>
                                    <td>{!!el.workRegFund ? el.workRegFund : ''}</td>
                                    <td>{!!el.description ? el.description : ''}</td>
                                </tr>
                            );
                        })
                    ) : (<tr><td colSpan='7' style={{textAlign: 'center'}}>нет данных</td></tr>)


                }
                </tbody>
            </table><br/>

            <Row>
                <Col style={{float: "left", width: "33%"}}>Итого обнаружено {this.props.total} единиц хранения.</Col>

            </Row>
            <br/>
            <Row>
                <Col col={24}>{this.props.initialValues.workAssignedTo.label}</Col>
            </Row>
            <p><br/>Изменения в учетные документы по результатам описания внесены.</p>

            <Row>
                <Col col={24}>{this.props.initialValues.workAuthor.label}</Col>
            </Row>
            <Row>
                <Col
                    col={24}>Дата: {this.props.initialValues.workActualEndDate.value}</Col>
            </Row>
        </div>)
    }
};

class PrintContentKaz extends React.Component{
    render(){
        let i = 0;      let j = 0;
        return (<div style={{padding: '40px 40px 40px 70px'}}>
            <Row>
                <Col style={{width: "47%", float: "left"}}> <span
                >{this.props.fundArchive} </span>
                </Col>
                <Col style={{width: "43%", float: "right"}}>Бекітемін<br/><br/>
                    <p style={{borderBottom: '1px solid black',textAlign: 'center'}}></p><p style={{textAlign: 'center'}}><small>(архив басшысы лауазымының атауы,
                        тегі, аты-жөні)</small></p><br/>
                    <p style={{borderBottom: '1px solid black',textAlign: 'center'}}></p><p style={{textAlign: 'center'}}><small>(архив басшысының қолтаңбасы)</small></p><br/>
                    <p style={{borderBottom: '1px solid black',textAlign: 'center'}}></p><p style={{textAlign: 'center'}}><small>(күні)</small></p>
                </Col>
            </Row><br/><br/>
            <h1 style={{textAlign: "center"}}>Архивтік құжаттардың табылғаны туралы акті</h1>
            <Row style={{textAlign: "center"}}>__________ № __________</Row>
            <Row style={{textAlign: "right"}}><Col style={{width: "45%", float: "left"}}>(күні)</Col></Row><br/>
            <Row style={{clear: "both"}}>
                <Col style={{width: "100%"}}>
                    <span
                        style={{textDecoration: "underline"}}> {this.props.caseAvailabilityCheck} барысында  </span>
                    <span style={{}}>
                {this.props.fundNumber}, {this.props.caseStorageMulti}
            </span> анықталды</Col>
            </Row><br/>
            {/*<AntTable pagination={false} loading={this.props.loading}*/}
            {/*          dataSource={this.props.tableData} columns={this.props.columns} className='prntTbl'/>*/}
            <table className="tbltoprint" width="100%">
                <thead>
                <tr>
                    {
                        this.props.columnsKaz.map((el) => {
                            return(
                                <td style={{textAlign: 'center'}}><b>{el.title}</b></td>
                            );
                        })
                    }
                </tr>
                <tr>
                    {
                        this.props.columnsKaz.map((el) => {
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
                    this.props.tableData.length > 0 ? (
                        this.props.tableData.map((el) => {
                            let lng = localStorage.getItem('i18nextLng');

                            return(
                                <tr>
                                    <td>{el.idx}</td>
                                    <td>{!!el.name ? el.name : ''}</td>
                                    <td>{!!el.archiveCipher ? el.archiveCipher.value : ''}</td>
                                    <td>{!!el.caseDbeg ? el.caseDbeg.value + ' : ' + el.caseDend.value : ''}</td>
                                    <td>{!!el.caseNumberOfPages ? el.caseNumberOfPages.value : ''}</td>
                                    <td>{!!el.workRegFund ? el.workRegFund : ''}</td>
                                    <td>{!!el.description ? el.description : ''}</td>
                                </tr>
                            );
                        })
                    ) : (<tr><td colSpan='7' style={{textAlign: 'center'}}>мәліметтер жоқ</td></tr>)


                }
                </tbody>
            </table><br/>

            <Row>
                <Col style={{float: "left", width: "33%"}}>жиыны  {this.props.total} сақтау бірлігі анықталды.</Col>

            </Row>
            <br/>
            <Row>
                <Col col={24}>{this.props.initialValues.workAssignedTo.label}</Col>
            </Row>
            <p><br/>Сипаттау нәтижесі бойынша есепке алу құжаттарына өзгерістер енгізілді.</p>

            <Row>
                <Col col={24}>{this.props.initialValues.workAuthor.label}</Col>
            </Row>
            <Row>
                <Col
                    col={24}>Күні: {this.props.initialValues.workActualEndDate.value}</Col>
            </Row>
        </div>)
    }
};



export default IrrDamageAct;