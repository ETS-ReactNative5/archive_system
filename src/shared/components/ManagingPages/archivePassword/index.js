import React from 'react';
import connect from "react-redux/es/connect/connect";
import {createObj, getAllObjOfCls, getCube, updateCubeData, getObjByProp, getFundCountData, getPropVal, dObj} from "../../../actions/actions";
import {getPropMeta, parseCube_new, onSaveCubeData} from '../../../utils/cubeParser';
import {message} from 'antd';

import {isEmpty, isEqual, groupBy, map} from 'lodash';
import SelectVirt from "../../SelectVirt";

import AntTabs from '../../AntTabs';
import Passport0 from './Passport0';
import Passport1 from './Passport1';
import Passport2 from './Passport2';
import Passport3 from './Passport3';
import Passport4 from './Passport4';
import Passport5 from './Passport5';
import Passport6 from './Passport6';
import moment from 'moment';
import { FUND_MAKER_ARCHIVE } from '../../../constants/tofiConstants';

class DocsInfoPage extends React.Component {

  state = {
    tableData: [],
    loading: false,
    countData: {
      countFund: 0,
      countInv: 0,
      countDelo: 0,
      countDeloFile: 0
    },
    filter: {
      fundmakerArchive: {},
      period: { value: String(moment().format('YYYY')), label: String(moment().format('YYYY')) },
    },
    filterLoading: {},
    waiting: {
      funds: false,
      inventories: false,
    },
    buffer: {
      funds: [],
      inventories: [],
    },
    archivesList: [],
  };
  
  onChangeFundmakerArchive = (item) => {
    const { filter } = this.state;
    this.setState({
      filter: { ...filter, fundmakerArchive: item },
      tableData: [],
    }, () => this.getRegistry())
  };
  onChangePeriod = (item) => {
    const { filter } = this.state;
    this.setState({
      filter: { ...filter, period: item },
      tableData: [],
    }, () => this.getRegistry())
  };
  
  loadOptionsProp = c => {
    return () => {
      if(!this.props[c + 'Options']) {
        this.setState({filterLoading: { ...this.state.filterLoading ,[c]: true }});
        this.props.getPropVal(c)
          .then(() => this.setState({filterLoading: { ...this.state.filterLoading ,[c]: false }}))
      }
    }
  };

  componentDidMount() {
    this.getArchives();
  };
  
  componentWillReceiveProps(nextProps) {
    
    if (!isEmpty(this.props.cubeArchivePassport) && this.state.archivesList.length === 0) {
      const { doCubeArchive, dpCubeArchive } = this.props.tofiConstants;
      const parseCubeData = parseCube_new(
        this.props.cubeArchivePassport['cube'],
          [],
          'dp',
          'do',
          this.props.cubeArchivePassport[`do_${doCubeArchive.id}`],
          this.props.cubeArchivePassport[`dp_${dpCubeArchive.id}`],
          `do_${doCubeArchive.id}`,
          `dp_${dpCubeArchive.id}`).map(this.renderArchivesData);
    
    this.setState({ archivesList: parseCubeData });
  }
    if(!isEmpty(nextProps.CubeForAF_InvPassport) 
      && !isEmpty(nextProps.tofiConstants) 
      && !isEqual(this.props.CubeForAF_InvPassport, nextProps.CubeForAF_InvPassport)) {
      
      const { doForInv, dpForInv } = nextProps.tofiConstants;
      const parseCubeData = parseCube_new(
        nextProps.CubeForAF_InvPassport['cube'],
          [],
          'dp',
          'do',
          nextProps.CubeForAF_InvPassport[`do_${doForInv.id}`],
          nextProps.CubeForAF_InvPassport[`dp_${dpForInv.id}`],
          `do_${doForInv.id}`,
          `dp_${dpForInv.id}`).map(this.renderInventoriesData);
      
      this.setState({
        buffer: {...this.state.buffer, inventories: parseCubeData}
      }, () => { this.setState(this.compileTable()) });
  
    } else if(!isEmpty(nextProps.cubeForFundAndIKPassport) 
      && !isEmpty(nextProps.tofiConstants) 
      && !isEqual(this.props.cubeForFundAndIKPassport, nextProps.cubeForFundAndIKPassport)) {
        
        const { doForFundAndIK, dpForFundAndIK } = nextProps.tofiConstants;
        const parseCubeData = parseCube_new(
          nextProps.cubeForFundAndIKPassport['cube'],
            [],
            'dp',
            'do',
            nextProps.cubeForFundAndIKPassport[`do_${doForFundAndIK.id}`],
            nextProps.cubeForFundAndIKPassport[`dp_${dpForFundAndIK.id}`],
            `do_${doForFundAndIK.id}`,
            `dp_${dpForFundAndIK.id}`).map(this.renderFundsData);
      //console.log(parseCubeData)
      this.setState({
        buffer: {...this.state.archivesList, funds: parseCubeData}
      }, () => { 
        // this.setState(this.compileTable()) 
      });
        
    } else if(!isEmpty(nextProps.cubeArchivePassport) 
      && !isEmpty(nextProps.tofiConstants) 
      && !isEqual(this.props.cubeArchivePassport, nextProps.cubeArchivePassport)) {
        
        const { doCubeArchive, dpCubeArchive } = nextProps.tofiConstants;
        const parseCubeData = parseCube_new(
          nextProps.cubeArchivePassport['cube'],
            [],
            'dp',
            'do',
            nextProps.cubeArchivePassport[`do_${doCubeArchive.id}`],
            nextProps.cubeArchivePassport[`dp_${dpCubeArchive.id}`],
            `do_${doCubeArchive.id}`,
            `dp_${dpCubeArchive.id}`).map(this.renderArchivesData);
      
      this.setState({ archivesList: parseCubeData });
        
    } else if(nextProps.CubeForAF_InvPassport && typeof nextProps.CubeForAF_InvPassport === 'object') {
      this.setState({
        loading: false
      })
    }
  };

