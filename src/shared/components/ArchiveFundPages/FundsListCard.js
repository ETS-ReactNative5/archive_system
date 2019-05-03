import React from 'react';
import { message } from 'antd';

import AntTabs from "../AntTabs";
import MainInfoFundForm from "./MainInfoFundForm";
import DescriptiveInfo from "./DescriptiveInfo";
import {calcCountDocsOfFund, getValueOfMultiText} from "../../actions/actions";
import Size from "./Size";

class FundsListCard extends React.Component {

  state = {
    annotationContentOfDocument: {},
    invMulti: {},
    fundHistoricalNoteMulti: {},
    sizeLoading: false,
    sizeData: [],
  };
  /*"fundNumberOfCases,fundNumberOfUpr,fundNumberOfNTD,fundNumberOfLS," +
              "fundNumberOfKino,fundNumberOfPhoto,fundNumberOfPhono,fundNumberOfVideo," +
              "fundNumberOfMCHD,fundNumberOfMicroforms,fundNumberOfRegis,fundNumberOfKinoReg," +
              "fundNumberOfPhonoReg,fundNumberOfVideoReg,fundNumberOfMCHDReg,fundNumberOfPhotoReg," +
              "fundNumberOfCasesWithFiles,fundNumberOfSecretCases,fundCasesInKazakhLang,fundNumberOfOCD," +
              "fundNumberOfInsurance,fundNumberOfInsuranceCadre,fundNumberOfInsuranceCases,fundNumberOfCasesInFundOfUse",*/

  componentDidMount() {
    if(this.props.initialValues.key) {
      calcCountDocsOfFund(this.props.initialValues.key.split('_')[1])
        .then(res => this.setState({ sizeData: res.data }));
      getValueOfMultiText(
        this.props.initialValues.key.split('_')[1],
        'annotationContentOfDocument,invMulti,fundHistoricalNoteMulti'
      )
      .then(res => {
        if(res.success) {
          ['annotationContentOfDocument', 'invMulti', 'fundHistoricalNoteMulti'].forEach(c => {
            const obj = res.data.find(o => o.prop == this.props.tofiConstants[c].id);
            obj && this.setState({ [c]: obj.valueMultiStr })
          });
        } else {
          res.errors.forEach(err => message.error(err.text))
        }
      }).catch(err => {
        console.warn(err);
      })
    }
  }

  componentDidUpdate(prevProps) {
    if(prevProps.initialValues.key !== this.props.initialValues.key) {
      calcCountDocsOfFund(this.props.initialValues.key.split('_')[1])
        .then(res => this.setState({sizeData: res.data}));
      getValueOfMultiText(
        this.props.initialValues.key.split('_')[1],
        'annotationContentOfDocument,invMulti,fundHistoricalNoteMulti'
      ).then(res => {
        if(res.success) {
          ['annotationContentOfDocument', 'invMulti', 'fundHistoricalNoteMulti'].forEach(c => {
            const obj = res.data.find(o => o.prop == this.props.tofiConstants[c].id);
            obj && this.setState({ [c]: obj.valueMultiStr })
          });
        } else {
          res.errors.forEach(err => message.error(err.text))
        }
      }).catch(err => {
        console.warn(err);
      })
    }
  }

  render() {
    const { annotationContentOfDocument, invMulti, fundHistoricalNoteMulti } = this.state;
    const { t, tofiConstants, initialValues, onCreateObj } = this.props;
    return (
      <AntTabs
        tabs={[
          {
            tabKey: 'mainInfo',
            tabName: t('MAIN_INFO'),
            tabContent: <MainInfoFundForm
              tofiConstants={tofiConstants}
              t={t}
              initialValues={initialValues}
              onCreateObj={onCreateObj}
            />
          },
          {
            tabKey: 'descriptiveInfo',
            tabName: t('DESCRIPTIVE_INFO'),
            tabContent: <DescriptiveInfo
              tofiConstants={tofiConstants}
              initialValues={{...initialValues, annotationContentOfDocument, invMulti, fundHistoricalNoteMulti}}
              t={t}
            />
          },
          {
            tabKey: 'size',
            tabName: t('SIZE'),
            tabContent: <Size
              tofiConstants={tofiConstants}
              initialValues={this.state.sizeData}
              keyFund ={initialValues.key}
              sizeData={this.state.sizeData}
              sizeLoading={this.state.sizeLoading}
              t={t}
            />
          }
        ]}
      />
    )
  }
}

export default FundsListCard;