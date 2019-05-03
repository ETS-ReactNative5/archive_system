import React from 'react';
import {Table, Input, Popconfirm, Button, message, Icon, Badge} from 'antd';
import Select from '../../../Select';
import moment from "moment"
import {getObjListNew, getPropVal} from "../../../../actions/actions";
import { connect } from 'react-redux';

const EditableCell = ({editable, value, onChange}) => (
    <div style={{flex: 1}}>
        {editable
            ? <Input value={value} onChange={e => onChange(e.target.value)}/>
            : value
        }
    </div>
);

class DamageTableWorks extends React.Component {
    state = {
        data: [],
        dataObj:[]
    };

    renderTableHeader = () => {
        const {t} = this.props;
        return (
            <div className="flex">
                <Button
                    style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '10px'}}
                    type="primary"
                    shape='circle'
                    icon='plus'
                    onClick={() =>
                        this.setState({
                            data: [
                                ...this.state.data,
                                {
                                    key: `newData_${this.state.data.length}`,
                                    id:this.state.data.length,
                                    date:moment().format("YYYY-MM-DD"),
                                    editable: true,
                                }]
                        })}/>

            </div>
        )
    };
    onRowClick = record => {
        this.setState({selectedRow: record})
    };

    componentDidMount=async()=>{
        try {
            const arrObj = []
            for (let i = 1; i <= 15; i++) {
                arrObj.push(`damage${i}`)
            }
            const arrIdTofi = []
            arrObj.map((el) => {

                arrIdTofi.push(this.props.tofiConstants[el].id)
            })
            const fd = new FormData();
            fd.append('ids', arrIdTofi.join(','));

            const res = await getObjListNew(fd);

            if (!res.success) {
                res.forEach(err => {
                    message.error(err.text);
                });
                return;
            }
            this.setState({
                dataObj: res.data
            })
        }catch (e){
            console.log(e)
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

    renderSelectColumns(text, record, column) {
        return (
            record.editable ?
                <Select
                    value={text || null}
                    options={this.state.dataObj ? this.state.dataObj.map(o => ({
                        value: Number(o.id),
                        label: o.name[this.lng],
                        hasChild: o.hasChild,
                        parent: o.hasChild
                    })) : []}
                    onMenuOpen={() => this.props.getPropVal(column)}
                    onChange={value => this.handleChange(value, record.key, column)}
                />
                :
                text && text.label
        )
    }

    handleChange(value, key, column) {
        const newData = [...this.state.data];
        const target = newData.find(item => key === item.key);
        if (target) {
            target[column] = value;
            this.setState({data: newData},()=>{
                console.log(this.state.data)
            });
        }
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
            this.setState({ data: newData });
        }
    }

    render() {
        this.lng = localStorage.getItem('i18nextLng');
        const rowColum = () => {
            if (this.props.date === true) {
                return [
                    {
                        key: "id",
                        title: "№",
                        dataIndex: 'id',
                        width: '5%',

                    },
                    {
                        key: 'workDate',
                        title: this.props.tofiConstants['workDate'].name[this.lng],
                        dataIndex: 'workDate',
                        width: '15%'
                    },
{
                        key: 'indexDamage',
                        title:  this.props.tofiConstants['indexDamage'].name[this.lng],
                        dataIndex: 'indexDamage',
                        render: (obj, record) => this.renderSelectColumns(obj, record, 'indexDamage'),
                        width: '37%',

                    }, {
                        key: 'descriptionDamage',
                        title: this.props.tofiConstants['descriptionDamage'].name[this.lng],
                        dataIndex: 'descriptionDamage',
                        render: (text, record) => this.renderColumns(text, record, 'descriptionDamage'),
                        width: '20%',

                    }, {
                        key: 'workActualEndDate',
                        title: "Фактическая дата окончания",
                        dataIndex: 'workActualEndDate',
                        width: '15%',

                    },
                    {
                        key: 'action',
                        title: '',
                        dataIndex: '',
                        width: '8%',
                        render: (text, record) => {
                            const {editable, archiveInfoDate1, archiveInfoDate2, archiveInfoDate3} = record;
                            const disable = !archiveInfoDate1 || !archiveInfoDate2 || !archiveInfoDate3;
                            return (
                                <div className="editable-row-operations">
                                    {
                                        editable ?
                                            <span>
                      <a onClick={() => this.save(record.key)} disabled={disable}><Icon type="check"/></a>
                      <Popconfirm title="Отменить?" onConfirm={() => this.cancel(record.key)}>
                        <a style={{marginLeft: '5px'}}><Icon type="close"/></a>
                      </Popconfirm>
                    </span>
                                            : <span>
                      <a><Icon type="edit" style={{fontSize: '14px'}} onClick={() => this.edit(record.key)}/></a>
                      <Popconfirm title={this.props.t('CONFIRM_REMOVE')} onConfirm={() => this.remove(record.key)}>
                        <a style={{color: '#f14c34', marginLeft: '10px', fontSize: '14px'}}><Icon type="delete"
                                                                                                  className="editable-cell-icon"/></a>
                      </Popconfirm>
                    </span>
                                    }
                                </div>
                            );
                        },
                    }
                ]
            } else {
                return [
                    {
                        key: "id",
                        title: "№",
                        dataIndex: 'id',
                        width: '5%',

                    },
                    {
                        key: 'Date',
                        title: "Дата",
                        dataIndex: 'date',
                        width: '15%'
                    },
                    {
                        key: 'indexGroup',
                        title: "Индекс подгруппы дефектов",
                        dataIndex: 'indexGroup',
                        render: (obj, record) => this.renderSelectColumns(obj, record, 'indexGroup'),
                        width: '15%',

                    }, {
                        key: 'getChildObj',
                        title: "Признаки повреждения",
                        dataIndex: 'getChildObj',
                        render: (obj, record) => this.renderSelectColumns(obj, record, 'getChildObj'),
                        width: '15%',

                    }, {
                        key: 'descriptionDamage',
                        title: "Описание места повреждения",
                        dataIndex: 'descriptionDamage',
                        render: (text, record) => this.renderColumns(text, record, 'descriptionDamage'),
                        width: '20%',

                    },
                    {
                        key: 'action',
                        title: '',
                        dataIndex: '',
                        width: '8%',
                        render: (text, record) => {
                            const {editable, archiveInfoDate1, archiveInfoDate2, archiveInfoDate3} = record;
                            const disable = !archiveInfoDate1 || !archiveInfoDate2 || !archiveInfoDate3;
                            return (
                                <div className="editable-row-operations">
                                    {
                                        editable ?
                                            <span>
                      <a onClick={() => this.save(record.key)} disabled={disable}><Icon type="check"/></a>
                      <Popconfirm title="Отменить?" onConfirm={() => this.cancel(record.key)}>
                        <a style={{marginLeft: '5px'}}><Icon type="close"/></a>
                      </Popconfirm>
                    </span>
                                            : <span>
                      <a><Icon type="edit" style={{fontSize: '14px'}} onClick={() => this.edit(record.key)}/></a>
                      <Popconfirm title={this.props.t('CONFIRM_REMOVE')} onConfirm={() => this.remove(record.key)}>
                        <a style={{color: '#f14c34', marginLeft: '10px', fontSize: '14px'}}><Icon type="delete"
                                                                                                  className="editable-cell-icon"/></a>
                      </Popconfirm>
                    </span>
                                    }
                                </div>
                            );
                        },
                    }
                ]
            }
        }

        return (
            <div>
                <div>
                    <h3>{this.props.header}
                    </h3>
                    <hr/>
                    <Table
                        bordered
                        columns={rowColum()}
                        dataSource={this.state.data}
                        size='small'
                        title={this.renderTableHeader}
                        pagination={false}
                        scroll={{y: '100%'}}
                        onRowClick={this.onRowClick}
                        rowClassName={record => this.state.selectedRow && this.state.selectedRow.key === record.key ? 'row-selected' : ''}
                        style={{marginLeft: '5px'}}
                    />
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        state: state
    }
}

export default connect(mapStateToProps, {getPropVal})(DamageTableWorks);

