import React from 'react';
import {
    Table, message, Input, Popconfirm, Button, Icon, Badge, Modal, Upload,
    Col, Spin
} from 'antd';
import {Cube as axios} from "../../../utils/axios_config";
import ButtonGroup from "antd/es/button/button-group";
import {getFile, updateCubeData2} from "../../../actions/actions";
import * as uuid from "uuid";
import moment from "moment/moment";
import {isEmpty} from "lodash";

class Chat_FundMaker extends React.PureComponent {

    state = {
        sortState: true,
        withIdDPV: this.props.withIdDPV,
        initialValues: this.props.initialValues,
        id: this.props.id,
        data: [],
        cubeChat: '',
        modalOpen: false,
        newFile: '',
        newLetter: '',
        newFileArr: '',
        loading: false,
        openCard: false,
        filter: {
            name: '',
            letterDetails: ''

        },
    };

    changeSelectedRow = rec => {
        this.setState({
            selectedRow: rec,
            openCard: true
        });
    };
    onChange = (pagination, filters, sorter) => {
        if(sorter.columnKey === "letterDetails") {
            this.setState({sortState: !this.state.sortState});
        }
    }

    onChangeFile = (e) => {
        this.setState({
            newFileArr: e.target.files,
            newFile: e.target.files[0]
        })
    };


    showFile = (key) => {
        getFile(key).then(blob => {
            const url = URL.createObjectURL(new Blob([blob.data], {type: 'application/pdf'}));
            this.setState({
                modalOpen: true,
                file: <iframe src={`${url}#toolbar=0`} frameBorder="0"/>
            })
        })
    };

    showFileBefore = (blob) => {
        const url = URL.createObjectURL(new Blob([blob.data], {type: 'application/pdf'}));
        this.setState({
            modalOpen: true,
            file: <iframe src={`${url}#toolbar=0`} frameBorder="0"/>
        })
    };


    onChangeNewLetter = (event) => {
        this.setState({newLetter: event.target.value});
    };


    handleOk = (e) => {
        this.setState({
            modalOpen: false
        })
    };

    handleCancel = (e) => {
        this.setState({
            modalOpen: false
        })
    };