  compileTable() {
    if (this.state.buffer.funds.length === 0 || this.state.buffer.inventories.length === 0) {
      return {tableData: []}
    };
    
    const result = [];
    const bufferFunds = this.state.buffer.funds;
    const bufferInventories = this.state.buffer.inventories;
    const invsGroupByFund = groupBy(bufferInventories, (item) => item.invFund.id);
    const arr1 = {
      '1002': 'uprDoc',
      '1003': 'lpDoc',
      '1004': 'uprNTD',
      '1005': 'LSDoc',
      '1006': 'movieDoc',
      '1007': 'photoDoc',
      '1008': 'phonoDoc',
      '1009': 'videoDoc',
      '1010': 'macReadDoc',
    }
    let idx = 0;
    bufferFunds.forEach((fundItem) => {
      idx +=1;
      const newRec = {
        index: idx,
        key: idx,
        fundName: fundItem.name,
        fundId: fundItem.id,
        total: 0,
        '1002': 0,
        '1003': 0,
        '1004': 0,
        '1005': 0,
        '1006': 0,
        '1007': 0,
        '1008': 0,
        '1009': 0,
        '1010': 0,
      }
      for (let key in invsGroupByFund) {
        if (key !== fundItem.key) continue;
        const item = invsGroupByFund[key];
        for (let i=0; i<item.length; i++) {
          newRec[item[0].documentType.refId] +=1;
          newRec.total +=1;
        }
        break;
      }
      result.push(newRec);
    });
    for (let i=0; i<result.length; i++) {
      let maxValue = -1;
      let maxCode = '0000';
      for (let j=1002; j<1011; j++) {
        if (result[i][j] > maxValue) {
          maxValue = result[i][String(j)];
          maxCode = String(j);
        }
      }

      const max = {
        value: this.props.tofiConstants[arr1[String(maxCode)]].id, 
        label: this.props.tofiConstants[arr1[String(maxCode)]].name[this.lng]
      };
      result[i].numberFundDocInit = result[i].numberFundDoc ? JSON.parse(JSON.stringify(result[i].numberFundDoc)) : undefined;
      if (result[i].numberFundDocInit !== undefined) {
        if (!isEqual(result[i].numberFundDocInit, max)) {
          result[i].different = true;
          //result[i].color = "#009688";
        }
      } else {
        //result[i].numberFundDoc = max;
        result[i].changed = true;
        //result[i].color = "#009688"
      }
    }
    //console.log(result[0])
    return {tableData: result, loading: false}

  };

  getRegistry() {
    this.setState({ 
      loading: true,
      waiting: {fund: true, inventories: true} 
    });
    this.getFunds();
    this.getInventories();
    getFundCountData()
      .then(data => {
        this.setState({countData: {...data}})
      })
  };

