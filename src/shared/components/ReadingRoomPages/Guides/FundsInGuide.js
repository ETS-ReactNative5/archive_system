import React from "react";
import {connect} from "react-redux";
import {isEmpty, isEqual} from "lodash";
import {Icon, Input, Modal, Tabs, Form} from "antd";
import axios from 'axios';
import {parseCube_new, parseForTable} from "../../../utils/cubeParser";
import AntTable from "../../AntTable";
import {getCube} from "../../../actions/actions";
import {getObjVer_new} from '../../../actions/actions';
import {
    CUBE_FOR_AF_INV,
    CUBE_FOR_FUND_AND_IK,
    DO_FOR_INV
} from "../../../constants/tofiConstants";

import FundInfoModal from "./FundInfoModal";
/*import TextArea from "antd/es/input/TextArea.d";*/
const { TextArea } = Input;
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
const TabPane = Tabs.TabPane;
class FundsInGuide extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            visibleFundModal: false,
            search: {
                name: '',
                fundNumber: '',
                deadline: ''
            },
            selectedFund: null,
            modalPersonAddress:'',
            modalShow: false,
            modalFundArchive: '',
            mapedCountCases:[],
            modalPersonAddress: '',
            modalAccessDocument: '',
            modalAnnotationContentOfDocument: '',
            modalVersionsName: [],
            modalVersionsNameFund: [],
            fundNumberOfUpr:'',
            fundNumberOfLP:'',
            fundNumberOfNTD:'',
            fundNumberOfLS:'',
            fundNumberOfKino:'',
            fundNumberOfPhoto:'',
            fundNumberOfPhono:'',
            fundNumberOfVideo:'',
            fundNumberOfMCHD:'',
            fundNumberOfMicroforms:'',
            fundNumberOfMicrofilms:'',
            aboutFundMakerLoading:false,
            aboutFundLoading:false,
            countLoading:false
        }
    }

    componentDidMount() {
        if (!this.state.data.length && this.props.funds) {
            this.populate();
        }
    };

    componentDidUpdate(prevProps) {
        if (prevProps.funds !== this.props.funds) {
            this.populate();
        }
    }

    handleOkFund = (e) => {
        this.setState({
            visibleFundModal: false,
        });
    };
    handleCancelFund = (e) => {
        this.setState({
            visibleFundModal: false,
        });
    };
    showModalFund = () => {
        this.setState({
            visibleFundModal: true,
        });
    };

    getExtraInfoFund = async (idRec) => {

        this.setState({
            aboutFundMakerLoading:true,
            aboutFundLoading:true,
            countLoading:true,
        });
      this.showModalFund();
    //    this.setState({loading: true});
        var fundFilter = {
            filterDOAnd: [
                {
                    dimConst: 'doForFundAndIK',
                    concatType: "and",
                    conds: [
                        {
                            ids: String(idRec)
                        }
                    ]
                }
            ]
        };
        await this.props.getCube('cubeForFundAndIK', JSON.stringify(fundFilter), {customKey: 'singleExtraInfoFund'});
        var dpFund = this.props.singleExtraInfoFund['dp_' + this.props.tofiConstants['dpForFundAndIK'].id];
        var dpCube = this.props.singleExtraInfoFund['cube'];


        /*Собираем данные для модального окна*/




        var accessDocumentProp = dpFund.find(item => item.prop == this.props.tofiConstants.accessDocument.id);
        var accessDocumentVal = dpCube.find(item => (item['dp_' + this.props.tofiConstants['dpForFundAndIK'].id]) == accessDocumentProp.id);
        accessDocumentVal = accessDocumentVal ? accessDocumentVal.name ? accessDocumentVal.name[this.lng] : '' : '';




        this.setState({
            loading: false,
            modalTitle: this.props.singleExtraInfoFund['do_' + this.props.tofiConstants['doForFundAndIK'].id]['0'].fullName[this.lng],
            modalAccessDocument:accessDocumentVal,

        });

        var fdIdRec = new FormData();
        fdIdRec.append('fundId', idRec);
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
        });

        var fdIdRecMultiText = new FormData();
        fdIdRecMultiText.append('obj', idRec.split('_')[1]);
        fdIdRecMultiText.append('propConsts', 'annotationContentOfDocument');
        axios.post(`/${localStorage.getItem('i18nextLng')}/entity/getValueOfMultiText`, fdIdRecMultiText).then(response => {
            response.data.data[0] ?
            this.setState({
                modalAnnotationContentOfDocument:response.data.data[0].valueMultiStr[this.lng]
            }) :  this.setState({
                modalAnnotationContentOfDocument:''
            })
        });

        axios.get(`/${localStorage.getItem('i18nextLng')}/obj/getVer?obj=${idRec.split('_')[1]}`)
        .then(response=>{
            var listItemsFund=[];
            response.data.success == true ? (
            response.data.data.forEach((el) =>{
                var dbeg = el.dbeg!='1800-01-01' ? el.dbeg:'';
                var dend = el.dend!='3333-12-31' ? el.dend:'';
                var item={name:el.name[localStorage.getItem('i18nextLng')],
                    dBeg:dbeg,
                    dEnd:dend
                };

                listItemsFund.push(item);
            }
            )
            ): '';

            this.setState({
                aboutFundLoading:false,
                modalVersionsNameFund: listItemsFund,
            })
        });



        var fdGetCountFund = new FormData();
        fdGetCountFund.append('fundId', idRec.split('_')[1]);
        axios.post(`/${localStorage.getItem('i18nextLng')}/archiveFund/calcCountDocsOfFund`, fdGetCountFund).then(response => {
           if( response.data.success==true){
               var result=response.data.data;
               var mapedCountCases =[];
               Object.entries(result).forEach(el=>{
                       var item={
                           'name':el[0],
                           'value':el[1]
                       };
                   item.name!="fundNumberOfCases" ? mapedCountCases.push(item):'';

               })
           }

           this.setState({
               countLoading:false,
               mapedCountCases:mapedCountCases
           })
        });


        var fdGetArchiveByFond = new FormData();
        fdGetArchiveByFond.append('idFund', idRec.split('_')[1]);
        axios.post(`/${localStorage.getItem('i18nextLng')}/entity/getArchiveByFund`, fdGetArchiveByFond).then(response => {
            var data=response.data.data;
            this.setState({
                modalPersonAddress: data.personAddress[localStorage.getItem('i18nextLng')],
                modalFundArchive: data.fullName[localStorage.getItem('i18nextLng')],
            })
        });



    };

    populate = () => {
        if (isEmpty(this.props.tofiConstants)) return;
        const {funds, tofiConstants: {doForFundAndIK, dpForFundAndIK}} = this.props;
        this.setState({
            data: parseCube_new(
                funds["cube"],
                [],
                "dp",
                "do",
                funds[`do_${doForFundAndIK.id}`],
                funds[`dp_${dpForFundAndIK.id}`],
                `do_${doForFundAndIK.id}`,
                `dp_${dpForFundAndIK.id}`
            ).map(this.renderTableData)
        })
    };

    renderTableData = item => {

        const constArr = ['fundDbeg', 'fundDend', 'fundNumber', 'fundIndex', 'fundCategory', 'fundNumberOfCases',
            'fundArchive', 'locationOfSupplementaryMaterials', 'accessDocument'];
        const result = {
            key: item.id,
            name: item.name ? item.name : {kz: '', ru: '', en: ''}
        };
        parseForTable(item.props, this.props.tofiConstants, result, constArr);
        // deadline need to be computed
        result.deadline = result.fundDbeg && result.fundDend ? (result.fundDbeg.value + '-' + result.fundDend.value) : null
        return result
    };



    changeSelectedFund = rec => {
        if (isEmpty(this.state.selectedFund) || !isEqual(this.state.selectedFund, rec)) {
            this.setState({selectedFund: rec});
        } else {
            const filters = {
                filterDOAnd: [{
                    dimConst: DO_FOR_INV,
                    concatType: "and",
                    conds: [{
                        data: {
                            dimPropConst: 'dpForInv',
                            propId: 'invFund',
                            valueRef: {
                                id: rec.key
                            },
                            condType: '='
                        }
                    }]
                }]
            };
            this.props.changeSelectedRowChild({type: 'funds', rec}, [CUBE_FOR_AF_INV, JSON.stringify(filters)]);
        }
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
    showFundInfo = () => {
        if (this.state.selectedFund) {
            this.setState({
                modalShow: true
            });
        }
    };

    hideFundInfo = () => {
        this.setState({
            modalShow: false
        });
    };

  showAboutFundInfo = () => {
    //
  };

    render() {
        const {data, modalShow, selectedFund, search} = this.state;
        const {t, tofiConstants: {fundNumber,personAddress,annotationContentOfDocument,microfilmsDoc,microformDoc,lpDoc,macReadDoc,LSDoc,photoDoc,phonoDoc,movieDoc,uprDoc,videoDoc,uprNTD,legalStatus,fundDbeg,fundDend,fundHistoricalNoteMulti, fundNumberOfCases,fundArchive,accessDocument}} = this.props;
        this.lng = localStorage.getItem('i18nextLng');

        this.filteredData = data.filter(item => {
            return (
                item.name[this.lng].toLowerCase().includes(search.name.toLowerCase()) &&
                item.fundNumber.value.toLowerCase().includes(search.fundNumber.toLowerCase()) &&
                String(item.deadline).toLowerCase().includes(String(search.deadline).toLowerCase())
            )
        });

        return (
            <div className="Funds">
                <div className="Funds__header">
                    <h2 className="Funds__heading">{t("FUNDS")}</h2>
                </div>
                <div className="Funds__body">
                  <AntTable

                    openedBy="Funds"
                    loading={this.props.loadingTable}
                    columns={[
                      { // Номер фонда
                        key: "fundNumber",
                        title: t('FUNDNUMB'),
                        dataIndex: "fundNumber",
                        width: "10%",
                          // render: (key, obj) => {return key.value + (!!obj.fundIndex ? + " - " + obj.fundIndex.value : '')},
                          render: (key, obj) => {
                          if(!!obj.fundIndex && !!obj.fundIndex.value){
                              return key.value + " - " + obj.fundIndex.value
                          } else {return key.value}
                          },
                        sortBy:'ascend',
                        sorter: (a, b) =>((a.fundNumber.value).replace(/[^0-9]/g,'')) - ((b.fundNumber.value).replace(/[^0-9]/g,'')),
                        filterDropdown: (
                          <div className="custom-filter-dropdown">
                            <Input
                              name="fundNumber"
                              suffix={search.fundNumber.value ? <Icon type="close-circle" data-name="fundNumber"
                              onClick={this.emitEmpty}/> : null}
                              ref={ele => this.fundNumber = ele}
                              placeholder="Поиск"
                              value={search.fundNumber}
                              onChange={this.onInputChange}
                            />
                          </div>
                        ),
                        filterIcon: <Icon type="filter" style={{color: search.name ? '#ff9800' : '#aaa'}}/>,
                        onFilterDropdownVisibleChange: (visible) => {
                          this.setState({
                            filterDropdownVisible: visible,
                          }, () => this.fundNumber.focus());
                        },
                      },
                      { // Наименование фонда
                        key: "name",
                        title: t("TITLE"),
                        dataIndex: "name",
                        width: "60%",
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
                        render: (obj, rec) => {
                          if (parseFloat(rec.parent) === 0) return (
                            <span>
                              {obj && obj[this.lng]}
                              <Icon type="question-circle" style={{color: '#009688', float: 'right', cursor: 'pointer'}} onClick={this.showFundInfo}/>
                            </span>
                          );
                          return obj && obj[this.lng];
                        }
                      },
                      { // Крайние даты
                        key: "deadline",
                        title: t("DEADLINES"),
                        dataIndex: "deadline",
                        width: "14%",
                          render: (key, obj) => { return key},
                        filterDropdown: (
                          <div className="custom-filter-dropdown">
                            <Input
                              name="deadline"
                              suffix={search.deadline ? <Icon type="close-circle" data-name="deadline"
                              onClick={this.emitEmpty}/> : null}
                              ref={ele => this.deadline = ele}
                              placeholder="Поиск"
                              value={search.deadline}
                              onChange={this.onInputChange}
                            />
                          </div>
                        ),
                        filterIcon: <Icon type="filter" style={{color: search.deadline ? '#ff9800' : '#aaa'}}/>,
                        onFilterDropdownVisibleChange: (visible) => {
                          this.setState({
                            filterDropdownVisible: visible,
                          }, () => this.deadline.focus());
                        }
                      },
                      { // Количество единиц хранения
                        key: "fundNumberOfCases",
                        title: fundNumberOfCases.name[this.lng],
                        dataIndex: "fundNumberOfCases",
                        width: "9%"
                      },
                      { // Справка по фонду
                        key: "action",
                        title: t('INFO_FOR_FUND'),
                        dataIndex: '',
                        width: "7%",
                          onCellClick: (record) => {
                              record ? this.getExtraInfoFund(record.key) : ''
                          },
                        render: (text, record) => {
                          return (
                            <div className="editable-row-operations">
                              <Icon type="question-circle" style={{color: '#009688', float: 'center', cursor: 'normal'}}/>
                            </div>
                          )
                        }
                      }
                    ]}
                    dataSource={this.filteredData}
                    changeSelectedRow={this.changeSelectedFund}
                  />
                  {modalShow && (
                    <FundInfoModal
                      modalShow={modalShow}
                      data={selectedFund}
                      onCancel={this.hideFundInfo}
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
                visible={this.state.visibleFundModal}
                onOk={this.handleOkFund}
                onCancel={this.handleCancelFund}
                >
                    <Tabs defaultActiveKey="1" onChange={this.callback} className="extraModalTabs">
                        <TabPane tab={t('ABOUT_FUND')} key="1">
                            <Form>
                                <Form.Item {...formItemLayout} label={fundArchive.name[this.lng]}>
                                    <Input disabled value={this.state.modalFundArchive} />
                                </Form.Item>
                                <Form.Item {...formItemLayout} label={accessDocument.name[this.lng]}>
                                    <Input disabled value={this.state.modalAccessDocument} />
                                </Form.Item>
                                <Form.Item {...formItemLayout} label={personAddress.name[this.lng]}>
                                    <Input disabled value={this.state.modalPersonAddress} />
                                </Form.Item>

                            </Form>
                              <h3>{t('FUND_VERSIONS')}</h3>
                            <AntTable
                            loading={this.state.aboutFundLoading}
                            pagination={false}
                            dataSource={this.state.modalVersionsNameFund}
                            columns={
                                [
                                    {
                                        title:  t('TITLE'),
                                        dataIndex: 'name',
                                        key: 'name',
                                        width:'40%'
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
                                    }

                                ]
                            }
                            />

                            <h3>{t('AMOUNT')}</h3>

                           <AntTable
                            loading={this.state.countLoading}
                            pagination={false}
                            dataSource={this.state.mapedCountCases}
                            columns={
                                        [
                                            {
                                                title:  t('TITLE'),
                                                dataIndex: 'name',
                                                key: 'name',
                                                width:'40%',
                                                render: (name,rec)=>{
                                                    switch(name) {
                                                        case 'fundNumberOfUpr':
                                                            return uprDoc.name[this.lng];
                                                            break;
                                                        case 'fundNumberOfLP':
                                                            return lpDoc.name[this.lng];
                                                            break;
                                                        case 'fundNumberOfNTD':
                                                            return uprNTD.name[this.lng];
                                                            break;
                                                        case 'fundNumberOfLS':
                                                            return LSDoc.name[this.lng];
                                                            break;

                                                        case 'fundNumberOfKino':
                                                            return movieDoc.name[this.lng];
                                                            break;

                                                        case 'fundNumberOfPhoto':
                                                            return photoDoc.name[this.lng];
                                                            break;
                                                        case 'fundNumberOfPhono':
                                                            return phonoDoc.name[this.lng];
                                                            break;

                                                        case 'fundNumberOfVideo':
                                                            return videoDoc.name[this.lng];
                                                            break;

                                                        case 'fundNumberOfMCHD':
                                                            return macReadDoc.name[this.lng];
                                                            break;

                                                        case 'fundNumberOfMicroforms':
                                                            return microformDoc.name[this.lng];
                                                            break;
                                                        case 'fundNumberOfMicrofilms':
                                                            return microfilmsDoc.name[this.lng];
                                                            break;
                                                    }
                                                }
                                            },
                                            {
                                                title: t('AMOUNT'),
                                                dataIndex: 'value',
                                                key: 'value',
                                                width:'10%'
                                            }
                                        ]
                                     }
                            />
                        </TabPane>
                        <TabPane tab={t('ABOUT_FUNMAKER')} key="2">
                            <AntTable
                            pagination={false}
                            rowSelection={''}
                            loading={this.state.aboutFundMakerLoading}
                            dataSource={this.state.modalVersionsName}
                            columns={
                                [
                                    {
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

                        <TabPane tab="Состав и содержание" key="3">
                            <Form>
                                <Form.Item {...formItemLayout} label={annotationContentOfDocument.name[this.lng]}>
                                    <TextArea disabled value={this.state.modalAnnotationContentOfDocument} />
                                </Form.Item>
                            </Form>
                        </TabPane>
                    </Tabs>
                </Modal>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        funds: state.cubes[CUBE_FOR_FUND_AND_IK],
        tofiConstants: state.generalData.tofiConstants,
        singleExtraInfoFund:state.cubes.singleExtraInfoFund
    };
}

export default connect(mapStateToProps, {getCube})(FundsInGuide);
