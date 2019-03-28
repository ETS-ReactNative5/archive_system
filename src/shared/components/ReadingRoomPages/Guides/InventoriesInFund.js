import React from "react";
import {connect} from "react-redux";
import {isEmpty, isEqual} from "lodash";
import {parseCube_new, parseForTable} from "../../../utils/cubeParser";
import AntTable from "../../AntTable";
import {getCube} from "../../../actions/actions";
import axios from "axios"
import {
    CUBE_FOR_AF_CASE,
    CUBE_FOR_AF_INV, CUBE_FOR_FUND_AND_IK,
    DO_FOR_CASE, DO_FOR_FUND_AND_IK, DO_FOR_INV, DP_FOR_CASE, DP_FOR_FUND_AND_IK,
    DP_FOR_INV, DT_FOR_FUND_AND_IK
} from "../../../constants/tofiConstants";
import {Breadcrumb, Icon, Input, Modal, Tabs, Form} from "antd";
import moment from "moment/moment";
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

class InventoriesInFund extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visibleInvModal: false,
            numberFull:[],
            data: [],
            search: {
                name: '',
                invDates: '',
                modalArchiveCipher: '',
                modalInvType: '',
                modalDocumentType: '',
                modalFundFeature: '',
                modalInvCaseSystem: '',
                modalInvAgreementDate: '',
                modalInvAgreement2Date: '',
                modalInvApprovalDate2: ''


            },
            selectedInventory: null
        };
    }

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

    componentDidMount() {
        if (!this.state.data.length && this.props.inventories) {
            this.populate();
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.inventories !== this.props.inventories) {
            this.populate();
        }
    }

    handleOkInv = (e) => {
        this.setState({
            visibleInvModal: false,
        });
    };
    handleCancelInv = (e) => {
        this.setState({
            visibleInvModal: false,
        });
    };
    getExtraInfoInv = async (idRec) => {
        this.showModalInv();
        //    this.setState({loading: true});
        var invFilter = {
            filterDOAnd: [
                {
                    dimConst: 'doForInv',
                    concatType: "and",
                    conds: [
                        {
                            ids: String(idRec)
                        }
                    ]
                }
            ],
            filterDPAnd: [
                {
                    dimConst: 'dpForInv',
                    concatType: "and",
                    conds: [
                        {
                            consts: 'invType,archiveCipher,documentType,fundFeature,invCaseSystem,invAgreementDate,invAgreement2Date,invApprovalDate2'
                        }
                    ]
                }
            ]
        };
        await this.props.getCube('CubeForAF_Inv', JSON.stringify(invFilter), {customKey: 'singleExtraInfoInv'});
        var dpFund = this.props.singleExtraInfoInv['dp_' + this.props.tofiConstants['dpForInv'].id];
        var dpCube = this.props.singleExtraInfoInv['cube'];

        /*Собираем данные для модального окна*/
        var archiveCipherProp = dpFund.find(item => item.prop == this.props.tofiConstants.archiveCipher.id);
        var archiveCipherVal = dpCube.find(item => (item['dp_' + this.props.tofiConstants['dpForInv'].id]) == archiveCipherProp.id);
        archiveCipherVal = archiveCipherVal ? archiveCipherVal.ValueStr ? archiveCipherVal.ValueStr[this.lng] : '' : '';

        var invTypeProp = dpFund.find(item => item.prop == this.props.tofiConstants.invType.id);
        var invTypeVal = dpCube.find(item => (item['dp_' + this.props.tofiConstants['dpForInv'].id]) == invTypeProp.id);
        invTypeVal = invTypeVal ? invTypeVal.fullName ? invTypeVal.fullName[this.lng] : '' : '';

        var documentTypeProp = dpFund.find(item => item.prop == this.props.tofiConstants.documentType.id);
        var documentTypeVal = dpCube.find(item => (item['dp_' + this.props.tofiConstants['dpForInv'].id]) == documentTypeProp.id);
        documentTypeVal = documentTypeVal ? documentTypeVal.fullName ? documentTypeVal.fullName[this.lng] : '' : '';

        var fundFeatureProp = dpFund.find(item => item.prop == this.props.tofiConstants.fundFeature.id);
        var fundFeatureVal = dpCube.find(item => (item['dp_' + this.props.tofiConstants['dpForInv'].id]) == fundFeatureProp.id);
        fundFeatureVal = fundFeatureVal ? fundFeatureVal.fullName ? fundFeatureVal.fullName[this.lng] : '' : '';

        var invCaseSystemProp = dpFund.find(item => item.prop == this.props.tofiConstants.invCaseSystem.id);
        var invCaseSystemVal = dpCube.find(item => (item['dp_' + this.props.tofiConstants['dpForInv'].id]) == invCaseSystemProp.id);
        invCaseSystemVal = invCaseSystemVal ? invCaseSystemVal.ValueStr ? invCaseSystemVal.ValueStr[this.lng] : '' : '';

        var invAgreementDateProp = dpFund.find(item => item.prop == this.props.tofiConstants.invAgreementDate.id);
        var invAgreementDateVal = dpCube.find(item => (item['dp_' + this.props.tofiConstants['dpForInv'].id]) == invAgreementDateProp.id);
        invAgreementDateVal = invAgreementDateVal ? invAgreementDateVal.valueDateTime : '';

        var invAgreement2DateProp = dpFund.find(item => item.prop == this.props.tofiConstants.invAgreement2Date.id);
        var invAgreement2DateVal = dpCube.find(item => (item['dp_' + this.props.tofiConstants['dpForInv'].id]) == invAgreement2DateProp.id);
        invAgreement2DateVal = invAgreement2DateVal ? invAgreement2DateVal.valueDateTime : '';

        var invApprovalDate2Prop = dpFund.find(item => item.prop == this.props.tofiConstants.invApprovalDate2.id);
        var invApprovalDate2Val = dpCube.find(item => (item['dp_' + this.props.tofiConstants['dpForInv'].id]) == invApprovalDate2Prop.id);
        invApprovalDate2Val = invApprovalDate2Val ? invApprovalDate2Val.valueDateTime : '';

        this.setState({
            modalTitle: this.props.singleExtraInfoInv['do_' + this.props.tofiConstants['doForInv'].id]['0'].fullName[this.lng],
            modalArchiveCipher: archiveCipherVal,
            modalInvType: invTypeVal,
            modalDocumentType: documentTypeVal,
            modalFundFeature: fundFeatureVal,
            modalInvCaseSystem: invCaseSystemVal,
            modalInvAgreementDate: invAgreementDateVal,
            modalInvAgreement2Date: invAgreement2DateVal,
            modalInvApprovalDate2: invApprovalDate2Val


        });


    };


    showModalInv = () => {
        this.setState({
            visibleInvModal: true,
        });
    };

    populate = () => {
        if (isEmpty(this.props.tofiConstants)) return;

        const {inventories, tofiConstants: {doForInv, dpForInv}} = this.props;
        this.setState({
            data: parseCube_new(
            inventories["cube"],
            [],
            "dp",
            "do",
            inventories[`do_${doForInv.id}`],
            inventories[`dp_${dpForInv.id}`],
            `do_${doForInv.id}`,
            `dp_${dpForInv.id}`
            ).map(this.renderTableData)
        },()=>{
            this.state.data.map((el) => {
                let fdGetCountFund = new FormData();
                fdGetCountFund.append('idInv', el.key.split('_')[1]);
                axios.post(`/${localStorage.getItem('i18nextLng')}/archiveFund/countCasesOfInv`, fdGetCountFund).then(res => {
                    if (res.data.success === true) {
                        this.setState({
                            numberFull: this.state.numberFull.concat({
                                key: el.key.split('_')[1],
                                value: res.data.data.countCasesOfInv
                            })
                        })
                    }
                })
            })
        })
    };

    renderTableData = item => {
        const constArr = ['invNumber', 'invDates', 'invType', 'fundNumberOfCases', 'fundNumberOfCasesWithFiles',];
        const result = {
            key: item.id,
            name: item.name ? item.name : {kz: '', ru: '', en: ''}
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
        this.props.changeSelectedRowChild({
            type: 'guides',
            rec
        }, [CUBE_FOR_FUND_AND_IK, JSON.stringify(filters)]);
    };
    changeSelectedInventory = rec => {
        if (isEmpty(this.state.selectedInventory) || !isEqual(this.state.selectedInventory, rec)) {
            this.setState({selectedInventory: rec});
        } else {
            const filters = {
                filterDOAnd: [{
                    dimConst: DO_FOR_CASE,
                    concatType: "and",
                    conds: [{
                        data: {
                            dimPropConst: 'dpForCase',
                            propId: 'caseInventory',
                            valueRef: {
                                id: rec.key
                            },
                            condType: '='
                        }
                    }]
                }],
                filterDPAnd: [{
                    dimConst: DP_FOR_CASE,
                    concatType: "and",
                    conds: [{
                        consts: 'fundNumber,archiveCipher,bunchCases,caseDbeg,caseDend'
                    }]
                }]
            };
            this.props.changeSelectedRowChild({
                type: 'inventories',
                rec
            }, [CUBE_FOR_AF_CASE, JSON.stringify(filters)]);
        }
    };

    render() {
        const {data, selectedInventory, search} = this.state;
        const {selectedFund, tofiConstants: {invNumber, fundNumberOfCases, invDates, invApprovalDate2, invType, invAgreement2Date, archiveCipher, documentType, fundFeature, invCaseSystem, invAgreementDate,}} = this.props;
        this.lng = localStorage.getItem('i18nextLng');

        this.filteredData = data.filter(item => {
            return (
            item.name[this.lng].toLowerCase().includes(search.name.toLowerCase())
            )
        });

        const {t} = this.props;
        return (
        <div className="Inventories">
            <div className="Inventories__header">
                <h2 className="Inventories__heading">{t("INVENTORIES")}</h2>
                <Breadcrumb>
                    <Breadcrumb.Item><a role='button'
                                        onClick={this.goBackFund}>{selectedFund.name[this.lng]}</a></Breadcrumb.Item>
                    {selectedInventory && selectedInventory.name && <Breadcrumb.Item>
                        <b>{selectedInventory.name[this.lng]}</b>
                    </Breadcrumb.Item>}
                </Breadcrumb>
            </div>
            <div className="Inventories__body">
                <AntTable
                openedBy="Inventories"
                loading={this.props.loadingTable}
                columns={[
                    {
                        key: "invNumber",
                        title: t('INV_NUMB'),
                        dataIndex: "invNumber",
                        width: "5%",
                        sorter: (a, b) => ((a.invNumber).replace(/[^0-9]/g, '')) - ((b.invNumber).replace(/[^0-9]/g, ''))
                    },
                    {
                        key: "name",
                        title: t("TITLE"),
                        dataIndex: "name",
                        width: "70%",
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
                        render: (obj, rec) => {
                            if (parseFloat(rec.parent) === 0) return (
                            <span>
                      {obj && obj[this.lng]}
                    </span>
                            );
                            return obj && obj[this.lng];
                        }
                    },
                    {
                        key: "invDates",
                        title: invDates.name[this.lng],
                        dataIndex: "invDates",
                        width: "10%",
                        render:(obj,rec)=>{
                            return obj && obj.join(', ');
                          }    ,
                        filterDropdown: (
                        <div className="custom-filter-dropdown">
                            <Input
                            name="invDates"
                            suffix={search.invDates ?
                            <Icon type="close-circle" data-name="invDates"
                                  onClick={this.emitEmpty}/> : null}
                            ref={ele => this.invDates = ele}
                            placeholder="Поиск"
                            value={search.invDates}
                            onChange={this.onInputChange}
                            />
                        </div>
                        ),
                        filterIcon: <Icon type="filter"
                                          style={{color: search.invDates ? '#ff9800' : '#aaa'}}/>,
                        onFilterDropdownVisibleChange: (visible) => {
                            this.setState({
                                filterDropdownVisible: visible,
                            }, () => this.invDates.focus());
                        },
                    },
                    {
                        key: "fundNumberOfCases",
                        title: fundNumberOfCases.name[this.lng],
                        dataIndex: "fundNumberOfCases",
                        width: "8%",
                        render:(text, record) => {
                            let rezul = this.state.numberFull.find((el) => record.key.split('_')[1] === el.key)
                            if (rezul === undefined)return false
                            return rezul.value
                        }
                    },
                    { // Справка по описи
                        key: "action",
                        title: '',
                        dataIndex: '',
                        width: "7%",
                        onCellClick: (record) => {
                            record ? this.getExtraInfoInv(record.key) : ''
                        },
                        render: (text, record) => {
                            return (
                            <div className="editable-row-operations">
                                <Icon type="question-circle" style={{
                                    color: '#009688',
                                    float: 'center',
                                    cursor: 'normal'
                                }}/>
                            </div>
                            )
                        }
                    }
                ]}
                dataSource={this.filteredData}
                changeSelectedRow={this.changeSelectedInventory}
                />
            </div>


            <Modal
            footer={null}
            className="extraModal disabledColorLight"
            title={this.state.modalTitle}
            visible={this.state.visibleInvModal}
            onOk={this.handleOkInv}
            onCancel={this.handleCancelInv}
            >
                <Tabs defaultActiveKey="1" onChange={this.callback}
                      className="extraModalTabs">
                    <TabPane tab={t('REFERENCE')} key="1">
                        <Form >
                            <Form.Item {...formItemLayout} label={archiveCipher.name[this.lng]}>
                                <Input disabled value={this.state.modalArchiveCipher} />
                            </Form.Item>
                            <Form.Item {...formItemLayout} label={invType.name[this.lng]}>
                                <Input disabled value={this.state.modalInvType} />
                            </Form.Item>
                            <Form.Item {...formItemLayout} label={documentType.name[this.lng]}>
                                <Input disabled value={this.state.modalDocumentType} />
                            </Form.Item>
                            <Form.Item {...formItemLayout} label={fundFeature.name[this.lng]}>
                                <Input disabled value={this.state.modalFundFeature} />
                            </Form.Item>
                            <Form.Item {...formItemLayout} label={invCaseSystem.name[this.lng]}>
                                <Input disabled value={this.state.modalInvCaseSystem} />
                            </Form.Item>
                            <Form.Item {...formItemLayout} label={invAgreementDate.name[this.lng]}>
                                <Input disabled value={this.state.modalInvAgreementDate} />
                            </Form.Item>
                            <Form.Item {...formItemLayout} label={invAgreement2Date.name[this.lng]}>
                                <Input disabled value={this.state.modalInvAgreement2Date} />
                            </Form.Item>
                            <Form.Item {...formItemLayout} label={invApprovalDate2.name[this.lng]}>
                                <Input disabled value={this.state.modalInvApprovalDate2} />
                            </Form.Item>
                        </Form>
                    </TabPane>
                </Tabs>
            </Modal>
        </div>
        );
    }
}
{
}

function mapStateToProps(state) {
    return {
        inventories: state.cubes[CUBE_FOR_AF_INV],
        tofiConstants: state.generalData.tofiConstants,
        singleExtraInfoInv: state.cubes.singleExtraInfoInv
    };
}

export default connect(mapStateToProps, {getCube})(InventoriesInFund);
