import React from "react";
import {connect} from "react-redux";
import {isEmpty, isEqual} from "lodash";
import {Icon, Input, Modal, Tabs, Form } from "antd";
import DocumentInfoModal from "./DocumentInfoModal";
import axios from 'axios';

import {parseCube_new, parseForTable} from "../../../utils/cubeParser";
import AntTable from "../../AntTable";
import {
    addCaseToBasket,
    casesLoaded,
    getCube,
    removeCaseFromBasket,
    getObjFromProp
} from "../../../actions/actions";
const { TextArea } = Input;
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
class Documents extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visibleDocModal: false,
            data: [],
            search: {
                name: ''
            },
            aboutFundMakerLoading:false,
            loading: false,
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
            modalVersionsName: {},
            modalLegalStatus:''
        };
    }

    componentDidMount() {
        if (!this.state.data.length && this.props.documents) this.populate();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.documents !== this.props.documents) this.populate();
    }

    populate = () => {
        if (isEmpty(this.props.tofiConstants)) return;
        const {documents, tofiConstants: {doDocuments, dpDocuments}} = this.props;
        this.setState({
            data: parseCube_new(
            documents["cube"],
            [],
            "dp",
            "do",
            documents[`do_${doDocuments.id}`],
            documents[`dp_${dpDocuments.id}`],
            `do_${doDocuments.id}`,
            `dp_${dpDocuments.id}`
            ).map(this.renderTableData)
        })
    };

    renderTableData = item => {
        const constArr = ['archiveCipher', 'caseDend', 'documentDate', 'implicitDates', 'caseNumber', 'provenance', 'caseStatus', 'documentCase'];
        const result = {
            key: item.id,
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
            onSelect: (record, selected) => {

                const {t} = this.props;
                if (selected) {
                    this.setState({loading: true});
                    if (this.props.basket.length < 100) {
                        const fd = new FormData();
                        fd.append(
                            "objId",
                            record.key.split('_')[1]
                        );
                        fd.append("propConst", "documentCase");
                        getObjFromProp(fd).then(res => {
                            if (res.success) {
                                const caseId = res.data[0].id;
                                const fd = new FormData();
                                fd.append(
                                    "objId",
                                    String(res.data[0].id)
                                );
                                fd.append("propConst", "caseInventory");
                                getObjFromProp(fd).then(res => {
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
                                                            docId: record.key.split('_')[1],
                                                            caseId,
                                                            inventoryId,
                                                            fundId,
                                                            archiveId
                                                        });
                                                        this.setState({loading: false});
                                                    } else {
                                                        this.setState({loading: false});
                                                    }
                                                });
                                            } else {
                                                this.setState({loading: false});
                                            }
                                        });
                                    } else {
                                        this.setState({loading: false});
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
                this.setState({loading: false});

            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                const {t} = this.props;

                for (let record of changeRows) {
                    if (selected) {
                        this.setState({loading: true});
                        if (this.props.basket.length < 100) {
                            const fd = new FormData();
                            fd.append(
                                "objId",
                                record.key.split('_')[1]
                            );
                            fd.append("propConst", "documentCase");
                            getObjFromProp(fd).then(res => {
                                if (res.success) {
                                    const caseId = res.data[0].id;
                                    const fd = new FormData();
                                    fd.append(
                                        "objId",
                                        String(res.data[0].id)
                                    );
                                    fd.append("propConst", "caseInventory");
                                    getObjFromProp(fd).then(res => {
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
                                                                docId: record.key.split('_')[1],
                                                                caseId,
                                                                inventoryId,
                                                                fundId,
                                                                archiveId
                                                            });
                                                            this.setState({loading: false});
                                                        } else {
                                                            this.setState({loading: false});
                                                        }
                                                    });
                                                } else {
                                                    this.setState({loading: false});
                                                }
                                            });
                                        } else {
                                            this.setState({loading: false});
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

                }
                this.setState({loading: false});

            },
            selections: [{
                key: 'all-data',
                text: 'Выбрать все',
                onSelect: (select) => {
                    this.setState({
                        selectedRowKeys: this.state.data.map((el) => {
                            return el.key
                        }),
                    });
                    const {t} = this.props;

                    for (let record of this.state.data) {
                        if (true) {
                            this.setState({loading: true});
                            if (this.props.basket.length < 100) {
                                const fd = new FormData();
                                fd.append(
                                    "objId",
                                    record.key.split('_')[1]
                                );
                                fd.append("propConst", "documentCase");
                                getObjFromProp(fd).then(res => {
                                    if (res.success) {
                                        const caseId = res.data[0].id;
                                        const fd = new FormData();
                                        fd.append(
                                            "objId",
                                            String(res.data[0].id)
                                        );
                                        fd.append("propConst", "caseInventory");
                                        getObjFromProp(fd).then(res => {
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
                                                                    docId: record.key.split('_')[1],
                                                                    caseId,
                                                                    inventoryId,
                                                                    fundId,
                                                                    archiveId
                                                                });
                                                                this.setState({loading: false});
                                                            } else {
                                                                this.setState({loading: false});
                                                            }
                                                        });
                                                    } else {
                                                        this.setState({loading: false});
                                                    }
                                                });
                                            } else {
                                                this.setState({loading: false});
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
                    }
                    this.setState({loading: false});

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
                    this.setState({loading: true});
                    if (this.props.basket.length < 20) {
                        const fd = new FormData();
                        fd.append(
                        "objId",
                        record.key.split('_')[1]
                        );
                        fd.append("propConst", "documentCase");
                        getObjFromProp(fd).then(res => {
                            if (res.success) {
                                const caseId = res.data[0].id;
                                const fd = new FormData();
                                fd.append(
                                "objId",
                                String(res.data[0].id)
                                );
                                fd.append("propConst", "caseInventory");
                                getObjFromProp(fd).then(res => {
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
                                                            docId: record.key.split('_')[1],
                                                            caseId,
                                                            inventoryId,
                                                            fundId,
                                                            archiveId
                                                        });
                                                        this.setState({loading: false});
                                                    } else {
                                                        this.setState({loading: false});
                                                    }
                                                });
                                            } else {
                                                this.setState({loading: false});
                                            }
                                        });
                                    } else {
                                        this.setState({loading: false});
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

    showDocumentInfo = () => {
        if (this.state.selectedRow) {
            this.setState({
                modalShow: true
            });
        }
    };

    callback = (key) => {
        console.log(key);
    };
    handleDocOk = (e) => {
        this.setState({
            visibleDocModal: false,
        });
    };
    handleDocCancel = (e) => {
        this.setState({
            visibleDocModal: false,
        });
    };
    showModalDoc = () => {
        this.setState({
            visibleDocModal: true,
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


    /*запрос дополнительных данных по документу*/
    getExtraInfoDoc = async (idRec) => {
        aboutFundMakerLoading:true,
        this.showModalDoc();
        this.setState({loading: true});
        var docFilter = {
            filterDOAnd: [
                {
                    dimConst: 'doDocuments',
                    concatType: "and",
                    conds: [
                        {
                            ids: String(idRec)
                        }
                    ]
                }
            ]
        };
        await this.props.getCube('cubeDocuments', JSON.stringify(docFilter), {customKey: 'singleExtraInfoDoc'});
        var dpDoc = this.props.singleExtraInfoDoc['dp_' + this.props.tofiConstants['dpDocuments'].id];
        var dpCube = this.props.singleExtraInfoDoc['cube'];

        /*Собираем данные для модального окна*/

        var addresseeProp = dpDoc.find(item => item.prop == this.props.tofiConstants.addressee.id);
        var addresseeVal = dpCube.find(item => (item['dp_' + this.props.tofiConstants['dpDocuments'].id]) == addresseeProp.id);
        addresseeVal = addresseeVal ? addresseeVal.valueStr ? addresseeVal.valueStr[this.lng] : 'Адресат не указан' : 'Адресат не указан';

        var documentAuthorProp = dpDoc.find(item => item.prop == this.props.tofiConstants.documentAuthor.id);
        var documentAuthorVal = dpCube.find(item => (item['dp_' + this.props.tofiConstants['dpDocuments'].id]) == documentAuthorProp.id);
        documentAuthorVal = documentAuthorVal ? documentAuthorVal.valueStr ? documentAuthorVal.valueStr[this.lng] : 'Автор не указан' : 'Автор не указан';

        var archiveCipherProp = dpDoc.find(item => item.prop == this.props.tofiConstants.archiveCipher.id);
        var archiveCipherVal = dpCube.find(item => (item['dp_' + this.props.tofiConstants['dpDocuments'].id]) == archiveCipherProp.id);
        archiveCipherVal = archiveCipherVal ? archiveCipherVal.valueStr ? archiveCipherVal.valueStr[this.lng] : 'Нет шифра' : 'Нет шифра';

        var questionProp = dpDoc.find(item => item.prop == this.props.tofiConstants.question.id);
        var questionVal = dpCube.find(item => (item['dp_' + this.props.tofiConstants['dpDocuments'].id]) == questionProp.id);
        questionVal = questionVal ? questionVal.valueStr ? questionVal.valueStr[this.lng] : '' : '';

        var personProp = dpDoc.find(item => item.prop == this.props.tofiConstants.person.id);
        var personVal = dpCube.find(item => (item['dp_' + this.props.tofiConstants['dpDocuments'].id]) == personProp.id);
        personVal = personVal ? personVal.valueStr ? personVal.valueStr[this.lng] : '' : '';

        var eventProp = dpDoc.find(item => item.prop == this.props.tofiConstants.event.id);
        var eventVal = dpCube.find(item => (item['dp_' + this.props.tofiConstants['dpDocuments'].id]) == eventProp.id);
        eventVal = eventVal ? eventVal.valueStr ? eventVal.valueStr[this.lng] : '' : '';

        var dateEventProp = dpDoc.find(item => item.prop == this.props.tofiConstants.dateEvent.id);
        var dateEventVal = dpCube.find(item => (item['dp_' + this.props.tofiConstants['dpDocuments'].id]) == dateEventProp.id);
        dateEventVal = dateEventVal ? dateEventVal.valueDateTime : '';

        var eventLocationProp = dpDoc.find(item => item.prop == this.props.tofiConstants.eventLocation.id);
        var eventLocationVal = dpCube.find(item => (item['dp_' + this.props.tofiConstants['dpDocuments'].id]) == eventLocationProp.id);
        eventLocationVal = eventLocationVal ? eventLocationVal.name ? eventLocationVal.name[this.lng] : '' : '';

        var caseDocsLangProp = dpDoc.find(item => item.prop == this.props.tofiConstants.caseDocsLang.id);
        var caseDocsLangVal = dpCube.find(item => (item['dp_' + this.props.tofiConstants['dpDocuments'].id]) == caseDocsLangProp.id);
        caseDocsLangVal = caseDocsLangVal ? caseDocsLangVal.name ? caseDocsLangVal.name[this.lng] : '' : '';

        var dateFormingProp = dpDoc.find(item => item.prop == this.props.tofiConstants.dateForming.id);
        var dateFormingVal = dpCube.find(item => (item['dp_' + this.props.tofiConstants['dpDocuments'].id]) == dateFormingProp.id);
        dateFormingVal = dateFormingVal ? dateFormingVal.valueDateTime : '';

        var nameOrPrimaryWordsProp = dpDoc.find(item => item.prop == this.props.tofiConstants.nameOrPrimaryWords.id);
        var nameOrPrimaryWordsVal = dpCube.find(item => (item['dp_' + this.props.tofiConstants['dpDocuments'].id]) == nameOrPrimaryWordsProp.id);
        nameOrPrimaryWordsVal = nameOrPrimaryWordsVal ? nameOrPrimaryWordsVal.valueStr ? nameOrPrimaryWordsVal.valueStr[this.lng] : '' : '';

        var documentContentProp = dpDoc.find(item => item.prop == this.props.tofiConstants.documentContent.id);
        var documentContentVal = dpCube.find(item => (item['dp_' + this.props.tofiConstants['dpDocuments'].id]) == documentContentProp.id);
        documentContentVal = documentContentVal ? documentContentVal.valueStr ? documentContentVal.valueStr[this.lng] : '' : '';

        var organizationsMentionedProp = dpDoc.find(item => item.prop == this.props.tofiConstants.organizationsMentioned.id);
        var organizationsMentionedVal = dpCube.find(item => (item['dp_' + this.props.tofiConstants['dpDocuments'].id]) == organizationsMentionedProp.id);
        organizationsMentionedVal = organizationsMentionedVal ? organizationsMentionedVal.valueStr ? organizationsMentionedVal.valueStr[this.lng] : '' : '';


        var documentKeywordsProp = dpDoc.find(item => item.prop == this.props.tofiConstants.documentKeywords.id);
        var documentKeywordsVal = dpCube.find(item => (item['dp_' + this.props.tofiConstants['dpDocuments'].id]) == documentKeywordsProp.id);
        documentKeywordsVal = documentKeywordsVal ? documentKeywordsVal.valueStr ? documentKeywordsVal.valueStr[this.lng] : '' : '';



        this.setState({
            loading: false,
            modalTitle: this.props.singleExtraInfoDoc['do_' + this.props.tofiConstants['doDocuments'].id]['0'].fullName[this.lng],
            modaldocumentAuthor: documentAuthorVal,
            modalAddressee: addresseeVal,
            modalArchiveCipher: archiveCipherVal,
            modalQuestion: questionVal,
            modalEvent: eventVal,
            modalPerson: personVal,
            modalDateEvent: dateEventVal,
            modalEventLocation: eventLocationVal,
            modalCaseDocsLang: caseDocsLangVal,
            modalDateForming: dateFormingVal,
            modalNameOrPrimaryWords: nameOrPrimaryWordsVal,
            modalDocumentContent: documentContentVal,
            modalOrganizationsMentioned: organizationsMentionedVal,
            modalDocumentKeywords: documentKeywordsVal,

        });

        var fdIdRec = new FormData();
        fdIdRec.append('docId', idRec);

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
                aboutFundMakerLoading:false,
                modalVersionsName: listItems,
            })
        })
}
;


