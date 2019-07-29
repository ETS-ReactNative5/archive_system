import React, { useRef } from 'react';
import {getAct1, getCube, getIdGetObj} from "../../../../actions/actions";
import {Button, Col, Row, Select} from "antd";
import ReactDOMServer from 'react-dom/server';
import ReactToPrint from "react-to-print";
const { Option } = Select;


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
        page: 'ru',
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

    onChangeLng = (value) => {debugger
        if(value !== this.state.page){
            this.setState({
                page: value
            });
        }
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
        return(<div style={{padding: '40px 40px 40px 70px'}}>
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
            <h1 style={{textAlign: "center"}}>Акт проверки наличия и состояния архивных документов </h1>
            <Row style={{textAlign: "center"}}>__________ № __________</Row>
            <Row style={{textAlign: "right"}}><Col style={{width: "45%", float: "left"}}>(дата)</Col></Row><br/>

            <Row gutter={8}>
                <Col span={22}>Архивный фонд  № {this.props.fundNumber}</Col>
            </Row>
            <Row>
                <Col col={24}>
                    Название архивного фонда
                    <span  style={{}}> {this.props.initialValues.workRegFund.label}</span>
                </Col>
            </Row>
            <Row gutter={8}>
                <Col span={24}>
                    Номера описей {this.props.invNumber}
                </Col>
            </Row>
            <Row>
                <Col col={24}>
                    Проверка проводилась с <span style={{textDecoration:"underline"}}> {this.props.startDate} </span> по <span style={{textDecoration:"underline"}}> {this.props.endDate} </span>
                    <p>Проверкой установлено:</p>
                </Col>
            </Row>
            <Row gutter={8}><strong>
                <Col span={6}>1. Числится по описям</Col>
                <Col span={8}><p style={{borderBottom: '1px solid black',textAlign: 'center'}}>{this.props.invCount}</p> <p style={{textAlign: 'center'}}><small>(количество)</small></p> </Col>
                <Col span={5}>единиц хранения<br/> </Col>
            </strong>
            </Row>

            <Row gutter={8}><strong>
                <Col span={6}>2. Не оказалось в наличии</Col>
                <Col span={8}><p style={{borderBottom: '1px solid black',textAlign: 'center'}}>{this.props.cntCaseNotA}</p> <p style={{textAlign: 'center'}}><small>(количество)</small></p> </Col>
                <Col span={4}>единиц хранения<br/> </Col>
            </strong>
            </Row>

            <Row gutter={8}><strong>
                <Col span={9}>3. Имеется в наличии по данному фонду (включенных в описи)</Col>
                <Col span={5}><p style={{borderBottom: '1px solid black',textAlign: 'center'}}>{this.props.invCount - this.props.cntCaseNotA}</p><p style={{textAlign: 'center'}}></p> </Col>
                <Col span={2}>единиц хранения<br/> </Col>
                <Col span={24}>из них требующих:<br/> </Col>
            </strong>
            </Row>

            <Row gutter={8}><strong>
                <Col span={4}>1) дезинфекции</Col>
                <Col span={10}><p style={{borderBottom: '1px solid black',textAlign: 'center'}}>{!!this.props.disinfection ? this.props.disinfection:'0'}</p><p style={{textAlign: 'center'}}><small>(количество)</small></p> </Col>
                <Col span={4}>единиц хранения<br/> </Col>
            </strong>
            </Row>

            <Row gutter={8}><strong>
                <Col span={4}>2) дезинсекции</Col>
                <Col span={10}><p style={{borderBottom: '1px solid black',textAlign: 'center'}}>{!!this.props.disinfestation ? this.props.disinfestation:'0'}</p><p style={{textAlign: 'center'}}><small>(количество)</small></p> </Col>
                <Col span={4}>единиц хранения<br/> </Col>
            </strong>
            </Row>

            <Row gutter={8}><strong>
                <Col span={4}>3) реставрации</Col>
                <Col span={10}><p style={{borderBottom: '1px solid black',textAlign: 'center'}}>{!!this.props.restoration ? this.props.restoration:'0'}</p><p style={{textAlign: 'center'}}><small>(количество)</small></p> </Col>
                <Col span={4}>единиц хранения<br/> </Col>
            </strong>
            </Row>

            <Row gutter={8}><strong>
                <Col span={6}>4) переплета или подшивки</Col>
                <Col span={8}><p style={{borderBottom: '1px solid black',textAlign: 'center'}}>{!!this.props.binding ? this.props.binding:'0'}</p><p style={{textAlign: 'center'}}><small>(количество)</small></p> </Col>
                <Col span={4}>единиц хранения<br/> </Col>
            </strong>
            </Row>

            <Row gutter={8}><strong>
                <Col span={9}>5) восстановление затухающих
                    текстов</Col>
                <Col span={5}><p style={{borderBottom: '1px solid black',textAlign: 'center'}}>{!!this.props.restorationOfFadingTexts  ? this.props.restorationOfFadingTexts:'0'}</p><p style={{textAlign: 'center'}}><small>(количество)</small></p> </Col>
                <Col span={4}>единиц хранения<br/> </Col>
            </strong>
            </Row>

            <Row gutter={8}><strong>
                <Col span={8}>6) неисправимо поврежденных</Col>
                <Col span={6}><p style={{borderBottom: '1px solid black',textAlign: 'center'}}>{!!this.props.irreparablyDamaged  ? this.props.irreparablyDamaged:'0'}</p><p style={{textAlign: 'center'}}><small>(количество)</small></p> </Col>
                <Col span={4}>единиц хранения<br/> </Col>
            </strong>
            </Row>

            <Row gutter={8}><strong>
                <Col span={16}>7) _______________________________________________________________</Col>
            </strong>
            </Row>
            <Row gutter={8}><strong>
                <Col span={16}>8) _______________________________________________________________</Col>
            </strong>
            </Row>
            <Row gutter={8}><strong>
                <Col span={16}>9) _______________________________________________________________</Col>
            </strong>
            </Row>
            <Row gutter={8}><strong>
                <Col span={16}>10) _______________________________________________________________</Col>
            </strong>
            </Row>
            <Row gutter={8}><strong>
                <Col span={16}>11) _______________________________________________________________</Col>
            </strong>
            </Row>

            <Row gutter={8}><strong>
                <Col span={9}>4. Имеется не включенных в описи:</Col>
                <Col span={8}><p style={{borderBottom: '1px solid black',textAlign: 'center'}}>{this.props.cntAdded }</p><p style={{textAlign: 'center'}}><small>(количество)</small></p> </Col>
                <Col span={4}>единиц хранения<br/> </Col>
            </strong>
            </Row>

            <Row>
                <Col col={24}>
                    <strong>5. Итого по данному фонду (включенных и невключенных в описи)
                        имеющихся в
                        наличии: <span
                            style={{textDecoration:"underline"}}> {this.props.caseInInv}</span> единиц хранения    </strong>
                </Col>
            </Row>

            <Row gutter={8}><strong>
                <Col span={24}>6. Характеристика условий их хранения.<br/>Отрицательные явления в состоянии и условиях хранения</Col>
                <Col col={24}>
                    ____________________________________________________________<br/>
                    ____________________________________________________________<br/>
                </Col>
            </strong>
            </Row><br/><br/><br/><br/><br/>
            <p style={{}}>Проверку производили:</p>
            <Row><br/>
                <Col span={15}>
                    <p style={{borderBottom: '1px solid black'}}></p><p style={{textAlign: 'center'}}><small>(наименование должности, фамилия, инициалы, подпись лица проводившего проверку)</small></p>
                </Col>
            </Row>
            <p>Согласовано:</p>
            <Row><br/>
                <Col span={15}>
                    <p style={{borderBottom: '1px solid black'}}></p><p style={{textAlign: 'center'}}><small>(наименование должности, фамилия, инициалы, подпись заведующего отдела (архивохранилищем) )</small></p>
                </Col>
            </Row>

            <Row>
                <Col col={24}>Дата: {this.props.initialValues.workActualEndDate.value}</Col>
            </Row>
        </div>)
    }
};

