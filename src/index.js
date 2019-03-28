import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './shared/assets/css/index.css';
import { LocaleProvider } from 'antd';
import ru from 'antd/lib/locale-provider/ru_RU';
import 'moment/locale/en-gb';
import 'moment/locale/kk';
import 'moment/locale/ru';

import './shared/utils/i18n';

ReactDOM.render(
  <LocaleProvider locale={ru}>
    <App />
  </LocaleProvider>, document.getElementById('root'));
