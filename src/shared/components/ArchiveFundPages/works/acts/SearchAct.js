import React, {useRef} from 'react';
import {
    getAct1, getCube, getIdGetObj,
    getValueOfMultiText
} from "../../../../actions/actions";
import {Button, Col, Row, Select} from "antd";
import moment from "moment";
import ReactDOMServer from 'react-dom/server';
import AntTable from "../../../AntTable";
import {parseCube_new, parseForTable} from "../../../../utils/cubeParser";
import axios from 'axios';
import ReactToPrint from "react-to-print";
import './PrintAct.css';
const { Option } = Select;

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
        page: 'ru',
        columns: [{
            title: 'Порядковый номер',
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
            title: 'Номер единицы хранения',
            dataIndex: 'caseNumber',
            key: 'caseNumber',
            width: '8%',
            render: caseNumber => caseNumber && caseNumber.value
        }, {
            title: 'Заголовок единиц хранения',
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
            }],
        columnsKaz: [{
            title: 'Реттік нөмірі',
            dataIndex: 'idx',
            key: 'idx',
            width: '5%',
            render: (obj, rec, i) => {
                return i + 1;
            }
        }, {
            title: 'Тізімдеменің нөмірі',
            dataIndex: 'workRegInv',
            key: 'workRegInv',
            width: '8%'
        }, {
            title: 'Сақтау бірлігінің нөмірі',
            dataIndex: 'caseNumber',
            key: 'caseNumber',
            width: '8%',
            render: caseNumber => caseNumber && caseNumber.value
        }, {
            title: 'Сақтау бірлігінің тақырыбы',
            dataIndex: 'caseName',
            key: 'caseName',
            width: '24%',
            render: (obj, rec) => rec.name
        }, {
            title: 'Соңғы даталары',
            dataIndex: 'invDates',
            key: 'invDates',
            width: '15%',
            render: (text, rec) => [rec.caseDbeg.value + ' - ' + rec.caseDend.value]
        }, {
            title: 'Парақтар саны (дыбысталу уақыты, метражы)',
            dataIndex: 'caseNumberOfPages',
            key: 'caseNumberOfPages',
            width: '10%',
            render: obj => obj && obj.value
        }
            ,
            {
                title: 'Жоқ болуының болжамды себептері',
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
        var absenceCase = !!res.data[0] ? res.data[0].valueMultiStr.ru : ''
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

    render() {
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
                <Col style={{width: "43%", float: "right"}}>Утверждаю<br/><br/>
                    <p style={{borderBottom: '1px solid black',textAlign: 'center'}}></p><p style={{textAlign: 'center'}}><small>(наименование должности, фамилия,
                        инициалы руководителя архива )</small></p><br/>
                    <p style={{borderBottom: '1px solid black',textAlign: 'center'}}></p><p style={{textAlign: 'center'}}><small>(подпись руководителя архива )</small></p><br/>
                    <p style={{borderBottom: '1px solid black',textAlign: 'center'}}></p><p style={{textAlign: 'center'}}><small>(дата )</small></p>
                </Col>
            </Row><br/><br/>
            <h1 style={{textAlign: "center"}}>Акт о необнаружении документов, пути розыска которых исчерпаны</h1>
            <Row style={{textAlign: "center"}}>__________ № __________</Row>
            <Row style={{textAlign: "right"}}><Col style={{width: "45%", float: "left"}}>(дата)</Col></Row><br/>
            <Row style={{}}>Архивный фонд №  <span
            >{this.props.fundNumber}</span></Row>
            <Row>
                <Col col={24}>
                    В результате розыска дел установлено отстутсвие
                    в фонде перечисленных ниже документов. Предпринятые архивом меры по
                    розыску положительных результатов не дали, в связи с чем, считаем
                    возможным снять с учета:
                </Col>
            </Row><br/>
            {/*<AntTable pagination={false} dataSource={this.props.tableData} loading={false}*/}
            {/*          columns={this.props.columns} className='prntTbl'/>*/}
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
                            console.log(el);
                            return(
                                <tr>
                                    <td>{i}</td>
                                    <td>{!!el.workRegInv ? el.workRegInv : ''}</td>
                                    <td>{!!el.caseNumber ? el.caseNumber.value : ''}</td>
                                    <td>{!!el.name ? el.name : ''}</td>
                                    <td>{!!el.caseDbeg ? el.caseDbeg.value + ' : ' + el.caseDend.value : ''}</td>
                                    <td>{!!el.caseNumberOfPages ? el.caseNumberOfPages.value : ''}</td>
                                    <td>{!!el.absenceCase ? el.absenceCase : ''}</td>
                                </tr>
                            );
                        })
                    ) : (<tr><td colSpan='7' style={{textAlign: 'center'}}>нет данных</td></tr>)

                }
                </tbody>
            </table><br/>
            <Row>
                Итого {this.props.total} единиц хранения.
            </Row>
            <Row>Содержание утраченных документов может быть частично восполнено
                следующими делами:{this.props.tableData[0] && this.props.tableData[0].casesRecovery && this.props.tableData[0].casesRecovery.map(el=>el.value).join(',') }</Row>
            <Row><br/>
                <Col span={11}>
                    <p style={{borderBottom: '1px solid black'}}></p><p style={{textAlign: 'center'}}><small>(фамилия, инициалы, подпись заведующего отделом)</small></p>
                </Col>
            </Row><br/>
            <Row>
                <Col span={11}>
                    <p style={{borderBottom: '1px solid black'}}></p><p style={{textAlign: 'center'}}><small>(фамилия, инициалы, подпись заведующего хранилищем)</small></p>
                </Col>
            </Row><br/>
            <Row>
                <Col span={11}>
                    <p style={{borderBottom: '1px solid black'}}></p><p style={{textAlign: 'center'}}><small>(фамилия, инициалы, подпись главного хранителя фондов)</small></p>
                </Col>
            </Row>


            <Row>
                ________ _________________ <br/>
                (номер и дата разрешения уполномоченного органа
                и соответствующего местного исполнительного
                органа на снятие с учета необнаруженных
                документов, пути розыска которых исчерпаны
                )
            </Row>


            <Row>
                ________ _________________ <br/>
                (номер и дата приказа директора архива
                о снятии с учета необнаруженных
                архивных документов,
                пути розыска которых исчерпаны
                )
            </Row>


            <p style={{}}>Изменения в учетные документы внесены.</p>
            <Row>
                <Col col={24}>{this.props.initialValues.workAssignedTo.label}</Col>

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
                        тегі, аты-жөні
                        )</small></p><br/>
                    <p style={{borderBottom: '1px solid black',textAlign: 'center'}}></p><p style={{textAlign: 'center'}}><small>(архив басшысының қолтаңбасы )</small></p><br/>
                    <p style={{borderBottom: '1px solid black',textAlign: 'center'}}></p><p style={{textAlign: 'center'}}><small>(күні )</small></p>
                </Col>
            </Row><br/><br/>
            <h1 style={{textAlign: "center"}}>Іздеу жолдары таусылған құжаттардың табылмағаны туралы акті</h1>
            <Row style={{textAlign: "center"}}>__________ № __________</Row>
            <Row style={{textAlign: "right"}}><Col style={{width: "45%", float: "left"}}>(күні)</Col></Row><br/>
            <Row style={{}}>№  <span
            >{this.props.fundNumber} архив қоры</span></Row>
            <Row>
                <Col col={24}>
                    Іздеу жолдары нәтижесінде төменде аталған құжаттардың архивтік қорда жоқ екені анықталды. Архивтің іздеу шаралары оң нәтиже бермеді, осыған орай есептен алуға болады деп есептейміз
                </Col>
            </Row><br/>
            {/*<AntTable pagination={false} dataSource={this.props.tableData} loading={false}*/}
            {/*          columns={this.props.columns} className='prntTbl'/>*/}
            <table className="tbltoprint" width="100%">
                <thead>
                <tr>
                    {
                        this.props.columnsKaz.map((el) => {
                            return(
                                <td><b>{el.title}</b></td>
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
                            i++;
                            console.log(el);
                            return(
                                <tr>
                                    <td>{i}</td>
                                    <td>{!!el.workRegInv ? el.workRegInv : ''}</td>
                                    <td>{!!el.caseNumber ? el.caseNumber.value : ''}</td>
                                    <td>{!!el.name ? el.name : ''}</td>
                                    <td>{!!el.caseDbeg ? el.caseDbeg.value + ' : ' + el.caseDend.value : ''}</td>
                                    <td>{!!el.caseNumberOfPages ? el.caseNumberOfPages.value : ''}</td>
                                    <td>{!!el.absenceCase ? el.absenceCase : ''}</td>
                                </tr>
                            );
                        })
                    ) : (<tr><td colSpan='7' style={{textAlign: 'center'}}>мәліметтер жоқ</td></tr>)

                }
                </tbody>
            </table><br/>
            <Row>
                Жиыны {this.props.total} сақтау бірлігі.
            </Row>
            <Row>Жоғалған құжаттардың мазмұны мынадай істермен ішінара толықтырылуы мүмкін:{this.props.tableData[0] && this.props.tableData[0].casesRecovery && this.props.tableData[0].casesRecovery.map(el=>el.value).join(',') }</Row>
            <Row><br/>
                <Col span={11}>
                    <p style={{borderBottom: '1px solid black'}}></p><p style={{textAlign: 'center'}}><small>(бөлім меңгерушісінің тегі, аты-жөні, қолтаңбасы)</small></p>
                </Col>
            </Row><br/>
            <Row>
                <Col span={11}>
                    <p style={{borderBottom: '1px solid black'}}></p><p style={{textAlign: 'center'}}><small>(архив қоймасы меңгерушісінің тегі, аты-жөні, қолтаңбасы)</small></p>
                </Col>
            </Row><br/>
            <Row>
                <Col span={11}>
                    <p style={{borderBottom: '1px solid black'}}></p><p style={{textAlign: 'center'}}><small>(бас қор сақтаушысының тегі, аты-жөні, қолтаңбасы)</small></p>
                </Col>
            </Row>


            <Row>
                ________ _________________ <br/>
                (уәкілетті органның және тиісті жергілікті атқарушы
                органның іздеу жолдары аяқталған табылмаған құжаттарды
                есептен шығаруға рұқсатының нөмірі және күні
                )
            </Row>


            <Row>
                ________ _________________ <br/>
                (іздеу жолдары аяқталған, табылмаған архивтік
                құжаттарды есептен шығару туралы архив
                директоры бұйрығының нөмірі және күні
                )
            </Row>


            <p style={{}}>Есепке алу құжаттарына өзгерістер енгізілді.</p>
            <Row>
                <Col col={24}>{this.props.initialValues.workAssignedTo.label}</Col>

            </Row>
            <Row>
                <Col
                    col={24}>Күні: {this.props.initialValues.workActualEndDate.value}</Col>
            </Row>
        </div>)
    }
};

export default SearchAct;