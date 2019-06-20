import React, { Component } from 'react';
import AntTabs from "../AntTabs";
import MainInfoCaseForm from "./MainInfoCaseForm";
import InvTree from "./InvTree"
import NomenStorageUUnits from "./NomenStorageUUnits"
class CardCase_invTypeDigital_uprDoc extends Component {

  render() {

      
    const { t, tofiConstants, saveProps,onSave, initialValues,dataInv, myValues,keyInvFund, ikKey,onCreateObj,invType,docType } = this.props;
    return <AntTabs
      tabs={[
        {
          tabKey: 'mainInfo',
          tabName: t('MAIN_INFO'),
          tabContent: <MainInfoCaseForm
            tofiConstants={tofiConstants}
            saveProps={saveProps}
            t={t}
            onCreateObj={onCreateObj}
            invType={invType}
            docType={docType}
            ikKey={ikKey}
            initialValues={initialValues}
          />
        },
          {
              tabKey: 'nomen',
              tabName: 'Номенклатура',
              disabled:!initialValues.key,
              tabContent: <NomenStorageUUnits
              tofiConstants={tofiConstants}
              onSave={onSave}
              myValues={myValues && !!myValues[0].nomen?myValues[0].nomen:[] }
              myValues2={initialValues && !!initialValues.caseNomenItem?[initialValues.caseNomenItem]:[] }
              propTimeLife={initialValues && !!initialValues.propTimeLife ?initialValues.propTimeLife.idDataPropVal:null}
              t={t}
              myClass={'nomenList'}
              constReferenceType={tofiConstants.nomenNumber}
              myType={'nomenNumber'}
              initialValues={initialValues}
              />
          },
          {
              tabKey: 'InvTree',
              tabName: 'Описи',
              disabled:!initialValues.key,
              tabContent: <InvTree
                  tofiConstants={tofiConstants}
                  onSave={onSave}
                  myValues={myValues && !!myValues[0].nomen?myValues[0].nomen:[] }
                  myValues2={initialValues && !!initialValues.caseStructuralSubdivision?[initialValues.caseStructuralSubdivision]:[] }
                  caseInventory={initialValues && !!initialValues.caseInventory ?initialValues.caseInventory.idDataPropVal:null}
                  invFund={initialValues && !!initialValues.invFund ?initialValues.invFund.idDataPropVal:null}
                  t={t}
                  dataInv={dataInv}
                  initialValues={initialValues}
              />
          }
      ]}
    />
  }
}

export default CardCase_invTypeDigital_uprDoc;