    componentDidMount() {
        this.getListChat(this.props.initialValues.id);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.initialValues !== this.props.initialValues) {
            this.getListChat(this.props.initialValues.id);
        }
    }


    getListChat = (ids) => {
        this.setState({
            newLetter: '',
            newFileArr: '',
            loading: true
        });
        const filters = {
            filterDOAnd: [
                {
                    dimConst: 'doForFundAndIK',
                    concatType: "and",
                    conds: [
                        {
                            ids: String(ids)
                        }
                    ]
                }
            ],
            filterDPAnd: [
                {
                    dimConst: 'dpForFundAndIK',
                    concatType: "and",
                    conds: [
                        {
                            consts: "letterDetails,corresOrg,corresOrgFile"
                        }
                    ]
                }
            ],
        };
        this.setState({
            loading: true
        });

        axios.getCube('cubeForFundAndIK', JSON.stringify(filters), '', '').then(res => {
            this.setState({
                cubeChat: res.data,
                loading: false
            });
            var dpForOrgFM = this.props.tofiConstants['dpForFundAndIK'].id;
            var doForOrgFM = this.props.tofiConstants['doForFundAndIK'].id;
            var corresOrgId = res.data['dp_' + dpForOrgFM].find(obj => obj.prop == this.props.tofiConstants['corresOrg'].id).id;
            var cubeChat = res.data;
            var cpxCorresID = cubeChat.cube.filter(el => el['dp_' + dpForOrgFM] == corresOrgId);
            var newData = cpxCorresID.map(el => {
                var corresOrgFileProp =res.data['dp_' + dpForOrgFM].find(obj => obj.prop == this.props.tofiConstants['corresOrgFile'].id).id;
                var letterDetailsProp = res.data['dp_' + dpForOrgFM].find(obj => obj.prop == this.props.tofiConstants['letterDetails'].id).id;
                return {
                    key: el.idDataPropVal,
                    doObj: el['do_' + doForOrgFM],
                    corresOrgFile: !!res.data.cube.find(obj => obj.parentDataPropVal == el.idDataPropVal && obj['dp_' + dpForOrgFM] == corresOrgFileProp) &&
                    !!res.data.cube.find(obj => obj.parentDataPropVal == el.idDataPropVal && obj['dp_' + dpForOrgFM] == corresOrgFileProp).valueFile &&
                    res.data.cube.find(obj => obj.parentDataPropVal == el.idDataPropVal && obj['dp_' + dpForOrgFM] == corresOrgFileProp).valueFile['ru'],
                    letterDetails: !!res.data.cube.find(obj => obj.parentDataPropVal == el.idDataPropVal && obj['dp_' + dpForOrgFM] == letterDetailsProp).valueStr &&
                    res.data.cube.find(obj => obj.parentDataPropVal == el.idDataPropVal && obj['dp_' + dpForOrgFM] == letterDetailsProp).valueStr['ru'],
                    idName: !!el.valueStr && el.valueStr['ru']
                }
            });
            if (newData[0].key == undefined) {
                this.setState({
                    data: '',
                })
            } else {
                this.setState({
                    data: newData,
                })
            }

        });
    };

    renderTableHeader = () => {
        const {t} = this.props;
        return (
        <div>


            <Col span={12}>
                <Input value={this.state.newLetter} onChange={this.onChangeNewLetter}
                       type="text"/>
            </Col>
            <Col span={8}>
                {

                    <label>
                        <input
                        type="file"
                        style={{display: 'none'}}
                        onChange={this.onChangeFile}/>
                        <span className='ant-btn ant-btn-primary'><Icon
                        type='upload'/>
                        <Badge className="badgeInputFile"
                               count={this.state.newFileArr.length}>
                    </Badge>
                        <span>{this.props.t('UPLOAD_FILE')}</span></span>
                    </label>}
            </Col>
            <Col span={2}>
                <Button
                disabled={!this.state.newFile || !this.state.newLetter}
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: '10px'
                }}
                type="primary"
                shape='circle'
                icon='plus'
                onClick={() => this.addChatRow()

                }/>
            </Col>


        </div>
        )
    };


    deleteRow = (rec) => {
       const  showDel = message.loading('Удаление',0);
        var data = [
            {
                own: [{
                    doConst: 'doForFundAndIK',
                    doItem: String(rec.doObj),
                    isRel: "0",
                    objData: {}
                }
                ],
                props: [{
                    propConst: "corresOrg",
                    idDataPropVal: rec.key,
                    val: {
                        kz: String(rec.idName),
                        ru: String(rec.idName),
                        en: String(rec.idName)
                    },
                    typeProp: "71",
                    periodDepend: "2",
                    isUniq: "2",
                    mode: "del",
                },
                ],
                periods: [{periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31'}]
            }
        ];

        updateCubeData2(
        'cubeForFundAndIK',
        moment().format('YYYY-MM-DD'),
        JSON.stringify(data),
        {},
        {}).then(res => {
            showDel();
            if (res.success) {
                message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'));
            } else {
                message.error(this.props.t('PROPS_UPDATING_ERROR'));
                if (res.errors) {
                    res.errors.forEach(err => {
                        message.error(err.text);
                    });
                    return {success: false}
                }
            }
            this.getListChat(this.props.initialValues.id)
        });
    };

    addChatRow = () => {
        const showLoad = message.loading('Сохранение',0);
        console.log(this.props.initialValues.id)
        var data = [
            {
                own: [{
                    doConst: 'doForFundAndIK',
                    doItem: String(this.props.initialValues.id),
                    isRel: "0",
                    objData: {}
                }
                ],
                props: [{
                    propConst: "corresOrg",
                    val: {
                        kz: `${this.state.initialValues.id}_${uuid()}`,
                        ru: `${this.state.initialValues.id}_${uuid()}`,
                        en: `${this.state.initialValues.id}_${uuid()}`
                    },
                    typeProp: "71",
                    periodDepend: "2",
                    isUniq: "2",
                    mode: "ins",
                    child: [{
                        propConst: "letterDetails",
                        val: {
                            kz: this.state.newLetter,
                            ru: this.state.newLetter,
                            en: this.state.newLetter
                        },
                        typeProp: "315",
                        periodDepend: "2",
                        isUniq: "1"
                    }, {
                        propConst: "corresOrgFile",
                        isUniq: "2",
                        typeProp: "317",
                        periodDepend: "2"
                    }]
                },
                ],
                periods: [{periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31'}]
            }
        ];

        updateCubeData2(
        'cubeForFundAndIK',
        moment().format('YYYY-MM-DD'),
        JSON.stringify(data),
        {},
        {
            ['__Q__corresOrgFile']: Array.from(this.state.newFileArr)
        }).then(res => {
            showLoad();
            if (res.success) {
                message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'));
            } else {
                message.error(this.props.t('PROPS_UPDATING_ERROR'));
                if (res.errors) {
                    res.errors.forEach(err => {
                        message.error(err.text);
                    });
                    return {success: false}
                }
            }
            this.getListChat(this.props.initialValues.id)
        });


    };
    onRowClick = record => {
        this.setState({selectedRow: record})
    };


    handleChange(value, key, column) {
        const newData = [...this.state.data];
        const target = newData.find(item => key === item.key)[0];
        if (target) {
            target[column] = value;
            this.setState({data: newData});
        }
    }

    edit(key) {
        const newData = [...this.state.data];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            target.editable = true;
            this.setState({data: newData});
        }
    }

    save(key) {
        const newData = [...this.state.data];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            delete target.editable;
            this.setState({data: newData});
            this.cacheData = newData.map(item => ({...item}));
        }
    }

    cancel(key) {
        const newData = [...this.state.data];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
            Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
            delete target.editable;
            this.setState({data: newData});
        }
    }
    onInputChange = e => {
        this.setState({
            filter: {
                ...this.state.filter,
                ["letterDetails"]: e.target.value
            }
        })
    };


    render() {
        const { filter} = this.state;
        const {tofiConstants: {corresOrgFile, letterDetails}} = this.props;
        this.lng = localStorage.getItem('i18nextLng');
        if (!!this.state.data){
        this.filteredData = this.state.data.filter(item => {
            return (
                (!!filter.letterDetails ? item.letterDetails && String(item.letterDetails).toLowerCase().includes(String(filter.letterDetails).toLowerCase()):true)
            )
        });}
        return (
        <div>

            <Spin spinning={this.state.loading}>
                <Table
                    bordered
                    onChange={this.onChange}
                    columns={[
                        {
                        key: 'letterDetails',
                        title: letterDetails.name[this.lng],
                        dataIndex: 'letterDetails',
                        width: '40%',
                        render: (obj, record) => obj,
                        editable: true,
                        sorter: (a, b) => {
                            a.key - b.key
                        },
                        sortOrder: 'descend',
                        filterDropdown: (
                            <div className="custom-filter-dropdown">
                                <Input
                                    name="name"
                                    suffix={filter.letterDetails  ?
                                        <Icon type="close-circle" data-name="name"
                                              onClick={this.emitEmpty}/> : null}
                                    placeholder="Поиск"
                                    onChange={this.onInputChange}
                                />
                            </div>
                        ),
                        filterIcon: <Icon type="filter"
                                          style={{color: filter.letterDetails ? '#ff9800' : '#aaa'}}/>,
                    },
                    {
                        key: 'corresOrgFile',
                        title: corresOrgFile.name[this.lng],
                        dataIndex: 'corresOrgFile',
                        width: '40%',
                        render: (text, record) => {
                            return (
                            !!text ?
                            <Button type="primary"
                                    className="centerIcon"
                                    icon="eye"
                                    shape='circle'
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginRight: '10px'
                                    }}
                                    onClick={() => this.showFile(text)}> </Button>
                            : ''
                            )

                        },
                        editable: true,
                    },
                    {
                        key: 'action',
                        title: '',
                        dataIndex: '',
                        width: '20%',
                        render: (text, record) => {
                            return (
                            <div className="editable-row-operations">
                                {
                                    <span>
                                    <Popconfirm title={this.props.t('CONFIRM_REMOVE')}
                                                onConfirm={() => this.deleteRow(record)}>
                        <a style={{
                            color: '#f14c34',
                            marginLeft: '10px',
                            fontSize: '14px'
                        }}><Icon type="delete"/></a>
                      </Popconfirm>
                    </span>
                                }
                            </div>
                            );
                        },
                    }
                ]}
                dataSource={this.filteredData}
                size='small'
                footer={this.renderTableHeader}
                pagination={false}
                scroll={{y: '100%'}}
                onRowClick={this.onRowClick}
                rowClassName={record => this.state.selectedRow && this.state.selectedRow.key === record.key ? 'row-selected' : ''}
                style={{marginLeft: '5px', marginTop: 40}}
                />
            </Spin>

            <Modal visible={this.state.modalOpen}
                   onOk={this.handleOk}
                   onCancel={this.handleCancel}
                   cancelText="Закрыть"
                   className="w80">
                <div className="Viewer-window h70vh">
                    {this.state.file}
                </div>
            </Modal>
        </div>
        )
    }
}

export default Chat_FundMaker;