import React from "react"
import axios from "axios";
import {Button, Spin, Checkbox, message, Row, Col, Input, Icon, Popconfirm} from "antd";
import {parseCube_new, parseForTableComplex} from "../../../../utils/cubeParser";
import AntTable from "../../../AntTable";
import {updateCubeData2} from "../../../../actions/actions";
import moment from "moment";
import * as uuid from "uuid";
class Remarks extends React.Component {
state={
    editable: {},
    iconLoading: true,
    loading:true,
    tableData:[],
    oldTableData:{}
};


    buildComponent = () => {
        this.setState({
            iconLoading: false,
            loading: true
        });
        const filters = {
            filterDPAnd: [
                {
                    dimConst: 'dimPropNomen',
                    concatType: "and",
                    conds: [
                        {
                            consts: "nomenNotesDate,nomenNote,nomenNoteWorkDate,fulfilled,nomenComment,removed,nomenNotesComplex"
                        }
                    ]
                }
            ],
            filterDOAnd: [
                {
                    dimConst: 'dimObjNomen',
                    concatType: "and",
                    conds: [
                        {
                            ids: String(this.props.nomenKeyForRemark)
                        }
                    ]
                }
            ]
        };

        const fd = new FormData();
        fd.append("cubeSConst", 'cubeSNomen');
        fd.append("filters", JSON.stringify(filters));
        var arrConst = ['nomenNotesDate','nomenNote','nomenNoteWorkDate','fulfilled','nomenComment','removed','nomenNotesComplex'];
        var tofiConstants = this.props.tofiConstants;
        var dateIncludeOfIk = this.props.dateIncludeOfIk;
        axios.post(`/${localStorage.getItem('i18nextLng')}/cube/getCubeData`, fd).then(res => {
            var cubeData = res.data.data;
            var result = parseForTableComplex(cubeData, 'dimObjNomen', 'dimPropNomen', '', tofiConstants, arrConst, dateIncludeOfIk);
            this.setState({
                tableData:result,
                oldTableData:result,
                loading:false
            })
        });
    };


