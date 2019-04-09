import React from 'react';
import {compose} from 'redux'
import { Link } from 'react-router-dom';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {Badge, message, Icon, Menu, Dropdown} from 'antd';
import moment from 'moment';
import { groupBy, uniq } from 'lodash';
import BasketContent from './Basket/BasketContent'
import {changeCaseInBasket, clearBasket, autoAddCase, readingRoomMakeOrder} from '../actions/actions'
import gerb from '../assets/img/Gerb.png';

import {addCaseToBasket, logout,getObjByProp, getObjFromProp, removeCaseFromBasket} from '../actions/actions';
import ShowComponent from "../hoc/ShowComponent";

const LoggedInNav = props => {
  const { basket, basketState, basketIsShown, showBasket, hideBasket, router, clearBasket,
    t, removeCaseFromBasket, addCaseToBasket, changeCaseInBasket, user, tofiConstants } = props;
  const handleListItemClick = item => {
    if(basket.some(el => el.key === item.key)) removeCaseFromBasket(item);
      else addCaseToBasket(item);
  };
    const searchUser=()=>{
        let constants =['workAssignedToSource','workAssignedToReg','workAssignedToIPS','workAssignedToNID','clsDepInformTech']
        for (let value of constants){
            if (tofiConstants[value].id === user.cls ){
                return true
            }
        }
    }

  const recieveOrder = () => {
    if (basket.length === 0) return;
    let isOuterUser = ['clsResearchers', 'clsTempUsers']
      .some(c => tofiConstants[c].id == user.cls);
    const userId = user.obj;
    const archiveId = basket[0].archiveId;
    const datas = [];
    const groupByFund = groupBy(basket, item => item.fundId);
    for (let key in groupByFund) {
      const fund = { fundId: key, invs: [] };
      const groupByInv = groupBy(groupByFund[key], item => item.inventoryId);
      for (let key in groupByInv) {
        const item = groupByInv[key];
        const inv = { invId: key, cases: [] };
        const groupByCase = groupBy(item, item => item.caseId);
        for (let key in groupByCase) {
          const item = groupByCase[key];
          const docs = [];
          const caseThemes = item.map(o => {
            o.docId && docs.push(o.docId);
            if(o.propStudy.type === 'theme') isOuterUser = true;
            return String(o.propStudy.value);
          });
          const caseWorksKey = isOuterUser ? 'caseThemes' : 'works';
          const cases = {caseId: key, [caseWorksKey]: caseThemes, docs: uniq(docs)};
          inv.cases.push(cases);
        }
        /*for (let i=0; i < item.length; i++) {
         if (inv.cases !== '') inv.cases += ',';
         inv.cases += item[i].key.split('_')[1];
         }*/
        fund.invs.push(inv);
      }
      datas.push(fund);
    }
    let isUser = false
     let userSearch = searchUser()
      if (userSearch === true){
          isUser = true
      }

    readingRoomMakeOrder(userId, archiveId, datas)
      .then(res => {
        if(!res.success) {
          res.errors.forEach(err => {
            message.error(err.text);
          });
          return;
        }
        message.success(t('ORDERS_SUCCESS'));
        clearBasket();
        hideBasket();
      });
  };

  const menu = (
    <Menu>
      <Menu.Item key="kz"><span className='langDropdown__list' onClick={() => props.changeLanguage('kz')}>kz</span></Menu.Item>
      <Menu.Item key="ru"><span className='langDropdown__list' onClick={() => props.changeLanguage('ru')}>ru</span></Menu.Item>
      <Menu.Item key="en"><span className='langDropdown__list' onClick={() => props.changeLanguage('en')}>en</span></Menu.Item>
    </Menu>
  );

  const menuProfile = (
    <Menu>
      <Menu.Item key="profile"><Link to='/profile'><Icon type='user'/> {t('PROFILE')} </Link></Menu.Item>
      <Menu.Item key="exit"><Link to="/" onClick={props.handleLogout}><Icon type='logout'/> {t('EXIT')} </Link></Menu.Item>
    </Menu>
  )

  return (
    <div className="nav-wrapper">
      <Link className="nav-wrapper__link" to="/"> <span title={t('MAIN')}><Icon style={{ fontSize: '17px' }} type="home" /></span> </Link>
      {router.pathname === '/uses/readingRoom'
        &&
        <div className="nav-wrapper__basket" tabIndex={0}>
          <ShowComponent privs={['orderbasket']} component={
            <Badge count={basket.length} onClick={showBasket}>
              <Icon style={{ fontSize: '17px' }} type="shopping-cart" />
            </Badge>}
          />
          <BasketContent 
              show={basketIsShown} 
              title={'Корзина'}
              user={user}
              tofiConstants={tofiConstants}
              t={t}
              onOk={recieveOrder}
              onCancel={hideBasket}
              basketState={basketState}
              handleListItemClick={handleListItemClick}
              changeCaseInBasket={changeCaseInBasket}
              basket={basket}
              width={'90%'}
              />
        </div>
      }
      <div className="nav-wrapper__lang">
        <Dropdown overlay={menu} trigger={['hover']}>
          <Badge count={localStorage.getItem('i18nextLng')}><Icon style={{ fontSize: '17px' }} type="global" /></Badge>
        </Dropdown>
      </div>
      <Link className="nav-wrapper__link" to="/help"> <span title={t('HELP')}><Icon style={{ fontSize: '17px' }} type="question-circle-o" /></span> </Link>
      <div className="nav-wrapper__profile">
        <Dropdown overlay={menuProfile} trigger={['hover']}>
          <div> {user && user.name} <Icon style={{ fontSize: '17px' }} type="user" /> </div>
        </Dropdown>
      </div>
    </div>
    );
};

