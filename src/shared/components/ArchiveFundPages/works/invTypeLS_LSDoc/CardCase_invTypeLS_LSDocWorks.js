import React, {Component} from 'react';
import AntTabs from "./../../../AntTabs";
import MainInfoCaseForm from "../../../caseCards/MainInfoCaseForm";
import Damage from "./DamageWorks";

import {getIdGetObj,getCube} from "../../../../actions/actions";
import {
    CUBE_FOR_AF_CASE,
    DO_FOR_CASE, CUBE_FOR_AF_INV,
    DO_FOR_INV, DP_FOR_INV,CUBE_FOR_WORKS,DP_FOR_WORKS,DO_FOR_WORKS,
    DP_FOR_CASE
} from "../../../../constants/tofiConstants";
import connect from "react-redux/es/connect/connect";
import {isEmpty} from "lodash";
import {parseCube_new, parseForTable} from "../../../../utils/cubeParser";
import cubes from "../../../../reducers/cubes";
class CardCase_invTypeLS_LSDoc extends Component {

    state={
        idDimObjCase:'',
        data:{},
        dataInv:[],
        dataWork:[],
        rendercard:false,
        cubeger:false,
        keyInv:"",
        getInclusive:false

    };
    componentDidMount() {
        this.getById()


    }
    componentDidUpdate(prevProps){
        if (prevProps.initialValues !== this.props.initialValues) {
            this.getById()
        }
    }

    getWorks=()=>{
        this.setState({
            cubeger:true
        })
        const filters = {
            filterDOAnd: [
                {
                    dimConst:DO_FOR_WORKS ,
                    concatType: "and",
                    conds: [{
                        ids: String(this.props.stateRecord.key)
                    }
                    ]
                }
            ],
            filterDPAnd: [
                {
                    dimConst: DP_FOR_WORKS,
                    concatType: "and",
                    conds: [
                        {
                            consts: "workRegInv"
                        }
                    ]
                }
            ]

        };
        this.props.getCube(CUBE_FOR_WORKS, JSON.stringify(filters))
            .then((res) => {
                this.parseWork(res.cube)
            })
            .catch(err => {
                console.error(err);
                this.setState({loading: false})
            })

    }
    componentWillUpdate (nextProps) {
        if (isEmpty(this.props.tofiConstants)) return;

        if (this.props.CubeForAF_Case !== nextProps.CubeForAF_Case) {
            const {doForCase, dpForCase} = nextProps.tofiConstants;
            this.setState(
                {

                    data: parseCube_new(
                        nextProps.CubeForAF_Case['cube'],
                        [],
                        'dp',
                        'do',
                        nextProps.CubeForAF_Case[`do_${doForCase.id}`],
                        nextProps.CubeForAF_Case[`dp_${dpForCase.id}`],
                        `do_${doForCase.id}`, `dp_${dpForCase.id}`).map(this.renderTableData)
                },()=>{
                   if (this.state.getInclusive === false){
                       let newArr = [...this.state.data]
                       newArr[0].caseNumber= this.state.data[0].fundNumber
                       this.setState({
                           data:newArr
                       })
                   }
                    this.getByIdInv(this.state.data[0].caseInventory.value)


                }
            );
        }
    }
    getById=()=>{
        this.props.initialValues.key? getIdGetObj(this.props.initialValues.key, 'doForCase')
            .then(res =>{
                this.setState({idDimObjCase:res.data.idDimObj, getInclusive:false});
                this.getCubeAct(res.data.idDimObj)
            }):setTimeout(()=>this.getWorks(),1000)
    }
    getByIdInv=(id)=>{
        getIdGetObj(id, DO_FOR_INV)
            .then(res =>{
                this.getCubeInv(res.data.idDimObj)
                if (this.state.cubeger ===true){
                    this.getCasecube(res.data.idDimObj)
                }
            })
    }

