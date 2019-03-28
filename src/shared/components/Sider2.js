import React from 'react';
import {Link, NavLink} from 'react-router-dom';
import {Icon, Tooltip} from 'antd';
import PropTypes from 'prop-types';

class Sider2 extends React.Component {

  state = {
    open: false,
    submenu: {}
  };

  toggleSider = () => {
    this.setState({
      open: !this.state.open,
      submenu: {}
    })
  };

  toggleSubmenu = navName => {
    this.setState({
      submenu: {
        [navName]: !this.state.submenu[navName]
      }
    })
  };

  renderTitleNavs = navs => {
    return (
      <ul className="tooltip-navs">
        {navs
          .filter(nav => !nav.priv || this.props.privs.includes(nav.priv))
          .map(nav => {
            return (
              <li key={nav.name}><Link to={nav.path}>{nav.name}</Link></li>
            )
          })}
      </ul>
    )
  };

  renderCollections = () => {
    return this.props.navs
      .filter(nav => !nav.priv || this.props.privs.includes(nav.priv))
      .map((nav, idx) => {
      return (
        !nav.children ?
        <li key={idx}>
          <NavLink to={nav.path} activeStyle={{color: '#009688', backgroundColor: '#E0F2F1'}} className="sider-nav">
            <Icon type={nav.iconType} style={{fontSize: '16px'}}/>
            {nav.name}
          </NavLink>
        </li> :
        <li key={idx} className="submenu">
          <p className="sider-nav">
            {!this.state.open && <Tooltip placement="rightTop" title={this.renderTitleNavs(nav.children)} mouseLeaveDelay={0.2} overlayClassName='ant-tooltip-white'>
              <Icon type={nav.iconType} style={{fontSize: '16px'}} className={this.props.pathname.includes(nav.pathStart) ? 'active' : ''}/>
            </Tooltip>}
            <span onClick={() => this.toggleSubmenu(nav.name)}>
              {nav.name}
              <Icon type={!this.state.submenu[nav.name] ? 'down' : 'up'} style={{fontSize: '12px'}}/>
            </span>
          </p>
          <ul className={!this.state.submenu[nav.name] ? "" : "open"}>
            {nav.children
              .filter(child => !child.priv || this.props.privs.includes(child.priv))
              .map(child => {
                return (
                  <li key={child.name}>
                    <NavLink to={child.path} activeStyle={{color: '#009688', backgroundColor: '#E0F2F1'}} className="sider-nav">
                      {child.name}
                    </NavLink>
                  </li>
                )
              })}
          </ul>
        </li>
      );
    });
  };

  render() {
    const { open } = this.state;
    return (

      <div className="Sider2">
        <button onClick={ this.toggleSider } className="SiderToggle__btn">
          <svg height="100%" width="100%">
            <line x1="25%" y1="33%" x2="75%" y2="33%" style={{ stroke: '#009688', strokeWidth: '4' }}/>
            <line x1="25%" y1="50%" x2="75%" y2="50%" style={{ stroke: '#009688', strokeWidth: '4' }}/>
            <line x1="25%" y1="67%" x2="75%" y2="67%" style={{ stroke: '#009688', strokeWidth: '4' }}/>
          </svg>
        </button>
        <div className={`SiderMenu ${open ? '' : 'SiderMenu-collapsed'}`}>
          <h3 className="SiderMenu__header">
          </h3>
          <ul className="SiderMenu__collectionsList">
            { this.renderCollections() }
          </ul>
        </div>
      </div>
    );
  }
};

Sider2.propTypes = {
  navs: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    path: PropTypes.string,
    iconType: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      path: PropTypes.string.isRequired
    }))
  })).isRequired
};

export default Sider2;
