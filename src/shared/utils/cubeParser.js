import moment from 'moment';
import PropTypes from 'prop-types';
import {map, forEach} from "lodash";
import uuid from "uuid";
import { SYSTEM_LANG_ARRAY } from '../constants/constants'

import {updateCubeData, updateCubeData2} from "../actions/actions";
import {removeFilesWithIdDPV} from "./index";

const oneLevelCopy = (object) => ({...object});

export const parseCube_new = (cubeVal, fixedDim, colDimName, rowDimName, doTable, dpTable, doConst, dpConst) => {
  try {
    const doTableWithProps = doTable.map(item => ({ ...item, props: dpTable.map(oneLevelCopy) }));
    cubeVal.forEach(cubeValItem => {
      const prop = doTableWithProps.find(doItem => doItem['id'] === cubeValItem[doConst])['props'].find(dpItem => dpItem['id'] === cubeValItem[dpConst]);
      const propType = prop['typeProp'];
      if(prop.isUniq === 2) {
        if(!prop.idDataPropVal) prop.idDataPropVal = [];
        if(!prop.complexMultiValues) prop.complexMultiValues = {};
        cubeValItem['idDataPropVal'] && prop.idDataPropVal.push(cubeValItem['idDataPropVal']);
      } else {
        prop.idDataPropVal = cubeValItem['idDataPropVal'];
      }
      if(cubeValItem['parentDataPropVal'] && !prop.complexChildValues) prop.complexChildValues = {};
      switch (true) {
        case (propType === 1) :
          return;
        case (propType === 11 && prop.isUniq === 2):
          if(cubeValItem['idRef']) {
            if(!prop.values) prop.values = [];
            prop.values.push({value: cubeValItem['idRef'], label: (cubeValItem['name'][localStorage.getItem('i18nextLng')] || '')})
          }
          break;
        case (propType === 11) :
          if(cubeValItem['parentDataPropVal']) prop.complexChildValues[cubeValItem['parentDataPropVal']] = {
            value: cubeValItem['name'] ? cubeValItem['name'][localStorage.getItem('i18nextLng')] : '',
            refId: cubeValItem['idRef']
          };
          prop.value = cubeValItem['name'] ? cubeValItem['name'][localStorage.getItem('i18nextLng')] : '';
          prop.refId = cubeValItem['idRef'];
          break;
        case (propType === 21) :
        case (propType === 22) :
          if(cubeValItem['parentDataPropVal']) prop.complexChildValues[cubeValItem['parentDataPropVal']] = {
            value: cubeValItem['valueNumb']
          };
          prop.value = cubeValItem['valueNumb'];
          break;
        case (propType.toString().startsWith('31')) :
          switch (propType % 10) {
            case 1:
            case 5:
              if(prop.isUniq === 2) {
                if(!prop.values) prop.values = [];
                cubeValItem['valueStr'] && prop.values.push(cubeValItem['valueStr'][localStorage.getItem('i18nextLng')]);
              } else {
                if(cubeValItem['parentDataPropVal']) prop.complexChildValues[cubeValItem['parentDataPropVal']] = {
                  value: cubeValItem['valueStr']
                };
                prop.value = cubeValItem['valueStr'] ? cubeValItem['valueStr'][localStorage.getItem('i18nextLng')] : '';
                prop.valueLng = cubeValItem['valueStr'] ? cubeValItem['valueStr'] : null;
              }
              break;
            case 2:
            case 3:
            case 4:
              if(cubeValItem['parentDataPropVal']) prop.complexChildValues[cubeValItem['parentDataPropVal']] = {
                value: moment(cubeValItem['valueDateTime'], 'YYYY-MM-DD').isValid() ?
                  moment(cubeValItem['valueDateTime'], 'YYYY-MM-DD').format('DD-MM-YYYY') : ''
              };
              const date = moment(cubeValItem['valueDateTime'], 'YYYY-MM-DD');
              prop.value = date.isValid() ? date.format('DD-MM-YYYY') : '';
              break;
            case 7:
              if(prop.isUniq === 2) {
                if(!prop.values) prop.values = [];
                if(cubeValItem['valueFile']) {
                  const id = cubeValItem['valueFile'][localStorage.getItem('i18nextLng')];
                  const f = new File([id], id);
                  f.uid = `rc-upload-${id}`;
                  prop.values.push(f);
                  if(cubeValItem['parentDataPropVal']) {
                    if(!prop.complexMultiValues[cubeValItem['parentDataPropVal'] + '_' + cubeValItem[dpConst]]) prop.complexMultiValues[cubeValItem['parentDataPropVal'] + '_' + cubeValItem[dpConst]] = [];
                    prop.complexMultiValues[cubeValItem['parentDataPropVal'] + '_' + cubeValItem[dpConst]].push(f);
                    prop.complexChildValues[cubeValItem['parentDataPropVal']] = {
                    values: prop.complexMultiValues[cubeValItem['parentDataPropVal'] + '_' + cubeValItem[dpConst]]
                  }}
                }
              } else if(cubeValItem['valueFile']){
                const id = cubeValItem['valueFile'][localStorage.getItem('i18nextLng')];
                const f = new File([id], id);
                f.uid = `rc-upload-${id}`;
                prop.value = f;
                if(cubeValItem['parentDataPropVal']) prop.complexChildValues[cubeValItem['parentDataPropVal']] = {
                  value: f
                };
              }
              break;
            default: break;
          }
          break;
        case (propType === 41 && prop.isUniq === 2):
          if(cubeValItem['idRef']) {
            if(!prop.values) prop.values = [];
            cubeValItem['idRef'] && prop.values.push({value: cubeValItem['idRef'], label: (cubeValItem['name'][localStorage.getItem('i18nextLng')] || '')})
          }
          break;
        case (propType === 41) :
          if(cubeValItem['parentDataPropVal']) prop.complexChildValues[cubeValItem['parentDataPropVal']] = {
            value: cubeValItem['name'] ? cubeValItem['name'][localStorage.getItem('i18nextLng')] : '',
            cube: cubeValItem
          };
          prop.value = cubeValItem['name'] ? cubeValItem['name'][localStorage.getItem('i18nextLng')] : '';
          prop.cube = cubeValItem;
          break;
        case (propType === 51) :
          prop.value = 'relObj';
          break;
        case (propType === 61) :
          prop.value = 'measure';
          break;
        case (propType === 71 && prop.isUniq === 2):
          if(cubeValItem['valueStr']) {
            if(!prop.values) prop.values = [];
            cubeValItem['valueStr'] && prop.values.push({value: cubeValItem['valueStr'], id: (cubeValItem['idDataPropVal'] || '')})
          }
          break;
        case (propType === 71) :
          prop.value = cubeValItem['valueStr'] ? cubeValItem['valueStr'][localStorage.getItem('i18nextLng')] : '';
          prop.valueLng = cubeValItem['valueStr'] ? cubeValItem['valueStr'] : null;
          break;
        default:
          return;
      }
    });
    return doTableWithProps;
  } catch(err) {
    console.warn(err);
    return []
  }
};