    renderTableData = item => {
        const constArr = ["caseInventory","section","caseWorkProp","bunchCases","fundNumber","fundIndex","caseDbeg","caseDend","caseStructuralSubdivision","caseNotes","documentFile","caseNumberOfPages","structuralSubdivisionList","caseDocsLang","irreparablyDamaged","caseOCD","caseInsurance","caseFundOfUse","caseStorage","rack","shelf","propAuthenticity","fundFeature","caseDateOfDeposit","documentFile","dateForming","linkToKatalog","linkToUkaz","linkToObzor","surnameOriginator","uprDocType","storageUnitType","caseNomenItem","accountingUnitType","numberOfOriginals","compositionOfTextDocumentation","storageUnitQuantity","documentAuthor","addressee","question","terrain","documentDate","dateAccuracy","inaccurateDateFeature","day","month","year","typeOfPaperCarrier","objectCode","projectName","projectStage","projectPartName","volumeNumber","yearOfCompletion","accountingUnitNumber","authorTitle","cameraOperator","artistOfTheWork","dateOfRecording","timingOfVideoRecording","TypeAndFormatOfRecording","numberOfVideoItems","original","copy","shootingDate","shootPlace","movieVariant","formatAndBase","numberOfMovieItems","movieNegative","doubleNegative","phonogramNegative","phonogramMagnetic","intermediatePositive","positive","colorPassports","playingTime","mainContent","genre","eventLocation","firstLine","initialsOfAuthors","initialsOfTranslators","manufactureDate","manufacturePlace","serialNumber","numberOfPhonoItems","gremoriginal","gramplastine","recordPlace","soundingSpeed","magneticTapeType","photoDescription","documentShootAuthor","numberOfPhotoPrints","externalFeatures","productionNumber","numberOfPhotoItems","photoNegative","photoDoubleNegative","photoPositive","photocast","slide","filmStrip","terrain","electronicDocumentsFormat","personLastName","personName","personPatronymic","publicPositionOfPerson","propNationality","documentLanguage","documentPlaybackMethod"]

        const result = {
            key: item.id,
            name: item.name,
            parent: item.parent
        };
        parseForTable(item.props, this.props.tofiConstants, result, constArr);
        return result;
    };
    renderTableDataInv = item => {
        const constArr = ["invType","documentType"]
        const result = {
            key: item.id,

        };
        parseForTable(item.props, this.props.tofiConstants, result, constArr);
        return result;
    };
    renderTableDataWorks = item => {
        const constArr = ["workRegInv"]
        const result = {
            key: item.id,

        };
        parseForTable(item.props, this.props.tofiConstants, result, constArr);
        return result;
    };


