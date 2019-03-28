import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { reducer as reduxFormReducer } from 'redux-form';
import { routerReducer, routerMiddleware, ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createHashHistory';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import Routers from './Router';
import auth from './auth/authReducer';
import common from './shared/reducers/common';
import readingRoom from './shared/reducers/readingRoom';
import generalData from './shared/reducers/generalData';
import archiveFund from './shared/reducers/archiveFund';
import cubes from './shared/reducers/cubes';
import './shared/utils/axios_config';

const history = createHistory();
const historyMiddleware = routerMiddleware(history);

const reducers = combineReducers({
  auth,
  router: routerReducer,
  form: reduxFormReducer,
  common,
  readingRoom,
  generalData,
  archiveFund,
  cubes
});

export const store = createStore(reducers, {}, composeWithDevTools(applyMiddleware(thunk, historyMiddleware)));

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Routers />
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default App;
