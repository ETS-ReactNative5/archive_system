import React from 'react'
import {Button, Icon, Input,Popconfirm, message, Modal} from 'antd';
import {connect} from 'react-redux';
import {isEmpty, isEqual, map} from "lodash";
import {CSSTransition} from "react-transition-group";

import {
    createObj, dObj, getCube, getIdGetObj, getObjListNew, getPropVal,
    getUserInformation
} from '../../actions/actions';
import {onSaveCubeData, onSaveCubeData2, parseCube_new, parseForTable} from '../../utils/cubeParser';
import {
    CUBE_FOR_AF_CASE,
    DO_FOR_CASE, DO_FOR_INV,
    DP_FOR_CASE
} from "../../constants/tofiConstants";
import Select from "../Select";
import DPickerTOFI from '../DPickerTOFI';
import CardCase from "./CardCase"
import SiderCard from "../SiderCard";
import AntTable from "../AntTable";
import Viewer from "../Viewer";
import moment from "moment"

/*eslint eqeqeq:0*/
class StorageUnits extends React.Component {

    state = {
        data: [],
        dataInv: [],
        objInv:[],
        dataIk:[],
        ikKey:'',
        keyInv:null,
        loading: false,
        openCard: false,
        openModal: false,
        viewerList: [],
        structuralSubdivisionList: [],
        structuralSubdivisionListLoading: false,
        fundFeature: [],
        fundFeatureLoading: false,
        selectedRow: {},
        filter: {
            name: '',
            documentType:"",
            fundFeature: [],
            fundNumber: '',
            caseDbeg: {
                dbeg: null,
                dend: null
            },
            caseDend: {
                dbeg: null,
                dend: null
            }
        }
    };

    componentDidMount() {
        this.getCubeAct();
    }

    getCubeAct = () => {
        if (this.props.tofiConstants["userOfIK"].id === this.props.user.cls) {

            getUserInformation(this.props.user.obj)
                .then((res) => {
                    let userIkRef = res.idIK
                    getIdGetObj(userIkRef, 'doForFundAndIK').then(async (res) => {
                        let idDimObj = res.data.idDimObj;
                        this.setState({
                            ikKey: {value: idDimObj}
                        })
                        this.getCubeCase({
                            value: idDimObj
                        })
                        const filters = {
                            filterDPAnd: [
                                {
                                    dimConst: 'dpForFundAndIK',
                                    concatType: "and",
                                    conds: [
                                        {
                                            consts:
                                                "numberOfIK,orgDocType,nomen,legalStatus,formOfAdmission,fundArchive,dateIncludeOfIk,dateExcludeOfIk,fundmakerOfIK"
                                        }
                                    ]
                                }
                            ],
                            filterDOAnd: [
                                {
                                    dimConst: 'doForFundAndIK',
                                    concatType: "and",
                                    conds: [
                                        {
                                            ids: String(idDimObj)
                                        }
                                    ]
                                }
                            ],
                            filterDTOr: [
                                {
                                    dimConst: 'dtForFundAndIK',
                                    conds: [
                                        {
                                            ids: String(moment().format("DD-MM-YYYY").slice(-4)) + '0101' + String(moment().format("DD-MM-YYYY").slice(-4)) + '1231'
                                        }
                                    ]
                                }
                            ]
                        };
                        await  this.props.getCube('cubeForFundAndIK', JSON.stringify(filters), {customKey: 'orgSourceCube'}).then(() => this.setState({loading: false}))
                            .catch(err => {
                                console.error(err);
                            })

                        const parsedCube = parseCube_new(this.props.orgSourceCube['cube'],
                            [],
                            'dp',
                            'do',
                            this.props.orgSourceCube['do_' + this.props.tofiConstants['doForFundAndIK'].id],
                            this.props.orgSourceCube['dp_' + this.props.tofiConstants['dpForFundAndIK'].id],
                            'do_' + this.props.tofiConstants['doForFundAndIK'].id,
                            'dp_' + this.props.tofiConstants['dpForFundAndIK'].id
                        ).map(this.renderTableDataIK);
                        this.setState({
                            dataIk: parsedCube
                        })
                        this.getCubeInv({
                            value: parsedCube[0].key
                        })
                    }).catch(e => {
                        console.log(e)
                    })

                }).catch(e => {
                console.log(e)
            })
        }
    }

