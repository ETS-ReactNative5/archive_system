import { GET_CUBE_SUCCESS } from '../actions/actionTypes';

export default (state={worksSourcingTestData: [], worksArchiveTestData: []}, action) => {
  switch (action.type) {
    case GET_CUBE_SUCCESS: {
      if(action.options.customKey) {
        return {
          ...state,
          [action.options.customKey]: {...action.cube, parent: action.options.parent}
        }
      }
      return {
        ...state,
        [action.cubeConst]: {...action.cube}
      }
    }
    case 'addTestDataSourcing': {
      return {
        ...state,
        worksSourcingTestData: action.testData.slice()
      }
    }
    case 'addTestDataArchive': {
      return {
        ...state,
        worksArchiveTestData: action.testData.slice()
      }
    }
    default: return state;
  }
}
