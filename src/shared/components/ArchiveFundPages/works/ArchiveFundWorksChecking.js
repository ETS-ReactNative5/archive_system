import React from 'react';
import {Breadcrumb, Button, Checkbox, Input, Table, message} from 'antd';
import {Link} from 'react-router-dom';
import {isEmpty, differenceWith, map, isEqual, pickBy} from 'lodash';
import AntModal from '../../AntModal';
import {
    addDerivativeWorks,
    createObj,
    getCube,
    getValuesOfObjsWithProps,
    rabota1,
    updateCubeData
} from '../../../actions/actions';
import {
    onSaveCubeData,
    getPropMeta,
    parseCube_new,
    parseForTable
} from '../../../utils/cubeParser';

import {
    CUBE_FOR_WORKS, DO_FOR_WORKS, CUBE_FOR_AF_CASE,
    DO_FOR_CASE,
    DP_FOR_CASE
} from '../../../constants/tofiConstants';

import moment from 'moment';
import {CSSTransition} from "react-transition-group";
import SiderCard from "./SiderCardWorks";
import CardCase_invTypeLS_LSDoc from "./invTypeLS_LSDoc/CardCase_invTypeLS_LSDocWorks";
import {connect} from "react-redux";

/*eslint eqeqeq:0*/
class RenderCheckbox extends React.Component {
    state = {
        checked: false
    };

    componentDidMount() {
        this.setState({checked: this.props.checked})
    }

    onChange = e => {
        this.setState({checked: e.target.checked});
    };

    render() {
        return <Checkbox checked={this.state.checked} onChange={this.onChange}/>
    }
}

class ArchiveFundWorksChecking extends React.PureComponent {

    state = {
        sortState: true,
        selectedRow: [],
        selectedWorks: [],
        openCard: false,
        loading: false,

        data: [],
        modal: {
            visible: false,
            inputValue: 0
        },
        workRegFundNumber: '',
        workRegFundIndex: '',
        workRegInvNumber: '',
    };

    onChange = (pagination, filters, sorter) => {
        if(sorter.columnKey === "caseNumber") {
            this.setState({sortState: !this.state.sortState});
        }
    }
    openModal = () => {
        this.setState({modal: {...this.state.modal, visible: true}})
    };
    handleModalOk = () => {
        this.sendAddedWorks('temp')
    };
    handleModalCancel = () => {
        this.setState({
            modal: {
                visible: false
            }
        });
    };
    onInputChange = e => {
        if ((e.target.value > 0 && e.target.value <= this.state.data.length) || e.target.value === '') {
            this.setState({modal: {...this.state.modal, inputValue: e.target.value}})
        }
    };

