import {
  GET_ARCHIVE_FUND_LIST_SUCCESS, GET_AFCUBE_SUCCESS
} from '../actions/actionTypes';

const initialState = {}
;

export default function archiveFund(state=initialState, action) {
  switch (action.type) {
    case GET_ARCHIVE_FUND_LIST_SUCCESS:
      return {
        ...state,
        archiveFundList: action.data
      };
    case GET_AFCUBE_SUCCESS:
      return {
        ...state,
        [action.name]: action.cube
      };
    default: return state;
  }
}
