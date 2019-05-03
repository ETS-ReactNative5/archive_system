import React, { Component } from 'react';
import AntTabs from "./../../../AntTabs";
import MainInfoCaseForm from "./MainInfoCaseFormWorks";
import Damage from "./DamageWorks";

class CardCase_invTypeLS_LSDoc extends Component {

  render() {

    const { t, tofiConstants, saveProps, stateRecord, initialValues } = this.props;
    return <AntTabs
      tabs={[
        {
          tabKey: 'mainInfo',
          tabName: t('MAIN_INFO'),
          tabContent: <MainInfoCaseForm
            tofiConstants={tofiConstants}
            saveProps={saveProps}
            t={t}
            initialValues={initialValues}
            stateRecord={stateRecord}
          />
        },
        {
          tabKey: 'damage',
          tabName: tofiConstants.documentFile.name[localStorage.getItem('i18nextLng')],
          tabContent: <Damage
              tofiConstants={tofiConstants}
          />
        }
      ]}
    />
  }
}

export default CardCase_invTypeLS_LSDoc;