    sendAddedWorks = mode => {
        const initData = this.props.location.state.data.map(this.renderTableData);
        const diffInit = differenceWith(initData, this.state.data, isEqual);
        const diffData = this.state.data.filter(el => diffInit.some(elem => elem.key == el.key));
        const fd = new FormData();
        fd.append('workId', this.props.location.state.workId.split('_')[1]);
        fd.append('workRegFund', this.props.match.params.fund.split('_')[0]);
        fd.append('workRegInv', this.props.match.params.fund.split('_')[1]);
        fd.append('mode', mode);
        fd.append('cases', JSON.stringify(diffData.map((el, idx) =>
        ({
            caseId: String(el.key),
            changes: pickBy(el, (val, key) => !isEqual(val, diffInit[idx][key]))
        })
        )));
        const hideLoading = message.loading(this.props.t('CREATING_NEW_OBJECT'), 30);
        addDerivativeWorks(fd)
        .then(res => {
            hideLoading();
            if (res.success) {
                message.success(this.props.t('OBJECT_CREATED_SUCCESSFULLY'));
                const datas = mode === 'temp' ? [{
                    own: [{
                        doConst: DO_FOR_WORKS,
                        doItem: this.props.location.state.workId,
                        isRel: "0",
                        objData: {}
                    }],
                    props: [
                        {
                            propConst: 'workIndexNumber',
                            val: String(this.state.modal.inputValue),
                            typeProp: '21',
                            periodDepend: '2',
                            isUniq: '1'
                        },
                        {
                            propConst: 'intermediateResultDate',
                            val: moment().format('YYYY-MM-DD'),
                            typeProp: '312',
                            periodDepend: '2',
                            isUniq: '1'
                        }
                    ],
                    periods: [{periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31'}]
                }] : [{
                    own: [{
                        doConst: DO_FOR_WORKS,
                        doItem: this.props.location.state.workId,
                        isRel: "0",
                        objData: {}
                    }],
                    props: [
                        {
                            propConst: 'workStatusAvailabilityCheck',
                            val: String(this.props.tofiConstants.completed.id),
                            typeProp: '11',
                            periodDepend: '2',
                            isUniq: '1'
                        },
                        {
                            propConst: 'workActualEndDate',
                            val: moment().format('YYYY-MM-DD'),
                            typeProp: '312',
                            periodDepend: '2',
                            isUniq: '1'
                        },
                        {
                            propConst: 'intermediateResultDate',
                            val: null,
                            typeProp: '312',
                            periodDepend: '2',
                            isUniq: '1',
                            mode: 'del'
                        }
                    ],
                    periods: [{periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31'}]
                }];
                updateCubeData(CUBE_FOR_WORKS, moment().format('YYYY-MM-DD'), JSON.stringify(datas))
                .then(res => {
                    if (res.success) {
                        this.props.history.push('/works/storageWorks')
                    }
                });
            }
        })
    };

    renderTableHeader = () => {
        return (
        <div className="table-header">
            <Breadcrumb>
                <Breadcrumb.Item><a role='button' onClick={this.props.history.goBack}>Работы
                    по учету и хранению</a></Breadcrumb.Item>
                <Breadcrumb.Item>
                    <b>{this.props.tofiConstants.caseAvailabilityCheck.name[this.lng]}
                        <span style={{fontSize: '13px',}}>&#8594;</span>
                        {this.props.t('FUND_NUMB')}: {this.state.workRegFundIndex}, {this.props.t('INV_NUMB')}: {this.state.workRegInvNumber}
                    </b>
                </Breadcrumb.Item>
            </Breadcrumb>
        </div>
        )
    };
    renderTableData = (item, idx) => {
        return {
            key: item.id,
            numb: idx + 1,
            caseNumber: item.caseNumber[this.lng],
            cases: item.name[this.lng],
            disinfection: item.disinfection == 1,
            disinfestation: item.disinfestation == 1,
            restoration: item.restoration == 1,
            binding: item.binding == 1,
            restorationOfFadingTexts: item.restorationOfFadingTexts == 1,
            irreparablyDamaged: item.irreparablyDamaged == 1,
            temporaryUse: item.temporaryUse == 1,
            availability: item.temporaryUse == 0 && item.availability != 1
        }
    };
    renderTableFooter = () => {
        return (
        <div className="table-footer">
            <Button onClick={this.openCard}>Добавить дело</Button>
            <Button
            onClick={this.openModal}>{this.props.t('SAVE_TEMPORARY_STATE')}</Button>
            <Link to="/archiveFund/works"><Button>{this.props.t('CANCEL')}</Button></Link>
            <Button
            onClick={() => this.sendAddedWorks('complete')}>{this.props.t('COMPLETE')}</Button>
        </div>
        )
    };

    componentDidMount() {
        if (this.props.location && this.props.location.state && this.props.location.state.data) {
            this.setState({data: this.props.location.state.data.map(this.renderTableData)});
            const fd = new FormData();
            const datas = [{
                objs: `${this.props.match.params.fund.split('_')[0]}`,
                propConsts: "caseNumber,fundNumber"
            }, {
                objs: `${this.props.match.params.fund.split('_')[1]}`,
                propConsts: "invNumber"
            }];
            fd.append('datas', JSON.stringify(datas));
            getValuesOfObjsWithProps(fd)
            .then(res => {
                if (res.success) {
                    const workRegFundNumber = res.data.find(obj => obj.id == this.props.match.params.fund.split('_')[0]).caseNumber[this.lng];
                    const workRegFundIndex = res.data.find(obj => obj.id == this.props.match.params.fund.split('_')[0]).fundNumber[this.lng];
                    const workRegInvNumber = res.data.find(obj => obj.id == this.props.match.params.fund.split('_')[1]).invNumber[this.lng];
                    this.setState({workRegFundNumber, workRegFundIndex, workRegInvNumber})
                }
            }).catch(err => {
                console.error(err);
            });
        }
    }

    updateCase = () => {
        let target = ""
        rabota1(this.props.location.state.stateRecord.key.split('_')[1])
        .then(res => {
            if (res.success) {
                this.setState({data: res.data.map(this.renderTableData)});
                const fd = new FormData();
                const datas = [{
                    objs: `${this.props.match.params.fund.split('_')[0]}`,
                    propConsts: "caseNumber,fundIndex"
                }, {
                    objs: `${this.props.match.params.fund.split('_')[1]}`,
                    propConsts: "invNumber"
                }];
                fd.append('datas', JSON.stringify(datas));
                getValuesOfObjsWithProps(fd)
                .then(res => {
                    if (res.success) {
                        const workRegFundNumber = res.data.find(obj => obj.id == this.props.match.params.fund.split('_')[0]).caseNumber[this.lng];
                        const workRegFundIndex = res.data.find(obj => obj.id == this.props.match.params.fund.split('_')[0]).fundIndex[this.lng];
                        const workRegInvNumber = res.data.find(obj => obj.id == this.props.match.params.fund.split('_')[1]).invNumber[this.lng];
                        this.setState({
                            workRegFundNumber,
                            workRegFundIndex,
                            workRegInvNumber
                        })
                    }
                }).catch(err => {
                    console.error(err);
                });
            }
            ;
        });
    }
    onChange = (value, key, column) => {
        const newData = [...this.state.data];
        const target = newData.find(item => key === item.key);
        if (target) {
            target[column] = value;
            this.setState({data: newData});
        }
    };
    changeSelectedRow = rec => {
        this.setState({
            openCard: true,
            selectedRow: rec,
            selectedWorks: this.props.location.state.stateRecord
        })

    };

    changeSelectedButton = () => {
        this.setState({
            openCard: true,
            selectedWorks: this.props.location.state.stateRecord
        })

    };
    openCard = (invType, docType) => {
        this.setState({
            openCard: true,
            selectedRow: {},
            selectedWorks: this.props.location.state.stateRecord,
            stateRecord: this.state.selectedWorks
        });
        const params = {
            t: this.props.t,
            saveProps: this.saveProps,
            initialValues: {},
            tofiConstants: this.props.tofiConstants,
            invType: invType,
            docType: docType,
            onCreateObj: this.onCreateObj,
        };
        return <CardCase_invTypeLS_LSDoc
        {...params} />;

    };
    selectRow = (record) => {
        this.setState({selectedRow: record});
    };

    getRespCard(invType, docType) {
        const params = {
            t: this.props.t,
            saveProps: this.saveProps,
            initialValues: this.state.selectedRow,
            tofiConstants: this.props.tofiConstants,
            stateRecord: this.state.selectedWorks,
            invType: invType,
            docType: docType,
            onCreateObj: this.onCreateObj,
        };
        return <CardCase_invTypeLS_LSDoc {...params} />;

    }

    onCreateObj = ({name, documentFile, ...values}) => {
        const cube = {
            cubeSConst: CUBE_FOR_AF_CASE
        };
        const obj = {
            name: name,
            fullName: name,
            clsConst: 'caseList',

        };
        let newVal = {
            values,
            oFiles: {
                documentFile
            }
        }
        const hideCreateObj = message.loading(this.props.t('CREATING_NEW_OBJECT'), 0);
        return createObj(cube, obj)
        .then(res => {
            hideCreateObj();
            if (res.success) {
                return this.saveProps({}, newVal, this.props.tofiConstants, {}, res.data.idItemDO, {})
            } else {
                if (res.errors) {
                    res.errors.forEach(err => {
                        message.error(err.text)
                    })
                }
            }
        }).catch(err => {
            console.error(err)
        })
    }
    saveProps = async (c, v, t = this.props.tofiConstants, objData, key) => {
        let hideLoading;
        try {
            if (!c.cube) c.cube = {
                cubeSConst: CUBE_FOR_AF_CASE,
                doConst: DO_FOR_CASE,
                dpConst: DP_FOR_CASE,
            };
            if (!c.cube.data) c.cube.data = this.props.CubeForAF_Case;
            c["obj"] = {
                doItem: key
            }
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
            this.updateCase()

            return resSave;
        }
        catch(e) {
            typeof hideLoading === 'function' && hideLoading();
            this.setState({loading: false});
            console.warn(e);
        }
    }

    render() {
        if (isEmpty(this.props.tofiConstants)) return null;

        const {t, tofiConstants: {caseNumber, restorationOfFadingTexts, disinfection, disinfestation, restoration, binding, irreparablyDamaged}} = this.props;
        const data = this.state.data;

        this.lng = localStorage.getItem('i18nextLng');
        return (
        <div className="WorksChecking EditCardCases__body">
            <Table
            onChange={this.onChange}
            columns={[
                {
                    key: 'numb',
                    title: '№',
                    dataIndex: 'numb',
                    width: '5%',
                },
                {
                    key: 'caseNumber',
                    title: caseNumber.name[this.lng],
                    dataIndex: 'caseNumber',
                    width: '5%',
                    sorter: (a, b) => parseInt(a.caseNumber) - parseInt(b.caseNumber),
                    // sortOrder: this.state.sortState ? 'ascend' : 'descend',

                },
                {
                    key: 'cases',
                    title: t('CASE_NAME'),
                    dataIndex: 'cases',
                    width: '14%',
                },
                {
                    key: 'availability',
                    title: t('AVAILABILITY'),
                    dataIndex: 'availability',
                    width: '6%',
                    className: 'td-center',
                    render: (text, record) => (
                    <Checkbox checked={text}
                              onChange={(e) => this.onChange(!record.temporaryUse && e.target.checked, record.key, 'availability')}/>
                    )
                },
                {
                    key: 'temporaryUse',
                    title: t('TEMPORARY_USE'),
                    dataIndex: 'temporaryUse',
                    width: '10%',
                    className: 'td-center',
                    render: (text, record) => (
                    <Checkbox checked={text}/>
                    )
                },
                {
                    title: t('REQUIRES'),
                    children: [
                        {
                            key: 'disinfection',
                            title: disinfection.name[this.lng],
                            dataIndex: 'disinfection',
                            width: '10%',
                            className: 'td-center',
                            render: (text, record) => (
                            <Checkbox checked={text} disabled
                                      onChange={e => this.onChange(e.target.checked, record.key, 'disinfection')}/>
                            )
                        },
                        {
                            key: 'disinfestation',
                            title: disinfestation.name[this.lng],
                            dataIndex: 'disinfestation',
                            width: '10%',
                            className: 'td-center',
                            render: (text, record) => (
                            <Checkbox checked={text} disabled
                                      onChange={e => this.onChange(e.target.checked, record.key, 'disinfestation')}/>
                            )
                        },
                        {
                            key: 'restoration',
                            title: restoration.name[this.lng],
                            dataIndex: 'restoration',
                            width: '10%',
                            className: 'td-center',
                            render: (text, record) => (
                            <Checkbox checked={text} disabled
                                      onChange={e => this.onChange(e.target.checked, record.key, 'restoration')}/>
                            )
                        },
                        {
                            key: 'binding',
                            title: binding.name[this.lng],
                            dataIndex: 'binding',
                            width: '10%',
                            className: 'td-center',
                            render: (text, record) => (
                            <Checkbox checked={text} disabled
                                      onChange={e => this.onChange(e.target.checked, record.key, 'binding')}/>
                            )
                        },
                        {
                            key: 'restorationOfFadingTexts',
                            title: restorationOfFadingTexts.name[this.lng],
                            dataIndex: 'restorationOfFadingTexts',
                            width: '10%',
                            className: 'td-center',
                            render: (text, record) => (
                            <Checkbox checked={text} disabled
                                      onChange={e => this.onChange(e.target.checked, record.key, 'restorationOfFadingTexts')}/>
                            )
                        },
                    ]
                },
                {
                    key: 'irreparablyDamaged',
                    title: irreparablyDamaged.name[this.lng],
                    dataIndex: 'irreparablyDamaged',
                    width: '10%',
                    className: 'td-center',
                    render: (text, record) => (
                    <Checkbox checked={text} disabled
                              onChange={e => this.onChange(e.target.checked, record.key, 'irreparablyDamaged')}/>
                    )
                }
            ]}
            bordered
            size="small"
            rowClassName={record => this.state.selectedRow && this.state.selectedRow.key === record.key ? 'row-selected' : ''}
            title={this.renderTableHeader}
            footer={this.renderTableFooter}
            onRowDoubleClick={this.changeSelectedRow}
            onRowClick={this.selectRow}
            dataSource={data}
            pagination={{
                pageSize: 20,
                defaultCurrent: this.props.location.state && this.props.location.state.workIndexNumber && Math.ceil(Number(this.props.location.state.workIndexNumber) / 20)
            }}
            scroll={{x: 1500, y: '100%'}}
            />

            <CSSTransition
            in={this.state.openCard}
            timeout={300}
            classNames="right card"
            unmountOnExit
            >
                <SiderCard
                closer={<Button type='danger' className='right'
                                onClick={() => this.setState({openCard: false})}
                                shape="circle" icon="arrow-right"/>}
                >
                    {this.getRespCard(this.props.invType, this.props.docType)}
                </SiderCard>
            </CSSTransition>
            <AntModal
            visible={this.state.modal.visible}
            title={t('INDICATE_NUMBER_TITLE')}
            onOk={this.handleModalOk}
            onCancel={this.handleModalCancel}
            >
                <label>{t('INDICATE_NUMBER_LABEL')}</label>
                <Input type="number" value={this.state.modal.inputValue}
                       onChange={this.onInputChange}/>
            </AntModal>
        </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        CubeForAF_Case: state.cubes[CUBE_FOR_AF_CASE],

    }
}

export default connect(mapStateToProps, {getCube})(ArchiveFundWorksChecking)

