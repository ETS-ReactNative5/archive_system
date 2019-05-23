import React, { useRef } from 'react';
import {getAct1, getCube, getIdGetObj} from "../../../../actions/actions";
import {Button, Col, Row} from "antd";
import moment from "moment";
import { PrintTool } from "react-print-tool";
import ReactDOMServer from 'react-dom/server';



class DamageAct extends React.Component {

    state = {
        fundArchive: 'state Архив',
        cntCaseNotA:'0',
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
        cntAdded:'0',
        storageAndDamage: '0'
    };


    componentDidMount() {
        getAct1((this.props.workId).split('_')[1]).then(res=>{console.log(res);
        let data=res.data;
        this.setState({
            cntCaseNotA:data.cntCaseNotA,
            cntAdded:data.cntAdded,
            fundNumber:data.fundNumber,
            fundArchive:data.fundArchive.ru,
            startDate:data.workActualStartDate,
            endDate:data.workActualEndDate,
            invNumber:data.invNumber,
            invCount:data.cntCase,
            disinfection:data.workType.disinfection,
            disinfestation:data.workType.disinfestation,
            restoration:data.workType.restoration,
            binding:data.workType.binding,
            restorationOfFadingTexts:data.workType.restorationOfFadingTexts,
            irreparablyDamaged:data.cntCaseDamage,
            caseInInv:parseInt(data.cntCase) - parseInt(data.cntCaseNotA) + parseInt(data.cntAdded)
        })
        });
            }

    componentDidUpdate(prevProps) {

    }

    toPrint=(printThis)=>{
        const htmlString = ReactDOMServer.renderToString(printThis);
        var win = window.open();
        win.document.open();
        win.document.write('<'+'html'+'><'+'body'+'>');
        win.document.write(htmlString);
        win.document.write('<'+'/body'+'><'+'/html'+'>');
        win.document.close();
        win.print();
        win.close();
    };


