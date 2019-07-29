import React from 'react';
import {Button, Col, Row, Select} from "antd";
import AntTable from "../../../AntTable";
import axios from "axios";
import {getAct1, getIdGetObj, lightToDestroy} from "../../../../actions/actions";
import moment from "moment";
import {parseCube_new, parseForTable} from "../../../../utils/cubeParser";
import ReactDOMServer from 'react-dom/server';
import ReactToPrint from "react-to-print";
import './PrintAct.css'
const { Option } = Select;

class LightToDestroy extends React.Component {
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
            title: 'Порядковый номер',
            dataIndex: 'idx',
            key: 'idx',
            width: '5%',
            render: (obj, rec, i) => {
                return i+1
            }
        }, {
            title: 'Названия групп документов',
            dataIndex: 'caseName',
            key: 'caseName',
            width: '20%',
            render: (obj, rec, i) => {
                if(obj){
                    let lng = localStorage.getItem('i18nextLng');
                    return obj[lng];
                }

            }
        }, {
            title: 'Крайние даты ',
            dataIndex: 'caseDbeg',
            key: 'caseDbeg',
            width: '15%',
            render:(obj,rec)=> {return (<div><br />
                {[rec.caseDbeg + ' ' +  rec.caseDend]}
            </div>)}
        }, {
            title: 'Номера описей',
            dataIndex: 'invNumber',
            key: 'invNumber',
            width: '15%',
            render: ()=>this.props.initialValues.workRegInv.label
        }, {
            title: 'Номера единиц хранения по описям',
            dataIndex: 'caseNumber',
            key: 'caseNumber',
            width: '15%',
        }, {
            title: 'Количество единиц хранения',
            dataIndex: 'countCases',
            key: 'countCases',
            width: '15%',
            render: ()=>'1'
        },
            {
                title: 'Примечание',
                dataIndex: 'caseNotes',
                key: 'caseNotes',
                width: '15%',
                render: obj => obj && obj.ru
            }],
        columnsKz: [{
            title: 'Реттік нөмірі',
            dataIndex: 'idx',
            key: 'idx',
            width: '5%',
            render: (obj, rec, i) => {
                return i+1
            }
        }, {
            title: 'Құжаттар топтарының атаулары',
            dataIndex: 'caseName',
            key: 'caseName',
            width: '20%',
            render: (obj, rec, i) => {
                if(obj){
                    let lng = localStorage.getItem('i18nextLng');
                    return obj[lng];
                }

            }
        }, {
            title: 'Соңғы даталары ',
            dataIndex: 'caseDbeg',
            key: 'caseDbeg',
            width: '15%',
            render:(obj,rec)=> {return (<div><br />
                {[rec.caseDbeg + ' ' +  rec.caseDend]}
            </div>)}
        }, {
            title: 'Тізімдемелердің нөмірлері',
            dataIndex: 'invNumber',
            key: 'invNumber',
            width: '15%',
            render: ()=>this.props.initialValues.workRegInv.label
        }, {
            title: 'Тізімдемелер бойынша сақтау бірліктерінің нөмірлері',
            dataIndex: 'caseNumber',
            key: 'caseNumber',
            width: '15%',
        }, {
            title: 'Сақтау бірліктерінің  саны',
            dataIndex: 'countCases',
            key: 'countCases',
            width: '15%',
            render: ()=>'1'
        },
            {
                title: 'Ескертпе',
                dataIndex: 'caseNotes',
                key: 'caseNotes',
                width: '15%',
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
        lightToDestroy((this.props.workId).split('_')[1]).then(res => {
            let data = res.data;
            var arrObj = [];

            const newArr = data['cases'].map(function (el) {
                return el['caseNumber'];
            });

            let i = newArr.length;

            /*getCountsOfCaseInInv*/
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
                                    valueRef: {id: String('123_' + data.inv_id)}
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
                                consts: "archiveCipher"
                            }
                        ]
                    }
                ]
            };
            const fd = new FormData();
            fd.append("cubeSConst", 'CubeForAF_Case');
            fd.append("filters", JSON.stringify(filters));
            axios.post(`/${localStorage.getItem('i18nextLng')}/cube/getCubeData`, fd).then(res => {
                //var savedList = parseInt(res.data.data['do_' + this.props.tofiConstants.doForCase.id].length) - parseInt(data.countCases);
                var savedList = parseInt(res.data.data['do_' + this.props.tofiConstants.doForCase.id].length) - parseInt(i);
                this.setState({
                    savedList: savedList
                })
            });

            const newTableData = data['cases'].map((items) => {
                return items;
            });
            let a = newTableData.map((item) => {
                item['caseName'] = item.name;
                delete item.name;
                return item;
            });

            console.log(data.cases);

            this.setState({
                fundNumber: data.fundNumber,
                fundArchive: data.fundArchive.ru,
                caseAvailabilityCheck: this.props.initialValues.workType.label,
                tableData: a,
                total: i,
                orgName: data.ik.ru,
                loading: false,
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
            <h1 style={{textAlign: "center"}}>Акт о выделении к уничтожению документов, не подлежащих хранению</h1>
            <Row style={{textAlign: "center"}}>__________ № __________</Row>
            <Row style={{textAlign: "right"}}><Col style={{width: "45%", float: "left"}}>(дата)</Col></Row><br/>
            <Row style={{}}>Место составления  <span></span></Row>
            <Row style={{}}>К уничтожению отобраны документы архивного фонда № <span
                style={{}}>{this.props.fundNumber}</span> <span
                style={{}}>{this.props.initialValues.workRegFund.label}</span></Row>
            <Row>на основании  Акта о неисправимых повреждениях документов № <span style={{}}>{this.props.actNumber.slice(0, -1) + '4'}</span> от {this.props.initialValues.workActualEndDate.value}<br/></Row>
            <br/>
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
                            i++;
                            return(
                                <tr>
                                    <td>{i}</td>
                                    <td>{!!el.caseName ? el.caseName[lng] : ''}</td>
                                    <td>{!!el.caseDbeg ? el.caseDbeg + ' : ' + el.caseDend : ''}</td>
                                    <td>{this.props.initialValues.workRegInv.label}</td>
                                    <td>{!!el.caseNumber ? el.caseNumber : ''}</td>
                                    <td>1</td>
                                    <td>{!!el.caseNotes ? el.caseNotes[lng] : ''}</td>
                                </tr>
                            );
                        })
                    ) : (<tr><td colSpan='7' style={{textAlign: 'center'}}>нет данных</td></tr>)

                }
                </tbody>
            </table>
            <br/><br/>
            <Row>
                Итого <span style={{}}>{this.props.total}</span> единиц хранения за <span style={{}}> {this.props.year} </span>
                год (ы)
            </Row>
            <Row>
                Количество единиц хранения, крайние даты и краткая характеристика документов, остающихся на хранении <span
                style={{}}>{this.props.savedList}</span>
            </Row><br/>
            <Row>
                <Col span={14}>
                    <p style={{borderBottom: '1px solid black'}}>{this.props.initialValues.workAssignedTo.label}</p><p style={{textAlign: 'center'}}><small>(фамилия, инициалы, подпись заведующего отделом (архивохранилищем))</small></p>
                </Col>
            </Row>
            <Row><br/>
                <Col span={5}>
                    <p style={{borderBottom: '1px solid black'}}></p><p style={{textAlign: 'center'}}><small>(дата и номер)</small></p>
                </Col>
            </Row>
            <Row><br/>
                <Col span={20}>
                    <p style={{borderBottom: '1px solid black'}}></p><p style={{textAlign: 'center'}}><small>(наименование должности, фамилия, инициалы, подпись лица, проводившего обработку документов)</small></p>
                </Col>
            </Row><br/>
            <Row>
                Документы сданы <span
                style={{}}>{this.props.orgName}</span> на переработку по приемо-сдаточной накладной<span
                style={{}}>{this.props.nacladDate}  </span> __________ № _____ <span
                style={{}}>{this.props.nacladNumb}</span> __________________________
            </Row>
            <Row style={{textAlign: "right"}}><Col style={{width: "93%", float: "left"}}>(подпись хранителя фондов)</Col></Row><br/>

            <p><br/>Изменения в учетные документы внесены</p>
            <Row>
                <Col span={21}>
                    <p style={{borderBottom: '1px solid black'}}>{this.props.initialValues.workAssignedTo.label}</p><p style={{textAlign: 'center'}}><small>(наименование должности, фамилия, инициалы, подпись лица, проводившего упорядочение дел, документов)</small></p>
                </Col>
            </Row>

            <br/><br/><br/><Row gutter={24}>
                <Col span={12}>

                </Col>
                <Col span={11}>
                    Согласована<br/>
                    протоколом экспертно-проверочной
                    комиссии (экспертной комиссии)
                    местного исполнительного органа (архива)
                    от ____ _______ года № _____

                </Col>
            </Row><br/>

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
                    <p style={{borderBottom: '1px solid black',textAlign: 'center'}}></p><p style={{textAlign: 'center'}}><small>(архив басшысының лауазымының атауы,
                        тегі, аты-жөні )</small></p><br/>
                    <p style={{borderBottom: '1px solid black',textAlign: 'center'}}></p><p style={{textAlign: 'center'}}><small>(архив басшысының қолтаңбасы)</small></p><br/>
                    <p style={{borderBottom: '1px solid black',textAlign: 'center'}}></p><p style={{textAlign: 'center'}}><small>(күні )</small></p>
                </Col>
            </Row><br/><br/>
            <h1 style={{textAlign: "center"}}>Сақтауға жатпайтын құжаттарды жоюға бөлу туралы акті</h1>
            <Row style={{textAlign: "center"}}>__________ № __________</Row>
            <Row style={{textAlign: "right"}}><Col style={{width: "45%", float: "left"}}>(күні)</Col></Row><br/>
            <Row style={{}}>Құрастырылған орны  <span></span></Row>
            <Row>Сақтауға жатпайтын құжаттарды жоюға бөлу туралы актінің № <span style={{}}>{this.props.actNumber.slice(0, -1) + '4'}</span> от {this.props.initialValues.workActualEndDate.value} негізінде</Row>
            <Row style={{}}>№ <span
                style={{}}>{this.props.fundNumber}</span> <span
                style={{}}>{this.props.initialValues.workRegFund.label}</span> архивтік қордың құжаттары жоюға бөлінді</Row>

            <br/>
            {/*<AntTable pagination={false} loading={this.props.loading}*/}
            {/*          dataSource={this.props.tableData} columns={this.props.columns} className='prntTbl'/>*/}
            <table className="tbltoprint" width="100%">
                <thead>
                <tr>
                    {
                        this.props.columnsKz.map((el) => {
                            return(
                                <td style={{textAlign: 'center'}}><b>{el.title}</b></td>
                            );
                        })
                    }
                </tr>
                <tr>
                    {
                        this.props.columnsKz.map((el) => {
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
                            i++;
                            return(
                                <tr>
                                    <td>{i}</td>
                                    <td>{!!el.caseName ? el.caseName[lng] : ''}</td>
                                    <td>{!!el.caseDbeg ? el.caseDbeg + ' : ' + el.caseDend : ''}</td>
                                    <td>{this.props.initialValues.workRegInv.label}</td>
                                    <td>{!!el.caseNumber ? el.caseNumber : ''}</td>
                                    <td>1</td>
                                    <td>{!!el.caseNotes ? el.caseNotes[lng] : ''}</td>
                                </tr>
                            );
                        })
                    ) : (<tr><td colSpan='7' style={{textAlign: 'center'}}>мәліметтер жоқ</td></tr>)

                }
                </tbody>
            </table>
            <br/><br/>
            <Row>
                Жиыны   <span style={{}}> {this.props.year} </span> жылғы (-дардағы)
                <span style={{textDecoration: "underline"}}> {this.props.total}</span> сақтау бірлігі
            </Row>
            <Row>
                Сақтауда қалатын сақтау бірліктерінің саны, соңғы даталары және құжаттардың қысқаша сипаттамасы <span
                style={{}}>{this.props.savedList}</span>
            </Row><br/>
            <Row>
                <Col span={14}>
                    <p style={{borderBottom: '1px solid black'}}>{this.props.initialValues.workAssignedTo.label}</p><p style={{textAlign: 'center'}}><small>(бөлім (архив қоймасы) меңгерушісінің тегі, аты-жөні, қолтаңбасы)</small></p>
                </Col>
            </Row>
            <Row><br/>
                <Col span={5}>
                    <p style={{borderBottom: '1px solid black'}}></p><p style={{textAlign: 'center'}}><small>(күні және нөмірі)</small></p>
                </Col>
            </Row>
            <Row><br/>
                <Col span={20}>
                    <p style={{borderBottom: '1px solid black'}}></p><p style={{textAlign: 'center'}}><small>(құжаттарды ретке келтірген  тұлға (-лар) лауазымының атауы, тегі, аты-жөні, қолтаңбасы)</small></p>
                </Col>
            </Row><br/>
            <Row>
                <span
                style={{}}>{this.props.orgName}</span> құжаттары <span
                style={{}}>{this.props.nacladDate}  </span> __________ № _____ <span
                style={{}}>{this.props.nacladNumb}</span> қабылдау-тапсыру жөнелтпе құжаты бойынша қайта өңдеуге тапсырылды.
            </Row>

            <p><br/>Есепке алу құжаттарына өзгерістер енгізілді.</p>
            <Row>
                <Col span={21}>
                    <p style={{borderBottom: '1px solid black'}}>{this.props.initialValues.workAssignedTo.label}</p><p style={{textAlign: 'center'}}><small>(құжаттарды ретке келтірген тұлға (-лар) лауазымының атауы, тегі, аты-жөні, қолтаңбасы)</small></p>
                </Col>
            </Row>

            <br/><br/><br/><Row gutter={24}>
            <Col span={12}>

            </Col>
            <Col span={11}>
                Жергілікті атқарушы органның (архивтің)
                сараптау-тексеру комиссиясының
                (сараптау комиссиясының)
                _____ жылғы ___ _________
                № ___ хаттамасымен келісілді

            </Col>
        </Row><br/>

        </div>)
    }
};


export default LightToDestroy;