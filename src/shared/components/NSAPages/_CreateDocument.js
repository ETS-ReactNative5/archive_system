import React from 'react'
import { Button, Input, Radio } from 'antd'
import Select from 'react-select';
import PropTypes from 'prop-types';

import AntModal from '../AntModal';
import AntTable from '../AntTable';
import {Link} from 'react-router-dom';
import {isEmpty, isEqual} from 'lodash';


const Search = Input.Search;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class CreateDocument extends React.Component {

  state = {
    loading: false,
    selectedRow: {},
    modal: {
      visible: false,
      type: ''
    },
    tableData: [
      {
        key: '1',
        number: '1',
        fundNumb: '1463',
        invNumb: '1',
        caseNumb: '236',
        docName: 'Постановление партии',
        docType: 'управленческая',
        date: '01.01.1956',
        sheets: '24-30'
      },
      {
        key: '2',
        number: '2',
        fundNumb: '126',
        invNumb: '5',
        caseNumb: '1256',
        docName: 'Фотосъемка',
        docType: 'фото',
        date: '23.05.19568',
        sheets: '24-30'
      },
      {
        key: '3',
        number: '3',
        fundNumb: '1296',
        invNumb: '3',
        caseNumb: '129',
        docName: 'Кино про войну',
        docType: 'кино',
        date: '02.03.1943',
        sheets: '24-30'
      },
      {
        key: '4',
        number: '4',
        fundNumb: '963',
        invNumb: '5',
        caseNumb: '8945',
        docName: 'Видео выступление',
        docType: 'видео',
        date: '01.01.1956',
        sheets: '24-30'
      },
      {
        key: '5',
        number: '5',
        fundNumb: '65',
        invNumb: '1',
        caseNumb: '236',
        docName: 'Звукозапись',
        docType: 'фоно',
        date: '01.01.1956',
        sheets: '24-30'
      },
      {
        key: '6',
        number: '6',
        fundNumb: '63',
        invNumb: '2',
        caseNumb: '124',
        docName: 'Проект здания',
        docType: 'нтд',
        date: '01.01.1956',
        sheets: '24-30'
      },
      {
        key: '7',
        number: '7',
        fundNumb: '13',
        invNumb: '4',
        caseNumb: '24425',
        docName: 'Байтурсынов А.',
        docType: 'именная',
        date: '01.01.1886',
        sheets: '24-30'
      },
    ],
    search: ''
  };

  AddNew = () => {
    return (
      <div className="addForm">
        <div className="addForm__row">
          <label htmlFor="">
            Краткое наименование
          </label>
          <Input />
          <RadioGroup onChange={this.changeLang} defaultValue="kz">
            <RadioButton value="kz">kz</RadioButton>
            <RadioButton value="ru">ru</RadioButton>
            <RadioButton value="en">en</RadioButton>
          </RadioGroup>
        </div>
        <div className="addForm__row">
          <label htmlFor="">
            Полное наименование
          </label>
          <Input />
          <RadioGroup onChange={this.changeLang} defaultValue="kz">
            <RadioButton value="kz">kz</RadioButton>
            <RadioButton value="ru">ru</RadioButton>
            <RadioButton value="en">en</RadioButton>
          </RadioGroup>
        </div>
        <div className="addForm__row">
          <label htmlFor="">Уровень доступа</label>
          <Select searchable={false}/>
        </div>
        <div className="addForm__row">
          <label htmlFor="">Родительский объект</label>
          <Select searchable={false}/>
        </div>
      </div>
    )
  };

  showModal = modalType => {
    this.setState({
      modal: {
        visible: true,
        type: modalType
      }
    });
  };
  handleModalOk = () => {
    this.setState({
      modal: {
        visible: false
      }
    });
  };
  handleModalCancel = () => {
    this.setState({
      modal: {
        visible: false
      }
    });
  };

  onSearch = e => {
    this.setState({ search: e.target.value })
  };

  changeLang = e => {
    console.log(`radio checked:${e.target.value}`);
  };

  changeSelectedRow = rec => {
    if(isEmpty(this.state.selectedRow) || !isEqual(this.state.selectedRow, rec)){
      this.setState({ selectedRow: rec })
    } else {
      this.props.history.push(`/sra/createDocument/${this.state.selectedRow.number}/${this.state.selectedRow.key}`);
    }
  };

  render() {
    const { modal, search, tableData, selectedRow } = this.state;
    const { t } = this.props;

    const filteredTableData = tableData.filter(row => {
      return (
        row.number.toLowerCase().includes(search.toLowerCase()) ||
        row.fundNumb.toLowerCase().includes(search.toLowerCase()) ||
        row.invNumb.toLowerCase().includes(search.toLowerCase()) ||
        row.caseNumb.toLowerCase().includes(search.toLowerCase()) ||
        row.docName.toLowerCase().includes(search.toLowerCase()) ||
        row.docType.toLowerCase().includes(search.toLowerCase()) ||
        row.date.toLowerCase().includes(search.toLowerCase())
      );
    });

    return (
      <div className="CreateDocument">
        <div className="tableHeader__btns">
          <Button onClick={() => this.showModal('addForm')}>{t('ADD')}</Button>
          <Link to={`/sra/${selectedRow.number}/${selectedRow.key}`}><Button disabled={isEmpty(selectedRow)}>{t('EDIT_CARD')}</Button></Link>
          <Button type='danger' disabled={isEmpty(selectedRow)}>{t('REMOVE')}</Button>
          <Select />
          <Search onChange={this.onSearch} value={search}/>
        </div>
        <div className="CreateDocument__body">
          <AntTable
            loading={false}
            columns={[
              {
                key: 'number',
                title: '№',
                dataIndex: 'number',
                width: '5%'
              },
              {
                key: 'fundNumb',
                title: t('FUND_NUMB'),
                dataIndex: 'fundNumb',
                width: '7%'
              },
              {
                key: 'invNumb',
                title: t('INV_NUMB'),
                dataIndex: 'invNumb',
                width: '7%'
              },
              {
                key: 'caseNumb',
                title: t('CASE_NUMB'),
                dataIndex: 'caseNumb',
                width: '7%'
              },
              {
                key: 'docName',
                title: t('DOC_NAME'),
                dataIndex: 'docName',
                width: '30%'
              },
              {
                key: 'docType',
                title: t('DOC_TYPE'),
                dataIndex: 'docType',
                width: '16%'
              },
              {
                key: 'date',
                title: t('DATE'),
                dataIndex: 'date',
                width: '16%'
              },
              {
                key: 'sheets',
                title: t('SHEETS'),
                dataIndex: 'sheets',
                width: '12%'
              }
            ]}
            dataSource={ filteredTableData }
            hidePagination
            changeSelectedRow={this.changeSelectedRow}
            openedBy="CreateDocument"
          />
        </div>
        <AntModal
          onOk={this.handleModalOk}
          onCancel={this.handleModalCancel}
          visible={modal.visible}
          wrapClassName="NSA-modal"
          title={ t('ADD') }
        >
          { modal.type === 'addForm' && <this.AddNew /> }
        </AntModal>
      </div>
    )
  }
}

CreateDocument.propTypes = {
  t: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

export default CreateDocument;