render()
{
    const {data, selectedRow, modalShow, search} = this.state;
    const {t} = this.props;
    const {nameOrPrimaryWords,fundDbeg,fundDend,fundHistoricalNoteMulti,legalStatus, documentContent, organizationsMentioned, peopleMentioned, documentKeywords, archiveCipher, event, person, dateEvent, eventLocation, caseDocsLang, dateForming, caseDend, caseDbeg, documentDate, implicitDates, fundArchive, invFund, documentAuthor, addressee, question} = this.props.tofiConstants;
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
            <div className="Funds__extraInfo" onClick={this.showDocumentInfo}>
                <Icon type="question-circle" style={{color: '#009688'}}/>
            </div>
            }
        </div>
        <div className="Cases__body">
            <AntTable
            openedBy="Cases"
            loading={this.props.loadingTable}
            hidePagination={true}
            columns={[
                {
                    key: "archiveCipher",
                    title: archiveCipher.name[this.lng],
                    dataIndex: "archiveCipher",
                    width: "18%"
                },
                {
                    key: "name",
                    title: t("TITLE"),
                    dataIndex: "name",
                    width: "64%",
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
                    key: "documentDate",
                    title: documentDate.name[this.lng],
                    dataIndex: "documentDate",
                    width: "10%",
                    render: (text, record) => {
                        return (
                        text ? (text.format('DD-MM-YYYY')) : record.implicitDates)
                    }
                },
                {
                    key: "key",
                    title: '?',
                    dataIndex: "key",
                    width: "8%",
                    onCellClick: (record) => {
                        record ? this.getExtraInfoDoc(record.key) : ''
                    },
                    render: (text, record) => {
                        return (
                        <div>
                            <Icon type="question-circle" style={{color: '#009688'}}/>
                        </div>
                        )
                    }
                }

                /*      {
                 key: "dateEnd",
                 title: caseDend.name[this.lng],
                 dataIndex: "dateEnd",
                 width: "14%"
                 },
                 {
                 key: "provenance",
                 title: t("DOCUMENTORIGIN"),
                 dataIndex: "provenance",
                 width: "18%"
                 }*/
            ]}
            dataSource={this.filteredData}
            rowSelection={this.rowSelection2()}
            changeSelectedRow={(rec) => {
                this.setState({selectedRow: rec})
            }}
            />
            {modalShow && (
            <DocumentInfoModal
            modalShow={modalShow}
            data={this.state.selectedRow}
            onCancel={this.hideDocumentInfo}
            tofiConstants={this.props.tofiConstants}
            lng={this.lng}
            t={t}
            />
            )} F
        </div>
        <Modal
        footer={null}
        className="extraModal disabledColorLight"
        title={this.state.modalTitle}
        visible={this.state.visibleDocModal}
        onOk={this.handleDocOk}
        onCancel={this.handleDocCancel}
        >
            <Tabs defaultActiveKey="1" onChange={this.callback}
                  className="extraModalTabs">
                <TabPane tab={t('TITLE')} key="1">

                    <Form>
                        <Form.Item {...formItemLayout} label={archiveCipher.name[this.lng]}>
                            <Input disabled value={this.state.modalArchiveCipher} />
                        </Form.Item>

                        <Form.Item {...formItemLayout} label={documentAuthor.name[this.lng]}>
                            <Input disabled value={this.state.modaldocumentAuthor} />
                        </Form.Item>

                        <Form.Item {...formItemLayout} label={addressee.name[this.lng]}>
                            <Input disabled value={this.state.modalAddressee} />
                        </Form.Item>

                        <Form.Item {...formItemLayout} label={question.name[this.lng]}>
                            <Input disabled value={this.state.modalQuestion} />
                        </Form.Item>

                        <Form.Item {...formItemLayout} label={event.name[this.lng]}>
                            <Input disabled value={this.state.modalEvent} />
                        </Form.Item>
                        <Form.Item {...formItemLayout} label={person.name[this.lng]}>
                            <Input disabled value={this.state.modalPerson} />
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
                <TabPane tab={t('FUNDANNOTATION')} key="2">
                    <Form>

                        <Form.Item {...formItemLayout} label={nameOrPrimaryWords.name[this.lng]}>
                            <Input disabled value={this.state.modalNameOrPrimaryWords} />
                        </Form.Item>
                        <Form.Item {...formItemLayout} label={documentContent.name[this.lng]}>
                            <TextArea disabled value={this.state.modalDocumentContent} />
                        </Form.Item>
                        <Form.Item {...formItemLayout} label={organizationsMentioned.name[this.lng]}>
                            <Input disabled value={this.state.modalOrganizationsMentioned} />
                        </Form.Item>
                        <Form.Item {...formItemLayout} label={peopleMentioned.name[this.lng]}>
                            <Input disabled value={this.state.modalPeopleMentioned} />
                        </Form.Item>
                        <Form.Item {...formItemLayout} label={documentKeywords.name[this.lng]}>
                            <Input disabled value={this.state.modalDocumentKeywords} />
                        </Form.Item>
                        <Form.Item {...formItemLayout} label={nameOrPrimaryWords.name[this.lng]}>
                            <Input disabled value={this.state.modalNameOrPrimaryWords} />
                        </Form.Item>
                    </Form>
                </TabPane>

                <TabPane tab={t('FUNDMAKER_HISTORY')} key="3">

                    <AntTable
                    footer={null}
                    loading={this.state.aboutFundMakerLoading}
                    dataSource={this.state.modalVersionsName}
                    columns={
                        [{
                            title:  t('TITLE'),
                            dataIndex: 'name',
                            key: 'name',
                            width:'25%'
                        },
                        {
                            title: legalStatus.name[this.lng],
                            dataIndex: 'legalStatus',
                            key: 'legalStatus',
                            width:'15%'
                            },
                            {
                                title: fundDbeg.name[this.lng] || '',
                                dataIndex: 'dBeg',
                                key: 'dBeg',
                                width:'7%'
                            },
                            {
                                title: fundDend.name[this.lng] || '',
                                dataIndex: 'dEnd',
                                key: 'dEnd',
                                width:'7%'
                            },
                            {
                                title: fundHistoricalNoteMulti.name[this.lng],
                                dataIndex: 'fundHistoricalNoteMulti',
                                key: 'fundHistoricalNoteMulti',
                                width:'46%'
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
        documents: state.cubes.cubeDocuments,
        basket: state.readingRoom.basket,
        tofiConstants: state.generalData.tofiConstants,
        singleExtraInfoDoc: state.cubes.singleExtraInfoDoc
    };
}

export default connect(
mapStateToProps,
{casesLoaded, addCaseToBasket, removeCaseFromBasket, getCube}
)(Documents);
