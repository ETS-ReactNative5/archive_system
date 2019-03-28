import React, { Component } from 'react';
import AntTabs from "../../../AntTabs";
import MainInfoDocForm from "./MainInfoDocForm";

class CardDoc extends Component {

  render() {

    const { t, tofiConstants, onSaveCubeData, initialValues } = this.props;
    return <AntTabs
      tabs={[
        {
          tabKey: 'mainInfo',
          tabName: t('MAIN_INFO'),
          tabContent: <MainInfoDocForm
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

export default CardDoc;