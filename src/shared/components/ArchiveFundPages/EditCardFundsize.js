import React, { Component } from 'react';
import AntTable from '../AntTable';
import {Input} from 'antd';

class EditCardFundsize extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataTable: [],
      loading: true
    }
  }

  componentDidMount() {
    const lng = localStorage.getItem('i18nextLng');

    const { fundNumberOfCases, fundNumberOfUpr, fundNumberOfLP,
      fundNumberOfNTD, fundNumberOfLS, fundNumberOfKino,
      fundNumberOfPhoto, fundNumberOfPhono, fundNumberOfVideo,
      fundNumberOfMCHD, fundNumberOfMicroforms, } = this.props.tofiConstants;

    this.setState({
      dataTable: [
        {
          key: fundNumberOfCases.id,
          docType: fundNumberOfCases.name[lng],
          storageUnit: '',
          regUnit: '',
          unit: ''
        },
        {
          key: fundNumberOfUpr.id,
          docType: fundNumberOfUpr.name[lng],
          storageUnit: '',
          regUnit: '',
          unit: ''
        },
        {
          key: fundNumberOfLP.id,
          docType: fundNumberOfLP.name[lng],
          storageUnit: '',
          regUnit: '',
          unit: ''
        },
        {
          key: fundNumberOfNTD.id,
          docType: fundNumberOfNTD.name[lng],
          storageUnit: '',
          regUnit: '',
          unit: ''
        },
        {
          key: fundNumberOfLS.id,
          docType: fundNumberOfLS.name[lng],
          storageUnit: '',
          regUnit: '',
          unit: ''
        },
        {
          key: fundNumberOfKino.id,
          docType: fundNumberOfKino.name[lng],
          storageUnit: '',
          regUnit: '',
          unit: ''
        },
        {
          key: fundNumberOfPhoto.id,
          docType: fundNumberOfPhoto.name[lng],
          storageUnit: '',
          regUnit: '',
          unit: ''
        },
        {
          key: fundNumberOfPhono.id,
          docType: fundNumberOfPhono.name[lng],
          storageUnit: '',
          regUnit: '',
          unit: ''
        },
        {
          key: fundNumberOfVideo.id,
          docType: fundNumberOfVideo.name[lng],
          storageUnit: '',
          regUnit: '',
          unit: ''
        },
        {
          key: fundNumberOfMCHD.id,
          docType: fundNumberOfMCHD.name[lng],
          storageUnit: '',
          regUnit: '',
          unit: ''
        },
        {
          key: fundNumberOfMicroforms.id,
          docType: fundNumberOfMicroforms.name[lng],
          storageUnit: '',
          regUnit: '',
          unit: ''
        }
      ],
      loading: false
    })
  }

  render() {
    const { loading, dataTable } = this.state;
    const lng = localStorage.getItem('i18nextLng');
    const { tofiConstants: {
      fundNumberOfInv, fundNumberOfCasesWithFiles, fundNumberOfSecretCases,
      fundCasesInKazakhLang, fundNumberOfOCD, fundNumberOfInsuranceCases,
      fundNumberOfCasesInFundOfUse, fundNumberOfInsurance, fundNumberOfInsuranceCadre
    } } = this.props;
    return (
      <div className="EditCardFundsize">
        <div className="EditCardFundsize__table">
          <AntTable
            loading={loading}
            columns={
              [
                {
                  key: 'docType',
                  title: 'Тип документа',
                  dataIndex: 'docType',
                  width: '40%'
                },
                {
                  key: 'storageUnit',
                  title: 'Единица хранения',
                  dataIndex: 'storageUnit',
                  width: '20%'
                },
                {
                  key: 'regUnit',
                  title: 'Единица учета',
                  dataIndex: 'regUnit',
                  width: '20%'
                },
                {
                  key: 'unit',
                  title: 'Единица измерения',
                  dataIndex: 'unit',
                  width: '20%'
                }
              ]
            }
            dataSource={ dataTable }
            size="small"
            bordered
            hidePagination
          />
        </div>
        <div className="EditCardFundsize__data">
          <div className="EditCardFundsize__data__row">
            <label htmlFor="inventoriesQuantity">{fundNumberOfInv.name[lng]}</label>
            <Input id='inventoriesQuantity' readOnly />
          </div>
          <div className="EditCardFundsize__data__row">
            <label htmlFor="eViewCasesQuantity">{fundNumberOfCasesWithFiles.name[lng]}</label>
            <Input id='eViewCasesQuantity' readOnly />
          </div>
          <div className="EditCardFundsize__data__row">
            <label htmlFor="secretCasesQuantity">{fundNumberOfSecretCases.name[lng]}</label>
            <Input id='secretCasesQuantity' readOnly />
          </div>
          <div className="EditCardFundsize__data__row">
            <label htmlFor="offLangCasesQuantity">{fundCasesInKazakhLang.name[lng]}</label>
            <Input id='offLangCasesQuantity' readOnly />
          </div>
          <div className="EditCardFundsize__data__row">
            <label htmlFor="ocdQuantity">{fundNumberOfOCD.name[lng]}</label>
            <Input id='ocdQuantity' readOnly />
          </div>
          <div className="EditCardFundsize__data__row">
            <label htmlFor="insuranceStorageUnitQuantity">{fundNumberOfInsuranceCases.name[lng]}</label>
            <Input id='insuranceStorageUnitQuantity' readOnly />
          </div>
          <div className="EditCardFundsize__data__row">
            <label htmlFor="useFundStorageUnitQuantity">{fundNumberOfCasesInFundOfUse.name[lng]}</label>
            <Input id='useFundStorageUnitQuantity' readOnly />
          </div>
          <div className="EditCardFundsize__data__row">
            <label htmlFor="fundNumberOfInsurance">{fundNumberOfInsurance.name[lng]}</label>
            <Input id='fundNumberOfInsurance' readOnly />
          </div>
          <div className="EditCardFundsize__data__row">
            <label htmlFor="fundNumberOfInsuranceCadre">{fundNumberOfInsuranceCadre.name[lng]}</label>
            <Input id='fundNumberOfInsuranceCadre' readOnly />
          </div>
        </div>
      </div>
    )
  }
}

export default EditCardFundsize;
