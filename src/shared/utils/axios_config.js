import axios from 'axios';
import {forEach} from 'lodash';
import {CUBE_FOR_AF_FUND, CUBE_FOR_RR} from '../constants/tofiConstants';
import moment from 'moment';
import { getFile } from "../actions/actions";

axios.defaults.baseURL = `/${process.env.REACT_APP_APP_NAME}/a/archive/default`;

export const Auth = {
  login: (email, password) => {
    return (
      axios.post(`/${localStorage.getItem('i18nextLng')}/session/sessionIn?login=${email}&passwd=${password}`)
        .then(response => response.data)
    );
  },
  logout: () =>
    axios.get(`/${localStorage.getItem('i18nextLng')}/Session/sessionOut`),
  getUser: () =>
    axios.get(`/${localStorage.getItem('i18nextLng')}/session/aboutMe`)
      .then(response => response.data),

    getUserInfo: (objUser) =>{
        const fd = new FormData();
        fd.append('objUser', objUser);
     return axios.post(`/${localStorage.getItem('i18nextLng')}/session/aboutMe`,fd)
          .then(response => response.data.data)
    },
  regNewUser: fd =>
    axios.post(`/${localStorage.getItem('i18nextLng')}/registration/regUser`, fd),
  regNewUserWithECP: fd =>
    axios.post(`/${localStorage.getItem('i18nextLng')}/registration/regUserWithECP`, fd),
  changePasswordAct: (paswd, userId) => {
    const fd = new FormData();
    fd.append('paswd', paswd);
    fd.append('obj', String(userId));
    return axios.post(`/${localStorage.getItem('i18nextLng')}/Session/setPaswd`, fd)
      .then(res => res.data)
  }
};

export const Test = {
  listPropValRef: obj =>
    axios.get(`/${localStorage.getItem('i18nextLng')}/entity/listPropValRef?obj=${obj}`)
};

