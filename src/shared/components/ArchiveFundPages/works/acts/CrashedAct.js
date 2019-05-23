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
        savedList: '0',
        orgName: '',
        loading: true,
        savedList: '',
        nmDocsLinks: 'state nmDocsLinks',
        columns: [{
            title: 'п/п №',
            dataIndex: 'idx',
            key: 'idx',
            width: '5%',
            render: (obj, rec, i) => {
                return i + 1;
            }
        }, {
            title: 'Номер ед.хр.',
            dataIndex: 'caseNumber',
            key: 'caseNumber',
            width: '8%'
        }, {
            title: 'Заголовок повреждений ед.хр.',
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
                title: 'Примечание',
                dataIndex: 'caseNotes',
                key: 'caseNotes',
                width: '10%',
                render: obj => obj && obj.ru
            }]
    };

    printContent = () => {
        return (<div>
            <h2 className="text-center" style={{textAlign: "center"}}>
                Акт о неисправимых повреждениях документов</h2>
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
                style={{textDecoration: "underline"}}>{this.props.initialValues.workActualEndDate.value} </span>№
                    <span
                    style={{textDecoration: "underline"}}> {this.props.actNumber}</span>
                    <br/>(Дата)</Col>
                <Col style={{width: "41.6%", float: "right"}}>Утверждаю<br/>Директор<br/></Col>
            </Row>
            <Row style={{clear: "both"}}>
                <Col style={{width: "41.6%", float: "right"}}>
                    <span
                    style={{textDecoration: "underline"}}>{this.state.fundArchive}</span><br/>Название
                    архива</Col>
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
            <h2 style={{textAlign: "center"}}>О неисправимых повреждениях документов</h2>
            <Row style={{}}>№ фонда <span
            style={{textDecoration: "underline"}}>{this.state.fundNumber}</span></Row>
            <Row> <span
            style={{textDecoration: "underline"}}>Название фонда: {this.props.initialValues.workRegFund.label}</span></Row>
            <br/>
            <Row>В фонде обнаружены <span
            style={{textDecoration: "underline"}}>{this.state.total}</span> едениц
                хранения, признанные неисправимо поврежденными</Row>


            <br/>
            <AntTable pagination={false} loading={this.state.loading}
                      dataSource={this.state.tableData} columns={this.state.columns}/>
            <br/>


            <Row>
                Итого обнаружено неисправимо поврежденных <span style={{textDecoration: "underline"}}>{this.state.total}</span> ед.хр.
            </Row>
            <Row>
               Заведующий отделом <span style={{textDecoration: "underline"}}>{this.state.zavOtdel}</span>
            </Row>
            <Row>
                Хранитель фондов <span style={{textDecoration: "underline"}}>{this.props.initialValues.workAssignedTo.label}</span>
            </Row>
            Перечисленные документы подлежат списанию, ввиду___________________________________________
            <Row>
                сданы на переработку по приемо-сдаточной накладной <span
            style={{textDecoration: "underline"}}>{this.state.nacladDate}  </span> № <span
            style={{textDecoration: "underline"}}>{this.state.nacladNumb}</span>
            </Row>

            <Row>
                <Col col={24}><br/> Эксперты: {this.props.initialValues.workAssignedTo.label}
                </Col>
            </Row>
            <Row>
                <Col style={{width:'50%',textAlign:'left',float:'left'}}>
                    Согласован протоколом ЭПК
                    <br/>
                    _______________________________________
                    <br/>
                    (наименование местного исполнительного органа, архива)
                    <br/>
                    от 20__ г. № _________
                </Col>
                <Col style={{width:'50%',textAlign:'left',float:'left'}}>
                    Согласован протоколом ЦЭК уполномоченного органа
                    <br/>
                    от 20__ г. № _________
                </Col>
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


export default CrashedAct;