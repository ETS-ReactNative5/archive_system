import React from 'react';
import {Table, Input, Popconfirm, Button, message, Icon, Badge, Col, Row} from 'antd';
import {Select} from 'antd';
import moment from "moment"
import {
    createObj,
    getCube, getIdGetObj, getObjListNew, getPropVal, getPropValByConst,
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

class DamageReason extends React.Component {
    state = {
        data: [],
        dataObj: [],
        damageList: [],
        tableData: '',
        deliveryPurposeList: [],
        newDescDmg: null,
        newIndexDmg: [],
        newdeliveryPurpose: null,
        loading:false
    };


    handleChangeDamageList = value => {
        this.setState({newIndexDmg: value});
    };

    handleChangeDeliveryPurpose = (value) => {
        this.setState({newdeliveryPurpose: value});
    };

    damageDesriptionChange = e => {
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

        var name = {ru: 'Работа по повреждению'};
        const obj = {
            name: name,
            fullName: name,
            clsConst: 'casesForTemporaryUse',
            parent:String(this.props.stateRecord.key),
        };

        let hideCreateObj;
        try {
            hideCreateObj = message.loading('Создание объекта', 30);
            hideCreateObj();

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
                                val: String(this.state.newdeliveryPurpose),
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
        console.log(this.props.initialValues);
       console.log(this.props.stateRecord);

            this.setState({
                loading:false,
                newDescDmg: null,
                newIndexDmg: [],
                newdeliveryPurpose: null
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
        ;


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

    componentDidUpdate(prevProps){
        if(prevProps.initialValues !== this.props.initialValues){
            this.buildComponent();
        }
    }


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
        return (
        <div>
            <div>
                <h3>Причины, по которым дела не подлежат хранению:</h3>
            </div>
        </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        state: state,
        user:state.auth.user
    }
}

export default connect(mapStateToProps, {getPropVal})(DamageReason);