export const Cube = {
  getRRCube: filter => {
    if (!!filter) {
      return (
        axios.get(`/${localStorage.getItem('i18nextLng')}/cube/getCubeValues?cubeConst=${CUBE_FOR_RR}&filter=${filter}&dte=''`)
          .then(res => res.data.data)
      );
    } else {
      return (
        axios.get(`/${localStorage.getItem('i18nextLng')}/cube/getCubeValues?cubeConst=${CUBE_FOR_RR}&dte=''`)
          .then(res => res.data.data)
      );
    }
  },
  getAFCube: filter => {
    if (!!filter) {
      return (
        axios.get(`/${localStorage.getItem('i18nextLng')}/cube/getCubeValues?cubeConst=${CUBE_FOR_AF_FUND}&filter=${filter}&dte=''`)
          .then(res => res.data.data)
      );
    } else {
      return (
        axios.get(`/${localStorage.getItem('i18nextLng')}/cube/getCubeValues?cubeConst=${CUBE_FOR_AF_FUND}&dte=''`)
          .then(res => res.data.data)
      );
    }
  },
  // getting cube itself
  getCube: (cubeSConst, filters, nodeWithChilds, dte) => {
    const fd = new FormData();
    fd.append("cubeSConst", cubeSConst);
    fd.append("filters", filters);
    fd.append("nodeWithChilds", nodeWithChilds);
    dte && fd.append("dte", dte);
    // return axios.get(`/${localStorage.getItem('i18nextLng')}/cube/getInventory?cubeConst=${cubeConst}&${filter}&dte=''`)
    return axios.post(`/${localStorage.getItem('i18nextLng')}/cube/getCubeData`, fd)
      .then(res => res.data);
  },
  // updating values in cube
  updateCubeData: (cubeSConst, dte, datas, files) => {
    const fd = new FormData();
    fd.append("cubeSConst", cubeSConst);
    fd.append("dte", dte);
    fd.append("datas", datas);
    forEach(files, (fileArr, key) => {
      fileArr && fileArr.forEach((file, idx) => {
        file && !key.startsWith('__Q__') && fd.append(`files_${key}_${idx + 1}`, file);
        file && key.startsWith('__Q__') && fd.append(`filesQ_${key.split('__Q__')[1]}_${idx + 1}`, file);
      });
    });
    return axios.post(`/${localStorage.getItem('i18nextLng')}/cube/saveCubeData`, fd)
      .then(res => res.data);
  },
  // updating values in cube new for idDataPropVal
  updateCubeData2: (cubeSConst, dte, datas, files) => {
    const fd = new FormData();
    fd.append("cubeSConst", cubeSConst);
    fd.append("dte", dte);
    fd.append("datas", datas);
    forEach(files, (fileArr, key) => {
      fileArr && fileArr.forEach((file, idx) => {
        file && !key.startsWith('__Q__') && fd.append(`files_${key}_${idx + 1}`, file);
        file && key.startsWith('__Q__') && fd.append(`filesQ_${key.split('__Q__')[1]}_${idx + 1}`, file);
      });
    });
    return axios.post(`/${localStorage.getItem('i18nextLng')}/cube/saveCubeData2`, fd)
      .then(res => res.data);
  },
  // Creating new obj and writing it in Cube
  createObj: (cube, obj) => {
    const fd = new FormData();
    fd.append("cube", JSON.stringify(cube));
    fd.append("obj", JSON.stringify(obj));
    return axios.post(`/${localStorage.getItem('i18nextLng')}/cube/createObj`, fd)
      .then(res => res.data)
  },
  // delete
  dObj: fd =>
    axios.post(`/${localStorage.getItem('i18nextLng')}/cube/dObj`, fd)
      .then(res => res.data),
  dObjChild: fd =>
    axios.post(`/${localStorage.getItem('i18nextLng')}/cube/dObjChild`, fd)
      .then(res => res.data),
  dObjVer: fd =>
    axios.post(`/${localStorage.getItem('i18nextLng')}/obj/dObjVer`, fd)
      .then(res => res.data),

  dFundMaker: id =>
    axios.get(`/${localStorage.getItem('i18nextLng')}/archiveFund/dFundMaker?objId=${id}`)
      .then(res => res.data)
};

