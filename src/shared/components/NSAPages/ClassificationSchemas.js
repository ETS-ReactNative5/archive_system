import React from 'react';
import {Button, Icon, Table as AntTable, Input, Popconfirm, message} from 'antd';
import Select from '../Select';
import SiderCard from './_SiderCard';
import {connect} from 'react-redux';
import moment from "moment";
import CSSTransition from "react-transition-group/CSSTransition";
import {isEmpty, isEqual, map, orderBy} from "lodash";
import {SYSTEM_LANG_ARRAY} from '../../constants/constants';
import {
    createObj,
    getCube,
    getObjByObjVal,
    updateCubeData,
    dObj
} from '../../actions/actions';
import {getPropMeta,onSaveCubeData, parseCube_new} from '../../utils/cubeParser';

const EditableCell = ({editable, value, onChange}) => (
<div>
    {editable
    ? <Input style={{margin: '-5px 0'}} value={value}
             onChange={e => onChange(e.target.value)}/>
    : value
    }
</div>
);
const EditableSelect = ({editable, value, onChange, options}) => (
<div>
    {editable
    ? <Select
    style={{margin: '-5px 0'}}
    value={value}
    onChange={e => onChange(e)}
    options={options}
    optionHeight={40}
    />
    : value ? value.label : ''
    }
</div>
);

