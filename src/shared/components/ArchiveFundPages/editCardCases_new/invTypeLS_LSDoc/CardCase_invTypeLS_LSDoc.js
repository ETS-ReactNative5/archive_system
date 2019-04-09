import React, { Component } from 'react';
import AntTabs from "../../../AntTabs";
import MainInfoCaseForm from "./MainInfoCaseForm";
import DocumentFile from "./DocumentFile";

class CardCase_invTypeLS_LSDoc extends Component {

  render() {

    const { t, tofiConstants, saveProps, initialValues } = this.props;
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
          />
        },
        {
          tabKey: 'documentFile',
          tabName: tofiConstants.documentFile.name[localStorage.getItem('i18nextLng')],
          tabContent: <DocumentFile />
        }
      ]}
    />
  }
}

export default CardCase_invTypeLS_LSDoc;