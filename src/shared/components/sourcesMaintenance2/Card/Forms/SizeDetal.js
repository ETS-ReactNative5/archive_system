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
import axios from "axios"

class SizeDetal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: this.props.value,
            editable: [],
            dataSource: [],
            tableData: [],
            oldTableData: [],
            editcolum: "",
            detailsDocumentType: {},
            detailsSubtypeDoc: {},
            detailsStatus: {},
            detailsMeasure: {},
            detailsVolume: null,
            detailsReportDate: null,
            detailsEarlyDate: null,
            detailsLateDate: null,
            modalOpen: false,
        };
    }

    handleChange = (e, c) => {

        this.setState({
            [c]: e.target.value
        })
    };
    handleChangeDate = (e, c) => {
        if (!!e) {
            let val = moment(e).format("DD-MM-YYYY")
            this.setState({
                [c]: val
            })
        }
    };
    handleChangeSelect = (e, c) => {
        if (!!e) {

            if (c === "detailsDocumentType") {
                this.setState({
                    detailsSubtypeDoc: {},
                    detailsStatus: {},
                    detailsMeasure: {},
                })
            }
            if (c === "detailsSubtypeDoc") {
                this.setState({
                    detailsStatus: {},
                    detailsMeasure: {},
                })
            }
            if (c === "detailsStatus") {
                this.setState({
                    detailsMeasure: {},
                })
            }
            let obj = {
                label: e.label,
                value: e.value
            }
            this.setState({
                [c]: obj
            })
        } else {
            if (c === "detailsDocumentType") {
                this.setState({
                    detailsSubtypeDoc: {},
                    detailsStatus: {},
                    detailsMeasure: {},
                })
            }
            if (c === "detailsSubtypeDoc") {
                this.setState({
                    detailsStatus: {},
                    detailsMeasure: {},
                })
            }
            if (c === "detailsStatus") {
                this.setState({
                    detailsMeasure: {},
                })
            }
            this.setState({
                [c]: {}
            })
        }


    };

    edit = (i) => {
        this.setState({
            editcolum: String(i),
            detailsDocumentType: {},
            detailsSubtypeDoc: {},
            detailsStatus: {},
            detailsMeasure: {},
            detailsVolume: null,
            detailsReportDate: null,
            detailsEarlyDate: null,
            detailsLateDate: null,


        });
    };
    canleiColum = () => {
        this.setState({
            editcolum: "",
            detailsDocumentType: {},
            detailsSubtypeDoc: {},
            detailsStatus: {},
            detailsMeasure: {},
            detailsVolume: null,
            detailsReportDate: null,
            detailsEarlyDate: null,
            detailsLateDate: null,
        });
    }
    check = (obj, c, i) => {
        let hideLoading = message.loading(this.props.t('UPDATING_PROPS'), 0);

        let editable = {...this.state.editable};
        let oldTableData = [...this.state.oldTableData];
        let datas = []
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
                            propConst: "detailsComplex",
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
                            child: []
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
                {},
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
                    propConst: "detailsComplex",
                    idDataPropVal: rec.detailsComplex.idDataPropVal,
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
        let data = [
            {
                own: [{
                    doConst: 'doForFundAndIK',
                    doItem: String(this.props.selectedIK.id),
                    isRel: "0",
                    objData: {}
                }
                ],
                props: [{
                    propConst: "detailsComplex",
                    val: {
                        kz: `${this.props.selectedIK.id}_${uuid()}`,
                        ru: `${this.props.selectedIK.id}_${uuid()}`,
                        en: `${this.props.selectedIK.id}_${uuid()}`
                    },
                    typeProp: "71",
                    periodDepend: "2",
                    isUniq: "2",
                    mode: "ins",
                    child: []
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
    loadChilds = (c, factor) => {
        if (c === "detailsDocumentType") {
            const fd = new FormData();
            fd.append('factor', String(factor));
            axios.post(`/${localStorage.getItem('i18nextLng')}/factorVal/getFactorValRel`, fd)
                .then(res => {
                    if (res.data.success) {
                        this.setState({
                            [`${c}Options`]:res.data.data
                        })

                    } else {
                        if (res.data.errors) {
                            res.data.errors.forEach(err => {
                                message.error(err.text);
                            });
                            return false
                        }
                    }
                })
                .catch(e => {
                    console.log(e)
                })
        }
        if (c === "detailsSubtypeDoc") {
            const fd = new FormData();
            fd.append('factor', String(factor));
            fd.append('fv1', String(this.state.detailsDocumentType.value));
            axios.post(`/${localStorage.getItem('i18nextLng')}/factorVal/getFactorValRel`, fd)
                .then(res => {
                    if (res.data.success) {
                        this.setState({
                            [`${c}Options`]:res.data.data
                        })

                    } else {
                        if (res.data.errors) {
                            res.data.errors.forEach(err => {
                                message.error(err.text);
                            });
                            return false
                        }
                    }
                })
                .catch(e => {
                    console.log(e)
                })
        }
        if (c === "detailsStatus") {
            const fd = new FormData();
            fd.append('factor', String(factor));
            fd.append('fv1', String(this.state.detailsDocumentType.value));
            fd.append('fv2', String(this.state.detailsSubtypeDoc.value));

            axios.post(`/${localStorage.getItem('i18nextLng')}/factorVal/getFactorValRel`, fd)
                .then(res => {
                    if (res.data.success) {
                        this.setState({
                            [`${c}Options`]:res.data.data
                        })

                    } else {
                        if (res.data.errors) {
                            res.data.errors.forEach(err => {
                                message.error(err.text);
                            });
                            return false
                        }
                    }
                })
                .catch(e => {
                    console.log(e)
                })
        }
        if (c === "detailsMeasure") {
            const fd = new FormData();
            fd.append('factor', String(factor));
            fd.append('fv1', String(this.state.detailsDocumentType.value));
            fd.append('fv2', String(this.state.detailsSubtypeDoc.value));
            fd.append('fv3', String(this.state.detailsStatus.value));
            axios.post(`/${localStorage.getItem('i18nextLng')}/factorVal/getFactorValRel`, fd)
                .then(res => {
                    if (res.data.success) {
                        this.setState({
                            [`${c}Options`]:res.data.data
                        })

                    } else {
                        if (res.data.errors) {
                            res.data.errors.forEach(err => {
                                message.error(err.text);
                            });
                            return false
                        }
                    }
                })
                .catch(e => {
                    console.log(e)
                })
        }
    };

    render() {
        this.lng = localStorage.getItem("i18nextLng");
        const {value, editable} = this.state;
        const t = this.props.t
        let editcoluum = this.state.editcolum
        const {tableData} = this.state;
        const columns = [
            {
                key: "detailsReportDate",
                title: this.props.tofiConstants["detailsReportDate"].name[this.lng],
                dataIndex: "detailsReportDate",
                width: '10%',
                render: (obj, rec, i) => {
                    return ( <div className="editable-cell">
                            {
                                editcoluum === String(i) ?
                                    <div className="editable-cell-input-wrapper">
                                        <Row>
                                            <Col span={20}>
                                                <DatePicker
                                                    format="DD-MM-YYYY"
                                                    value={!!obj && !!obj.value ? moment(obj.value, "DD-MM-YYYY") : ""}
                                                    onChange={(e) => this.handleChangeDate(e, 'detailsReportDate')}
                                                />
                                            </Col>
                                        </Row>
                                    </div>
                                    :
                                    <div className="editable-cell-text-wrapper">
                                        {!!obj && !!obj.value ? obj.value : ""}

                                    </div>
                            }
                        </div>
                    )
                }
            },

            {
                key: "detailsDocumentType",
                title: this.props.tofiConstants["detailsDocumentType"].name[this.lng],
                width: '10%',
                dataIndex: "detailsDocumentType",
                render: (obj, rec, i) => {
                    return (
                        <div className="editable-cell">
                            {
                                editcoluum === String(i) ?
                                    <div className="editable-cell-input-wrapper">
                                        <Row>
                                            <Col span={20}>
                                                <Select
                                                    name="detailsDocumentType"
                                                    value={this.state.detailsDocumentType}
                                                    onChange={(e) => this.handleChangeSelect(e, 'detailsDocumentType')}
                                                    onMenuOpen={()=>this.loadChilds("detailsDocumentType", 1117)}
                                                    options={
                                                        this.state.detailsDocumentTypeOptions
                                                            ? this.state.detailsDocumentTypeOptions.map(option => ({
                                                                value: option.id,
                                                                label: option.name[this.lng]
                                                            }))
                                                            : []
                                                    }
                                                />
                                            </Col>

                                        </Row>
                                    </div>
                                    :
                                    <div className="editable-cell-text-wrapper">
                                        {!!obj ? obj.label : ''}
                                    </div>
                            }
                        </div>
                    )
                }
            },
            {
                key: "detailsSubtypeDoc",
                title: this.props.tofiConstants["detailsSubtypeDoc"].name[this.lng],
                width: '10%',
                dataIndex: "detailsSubtypeDoc",
                render: (obj, rec, i) => {
                    return (
                        <div className="editable-cell">
                            {
                                editcoluum === String(i) ?
                                    <div className="editable-cell-input-wrapper">
                                        <Row>
                                            <Col span={20}>
                                                <Select
                                                    name="detailsSubtypeDoc"
                                                    onChange={(e) => this.handleChangeSelect(e, 'detailsSubtypeDoc')}
                                                    value={this.state.detailsSubtypeDoc}

                                                    onMenuOpen={()=>this.loadChilds("detailsSubtypeDoc", 1118)}
                                                    disabled={Object.keys(this.state.detailsDocumentType).length == 0}
                                                    options={
                                                        this.state.detailsSubtypeDocOptions
                                                            ? this.state.detailsSubtypeDocOptions.map(option => ({
                                                                value: option.id,
                                                                label: option.name[this.lng]
                                                            }))
                                                            : []
                                                    }
                                                />
                                            </Col>

                                        </Row>
                                    </div>
                                    :
                                    <div className="editable-cell-text-wrapper">
                                        {!!obj ? obj.label : ''}
                                    </div>
                            }
                        </div>
                    )
                }
            },
            {
                key: "detailsStatus",
                title: this.props.tofiConstants["detailsStatus"].name[this.lng],
                width: '10%',
                dataIndex: "detailsStatus",
                render: (obj, rec, i) => {
                    return (
                        <div className="editable-cell">
                            {
                                editcoluum === String(i) ?
                                    <div className="editable-cell-input-wrapper">
                                        <Row>
                                            <Col span={20}>
                                                <Select
                                                    name="detailsStatus"
                                                    onChange={(e) => this.handleChangeSelect(e, 'detailsStatus')}
                                                    onMenuOpen={()=>this.loadChilds("detailsStatus", 1119)}
                                                    value={this.state.detailsStatus}

                                                    disabled={Object.keys(this.state.detailsSubtypeDoc).length == 0}

                                                    options={
                                                        this.state.detailsStatusOptions
                                                            ? this.state.detailsStatusOptions.map(option => ({
                                                                value: option.id,
                                                                label: option.name[this.lng]
                                                            }))
                                                            : []
                                                    }
                                                />
                                            </Col>

                                        </Row>
                                    </div>
                                    :
                                    <div className="editable-cell-text-wrapper">
                                        {!!obj ? obj.label : ''}
                                    </div>
                            }
                        </div>
                    )
                }
            },

            {
                key: "detailsMeasure",
                title: this.props.tofiConstants["detailsMeasure"].name[this.lng],
                width: '10%',
                dataIndex: "detailsMeasure",
                render: (obj, rec, i) => {
                    return (
                        <div className="editable-cell">
                            {
                                editcoluum === String(i) ?
                                    <div className="editable-cell-input-wrapper">
                                        <Row>
                                            <Col span={20}>
                                                <Select
                                                    name="detailsMeasure"
                                                    onChange={(e) => this.handleChangeSelect(e, 'detailsMeasure')}
                                                    onMenuOpen={()=>this.loadChilds("detailsMeasure", 1120)}
                                                    value={this.state.detailsMeasure}

                                                    disabled={Object.keys(this.state.detailsStatus).length == 0}
                                                    options={
                                                        this.state.detailsMeasureOptions
                                                            ? this.state.detailsMeasureOptions.map(option => ({
                                                                value: option.id,
                                                                label: option.name[this.lng]
                                                            }))
                                                            : []
                                                    }
                                                />
                                            </Col>

                                        </Row>
                                    </div>
                                    :
                                    <div className="editable-cell-text-wrapper">
                                        {!!obj ? obj.label : ''}
                                    </div>
                            }
                        </div>
                    )
                }
            },

            {
                key: "detailsVolume",
                title: this.props.tofiConstants["detailsVolume"].name[this.lng],
                width: '10%',
                dataIndex: "detailsVolume",
                render: (obj, rec, i) => {
                    return ( <div className="editable-cell">
                            {
                                editcoluum === String(i) ?
                                    <div className="editable-cell-input-wrapper">
                                        <Row>
                                            <Col span={20}>
                                                <Input
                                                    value={!!obj ? obj.value : ''}
                                                    onChange={(e) => this.handleChange(e, 'detailsVolume')}
                                                />
                                            </Col>
                                        </Row>
                                    </div>
                                    :
                                    <div className="editable-cell-text-wrapper">
                                        {!!obj && !!obj.value && obj.value}
                                    </div>
                            }
                        </div>
                    )
                }

            },

            {
                key: "detailsEarlyDate",
                title: this.props.tofiConstants["detailsEarlyDate"].name[this.lng],
                dataIndex: "detailsEarlyDate",
                width: '10%',
                render: (obj, rec, i) => {
                    return ( <div className="editable-cell">
                            {
                                editcoluum === String(i) ?
                                    <div className="editable-cell-input-wrapper">
                                        <Row>
                                            <Col span={20}>
                                                <DatePicker
                                                    format="DD-MM-YYYY"
                                                    value={!!obj && !!obj.value ? moment(obj.value, "DD-MM-YYYY") : ""}
                                                    onChange={(e) => this.handleChangeDate(e, 'detailsEarlyDate')}
                                                />
                                            </Col>
                                        </Row>
                                    </div>
                                    :
                                    <div className="editable-cell-text-wrapper">
                                        {!!obj && !!obj.value ? obj.value : ""}

                                    </div>
                            }
                        </div>
                    )
                }
            },
            {
                key: "detailsLateDate",
                title: this.props.tofiConstants["detailsLateDate"].name[this.lng],
                dataIndex: "detailsLateDate",
                width: '10%',
                render: (obj, rec, i) => {
                    return ( <div className="editable-cell">
                            {
                                editcoluum === String(i) ?
                                    <div className="editable-cell-input-wrapper">
                                        <Row>
                                            <Col span={20}>
                                                <DatePicker
                                                    format="DD-MM-YYYY"
                                                    value={!!obj && !!obj.value ? moment(obj.value, "DD-MM-YYYY") : ""}
                                                    onChange={(e) => this.handleChangeDate(e, 'detailsLateDate')}
                                                />
                                            </Col>
                                        </Row>
                                    </div>
                                    :
                                    <div className="editable-cell-text-wrapper">
                                        {!!obj && !!obj.value ? obj.value : ""}

                                    </div>
                            }
                        </div>
                    )
                }
            },
            {
                key: "editpost",
                title: t("EDITPOST"),
                width: '10%',
                dataIndex: 'editpost',
                render: (text, record, i) => {
                    return (
                        <div>
                            {editcoluum === String(i) ?
                                <div>
                                    <Icon type="check" style={{
                                        cursor: 'pointer',
                                        color: 'green'
                                    }}/>
                                    <Icon type="close" onClick={this.canleiColum} style={{
                                        cursor: 'pointer',
                                        color: 'red',
                                        marginLeft: 10
                                    }}/>
                                </div> :

                                <Icon type="edit" onClick={() => this.edit(i)} style={{
                                    cursor: 'pointer',
                                    color: 'green'
                                }}/>


                            }

                        </div>
                    );
                },
            },


            {
                key: "delpost",
                title: t("DELETPOST"),
                width: '10%',
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
)(SizeDetal);




