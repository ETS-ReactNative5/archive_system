import React from 'react';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';

import Header from '../components/Header';
import { Link } from 'react-router-dom';
const { Content, Footer, Sider } = Layout;

class SiderDemo extends React.Component {
  state = {
    collections: [
      {
        name: 'Читальный зал',
        path: '/readingRoom',
        iconType: 'book'
      },
      {
        name: 'Архивный фонд',
        path: '/archiveFund',
        iconType: 'appstore-o'
      },
      {
        name: 'НСА',
        path: '/sra',
        iconType: 'profile'
      },
      {
        name: 'Источники комплектования',
        path: '/sourcing',
        iconType: ''
      },
      {
        name: 'Рабочее место экспертов',
        path: '/expertWorkplace',
        iconType: ''
      },
      {
        name: 'Рабочее место администратора читального зала',
        path: '/readingRoomAdmin',
        iconType: ''
      },
      {
        name: 'Рабочее место администратора по выдаче архивных справок',
        path: '/archivalRefsAdminWorkplace',
        iconType: 'file'
      },
      {
        name: 'Рабочее место руководителя',
        path: '/leaderWorkplace',
        iconType: ''
      },
      {
        name: 'Интеграция',
        path: '/integration',
        iconType: ''
      },
      {
        name: 'Архивные услуги',
        path: '/archiveServices',
        iconType: ''
      },
      {
        name: 'Среда администрирования информационной системы',
        path: '/isAdministrationEnvironment',
        iconType: ''
      }
    ],
    collapsed: false,
  };
  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  };
  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
          width={300}
        >
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            {this.state.collections.map((item, idx) => {
              return (
                <Menu.Item key={idx} className={this.state.collapsed ? "" : "sider-item"}>
                  <Icon type={item.iconType} />
                  <span><Link to={item.path} style={{ color: '#eee' }}>{item.name}</Link></span>
                </Menu.Item>
              )
            })}
          </Menu>
        </Sider>
        <Layout>
          <Header />
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              Bill is a cat.
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Ant Design ©2016 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    );
  }
}export default SiderDemo;
