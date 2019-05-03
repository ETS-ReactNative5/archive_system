import React from "react";
import {connect} from "react-redux";
import {isEmpty, isEqual} from "lodash";
import {Icon, Input, Modal, Tabs, Form, Spin} from "antd";
import axios from 'axios';


import StorageUnitInfoModal from "./StorageUnitInfoModal";

import {parseCube_new, parseForTable} from "../../../utils/cubeParser";
import AntTable from "../../AntTable";
import {
    addCaseToBasket,
    casesLoaded,
    getCube,
    removeCaseFromBasket,
    getObjFromProp,
} from "../../../actions/actions";
import {CUBE_FOR_AF_CASE} from "../../../constants/tofiConstants";

const TabPane = Tabs.TabPane;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
    },
};
class StorageUnits extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visibleCaseModal: false,
            data: [],
            search: {
                name: ''
            },
            errors: {},
            selectedRow: null,
            modalShow: false,
            modalTitle: '',
            modaldocumentAuthor: '',
            modalAddressee: '',
            modalArchiveCipher: '',
            modalQuestion: '',
            modalEvent: '',
            modalPerson: '',
            modalDateEvent: '',
            modalEventLocation: '',
            modalCaseDocsLang: '',
            modalDateForming: '',
            modalNameOrPrimaryWords: '',
            modalDocumentContent: '',
            modalOrganizationsMentioned: '',
            modalPeopleMentioned: '',
            modalDocumentKeywords: '',
            modalVersionsName:'',
            loader: false
        };
    }

    componentDidUpdate(prevProps) {
        if (isEmpty(this.props.tofiConstants)) return;

        const {cases, tofiConstants: {doForCase, dpForCase}} = this.props;
        if (prevProps.cases !== this.props.cases) {
            this.setState({
                data: parseCube_new(
                cases["cube"],
                [],
                "dp",
                "do",
                cases[`do_${doForCase.id}`],
                cases[`dp_${dpForCase.id}`],
                `do_${doForCase.id}`,
                `dp_${dpForCase.id}`
                ).map(this.renderTableData)
            })
        }
    }

    renderTableData = item => {


        const constArr = ['archiveCipher','fundNumberOfRegis', 'caseDend', 'caseDbeg', 'fundNumber', 'invNumber', 'caseNumber', 'caseStatus'];
        const result = {
            key: item.id.split('_')[1], //Here the key is different, because we need to store own id for key to be able to send data properly
            recId:item.id,
            name: item.name ? item.name : {kz: '', ru: '', en: ''}
        };
        parseForTable(item.props, this.props.tofiConstants, result, constArr);
        return result
    };

    onSelectTable = (selectedRowKeys) => {
        this.setState({selectedRowKeys});

    }
    rowSelection2 = () => {
        let that = this;
        return {
            onChange: this.onSelectTable,

            hideDefaultSelections: true,
            onSelect: async (record, selected) => {

                const {t} = this.props;
                if (selected) {

                    if (this.props.basket.length < 100) {
                        this.setState({
                            loading: true
                        })
                        this.setState({loader: true});
                        const fd = new FormData();
                        fd.append(
                            "objId",
                            record.key
                        );
                        fd.append("propConst", "caseInventory");
                         await getObjFromProp(fd).then(res => {
                            if (res.success) {
                                const inventoryId = res.data[0].id;
                                const fd = new FormData();
                                fd.append(
                                    "objId",
                                    String(res.data[0].id)
                                );
                                fd.append("propConst", "invFund");
                                getObjFromProp(fd).then(res => {
                                    if (res.success) {
                                        const fundId = res.data[0].id;
                                        const fd = new FormData();
                                        fd.append(
                                            "objId",
                                            String(res.data[0].id)
                                        );
                                        fd.append("propConst", "fundArchive");
                                        getObjFromProp(fd).then(res => {
                                            if (res.success) {
                                                const archiveId = res.data[0].id;
                                                this.props.addCaseToBasket({
                                                    ...record,
                                                    caseId: record.key,
                                                    inventoryId,
                                                    fundId,
                                                    archiveId
                                                });
                                                this.setState({loading: false});
                                                // this.setState({loader: false});
                                            } else {
                                                this.setState({loading: false});
                                                // this.setState({loader: false});
                                            }
                                        });
                                    } else {
                                        this.setState({loading: false});
                                        // this.setState({loader: false});
                                    }
                                });
                            } else {
                                this.setState({loading: false});
                                // this.setState({loader: false});
                            }
                        });

                    } else {
                        this.setState({loading: false});
                        // this.setState({loader: false});

                        Modal.info({
                            title: t("ABOVE_20_CASES_TITLE"),
                            content: t("ABOVE_20_CASES_TEXT"),
                            onOk() {
                            },
                            okText: t("OK")
                        });
                    }
                } else {
                    this.props.removeCaseFromBasket(record);
                }
                this.setState({loader: false});

            },
            onSelectAll: async (selected, selectedRows, changeRows) => {
                const {t} = this.props;

                this.setState({loader: true});
                for (let record of changeRows) {
                    if (selected) {
                        if (this.props.basket.length < 100) {
                            const fd = new FormData();
                            fd.append(
                                "objId",
                                record.key
                            );
                            fd.append("propConst", "caseInventory");
                             await getObjFromProp(fd).then(res => {
                                if (res.success) {
                                    const inventoryId = res.data[0].id;
                                    const fd = new FormData();
                                    fd.append(
                                        "objId",
                                        String(res.data[0].id)
                                    );
                                    fd.append("propConst", "invFund");
                                    getObjFromProp(fd).then(res => {
                                        if (res.success) {
                                            const fundId = res.data[0].id;
                                            const fd = new FormData();
                                            fd.append(
                                                "objId",
                                                String(res.data[0].id)
                                            );
                                            fd.append("propConst", "fundArchive");
                                            getObjFromProp(fd).then(res => {
                                                if (res.success) {
                                                    const archiveId = res.data[0].id;
                                                    this.props.addCaseToBasket({
                                                        ...record,
                                                        caseId: record.key,
                                                        inventoryId,
                                                        fundId,
                                                        archiveId
                                                    });
                                                } else {
                                                    this.setState({loader: false});
                                                }
                                            });
                                        } else {
                                             this.setState({loader: false});
                                        }
                                    });
                                } else {
                                     this.setState({loader: false});
                                }
                            });

                        } else {
                            this.setState({loader: false});

                            Modal.info({
                                title: t("ABOVE_20_CASES_TITLE"),
                                content: t("ABOVE_20_CASES_TEXT"),
                                onOk() {
                                },
                                okText: t("OK")
                            });
                        }
                    } else {
                        this.props.removeCaseFromBasket(record);
                    }

                }
                this.setState({loader: false});

            },
            selections: [{
                key: 'all-data',
                text: 'Выбрать все',
                onSelect: async (select) => {
                    this.setState({
                        loader:true,
                        selectedRowKeys: this.state.data.map((el) => {
                            return el.key
                        }),
                    });
                    const {t} = this.props;

                    this.setState({loader: true});
                    for (let record of this.state.data) {
                        if (true) {
                            if (this.props.basket.length < 100) {
                                const fd = new FormData();
                                fd.append(
                                    "objId",
                                    record.key
                                );
                                fd.append("propConst", "caseInventory");
                                await getObjFromProp(fd).then(res => {
                                    if (res.success) {
                                        const inventoryId = res.data[0].id;
                                        const fd = new FormData();
                                        fd.append(
                                            "objId",
                                            String(res.data[0].id)
                                        );
                                        fd.append("propConst", "invFund");
                                        getObjFromProp(fd).then(res => {
                                            if (res.success) {
                                                const fundId = res.data[0].id;
                                                const fd = new FormData();
                                                fd.append(
                                                    "objId",
                                                    String(res.data[0].id)
                                                );
                                                fd.append("propConst", "fundArchive");
                                                getObjFromProp(fd).then(res => {
                                                    if (res.success) {
                                                        const archiveId = res.data[0].id;
                                                        this.props.addCaseToBasket({
                                                            ...record,
                                                            caseId: record.key,
                                                            inventoryId,
                                                            fundId,
                                                            archiveId
                                                        });
                                                        this.setState({loader: false});
                                                    } else {
                                                        this.setState({loader: false});
                                                    }
                                                });
                                            } else {
                                                this.setState({loader: false});
                                            }
                                        });
                                    } else {
                                        this.setState({loader: false});
                                    }
                                });

                            } else {
                                this.setState({loader: false});

                                Modal.info({
                                    title: t("ABOVE_20_CASES_TITLE"),
                                    content: t("ABOVE_20_CASES_TEXT"),
                                    onOk() {
                                    },
                                    okText: t("OK")
                                });
                            }
                        } else {
                            this.props.removeCaseFromBasket(record);
                        }
                    }
                    this.setState({loader: false});

                },
            },
                {
                    key: 'del-data',
                    text: 'Снять все',
                    onSelect: (select) => {
                        this.setState({
                            selectedRowKeys: [],
                        });
                        for (let record of this.state.data) {
                            this.props.removeCaseFromBasket(record);

                        }
                    },
                }

            ],
            selectedRowKeys: this.state.selectedRowKeys,
            onSelection: this.onSelection,


        };
    };

    rowSelection = () => {
        let that = this;
        return {
            onSelect: (record, selected) => {
                const {t} = this.props;
                if (selected) {
                    if (this.props.basket.length < 20) {
                        this.setState({loading: true});
                        const fd = new FormData();
                        fd.append(
                        "objId",
                        record.key
                        );
                        fd.append("propConst", "caseInventory");
                        getObjFromProp(fd).then(res => {
                            if (res.success && res.data[0]) {
                                const inventoryId = res.data[0].id;
                                const fd = new FormData();
                                fd.append(
                                "objId",
                                String(res.data[0].id)
                                );
                                fd.append("propConst", "invFund");
                                getObjFromProp(fd).then(res => {
                                    if (res.success && res.data[0]) {
                                        const fundId = res.data[0].id;
                                        const fd = new FormData();
                                        fd.append(
                                        "objId",
                                        String(res.data[0].id)
                                        );
                                        fd.append("propConst", "fundArchive");
                                        getObjFromProp(fd).then(res => {
                                            if (res.success && res.data[0]) {
                                                const archiveId = res.data[0].id;
                                                this.props.addCaseToBasket({
                                                    ...record,
                                                    caseId: record.key,
                                                    inventoryId,
                                                    fundId,
                                                    archiveId
                                                });
                                                // this.setState({loading: false});
                                            } else {
                                                // this.setState({loading: false});
                                            }
                                        });
                                    } else {
                                        // this.setState({loading: false});
                                    }
                                });
                            } else {
                                this.setState({loading: false});
                            }
                        });
                    } else {
                        Modal.info({
                            title: t("ABOVE_20_CASES_TITLE"),
                            content: t("ABOVE_20_CASES_TEXT"),
                            onOk() {
                            },
                            okText: t("OK")
                        });
                    }
                } else {
                    this.props.removeCaseFromBasket(record);
                }
            },
            selectedRowKeys: that.props.basket.map(elem => elem.key)
        };
    };

    showModal = () => {
        this.setState({
            visibleCaseModal: true,
        });
    };
    callback = (key) => {
        console.log(key);
    };
    handleCaseOk = (e) => {
        this.setState({
            visibleCaseModal: false,
        });
    };
    handleCaseCancel = (e) => {
        this.setState({
            visibleCaseModal: false,
        });
    };

    onInputChange = e => {
        this.setState({
            search: {
                ...this.state.search,
                [e.target.name]: e.target.value
            }
        })
    };
    emitEmpty = e => {
        this.setState({
            search: {
                ...this.state.search,
                [e.target.dataset.name]: ''
            }
        })
    };

    showStorateUnitInfo = () => {
        if (this.state.selectedRow) {
            this.setState({
                modalShow: true
            });
        }
    };
    hideStorateUnitInfo = () => {
        this.setState({
            modalShow: false
        });
    };


    /*запрос дополнительных данных по документу*/
    getExtraInfoDoc = async (idRec) => {
        console.log('click', idRec);
        this.showModal();
        this.setState({loading: true});
        var docFilter = {
            filterDOAnd: [
                {
                    dimConst: 'doForCase',
                    concatType: "and",
                    conds: [
                        {
                            ids: String(idRec)
                        }
                    ]
                }
            ]
        };
        await this.props.getCube('CubeForAF_Case', JSON.stringify(docFilter), {customKey: 'singleExtraInfoDoc'});
        var dpDoc = this.props.singleExtraInfoDoc['dp_' + this.props.tofiConstants['dpForCase'].id];
        var dpCube = this.props.singleExtraInfoDoc['cube'];

        /*Собираем данные для модального окна*/

        var addresseeProp = dpDoc.find(item => item.prop == this.props.tofiConstants.addressee.id);
        var addresseeVal = dpCube.find(item => (item['dp_' + this.props.tofiConstants['dpForCase'].id]) == addresseeProp.id);
        addresseeVal = addresseeVal ? addresseeVal.valueStr ? addresseeVal.valueStr[this.lng] : 'Адресат не указан' : 'Адресат не указан';

        var archiveCipherProp = dpDoc.find(item => item.prop == this.props.tofiConstants.archiveCipher.id);
        var archiveCipherVal = dpCube.find(item => (item['dp_' + this.props.tofiConstants['dpForCase'].id]) == archiveCipherProp.id);
        archiveCipherVal = archiveCipherVal ? archiveCipherVal.valueStr ? archiveCipherVal.valueStr[this.lng] : 'Нет шифра' : 'Нет шифра';

        var dateEventProp = dpDoc.find(item => item.prop == this.props.tofiConstants.dateEvent.id);
        var dateEventVal = dpCube.find(item => (item['dp_' + this.props.tofiConstants['dpForCase'].id]) == dateEventProp.id);
        dateEventVal = dateEventVal ? dateEventVal.valueDateTime : '';

        var eventLocationProp = dpDoc.find(item => item.prop == this.props.tofiConstants.eventLocation.id);
        var eventLocationVal = dpCube.find(item => (item['dp_' + this.props.tofiConstants['dpForCase'].id]) == eventLocationProp.id);
        eventLocationVal = eventLocationVal ? eventLocationVal.name ? eventLocationVal.name[this.lng] : '' : '';

        var caseDocsLangProp = dpDoc.find(item => item.prop == this.props.tofiConstants.caseDocsLang.id);
        var caseDocsLangVal = dpCube.find(item => (item['dp_' + this.props.tofiConstants['dpForCase'].id]) == caseDocsLangProp.id);
        caseDocsLangVal = caseDocsLangVal ? caseDocsLangVal.name ? caseDocsLangVal.name[this.lng] : '' : '';

        var dateFormingProp = dpDoc.find(item => item.prop == this.props.tofiConstants.dateForming.id);
        var dateFormingVal = dpCube.find(item => (item['dp_' + this.props.tofiConstants['dpForCase'].id]) == dateFormingProp.id);
        dateFormingVal = dateFormingVal ? dateFormingVal.valueDateTime : '';

        this.setState({
            loading: false,
            modalTitle: this.props.singleExtraInfoDoc['do_' + this.props.tofiConstants['doForCase'].id]['0'].fullName[this.lng],
            modalAddressee: addresseeVal,
            modalArchiveCipher: archiveCipherVal,
            modalDateEvent: dateEventVal,
            modalEventLocation: eventLocationVal,
            modalCaseDocsLang: caseDocsLangVal,
            modalDateForming: dateFormingVal,

        });

        var fdIdRec = new FormData();
        fdIdRec.append('caseId', idRec);
        axios.post(`/${localStorage.getItem('i18nextLng')}/entity/extractInfoMaker`, fdIdRec).then(response => {
            var listItems=[];

            response.data.success == true ? (
            response.data.data.forEach((el) =>{
                var dbeg = el.dbeg!='1800-01-01' ? el.dbeg:'';
                var dend = el.dend!='3333-12-31' ? el.dend:'';
                var item={name:el.name[localStorage.getItem('i18nextLng')],
                    legalStatus:el.legalStatus[localStorage.getItem('i18nextLng')],
                    dBeg:dbeg,
                    dEnd:dend,
                    fundHistoricalNoteMulti:el.fundHistoricalNoteMulti[localStorage.getItem('i18nextLng')]
                };
                listItems.push(item);
            }
            )
            ): '';


            this.setState({
                modalVersionsName: listItems,
            })
        })

    };


    render() {
        const {data, modalShow, selectedRow, search} = this.state;
        const {t} = this.props;
        const {archiveCipher, legalStatus,fundDbeg,fundDend,documentAuthor,fundHistoricalNoteMulti, addressee, question, event, person, dateEvent, eventLocation, caseDocsLang, dateForming, nameOrPrimaryWords, documentContent, organizationsMentioned, peopleMentioned, documentKeywords, fundNumberOfRegis, caseDbeg, caseDend} = this.props.tofiConstants;
        this.lng = localStorage.getItem('i18nextLng');

        this.filteredData = data.filter(item => {
            return (
            item.name[this.lng].toLowerCase().includes(search.name.toLowerCase())
            )
        });

        return (
        <div className="Cases">
            <div className="Cases__header">
                {selectedRow &&
                <div className="Funds__extraInfo" onClick={this.showStorateUnitInfo}>
                    <Icon type="question-circle" style={{color: '#009688'}}/>
                </div>
                }
            </div>
            <div className="Cases__body">
                <Spin spinning={this.state.loader}>
                <AntTable
                loading={this.props.loadingTable}
                columns={[
                    {
                        key: "archiveCipher",
                        title: archiveCipher.name[this.lng],
                        dataIndex: "archiveCipher",
                        width: "14%",
                        render: (key, obj) => { return key.value},
                    },
                    {
                        key: "name",
                        title: t("TITLE"),
                        dataIndex: "name",
                        width: "40%",
                        filterDropdown: (
                        <div className="custom-filter-dropdown">
                            <Input
                            name="name"
                            suffix={search.name ?
                            <Icon type="close-circle" data-name="name"
                                  onClick={this.emitEmpty}/> : null}
                            ref={ele => this.name = ele}
                            placeholder="Поиск"
                            value={search.name}
                            onChange={this.onInputChange}
                            />
                        </div>
                        ),
                        filterIcon: <Icon type="filter"
                                          style={{color: search.name ? '#ff9800' : '#aaa'}}/>,
                        onFilterDropdownVisibleChange: (visible) => {
                            this.setState({
                                filterDropdownVisible: visible,
                            }, () => this.name.focus());
                        },
                        render: obj => obj && obj[this.lng]
                    },
                    {
                        key: "caseDbeg",
                        title: caseDbeg.name[this.lng],
                        dataIndex: "caseDbeg",
                        width: "8%",
                        render: (key, obj) => {return key.value},
                    },

                    {
                        key: "caseDend",
                        title: caseDend.name[this.lng],
                        dataIndex: "caseDend",
                        width: "8%",
                        render: (key, obj) => {return key.value},
                    },
                    {
                        key: "fundNumberOfRegis",
                        title: fundNumberOfRegis.name[this.lng],
                        dataIndex: "fundNumberOfRegis",
                        width: "10%",
                    },
                    {
                        key: "provenance",
                        title: t("DOCUMENTORIGIN"),
                        dataIndex: "provenance",
                        width: "15%",
                    },
                    {
                        key: "recId",
                        title: '?',
                        dataIndex: "recId",
                        width: "8%",
                        onCellClick: (obj) => {

                            obj ? this.getExtraInfoDoc(obj.recId) : ''
                        },
                        render: (text, record) => {
                            return (
                            <div>
                                <Icon type="question-circle" style={{color: '#009688'}}/>
                            </div>
                            )
                        }
                    }
                ]}
                rowSelection={this.rowSelection2()}
                dataSource={this.filteredData}
                />
                </Spin>
                {modalShow && (
                <StorageUnitInfoModal
                modalShow={modalShow}
                data={this.state.selectedRow}
                onCancel={this.hideStorateUnitInfo}
                tofiConstants={this.props.tofiConstants}
                lng={this.lng}
                t={t}
                />
                )}
            </div>

            <Modal
            footer={null}
            className="extraModal disabledColorLight"
            title={this.state.modalTitle}
            visible={this.state.visibleCaseModal}
            onOk={this.handleCaseOk}
            onCancel={this.handleCaseCancel}
            >
                <Tabs defaultActiveKey="1" onChange={this.callback}
                      className="extraModalTabs">
                    <TabPane tab={t('TITLE')} key="1">

                        <Form >
                            <Form.Item {...formItemLayout} label={archiveCipher.name[this.lng]}>
                                <Input disabled value={this.state.modalArchiveCipher} />
                            </Form.Item>
                            <Form.Item {...formItemLayout} label={addressee.name[this.lng]}>
                                <Input disabled value={this.state.modalAddressee} />
                            </Form.Item>
                            <Form.Item {...formItemLayout} label={dateEvent.name[this.lng]}>
                                <Input disabled value={this.state.modalDateEvent} />
                            </Form.Item>
                            <Form.Item {...formItemLayout} label={eventLocation.name[this.lng]}>
                                <Input disabled value={this.state.modalEventLocation} />
                            </Form.Item>
                            <Form.Item {...formItemLayout} label={caseDocsLang.name[this.lng]}>
                                <Input disabled value={this.state.modalCaseDocsLang} />
                            </Form.Item>
                            <Form.Item {...formItemLayout} label={dateForming.name[this.lng]}>
                                <Input disabled value={this.state.modalDateForming} />
                            </Form.Item>
                        </Form>
                    </TabPane>
                    <TabPane tab={t('FUNDMAKER_HISTORY')} key="2">
                        <AntTable
                        footer={null}
                        dataSource={this.state.modalVersionsName}
                        columns={
                            [{
                                title:  t('TITLE'),
                                dataIndex: 'name',
                                key: 'name',
                                width:'40%'
                            },
                                {
                                    title: legalStatus.name[this.lng],
                                    dataIndex: 'legalStatus',
                                    key: 'legalStatus',
                                    width:'30%'
                                },
                                {
                                    title: fundDbeg.name[this.lng] || '',
                                    dataIndex: 'dBeg',
                                    key: 'dBeg',
                                    width:'10%'
                                },
                                {
                                    title: fundDend.name[this.lng] || '',
                                    dataIndex: 'dEnd',
                                    key: 'dEnd',
                                    width:'10%'
                                },
                                {
                                    title: fundHistoricalNoteMulti.name[this.lng],
                                    dataIndex: 'fundHistoricalNoteMulti',
                                    key: 'fundHistoricalNoteMulti',
                                    width:'10%'
                                },

                            ]
                        }
                        />
                    </TabPane>
                </Tabs>
            </Modal>
        </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        cases: state.cubes[CUBE_FOR_AF_CASE],
        basket: state.readingRoom.basket,
        tofiConstants: state.generalData.tofiConstants,
        singleExtraInfoDoc: state.cubes.singleExtraInfoDoc
    };
}

export default connect(
mapStateToProps,
{casesLoaded, addCaseToBasket, removeCaseFromBasket, getCube}
)(StorageUnits);
