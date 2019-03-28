import {
  GET_CITIES_SUCCESS,
  GET_COUNTRIES_SUCCESS,
  GET_FACTOR_VAL_SUCCESS,
  GET_ALL_TOFI_CONSTANTS,
  GET_PROP_VAL,
  GET_ACCESS_LEVEL, GET_OBJ_VER_SUCCESS, GET_ALL_OBJ_OF_CLS, GET_OBJ_BY_OBJ_VAL, GET_OBJ_CHILDS
} from '../actions/actionTypes';

const initialState = {
  researchTypes: [],
  countriesList: [],
  citiesList: [],
  fundMakerVer: [],
  temporary: {
    nomenDocsList: [
      {
        key: 'first',
        nomenNumb: '1',
        agreementDate: '15-10-2017',
        docsList: 'Перечень-1'
      }
    ],
    nomensList: []
  }
};

export default function generalData(state=initialState, action) {
  switch (action.type) {
    case GET_FACTOR_VAL_SUCCESS:
      return {
        ...state,
        [action.factorVal]: action.data
      };
    case GET_COUNTRIES_SUCCESS:
      return {
        ...state,
        countriesList: action.countriesList
      };
    case GET_CITIES_SUCCESS:
      return {
        ...state,
        citiesList: action.citiesList
      };
    case GET_ALL_TOFI_CONSTANTS:
      return {
        ...state,
        tofiConstants: action.constants
      };
    case GET_PROP_VAL: {
      return {
        ...state,
        [action.propVal]: action.data
      }
    }
    case GET_ACCESS_LEVEL: {
      return {
        ...state,
        'accessLevel': action.payload
      }
    }
    case GET_OBJ_VER_SUCCESS: {
      return {
        ...state,
        [action.objName]: action.verArr
      }
    }
    case GET_ALL_OBJ_OF_CLS: {
      return {
        ...state,
        [action.clsConst]: action.objects
      }
    }
    case GET_OBJ_BY_OBJ_VAL: {
      return {
        ...state,
        [action.reduxName]: action.data
      }
    }

    case GET_OBJ_CHILDS: {
      return {
        ...state,
        [action.objChilds]: action.data
      }
    }

    /*case ADD_TO_NOMENS_LIST: {
      return {
        ...state,
        nomensList: [...state.nomensList, action.nomen]
      }
    }*/
    default: return state;
  }
}
