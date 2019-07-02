import React from 'react';
import {Button, Input, Popconfirm, Icon, Dropdown, Menu,Modal, DatePicker, message} from 'antd';
import {connect} from 'react-redux';
import CSSTransition from 'react-transition-group/CSSTransition'
import moment from 'moment';
import {isEmpty, isEqual, map, uniqBy} from 'lodash';

import Select from '../../Select';
import SelectVirt from "../../SelectVirt";
import {SYSTEM_LANG_ARRAY} from '../../../constants/constants';
import AntTable from '../../AntTable';
import SiderCard from '../../SiderCard';
import {
    CUBE_FOR_WORKS, WORK_PRIORITY, WORK_STATUS,
    DO_FOR_WORKS, CHECKING_TYPE, DP_FOR_WORKS, CUBE_FOR_AF_CASE, DO_FOR_CASE
} from '../../../constants/tofiConstants';
import {
    changeInvOC,
    createObj,
    dObj,
    getAllObjOfCls,
    getCube,
    getObjByProp,
    getPropVal,
    rabota1,
    rabotaAcc,
    rabotaExp,
    updateCubeData
} from '../../../actions/actions';
import {getPropMeta, onSaveCubeData, parseCube_new, parseForTable} from '../../../utils/cubeParser';
import AntModal from '../../AntModal';
import NSAWorksCard from "./NSAWorksCard";

