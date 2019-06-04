import React from "react"
import {Table, Input, message,DatePicker, Icon, Button, Modal, Popconfirm} from 'antd';
import Select from "../../../Select";
import {connect} from "react-redux";

import {getFile, getObjChildsByConst, getPropVal} from "../../../../actions/actions";
import moment from "moment";

class PiNMD_IK_FORM extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: this.props.value,
            editable: false,
            dataSource: [],
            tableData: [],
            modalOpen:false
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
    showFile = (key) => {
        getFile(key).then(blob => {
            const url = URL.createObjectURL(new Blob([blob.data], {type: 'application/pdf'}));
            this.setState({
                modalOpen: true,
                file: <iframe src={`${url}#toolbar=0`} frameBorder="0"/>
            })
        })
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

    check = obj => {
        let editable = {...this.state.editable};
        editable[obj.idDataPropVal] = false;
        this.setState({editable: editable});
    };

    componentDidMount() {

        this.setState({
            tableData: this.props.data
        })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.setState({
                tableData: this.props.data
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
    onDelete = (key) => {
        const tableData = [...this.state.tableData];
        this.setState({tableData: tableData.filter(item => item.key !== key)});
    }
    handleAdd = () => {
        const {tableData} = this.state;
        const newData = {
            key: "",
            normativeDocType: ``,
            docFile: "",
            archiveInfoDate1: ``,
            archiveInfoDate2: "",
            file3: "",

        };
        this.setState({
            tableData: [...tableData, newData],

        });
    }
    loadChilds = (c, props) => {
        return () => {
            if (!this.props[c + "Options"]) {
                this.setState({
                    loading: { ...this.state.loading, [c + "Loading"]: true }
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
        console.log(this.props.normativeDocTypeOptions)
        const {tableData} = this.state;
        const columns = [{
            key: "№",
            title: '№',
            dataIndex: "№",
            width: '10%',
            render: (text, record, i) => i + 1
        }, {
            key: 'normativeDocType',
            title: 'Вид ПиНМД',
            dataIndex: 'normativeDocType',
            render: (obj, rec) => ( <div className="editable-cell">
                    {

                        this.state.editable[obj.idDataPropVal] ?
                            <div className="editable-cell-input-wrapper">
                                <Select
                                    name="normativeDocType"
                                    onChange={(e) => this.handleChangeSelect(e, obj.idDataPropVal, 'normativeDocType')}
                                    onPressEnter={() => this.check(obj)}
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
                                    onClick={() => this.check(obj)}
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
                        this.state.editable[obj.idDataPropVal] ?
                            <div className="editable-cell-input-wrapper">
                                <Select
                                    name="normativeDocType"
                                    onChange={(e) => this.handleChangeSelect(e, obj.idDataPropVal, 'normativeDocType')}
                                    onPressEnter={() => this.check(obj)}
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
                                    onClick={() => this.check(obj)}
                                />
                            </div>
                            :
                            <div className="editable-cell-text-wrapper">
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
                                        onClick={() => this.showFile(obj.valueFile.ru)}> </Button>
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
                            this.state.editable[obj.idDataPropVal] ?
                                <div className="editable-cell-input-wrapper">
                                    <DatePicker
                                        format="DD-MM-YYYY"
                                        value={moment(obj.valueStr[this.lng],"DD-MM-YYYY")}
                                        onChange={(e) => this.handleChangeDate(e, obj.idDataPropVal, 'archiveInfoDate1')}
                                        onPressEnter={() => this.check(obj)}
                                    />

                                    <Icon
                                        type="check"
                                        className="editable-cell-icon-check"
                                        onClick={() => this.check(obj)}
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
                                        onClick={() => this.check(obj)}
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
                            this.state.editable[obj.idDataPropVal] ?
                                <div className="editable-cell-input-wrapper">
                                    <Select
                                        name="normativeDocType"
                                        onChange={(e) => this.handleChangeSelect(e, obj.idDataPropVal, 'normativeDocType')}
                                        onPressEnter={() => this.check(obj)}
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
                                        onClick={() => this.check(obj)}
                                    />
                                </div>
                                :
                                <div className="editable-cell-text-wrapper">
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
                                            onClick={() => this.showFile(obj.valueFile.ru)}> </Button>
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
                dataIndex: 'delpost',
                render: (text, record) => {
                    return (
                        this.state.tableData.length > 1 ?
                            (
                                <Popconfirm title="Удалить запись?" onConfirm={() => this.onDelete(record.key)}>
                                    <Icon type="delete" style={{
                                        cursor: 'pointer',
                                        color: '#21bbb3'
                                    }}/>
                                </Popconfirm>
                            ) : null
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




