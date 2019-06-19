import React from 'react';
import {Button, Checkbox, Form, Table as AntTable, Input} from 'antd';
import {
    renderSelect,
    renderInput,
    renderTextarea,
    renderDatePicker,
    renderFileUpload, renderFileUploadBtn
} from "../../utils/form_components";
import TreeTable from '../AntTable'
import moment from 'moment';
import {requiredLabel} from "../../utils/form_validations";
import {Field, formValueSelector, reduxForm} from "redux-form";
import { isEmpty, isEqual, map, pickBy, forOwn, orderBy } from "lodash";
import connect from "react-redux/es/connect/connect";
import {getAllObjOfCls, getObjByObjVal, getPropVal,  getObjByProp, getObjList} from "../../actions/actions";

const FormItem = Form.Item;

const EditableCheckbox = ({ value, onChange }) => (
    <div>
        <Checkbox checked={value} onChange={e => onChange(e.target.checked)}/>
    </div>
);

class NomenStorageUUnits extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            tableLoading: false,
            treeLoading: false,
            tableData: [],
            treeData: [],
            selectedRow: null,
            selectedTableRowKey: '',
            myValues: [],
            flagSave: false,
        }
    }

    loadOptions = (c) => {
        return () => {
            if(!this.props[c + 'Options']) {
                this.setState({filterLoading: { ...this.state.filterLoading ,[c]: true }});
                this.props.getAllObjOfCls(c)
                    .then(() => this.setState({filterLoading: { ...this.state.filterLoading ,[c]: false }}))
            }
        }
    };
    componentDidMount(){

        this.setState({ tableLoading: true, myValues: this.props.myValues2, });
        this.props.getAllObjOfCls(this.props.myClass, moment().format('YYYY-MM-DD'), this.props.myType)
            .then(res => {
                if (res.objects && Array.isArray(res.objects)) {
                    let newNomen =[]
                    for (let val of this.props.myValues ){
                        let obj = res.objects.find(el=>el.id == val.value)
                        newNomen.push(obj)
                    }
                    this.setState({ tableData: this.renderTableData(newNomen), tableLoading: false });
                    //this.openArticles();
                } else {
                    this.setState({ tableData: [], tableLoading: false });
                }
            }).catch(err => console.log(err))
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.myValues2 && !isEqual(nextProps.myValues2, this.state.myValues2)) {
            this.setState({ tableLoading: true, myValues: nextProps.myValues22 });
            this.props.getAllObjOfCls(this.props.myClass, moment().format('YYYY-MM-DD'), this.props.myType)
                .then(res => {
                    if (res.objects && Array.isArray(res.objects)) {
                        let newNomen =[]
                        for (let val of this.props.myValues ) {
                            let obj = res.objects.find(el => el.id == val.value)
                            newNomen.push(obj)
                        }
                            this.setState({ tableData: this.renderTableData(newNomen), tableLoading: false });
                        this.openArticles();
                    } else {
                        this.setState({ tableData: [], tableLoading: false });
                    }
                }).catch(err => console.log(err))
        }
    }
    openArticles = () => {
        this.setState({ treeLoading: true })
        const fd = new FormData();
        fd.append('parent', this.state.selectedTableRowKey);
        getObjList(fd)
            .then(res => {
                if(res.success) {
                    let newArr = res.data.map(o => {
                        let item = {
                            key: moment.now() + o.id,
                            id: o.id,
                            title: o.name[this.lng],
                            isLeaf: !o.hasChild
                        };
                        if (o.hasChild) {
                            item.children =[];
                        } else {
                            item.markbox = false;
                            console.log(this.state.myValues)
                            for (let val of this.state.myValues) {

                                if (Number(val.value) == Number(item.id)) {
                                    item.markbox = true;

                                }
                            }
                        }
                        return item

                    })
                    this.setState({ treeLoading: false, treeData:newArr  })
                } else {
                    this.setState({ treeLoading: false, treeData: [] })
                }
            })
            .catch(err => {
                console.log(err);
                this.setState({ treeLoading: false, treeData: [] })
            });
    };

    renderTableData(data) {
        const result = [];
        data.forEach((item, index) => {
            result.push({
                key: item.id,
                referenceName: item.name[this.lng],
                referenceType: item[this.props.myType][this.lng],
            });
        });
        orderBy(result, '', 'asc');
        result.forEach((item, index) => item.numb = index + 1);
        return result;
    };

    changeSelectedRow = (rec) => {
        this.setState({ selectedRow: rec, selectedTableRowKey: rec.key }, () => {
            this.openArticles();
        })
    };

    changeSelectedRowTree = (rec) => {
        //
    };
    onTreeRowExpand = (expened, record) => {
        if (expened) {
            this.setState({ treeLoading: true })
            const fd = new FormData();
            fd.append('parent', record.id);
            getObjList(fd)
                .then(res => {
                    if(res.success) {
                        const children = res.data.map(o => {
                            const item = {
                                key: moment.now() + o.id,
                                id: o.id,
                                title: o.name[this.lng],
                                isLeaf: !o.hasChild
                            }
                            if (o.hasChild) {
                                item.children =[];
                            } else {
                                item.markbox = false;

                                for (let val of this.state.myValues) {

                                    if (Number(val.value) == Number(item.id)) {
                                        item.markbox = true;

                                    }
                                }
                            }
                            return item;
                        });
                        const newTreeData = this.state.treeData;
                        console.log(record.id, newTreeData, children)
                        putChildren(record.id, newTreeData, children)
                        this.setState({ treeLoading: false, treeData: newTreeData })
                    }
                })
                .catch(err => {
                    console.log(err);
                    //this.setState({ treeLoading: false, treeData: [] })
                });
            function putChildren(parentKey, array, children) {
                for (let i=0; i < array.length; i++) {
                    // if (String(array[i].id) === '19998') {
                    //   debugger
                    // }
                    if (array[i].id === parentKey) {
                        array[i].children = children;
                        return true;
                    }
                }
                for (let i=0; i < array.length; i++) {
                    if (array[i].isLeaf) continue;
                    //const parentKey = array[i].id;
                    console.log(array[i].children)
                    if (putChildren(parentKey, array[i].children, children)) {
                        return true;
                    }
                }
            }
        }
    };
    renderCheckbox(value, record) {
        return (
            record.isLeaf ?
                <EditableCheckbox
                    value={value}
                    onChange={value => this.markRecord(value, record)}
                />
                :
                ''
        );
    }

    markRecord = (value, record) => {
        const data = this.state.myValues;
        let filtered = data.filter((item) => item.value !== record.id)
        if (filtered.length>0){
            filtered=[]
        }
        if (value === true) {
            filtered.push({value: record.id, label: record.title})
        }
        //console.log(myValues);
        this.setState({
            myValues: filtered,
            flagSave: !isEqual(this.props.myValues2, filtered),
        })
        const {treeData} = this.state;
        markInTreeData(treeData, record.id, value,filtered)
        function markInTreeData(array, id, value, filtered) {
            for (let i=0; i < array.length; i++) {
                if (array[i].isLeaf) {
                    if (array[i].id === id ) {
                        array[i].markbox = value;
                    }else{
                        array[i].markbox = false;
                    }
                }
                else {
                    if (markInTreeData(array[i].children, id, value,)) return;
                }
            }
        }
    };

    onSave = () => {
        this.props.onSave({caseNomenItem:this.state.myValues[0]})
    };

    render() {
        if(!this.props.tofiConstants) return null;

        this.lng = localStorage.getItem('i18nextLng');
        const { t, tofiConstants, constReferenceType } = this.props;
        const { tableLoading, treeLoading, tableData, treeData, flagSave} = this.state;

        this.lng = localStorage.getItem('i18nextLng');

        const treeColumns = [
            { title: 'Схема номенклатуры', dataIndex: 'title', key: 'title', width:'90%' },
            { title: '', dataIndex: 'markbox', key: 'markbox', width:'10%',
                render: (obj, record) => this.renderCheckbox(obj, record)
            },
        ];

        console.log(this.state.treeData);

        return (
            <div className="searchNSAReferenceByTypeMainDiv">

                <AntTable
                    loading={tableLoading}
                    columns={[
                        {
                            key: 'numb',
                            title: '№',
                            dataIndex: 'numb',
                            width: '5%',
                        },
                        {
                            key: 'referenceType',
                            title: constReferenceType.name[this.lng],
                            dataIndex: 'referenceType',
                            width: '30%',
                        },
                        {
                            key: 'referenceName',
                            title: t('NAME'),
                            dataIndex: 'referenceName',
                            width: '65%',
                        },
                    ]}
                    //scroll={{y: '100%'}}
                    pagination={{ pageSize: 10, showQuickJumper:true, current: this.state.currentTablePage }}
                    dataSource={ tableData }
                    rowClassName={record => this.state.selectedTableRowKey === record.key ? 'row-selected' : ''}
                    onRowClick={this.changeSelectedRow}
                    onChange={(pagination, filters, sorter, currentPageData) => this.setState({currentTablePage: pagination.current})}
                    hidePagination
                    bordered
                    size='small'
                />
                <AntTable
                    loading={treeLoading}
                    columns={treeColumns}
                    //scroll={{y: '100%'}}
                    pagination={{ pageSize: 20, showQuickJumper:true }}
                    //openedBy={'ClassificationHierarchy'}
                    onRowClick={this.changeSelectedRowTree}
                    //rowClassName={record => this.state.selectedRowKey === record.key ? 'row-selected' : ''}
                    onExpand={this.onTreeRowExpand}
                    hidePagination
                    bordered
                    dataSource={treeData}
                />
                <br/><br/><br/>
                {flagSave &&
                <div className="ant-form-btns">
                    <Button className="signup-form__btn" type="primary" onClick={this.onSave}>
                        {t('SAVE')}
                    </Button>
                </div>
                }
            </div>
        )
    }
}

export default connect(state => {
    return {
        csClassificationShem: state.cubes.csClassificationShem,
    }
}, { getObjByProp, getAllObjOfCls })(NomenStorageUUnits);