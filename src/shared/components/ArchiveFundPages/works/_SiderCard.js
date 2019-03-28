import React from 'react';
import AntTabs from '../../AntTabs';
import WorksPropertyForm from './_WorksPropertyForm';
import WorkDescription from './WorkDescription';
import moment from 'moment';

class SiderCard extends React.PureComponent {

  render() {
    const { t, tofiConstants, initialValues, addNew } = this.props;

    return (
      <div className="card">
        {this.props.closer}
        <AntTabs tabs={[
          {
            tabKey: 'props',
            tabName: t('PROPS'),
            tabContent: <WorksPropertyForm tofiConstants={tofiConstants} t={t} initialValues={{...initialValues, workDate: moment()}} addNew={addNew}/>
          },
          {
            tabKey: 'Description',
            tabName: t('DESCRIPTION'),
            tabContent: <WorkDescription tofiConstants={tofiConstants} t={t}/>
          }
        ]}/>
      </div>
    )
  }
}

export default SiderCard;