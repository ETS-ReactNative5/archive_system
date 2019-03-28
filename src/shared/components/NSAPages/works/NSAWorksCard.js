import React from 'react';
import AntTabs from '../../AntTabs';
import WorksPropertyForm from './WorksPropertyForm';
import WorkDescription from './WorkDescription';

class NSAWorksCard extends React.PureComponent {

  render() {
    const {t, tofiConstants, initialValues, saveProps, onCreateObj} = this.props;

    return (
      <AntTabs tabs={[
        {
          tabKey: 'props',
          tabName: t('PROPS'),
          tabContent: <WorksPropertyForm
            tofiConstants={tofiConstants}
            saveProps={saveProps}
            t={t}
            initialValues={initialValues}
            onCreateObj={onCreateObj}
          />
        },
        {
          tabKey: 'Description',
          disabled: !initialValues.key,
          tabName: t('DESCRIPTION'),
          tabContent: <WorkDescription
            tofiConstants={tofiConstants}
            saveProps={saveProps}
            t={t}
            initialValues={initialValues}
          />
        }
      ]}/>
    )
  }
}

export default NSAWorksCard;