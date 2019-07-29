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

    handleChange = (e, idDataPropVal, c) => {

        let tableData = [...this.state.tableData];
        let cell = tableData.find(el => el[this.props.tofiConstants[c].id].length > 0 && el[this.props.tofiConstants[c].id][0].idDataPropVal == idDataPropVal);

        cell[this.props.tofiConstants[c].id][0].value = e.target.value
        this.setState({
            tableData: tableData
        })
    };
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
    handleChangeSelect = (e, idDataPropVal, c) => {
        if (!!e) {
            let tableData = [...this.state.tableData];
            let cell = tableData.find(el => el[this.props.tofiConstants[c].id].length > 0 && el[this.props.tofiConstants[c].id][0].idDataPropVal == idDataPropVal);

            cell[this.props.tofiConstants[c].id][0].label = e.label
            cell[this.props.tofiConstants[c].id][0].value = e.value;
            this.setState({
                tableData: tableData
            })
        } else {
            let tableData = [...this.state.tableData];
            let cell = tableData.find(el => el[this.props.tofiConstants[c].id][0].idDataPropVal == idDataPropVal);
            cell[this.props.tofiConstants[c].id][0].label = ""
            cell[this.props.tofiConstants[c].id][0].value = ""
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
        if (c === "docFile") {
            let id = this.props.data[i].idDataPropVal

            if (!!this.state.newFile[`docFile${i}`]) {
                let prop = `docFile${i}`
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
                                propConst: "normMethDocs",
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
                        [`__Q__${c}`]: [this.state.newFile[`docFile${i}`]]
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
        else if ((c === "file3")) {
            let id = this.props.data[i].idDataPropVal

            if (!!this.state.newFile[`file3${i}`]) {
                let prop = `file3${i}`
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
                                propConst: "normMethDocs",
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
                        [`__Q__${c}`]: [this.state.newFile[`file3${i}`]]
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
            if (cell[this.props.tofiConstants[c].id][0] !== obj || c === "docFile" || c === "file3") {
                let data = []
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
                                    val: String(obj.value),
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
                        {})
                        .then(res => {
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
        const showLoad = message.loading('Сохранение', 0);
        var nextnumber = 1;
        if (!!this.state.tableData && this.state.tableData.length > 0) {
            var numbArr = [...this.state.tableData.map(el => {
                return el[this.props.tofiConstants["numberNmd"].id][0].value
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
                            val: String(1088),
                            typeProp: "11",
                            periodDepend: "2",
                            isUniq: "1"
                        },

                        {
                            propConst: "archiveInfoDate1",
                            val: {
                                kz: "_",
                                ru: "_",
                                en: "_",
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
        const showLoad = message.loading('Удаление');

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
        const {tableData} = this.state;
        const columns = [
            {
                key: this.props.tofiConstants["numberNmd"].id,
                title: '№',
                dataIndex: this.props.tofiConstants["numberNmd"].id,
                width: '5%',
                render: (obj, rec, i) => {
                    return obj.length > 0 && obj[0].value
                },
                sorter: (a, b) => {
                    return a[this.props.tofiConstants["numberNmd"].id][0] && b[this.props.tofiConstants["numberNmd"].id][0] && parseInt(a[this.props.tofiConstants["numberNmd"].id][0].value) - parseInt(b[this.props.tofiConstants["numberNmd"].id][0].value)
                },
                sortOrder: 'ascend'
            },
            {
                key: this.props.tofiConstants["normativeDocType"].id,
                title: 'Вид ПиНМД',
                width: '20%',
                dataIndex: this.props.tofiConstants["normativeDocType"].id,
                render: (obj, rec) => {
                    return (
                        <div className="editable-cell">
                            {
                                obj.length > 0 && obj[0] && this.state.editable[obj[0].idDataPropVal] ?
                                    <div className="editable-cell-input-wrapper">
                                        <Row>
                                            <Col span={20}>
                                                <Select
                                                    name="normativeDocType"
                                                    onChange={(e) => this.handleChangeSelect(e, obj[0].idDataPropVal, 'normativeDocType')}
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
                                            </Col>
                                            <Col span={4} style={{textAlign: 'right', paddingTop: '6px'}}>

                                                <Icon
                                                    type="check"
                                                    className="editable-cell-icon-check"
                                                    onClick={() => this.check(obj[0], 'normativeDocType')}
                                                />
                                            </Col>
                                        </Row>
                                    </div>
                                    :
                                    <div className="editable-cell-text-wrapper">
                                        {obj[0] ? obj[0].label : ''}
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
                key: this.props.tofiConstants["docFile"].id,
                title: 'Фаил документа',
                dataIndex: this.props.tofiConstants["docFile"].id,
                render: (obj, rec, i) => {
                    return ( <div className="editable-cell">
                            {
                                !!this.state.editFile[`docFile${i}`] ?
                                    <div className="editable-cell-input-wrapper">
                                        <Row>
                                            <Col span={20}>
                                                <label>
                                                    <input
                                                        type="file"
                                                        style={{display: 'none'}}
                                                        onChange={(e) => this.onChangeFile(e, "docFile", i)}/>
                                                    <span className='ant-btn ant-btn-primary'><Icon
                                                        type='upload'/>
                        <Badge className="badgeInputFile"
                               count={this.state.newFileArr && this.state.newFileArr[`docFile${i}`] && this.state.newFileArr[`docFile${i}`].length}>
                    </Badge>
                        <span>{this.props.t('UPLOAD_FILE')}</span></span>
                                                </label>
                                            </Col>
                                            <Col span={4} style={{textAlign: 'right', paddingTop: '6px'}}>

                                                <Icon
                                                    type="check"
                                                    className="editable-cell-icon-check"
                                                    onClick={() => this.check(obj[0], `docFile`, i)}
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
                                                onClick={() => this.editFile(`docFile${i}`)}
                                            />}
                                    </div>
                            }
                        </div>
                    )
                }
            },


            {
                key: this.props.tofiConstants["archiveInfoDate1"].id,
                title: 'Дата согласования',
                dataIndex: this.props.tofiConstants["archiveInfoDate1"].id,
                render: (obj, rec) => {
                    return ( <div className="editable-cell">
                            {
                                obj.length > 0 && obj[0] && this.state.editable[obj[0].idDataPropVal] ?
                                    <div className="editable-cell-input-wrapper">
                                        <Row>
                                            <Col span={20}>
                                                <DatePicker
                                                    format="DD-MM-YYYY"
                                                    value={obj[0].value !== "_" ? moment(obj[0].value, "DD-MM-YYYY") : ""}
                                                    onChange={(e) => this.handleChangeDate(e, obj[0].idDataPropVal, 'archiveInfoDate1')}
                                                    onPressEnter={() => this.check(obj[0])}
                                                />
                                            </Col>
                                            <Col span={4} style={{textAlign: 'right', paddingTop: '6px'}}>

                                                <Icon
                                                    type="check"
                                                    className="editable-cell-icon-check"
                                                    onClick={() => this.check(obj[0], 'archiveInfoDate1')}
                                                />
                                            </Col>
                                        </Row>
                                    </div>
                                    :
                                    <div className="editable-cell-text-wrapper">
                                        {obj.length > 0 && obj[0] ? obj[0].value ? obj[0].value !== "_" ? obj[0].value : "" : '' : ''}
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
                key: this.props.tofiConstants["archiveInfoDate2"].id,
                title: '№ протокола согласования',

                dataIndex: this.props.tofiConstants["archiveInfoDate2"].id,
                render: (obj, rec) => {
                    return ( <div className="editable-cell">
                            {

                                obj.length > 0 && obj[0] && this.state.editable[obj[0].idDataPropVal] ?
                                    <div className="editable-cell-input-wrapper">
                                        <Row>
                                            <Col span={20}>
                                                <Input
                                                    value={obj[0] ? obj[0].value ? obj[0].value : '' : ''}
                                                    onChange={(e) => this.handleChange(e, obj[0].idDataPropVal, 'archiveInfoDate2')}
                                                    onPressEnter={() => this.check(obj[0])}
                                                />
                                            </Col>
                                            <Col span={4} style={{textAlign: 'right', paddingTop: '6px'}}>

                                                <Icon
                                                    type="check"
                                                    className="editable-cell-icon-check"
                                                    onClick={() => this.check(obj[0], 'archiveInfoDate2')}
                                                />
                                            </Col>
                                        </Row>
                                    </div>
                                    :
                                    <div className="editable-cell-text-wrapper">
                                        {obj.length > 0 && obj[0] ? obj[0].value ? obj[0].value : '' : ''}
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
                key: this.props.tofiConstants["file3"].id,
                title: 'Фаил протокола',
                dataIndex: this.props.tofiConstants["file3"].id,
                render: (obj, rec, i) => ( <div className="editable-cell">
                        {

                            !!this.state.editFile[`file3${i}`] ?
                                <div className="editable-cell-input-wrapper">
                                    <Row>
                                        <Col span={20}>
                                            <label>
                                                <input
                                                    type="file"
                                                    style={{display: 'none'}}
                                                    onChange={(e) => this.onChangeFile(e, "file3", i)}/>
                                                <span className='ant-btn ant-btn-primary'><Icon
                                                    type='upload'/>
                        <Badge className="badgeInputFile"
                               count={this.state.newFileArr && this.state.newFileArr[`file3${i}`] && this.state.newFileArr[`file3${i}`].length}>
                    </Badge>
                        <span>{this.props.t('UPLOAD_FILE')}</span></span>
                                            </label>
                                        </Col>
                                        <Col span={4} style={{textAlign: 'right', paddingTop: '6px'}}>

                                            <Icon
                                                type="check"
                                                className="editable-cell-icon-check"
                                                onClick={() => this.check(obj[0], `file3`, i)}
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
                                            onClick={() => this.editFile(`file3${i}`)}
                                        />}
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




