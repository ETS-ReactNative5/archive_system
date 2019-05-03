import React, { Component } from 'react';
import AntTabs from "../AntTabs";
import MainInfoCaseForm from "./MainInfoCaseForm";

class CardCase_invTypeDigital_uprDoc extends Component {

  render() {

    const { t, tofiConstants, saveProps, initialValues, keyInv, invType,docType } = this.props;
    return <AntTabs
      tabs={[
        {
          tabKey: 'mainInfo',
          tabName: t('MAIN_INFO'),
          tabContent: <MainInfoCaseForm
            tofiConstants={tofiConstants}
            saveProps={saveProps}
            t={t}
            invType={invType}
            docType={docType}
            keyInv={keyInv}
            initialValues={initialValues}
          />
        },

      ]}
    />
  }
}

export default CardCase_invTypeDigital_uprDoc;