    getCubeCase=(ids)=>{
        if (!ids){
            ids= this.state.ikKey
        }

        const filtersCase = {
            filterDOAnd: [
                {
                    dimConst: "doForCase",
                    concatType: "and",
                    conds: [
                        {
                            //ids: '1007_144376'
                            data: {
                                valueRef: {
                                    id: String(ids.value)
                                }
                            }
                        }
                    ]
                }
            ],
            filterDPAnd: [
                {
                    dimConst: "dpForCase",
                    concatType: "and",
                    conds: [
                        {
                            consts: "section,caseInventory,caseNomenItem,propTimeLife,bunchCases,invFund,documentType,fundNumber,fundIndex,caseDbeg,caseDend,caseStructuralSubdivision,caseNotes,documentFile,caseNumberOfPages,structuralSubdivisionList,caseDocsLang,irreparablyDamaged,caseOCD,caseInsurance,caseFundOfUse,caseStorage,rack,shelf,propAuthenticity,fundFeature,caseDateOfDeposit,documentFile,dateForming,linkToKatalog,linkToUkaz,linkToObzor,surnameOriginator,uprDocType,storageUnitType,caseNomenItem,accountingUnitType,numberOfOriginals,compositionOfTextDocumentation,storageUnitQuantity,documentAuthor,addressee,question,terrain,documentDate,dateAccuracy,inaccurateDateFeature,day,month,year,typeOfPaperCarrier,objectCode,projectName,projectStage,projectPartName,volumeNumber,yearOfCompletion,accountingUnitNumber,authorTitle,cameraOperator,artistOfTheWork,dateOfRecording,timingOfVideoRecording,TypeAndFormatOfRecording,numberOfVideoItems,original,copy,shootingDate,shootPlace,movieVariant,formatAndBase,numberOfMovieItems,movieNegative,doubleNegative,phonogramNegative,phonogramMagnetic,intermediatePositive,positive,colorPassports,playingTime,mainContent,genre,eventLocation,firstLine,initialsOfAuthors,initialsOfTranslators,manufactureDate,manufacturePlace,serialNumber,numberOfPhonoItems,gremoriginal,gramplastine,recordPlace,soundingSpeed,magneticTapeType,photoDescription,documentShootAuthor,numberOfPhotoPrints,externalFeatures,productionNumber,numberOfPhotoItems,photoNegative,photoDoubleNegative,photoPositive,photocast,slide,filmStrip,terrain,electronicDocumentsFormat,personLastName,personName,personPatronymic,publicPositionOfPerson,propNationality,documentLanguage,documentPlaybackMethod"
                        }
                    ]
                }
            ]

        };
        this.setState({loading: true});
        this.props.getCube("CubeForAF_Case", JSON.stringify(filtersCase))
            .then(() => this.setState({loading: false, objInv:ids}))
            .catch(err => {
                console.error(err);
                this.setState({loading: false})
            })
    }


    getCubeInv = (ikObj) => {

        const filters = {
            filterDOAnd: [
                {
                    dimConst: DO_FOR_INV,
                    concatType: "and",
                    conds: [
                        {
                            data: {
                                dimPropConst: 'dpForInv',
                                propConst: 'invFund',
                                valueRef: {id: String(ikObj.value)}
                            }
                        }
                    ]
                }
            ]
        }
        this.props.getCube('CubeForAF_Inv', JSON.stringify(filters), {customKey: 'InvItem'}).then(() => this.setState({loading: false}))
            .catch(err => {
                console.error(err);
                this.setState({loading: false})
            }).catch(e => {
            console.log(e)

        })
    };

    onChangeInv=(val)=>{
        this.setState({
            keyInv:val
        })
        this.getCubeCase(val)
    }
    componentWillUpdate(nextProps) {
        if (isEmpty(this.props.tofiConstants)) return;

        if (this.props.CubeForAF_Case!== nextProps.CubeForAF_Case) {
            const {doForCase, dpForCase} = nextProps.tofiConstants;
            this.setState(
                {
                    loading: false,
                    data: parseCube_new(
                        nextProps.CubeForAF_Case['cube'],
                        [],
                        'dp',
                        'do',
                        nextProps.CubeForAF_Case[`do_${doForCase.id}`],
                        nextProps.CubeForAF_Case[`dp_${dpForCase.id}`],
                        `do_${doForCase.id}`, `dp_${dpForCase.id}`).map(this.renderTableData)
                }
            );
        }
        if (nextProps.InvItem !== this.props.InvItem) {
            const {doForInv, dpForInv} = nextProps.tofiConstants;
            let parserCube = parseCube_new(nextProps.InvItem['cube'], [], 'dp', 'do', nextProps.InvItem [`do_${doForInv.id}`], nextProps.InvItem [`dp_${dpForInv.id}`], `do_${doForInv.id}`, `dp_${dpForInv.id}`).map(this.renderTableDataInv);
            this.setState({
                dataInv: parserCube
            })
        }
    }