export const General = {
    propValList: (propConst) => {
        const fd = new FormData();
        fd.append("propConst", String(propConst));
        return axios.post(`/${localStorage.getItem('i18nextLng')}/propvallist/get`, fd)
        .then(res => res.data)
    },
  getFactorVal: CONST =>
    axios.get(`/${localStorage.getItem('i18nextLng')}/factorVal/getFactorVal?factor=${CONST}`),
  getRoles: () =>
    axios.get(`/${localStorage.getItem('i18nextLng')}/session/getRoles`)
      .then(res => res.data),

  restorePassword: (newPass) =>
    axios.get(`/${localStorage.getItem('i18nextLng')}/registration/forgotPasswd?email=${newPass}`)
      .then(res => res.data),

  getAllPermis: () =>
    axios.get(`/${localStorage.getItem('i18nextLng')}/session/getAllPermis`)
      .then(res => res.data),

  getRolePermis: idRole =>
    axios.get(`/${localStorage.getItem('i18nextLng')}/session/getRolePermis?idRole=${idRole}`)
      .then(res => res.data),


  getRolesUser: objId =>
    axios.get(`/${localStorage.getItem('i18nextLng')}/session/getRolesUser?obj=${objId}`)
      .then(res => res.data),


  savePrivs: (idRole, idsPriv) => {
     return axios.get(`/${localStorage.getItem('i18nextLng')}/session/editRole?idRole=${idRole}&idsPriv=${idsPriv}`)
  },

  setRoles: (objId, roles) =>
    axios.post(`/${localStorage.getItem('i18nextLng')}/session/setRoles?obj=${objId}&roles=${roles}`)
      .then(res => res.data),

  createRole: roleName => {
    return axios.get(`/${localStorage.getItem('i18nextLng')}/session/createRole`, {
      params: {
        name: {kz: roleName, ru: roleName, en: roleName},
        fullName: {kz: roleName, ru: roleName, en: roleName}
      }
    })

  },


  // receiving blob of file by id.
    getFile: (id, type) =>
        axios.get(`/${localStorage.getItem('i18nextLng')}/entity/getFile?idFile=${id}&type=${type}`, {responseType: 'blob'}),

    getFileResolve: (path, provider) =>
        axios.get(`/${localStorage.getItem('i18nextLng')}/fileviewer/resolve?path=${path}&provider=${provider}`),

    getFileInfo: (id, viewtype) =>
        axios.get(`/${localStorage.getItem('i18nextLng')}/fileviewer/info?id=${id}&viewtype=${viewtype}`),

    getFileCheckdata: (id, viewtype) =>
        axios.get(`/${localStorage.getItem('i18nextLng')}/fileviewer/checkdata?id=${id}&viewtype=${viewtype}`),

    getFileData: (id, page, rotate, viewtype) =>
        axios.get(`/${localStorage.getItem('i18nextLng')}/fileviewer/data?id=${id}&viewtype=${viewtype}&page=${page}&rotate=${rotate}`),

  //delete file from db and cube
  dFile: (id, cubeSConst) =>
    axios.get(`/${localStorage.getItem('i18nextLng')}/entity/dFile?idFile=${id}&cubeSConst=${cubeSConst}`)
      .then(res => res.data),
  getCountries: () =>
    axios.get(`/${localStorage.getItem('i18nextLng')}/country/getCountries`),
  getCities: countryId =>
    axios.get(`/${localStorage.getItem('i18nextLng')}/country/getCities?countryId=${countryId}`),
  getPropValById: id =>
    axios.get(`/${localStorage.getItem('i18nextLng')}/archive/getPropVal?propId=${id}`)
      .then(res => res.data),
  getPropValByConst: propConst =>
    axios.get(`/${localStorage.getItem('i18nextLng')}/registration/getPropVal?propConst=${propConst}`)
      .then(res => res.data),
  getPropValWithChilds: propConst =>
    axios.get(`/${localStorage.getItem('i18nextLng')}/registration/getPropValWithChilds?propConst=${propConst}`)
      .then(res => res.data),
  getObjChildsByConst: (c, props) =>
    axios.get(`/${localStorage.getItem('i18nextLng')}/registration/getObjChilds?objConst=${c}&withProps=${props}`)
      .then(res => res.data),
  getObjChildsById: (id, props) =>
    axios.get(`/${localStorage.getItem('i18nextLng')}/registration/getObjChilds?objId=${id}&withProps=${props}`)
      .then(res => res.data),
  // receiving all constants (first need)
  getAllConstants: () =>
    axios.get(`/${localStorage.getItem('i18nextLng')}/utils/getAllConst`)
      .then(res => res.data),
  // getting obj ver
  getObjVer: objId =>
    axios.get(`/${localStorage.getItem('i18nextLng')}/obj/getVer?obj=${objId}`)
      .then(res => res.data),
  // receiving numbers of funds, inventories and cases (used below of tables)
  getFundCountData: () =>
    axios.get(`/${localStorage.getItem('i18nextLng')}/archiveFund/getCounts`)
      .then(res => res.data),
  getCasesCount: (ids, cubeConst, dimConst) => {
    const fd = new FormData();
    fd.append('ids', ids);
    fd.append('cubeConst', cubeConst);
    fd.append('dimConst', dimConst);
    return axios.post(`/${localStorage.getItem('i18nextLng')}/archiveFund/getCountCases`, fd)
      .then(res => res.data)
  },
  // getting access levels (first need)
  getAccessLevels: () =>
    axios.get(`/${localStorage.getItem('i18nextLng')}/dict/getAccessLevel`)
      .then(res => res.data),
  getAllObjOfCls: (clsConst, dte, propConsts) =>
    axios.get(`/${localStorage.getItem('i18nextLng')}/entity/getAllObjOfCls?clsConst=${clsConst}&dte=${dte}&propConsts=${propConsts}`)
      .then(res => res.data),
  // insert propVal, very rare useCase, if any
  insPropVal: fd =>
    axios.post(`/${localStorage.getItem('i18nextLng')}/entity/insPropVal`, fd)
      .then(res => res.data),
  // old api for getting list of TOFI objects
  getObjList: fd =>
    axios.post(`/${localStorage.getItem('i18nextLng')}/entity/getObjList`, fd)
      .then(res => res.data),
  // Добавить новую версию объекта
  addObjVer: fd =>
    axios.post(`/${localStorage.getItem('i18nextLng')}/entity/addObjVer`, fd)
      .then(res => res.data),
  // Редактирование версии объекта
  updObjVer: fd =>
    axios.post(`/${localStorage.getItem('i18nextLng')}/entity/updObjVer`, fd)
      .then(res => res.data),
  // Получение массива объектов, значением ссылочного свойство которого является
  // объект с конкретным значением конкретного свойства ---> obj1 where obj1.prop1 = obj2 with obj2.prop2 = value
  getObjByObjVal: fd =>
    axios.post(`/${localStorage.getItem('i18nextLng')}/entity/listObjByObjVal`, fd)
      .then(res => res.data),
  // Получение объектов с конкретным значением конкретного свойства.
  getObjByProp: fd =>
    axios.post(`/${localStorage.getItem('i18nextLng')}/entity/listObjByProp`, fd)
      .then(res => res.data),
  // The same api like getObjByProp, but can be accessed without authorization
  listObjByProp: fd =>
    axios.post(`/${localStorage.getItem('i18nextLng')}/registration/listObjByProp`, fd)
      .then(res => res.data),
  // Almost the same as getObjByProp, except that it works for several values for prop (single-valued)
  getCorrespValues: fd =>
    axios.post(`/${localStorage.getItem('i18nextLng')}/entity/getCorrespValues`, fd)
      .then(res => res.data),
  // Получение объектов, которые являются значением конкретного свойства конкретного объекта (id)
  getObjFromProp: fd =>
    axios.post(`/${localStorage.getItem('i18nextLng')}/entity/listObjFromProp`, fd)
      .then(res => res.data),
  getValuesOfObjsWithProps: fd =>
    axios.post(`/${localStorage.getItem('i18nextLng')}/entity/getValuesOfObjsWithProps`, fd)
      .then(res => res.data),
  // New Api for getting list of obj
  getObjListNew: fd =>
    axios.post(`/${localStorage.getItem('i18nextLng')}/entity/getObjListNew`, fd)
      .then(res => res.data),
  // Receiving value of Multi text props; They are received separately, because CubeS do not support them
  getValueOfMultiText: (objId, props) => {
    const fd = new FormData();
    fd.append('obj', String(objId));
    fd.append('propConsts', props);
    return axios.post(`/${localStorage.getItem('i18nextLng')}/entity/getValueOfMultiText`, fd)
      .then(res => res.data)
  },
    getIdGetObj: (objId, dimObjConst) => {
        const fd = new FormData();
        fd.append('objId', String(objId));
        fd.append('dimObjConst', dimObjConst);
        return axios.post(`/${localStorage.getItem('i18nextLng')}/cube/getIdDimObj`, fd)
            .then(res => res.data)
    },
  // Saving value of Multi text props; They are send separately, because CubeS do not support them
  saveValueOfMultiText: (objId, props, dte) => {
    const fd = new FormData();
    fd.append('obj', String(objId));
    fd.append('props', props);
    fd.append('dte', dte);
    return axios.post(`/${localStorage.getItem('i18nextLng')}/entity/saveValueOfMultiText`, fd)
      .then(res => res.data)
  },
  setPropsToObj: (objTo, objFrom, props, cubeSConst, dimObjConst) => {
    const fd = new FormData();
    fd.append('objTo', String(objTo));
    fd.append('objFrom', String(objFrom));
    fd.append('props', JSON.stringify(props));
    fd.append('cubeSConst', cubeSConst);
    fd.append('dimObjConst', dimObjConst);
    return axios.post(`/${localStorage.getItem('i18nextLng')}/entity/setPropsToObj`, fd)
      .then(res => res.data)
  },
  calcWorkAssignedToAndFund: (objWork, objCase, cubeSConst, dimObjConst, dte) => {
    const fd = new FormData();
    fd.append('objWork', String(objWork));
    fd.append('objCase', String(objCase));
    fd.append('cubeSConst', cubeSConst);
    fd.append('dimObjConst', dimObjConst);
    fd.append('dte', dte);
    return axios.post(`/${localStorage.getItem('i18nextLng')}/entity/calcWorkAssignedToAndFund`, fd)
      .then(res => res.data)
  },
  getFileList: (own, propConst) => {
    const fd = new FormData();
    fd.append('own', own);
    fd.append('propConst', propConst);
    return axios.post(`/${localStorage.getItem('i18nextLng')}/entity/getFileList`, fd)
      .then(res => res.data)
  },
  saveOrderFiles: (own, files) => {
    const fd = new FormData();
    fd.append('own', own);
    fd.append('files', files);
    return axios.post(`/${localStorage.getItem('i18nextLng')}/entity/saveOrderFiles`, fd)
      .then(res => res.data)
  },
  saveValueCell: (own, propConst, periodType, dte, status, provider, value) => {
    const fd = new FormData();
    fd.append('own', own);
    fd.append('propConst', propConst);
    fd.append('periodType', String(periodType));
    fd.append('dte', dte);
    fd.append('status', String(status));
    fd.append('provider', String(provider));
    fd.append('value', value);
    return axios.post(`/${localStorage.getItem('i18nextLng')}/entity/saveValueCell`, fd)
      .then(res => res.data)
  },
  getFilesHashes: ids => {
    const fd = new FormData();
    fd.append('ids', JSON.stringify(ids));
    return axios.post(`/${localStorage.getItem('i18nextLng')}/entity/getFilesHashes`, fd)
      .then(res => res.data)
  }
};

