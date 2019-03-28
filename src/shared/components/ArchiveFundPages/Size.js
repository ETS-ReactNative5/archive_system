import React from 'react';
import { Button, Table } from 'antd';
import {isEmpty} from "lodash";

class Size extends React.Component {

  state = {
    data: []
  };

  componentDidMount() {
    if(isEmpty(this.props.tofiConstants)) return;
    const { initialValues,
      tofiConstants: {fundNumberOfCases, fundNumberOfUpr, fundNumberOfNTD, fundNumberOfLS,
        fundNumberOfKino, fundNumberOfPhoto, fundNumberOfPhono, fundNumberOfVideo,
        fundNumberOfMCHD ,fundNumberOfMicroforms, fundNumberOfRegis, fundNumberOfKinoReg,
        fundNumberOfPhonoReg, fundNumberOfVideoReg, fundNumberOfMCHDReg, fundNumberOfPhotoReg,
        fundNumberOfCasesWithFiles, fundNumberOfSecretCases, fundCasesInKazakhLang, fundNumberOfOCD,
        fundNumberOfInsurance, fundNumberOfInsuranceCadre, fundNumberOfInsuranceCases, fundNumberOfCasesInFundOfUse} } = this.props;
    this.setState({
      data: [
        {
          key: 'fundNumberOfCases',
          docsType: fundNumberOfCases.name[this.lng],
          archiveFundSize: initialValues.fundNumberOfCases,
          children: [
            {
              key: 'fundNumberOfUpr',
              docsType: fundNumberOfUpr.name[this.lng],
              archiveFundSize: initialValues.fundNumberOfUpr,
            },
            {
              key: 'fundNumberOfNTD',
              docsType: fundNumberOfNTD.name[this.lng],
              archiveFundSize: initialValues.fundNumberOfNTD,
            },
            {
              key: 'fundNumberOfLS',
              docsType: fundNumberOfLS.name[this.lng],
              archiveFundSize: initialValues.fundNumberOfLS,
            },
            {
              key: 'fundNumberOfKino',
              docsType: fundNumberOfKino.name[this.lng],
              archiveFundSize: initialValues.fundNumberOfKino,
            },
            {
              key: 'fundNumberOfPhoto',
              docsType: fundNumberOfPhoto.name[this.lng],
              archiveFundSize: initialValues.fundNumberOfPhoto,
            },
            {
              key: 'fundNumberOfPhono',
              docsType: fundNumberOfPhono.name[this.lng],
              archiveFundSize: initialValues.fundNumberOfPhono,
            },
            {
              key: 'fundNumberOfVideo',
              docsType: fundNumberOfVideo.name[this.lng],
              archiveFundSize: initialValues.fundNumberOfVideo,
            },
            {
              key: 'fundNumberOfMCHD',
              docsType: fundNumberOfMCHD.name[this.lng],
              archiveFundSize: initialValues.fundNumberOfMCHD,
            },
            {
              key: 'fundNumberOfMicroforms',
              docsType: fundNumberOfMicroforms.name[this.lng],
              archiveFundSize: initialValues.fundNumberOfMicroforms,
            }
          ]
        },
        {
          key: 'fundNumberOfRegis',
          docsType: fundNumberOfRegis.name[this.lng],
          archiveFundSize: initialValues.fundNumberOfRegis,
          children: [
            {
              key: 'fundNumberOfKinoReg',
              docsType: fundNumberOfKinoReg.name[this.lng],
              archiveFundSize: initialValues.fundNumberOfKinoReg,
            },
            {
              key: 'fundNumberOfPhonoReg',
              docsType: fundNumberOfPhonoReg.name[this.lng],
              archiveFundSize: initialValues.fundNumberOfPhonoReg,
            },
            {
              key: 'fundNumberOfVideoReg',
              docsType: fundNumberOfVideoReg.name[this.lng],
              archiveFundSize: initialValues.fundNumberOfVideoReg,
            },
            {
              key: 'fundNumberOfMCHDReg',
              docsType: fundNumberOfMCHDReg.name[this.lng],
              archiveFundSize: initialValues.fundNumberOfMCHDReg,
            },
            {
              key: 'fundNumberOfPhotoReg',
              docsType: fundNumberOfPhotoReg.name[this.lng],
              archiveFundSize: initialValues.fundNumberOfPhotoReg,
            }
          ]
        },
        {
          key: 'fundNumberOfCasesWithFiles',
          docsType: fundNumberOfCasesWithFiles.name[this.lng],
          archiveFundSize: initialValues.fundNumberOfCasesWithFiles
        },
        {
          key: 'fundNumberOfSecretCases',
          docsType: fundNumberOfSecretCases.name[this.lng],
          archiveFundSize: initialValues.fundNumberOfSecretCases
        },
        {
          key: 'fundCasesInKazakhLang',
          docsType: fundCasesInKazakhLang.name[this.lng],
          archiveFundSize: initialValues.fundCasesInKazakhLang
        },
        {
          key: 'fundNumberOfOCD',
          docsType: fundNumberOfOCD.name[this.lng],
          archiveFundSize: initialValues.fundNumberOfOCD
        },
        {
          key: 'fundNumberOfInsurance',
          docsType: fundNumberOfInsurance.name[this.lng],
          archiveFundSize: initialValues.fundNumberOfInsurance
        },
        {
          key: 'fundNumberOfInsuranceCadre',
          docsType: fundNumberOfInsuranceCadre.name[this.lng],
          archiveFundSize: initialValues.fundNumberOfInsuranceCadre
        },
        {
          key: 'fundNumberOfInsuranceCases',
          docsType: fundNumberOfInsuranceCases.name[this.lng],
          archiveFundSize: initialValues.fundNumberOfInsuranceCases
        },
        {
          key: 'fundNumberOfCasesInFundOfUse',
          docsType: fundNumberOfCasesInFundOfUse.name[this.lng],
          archiveFundSize: initialValues.fundNumberOfCasesInFundOfUse
        }
      ]
    })
  }

  renderTableHeader = () => {
    return (
      <div>
        <Button>{this.props.t('UPDATE')}</Button>
      </div>
    )
  };

  render() {
    this.lng = localStorage.getItem('i18nextLng');
    return (
      <Table
        title={this.renderTableHeader}
        dataSource={this.state.data}
        pagination={false}
        columns={[
          {
            key: 'docsType',
            title: this.props.t('DOCUMENTATION_TYPE'),
            dataIndex: 'docsType',
            width: '70%'
          },
          {
            key: 'archiveFundSize',
            title: this.props.t('ARCHIVE_FUND_SIZE'),
            dataIndex: 'archiveFundSize',
            width: '30%'
          }
        ]}
        size='small'
        scroll={{ y: '100%' }}
        bordered
      />
    )
  }
}

export default Size;