class PrintContentKaz extends React.Component{
    render(){
        return(<div style={{padding: '40px 40px 40px 70px'}}>
            <Row>
                <Col style={{width: "47%", float: "left"}}> <span
                >{this.props.fundArchive} </span>
                </Col>
                <Col style={{width: "43%", float: "right"}}>Бекітемін<br/><br/>
                    <p style={{borderBottom: '1px solid black',textAlign: 'center'}}></p><p style={{textAlign: 'center'}}><small>(архив басшысы лауазымының атауы,
                        тегі, аты-жөні )</small></p><br/>
                    <p style={{borderBottom: '1px solid black',textAlign: 'center'}}></p><p style={{textAlign: 'center'}}><small>(ұйым басшысының қолтаңбасы)</small></p><br/>
                    <p style={{borderBottom: '1px solid black',textAlign: 'center'}}></p><p style={{textAlign: 'center'}}><small>(күні )</small></p>
                </Col>
            </Row><br/><br/>
            <h1 style={{textAlign: "center"}}>Архивтік құжаттардың бар-жоғын және жай-күйін тексеру актісі </h1>
            <Row style={{textAlign: "center"}}>__________ № __________</Row>
            <Row style={{textAlign: "right"}}><Col style={{width: "45%", float: "left"}}>(күні)</Col></Row><br/>

            <Row gutter={8}>
                <Col span={22}> № {this.props.fundNumber} архив қоры</Col>
            </Row>
            <Row>
                <Col col={24}>
                    Архив қорының атауы
                    <span  style={{}}> {this.props.initialValues.workRegFund.label}</span>
                </Col>
            </Row>
            <Row gutter={8}>
                <Col span={24}>
                    Тізімдемелердің нөмірлері  {this.props.invNumber}
                </Col>
            </Row>
            <Row>
                <Col col={24}>
                    Тексеру   <span style={{textDecoration:"underline"}}> {this.props.startDate} </span> - <span style={{textDecoration:"underline"}}> {this.props.endDate} аралығында жүргізілді.</span>
                    <p>Тексеру барысында мыналар анықталды:</p>
                </Col>
            </Row>
            <Row gutter={8}><strong>
                <Col span={6}>1. Тізімдеме бойынша </Col>
                <Col span={8}><p style={{borderBottom: '1px solid black',textAlign: 'center'}}>{this.props.invCount}</p> <p style={{textAlign: 'center'}}><small>(саны)</small></p> </Col>
                <Col span={5}>сақтау бірлігі бар.<br/> </Col>
            </strong>
            </Row>

            <Row gutter={8}><strong>
                <Col span={6}>2. Бар болмағаны </Col>
                <Col span={8}><p style={{borderBottom: '1px solid black',textAlign: 'center'}}>{this.props.cntCaseNotA}</p> <p style={{textAlign: 'center'}}><small>(саны)</small></p> </Col>
                <Col span={4}>сақтау бірлігі<br/> </Col>
            </strong>
            </Row>

            <Row gutter={8}><strong>
                <Col span={9}>3. Осы архивтік қор бойынша бар:
                    (тізімдемеге енгізілген)
                </Col>
                <Col span={5}><p style={{borderBottom: '1px solid black',textAlign: 'center'}}>{this.props.invCount - this.props.cntCaseNotA}</p><p style={{textAlign: 'center'}}></p> </Col>
                <Col span={2}>сақтау бірлігі<br/> </Col>
                <Col span={24}>оның ішінде мыналарды талап ететіндер:<br/> </Col>
            </strong>
            </Row>

            <Row gutter={8}><strong>
                <Col span={4}>1) дезинфекцияны </Col>
                <Col span={10}><p style={{borderBottom: '1px solid black',textAlign: 'center'}}>{!!this.props.disinfection ? this.props.disinfection:'0'}</p><p style={{textAlign: 'center'}}><small>(саны)</small></p> </Col>
                <Col span={4}>сақтау бірлігі<br/> </Col>
            </strong>
            </Row>

            <Row gutter={8}><strong>
                <Col span={4}>2) дезинсекцияны</Col>
                <Col span={10}><p style={{borderBottom: '1px solid black',textAlign: 'center'}}>{!!this.props.disinfestation ? this.props.disinfestation:'0'}</p><p style={{textAlign: 'center'}}><small>(саны)</small></p> </Col>
                <Col span={4}>сақтау бірлігі<br/> </Col>
            </strong>
            </Row>

