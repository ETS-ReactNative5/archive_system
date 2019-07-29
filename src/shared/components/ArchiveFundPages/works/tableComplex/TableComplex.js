import React from "react"
import {Table, Input, message, DatePicker, Badge, Row, Col, Icon, Button, Modal, Popconfirm} from 'antd';
import Select from "../../../Select";
import {connect} from "react-redux";
import "./TableComplez.css"
import {
    getFile, getObjChildsByConst, getPropVal, dFile, updateCubeData2,
    getFileResolve, getFileData
} from "../../../../actions/actions";
import moment from "moment";
import * as uuid from "uuid";

class TableComplex extends React.Component {
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





    edit = (idDataPropVal) => {
        let editable = {...this.state.editable};
        editable[idDataPropVal] = true;
        this.setState({editable: editable});
    };

    check = (obj, c, i) => {
        let hideLoading = message.loading(this.props.t('UPDATING_PROPS'), 0);

        let editable = {...this.state.editable};
        let oldTableData = [...this.state.oldTableData];
          let cell = oldTableData.find(el => el[this.props.tofiConstants[c].id].length > 0 && el[this.props.tofiConstants[c].id][0].idDataPropVal == obj.idDataPropVal);
            if (cell[this.props.tofiConstants[c].id][0] !== obj) {
                let data = []
                if (c === "markSearchCourseDate") {
                    data = [
                        {
                            own: [{
                                doConst: 'doForWorks',
                                doItem: String(this.props.initialValues.key),
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
                        'cubeForWorks',
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
                if (c === "markSearchCourseAbout") {
                    data = [
                        {
                            own: [{
                                doConst: 'doForWorks',
                                doItem: String(this.props.initialValues.key),
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
                        'cubeForWorks',
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
        const showDelete = message.loading('Удаление');

        var data = [
            {
                own: [{
                    doConst: 'doForWorks',
                    doItem: String(this.props.initialValues.key),
                    isRel: "0",
                    objData: {}
                }
                ],
                props: [{
                    propConst: "markSearchCourse",
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
            'cubeForWorks',
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
                return el[this.props.tofiConstants["markSearchCourseNumber"].id][0].value
            })
            ];
            nextnumber = Math.max(...numbArr) + 1;
        }
        else {

        }

        var data = [
            {
                own: [{
                    doConst: 'doForWorks',
                    doItem: String(this.props.initialValues.key),
                    isRel: "0",
                    objData: {}
                }
                ],
                props: [{
                    propConst: "markSearchCourse",
                    val: {
                        kz: `${this.props.initialValues.key}_${uuid()}`,
                        ru: `${this.props.initialValues.key}_${uuid()}`,
                        en: `${this.props.initialValues.key}_${uuid()}`
                    },
                    typeProp: "71",
                    periodDepend: "2",
                    isUniq: "2",
                    mode: "ins",
                    child: [
                        {
                            propConst: "markSearchCourseNumber",
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
                            propConst: "markSearchCourseDate",
                            val:"1800-01-01",

                            typeProp: "312",
                            periodDepend: "2",
                            isUniq: "1",

                        },
                        {
                            propConst: "markSearchCourseAbout",
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
            'cubeForWorks',
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


    render() {
        this.lng = localStorage.getItem("i18nextLng");
        const {value, editable} = this.state;
        const t = this.props.t
        const {tableData} = this.state;
        const columns = [
            {
                key: this.props.tofiConstants["markSearchCourseNumber"].id,
                title: this.props.tofiConstants["markSearchCourseNumber"].name[this.lng],
                dataIndex: this.props.tofiConstants["markSearchCourseNumber"].id,
                width: '5%',
                render: (obj, rec, i) => {
                    return obj.length > 0 && obj[0].value
                },
                sorter: (a, b) => {
                    return a[this.props.tofiConstants["markSearchCourseNumber"].id][0] && b[this.props.tofiConstants["markSearchCourseNumber"].id][0] && parseInt(a[this.props.tofiConstants["markSearchCourseNumber"].id][0].value) - parseInt(b[this.props.tofiConstants["markSearchCourseNumber"].id][0].value)
                },
                sortOrder: 'ascend'
            },

            {
                key: this.props.tofiConstants["markSearchCourseDate"].id,
                title: this.props.tofiConstants["markSearchCourseDate"].name[this.lng],
                dataIndex: this.props.tofiConstants["markSearchCourseDate"].id,
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
                                                    onChange={(e) => this.handleChangeDate(e, obj[0].idDataPropVal, 'markSearchCourseDate')}
                                                    onPressEnter={() => this.check(obj[0])}
                                                />
                                            </Col>
                                            <Col span={4} style={{textAlign: 'right', paddingTop: '6px'}}>

                                                <Icon
                                                    type="check"
                                                    className="editable-cell-icon-check"
                                                    onClick={() => this.check(obj[0], 'markSearchCourseDate')}
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
                key: this.props.tofiConstants["markSearchCourseAbout"].id,
                title:this.props.tofiConstants["markSearchCourseAbout"].name[this.lng] ,
                dataIndex: this.props.tofiConstants["markSearchCourseAbout"].id,
                render: (obj, rec) => {
                    return ( <div className="editable-cell">
                            {

                                obj.length > 0 && obj[0] && this.state.editable[obj[0].idDataPropVal] ?
                                    <div className="editable-cell-input-wrapper">
                                        <Row>
                                            <Col span={20}>
                                                <Input
                                                    value={obj[0] ? obj[0].value ? obj[0].value : '' : ''}
                                                    onChange={(e) => this.handleChange(e, obj[0].idDataPropVal, 'markSearchCourseAbout')}
                                                    onPressEnter={() => this.check(obj[0])}
                                                />
                                            </Col>
                                            <Col span={4} style={{textAlign: 'right', paddingTop: '6px'}}>

                                                <Icon
                                                    type="check"
                                                    className="editable-cell-icon-check"
                                                    onClick={() => this.check(obj[0], 'markSearchCourseAbout')}
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
                <hr/>

                <Button type="primary" icon="plus-circle-o" onClick={this.handleAdd}
                        style={{marginTop: 10,marginLeft:11, marginBottom: 10}}>{t('ADD')}</Button>

                <Table className="tablepnd" bordered dataSource={tableData} columns={columns}/>


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
)(TableComplex);




