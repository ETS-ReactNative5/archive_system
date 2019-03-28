import React, { Component } from 'react';
import { Button, Input, Checkbox } from 'antd';
import Select from '../Select';

import AntTable from '../AntTable';
import AntModal from '../AntModal';
import AddMoveRecordForm from '../Forms/AddMoveRecordForm';
import EditMoveRecordForm from '../Forms/EditMoveRecordForm';

const Search = Input.Search;

class MovementsRecord extends Component {
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
    console.log('cancel');
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
      <div className="movementsRecord">
        <div className="movementsRecord__heading">
          <div className="movementsRecord__heading-buttons">
            <Button onClick={() => this.showModal('addForm')}>{ t('ADD') }</Button>
            <Button onClick={() => this.showModal('editForm')}>{ t('CHANGE') }</Button>
            <Button type="danger" >{ t('REMOVE') }</Button>
            <Button type="dashed" >{ t('VIEW') }</Button>
            <Select
              name="reports"
              value={'Reports'}
              onChange={this.handleSelectChange}
              options={
                [
                  { value: 'one', label: 'One' },
                  { value: 'two', label: 'Two' },
                ]
              }
            />
          </div>
          <div className="movementsRecord__heading-checkboxes">
            <Checkbox.Group
              className="flex-column"
              options={
                [
                  {
                    label: t('INCOME'),
                    value: 'income'
                  },
                  {
                    label: t('OUTCOME'),
                    value: 'outcome'
                  }
                ]
              }
            />
          </div>
          <Search />
        </div>
        <div className="movementsRecord__body">
          <AntTable
            columns={
              [
                {
                  key: 'fundNumb',
                  title: '№ Фонда',
                  dataIndex: 'fundNumb',
                },
                {
                  key: 'inventNumb',
                  title: '№ описи',
                  dataIndex: 'inventNumb',
                },
                {
                  key: 'incomeOutcomeDate',
                  title: 'Дата поступления/выбытия',
                  dataIndex: 'incomeOutcomeDate'
                },
                {
                  key: 'dbeg',
                  title: 'Начальная дата',
                  dataIndex: 'dbeg',
                },
                {
                  key: 'dend',
                  title: 'Конечная дата',
                  dataIndex: 'dend',
                },
                {
                  key: 'casesQuantity',
                  title: 'Количество дел',
                  dataIndex: 'caseQuantity',
                },
                {
                  key: 'inputOutputAct',
                  title: 'Акт приема-передачи',
                  dataIndex: 'inputOutputAct',
                },
                {
                  key: 'note',
                  title: 'Примечание',
                  dataIndex: 'note',
                }
              ]
            }
            loading={loading}
            dataSource={data}
          />
        </div>
        <AntModal
          visible={modal.visible}
          width={400}
          onCancel={this.handleModalCancel}
          onOk={this.handleModalOk}
        >
          {modal.type === 'addForm' && <AddMoveRecordForm t={ t } /> }
          {modal.type === 'editForm' && <EditMoveRecordForm t={ t } /> }
        </AntModal>
      </div>
    )
  }
}

export default MovementsRecord;