const LoggedOutNav = (props) => {

  const { t } = props;

  const menu = (
    <Menu>
      <Menu.Item key="kz"><span className='langDropdown__list' onClick={() => props.changeLanguage('kz')}>kz</span></Menu.Item>
      <Menu.Item key="ru"><span className='langDropdown__list' onClick={() => props.changeLanguage('ru')}>ru</span></Menu.Item>
      <Menu.Item key="en"><span className='langDropdown__list' onClick={() => props.changeLanguage('en')}>en</span></Menu.Item>
    </Menu>
  );

  return (
    <div className="nav-wrapper">
      <Link className="nav-wrapper__link" to="/"> <span title={t('MAIN')}><Icon style={{ fontSize: '17px' }} type="home" /></span> </Link>
      <div className="nav-wrapper__lang">
        <Dropdown overlay={menu} trigger={['hover']}>
          <Badge count={localStorage.getItem('i18nextLng')}><Icon style={{ fontSize: '17px' }} type="global" /></Badge>
        </Dropdown>
      </div>
      <Link className="nav-wrapper__link" to="/login"><span title={t('LOGIN')}><Icon style={{ fontSize: '17px' }} type="login" /></span></Link>
      <Link className="nav-wrapper__link" to="/signup"><span title={t('SIGNUP')}><Icon style={{ fontSize: '17px' }} type="plus-circle" /></span></Link>
      <Link className="nav-wrapper__link" to="/help"> <span title={t('HELP')}><Icon style={{ fontSize: '17px' }} type="question-circle-o" /></span> </Link>
    </div>
  );
};


class Header extends React.Component{
  state = {
    showBasket: false,
    basketState: [],
    propStudyOptions:[]
  };

  changeLanguage = (lng) => {
    this.props.i18n.changeLanguage(lng);
    switch (lng) {
      case 'en': moment.locale('en-gb'); break;
      case 'ru': moment.locale('ru'); break;
      case 'kz': moment.locale('kz'); break;
      default: moment.locale('kz'); break;
    }
  };