/*
* props - all dp of one do
* result - object
* */
export const parseForTable = (props, tofiConstants, result, constArr) => {
  const withIdDPV = {};
  const keys = constArr ? constArr : Object.keys(tofiConstants);
  try {
    props.forEach(dp => {
      const c = keys.find(c => tofiConstants[c].cod === `_P_${dp.prop}`);
      if (c) {
        if (dp.isUniq === 1) {
          withIdDPV[c] = dp.idDataPropVal;
          switch (dp.typeProp) {
            case 11: {
              result[c] = dp.refId ? {value: dp.refId, label: dp.value} : null;
              break;
            }
            case 312: {
              result[c] = dp.value ? moment(dp.value, 'DD-MM-YYYY') : null;
              break;
            }
            case 41: {
              result[c] = dp.cube && dp.cube.idRef ? {value: dp.cube.idRef, label: dp.value} : null;
              break;
            }
            default: {
              result[c] = dp.value ? dp.value : '';
              result[c + 'Lng'] = dp.valueLng ? dp.valueLng : {kz: '', ru: '', en: ''};
              break;
            }
          }
        } else if (dp.isUniq === 2) {
          //console.log(dp);
          withIdDPV[c] = dp.idDataPropVal;
          switch (dp.typeProp) {
            default:
              result[c] = dp.values ? dp.values : [];
          }
        }
      }
    });
    return withIdDPV;
  } catch (e) {
    console.warn(e);
    console.log('No such constants', constArr.filter(c => !tofiConstants[c]));
  }
};

export const getPropMeta = (cubeProps, cnst) => {
  try {
    return cubeProps.find(prop => prop.prop === cnst.id);

  } catch (err) {
    console.error(cubeProps, cnst, err)
  }
};

/*
* Required:
* cube: data, dpConst, doConst, cubeSConst
* obj: doItem
*
* tofiConstants: tofiConstants
* */

/*
* Structure
* complex: {
*   constant: {
*     mode,
*     values
*   }
* }
*
* values: {constant, constant}
*
* */

