import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Switch, Route, Redirect} from 'react-router-dom';
import { push } from 'react-router-redux';
import { Modal, Spin, message } from 'antd';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import Loadable from 'react-loadable';

import { store } from '../../App'
import Header from '../components/Header';
import Sider2 from '../components/Sider2';
import HeroScreen from '../containers/HeroScreen';
import Footer from '../components/Footer';
import {redirect, onAppLoad, getAllConstants, loginSesion, getAccessLevels} from '../actions/actions';
// import LeaderWorkplace from '../containers/LeaderWorkplace';
// import ForgotPassword from '../containers/ForgotPassword';
import Viewer from "../components/Viewer";
import UsersRoles from "../components/AdministrationPages/usersRoles/index";
import forgot_password from "../components/forgot_password";

let AsyncSignupForm,
  AsyncECP_Form,
  AsyncLoginScreen,
  AsyncProfileScreen,
  AsyncNSA,
  AsyncSourcing,
  AsyncUsesRoutes,
  AsyncArchiveFundRoutes,
  AsyncManagingRoutes,
  AsyncWorksRoutes,
  AsyncAdminRoutes;
try {
  AsyncSignupForm = Loadable({
    loader: () => import('../../auth/components/signupFormCard/SignupForm'),
    loading: () => <Spin style={{ position: 'absolute', left: '50%', top: '50%', transform: "translateX(-50%)" }}/>
  });
  AsyncECP_Form = Loadable({
    loader: () => import('../../auth/components/ECP_Form'),
    loading: () => <Spin style={{ position: 'absolute', left: '50%', top: '50%', transform: "translateX(-50%)" }}/>
  });
  AsyncLoginScreen = Loadable({
    loader: () => import('../../auth/LoginScreen'),
    loading: () => <Spin style={{ position: 'absolute', left: '50%', top: '50%', transform: "translateX(-50%)" }}/>
  });
  AsyncProfileScreen = Loadable({
    loader: () => import('../containers/ProfileScreen'),
    loading: () => <Spin style={{ position: 'absolute', left: '50%', top: '50%', transform: "translateX(-50%)" }}/>
  });
  AsyncNSA = Loadable({
    loader: () => import('../containers/NSA'),
    loading: () => <Spin style={{ position: 'absolute', left: '50%', top: '50%', transform: "translateX(-50%)" }}/>
  });
  AsyncSourcing = Loadable({
    loader: () => import('../containers/Sourcing'),
    loading: () => <Spin style={{ position: 'absolute', left: '50%', top: '50%', transform: "translateX(-50%)" }}/>
  });
  AsyncUsesRoutes = Loadable({
    loader: () => import('../components/ReadingRoomPages/UsesRoutes'),
    loading: () => <Spin style={{ position: 'absolute', left: '50%', top: '50%', transform: "translateX(-50%)" }}/>
  });
  AsyncArchiveFundRoutes = Loadable({
    loader: () => import('../components/ArchiveFundPages/ArchiveFundRoutes'),
    loading: () => <Spin style={{ position: 'absolute', left: '50%', top: '50%', transform: "translateX(-50%)" }}/>
  });
  AsyncManagingRoutes = Loadable({
    loader: () => import('../components/ManagingPages/ManagingRoutes'),
    loading: () => <Spin style={{ position: 'absolute', left: '50%', top: '50%', transform: "translateX(-50%)" }}/>
  });
  AsyncWorksRoutes = Loadable({
    loader: () => import('../components/WorksRoutes.js'),
    loading: () => <Spin style={{ position: 'absolute', left: '50%', top: '50%', transform: "translateX(-50%)" }}/>
  });
  AsyncAdminRoutes = Loadable({
    loader: () => import('../components/AdministrationPages/AdminRoutes'),
    loading: () => <Spin style={{ position: 'absolute', left: '50%', top: '50%', transform: "translateX(-50%)" }}/>
  });
} catch (e) {
  console.warn(e)
}

