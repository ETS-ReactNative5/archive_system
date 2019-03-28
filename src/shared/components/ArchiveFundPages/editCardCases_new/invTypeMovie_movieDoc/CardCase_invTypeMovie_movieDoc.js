import React, { Component } from 'react';
import AntTabs from "../../../AntTabs";
import MainInfoCaseForm from "./MainInfoCaseForm";

class CardCase_invTypeMovie_movieDoc extends Component {

  render() {

    const { t, tofiConstants, onSaveCubeData, initialValues } = this.props;
    return <AntTabs
      tabs={[
        {
          tabKey: 'mainInfo',
          tabName: t('MAIN_INFO'),
          tabContent: <MainInfoCaseForm
            tofiConstants={tofiConstants}
            onSaveCubeData={onSaveCubeData}
            t={t}
            initialValues={initialValues}
          />
        },
        /*{
          tabKey: 'descriptiveInfo',
          tabName: t('DESCRIPTIVE_INFO'),
          tabContent: <DescriptiveInfo
            tofiConstants={tofiConstants}
            initialValues={{...initialValues, annotationContentOfDocument, invMulti, fundHistoricalNoteMulti}}
            t={t}
          />
        }*/
      ]}
    />
  }
}

export default CardCase_invTypeMovie_movieDoc;