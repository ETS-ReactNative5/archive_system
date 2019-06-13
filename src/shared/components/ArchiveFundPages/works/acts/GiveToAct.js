import React, {useRef} from 'react';
import {getAct1, getCube, getIdGetObj} from "../../../../actions/actions";
import {Button, Col, Row} from "antd";
import ReactDOMServer from 'react-dom/server';
import AntTable from "../../../AntTable";
import {parseCube_new, parseForTable} from "../../../../utils/cubeParser";
import axios from 'axios';


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
        disinfection: '0',
        disinfestation: '0',
        restoration: '0',
        binding: '0',
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
                cntAdded: data.cntAdded,
                columns: [{
                    title: 'Опись №',
                    dataIndex: 'idx',
                    key: 'idx',
                    width: '5%',
                }, {
                    title: 'Ед.хр. №',
                    dataIndex: 'caseNumber',
                    key: 'caseNumber',
                    width: '8',
                    render: caseNumber => caseNumber && caseNumber.value
                }, {
                    title: 'Заголовок ед.хр.',
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


    printContent = () => {
        return (<div>

            <Row>
                <Col span={24} className="text-center" style={{textAlign: "center"}}><span
                style={{textDecoration: "underline"}}>{this.state.fundArchive}</span><br/>(Название
                    архива)</Col>
            </Row>
            <Row>
                <h1 className="text-center upp-case"
                    style={{textAlign: "center", textTransform: "uppercase"}}>Акт</h1>
            </Row>
            <Row>
                <Col style={{width: "50%", float: "left"}}> <span
                style={{textDecoration: "underline"}}>{this.props.initialValues.workActualStartDate.value} </span>
                    № <span
                    style={{textDecoration: "underline"}}> {this.props.actNumber}</span>
                    <br/>(Дата)</Col>
                <Col style={{width: "41.6%", float: "right"}}>Утверждаю<br/>Директор<br/></Col>
            </Row>
            <Row style={{clear: "both"}}>
                <Col style={{width: "41.6%", float: "right"}}>
                    <span
                    style={{textDecoration: "underline"}}>{this.state.fundArchive}</span><br/>(Название
                    архива)</Col>
            </Row>
            <Row style={{clear: "both"}}>
                <Col
                style={{width: "41.6%", float: "right"}}>_________________________<br/>Подпись
                    Расшифровка
                    подписи</Col>
            </Row>
            <Row style={{clear: "both"}}>
                <Col style={{width: "41.6%", float: "right"}}>Дата: </Col>
            </Row> <br/>
            <Row>
                <h2 className="text-center">о выдаче архивных документов во временное
                    пользование</h2>
            </Row>

            <Row>
                _____________________________________________________________<br/>
                <p style={{textAlign: 'center'}}>(наименование организации) </p>

            </Row>
            <Row>
                _____________________________________________________________<br/>
                <p style={{textAlign: 'center'}}>(почтовый индекс, адрес, телефон)</p>
                <p>Основание: _______________________________________________</p>

            </Row>
            <Row>

                <p>Для какой цели выдаются документы:<br/>
                    _________________________________________________________</p>
                <p style={{textAlign: 'center'}}>(наименование, номер) </p>
            </Row>

            <AntTable columns={this.state.columns} dataSource={this.state.tableData}>

            </AntTable>

            Всего выдается _________________ (_______________) ед.хр. (общим количеством
            листов, временем звучания, метражом) на срок _______________________
            <p>Документвы выданы в упорядоченном состоянии.</p>
            <p>Получатель обязуется не предоставлять документы, полученные во временное
                пользование, для просмотра, прослушивания или использования другим
                организациям и посторонним лицам, не выдавать по ним копий, выписок и
                справок, не производить изъятия каких-либо частей из выданных документов,
                не публиковать документы без разрешения архива.</p>
            <p>Получатель предупрежден об отвественности по закону в случае утраты или
                повреждения выданных документов</p>

            <p>Документы сдал<br/></p>
            <Row>
                <Col col={24}>Наименование должности работника Подпись Расшифровка подписи<br/>Дата<br/><br/>Руководитель
                    архива Подпись Расшифровка подписи<br/>Печать архива<br/>Дата</Col>
            </Row>
            <br/>
            <p>Документы принял<br/></p>
            <Row>
                <Col col={24}>Наименование должности работника организации-получателя
                    Подпись Расшифровка подписи<br/>Дата<br/><br/>Руководитель
                    организации-получателя Подпись Расшифровка подписи<br/>Печать
                    организации-получателя<br/>Дата</Col>
            </Row>
            ____________________________________________________________<br/>
            ____________________________________________________________<br/>


            <h3 style={{}}> Документы сдал</h3>

            <Row>
                <Col col={24}>Наименование должности работника организации<br/> Подпись
                    Расшифровка подписи<br/>Дата<br/></Col>
            </Row>
            <Row>
                <Col col={24}>Руководитель организации<br/> Подпись Расшифровка
                    подписи<br/>Печать организации-получателя <br/>Дата</Col>
                <Col col={24}>Руководитель организации Подпись Расшифровка подписи<br/>Печать
                    организации-получателя<br/>Дата</Col>
            </Row>
            <h3 style={{}}> Документы принял</h3>
            <Row>
                <Col col={24}>Наименование должности работника архива<br/> Подпись
                    Расшифровка подписи<br/>Дата<br/><br/>Руководитель архива<br/> Подпись
                    Расшифровка подписи<br/>Печать архива</Col>
            </Row>
        </div>)
    };

    render() {
        const {t, tofiConstants, initialValues, workId} = this.props;
        return (
        <div className="act_print">

            <Button type='primary' onClick={() => this.toPrint(this.printContent())}>Распечатать</Button>
            <h2 className="text-center" style={{textAlign: "center"}}>
                Акт о выдаче архивных документов во временное
                пользование {this.state.fundArchive}</h2>
            {this.printContent()}
        </div>

        )
    }
}


export default GiveToAct;