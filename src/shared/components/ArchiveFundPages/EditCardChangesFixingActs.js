import React, { Component } from 'react';
import { Button } from 'antd';

import AntTable from '../AntTable';
import AntModal from '../AntModal';
import AddNewActForm from '../Forms/AddNewActForm';
import EditActDataForm from '../Forms/EditActDataForm';

class EditCardChangesFixingActs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loading: true,
      errors: {},
      modal: {
        visible: false,
        type: ''
      }
    }
  }

  showModal = (modalType, modalTitle) => {
    this.setState({
      modal: {
        visible: true,
        type: modalType,
        title: modalTitle
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

  componentDidMount() {

  }

  renderTableHeader = () => {
    const { t } = this.props;
    return (
      <div className="EditCardChangesFixingActs__heading">
        <div className="EditCardChangesFixingActs__heading-buttons">
          <Button onClick={() => this.showModal('addForm', t('ADD_NEW_ACT'))}>{t('ADD')}</Button>
          <Button onClick={() => this.showModal('editForm', t('EDIT_ACT_DATA'))}>{t('CHANGE')}</Button>
          <Button type="danger" >{t('REMOVE')}</Button>
          <Button type="dashed" >{t('VIEW')}</Button>
        </div>
      </div>
    )
  };

  render() {
    const { loading, data, modal } = this.state;
    const lng = localStorage.getItem('i18nextLng');
    const { t, tofiConstants: { fundActNumber, fundActs, fundActDate, fundActScan } } = this.props;
    return (
      <div className="EditCardChangesFixingActs">
        <div className="EditCardChangesFixingActs__body">
          <AntTable
            columns={
              [
                {
                  key: 'actNumb',
                  title: fundActNumber.name[lng],
                  dataIndex: 'actNumb',
                  width: '10%'
                },
                {
                  key: 'actName',
                  title: fundActs.name[lng],
                  dataIndex: 'actName',
                  width: '40%'
                },
                {
                  key: 'actDate',
                  title: fundActDate.name[lng],
                  dataIndex: 'actDate',
                  width: '25%'
                },
                {
                  key: 'elecView',
                  title: fundActScan.name[lng],
                  dataIndex: 'elecView',
                  width: '25%'
                }
              ]
            }
            loading={loading}
            dataSource={data}
            title={this.renderTableHeader}
          />
        </div>
        <AntModal
          onOk={this.handleModalOk}
          onCancel={this.handleModalCancel}
          visible={modal.visible}
          width={400}
          title={modal.title}
        >
          { modal.type === 'addForm' && <AddNewActForm t={ t }/> }
          { modal.type === 'editForm' && <EditActDataForm t={ t }/> }
        </AntModal>
      </div>
    )
  }
}

export default EditCardChangesFixingActs;
