import React from "react"
import {Table, Input, message, DatePicker, Badge,  Row, Col, Icon, Button, Modal, Popconfirm} from 'antd';
import Select from "../../../Select";
import {connect} from "react-redux";
import "./PiNMD_IK_FORM.css"
import {getFile, getObjChildsByConst, getPropVal, dFile, updateCubeData2} from "../../../../actions/actions";
import moment from "moment";
import * as uuid from "uuid";

class PiNMD_IK_FORM extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: this.props.value,
            editable: false,
            dataSource: [],
            tableData: [],
            newFileArr: [],
            newFile: {},
            oldTableData: [],
            modalOpen: false
        };
    }

    handleChange = (e, idDataPropVal, c) => {

        let tableData = [...this.state.tableData];
        let cell = tableData.find(el => el[c].idDataPropVal == idDataPropVal);

        cell[c].valueStr = {
            kz: e.target.value,
            ru: e.target.value,
            en: e.target.value
        };
        this.setState({
            tableData: tableData
        })
    };
    handleChangeDate = (e, idDataPropVal, c) => {
        if (!!e) {
            let val = moment(e).format("DD-MM-YYYY")
            let tableData = [...this.state.tableData];
            let cell = tableData.find(el => el[c].idDataPropVal == idDataPropVal);

            cell[c].valueStr = {
                kz: val,
                ru: val,
                en: val
            };
            this.setState({
                tableData: tableData
            })
        }
    };
    handleChangeSelect = (e, idDataPropVal, c) => {
        if (!!e) {
            let tableData = [...this.state.tableData];
            let cell = tableData.find(el => el[c].idDataPropVal == idDataPropVal);

            cell[c].name = {
                kz: e.label,
                ru: e.label,
                en: e.label
            };
            cell[c].idRef = e.value;
            this.setState({
                tableData: tableData
            })
        } else {
            let tableData = [...this.state.tableData];
            let cell = tableData.find(el => el[c].idDataPropVal == idDataPropVal);

            cell[c].name = {
                kz: "Нет данных",
                ru: "Нет данных",
                en: "Нет данных"
            };
            cell[c].idRef = "";
            this.setState({
                tableData: tableData
            })
        }


    };
    showFile = (key) => {

        if (!!key.name){
            let typeFile = key.name.ru.split(".")[1]
            getFile(key.valueFile.ru).then(blob => {
                if (typeFile === "pdf") {
                    const url = URL.createObjectURL(new Blob([blob.data], {type: 'application/pdf'}));

                    this.setState({
                        modalOpen: true,
                        file: <iframe src={`${url}#toolbar=0`} frameBorder="0"/>
                    })
                }
                if (typeFile === "png") {
                    const url = URL.createObjectURL(new Blob([blob.data], {type: 'application/png'}));

                    this.setState({
                        modalOpen: true,
                        file: <img src={`${url}#toolbar=0`}/>
                    })
                }
                if (typeFile === "jpg") {
                    const url = URL.createObjectURL(new Blob([blob.data], {type: 'application/jpg'}));

                    this.setState({
                        modalOpen: true,
                        file: <img src={`${url}#toolbar=0`}/>
                    })
                }

            }).catch(e => {
                console.log(e)
                message.error("Файл не найден")
            })
        }else {
            message.error("Файл не найден")
        }

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

    edit = (idDataPropVal) => {
        let editable = {...this.state.editable};
        editable[idDataPropVal] = true;
        this.setState({editable: editable});
    };

    check = (obj, c) => {
        let editable = {...this.state.tableData};
        let oldTableData = [...this.state.oldTableData];
        let cell = oldTableData.find(el => el[c].idDataPropVal == obj.idDataPropVal);
        if (cell[c] !== obj || c === "docFile" || c === "file3") {
            let data = []


            if (c === "file3") {
                if (!!this.state.newFile[c]) {

                    data = [
                        {
                            own: [{
                                doConst: 'doForFundAndIK',
                                doItem: String(this.props.selectedIK.id),
                                isRel: "0",
                                objData: {}
                            }
                            ],
                            props: [
                                {
                                    propConst: c,
                                    idDataPropVal: obj.idDataPropVal,
                                    val: {
                                        kz: `${this.props.selectedIK.id}_${uuid()}`,
                                        ru: `${this.props.selectedIK.id}_${uuid()}`,
                                        en: `${this.props.selectedIK.id}_${uuid()}`
                                    },
                                    typeProp: "317",
                                    periodDepend: "2",
                                    isUniq: "1",
                                    mode: "upd",
                                }
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
                            [`${c}`]: [this.state.newFile[c]]
                        },
                    ).then(res =>{
                        if (res.success == true){
                            message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'))
                            this.props.updateCube()

                        }else {
                            message.error(res.errors[0].text)
                        }

                    })
                }

            }


            if (c === "docFile") {
                if (!!this.state.newFile[c]) {

                    data = [
                        {
                            own: [{
                                doConst: 'doForFundAndIK',
                                doItem: String(this.props.selectedIK.id),
                                isRel: "0",
                                objData: {}
                            }
                            ],
                            props: [
                                {
                                    propConst: c,
                                    idDataPropVal: obj.idDataPropVal,
                                    val: {
                                        kz: `${this.props.selectedIK.id}_${uuid()}`,
                                        ru: `${this.props.selectedIK.id}_${uuid()}`,
                                        en: `${this.props.selectedIK.id}_${uuid()}`
                                    },
                                    typeProp: "317",
                                    periodDepend: "2",
                                    isUniq: "1",
                                    mode: "upd",
                                }
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
                            [`${c}`]: [this.state.newFile[c]]
                        },
                    ).then(res =>{
                        if (res.success == true){
                            message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'))
                            this.props.updateCube()

                        }else {
                            message.error(res.errors[0].text)
                        }

                    })
                }

            }


            if (c === "archiveInfoDate1") {


                data = [
                    {
                        own: [{
                            doConst: 'doForFundAndIK',
                            doItem: String(this.props.selectedIK.id),
                            isRel: "0",
                            objData: {}
                        }
                        ],
                        props: [
                            {
                                propConst: c,
                                idDataPropVal: obj.idDataPropVal,
                                val: obj.valueStr,
                                typeProp: "315",
                                periodDepend: "2",
                                isUniq: "1",
                                mode: "upd",
                            }
                        ],


                        periods: [{periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31'}]
                    }
                ];
                updateCubeData2(
                    'cubeForFundAndIK',
                    moment().format('YYYY-MM-DD'),
                    JSON.stringify(data),
                    {},
                    {}).then(res => res.success == true ? message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED')) : message.error(res.errors[0].text))
            }

            if (c === "normativeDocType") {


                data = [
                    {
                        own: [{
                            doConst: 'doForFundAndIK',
                            doItem: String(this.props.selectedIK.id),
                            isRel: "0",
                            objData: {}
                        }
                        ],
                        props: [
                            {
                                propConst: c,
                                idDataPropVal: obj.idDataPropVal,
                                val: String(obj.idRef),
                                typeProp: "11",
                                periodDepend: "2",
                                isUniq: "1",
                                mode: "upd",
                            }
                        ],


                        periods: [{periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31'}]
                    }
                ];
                updateCubeData2(
                    'cubeForFundAndIK',
                    moment().format('YYYY-MM-DD'),
                    JSON.stringify(data),
                    {},
                    {}).then(res => res.success == true ? message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED')) : message.error(res.errors[0].text))
            }


            if (c === "archiveInfoDate2") {


                data = [
                    {
                        own: [{
                            doConst: 'doForFundAndIK',
                            doItem: String(this.props.selectedIK.id),
                            isRel: "0",
                            objData: {}
                        }
                        ],
                        props: [
                            {
                                propConst: c,
                                idDataPropVal: obj.idDataPropVal,
                                val: obj.valueStr,
                                typeProp: "315",
                                periodDepend: "2",
                                isUniq: "1",
                                mode: "upd",
                            }
                        ],


                        periods: [{periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31'}]
                    }
                ];
                updateCubeData2(
                    'cubeForFundAndIK',
                    moment().format('YYYY-MM-DD'),
                    JSON.stringify(data),
                    {},
                    {}).then(res => res.success == true ? message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED')) : message.error(res.errors[0].text))
            }

        }
        else {

        }
        editable[obj.idDataPropVal] = false;
        this.setState({editable: editable});
    };

    componentDidMount() {

        this.setState({
            tableData: this.props.data,
            oldTableData: JSON.parse(JSON.stringify(this.props.data))
        })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {

            this.setState({
                tableData: this.props.data,
                oldTableData: JSON.parse(JSON.stringify(this.props.data))

            })
        }
    }

    onCellChange = (key, dataIndex) => {
        return (value) => {
            const tableData = [...this.state.tableData];
            const target = tableData.find(item => item.key === key);
            if (target) {
                target[dataIndex] = value;
                this.setState({tableData});
            }
        };
    }
    onDelete = (rec) => {
        const tableData = [...this.state.tableData];
        this.setState({tableData: tableData.filter(item => item.key !== rec.key)});
        const showDelete = message.loading('Удаление');

        var data = [
            {
                own: [{
                    doConst: 'doForFundAndIK',
                    doItem: String(this.props.selectedIK.id),
                    isRel: "0",
                    objData: {}
                }
                ],
                props: [{
                    propConst: "normMethDocs",
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
            if (res.success) {
                showDelete();
                message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'));
            } else {
                showDelete();
                message.error(this.props.t('PROPS_UPDATING_ERROR'));
                if (res.errors) {
                    res.errors.forEach(err => {
                        message.error(err.text);
                    });
                    return {success: false}
                }
            }
        });
    }
    handleAdd = () => {
        const showLoad = message.loading('Сохранение', 0);

        var nextnumber = 1;
        if (this.state.tableData.length > 0) {
            var numbArr = [...this.state.tableData.map(el => {
                return el['numberNmd'].valueStr.ru
            })
            ];
            nextnumber = Math.max(...numbArr) + 1;
        }
        else {

        }

        console.log(nextnumber);
        var data = [
            {
                own: [{
                    doConst: 'doForFundAndIK',
                    doItem: String(this.props.selectedIK.id),
                    isRel: "0",
                    objData: {}
                }
                ],
                props: [{
                    propConst: "normMethDocs",
                    val: {
                        kz: `${this.props.selectedIK.id}_${uuid()}`,
                        ru: `${this.props.selectedIK.id}_${uuid()}`,
                        en: `${this.props.selectedIK.id}_${uuid()}`
                    },
                    typeProp: "71",
                    periodDepend: "2",
                    isUniq: "2",
                    mode: "ins",
                    child: [
                        {
                            propConst: "numberNmd",
                            val: {
                                kz: String(nextnumber),
                                ru: String(nextnumber),
                                en: String(nextnumber)
                            },
                            typeProp: "315",
                            periodDepend: "2",
                            isUniq: "1"
                        },
                        {


                            propConst: "normativeDocType",
                            val: {
                                kz: 'Нет данных',
                                ru: 'Нет данных',
                                en: 'No data'
                            },
                            typeProp: "315",
                            periodDepend: "2",
                            isUniq: "1"
                        },
                        {
                            propConst: "docFile",
                            val: {
                                kz: 'Нет данных',
                                ru: 'Нет данных',
                                en: 'No data'
                            },
                            typeProp: "315",
                            periodDepend: "2",
                            isUniq: "1"
                        },
                        {
                            propConst: "archiveInfoDate1",
                            val: {
                                kz:  moment().format("YYYY-MM-DD"),
                                ru:  moment().format("YYYY-MM-DD"),
                                en: moment().format("YYYY-MM-DD"),
                            },

                            typeProp: "315",
                            periodDepend: "2",
                            isUniq: "1",

                        },
                        {
                            propConst: "archiveInfoDate2",
                            val: {
                                kz: 'Нет данных',
                                ru: 'Нет данных',
                                en: 'No data'
                            },
                            typeProp: "315",
                            periodDepend: "2",
                            isUniq: "1"
                        },
                        {
                            propConst: "file3",
                            val: {
                                kz: 'Нет данных',
                                ru: 'Нет данных',
                                en: 'No data'
                            },
                            typeProp: "315",
                            periodDepend: "2",
                            isUniq: "1"
                        }
                    ]
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
            if (res.success == true) {
                showLoad();
                message.success('Добавлено');
                this.props.updateCube()
            } else {
                showLoad();
                message.error(res.errors[0].text)
            }
        });
    }
    loadChilds = (c, props) => {
        return () => {
            if (!this.props[c + "Options"]) {
                this.setState({
                    loading: {...this.state.loading, [c + "Loading"]: true}
                });
                this.props
                    .getPropVal(c, props)
                    .then(() =>
                        this.setState({
                            loading: {
                                ...this.state.loading,
                                [c + "Loading"]: false
                            }
                        })
                    )
                    .catch(err => console.error(err));
            }
        };
    };
    onChangeFile = (e, c) => {

        let newFile = [...this.state.newFile];
        let newFileArr = [...this.state.newFileArr];
        newFile[c] = e.target.files[0]
        newFileArr[c] = e.target.files
        this.setState({
            newFileArr: newFileArr,
            newFile: newFile
        })
    }

    render() {
        this.lng = localStorage.getItem("i18nextLng");
        const {value, editable} = this.state;
        console.log(this.props.normativeDocTypeOptions)
        const {tableData} = this.state;
        const columns = [
            {
                key: 'numberNmd',
                title: '#',
                dataIndex: 'numberNmd',
                width: '5%',
                render: (obj, rec, i) => obj && obj.valueStr && obj.valueStr[this.lng],
                sorter: (a, b) => a.numberNmd && b.numberNmd && parseInt(a.numberNmd.valueStr.ru) - parseInt(b.numberNmd.valueStr.ru),
                sortOrder: 'ascend'
            }, {
                key: 'normativeDocType',
                title: 'Вид ПиНМД',
                width: '20%',

                dataIndex: 'normativeDocType',
                render: (obj, rec) => ( <div className="editable-cell">
                        {

                            obj && this.state.editable[obj.idDataPropVal] ?
                                <div className="editable-cell-input-wrapper">
                                     <Select
                                        name="normativeDocType"
                                        onChange={(e) => this.handleChangeSelect(e, obj.idDataPropVal, 'normativeDocType')}
                                        onMenuOpen={this.loadChilds("normativeDocType")}

                                        options={
                                            this.props.normativeDocTypeOptions
                                                ? this.props.normativeDocTypeOptions.map(option => ({
                                                    value: option.id,
                                                    label: option.name[this.lng]
                                                }))
                                                : []
                                        }
                                    />

                                    <Icon
                                        type="check"
                                        className="editable-cell-icon-check"
                                        onClick={() => this.check(obj, 'normativeDocType')}
                                    />

                                </div>
                                :
                                <div className="editable-cell-text-wrapper">
                                    {obj ? obj.name ? obj.name[this.lng] : '' : ''}
                                    <Icon
                                        type="edit"
                                        className="editable-cell-icon"
                                        onClick={() => this.edit(obj.idDataPropVal)}
                                    />
                                </div>
                        }
                    </div>
                )


            }, {
                key: "docFile",
                title: 'Фаил документа',
                dataIndex: 'docFile',
                render: (obj, rec) => ( <div className="editable-cell">
                        {
                            obj && this.state.editable[obj.idDataPropVal] ?
                                <div className="editable-cell-input-wrapper">

                                    <label>
                                        <input
                                            type="file"
                                            style={{display: 'none'}}
                                            onChange={(e) => this.onChangeFile(e, "docFile")}/>
                                        <span className='ant-btn ant-btn-primary'><Icon
                                            type='upload'/>
                        <Badge className="badgeInputFile"
                               count={this.state.newFileArr["docFile"] && this.state.newFileArr['docFile'].length}>
                    </Badge>
                        <span>{this.props.t('UPLOAD_FILE')}</span></span>
                                    </label>

                                    <Icon
                                        type="check"
                                        className="editable-cell-icon-check"
                                        onClick={() => this.check(obj, 'docFile')}
                                    />
                                </div>
                                :
                                <div className="editable-cell-text-wrapper">
                                    {!!obj.name ?
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
                                                onClick={() => this.showFile(obj)}> </Button> : ""
                                    }

                                    <Icon
                                        type="edit"
                                        className="editable-cell-icon"
                                        onClick={() => this.edit(obj.idDataPropVal)}
                                    />
                                </div>
                        }
                    </div>
                )


            },


            {
                key: "archiveInfoDate1",
                title: 'Дата согласования',
                dataIndex: 'archiveInfoDate1',
                render: (obj, rec) => ( <div className="editable-cell">
                        {
                            obj && this.state.editable[obj.idDataPropVal] ?
                                <div className="editable-cell-input-wrapper">
                                    <DatePicker
                                        format="DD-MM-YYYY"
                                        value={moment(obj.valueStr[this.lng], "DD-MM-YYYY")}
                                        onChange={(e) => this.handleChangeDate(e, obj.idDataPropVal, 'archiveInfoDate1')}
                                        onPressEnter={() => this.check(obj)}
                                    />

                                    <Icon
                                        type="check"
                                        className="editable-cell-icon-check"
                                        onClick={() => this.check(obj, 'archiveInfoDate1')}
                                    />
                                </div>
                                :
                                <div className="editable-cell-text-wrapper">
                                    {obj ? obj.valueStr ? obj.valueStr[this.lng] : '' : ''}
                                    <Icon
                                        type="edit"
                                        className="editable-cell-icon"
                                        onClick={() => this.edit(obj.idDataPropVal)}
                                    />
                                </div>
                        }
                    </div>
                )
            },
            {
                key: "archiveInfoDate2",
                title: '№ протокола согласования',

                dataIndex: 'archiveInfoDate2',
                render: (obj, rec) => ( <div className="editable-cell">
                        {

                            this.state.editable[obj.idDataPropVal] ?
                                <div className="editable-cell-input-wrapper">
                                    <Input
                                        value={obj ? obj.valueStr ? obj.valueStr[this.lng] : '' : ''}
                                        onChange={(e) => this.handleChange(e, obj.idDataPropVal, 'archiveInfoDate2')}
                                        onPressEnter={() => this.check(obj)}
                                    />
                                    <Icon
                                        type="check"
                                        className="editable-cell-icon-check"
                                        onClick={() => this.check(obj, 'archiveInfoDate2')}
                                    />
                                </div>
                                :
                                <div className="editable-cell-text-wrapper">
                                    {obj ? obj.valueStr ? obj.valueStr[this.lng] : '' : ''}
                                    <Icon
                                        type="edit"
                                        className="editable-cell-icon"
                                        onClick={() => this.edit(obj.idDataPropVal)}
                                    />
                                </div>
                        }
                    </div>
                )

            },
            {
                key: "file3",


                title: 'Фаил протокола',
                dataIndex: 'file3',
                render: (obj, rec) => ( <div className="editable-cell">
                        {
                            obj && this.state.editable[obj.idDataPropVal] ?
                                <div className="editable-cell-input-wrapper">
                                    <label>
                                        <input
                                            type="file"
                                            style={{display: 'none'}}
                                            onChange={(e) => this.onChangeFile(e, "file3")}/>
                                        <span className='ant-btn ant-btn-primary'><Icon
                                            type='upload'/>
                        <Badge className="badgeInputFile"
                               count={this.state.newFileArr["file3"] && this.state.newFileArr['file3'].length}>
                    </Badge>
                        <span>{this.props.t('UPLOAD_FILE')}</span></span>
                                    </label>

                                    <Icon
                                        type="check"
                                        className="editable-cell-icon-check"
                                        onClick={() => this.check(obj, 'file3')}
                                    />
                                </div>
                                :
                                <div className="editable-cell-text-wrapper">
                                    {!!obj.name?
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
                                                onClick={() => this.showFile(obj)}> </Button>:""
                                    }

                                    <Icon
                                        type="edit"
                                        className="editable-cell-icon"
                                        onClick={() => this.edit(obj.idDataPropVal)}
                                    />
                                </div>
                        }
                    </div>
                )


            },
            {
                key: "delpost",
                title: 'Удалить запись',
                width: '20%',

                dataIndex: 'delpost',
                render: (text, record) => {
                    return (

                        <Popconfirm title="Удалить запись?" onConfirm={() => this.onDelete(record)}>
                            <Icon type="delete" style={{
                                cursor: 'pointer',
                                color: 'red'
                            }}/>
                        </Popconfirm>

                    );
                },
            }];
        return (
            <div>
                <Button className="editable-add-btn" onClick={this.handleAdd} style={{marginTop: 30}}>Добавить</Button>
                <Table bordered dataSource={tableData} columns={columns}/>
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
        );
    }
}


function mapStateToProps(state) {
    return {
        normativeDocTypeOptions: state.generalData.normativeDocType,

    };
}

export default connect(
    mapStateToProps,
    {
        getObjChildsByConst,
        getPropVal
    }
)(PiNMD_IK_FORM);




