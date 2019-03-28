import React from 'react';
import { connect } from 'react-redux';

function ShowComponent({privs, user, component: Component}){
    if(user && privs.some(priv => user.privs.includes(priv))) {
      return Component
    }
    return null;
}

function mapStateToProps(state) {
  return {
    user: state.auth.user
  }
};

export default connect(mapStateToProps)(ShowComponent);