    renderTableData = item => {
        const constArr = ["section","propTimeLife","caseInventory","caseNomenItem","invFund", "bunchCases","documentType", "fundNumber", "fundIndex", "caseDbeg", "caseDend", "caseStructuralSubdivision", "caseNotes", "documentFile", "caseNumberOfPages", "structuralSubdivisionList", "caseDocsLang", "irreparablyDamaged", "caseOCD", "caseInsurance", "caseFundOfUse", "caseStorage", "rack", "shelf", "propAuthenticity", "fundFeature", "caseDateOfDeposit", "documentFile", "dateForming", "linkToKatalog", "linkToUkaz", "linkToObzor", "surnameOriginator", "uprDocType", "storageUnitType", "caseNomenItem", "accountingUnitType", "numberOfOriginals", "compositionOfTextDocumentation", "storageUnitQuantity", "documentAuthor", "addressee", "question", "terrain", "documentDate", "dateAccuracy", "inaccurateDateFeature", "day", "month", "year", "typeOfPaperCarrier", "objectCode", "projectName", "projectStage", "projectPartName", "volumeNumber", "yearOfCompletion", "accountingUnitNumber", "authorTitle", "cameraOperator", "artistOfTheWork", "dateOfRecording", "timingOfVideoRecording", "TypeAndFormatOfRecording", "numberOfVideoItems", "original", "copy", "shootingDate", "shootPlace", "movieVariant", "formatAndBase", "numberOfMovieItems", "movieNegative", "doubleNegative", "phonogramNegative", "phonogramMagnetic", "intermediatePositive", "positive", "colorPassports", "playingTime", "mainContent", "genre", "eventLocation", "firstLine", "initialsOfAuthors", "initialsOfTranslators", "manufactureDate", "manufacturePlace", "serialNumber", "numberOfPhonoItems", "gremoriginal", "gramplastine", "recordPlace", "soundingSpeed", "magneticTapeType", "photoDescription", "documentShootAuthor", "numberOfPhotoPrints", "externalFeatures", "productionNumber", "numberOfPhotoItems", "photoNegative", "photoDoubleNegative", "photoPositive", "photocast", "slide", "filmStrip", "terrain", "electronicDocumentsFormat", "personLastName", "personName", "personPatronymic", "publicPositionOfPerson", "propNationality", "documentLanguage", "documentPlaybackMethod"]

        const result = {
            key: item.id,
            name: item.name,
            parent: item.parent
        };
        parseForTable(item.props, this.props.tofiConstants, result, constArr);
        return result;
    };
    renderTableDataInv = (item, ids) => {
        const constArr = ['invNumber'];

//        const accessLevelObj = this.props.accessLevelOptions.find(al => al.id === item.accessLevel);


        const result = {
            id: item.id,
            ids: ids + 1,
            name: item.name,
            // accessLevel: accessLevelObj && {value: accessLevelObj.id, label: accessLevelObj.name[this.lng]},
        };
        parseForTable(item.props, this.props.tofiConstants, result, constArr);
        // result.invDates = result.invDates ? result.invDates.map(str => ({value: str})) : [];
        return result;
    }
    renderTableDataIK = (item, ids) => {
        const constArr = ['nomen'];

        const result = {
            key: item.id,
            ids: ids + 1,
            name: item.name,
        };
        parseForTable(item.props, this.props.tofiConstants, result, constArr);
        return result;
    }
    onSelectChange = c => s => this.setState({[c]: s});
    changeSelectedRow = rec => {
        rec["caseNumber"] = rec.fundNumber
        if (isEmpty(this.state.selectedRow) || !isEqual(this.state.selectedRow, rec)) {
            this.setState({selectedRow: rec});
        } else {
            this.setState({
                openCard: true,
                selectedRow: rec
            })
        }
    };

    renderTableFooter = () => {
        const {t} = this.props;
        return (
            <div className="table-footer">
                <div className="data-length">
                    <div className="label"><label htmlFor="">{t('COUNT_ITOG')}</label><Input
                        size='small' type="text" readOnly
                        value={this.filteredData.length + ' / ' + this.state.data.length}/></div>
                </div>
            </div>

        )
    };