  getArchives() {
    const dte = moment().format('YYYY') + '0101' + moment().format('YYYY') + '1231';
    const options = {
      customKey: 'cubeArchivePassport'
    };
    this.filters = {
      filterDPAnd: [
        {
          dimConst: 'dpCubeArchive',
          concatType: "and",
          conds: [
            {
              consts: 'booksBrochures,newspapers,journal,typePrintedProducts,archiveBuildings,specialRooms,fittedRooms,archivalUtilRate,buildSecAlarm,fireBuildEquipment,lengthMetalShelving,lengthWoodenShelving,outlinedDocuments',
            }
          ]
        }
      ],
      // filterDOAnd: [
      //   {
      //     dimConst: 'doForFundAndIK',
      //     concatType: 'and',
      //     conds: [
      //       {
      //         clss: 'fundOrg,fundLP,collectionOrg,collectionLP,jointOrg,jointLP'
      //       }
      //     ]
      //   }
      // ],
      filterDTOr: [
        {
          dimConst: 'dtCubeArchive',
          concatType: 'and',
          conds: [
            {
              ids: dte
            }
          ]
        }
      ]
    };
    this.props.getCube('cubeArchive', JSON.stringify(this.filters), options);
 
  };

  getFunds() {
    const dte = this.state.filter.period.value + '0101' + this.state.filter.period.value + '1231';
    const options = {
      customKey: 'cubeForFundAndIKPassport'
    };
    this.filters = {
      filterDPAnd: [
        {
          dimConst: 'dpForFundAndIK',
          concatType: "and",
          conds: [
            {
              consts: 'fundNumber,fundIndex,numberFundDoc',
            }
          ]
        }
      ],
      filterDOAnd: [
        {
          dimConst: 'doForFundAndIK',
          concatType: 'and',
          conds: [
            {
              clss: 'fundOrg,fundLP,collectionOrg,collectionLP,jointOrg,jointLP',
            },
            {
              data: {
                valueRef: {
                  id: String(this.state.filter.fundmakerArchive.item.id),
                }
              }
            }
          ]
        }
      ],
      filterDTOr: [
        {
          dimConst: 'dtForFundAndIK',
          concatType: 'and',
          conds: [
            {
              ids: dte
            }
          ]
        }
      ]
    };
    this.props.getCube('cubeForFundAndIK', JSON.stringify(this.filters), options);
 
  };

  getInventories() {
    //const dte = this.state.filter.period.value + '0101' + this.state.filter.period.value + '1231';
    const options = {
      customKey: 'CubeForAF_InvPassport'
    };
    this.filters = {
      filterDOAnd: [
        {
          dimConst: 'doForInv',
          concatType: "and",
          conds: [
            {
              // data: {
                // valueRef: {
                  // id: String(this.state.filter.fundmakerArchive.item.id),
                // }
              // }
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
              consts: "invFund,documentType"
            }
          ]
        },
      ],
      // filterDTOr: [
      //   {
      //     dimConst: 'dtForInv',
      //     concatType: 'and',
      //     conds: [
      //       {
      //         ids: dte,
      //       }
      //     ]
      //   }
      // ]
    };
    this.props.getCube('CubeForAF_Inv', JSON.stringify(this.filters), options);
  };

