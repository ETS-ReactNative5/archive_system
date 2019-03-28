import React, { Component } from 'react';
import AntTable from '../AntTable';
import {Input} from 'antd';

class ViewInventCardSize extends Component {
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
      fundNumberOfKinoReg, fundNumberOfPhoto, fundNumberOfPhono,
      fundNumberOfPhonoReg, fundNumberOfVideo, fundNumberOfVideoReg,
      fundNumberOfMCHD, fundNumberOfMCHDReg, fundNumberOfMicroforms, } = this.props.tofiConstants;

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
          regUnit: fundNumberOfKinoReg.name[lng],
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
          regUnit: fundNumberOfPhonoReg.name[lng],
          unit: ''
        },
        {
          key: fundNumberOfVideo.id,
          docType: fundNumberOfVideo.name[lng],
          storageUnit: '',
          regUnit: fundNumberOfVideoReg.name[lng],
          unit: ''
        },
        {
          key: fundNumberOfMCHD.id,
          docType: fundNumberOfMCHD.name[lng],
          storageUnit: '',
          regUnit: fundNumberOfMCHDReg.name[lng],
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
      fundNumberOfCasesWithFiles, fundNumberOfSecretCases,
      fundCasesInKazakhLang, fundNumberOfOCD, fundNumberOfInsuranceCases,
      fundNumberOfCasesInFundOfUse, fundNumberOfInsurance, fundNumberOfInsuranceCadre
    } } = this.props;
    return (
      <div className="ViewInventCardSize">
        <div className="ViewInventCardSize__table">
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
        <div className="ViewInventCardSize__data">
          <div className="ViewInventCardSize__data__row">
            <label htmlFor="eViewCasesQuantity">{fundNumberOfCasesWithFiles.name[lng]}</label>
            <Input id='eViewCasesQuantity' readOnly />
          </div>
          <div className="ViewInventCardSize__data__row">
            <label htmlFor="secretCasesQuantity">{fundNumberOfSecretCases.name[lng]}</label>
            <Input id='secretCasesQuantity' readOnly />
          </div>
          <div className="ViewInventCardSize__data__row">
            <label htmlFor="offLangCasesQuantity">{fundCasesInKazakhLang.name[lng]}</label>
            <Input id='offLangCasesQuantity' readOnly />
          </div>
          <div className="ViewInventCardSize__data__row">
            <label htmlFor="ocdQuantity">{fundNumberOfOCD.name[lng]}</label>
            <Input id='ocdQuantity' readOnly />
          </div>
          <div className="ViewInventCardSize__data__row">
            <label htmlFor="insuranceStorageUnitQuantity">{fundNumberOfInsuranceCases.name[lng]}</label>
            <Input id='insuranceStorageUnitQuantity' readOnly />
          </div>
          <div className="ViewInventCardSize__data__row">
            <label htmlFor="useFundStorageUnitQuantity">{fundNumberOfCasesInFundOfUse.name[lng]}</label>
            <Input id='useFundStorageUnitQuantity' readOnly />
          </div>
          <div className="ViewInventCardSize__data__row">
            <label htmlFor="fundNumberOfInsurance">{fundNumberOfInsurance.name[lng]}</label>
            <Input id='fundNumberOfInsurance' readOnly />
          </div>
          <div className="ViewInventCardSize__data__row">
            <label htmlFor="fundNumberOfInsuranceCadre">{fundNumberOfInsuranceCadre.name[lng]}</label>
            <Input id='fundNumberOfInsuranceCadre' readOnly />
          </div>
        </div>
      </div>
    )
  }
}

export default ViewInventCardSize;
