import React from 'react';
import {Table, Input, Popconfirm, Button, message, Icon, Badge, Col, Row} from 'antd';
import {Select} from 'antd';
import moment from "moment"
import {
    createObj,
    getCube, getObjListNew, getPropVal, getPropValByConst,
    propValList, updateCubeData2
} from "../../../../actions/actions";
import axios from 'axios';
import {connect} from 'react-redux';
import {parseCube_new, parseForTable} from "../../../../utils/cubeParser";
import {CUBE_FOR_AF_CASE, DP_FOR_CASE} from "../../../../constants/tofiConstants";
const Option = Select.Option;
const EditableCell = ({editable, value, onChange}) => (
<div style={{flex: 1}}>
    {editable
    ? <Input value={value} onChange={e => onChange(e.target.value)}/>
    : value
    }
</div>
);
class IrrDamageTable extends React.Component {
    state = {
        cubeReason:'',
        data: [],
        dataObj: [],
        irrDamageList: [],
        tableData: '',
        selectReason: [],
        deliveryPurposeList: [],
        newDescDmg: null,
        newIrrDmg: [],
        newSelectReason: [],
        loading: false,
        addVisible: false,
        idDpvReason: '',
        idDpvNoStorageCase:''
    };

    handleChangeirrDamageList = value => {
        this.setState({newIrrDmg: value});
    };

    handleChangeReason = e => {
        this.setState({newSelectReason: e.target.value});
    };

    handleChangeDeliveryPurpose = (value) => {
        this.setState({newdeliveryPurpose: value});
    };

    damageDesriptionChange = e => {
        this.setState({newDescDmg: e.target.value});
    };


    renderTableData = (item,idx) => {
        const constArr = ['fundNumber', 'descriptionDamage', 'irreparableDamage', 'noStorageReasonCase'];
        const result = {
            key: item.id,
            idx: idx +1
        };
        parseForTable(item.props, this.props.tofiConstants, result, constArr);
        return result;
    };
    /*Создаем работу и записываем ей пропы*/
    onCreateObj = async () => {
        this.setState({
            loading: true
        });
        const cube = {
            cubeSConst: 'cubeForWorks'
        };
        var name = {ru: 'Экспертиза ценности дел'};
        const obj = {
            name: name,
            fullName: name,
            clsConst: 'caseExamination',
            parent: String((this.props.stateRecord.key) ),
        };
        let hideCreateObj;
        try {



            hideCreateObj = message.loading('Создание объекта', 30);
            hideCreateObj();


            if(this.props.stateRecord.workType.workTypeClass !== 'caseExamination'){
            createObj(cube, obj).then(resNewWork => {
                if (!resNewWork.success) {
                    resNewWork.errors.forEach(err => {
                        message.error(err.text)
                    });
                } else if (resNewWork.success == true) {
                    let hideCreateObj2 = message.loading('Cохранение свойств', 30);
                    hideCreateObj2();
                    const datas = [{
                        own: [{
                            doConst: 'doForWorks',
                            doItem: resNewWork.data.idItemDO,
                            isRel: "0",
                            objData: {}
                        }],
                        props: [
                            {
                                propConst: 'workAuthor',
                                val: String(this.props.user.obj),
                                typeProp: '41',
                                periodDepend: "0",
                                isUniq: '1',
                                mode: 'ins'
                            },
                            {
                                propConst: 'workRegFund',
                                val: String(this.props.stateRecord.workRegFund.value),
                                typeProp: '41',
                                periodDepend: "0",
                                isUniq: '1',
                                mode: 'ins'
                            },
                            {
                                propConst: 'workRegInv',
                                val: String(this.props.stateRecord.workRegInv.value),
                                typeProp: '41',
                                periodDepend: "0",
                                isUniq: '1',
                                mode: 'ins'
                            },
                            {
                                propConst: 'workDate',
                                val: moment().format('YYYY-MM-DD'),
                                typeProp: '312',
                                periodDepend: "0",
                                isUniq: '1',
                                mode: 'ins'
                            }/*,
                             {
                             propConst: 'workStatusAdmissionAndExpertise ',
                             val: String(this.props.tofiConstants.appointmentProcess.id),
                             typeProp: '11',
                             periodDepend: "0",
                             isUniq: '1',
                             mode: 'ins'
                             }*/
                        ],
                        periods: [{
                            periodType: '0',
                            dbeg: '1800-01-01',
                            dend: '3333-12-31'
                        }]
                    }];
                    updateCubeData2('cubeForWorks', '', JSON.stringify(datas)).then(res => {
                        if (res.success == true) {
                                 console.log('success');
                        }
                    });

                }
            });
            }
            /*Обновляем пропы дела*/
            let hideCreateObj3 = message.loading('Cохранение свойств', 30);
            hideCreateObj3();
            const datasCase = [{
                own: [{
                    doConst: 'doForCase',
                    doItem: String(this.props.idDimObjCase),
                    isRel: "0",
                    objData: {}
                }],
                props: [
                    {
                        propConst: 'descriptionDamage',
                        val: {
                            ru: this.state.newDescDmg,
                            kz: this.state.newDescDmg,
                            en: this.state.newDescDmg
                        },
                        typeProp: '315',
                        periodDepend: "0",
                        isUniq: '1',
                        mode: 'ins'
                    },
                    {
                        propConst: 'irreparableDamage',
                        val: this.state.newIrrDmg.join(','),
                        typeProp: '41',
                        periodDepend: "0",
                        isUniq: '2',
                        mode: 'ins'
                    },
                    {
                        propConst: 'irreparablyDamaged',
                        val: String(this.props.tofiConstants.irreparablyDamagedTrue.id),
                        typeProp: '11',
                        periodDepend: "0",
                        isUniq: '1',
                        mode: 'ins'
                    }

                ],
                periods: [{
                    periodType: '0',
                    dbeg: '1800-01-01',
                    dend: '3333-12-31'
                }]
            }];
            updateCubeData2('CubeForAF_Case', '', JSON.stringify(datasCase)).then(res => {
                if (res.success == true) {
                    this.buildComponent()
                }
            })
        }
        catch(e) {
            this.setState({
                loading: false
            });
            typeof hideCreateObj === 'function' && hideCreateObj();
            console.warn(e);
        }
    };


