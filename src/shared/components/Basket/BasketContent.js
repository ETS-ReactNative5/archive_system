import React from 'react'
import {Modal, Checkbox, message, Table, Button} from 'antd'
import Select from "../Select";
import {
    getCube,
    getObjByProp,
    getObjFromProp, getObjListNew,
    getValuesOfObjsWithProps
} from "../../actions/actions";
import * as axios from "../../utils/axios_config";

class BasketContent extends React.PureComponent {
    state = {
        propStudyLoading: false,
        propStudyOptions: [],
        maxCount: null,
        objCube:[],
        objId:[]
    };

    serMaxVal=()=>{
        let maxVal = Math.max.apply(Math, this.state.propStudyOptions.map((el)=>{
            return el.value
        }))
        let arrVal = this.state.propStudyOptions.map((el ,i)=>{
            if (el.value === maxVal)return el

        })
        return arrVal
    };

    componentDidMount() {
        const {
            basket, basketState, user, t, tofiConstants,
            tofiConstants: {archiveCipher, caseDbeg, caseDend, propStudy, doForWorks}
        } = this.props;

        var filter = {
            filterDOAnd: [
                {
                    dimConst: 'doForWorks',
                    concatType: "and",
                    conds: [
                        {
                            clss: 'conductResearch,performPaidReq,responseToRequest'
                        }
                    ],

                },
                {
                    dimConst: 'doForWorks',
                    concatType: "and",
                    conds: [{
                        data: {
                            dimPropConst: 'dpForWorks',
                            propConst: 'workAssignedTo',
                            valueRef: {id: String(user.obj)}
                        }
                    }]
                }
            ],
            filterDPAnd: [
                {
                    dimConst: 'dpForWorks',
                    concatType: "and",
                    conds: [
                        {
                            consts: 'propResearcheRequests'
                        }
                    ]
                }
            ]

        };
        axios.Cube.getCube('cubeForWorks', JSON.stringify(filter), '', '')
        .then(res => {
            this.setState({
                objCube:res.data.cube
            })
            var worksIds = (res.data['cube'].map(el => el.idRef!=undefined ? el.idRef : '')).join(',');
            worksIds=worksIds.replace(',,', ',');
            var fd = new FormData();
            fd.append('ids', worksIds);
            fd.append('propConsts', 'personLastName,nameOfOrganizationDeveloper');
            getObjListNew(fd).then(res=>{
                this.setState({
                    objId:res.data
                })
            });

        });


        const isOuterUser = ['clsResearchers', 'clsTempUsers']
        .some(c => tofiConstants[c].id == user.cls);


        this.setState({propStudyLoading: true});
        const fd = new FormData();
        if (isOuterUser) {
            fd.append("objId", user.obj);
            fd.append("propConst", 'propStudy');
            getObjFromProp(fd)
            .then(res => {
                this.setState({propStudyLoading: false});
                if (!res.success) {
                    res.errors.forEach(err => {
                        message.error(err.text);
                        return;
                    })
                }
                this.setState({
                    propStudyOptions: res.data.map(opt => ({
                        value: opt.id,
                        label: opt.name[this.lng]
                    }))
                })
            })
        } else {

            const idClassNameMap = {};
            ['conductResearch', 'performPaidReq', 'responseToRequest'].forEach(c => {
                idClassNameMap[tofiConstants[c].id] = tofiConstants[c].name[this.lng]
            });


            fd.append('clsConsts', 'conductResearch,performPaidReq,responseToRequest');
            fd.append('propConst', 'workAssignedTo');
            fd.append('value', user.obj);
            getObjByProp(fd)
            .then(res => {
                this.setState({propStudyLoading: false});
                if (!res.success) {
                    res.errors.forEach(err => {
                        message.error(err.text);
                        return;
                    })
                }
                this.setState({
                    propStudyOptions: res.data
                    .map(opt => ({
                        value: opt.id,
                        label: `${opt.id}-${idClassNameMap[opt.cls]}`
                    }))
                })
                return res.data;
            })
            .then(data => {
                if (!data.length) {
                    const fd = new FormData();
                    fd.append("objId", user.obj);
                    fd.append("propConst", 'propStudy');
                    getObjFromProp(fd)
                    .then(res => {
                        this.setState({propStudyLoading: false});
                        if (!res.success) {
                            res.errors.forEach(err => {
                                message.error(err.text);
                                return;
                            })
                        }
                        this.setState({
                            propStudyOptions: res.data
                            .map(opt => ({
                                value: opt.id,
                                label: opt.name[this.lng],
                                type: 'theme'
                            }))
                        })
                    })
                }
            })
        }
    }

