import React from 'react';
import {Button, Form, Input} from 'antd';
import AntTable from '../AntTable';
import AntModal from '../AntModal';

class EditResearchersTheResearcherTopics extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loading: true,
      errors: {},
      modal: {
        visible: false,
        type: '',
        title: ''
      },
      radioValue: 'active'
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
    this.setState({
      modal: {
        visible: false
      }
    });
  };

  handleTextInputChange = e => {
   // console.log(e.target.value);
  };

  createForm = props => {
    return (
      <Form className="antForm-spaceBetween">
        <Form.Item
          label={props.topicName}
          labelCol={{span: 10}}
          wrapperCol={{span: 14}}
          colon={false}
        >
          <Input
            onChange={this.handleTextInputChange}
          />
        </Form.Item>
        <Form.Item
          label={props.dbeg}
          labelCol={{span: 10}}
          wrapperCol={{span: 14}}
          colon={false}
        >
          <Input
            type='date'
          />
        </Form.Item>
        <Form.Item
          label={props.dend}
          labelCol={{span: 10}}
          wrapperCol={{span: 14}}
          colon={false}
        >
          <Input
            type='date'
          />
        </Form.Item>
      </Form>
    )
  };
  changeForm = props => {
    return (
      <Form className="antForm-spaceBetween">
        <Form.Item
          label={props.topicName}
          labelCol={{span: 10}}
          wrapperCol={{span: 14}}
          colon={false}
        >
          <Input
            onChange={this.handleTextInputChange}
          />
        </Form.Item>
        <Form.Item
          label={props.dbeg}
          labelCol={{span: 10}}
          wrapperCol={{span: 14}}
          colon={false}
        >
          <Input
            type='date'
          />
        </Form.Item>
        <Form.Item
          label={props.dend}
          labelCol={{span: 10}}
          wrapperCol={{span: 14}}
          colon={false}
        >
          <Input
            type='date'
          />
        </Form.Item>
      </Form>
    )
  };

  render() {
    const { t } = this.props;
    const { modal } = this.state;
    return (
      <div className="editResearchersTheResearcherTopics">
        <div className="editResearchersTheResearcherTopics__heading">
          <Button onClick={() => this.showModal('createForm', t('CREATING_NEW_TOPIC'))}>{ t('CREATE') }</Button>
          <Button onClick={() => this.showModal('changeForm', t('EDITING_TOPIC'))}>{ t('CHANGE') }</Button>
          <Button type='danger'>{ t('REMOVE') }</Button>
        </div>
        <div className="editResearchersTheResearcherTopics__body">
          <AntTable
            columns={
              [
                {
                  key: 'name',
                  title: 'Наименование',
                  dataIndex: 'name',
                },
                {
                  key: 'begin',
                  title: 'Начало',
                  dataIndex: 'begin',
                },
                {
                  key: 'end',
                  title: 'Конец',
                  dataIndex: 'end',
                }
              ]
            }
            loading={true}
            dataSource={[]}
          />
        </div>
        <AntModal
          onOk={this.handleModalOk}
          onCancel={this.handleModalCancel}
          visible={modal.visible}
          title={ modal.title }
        >
          { modal.type === 'createForm' && this.createForm({topicName: t('TOPIC_NAME'), dbeg: t('DBEG'), dend: t('DEND')}) }
          { modal.type === 'changeForm' && this.changeForm({topicName: t('TOPIC_NAME'), dbeg: t('DBEG'), dend: t('DEND')}) }
        </AntModal>
      </div>
    )
  }
};

export default EditResearchersTheResearcherTopics;
