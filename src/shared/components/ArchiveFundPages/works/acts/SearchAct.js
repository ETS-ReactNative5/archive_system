import React, {useRef} from 'react';
import {
    getAct1, getCube, getIdGetObj,
    getValueOfMultiText
} from "../../../../actions/actions";
import {Button, Col, Row} from "antd";
import moment from "moment";
import {PrintTool} from "react-print-tool";
import ReactDOMServer from 'react-dom/server';
import AntTable from "../../../AntTable";
import {parseCube_new, parseForTable} from "../../../../utils/cubeParser";
import axios from 'axios';


class SearchAct extends React.Component {

    state = {
        tableData: [],
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
        columns: [{
            title: 'п/п №',
            dataIndex: 'idx',
            key: 'idx',
            width: '5%',
            render: (obj, rec, i) => {
                return i + 1;
            }
        }, {
            title: 'Номер описи',
            dataIndex: 'workRegInv',
            key: 'workRegInv',
            width: '8%'
        }, {
            title: 'Номер ед.хр.',
            dataIndex: 'caseNumber',
            key: 'caseNumber',
            width: '8%',
            render: caseNumber => caseNumber && caseNumber.value
        }, {
            title: 'Заголовок повреждений ед.хр.',
            dataIndex: 'caseName',
            key: 'caseName',
            width: '24%',
            render: (obj, rec) => rec.name
        }, {
            title: 'Крайние даты',
            dataIndex: 'invDates',
            key: 'invDates',
            width: '15%',
            render: (text, rec) => [rec.caseDbeg.value + ' - ' + rec.caseDend.value]
        }, {
            title: 'Количество листов (время звучания, метраж)',
            dataIndex: 'caseNumberOfPages',
            key: 'caseNumberOfPages',
            width: '10%',
            render: obj => obj && obj.value
        }
            ,
            {
                title: 'Предпологаемые причины отсутсвия',
                dataIndex: 'absenceCase',
                key: 'absenceCase',
                width: '20%'
            }]
    };


    renderTableData = (item, idx) => {
        const constArr = ['caseNumber', 'caseDbeg', 'caseDend', 'caseNumberOfPages', 'absenceCase', 'casesRecovery'];
        const result = {
            idx: idx + 1,
            id: item.id,
            name: item.name.ru,
            workRegFund: this.props.initialValues.workRegFund.label,
            workRegInv: this.props.initialValues.workRegInv.label,
            absenceCase:this.state.absenceCase
        };
        parseForTable(item.props, this.props.tofiConstants, result, constArr);
        return result;
    };


    componentDidMount() {
        getAct1((this.props.workId).split('_')[1]).then(res => {
            console.log(res);
            let data = res.data;
            this.setState({
                cntCaseNotA: data.cntCaseNotA,
                cntAdded: data.cntAdded,
                fundNumber: data.fundNumber,
                fundArchive: data.fundArchive.ru,
                startDate: data.workActualStartDate,
                endDate: data.workActualEndDate,
                invNumber: data.invNumber,
                invCount: data.cntCase,
                absenceCase:''
            })
        });

        getValueOfMultiText((this.props.workId).split('_')[1],'absenceCase').then(res=>{
        var absenceCase = res.data[0].valueMultiStr.ru
        this.setState({
            absenceCase:absenceCase
        })
        }

        );
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
                style={{textDecoration: "underline"}}>{this.props.initialValues.workActualEndDate.value} </span>
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
            <Row className="text-center">
                <h2 className="text-center">О не обнаружении документов, пути розыска
                    которых исчерпаны</h2>
            </Row>
            <Row>
                <Col col={24}>Фонт № <span
                style={{textDecoration: "underline"}}>{this.state.fundNumber}</span></Col>
            </Row>
            <br/>
            <Row>
                <Col col={24}>
                    В результате розыска дел установлено отстутсвие
                    в фонде перечисленных ниже документов. Предпринятые архивом меры по
                    розыску положительных результатов не дали, в связи с чем, считаем
                    возможным снять с учета:
               </Col>
            </Row>
            <AntTable pagination={false} dataSource={this.state.tableData} loading={false}
                      columns={this.state.columns}/>
            <Row>Содержание утраченных документов может быть частично восполнено
                следующими делами:{this.state.tableData[0] && this.state.tableData[0].casesRecovery.map(el=>el.value).join(',') }</Row>

            <Row>
                Заведующий отделом <br/>
                Подпись Расшифровка подписи
            </Row>

            <Row>
                Заведующий хранилищем <br/>
                Подпись Расшифровка подписи
            </Row>

            <Row>
                Главный хранитель <br/>
                Подпись Расшифровка подписи
            </Row>


            <Row>
                ________ _________________ <br/>
                (№ и дата разрешения уполномоченного органа и соответсвующего местного
                исполнительного органа на снятие с учета необнаруженинных документов, пути
                розыска которых исчерпаны)
            </Row>


            <Row>
                ________ _________________ <br/>
                (№ и дата приказа директора архива о снятии с учета необнаруженных
                архивных документов, пути розыска которых ичерпаны)
            </Row>


            <h3 style={{}}>Изменения в учетные документы внесены</h3>
            <Row>
                <Col col={24}>{this.props.initialValues.workAssignedTo.label}</Col>

            </Row>
            <Row>
                <Col
                col={24}>Дата: {this.props.initialValues.workActualEndDate.value}</Col>
            </Row>
        </div>)
    };

    render() {
        const {t, tofiConstants, initialValues, workId} = this.props;
        return (
        <div className="act_print">
            <Button type='primary' onClick={() => this.toPrint(this.printContent())}>Распечатать</Button>
            <h2 className="text-center" style={{textAlign: "center"}}>
                Акт о не обнаружении документов, пути розыска которых
                исчерпаны {this.state.fundArchive}</h2>
            {this.printContent()}

        </div>

        )
    }
}


export default SearchAct;