    loadOptions = c => {
        return () => {
            if (!this.props[c + 'Options']) {
                this.setState({[c + 'Loading']: true});
                this.props.getPropVal(c)
                    .then(() => this.setState({[c + 'Loading']: false}))
            }
        }
    };
    onInputChange = e => {
        this.setState({
            filter: {
                ...this.state.filter,
                [e.target.name]: e.target.value
            }
        })
    };
    onDateChange = (name, dateType) => {
        return date => {
            this.setState({
                filter: {
                    ...this.state.filter,
                    [name]: {...this.state.filter[name], [dateType]: date}
                }
            })
        }
    };
    emitEmpty = e => {
        this.setState({
            filter: {
                ...this.state.filter,
                [e.target.dataset.name]: ''
            }
        })
    };
    onCreateObj = ({name, documentFile, ...values}) => {
        const cube = {
            cubeSConst: "CubeForAF_Case"
        };
        const obj = {
            name: name,
            fullName: name,
            clsConst: 'caseList',

        };
        let newVal = {
            values,
            oFiles: {
                documentFile
            }
        }
        const hideCreateObj = message.loading(this.props.t('CREATING_NEW_OBJECT'), 0);
        return createObj(cube, obj)
            .then(res => {
                hideCreateObj();
                if (res.success) {
                    return this.saveProps({}, newVal, this.props.tofiConstants, {}, res.data.idItemDO, {})
                } else {
                    if (res.errors) {
                        res.errors.forEach(err => {
                            message.error(err.text)
                        })
                    }
                }
            }).catch(err => {
                console.error(err)
            })
    }
    saveProps = async (c, v, t = this.props.tofiConstants, objData, key) => {
        let hideLoading;
        try {
            if (!c.cube) c.cube = {
                cubeSConst: "CubeForAF_Case",
                doConst: "doForCase",
                dpConst: "dpForCase"
            };
            if (!c.cube.data) c.cube.data = this.props.CubeForAF_Case;
            c["obj"] = {
                doItem: key
            }
            hideLoading = message.loading(this.props.t('UPDATING_PROPS'), 0);
            const resSave = await onSaveCubeData(c, v, t, objData);
            hideLoading();
            if (!resSave.success) {
                message.error(this.props.t('PROPS_UPDATING_ERROR'));
                resSave.errors.forEach(err => {
                    message.error(err.text)
                });
                return Promise.reject(resSave);
            }
            message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'));
            this.setState({loading: true, openCard: false});
            let idCube = !!this.state.keyInv ? this.state.keyInv :this.state.ikKey
            await this.getCubeCase(idCube);
            return resSave;
        }
        catch (e) {
            typeof hideLoading === 'function' && hideLoading();
            this.setState({loading: false});
            console.warn(e);
        }
    };
    refreshRecord = (values) => {
        const cube = {
            cubeSConst: 'CubeForAF_Case',
            doConst: 'doForCase',
            dpConst: 'dpForCase',
            data: this.props.CubeForAF_Case
        };
        const obj = {
            doItem: this.state.selectedRow.key
        };
        const hideLoading = message.loading(this.props.t('UPDATING_PROPS'), 30);

        return onSaveCubeData({cube, obj}, {values: values, idDPV: this.withIdDPV}, this.props.tofiConstants)
            .then(res => {
                hideLoading();
                if (res.success) {
                    message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'));
                    this.setState({loading: true, openCard: false});
                    this.getCubeAct();
                }else {
                    message.error(this.props.t('PROPS_UPDATING_ERROR'));
                    if (res.errors) {
                        res.errors.forEach(err => {
                            message.error(err.text);
                        });

                    }
                }

            })
        //return onSaveCubeData({cube, obj}, {oFiles: values}, this.props.tofiConstants)
    };

    getRespCard(invType, docType) {
        const params = {
            t: this.props.t,
            saveProps: this.saveProps,
            initialValues: this.state.selectedRow,
            tofiConstants: this.props.tofiConstants,
            invType: invType,
            docType: docType,
            keyInv: this.props.match.params.idInventCard
        };
        return <CardCase {...params}/>
    }

