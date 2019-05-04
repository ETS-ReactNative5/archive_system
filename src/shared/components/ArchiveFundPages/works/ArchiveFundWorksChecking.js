import React from 'react';
import {Breadcrumb, Button, Checkbox, Input, Table, message} from 'antd';
import {Link} from 'react-router-dom';
import {isEmpty, differenceWith,map, isEqual, pickBy} from 'lodash';
import AntModal from '../../AntModal';
import {addDerivativeWorks, createObj,getCube,  getValuesOfObjsWithProps, updateCubeData} from '../../../actions/actions';
import {onSaveCubeData,getPropMeta, parseCube_new, parseForTable} from '../../../utils/cubeParser';

import {CUBE_FOR_WORKS, DO_FOR_WORKS,CUBE_FOR_AF_CASE,
    DO_FOR_CASE,
    DP_FOR_CASE} from '../../../constants/tofiConstants';

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
        selectedRow: [],
        selectedWorks:[],
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
                    <Breadcrumb.Item><a role='button' onClick={this.props.history.goBack}>Работы по учету и хранению</a></Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <b>{this.props.tofiConstants.caseAvailabilityCheck.name[this.lng]}
                            <span style={{fontSize: '13px',}}>&#8594;</span>
                            {this.props.t('FUND_NUMB')}: {this.state.workRegFundNumber + this.state.workRegFundIndex}, {this.props.t('INV_NUMB')}: {this.state.workRegInvNumber}
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
                <Button onClick={this.changeSelectedButton}>Добавить дело</Button>
                <Button onClick={this.openModal}>{this.props.t('SAVE_TEMPORARY_STATE')}</Button>
                <Link to="/archiveFund/works"><Button>{this.props.t('CANCEL')}</Button></Link>
                <Button onClick={() => this.sendAddedWorks('complete')}>{this.props.t('COMPLETE')}</Button>
            </div>
        )
    };

    componentDidMount() {

        if (this.props.location && this.props.location.state && this.props.location.state.data) {
            this.setState({data: this.props.location.state.data.map(this.renderTableData)});

            const fd = new FormData();
            const datas = [{
                objs: `${this.props.match.params.fund.split('_')[0]}`,
                propConsts: "caseNumber,fundIndex"
            }, {objs: `${this.props.match.params.fund.split('_')[1]}`, propConsts: "invNumber"}];
            fd.append('datas', JSON.stringify(datas));
            getValuesOfObjsWithProps(fd)
                .then(res => {
                    if (res.success) {
                        const workRegFundNumber = res.data.find(obj => obj.id == this.props.match.params.fund.split('_')[0]).caseNumber[this.lng];
                        const workRegFundIndex = res.data.find(obj => obj.id == this.props.match.params.fund.split('_')[0]).fundIndex[this.lng];
                        const workRegInvNumber = res.data.find(obj => obj.id == this.props.match.params.fund.split('_')[1]).invNumber[this.lng];
                        this.setState({workRegFundNumber, workRegFundIndex, workRegInvNumber})
                    }
                }).catch(err => {
                console.error(err);
            })
            const filters = {
                filterDOAnd: [
                    {
                        dimConst: DO_FOR_CASE,
                        concatType: "and",
                        conds: [
                            {
                                //ids: '1007_144376'
                                data: {
                                    valueRef: {
                                        id: "1006_2383812"
                                    }
                                }
                            }
                        ]
                    }
                ]
            };
            this.setState({loading: true});
            this.props.getCube(CUBE_FOR_AF_CASE, JSON.stringify(filters))
                .then(() => this.setState({loading: false}))
                .catch(err => {
                    console.error(err);
                    this.setState({loading: false})
                })
        }
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
            selectedWorks:this.props.location.state.stateRecord

        })

    };
    changeSelectedButton = () => {
        this.setState({
            openCard: true,
            selectedWorks:this.props.location.state.stateRecord
        })

    };

    getRespCard(invType, docType) {
        const {
            invTypePerm,
            uprDoc,
            uprNTD,
            invTypeVideo,
            videoDoc,
            invTypeDigital,
            invTypeLS,
            invTypeAlbum,
            LSDoc,
            invTypePhoto,
            photoDoc,
            invTypePhonoGram,
            phonoDoc,
            invTypeMovie,
            movieDoc,
            invTypePhonoMag
        } = this.props.tofiConstants;
        const params = {
            t: this.props.t,
            initialValues: this.state.selectedRow,
            stateRecord:this.state.selectedWorks,
            saveProps: this.onCreateObj,
            tofiConstants: this.props.tofiConstants
        };
        switch (true) {
            case invType == invTypeLS.id && docType == LSDoc.id:
                return <CardCase_invTypeLS_LSDoc {...params} />;
            default:
                return <CardCase_invTypeLS_LSDoc {...params} />;
        }
    }

    saveProps = async (c, v, t = this.props.tofiConstants, objData) => {
        let hideLoading;
        try {
            if (!c.cube) c.cube = {
                cubeSConst: CUBE_FOR_AF_CASE,
                doConst: DO_FOR_CASE,
                dpConst: DP_FOR_CASE,
            };
            if (!c.cube.data) c.cube.data = this.props.CubeForAF_Case;
            console.log(this.props.CubeForAF_Case);
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
            /*this.setState({loading: true, openCard: false});
             await this.getCubeAct();*/
            return resSave;
        }
        catch (e) {
            typeof hideLoading === 'function' && hideLoading();
            this.setState({loading: false});
            console.warn(e);
        }
    };
    onCreateObj = ({name, ...values}) => {
        const cube = {
            cubeSConst: CUBE_FOR_AF_CASE,
        };

        const obj = {
            name: name,
            fullName: name,
            clsConst: 'caseList',

        };
        const objdata = {
            name: name,
            fullName: name,
        };


        const hideCreateObj = message.loading(this.props.t('CREATING_NEW_OBJECT'), 0);
        return createObj(cube, obj)
            .then(res => {
                hideCreateObj();
                if (res.success) {

                    return this.onSaveCubeData(values ,res.data.idItemDO, objdata)
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
    };

    onSaveCubeData = ({caseInventory, ...values}, doItemProp, objDataProp) => {
        const filters = {
            filterDOAnd: [{
                dimConst: 'doForCase',
                concatType: 'and',
                conds: [
                    {
                        data: {
                            valueRef: {
                                id: String("1006_2383812")
                            }
                        }
                    }
                ]
            }]
        };
        let datas = [];
        try {
            datas = [{
                own: [{doConst: DO_FOR_CASE, doItem: doItemProp, isRel: "0", objData: objDataProp}],
                props: map(values, (val, key) => {
                    const propMetaData = getPropMeta(this.props.CubeForAF_Case["dp_" + this.props.tofiConstants[DP_FOR_CASE].id], this.props.tofiConstants[key]);
                    let value = val;
                    if ((propMetaData.typeProp === 315 || propMetaData.typeProp === 311 || propMetaData.typeProp === 317) && typeof val === 'string') value = {
                        kz: val,
                        ru: val,
                        en: val
                    };
                    if (val && typeof val === 'object' && val.value) value = String(val.value);
                    if (val && typeof val === 'object' && val.mode) propMetaData.mode = val.mode;
                    if (propMetaData.isUniq === 2 && val[0] && val[0].value) {
                        propMetaData.mode = val[0].mode;
                        value = val.map(v => String(v.value)).join(",");
                    }
                    return {
                        propConst: key,
                        val: value,
                        typeProp: String(propMetaData.typeProp),
                        periodDepend: String(propMetaData.periodDepend),
                        isUniq: String(propMetaData.isUniq),
                        mode: propMetaData.mode
                    }
                }),
                periods: [{periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31'}]
            }];
        } catch (err) {
            console.error(err);
            return Promise.reject();
        }
        const hideLoading = message.loading(this.props.t('UPDATING_PROPS'), 30);
        return updateCubeData(CUBE_FOR_AF_CASE, moment().format('YYYY-MM-DD'), JSON.stringify(datas), {}, {
            caseInventory
        })
            .then(res => {
                hideLoading();
                if (res.success) {
                    message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'));
                    this.setState({loading: true});
                    return this.props.getCube(CUBE_FOR_AF_CASE, JSON.stringify(filters))
                        .then(() => {
                            this.setState({loading: false, openCard: false});
                            return {success: true}
                        })
                } else {
                    message.error(this.props.t('PROPS_UPDATING_ERROR'));
                    if (res.errors) {
                        res.errors.forEach(err => {
                            message.error(err.text);
                        });
                        return Promise.reject();
                    }
                }
            })
    };



    render() {
        if (isEmpty(this.props.tofiConstants)) return null;

        const {t, tofiConstants: {caseNumber, restorationOfFadingTexts, disinfection, disinfestation, restoration, binding, irreparablyDamaged}} = this.props;
        const data = this.state.data;

        this.lng = localStorage.getItem('i18nextLng');
        return (
            <div className="WorksChecking EditCardCases__body">
                <Table
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
                            width: '5%'
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
                                <Checkbox checked={text} disabled={record.temporaryUse}
                                          onChange={e => this.onChange(e.target.checked, record.key, 'irreparablyDamaged')}/>
                            )
                        }
                    ]}
                    bordered
                    size="small"
                    rowClassName={(rec, idx) => (this.props.location.state && rec.numb == this.props.location.state.workIndexNumber ? "row-selected" : "")}
                    title={this.renderTableHeader}
                    footer={this.renderTableFooter}
                    onRowDoubleClick={this.changeSelectedRow}

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
                        closer={<Button type='danger' className='right' onClick={() => this.setState({openCard: false})}
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
                    <Input type="number" value={this.state.modal.inputValue} onChange={this.onInputChange}/>
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

