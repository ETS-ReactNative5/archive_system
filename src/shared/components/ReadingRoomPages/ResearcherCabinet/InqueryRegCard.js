import React from 'react';
import AntTabs from '../../AntTabs';
import MainInfo from './MainInfo';
import Description from './Description';
import ResultDescription from './ResultDescription';

class InqueryRegCard extends React.PureComponent {

  render() {
    const {t, tofiConstants, initialValues, onCreateObj, saveProps} = this.props;

    return (
      <AntTabs tabs={[
        {
          tabKey: 'MainInfo',
          tabName: t('MAIN_INFO'),
          tabContent: <MainInfo
            tofiConstants={tofiConstants}
            onCreateObj={onCreateObj}
            t={t}
            saveProps={saveProps}
            initialValues={initialValues}
          />
        },
        {
          tabKey: 'Description',
          tabName: t('DESCRIPTION'),
          disabled: !initialValues.key,
          tabContent: <Description
            tofiConstants={tofiConstants}
            t={t}
            saveProps={saveProps}
            initialValues={initialValues}
          />
        },
        {
          tabKey: 'ResultDescription',
          tabName: t('RESULT_DESCRIPTION'),
          disabled: !initialValues.key,
          tabContent: <ResultDescription
            tofiConstants={tofiConstants}
            t={t}
            saveProps={saveProps}
            initialValues={initialValues}
          />
        },
        /*{
          tabKey: 'ResultResearch',
          tabName: t('RESULT_RESEARCH'),
          disabled: !initialValues.key,
          tabContent: <ResultResearch
            tofiConstants={tofiConstants}
            t={t}
            initialValues={initialValues}
          />
        }*/
      ]}/>
    )
  }
}

export default InqueryRegCard;