    getCasecube=(id)=>{

        this.setState({
            cubeger:false,
            getInclusive:true
        })

        const filters = {
            filterDOAnd: [
                {
                    dimConst: DO_FOR_CASE,
                    concatType: "and",
                    conds: [
                        {
                            //ids: '1007_144376'
                            data: {
                                valueRef: {
                                    id: String(id)
                                }
                            }
                        }
                    ]
                }
            ],
            filterDPAnd: [
                {
                    dimConst: DP_FOR_CASE,
                    concatType: "and",
                    conds: [
                        {
                            consts: "caseInventory,caseWorkProp,bunchCases,section,fundNumber,fundIndex,caseDbeg,caseDend,caseStructuralSubdivision,caseNotes,documentFile,caseNumberOfPages,structuralSubdivisionList,caseDocsLang,irreparablyDamaged,caseOCD,caseInsurance,caseFundOfUse,caseStorage,rack,shelf,propAuthenticity,fundFeature,caseDateOfDeposit,documentFile,dateForming,linkToKatalog,linkToUkaz,linkToObzor,surnameOriginator,uprDocType,storageUnitType,caseNomenItem,accountingUnitType,numberOfOriginals,compositionOfTextDocumentation,storageUnitQuantity,documentAuthor,addressee,question,terrain,documentDate,dateAccuracy,inaccurateDateFeature,day,month,year,typeOfPaperCarrier,objectCode,projectName,projectStage,projectPartName,volumeNumber,yearOfCompletion,accountingUnitNumber,authorTitle,cameraOperator,artistOfTheWork,dateOfRecording,timingOfVideoRecording,TypeAndFormatOfRecording,numberOfVideoItems,original,copy,shootingDate,shootPlace,movieVariant,formatAndBase,numberOfMovieItems,movieNegative,doubleNegative,phonogramNegative,phonogramMagnetic,intermediatePositive,positive,colorPassports,playingTime,mainContent,genre,eventLocation,firstLine,initialsOfAuthors,initialsOfTranslators,manufactureDate,manufacturePlace,serialNumber,numberOfPhonoItems,gremoriginal,gramplastine,recordPlace,soundingSpeed,magneticTapeType,photoDescription,documentShootAuthor,numberOfPhotoPrints,externalFeatures,productionNumber,numberOfPhotoItems,photoNegative,photoDoubleNegative,photoPositive,photocast,slide,filmStrip,terrain,electronicDocumentsFormat,personLastName,personName,personPatronymic,publicPositionOfPerson,propNationality,documentLanguage,documentPlaybackMethod"
                        }
                    ]
                }
            ]

        };
        this.setState({loading: true});
        this.props.getCube(CUBE_FOR_AF_CASE, JSON.stringify(filters))
            .then(() => this.setState({loading: false}))
            .catch(err => {
                console.error(err);
                this.setState({loading: false})
            })
    }

    getCubeAct = (id) => {
        const filters = {
            filterDOAnd: [
                {
                    dimConst: DO_FOR_CASE,
                    concatType: "and",
                    conds: [{
                                ids: String(id)
                    }
                    ]
                }
            ],
            filterDPAnd: [
                {
                    dimConst: DP_FOR_CASE,
                    concatType: "and",
                    conds: [
                        {
                            consts: "caseInventory,bunchCases,section,caseWorkProp,fundNumber,fundIndex,caseDbeg,caseDend,caseStructuralSubdivision,caseNotes,documentFile,caseNumberOfPages,structuralSubdivisionList,caseDocsLang,irreparablyDamaged,caseOCD,caseInsurance,caseFundOfUse,caseStorage,rack,shelf,propAuthenticity,fundFeature,caseDateOfDeposit,documentFile,dateForming,linkToKatalog,linkToUkaz,linkToObzor,surnameOriginator,uprDocType,storageUnitType,caseNomenItem,accountingUnitType,numberOfOriginals,compositionOfTextDocumentation,storageUnitQuantity,documentAuthor,addressee,question,terrain,documentDate,dateAccuracy,inaccurateDateFeature,day,month,year,typeOfPaperCarrier,objectCode,projectName,projectStage,projectPartName,volumeNumber,yearOfCompletion,accountingUnitNumber,authorTitle,cameraOperator,artistOfTheWork,dateOfRecording,timingOfVideoRecording,TypeAndFormatOfRecording,numberOfVideoItems,original,copy,shootingDate,shootPlace,movieVariant,formatAndBase,numberOfMovieItems,movieNegative,doubleNegative,phonogramNegative,phonogramMagnetic,intermediatePositive,positive,colorPassports,playingTime,mainContent,genre,eventLocation,firstLine,initialsOfAuthors,initialsOfTranslators,manufactureDate,manufacturePlace,serialNumber,numberOfPhonoItems,gremoriginal,gramplastine,recordPlace,soundingSpeed,magneticTapeType,photoDescription,documentShootAuthor,numberOfPhotoPrints,externalFeatures,productionNumber,numberOfPhotoItems,photoNegative,photoDoubleNegative,photoPositive,photocast,slide,filmStrip,terrain,electronicDocumentsFormat,personLastName,personName,personPatronymic,publicPositionOfPerson,propNationality,documentLanguage,documentPlaybackMethod"
                        }
                    ]
                }
            ]

        };
        this.props.getCube(CUBE_FOR_AF_CASE, JSON.stringify(filters))
            .then(() => this.setState({loading: false}))
            .catch(err => {
                console.error(err);
                this.setState({loading: false})

            })
    }
    getCubeInv = (id) => {
        const filters = {
            filterDOAnd: [
                {
                    dimConst:DO_FOR_INV ,
                    concatType: "and",
                    conds: [{
                        ids: String(id)
                    }
                    ]
                }
            ],
            filterDPAnd: [
                {
                    dimConst: DP_FOR_INV,
                    concatType: "and",
                    conds: [
                        {
                            consts: "invType,documentType"
                        }
                    ]
                }
            ]

        };
        this.props.getCube(CUBE_FOR_AF_INV, JSON.stringify(filters))
            .then((res) => {
            this.parseInv(res.cube)
        })
            .catch(err => {
                console.error(err);
                this.setState({loading: false})
            })
    }


