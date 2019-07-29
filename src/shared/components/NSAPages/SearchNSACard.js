import React from 'react';
import AntTabs from "../AntTabs";
import SearchNSAArchiveFund from "./SearchNSAArchiveFund";
import SearchNSAAnnotation from "./SearchNSAAnnotation";
import SearchNSAAccessRights from "./SearchNSAAccessRights";
import SearchNSABibliography from "./SearchNSABibliography";
import SearchNSAReferenceByType from "./SearchNSAReferenceByType";
import Size from "../ArchiveFundPages/Size";
import {calcCountDocsOfFund} from "../../actions/actions";

class FundsListCard extends React.Component {

  state = {
    sizeLoading: false,
    sizeData: [],

  };

  componentDidMount() {
    if(this.props.initialValues.key) {
      calcCountDocsOfFund(this.props.initialValues.key.split('_')[1])
        .then(res => this.setState({sizeData: res.data}));
    }
  }

  componentDidUpdate(prevProps) {
    if(prevProps.initialValues.key !== this.props.initialValues.key) {
      calcCountDocsOfFund(this.props.initialValues.key.split('_')[1])
        .then(res => this.setState({sizeData: res.data}));
    }
  }

  render() {
    const { t, tofiConstants, onSaveCubeData, initialValues, onCreateObj,
      record, dataRec, onEditRecordChange, closeCard,activeKey, onTabClick, onSave, onSave2,
      annotationContentOfDocument, invMulti, fundHistoricalNoteMulti,fundBiographArcheographNoteMulti, fundCaseFlags,
    } = this.props;
    return (
      <AntTabs activeKey={activeKey} onTabClick={onTabClick}
        tabs={[
          {
            tabKey: 'archiveFund',
            tabName: t('ARCHIVE_FUND'),
            tabContent: <SearchNSAArchiveFund
              t={t} 
              tofiConstants={tofiConstants} 
              record={record}
              initialValues={initialValues}
              onSave={onSave}
            />
          },
          {
            tabKey: 'annotation',
            tabName: t('ANNOTATION'),
            tabContent: <SearchNSAAnnotation
              t={t} 
              tofiConstants={tofiConstants} 
              record={record}
              dataRec={dataRec}
              initialValues={dataRec}
              onSave2={onSave2}
              closeCard={closeCard}
              onSave={onSave}
              initialValues2={initialValues}
              annotationContentOfDocument={annotationContentOfDocument}
              invMulti={invMulti} 
              fundHistoricalNoteMulti={fundHistoricalNoteMulti}
              fundBiographArcheographNoteMulti={fundBiographArcheographNoteMulti}
              withIdDPV = {this.props.withIdDPV}
          />
          },
          {
            tabKey: 'size',
            tabName: t('SIZE'),
            tabContent: <Size
              tofiConstants={tofiConstants}
              initialValues={this.state.sizeData}
              sizeLoading={this.state.sizeLoading}
              t={t}
              withIdDPV = {this.props.withIdDPV}
              keyFund = {record.key}
            />
          },
          {
            tabKey: 'accessRights',
            tabName: t('ACCESS_RIGHTS'),
            tabContent: <SearchNSAAccessRights
              t={t}
              tofiConstants={tofiConstants}
              record={record}
              onSave={onSave}
              initialValues={initialValues}
              dataRec={dataRec}
              fundCaseFlags={fundCaseFlags}
              withIdDPV = {this.props.withIdDPV}
            />
          },
          // {
          //   tabKey: 'bibliography',
          //   tabName: t('BIBLIOGRAPHY'),
          //   tabContent: <SearchNSABibliography
          //     tofiConstants={tofiConstants}
          //     initialValues={initialValues}
          //     t={t}
          //   />
          // },
          {
            tabKey: 'guidBooks',
            tabName: t('GUID_BOOKS'),
            tabContent: <SearchNSAReferenceByType
              t={t}
              tofiConstants={tofiConstants}
              myValues={dataRec && !!dataRec.fundToGuidbook?dataRec.fundToGuidbook:[]}
              constReferenceType={tofiConstants.vidGuidebook}
              myClass={'clsPutev'}
              myType={'vidGuidebook'}
              nameToHead={record.fundList}
              onSave={onSave}
              initialValues={initialValues}

              withIdDPV = {this.props.withIdDPV}
            />
          },
        ]} 
      />
    );
  }
}

export default FundsListCard;