    buildComponent = () => {


        getPropValByConst('noStorageReasonCase').then(res => {
            var selectReason = [];
            var data = res.data;
            data.forEach(el => {
                selectReason.push({value: el.id, label: el.name.ru});
            });
            this.setState({
                selectReason: selectReason,
            })
        });


        this.setState({
            loading: false,
        });
        var filterCase = {
            filterDOAnd: [
                {
                    dimConst: 'doForCase',
                    conds: [
                        {
                            ids: String(this.props.idDimObjCase)
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
                            consts: "fundNumber,descriptionDamage,irreparableDamage,noStorageReasonCase"
                        }
                    ]
                }
            ]
        };


        const fd = new FormData();
        fd.append("cubeSConst", 'CubeForAF_Case');
        fd.append("filters", JSON.stringify(filterCase));
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


            var checkDamage = tableData[0]['irreparableDamage'];
            if (!!checkDamage && checkDamage.length > 0) {
                this.setState({
                    tableData: tableData,
                    addVisible: false
                });
            } else {
                this.setState({
                    tableData: null,
                    addVisible: true
                });
            }
            console.log(tableData[0].noStorageReasonCase);
            var cubeReason = tableData[0].noStorageReasonCase && tableData[0].noStorageReasonCase.value;
            var cubeReasonName = tableData[0].noStorageReasonCase && tableData[0].noStorageReasonCase.label;
            var idDpvReason = tableData[0].noStorageReasonCase && tableData[0].noStorageReasonCase.idDataPropVal;
            var idDpvNoStorageCase = tableData[0].noStorageCase ? tableData[0].noStorageCase.idDataPropVal : null;

            this.setState({
                currReason: cubeReasonName,
                newSelectReason: cubeReason,
                idDpvReason: idDpvReason,
                idDpvNoStorageCase: idDpvNoStorageCase
            });
        })
        .catch(err => {
            console.error(err);
            this.setState({loading: false})
        }
        );


        propValList('irreparableDamage').then(res => {
            let irrDamageList = res['data'].map(el => {
                return {
                    value: el.objId,
                    label: el.name
                };
            });
            let selectDataDamage = [];
            irrDamageList.forEach(el => {
                selectDataDamage.push(<Option
                key={el.value}>{el.label[this.lng]}</Option>);
            })
            this.setState({
                irrDamageList: selectDataDamage
            })
        });
    }


    componentDidMount() {
        this.buildComponent();
    };


    renderColumns(text, record, column, file) {
        return (
        <div className='flex'>
            <EditableCell
            editable={record.editable}
            value={text}
            onChange={value => this.handleChange(value, record.key, column)}
            />

        </div>
        );
    }


    handleChange(value, key, column) {
        const newData = [...this.state.data];
        const target = newData.find(item => key === item.key);
        if (target) {
            target[column] = value;
            this.setState({data: newData}, () => {

            });
        }
    }

    cancel = key => {
        const newData = [...this.state.data];
        if (String(key).includes('newData')) {
            this.setState({data: newData.filter(item => item.key !== key)});
            return;
        }
        const target = newData.find(item => key === item.key);
        if (target) {
            delete target.editable;
            this.setState({data: newData});
        }
    };

    edit(key) {
        const newData = [...this.state.data];
        const target = newData.find(item => key === item.key);
        if (target) {
            target.editable = true;
            this.setState({data: newData});
        }
    }

    saveReason = () => {
        var datas = [{
            own: [{
                doConst: 'doForCase',
                doItem: String(this.props.idDimObjCase),
                isRel: "0",
                objData: {}
            }],
            props: [
                {
                    propConst: 'noStorageReasonCase',
                    val: String(this.state.newSelectReason),
                    typeProp: '11',
                    periodDepend: "0",
                    isUniq: '1',
                    mode: 'ins'
                },{
                    propConst: 'noStorageCase',
                    val: String(this.props.tofiConstants.yes.id),
                    typeProp: '11',
                    periodDepend: "0",
                    isUniq: '1',
                    mode: 'ins'
                }
            ],
            periods: [{
                periodType: '0',
                dbeg: '1800-01-01',
                dend: '3333-12-31'
            }]
        }];
        if (!!this.state.idDpvReason) {
            datas = [{
                own: [{
                    doConst: 'doForCase',
                    doItem: String(this.props.idDimObjCase),
                    isRel: "0",
                    objData: {}
                }],
                props: [
                    {
                        propConst: 'noStorageReasonCase',
                        val: String(this.state.newSelectReason),
                        typeProp: '11',
                        periodDepend: "0",
                        isUniq: '1',
                        idDataPropVal: String(this.state.idDpvReason),
                        mode: 'upd'
                    },{
                        propConst: 'noStorageCase',
                        val: String(this.props.tofiConstants.yes.id),
                        typeProp: '11',
                        periodDepend: "0",
                        isUniq: '1',
                        idDataPropVal:String(this.state.idDpvNoStorageCase),
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

        updateCubeData2('CubeForAF_Case', '', JSON.stringify(datas)).then(res => {
            if (res.success == true) {
                this.buildComponent()
            }
        });

    };

    render() {

        this.lng = localStorage.getItem('i18nextLng');
        return (
        <div className="irrDamageDiv">
            <hr/>
            <h3>{this.props.header}
            </h3>
            <hr/>
            <Table columns={[
                {
                    key: 'idx',
                    title: 'П/П',
                    dataIndex: 'idx',
                    width: '5%'
                },
                {
                    key: 'fundNumber',
                    title: '№',
                    dataIndex: 'fundNumber',
                    width: '5%',
                    render: obj => obj && obj.value
                },
                {
                    key: 'irreparableDamage',
                    title: this.props.tofiConstants['irreparableDamage'].name[this.lng],
                    dataIndex: 'irreparableDamage',
                    width: '45%',
                    render: obj => obj && obj.map(el => el.label).join(', ')
                },
                {
                    key: 'descriptionDamage',
                    title: this.props.tofiConstants['descriptionDamage'].name[this.lng],
                    dataIndex: 'descriptionDamage',
                    width: '45%',
                    render: obj => obj && obj.value
                }
            ]}
                   dataSource={this.state.tableData}
                   pagination={false}>

            </Table>

            {this.state.addVisible == true ? <Row>
                <p>Указать неисправимые повреждения</p>
                <Col span={11}>
                    <Select
                    value={this.state.newIrrDmg}
                    mode="multiple"
                    style={{width: '100%'}}
                    onChange={this.handleChangeirrDamageList}
                    placeholder="Выберите тип повреждения"
                    >
                        {this.state.irrDamageList}
                    </Select>
                </Col>
                <Col span={11}>
                    <Input onChange={this.damageDesriptionChange}
                           value={this.state.newDescDmg}
                           placeholder="Описание повреждения"/>
                </Col>
                <Col span={2}>
                    <Button
                    disabled={this.state.newIrrDmg == ''}
                    loading={this.state.loading}
                    onClick={this.onCreateObj}
                    type="primary">
                        <Icon type="plus-circle"></Icon>
                    </Button>
                </Col>
            </Row> : ''
            }

            {this.props.stateRecord.workType.workTypeClass == 'caseExamination' &&
            <div>
                <br/>
                <hr/>
                <p style={{margin: '10px 0'}}>Причины по которым дела не подлежат хранению: {this.state.currReason ? this.state.currReason :'причина не указана'}</p>
                <Row>
                    <Col span={15}>
                        <select
                        style={{width: '100%', borderRadius: '5px', padding: '6px 4px'}}
                        defaultValue=''
                        value={this.state.newSelectReason}
                        onChange={this.handleChangeReason}
                        placeholder="Выберите причину">
                            {this.state.selectReason.map(el => <option
                            value={el.value}>{el.label}</option>)}
                        </select>
                    </Col>
                    <Col span={7}>
                        <Button type="primary" disabled={!this.state.newSelectReason}
                                onClick={this.saveReason}>Сохранить</Button>
                    </Col>
                </Row>
            </div>
            }

        </div>
        )
    }
}


function mapStateToProps(state) {
    return {
        state: state,
        user: state.auth.user
    }
}

export
default

connect(mapStateToProps, {getCube, getPropVal})(IrrDamageTable)
;

