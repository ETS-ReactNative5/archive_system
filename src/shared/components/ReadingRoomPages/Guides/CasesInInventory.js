import React from "react";
import {connect} from "react-redux";
import moment from "moment";
import {isEmpty, isEqual} from "lodash";
import axios from 'axios';
import "./showAllOption.css"
import {parseCube_new, parseForTable} from "../../../utils/cubeParser";
import AntTable from "../../AntTable";
import {
    addCaseToBasket,
    casesLoaded,
    getCube,
    removeCaseFromBasket,
    getObjFromProp,
} from "../../../actions/actions";
import {Modal, Form, Spin} from "antd/lib/index";
import {
    CASE_NUMB,
    CASES_DBEG,
    CASES_DEND,
    CUBE_FOR_AF_CASE, CUBE_FOR_AF_INV, CUBE_FOR_FUND_AND_IK,
    DO_FOR_CASE, DO_FOR_FUND_AND_IK, DO_FOR_INV,
    DP_FOR_CASE, DP_FOR_FUND_AND_IK, DT_FOR_FUND_AND_IK,
    STATUS
} from "../../../constants/tofiConstants";
import {Breadcrumb, Icon, Input, Select, Tabs} from "antd";

const Option = Select.Option;

const TabPane = Tabs.TabPane;
const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 6},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 18},
    },
};

class CasesInInventory extends React.Component {
    constructor(props) {
        super(props);


        this.state = {
            data: [],
            sortData: [],
            newSprtData: [],
            arrOption: [],
            selected: [],
            search: {
                name: '',
                fundNumber: '',
                caseDbeg: '',
                caseDend: ''
            },
            visibleCaseInIvModal: false,
            loading: false,
            errors: {},
            selectedCase: null,
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
            modalVersionsName: '',
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
            this.updateState()
        }
    }

    updateState = () => {
        setTimeout(() => {
            try {
                let newData = this.state.data.map((el) => {
                    return el.bunchCases
                })

                let bunchCases = newData.filter((elem, index, self) => {
                    if (elem === null)return false

                    return index === self.findIndex((t) => (
                        t.value === elem.value
                    ))
                })
                this.setState({
                    sortData: bunchCases,
                    newSprtData: this.state.data
                })

            }catch (e){
                this.setState({
                    newSprtData: this.state.data
                })
            }
        })
    }

    renderTableData = item => {
        const constArr = ['archiveCipher', 'fundNumber', 'caseDend', 'caseDbeg', 'caseStatus', 'caseNumber', 'bunchCases'];
        const result = {
            recId: item.id,
            key: item.id.split('_')[1], //Here the key is different, because we need to store own id for key to be able to send data properly,
            name: item.name ? item.name : {kz: '', ru: '', en: ''},
            fundNumber: item.fundNumber
        };
        parseForTable(item.props, this.props.tofiConstants, result, constArr);
        return result
    };