export const ArchiveFund = {
  actIK: (idFund, idInv, idIK) =>
    axios.post(`/${localStorage.getItem('i18nextLng')}/archiveFund/actIK?idFund=${idFund}&idInv=${idInv}&idIK=${idIK}`)
      .then(res => res.data),
  getArchiveFundList: () =>
    axios.get(`/${localStorage.getItem('i18nextLng')}/ArchiveFund/getFundList`)
      .then(response => response.data)
      .then(json => json.data),
  getFundCard: id =>
    axios.get(`/${localStorage.getItem('i18nextLng')}/ArchiveFund/getFundCardMain?fundId=${id}`)
      .then(res => res.data)
      .then(data => data.data),
  getFundCardAnnotation: id =>
    axios.get(`/${localStorage.getItem('i18nextLng')}/ArchiveFund/getFundCardAnnotation?fundId=${id}`)
      .then(res => res.data)
      .then(data => data.data),
  accessConditionsOfFund: id =>
    axios.get(`/${localStorage.getItem('i18nextLng')}/archiveFund/accessConditionsOfFund?objId=${id}`)
      .then(res => res.data)
      .then(data => data.data),
  appendFund: fd => {
    return axios.post(`/${localStorage.getItem('i18nextLng')}/archiveFund/appendFund`, fd)
      .then(res => res.data)
  },
  calcCountDocsOfFund: id =>
    axios.get(`/${localStorage.getItem('i18nextLng')}/archiveFund/calcCountDocsOfFund?fundId=${id}`)
      .then(res => res.data),
  getInvAndFundByCases: (caseIds, dte = moment().format('YYYY-MM-DD')) => {
    const fd = new FormData();
    fd.append('caseIds', caseIds);
    fd.append('dte', dte);
    return axios.post(`/${localStorage.getItem('i18nextLng')}/readingRoom/getInvAndFundByCases`, fd)
      .then(res => res.data)
  }
}

