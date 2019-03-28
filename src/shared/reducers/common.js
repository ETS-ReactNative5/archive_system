import {
  LOGIN_SUCCESS,
  SIGNUP_SUCCESS,
  REDIRECT,
  LOGIN_FAILED,
  LOGOUT_SUCCESS,
  GLOBAL_ERROR
} from '../actions/actionTypes';

const initialState = {
  appName: '',
  viewChangeCounter: 0,
  globalError: ''
};

export default function common(state=initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
    case SIGNUP_SUCCESS:
    case LOGOUT_SUCCESS:
      return {
        ...state,
        redirectTo: '/'
      };
    case REDIRECT:
      return { ...state, redirectTo: null };
    case LOGIN_FAILED:
      return state;
    case GLOBAL_ERROR:
      return {
        ...state,
        globalError: action.text
      };
    default: return state;
  }
}
