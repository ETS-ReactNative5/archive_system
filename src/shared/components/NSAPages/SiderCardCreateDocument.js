import React from 'react';
import {Button} from 'antd';
import AntTabs from '../AntTabs';
import CreateDocumentAnnotation from './CreateDocumentAnnotation';
import CreateDocumentAccessRights from './CreateDocumentAccessRights';
import CreateDocumentReferenceByType from './CreateDocumentReferenceByType';
import CreateDocumentHeaderMain from './CreateDocumentHeaderMain';
import CreateDocumentHeaderLP from './CreateDocumentHeaderLP';
import CreateDocumentHeaderNTD from './CreateDocumentHeaderNTD';

class SiderCardCreateDocument extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      //
    }
  }
  getHeaderDoc = () => {
    const { t, tofiConstants, record, onEditRecordChange } = this.props;
    const {docType} =this.props.record.extraInfo;
    switch (docType) {
      case 'uprDoc': {
        return (
          <CreateDocumentHeaderMain 
            t={t} 
            tofiConstants={tofiConstants} 
            record={record}
            initialValues={{ documentFile: record.documentFile }}
            onChange={onEditRecordChange}
          />
        )
      }
      case 'uprNTD': {
        return (
          <CreateDocumentHeaderNTD 
            t={t} 
            tofiConstants={tofiConstants} 
            record={record}
            initialValues={{ documentFile: record.documentFile }}
            onChange={onEditRecordChange}
          />
          )
        }
      case 'lpDoc': {
        return (
          <CreateDocumentHeaderLP 
            t={t} 
            tofiConstants={tofiConstants} 
            record={record}
            initialValues={{ documentFile: record.documentFile }}
            onChange={onEditRecordChange}
          />
        )
      }
    }
  }

  render() {
    const { t, tofiConstants, record, caseList, onEditRecordChange, flagSave, onSave, activeKey, onTabClick } = this.props;
    
    return (
      <div className="card">  
        {this.props.closer}
        <AntTabs activeKey={activeKey} tabs={[
          {
            tabKey: 'header',
            tabName: t('HEADER'),
            tabContent: this.getHeaderDoc(),
          },
          {
            tabKey: 'annotation',
            tabName: t('ANNOTATION'),
            tabContent: <CreateDocumentAnnotation 
                          t={t} 
                          tofiConstants={tofiConstants} 
                          record={record}
                          onChange={onEditRecordChange}
                        />
          },
          {
            tabKey: 'accessRights',
            tabName: t('ACCESS_RIGHTS'),
            tabContent: <CreateDocumentAccessRights 
                          t={t} 
                          tofiConstants={tofiConstants} 
                          record={record}
                          caseList={caseList}
                          onChange={onEditRecordChange}
                        />
          },
          {
            tabKey: 'references',
            tabName: t('REFERENCES'),
            tabContent: <CreateDocumentReferenceByType 
                          t={t} 
                          tofiConstants={tofiConstants} 
                          myValues={record.linkToKatalog}
                          constReferenceType={tofiConstants.vidKatalog}
                          myClass={'clsKatalog'}
                          myType={'vidKatalog'}
                          onChange={onEditRecordChange}
                        />
          },
          {
            tabKey: 'pointers',
            tabName: t('POINTERS'),
            tabContent: <CreateDocumentReferenceByType 
                          t={t} 
                          tofiConstants={tofiConstants} 
                          myValues={record.linkToUkaz}
                          constReferenceType={tofiConstants.vidUkaz}
                          myClass={'clsUkaz'}
                          myType={'vidUkaz'}
                          onChange={onEditRecordChange}
                        />
          },
          {
            tabKey: 'reviews',
            tabName: t('REVIEWS'),
            tabContent: <CreateDocumentReferenceByType 
                          t={t} 
                          tofiConstants={tofiConstants} 
                          myValues={record.linkToObzor}
                          constReferenceType={tofiConstants.vidObzora}
                          myClass={'clsObzor'}
                          myType={'vidObzora'}
                          onChange={onEditRecordChange}
                        />
          },
        ]} onTabClick={onTabClick} />
        {flagSave &&
          <div className="ant-form-btns">
            <Button className="signup-form__btn" type="primary" onClick={onSave}>
              {t('SAVE')}
            </Button>
          </div>
        }
      </div>
    )

  }
}

export default SiderCardCreateDocument;