    goBackFund = () => {
        const rec = this.props.selectedGuide;
        const filters = {
            filterDOAnd: [{
                dimConst: DO_FOR_FUND_AND_IK,
                concatType: "and",
                conds: [{
                    data: {
                        valueRef: {
                            id: rec.key
                        }
                    }
                }]
            }],
            filterDPAnd: [
                {
                    dimConst: DP_FOR_FUND_AND_IK,
                    concatType: "and",
                    conds: [
                        {
                            consts: "fundDbeg,fundDend,fundNumber,fundIndex,fundCategory,fundNumberOfCases,fundArchive," +
                            "locationOfSupplementaryMaterials,accessDocument"
                        }
                    ]
                }
            ],
            filterDTOr: [{
                dimConst: DT_FOR_FUND_AND_IK,
                concatType: 'and',
                conds: [{
                    ids: moment().startOf('year').format('YYYYMMDD') + moment().endOf('year').format('YYYYMMDD')
                }]
            }]
        };
        this.props.changeSelectedRowChild({type: 'guides', rec}, [CUBE_FOR_FUND_AND_IK, JSON.stringify(filters)]);
    };
    goBackInv = () => {
        const rec = this.props.selectedFund;
        const filters = {
            filterDOAnd: [{
                dimConst: DO_FOR_INV,
                concatType: "and",
                conds: [{
                    data: {
                        valueRef: {
                            id: rec.key
                        }
                    }
                }]
            }]
        };
        this.props.changeSelectedRowChild({type: 'funds', rec}, [CUBE_FOR_AF_INV, JSON.stringify(filters)]);
    };
    onSelectTable = (selectedRowKeys) => {
        this.setState({selectedRowKeys});

    }
    rowSelection = () => {
        let that = this;
        return {
            onChange: this.onSelectTable,

            hideDefaultSelections: true,
            onSelect: async (record, selected) => {

                const {t} = this.props;
                if (selected) {

                    if (this.props.basket.length < 100) {
                        console.log("1");
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
                                                // this.setState({loader: false});
                                            } else {
                                                // this.setState({loader: false});
                                            }
                                        });
                                    } else {
                                        // this.setState({loader: false});
                                    }
                                });
                            } else {
                                // this.setState({loader: false});
                            }
                        });

                    } else {
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
                                                    // this.setState({loader: false});
                                                } else {
                                                    // this.setState({loader: false});
                                                }
                                            });
                                        } else {
                                            // this.setState({loader: false});
                                        }
                                    });
                                } else {
                                    // this.setState({loader: false});
                                }
                            });

                        } else {
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
                }
                this.setState({loader: false});

            },
            selections: [{
                key: 'all-data',
                text: 'Выбрать все',
                onSelect: async (select) => {
                    this.setState({
                        selectedRowKeys: this.state.newSprtData.map((el) => {
                            return el.key
                        }),
                    });
                    const {t} = this.props;

                    this.setState({loader: true});
                    for (let record of this.state.newSprtData) {
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
                                                        // this.setState({loader: false});
                                                    } else {
                                                        // this.setState({loader: false});
                                                    }
                                                });
                                            } else {
                                                // this.setState({loader: false});
                                            }
                                        });
                                    } else {
                                        // this.setState({loader: false});
                                    }
                                });

                            } else {
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
                        this.setState({loader: true});
                        for (let record of this.state.newSprtData) {
                            this.props.removeCaseFromBasket(record);
                        }
                        this.setState({loader: false});
                    },
                }

            ],
            selectedRowKeys: this.state.selectedRowKeys,
            onSelection: this.onSelection,


        };
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


    showModalCaseInInv = () => {
        this.setState({
            visibleCaseInIvModal: true,
        });
    };
    handleCaseInInvOk = (e) => {
        this.setState({
            visibleCaseInIvModal: false,
        });
    };
    handleCaseInInvCancel = (e) => {
        this.setState({
            visibleCaseInIvModal: false,
        });
    };


    getExtraInfoDocInInv = async (idRec) => {
        console.log('click', idRec);
        this.showModalCaseInInv();
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
        await this.props.getCube('CubeForAF_Case', JSON.stringify(docFilter), {customKey: 'singleExtraInfoCaseInInv'});
        var dpDoc = this.props.singleExtraInfoCaseInInv['dp_' + this.props.tofiConstants['dpForCase'].id];
        var dpCube = this.props.singleExtraInfoCaseInInv['cube'];

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
            modalTitle: this.props.singleExtraInfoCaseInInv['do_' + this.props.tofiConstants['doForCase'].id]['0'].fullName[this.lng],
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
            var listItems = [];

            response.data.success == true ? (
                response.data.data.forEach((el) => {
                        var dbeg = el.dbeg != '1800-01-01' ? el.dbeg : '';
                        var dend = el.dend != '3333-12-31' ? el.dend : '';
                        var item = {
                            name: el.name[localStorage.getItem('i18nextLng')],
                            legalStatus: el.legalStatus[localStorage.getItem('i18nextLng')],
                            dBeg: dbeg,
                            dEnd: dend,
                            fundHistoricalNoteMulti: el.fundHistoricalNoteMulti[localStorage.getItem('i18nextLng')]
                        };
                        listItems.push(item);
                    }
                )
            ) : '';


            this.setState({
                modalVersionsName: listItems,
            })
        })

    };
    handleChangeSortData = (value) => {
        if (value.length === 0) {
            this.setState({
                newSprtData: this.state.data,
                arrOption: []
            })
        } else {
            this.setState({
                arrOption: value
            }, () => {

                let data = value.map(el => {
                    let newData = this.state.data.filter((elf) => {
                        return Number(el) === elf.bunchCases.value
                    })
                    return newData
                })
                let rezulData = data.reduce((flat, current) => {
                    return flat.concat(current);
                }, []);
                this.setState({
                    newSprtData: rezulData
                }, () => console.log(this.state.newSprtData))
            })
        }

    }


    render() {
        const {data, selectedCase, search, newSprtData} = this.state;
        this.lng = localStorage.getItem('i18nextLng');
        this.filteredData = newSprtData.filter(item => {
            return (
                item.name[this.lng].toLowerCase().includes(search.name.toLowerCase()) &&
                !!item.caseDbeg && String(item.caseDbeg.value).toLowerCase().includes(String(search.caseDbeg).toLowerCase()) &&
                !!item.caseDend &&  String(item.caseDend.value).toLowerCase().includes(String(search.caseDend).toLowerCase()) &&
                item.fundNumber.value.toLowerCase().includes(search.fundNumber.toLowerCase())

            )

        });

        //  console.log(data, this.filteredData);
        const {t, selectedFund, selectedInventory, tofiConstants: {legalStatus, fundDbeg, fundDend, fundHistoricalNoteMulti, archiveCipher, dateEvent, dateForming, addressee, caseNumb, eventLocation, caseDocsLang, caseDbeg, caseDend}} = this.props;
        console.log(this.props.loadingTable, this.state.loading);
        return (
            <div className="Cases">
                <div className="Cases__header">
                    <div style={{display:"flex"}}>
                        <div>
                            <h2 style={{marginLeft: "10px",
                                fontWeight: 600,
                                textTransform: "uppercase",
                                marginRight:"10px"
                            }}>{t("CASES")}</h2>

                        </div>
                        <div>
                            <Select
                                mode="tags"
                                style={{width: '300px'}}
                                placeholder="Выбрать связку"
                                onChange={this.handleChangeSortData}

                            >
                                {this.state.sortData.map(el => {
                                    return <Option key={el.value}>{el.label}</Option>
                                })}
                            </Select>
                        </div>

                    </div>

                    <Breadcrumb>
                        <Breadcrumb.Item><a role='button'
                                            onClick={this.goBackFund}>{selectedFund.name[this.lng]}</a></Breadcrumb.Item>
                        <Breadcrumb.Item><a role='button'
                                            onClick={this.goBackInv}>{selectedInventory.name[this.lng]}</a></Breadcrumb.Item>
                        {selectedCase && selectedCase.name && <Breadcrumb.Item>
                            <b>{selectedCase.name[this.lng]}</b>
                        </Breadcrumb.Item>}
                    </Breadcrumb>
                </div>
                <div className="Cases__body">
                    <Spin spinning={this.state.loader}>
                        <AntTable
                            loading={this.props.loadingTable || this.state.loading}

                            columns={[
                                {
                                    key: "fundNumber",
                                    title: t('CASE_NUMB'),
                                    dataIndex: "fundNumber",
                                    render: (key, obj) => { return key.value},
                                    filterDropdown: (
                                        <div className="custom-filter-dropdown">
                                            <Input
                                                name="fundNumber"
                                                suffix={search.fundNumber ? <Icon type="close-circle" data-name="fundNumber"
                                                                                  onClick={this.emitEmpty}/> : null}
                                                ref={ele => this.fundNumber = ele}
                                                placeholder="Поиск"
                                                value={search.fundNumber}
                                                onChange={this.onInputChange}
                                            />
                                        </div>
                                    ),
                                    filterIcon: <Icon type="filter"
                                                      style={{color: search.fundNumber ? '#ff9800' : '#aaa'}}/>,
                                    onFilterDropdownVisibleChange: (visible) => {
                                        this.setState({
                                            filterDropdownVisible: visible,
                                        }, () => this.fundNumber.focus());
                                    },
                                    sorter: (a, b) => ((a.fundNumber.value).replace(/[^0-9]/g, '')) - ((b.fundNumber.value).replace(/[^0-9]/g, '')),
                                    width: "7%"
                                },
                                {
                                    key: "archiveCipher",
                                    title: t('ARCHIVALCIPHER'),
                                    dataIndex: "archiveCipher",
                                    width: "13%",
                                    render: (key, obj) => { return key.value},
                                },
                                {
                                    key: "name",
                                    title: t("TITLE"),
                                    dataIndex: "name",
                                    filterDropdown: (
                                        <div className="custom-filter-dropdown">
                                            <Input
                                                name="name"
                                                suffix={search.name ? <Icon type="close-circle" data-name="name"
                                                                            onClick={this.emitEmpty}/> : null}
                                                ref={ele => this.name = ele}
                                                placeholder="Поиск"
                                                value={search.name}
                                                onChange={this.onInputChange}
                                            />
                                        </div>
                                    ),
                                    filterIcon: <Icon type="filter" style={{color: search.name ? '#ff9800' : '#aaa'}}/>,
                                    onFilterDropdownVisibleChange: (visible) => {
                                        this.setState({
                                            filterDropdownVisible: visible,
                                        }, () => this.name.focus());
                                    },
                                    width: "60%",
                                    render: (obj, rec) => {
                                        if (parseFloat(rec.parent) === 0) return (
                                            <span>
                          {obj && obj[this.lng]}
                                                <Icon type="question-circle"
                                                      style={{color: '#009688', float: 'right', cursor: 'pointer'}}
                                                      onClick={this.showCasesInfo}/>
                        </span>
                                        );
                                        return obj && obj[this.lng];
                                    }
                                },
                                {
                                    key: "caseDbeg",
                                    title: caseDbeg.name[this.lng],
                                    dataIndex: "caseDbeg",
                                    width: "6%",
                                        render: (key, obj) => { return key.value},

                                    filterDropdown: (
                                        <div className="custom-filter-dropdown">
                                            <Input
                                                name="caseDbeg"
                                                suffix={search.caseDbeg ? <Icon type="close-circle" data-name="caseDbeg"
                                                                                onClick={this.emitEmpty}/> : null}
                                                ref={ele => this.caseDbeg = ele}
                                                placeholder="Поиск"
                                                value={search.caseDbeg}
                                                onChange={this.onInputChange}
                                            />
                                        </div>
                                    ),
                                    filterIcon: <Icon type="filter" style={{color: search.caseDbeg ? '#ff9800' : '#aaa'}}/>,
                                    onFilterDropdownVisibleChange: (visible) => {
                                        this.setState({
                                            filterDropdownVisible: visible,
                                        }, () => this.caseDbeg.focus());
                                    },
                                },
                                {
                                    key: "caseDend",
                                    title: caseDend.name[this.lng],
                                    dataIndex: "caseDend",
                                    width: "6%",
                                    render: (key, obj) => { return key.value},
                                    filterDropdown: (
                                        <div className="custom-filter-dropdown">
                                            <Input
                                                name="caseDend"
                                                suffix={search.caseDend ? <Icon type="close-circle" data-name="caseDend"
                                                                                onClick={this.emitEmpty}/> : null}
                                                ref={ele => this.caseDend = ele}
                                                placeholder="Поиск"
                                                value={search.caseDend}
                                                onChange={this.onInputChange}
                                            />
                                        </div>
                                    ),
                                    filterIcon: <Icon type="filter" style={{color: search.caseDend ? '#ff9800' : '#aaa'}}/>,
                                    onFilterDropdownVisibleChange: (visible) => {
                                        this.setState({
                                            filterDropdownVisible: visible,
                                        }, () => this.caseDend.focus());
                                    },
                                },
                                {
                                    key: "recId",
                                    title: '?',
                                    dataIndex: "recId",
                                    width: "8%",
                                    onCellClick: (obj) => {

                                        obj ? this.getExtraInfoDocInInv(obj.recId) : ''
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
                            dataSource={this.filteredData}
                            rowSelection={this.rowSelection()}
                        />
                    </Spin>
                </div>


                <Modal
                    footer={null}
                    className="extraModal"
                    title={this.state.modalTitle}
                    visible={this.state.visibleCaseInIvModal}
                    onOk={this.handleCaseInInvOk}
                    onCancel={this.handleCaseInInvCancel}
                >
                    <Tabs defaultActiveKey="1" onChange={this.callback}
                          className="extraModalTabs disabledColorLight">
                        <TabPane tab={t('TITLE')} key="1">

                            <Form>
                                <Form.Item {...formItemLayout} label={archiveCipher.name[this.lng]}>
                                    <Input disabled value={this.state.modalArchiveCipher}/>
                                </Form.Item>
                                <Form.Item {...formItemLayout} label={addressee.name[this.lng]}>
                                    <Input disabled value={this.state.modalAddressee}/>
                                </Form.Item>
                                <Form.Item {...formItemLayout} label={dateEvent.name[this.lng]}>
                                    <Input disabled value={this.state.modalDateEvent}/>
                                </Form.Item>
                                <Form.Item {...formItemLayout} label={eventLocation.name[this.lng]}>
                                    <Input disabled value={this.state.modalEventLocation}/>
                                </Form.Item>
                                <Form.Item {...formItemLayout} label={caseDocsLang.name[this.lng]}>
                                    <Input disabled value={this.state.modalCaseDocsLang}/>
                                </Form.Item>
                                <Form.Item {...formItemLayout} label={dateForming.name[this.lng]}>
                                    <Input disabled value={this.state.modalDateForming}/>
                                </Form.Item>
                            </Form>
                        </TabPane>
                        <TabPane tab={t('FUNDMAKER_HISTORY')} key="2">
                            <AntTable
                                footer={null}
                                dataSource={this.state.modalVersionsName}
                                columns={
                                    [{
                                        title: t('TITLE'),
                                        dataIndex: 'name',
                                        key: 'name',
                                        width: '40%'
                                    },
                                        {
                                            title: legalStatus.name[this.lng],
                                            dataIndex: 'legalStatus',
                                            key: 'legalStatus',
                                            width: '30%'
                                        },
                                        {
                                            title: fundDbeg.name[this.lng] || '',
                                            dataIndex: 'dBeg',
                                            key: 'dBeg',
                                            width: '10%'
                                        },
                                        {
                                            title: fundDend.name[this.lng] || '',
                                            dataIndex: 'dEnd',
                                            key: 'dEnd',
                                            width: '10%'
                                        },
                                        {
                                            title: fundHistoricalNoteMulti.name[this.lng],
                                            dataIndex: 'fundHistoricalNoteMulti',
                                            key: 'fundHistoricalNoteMulti',
                                            width: '10%'
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
        singleExtraInfoCaseInInv: state.cubes.singleExtraInfoCaseInInv

    };
}

export default connect(
    mapStateToProps,
    {casesLoaded, addCaseToBasket, removeCaseFromBasket, getCube}
)(CasesInInventory);
