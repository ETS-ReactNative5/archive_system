import React from 'react';
import moment from 'moment';
import AntTabs from '../../AntTabs';
import MainInfoFundMaker from './MainInfoFundMaker';
import ManagingFormFundMaker from './ManagingFormFundMaker';
import FundMakerContent from './FundMakerContent';
//import {getObjVer_new} from '../../../actions/actions';
import {parseCube_new, parseForTable} from '../../../utils/cubeParser.js';
import Chat_FundMaker from "./Chat_FundMaker";
import Viewer from "../../Viewer";
import RenameFormFoundMaker from "./RenameFormFoundMaker";
import ReorganizationFounMaker from "./ReorganizationFounMaker";
import LiquidationFoundMaker from "./LiquidationFoundMaker";
import {getValueOfMultiText} from "../../../actions/actions";



class SiderCard_FundMaker extends React.PureComponent {

  state = {
    fundMakerVer: null,
    data: {},
    initialValues: this.props.initialValues,
      mewinitialValues:"",
      reorInitialValues:"",
  };

  /*
   handleTabChange = key => {
   switch (key) {
   case 'versions':
   if(this.props.initialValues.key)
   getObjVer_new(this.props.initialValues.key.split('_')[1])
   .then(res => {
   if(res.success) {
   this.setState({ fundMakerVer: res.data })
   }
   });
   break;
   default: break;
   }
   };
   */


 async componentDidMount() {
    if (this.props.initialValues.key) {

      this.props.loadOrgFundmaker(this.props.initialValues.key)
    } else {
      return;
    }
    // if (this.props.cubeForOrgFundmakerSingle !== undefined) {
    //   const {doForOrgFundmakers, dpForOrgFundmakers} = this.props.tofiConstants;
    //   const data = parseCube_new(this.props.cubeForOrgFundmakerSingle['cube'],
    //     [],
    //     'dp',
    //     'do',
    //     this.props.cubeForOrgFundmakerSingle[`do_${doForOrgFundmakers.id}`],
    //     this.props.cubeForOrgFundmakerSingle[`dp_${dpForOrgFundmakers.id}`],
    //     `do_${doForOrgFundmakers.id}`,
    //     `dp_${dpForOrgFundmakers.id}`).map( this.renderTableData)[0];
    //
    //     this.setState(
    //         {
    //             loading: false,
    //             data: data,
    //             initialValues: data
    //         }
    //     );
    //
    //     if (!!data){
    //     await getValueOfMultiText(String(data.key.split('_')[1]), 'orgFunctionFundmaker').then(
    //         res => {
    //             if (!!res.data[0]){
    //                 let orgF = res.data[0]
    //                 orgF.value={
    //                     ru: res.data[0].valueMultiStr.ru,
    //                     kz: res.data[0].valueMultiStr.kz,
    //                     en: res.data[0].valueMultiStr.en,
    //                 }
    //                 orgF.valueLng={
    //                     ru: res.data[0].valueMultiStr.ru,
    //                     kz: res.data[0].valueMultiStr.kz,
    //                     en: res.data[0].valueMultiStr.en,
    //                 }
    //                 let newInitialValues = data
    //                 newInitialValues.orgFunctionFundmaker = orgF
    //                 this.setState({
    //                     initialValues: newInitialValues
    //                 })
    //             }
    //         }
    //     )
    //     }
    // }

  }


