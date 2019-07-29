import React from 'react';
import {Button, Input, Popconfirm, Icon, Dropdown, Menu,Modal, DatePicker, message} from 'antd';
import Select from '../../Select';
import SelectVirt from "../../SelectVirt";
import {connect} from 'react-redux';
import CSSTransition from 'react-transition-group/CSSTransition'
import moment from 'moment';

import {SYSTEM_LANG_ARRAY} from '../../../constants/constants';
import AntTable from '../../AntTable';
import SiderCard from './SiderCard';
import {isEmpty, isEqual, map} from 'lodash';
import {
    CUBE_FOR_WORKS, WORK_PRIORITY, WORK_STATUS, DO_FOR_WORKS, CHECKING_TYPE, DP_FOR_WORKS
} from '../../../constants/tofiConstants';
import {createObj, dObj, getAllObjOfCls, getCube, getPropVal, updateCubeData} from '../../../actions/actions';
import {getPropMeta, onSaveCubeData, parseCube_new} from '../../../utils/cubeParser';

/*eslint eqeqeq:0*/
class Works extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            sortState: true,
            visible: false,
            data: [],
            nameFilter:"",
            maxValue:"",
            minValue:'',
            priority: [],
            workPriorityLoading: false,
            status: [],
            workStatusSourceLoading: false,
            sourcing: null,
            form: null,
            search: {
                nameResearchers: '',
                workPlannedStartDate: {
                    dbeg:null,// moment().subtract(1, 'w'),
                    dend:null //moment().add(1, 'w')
                },
                workPlannedEndDate: {
                    dbeg: null,
                    dend: null
                },
                workActualStartDate: {
                    dbeg: null,
                    dend: null
                },
                workActualEndDate: {
                    dbeg: null,
                    dend: null
                },
                acceptanceDate: {
                    dbeg: null,
                    dend: null
                }, idItemKey: '',
                workType: '',
                workSource: '',
                workPriority: '',
                workStatusSource: '',
                workAssignedToSource: ''
            },
            openCard: false,
            selectedRow: null,
            performer: [],
            workAssignedToSourceLoading: false,
            initialValues: {},
            loading: false
        }
    }
    onWeekDate=()=>{
        this.setState({
            maxValue:moment().format("YYYY-MM-DD"),
            minValue:moment().add(-1,"W").format("YYYY-MM-DD"),
            nameFilter:"Неделя"
        },()=>this.getCubeAct())
    }
    onMonthThreeDate=()=>{
        this.setState({
            maxValue:moment().format("YYYY-MM-DD"),
            minValue:moment().add(-3,"M").startOf("month").format("YYYY-MM-DD"),
            nameFilter:"3 Месяца"
        },()=>this.getCubeAct())
    }
    onMonthOneDate=()=>{
        this.setState({
            maxValue:moment().startOf("month").format("YYYY-MM-DD"),
            minValue:moment().add(-1,"M").startOf("month").format("YYYY-MM-DD"),
            nameFilter:moment().add(-1,"M").format("MMMM")
        },()=>this.getCubeAct())
    }
    onMonthDate=()=>{
        this.setState({
            maxValue:moment().format("YYYY-MM-DD"),
            minValue:moment().startOf("month").format("YYYY-MM-DD"),
            nameFilter:moment().format("MMMM")
        },()=>this.getCubeAct())
    }
    onYearDate=()=>{
        this.setState({
            maxValue:moment().format("YYYY-MM-DD"),
            minValue:moment().add(-1,"Y").format("YYYY-MM-DD"),
            nameFilter:"Год"
        },()=>this.getCubeAct())
    }

    showModalDate = () => {
        this.setState({
            visible: true,
        });
    }
    handleOk = (e) => {
        this.setState({
            visible: false,
            nameFilter:`С ${this.state.minValue} По ${this.state.maxValue}`
        },()=>this.getCubeAct());
    }
    handleCancel = (e) => {
        this.setState({
            maxValue:moment().format("YYYY-MM-DD"),
            minValue:moment().startOf('month').format("YYYY-MM-DD"),
            visible: false,
        });
    }
    onChange = (pagination, filters, sorter) => {
        if(sorter.columnKey === "key") {
            this.setState({sortState: !this.state.sortState});
        }
    }
    onPriorityChange = s => {
        this.setState({priority: s})
    };
    onStatusChange = s => {
        this.setState({status: s})
    };
    onSourcingChange = s => {
        this.setState({sourcing: s})
    };
    onPerformerChange = s => {
        this.setState({performer: s})
    };

    changeSelectedRow = rec => {
        if (isEmpty(this.state.selectedRow) || (!isEqual(this.state.selectedRow, rec) && !this.state.openCard)) {
            this.setState({selectedRow: rec})
        } else {
            const initialValues = {
                key: rec.key,
                workListName: rec.workListNameObj,
                workType: rec.workType,
                workPlannedEndDate: rec.workPlannedEndDateObject,
                workPriority: rec.workPriority,
                workStatusSource: rec.workStatusSource,
                workSource: rec.workSource,
                checkingType: rec.checkingType,
                workAuthor: rec.workAuthor,
                workDate: rec.workDateObject,
                workAssignedTo: rec.workAssignedTo,
                workPlannedStartDate: rec.workPlannedStartDateObject,
                workActualStartDate: rec.workActualStartDateId,
                workActualEndDate: rec.workActualEndDateId,
                acceptanceDate: rec.acceptanceDateId
            };
            this.setState({initialValues, openCard: true, selectedRow: rec})
        }
    };

    openCard = () => {
        this.setState({
            openCard: true,
            initialValues: {
                workAuthor:{
                    label:this.props.user.name,
                    value:this.props.user.obj
                } ,
                workDate: moment().startOf('day'),
                workStatusSource: {
                    value: this.props.tofiConstants.appointed.id,
                    label: this.props.tofiConstants.appointed.name[this.lng]
                }
            }
        })
    };

    closeCard = () => {
        this.setState({openCard: false})
    };

    onDateChange = (name, dateType) => {
        return date => {
            this.setState({search: {...this.state.search, [name]: {...this.state.search[name], [dateType]: date}}})
        }
    };

    componentDidMount() {
        this.setState({
            maxValue:moment().format("YYYY-MM-DD"),
            minValue:moment().startOf('month').format("YYYY-MM-DD"),
            nameFilter:moment().format("MMMM")
        },()=>this.getCubeAct())
    }

    getCubeAct = () => {
        this.setState({loading: true});
        this.filters = {
            filterDOAnd: [
                {
                    dimConst: DO_FOR_WORKS,
                    concatType: "and",
                    conds: [
                        {
                            clss: "createAndEditFundmaker,createAndEditNomen,createAndEditInv,check,createAndEditDocuments,createPassport,advising"
                        },
                        {
                            data: {
                                dimPropConst: "dpForWorks",
                                propConst: "workDate",
                                values: {minValue: this.state.minValue, maxValue: this.state.maxValue}
                            }
                        },
                    ]
                }
            ]
        };
        this.props.getCube(CUBE_FOR_WORKS, JSON.stringify(this.filters))
    };

    componentDidUpdate(prevProps) {
        if (isEmpty(this.props.tofiConstants)) return;
        const {tofiConstants: {doForWorks, dpForWorks}} = this.props;
        if (prevProps.cubeForWorks !== this.props.cubeForWorks) {
            try {
                this.setState(
                    {
                        loading: false,
                        data: parseCube_new(
                            this.props.cubeForWorks['cube'],
                            [],
                            'dp',
                            'do',
                            this.props.cubeForWorks[`do_${doForWorks.id}`],
                            this.props.cubeForWorks[`dp_${dpForWorks.id}`],
                            `do_${doForWorks.id}`,
                            `dp_${dpForWorks.id}`).map(this.renderTableData)
                    }
                );
            } catch (err) {
                console.log(err);
                this.setState({loading: false, data: []})
            }
        }
    }

    stopPropagation = e => {
        e.stopPropagation();
    };

    loadOptions = c => {
        return () => {
            if (!this.props[c + 'Options']) {
                this.setState({[c + 'Loading']: true});
                this.props.getPropVal(c)
                    .then(() => this.setState({[c + 'Loading']: false}))
            }
        }
    };
    getAllObjOfCls = (cArr, dte = moment().format('YYYY-MM-DD')) => {
        return () => {
            cArr.forEach(c => {
                if (!this.props[c + 'Options']) {
                    this.setState({[c + 'Loading']: true});
                    this.props.getAllObjOfCls(c, dte)
                        .then(() => this.setState({[c + 'Loading']: false}))
                }
            });
        }
    };

    onCreateObj = async ({cube, obj}, v) => {
        let hideCreateObj;
        try {
            hideCreateObj = message.loading(this.props.t('CREATING_NEW_OBJECT'), 0);
            const res = await createObj({cubeSConst: CUBE_FOR_WORKS}, obj);
            hideCreateObj();
            if (!res.success) {
                res.errors.forEach(err => {
                    message.error(err.text)
                });
                return Promise.reject(res)
            }
            obj.doItem = res.data.idItemDO;
            return this.saveProps(
                {cube, obj},
                v,
                this.props.tofiConstants
            );
        } catch (e) {
            typeof hideCreateObj === 'function' && hideCreateObj();
            console.warn(e)
        }
    };

    saveProps = async (c, v, t = this.props.tofiConstants, objData) => {
        let hideLoading;
        try {
            if (!c.cube) c.cube = {
                cubeSConst: CUBE_FOR_WORKS,
                doConst: DO_FOR_WORKS,
                dpConst: DP_FOR_WORKS,
            };
            c.cube.data = this.props.cubeForWorks;
            hideLoading = message.loading(this.props.t('UPDATING_PROPS'), 0);
            const resSave = await onSaveCubeData(c, v, t, objData);
            hideLoading();
            if (!resSave.success) {
                message.error(this.props.t('PROPS_UPDATING_ERROR'));
                resSave.errors.forEach(err => {
                    message.error(err.text)
                });
                return Promise.reject(resSave);
            }
            message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'));
            this.setState({loading: true, openCard: false});
            await this.getCubeAct();
            return resSave;
        }
        catch (e) {
            typeof hideLoading === 'function' && hideLoading();
            this.setState({loading: false});
            console.warn(e);
        }
    };

    onInputChange = e => {
        this.setState({
            search: {
                ...this.state.search,
                [e.target.name]: e.target.value
            }
        })
    };
    emitEmpty = e => {
        this.setState({
            search: {
                ...this.state.search,
                [e.target.dataset.name]: ''
            }
        })
    };

    addSpecialDate = (key, name) => {
        const obj = {doItem: key};
        return e => {
            e.stopPropagation();
            const newData = this.state.data.slice();
            const target = newData.find(el => el.key === key);
            if (target) {
                if (name === 'workActualStartDate') {
                    this.saveProps({obj}, {
                        values: {
                            workStatusSource: {value: this.props.tofiConstants.during.id, idDataPropVal:target.workStatusSource.idDataPropVal},
                            [name]: {value:moment()}
                }
                    })
                        .then(res => {
                            if (res.success) {
                                if (target.workType.value === this.props.tofiConstants.check.id) {
                                    this.props.history.push(`/sourcing/works/checking/${target.workSource}`)
                                }
                            }
                        });
                } else if (name === 'workActualEndDate') {
                    this.saveProps({obj}, {
                        values: {
                            workStatusSource: {value: this.props.tofiConstants.completed.id, idDataPropVal:target.workStatusSource.idDataPropVal},
                            [name]: {value:moment()}
                        }
                    })
                } else if (name === 'acceptanceDate') {
                    this.saveProps({obj}, {
                        values: {
                            workStatusSource: {value: this.props.tofiConstants.accepted.id, idDataPropVal:target.workStatusSource.idDataPropVal},
                            [name]: {value:moment()}
                        }
                    })
                } else if (name === 'notAccepted') {
                    this.saveProps({obj}, {
                        values: {
                            workStatusSource: {value: this.props.tofiConstants.notAccepted.id, idDataPropVal:target.workStatusSource.idDataPropVal},
                            acceptanceDate: {value:moment()}
                        }
                    })
                }
            }
            this.setState({data: newData});
        };
    };

    renderTableData = (item, idx) => {
        const workTypeClasses = ['createAndEditFundmaker', 'createAndEditNomen', 'createAndEditInv', 'check', 'createAndEditDocuments', 'createPassport', 'advising'];
        const {
            workPlannedEndDate, workStatusSource, workAuthor, workSource,
            workPriority, workDate, workAssignedTo, workPlannedStartDate, workActualStartDate, workActualEndDate, acceptanceDate, checkingType
        } = this.props.tofiConstants;
        const workPlannedEndDateObj = item.props.find(element => element.prop == workPlannedEndDate.id),
            workStatusSourceObj = item.props.find(element => element.prop == workStatusSource.id),
            workAuthorObj = item.props.find(element => element.prop == workAuthor.id),
            workPriorityObj = item.props.find(element => element.prop == workPriority.id),
            workDateObj = item.props.find(element => element.prop == workDate.id),
            workAssignedToObj = item.props.find(element => element.prop == workAssignedTo.id),
            workPlannedStartDateObj = item.props.find(element => element.prop == workPlannedStartDate.id),
            workActualStartDateObj = item.props.find(element => element.prop == workActualStartDate.id),
            workActualEndDateObj = item.props.find(element => element.prop == workActualEndDate.id),
            acceptanceDateObj = item.props.find(element => element.prop == acceptanceDate.id),
            checkingTypeObj = item.props.find(element => element.prop == checkingType.id),
            workSourceObj = item.props.find(element => element.prop == workSource.id),
            workTypeClass = workTypeClasses.find(cls => this.props.tofiConstants[cls].id == item.clsORtr);
        return {
            key: item.id,
            numb: idx + 1,
            // workListName: !!item.name ? item.name[this.lng] || '' : '',
            workType: workTypeClass ? {
                value: this.props.tofiConstants[workTypeClass].id,
                label: this.props.tofiConstants[workTypeClass].name[this.lng],
                workTypeClass
            } : null,
            workPlannedStartDate: !!workPlannedStartDateObj && workPlannedStartDateObj.values ? workPlannedStartDateObj.values.value || '' : '',
            workPlannedStartDateObject: !!workPlannedStartDateObj && workPlannedStartDateObj.values ? workPlannedStartDateObj.values || '' : '',
            workPlannedStartDateObj: !!workPlannedStartDateObj &&  workPlannedStartDateObj.values && workPlannedStartDateObj.values.value ? moment(workPlannedStartDateObj.values.value, 'DD-MM-YYYY') : null,
            workPlannedEndDate: !!workPlannedEndDateObj && workPlannedEndDateObj.values ? workPlannedEndDateObj.values.value || '' : '',
            workPlannedEndDateObject: !!workPlannedEndDateObj && workPlannedEndDateObj.values ? workPlannedEndDateObj.values || '' : '',
            workPlannedEndDateObj: !!workPlannedEndDateObj && workPlannedEndDateObj.values && workPlannedEndDateObj.values.value ? moment(workPlannedEndDateObj.values.value, 'DD-MM-YYYY') : null,
            workStatusSource: workStatusSourceObj && workStatusSourceObj.values ?workStatusSourceObj.values  : null,
            checkingType: checkingTypeObj && checkingTypeObj.values ? checkingTypeObj.values  : null,
            workListNameObj: item.name,
            workPriority: workPriorityObj && workPriorityObj.values ?workPriorityObj.values : null,
            workSource: !!workSourceObj && workSourceObj && workSourceObj.values ?  workSourceObj.values : null,
            workAuthor: !!workAuthorObj && workAuthorObj.values ? workAuthorObj.values   || '' : '',
            workDate: !!workDateObj && workDateObj.values && workDateObj.values.value ? moment(workDateObj.values.value, 'DD-MM-YYYY') : null,
            workDateObject: !!workDateObj && workDateObj.values  ? workDateObj.values  : null,
            workAssignedTo: !!workAssignedToObj && workAssignedToObj.values ? workAssignedToObj.values  : null,
            workActualStartDate: !!workActualStartDateObj && workActualStartDateObj.values ? workActualStartDateObj.values.value || '' : '',
            workActualStartDateId: !!workActualStartDateObj && workActualStartDateObj.values ? workActualStartDateObj.values || '' : '',
            workActualStartDateObj: !!workActualStartDateObj && workActualStartDateObj.values && workActualStartDateObj.values.value ? moment(workActualStartDateObj.values.value, 'DD-MM-YYYY') : null,
            workActualEndDate: !!workActualEndDateObj && workActualEndDateObj.values  ? workActualEndDateObj.values.value || '' : '',
            workActualEndDateId: !!workActualEndDateObj && workActualEndDateObj.values  ? workActualEndDateObj.values || '' : '',
            workActualEndDateObj: !!workActualEndDateObj && workActualEndDateObj.values && workActualEndDateObj.values.value ? moment(workActualEndDateObj.values.value, 'DD-MM-YYYY') : null,
            acceptanceDate: !!acceptanceDateObj && acceptanceDateObj.values ? acceptanceDateObj.values.value || '' : '',
            acceptanceDateId: !!acceptanceDateObj && acceptanceDateObj.values ? acceptanceDateObj.values || '' : '',
            acceptanceDateObj: !!acceptanceDateObj  && acceptanceDateObj.values && acceptanceDateObj.values.value ? moment(acceptanceDateObj.values.value, 'DD-MM-YYYY') : null
        }
    };

    menu = (
        <Menu>
            <Menu.Item key="first">{this.props.t('REPORT_1')}</Menu.Item>
            <Menu.Item key="second">{this.props.t('REPORT_2')}</Menu.Item>
        </Menu>
    );
    content = (
        <div className="comment-content">
            <Input.TextArea rows={4}/>
            <span>
        <a onClick={() => console.log('ok')}><Icon type="check"/></a>
        <Popconfirm title="Отменить?" onConfirm={() => console.log('cancel')}>
          <a style={{marginLeft: '5px'}}><Icon type="close"/></a>
        </Popconfirm>
      </span>
        </div>
    );
    renderTableFooter = () => {
        const { t } = this.props;
        return (
            <div className="table-footer birthday">
                <div className="data-length">
                    <div className="label">
                        <label htmlFor="">{t("COUNT_ITOG")}</label>
                        <Input
                            size="small"
                            type="text"
                            readOnly
                            value={this.filteredData.length + " / " + this.state.data.length}
                        />
                    </div>
                </div>
            </div>
        );
    };
    render() {
        const menu = (
            <Menu>
                <Menu.Item>
                    <p className="work-date-option" onClick={this.onWeekDate}>Неделя </p>
                </Menu.Item>
                <Menu.Item>
                    <p className="work-date-option" onClick={this.onMonthThreeDate}>3 месяца</p>
                </Menu.Item>
                <Menu.Item>
                    <p className="work-date-option" onClick={this.onMonthOneDate} >{moment().add(-1,"M").format("MMMM") } </p>
                </Menu.Item>
                <Menu.Item>
                    <p className="work-date-option" onClick={this.onMonthDate} >{moment().format("MMMM") } </p>
                </Menu.Item>
                <Menu.Item>
                    <p className="work-date-option" onClick={this.onYearDate}>Год</p>
                </Menu.Item>
                <Menu.Item>
                    <p className="work-date-option "  onClick={this.showModalDate} >
                        Указать период
                    </p>
                </Menu.Item>
            </Menu>
        );
        const {search, loading, performer, status, priority, workPriorityLoading, workStatusSourceLoading, workAssignedToSourceLoading, data} = this.state;
        const {t, tofiConstants} = this.props;
        if (isEmpty(tofiConstants)) return null;

        this.lng = localStorage.getItem('i18nextLng');
        const {workPlannedStartDate, workPlannedEndDate, workActualStartDate, workActualEndDate, acceptanceDate, workSource} = tofiConstants;

        this.filteredData = data.filter(item => {
            return (
                // item.numb === Number(search) ||
                ( item.workType ? item.workType.label.toLowerCase().includes(search.workType.toLowerCase()) : search.workType === '' ) &&
                ( item.key ? item.key.toLowerCase().includes(search.nameResearchers.toLowerCase()) : search.nameResearchers === '') &&
                ( item.workSource ? item.workSource.label.toLowerCase().includes(search.workSource.toLowerCase()) : search.workSource === '' ) &&
                ( priority.length === 0 || priority.some(p => (item.workPriority && p.value == item.workPriority.value)) ) &&
                ( status.length === 0 || status.some(p => (item.workStatusSource && p.value == item.workStatusSource.value)) ) &&
                ( performer.length === 0 || performer.some(p => (item.workAssignedTo && p.value == item.workAssignedTo.value)) ) &&
                ( !search.workPlannedStartDate.dbeg || moment(item.workPlannedStartDate, 'DD-MM-YYYY').isSameOrAfter(search.workPlannedStartDate.dbeg, 'day') ) &&
                ( !search.workPlannedStartDate.dend || moment(item.workPlannedStartDate, 'DD-MM-YYYY').isSameOrBefore(search.workPlannedStartDate.dend, 'day') ) &&
                ( !search.workPlannedEndDate.dbeg || moment(item.workPlannedEndDate, 'DD-MM-YYYY').isSameOrAfter(search.workPlannedEndDate.dbeg, 'day') ) &&
                ( !search.workPlannedEndDate.dend || moment(item.workPlannedEndDate, 'DD-MM-YYYY').isSameOrBefore(search.workPlannedEndDate.dend, 'day') ) &&
                ( !search.workActualStartDate.dbeg || moment(item.workActualStartDate, 'DD-MM-YYYY').isSameOrAfter(search.workActualStartDate.dbeg, 'day') ) &&
                ( !search.workActualStartDate.dend || moment(item.workActualStartDate, 'DD-MM-YYYY').isSameOrBefore(search.workActualStartDate.dend, 'day') ) &&
                ( !search.workActualEndDate.dbeg || moment(item.workActualEndDate, 'DD-MM-YYYY').isSameOrAfter(search.workActualEndDate.dbeg, 'day') ) &&
                ( !search.workActualEndDate.dend || moment(item.workActualEndDate, 'DD-MM-YYYY').isSameOrBefore(search.workActualEndDate.dend, 'day') ) &&
                ( !search.acceptanceDate.dbeg || moment(item.acceptanceDate, 'DD-MM-YYYY').isSameOrAfter(search.acceptanceDate.dbeg, 'day') ) &&
                ( !search.acceptanceDate.dend || moment(item.acceptanceDate, 'DD-MM-YYYY').isSameOrBefore(search.acceptanceDate.dend, 'day') )
            )
        });

        return (
            <div className="Works">
                <Modal
                    title="Выбрать период"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <span>С </span> <DatePicker onChange={(e)=>{
                    if (e === null){
                        return false
                    }
                    this.setState({
                        minValue:moment(e._d).format("YYYY-MM-DD")
                    })
                }}/>
                    <span>До </span> <DatePicker DatePicker onChange={(e)=>{
                    if (e === null){
                        return false
                    }
                    this.setState({
                        maxValue:moment(e._d).format("YYYY-MM-DD")
                    })
                }} />

                </Modal>
                <div className="title-works">
                    <h2>Работы по комплектованию</h2>
                    <Dropdown overlay={menu} trigger={['click']}>
                        <p className="ant-dropdown-link work-date" >
                            {this.state.nameFilter} <Icon type="down" />
                        </p>
                    </Dropdown>
                </div>
                <div className="Works__heading">
                    <div className="table-header">
                        <Button onClick={this.openCard}>{this.props.t('ADD')}</Button>
                        <div className="label-select">
                            <Select
                                name="priority"
                                isMulti
                                isSearchable={false}
                                value={priority}
                                onChange={this.onPriorityChange}
                                isLoading={workPriorityLoading}
                                options={this.props.workPriorityOptions ? this.props.workPriorityOptions.map(option => ({
                                    value: option.id,
                                    label: option.name[this.lng]
                                })) : []}
                                placeholder={t('PRIORITY')}
                                onMenuOpen={this.loadOptions(WORK_PRIORITY)}
                            />
                        </div>
                        <div className="label-select">
                            <Select
                                name="status"
                                isMulti
                                isSearchable={false}
                                value={status}
                                onChange={this.onStatusChange}
                                isLoading={workStatusSourceLoading}
                                options={this.props.workStatusSourceOptions ? this.props.workStatusSourceOptions.map(option => ({
                                    value: option.id,
                                    label: option.name[this.lng]
                                })) : []}
                                placeholder={t('STATUS')}
                                onMenuOpen={this.loadOptions(WORK_STATUS)}
                            />
                        </div>
                        <div className="label-select">
                            <SelectVirt
                                name="performer"
                                isMulti
                                isSearchable
                                // async
                                isLoading={workAssignedToSourceLoading}
                                onMenuOpen={this.getAllObjOfCls(['workAssignedToSource'])}
                                optionHeight={40}
                                value={performer}
                                onChange={this.onPerformerChange}
                                options={this.props.workAssignedToSourceOptions ? this.props.workAssignedToSourceOptions.map(option => ({
                                    value: option.id,
                                    label: option.name[this.lng]
                                })) : []}
                                placeholder={t('PERFORMER')}
                            />
                        </div>
{/*Временно отключен                        <div className="label-select">
                            <Dropdown overlay={this.menu} trigger={['click']}>
                                <Button style={{marginLeft: 8}}>
                                    {this.props.t('REPORT')} <Icon type="printer"/>
                                </Button>
                            </Dropdown>
                        </div>*/}
                    </div>
                </div>
                <div className="Works__body">
                    <AntTable
                        loading={loading}
                        onChange={this.onChange}
                        footer={this.renderTableFooter}
                        rowClassName={rec => {
                            if (rec.workStatusSource != null) {
                                let newClass =
                                    ['accepted', 'completed', 'returned'].some(c => tofiConstants[c].id == rec.workStatusSource.value) ? 'completed' :
                                        ['during', 'appointed', 'issued', 'requirementCreated', 'pending', 'appointmentProcess', 'needFor', 'found', 'created', 'allowed', 'denied'].some(c => tofiConstants[c].id == rec.workStatusSource.value) ? 'appointed' :
                                            ['notAccepted', 'notFound'].some(c => tofiConstants[c].id == rec.workStatusSource.value) ? 'danger' : '';
                                let selectedRow = '';
                                if (this.state.workStatusSource != null) {
                                    if (this.state.selectedRow.key == rec.key) {
                                        selectedRow = 'row-selected'
                                    }
                                }
                                return newClass + ' ' + selectedRow;
                            }
                          }
                        }



                        columns={[
                            {
                                key: 'numb',
                                title: '№',
                                dataIndex: 'numb',
                                width: '4%'
                            },
                            {
                                title: t('ID'),
                                dataIndex: 'key',
                                width: '10%',
                                render: key => key ? key.slice(5,8)+'-'+key.slice(-4) : '',
                                sortOrder: 'descend' ,
                                sorter: (a, b) => parseInt(a.key.split('_')[1]) - parseInt(b.key.split('_')[1]),
                                filterDropdown: (
                                    <div className="custom-filter-dropdown">
                                        <Input
                                            disabled={this.state.openCard}
                                            name="nameResearchers"
                                            suffix={search.nameResearchers && !this.state.openCard ?
                                                <Icon type="close-circle" data-name="nameResearchers"
                                                      onClick={this.emitEmpty}/> : null}
                                            ref={ele => this.nameResearchers = ele}
                                            placeholder="Поиск"
                                            value={search.nameResearchers}
                                            onChange={this.onInputChange}
                                        />
                                    </div>
                                ),
                                filterIcon: <Icon type="filter"
                                                  style={{color: search.nameResearchers ? '#ff9800' : '#aaa'}}/>,
                                onFilterDropdownVisibleChange: (visible) => {
                                    this.setState({
                                        filterDropdownVisible: visible,
                                    }, () => this.nameResearchers.focus());
                                },
                            },
                            {
                                key: 'workType',
                                title: t('WORK_TYPE'),
                                dataIndex: 'workType',
                                width: '15%',
                                filterDropdown: (
                                    <div className="custom-filter-dropdown">
                                        <Input
                                            name="workType"
                                            suffix={search.workType ? <Icon type="close-circle" data-name="workType"
                                                                            onClick={this.emitEmpty}/> : null}
                                            ref={ele => this.workType = ele}
                                            placeholder="Поиск"
                                            value={search.workType}
                                            onChange={this.onInputChange}
                                        />
                                    </div>
                                ),
                                filterIcon: <Icon type="filter" style={{color: search.workType ? '#ff9800' : '#aaa'}}/>,
                                onFilterDropdownVisibleChange: (visible) => {
                                    this.setState({
                                        filterDropdownVisible: visible,
                                    }, () => this.workType.focus());
                                },
                                render: text => text ? text.label : ''
                            },
                            {
                                key: 'workSource',
                                title: workSource.name[this.lng],
                                dataIndex: 'workSource',
                                width: '15%',
                                filterDropdown: (
                                    <div className="custom-filter-dropdown">
                                        <Input
                                            name="workSource"
                                            suffix={search.workSource ? <Icon type="close-circle" data-name="workSource"
                                                                              onClick={this.emitEmpty}/> : null}
                                            ref={ele => this.workSource = ele}
                                            placeholder="Поиск"
                                            value={search.workSource}
                                            onChange={this.onInputChange}
                                        />
                                    </div>
                                ),
                                filterIcon: <Icon type="filter"
                                                  style={{color: search.workSource ? '#ff9800' : '#aaa'}}/>,
                                onFilterDropdownVisibleChange: (visible) => {
                                    this.setState({
                                        filterDropdownVisible: visible,
                                    }, () => this.workSource.focus());
                                },
                                render: text => (text ? text.label : '')
                            },
                            {
                                key: 'workPlannedStartDate',
                                title: workPlannedStartDate.name[this.lng],
                                dataIndex: 'workPlannedStartDate',
                                width: '10%',
                                filterDropdown: (
                                    <div className="custom-filter-dropdown">
                                        <div className="flex">
                                            <DatePicker
                                                format="DD-MM-YYYY"
                                                //value={this.state.search.workPlannedStartDate.dbeg}
                                                style={{marginRight: '16px'}}
                                                showToday={false}
                                                onChange={this.onDateChange('workPlannedStartDate', 'dbeg')}
                                            />
                                            <DatePicker
                                                format="DD-MM-YYYY"
                                                //value={this.state.search.workPlannedStartDate.dend}
                                                showToday={false}
                                                onChange={this.onDateChange('workPlannedStartDate', 'dend')}
                                            />
                                        </div>
                                    </div>
                                ),
                                filterIcon: <Icon type="filter"
                                                  style={{color: (search.workPlannedStartDate.dbeg || search.workPlannedStartDate.dend) ? '#ff9800' : '#aaa'}}/>
                            },
                            {
                                key: 'workPlannedEndDate',
                                title: workPlannedEndDate.name[this.lng],
                                dataIndex: 'workPlannedEndDate',
                                width: '11%',
                                filterDropdown: (
                                    <div className="custom-filter-dropdown">
                                        <div className="flex">
                                            <DatePicker
                                                format="DD-MM-YYYY"
                                                value={this.state.search.workPlannedEndDate.dbeg}
                                                style={{marginRight: '16px'}}
                                                showToday={false}
                                                onChange={this.onDateChange('workPlannedEndDate', 'dbeg')}
                                            />
                                            <DatePicker
                                                format="DD-MM-YYYY"
                                                value={this.state.search.workPlannedEndDate.dend}
                                                showToday={false}
                                                onChange={this.onDateChange('workPlannedEndDate', 'dend')}
                                            />
                                        </div>
                                    </div>
                                ),
                                filterIcon: <Icon type="filter"
                                                  style={{color: (search.workPlannedEndDate.dbeg || search.workPlannedEndDate.dend) ? '#ff9800' : '#aaa'}}/>
                            },
                            {
                                key: 'workActualStartDate',
                                title: workActualStartDate.name[this.lng],
                                dataIndex: 'workActualStartDate',
                                width: '10%',
                                filterDropdown: (
                                    <div className="custom-filter-dropdown">
                                        <div className="flex">
                                            <DatePicker
                                                format="DD-MM-YYYY"
                                                value={this.state.search.workActualStartDate.dbeg}
                                                style={{marginRight: '16px'}}
                                                showToday={false}
                                                onChange={this.onDateChange('workActualStartDate', 'dbeg')}
                                            />
                                            <DatePicker
                                                format="DD-MM-YYYY"
                                                value={this.state.search.workActualStartDate.dend}
                                                showToday={false}
                                                onChange={this.onDateChange('workActualStartDate', 'dend')}
                                            />
                                        </div>
                                    </div>
                                ),
                                filterIcon: <Icon type="filter"
                                                  style={{color: (search.workActualStartDate.dbeg || search.workActualStartDate.dend) ? '#ff9800' : '#aaa'}}/>,
                                render: (text, record) => {
                                    return (
                                        text ?
                                            <div className="editable-cell-text-wrapper">
                                                {/*<Popover placement="bottomLeft" title='COMMENTARY' content={this.content} trigger="click" defaultVisible destroyPopupOnHide>
                                                 <span onClick={this.stopPropagation}>{text || ' '}</span>
                                                 </Popover>*/}
                                                {text || ' '}
                                                <Popconfirm title={this.props.t('CONFIRM_REMOVE')} onConfirm={() =>
                                                    this.saveProps({obj: {doItem: record.key}}, {
                                                        values: {
                                                            workStatusSource: {value: this.props.tofiConstants.appointed.id, idDataPropVal:record.workStatusSource.idDataPropVal},
                                                            workActualStartDate: {value:moment(), mode: "del",idDataPropVal:record.workActualStartDateId.idDataPropVal}
                                                        }
                                                    })
                                                }>
                                                    <Icon
                                                        type="close-circle"
                                                        className="editable-cell-icon"
                                                        onClick={this.stopPropagation}
                                                    />
                                                </Popconfirm>
                                            </div>
                                            :
                                            <div className="editable-row-operations">
                                                <Button title="Начать" icon="play-circle"
                                                        onClick={this.addSpecialDate(record.key, 'workActualStartDate')}
                                                        disabled={!!record.workAssignedTo?record.workAssignedTo.value === this.props.user.obj?false:true:true}
                                                        className='green-btn'/>
                                                {/*<Button title="CANCEL" icon="close" onClick={this.addSpecialDate(record.key, 'workActualStartDate', 'red')} className='green-btn'/>*/}
                                            </div>
                                    )
                                }
                            },
                            {
                                key: 'workActualEndDate',
                                title: workActualEndDate.name[this.lng],
                                dataIndex: 'workActualEndDate',
                                width: '10%',
                                filterDropdown: (
                                    <div className="custom-filter-dropdown">
                                        <div className="flex">
                                            <DatePicker
                                                format="DD-MM-YYYY"
                                                value={this.state.search.workActualEndDate.dbeg}
                                                style={{marginRight: '16px'}}
                                                showToday={false}
                                                onChange={this.onDateChange('workActualEndDate', 'dbeg')}
                                            />
                                            <DatePicker
                                                format="DD-MM-YYYY"
                                                value={this.state.search.workActualEndDate.dend}
                                                showToday={false}
                                                onChange={this.onDateChange('workActualEndDate', 'dend')}
                                            />
                                        </div>
                                    </div>
                                ),
                                filterIcon: <Icon type="filter"
                                                  style={{color: (search.workActualEndDate.dbeg || search.workActualEndDate.dend) ? '#ff9800' : '#aaa'}}/>,
                                render: (text, record) => {
                                    return (
                                        text ?
                                            <div className="editable-cell-text-wrapper">
                                                {text || ' '}
                                                <Popconfirm title={this.props.t('CONFIRM_REMOVE')} onConfirm={() =>
                                                    this.saveProps({obj: {doItem: record.key}}, {
                                                        values: {
                                                            workStatusSource: {value: this.props.tofiConstants.appointed.id, idDataPropVal:record.workStatusSource.idDataPropVal},
                                                            workActualEndDate: {value:moment(), mode: "del",idDataPropVal:record.workActualEndDateId.idDataPropVal}
                                                        }
                                                    })
                                                }>
                                                    <Icon
                                                        type="close-circle"
                                                        className="editable-cell-icon"
                                                        onClick={this.stopPropagation}
                                                    />
                                                </Popconfirm>
                                            </div>
                                            :
                                            <div className="editable-row-operations">
                                                <Button title="Завершить" icon="poweroff"
                                                        disabled={!!record.workAssignedTo?record.workAssignedTo.value === this.props.user.obj?false:true:true}

                                                        onClick={this.addSpecialDate(record.key, 'workActualEndDate')}
                                                        className='green-btn'/>
                                                {/*<Button title="CANCEL" icon="close" onClick={this.addSpecialDate(record.key, 'workActualEndDate')} className='green-btn'/>*/}
                                            </div>
                                    )
                                }
                            },
                            {
                                key: 'acceptanceDate',
                                title: acceptanceDate.name[this.lng],
                                dataIndex: 'acceptanceDate',
                                width: '10%',
                                filterDropdown: (
                                    <div className="custom-filter-dropdown">
                                        <div className="flex">
                                            <DatePicker
                                                format="DD-MM-YYYY"
                                                value={this.state.search.acceptanceDate.dbeg}
                                                style={{marginRight: '16px'}}
                                                showToday={false}
                                                onChange={this.onDateChange('acceptanceDate', 'dbeg')}
                                            />
                                            <DatePicker
                                                format="DD-MM-YYYY"
                                                value={this.state.search.acceptanceDate.dend}
                                                showToday={false}
                                                onChange={this.onDateChange('acceptanceDate', 'dend')}
                                            />
                                        </div>
                                    </div>
                                ),
                                filterIcon: <Icon type="filter"
                                                  style={{color: (search.acceptanceDate.dbeg || search.acceptanceDate.dend) ? '#ff9800' : '#aaa'}}/>,
                                render: (text, record) => {
                                    return (
                                        text ?
                                            <div className="editable-cell-text-wrapper">
                                                <span
                                                    style={record.workStatusSource && record.workStatusSource.value == this.props.tofiConstants.accepted.id ? {color: 'green'} : {color: 'red'}}>{text || ' '}</span>
                                                <Popconfirm title={this.props.t('CONFIRM_REMOVE')} onConfirm={() =>
                                                    this.saveProps({obj: {doItem: record.key}}, {
                                                        values: {
                                                            workStatusSource: {value: this.props.tofiConstants.appointed.id, idDataPropVal:record.workStatusSource.idDataPropVal},
                                                            acceptanceDate: {value:moment(), mode: "del",idDataPropVal:record.acceptanceDateId.idDataPropVal}
                                                        }
                                                    })
                                                }>
                                                    <Icon
                                                        type="close-circle"
                                                        className="editable-cell-icon"
                                                        onClick={this.stopPropagation}
                                                    />
                                                </Popconfirm>
                                            </div>
                                            :
                                            record.workActualEndDate && <div className="editable-row-operations">
                                                <Button title="Принять" icon="check-circle" className='green-btn'
                                                        onClick={this.addSpecialDate(record.key, 'acceptanceDate')}/>
                                                <Button title="CANCEL" icon="close"
                                                        onClick={this.addSpecialDate(record.key, 'notAccepted')}
                                                        className='green-btn'/>
                                            </div>
                                    )
                                }
                            },
                            {
                                key: 'action',
                                title: '',
                                dataIndex: 'action',
                                width: '5%',
                                render: (text, record) => {
                                    return (
                                        <div className="editable-row-operations">
                      <span>
                        <Popconfirm title={this.props.t('CONFIRM_REMOVE')} onConfirm={() => {
                            const fd = new FormData();
                            fd.append("cubeSConst", CUBE_FOR_WORKS);
                            fd.append("dimObjConst", DO_FOR_WORKS);
                            fd.append("objId", record.key.split('_')[1]);
                            const hideLoading = message.loading(this.props.t('REMOVING'), 30);
                            dObj(fd)
                                .then(res => {
                                    hideLoading();
                                    if (res.success) {
                                        message.success(this.props.t('SUCCESSFULLY_REMOVED'));
                                        this.getCubeAct()
                                    } else {
                                        throw res
                                    }
                                }).catch(err => {
                                console.log(err);
                                message.error(this.props.t('REMOVING_ERROR'))
                            })
                        }}>
                          <Button title="Удалить" icon="delete" onClick={this.stopPropagation}

                                  disabled={!!record.workActualStartDate} className='green-btn yellow-bg'/>
                        </Popconfirm>
                      </span>
                                        </div>
                                    );
                                },
                            }
                        ]}
                        dataSource={this.filteredData}
                        changeSelectedRow={this.changeSelectedRow}
                        openedBy="Works"
                        // size="small"
                    />
                    <CSSTransition
                        in={this.state.openCard}
                        timeout={300}
                        classNames="card"
                        unmountOnExit
                    >
                        <SiderCard t={t} tofiConstants={tofiConstants} initialValues={this.state.initialValues}
                                   closer={<Button type='danger' onClick={this.closeCard} shape="circle"
                                                   icon="arrow-right"/>}
                                   onCreateObj={this.onCreateObj} saveProps={this.saveProps}
                        />
                    </CSSTransition>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        tofiConstants: state.generalData.tofiConstants,
        cubeForWorks: state.cubes[CUBE_FOR_WORKS],
        workPriorityOptions: state.generalData[WORK_PRIORITY],
        workStatusSourceOptions: state.generalData[WORK_STATUS],
        workAssignedToSourceOptions: state.generalData.workAssignedToSource,
        checkingTypeOptions: state.generalData[CHECKING_TYPE],
        user: state.auth.user
    }
}

export default connect(mapStateToProps, {getCube, getPropVal, getAllObjOfCls})(Works);