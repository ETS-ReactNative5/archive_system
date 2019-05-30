import React from 'react';
import {Button, Col, Row} from "antd";
import AntTable from "../../../AntTable";
import axios from "axios";
import {getAct1, getIdGetObj, lightToDestroy} from "../../../../actions/actions";
import moment from "moment";
import {parseCube_new, parseForTable} from "../../../../utils/cubeParser";
import ReactDOMServer from 'react-dom/server';

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
                return i+1
            }
        }, {
            title: 'Названия групп документов',
            dataIndex: 'name',
            key: 'name',
            width: '20%'
        }, {
            title: 'Крайние даты',
            dataIndex: 'caseDbeg',
            key: 'caseDbeg',
            width: '15%',
            render:(obj,rec)=>{return [rec.caseDbeg +'-'+rec.caseDend]}
        }, {
            title: 'Номера описей',
            dataIndex: 'invNumber',
            key: 'invNumber',
            width: '15%',
            render: ()=>this.props.initialValues.workRegInv.label
        }, {
            title: 'Номера ед.хр. по описям',
            dataIndex: 'caseNumber',
            key: 'caseNumber',
            width: '15%',
        }, {
            title: 'Кол-во ед.хр',
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
            }]
    };

    printContent = () => {
        return (<div>
            <h2 className="text-center" style={{textAlign: "center"}}>
                Акт о выделении к уничтожению документов, не подлежащих хранению</h2>
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
            <h2 style={{textAlign: "center"}}>О выделении к уничтожению документов, не
                подлежащих хранению</h2>
            <Row style={{}}>К уничтожению отобраны: документы фонда № <span
            style={{textDecoration: "underline"}}>{this.state.fundNumber}</span></Row>
            <Row style={{textAlign: "center"}}> <span
            style={{textDecoration: "underline"}}>{this.props.initialValues.workRegFund.label}</span></Row>
            <Row style={{textAlign: "center"}}> (Название фонда)</Row> <br/>
            <Row>На основании Акта о неисправимых повреждениях документов № <span style={{textDecoration: "underline"}}>{this.props.actNumber.slice(0, -1) + '4'}</span> от {this.props.initialValues.workActualEndDate.value}<br/>(Ссылки
                на нормативно-методические документы, для проведения экспертизы)</Row>

            <br/>
            <AntTable pagination={false} loading={this.state.loading}
                      dataSource={this.state.tableData} columns={this.state.columns}/>
            <br/>
            <Row>
                Итого <span
            style={{textDecoration: "underline"}}>{this.state.total}</span> ед.хр. за <span style={{textDecoration: "underline"}}> {this.state.year}</span>
                год(ы)
            </Row>
            <Row>
                Количество ед.хр., крайние даты и краткая характеристика документов,
                остающихся на хранении <span
            style={{textDecoration: "underline"}}>{this.state.savedList}</span>
            </Row>
            <Row>
                Документы <span
            style={{textDecoration: "underline"}}>{this.state.orgName}</span><br/>(Название
                организации)
            </Row>
            <Row>
                сданы на переработку по приемо-сдаточной накладной <span
            style={{textDecoration: "underline"}}>{this.state.nacladDate}  </span> № <span
            style={{textDecoration: "underline"}}>{this.state.nacladNumb}</span>
            </Row>

            <Row>
                <Col col={24}><br/> Заведующий отделом
                    (архивохранилищем): {this.props.initialValues.workAssignedTo.label}
                </Col>
            </Row>

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
        lightToDestroy((this.props.workId).split('_')[1]).then(res => {
            let data = res.data;
            var arrObj = [];

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
                var savedList = parseInt(res.data.data['do_' + this.props.tofiConstants.doForCase.id].length) - parseInt(data.countCases);
                this.setState({
                    savedList: savedList
                })
            });


            this.setState({
                fundNumber: data.fundNumber,
                fundArchive: data.fundArchive.ru,
                caseAvailabilityCheck: this.props.initialValues.workType.label,
                tableData: data.cases,
                total: data.countCases,
                orgName: data.ik.ru,
                loading: false,
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


export default LightToDestroy;