class ClassificationSchemas extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentTablePage: null,
            selectedTableRowKey: '',
            selectedTableReferenceSubtype: '',
            data: [],
            loading: false,
            openCard: false,
            openNewRec: false,
            initialValues: {},
            selectedRow: null,
            search: {
                workPriority: '',
                referenceName: '',
                referenceType:'',
                dateCreateShem:'',
                approvalDateMetodika:''
            },
            newRec: {
                referenceName: '',
                referenceType: ''
            },
            sidebarActiveKey: 'description',
        }
    }

    changeSelectedRow = (rec, openAtOnce) => {
        if (rec.editable) {
            if (this.state.openCard) {
                this.setState({openCard: false});
            }
            return;
        }

        if (this.state.data[0].editable) return;

        const recEdit = {
            referenceName: {value: rec.referenceName},
            referenceType: {value:rec.referenceType.label},
            vidGuidebook: rec.vidGuidebook,
            oblastPutev: rec.oblastPutev,
            rubrikPutev: rec.rubrikPutev,
            vidKatalog: rec.vidKatalog,
            oblastKatalog: rec.oblastKatalog,
            vidUkaz: rec.vidUkaz,
            oblastUkaz: rec.oblastUkaz,
            rubrikUkaz: rec.rubrikUkaz,
            vidObzora: rec.vidObzora,
            oblastObzor: rec.oblastObzor,
            theme: rec.theme,
            group: rec.group,
            goalSprav: rec.goalSprav,
            method: rec.method,
            metodikaText: rec.metodikaText,
            approvalDateMetodika: rec.approvalDateMetodika,
            protocol: rec.protocol,
            lastChangeDateScheme: rec.lastChangeDateScheme,
            changesAuthor: rec.changesAuthor,
            requisites: rec.requisites
        }
        const {referenceTypeObj} = rec.referenceType;
        let referenceSubType = '';
        switch(referenceTypeObj) {
            case 'clsPutev':
                referenceSubType = 'nodeGuidebook';
                break;
            case 'clsKatalog':
                referenceSubType = 'nodeKatalog';
                break;
            case 'clsUkaz':
                referenceSubType = 'nodeUkaz';
                break;
            case 'clsObzor':
                referenceSubType = 'nodeObzor';
                break;
        }
        if (openAtOnce === true) {
            rec.valOld = {...rec};
            this.setState({
                initialValues: recEdit,
                openCard: true,
                sidebarActiveKey: 'description',
                selectedRow: rec,
                selectedTableRowKey: rec.key,
                selectedTableReferenceSubtype: referenceSubType
            })
            return;
        }
        if ((isEmpty(this.state.selectedRow) && !this.state.openCard) || (this.state.selectedRow.key !== rec.key && !this.state.openCard)) {
            this.setState({
                selectedRow: rec,
                selectedTableRowKey: rec.key,
                selectedTableReferenceSubtype: referenceSubType
            })
        } else {
            rec.valOld = {...rec};
            this.setState({
                initialValues: recEdit,
                openCard: true,
                sidebarActiveKey: 'description',
                selectedRow: rec,
                selectedTableRowKey: rec.key,
                selectedTableReferenceSubtype: referenceSubType
            })
        }
    };

    componentDidMount() {
        if (isEmpty(this.props.tofiConstants)) return;

        this.getRegistry();
    }

    componentWillReceiveProps(nextProps) {
        if (!isEmpty(nextProps.csClassificationShem) && !isEmpty(nextProps.tofiConstants) && this.props.csClassificationShem !== nextProps.csClassificationShem) {
            const {doForSchemClas, dpForSchemClas} = nextProps.tofiConstants;
            this.setState(
            {
                loading: false,
                data: orderBy(parseCube_new(
                nextProps.csClassificationShem['cube'],
                [],
                'dp',
                'do',
                nextProps.csClassificationShem[`do_${doForSchemClas.id}`],
                nextProps.csClassificationShem[`dp_${dpForSchemClas.id}`],
                `do_${doForSchemClas.id}`,
                `dp_${dpForSchemClas.id}`).map(this.renderTableData), 'dateCreateShem', 'desc')
            }
            );
        } else if (nextProps.csClassificationShem && typeof nextProps.csClassificationShem === 'object') {
            this.setState({
                loading: false
            })
        }
    }

    getRegistry() {
        this.setState({loading: true});
        this.filters = {
            filterDOAnd: [
                {
                    dimConst: 'doForSchemClas',
                    concatType: "and",
                    conds: [
                        {
                            clss: 'clsPutev,clsKatalog,clsUkaz,clsObzor'
                        }
                    ]
                }
            ]
        };
        this.props.getCube('csClassificationShem', JSON.stringify(this.filters));
    }

    renderTableData = (item, idx) => {
        const cls = ['clsPutev', 'clsKatalog', 'clsUkaz', 'clsObzor'];
        const {
            dateCreateShem, requisites,
            vidGuidebook, oblastPutev, rubrikPutev,
            vidKatalog, oblastKatalog,
            vidUkaz, oblastUkaz, rubrikUkaz,
            vidObzora, oblastObzor,
            theme, group, goalSprav,
            method, metodikaText, approvalDateMetodika, protocol,
            lastChangeDateScheme, changesAuthor
        } = this.props.tofiConstants;

        const dateCreateShemObj = item.props.find(element => element.prop === dateCreateShem.id);
        const requisitesObj = item.props.find(element => element.prop === requisites.id);
        const referenceTypeObj = cls.find(c => this.props.tofiConstants[c].id === item.clsORtr);
        const vidGuidebookObj = item.props.find(element => element.prop === vidGuidebook.id);
        const oblastPutevObj = item.props.find(element => element.prop === oblastPutev.id);
        const rubrikPutevObj = item.props.find(element => element.prop === rubrikPutev.id);
        const vidKatalogObj = item.props.find(element => element.prop === vidKatalog.id);
        const oblastKatalogObj = item.props.find(element => element.prop === oblastKatalog.id);
        const vidUkazObj = item.props.find(element => element.prop === vidUkaz.id);
        const oblastUkazObj = item.props.find(element => element.prop === oblastUkaz.id);
        const rubrikUkazObj = item.props.find(element => element.prop === rubrikUkaz.id);
        const vidObzoraObj = item.props.find(element => element.prop === vidObzora.id);
        const oblastObzorObj = item.props.find(element => element.prop === oblastObzor.id);
        const themeObj = item.props.find(element => element.prop === theme.id);
        const groupObj = item.props.find(element => element.prop === group.id);
        const goalSpravObj = item.props.find(element => element.prop === goalSprav.id);
        const methodObj = item.props.find(element => element.prop === method.id);
        const metodikaTextObj = item.props.find(element => element.prop === metodikaText.id);
        const approvalDateMetodikaObj = item.props.find(element => element.prop === approvalDateMetodika.id);
        const protocolObj = item.props.find(element => element.prop === protocol.id);
        const lastChangeDateSchemeObj = item.props.find(element => element.prop === lastChangeDateScheme.id);
        const changesAuthorObj = item.props.find(element => element.prop === changesAuthor.id);
        return {
            key: item.id,
            numb: idx + 1,
            referenceName: item.name[this.lng],
            referenceType: referenceTypeObj ? {
                value: this.props.tofiConstants[referenceTypeObj].id,
                label: this.props.tofiConstants[referenceTypeObj].name[this.lng],
                referenceTypeObj
            } : null,
            dateCreateShem: !!dateCreateShemObj.values && dateCreateShemObj.values.value ? moment(dateCreateShemObj.values.value, 'DD-MM-YYYY') : null,
            requisites: !!requisitesObj && requisitesObj.values ? requisitesObj.values : {},
            vidGuidebook: !!vidGuidebookObj && vidGuidebookObj.values ?vidGuidebookObj.values : null,
            oblastPutev: !!oblastPutevObj && oblastPutevObj.values ? oblastPutevObj.values: null,
            rubrikPutev: !!rubrikPutevObj && rubrikPutevObj.values ? rubrikPutevObj.values : null,
            vidKatalog: !!vidKatalogObj && vidKatalogObj.values ?vidKatalogObj.values  : null,
            oblastKatalog: !!oblastKatalogObj && oblastKatalogObj.values ? oblastKatalogObj.values : null,
            vidUkaz: !!vidUkazObj && vidUkazObj.values ? vidUkazObj.values : null,
            oblastUkaz: !!oblastUkazObj && oblastUkazObj.values ? oblastUkazObj.values : null,
            rubrikUkaz: !!rubrikUkazObj && rubrikUkazObj.values? rubrikUkazObj.values: null,
            vidObzora: !!vidObzoraObj && vidObzoraObj.values ?vidObzoraObj.values : null,
            oblastObzor: !!oblastObzorObj && oblastObzorObj.values ? oblastObzorObj.values : null,
            theme: !!themeObj && themeObj.values ? themeObj.values : '',
            group: !!groupObj && groupObj.values ? groupObj.values : null,
            goalSprav: !!goalSpravObj && goalSpravObj.values ? goalSpravObj.values : '',
            method: !!methodObj && methodObj.values ? methodObj.values : [],
            metodikaText: !!metodikaTextObj && metodikaTextObj.values ? metodikaTextObj.values : '',
            approvalDateMetodika: !!approvalDateMetodikaObj && approvalDateMetodikaObj.values ? moment(approvalDateMetodikaObj.values.value, 'DD-MM-YYYY') : '',
            protocol: !!protocolObj && protocolObj.values ? protocolObj.values : '',
            lastChangeDateScheme: !!lastChangeDateSchemeObj && lastChangeDateSchemeObj.values ? lastChangeDateSchemeObj.values : '',
            changesAuthor: !!changesAuthorObj && changesAuthorObj.values ? changesAuthorObj.values : '',
        }
    };

    closeCard = () => {
        this.setState({openCard: false})
    };

    addNew = () => {
        this.setState({
            currentTablePage: 1,
            openNewRec: true,
            openCard: false,
            selectedTableRowKey: `newData_${this.state.data.length}`,
            data: [
                {
                    key: `newData_${this.state.data.length}`,
                    editable: true,
                    numb: this.state.data.length + 1,
                    referenceName: '',
                    referenceType: ''
                },
                ...this.state.data
            ]
        })
    };
    cancel = key => {
        const newData = [...this.state.data];
        if (key.includes('newData')) {
            this.setState({
                data: newData.filter(item => item.key !== key),
                openNewRec: false
            });
            return;
        }
        const target = newData.find(item => key === item.key);
        if (target) {
            delete target.editable;
            this.setState({data: newData});
        }
    };
    remove = (key) => {
        const newData = this.state.data.filter(item => item.key !== key);
        this.setState({data: newData});
    }

    handleChange(value, key, column) {
        const newData = [...this.state.data];
        const target = newData.find(item => key === item.key);
        if (target) {
            target[column] = value;
            this.setState({data: newData});
        }
    }

    edit = key => {
        const newData = [...this.state.data];
        const target = newData.find(item => key === item.key);
        if (target) {
            target.editable = true;
            target.valOld = {...target};
            this.setState({data: newData});
        }
    };

    save(key) {
        this.setState({openNewRec: false});
        const newData = [...this.state.data];
        const target = newData.find(item => key === item.key);
        if (target) {
            const {key, numb, referenceName, editable, valOld, referenceType, ...rest} = target;

            const cube = {
                cubeSConst: 'csClassificationShem',
                doConst: 'doForSchemClas',
                dpConst: 'dpForSchemClas'
            };
            if (target.key.startsWith('newData')) {
                const name = {};
                SYSTEM_LANG_ARRAY.forEach(lang => {
                    name[lang] = referenceName
                });
                const obj = {
                    name,
                    fullName: name,
                    clsConst: referenceType.constName
                };
                //console.log(obj, rest); return;
                const hideCreateObj = message.loading(this.props.t('CREATING_NEW_OBJECT'), 0);
                createObj(cube, obj)
                .then(res => {
                    hideCreateObj();
                    if (res.success) {
                        target.key = res.data.idItemDO;
                        this.onSaveCubeData({cube, obj}, {
                            ...rest,
                            dateCreateShem: moment()
                        }, res.data.idItemDO, {}, {})
                        .then(resp => {
                            if (resp.success) {
                                delete target.editable;
                                // this.setState({ data: newData });
                            }
                        }).catch(err => console.log(err));
                    }
                }).catch(err => {
                    hideCreateObj();
                    console.log(err);
                });
            } else {
                this.onSaveCubeData({cube}, rest, target.key, {}, valOld)
                .then(resp => {
                    if (resp.success) {
                        delete target.editable;
                        // this.setState({ data: newData });
                    }
                })
            }
        }
    }


    renderColumns(text, record, column) {
        return (
        <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.key, column)}
        />
        );
    }

    renderSelectColumns(text, record, column) {
        const {clsPutev, clsKatalog, clsUkaz, clsObzor} = this.props.tofiConstants;
        const referenceTypes = [clsPutev, clsKatalog, clsUkaz, clsObzor];
        return (
        <EditableSelect
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.key, column)}
        idRef={this.props.tofiConstants.isActiveTrue.id}
        getObjByObjVal={this.props.getObjByObjVal}
        options={referenceTypes ? referenceTypes.map(o => ({
            value: o.id,
            label: o.name[this.lng],
            constName: o.constName
        })) : []}
        />
        );
    };

    refreshRecord = ({referenceName, ...props}, quick) => {
        let selercrow = this.state.selectedRow

        const name = {};
        SYSTEM_LANG_ARRAY.forEach(lang => {
            name[lang] = !!referenceName?referenceName.value:selercrow.referenceName
        });
        const obj = {
            name,
            fullName: name,

        };

        const {valOld} = this.state.selectedRow;
        let changesAuthor = selercrow.changesAuthor
        if(!!changesAuthor){
            changesAuthor.value=this.props.user.obj
            changesAuthor.label = this.props.user.name
            changesAuthor.labelFull = this.props.user.name

        }else {
            changesAuthor = this.props.user ? String(this.props.user.obj) : '';
        }
         let lastChangeDateScheme = selercrow.lastChangeDateScheme
        if(!!lastChangeDateScheme ){
            lastChangeDateScheme.value = moment()
        }else{
            lastChangeDateScheme = moment()
        }
        const cube = {
            cubeSConst: 'csClassificationShem',
            doConst: 'doForSchemClas',
            dpConst: 'dpForSchemClas'
        };
        return this.onSaveCubeData({cube}, {
            ...props,
            changesAuthor,
            lastChangeDateScheme
        }, this.state.selectedTableRowKey, obj, valOld, quick)
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


    onSaveCubeData = async (objVerData, {method, protocol, ...values}, doItemProp, objDataProp, valOld, quick) => {

        let hideLoading
        try {
            const c ={
                cube:{
                    cubeSConst: "csClassificationShem",
                    doConst: "doForSchemClas",
                    dpConst: "dpForSchemClas",
                    data:this.props[objVerData.cube.cubeSConst]
                },
                obj:{
                    doItem:doItemProp
                }
            }

            const v ={
                values:values,
                complex:"",
                oFiles:{
                    method:method,
                    protocol:protocol,
                }
            }
            const objData = objDataProp
            const  t = this.props.tofiConstants
            this.setState({loading: true, });

            hideLoading = message.loading(this.props.t('UPDATING_PROPS'), 0);
            const resSave = await onSaveCubeData(c, v, t, objData);
            hideLoading();
            if(!resSave.success) {
                message.error(this.props.t('PROPS_UPDATING_ERROR'));
                resSave.errors.forEach(err => {
                    message.error(err.text)
                });
                return Promise.reject(resSave);
            }
            message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'));
            return this.props.getCube('csClassificationShem', JSON.stringify(this.filters))
                .then(() => {
                    if (quick) {
                        this.setState({loading: false});
                    } else {
                        this.setState({loading: false, openCard: false});
                    }
                    return {success: true}
                })

        } catch (e) {
            typeof hideLoading === 'function' && hideLoading();
            this.setState({ loading: false });
            console.warn(e);
        }
     /*   let datas = [];
        this.setState({loading: true})
        try {
            datas = [{
                own: [{
                    doConst: objVerData.cube.doConst,
                    doItem: doItemProp,
                    isRel: "0",
                    objData: objDataProp
                }],
                props: map(values, (val, key) => {
                    console.log(values, val, key)
                    const propMetaData = getPropMeta(this.props[objVerData.cube.cubeSConst]["dp_" + this.props.tofiConstants[objVerData.cube.dpConst].id], this.props.tofiConstants[key]);
                    console.log(val, valOld, valOld[key], key);
                    let value = val;
                    let oldValue = valOld[key];
                    if ((propMetaData.typeProp === 315 || propMetaData.typeProp === 311 || propMetaData.typeProp === 317) && typeof val === 'string') {
                        value = {kz: val, ru: val, en: val};
                        oldValue = oldValue && {
                            kz: valOld[key],
                            ru: valOld[key],
                            en: valOld[key]
                        };
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
        } catch(err) {
            console.error(err);
            return err;
        }
        const hideLoading = message.loading(this.props.t('UPDATING_PROPS'), 0);
        return updateCubeData(objVerData.cube.cubeSConst, moment().format('YYYY-MM-DD'), JSON.stringify(datas), {}, {
            method,
            protocol
        })
        .then(res => {
            hideLoading();
            if (res.success) {
                message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'));
                if (this.filters) {
                    this.setState({loading: true});
                    return this.props.getCube('csClassificationShem', JSON.stringify(this.filters))
                    .then(() => {
                        if (quick) {
                            this.setState({loading: false});
                        } else {
                            this.setState({loading: false, openCard: false});
                        }
                        return {success: true}
                    })
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
        })*/
    };

    onSideBarTabClick = (key) => {
        this.setState({sidebarActiveKey: key});
    };


    render() {


        if (isEmpty(this.props.tofiConstants)) return null;
        const {loading, data, search} = this.state;
        const {t, tofiConstants} = this.props;

        this.lng = localStorage.getItem('i18nextLng');


        this.filteredData = data.filter(item => {
            return (
            ( item.referenceName ? String(item.referenceName).toLowerCase().includes(search.referenceName.toLowerCase()) : search.referenceName === '' ) &&
            ( item.referenceType ? String(item.referenceType.label).toLowerCase().includes(search.referenceType.toLowerCase()) : search.referenceType === '' ) &&
            ( item.dateCreateShem ?  String(item.dateCreateShem['_i']).includes(String(search.dateCreateShem)) : search.dateCreateShem === '' )  &&
            ( item.approvalDateMetodika ? String(item.approvalDateMetodika['_i']).includes(search.approvalDateMetodika) : search.approvalDateMetodika === '' )
            )
        });


        return (
        <div className="Classification-Schemas">
            <div className="title">
                <h2>Схемы классификации</h2>
            </div>
            <div className="Classification-Schemas__heading">
                <div className="table-header">
                    <Button disabled={this.state.openNewRec || this.state.loading}
                            onClick={this.addNew}>{this.props.t('ADD')}</Button>
                </div>
            </div>
            <div className="Classification-Schemas__body">
                <AntTable
                loading={loading}
                columns={[
                    {
                        key: 'referenceName',
                        title: this.props.t('REFERENCE_NAME'),
                        dataIndex: 'referenceName',
                        width: '54%',
                        render: (obj, record) => this.renderColumns(obj, record, 'referenceName'),
                        filterDropdown: (
                        <div className="custom-filter-dropdown">
                            <Input
                            disabled={this.state.openCard}
                            name="referenceName"
                            suffix={search.referenceName && !this.state.openCard ?
                            <Icon type="close-circle" data-name="referenceName"
                                  onClick={this.emitEmpty}/> : null}
                            ref={ele => this.referenceName = ele}
                            placeholder="Поиск"
                            value={search.referenceName}
                            onChange={this.onInputChange}
                            />
                        </div>
                        ),
                        filterIcon: <Icon type="filter"
                                          style={{color: search.referenceName ? '#ff9800' : '#aaa'}}/>,
                        onFilterDropdownVisibleChange: (visible) => {
                            this.setState({
                                filterDropdownVisible: visible,
                            }, () => this.referenceName.focus());
                        },
                    },
                    {
                        key: 'referenceType',
                        title: this.props.t('REFERENCE_TYPE'),
                        dataIndex: 'referenceType',
                        width: '13%',
                        render: (obj, record) => this.renderSelectColumns(obj, record, 'referenceType'),
                        sorter: (a, b) => a.referenceType.label.length - b.referenceType.label.length,
                        filterDropdown: (
                        <div className="custom-filter-dropdown">
                            <Input
                            disabled={this.state.openCard}
                            name="referenceType"
                            suffix={search.referenceType && !this.state.openCard ?
                            <Icon type="close-circle" data-name="referenceType"
                                  onClick={this.emitEmpty}/> : null}
                            ref={ele => this.referenceType = ele}
                            placeholder="Поиск"
                            value={search.referenceType}
                            onChange={this.onInputChange}
                            />
                        </div>
                        ),
                        filterIcon: <Icon type="filter"
                                          style={{color: search.referenceType ? '#ff9800' : '#aaa'}}/>,
                        onFilterDropdownVisibleChange: (visible) => {
                            this.setState({
                                filterDropdownVisible: visible,
                            }, () => this.referenceType.focus());
                        },
                    },
                    {
                        key: 'dateCreateShem',
                        title: t('DATE_CREATE_SHEM'),
                        dataIndex: 'dateCreateShem',
                        width: '10%',
                        render: val => val && val.format('DD-MM-YYYY'),
                        filterDropdown: (
                        <div className="custom-filter-dropdown">
                            <Input
                            disabled={this.state.openCard}
                            name="dateCreateShem"
                            suffix={search.dateCreateShem && !this.state.openCard ?
                            <Icon type="close-circle" data-name="dateCreateShem"
                                  onClick={this.emitEmpty}/> : null}
                            ref={ele => this.dateCreateShem = ele}
                            placeholder="Поиск"
                            value={search.dateCreateShem}
                            onChange={this.onInputChange}
                            />
                        </div>
                        ),
                        filterIcon: <Icon type="filter"
                                          style={{color: search.dateCreateShem ? '#ff9800' : '#aaa'}}/>,
                        onFilterDropdownVisibleChange: (visible) => {
                            this.setState({
                                filterDropdownVisible: visible,
                            }, () => this.dateCreateShem.focus());
                        },
                    },
                    {
                        key: 'approvalDateMetodika',
                        title: t('DATE_APPROVE_SHEM'),
                        dataIndex: 'approvalDateMetodika',
                        width: '13%',
                        render: val => val && val.format('DD-MM-YYYY'),
                        filterDropdown: (
                        <div className="custom-filter-dropdown">
                            <Input
                            disabled={this.state.openCard}
                            name="approvalDateMetodika"
                            suffix={search.approvalDateMetodika && !this.state.openCard ?
                            <Icon type="close-circle" data-name="approvalDateMetodika"
                                  onClick={this.emitEmpty}/> : null}
                            ref={ele => this.approvalDateMetodika = ele}
                            placeholder="Поиск"
                            value={search.approvalDateMetodika}
                            onChange={this.onInputChange}
                            />
                        </div>
                        ),
                        filterIcon: <Icon type="filter"
                                          style={{color: search.approvalDateMetodika ? '#ff9800' : '#aaa'}}/>,
                        onFilterDropdownVisibleChange: (visible) => {
                            this.setState({
                                filterDropdownVisible: visible,
                            }, () => this.approvalDateMetodika.focus());
                        },

                    },
                    {
                        key: 'action',
                        title: '',
                        dataIndex: '',
                        width: '10%',
                        render: (text, record) => {
                            const {editable, referenceName, referenceType, approvalDateMetodika} = record;
                            const disable = (referenceName === '' || isEmpty(referenceType));
                            const closedRec = !isEmpty(approvalDateMetodika);
                            return (
                            <div className="editable-row-operations">
                                {
                                    editable ?
                                    <span>
                            <a onClick={() => this.save(record.key)}
                               disabled={disable}><Icon type="check"/></a>
                            <Popconfirm title="Отменить?"
                                        onConfirm={() => this.cancel(record.key)}>
                              <a style={{marginLeft: '5px'}}><Icon type="close"/></a>
                            </Popconfirm>
                          </span>
                                    :
                                    <span>
                            {/* <a><Icon type="edit" style={{fontSize: '14px'}} onClick={() => this.edit(record.key)}/></a> */}
                                        <a><Icon type="edit" style={{fontSize: '14px'}}
                                                 onClick={() => this.changeSelectedRow(record, true)}/></a>
                                        {!closedRec &&
                                        <span>
                                <Popconfirm title={this.props.t('CONFIRM_REMOVE')}
                                            onClick={e => e.stopPropagation()}
                                            onConfirm={() => {
                                                this.setState({openCard: false});
                                                const fd = new FormData();
                                                fd.append("cubeSConst", "csClassificationShem");
                                                fd.append("dimObjConst", "doForSchemClas");
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
                                  <a style={{
                                      color: '#f14c34',
                                      marginLeft: '10px',
                                      fontSize: '14px'
                                  }}><Icon type="delete" className="editable-cell-icon"/></a>
                                </Popconfirm>
                              </span>
                                        }
                        </span>
                                }
                            </div>
                            );
                        },
                    }
                ]}
                scroll={{y: '100%'}}
                pagination={{
                    pageSize: 20,
                    showQuickJumper: true,
                    current: this.state.currentTablePage
                }}
                dataSource={ this.filteredData }
                rowClassName={record => this.state.selectedTableRowKey === record.key ? 'row-selected' : ''}
                onRowClick={this.changeSelectedRow}
                onChange={(pagination, filters, sorter, currentPageData) => this.setState({currentTablePage: pagination.current})}
                hidePagination
                bordered
                size='small'/>
                <CSSTransition
                in={this.state.openCard}
                timeout={300}
                classNames="card"
                unmountOnExit
                >
                    <SiderCard t={t} tofiConstants={tofiConstants}
                               initialValues={this.state.initialValues}
                               record={this.state.selectedRow}
                               closer={<Button type='danger' onClick={this.closeCard}
                                               shape="circle" icon="arrow-right"/>}
                               onCreateObj={this.onCreateObj}
                               onSaveCubeData={this.onSaveCubeData}
                               onTabClick={this.onSideBarTabClick}
                               activeKey={this.state.sidebarActiveKey}
                               clsFirstStatusMap={this.clsFirstStatusMap}
                               referenceSubtype={this.state.selectedTableReferenceSubtype}
                               parentKey={this.state.selectedTableRowKey}
                               refreshRecord={this.refreshRecord}
                    />
                </CSSTransition>
            </div>
        </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        csClassificationShem: state.cubes.csClassificationShem,
        tofiConstants: state.generalData.tofiConstants,
        user: state.auth.user
    }
}

export default connect(mapStateToProps, {getCube, getObjByObjVal})(ClassificationSchemas);