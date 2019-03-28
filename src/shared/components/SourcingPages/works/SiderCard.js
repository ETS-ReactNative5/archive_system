import React from 'react';
import AntTabs from '../../AntTabs';
import WorksPropertyForm from './WorksPropertyForm';
import WorkDescription from './WorkDescription';

class SiderCard extends React.PureComponent {

  render() {
    const { t, tofiConstants, initialValues, optionsData, saveProps, onCreateObj } = this.props;

    return (
      <div className="card">
        {this.props.closer}
        <AntTabs tabs={[
          {
            tabKey: 'props',
            tabName: t('PROPS'),
            tabContent: <WorksPropertyForm tofiConstants={tofiConstants}
                                           saveProps={saveProps}
                                           t={t}
                                           optionsData={optionsData}
                                           initialValues={initialValues}
                                           onCreateObj={onCreateObj}
            />
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