    printContent=()=>{
        return(<div>
            <h2 className="text-center" style={{textAlign:"center"}}>
                Акт проверки наличия и состояния архивных
                документов {this.state.fundArchive}</h2>
            <Row>
                <Col span={24} className="text-center" style={{textAlign:"center"}}><span
                style={{textDecoration:"underline"}}>{this.state.fundArchive}</span><br/>(Название
                    архива)</Col>
            </Row>
            <Row>
                <h1 className="text-center upp-case" style={{textAlign:"center",textTransform:"uppercase"}}>Акт</h1>
            </Row>
            <Row>
                <Col style={{width:"50%",float:"left"}}> <span
                style={{textDecoration:"underline"}}>{this.props.initialValues.workActualEndDate.value} </span> № <span style={{textDecoration:"underline"}}> {this.props.actNumber}</span> <br/>(Дата)</Col>
                <Col style={{width:"41.6%",float:"right"}}>Утверждаю<br/>Директор<br/></Col>
            </Row>
            <Row style={{clear:"both"}}>
                <Col style={{width:"41.6%",float:"right"}}>
                    <span style={{textDecoration:"underline"}}>{this.state.fundArchive}</span><br/>(Название
                    архива)</Col>
            </Row>
            <Row style={{clear:"both"}}>
                <Col style={{width:"41.6%",float:"right"}}>_________________________<br/>Подпись Расшифровка
                    подписи</Col>
            </Row>
            <Row style={{clear:"both"}}>
                <Col style={{width:"41.6%",float:"right"}}>Дата: </Col>
            </Row>             <br/>
            <Row>
                <h2 className="text-center">Проверки наличия и состояния архивных
                    документов</h2>
            </Row>
            <Row>
                <Col col={8}>Фонд № <span
                 style={{textDecoration:"underline"}}>{this.state.fundNumber}</span></Col>
            </Row>
            <Row>
                <Col col={24}>
                    Название фонда<br/>
                    <span  style={{textDecoration:"underline"}}>{this.props.initialValues.workRegFund.label}</span>
                </Col>
            </Row>
            <Row>
                <Col col={24}>
                    № описей
                    <span  style={{textDecoration:"underline"}}>{this.state.invNumber}</span>
                </Col>
            </Row>
            <Row>
                <Col col={24}>
                    Проверка проводилась с <span style={{textDecoration:"underline"}}> {this.state.startDate} </span> по <span style={{textDecoration:"underline"}}> {this.state.endDate} </span>
                </Col>
            </Row>
            <strong>1. Числится по описям <span  style={{textDecoration:"underline"}}>{this.state.invCount}</span> ед.хр.<br/></strong>
            <strong>2. Не оказалось в наличии <span  style={{textDecoration:"underline"}}>{this.state.cntCaseNotA}</span> ед.хр.<br/></strong>
            <strong>3. Имеется в наличии по данному фонду</strong>
            <Row>
                <Col col={24}>
                    (Включенных в описи) <span
                 style={{textDecoration:"underline"}}>{this.state.invCount - this.state.cntCaseNotA}</span> ед.хр.
                </Col>
            </Row>
            <strong>Из них требующих:</strong>
            <Row>
                <Col col={24}>
                    а) Дезинфекция <span
                 style={{textDecoration:"underline"}}>{!!this.state.disinfection ? this.state.disinfection:'0'}</span> ед.хр.
                </Col>
                <Col col={24}>
                    б) Дезинсекция <span
                 style={{textDecoration:"underline"}}>{!!this.state.disinfestation ? this.state.disinfestation:'0'}</span> ед.хр.
                </Col>
                <Col col={24}>
                    в) Реставрация <span  style={{textDecoration:"underline"}}>{!!this.state.restoration ? this.state.restoration:'0'} ед.хр.</span>
                </Col>
                <Col col={24}>
                    г) Переплета или подшивки <span
                 style={{textDecoration:"underline"}}>{!!this.state.binding ? this.state.binding:'0'} ед.хр.</span>
                </Col>
                <Col col={24}>
                    д) Восстановление затухающих
                    текстов <span
                 style={{textDecoration:"underline"}}>{!!this.state.restorationOfFadingTexts  ? this.state.restorationOfFadingTexts:'0'} ед.хр. </span>
                </Col>
                <Col col={24}>
                    е) Неисправимо поврежденных <span
                 style={{textDecoration:"underline"}}>{!!this.state.irreparablyDamaged  ? this.state.irreparablyDamaged:'0'} ед.хр.</span>
                </Col>
            </Row>
            <Row>
                <Col col={24}>
                    <strong>  4. Имеется не включенных в описи: <span
                    style={{textDecoration:"underline"}}>{this.state.cntAdded }</span>     </strong>
                </Col>
            </Row>
            <Row>
                <Col col={24}>
                    <strong>   5. Итого по данному фонду (включенных и невключенных в описи)
                    имеющихся в
                    наличии: <span
                        style={{textDecoration:"underline"}}>{this.state.caseInInv}</span> ед.хр.    </strong>
                </Col>
            </Row>
            <h3><br/>Характеристика условий их хранения.</h3>
            <Row>
                <Col col={24}>
                    ____________________________________________________________<br/>
                    ____________________________________________________________<br/>
                    ____________________________________________________________<br/>
                </Col>
            </Row>
            <h3 style={{}}>Проверку производили</h3>
            <Row>
                <Col col={24}>{this.props.initialValues.workAssignedTo.label}</Col>

            </Row>
            <h3>Согласовано</h3>
            <Row>
                <Col col={24}>{this.props.initialValues.workAuthor.label}</Col>
            </Row>
            <Row>
                <Col col={24}>Дата: {this.props.initialValues.workActualEndDate.value}</Col>
            </Row>
        </div>)
    };

    render() {
        const {t, tofiConstants, initialValues, workId} = this.props;
        return (
        <div className="act_print">
            <Button type='primary' onClick={()=> this.toPrint(this.printContent())}>Распечатать</Button>
            {this.printContent()}
        </div>

        )
    }
}


export default DamageAct;