    addCase=()=>{
        this.setState({
            selectedRow:{},
            openCard:true
        })
    }
    render() {
        if (isEmpty(this.props.tofiConstants)) return null;
        const {
            t, fundFeatureOptions, tofiConstants: {
                structuralSubdivisionList, fundFeature, documentFile,documentType,
                fundNumber, fundIndex, caseDbeg, caseDend, caseNotes, caseStructuralSubdivision
            }
        } = this.props;
        const {structuralSubdivisionListOptions, filter, data, selectedRow} = this.state;
        this.lng = localStorage.getItem('i18nextLng');

        this.filteredData = data.filter(item => {
            return (
                (item.name[this.lng].toLowerCase().includes(filter.name.toLowerCase())) &&
                ( !filter.fundNumber|| item.fundNumber.value.toLowerCase().includes(filter.fundNumber.toLowerCase())) &&
                (!filter.documentType || item.documentType && item.documentType.label.toLowerCase().includes(filter.documentType.toLowerCase()))
                // ( !filter.caseDbeg.dbeg || moment(item.caseDbeg.value).isSameOrAfter(moment(filter.caseDbeg.dbeg).format("DD-MM-YYYY"), 'day') ) &&
                // ( !filter.caseDbeg.dend || moment(item.caseDbeg.value).isSameOrBefore(moment(filter.caseDbeg.dend).format("DD-MM-YYYY"), 'day') ) &&
                // ( !filter.caseDend.dbeg || moment(item.caseDend.value).isSameOrAfter(moment(filter.caseDend.dbeg).format("DD-MM-YYYY"), 'day') ) &&
                // (filter.fundFeature.length === 0 || filter.fundFeature.some(p => item.fundFeature && p.value == item.fundFeature.value)) &&
                //
                // ( !filter.caseDend.dend || moment(item.caseDend.value).isSameOrBefore(moment(filter.caseDend.dend).format("DD-MM-YYYY"), 'day') )
            )
        });

        return (
            <div className="EditCardCases">
                <div className="title">
                    <h2> {t("STORAGEUNIT")}</h2>
                </div>
                <div className="table-header">
                   <Button disabled={this.props.tofiConstants["userOfIK"].id !== this.props.user.cls} onClick={this.addCase}>{t('ADD')}</Button>
                    <div className="label-select">

                    </div>
                    <div className="label-select">
                        <Select
                            name="inventory"
                            isSearchable={false}
                            onChange={this.onChangeInv}
                            options={this.state.dataInv ? this.state.dataInv.map(option => ({
                                value: option.id,
                                label: option.name[this.lng]
                            })) : []}
                            placeholder="Описи"

                        />
                    </div>
                </div>
                <div className="EditCardCases__body">
                    <AntTable
                        columns={[
                            {
                                key: 'fundNumber',
                                title: t("CASE_NUMB"),
                                dataIndex: 'fundNumber',
                                width: '10%',
                                render: obj => obj && obj.value,

                                sorter: (a, b) => ((a.fundNumber.value).replace(/[^0-9]/g, '')) - ((b.fundNumber.value).replace(/[^0-9]/g, '')),
                                filterDropdown: (
                                    <div className="custom-filter-dropdown">
                                        <Input
                                            name="fundNumber"
                                            suffix={filter.fundNumber ?
                                                <Icon type="close-circle" data-name="fundNumber"
                                                      onClick={this.emitEmpty}/> : null}
                                            ref={ele => this.fundNumber = ele}
                                            placeholder="Поиск"
                                            value={filter.fundNumber}
                                            onChange={this.onInputChange}
                                        />
                                    </div>
                                ),
                                filterIcon: <Icon type="filter"
                                                  style={{color: filter.fundNumber ? '#ff9800' : '#aaa'}}/>,
                                onFilterDropdownVisibleChange: (visible) => {
                                    this.setState({
                                        filterDropdownVisible: visible,
                                    }, () => this.fundNumber.focus());
                                },
                            },
                            {
                                key: 'name',
                                title: t('CASE_NAME'),
                                dataIndex: 'name',
                                width: '25%',
                                filterDropdown: (
                                    <div className="custom-filter-dropdown">
                                        <Input
                                            name="name"
                                            suffix={filter.name ?
                                                <Icon type="close-circle" data-name="name"
                                                      onClick={this.emitEmpty}/> : null}
                                            ref={ele => this.name = ele}
                                            placeholder="Поиск"
                                            value={filter.name}
                                            onChange={this.onInputChange}
                                        />
                                    </div>
                                ),
                                filterIcon: <Icon type="filter" style={{color: filter.name ? '#ff9800' : '#aaa'}}/>,
                                onFilterDropdownVisibleChange: (visible) => {
                                    this.setState({
                                        filterDropdownVisible: visible,
                                    }, () => this.name.focus());
                                },
                                render: obj => obj && obj[this.lng]
                            },
                            {
                                key: 'documentType',
                                title: "Вид документации",
                                dataIndex: 'documentType',
                                width: '25%',
                                filterDropdown: (
                                    <div className="custom-filter-dropdown">
                                        <Input
                                            name="documentType"
                                            suffix={filter.documentType ?
                                                <Icon type="close-circle" data-name="name"
                                                      onClick={this.emitEmpty}/> : null}
                                            ref={ele => this.name = ele}
                                            placeholder="Поиск"
                                            value={filter.documentType}
                                            onChange={this.onInputChange}
                                        />
                                    </div>
                                ),
                                filterIcon: <Icon type="filter" style={{color: filter.documentType ? '#ff9800' : '#aaa'}}/>,
                                onFilterDropdownVisibleChange: (visible) => {
                                    this.setState({
                                        filterDropdownVisible: visible,
                                    }, () => this.name.focus());
                                },
                                render: obj => obj && obj.label
                            },

                            {
                                key: 'action',
                                title: '',
                                dataIndex: '',
                                width: '8%',
                                render: (text, record) => {

                                    return (
                                        <div className="editable-row-operations" style={{display: 'flex'}}>
                                            <Popconfirm title={this.props.t('CONFIRM_REMOVE')} onConfirm={() => {
                                                const fd = new FormData();
                                                fd.append("cubeSConst", "CubeForAF_Case");
                                                fd.append("dimObjConst", "dpForCase");
                                                fd.append("objId", record.key.split('_')[1]);
                                                const hideLoading = message.loading(this.props.t('REMOVING'), 30);
                                                dObj(fd)
                                                    .then(res => {
                                                        hideLoading();
                                                        if (res.success) {
                                                            message.success(this.props.t('SUCCESSFULLY_REMOVED'));
                                                            this.setState({
                                                                loading: false,
                                                            })
                                                            this.getCubeCase(this.state.objInv)
                                                        } else {
                                                            throw res
                                                        }
                                                    })
                                                    .then(() => this.setState({loading: false, openCard: false}))
                                                    .catch(err => {
                                                        console.log(err);
                                                        message.error(this.props.t('REMOVING_ERROR'))
                                                    })
                                            }}>
                                                <Button title="Удалить" icon="delete"
                                                        onClick={e => e.stopPropagation()}
                                                        className="green-btn yellow-bg"
                                                        disabled={this.state.selectedRow && this.state.selectedRow.key !== record.key}/>
                                            </Popconfirm>
                                        </div>
                                    );
                                }
                            }

                        ]}
                        openedBy="Cases"
                        scroll={{y: '100%'}}
                        changeSelectedRow={this.changeSelectedRow}
                        loading={this.state.loading}
                        dataSource={this.filteredData}
                        footer={this.renderTableFooter}
                    />
                    <CSSTransition
                        in={this.state.openCard}
                        timeout={300}
                        classNames="right card"
                        unmountOnExit
                    >
                        <SiderCard
                            closer={<Button type='danger' className='right'
                                            onClick={() => this.setState({openCard: false})}
                                            shape="circle" icon="arrow-right"/>}
                        >
                            <CardCase
                            saveProps= {this.saveProps}
                            initialValues={ this.state.selectedRow}
                            invType=""
                            docType=""
                            myValues={this.state.dataIk}
                            onSave={this.refreshRecord}
                            dataInv={this.state.dataInv}
                            ikKey={this.state.ikKey.value}
                            onCreateObj={this.onCreateObj}
                            {...this.props}
                            />
                        </SiderCard>
                    </CSSTransition>
                </div>
                {<Modal
                    visible={this.state.openModal}
                    footer={null}
                    title={t('VIEWER_CASE')}
                    wrapClassName={'full-screen'}
                    onCancel={() => this.setState({openModal: false})}
                >
                    <Viewer key={this.state.viewerList.toString()} t={t} viewerList={this.state.viewerList}/>
                </Modal>}
            </div>
        )
    }

}

function mapStateToProps(state) {
    return {
        CubeForAF_Case: state.cubes["CubeForAF_Case"],
        user: state.auth.user,
        orgSourceCube: state.cubes.orgSourceCube,
        InvItem: state.cubes.InvItem,

        fundFeatureOptions: state.generalData.fundFeature,
        tofiConstants: state.generalData.tofiConstants
    }
}

export default connect(mapStateToProps, {getCube, getPropVal})(StorageUnits)