/*eslint eqeqeq:0*/
class NSAWorks extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            sortState: true,
            visible: false,
            data: [],
            nameFilter:"",
            maxValue:"",
            minValue:'',            priority: [],
            workPriorityLoading: false,
            nsaWorkStatusLoading: false,
            sourcing: null,
            form: null,
            search: {
                nameResearchers:'',
                workPlannedStartDate: {
                    // dbeg: moment().subtract(1, 'w'),
                    // dend: moment().add(1, 'w')
                    dbeg: null,
                    dend: null
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
                },
                workType: '',
                workRegFund: '',
                workRegInv: '',
                workPriority: '',
                nsaWorkStatus: '',
                workAssignedToNID: ''
            },
            openCard: false,
            selectedRow: null,
            performer: [],
            workAssignedToNIDLoading: false,
            initialValues: {},
            loading: false,
            workStatusDeliveryLoading: false,
            workStatusAdmissionAndExpertiseLoading: false,
            status: [],
            workStatusSearchLoading: false,
            modal: {
                visible: false
            },
            workRegInvOptions: [],
            workRegInvSelected: null
        };
    }
    onChange = (pagination, filters, sorter) => {
        if(sorter.columnKey === "key") {
            this.setState({sortState: !this.state.sortState});
        }
    }
    onWeekDate=()=>{
        this.setState({
            maxValue:moment().format("YYYY-MM-DD"),
            minValue:moment().add(-1,"W").format("YYYY-MM-DD"),
            nameFilter:"Неделя"
        },()=>this.getCubeAct())
    };
    onMonthThreeDate=()=>{
        this.setState({
            maxValue:moment().format("YYYY-MM-DD"),
            minValue:moment().add(-3,"M").startOf("month").format("YYYY-MM-DD"),
            nameFilter:"3 Месяца"
        },()=>this.getCubeAct())
    };
    onMonthOneDate=()=>{
        this.setState({
            maxValue:moment().startOf("month").format("YYYY-MM-DD"),
            minValue:moment().add(-1,"M").startOf("month").format("YYYY-MM-DD"),
            nameFilter:moment().add(-1,"M").format("MMMM")
        },()=>this.getCubeAct())
    };
    onMonthDate=()=>{
        this.setState({
            maxValue:moment().format("YYYY-MM-DD"),
            minValue:moment().startOf("month").format("YYYY-MM-DD"),
            nameFilter:moment().format("MMMM")
        },()=>this.getCubeAct())
    };
    onYearDate=()=>{
        this.setState({
            maxValue:moment().format("YYYY-MM-DD"),
            minValue:moment().add(-1,"Y").format("YYYY-MM-DD"),
            nameFilter:"Год"
        },()=>this.getCubeAct())
    };

    showModalDate = () => {
        this.setState({
            visible: true,
        });
    };
    handleOk = (e) => {
        this.setState({
            visible: false,
            nameFilter:`С ${this.state.minValue} По ${this.state.maxValue}`
        },()=>this.getCubeAct());
    };
    handleCancel = (e) => {
        this.setState({
            maxValue:moment().format("YYYY-MM-DD"),
            minValue:moment().startOf('month').format("YYYY-MM-DD"),
            visible: false,
        });
    };

    onPriorityChange = s => {
        this.setState({priority: s})
    };
    onStatusChange = s => {
        this.setState({status: s})
    };
    onPerformerChange = s => {
        this.setState({performer: s})
    };

    changeSelectedRow = rec => {
        if ((isEmpty(this.state.selectedRow) && !this.state.openCard) || (!isEqual(this.state.selectedRow, rec) && !this.state.openCard)) {
            this.setState({selectedRow: rec})
        } else {
            this.setState({initialValues: rec, openCard: true, selectedRow: rec})
        }
    };

    openCard = () => {
        this.setState({
            openCard: true,
            selectedRow: null,
            initialValues: {
                workDate: moment(),
                workAuthor: {value: this.props.user.obj, label: this.props.user.name},
                nsaWorkStatus: {
                    value: this.props.tofiConstants.created.id,
                    label: this.props.tofiConstants.created.name[this.lng]
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
        if (isEmpty(this.props.tofiConstants)) return;
        this.setState({
            maxValue:moment().format("YYYY-MM-DD"),
            minValue:moment().startOf('month').format("YYYY-MM-DD"),
            nameFilter:moment().format("MMMM")
        },()=>this.getCubeAct())

    };

    getCubeAct = () => {
        this.setState({loading: true});
        this.filters = {
            filterDOAnd: [
                {
                    dimConst: DO_FOR_WORKS,
                    concatType: "and",
                    conds: [
                        {
                            clss: "creatingArchiveReference,descriptionOfCases,descriptionOfFunds,documentDescpiption,inventoryEditing,inventoryProcessing"
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
    };

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
    loadOptionsArr = cArr => {
        return () => {
            cArr.forEach(c => {
                if (!this.props[c + 'Options']) {
                    this.setState({[c + 'Loading']: true});
                    this.props.getPropVal(c)
                        .then(() => this.setState({[c + 'Loading']: false}))
                }
            });
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
                            nsaWorkStatus: {value: this.props.tofiConstants.during.id,idDataPropVal:target.nsaWorkStatus.idDataPropVal},
                            [name]: {value:moment()}
                        }
                    })
                        .then(res => {
                            if (res.success) {
                                if (target.workType.value === this.props.tofiConstants.check.id) {
                                    // this.props.history.push(`/sourcing/works/checking/${target.workSource}`)
                                }
                            }
                        });
                } else if (name === 'workActualEndDate') {
                    this.saveProps({obj}, {
                        values: {
                            nsaWorkStatus: {value: this.props.tofiConstants.completed.id, idDataPropVal:target.nsaWorkStatus.idDataPropVal},
                            [name]: {value:moment()}
                        }
                    })
                } else if (name === 'acceptanceDate') {
                    this.saveProps({obj}, {
                        values: {
                            nsaWorkStatus: {value: this.props.tofiConstants.accepted.id, idDataPropVal:target.nsaWorkStatus ? target.nsaWorkStatus.idDataPropVal:''},
                            [name]: {value:moment()},
                            tookUser: {value:String(this.props.user.obj),idDataPropVal:target.tookUser ? target.tookUser.idDataPropVal : ''}
                        }
                    })
                } else if (name === 'notAccepted') {
                    this.saveProps({obj}, {
                        values: {
                            nsaWorkStatus: {value: this.props.tofiConstants.notAccepted.id,idDataPropVal:target.nsaWorkStatus.idDataPropVal},
                            acceptanceDate:  {value:moment()}
                        }
                    })
                }
            }
            this.setState({data: newData});
        };
    };

    renderTableData = (item, idx) => {
        const workTypeClasses = ['creatingArchiveReference', 'descriptionOfCases', 'descriptionOfFunds', 'documentDescpiption', 'inventoryEditing', 'inventoryProcessing'];
        const constArr = ['workPlannedEndDate', 'workAuthor', 'workRegFund', 'workRegInv', 'workIndexNumber', 'nsaWorkStatus', 'tookUser',
            'workPriority', 'workDate', 'workAssignedTo', 'workPlannedStartDate', 'workActualStartDate', 'workRecipient', 'appointedUser',
            'workActualEndDate', 'acceptanceDate', 'workRegCase', 'intermediateResultDate', 'fundArchive', 'dateAppointment', 'customerReqs',
            'qualityControlConclusion', 'artistNotes','nameDirectory','directoryType'];
        const workTypeClass = workTypeClasses.find(cls => this.props.tofiConstants[cls].id == item.clsORtr);
        const result = {
            key: item.id,
            numb: idx + 1,
            name: item.name,
            workType: workTypeClass ? {
                value: this.props.tofiConstants[workTypeClass].id,
                label: this.props.tofiConstants[workTypeClass].name[this.lng],
                workTypeClass
            } : null,
        };
        parseForTable(item.props, this.props.tofiConstants, result, constArr);
        // This thing is because some stings are multilang and some are not in TOFI 😵 madness 😵
/*        ['customerReqs', 'qualityControlConclusion', 'artistNotes']
            .forEach(c => {
                result[c] = result[c + 'Lng']
            });*/
        return result;
    };
    menu = (
        <Menu>
            <Menu.Item key="first">{this.props.t('REPORT_1')}</Menu.Item>
            <Menu.Item key="second">{this.props.t('REPORT_2')}</Menu.Item>
        </Menu>
    );

    showModal = () => {
        this.setState({
            modal: {
                visible: true,
            }
        });
    };
    handleModalOk = () => {
        changeInvOC(this.state.selectedRow.workRegInv.value, this.state.workRegInvSelected.value)
            .then(res => {
                if (res.success) {
                    this.setState({
                        modal: {
                            visible: false
                        }
                    });
                    return Promise.resolve();
                } else {
                    res.errors && res.errors.forEach(error => {
                        message.error(error.text);
                    });
                    return Promise.reject();
                }
            })
            .then(() => {
                this.onSaveCubeData({
                    nsaWorkStatus: {value: this.props.tofiConstants.completed.id},
                    workType: {value: 1053, workTypeClass: "descriptionOfValuableDocs"},
                    workActualStartDate: moment().format('YYYY-MM-DD'),
                    workActualEndDate: moment().format('YYYY-MM-DD')
                })
            })
            .catch(err => {
                console.error(err)
            })
    };
    handleModalCancel = () => {
        this.setState({
            modal: {
                visible: false
            }
        });
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
        const {
            search, loading, performer, status, priority, workPriorityLoading,
            workStatusDeliveryLoading, workStatusAdmissionAndExpertiseLoading, workStatusSearchLoading, workAssignedToNIDLoading, data
        } = this.state;
        const {t, tofiConstants, nsaWorkStatusOptions} = this.props;
        if (isEmpty(tofiConstants)) return null;

        this.lng = localStorage.getItem('i18nextLng');
        const {
            workPlannedStartDate, workPlannedEndDate, workActualStartDate, workActualEndDate,
            acceptanceDate, workRegFund, workRegInv, workRecipient
        } = tofiConstants;

        this.filteredData = data.filter(item => {
            return (
                // item.numb === Number(search) ||
                (item.workType ? item.workType.label.toLowerCase().includes(search.workType.toLowerCase()) : search.workType === '') &&
                ( item.key ? item.key.toLowerCase().includes(search.nameResearchers.toLowerCase()) : search.nameResearchers === '') &&
                (item.workRegFund ? item.workRegFund.label.toLowerCase().includes(search.workRegFund.toLowerCase()) : search.workRegFund === '') &&
                (item.workRegInv ? item.workRegInv.label.toLowerCase().includes(search.workRegInv.toLowerCase()) : search.workRegInv === '') &&
                (priority.length === 0 || priority.some(p => (item.workPriority && p.value == item.workPriority.value))) &&
                (status.length === 0 || status.some(p => (item.nsaWorkStatus && p.value == item.nsaWorkStatus.value))) &&
                (performer.length === 0 || performer.some(p => (item.workAssignedTo && p.value == item.workAssignedTo.value))) &&
                (!search.workPlannedStartDate.dbeg || (item.workPlannedStartDate && moment(item.workPlannedStartDate.value,'DD-MM-YYYY').isSameOrAfter(search.workPlannedStartDate.dbeg, 'day'))) &&
                (!search.workPlannedStartDate.dend || (item.workPlannedStartDate && moment(item.workPlannedStartDate.value,'DD-MM-YYYY').isSameOrBefore(search.workPlannedStartDate.dend, 'day'))) &&
                (!search.workPlannedEndDate.dbeg || (item.workPlannedEndDate && moment(item.workPlannedEndDate.value,'DD-MM-YYYY').isSameOrAfter(search.workPlannedEndDate.dbeg, 'day'))) &&
                (!search.workPlannedEndDate.dend || (item.workPlannedEndDate && moment(item.workPlannedEndDate.value,'DD-MM-YYYY').isSameOrBefore(search.workPlannedEndDate.dend, 'day'))) &&
                (!search.workActualStartDate.dbeg || (item.workActualStartDate && moment(item.workActualStartDate,'DD-MM-YYYY').value.isSameOrAfter(search.workActualStartDate.dbeg, 'day'))) &&
                (!search.workActualStartDate.dend || (item.workActualStartDate && moment(item.workActualStartDate,'DD-MM-YYYY').value.isSameOrBefore(search.workActualStartDate.dend, 'day'))) &&
                (!search.workActualEndDate.dbeg || (item.workActualEndDate && moment(item.workActualEndDate.value,'DD-MM-YYYY').isSameOrAfter(search.workActualEndDate.dbeg, 'day'))) &&
                (!search.workActualEndDate.dend || (item.workActualEndDate && moment(item.workActualEndDate.value,'DD-MM-YYYY').isSameOrAfter(search.workActualEndDate.dend, 'day'))) &&
                (!search.acceptanceDate.dbeg || (item.acceptanceDate && moment(item.acceptanceDate.value,'DD-MM-YYYY').isSameOrAfter(search.acceptanceDate.dbeg, 'day'))) &&
                (!search.acceptanceDate.dend || (item.acceptanceDate && moment(item.acceptanceDate.value,'DD-MM-YYYY').isSameOrBefore(search.acceptanceDate.dend, 'day')))
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
                    <h2>Работы по ведению НСА</h2>
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
                                placeholder={this.props.tofiConstants.workPriority.name[this.lng]}
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
                                isLoading={workStatusDeliveryLoading || workStatusAdmissionAndExpertiseLoading || workStatusSearchLoading}
                                options={nsaWorkStatusOptions ? nsaWorkStatusOptions.map(option => ({
                                    value: option.id,
                                    label: option.name[this.lng]
                                })) : []}
                                placeholder={tofiConstants.nsaWorkStatus.name[this.lng]}
                                onMenuOpen={this.loadOptions('nsaWorkStatus')}
                            />
                        </div>
                        <div className="label-select">
                            <SelectVirt
                                name="performer"
                                isMulti
                                isSearchable
                                // async
                                isLoading={workAssignedToNIDLoading}
                                optionHeight={40}
                                value={performer}
                                onChange={this.onPerformerChange}
                                options={this.props.workAssignedToNIDOptions ? this.props.workAssignedToNIDOptions.map(option => ({
                                    value: option.id,
                                    label: option.name[this.lng]
                                })) : []}
                                placeholder={t('PERFORMER')}
                                onMenuOpen={this.getAllObjOfCls(['workAssignedToNID'])}
                            />
                        </div>
{/*Временно отключен!                        <div className="label-select">
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
                        rowClassName={rec => {
                            if(rec.nsaWorkStatus!=null){
                                let newClass=
                                    ['accepted','completed','returned'].some(c => tofiConstants[c].id == rec.nsaWorkStatus.value) ? 'completed' :
                                        ['during','appointed','issued','requirementCreated','pending','appointmentProcess','needFor','found','created','allowed','denied'].some(c => tofiConstants[c].id == rec.nsaWorkStatus.value) ? 'appointed':
                                            ['notAccepted','notFound'].some(c => tofiConstants[c].id == rec.nsaWorkStatus.value) ? 'danger' :'';
                                let selectedRow='';
                                if(this.state.nsaWorkStatus!=null){ if (this.state.selectedRow.key==rec.key) {selectedRow='row-selected'}};
                                return newClass+' '+selectedRow;
                            }
                          }
                        }
                        onChange={this.onChange}
                        columns={[
                            {
                                key: 'numb',
                                title: '№',
                                dataIndex: 'numb',
                                width: '4%'
                            }
                            ,
                            {
                                title: t('ID'),
                                dataIndex: 'key',
                                width: '10%',
                                render: key => key ? key.slice(5,8)+'-'+key.slice(-4) : '',
                                sortOrder: 'descend',
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
                                width: '20%',
                                filterDropdown: (
                                    <div className="custom-filter-dropdown">
                                        <Input
                                            name="workType"
                                            suffix={search.workType ?
                                                <Icon type="close-circle" data-name="workType"
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
                                key: 'workPlannedStartDate',
                                title: workPlannedStartDate.name[this.lng],
                                dataIndex: 'workPlannedStartDate',
                                width: '13%',
                                filterDropdown: (
                                    <div className="custom-filter-dropdown">
                                        <div className="flex">
                                            <DatePicker
                                                format="DD-MM-YYYY"
                                                value={this.state.search.workPlannedStartDate.dbeg}
                                                style={{marginRight: '16px'}}
                                                showToday={false}
                                                onChange={this.onDateChange('workPlannedStartDate', 'dbeg')}
                                            />
                                            <DatePicker
                                                format="DD-MM-YYYY"
                                                value={this.state.search.workPlannedStartDate.dend}
                                                showToday={false}
                                                onChange={this.onDateChange('workPlannedStartDate', 'dend')}
                                            />
                                        </div>
                                    </div>
                                ),
                                filterIcon: <Icon type="filter"
                                                  style={{color: (search.workPlannedStartDate.dbeg || search.workPlannedStartDate.dend) ? '#ff9800' : '#aaa'}}/>,
                                render: text => (text ? text.value : (text instanceof moment ? moment(text).format('DD-MM-YYYY'):''))
                            },
                            {
                                key: 'workPlannedEndDate',
                                title: workPlannedEndDate.name[this.lng],
                                dataIndex: 'workPlannedEndDate',
                                width: '15%',
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
                                                  style={{color: (search.workPlannedEndDate.dbeg || search.workPlannedEndDate.dend) ? '#ff9800' : '#aaa'}}/>,
                                render: text => (text ? text.value : '')
                            },
                            {
                                key: 'workActualStartDate',
                                title: workActualStartDate.name[this.lng],
                                dataIndex: 'workActualStartDate',
                                width: '14%',
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
                                                {record.intermediateResultDate ?
                                                    <Button title={t('CONTINUE')}
                                                            icon="forward"
                                                            disabled={record.workAssignedTo !== null ? record.workAssignedTo.value === this.props.user.obj?false:true:true}
                                                            onClick={this.addSpecialDate(record.key, 'workActualStartDateContinue')}
                                                            className='green-btn'
                                                    /> :
                                                    text.value || ' '}
                                            </div>
                                            :
                                            <div className="editable-row-operations">
                                                <Button
                                                    title={record.workType.workTypeClass === 'casesForTemporaryUse' ? t("ISSUED") : t("START")}
                                                    disabled={record.workAssignedTo !== null ? record.workAssignedTo.value === this.props.user.obj?false:true:true}
                                                    icon={record.workType.workTypeClass === 'casesForTemporaryUse' ? "reload" : "play-circle"}
                                                    onClick={this.addSpecialDate(record.key, 'workActualStartDate')}
                                                    className='green-btn'
                                                />
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
                                                {text.value || ' '}
                                            </div>
                                            :
                                            <div className="editable-row-operations">
                                                {record.workType &&
                                                !['caseRegistration', 'caseAvailabilityCheck', 'caseExamination', 'descriptionOfValuableDocs'].includes(record.workType.workTypeClass) &&
                                                <Button
                                                    title={record.workType.workTypeClass === 'casesForTemporaryUse' ? t("GET_BACK") : t("COMPLETE")}
                                                    icon={record.workType.workTypeClass === 'casesForTemporaryUse' ? "sync" : "poweroff"}
                                                    disabled={!record.workActualStartDate || this.props.user.obj != record.workAssignedTo.value}
                                                    onClick={this.addSpecialDate(record.key, 'workActualEndDate')}
                                                    className='green-btn'
                                                />}
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
                            style={record.nsaWorkStatus && (record.nsaWorkStatus.value == this.props.tofiConstants.accepted.id || record.nsaWorkStatus.value == this.props.tofiConstants.found.id) ? {color: 'green'} : {color: 'red'}}>{text.value || ' '}</span>
                                                <Popconfirm title={this.props.t('CONFIRM_REMOVE')} onConfirm={() =>
                                                    this.saveProps({obj:{doItem:record.key}},{
                                                        values:{
                                                            nsaWorkStatus:{value:this.props.tofiConstants.completed.id,idDataPropVal:record.nsaWorkStatus.idDataPropVal},
                                                            acceptanceDate:{value:'',mode:"del",idDataPropVal:record.acceptanceDate.idDataPropVal}
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
                                            record.workType.workTypeClass !== 'casesForTemporaryUse' &&
                                            <div className="editable-row-operations">
                                                <Button disabled={!record.workActualEndDate}
                                                        title={record.workType.workTypeClass === 'caseSearch' ? t('FOUND') : t("ACCEPT")}
                                                        icon="check-circle" className='green-btn'
                                                        onClick={this.addSpecialDate(record.key, 'acceptanceDate')}/>
                                                <Button disabled={!record.workActualEndDate}
                                                        title={record.workType.workTypeClass === 'caseSearch' ? t('NOT_FOUND') : t("DECLINE")}
                                                        icon="close"
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
                        <SiderCard
                            closer={<Button type='danger' onClick={this.closeCard} shape="circle" icon="arrow-right"/>}
                        >
                            <NSAWorksCard
                                t={t}
                                tofiConstants={tofiConstants}
                                initialValues={this.state.initialValues}
                                onCreateObj={this.onCreateObj}
                                saveProps={this.saveProps}
                            />
                        </SiderCard>
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
        nsaWorkStatusOptions: state.generalData.nsaWorkStatus,
        workAssignedToNIDOptions: state.generalData.workAssignedToNID,
        checkingTypeOptions: state.generalData[CHECKING_TYPE],
        user: state.auth.user
    }
}

export default connect(mapStateToProps, {getCube, getPropVal, getAllObjOfCls})(NSAWorks);