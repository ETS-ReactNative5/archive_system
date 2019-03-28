import React, { Component } from 'react';
import { Button, Input } from 'antd';

import AntTable from '../AntTable';
import AntModal from '../AntModal';
import CreateNewResearcherForm from '../Forms/CreateNewResearcherForm';

const Search = Input.Search;

class ResearchersTemporary extends Component {
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

  render() {
    const { loading, data, modal } = this.state;
    const { t } = this.props;
    return (
      <div className="researchersTemporary">
        <div className="researchersTemporary__heading">
          <div className="researchersTemporary__heading-buttons">
            <Button onClick={() => this.showModal('createForm')}>{t('CREATE_USER_BASED_ON')}</Button>
            <Button>{ t('UPDATE') }</Button>
            <Button type="danger" >{t('CLEAR_OUTDATED_RECORDS')}</Button>
          </div>
          <Search />
        </div>
        <div className="researchersTemporary__body">
          <AntTable
            columns={
              [
                {
                  key: 'fullName',
                  title: 'ФИО',
                  dataIndex: 'fullName',
                },
                {
                  key: 'regDate',
                  title: 'Дата регистрации',
                  dataIndex: 'regDate',
                }
              ]
            }
            loading={loading}
            dataSource={data}
          />
        </div>
        <AntModal
          onOk={this.handleModalOk}
          onCancel={this.handleModalCancel}
          visible={modal.visible}
          title={ t('DATA_FOR_REGISTRATION') }
        >
          { modal.type === 'createForm' && <CreateNewResearcherForm t={ t }/> }
        </AntModal>
      </div>
    )
  }
}

export default ResearchersTemporary;