            <Row gutter={8}><strong>
                <Col span={4}>3) реставрациялауды </Col>
                <Col span={10}><p style={{borderBottom: '1px solid black',textAlign: 'center'}}>{!!this.props.restoration ? this.props.restoration:'0'}</p><p style={{textAlign: 'center'}}><small>(саны)</small></p> </Col>
                <Col span={4}>сақтау бірлігі<br/> </Col>
            </strong>
            </Row>

            <Row gutter={8}><strong>
                <Col span={6}>4) түптеу немесе тігуді </Col>
                <Col span={8}><p style={{borderBottom: '1px solid black',textAlign: 'center'}}>{!!this.props.binding ? this.props.binding:'0'}</p><p style={{textAlign: 'center'}}><small>(саны)</small></p> </Col>
                <Col span={4}>сақтау бірлігі<br/> </Col>
            </strong>
            </Row>

            <Row gutter={8}><strong>
                <Col span={9}>5) өше бастаған мәтіндерді қалпына келтіруді </Col>
                <Col span={5}><p style={{borderBottom: '1px solid black',textAlign: 'center'}}>{!!this.props.restorationOfFadingTexts  ? this.props.restorationOfFadingTexts:'0'}</p><p style={{textAlign: 'center'}}><small>(саны)</small></p> </Col>
                <Col span={4}>сақтау бірлігі<br/> </Col>
            </strong>
            </Row>

            <Row gutter={8}><strong>
                <Col span={8}>6) түзетуге келмейтін зақымданған </Col>
                <Col span={6}><p style={{borderBottom: '1px solid black',textAlign: 'center'}}>{!!this.props.irreparablyDamaged  ? this.props.irreparablyDamaged:'0'}</p><p style={{textAlign: 'center'}}><small>(саны)</small></p> </Col>
                <Col span={4}>сақтау бірлігі<br/> </Col>
            </strong>
            </Row>

            <Row gutter={8}><strong>
                <Col span={16}>7) _______________________________________________________________</Col>
            </strong>
            </Row><br/>
            <Row gutter={8}><strong>
                <Col span={16}>8) _______________________________________________________________</Col>
            </strong>
            </Row>
            <Row gutter={8}><strong>
                <Col span={16}>9) _______________________________________________________________</Col>
            </strong>
            </Row>
            <Row gutter={8}><strong>
                <Col span={16}>10) _______________________________________________________________</Col>
            </strong>
            </Row>
            <Row gutter={8}><strong>
                <Col span={16}>11) _______________________________________________________________</Col>
            </strong>
            </Row>

            <Row gutter={8}><strong>
                <Col span={9}>4. Тізімдемеге енгізілмегендері:</Col>
                <Col span={8}><p style={{borderBottom: '1px solid black',textAlign: 'center'}}>{this.props.cntAdded }</p><p style={{textAlign: 'center'}}><small>(саны)</small></p> </Col>
                <Col span={4}>сақтау бірлігі<br/> </Col>
            </strong>
            </Row>

            <Row>
                <Col col={24}>
                    <strong>5. Осы архивтік қор бойынша (тізімдемеге енген және енбеген),
                        қолда бары:
                        <span
                            style={{textDecoration:"underline"}}> {this.props.caseInInv}</span> сақтау бірлігі    </strong>
                </Col>
            </Row>

            <Row gutter={8}><strong>
                <Col span={24}>6. Оларды сақтау шартының сипаттамасы.<br/>
                    Сақтау жағдайы мен шартындағы теріс құбылыстар.
                </Col>
                <Col col={24}>
                    ____________________________________________________________<br/>
                    ____________________________________________________________<br/>
                </Col>
            </strong>
            </Row><br/><br/><br/><br/><br/>
            <p style={{}}>Тексеруді жүргізген:</p>
            <Row><br/>
                <Col span={15}>
                    <p style={{borderBottom: '1px solid black'}}></p><p style={{textAlign: 'center'}}><small>(тексеруді жүргізген тұлға лауазымының атауы, тегі, аты-жөні, қолтаңбасы)</small></p>
                </Col>
            </Row>
            <p>Келісілді:</p>
            <Row><br/>
                <Col span={15}>
                    <p style={{borderBottom: '1px solid black'}}></p><p style={{textAlign: 'center'}}><small>(бөлім (архив қоймасы) меңгерушісі лауазымының атауы, тегі, аты-жөні, қолтаңбасы )</small></p>
                </Col>
            </Row>

            <Row>
                <Col col={24}>Kүні: {this.props.initialValues.workActualEndDate.value}</Col>
            </Row>
        </div>)
    }
};


export default DamageAct;