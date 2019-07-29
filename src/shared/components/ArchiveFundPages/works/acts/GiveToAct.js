import React, {useRef} from 'react';
import {getAct1, getCube, getIdGetObj} from "../../../../actions/actions";
import {Button, Col, Row, Select} from "antd";
import ReactDOMServer from 'react-dom/server';
import AntTable from "../../../AntTable";
import {parseCube_new, parseForTable} from "../../../../utils/cubeParser";
import axios from 'axios';
import ReactToPrint from "react-to-print";
import './PrintAct.css';
const { Option } = Select;

class GiveToAct extends React.Component {

    state = {
        fundArchive: 'state Архив',
        cntCaseNotA: '0',
        date: 'state Date',
        number: 'state Number',
        podpis: 'state Расшифрока подписи',
        fundNumber: 'state fundNumber',
        workRegFund: 'state workRegFund',
        invNumber: 'state invNumber',
        startDate: 'state startDate',
        endDate: 'state endDate',
        invCount: '0',
        caseInInv: '0',
        page: 'ru',
        disinfection: '0',
        disinfestation: '0',
        restoration: '0',
        binding: '0',
        columns: [],
        tableData: [],
        restorationOfFadingTexts: '0',
        irreparablyDamaged: '0',
        hasNotInInv: '0',
        cntAdded: '0',
        storageAndDamage: '0'
    };
    renderTableData = (item, idx) => {
        const constArr = ['caseNumber', 'caseDbeg', 'caseDend', 'caseNumberOfPages', 'absenceCase', 'casesRecovery'];
        const result = {
            idx: idx + 1,
            id: item.id,
            name: item.name.ru,
            workRegFund: this.props.initialValues.workRegFund.label,
            workRegInv: this.props.initialValues.workRegInv.label,
            absenceCase: this.state.absenceCase
        };
        parseForTable(item.props, this.props.tofiConstants, result, constArr);
        return result;
    };


