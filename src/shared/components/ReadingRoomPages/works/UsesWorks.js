import React from 'react';
import {Button, Input, Popconfirm, Icon, Dropdown, Menu, Modal, DatePicker, message} from 'antd';
import Select from '../../Select';
import SelectVirt from "../../SelectVirt";
import {connect} from 'react-redux';
import CSSTransition from 'react-transition-group/CSSTransition'
import moment from 'moment';
import {isEmpty, isEqual, map, uniqBy} from 'lodash';

import {SYSTEM_LANG_ARRAY} from '../../../constants/constants';
import AntTable from '../../AntTable';
import SiderCard from '../../SiderCard';
import {
    CUBE_FOR_WORKS, WORK_PRIORITY, WORK_STATUS, DO_FOR_WORKS, CHECKING_TYPE, DP_FOR_WORKS
} from '../../../constants/tofiConstants';
import {createObj, dObj, dObjChild, getAllObjOfCls, getCube, getPropVal, toResearcher} from '../../../actions/actions';
import {getPropMeta, onSaveCubeData, parseCube_new, parseForTable} from '../../../utils/cubeParser';
import UsesWorksCard from "./UsesWorksCard";
import {ExcelLoader} from "../../../utils/Excel_loader";
import {General} from '../../../utils/axios_config.js';
moment.locale('ru');
/*eslint eqeqeq:0*/
class Works extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            data: [],
            nameFilter:"",
            maxValue:"",
            minValue:'',
            priority: [],
            workPriorityLoading: false,
            status: [],
            workStatusUsesLoading: false,
            performer: [],
            workAssignedToLoading: false,
            workType: [],
            search: {
                workDate: {
                    // dbeg: moment().subtract(1, 'w'),
                    // dend: moment().add(1, 'w')
                    dbeg: null,
                    dend: null
                },
                permitionDate: {
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
                workSource: '',
                workPriority: '',
                workStatusUses: '',
                staffClass: [],
                researcherClass: [],
                nameStaff: '',
                nameResearchers: '',
            },
            openCard: false,
            selectedRow: null,
            initialValues: {},
            loading: false
        }
    }

    // s - value from select
    onPriorityChange = s => {
        this.setState({priority: s})
    };
    onStatusChange = s => {
        this.setState({status: s})
    };
    onPerformerChange = s => {
        this.setState({performer: s})
    };
    onWorkTypeChange = s => this.setState({workType: s});

    changeSelectedRow = rec => {
        if (isEmpty(this.state.selectedRow) || (!isEqual(this.state.selectedRow, rec) && !this.state.openCard)) {
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
                workAuthor: {value: this.props.user.obj, label: this.props.user.name},
                workDate: moment().startOf('day'),
                workStatusUses: {
                    value: this.props.tofiConstants.appointed.id,
                    label: this.props.tofiConstants.appointed.name[this.lng]
                },
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
        console.log(e);
        this.setState({
            maxValue:moment().format("YYYY-MM-DD"),
            minValue:moment().startOf('month').format("YYYY-MM-DD"),
            visible: false,
        });
    }
    componentDidMount() {

        if (isEmpty(this.props.tofiConstants)) return;
        const getClsId = c => this.props.tofiConstants[c].id;

        this.clsStatusMap = {
            [getClsId('caseDeliveryToRR')]: 'workStatusCreateRequirement',
            [getClsId('responseToRequest')]: 'workStatusForResearches',
            [getClsId('performPaidReq')]: 'workStatusForResearches',
            [getClsId('conductResearch')]: 'workStatusForResearches',
            [getClsId('orderCopyDoc')]: 'workStatusCopyDoc',
            [getClsId('userRegistration')]: 'workStatusRegistration',
        };
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
                            clss: "caseDeliveryToRR,responseToRequest,performPaidReq,conductResearch,orderCopyDoc,userRegistration"
                        },
                        {
                            data: {
                                dimPropConst: "dpForWorks",
                                propConst: "workDate",
                                values: {minValue: this.state.minValue, maxValue: this.state.maxValue}
                            }
                        },
                    ]
                },
            ],
            filterDPAnd: [
                {
                    dimConst: DP_FOR_WORKS,
                    concatType: "and",
                    conds: [
                        {
                            consts: "permitionDate,workAuthor,workDate,linkToUkaz,reasonForRefusalCaseStorage,workPriority,linkToDoc,customerReqs," +
                            "workAssignedTo,tookUser,reasonForRefusalCase,acceptanceDate,workActualEndDate,appointedUser,workActualStartDate," +
                            "workRegCase,workDescription,workStatusCreateRequirement,workStatusForResearches,workRegFund,workRegInv,dateAppointment,fundArchive,workRecipient," +
                            "workStatusCopyDoc,workStatusRegistration,childWorkFeature,linkToWork,propResearcheRequests,resultDescription,resultResearch,docsResearch,resultResearchStatus"
                        }
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
            await this.saveProps(
                {cube, obj},
                v,
                this.props.tofiConstants
            );
            return obj.doItem;
        } catch (e) {
            typeof hideCreateObj === 'function' && hideCreateObj();
            console.warn(e);
            throw e
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
            if (!c.cube.data) c.cube.data = this.props.cubeForWorks;
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
        const { t } = this.props;
        const obj = {doItem: key};
        return e => {
            e.stopPropagation();
            const newData = this.state.data.slice();
            const target = newData.find(el => el.key === key);
            if (target) {
                const mappedStatus = this.clsStatusMap[target.workType.value];
                if (name === 'workActualStartDate') {
                    this.saveProps({obj}, {
                        values: {
                            [mappedStatus]: {value: this.props.tofiConstants.appointed.id, idDataPropVal:target[mappedStatus].idDataPropVal},
                            [name]: moment().format('YYYY-MM-DD')
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
                    if (target.acceptanceDate == null) {
                        message.info(t('PRESS_YES_NO'));
                        return;
                    }
                    this.saveProps({obj}, {
                        values: {
                            [mappedStatus]: {value: this.props.tofiConstants.returned.id,idDataPropVal:target[mappedStatus].idDataPropVal},
                            [name]: moment().format('YYYY-MM-DD')
                        }
                    })
                } else if (name === 'acceptanceDate') {
                    if (target.workActualStartDate == null) {
                        message.info(t('PRESS_START'));
                        return;
                    }
                    const newName = {};
                    SYSTEM_LANG_ARRAY.forEach(lang => {
                        newName[lang] = `child_${target.key}`
                    });
                    const newObj = {
                        name: newName,
                        fullName: newName,
                        clsConst: 'casesForTemporaryUse',
                        parent: target.key.split('_')[1]
                    };
                    this.saveProps({obj}, {
                        values: {
                            [mappedStatus]: {value: this.props.tofiConstants.allowed.id, idDataPropVal:target[mappedStatus].idDataPropVal},
                            [name]: moment().format('YYYY-MM-DD')
                        }
                    }).then (() => {
                        target.workType.workTypeClass === 'userRegistration' && target.workAuthor.value && toResearcher(target.workAuthor.value);
                        target.workType.workTypeClass === 'caseDeliveryToRR' && this.onCreateObj({obj: newObj}, {
                            values: {
                                workAuthor: String(target.workAssignedTo.value),
                                workDate: moment().format('YYYY-MM-DD'),
                                childWorkFeature: String(this.props.tofiConstants.isActiveTrue.id),
                                workRegCase: String(target.workRegCase.value)
                            }
                        }).then((res) => {
                            const props = [
                                {
                                    propConst: 'workRegInv',
                                    periodType: '0',
                                    dte: moment().format('YYYY-MM-DD')
                                },
                                {
                                    propConst: 'bunchNumber',
                                    periodType: '0',
                                    dte: moment().format('YYYY-MM-DD')
                                },
                                {
                                    propConst: 'caseStorage',
                                    periodType: '0',
                                    dte: moment().format('YYYY-MM-DD')
                                },
                                {
                                    propConst: 'rack',
                                    periodType: '0',
                                    dte: moment().format('YYYY-MM-DD')
                                },
                                {
                                    propConst: 'section',
                                    periodType: '0',
                                    dte: moment().format('YYYY-MM-DD')
                                },
                                {
                                    propConst: 'shelf',
                                    periodType: '0',
                                    dte: moment().format('YYYY-MM-DD')
                                },
                            ];
                            General.setPropsToObj(
                              res.split('_')[1],
                              target.workRegCase.value,
                              props,
                              CUBE_FOR_WORKS,
                              DO_FOR_WORKS
                            );

                            General.calcWorkAssignedToAndFund(
                              res.split('_')[1],
                              target.workRegCase.value,
                              CUBE_FOR_WORKS,
                              DO_FOR_WORKS,
                              moment().format('YYYY-MM-DD')
                            );
                        });
                    });
                } else if (name === 'notAccepted') {
                    this.saveProps({obj}, {
                        values: {
                            [mappedStatus]: {value: this.props.tofiConstants.denied.id,idDataPropVal:target[mappedStatus].idDataPropVal},
                            acceptanceDate: moment().format('YYYY-MM-DD')
                        }
                    })
                } else if (name === 'permitionDate') {
                     this.saveProps({obj}, {

                        values: {
                            [mappedStatus]: target[mappedStatus],
                            permitionDate: moment().format('YYYY-MM-DD')
                        }
                    })
                }
            }
            this.setState({data: newData});
        };
    };

    renderTableData = (item, idx) => {
        const workTypeClasses = ['caseDeliveryToRR', 'responseToRequest', 'performPaidReq', 'conductResearch', 'orderCopyDoc', 'userRegistration'];
        const constArr = ['permitionDate', 'workAuthor', 'fundArchive', 'tookUser', 'workRecipient', 'appointedUser',
            'workPriority', 'workDate', 'workAssignedTo', 'workActualStartDate', 'dateAppointment', 'workRegFund', 'workRegInv',
            'workActualEndDate', 'acceptanceDate', 'customerReqs', 'reasonForRefusalCase', 'reasonForRefusalCaseStorage',
            'workStatusCreateRequirement', 'workStatusForResearches', 'workRegCase', 'linkToDoc', 'linkToUkaz', 'workStatusCopyDoc',
            'workStatusRegistration', 'childWorkFeature', 'linkToWork','propResearcheRequests','resultDescription','resultResearch','docsResearch','resultResearchStatus'];
        const workTypeClass = workTypeClasses.find(cls => this.props.tofiConstants[cls].id == item.clsORtr);

        const result = {
            key: item.id,
            numb: idx + 1,
            workType: workTypeClass ? {
                value: this.props.tofiConstants[workTypeClass].id,
                label: this.props.tofiConstants[workTypeClass].name[this.lng],
                workTypeClass
            } : null,
        };
        parseForTable(item.props, this.props.tofiConstants, result, constArr);
        // here goes some data massage
        // result.customerReqs = result.customerReqsLng;
        // result.resultDescription = result.resultDescriptionLng;
        // result.reasonForRefusalCase = result.reasonForRefusalCaseLng;
        // result.reasonForRefusalCaseStorage = result.reasonForRefusalCaseStorageLng;
        result.workStatusUses = result[this.clsStatusMap[item.clsORtr]];
        result.propResearcheRequests = result.propResearcheRequests ? result.propResearcheRequests.value : '';
        return result;
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

    workAssignedToClasses = ['clsHead', 'clsAdminDepartment', 'clsDepInformTech',
        'workAssignedToReg', 'workAssignedToNID', 'workAssignedToSource', 'workAssignedToIPS'];
    getWorkAssignedToOptions = () => {
        const result = [];
        this.workAssignedToClasses.forEach(c => {
            this.props[c + 'Options'].forEach(opt => {
                result.push({value: opt.id, label: opt.name[this.lng]})
            })
        });
        return result;
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
            search, loading, performer, status, priority, workPriorityLoading, workType, filter, workAssignedToLoading,
            workStatusCreateRequirementLoading, workStatusRegistrationLoading, workStatusCopyDocLoading, data
        } = this.state;
        const {
            t, tofiConstants, user, workStatusCreateRequirementOptions,
            workStatusCopyDocOptions, workStatusRegistrationOptions
        } = this.props;
        if (isEmpty(tofiConstants)) return null;

        this.lng = localStorage.getItem('i18nextLng');
        const {workDate, permitionDate, workActualStartDate, casesForTemporaryUse} = tofiConstants;


        this.filteredData = data.filter(item => {
            return (

                // item.numb === Number(search) ||
                ( item.workSource ? item.workSource.label.toLowerCase().includes(search.workSource.toLowerCase()) : search.workSource === '' ) &&
                ( item.key.toLowerCase().includes(search.nameResearchers.toLowerCase()) ) &&
                ( workType.length === 0 || workType.some(p => (item.workType && p.value == item.workType.value)) ) &&
                ( priority.length === 0 || priority.some(p => (item.workPriority && p.value == item.workPriority.value)) ) &&
                ( status.length === 0 || status.some(p => (item.workStatusUses && p.value == item.workStatusUses.value)) ) &&
                ( performer.length === 0 || performer.some(p => (item.workAssignedTo && p.value == item.workAssignedTo.value)) ) &&
                ( !search.workDate.dbeg || moment(item.workDate.value, 'DD-MM-YYYY').isSameOrAfter(search.workDate.dbeg, 'day') ) &&
                ( !search.workDate.dend || moment(item.workDate.value, 'DD-MM-YYYY').isSameOrBefore(search.workDate.dend, 'day') ) &&
                ( !search.permitionDate.dbeg || moment(item.permitionDate, 'DD-MM-YYYY').isSameOrAfter(search.permitionDate.dbeg, 'day') ) &&
                ( !search.permitionDate.dend || moment(item.permitionDate, 'DD-MM-YYYY').isSameOrBefore(search.permitionDate.dend, 'day') ) &&
                ( !search.workActualStartDate.dbeg || moment(item.workActualStartDate, 'DD-MM-YYYY').isSameOrAfter(search.workActualStartDate.dbeg, 'day') ) &&
                ( !search.workActualStartDate.dend || moment(item.workActualStartDate, 'DD-MM-YYYY').isSameOrBefore(search.workActualStartDate.dend, 'day') ) &&
                ( !search.workActualEndDate.dbeg || moment(item.workActualEndDate, 'DD-MM-YYYY').isSameOrAfter(search.workActualEndDate.dbeg, 'day') ) &&
                ( !search.workActualEndDate.dend || moment(item.workActualEndDate, 'DD-MM-YYYY').isSameOrBefore(search.workActualEndDate.dend, 'day') ) &&
                ( !search.acceptanceDate.dbeg || moment(item.acceptanceDate, 'DD-MM-YYYY').isSameOrAfter(search.acceptanceDate.dbeg, 'day') ) &&
                ( !search.acceptanceDate.dend || moment(item.acceptanceDate, 'DD-MM-YYYY').isSameOrBefore(search.acceptanceDate.dend, 'day') )
            )
        });



        // to be able to export data to excel easilyf
        const columns = [
            {
                key: 'numb',
                title: '№',
                dataIndex: 'numb',
                width: '6%'
            },
            {
                key: 'key',
                title: t('ID'),
                dataIndex: 'key',
                width: '10%',
                render: key => key ? key.slice(5,8)+'-'+key.slice(-4) : '',
                sortOrder:'descend',
                sorter: (a, b) => parseInt(a.key.split('_')[1]) - parseInt(b.key.split('_')[1]),
                filterDropdown: (
                    <div className="custom-filter-dropdown">
                        <Input
                            disabled={this.state.openCard}
                            name="nameResearchers"
                            suffix={search.nameResearchers && !this.state.openCard ?
                                <Icon type="close-circle" data-name="nameResearchers" onClick={this.emitEmpty}/> : null}
                            ref={ele => this.nameResearchers = ele}
                            placeholder="Поиск"
                            value={search.nameResearchers}
                            onChange={this.onInputChange}
                        />
                    </div>
                ),
                filterIcon: <Icon type="filter" style={{color: search.nameResearchers ? '#ff9800' : '#aaa'}}/>,
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
                render: text => text ? text.label : ''
            },
            {
                key: 'workDate',
                title: workDate.name[this.lng],
                dataIndex: 'workDate',
                width: '13%',
                filterDropdown: (
                    <div className="custom-filter-dropdown">
                        <div className="flex">
                            <DatePicker
                                format="DD-MM-YYYY"
                                value={this.state.search.workDate.dbeg}
                                style={{marginRight: '16px'}}
                                showToday={false}
                                onChange={this.onDateChange('workDate', 'dbeg')}
                            />
                            <DatePicker
                                format="DD-MM-YYYY"
                                value={this.state.search.workDate.dend}
                                showToday={false}
                                onChange={this.onDateChange('workDate', 'dend')}
                            />
                        </div>
                    </div>
                ),
                filterIcon: <Icon type="filter"
                                  style={{color: (search.workDate.dbeg || search.workDate.dend) ? '#ff9800' : '#aaa'}}/>,
                render: obj => obj && obj.value
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
                                {/*<Popover placement="bottomLeft" title='COMMENTARY' content={this.content} trigger="click" defaultVisible destroyPopupOnHide>
                                 <span onClick={this.stopPropagation}>{text || ' '}</span>
                                 </Popover>*/}
                                {text.value || ' '}
                                {!(!record.workAssignedTo || user.obj != record.workAssignedTo.value) &&
                                <Popconfirm title={this.props.t('CONFIRM_REMOVE')} onConfirm={() =>
                                    this.saveProps({obj: {doItem: record.key}}, {
                                        values: {
                                            workStatusUses: {value: this.props.tofiConstants.appointed.id,idDataPropVal:record.workStatusUses.idDataPropVal},
                                            workActualStartDate: {value:'',mode: "del",idDataPropVal:record.workActualStartDate.idDataPropVal}
                                        }
                                    })
                                }>
                                    <Icon
                                        type="close-circle"
                                        className="editable-cell-icon"
                                        onClick={this.stopPropagation}
                                    />
                                </Popconfirm>}
                            </div>
                            :
                            <div className="editable-row-operations">
                                <Button title="Начать"
                                        disabled={!record.workAssignedTo || user.obj != record.workAssignedTo.value}
                                        icon="play-circle"
                                        onClick={this.addSpecialDate(record.key, 'workActualStartDate')}
                                        className='green-btn'/>
                                {/*<Button title="CANCEL" icon="close" onClick={this.addSpecialDate(record.key, 'workActualStartDate', 'red')} className='green-btn'/>*/}
                            </div>
                    )
                }
            },
            {
                key: 'acceptanceDate',
                title: t('ACCEPTANCE_DATE'),
                dataIndex: 'acceptanceDate',
                width: '13%',
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
                                    style={record.workStatusUses && record.workStatusUses.value == this.props.tofiConstants.denied.id ?
                                    {color: 'red'} : {color: 'green'}}>{text.value || ' '}</span>
                                {record.tookUser && record.tookUser.value === user.obj &&
                                <Popconfirm title={this.props.t('CONFIRM_REMOVE')} onConfirm={() => {
                                    const mappedStatus = this.clsStatusMap[record.workType.value];
                                    this.saveProps({obj: {doItem: record.key}}, {
                                        values: {
                                            [mappedStatus]: {value: this.props.tofiConstants.appointed.id,idDataPropVal:record.workStatusUses.idDataPropVal},
                                            acceptanceDate: {value:'',mode: "del",idDataPropVal:record.acceptanceDate.idDataPropVal}
                                        }
                                    }).then(() => {

                                    const fd = new FormData();
                                    fd.append("cubeSConst", CUBE_FOR_WORKS);
                                    fd.append("dimObjConst", DO_FOR_WORKS);
                                    fd.append("objId", record.key.split('_')[1]);
                                    fd.append("cls", String(this.props.tofiConstants.casesForTemporaryUse.id));
                                    console.log('fd = ' + JSON.stringify(fd));
                                    const hideLoading = message.loading(this.props.t('REMOVING'), 30);
                                    dObjChild(fd)
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
                                })
                                }}>
                                    <Icon
                                        type="close-circle"
                                        className="editable-cell-icon"
                                        onClick={this.stopPropagation}
                                    />
                                </Popconfirm>}
                            </div>
                            :
                            record.tookUser && record.tookUser.value === user.obj &&
                            <div className="editable-row-operations">
                                <Button title="Разрешить" icon="check-circle" className='green-btn'
                                        disabled={record.workAssignedTo !== null ? record.workAssignedTo.value === this.props.user.obj?false:true:true}

                                        onClick={this.addSpecialDate(record.key, 'acceptanceDate')}/>
                                <Button title="CANCEL" icon="close"
                                        disabled={record.workAssignedTo !== null ? record.workAssignedTo.value === this.props.user.obj?false:true:true}
                                        onClick={this.addSpecialDate(record.key, 'notAccepted')} className='green-btn'/>
                            </div>
                    )
                }
            },
            {
                key: 'permitionDate',
                title: permitionDate.name[this.lng],
                dataIndex: 'permitionDate',
                width: '15%',
                filterDropdown: (
                    <div className="custom-filter-dropdown">
                        <div className="flex">
                            <DatePicker
                                format="DD-MM-YYYY"
                                value={this.state.search.permitionDate.dbeg}
                                style={{marginRight: '16px'}}
                                showToday={false}
                                onChange={this.onDateChange('permitionDate', 'dbeg')}
                            />
                            <DatePicker
                                format="DD-MM-YYYY"
                                value={this.state.search.permitionDate.dend}
                                showToday={false}
                                onChange={this.onDateChange('permitionDate', 'dend')}
                            />
                        </div>
                    </div>
                ),
                filterIcon: <Icon type="filter"
                                  style={{color: (search.permitionDate.dbeg || search.permitionDate.dend) ? '#ff9800' : '#aaa'}}/>,
                render: (text, record) => {
                    return (
                        text ?
                            <div className="editable-cell-text-wrapper">
                                {text.value|| ' '}
                                <Popconfirm title={this.props.t('CONFIRM_REMOVE')} onConfirm={() => {
                                    const mappedStatus = this.clsStatusMap[record.workType.value];
                                    this.saveProps({obj: {doItem: record.key}}, {
                                        values: {
                                            [mappedStatus]: {value: this.props.tofiConstants.allowed.id,idDataPropVal:record[mappedStatus].idDataPropVal},
                                            permitionDate: {value:'',mode: "del",idDataPropVal:record.permitionDate.idDataPropVal}
                                        }
                                    })
                                }
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
                                {record.workType && record.workType.workTypeClass !== 'userRegistration' && <Button
                                    title="Выдать"
                                    icon="right-square"
                                    disabled={
                                        !record.workStatusUses ||
                                        record.workStatusUses.value != this.props.tofiConstants.allowed.id ||
                                        !record.workActualStartDate ||
                                        !record.workAssignedTo ||
                                        user.obj != record.workAssignedTo.value
                                    }
                                    onClick={this.addSpecialDate(record.key, 'permitionDate')}
                                    className='green-btn'/>}
                            </div>
                    )
                }
            },
            {
                key: 'workActualEndDate',
                title: t('WORK_ACTUAL_END_DATE'),
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
                            {text.value|| ' '}
                            <Popconfirm title={this.props.t('CONFIRM_REMOVE')} onConfirm={() => {
                                const mappedStatus = this.clsStatusMap[record.workType.value];
                                this.saveProps({obj: {doItem: record.key}}, {
                                    values: {
                                        [mappedStatus]: {value: this.props.tofiConstants.allowed.id,idDataPropVal:record[mappedStatus].idDataPropVal},
                                        workActualEndDate: {value:'',mode: "del",idDataPropVal:record.workActualEndDate.idDataPropVal}
                                    }
                                })
                            }
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
                                        disabled={!record.workActualStartDate || !record.workAssignedTo || user.obj != record.workAssignedTo.value}
                                        onClick={this.addSpecialDate(record.key, 'workActualEndDate')}
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
        ];
        return (

            <div className="Works">
                <Modal
                    title="Выбрать период"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <span>С </span> <DatePicker onChange={(e)=>{
                        console.log(e)
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
                    <h2>{t('USES_WORKS')}</h2>
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
                                name="workType"
                                isMulti
                                isSearchable={false}
                                value={workType}
                                onChange={this.onWorkTypeChange}
                                options={['caseDeliveryToRR', 'responseToRequest', 'performPaidReq', 'conductResearch', 'orderCopyDoc', 'userRegistration']
                                    .map(c => ({
                                        value: tofiConstants[c].id,
                                        label: tofiConstants[c].name[this.lng],
                                        workTypeClass: c
                                    }))}
                                placeholder={t('WORK_TYPE')}
                            />
                        </div>
                        <div className="label-select">
                            <Select
                                name="status"
                                isMulti
                                isSearchable={false}
                                value={status}
                                onChange={this.onStatusChange}
                                isLoading={!!workStatusCreateRequirementLoading || !!workStatusCopyDocLoading || !!workStatusRegistrationLoading}
                                options={workStatusCreateRequirementOptions && workStatusCopyDocOptions && workStatusRegistrationOptions ?
                                    uniqBy([...workStatusCreateRequirementOptions, ...workStatusCopyDocOptions, ...workStatusRegistrationOptions], 'id')
                                        .map(option => ({value: option.id, label: option.name[this.lng]})) : []}
                                placeholder={t('STATUS')}
                                onMenuOpen={this.loadOptionsArr(['workStatusCreateRequirement', 'workStatusCopyDoc', 'workStatusRegistration'])}
                            />
                        </div>
                        <div className="label-select">
                            <SelectVirt
                                name="performer"
                                isMulti
                                isSearchable
                                isLoading={workAssignedToLoading}
                                onMenuOpen={this.loadOptions('workAssignedTo')}
                                optionHeight={40}
                                value={performer}
                                onChange={this.onPerformerChange}
                                options={this.props.workAssignedToOptions ? this.props.workAssignedToOptions.map(option => ({
                                    value: option.id,
                                    label: option.name[this.lng]
                                })) : []}
                                placeholder={t('PERFORMER')}
                            />
                        </div>
                        <Button
                        type="primary" icon="reload" loading={this.state.iconLoading}  onClick={()=>this.getCubeAct()}
                        />
                        {/*<div className="label-select">
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
                        columns={columns}
                        dataSource={this.filteredData}
                        changeSelectedRow={this.changeSelectedRow}
                        rowClassName={rec => {
                            if(rec.workStatusUses!=null){
                            let newClass=
                                ['accepted','completed','returned'].some(c => tofiConstants[c].id == rec.workStatusUses.value) ? 'completed' :
                                ['during','appointed','issued','requirementCreated','pending','appointmentProcess','needFor','found','created','allowed','denied'].some(c => tofiConstants[c].id == rec.workStatusUses.value) ? 'appointed':
                                ['notAccepted','notFound'].some(c => tofiConstants[c].id == rec.workStatusUses.value) ? 'danger' :'';
                            let selectedRow='';
                            if(this.state.selectedRow!=null){ if (this.state.selectedRow.key==rec.key) {selectedRow='row-selected'}};
                            return newClass+' '+selectedRow;
                                }
                            }
                        }
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
                            <UsesWorksCard
                                t={t}
                                tofiConstants={tofiConstants}
                                initialValues={this.state.initialValues}
                                onCreateObj={this.onCreateObj}
                                saveProps={this.saveProps}
                                clsStatusMap={this.clsStatusMap}
                                // user={!!user?user:this.props.user}
                              user={user}
                            />
                        </SiderCard>
                    </CSSTransition>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const toReturn = {
        tofiConstants: state.generalData.tofiConstants,
        cubeForWorks: state.cubes[CUBE_FOR_WORKS],
        workPriorityOptions: state.generalData[WORK_PRIORITY],
        workStatusCreateRequirementOptions: state.generalData.workStatusCreateRequirement,
        workStatusCopyDocOptions: state.generalData.workStatusCopyDoc,
        workStatusRegistrationOptions: state.generalData.workStatusRegistration,
        checkingTypeOptions: state.generalData[CHECKING_TYPE],
        workAssignedToOptions: state.generalData.workAssignedTo,
        user: state.auth.user
    };
    return toReturn
}

export default connect(mapStateToProps, {getCube, getPropVal, getAllObjOfCls})(Works);