  renderArchivesData = (item,idx) => {
    const { booksBrochures, newspapers, journal, typePrintedProducts, 
            archiveBuildings, specialRooms, fittedRooms, archivalUtilRate, 
              buildSecAlarm, fireBuildEquipment, lengthMetalShelving, lengthWoodenShelving, outlinedDocuments } = this.props.tofiConstants;
    
    const booksBrochuresObj = item.props.find(element => element.prop === booksBrochures.id);
    const newspapersObj = item.props.find(element => element.prop === newspapers.id);
    const journalObj = item.props.find(element => element.prop === journal.id);
    const typePrintedProductsObj = item.props.find(element => element.prop === typePrintedProducts.id);
    const archiveBuildingsObj = item.props.find(element => element.prop === archiveBuildings.id);
    const specialRoomsObj = item.props.find(element => element.prop === specialRooms.id);
    const fittedRoomsObj = item.props.find(element => element.prop === fittedRooms.id);
    const archivalUtilRateObj = item.props.find(element => element.prop === archivalUtilRate.id);
    const buildSecAlarmObj = item.props.find(element => element.prop === buildSecAlarm.id);
    const fireBuildEquipmentObj = item.props.find(element => element.prop === fireBuildEquipment.id);
    const lengthMetalShelvingObj = item.props.find(element => element.prop === lengthMetalShelving.id);
    const lengthWoodenShelvingObj = item.props.find(element => element.prop === lengthWoodenShelving.id);
    const outlinedDocumentsObj = item.props.find(element => element.prop === outlinedDocuments.id);
    
    // console.log(item);
    
    // console.log(booksBrochuresObj, newspapersObj, journalObj, typePrintedProductsObj, 
    //             archiveBuildingsObj, specialRoomsObj, fittedRoomsObj, archivalUtilRateObj, 
    //               buildSecAlarmObj, fireBuildEquipmentObj, lengthMetalShelvingObj, lengthWoodenShelvingObj, outlinedDocumentsObj);
    
    return {
      key: item.id.split('_')[1],
      id: item.id,
      name: item.name,
      //
      booksBrochures: !!booksBrochuresObj && booksBrochuresObj.value  ? booksBrochuresObj.value : 0,
      newspapers: !!newspapersObj && newspapersObj.value  ? newspapersObj.value : 0,
      journal: !!journalObj && journalObj.value  ? journalObj.value : 0,
      typePrintedProducts: !!typePrintedProductsObj && typePrintedProductsObj.value  ? typePrintedProductsObj.value : 0,
      archiveBuildings: !!archiveBuildingsObj && archiveBuildingsObj.value  ? archiveBuildingsObj.value : 0,
      specialRooms: !!specialRoomsObj && specialRoomsObj.value  ? specialRoomsObj.value : 0,
      fittedRooms: !!fittedRoomsObj && fittedRoomsObj.value  ? fittedRoomsObj.value : 0,
      archivalUtilRate: !!archivalUtilRateObj && archivalUtilRateObj.value  ? archivalUtilRateObj.value : 0,
      buildSecAlarm: !!buildSecAlarmObj && buildSecAlarmObj.value  ? buildSecAlarmObj.value : 0,
      fireBuildEquipment: !!fireBuildEquipmentObj && fireBuildEquipmentObj.value  ? fireBuildEquipmentObj.value : 0,
      lengthMetalShelving: !!lengthMetalShelvingObj && lengthMetalShelvingObj.value  ? lengthMetalShelvingObj.value : 0,
      lengthWoodenShelving: !!lengthWoodenShelvingObj && lengthWoodenShelvingObj.value  ? lengthWoodenShelvingObj.value : 0,
      outlinedDocuments: !!outlinedDocumentsObj && outlinedDocumentsObj.value  ? outlinedDocumentsObj.value : 0,
      //
    };
  };
  
  renderFundsData = (item,idx) => {
    const { fundNumber, fundIndex, numberFundDoc } = this.props.tofiConstants;
    
    const fundNumberObj = item.props.find(element => element.prop === fundNumber.id);
    const fundIndexObj = item.props.find(element => element.prop === fundIndex.id);
    const numberFundDocObj = item.props.find(element => element.prop === numberFundDoc.id);
    
    return {
      key: item.id.split('_')[1],
      id: item.id,
      name: item.name,
      //
      fundNumber: !!fundNumberObj && fundNumberObj.value  ? fundNumberObj.value : '',
      fundIndex:  !!fundIndexObj  && fundIndexObj.value   ? fundIndexObj.value : '',
      numberFundDoc:  !!numberFundDocObj  && numberFundDocObj.refId ? {value: numberFundDocObj.refId, label: numberFundDocObj.value} : undefined,
      //
    };
  };

  renderInventoriesData = (item,idx) => {
    const { invFund, documentType } = this.props.tofiConstants;
    
    const invFundObj = item.props.find(element => element.prop === invFund.id);
    const documentTypeObj = item.props.find(element => element.prop === documentType.id);
    
    return {
      key: item.id,
      //
      invFund: !!invFundObj && invFundObj.value ? {value: invFundObj.value, id: invFundObj.cube.idRef} : {},
      documentType: !!documentTypeObj && documentTypeObj.value ? {value: documentTypeObj.value, refId: documentTypeObj.refId} : {},
      //
    };
  }