    componentDidMount() {
        getAct1((this.props.workId).split('_')[1]).then(res => {
            console.log(res);
            let data = res.data;
            this.setState({
                cntAdded: data.cntAdded,
                fundNumber: data.fundNumber,
                fundArchive: data.fundArchive.ru,
                startDate: data.workActualStartDate,
                endDate: data.workActualEndDate,
                invNumber: data.invNumber,
                cntCase: data.cntCase,
                columns: [{
                    title: 'Опись №___',
                    dataIndex: 'idx',
                    key: 'idx',
                    width: '5%',
                }, {
                    title: 'Единица хранения № __',
                    dataIndex: 'caseNumber',
                    key: 'caseNumber',
                    width: '8',
                    render: caseNumber => caseNumber && caseNumber.value
                }, {
                    title: 'Заголовок единицы хранения',
                    dataIndex: 'caseName',
                    key: 'caseName',
                    width: '32%',
                    render: (obj, rec) => rec.name
                }, {
                    title: 'Количество листов (время звучания, метраж)',
                    dataIndex: 'caseNumberOfPages',
                    key: 'caseNumberOfPages',
                    width: '15%',
                    render: obj => obj && obj.value
                },
                    {
                        title: 'Примечание',
                        dataIndex: 'caseNotes',
                        key: 'caseNotes',
                        width: '10%',
                        render: obj => obj && obj.ru
                    }]
            })
        });


        getIdGetObj(this.props.initialValues.workRegCase.value, 'doForCase').then(res => {

            const filters = {
                filterDOAnd: [
                    {
                        dimConst: 'doForCase',
                        concatType: "and",
                        conds: [
                            {
                                ids: String(res.data.idDimObj)
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
                                consts: "caseNumber,caseDbeg,caseDend,caseNumberOfPages,absenceCase,casesRecovery"
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

        })


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

    render()
        {
        const {t, tofiConstants, initialValues, workId} = this.props;
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
            </Row><br/><br/>
            <h1 style={{textAlign: "center"}}>Акт о выдаче архивных документов во временное пользование</h1>
            <Row style={{textAlign: "center"}}>__________ № __________</Row>
            <Row style={{textAlign: "right"}}><Col style={{width: "45%", float: "left"}}>(дата)</Col></Row><br/>

            <Row>
                <p>Основание: ________________________________________________________________________</p>

            </Row><br/>
            <Row>

                <p>Для какой цели выдаются документы:
                    ____________________________________________________________________________</p>
            </Row><br/>
            <Row>

                <p>Выдаются следующие единицы хранения из архивного фонда
                    _________________________________</p>
            </Row>
            <Row style={{textAlign: "right"}}><Col style={{width: "54%", float: "left"}}>(название, номер)</Col></Row><br/>

            {/*<div className='ntprnt'><AntTable pagination={false} columns={this.props.columns} dataSource={this.props.tableData}  /></div>*/}
            <table className="tbltoprint" width="100%">
                <thead>
                <tr>
                    {
                        this.props.columns.map((el) => {
                            return(
                                <td><b>{el.title}</b></td>
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
                                    <td>{!!el.caseNumber ? el.caseNumber.value : ''}</td>
                                    <td>{!!el.name ? el.name : ''}</td>
                                    <td>{!!el.caseNumberOfPages ? el.caseNumberOfPages.value : ''}</td>
                                    <td>{!!el.caseNotes ? el.caseNotes[lng] : ''}</td>
                                </tr>
                            );
                        })
                    ) : (<tr><td colSpan='5' style={{textAlign: 'center'}}>нет данных</td></tr>)


                }
                </tbody>
            </table><br/><br/>


            Всего выдается ____________________ единиц хранения (общим количеством листов,
            временем звучания, метражом), срок возвращения дел, документов ____________________________.<br/>
            Условия временного пользования лицом, получающим дела, документы во временное пользование:
            <br/>1) дела, документы, полученные во временное пользование должны быть в упорядоченном состоянии, подшитыми, в обложках, с пронумерованными листами и заверительными надписями;
            <br/>2) дела, документы, полученные во временное пользование не предоставляются для использования посторонним лицам, не выдаются по ним копии, выписки и справки, не производится изъятие каких-либо частей из выданных документов, не публикуются документы без разрешения организации, выдавшей дела;
            <br/>3) дела, документы, полученные во временное пользование возвращаются в ведомственный (частный) архив организации в срок, указанный в акте.
            <br/>Лицо, получающее дела, документы предупрежден об ответственности в случае уничтожения документов Национального архивного фонда в соответствии со статьей 509 Кодекса Республики Казахстан «Об административных правонарушениях» от 5 июля  2014 года.
            <br/><Row><br/>
                <Col span={18}>
                    <p style={{borderBottom: '1px solid black'}}>{this.props.zavOtdel}</p><p style={{textAlign: 'center'}}><small>(наименование должности, фамилия, инициалы, подпись лица, выдавшего дела, документы
                    во временное пользование
                    )</small></p>
                </Col>
            </Row>
            <Row><br/>
                <Col span={8}>
                    <p style={{borderBottom: '1px solid black'}}>{this.props.zavOtdel}</p><p style={{textAlign: 'center'}}><small>(дата выдачи дел, документов)</small></p>
                </Col>
            </Row>
            <Row><br/>
                <Col span={18}>
                    <p style={{borderBottom: '1px solid black'}}>{this.props.zavOtdel}</p><p style={{textAlign: 'center'}}><small>(наименование должности, фамилия, инициалы, подпись лица, получившего дела, документы
                    во временное пользование
                    )</small></p>
                </Col>
            </Row>
            <Row><br/>
                <Col span={8}>
                    <p style={{borderBottom: '1px solid black'}}>{this.props.zavOtdel}</p><p style={{textAlign: 'center'}}><small>(дата принятия дел, документов)</small></p>
                </Col>
            </Row><br/>
            <p>Дела, документы возвращены в полном объеме, в упорядоченном состоянии, подшитые и в обложках.</p>
            <Row><br/>
                <Col span={18}>
                    <p style={{borderBottom: '1px solid black'}}>{this.props.zavOtdel}</p><p style={{textAlign: 'center'}}><small>(наименование должности, фамилия, инициалы, подпись лица, сдавшего дела, документы)</small></p>
                </Col>
            </Row>
            <Row><br/>
                <Col span={8}>
                    <p style={{borderBottom: '1px solid black'}}>{this.props.zavOtdel}</p><p style={{textAlign: 'center'}}><small>(дата сдачи дел, документов)</small></p>
                </Col>
            </Row>
            <Row><br/>
                <Col span={18}>
                    <p style={{borderBottom: '1px solid black'}}>{this.props.zavOtdel}</p><p style={{textAlign: 'center'}}><small>(наименование должности, фамилия, инициалы, подпись лица, принявшего дела, документы)</small></p>
                </Col>
            </Row>
            <Row><br/>
                <Col span={8}>
                    <p style={{borderBottom: '1px solid black'}}>{this.props.zavOtdel}</p><p style={{textAlign: 'center'}}><small>(дата принятия дел, документов)</small></p>
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
            </Row><br/><br/>
            <h1 style={{textAlign: "center"}}>Архивтік құжаттарды уақытша пайдалануға беру туралы акті</h1>
            <Row style={{textAlign: "center"}}>__________ № __________</Row>
            <Row style={{textAlign: "right"}}><Col style={{width: "45%", float: "left"}}>(күні)</Col></Row><br/>

            <Row>
                <p>Негіздеме : ________________________________________________________________________</p>

            </Row><br/>
            <Row>

                <p>Құжаттар қандай мақсат үшін беріледі ____________________________________________________________________________ архивтік қордан мынадай сақтау бірліктері беріледі </p>
            </Row><br/>

            {/*<Row style={{textAlign: "right"}}><Col style={{width: "54%", float: "left"}}>(название, номер)</Col></Row><br/>*/}

            {/*<div className='ntprnt'><AntTable pagination={false} columns={this.props.columns} dataSource={this.props.tableData}  /></div>*/}
            <table className="tbltoprint" width="100%">
                <thead>
                <tr>
                    {
                        this.props.columns.map((el) => {
                            return(
                                <td><b>{el.title}</b></td>
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
                                    <td>{!!el.caseNumber ? el.caseNumber.value : ''}</td>
                                    <td>{!!el.name ? el.name : ''}</td>
                                    <td>{!!el.caseNumberOfPages ? el.caseNumberOfPages.value : ''}</td>
                                    <td>{!!el.caseNotes ? el.caseNotes[lng] : ''}</td>
                                </tr>
                            );
                        })
                    ) : (<tr><td colSpan='5' style={{textAlign: 'center'}}>мәліметтер жоқ</td></tr>)


                }
                </tbody>
            </table><br/><br/>


            Барлығы _____________________  сақтау бірлігі (жалпы парақтардың санымен, дыбысталу
            уақытымен, метражымен) беріледі, істерді құжаттарды қайтару  мерзімі ________________________.
            <br/>
            Істерді, құжаттарды уақытша пайдалануға алушы тұлғаның уақытша пайдалану шарттары:
            <br/>1) уақытша пайдалануға алынған істер, құжаттар реттелген, тігілген, тысталған, парақтары нөмірленген және куәландыру жазбасымен болуы тиіс.
            <br/>2) уақытша пайдалануға алынған істер, құжаттар пайдалану үшін өзге тұлғаларға берілмейді, олар бойынша көшірмелер, үзінділер мен анықтамалар берілмейді, берілген құжаттардың қандайда бір бөліктері алынбайды, істерді берген ұйымның рұқсатынсыз құжаттар жарияланбайды.
            <br/>3) уақытша пайдалануға алынған істер, құжаттар ведомстволық (жеке) архивке актіде көрсетілген мерзімде қайтарылады.
            <br/>Істерді, құжаттар уақытша пайдалануға алған тұлға «Әкімшілік құқық бұзушылықтар туралы» Қазақстан Республикасының 2014 жылғы 5 шілдедегі Кодексінің 509-бабына сәйкес Ұлттық архив қорының құжаттарын жою жағдайындағы жауапкершілік туралы ескертілді.
            <br/><Row><br/>
            <Col span={18}>
                <p style={{borderBottom: '1px solid black'}}>{this.props.zavOtdel}</p><p style={{textAlign: 'center'}}><small>(істерді, құжаттарды уақытша пайдалануға берген тұлға лауазымының атауы,
                тегі, аты-жөні, қолтаңбасы
                )</small></p>
            </Col>
        </Row>
            <Row><br/>
                <Col span={8}>
                    <p style={{borderBottom: '1px solid black'}}>{this.props.zavOtdel}</p><p style={{textAlign: 'center'}}><small>(істер, құжаттар берілген күн)</small></p>
                </Col>
            </Row>
            <Row><br/>
                <Col span={18}>
                    <p style={{borderBottom: '1px solid black'}}>{this.props.zavOtdel}</p><p style={{textAlign: 'center'}}><small>(істерді, құжаттарды уақытша пайдалануға алған тұлға лауазымының атауы,
                    тегі, аты-жөні, қолтаңбасы
                    )</small></p>
                </Col>
            </Row>
            <Row><br/>
                <Col span={8}>
                    <p style={{borderBottom: '1px solid black'}}>{this.props.zavOtdel}</p><p style={{textAlign: 'center'}}><small>(істер, құжаттар алынған күн)</small></p>
                </Col>
            </Row><br/>
            <p>Істер, құжаттар толық көлемде, реттелген, тігілген және  тысталған қалпында қайтарылды.</p>
            <Row><br/>
                <Col span={18}>
                    <p style={{borderBottom: '1px solid black'}}>{this.props.zavOtdel}</p><p style={{textAlign: 'center'}}><small>(істерді, құжаттарды тапсырған тұлға лауазымының атауы,
                    тегі, аты-жөні, қолтаңбасы
                    )</small></p>
                </Col>
            </Row>
            <Row><br/>
                <Col span={8}>
                    <p style={{borderBottom: '1px solid black'}}>{this.props.zavOtdel}</p><p style={{textAlign: 'center'}}><small>(істер, құжаттар тапсырылған күн)</small></p>
                </Col>
            </Row>
            <Row><br/>
                <Col span={18}>
                    <p style={{borderBottom: '1px solid black'}}>{this.props.zavOtdel}</p><p style={{textAlign: 'center'}}><small>(істерді, құжаттарды қабылдаған тұлға лауазымының атауы,
                    тегі, аты-жөні, қолтаңбасы
                    )</small></p>
                </Col>
            </Row>
            <Row><br/>
                <Col span={8}>
                    <p style={{borderBottom: '1px solid black'}}>{this.props.zavOtdel}</p><p style={{textAlign: 'center'}}><small>(істер, құжаттар қабылданған күн)</small></p>
                </Col>
            </Row>

        </div>)
    }
};


export default GiveToAct;