    getPropsOptions=()=>{

            if (this.props.user){
                const {basket, basketState, user, t, tofiConstants,
                    tofiConstants: {archiveCipher, caseDbeg, caseDend, propStudy}} = this.props;
                const isOuterUser = ['clsResearchers', 'clsTempUsers']
                    .some(c => tofiConstants[c].id == user.cls);
                const fd = new FormData();
                if(isOuterUser) {
                    fd.append("objId", user.obj);
                    fd.append("propConst", 'propStudy');
                    getObjFromProp(fd)
                        .then(res => {
                            if(!res.success) {
                                res.errors.forEach(err => {
                                    message.error(err.text);
                                    return;
                                })
                            }
                            this.setState({ propStudyOptions: res.data.map(opt => ({value: opt.id, label: opt.name[this.lng]})) })
                        })
                } else {

                    const idClassNameMap = {};
                    ['conductResearch','performPaidReq','responseToRequest'].forEach(c => {
                        idClassNameMap[tofiConstants[c].id] = tofiConstants[c].name[this.lng]
                    });
                    fd.append('clsConsts', 'conductResearch,performPaidReq,responseToRequest');
                    fd.append('propConst', 'workAssignedTo');
                    fd.append('value', user.obj);
                    getObjByProp(fd)
                        .then(res => {
                            if(!res.success) {
                                res.errors.forEach(err => {
                                    message.error(err.text);
                                    return;
                                })
                            }
                            this.setState({
                                propStudyOptions: res.data
                                    .map(opt => ({
                                        value: opt.id,
                                        label: `${opt.id}-${idClassNameMap[opt.cls]}`
                                    }))
                            })
                            return res.data;
                        })
                        .then(data => {
                            if(!data.length) {
                                const fd = new FormData();
                                fd.append("objId", user.obj);
                                fd.append("propConst", 'propStudy');
                                getObjFromProp(fd)
                                    .then(res => {
                                        if(!res.success) {
                                            res.errors.forEach(err => {
                                                message.error(err.text);
                                                return;
                                            })
                                        }
                                        this.setState({ propStudyOptions: res.data
                                            .map(opt => ({value: opt.id, label: opt.name[this.lng], type: 'theme'}))
                                        })
                                    })
                            }
                        })
                }
            }


    }

    serMaxVal=()=>{
        let maxVal = Math.max.apply(Math, this.state.propStudyOptions.map((el)=>{
            return el.value
        }))
        let arrVal = this.state.propStudyOptions.filter((el ,i)=>{
            if (el.value === maxVal)return el

        })
        let rezulObj = arrVal.find((el)=>el.value === maxVal)
        return rezulObj
    };
  showBasket = () => {
      this.getPropsOptions()
      setTimeout(()=>{
          if (this.props.basket.length > 0){
              const newBaskets = this.props.basket
              for (let i=0; i < newBaskets.length; i++){
                  newBaskets[i].propStudy=this.serMaxVal()
              }
              this.props.autoAddCase(newBaskets)
          }
      },500)
    this.setState({ showBasket: true, basketState: this.props.basket.slice() });
  };

  focusInCurrentTarget = ({ relatedTarget, currentTarget }) => {
    if (relatedTarget === null) return false;

    let node = relatedTarget.parentNode;

    while (node !== null) {
      if (node === currentTarget) return true;
      node = node.parentNode;
    }

    return false;
  };

  hideBasket = e => {
    // if(this.focusInCurrentTarget(e)) return;
    this.setState({showBasket: false});
  };

  render() {
    const { t, router, logout, removeCaseFromBasket, basket, addCaseToBasket, user, tofiConstants, changeCaseInBasket } = this.props;
    const { basketState, showBasket } = this.state;

    return (
      <header className="header">
        {this.props.children}
        <div className="header__logo" >
          <div className="header__logo__name">
            <h3>{t(`TITLE_1_1_${process.env.REACT_APP_APP_NAME}`)}</h3>
            <h3>{t(`TITLE_1_2_${process.env.REACT_APP_APP_NAME}`)}</h3>
          </div>
            <img src={gerb} alt="logo"/>
          <div className="header__logo__system">
            <h3>{t('TITLE_2_1')}</h3>
            <h3>{t('TITLE_2_2')}</h3>
          </div>
        </div>
        { user ?
          <LoggedInNav
            basket={basket}
            basketState={basketState}
            tofiConstants={tofiConstants}
            changeLanguage={this.changeLanguage}
            handleLogout={logout}
            t ={ t }
            showBasket={this.showBasket}
            hideBasket={this.hideBasket}
            basketIsShown={ showBasket }
            router={router}
            removeCaseFromBasket={removeCaseFromBasket}
            changeCaseInBasket={changeCaseInBasket}
            addCaseToBasket={addCaseToBasket}
            clearBasket={this.props.clearBasket}
            user={user}
          />
          :
          <LoggedOutNav
            changeLanguage={this.changeLanguage}
            t={ t }
          />
        }
      </header>
    )
  }
}

Header.propTypes = {
  logout: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  i18n: PropTypes.shape({
    changeLanguage: PropTypes.func.isRequired
  }).isRequired,
  basket: PropTypes.array,
  user: PropTypes.object
};

function mapStateToProps(state) {
  return {
    user: state.auth.user,
    basket: state.readingRoom.basket,
    router: state.router.location
  }
}

export default compose(
  connect(mapStateToProps, { logout, removeCaseFromBasket, addCaseToBasket, autoAddCase, changeCaseInBasket, clearBasket } ),
  translate('header')
)(Header);
