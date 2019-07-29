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
import ReactToPrint from "react-to-print";
import './PrintAct.css';
const { Option } = Select;

class CrashedAct extends React.Component {
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
        loading: true,
        savedList: '',
        tableData: [],
        page: 'ru',
        nmDocsLinks: 'state nmDocsLinks',
        columns: [{
            title: 'Номер описи',
            dataIndex: 'idx',
            key: 'idx',
            width: '5%',
            render: (obj, rec, i) => {
                return i + 1;
            }
        }, {
            title: 'Номер единицы хранения',
            dataIndex: 'caseNumber',
            key: 'caseNumber',
            width: '8%'
        }, {
            title: 'Заголовок поврежденной единиц хранения',
            dataIndex: 'caseName',
            key: 'caseName',
            width: '32%',
            render: caseName => caseName && caseName.ru
        }, {
            title: 'Крайние даты',
            dataIndex: 'invDates',
            key: 'invDates',
            width: '15%',
            render: (text, rec) => [rec.caseDbeg + ' - ' + rec.caseDend]
        }, {
            title: 'Количество листов (время звучания, метраж)',
            dataIndex: 'numberCases',
            key: 'numberCases',
            width: '15%',
            render: (obj, rec) => {
                var infoAbout = '';
                infoAbout += !!rec.caseNumberOfPages ? ['кол-во стр: ' + rec.caseNumberOfPages]:'';
                infoAbout += !!rec.playingTime ? [', Время: ' + rec.playingTime]:'';
                return infoAbout;
            }
        },
            {
                title: 'Сущность и причины повреждения',
                dataIndex: 'caseNotes',
                key: 'caseNotes',
                width: '10%',
                render: obj => obj && obj.ru
        }],
        columnsKaz: [{
            title: 'Тізімдеменің нөмірі',
            dataIndex: 'idx',
            key: 'idx',
            width: '5%',
            render: (obj, rec, i) => {
                return i + 1;
            }
        }, {
            title: 'Сақтау бірлігінің нөмірі',
            dataIndex: 'caseNumber',
            key: 'caseNumber',
            width: '8%'
        }, {
            title: 'Зақымданған сақтау бірлігінің атауы',
            dataIndex: 'caseName',
            key: 'caseName',
            width: '32%',
            render: caseName => caseName && caseName.kz
        }, {
            title: 'Соңғы даталары',
            dataIndex: 'invDates',
            key: 'invDates',
            width: '15%',
            render: (text, rec) => [rec.caseDbeg + ' - ' + rec.caseDend]
        }, {
            title: 'Парақтар саны (дыбысталу уақыты, метражы)',
            dataIndex: 'numberCases',
            key: 'numberCases',
            width: '15%',
            render: (obj, rec) => {
                var infoAbout = '';
                infoAbout += !!rec.caseNumberOfPages ? ['парақ саны: ' + rec.caseNumberOfPages]:'';
                infoAbout += !!rec.playingTime ? [', Уақыт: ' + rec.playingTime]:'';
                return infoAbout;
            }
        },
            {
                title: 'Зақымданудың мәні мен себебі',
                dataIndex: 'caseNotes',
                key: 'caseNotes',
                width: '10%',
                render: obj => obj && obj.kz
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
        crashedAct((this.props.workId).split('_')[1]).then(res => {
            let data = res.data;
            this.setState({
                fundNumber: data.fundNumber,
                fundArchive: data.fundArchive.ru,
                caseAvailabilityCheck: this.props.initialValues.workType.label,
                tableData: data.propCases,
                invNumber: data.invNumber,
                total: data.propCases.length,
                loading: false,
                zavOtdel: data.zavOtdel.ru

            })
        });
    }


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
                copyStyles={true}
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
            <h1 style={{textAlign: "center"}}>Акт о неисправимых повреждениях документов</h1>
            <Row style={{textAlign: "center"}}>__________ № __________</Row>
            <Row style={{textAlign: "right"}}><Col style={{width: "45%", float: "left"}}>(дата)</Col></Row><br/>
            <Row style={{}}>Архивный фонд №  <span
                >{this.props.fundNumber}</span></Row><br/>
            <Row> Название архивного фонда <span> {this.props.initialValues.workRegFund.label}</span></Row><br/>
            <Row>В архивном фонде обнаружены  <span
                >{this.props.total}</span> единиц хранения, признанные неисправимо поврежденными.</Row><br/>
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
                            let infoAbout = '';
                            infoAbout += !!el.caseNumberOfPages ? ['кол-во стр: ' + el.caseNumberOfPages]:'';
                            infoAbout += !!el.playingTime ? [', Время: ' + el.playingTime]:'';
                            i++;;
                            return(
                                <tr>
                                    <td>{this.props.invNumber}</td>
                                    <td>{!!el.caseNumber ? el.caseNumber : ''}</td>
                                    <td>{!!el.caseName ? el.caseName[lng] : ''}</td>
                                    <td>{!!el.caseDbeg ? el.caseDbeg + ' : ' + el.caseDend : ''}</td>
                                    <td>{infoAbout}</td>
                                    <td>{!!el.caseNotes ? el.caseNotes[lng] : ''}</td>
                                </tr>
                            );
                        })
                    ) : (<tr><td colSpan='6' style={{textAlign: 'center'}}>нет данных</td></tr>)


                }
                </tbody>
            </table>
            <br/>
            <br/>


            <Row>
                Итого обнаружено неисправимо поврежденных <span>{this.props.total}</span> единиц хранения.
            </Row><br/>
            <Row>
                <Col span={11}>
                    <p style={{borderBottom: '1px solid black'}}>{this.props.zavOtdel}</p><p style={{textAlign: 'center'}}><small>(фамилия, инициалы, подпись заведующего отделом)</small></p>
                </Col>
            </Row>
            <Row>
                <Col span={11}>
                    <p style={{borderBottom: '1px solid black'}}>{this.props.initialValues.workAssignedTo.label}</p><p style={{textAlign: 'center'}}><small>(фамилия, инициалы, подпись хранителя фондов)</small></p>
                </Col>
            </Row><br/>
            <Row>Перечисленные документы подлежат списанию, ввиду <br/><br/>
            <p style={{borderBottom: '1px solid black'}}></p><br/><br/><p style={{borderBottom: '1px solid black'}}></p></Row>
            {/*<Row>*/}
            {/*    сданы на переработку по приемо-сдаточной накладной <span*/}
            {/*    style={{textDecoration: "underline"}}>{this.props.nacladDate}  </span> № <span*/}
            {/*    style={{textDecoration: "underline"}}>{this.props.nacladNumb}</span>*/}
            {/*</Row>*/}

            <br/><Row>
                <Col span={12}>
                    <p style={{borderBottom: '1px solid black'}}>{this.props.initialValues.workAssignedTo.label}</p><p style={{textAlign: 'center'}}><small>(наименование должности, фамилия, инициалы, подпись эксперта)</small></p>
                </Col>
            </Row>
            <Row><br/>
                <Col span={3}>
                    <p style={{borderBottom: '1px solid black'}}>{this.props.initialValues.workActualEndDate.value}</p><p style={{textAlign: 'center'}}><small>(дата)</small></p>
                </Col>
            </Row><br/><br/>

            <Row gutter={24}>
                <Col span={12}>
                    Согласован<br/>
                    протоколом центральной экспертной
                    комиссии (экспертной комиссии) организации
                    от ___ ___________ года № _____

                </Col>
                <Col span={12}>
                    Согласована<br/>
                    протоколом экспертно-проверочной
                    комиссии (экспертной комиссии)
                    местного исполнительного органа (архива)
                    от ____ _______ года № _____

                </Col>
            </Row><br/>

            <p><br/>Изменения в учетные документы по результатам описания внесены.</p><br/>
            <Row>
                <Col span={14}>
                    <p style={{borderBottom: '1px solid black'}}>{this.props.initialValues.workAssignedTo.label}</p><p style={{textAlign: 'center'}}><small>(наименование должности, фамилия, инициалы, подпись лица, внесшего изменения)</small></p>
                </Col>
            </Row><br/>
            <Row>
                <Col span={5}>
                    <p style={{borderBottom: '1px solid black'}}>{this.props.initialValues.workActualEndDate.value}</p><p style={{textAlign: 'center'}}><small>(дата внесения изменения в учетные документы)</small></p>
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
            <h1 style={{textAlign: "center"}}>Түзетуге келмейтін зақымданған құжаттар туралы акті</h1>
            <Row style={{textAlign: "center"}}>__________ № __________</Row>
            <Row style={{textAlign: "right"}}><Col style={{width: "45%", float: "left"}}>(күні)</Col></Row><br/>
            <Row style={{}}>№  <span
            >{this.props.fundNumber}</span> архив қоры</Row><br/>
            <Row> Архив қорының атауы  <span> {this.props.initialValues.workRegFund.label}</span></Row><br/>
            <Row>Архивтік қорда түзетуге келмейтін деп танылған   <span
            >{this.props.total}</span> сақтау бірліктері анықталды.</Row><br/>
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
                            let infoAbout = '';
                            infoAbout += !!el.caseNumberOfPages ? ['парақ саны: ' + el.caseNumberOfPages]:'';
                            infoAbout += !!el.playingTime ? [', Уақыт: ' + el.playingTime]:'';
                            i++;
                            return(
                                <tr>
                                    <td>{this.props.invNumber}</td>
                                    <td>{!!el.caseNumber ? el.caseNumber : ''}</td>
                                    <td>{!!el.caseName ? el.caseName[lng] : ''}</td>
                                    <td>{!!el.caseDbeg ? el.caseDbeg + ' : ' + el.caseDend : ''}</td>
                                    <td>{infoAbout}</td>
                                    <td>{!!el.caseNotes ? el.caseNotes[lng] : ''}</td>
                                </tr>
                            );
                        })
                    ) : (<tr><td colSpan='6' style={{textAlign: 'center'}}>мәліметтер жоқ</td></tr>)


                }
                </tbody>
            </table>
            <br/>
            <br/>


            <Row>
                Жиыны түзетуге келмейтін зақымданған  <span>{this.props.total}</span> сақтау бірлігі анықталды.
            </Row><br/>
            <Row>
                <Col span={11}>
                    <p style={{borderBottom: '1px solid black'}}>{this.props.zavOtdel}</p><p style={{textAlign: 'center'}}><small>(бөлім меңгерушісінің тегі, аты-жөні, қолтаңбасы)</small></p>
                </Col>
            </Row>
            <Row>
                <Col span={11}>
                    <p style={{borderBottom: '1px solid black'}}>{this.props.initialValues.workAssignedTo.label}</p><p style={{textAlign: 'center'}}><small>(архивтік қор сақтаушысының тегі, аты-жөні, қолтаңбасы)</small></p>
                </Col>
            </Row><br/>
            <Row>Аталған құжаттар <br/><br/>
                <p style={{borderBottom: '1px solid black'}}></p><br/><br/><p style={{borderBottom: '1px solid black'}}></p>
                байланысты есептен шығарылуға жатады.
            </Row>
            {/*<Row>*/}
            {/*    сданы на переработку по приемо-сдаточной накладной <span*/}
            {/*    style={{textDecoration: "underline"}}>{this.props.nacladDate}  </span> № <span*/}
            {/*    style={{textDecoration: "underline"}}>{this.props.nacladNumb}</span>*/}
            {/*</Row>*/}

            <br/><Row>
            <Col span={12}>
                <p style={{borderBottom: '1px solid black'}}>{this.props.initialValues.workAssignedTo.label}</p><p style={{textAlign: 'center'}}><small>(сарапшы лауазымының атауы, тегі, аты-жөні, қолтаңбасы)</small></p>
            </Col>
        </Row>
            <Row><br/>
                <Col span={3}>
                    <p style={{borderBottom: '1px solid black'}}>{this.props.initialValues.workActualEndDate.value}</p><p style={{textAlign: 'center'}}><small>(күні)</small></p>
                </Col>
            </Row><br/><br/>

            <Row gutter={24}>
                <Col span={12}>
                    Ұйымның орталық сараптау
                    комиссиясының (сараптау комиссиясының)
                    ____ жылғы ___ _________
                    № ____ хаттамасымен келісілді

                </Col>
                <Col span={12}>
                    Жергілікті атқарушы органның (архивтің)
                    сараптау-тексеру комиссиясының
                    (сараптау комиссиясының)
                    _____ жылғы ___ _________
                    № ___ хаттамасымен келісілді

                </Col>
            </Row><br/>

            <p><br/>Сипаттау нәтижесі бойынша есепке алу құжаттарына өзгерістер енгізілді.</p><br/>
            <Row>
                <Col span={14}>
                    <p style={{borderBottom: '1px solid black'}}>{this.props.initialValues.workAssignedTo.label}</p><p style={{textAlign: 'center'}}><small>(өзгерістер енгізген тұлға лауазымының атауы, тегі, аты-жөні, қолтаңбасы)</small></p>
                </Col>
            </Row><br/>
            <Row>
                <Col span={5}>
                    <p style={{borderBottom: '1px solid black'}}>{this.props.initialValues.workActualEndDate.value}</p><p style={{textAlign: 'center'}}><small>(есепке алу құжаттарына өзгерістер енгізілген күн)</small></p>
                </Col>
            </Row>
        </div>)
    }
};


export default CrashedAct;