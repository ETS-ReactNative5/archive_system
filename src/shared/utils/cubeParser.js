import moment from 'moment';
import PropTypes from 'prop-types';
import {map, forEach} from "lodash";
import uuid from "uuid";
import {SYSTEM_LANG_ARRAY} from '../constants/constants'

import {updateCubeData, updateCubeData2} from "../actions/actions";
import {removeFilesWithIdDPV} from "./index";

const oneLevelCopy = (object) => ({...object});

export const parseCube_new = (cubeVal, fixedDim, colDimName, rowDimName, doTable, dpTable, doConst, dpConst) => {
    try {
        const doTableWithProps = doTable.map(item => ({
            ...item,
            props: dpTable.map(oneLevelCopy)
        }));
        cubeVal.forEach(cubeValItem => {
            const prop = doTableWithProps.find(doItem => doItem['id'] === cubeValItem[doConst])['props'].find(dpItem => dpItem['id'] === cubeValItem[dpConst]);
            const propType = prop['typeProp'];
            switch(true) {
                case (propType === 1) :
                    return;
                case (propType === 11 && prop.isUniq === 2):
                    if (cubeValItem['parentDataPropVal']) {
                        prop.complexChildValues.push({
                            value: cubeValItem['idRef'],
                            label: cubeValItem['name'] ? cubeValItem['name'][localStorage.getItem('i18nextLng')] : '',
                            labelFull: cubeValItem['fullName'] ? cubeValItem['fullName'][localStorage.getItem('i18nextLng')] : '',
                            idDataPropVal: cubeValItem['idDataPropVal'],
                            parentDataPropVal: cubeValItem['parentDataPropVal'],
                            propVal: cubeValItem['propVal'],
                            periodType: cubeValItem['periodType'],
                            dbeg: cubeValItem['dbeg'],
                            dend: cubeValItem['dend']
                        })
                    } else {
                        if (cubeValItem['idRef']) {
                            if (!prop.values) prop.values = [];
                            prop.values.push({
                                value: cubeValItem['idRef'],
                                label: cubeValItem['name'] ? cubeValItem['name'][localStorage.getItem('i18nextLng')] : '',
                                labelFull: cubeValItem['fullName'] ? cubeValItem['fullName'][localStorage.getItem('i18nextLng')] : '',
                                idDataPropVal: cubeValItem['idDataPropVal'],
                                propVal: cubeValItem['propVal'],
                                periodType: cubeValItem['periodType'],
                                dbeg: cubeValItem['dbeg'],
                                dend: cubeValItem['dend']
                            })
                        }
                    }
                    break;
                case (propType === 11) :
                    if (cubeValItem['parentDataPropVal']) {
                        prop.complexChildValues = {
                            value: cubeValItem['idRef'],
                            label: cubeValItem['name'] ? cubeValItem['name'][localStorage.getItem('i18nextLng')] : '',
                            labelFull: cubeValItem['fullName'] ? cubeValItem['fullName'][localStorage.getItem('i18nextLng')] : '',
                            idDataPropVal: cubeValItem['idDataPropVal'],
                            parentDataPropVal: cubeValItem['parentDataPropVal'],
                            propVal: cubeValItem['propVal'],
                            periodType: cubeValItem['periodType'],
                            dbeg: cubeValItem['dbeg'],
                            dend: cubeValItem['dend'],
                        }
                    } else {
                        if (cubeValItem['idRef']) {
                            prop.values = {
                                value: cubeValItem['idRef'],
                                label: cubeValItem['name'] ? cubeValItem['name'][localStorage.getItem('i18nextLng')] : '',
                                labelFull: cubeValItem['fullName'] ? cubeValItem['fullName'][localStorage.getItem('i18nextLng')] : '',
                                idDataPropVal: cubeValItem['idDataPropVal'],
                                propVal: cubeValItem['propVal'],
                                periodType: cubeValItem['periodType'],
                                dbeg: cubeValItem['dbeg'],
                                dend: cubeValItem['dend'],
                            };
                        }
                    }
                    break;
                case (propType === 21) :
                    if (cubeValItem['parentDataPropVal']) {

                        prop.complexChildValues = {
                            value: cubeValItem['valueNumb'],
                            measure: cubeValItem['measure'],
                            kFromBase: cubeValItem['kFromBase'],
                            idDataPropVal: cubeValItem['idDataPropVal'],
                            parentDataPropVal: cubeValItem['parentDataPropVal'],
                            periodType: cubeValItem['periodType'],
                            dbeg: cubeValItem['dbeg'],
                            dend: cubeValItem['dend'],
                        }
                    } else {
                        if (cubeValItem['valueNumb']|| cubeValItem['valueNumb'] ==0) {
                            prop.values = {
                                value: cubeValItem['valueNumb'],
                                measure: cubeValItem['measure'],
                                kFromBase: cubeValItem['kFromBase'],
                                idDataPropVal: cubeValItem['idDataPropVal'],
                                periodType: cubeValItem['periodType'],
                                dbeg: cubeValItem['dbeg'],
                                dend: cubeValItem['dend'],
                            }
                        }
                    }
                    break;
                case (propType === 22) :
                    if (cubeValItem['parentDataPropVal']) {
                        prop.complexChildValues = {
                            value: cubeValItem['valueNumb'],
                            measure: cubeValItem['measure'],
                            kFromBase: cubeValItem['kFromBase'],
                            idDataPropVal: cubeValItem['idDataPropVal'],
                            parentDataPropVal: cubeValItem['parentDataPropVal'],
                            periodType: cubeValItem['periodType'],
                            dbeg: cubeValItem['dbeg'],
                            dend: cubeValItem['dend']
                        }
                    } else {
                        if (cubeValItem['valueNumb']) {
                            prop.values = {
                                value: cubeValItem['valueNumb'],
                                measure: cubeValItem['measure'],
                                kFromBase: cubeValItem['kFromBase'],
                                idDataPropVal: cubeValItem['idDataPropVal'],
                                periodType: cubeValItem['periodType'],
                                dbeg: cubeValItem['dbeg'],
                                dend: cubeValItem['dend']
                            }
                        }
                    }
                    break;

                case (propType.toString().startsWith('31')) :
                    switch(propType % 10) {

                        case 1: // свойство типа строка с маской
                        case 5: // свойство типа строка
                            if (prop.isUniq === 2) { // многозначное свойство типа строка
                                if (cubeValItem['parentDataPropVal']) { // ребенок комплексного свойства
                                    prop.complexChildValues.push({
                                        value: cubeValItem['valueStr'][localStorage.getItem('i18nextLng')],
                                        valueLng: cubeValItem['valueStr'],
                                        idDataPropVal: cubeValItem['idDataPropVal'],
                                        parentDataPropVal: cubeValItem['parentDataPropVal'],
                                        periodType: cubeValItem['periodType'],
                                        dbeg: cubeValItem['dbeg'],
                                        dend: cubeValItem['dend']
                                    })
                                } else { // самостоятельное свойство
                                    if (!prop.values) prop.values = [];
                                    cubeValItem['valueStr'] && prop.values.push({
                                        value: cubeValItem['valueStr'][localStorage.getItem('i18nextLng')],
                                        valueLng: cubeValItem['valueStr'],
                                        idDataPropVal: cubeValItem['idDataPropVal'],
                                        periodType: cubeValItem['periodType'],
                                        dbeg: cubeValItem['dbeg'],
                                        dend: cubeValItem['dend']
                                    });
                                }
                            } else { // однозначное свойство типа строка
                                if (cubeValItem['parentDataPropVal']) { // ребенок комплексного свойства
                                    prop.complexChildValues = {
                                        value: cubeValItem['valueStr'][localStorage.getItem('i18nextLng')],
                                        valueLng: cubeValItem['valueStr'],
                                        idDataPropVal: cubeValItem['idDataPropVal'],
                                        parentDataPropVal: cubeValItem['parentDataPropVal'],
                                        periodType: cubeValItem['periodType'],
                                        dbeg: cubeValItem['dbeg'],
                                        dend: cubeValItem['dend']
                                    }
                                } else { // самостоятельное свойство
                                    if (cubeValItem['valueStr']) prop.values = {
                                        value: cubeValItem['valueStr'][localStorage.getItem('i18nextLng')],
                                        valueLng: cubeValItem['valueStr'],
                                        idDataPropVal: cubeValItem['idDataPropVal'],
                                        periodType: cubeValItem['periodType'],
                                        dbeg: cubeValItem['dbeg'],
                                        dend: cubeValItem['dend']
                                    }
                                }
                            }
                            break;
                        case 2: // свойство типа дата
                            if (prop.isUniq === 2) { // многозначное свойство типа дата
                                if (cubeValItem['parentDataPropVal']) { // ребенок комплексного свойства
                                    prop.complexChildValues.push({
                                        value: moment(cubeValItem['valueDateTime'], 'YYYY-MM-DD').isValid() ? moment(cubeValItem['valueDateTime'], 'YYYY-MM-DD').format('DD-MM-YYYY') : '',
                                        idDataPropVal: cubeValItem['idDataPropVal'],
                                        parentDataPropVal: cubeValItem['parentDataPropVal'],
                                        periodType: cubeValItem['periodType'],
                                        dbeg: cubeValItem['dbeg'],
                                        dend: cubeValItem['dend']
                                    })
                                } else { // самостоятельное свойство
                                    if (!prop.values) prop.values = [];
                                    cubeValItem['valueDateTime'] && prop.values.push({
                                        value: moment(cubeValItem['valueDateTime'], 'YYYY-MM-DD').isValid() ? moment(cubeValItem['valueDateTime'], 'YYYY-MM-DD').format('DD-MM-YYYY') : '',
                                        idDataPropVal: cubeValItem['idDataPropVal'],
                                        periodType: cubeValItem['periodType'],
                                        dbeg: cubeValItem['dbeg'],
                                        dend: cubeValItem['dend']
                                    });
                                }
                            } else { // однозначное свойство типа дата;
                                if (cubeValItem['parentDataPropVal']) { // ребенок комплексного свойства
                                    prop.complexChildValues = {
                                        value: moment(cubeValItem['valueDateTime'], 'YYYY-MM-DD').isValid() ? moment(cubeValItem['valueDateTime'], 'YYYY-MM-DD').format('DD-MM-YYYY') : '',
                                        idDataPropVal: cubeValItem['idDataPropVal'],
                                        parentDataPropVal: cubeValItem['parentDataPropVal'],
                                        periodType: cubeValItem['periodType'],
                                        dbeg: cubeValItem['dbeg'],
                                        dend: cubeValItem['dend']
                                    }
                                } else { // самостоятельное свойство

                                    if (cubeValItem['valueDateTime']) prop.values = {
                                        value: moment(cubeValItem['valueDateTime'], 'YYYY-MM-DD').isValid() ? moment(cubeValItem['valueDateTime'], 'YYYY-MM-DD').format('DD-MM-YYYY') : '',
                                        idDataPropVal: cubeValItem['idDataPropVal'],
                                        periodType: cubeValItem['periodType'],
                                        dbeg: cubeValItem['dbeg'],
                                        dend: cubeValItem['dend']
                                    }
                                }
                            }
                            break;
                        case 3: //свойство типа время
                            if (prop.isUniq === 2) { // многозначное свойство типа время
                                if (cubeValItem['parentDataPropVal']) { // ребенок комплексного свойства
                                    prop.complexChildValues.push({
                                        value: moment(cubeValItem['valueDateTime'], 'HH:mm:ss').isValid() ? moment(cubeValItem['valueDateTime'], 'HH:mm:ss').format('HH:mm:ss') : '',
                                        idDataPropVal: cubeValItem['idDataPropVal'],
                                        parentDataPropVal: cubeValItem['parentDataPropVal'],
                                        periodType: cubeValItem['periodType'],
                                        dbeg: cubeValItem['dbeg'],
                                        dend: cubeValItem['dend']
                                    })
                                } else { // самостоятельное свойство
                                    if (!prop.values) prop.values = [];
                                    cubeValItem['valueDateTime'] && prop.values.push({
                                        value: moment(cubeValItem['valueDateTime'], 'HH:mm:ss').isValid() ? moment(cubeValItem['valueDateTime'], 'HH:mm:ss').format('HH:mm:ss') : '',
                                        idDataPropVal: cubeValItem['idDataPropVal'],
                                        periodType: cubeValItem['periodType'],
                                        dbeg: cubeValItem['dbeg'],
                                        dend: cubeValItem['dend']
                                    });
                                }
                            } else { // однозначное свойство типа время
                                if (cubeValItem['parentDataPropVal']) { // ребенок комплексного свойства
                                    prop.complexChildValues = {
                                        value: moment(cubeValItem['valueDateTime'], 'HH:mm:ss').isValid() ? moment(cubeValItem['valueDateTime'], 'HH:mm:ss').format('HH:mm:ss') : '',
                                        idDataPropVal: cubeValItem['idDataPropVal'],
                                        parentDataPropVal: cubeValItem['parentDataPropVal'],
                                        periodType: cubeValItem['periodType'],
                                        dbeg: cubeValItem['dbeg'],
                                        dend: cubeValItem['dend']
                                    }
                                } else { // самостоятельное свойство
                                    if (cubeValItem['valueStr']) prop.values = {
                                        value: moment(cubeValItem['valueDateTime'], 'HH:mm:ss').isValid() ? moment(cubeValItem['valueDateTime'], 'HH:mm:ss').format('HH:mm:ss') : '',
                                        idDataPropVal: cubeValItem['idDataPropVal'],
                                        periodType: cubeValItem['periodType'],
                                        dbeg: cubeValItem['dbeg'],
                                        dend: cubeValItem['dend']
                                    }
                                }
                            }
                            break;
                        case 4: // свойство типа дата-время
                            if (prop.isUniq === 2) { // многозначное свойство типа дата-время
                                if (cubeValItem['parentDataPropVal']) { // ребенок комплексного свойства
                                    prop.complexChildValues.push({
                                        value: moment(cubeValItem['valueDateTime'], 'YYYY-MM-DD HH:mm:ss').isValid() ? moment(cubeValItem['valueDateTime'], 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY HH:mm:ss') : '',
                                        idDataPropVal: cubeValItem['idDataPropVal'],
                                        parentDataPropVal: cubeValItem['parentDataPropVal'],
                                        periodType: cubeValItem['periodType'],
                                        dbeg: cubeValItem['dbeg'],
                                        dend: cubeValItem['dend']
                                    })
                                } else { // самостоятельное свойство
                                    if (!prop.values) prop.values = [];
                                    cubeValItem['valueStr'] && prop.values.push({
                                        value: moment(cubeValItem['valueDateTime'], 'YYYY-MM-DD HH:mm:ss').isValid() ? moment(cubeValItem['valueDateTime'], 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY HH:mm:ss') : '',
                                        idDataPropVal: cubeValItem['idDataPropVal'],
                                        periodType: cubeValItem['periodType'],
                                        dbeg: cubeValItem['dbeg'],
                                        dend: cubeValItem['dend']
                                    });
                                }
                            } else { // однозначное свойство типа дата-время
                                if (cubeValItem['parentDataPropVal']) { // ребенок комплексного свойства
                                    prop.complexChildValues = {
                                        value: moment(cubeValItem['valueDateTime'], 'YYYY-MM-DD HH:mm:ss').isValid() ? moment(cubeValItem['valueDateTime'], 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY HH:mm:ss') : '',
                                        idDataPropVal: cubeValItem['idDataPropVal'],
                                        parentDataPropVal: cubeValItem['parentDataPropVal'],
                                        periodType: cubeValItem['periodType'],
                                        dbeg: cubeValItem['dbeg'],
                                        dend: cubeValItem['dend']
                                    }
                                } else { // самостоятельное свойство
                                    if (cubeValItem['valueStr']) prop.values = {
                                        value: moment(cubeValItem['valueDateTime'], 'YYYY-MM-DD HH:mm:ss').isValid() ? moment(cubeValItem['valueDateTime'], 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY HH:mm:ss') : '',
                                        idDataPropVal: cubeValItem['idDataPropVal'],
                                        periodType: cubeValItem['periodType'],
                                        dbeg: cubeValItem['dbeg'],
                                        dend: cubeValItem['dend']
                                    }
                                }
                            }
                            break;
                        case 7: // свойство типа файл
                            if (prop.isUniq === 2) { // многозначное свойство типа файл
                                if (!prop.values) prop.values = [];
                                if (cubeValItem['valueFile']) { // есть значение
                                    const id = cubeValItem['valueFile'][localStorage.getItem('i18nextLng')];
                                    const f = new File([id], id);
                                    f.uid = `rc-upload-${id}`;
                                    if (cubeValItem['parentDataPropVal']) { // ребенок комплексного свойства
                                        if (!prop.complexMultiValues[cubeValItem['parentDataPropVal'] + '_' + cubeValItem[dpConst]]) prop.complexMultiValues[cubeValItem['parentDataPropVal'] + '_' + cubeValItem[dpConst]] = [];
                                        prop.complexMultiValues[cubeValItem['parentDataPropVal'] + '_' + cubeValItem[dpConst]].push({
                                            value: f,
                                            idDataPropVal: cubeValItem['idDataPropVal'],
                                            parentDataPropVal: cubeValItem['parentDataPropVal'],
                                            periodType: cubeValItem['periodType'],
                                            dbeg: cubeValItem['dbeg'],
                                            dend: cubeValItem['dend']
                                        });
                                        prop.complexChildValues = {
                                            values: prop.complexMultiValues[cubeValItem['parentDataPropVal'] + '_' + cubeValItem[dpConst]]
                                        }
                                    } else { // самостоятельное свойство
                                        prop.values.push({
                                            value: f,
                                            idDataPropVal: cubeValItem['idDataPropVal'],
                                            periodType: cubeValItem['periodType'],
                                            dbeg: cubeValItem['dbeg'],
                                            dend: cubeValItem['dend']
                                        });
                                    }
                                }
                            } else { // однозначное свойство типа файл
                                if (cubeValItem['valueFile']) { // есть значение
                                    const id = cubeValItem['valueFile'][localStorage.getItem('i18nextLng')];
                                    const f = new File([id], id);
                                    f.uid = `rc-upload-${id}`;
                                    if (cubeValItem['parentDataPropVal']) {
                                        prop.complexChildValues = {
                                            value: f,
                                            idDataPropVal: cubeValItem['idDataPropVal'],
                                            parentDataPropVal: cubeValItem['parentDataPropVal'],
                                            periodType: cubeValItem['periodType'],
                                            dbeg: cubeValItem['dbeg'],
                                            dend: cubeValItem['dend']
                                        }
                                    } else {
                                        prop.values = {
                                            value: f,
                                            idDataPropVal: cubeValItem['idDataPropVal'],
                                            periodType: cubeValItem['periodType'],
                                            dbeg: cubeValItem['dbeg'],
                                            dend: cubeValItem['dend']
                                        }
                                    }
                                }
                            }
                            break;
                        default:
                            break;
                    }
                    break;
                case (propType === 41 && prop.isUniq === 2): // многозначное свойство типа объект
                    if (cubeValItem['parentDataPropVal']) { // ребенок комплексного свойства
                        prop.complexChildValues.push({
                            value: cubeValItem['idRef'],
                            label: cubeValItem['name'] ? cubeValItem['name'][localStorage.getItem('i18nextLng')] : '',
                            labelFull: cubeValItem['fullName'] ? cubeValItem['fullName'][localStorage.getItem('i18nextLng')] : '',
                            idDataPropVal: cubeValItem['idDataPropVal'],
                            parentDataPropVal: cubeValItem['parentDataPropVal'],
                            propVal: cubeValItem['propVal'],
                            periodType: cubeValItem['periodType'],
                            dbeg: cubeValItem['dbeg'],
                            dend: cubeValItem['dend']
                        })
                    } else { // самостоятельное свойство
                        if (cubeValItem['idRef']) {
                            if (!prop.values) prop.values = [];
                            prop.values.push({
                                value: cubeValItem['idRef'],
                                label: cubeValItem['name'] ? cubeValItem['name'][localStorage.getItem('i18nextLng')] : '',
                                labelFull: cubeValItem['fullName'] ? cubeValItem['fullName'][localStorage.getItem('i18nextLng')] : '',
                                idDataPropVal: cubeValItem['idDataPropVal'],
                                propVal: cubeValItem['propVal'],
                                periodType: cubeValItem['periodType'],
                                dbeg: cubeValItem['dbeg'],
                                dend: cubeValItem['dend']
                            })
                        }
                    }
                    break;
                case (propType === 41) : // однозначное свойство типа объект
                    if (cubeValItem['parentDataPropVal']) { // ребенок комплексного свойства
                        prop.complexChildValues = {
                            value: cubeValItem['idRef'],
                            label: cubeValItem['name'] ? cubeValItem['name'][localStorage.getItem('i18nextLng')] : '',
                            labelFull: cubeValItem['fullName'] ? cubeValItem['fullName'][localStorage.getItem('i18nextLng')] : '',
                            idDataPropVal: cubeValItem['idDataPropVal'],
                            parentDataPropVal: cubeValItem['parentDataPropVal'],
                            propVal: cubeValItem['propVal'],
                            periodType: cubeValItem['periodType'],
                            dbeg: cubeValItem['dbeg'],
                            dend: cubeValItem['dend']
                        }
                    } else { // самостоятельное свойство
                        if (cubeValItem['idRef']) {
                            prop.values = {
                                value: cubeValItem['idRef'],
                                label: cubeValItem['name'] ? cubeValItem['name'][localStorage.getItem('i18nextLng')] : '',
                                labelFull: cubeValItem['fullName'] ? cubeValItem['fullName'][localStorage.getItem('i18nextLng')] : '',
                                idDataPropVal: cubeValItem['idDataPropVal'],
                                propVal: cubeValItem['propVal'],
                                periodType: cubeValItem['periodType'],
                                dbeg: cubeValItem['dbeg'],
                                dend: cubeValItem['dend']
                            };
                        }
                    }
                    break;
                case (propType === 51 && prop.isUniq === 2) : // многозначное свойство типа отношение между объектами
                    if (cubeValItem['parentDataPropVal']) { // ребенок комплексного свойства
                        prop.complexChildValues.push({
                            value: cubeValItem['idRef'],
                            label: cubeValItem['name'] ? cubeValItem['name'][localStorage.getItem('i18nextLng')] : '',
                            labelFull: cubeValItem['fullName'] ? cubeValItem['fullName'][localStorage.getItem('i18nextLng')] : '',
                            idDataPropVal: cubeValItem['idDataPropVal'],
                            parentDataPropVal: cubeValItem['parentDataPropVal'],
                            propVal: cubeValItem['propVal'],
                            periodType: cubeValItem['periodType'],
                            dbeg: cubeValItem['dbeg'],
                            dend: cubeValItem['dend']
                        })
                    } else { // самостоятельное свойство
                        if (cubeValItem['idRef']) {
                            if (!prop.values) prop.values = [];
                            prop.values.push({
                                value: cubeValItem['idRef'],
                                label: cubeValItem['name'] ? cubeValItem['name'][localStorage.getItem('i18nextLng')] : '',
                                labelFull: cubeValItem['fullName'] ? cubeValItem['fullName'][localStorage.getItem('i18nextLng')] : '',
                                idDataPropVal: cubeValItem['idDataPropVal'],
                                propVal: cubeValItem['propVal'],
                                periodType: cubeValItem['periodType'],
                                dbeg: cubeValItem['dbeg'],
                                dend: cubeValItem['dend']
                            })
                        }
                    }
                    break;
                case (propType === 51) : // однозначное свойство типа отношение между объектами
                    if (cubeValItem['parentDataPropVal']) { // ребенок комплексного свойства
                        prop.complexChildValues = {
                            value: cubeValItem['idRef'],
                            label: cubeValItem['name'] ? cubeValItem['name'][localStorage.getItem('i18nextLng')] : '',
                            labelFull: cubeValItem['fullName'] ? cubeValItem['fullName'][localStorage.getItem('i18nextLng')] : '',
                            idDataPropVal: cubeValItem['idDataPropVal'],
                            parentDataPropVal: cubeValItem['parentDataPropVal'],
                            propVal: cubeValItem['propVal'],
                            periodType: cubeValItem['periodType'],
                            dbeg: cubeValItem['dbeg'],
                            dend: cubeValItem['dend']
                        }
                    } else { // самостоятельное свойство
                        if (cubeValItem['idRef']) {
                            prop.values = {
                                value: cubeValItem['idRef'],
                                label: cubeValItem['name'] ? cubeValItem['name'][localStorage.getItem('i18nextLng')] : '',
                                labelFull: cubeValItem['fullName'] ? cubeValItem['fullName'][localStorage.getItem('i18nextLng')] : '',
                                idDataPropVal: cubeValItem['idDataPropVal'],
                                propVal: cubeValItem['propVal'],
                                periodType: cubeValItem['periodType'],
                                dbeg: cubeValItem['dbeg'],
                                dend: cubeValItem['dend']
                            };
                        }
                    }
                    break;
                case (propType === 61) : // свойство типа единица измерения
                    prop.value = 'measure';
                    break;
                case (propType === 71 && prop.isUniq === 2): // многозначное комплексное свойство
                    if (cubeValItem['valueStr']) {
                        if (!prop.values) prop.values = [];
                        cubeValItem['valueStr'] && prop.values.push({
                            value: cubeValItem['valueStr'][localStorage.getItem('i18nextLng')],
                            valueLng: cubeValItem['valueStr'],
                            idDataPropVal: (cubeValItem['idDataPropVal'] || '')
                        })
                    }
                    break;
                case (propType === 71) : // однозначное комплексное свойство
                    prop.values = {
                        value: cubeValItem['valueStr'] ? cubeValItem['valueStr'][localStorage.getItem('i18nextLng')] : '',
                        valueLng: cubeValItem['valueStr'] ? cubeValItem['valueStr'] : null,
                        idDataPropVal: (cubeValItem['idDataPropVal'] || '')
                    };
                    break;
                default:
                    return;
            }
        });
        console.log('doTableWithProps', doTableWithProps);
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
    const keys = constArr ? constArr : Object.keys(tofiConstants);
    try {
        props.forEach(dp => {
            const c = keys.find(c => tofiConstants[c].cod === `_P_${dp.prop}`);
            if (c) {
                if (dp.complexChildValues) {
                    result[c] = dp.complexChildValues;
                } else {
                    if (dp.values) {
                        if (dp.propItem){
                            const con = keys.find(c => tofiConstants[c].id === dp.propItem);
                            result[con] = dp.values;
                        }else{
                            result[c] = dp.values;

                        }
                    } else {
                        c in result ?"" : result[c] = null;

                    }
                }
                /*
                 if (dp.isUniq === 1) {
                 switch (dp.typeProp) {
                 case 11: {
                 result[c] = dp.refId ? {value: dp.refId, label: dp.value, idDataPropVal:dp.idDataPropVal, parentDataPropVal: dp.parentDataPropVal} : null;
                 break;
                 }
                 case 312: {
                 result[c] = dp.value ? {value:moment(dp.value, 'DD-MM-YYYY'), idDataPropVal:dp.idDataPropVal, parentDataPropVal: dp.parentDataPropVal} : null;
                 break;
                 }
                 case 41: {
                 result[c] = dp.cube && dp.cube.idRef ? {value: dp.cube.idRef, label: dp.value, idDataPropVal:dp.idDataPropVal, parentDataPropVal: dp.parentDataPropVal} : null;
                 break;
                 }
                 default: {
                 result[c] = dp.value ? {value: dp.value, idDataPropVal:dp.idDataPropVal, parentDataPropVal: dp.parentDataPropVal} : '';
                 result[c + 'Lng'] = dp.valueLng ? {value:dp.valueLng, idDataPropVal:dp.idDataPropVal, parentDataPropVal: dp.parentDataPropVal} : {kz: '', ru: '', en: ''};
                 break;
                 }
                 }
                 } else if (dp.isUniq === 2) {
                 //console.log(dp);
                 //withIdDPV[c] = dp.idDataPropVal;
                 switch (dp.typeProp) {
                 default:
                 result[c] = dp.values ? {value:dp.values, idDataPropVal: dp.idDataPropVal, parentDataPropVal: dp.parentDataPropVal} : [];
                 }
                 }
                 */
            }
        });
        //console.log(result);
        //  return withIdDPV;
    } catch(e) {
        console.warn(e);
        console.log('No such constants', constArr.filter(c => !tofiConstants[c]));
    }
};

export const getPropMeta = (cubeProps, cnst) => {
    try {
        return cubeProps.find(prop => prop.prop === cnst.id);

    } catch(err) {
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

/*
export function onSaveCubeData({cube, obj},
{values, complex, oFiles = {}, qFiles = {}, idDPV = {}},
tofiConstants,
objData = {},
periods,
dte = moment().format('YYYY-MM-DD'),
options = {}) {
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
        periods: periods || [{periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31'}]
    }];

    function buildProps(val, key) {
        const propMetaData = getPropMeta(cube.data["dp_" + tofiConstants[cube.dpConst].id], tofiConstants[key]);
        let value = val;
        try {
            if ((propMetaData.typeProp === 315 || propMetaData.typeProp === 311 || propMetaData.typeProp === 317) && typeof val === 'string') value = {
                kz: val,
                ru: val,
                en: val
            };
            if (propMetaData.typeProp === 312) value = moment(val).format('YYYY-MM-DD');
            if (val && typeof val === 'object' && val.value) value = String(val.value);
            if (val && typeof val === 'object' && val.mode) propMetaData.mode = val.mode;
            if (propMetaData.isUniq === 2 && val[0] && val[0].value) {
                propMetaData.mode = val[0].mode;
                value = val.map(v => String(v.value)).join(",");
            }
        } catch(e) {
            console.warn(key, val);
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
*/

export function onSaveCubeData({cube, obj},{values, complex, oFiles = {}, qFiles = {}},
tofiConstants,
objData = {},
periods,
dte = moment().format('YYYY-MM-DD'),
options = {}) {

    var test = Object.entries(oFiles);

    let testObj={};


    for (let i=0; i<test.length;i++){
       if(!!test[i][1]) {
         testObj[test[i][0]]=[];
         var vv=test[i][1].map(el=>{return !el.idDataPropVal ? el.value:el});
         var newVV=[];
            vv.forEach((item,i,arr) =>{
                if(item instanceof File){
                    newVV.push(item);
                }
            });
           testObj[test[i][0]]=newVV;
       }
    }



    const files = {...testObj};


    forEach(qFiles, (val, key) => {
        files[`__Q__${key}`] = val;
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
            mode:mode ? mode:'ins',
            child: map(values, buildProps)
        }
    });

    const datas = [{
        own: [{doConst: cube.doConst, doItem: obj.doItem, isRel: "0", objData}],
        props: [...valuesArr, ...complexArr],
        periods: periods || [{periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31'}]
    }];

    function buildProps(val, key) {
         const propMetaData = getPropMeta(cube.data["dp_" + tofiConstants[cube.dpConst].id], tofiConstants[key]);
        if (propMetaData === undefined){
            if(!!tofiConstants[key]){
                let idPropitem = tofiConstants[key].id
                let props =cube.data["dp_" + tofiConstants[cube.dpConst].id].find(el => el.propItem === idPropitem)
                let propcConst
                for (let keys in tofiConstants){
                    if(tofiConstants[keys].id === props.prop){
                        propcConst = keys
                        break
                    }

                }

                if (!!idPropitem && !!props && !!propcConst){
                    if (!!val.value){

                    }else {
                        val.mode= "del"
                    }
                    return {
                        propConst: propcConst,
                        propItemConst:key,
                        val: val.value,
                        idDataPropVal: val.idDataPropVal,
                        typeProp: String(props.typeProp),
                        periodDepend: String(props.periodDepend),
                        isUniq: String(props.isUniq),
                        //periodType: periodType,
                        //dBeg: dBeg,
                        //dEnd: dEnd,
                        mode: val.mode ? val.mode : val.idDataPropVal ? 'upd' : 'ins'
                    }
                }
            }

        }
        let value = val;
        try {
            if (propMetaData.isUniq===1 && (propMetaData.typeProp === 315 || propMetaData.typeProp === 311 || propMetaData.typeProp === 317)) {

                if (!!val.value) {

                } else {
                    val.mode = "del"
                }
                value = {
                    kz: !!val.valueLng.kz ? val.valueLng.kz : val.value,
                    ru: !!val.valueLng.ru ? val.valueLng.ru : val.value,
                    en: !!val.valueLng.en ? val.valueLng.en : val.value
                };
            }
            if (propMetaData.isUniq===2 && propMetaData.typeProp===315){
                let values = []
                for (let item of value){
                    let mode =""
                    if (!!item.value.idDataPropVal && !!item.value.value ){
                        mode="upd"
                    }else {
                        if (!!item.value.value){
                            mode="ins"
                        }else {
                            mode="del"
                        }
                    }
                    let newob = {
                        val: item.value.value,
                        idDataPropVal:item.value.idDataPropVal?item.value.idDataPropVal:"",
                        mode:mode
                    }
                    values.push(newob)
                }
                return {
                    propConst: key,
                    values: values,
                    typeProp: String(propMetaData.typeProp),
                    periodDepend: String(propMetaData.periodDepend),
                    isUniq: String(propMetaData.isUniq),
                    //periodType: periodType,
                    //dBeg: dBeg,
                    //dEnd: dEnd,
                }


            }
            if ((propMetaData.typeProp === 11 || propMetaData.typeProp === 41) && (propMetaData.isUniq==1)) {

                value = !!val.value ? String(val.value):String(val);
                if (!!value){

                }else{
                    val.mode= "del"
                }
            }
            if(propMetaData.typeProp === 312){

                if(val instanceof  moment){
                    value = val.value? moment(val.value).format('YYYY-MM-DD'):moment(val).format('YYYY-MM-DD')

                }else {
                    value= val.value? moment(val.value,'DD-MM-YYYY').format('YYYY-MM-DD'): val[2]=='-' ? moment(val,'DD-MM-YYYY').format('YYYY-MM-DD') : val

                }
                if (!!value){

                }else{
                    val.mode= "del"
                }
            }
            if (((propMetaData.typeProp === 11) && (propMetaData.isUniq==2)) || ((propMetaData.typeProp === 41) && (propMetaData.isUniq==2))) {
                var valuesStrMulti=val.map(el=>el.value);
                var idDpvMulti=val.map(el=>{return !!el.idDataPropVal ? el.idDataPropVal :''});
                value = valuesStrMulti.join(',');
                val.idDataPropVal=idDpvMulti;
                if (!!value){

                }else{
                    val.mode= "del"
                }
            }

            if(propMetaData.typeProp === 21){

                 value=val && val.value;
                if (!!value){

                }else{
                    val.mode= "del"
                }
            }

        } catch(e) {
            console.warn(key, val);
            console.warn(e);
            return;
        }
        return {
            propConst: key,
            val: value,
            idDataPropVal: val.idDataPropVal,
            typeProp: String(propMetaData.typeProp),
            periodDepend: String(propMetaData.periodDepend),
            isUniq: String(propMetaData.isUniq),
            //periodType: periodType,
            //dBeg: dBeg,
            //dEnd: dEnd,
            mode: val.mode? val.mode: val.idDataPropVal  ? 'upd' : 'ins'
        }
    }

    return updateCubeData2(cube.cubeSConst, dte, JSON.stringify(datas), options, filesToServer)
}
