import React, { Component } from 'react';
import { Button, Input } from 'antd';
import { Link } from 'react-router-dom';

import AntTable from '../AntTable';
import AntModal from '../AntModal';
import AddNewDocForm from '../Forms/AddNewDocForm';

const Search = Input.Search;

/*eslint eqeqeq:0*/
class ViewCardCasesDocumentsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loading: true,
      errors: {},
      modal: {
        visible: false,
        type: ''
      },
      search: ''
    }
  }

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
    console.log('cancel');
    this.setState({
      modal: {
        visible: false
      }
    });
  };

  onSearch = e => {
    this.setState({ search: e.target.value })
  };

  renderTableData = item => {
    const { fundDbeg, fundDend, fundNumber, fundIndex, fundCategory, fundType } = this.props.tofiConstants;
    const fundNumbObj = item.props.find(element =>  element.prop == fundNumber.id),
      fundIndexObj = item.props.find(element => element.prop == fundIndex.id),
      fundCategoryObj = item.props.find(element => element.prop == fundCategory.id),
      fundTypeObj = item.props.find(element => element.prop == fundType.id),
      dendObj = item.props.find(element => element.prop == fundDend.id),
      dbegObj = item.props.find(element => element.prop == fundDbeg.id);
    return {
      key: item.id,
      fundName: !!item.name ? item.name[localStorage.getItem('i18nextLng')] || '' : '',
      fundNumber: !!fundNumbObj ? fundNumbObj.value || '' : '',
      fundIndex: !!fundIndexObj ? fundIndexObj.value || '' : '',
      fundDend: !!dendObj ? dendObj.value || '' : '',
      fundDbeg: !!dbegObj ? dbegObj.value || '' : '',
      fundCategory: !!fundCategoryObj ? fundCategoryObj.value || '' : '',
      fundType: !!fundTypeObj ? fundTypeObj.value || '' : ''
    }
  };

  renderTableFooter = () => {
    return (
      <div className="table-footer">
        <div className="flex">
          <div className="label"><label htmlFor="">{this.props.t('COUNT_FUNDS')}</label><Input size='small' type="text" readOnly/></div>
          <div className="label"><label htmlFor="">{this.props.t('COUNT_INVENT')}</label><Input size='small' type="text" readOnly/></div>
          <div className="label"><label htmlFor="">{this.props.t('COUNT_CASES')}</label><Input size='small' type="text" readOnly/></div>
          <div className="label"><label htmlFor="">{this.props.t('COUNT_CASES_WITH_ELECTR')}</label><Input size='small' type="text" readOnly/></div>
        </div>
        <div className="data-length">
          <div className="label"><label htmlFor="">{this.props.t('COUNT_ITOG')}</label><Input size='small' type="text" readOnly value={this.filteredData.length + ' / ' + this.state.data.length}/></div>
        </div>
      </div>
    )
  };

  render() {
    const { loading, data, modal, search } = this.state;
    const { idFundCard, idInventCard, idCaseCard, t } = this.props;

    this.filteredData = data.map(this.renderTableData).filter(item => {
      return (
        item.inventNumb === search ||
        item.inventName.toLowerCase().includes(search.toLowerCase()) ||
        item.inventType.toLowerCase().includes(search.toLowerCase()) ||
        String(item.casesQuantity).toLowerCase().includes(search.toLowerCase()) ||
        String(item.caseNumberOfPages).toLowerCase().includes(search.toLowerCase())
      )
    });

    return (
      <div className="ViewCardCasesDocumentsList">
        <div className="ViewCardCasesDocumentsList__heading">
          <div className="ViewCardCasesDocumentsList__heading-buttons">
            <Button onClick={() => this.showModal('addForm')}>{ t('ADD') }</Button>
            <Link to={`/archiveFund/editFundCard/${idFundCard}/${idInventCard}/${idCaseCard}/123456`}><Button>{ t('EDIT_CARD') }</Button></Link>
            <Button type="danger" >{ t('REMOVE') }</Button>
          </div>
          <Search onChange={this.onSearch}/>
        </div>
        <div className="ViewCardCasesDocumentsList__body">
          <AntTable
            columns={
              [
                {
                  key: 'inventNumb',
                  title: '№ документа',
                  dataIndex: 'inventNumb'
                },
                {
                  key: 'inventName',
                  title: 'Название документа',
                  dataIndex: 'inventName'
                },
                {
                  key: 'inventType',
                  title: 'Тип документа',
                  dataIndex: 'inventType'
                },
                {
                  key: 'dbeg',
                  title: 'Дата документа',
                  dataIndex: 'dbeg'
                },
                {
                  key: 'casesQuantity',
                  title: 'Количество страниц',
                  dataIndex: 'casesQuantity'
                },
                {
                  key: 'elecViewQuantity',
                  title: 'Имеют электронный образ',
                  dataIndex: 'elecViewQuantity'
                }
              ]
            }
            loading={ loading }
            dataSource={ this.filteredData }
            footer={ this.renderTableFooter }
          />
        </div>
        <AntModal
          onOk={this.handleModalOk}
          onCancel={this.handleModalCancel}
          visible={modal.visible}
          width={400}
          title={ t('ADDING_NEW_DOC') }
        >
          <AddNewDocForm  t={ t } />
        </AntModal>
      </div>
    )
  }
}

export default ViewCardCasesDocumentsList;
