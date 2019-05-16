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

class TransferLPAct extends React.Component {
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

    };

    printContent = () => {
        return (<div>
            <h2 className="text-center" style={{textAlign: "center"}}>
                Акт приема на хранение документов личного происхождения</h2>

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
                style={{textDecoration: "underline"}}>{this.props.initialValues.workActualEndDate.value} </span>
                    № <span
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

            <h2 style={{textAlign: "center"}}>приема на хранение документов личного
                происхождения</h2>

            <Row>
                На основании решения ЭПК<br/>
                (протокол от ______________ № ________________) и договора от
                _________________
            </Row>
            <Row>
                ___________________________________________________________________________
                сдал<br/>
                (Фамилия, имя, отчество (при наличии) собственника/владельца)
            </Row>
            <Row>
                приняты документы
                ________________________________________________________________
                <br/>
                в количестве ___________ ед.хр. (условных) caseNumberOfPages документов
                (листов)
            </Row>


            <Row>
                по архивной сдаточной описи <br/>
                Фонду присвоен №_____________________________ <span
            style={{textDecoration: "underline"}}>__</span> ед.хр.
            </Row>

            <Row>
                Собственник/владелец Подпись Расшифровка подписи
                <br/>
                (нужно подчеркнуть)
            </Row>

            <h3><br/>Наименование должности работника</h3>
            <Row>
                <Col col={24}>________________________________________</Col>
            </Row>
            <h3><br/>Изменения в учетные документы по результатам описания внесены</h3>
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


export default TransferLPAct;