   async componentDidUpdate(prevProps) {
       if (prevProps.cubeForOrgFundmakerSingle !== this.props.cubeForOrgFundmakerSingle) {
           const {doForOrgFundmakers, dpForOrgFundmakers} = this.props.tofiConstants;
           const data = parseCube_new(this.props.cubeForOrgFundmakerSingle['cube'],
               [],
               'dp',
               'do',
               this.props.cubeForOrgFundmakerSingle[`do_${doForOrgFundmakers.id}`],
               this.props.cubeForOrgFundmakerSingle[`dp_${dpForOrgFundmakers.id}`],
               `do_${doForOrgFundmakers.id}`,
               `dp_${dpForOrgFundmakers.id}`).map(this.renderTableData)[0];
               if (!!this.props.initialValues.key){
                   await getValueOfMultiText(String(this.props.initialValues.key.split('_')[1]), 'orgFunctionFundmaker').then(
                       res => {
                           if (!!res.data[0]) {
                               let orgF = res.data[0]
                               orgF.value = {
                                   ru: res.data[0].valueMultiStr.ru,
                                   kz: res.data[0].valueMultiStr.kz,
                                   en: res.data[0].valueMultiStr.en,
                               }
                               orgF.valueLng = {
                                   ru: res.data[0].valueMultiStr.ru,
                                   kz: res.data[0].valueMultiStr.kz,
                                   en: res.data[0].valueMultiStr.en,
                               }

                               data.orgFunctionFundmaker = orgF

                           }
                       }
                   )

                   await getValueOfMultiText(String(this.props.initialValues.key.split('_')[1]), 'structureFundmaker').then(
                       res => {

                           if (!!res.data[0]) {
                               let orgF = res.data[0]
                               orgF.value = {
                                   ru: res.data[0].valueMultiStr.ru,
                                   kz: res.data[0].valueMultiStr.kz,
                                   en: res.data[0].valueMultiStr.en,
                               }
                               orgF.valueLng = {
                                   ru: res.data[0].valueMultiStr.ru,
                                   kz: res.data[0].valueMultiStr.kz,
                                   en: res.data[0].valueMultiStr.en,
                               }

                               data.structureFundmaker = orgF

                           }
                       }
                   )
               }


           this.setState(
               {
                   loading: false,
                   data: data,
                   initialValues: data
               }
           );
       }
       if (this.props.initialValues.key && this.props.initialValues.key !== prevProps.initialValues.key) {
           return this.props.loadOrgFundmaker(this.props.initialValues.key);
       }


   }
  renderTableData = (item) => {
    const constArr = ['fundNumber',"dateRename","dateElimination","dateFormation","dateReorganization","orgRightReceiver","reasonFundmaker","reasonFundmakerFile","conditionOfFundmaker", 'contractNumber', 'legalStatus', 'formOfAdmission', 'orgDocType', 'orgIndustry', 'isActive', 'fundmakerArchive',
      'orgFunction', 'structure', 'orgAddress',"departmentalAccessory","liquidation", 'orgPhone', 'orgFax', 'orgEmail', 'orgFormationDoc', 'orgReorganizationDoc', 'orgLiquidationDoc',
      'leaderFIO', 'leaderPosition', 'leaderPhone', 'depLeaderFIO', 'depLeaderPosition', 'depLeaderPhone', 'responsibleFIO', 'responsiblePosition',
      'responsiblePhone', 'responsibleAppointmentDate', 'archiveLeaderFIO', 'archiveLeaderPosition', 'archiveLeaderPhone', 'archiveLeaderAppointmentDate',
      'commissionLeaderFIO', 'commissionLeaderPosition', 'commissionLeaderPhone','corresOrg','corresOrgFile','letterDetails'];

    const accessLevelObj = this.props.accessLevelOptions.find(al => al.id == item.accessLevel);
    const result = {
      key: item.id,
      shortName: item.name,
      name: item.fullName,
      dbeg: moment(item.dbeg, 'YYYY-MM-DD'),
      dend: moment(item.dend, 'YYYY-MM-DD'),
      accessLevel: {value: item.accessLevel, label: accessLevelObj.name[this.lng]}
    };
    parseForTable(item.props, this.props.tofiConstants, result, constArr);
    return result

  };
    resetinitialValues=(initialValues)=>{
        this.setState({
            mewinitialValues:initialValues
        })
    }
    resetinitialValues2=(initialValues)=>{
        this.setState({
            reorInitialValues:initialValues
        })
    }
  render() {
    this.lng = localStorage.getItem('i18nextLng');
    const {t, tofiConstants, saveProps,saveProps3, saveIKProps,saveIKProps3, onCreateObj} = this.props;
    const {initialValues} = this.state;
    return (
      <div >
        {this.props.closer}
        <AntTabs
          tabs={[
            {
              tabKey: 'props',
              tabName: t('MAIN_INFO'),
              tabContent: <MainInfoFundMaker
                tofiConstants={tofiConstants}
                t={t}
                saveProps={saveProps}
                saveIKProps={saveIKProps}
                onCreateObj={onCreateObj}
                initialValues={!!initialValues && initialValues}
              />
            },
              {
                  tabKey: 'Rename',
                  disabled: initialValues && !initialValues.key,
                  tabName: t('RENAME'),
                  tabContent: <RenameFormFoundMaker
                      tofiConstants={tofiConstants}
                      t={t}
                      saveProps={saveProps}
                      saveProps3={saveProps3}
                      dataPrev={initialValues}
                      resetinitialValues={this.resetinitialValues}
                      initialValues={this.state.mewinitialValues !==""?this.state.mewinitialValues:{
                          key:initialValues.key,
                          reasonFundmakerOld:initialValues.reasonFundmaker,
                          reasonFundmakerFileOld:initialValues.reasonFundmakerFile,
                      }}/>
              },
              {
                  tabKey: 'Reorganization',
                  disabled: initialValues && !initialValues.key,
                  tabName: t('REORGANIZATION'),
                  tabContent: <ReorganizationFounMaker
                      tofiConstants={tofiConstants}
                      t={t}
                      saveProps={saveProps}
                      saveProps3={saveProps3}
                      saveIKProps={saveIKProps3}

                      dataPrev={initialValues}
                      resetinitialValues2={this.resetinitialValues2}
                      initialValues={this.state.reorInitialValues !==""?this.state.reorInitialValues: {
                          key: initialValues.key,
                          name: initialValues.shortName && initialValues.shortName,
                          fullName: initialValues.name && initialValues.name,
                          orgRightReceiverOld:initialValues.orgRightReceiver,
                          reasonFundmakerOld:initialValues.reasonFundmaker,
                          reasonFundmakerFileOld:initialValues.reasonFundmakerFile,
                          orgIndustryOld:initialValues.orgIndustry,
                          legalStatusOld:initialValues.legalStatus,
                          structureFundmakerOld:initialValues.structureFundmaker,
                          structureOld:initialValues.structure,
                          orgFunctionOld:initialValues.orgFunction,
                          departmentalAccessoryOld:initialValues.departmentalAccessory,
                          dorgFunctionFundmakerOld:initialValues.orgFunctionFundmaker,

                      }}/>
              },
          {
              tabKey: 'Liquidation',
              disabled: initialValues && !initialValues.key,
              tabName: t('LIQUIDATION'),
              tabContent: <LiquidationFoundMaker
              tofiConstants={tofiConstants}
              t={t}
              saveProps={saveProps3}
              initialValues={initialValues}/>
          },
            {/*
              tabKey: 'Description',
              disabled: initialValues && !initialValues.key,
              tabName: t('MANAGING'),
              tabContent: <ManagingFormFundMaker
                tofiConstants={tofiConstants}
                saveProps={saveProps}
                t={t}
                initialValues={initialValues}/>
            },
            {
              tabKey: 'versions',
              disabled: initialValues && !initialValues.key,
              tabName: t('VERSIONS'),
              tabContent: <FundMakerContent
                tofiConstants={tofiConstants}
                t={t}
                id={initialValues && initialValues.key}/>
            */}
          ]}
          //onChange={this.handleTabChange}
        />
      </div>
    )
  }
}

export default SiderCard_FundMaker;
