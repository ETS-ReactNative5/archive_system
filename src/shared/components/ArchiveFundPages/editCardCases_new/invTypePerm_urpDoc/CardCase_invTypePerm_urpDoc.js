import React, { Component } from 'react';
import AntTabs from "../../../AntTabs";
import MainInfoCaseForm from "./MainInfoCaseForm";
import DescriptiveInfo from "./DescriptiveInfo";
import CaseFile from "../CaseFile";

class CardCase_invTypePerm_urpDoc extends Component {

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
          tabKey: 'descriptiveInfo',
          tabName: t('DESCRIPTIVE_INFO'),
          tabContent: <DescriptiveInfo
            tofiConstants={tofiConstants}
            initialValues={{...initialValues}}
            t={t}
          />
        },
       {
          tabKey: 'documentFile',
          tabName: tofiConstants.documentFile.name[localStorage.getItem('i18nextLng')],
          tabContent: <CaseFile
            initialValues={{...initialValues}}
            t={t}
            saveProps={saveProps}
          />
        }
      ]}
    />
  }
}

export default CardCase_invTypePerm_urpDoc;