class CollectionsLayout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collections: []
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.redirectTo) {
      store.dispatch(push(nextProps.redirectTo));
      this.props.redirect();
    }
    if(nextProps.globalError) {
      Modal.error({
        title: nextProps.globalError
      })
    }
  }

  // Server should send an error message?u
  async componentDidMount () {
/*
   this.props.onAppLoad()
      .catch(err => console.error(err));
*/
      if (sessionStorage.getItem("key")){
          let user = JSON.parse(sessionStorage.getItem('key'))
          this.props.loginSesion(user)
      }

    const hideLoading = message.loading('Загрузка констант', 0);
    await Promise.all([
      this.props.getAllConstants(),
      this.props.getAccessLevels()
    ]);
    hideLoading();
  }

  getCollections = (t) => {
    return [
      {
        name: t('ACQUISITION'), //Комплектование
        pathStart: '/sourcing',
        iconType: 'solution',
        priv: 'acquisition',
        children: [
          {
            name: t('FUNDMAKERS'), // Фондообразователи
            path: '/sourcing/fundMaker',
            priv: 'fundmakers'
          },
          {
            name: t('SOURCE_ACQUISITION'), // Источники комплектования
            path: '/sourcing/sourcesMaintenance',
            priv: 'sourceacquisition'
          },
          {
            name: t('RECEIVING_SCHEDULE'), // График приема архивных документов
            path: '/sourcing/schedule',
            priv: 'receivingschedule'
          },
          {
            name: t('INSPECTION_PLAN'), // План проверки источников комплектования
            path: '/sourcing/checking',
            priv: 'inspectionplan'
          },
          {
            name: t('ACQUISITION_REPORTS'), // Отчеты по комплектованию
            path: '/sourcing/reports',
            priv: 'acquisitionreport'
          }
        ]
      },
      {
        name: t('STORAGE'), // Учет и хранение
        iconType: 'check-circle-o',
        pathStart: '/archiveFund',
        priv: 'storage',
        children: [
          {
            name: t('FUNDS'), // Архивные фонды
            path: '/archiveFund/fundsList',
            priv: 'funds'
          },
          {
            name: t('INSPECTION_SCHEDULE'), // График проверки наличия
            path: '/archiveFund/checking',
            priv: 'inspectionschedule'
          },
          /*{
           name: t('Движение архивных документов)',
           path: '/archiveFund/movement'
           },*/
          {
            name: t('STORAGE_REPORTS'), // Отчеты по учету и хранению
            path: '/archiveFund/reports',
            priv: 'storagereport'
          }
        ]
      },
      {
        name: t('NSA'), // Ведение научно-справочного аппарата
        iconType: 'switcher',
        pathStart: '/sra',
        priv: 'nsa',
        children: [
          {
            name: t('CLASSIFICATION_SCHEM'), // Схемы классификации
            path: '/sra/classificationSchemas',
            priv: 'classificationschem'
          },
          /*
           {
           name: t('Справочники и) классификаторы',
           path: '/sra/searchPage'
           },
           */
          {
            name: t('FUND_DESCRIPTION'), // Описание архивных фондов
            path: '/sra/searchPage',
            priv: 'funddescription'
          },
         {
            name: t('UNIT_DESCRIPTION'), // Описание единиц хранения
            path: '/sra/descriptionCases',
            priv: 'unitdescription'
          },
          {
            name: t('DOC_DESCRIPTION'), // Описание архивных документов
            path: '/sra/createDocument',
            priv: 'docdescription'
          },

          /*{
           name: t('Тематические о)бзоры',
           path: '/createCollection'
           },*/
/*
          {
            name: t('NSA_WORK'), // Работы по ведению НСА
            path: '/sra/works',
            priv: 'nsawork'
          }
*/
        ]
      },
      {
        name: t('APPLYING'), // Использование
        iconType: 'desktop',
        pathStart: '/uses',
        priv: 'applying',
        children: [
          {
            name: t('READING_ROOM'), // Читальный зал
            path: '/uses/readingRoom',
            priv: 'readingroom'
          },
          {
            name: t('RESEARCHES'), // Запросы на получение архивной справки
            path: '/uses/inquiryReq',
            priv: 'services'
          },
          {
            name: t('RESEARCHER_CABINET'), // Личный кабинет исследователя
            path: '/uses/researcherCabinet',
            priv: 'researcher-cabinet'
          },
/*
          {
            name: t('RESEARCHERS'), // Исследователи
            path: '/uses/researchers',
            priv: 'researchers'
          },
*/
/*
          {
            name: t('APPLYING_WORK'), // Работы по использованию
            path: '/uses/archiveServiceWorks',
            priv: 'applyingwork'
          }
*/
        ]
      },
      {
        name: t('ALL_WORKS'),
        iconType: 'edit',
        pathStart: '/works',
        priv: 'works',
        children: [
          {
            name: t('ACQUISITION_WORK'), // Работы по комплектованию
            path: '/works/acquisitionWorks',
            priv: 'acquisitionwork'
          },
          {
            name: t('STORAGE_WORK'), // Работы по учету и хранению
            path: '/works/storageWorks',
            priv: 'storagework'
          },
          {
            name: t('NSA_WORK'), // Работы по ведению НСА
            path: '/works/nsaWorks',
            priv: 'nsawork'
          },
          {
            name: t('APPLYING_WORK'), // Работы по использованию
            path: '/works/archiveServiceWorks',
            priv: 'applyingwork'
          },
          {
            name: t('CONTROL_WORK'), // Работы по управлению архивом
            path: '/works/controlWorks',
            priv: 'controlwork'
          }
        ]
      },
      {
        name: t('CONTROL'), // Управление
        iconType: 'pie-chart',
        pathStart: '/managing',
        priv: 'control',
        children: [
          {
            name: t('PASSPORT'), // Паспорт архива
            path: '/managing/archivePassport',
            priv: 'passport'
          },
          {
            name: t('CONTROL_REPORT'), // Отчеты
            path: '/managing/reports',
            priv: 'control-report'
          },
/*
          {
            name: t('CONTROL_WORK'), // Работы по управлению архивом
            path: '/managing/works',
            priv: 'controlwork'
          }
*/
        ]
      },
      {
        name: t('ARCHIVE_ADMINISTRATION'), // Администрирование
        iconType: 'key',
        pathStart: '/admin',
        priv: 'archive-administration',
        children: [
          {
            name: t('USERS'), // Пользователи
            path: '/admin/users',
            priv: 'usrs'
          },
          {
            name: t('USER_ROLES'), // Роли пользователей
            path: '/users-roles',
            priv: 'usrsroles'
          }/*,
          {
            name: 'для тестов',
            path: '/test'
          },
            {
              name:'Роли пользователей тест',
                path:'/users-roles'
            }*/
        ]
      }
    ]
  };

  render() {
    const { user, tofiConstants, location, t } = this.props;

    return (
      <div className="main-layout">
        <Header tofiConstants={tofiConstants}/>

        <div className="collections content">
          { this.props.user && <Sider2 navs={this.getCollections(t)} privs={this.props.user.privs} pathname={location.pathname}/> }
          {/*<Sider navs={this.state.collections} />*/}


          <div className={`${ !user ? 'collections__content-noUser' : 'collections__content' }`}>
            <Switch>
              <Route exact path="/" component={HeroScreen} />
              {/*<Route path="/collections" component={CollectionsScreen} />*/}
              {/*<Route exact path="/forgot_password" component={ForgotPassword} />*/}
              <Route exact path="/profile" render={props => user ? <AsyncProfileScreen {...props} t={t}/> : <Redirect to='/' />} />
              <Route exact path="/login" component={AsyncLoginScreen} />
              <Route exact path="/signup" component={AsyncSignupForm} />
              <Route exact path="/ecp" render={props => <AsyncECP_Form {...props} t={t} tofiConstants={tofiConstants}/>} />
              <Route path="/uses" render={props => user ? <AsyncUsesRoutes {...props}  /> : <Redirect to='/' />} />
              <Route path="/archiveFund" render={props => user ? <AsyncArchiveFundRoutes tofiConstants={tofiConstants} {...props} /> : <Redirect to='/' />} />
              <Route path="/admin" render={props => user ? <AsyncAdminRoutes tofiConstants={tofiConstants} {...props} /> : <Redirect to='/' />} />
              <Route path="/managing" render={props => user ? <AsyncManagingRoutes tofiConstants={tofiConstants} {...props} /> : <Redirect to='/' />} />
              <Route path="/sourcing" render={props => user ? <AsyncSourcing {...props} /> : <Redirect to='/' />} />
              <Route path="/sra" render={props => user ? <AsyncNSA tofiConstants={tofiConstants} {...props} /> : <Redirect to='/' />} />
              <Route path="/works" render={props => user ? <AsyncWorksRoutes tofiConstants={tofiConstants} {...props} /> : <Redirect to='/' />}/>
              <Route path="/users-roles" render={props => user ? <UsersRoles t={t} tofiConstants={tofiConstants} {...props} /> : <Redirect to='/' />}/>
              <Route path="/test" render={props => <Viewer tofiConstants={tofiConstants} viewerList={['1131', '1132', '1133', '1130']} {...props}/>} />
              <Route path="/forgot_password"  component={forgot_password}/>
              {/*<Route exact path="/leaderWorkplace" component={LeaderWorkplace} />*/}
            </Switch>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

CollectionsLayout.propTypes = {
  user: PropTypes.object,
  appLoaded: PropTypes.object,
  currentUser: PropTypes.object,
  redirectTo: PropTypes.string,
  redirect: PropTypes.func.isRequired,
  onAppLoad: PropTypes.func.isRequired,
  getAllConstants: PropTypes.func.isRequired,
  globalError: PropTypes.string,
  tofiConstants: PropTypes.shape()
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    appLoaded: state.common.appLoaded,
    currentUser: state.common.currentUser,
    redirectTo: state.common.redirectTo,
    globalError: state.common.globalError,
    tofiConstants: state.generalData.tofiConstants
  }
};

export default connect(mapStateToProps, { redirect, onAppLoad, getAllConstants,loginSesion, getAccessLevels })(translate('header')(CollectionsLayout))
