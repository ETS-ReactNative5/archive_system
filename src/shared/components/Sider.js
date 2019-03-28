import React from 'react';
import { Menu, Icon } from 'antd';

class Sider extends React.Component {

  state = {
    open: false
  };

  toggleSider = () => {
    this.setState({
      open: !this.state.open
    })
  };

  render() {
    const { open } = this.state;
    const { navs } = this.props;
    return (
      <div className="Sider">
        <button onClick={ this.toggleSider } className="SiderToggle__btn" style={{zIndex: 2}}>
          <svg height="100%" width="100%">
            <line x1="20%" y1="33%" x2="80%" y2="33%" style={{ stroke: '#03a9f4', strokeWidth: '4' }}/>
            <line x1="20%" y1="50%" x2="80%" y2="50%" style={{ stroke: '#03a9f4', strokeWidth: '4' }}/>
            <line x1="20%" y1="67%" x2="80%" y2="67%" style={{ stroke: '#03a9f4', strokeWidth: '4' }}/>
          </svg>
        </button>
        <Menu defaultSelectedKeys={['1']} inlineCollapsed={!open}>
          {navs.map(nav => {
            return (
              !nav.children ?
                <Menu.Item key={nav.name}>
                  <Icon type={nav.iconType}/>
                  <span>{nav.name}</span>
                </Menu.Item> :
                <Menu.SubMenu key={nav.name}>
                  {nav.children.map(child => {
                    return <Menu.Item key={child.name}>{child.name}</Menu.Item>
                  })}
                </Menu.SubMenu>
            )
          })}
        </Menu>
      </div>
    );
  }
};

export default Sider;
