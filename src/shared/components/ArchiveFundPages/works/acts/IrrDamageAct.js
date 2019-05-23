import React from 'react';
import {Button, Col, Row} from "antd";
import AntTable from "../../../AntTable";
import axios from "axios";
import {getAct1, getIdGetObj} from "../../../../actions/actions";
import moment from "moment";
import {parseCube_new, parseForTable} from "../../../../utils/cubeParser";
import ReactDOMServer from 'react-dom/server';

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
        loading: true,
        columns: [{
            title: 'п/п №',
            dataIndex: 'idx',
            key: 'idx',
            width: '5%'
        }, {
            title: 'Заголовок ед. хр.',
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
            title: 'К какому фонду относится (новый шифр)',
            dataIndex: 'workRegFund',
            key: 'workRegFund',
            width: '15%'
        }, {
            title: 'Примечание',
            dataIndex: 'description',
            key: 'description',
            width: '15%'
        }]
    };

    printContent = () => {
        return (<div>
            <h2 className="text-center" style={{textAlign: "center"}}>
                Акт об обнаружении архивных документов</h2>
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
            <h2 style={{textAlign: "center"}}>Об обнаружении архивных документов</h2>
            <Row style={{clear: "both"}}>
                <Col style={{width: "100%"}}>
                    В ходе работы<br/>
                    <span
                    style={{textDecoration: "underline"}}> {this.state.caseAvailabilityCheck} </span>
                    было обнаружено</Col>
            </Row>
            <Row>
                <Col style={{width: "100%", textAlign: "center"}}>
            <span style={{textDecoration: "underline"}}>
                {this.state.fundNumber}, {this.state.caseStorageMulti}
            </span> <br/>(в фонде, хранилище, рабочем помещении)
                </Col>
            </Row>
            <AntTable pagination={false} loading={this.state.loading}
                      dataSource={this.state.tableData} columns={this.state.columns}/>
            <hr/>
            <Row>
                <Col style={{float: "left", width: "33%"}}>Итого обнаружено </Col><Col
            style={{
                float: "left",
                width: "33%",
                textAlign: "center"
            }}> {this.state.total} </Col><Col
            style={{float: "left", width: "33%"}}>ед.хр.</Col>
                <Col style={{width: "100%", textAlign: "center"}}><span
                style={{textDecoration: "underline"}}></span>(цифрами и
                    прописью)</Col>

            </Row>
            <br/>

            <h3><br/>Изменения в учетные документы внесены</h3>
            <Row>
                <Col col={24}>{this.props.initialValues.workAssignedTo.label}</Col>
            </Row>

            <h3>Проверку производили</h3>
            <Row>
                <Col col={24}>{this.props.initialValues.workAuthor.label}</Col>
            </Row>
            <Row>
                <Col
                col={24}>Дата: {this.props.initialValues.workActualEndDate.value}</Col>
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


export default IrrDamageAct;