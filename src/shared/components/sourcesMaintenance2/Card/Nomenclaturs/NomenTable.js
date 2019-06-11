import React from "react"
import {parseCube_new, parseForTable} from "../../../../utils/cubeParser";
import {getFile, getIdGetObj} from "../../../../actions/actions";
import axios from 'axios';
import AntTable from "../../../AntTable";
import {isEmpty, isEqual} from "lodash";
import {Button, Icon, Modal} from "antd";
class NomenTable extends React.Component {

    state = {
        data: {},
        cubeData: {},
        modalOpen: false
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


    buildComponent = () => {
        if (this.props.listIdOfNomen.length > 0) {
            var StringedlistArr = this.props.listIdOfNomen.join(',');
            const filterNomen = {
                filterDPAnd: [
                    {
                        dimConst: 'dimPropNomen',
                        concatType: "and",
                        conds: [
                            {
                                consts: "nomenNumber,nomenYear,fileNomen,nomenPerechen,nomenApprovalDate,nomenApprovalDocNumber,nomenApprovalFile,nomenAgreementDate,nomenAgreementDocNumber,nomenAgreementFile"
                            }
                        ]
                    }
                ],
                filterDOAnd: [
                    {
                        dimConst: 'dimObjNomen',
                        concatType: "and",
                        conds: [
                            {
                                ids: String(StringedlistArr)
                            }
                        ]
                    }
                ],
            };
            const fd = new FormData();
            fd.append("cubeSConst", 'cubeSNomen');
            fd.append("filters", JSON.stringify(filterNomen));
            axios.post(`/${localStorage.getItem('i18nextLng')}/cube/getCubeData`, fd).then(res3 => {
                var cubeData = res3.data.data;
                const parsedCube = parseCube_new(
                cubeData["cube"],
                [],
                "dp",
                "do",
                cubeData['do_' + this.props.tofiConstants.dimObjNomen.id],
                cubeData['dp_' + this.props.tofiConstants.dimPropNomen.id],
                ['do_' + this.props.tofiConstants.dimObjNomen.id],
                ['dp_' + this.props.tofiConstants.dimPropNomen.id]
                );

                var tableData = parsedCube.map(this.renderTableData);
                this.setState({
                    tableData: tableData
                });
            });
        }

    };

    renderTableData = (item, idx) => {
        const result = {
            key: item.id,
            name: item.name
        };
        const constArr = ['nomenNumber', 'nomenYear', 'fileNomen', 'nomenPerechen', 'nomenApprovalDate', 'nomenApprovalDocNumber', 'nomenApprovalFile', 'nomenAgreementDate', 'nomenAgreementDocNumber', 'nomenAgreementFile'];
        parseForTable(item.props, this.props.tofiConstants, result, constArr);
        return result;
    };


    componentDidMount() {
        this.buildComponent();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.listIdOfNomen !== this.props.listIdOfNomen) {
            this.buildComponent();
        }
    }


    onRowClick = record => {
        this.setState({selectedRow: record})

    };

    showFile = (key) => {
        getFile(key.name).then(blob => {
            const url = URL.createObjectURL(new Blob([blob.data], {type: 'image/jpeg'}));
            this.setState({
                modalOpen: true,
                file: <iframe src={`${url}#toolbar=0`} frameBorder="0"/>
            })
        })
    };

    render() {
        const {t} = this.props;
        const {nomenYear, fileNomen, nomenPerechen, nomenApprovalDate, nomenApprovalDocNumber, nomenApprovalFile, nomenAgreementDate, nomenAgreementDocNumber, nomenAgreementFile} = this.props.tofiConstants;
        this.lng = localStorage.getItem('i18nextLng');
        const columns = [
            {
                key: "nomenNumber",
                title: "#",
                dataIndex: 'nomenNumber',
                width: '5%',
                render: obj => obj && obj.value
            },
            {
                key: "name",
                title: "Название",
                dataIndex: 'name',
                width: '15%',
                render: obj => obj && obj[this.lng]
            },
            {
                key: "nomenYear",
                title: nomenYear.name[this.lng],
                dataIndex: 'nomenYear',
                width: '5%',
                render: obj => obj && obj.value
            },
            {
                key: "fileNomen",
                title: fileNomen.name[this.lng],
                dataIndex: 'fileNomen',
                width: '4%',
                render: obj => obj && <Button type="primary"
                                              className="centerIcon"
                                              icon="eye"
                                              shape='circle'
                                              style={{
                                                  display: 'flex',
                                                  justifyContent: 'center',
                                                  alignItems: 'center',
                                                  marginRight: '10px'
                                              }}
                                              onClick={() => this.showFile(obj.value)}> </Button>
            },
            {
                key: "nomenPerechen",
                title: nomenPerechen.name[this.lng],
                dataIndex: 'nomenPerechen',
                width: '21%',
                render: obj => obj && obj.label
            },
            {
                key: "nomenApprovalDate",
                title: nomenApprovalDate.name[this.lng],
                dataIndex: 'nomenApprovalDate',
                width: '7%',
                render: obj => obj && obj.value
            },
            {
                key: "nomenApprovalDocNumber",
                title: nomenApprovalDocNumber.name[this.lng],
                dataIndex: 'nomenApprovalDocNumber',
                width: '10%',
                render: obj => obj && obj.value
            },
            {
                key: "nomenApprovalFile",
                title: nomenApprovalFile.name[this.lng],
                dataIndex: 'nomenApprovalFile',
                width: '10%',
                render: obj => obj && <Button type="primary"
                                              className="centerIcon"
                                              icon="eye"
                                              shape='circle'
                                              style={{
                                                  display: 'flex',
                                                  justifyContent: 'center',
                                                  alignItems: 'center',
                                                  marginRight: '10px'
                                              }}
                                              onClick={() => this.showFile(obj.value)}> </Button>
            },
            {
                key: "nomenAgreementDate",
                title: nomenAgreementDate.name[this.lng],
                dataIndex: 'nomenAgreementDate',
                width: '10%',
                render: obj => obj && obj.value
            },
            {
                key: "nomenAgreementDocNumber",
                title: nomenAgreementDocNumber.name[this.lng],
                dataIndex: 'nomenAgreementDocNumber',
                width: '7%',
                render: obj => obj && obj.value
            },
            {
                key: "nomenAgreementFile",
                title: nomenAgreementFile.name[this.lng],
                dataIndex: 'nomenAgreementFile',
                width: '6%',
                render: obj => obj && <Button type="primary"
                                              className="centerIcon"
                                              icon="eye"
                                              shape='circle'
                                              style={{
                                                  display: 'flex',
                                                  justifyContent: 'center',
                                                  alignItems: 'center',
                                                  marginRight: '10px'
                                              }}
                                              onClick={() => this.showFile(obj.value)}> </Button>
            }

        ];

        return (
        <div>
            <h1>Таблица номенклатур</h1>
            <AntTable loading={false}
                      columns={columns}
                      dataSource={this.state.tableData}
                      changeSelectedRow={this.changeSelectedRow}
                      onRowClick={this.onRowClick}
                      rowClassName={record => this.state.selectedRow && this.state.selectedRow.key === record.key ? 'row-selected' : ''}
            />

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

export default NomenTable;