import React from 'react';
import CheckingForm from './CheckingForm';

class SiderCard_Checking extends React.PureComponent {

  render() {
    const { t, tofiConstants, initialValues } = this.props;

    return (
      <div className="card">
        {this.props.closer}
        <CheckingForm tofiConstants={tofiConstants} t={t} initialValues={{...initialValues}}/>
      </div>
    )
  }
}

export default SiderCard_Checking;