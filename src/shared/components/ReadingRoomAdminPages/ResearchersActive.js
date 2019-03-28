import React, { Component } from 'react';
import {Button, Input, Radio} from 'antd';
import { Link } from 'react-router-dom';

import AntTable from '../AntTable';
import AntModal from '../AntModal';
import CreateNewResearcherForm from '../Forms/CreateNewResearcherForm';

const Search = Input.Search;

class ResearchersActive extends Component {
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
      radioValue: 'active'
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

  handleRadioChange = e => {
    this.setState({radioValue: e.target.value})
  };

  render() {
    const { loading, data, modal, radioValue } = this.state;
    const { t } = this.props;
    return (
      <div className="researchersActive">
        <div className="researchersActive__heading">
          <div className="researchersActive__heading-buttons">
            <Button onClick={() => this.showModal('createForm')}>{t('ADD')}</Button>
            <Link to="/readingRoomAdmin/editResearcher/123"><Button>{t('EDIT_CARD')}</Button></Link>
            <Button type="danger" >{t('REMOVE')}</Button>
          </div>
          <div className="researchersActive__heading-radio">
            <Radio.Group value={radioValue} onChange={this.handleRadioChange}>
              <Radio value='active'>{ t('ACTIVE') }</Radio>
              <Radio value='blocked'>{ t('BLOCKED') }</Radio>
              <Radio value='all'>{ t('ALL_RESEARCHERS') }</Radio>
            </Radio.Group>
          </div>
          <Search />
        </div>
        <div className="researchersActive__body">
          <AntTable
            columns={
              [
                {
                  key: 'fullName',
                  title: 'ФИО',
                  dataIndex: 'fullName'
                },
                {
                  key: 'personalCaseNumb',
                  title: 'Номер личного дела',
                  dataIndex: 'personalCaseNumb'
                },
                {
                  key: 'regDate',
                  title: 'Дата регистрации',
                  dataIndex: 'regDate'
                },
                {
                  key: 'workEndDate',
                  title: 'Дата окончания работы',
                  dataIndex: 'workEndDate'
                },
                {
                  key: 'idNumb',
                  title: '№ документа удостоверяющий личность',
                  dataIndex: 'idNumb',
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
          title={ t('ADDING_NEW_RESEARCHER') }
          width={600}
        >
          { modal.type === 'createForm' && <CreateNewResearcherForm t={ t }/> }
        </AntModal>
      </div>
    )
  }
}

export default ResearchersActive;
