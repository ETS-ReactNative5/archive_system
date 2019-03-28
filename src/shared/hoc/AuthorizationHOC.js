import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom'

export default function Authorization(allowedRoles){
  return (WrappedComponent) => {
    class WithAuthorization extends React.Component {

      render() {
        const { user } = this.props;

        if(allowedRoles.includes(user.account_type)) {
          return <WrappedComponent {...this.props} />
        } else {
          return <div>Not authorized for this page</div>
        }
      };
    }

    const mapStateToProps = (store) => {
      return {
        user: store.user
      }
    };

    return connect(mapStateToProps)(WithAuthorization);
  }
}
