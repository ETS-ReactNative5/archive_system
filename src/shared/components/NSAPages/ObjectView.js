import React from 'react'
import { Button, Input, Radio } from 'antd'
import Select from '../Select';
import PropTypes from 'prop-types';

import AntModal from '../AntModal';
import AntTable from '../AntTable';


const Search = Input.Search;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class ObjectView extends React.Component {

  state = {
    modal: {
      visible: false,
      type: ''
    },
    tableData: [
      {
        key: '1',
        name: 'ТОО "КСИ "Фактор"',
        fullName: 'Товарищество с ограниченной ответственностью "Компания системных исследований "Фактор"',
        children: [
          {
            key: '11',
            name: 'Отдел разработки',
            fullName: 'Отдел разработки'
          },
          {
            key: '12',
            name: 'Отдел по работе с клиентами',
            fullName: 'Отдел по работе с клиентами'
          },
          {
            key: '13',
            name: 'Бухгалтерия',
            fullName: 'Бухгалтерия'
          }
        ]
      }
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
          <Select isSearchable={false}/>
        </div>
        <div className="addForm__row">
          <label htmlFor="">Родительский объект</label>
          <Select isSearchable={false}/>
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

  modalTitle = () => {
    switch (this.state.modal.type) {
      case 'addForm': return this.props.t('ADD');
      case 'changeForm': return this.props.t('CHANGE');
      default: return ''
    }
  };

  render() {
    const { modal, search, tableData } = this.state;
    const { t } = this.props;

    const filteredTableData = tableData.filter(row => {
      return (
        row.name.toLowerCase().includes(search.toLowerCase()) ||
        row.fullName.toLowerCase().includes(search.toLowerCase())
      );
    });

    return (
      <div className="objectView">
        <div className="objectView__heading">
          <Button onClick={() => this.showModal('addForm')}>{t('ADD')}</Button>
          <Button onClick={() => this.showModal('changeForm')}>{t('CHANGE')}</Button>
          <Button type='danger'>{t('REMOVE')}</Button>
          <Search onChange={this.onSearch} value={search}/>
        </div>
        <div className="objectView__body">
          <AntTable
            loading={false}
            columns={[
              {
                key: 'name',
                title: t('SHORT_NAME'),
                dataIndex: 'name',
                width: '50%'
              },
              {
                key: 'fullName',
                title: t('FULL_NAME'),
                dataIndex: 'fullName',
                width: '50%'
              }
            ]}
            dataSource={ filteredTableData }
            hidePagination
            bordered
            size='small'
          />
        </div>
        <AntModal
          onOk={this.handleModalOk}
          onCancel={this.handleModalCancel}
          visible={modal.visible}
          wrapClassName="NSA-modal"
          title={this.modalTitle()}
        >
          { modal.type === 'addForm' && <this.AddNew /> }
          { modal.type === 'changeForm' && <this.AddNew /> }
        </AntModal>
      </div>
    )
  }
}

ObjectView.propTypes = {
  t: PropTypes.func.isRequired
};

export default ObjectView;