  onChangeNumberFundDoc = (value, fundId) => {
    const dte = this.state.filter.period.value + '0101' + this.state.filter.period.value + '1231';
    const cube = {
      cubeSConst: 'cubeForFundAndIK',
      doConst:    'doForFundAndIK',
      dpConst:    'dpForFundAndIK',
    };
    return this.onSaveCubeData2({cube}, 'Passport', { numberFundDoc: String(value.value) }, fundId, {}, {})
  };

  onSaveArchiveInfo = (archiveId, values) => {
    const dte = this.state.filter.period.value + '0101' + this.state.filter.period.value + '1231';
    const cube = {
      cubeSConst: 'cubeArchive',
      doConst:    'doCubeArchive',
      dpConst:    'dpCubeArchive',
    };
    const {archivesList} = this.state;
    this.setState({
      archivesList: archivesList.map((record) => {
        if (record.id === archiveId) {
          return {...record, ...values}
        };
        return record;
      })
    });
    return this.onSaveCubeData2({cube}, 'Passport', values, archiveId, {}, {})
  };

  onSaveCubeData2 = (objVerData, prefix, {method, protocol, ...values}, doItemProp, objDataProp, valOld) => {
    let datas = [];
    this.setState({loading:true})
    try {
      datas = [{
        own: [{doConst: objVerData.cube.doConst, doItem: doItemProp, isRel: "0", objData: objDataProp }],
        props: map(values, (val, key) => {
          console.log(values, val, key)
          const propMetaData = getPropMeta(this.props[objVerData.cube.cubeSConst + prefix]["dp_" + this.props.tofiConstants[objVerData.cube.dpConst].id], this.props.tofiConstants[key]);
          console.log(val, valOld, valOld[key], key);
          let value = val;
          let oldValue = valOld[key];
          if((propMetaData.typeProp === 315 || propMetaData.typeProp === 311 || propMetaData.typeProp === 317) && typeof val === 'string'){
            value = {kz: val, ru: val, en: val};
            oldValue = oldValue && {kz: valOld[key], ru: valOld[key], en: valOld[key]};
          }
          if(propMetaData.typeProp === 312 && typeof value === 'string') {
            value = value.split('-').reverse().join('-');
            oldValue = oldValue && oldValue.split('-').reverse().join('-');
          }
          if(val && typeof val === 'object' && val.value) {
            value = String(val.value);
            oldValue = oldValue && String(valOld[key].value);
          }
          if(val && typeof val === 'object' && val.mode) propMetaData.mode = val.mode;
          if(propMetaData.isUniq === 2 && val[0] && val[0].value) {
            propMetaData.mode = val[0].mode;
            value = val.map(v => String(v.value)).join(",");
            oldValue = oldValue && valOld[key].map(v => String(v.value)).join(",");
          }
          return {propConst: key, val: value, oldValue, typeProp: String(propMetaData.typeProp), periodDepend: String(propMetaData.periodDepend), isUniq: String(propMetaData.isUniq), mode: propMetaData.mode }
        }),
        periods: [{ periodType: '11', dbeg: this.state.filter.period.value + '-01-01', dend: this.state.filter.period.value + '-12-31' }]
      }];
    } catch(err) {
      console.error(err);
      return err;
    }
    const hideLoading = message.loading(this.props.t('UPDATING_PROPS'), 0);
    return updateCubeData(objVerData.cube.cubeSConst, moment().format('YYYY-MM-DD'), JSON.stringify(datas), {}, {method, protocol})
      .then(res => {
        hideLoading();
        if(res.success) {
          message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'));
          if(this.filters) {
            this.setState({loading: true});
            //const dte = this.state.registryPeriod.format('YYYY-MM-DD');
            //const dte = this.state.filter.period.value + '0101' + this.state.filter.period.value + '1231';
            return this.props.getCube(objVerData.cube.cubeSConst, JSON.stringify(this.filters), {})
              .then(() => {
                this.setState({loading: false, openCard: false, flagSave: false});
                return {success: true}
              })
          } else {
            return {success: true}
          }
        } else {
          message.error(this.props.t('PROPS_UPDATING_ERROR'));
          if(res.errors) {
            res.errors.forEach(err => {
              message.error(err.text);
            });
            return {success: false}
          }
        }
      })
  };