    parseInv=(cube)=>{
        const {doForInv, dpForInv} = this.props.tofiConstants;
        this.setState(
            {

                dataInv: parseCube_new(
                    cube['cube'],
                    [],
                    'dp',
                    'do',
                    cube[`do_${doForInv.id}`],
                    cube[`dp_${dpForInv.id}`],
                    `do_${doForInv.id}`, `dp_${dpForInv.id}`).map(this.renderTableDataInv)
            },()=>{
                this.setState({
                    rendercard:true
                })
            }
        );
    }
    parseWork=(cube)=>{
        const {doForWorks, dpForWorks} = this.props.tofiConstants;
        this.setState(
            {

                dataWork: parseCube_new(
                    cube['cube'],
                    [],
                    'dp',
                    'do',
                    cube[`do_${doForWorks.id}`],
                    cube[`dp_${dpForWorks.id}`],
                    `do_${doForWorks.id}`, `dp_${dpForWorks.id}`).map(this.renderTableDataWorks)
            },()=>{

                this.setState({
                    keyInv:this.state.dataWork[0].workRegInv.value
                })
                this.getByIdInv(this.state.dataWork[0].workRegInv.value)


            }
        );
    }


    render() {

        const {t, tofiConstants, saveProps, initialValues, onCreateObj, keyInv, stateRecord, invType, docType} = this.props;
        return(
        <div style={{overflowY:"auto"}}>
            {
                this.state.rendercard===true?<AntTabs
                    tabs={[
                        {
                            tabKey: 'mainInfo',
                            tabName: t('MAIN_INFO'),
                            tabContent: <MainInfoCaseForm
                                idDimObjCase={this.state.idDimObjCase}
                                tofiConstants={tofiConstants}
                                saveProps={saveProps}
                                t={t}
                                invType={this.state.dataInv[0].invType.value}
                                docType={ this.state.dataInv[0].documentType.value}
                                keyWork={this.props.stateRecord&& String(this.props.stateRecord.key)}
                                onCreateObj={onCreateObj}
                                keyInv={this.state.keyInv}
                                initialValues={this.state.getInclusive === false? this.state.data[0]:{sd:"t"} }
                            />
                        },
                        {
                            tabKey: 'damage',
                            tabName: 'Повреждения',
                            tabContent: <Damage
                                idDimObjCase={this.state.idDimObjCase}
                                tofiConstants={tofiConstants}
                                initialValues={initialValues}
                                stateRecord={stateRecord}
                            />
                        }
                    ]}
                />:""
            }


            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        CubeForAF_Case: state.cubes[CUBE_FOR_AF_CASE],
        CubeForAF_Inv: state.cubes[CUBE_FOR_AF_INV],


    }
}

export default connect(mapStateToProps, {getCube})(CardCase_invTypeLS_LSDoc)
