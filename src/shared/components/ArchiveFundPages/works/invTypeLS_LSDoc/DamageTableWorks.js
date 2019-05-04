import React from 'react';
import {Table, Input, Popconfirm, Button, message, Icon, Badge, Col, Row} from 'antd';
import {Select} from 'antd';
import moment from "moment"
import {
    createObj,
    getCube, getObjListNew, getPropVal,
    propValList, updateCubeData2
} from "../../../../actions/actions";
import axios from 'axios';
import {connect} from 'react-redux';
import {parseCube_new, parseForTable} from "../../../../utils/cubeParser";
const Option = Select.Option;
const EditableCell = ({editable, value, onChange}) => (
<div style={{flex: 1}}>
    {editable
    ? <Input value={value} onChange={e => onChange(e.target.value)}/>
    : value
    }
</div>
);

class DamageTableWorks extends React.Component {
    state = {
        data: [],
        dataObj: [],
        damageList: [],
        tableData: '',
        deliveryPurposeList: [],
        newDescDmg: '',
        newIndexDmg: '',
        newdeliveryPurpose: '',
        loading:false

    };


    handleChangeDamageList = value => {
        console.log(value);
        this.setState({newIndexDmg: value});
    };

    handleChangeDeliveryPurpose = (value) => {
        console.log(value);
        this.setState({newdeliveryPurpose: value});
    };

    damageDesriptionChange = e => {
        console.log(e.target.value);
        this.setState({newDescDmg: e.target.value});
    };


    onRowClick = record => {
        this.setState({selectedRow: record})
    };

    renderTableData = item => {
        const constArr = ['workDate', 'descriptionDamage', 'indexDamage', 'workActualEndDate', 'deliveryPurpose', 'workRegCase'];
        const result = {
            key: item.id
        };
        parseForTable(item.props, this.props.tofiConstants, result, constArr);
        return result;
    };