export const Works = {
  // Заточенный апи для работ учета и хранения (проваливание)
  rabota1: idWork => {
    const fd = new FormData();
    fd.append('idWork', idWork);
    return axios.post(`/${localStorage.getItem('i18nextLng')}/rabotaUchet/rabota1`, fd)
      .then(res => res.data)
  },
  // Заточенный апи для работ учета и хранения (проваливание)
  rabotaExp: idWork => {
    const fd = new FormData();
    fd.append('idWork', idWork);
    return axios.post(`/${localStorage.getItem('i18nextLng')}/rabotaUchet/rabotaExp`, fd)
      .then(res => res.data)
  },
  // Заточенный апи для работ учета и хранения (проваливание)
  rabotaAcc: idWork => {
    const fd = new FormData();
    fd.append('idWork', idWork);
    return axios.post(`/${localStorage.getItem('i18nextLng')}/rabotaUchet/rabotaAcc`, fd)
      .then(res => res.data)
  },
    getAct1:idWork=>{
        const fd= new FormData();
        fd.append('idWork',idWork);
        return axios.post(`/${localStorage.getItem('i18nextLng')}/rabotaUchet/getAct1`, fd)
        .then(res => res.data)
    },
    lightToDestroy:idWork=>{
        const fd= new FormData();
        fd.append('idWork',idWork);
        return axios.post(`/${localStorage.getItem('i18nextLng')}/rabotaUchet/LightToDestroy`, fd)
        .then(res => res.data)
    },
    crashedAct:idWork=>{
        const fd= new FormData();
        fd.append('idWork',idWork);
        return axios.post(`/${localStorage.getItem('i18nextLng')}/rabotaUchet/crashedAct`, fd)
        .then(res => res.data)
    },




  // Заточенный апи для работ учета и хранения (проваливание) submit
  addDerivativeWorks: fd =>
    axios.post(`/${localStorage.getItem('i18nextLng')}/rabotaUchet/addDerivativeWorks`, fd)
      .then(res => res.data),
  // Заточенный апи для работ учета и хранения (проваливание) submit
  addDerivativeWorksExp: fd =>
    axios.post(`/${localStorage.getItem('i18nextLng')}/rabotaUchet/addDerivativeWorksExp`, fd)
      .then(res => res.data),
  // Заточенный апи для работ учета и хранения (проваливание) submit
  addDerivativeWorksAcc: fd =>
    axios.post(`/${localStorage.getItem('i18nextLng')}/rabotaUchet/addDerivativeWorksAcc`, fd)
      .then(res => res.data),
  // Заточенный апи
  changeInvOC: (invFrom, invTo) => {
    const fd = new FormData();
    fd.append("invFrom", invFrom);
    fd.append("invTo", invTo);
    return axios.post(`/${localStorage.getItem('i18nextLng')}/rabotaUchet/changeInvOC`, fd)
      .then(res => res.data)
  },
  // Перевод выбранного юзера в класс исследователи и на роль исследователь
  toResearcher: objId =>
    axios.get(`/${localStorage.getItem('i18nextLng')}/rabotaUchet/toResearcher?obj=${objId}`)
      .then(res => res.data)
};

export const ReadingRoom = {
  // Заточенный апи для заказа требований в чит. зале
  makeOrder: (userId, archiveId, datas) => {
    const fd = new FormData();
    fd.append("userId", String(userId));
    fd.append("archiveId", String(archiveId));
    fd.append("datas", datas);
    return axios.post(`/${localStorage.getItem('i18nextLng')}/readingRoom/makeOrder`, fd)
      .then(res => res.data)
  },
  globalSearch: (searchType, findStr) => {
    return axios.get(`/${localStorage.getItem('i18nextLng')}/globalSearch/${searchType}?findStr=${findStr}`)
      .then(res => res.data)
  }
};