    componentDidMount() {
        this.buildComponent();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.nomenKeyForRemark !== this.props.nomenKeyForRemark) {
            this.buildComponent();
        }
    }

    renderTableData = (item, idx) => {

    };

    onChangeCheckbox = (e, obj, c, dataDPV)=>{
        const hide = message.loading('Сохранение...', 0);
        let value = e.target.checked ? this.props.tofiConstants['yes'].id :  this.props.tofiConstants['no'].id;

        if (c === 'removed' ){
            var datas = [{
                own: [{
                    doConst: 'dimObjNomen',
                    doItem: obj['do_'+[this.props.tofiConstants['dimObjNomen'].id]],
                    isRel: "0",
                    objData: {}
                }],
                props: [
                    {   idDataPropVal:String(obj.idDataPropVal),
                        propConst: c,
                        val: String(value),
                        typeProp: '11',
                        periodDepend: "0",
                        isUniq: '1',
                        mode: 'upd'
                    }
                ],
                periods: [{
                    periodType: '0',
                    dbeg: '1800-01-01',
                    dend: '3333-12-31'
                }]
            }];
        }

        if (c === 'fulfilled'){
            let dateValue = e.target.checked ? moment().format('YYYY-MM-DD') : '1800-01-01';
            var datas = [{
                own: [{
                    doConst: 'dimObjNomen',
                    doItem: obj['do_'+[this.props.tofiConstants['dimObjNomen'].id]],
                    isRel: "0",
                    objData: {}
                }],
                props: [
                    {   idDataPropVal:String(obj.idDataPropVal),
                        propConst: c,
                        val: String(value),
                        typeProp: '11',
                        periodDepend: "0",
                        isUniq: '1',
                        mode: 'upd'
                    },
                    {   idDataPropVal:String(dataDPV),
                        propConst: 'nomenNoteWorkDate',
                        val: dateValue,
                        typeProp: '312',
                        periodDepend: "0",
                        isUniq: '1',
                        mode: 'upd'
                    }
                ],
                periods: [{
                    periodType: '0',
                    dbeg: '1800-01-01',
                    dend: '3333-12-31'
                }]
            }];
        }


        updateCubeData2('cubeSNomen', '', JSON.stringify(datas)).then(res => {
            hide();

            if (res.success == true) {
                message.success('Сохранено', 3);
                this.buildComponent()
            }else{
                message.error('Перезайдите в систему', 5);
            }
        });

    };


    check = (e, obj, c)=>{
        let editable = {...this.state.editable};
        const hide = message.loading('Сохранение...', 0);
        let value = e.valueStr;
        var datas = [{
            own: [{
                doConst: 'dimObjNomen',
                doItem: e['do_'+[this.props.tofiConstants['dimObjNomen'].id]],
                isRel: "0",
                objData: {}
            }],
            props: [
                {   idDataPropVal:String(e.idDataPropVal),
                    propConst: c,
                    val: value,
                    typeProp: '315',
                    periodDepend: "0",
                    isUniq: '1',
                    mode: 'upd'
                }
            ],
            periods: [{
                periodType: '0',
                dbeg: '1800-01-01',
                dend: '3333-12-31'
            }]
        }];

        updateCubeData2('cubeSNomen', '', JSON.stringify(datas)).then(res => {
            hide();
            editable[obj+c] = false;
            this.setState({editable: editable});

            if (res.success == true) {
                message.success('Сохранено', 3);
                this.buildComponent()
            }else{
                message.error('Перезайдите в систему', 5);
            }
        });

    };

    onChangeRemoved   = (rec)=>{
        console.log(rec);
    };


    handleChange = (e, key, c) => {
        let tableData = [...this.state.tableData];
        let row = tableData.find(el => el.key == key);
        if (row[c] === null) {
            row[c] = {}
        }

        if (c == 'name') {
            row.name = {ru: e.target.value, kz: e.target.value, en: e.target.value};
            row.fullName = {ru: e.target.value, kz: e.target.value, en: e.target.value};
        } else {
            row[c].value = e.target.value;
            row[c].valueStr = {
                kz: e.target.value,
                ru: e.target.value,
                en: e.target.value
            };
        }
        this.setState({
            tableData: tableData
        })
    };

    edit = (obj) => {
        let editable = {...this.state.editable};
        editable[obj[0]] = true;
        this.setState({editable: editable});

    };
    addRemark = () =>{
        const hide = message.loading('Создание...', 0);
        var datas = [{
            own: [{
                doConst: 'dimObjNomen',
                doItem: this.props.nomenKeyForRemark,
                isRel: "0",
                objData: {}
            }],

            props: [{
                propConst: "nomenNotesComplex",
                val: {
                    kz: `${this.props.nomenKeyForRemark}_${uuid()}`,
                    ru: `${this.props.nomenKeyForRemark}_${uuid()}`,
                    en: `${this.props.nomenKeyForRemark}_${uuid()}`
                },
                typeProp: "71",
                periodDepend: "2",
                isUniq: "2",
                mode: "ins",
                child: [{
                    propConst: "nomenNotesDate",
                    val: moment().format('YYYY-MM-DD'),
                    typeProp: "312",
                    periodDepend: "2",
                    isUniq: "1"
                }, {
                    propConst: "nomenNote",
                    isUniq: "1",
                    val:{en:'Введите текст замечания...',ru:'Введите текст замечания...',kz:'Введите текст замечания...'},
                    typeProp: "315",
                    periodDepend: "2"
                },{
                    propConst: "nomenNoteWorkDate",
                    isUniq: "1",
                    val:'1800-01-01',
                    typeProp: "312",
                    periodDepend: "2",
                },{  propConst: "nomenComment",
                    isUniq: "1",
                    val:{en:'Нет комментария...',ru:'Нет комментария...',kz:'Нет комментария...'},
                    typeProp: "315",
                    periodDepend: "2"
                }, {
                    propConst: 'fulfilled',
                    val: String(this.props.tofiConstants['no'].id),
                    typeProp: '11',
                    periodDepend: "2",
                    isUniq: '1'
                },{
                    propConst: 'removed',
                    val: String(this.props.tofiConstants['no'].id),
                    typeProp: '11',
                    periodDepend: "2",
                    isUniq: '1'
                }

                ]
            }],
            periods: [{
                periodType: '0',
                dbeg: '1800-01-01',
                dend: '3333-12-31'
            }]
        }];
        updateCubeData2('cubeSNomen',moment().format('YYYY-MM-DD'), JSON.stringify(datas)).then(res => {
            hide();
            if (res.success == true) {
                message.success('Сохранено', 3);
                this.buildComponent()
            }else{
                message.error('Перезайдите в систему', 5);
            }
        });
    };



    deleteRow = (rec) => {
        const  showDel = message.loading('Удаление',0);
        var data = [
            {
                own: [{
                    doConst: 'dimObjNomen',
                    doItem: String(rec.doObj),
                    isRel: "0",
                    objData: {}
                }
                ],
                props: [{
                    propConst: "nomenNotesComplex",
                    idDataPropVal: rec.key,
                    val: {
                        kz: String(rec.idName),
                        ru: String(rec.idName),
                        en: String(rec.idName)
                    },
                    typeProp: "71",
                    periodDepend: "2",
                    isUniq: "2",
                    mode: "del",
                },
                ],
                periods: [{periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31'}]
            }
        ];

        updateCubeData2(
            'cubeSNomen',
            moment().format('YYYY-MM-DD'),
            JSON.stringify(data),
            {},
            {}).then(res => {
            showDel();
            if (res.success) {
                message.success('Удалено');
            } else {
                message.error('ошибка при обновлении, перезайдите в систему');
                if (res.errors) {
                    res.errors.forEach(err => {
                        message.error(err.text);
                    });
                    return {success: false}
                }
            }
            this.buildComponent()
        });
    };

    render() {
        this.lng = localStorage.getItem("i18nextLng");
        const {t, tofiConstants, initialValues, nomenKeyForRemark} = this.props;
        const {nomenNotesDate,nomenNote,nomenNoteWorkDate,fulfilled,nomenComment,removed, yes, no} = this.props.tofiConstants;
        const columns = [
            {
                key: 'nomenNotesDate',
                title:nomenNotesDate.name[this.lng],
                dataIndex:'nomenNotesDate',
                width: '10%',
                render: obj => {return obj && obj.valueDateTime}
            },
            {
                key: 'nomenNote',
                title:nomenNote.name[this.lng],
                dataIndex: 'nomenNote',
                width: '45%',
                render: (obj, rec) => {
                    return (<div className="editable-cell">
                        {
                            this.state.editable[rec.key + 'nomenNote'] ?
                                <div className="editable-cell-input-wrapper">
                                    <Row>
                                        <Col span={20}>
                                            <Input
                                                value={obj ? obj.valueStr ? obj.valueStr[this.lng] : '' : ''}
                                                onChange={(e) => this.handleChange(e, rec.key, 'nomenNote')}
                                                onPressEnter={() => this.check(obj, rec.key, 'nomenNote')}
                                            />
                                        </Col>
                                        <Col span={4}
                                             style={{textAlign: 'right', paddingTop: '6px'}}>
                                            <Icon
                                                type="check"
                                                className="editable-cell-icon-check"
                                                onClick={() => this.check(obj, rec.key, 'nomenNote', '315')}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                                :
                                <div className="editable-cell-text-wrapper">
                                    {obj ? obj.valueStr ? obj.valueStr[this.lng] : '' : ''}
                                    <Icon
                                        type="edit"
                                        className="editable-cell-icon"
                                        onClick={() => this.edit([rec.key + 'nomenNote'])}
                                    />
                                </div>
                        }
                    </div>)
                }
            },
            {
                key: 'nomenNoteWorkDate',
                title:nomenNoteWorkDate.name[this.lng],
                dataIndex:'nomenNoteWorkDate',
                width: '10%',
                render: obj =>{return obj && obj.valueDateTime && obj.valueDateTime === '1800-01-01' ? '' : obj.valueDateTime }
            },
            {
                key: 'fulfilled',
                title:fulfilled.name[this.lng],
                dataIndex: 'fulfilled',
                width: '5%',
                render: (obj,rec) =>{return <Checkbox defaultChecked={obj.idRef == yes.id} onChange={ e => this.onChangeCheckbox(e,obj,'fulfilled', rec.nomenNoteWorkDate.idDataPropVal)}></Checkbox>}
            },
            {
                key: 'nomenComment',
                title:nomenComment.name[this.lng],
                dataIndex: 'nomenComment',
                width: '15%',
                render: (obj, rec) => {
                    return (<div className="editable-cell">
                        {
                            this.state.editable[rec.key + 'nomenComment'] ?
                                <div className="editable-cell-input-wrapper">
                                    <Row>
                                        <Col span={20}>
                                            <Input
                                                value={obj ? obj.valueStr ? obj.valueStr[this.lng] : '' : ''}
                                                onChange={(e) => this.handleChange(e, rec.key, 'nomenComment')}
                                                onPressEnter={() => this.check(obj, rec.key, 'nomenComment')}
                                            />
                                        </Col>
                                        <Col span={4}
                                             style={{textAlign: 'right', paddingTop: '6px'}}>
                                            <Icon
                                                type="check"
                                                className="editable-cell-icon-check"
                                                onClick={() => this.check(obj, rec.key, 'nomenComment', '315')}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                                :
                                <div className="editable-cell-text-wrapper">
                                    {obj ? obj.valueStr ? obj.valueStr[this.lng] : '' : ''}
                                    <Icon
                                        type="edit"
                                        className="editable-cell-icon"
                                        onClick={() => this.edit([rec.key + 'nomenComment'])}
                                    />
                                </div>
                        }
                    </div>)
                }
            },
            {
                key: 'removed',
                title:removed.name[this.lng],
                dataIndex: 'removed',
                width: '5%',
                render: obj => {return <Checkbox defaultChecked={obj.idRef == yes.id} onChange={ e => this.onChangeCheckbox(e,obj,'removed')}></Checkbox>}
            },
            {
                key: 'action',
                title: '',
                dataIndex: '',
                width: '5%',
                render: (text, record) => {
                    return (
                        <div className="editable-row-operations">
                            {
                                <span>
                                    <Popconfirm title='Подвердить удаление?'
                                                onConfirm={() => this.deleteRow(record)}>
                        <a style={{
                            color: '#f14c34',
                            marginLeft: '10px',
                            fontSize: '14px'
                        }}><Icon type="delete"/></a>
                      </Popconfirm>
                    </span>
                            }
                        </div>
                    );
                },
            }
        ];
        return (this.props.nomenKeyForRemark &&
            <div>
                <br/><br/><hr/><br/>
                <div>
                    <Button className='margin0-15' type="primary" onClick={()=>this.addRemark()}>Добавить</Button>
                </div><br/>
                <AntTable
                loading={this.state.loading}
                dataSource={this.state.tableData}
                columns={columns}
                >

                </AntTable>
            </div>
            )

    }

}

export default Remarks;