    onCreateObj = async () => {
        this.setState({
            loading:true
        });
        const cube = {
            cubeSConst: 'cubeForWorks'
        };

        var name = {ru: this.state.newdeliveryPurpose.label};
        const obj = {
            name: name,
            fullName: name,
            clsConst: 'casesForTemporaryUse',
        };

        let hideCreateObj;
        try {
            hideCreateObj = message.loading('Создание объекта', 30);
            hideCreateObj();

            createObj(cube, obj).then(resNewWork => {
                debugger;
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
                                propConst: 'workDate',
                                val: moment().format('YYYY-MM-DD'),
                                typeProp: '312',
                                periodDepend: "0",
                                isUniq: '1',
                                mode: 'ins'
                            },
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
                                propConst: 'indexDamage',
                                val: this.state.newIndexDmg.join(','),
                                typeProp: '41',
                                periodDepend: "0",
                                isUniq: '2',
                                mode: 'ins'
                            },
                            {
                                propConst: 'workRegCase',
                                val: String(this.props.initialValues.key),
                                typeProp: '41',
                                periodDepend: "0",
                                isUniq: '1',
                                mode: 'ins'
                            }, {
                                propConst: 'deliveryPurpose',
                                val: String(this.state.newdeliveryPurpose.key),
                                typeProp: '11',
                                periodDepend: "0",
                                isUniq: '1',
                                mode: 'ins'
                            },
                            {
                                propConst: 'workStatusDelivery',
                                val: String(this.props.tofiConstants.needFor.id),
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

                    return updateCubeData2('cubeForWorks', '', JSON.stringify(datas)).then(res => res.success == true && this.buildComponent());
                }
            })
        }
        catch(e) {
            this.setState({
                loading:false
            });
            typeof hideCreateObj === 'function' && hideCreateObj();
            console.warn(e);
        }
    };


    buildComponent = () => {
        this.setState({
            loading:false,
            newDescDmg: '',
            newIndexDmg: '',
            newdeliveryPurpose: ''
        });
        console.log(this.props.initialValues);
        var filterWorks = {
            filterDOAnd: [
                {
                    dimConst: 'doForWorks',
                    concatType: "and",
                    conds: [
                        {
                            clss: "casesForTemporaryUse",
                        },
                        {
                            data: {
                                dimPropConst: "dpForWorks",
                                propConst: "workRegCase",
                                valueRef: {id: String('123_' + this.props.initialValues.key)},
                                condType: "="
                            }
                        },
                    ]
                }
            ],
            filterDPAnd: [
                {
                    dimConst: 'dpForWorks',
                    concatType: "and",
                    conds: [
                        {
                            consts: "workDate,descriptionDamage,indexDamage,workActualEndDate,deliveryPurpose,workRegCase"
                        }
                    ]
                }
            ],
        };

        const fd = new FormData();
        fd.append("cubeSConst", 'cubeForWorks');
        fd.append("filters", JSON.stringify(filterWorks));
        axios.post(`/${localStorage.getItem('i18nextLng')}/cube/getCubeData`, fd).then(res => {
            var cubeData = res.data.data;
            console.log(cubeData);
            const parsedCube = parseCube_new(
            cubeData["cube"],
            [],
            "dp",
            "do",
            cubeData['do_' + this.props.tofiConstants.doForWorks.id],
            cubeData['dp_' + this.props.tofiConstants.dpForWorks.id],
            ['do_' + this.props.tofiConstants.doForWorks.id],
            ['dp_' + this.props.tofiConstants.dpForWorks.id]
            );

            var worksWithTarget = parsedCube.filter(el => {
                var deliveryPurpose = el.props.find(prop => prop.prop == this.props.tofiConstants.deliveryPurpose.id);
                if (!!deliveryPurpose.values) {
                    return el;
                }
            });
            var tableData = worksWithTarget.map(this.renderTableData);
            this.setState({
                tableData: tableData
            })
        });


        propValList('indexDamage').then(res => {
            let damageList = res['data'].map(el => {
                return {
                    value: el.objId,
                    label: el.name
                };
            });
            let selectDataDamage = [];
            damageList.forEach(el => {
                selectDataDamage.push(<Option
                key={el.value}>{el.label[this.lng]}</Option>);
            })
            this.setState({
                damageList: selectDataDamage
            })
        });


        var delivTargetList =
        [
            {
                value: this.props.tofiConstants.restoration.id,
                label: this.props.tofiConstants.restoration.name
            },
            {
                value: this.props.tofiConstants.disinfection.id,
                label: this.props.tofiConstants.disinfection.name
            },
            {
                value: this.props.tofiConstants.disinfestation.id,
                label: this.props.tofiConstants.disinfestation.name
            },
            {
                value: this.props.tofiConstants.binding.id,
                label: this.props.tofiConstants.binding.name
            },
            {
                value: this.props.tofiConstants.restorationOfFadingTexts.id,
                label: this.props.tofiConstants.restorationOfFadingTexts.name
            },
        ].map(el => {
            return (<Option
            key={el.value}>{el.label[this.lng]}</Option>);
        });
        this.setState({deliveryPurposeList: delivTargetList});


        /*        try {
         const arrObj = []
         for (let i = 1; i <= 15; i++) {
         arrObj.push(`damage${i}`)
         }
         const arrIdTofi = []
         arrObj.map((el) => {

         arrIdTofi.push(this.props.tofiConstants[el].id)
         });
         const fd = new FormData();
         fd.append('ids', arrIdTofi.join(','));
         const res = getObjListNew(fd);
         if (!res.success) {
         res.forEach(err => {
         message.error(err.text);
         });
         return;
         }
         this.setState({
         dataObj: res.data
         })
         } catch(e) {
         console.log(e)
         }*/
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
                console.log(this.state.data)
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

    render() {
        this.lng = localStorage.getItem('i18nextLng');
        const rowColum = () => {
            return [
                {
                    key: "id",
                    title: "№",
                    dataIndex: 'id',
                    width: '5%',
                },
                {
                    key: 'deliveryPurpose',
                    title: this.props.tofiConstants['deliveryPurpose'].name[this.lng],
                    dataIndex: 'deliveryPurpose',
                    width: '15%',
                    render: obj => obj && obj.label
                },
                {
                    key: 'workDate',
                    title: this.props.tofiConstants['workDate'].name[this.lng],
                    dataIndex: 'workDate',
                    width: '15%',
                    render: obj => obj && obj.value
                },
                {
                    key: 'indexDamage',
                    title: this.props.tofiConstants['indexDamage'].name[this.lng],
                    dataIndex: 'indexDamage',
                    render: (obj, record) => obj.map(el => el.label).join(', '),
                    width: '35%',

                },

                {
                    key: 'descriptionDamage',
                    title: this.props.tofiConstants['descriptionDamage'].name[this.lng],
                    dataIndex: 'descriptionDamage',
                    width: '15%',
                    render: obj => obj && obj.valueLng && obj.valueLng[this.lng]
                },
                {
                    key: 'workActualEndDate',
                    title: this.props.tofiConstants['workActualEndDate'].name[this.lng],
                    dataIndex: 'workActualEndDate',
                    width: '15%',
                    render: obj => obj && obj.value
                }
            ]
        };

        return (
        <div>
            <div>
                <h3>{this.props.header}
                </h3>
                <hr/>
                <Table
                bordered
                columns={rowColum()}
                dataSource={this.state.tableData}
                size='small'
                pagination={false}
                scroll={{y: '100%'}}
                onRowClick={this.onRowClick}
                rowClassName={record => this.state.selectedRow && this.state.selectedRow.key === record.key ? 'row-selected' : ''}
                style={{marginLeft: '5px'}}
                />
                <div>
                    <p>Создать работу по восстановлению</p>
                    <Row>
                        <Col span={7}>
                            <Select
                            labelInValue
                            style={{width: '100%'}}
                            onChange={this.handleChangeDeliveryPurpose}
                            placeholder="Выберите цель"
                            >
                                {this.state.deliveryPurposeList}
                            </Select>
                        </Col>
                        <Col span={10}>
                            <Select
                            mode="multiple"
                            style={{width: '100%'}}
                            onChange={this.handleChangeDamageList}
                            placeholder="Выберите тип повреждения"
                            >
                                {this.state.damageList}
                            </Select>
                        </Col>
                        <Col span={5}>
                            <Input onChange={this.damageDesriptionChange}
                                   placeholder="Описание повреждения"/>
                        </Col>
                        <Col span={2}>
                            <Button
                            disabled={this.state.newdeliveryPurpose=='' || this.state.newIndexDmg==''}
                            loading={this.state.loading}
                            onClick={this.onCreateObj}
                            type="primary">
                                <Icon type="plus-circle"></Icon>
                            </Button>
                        </Col>
                    </Row>

                </div>
            </div>
        </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        state: state
    }
}

export default connect(mapStateToProps, {getPropVal})(DamageTableWorks);