export function onSaveCubeData(
  {cube, obj},
  {values, complex, oFiles={}, qFiles={}, idDPV={}},
  tofiConstants,
  objData={},
  periods,
  dte=moment().format('YYYY-MM-DD'),
  options={}) {
  const files = {...oFiles};
  forEach(qFiles, (val, key) => {
    files[`__Q__${key}`] = val;
  });
  const valuesArr = map(values, buildProps);
  const complexArr = map(complex, ({values, mode}, key) => {
    const propMetaData = getPropMeta(cube.data["dp_" + tofiConstants[cube.dpConst].id], tofiConstants[key]);
    const id = uuid();
    const value = {};
    SYSTEM_LANG_ARRAY.forEach(lang => {
      value[lang] = id;
    });
    return {
      propConst: key,
      val: value,
      typeProp: '71',
      periodDepend: String(propMetaData.periodDepend),
      isUniq: String(propMetaData.isUniq),
      mode,
      child: map(values, buildProps)
    }
  });

  const datas = [{
    own: [{doConst: cube.doConst, doItem: obj.doItem, isRel: "0", objData}],
    props: [...valuesArr, ...complexArr],
    periods: periods || [{ periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31' }]
  }];

  function buildProps(val, key) {
    const propMetaData = getPropMeta(cube.data["dp_" + tofiConstants[cube.dpConst].id], tofiConstants[key]);
    let value = val;
    try {
      if((propMetaData.typeProp === 315 || propMetaData.typeProp === 311 || propMetaData.typeProp === 317) && typeof val === 'string') value = {kz: val, ru: val, en: val};
      if(propMetaData.typeProp === 312) value = moment(val).format('YYYY-MM-DD');
      if(val && typeof val === 'object' && val.value) value = String(val.value);
      if(val && typeof val === 'object' && val.mode) propMetaData.mode = val.mode;
      if(propMetaData.isUniq === 2 && val[0] && val[0].value) {
        propMetaData.mode = val[0].mode;
        value = val.map(v => String(v.value)).join(",");
      }
    } catch (e) {
      console.warn(key,val);
      console.warn(e);
      return;
    }
    return {
      propConst: key,
      val: value,
      idDataPropVal: idDPV[key],
      typeProp: String(propMetaData.typeProp),
      periodDepend: String(propMetaData.periodDepend),
      isUniq: String(propMetaData.isUniq),
      mode: propMetaData.mode
    }
  }
  return updateCubeData(cube.cubeSConst, dte, JSON.stringify(datas), options, files)
}

export function onSaveCubeData2(
  {cube, obj},
  {values, complex, oFiles={}, qFiles={}, idDPV={}},
  tofiConstants,
  objData={},
  periods,
  dte=moment().format('YYYY-MM-DD'),
  options={}) {
  const files = {...oFiles};
  forEach(qFiles, (val, key) => {
    files[`__Q__${key}`] = val;
  });
  Object.entries(files)
    .filter(([key, file]) => file)
    .forEach(([key, file]) => {
      if(file.length) {
        file.forEach((f, idx) => {
          console.log(idDPV, idDPV[key], key);
          f.idDPV = idDPV[key][idx]});
        return;
      }
      file.idDPV = idDPV[key]
    });
  let filesToServer = files;
  removeFilesWithIdDPV(Object.values(filesToServer));
  const valuesArr = map(values, buildProps);
  const complexArr = map(complex, ({values, mode}, key) => {
    const propMetaData = getPropMeta(cube.data["dp_" + tofiConstants[cube.dpConst].id], tofiConstants[key]);
    const id = uuid();
    const value = {};
    SYSTEM_LANG_ARRAY.forEach(lang => {
      value[lang] = id;
    });
    return {
      propConst: key,
      val: value,
      typeProp: '71',
      periodDepend: String(propMetaData.periodDepend),
      isUniq: String(propMetaData.isUniq),
      mode,
      child: map(values, buildProps)
    }
  });

  const datas = [{
    own: [{doConst: cube.doConst, doItem: obj.doItem, isRel: "0", objData}],
    props: [...valuesArr, ...complexArr],
    periods: periods || [{ periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31' }]
  }];

  function buildProps(val, key) {
    const propMetaData = getPropMeta(cube.data["dp_" + tofiConstants[cube.dpConst].id], tofiConstants[key]);
    let value = val;
    try {
      if((propMetaData.typeProp === 315 || propMetaData.typeProp === 311 || propMetaData.typeProp === 317) && typeof val === 'string') value = {kz: val, ru: val, en: val};
      if(propMetaData.typeProp === 312) value = moment(val).format('YYYY-MM-DD');
      if(val && typeof val === 'object' && val.value) value = String(val.value);
      if(val && typeof val === 'object' && val.mode) propMetaData.mode = val.mode;
      if(propMetaData.isUniq === 2 && val[0] && val[0].value) {
        propMetaData.mode = val[0].mode;
        value = val.map(v => String(v.value)).join(",");
      }
    } catch (e) {
      console.warn(key,val);
      console.warn(e);
      return;
    }
    return {
      propConst: key,
      val: value,
      idDataPropVal: idDPV[key],
      typeProp: String(propMetaData.typeProp),
      periodDepend: String(propMetaData.periodDepend),
      isUniq: String(propMetaData.isUniq),
      //periodType: periodType,
      //dBeg: dBeg,
      //dEnd: dEnd,
      mode: propMetaData.mode
    }
  }
  return updateCubeData2(cube.cubeSConst, dte, JSON.stringify(datas), options, filesToServer)
}
