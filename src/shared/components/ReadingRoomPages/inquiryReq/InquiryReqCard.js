import React from 'react';
import AntTabs from '../../AntTabs';
import MainInfo from './MainInfo';
import Description from './Description';
import ResultDescription from './ResultDescription';
import Applicant from './Applicant';
import Bibliography from './Bibliography';

class InqueryRegCard extends React.PureComponent {

 state = {
    result: {}
};
 updateCounter =  0;

  componentDidMount() {
  }

  render() {
    const {t, tofiConstants, initialValues, saveProps, onCreateObj, user} = this.props;
    // this.updateCounter - переменная для обновления вкладки результат
    this.updateCounter++;
    let _update_counter_ = this.updateCounter;
    return (
      <AntTabs tabs={[
        {
          tabKey: 'MainInfo',
          tabName: t('MAIN_INFO'),
          tabContent: <MainInfo
            tofiConstants={tofiConstants}
            t={t}
            onCreateObj={onCreateObj}
            saveProps={saveProps}
            initialValues={initialValues}
            isEnabled={this.props.isEnabled}
          />
        },
        {
          tabKey: 'Applicant',
          tabName: t('APPLICANT'),
          disabled: !initialValues.key,
          tabContent: <Applicant
            tofiConstants={tofiConstants}
            t={t}
            saveProps={saveProps}
            initialValues={initialValues}
            isEnabled={this.props.isEnabled}
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
            isEnabled={this.props.isEnabled}
          />
        },
        {
          tabKey: 'ResultDescription',
          tabName: t('RESULT_DESCRIPTION'),
          //disabled: !initialValues.key || !initialValues.workAuthor || user.obj !== initialValues.workAuthor.value,
          tabContent: <ResultDescription
            tofiConstants={tofiConstants}
            t={t}
            updateCounter={_update_counter_}
            // saveProps={saveProps}
            initialValues={initialValues}
          />
        },
        {
          tabKey: 'Bibliography',
          tabName: t('BIBLIOGRAPHY'),
          hidden: true,
          disabled: !initialValues.key || !initialValues.workAuthor || user.obj !== initialValues.workAuthor.value,
          tabContent: <Bibliography
            tofiConstants={tofiConstants}
            t={t}
            saveProps={saveProps}
            initialValues={initialValues}
          />
        }
        /*{
          tabKey: 'ResultResearch',
          tabName: t('RESULT_RESEARCH'),
          tabContent: <ResultResearch
            tofiConstants={tofiConstants}
            t={t}
            saveProps={saveProps}
            initialValues={initialValues}
          />
        }*/
      ]}/>
    )
  }
}

export default InqueryRegCard;