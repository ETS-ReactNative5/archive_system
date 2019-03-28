import {
  ADD_CASE_TO_BASKET, CHANGE_CASE_IN_BASKET, CLEAR_BASKET,
  GET_RRCUBE_SUCCESS,
  AUTO_ADD_CASE,
  REMOVE_CASE_FROM_BASKET
} from '../actions/actionTypes';

const initialState = {
  funds: {},
  inventories: {},
  cases: {},
  basket: []
};

export default function readingRoom(state=initialState, action) {
  switch (action.type) {
    case GET_RRCUBE_SUCCESS:
      return {
        ...state,
        [action.name]: action.cube
      };
    case ADD_CASE_TO_BASKET:
      return {
        ...state,
        basket: [...state.basket, action.selectedCase]
      };
    case CHANGE_CASE_IN_BASKET:
      const newBasket = state.basket.slice();
      const theCaseIndex = state.basket.slice().findIndex(el => el.key === action.selectedCase.key);
      newBasket[theCaseIndex] = action.selectedCase;
      if(~theCaseIndex) {
        return {
          ...state,
          basket: newBasket
        };
      }
      break;
    case CLEAR_BASKET:
      return {...state, basket: []};
    case REMOVE_CASE_FROM_BASKET:
      return {
        ...state,
        basket: state.basket.filter(elem => elem.key !== action.selectedCase.key)
      };
      case AUTO_ADD_CASE:
      return{
          ...state,
          basket: action.baskets
      }

    default: return state;
  }
}
