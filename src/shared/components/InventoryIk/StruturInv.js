import React from 'react';
import {connect} from 'react-redux';
import {Popconfirm, Icon, Button, message} from 'antd';
import {isEmpty, isEqual, map, forOwn} from "lodash";
import moment from 'moment';

import AntTable from '../AntTable'
import ClassificationHierarchyInput from './ClassificationHierarchyInput';
import {SYSTEM_LANG_ARRAY} from '../../constants/constants';
import {createObj, getCube, getObjByObjVal, updateCubeData, getFundCountData, dObj} from '../../actions/actions';
import {getPropMeta, onSaveCubeData, parseCube_new, parseForTable} from '../../utils/cubeParser';
import {DO_FOR_INV} from "../../constants/tofiConstants";

class StruturInv extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            loading: false,
            selectedRow: null,
            selectedRowKey: '',
            inputMode: false,
            inputVariant: '',
            referenceNameInput: '',
            indexScemeInput: '',
            spellVariantInput: '',
        }
    }

    componentDidMount() {
        this.getData()
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.hierarchyRefresh > 0 && nextProps.hierarchyRefresh > this.props.hierarchyRefresh) {
            this.setState({
                selectedRow: null,
                selectedRowKey: '',
                inputMode: false,
                initialValues: {
                    referenceNameInput: '',
                    indexScemeInput: '',
                    spellVariantInput: '',
                },
            })
            this.getData()
        }

        if (!isEmpty(nextProps.InvItemStructur) && !isEmpty(nextProps.tofiConstants)
            && this.props.InvItemStructur !== nextProps.InvItemStructur) {

            const {doForInv, dpForInv} = nextProps.tofiConstants;

            const parseCubeData = parseCube_new(
                nextProps.InvItemStructur['cube'],
                [],
                'dp',
                'do',
                nextProps.InvItemStructur[`do_${doForInv.id}`],
                nextProps.InvItemStructur[`dp_${dpForInv.id}`],
                `do_${doForInv.id}`,
                `dp_${dpForInv.id}`).map(this.renderTableDataInv)
            debugger
            this.setState({
                data: parseCubeData,
                loading: false,
            })

            function getChildren(parentId, array) {
                let children = [];
                array.forEach((item) => {
                    if (item.parent === parentId) {
                        let child = item;
                        let myChildren = getChildren(item.key, array)
                        if (myChildren.length > 0) child.children = myChildren;
                        children.push(child);
                    }
                })
                return children;
            }
        }
    }

    getData() {
        this.setState({loading: true});
        const filters = {
            filterDOAnd: [
                {
                    dimConst: "doForInv",
                    concatType: "and",
                    conds: [
                        {
                            ids: String(this.props.initialValues.key),
                        }, {
                            clss: "structuralSubdivisionList"
                        }
                    ]
                }
            ]
        }
        this.props.getCube('CubeForAF_Inv', JSON.stringify(filters), {customKey: 'InvItemStructur'}).then(() => this.setState({loading: false}))
            .catch(err => {
                console.error(err);
                this.setState({loading: false})
            }).catch(e => {
            console.log(e)

        })
    }

    renderTableDataInv = (item, ids) => {
        const constArr = ['invNumber',];


        const result = {
            key: item.id,
            ids: ids + 1,
            name: item.name,
        };
        parseForTable(item.props, this.props.tofiConstants, result, constArr);
        result.invDates = result.invDates ? result.invDates.map(str => ({value: str})) : [];
        return result;
    }

    onTableRowExpand = (expanded, record) => {
        var keys = [];
        if (expanded) {
            keys.push(record.key); // I have set my record.id as row key. Check the documentation for more details.
        }

        this.setState({expandedRowKeys: keys});
    }
    changeSelectedRow = (rec, openAtOnce) => {
        this.lng = localStorage.getItem('i18nextLng');

        debugger
        if (this.props.readOnly) return;
        if (this.state.inputMode) return;

        const recEdit = {
            referenceName: rec.name[this.lng],
        }
        if (openAtOnce === true && !this.state.inputMode) {
            this.setState({
                selectedRow: rec,
                selectedRowKey: rec.key,
                initialValues: recEdit,
                inputMode: true,
                inputVariant: 'editSection'
            })
            return;
        }
        if (isEmpty(this.state.selectedRow) || !isEqual(this.state.selectedRow, rec)) {
            this.setState({
                selectedRow: rec,
                selectedRowKey: rec.key
            })
        } else {
            this.setState({
                selectedRow: rec,
                selectedRowKey: rec.key,
                initialValues: recEdit,
                inputMode: true,
                inputVariant: 'editSection'
            })
        }
    }
    addSection = () => {
        this.setState({
            inputMode: true,
            inputVariant: 'newSection'
        });
    }
    addSubSection = () => {
        this.setState({
            inputMode: true,
            inputVariant: 'newSubSection'
        });
    }
    cancelInput = () => {
        this.setState({
            inputMode: false,
            initialValues: {
                referenceNameInput: '',
                indexScemeInput: '',
                spellVariantInput: ''
            },
        });
    }
    saveSection = (data) => {
        debugger
        const {inputVariant, selectedRow, selectedRowKey} = this.state;
        const {tofiConstants, icConst, referenceSubtype, initialValues} = this.props;
        const {referenceName, ...rest} = data;
        const referenceType = tofiConstants[referenceSubtype];
        const cube = {
            cubeSConst: 'CubeForAF_Inv',
            doConst: 'doForInv',
            dpConst: 'dpForInv'
        };
        const name = {};
        SYSTEM_LANG_ARRAY.forEach(lang => {
            name[lang] = referenceName
        });

        switch (inputVariant) {

            case 'newSection':
            case 'newSubSection': {
                let parent = '';
                if (inputVariant === 'newSection') {
                    parent = selectedRow ? selectedRow.parent : initialValues.key;
                }
                if (inputVariant === 'newSubSection') {
                    parent = selectedRowKey;
                }
                //
                forOwn(rest, (value, key) => {
                    if (!value) delete rest[key];
                })
                //
                const obj = {
                    name,
                    fullName: name,
                    clsConst: 'structuralSubdivisionList',
                    parent: parent.split("_")[1]
                };
                const hideCreateObj = message.loading(this.props.t('CREATING_NEW_OBJECT'), 0);
                createObj(cube, obj)
                    .then(res => {
                        hideCreateObj();
                        if (res.success) {
                            // target.key = res.data.idItemDO;
                            this.onSaveCubeData({cube, obj}, rest, res.data.idItemDO, {}, {})
                                .then(resp => {
                                    if (resp.success) {
                                        // delete target.editable;
                                        // this.setState({ data: newData });
                                        this.setState({
                                            inputMode: false,
                                            initialValues: {
                                                referenceNameInput: '',
                                                indexScemeInput: '',
                                                spellVariantInput: '',
                                            },
                                        })
                                        this.getData()
                                    }
                                }).catch(err => console.log(err));
                        }
                    }).catch(err => {
                    hideCreateObj();
                    console.log(err);
                });
                break;
            }

            case 'editSection': {
                const objDataProp = referenceName === selectedRow.referenceName ? {} : {name};
                this.onSaveCubeData({cube}, rest, selectedRowKey, objDataProp, {})
                    .then(resp => {
                        if (resp.success) {

                            this.setState({
                                inputMode: false,
                                initialValues: {
                                    referenceNameInput: '',
                                    indexScemeInput: '',
                                    spellVariantInput: '',
                                },
                            })
                            this.getData()
                        }
                    })
            }
        }
    }
    onSaveCubeData = async (objVerData, values, doItemProp, objDataProp, valOld) => {
        // let hideLoading
        // try {
        //     const c ={
        //         cube:{
        //             cubeSConst: "csClassificationShem",
        //             doConst: "doForSchemClas",
        //             dpConst: "dpForSchemClas",
        //             data:this.props[objVerData.cube.cubeSConst]
        //         },
        //         obj:{
        //             doItem:doItemProp
        //         }
        //     }
        //
        //     const v ={
        //         values:values,
        //         complex:"",
        //         oFiles:{}
        //     }
        //     const objData = objDataProp
        //     const  t = this.props.tofiConstants
        //     this.setState({loading: true, });
        //
        //     hideLoading = message.loading(this.props.t('UPDATING_PROPS'), 0);
        //     const resSave = await onSaveCubeData(c, v, t, objData);
        //     hideLoading();
        //     if(!resSave.success) {
        //         message.error(this.props.t('PROPS_UPDATING_ERROR'));
        //         resSave.errors.forEach(err => {
        //             message.error(err.text)
        //         });
        //         return Promise.reject(resSave);
        //     }
        //     message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'));
        //     return this.props.getCube('csClassificationShem', JSON.stringify(this.filters))
        //
        // } catch (e) {
        //     typeof hideLoading === 'function' && hideLoading();
        //     this.setState({ loading: false });
        //     console.warn(e);
        // }


        let datas = [];
        try {
            datas = [{
                own: [{doConst: objVerData.cube.doConst, doItem: doItemProp, isRel: "0", objData: objDataProp}],
                props: map(values, (val, key) => {
                    console.log(values, val, key)
                    const propMetaData = getPropMeta(this.props[objVerData.cube.cubeSConst]["dp_" + this.props.tofiConstants[objVerData.cube.dpConst].id], this.props.tofiConstants[key]);
                    console.log(val, valOld, valOld[key], key);
                    let value = val;
                    let oldValue = valOld[key];
                    if ((propMetaData.typeProp === 315 || propMetaData.typeProp === 311 || propMetaData.typeProp === 317) && typeof val === 'string') {
                        value = {kz: val, ru: val, en: val};
                        oldValue = oldValue && {kz: valOld[key], ru: valOld[key], en: valOld[key]};
                    }
                    if (propMetaData.typeProp === 312 && typeof value === 'string') {
                        value = value.split('-').reverse().join('-');
                        oldValue = oldValue && oldValue.split('-').reverse().join('-');
                    }
                    if (val && typeof val === 'object' && val.value) {
                        value = String(val.value);
                        oldValue = oldValue && String(valOld[key].value);
                    }
                    if (val && typeof val === 'object' && val.mode) propMetaData.mode = val.mode;
                    if (propMetaData.isUniq === 2 && val[0].value) {
                        propMetaData.mode = val[0].mode;
                        value = val.map(v => String(v.value)).join(",");
                        oldValue = oldValue && valOld[key].map(v => String(v.value)).join(",");
                    }
                    return {
                        propConst: key,
                        val: value,
                        oldValue,
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
            return err;
        }
        const hideLoading = message.loading(this.props.t('UPDATING_PROPS'), 0);
        return updateCubeData(objVerData.cube.cubeSConst, moment().format('YYYY-MM-DD'), JSON.stringify(datas))
            .then(res => {
                hideLoading();
                if (res.success) {
                    message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'));
                    this.props.refreshRecord({}, true);
                    if (this.filters) {
                        this.setState({loading: true});
                        return this.props.getCube('CubeForAF_Inv', JSON.stringify(this.filters))
                        // .then(() => {
                        //   this.setState({loading: false});
                        //   return {success: true}
                        // })
                    } else {
                        return {success: true}
                    }
                } else {
                    message.error(this.props.t('PROPS_UPDATING_ERROR'));
                    if (res.errors) {
                        res.errors.forEach(err => {
                            message.error(err.text);
                        });
                        return {success: false}
                    }
                }
            })
    };

    remove = key => {
        const data = this.state.data;
        const items = [];
        data.forEach((item) => {
            if (item.key === key) return;
            if (item.children !== undefined) {
                const children = [];
                item.children.forEach((child) => {
                    if (child.key === key) return;
                    children.push(child);
                });
                if (children.length === 0) {
                    delete item.children
                } else {
                    item.children = children;
                }
            }
            items.push(item);
        });
        //const newData = this.state.data.filter(item => item.key !== key);
        //this.setState({ data: newData });
        this.setState({data: items});
    };

    render() {
        const {loading, inputMode, recEdit, initialValues} = this.state;
        const {t, readOnly} = this.props;

        this.lng = localStorage.getItem('i18nextLng');

        const columns = [
            {title: t('SECTION'), dataIndex: 'name', key: 'name', width: '45%', render: obj => obj && obj[this.lng]},
            {
                title: '', dataIndex: '', key: 'action', width: '10%',
                render: (text, record) => {
                    return (
                        <div>
                            {!readOnly ?
                                <div className="editable-row-operations">
                                    <a><Icon type="edit" style={{fontSize: '14px'}}
                                             onClick={() => this.changeSelectedRow(record, true)}/></a>
                                    <Popconfirm title={this.props.t('CONFIRM_REMOVE')}
                                                onClick={e => e.stopPropagation()} onConfirm={() => {
                                        const fd = new FormData();
                                        fd.append("cubeSConst", "CubeForAF_Inv");
                                        fd.append("dimObjConst", "doForInv");
                                        fd.append("objId", record.key.split('_')[1]);
                                        const hideLoading = message.loading(this.props.t('REMOVING'), 30);
                                        dObj(fd)
                                            .then(res => {
                                                hideLoading();
                                                if (res.success) {
                                                    message.success(this.props.t('SUCCESSFULLY_REMOVED'));
                                                    this.remove(record.key)
                                                } else {
                                                    throw res
                                                }
                                            }).catch(err => {
                                            console.error(err);
                                            message.error(this.props.t('REMOVING_ERROR'))
                                        })
                                    }}>
                                        <a style={{color: '#f14c34', marginLeft: '10px', fontSize: '14px'}}
                                           disabled={readOnly}><Icon type="delete" className="editable-cell-icon"/></a>
                                    </Popconfirm>
                                </div>
                                :
                                ''
                            }
                        </div>
                    );
                },
            },
        ];
        const openedBy = inputMode ? '' : 'ClassificationHierarchy';
        return (
            <div className="Classification-Schemas-Hierarchy">
                {!inputMode &&
                <span>
            <Button style={{margin: '5px'}} onClick={this.addSection} disabled={readOnly}>
              {this.props.t('ADD_SECTION')}
            </Button>
            <Button style={{margin: '5px'}} onClick={this.addSubSection}
                    disabled={this.state.selectedRowKey === '' || readOnly}>
              {this.props.t('ADD_SUB_SECTION')}
            </Button>
          </span>
                }
                {inputMode &&
                <ClassificationHierarchyInput
                    t={t}
                    initialValues={initialValues}
                    cancelInput={this.cancelInput}
                    saveSection={this.saveSection}
                />
                }
                <AntTable
                    loading={loading}
                    columns={columns}
                    openedBy={openedBy}
                    changeSelectedRow={this.changeSelectedRow}
                    rowClassName={record => this.state.selectedRowKey === record.key ? 'row-selected' : ''}
                    onExpand={this.onTableRowExpand}
                    dataSource={this.state.data}
                />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        csClassificationShem: state.cubes.csClassificationShemChildren,
        tofiConstants: state.generalData.tofiConstants,
        InvItemStructur: state.cubes.InvItemStructur,

        user: state.auth.user
    }
}

export default connect(mapStateToProps, {getCube, getObjByObjVal})(StruturInv);
