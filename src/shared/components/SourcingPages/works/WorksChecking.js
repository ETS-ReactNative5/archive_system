import React from 'react';
import {Breadcrumb, DatePicker, Icon, Input, Table} from 'antd';
import {Link} from 'react-router-dom';

class EditableCell extends React.Component {
  state = {
    value: this.props.value,
    editable: false,
  };
  handleChange = (e) => {
    const value = e.target.value;
    this.setState({ value });
  };
  handleDateChange = e => {
    this.setState({ value: e.format('DD-MM-YYYY') })
  };
  check = () => {
    this.setState({ editable: false });
    if (this.props.onChange) {
      console.log(this.state.value);
    }
  };
  edit = () => {
    this.setState({ editable: true });
  };
  componentWillReceiveProps(nextProps) {
    if(nextProps.value) {
      this.setState({ value: nextProps.value })
    }
  }
  render() {
    const { value, editable } = this.state;
    return (
      <div className="editable-cell">
        {
          editable ?
            <div className="editable-cell-input-wrapper">
              {this.props.renderDate ?
                <DatePicker onChange={this.handleDateChange}/>
                  :
                <Input
                  value={value}
                  onChange={this.handleChange}
                  onPressEnter={this.check}
                />}
              <Icon
                type="check"
                className="editable-cell-icon-check"
                onClick={this.check}
              />
            </div>
            :
            <div className="editable-cell-text-wrapper">
              {value || ' '}
              <Icon
                type="edit"
                className="editable-cell-icon"
                onClick={this.edit}
              />
            </div>
        }
      </div>
    );
  }
}

class WorksChecking extends React.PureComponent {

  state = {
    data: [
      {
        key: 'regulationArchive',
        attribute: 'Положение об архиве',
        checkingResult: '',
        recommendations: '',
        deadline: ''
      },
      {
        key: 'regulationCommission',
        attribute: 'Положение об экспертной комиссии',
        checkingResult: '',
        recommendations: '',
        deadline: ''
      },
      {
        key: 'instruction',
        attribute: 'Инструкция по делопроизводству',
        checkingResult: '',
        recommendations: '',
        deadline: ''
      },
      {
        key: 'caseNomenclature',
        attribute: 'Номенклатура дел',
        checkingResult: '',
        recommendations: '',
        deadline: ''
      },
      {
        key: 'docsStoringCondition',
        attribute: 'Условия хранения документов',
        checkingResult: '',
        recommendations: '',
        deadline: ''
      },
      {
        key: 'docsOrgState',
        attribute: 'Состояние организации документов',
        checkingResult: '',
        recommendations: '',
        deadline: ''
      },
      {
        key: 'docsStoringState',
        attribute: 'Состояние хранения документов',
        checkingResult: '',
        recommendations: '',
        deadline: ''
      },
      {
        key: 'docsMovingState',
        attribute: 'Состояние отбора и передачи документов на гос. хранение',
        checkingResult: '',
        recommendations: '',
        deadline: ''
      },
      {
        key: 'staffing',
        attribute: 'Кадровое обеспечение',
        checkingResult: '',
        recommendations: '',
        deadline: ''
      },
      {
        key: 'commissionWorkOrganization',
        attribute: 'Организация работы экспертной комиссии',
        checkingResult: '',
        recommendations: '',
        deadline: ''
      },
      {
        key: 'archiveWorkOrganization',
        attribute: 'Организация работы архива',
        checkingResult: '',
        recommendations: '',
        deadline: ''
      },
      {
        key: 'securityModes',
        attribute: 'Режимы обеспечения сохранности',
        checkingResult: '',
        recommendations: '',
        deadline: ''
      },
      {
        key: 'docsMovingToStorage',
        attribute: 'Выполнение функций передачи документов на хранение',
        checkingResult: '',
        recommendations: '',
        deadline: ''
      },
      {
        key: 'archiveFunction',
        attribute: 'Выполнение функций архива',
        checkingResult: '',
        recommendations: '',
        deadline: ''
      },
      {
        key: 'expertiseFunction',
        attribute: 'Выполнение функций экспертизы',
        checkingResult: '',
        recommendations: '',
        deadline: ''
      }
    ],
  };

  renderTableHeader = () => {
    return (
      <div className="table-header">
        <Breadcrumb>
          <Breadcrumb.Item><a onClick={this.props.history.goBack}>Проверка ИК</a></Breadcrumb.Item>
          <Breadcrumb.Item><b>{this.props.match.params.sourcing}</b></Breadcrumb.Item>
        </Breadcrumb>
      </div>
    )
  };

  render() {
    return (
      <div className="WorksChecking">
        <Table
          columns={[
            {
              key: 'attribute',
              title: 'Проверяемый аттрибут',
              dataIndex: 'attribute',
              width: '25%',
            },
            {
              key: 'checkingResult',
              title: 'Результат проверки',
              dataIndex: 'checkingResult',
              width: '30%',
              render: (text, record) => (
                <EditableCell
                  value={text}
                />
              )
            },
            {
              key: 'recommendations',
              title: 'Рекомендации',
              dataIndex: 'recommendations',
              width: '30%',
              render: (text, record) => (
                <EditableCell
                  value={text}
                />
              )
            },
            {
              key: 'deadline',
              title: 'Контрольная дата',
              dataIndex: 'deadline',
              width: '15%',
              render: (text, record) => (
                <EditableCell
                  value={text}
                  renderDate
                />
              )
            },
          ]}
          bordered
          size="small"
          title={this.renderTableHeader}
          dataSource={this.state.data}
          pagination={false}
          scroll={{x: 1200}}
        />
      </div>
    )
  }
}

export default WorksChecking;