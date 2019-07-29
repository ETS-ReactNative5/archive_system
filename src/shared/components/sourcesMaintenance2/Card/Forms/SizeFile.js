import React from "react"
import {Table, Input, message, DatePicker, Badge, Row, Col, Icon, Button, Modal, Popconfirm} from 'antd';
import Select from "../../../Select";
import {connect} from "react-redux";
import "./PiNMD_IK_FORM.css"
import {
    getFile, getObjChildsByConst, getPropVal, dFile, updateCubeData2,
    getFileResolve, getFileData
} from "../../../../actions/actions";
import moment from "moment";
import * as uuid from "uuid";

class PiNMD_IK_FORM extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: this.props.value,
            editable: [],
            dataSource: [],
            tableData: [],
            newFileArr: {},
            newFile: {},
            oldTableData: [],
            modalOpen: false,
            editFile: {}
        };
    }


    handleChangeDate = (e, idDataPropVal, c) => {
        if (!!e) {
            let val = moment(e).format("DD-MM-YYYY")
            let tableData = [...this.state.tableData];
            let cell = tableData.find(el => el[this.props.tofiConstants[c].id].length > 0 && el[this.props.tofiConstants[c].id][0].idDataPropVal == idDataPropVal);
            cell[this.props.tofiConstants[c].id][0].value = val
            this.setState({
                tableData: tableData
            })
        }
    };

    showFile = (key) => {
        if (!!key.value) {
            let typeFile = ''//key.name.ru.split(".")[1]
            getFileResolve(key.value.__file__id).then(res => {

                getFile(key.value.__file__id).then(blob => {

                    if (res.data.type === "pdf" || res.data.type === "docx") {

                        const url = URL.createObjectURL(new Blob([blob.data], {type: 'application/pdf'}));
                        this.setState({
                            modalOpen: true,
                            file: <iframe src={`${url}#toolbar=0`} frameBorder="0"/>
                        })
                    }
                    else {
                        const url = URL.createObjectURL(new Blob([blob.data]));
                        this.setState({
                            modalOpen: true,
                            file: <img src={`${url}#toolbar=0`}/>
                        })
                    }


                })


            }).catch(e => {
                console.log(e)
                message.error("Файл не найден")
            })
        } else {
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

    check = (obj, c, i) => {
        let hideLoading = message.loading(this.props.t('UPDATING_PROPS'), 0);
        let editable = {...this.state.editable};
        let oldTableData = [...this.state.oldTableData];
        let datas = []
        if (c === "volumeFile") {
            let id = this.props.data[i].idDataPropVal

            if (!!this.state.newFile[`volumeFile${i}`]) {
                let prop = `volumeFile${i}`
                datas = [
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
                                propConst: "volumeComplex",
                                val: {
                                    kz: `${this.props.selectedIK.id}_${uuid()}`,
                                    ru: `${this.props.selectedIK.id}_${uuid()}`,
                                    en: `${this.props.selectedIK.id}_${uuid()}`
                                },
                                typeProp: '71',
                                periodDepend: "2",
                                isUniq: "2",
                                idDataPropVal: String(id),
                                mode: "upd",
                                child: [
                                    {
                                        propConst: c,
                                        typeProp: "317",
                                        periodDepend: "2",
                                        isUniq: "1",
                                        mode: "ins"
                                    }
                                ]
                            }
                        ],
                        periods: [{periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31'}]
                    }
                ];
                updateCubeData2(
                    'cubeForFundAndIK',
                    moment().format('YYYY-MM-DD'),
                    JSON.stringify(datas),
                    {},
                    {
                        [`__Q__${c}`]: [this.state.newFile[`volumeFile${i}`]]
                    },
                ).then(res => {
                    if (res.success == true) {
                        hideLoading()
                        message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'))
                        this.props.updateCube()
                        let obj = {...this.state.editFile}
                        obj[prop] = false
                        this.setState({
                            editFile: obj,
                            newFileArr: [],
                            newFile: {}
                        })
                    } else {
                        hideLoading()

                        message.error(res.errors[0].text)
                    }

                }).catch(e => {
                    hideLoading()
                    console.log(e)
                })

            }
        }

        else {
            let cell = oldTableData.find(el => el[this.props.tofiConstants[c].id].length > 0 && el[this.props.tofiConstants[c].id][0].idDataPropVal == obj.idDataPropVal);
            if (cell[this.props.tofiConstants[c].id][0] !== obj ) {
                let data = []
                if (c === "volumeNumb") {
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
                                        kz: obj.value,
                                        ru: obj.value,
                                        en: obj.value
                                    },
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
                        {}).then(res => {
                        if (res.success == true) {
                            hideLoading()

                            message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'))
                            this.props.updateCube()
                        } else {
                            hideLoading()
                            message.error(res.errors[0].text)
                        }

                    }).catch(e => {
                        hideLoading()
                        console.log(e)
                    })

                }

                if (c === "volumePassportDate") {
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
                                    val: moment(obj.value,"DD-MM-YYYY").format("YYYY-MM-DD"),
                                    typeProp: "312",
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
                        {}).then(res => {
                        if (res.success == true) {
                            hideLoading()

                            message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'))
                            this.props.updateCube()
                        } else {
                            hideLoading()
                            message.error(res.errors[0].text)
                        }

                    }).catch(e => {
                        hideLoading()
                        console.log(e)
                    })

                }

            }
            else {
                hideLoading()

            }
            editable[obj.idDataPropVal] = false;

            this.setState({editable: editable});
        }

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

    onDelete = (rec) => {
        const showDelete = message.loading(this.props.t('UPDATING_PROPS'), 0);

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
                    propConst: "volumeComplex",
                    idDataPropVal: rec.idDataPropVal,
                    val: {
                        kz: String(rec.value),
                        ru: String(rec.value),
                        en: String(rec.value)
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
                this.props.updateCube()


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
        const showLoad = message.loading(this.props.t('UPDATING_PROPS'), 0);
        var nextnumber = 1;
        if (!!this.state.tableData && this.state.tableData.length > 0) {
            var numbArr = [...this.state.tableData.map(el => {
                return el[this.props.tofiConstants["volumeNumb"].id][0].value
            })
            ];
            nextnumber = Math.max(...numbArr) + 1;
        }
        else {

        }

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
                    propConst: "volumeComplex",
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
                            propConst: "volumeNumb",
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
                            propConst: "volumePassportDate",
                            val:"1800-01-01",
                            typeProp: "312",
                            periodDepend: "2",
                            isUniq: "1",

                        },

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
                message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'));
                this.props.updateCube()
            } else {
                showLoad();
                message.error(res.errors[0].text)
            }
        });
    }

    onChangeFile = (e, c, i) => {
        let newFile = {...this.state.newFile};
        let newFileArr = [...this.state.newFileArr];
        if (newFile) {
            if (!!newFile[`${c}${i}`]) {
                newFile[i][`${c}${i}`] = e.target.files[0]
            } else {
                newFile = {
                    [`${c}${i}`]: e.target.files[0]
                }
            }
        }


        if (newFileArr) {
            if (!!newFileArr[`${c}${i}`]) {
                newFileArr[`${c}${i}`] = e.target.files
            } else {
                newFileArr = {
                    [`${c}${i}`]: e.target.files
                }
            }
        } else {
            newFileArr = {[`${c}${i}`]: e.target.files}
        }
        this.setState({
            newFileArr: newFileArr,
            newFile: newFile
        })
    }
    editFile = (c) => {
        let obj = {...this.state.editFile}
        obj[c] = true
        this.setState({
            editFile: obj
        })
    }
    delFile = async (obj) => {
        const showLoad = message.loading(this.props.t('UPDATING_PROPS'), 0);

        let res = await dFile(obj[0].value.__file__id, "cubeForFundAndIK");
        if (!res.success) {
            //  on fail stop here with message;
            res.errors.forEach(err => {
                message.error(err.text);
            });
            showLoad()

        }
        showLoad()
        this.props.updateCube()

    }

    render() {
        this.lng = localStorage.getItem("i18nextLng");
        const {value, editable} = this.state;
        const t = this.props.t
        const {tableData} = this.state;
        const columns = [
            {
                key: this.props.tofiConstants["volumeNumb"].id,
                title: '№',
                dataIndex: this.props.tofiConstants["volumeNumb"].id,
                width: '5%',
                render: (obj, rec, i) => {
                    return obj.length > 0 && obj[0].value
                },
                sorter: (a, b) => {
                    return a[this.props.tofiConstants["volumeNumb"].id][0] && b[this.props.tofiConstants["volumeNumb"].id][0] && parseInt(a[this.props.tofiConstants["volumeNumb"].id][0].value) - parseInt(b[this.props.tofiConstants["volumeNumb"].id][0].value)
                },
                sortOrder: 'ascend'
            },
            {
                key: this.props.tofiConstants["volumePassportDate"].id,
                title:  this.props.tofiConstants["volumePassportDate"].name[this.lng],
                dataIndex: this.props.tofiConstants["volumePassportDate"].id,
                render: (obj, rec) => {
                    return ( <div className="editable-cell">
                            {
                                obj.length > 0 && obj[0] && this.state.editable[obj[0].idDataPropVal] ?
                                    <div className="editable-cell-input-wrapper">
                                        <Row>
                                            <Col span={20}>
                                                <DatePicker
                                                    format="DD-MM-YYYY"
                                                    value={obj[0].value !== "01-01-1800" ? moment(obj[0].value, "DD-MM-YYYY") : ""}
                                                    onChange={(e) => this.handleChangeDate(e, obj[0].idDataPropVal, 'volumePassportDate')}
                                                    onPressEnter={() => this.check(obj[0])}
                                                />
                                            </Col>
                                            <Col span={4} style={{textAlign: 'right', paddingTop: '6px'}}>

                                                <Icon
                                                    type="check"
                                                    className="editable-cell-icon-check"
                                                    onClick={() => this.check(obj[0], 'volumePassportDate')}
                                                />
                                            </Col>
                                        </Row>
                                    </div>
                                    :
                                    <div className="editable-cell-text-wrapper">
                                        {obj.length > 0 && obj[0] ? obj[0].value ? obj[0].value !== "01-01-1800" ? obj[0].value : "" : '' : ''}
                                        <Icon
                                            type="edit"
                                            className="editable-cell-icon"
                                            onClick={() => this.edit(obj[0].idDataPropVal)}
                                        />
                                    </div>
                            }
                        </div>
                    )
                }
            },

            {
                key: this.props.tofiConstants["volumeFile"].id,
                title: this.props.tofiConstants["volumeFile"].name[this.lng],
                dataIndex: this.props.tofiConstants["volumeFile"].id,
                render: (obj, rec, i) => {
                    return ( <div className="editable-cell">
                            {
                                !!this.state.editFile[`volumeFile${i}`] ?
                                    <div className="editable-cell-input-wrapper">
                                        <Row>
                                            <Col span={20}>
                                                <label>
                                                    <input
                                                        type="file"
                                                        style={{display: 'none'}}
                                                        onChange={(e) => this.onChangeFile(e, "volumeFile", i)}/>
                                                    <span className='ant-btn ant-btn-primary'><Icon
                                                        type='upload'/>
                        <Badge className="badgeInputFile"
                               count={this.state.newFileArr && this.state.newFileArr[`volumeFile${i}`] && this.state.newFileArr[`volumeFile${i}`].length}>
                    </Badge>
                        <span>{this.props.t('UPLOAD_FILE')}</span></span>
                                                </label>
                                            </Col>
                                            <Col span={4} style={{textAlign: 'right', paddingTop: '6px'}}>

                                                <Icon
                                                    type="check"
                                                    className="editable-cell-icon-check"
                                                    onClick={() => this.check(obj[0], `volumeFile`, i)}
                                                />
                                            </Col>
                                        </Row>
                                    </div>
                                    :
                                    <div className="editable-cell-text-wrapper">
                                        {obj.length > 0 ?
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
                                                    onClick={() => this.showFile(obj[0])}> </Button> : ""
                                        }
                                        {obj.length > 0 ?
                                            <Icon
                                                type="delete"
                                                style={{color: "red"}}
                                                className="editable-cell-icon"
                                                onClick={() => this.delFile(obj)}
                                            /> :
                                            <Icon
                                                type="edit"
                                                className="editable-cell-icon"
                                                onClick={() => this.editFile(`volumeFile${i}`)}
                                            />}
                                    </div>
                            }
                        </div>
                    )
                }
            },
            {
                key: "delpost",
                title: t("DELETPOST"),
                width: '20%',
                dataIndex: 'delpost',
                render: (text, record) => {
                    return (
                        <Popconfirm title={t("DELETPOST")} onConfirm={() => this.onDelete(record)}>
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
                <Button type="primary" icon="plus-circle-o" onClick={this.handleAdd}
                        style={{marginTop: 40, marginBottom: 10}}>Добавить</Button>

                <Table className="tablepnd" bordered dataSource={tableData} columns={columns}/>
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