    render() {
        const {
            basket, basketState, user, t, tofiConstants,
            tofiConstants: {archiveCipher, caseDbeg, caseDend, propStudy}
        } = this.props;
        this.lng = localStorage.getItem('i18nextLng');
        let okBtnText, cancelBtnText;
        switch(localStorage.getItem('i18nextLng')) {
            case 'kz':
                okBtnText = 'Тапсырыс беру';
                cancelBtnText = 'Болдырмау';
                break;
            case 'ru':
                okBtnText = 'Заказать';
                cancelBtnText = 'Отмена';
                break;
            default:
                okBtnText = 'Confirm';
                cancelBtnText = 'Cancel';
                break;
        }

        const modalFooter = [
            <Button key='confirm' type='primary'
                    onClick={this.props.onOk}>{okBtnText}</Button>,
//      <Button key='confirm' type='primary' onClick={this.props.onOk} disabled={basket.some(o => !o.propStudy)}>{okBtnText}</Button>,
            <Button key='cancel' onClick={this.props.onCancel}>{cancelBtnText}</Button>
        ];

        return <div>
            <Modal title={this.props.title}
                   visible={this.props.show}
                   okText={okBtnText}
                   cancelText={cancelBtnText}
                   onCancel={this.props.onCancel}
                   footer={modalFooter}
                   width={this.props.width}
            >
                <Table
                loading={false}
                size='small'
                pagination={false}
                style={{height: '350px'}}
                scroll={{y: '350px'}}
                columns={
                    [
                        {
                            key: 'archiveCipher',
                            title: archiveCipher.name[this.lng],
                            dataIndex: 'archiveCipher',
                            width: '15%'
                        },
                        {
                            key: 'name',
                            title: t('TITLE'),
                            dataIndex: 'name',
                            width: '25%',
                            render: obj => obj && obj[this.lng]
                        },
                        {
                            key: 'caseDbeg',
                            title: caseDbeg.name[this.lng],
                            dataIndex: 'caseDbeg',
                            width: '10%'
                        },
                        {
                            key: 'caseDend',
                            title: caseDend.name[this.lng],
                            dataIndex: 'caseDend',
                            width: '10%'
                        },
                        {
                            key: 'caseThemes',
                            title: propStudy.name[this.lng],
                            dataIndex: 'caseThemes',
                            width: '15%',
                            render: (obj, rec) => {
                                console.log()
                                return (

                                <Select
                                name='propStudy'
                                isSearchable={false}
                                defaultValue={this.serMaxVal()}
                                value={obj}
                                disabled={!basket.some(el => el.key === rec.key)}
                                onChange={s => {
                                    this.props.changeCaseInBasket({...rec, propStudy: s})
                                }}
                                isLoading={this.state.propStudyLoading}
                                options={this.state.propStudyOptions || []}
                                onMenuOpen={() => {
                                    const isOuterUser = ['clsResearchers', 'clsTempUsers']
                                    .some(c => tofiConstants[c].id == user.cls);
                                    this.setState({propStudyLoading: true});
                                    const fd = new FormData();
                                    if (isOuterUser) {
                                        fd.append("objId", user.obj);
                                        fd.append("propConst", 'propStudy');
                                        getObjFromProp(fd)
                                        .then(res => {
                                            this.setState({propStudyLoading: false});
                                            if (!res.success) {
                                                res.errors.forEach(err => {
                                                    message.error(err.text);
                                                    return;
                                                })
                                            }
                                            this.setState({
                                                propStudyOptions: res.data.map(opt => ({
                                                    value: opt.id,
                                                    label: opt.name[this.lng]
                                                }))
                                            })
                                        })
                                    } else {

                                        const idClassNameMap = {};
                                        ['conductResearch', 'performPaidReq', 'responseToRequest'].forEach(c => {
                                            idClassNameMap[tofiConstants[c].id] = tofiConstants[c].name[this.lng]
                                        });
                                        fd.append('clsConsts', 'conductResearch,performPaidReq,responseToRequest');
                                        fd.append('propConst', 'workAssignedTo');
                                        fd.append('value', user.obj);
                                        getObjByProp(fd)
                                        .then(res => {
                                            this.setState({propStudyLoading: false});
                                            if (!res.success) {
                                                res.errors.forEach(err => {
                                                    message.error(err.text);
                                                    return;
                                                })
                                            }
                                            let idRefData=[]
                                            for (let itemid of res.data){
                                                this.state.objCube.map((el)=>{
                                                   if (Number(itemid.id) === Number(el.do_1005.split("_")[1])){
                                                       idRefData.push({idWorks:itemid.id, idRef:el.idRef})
                                                   }
                                                })

                                            }

                                            this.setState({
                                                propStudyOptions: res.data
                                                .map(opt =>{
                                                    let str=""
                                                    for (let val of idRefData){
                                                        if (opt.id === val.idWorks){
                                                            if (val.idRef !== undefined){
                                                                for (let idref of this.state.objId){
                                                                    if (val.idRef === Number(idref.id)){
                                                                        str = `- ${idref.personLastName.ru}-${idref.nameOfOrganizationDeveloper.ru}`
                                                                        break
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                    return({
                                                        value: opt.id,
                                                        label: `${opt.id}-${idClassNameMap[opt.cls]}${str}`
                                                    })
                                                } )
                                            })
                                            return res.data;
                                        })
                                        .then(data => {
                                            if (!data.length) {
                                                const fd = new FormData();
                                                fd.append("objId", user.obj);
                                                fd.append("propConst", 'propStudy');
                                                getObjFromProp(fd)
                                                .then(res => {
                                                    this.setState({propStudyLoading: false});
                                                    if (!res.success) {
                                                        res.errors.forEach(err => {
                                                            message.error(err.text);
                                                            return;
                                                        })
                                                    }
                                                    this.setState({
                                                        propStudyOptions: res.data
                                                        .map(opt => ({
                                                            value: opt.id,
                                                            label: opt.name[this.lng],
                                                            type: 'theme'
                                                        }))
                                                    })
                                                })
                                            }
                                        })
                                    }
                                }}

                                />
                                )
                            }
                        },
                        {
                            key: 'chooseCases',
                            title: t('CHOOSECASES'),
                            dataIndex: 'chooseCases',
                            width: '5%',
                            render: (obj, rec) => {
                                return <Checkbox
                                onChange={() => this.props.handleListItemClick(rec)}
                                checked={basket.some(el => el.key === rec.key)}/>
                            }
                        }
                    ]
                }
                dataSource={basketState || []}
                />
            </Modal>
        </div>
    }
}

export default BasketContent;