  // saveProps = async (c, v, t, objData) => {
  //   let hideLoading;
  //   try {
  //     c.cube.data = this.props.cubeForOrgFundmaker;
  //     hideLoading = message.loading(this.props.t('UPDATING_PROPS'), 0);
  //     const resSaveFM = await onSaveCubeData(c, v, t, objData);
  //     hideLoading();
  //     if(!resSaveFM.success) {
  //       message.error(this.props.t('PROPS_UPDATING_ERROR'));
  //       resSaveFM.errors.forEach(err => {
  //         message.error(err.text)
  //       });
  //       return Promise.reject(resSaveFM);
  //     }
  //     message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'));
  //     this.setState({loading: true, openCard: false});
  //     await this.props.getCube(CUBE_FOR_ORG_FUNDMAKER);
  //     this.setState({ loading: false });
  //     return resSaveFM;
  //   }
  //   catch (e) {
  //     typeof hideLoading === 'function' && hideLoading();
  //     this.setState({ loading: false });
  //     console.warn(e);
  //   }
  // };

  getYears = () => {
    const current = parseInt(moment().format('YYYY'));
    let years = [];
    for (let i=2017; i<=current+1; i++) {
      years.push({ value: String(i), label: String(i) })
    }
    return years;
  };

  render() {
    const { t, tofiConstants, fundmakerArchiveOptions } = this.props;
    this.lng = localStorage.getItem('i18nextLng');
    const { filter, filterLoading } = this.state;
    const { fundmakerArchive } = tofiConstants;
    const disabledFundmakerArchive = false;
    const disabledPeriod = !filter.fundmakerArchive.value;

    return (
      <div>
        <div className="CreateDocument__heading">
        <div className="table-header">
        <div className="label-select-10">
          <div style={{width:'300px'}}>
            <SelectVirt
              disabled={disabledFundmakerArchive}
              optionHeight={40}
              isSearchable={false}
              className="long-selected-menu"
              isLoading={filterLoading.fundmakerArchive}
              //onMenuOpen={this.loadOptionsProp(FUND_MAKER_ARCHIVE)}
              value={filter.fundmakerArchive && filter.fundmakerArchive}
              onChange={(item) => this.onChangeFundmakerArchive(item)}
              //options={fundmakerArchiveOptions ? fundmakerArchiveOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
              options={this.state.archivesList.map(option => ({value: option.id, label: option.name[this.lng], item: option}))}
              placeholder={fundmakerArchive.name[this.lng]}
            />
          </div>
        </div>
        <div className="label-select-10">
          <div style={{width:'100px'}}>
            <SelectVirt
              disabled={disabledPeriod}
              optionHeight={40}
              isSearchable={false}
              className="long-selected-menu"
              //isLoading={filterLoading.fundmakerArchive}
              //onMenuOpen={this.loadOptionsProp(FUND_MAKER_ARCHIVE)}
              value={filter.period}
              onChange={(item) => this.onChangePeriod(item)}
              options={this.getYears()}
              placeholder={'...'}
            />
          </div>
          </div>
          </div>
        </div>
        <AntTabs
          tabs={[
            {
              tabKey: 'passport_1',
              tabName: t('PASSPORT_1'),
              tabContent: (
                <Passport0 
                  t={t} 
                  tofiConstants={tofiConstants} 
                  tableData={this.state.tableData}
                  loading={this.state.loading} 
                  countData={this.state.countData}
                  lng={this.lng}
                  onChangeNumberFundDoc={this.onChangeNumberFundDoc}
                />
              )
            },
            {
              tabKey: 'passport_6',
              tabName: t('PASSPORT_4'),
              tabContent: (
                <Passport6 
                  t={t} 
                  loading={this.state.loading} 
                  tofiConstants={tofiConstants} 
                  lng={this.lng}
                  archive={this.state.filter.fundmakerArchive.item}
                  onSaveArchiveInfo={this.onSaveArchiveInfo}
                />
              ) 
            },
          ]}
        />
      </div>
    );
  }
}

//export default DocsInfoPage;

export default connect(state => {
  return {
    CubeForAF_InvPassport: state.cubes.CubeForAF_InvPassport,
    cubeForFundAndIKPassport: state.cubes.cubeForFundAndIKPassport,
    cubeArchivePassport: state.cubes.cubeArchivePassport,
    fundmakerArchiveOptions: state.generalData[FUND_MAKER_ARCHIVE],
    tofiConstants: state.generalData.tofiConstants,
  }
}, { getCube, getPropVal, getAllObjOfCls, getObjByProp })(DocsInfoPage);