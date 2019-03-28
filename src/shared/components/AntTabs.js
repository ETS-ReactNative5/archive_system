import React from 'react';
import { Tabs } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const TabPane = Tabs.TabPane;

const renderTabs = item => {
  return <TabPane tab={item.tabName} key={item.tabKey} disabled={item.disabled}>{item.tabContent}</TabPane>
};

const AntTabs = props => {
  if(!props.user) return null;
  return (
    <Tabs
      {...props}
      type={props.type}
      onChange={props.onChange}
      tabBarExtraContent={props.tabBarExtraContent ? props.tabBarExtraContent : undefined}
      onTabClick={ props.onTabClick ? props.onTabClick : undefined }
    >
      {props.tabs
        .filter(item => !item.hidden && (!item.priv || props.user.privs.includes(item.priv)))
        .map(renderTabs)}
    </Tabs>
  )
};

AntTabs.propTypes = {
  type: PropTypes.string,
  onTabClick: PropTypes.func,
  onChange: PropTypes.func,
  tabs: PropTypes.array.isRequired
};

export default connect(state => ({ user: state.auth.user }))(AntTabs);
