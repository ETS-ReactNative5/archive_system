import React from 'react';
import Select from '../../Select';
import uuid from 'uuid';
import {isEmpty} from 'lodash';
import {Button, Dropdown, Icon, Input, Menu, Popconfirm, Table} from 'antd';
import * as axios from 'axios';

const EditableCell = ({ editable, value, onChange }) => (
  <span className="editable-cell">
    {editable
      ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
      : value
    }
  </span>
);

class CaseNomenclatureCard extends React.PureComponent {
  state = {
    data: [
      {
        key: '1',
        rowType: 'firstLevel',
        caseIndex: '01',
        caseTitle: 'ОБЩЕЕ СОБРАНИЕ УЧРЕДИТЕЛЕЙ',
        children: [
          {
            key: '11',
            rowType: 'secondLevel',
            caseIndex: '01-01',
            caseTitle: 'Протоколы заседаний',
            numberOfNomenCases: '10',
            shelfLifeOfNomenCases: 'ДМН',
            nomenCasesNote: '',
            children: [
              {
                key: '111',
                rowType: 'secondLevel',
                caseIndex: '01-01-01',
                caseTitle: 'Протоколы заседаний',
                numberOfNomenCases: '10',
                shelfLifeOfNomenCases: 'ДМН',
                nomenCasesNote: '',
              }
            ]
          },
          {
            key: '12',
            rowType: 'firstLevel',
            caseIndex: '01-02',
            caseTitle: 'ОБЩЕЕ СОБРАНИЕ УЧРЕДИТЕЛЕЙ',
          }
        ]
      }
    ],
    selectedRow: {},
    nomenclature: 'one',
    caseIndex: {kz: 'I', ru: 'I', en: 'I'},
    caseTitle: {kz: 'T', ru: 'T', en: 'T'}
  };

  componentDidMount() {
    axios(`${this.lng}/utils/getConst?constName=caseIndex`)
      .then(res => res.data)
      .then(body => JSON.parse(body.data))
      .then(json => this.setState({caseIndex: json.value}))
      .catch(err => {
        console.log(err);
      });
    axios(`${this.lng}/utils/getConst?constName=caseTitle`)
      .then(res => res.data)
      .then(body => JSON.parse(body.data))
      .then(json => this.setState({caseTitle: json.value}))
      .catch(err => {
        console.log(err);
      })
  }

  addNew = () => {
    this.setState({
      data: [
        ...this.state.data,
        {
          key: `newData_${this.state.data.length}`,
          rowType: 'firstLevel',
          editable: true,
          caseIndex: '',
          caseTitle: '',
        }
      ]
    })
  };

  renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.key, column, record.table)}
      />
    );
  }
  handleChange(value, key, column) {
    const newData = this.state.data.slice();
    const target = this.getObject(newData, key);
    if (target) {
      target[column] = value;
      this.setState({ data: newData });
    }
  }
  getObject = (theObject, key) => {
    let result = null;
    if(theObject instanceof Array) {
      for(let i = 0; i < theObject.length; i++) {
        result = this.getObject(theObject[i], key);
        if(result) return result;
      }
    }
    else if(theObject instanceof Object) {
      if(theObject.key === key) {
        return theObject;
      }
      result = this.getObject(theObject.children, key);
    } else return null;
    return result;
  };
  removeObject = (theObject, key) => {
    let result = null;
    if(theObject instanceof Array) {
      for(let i = 0; i < theObject.length; i++) {
        result = this.removeObject(theObject[i], key);
        if(result) {
          // eslint-disable-next-line
          theObject.forEach((item, idx) => {
            if(item.key === result.key) {
              theObject.splice(idx, 1);
              return;
            }
          });
        }
      }
    }
    else if(theObject instanceof Object) {
      if(theObject.key === key) {
        return theObject;
      }
      result = this.removeObject(theObject.children, key);
    } else return null;
    return result;
  };
  addNewChild = type => {
    const newData = this.state.data.slice();
    const key = this.state.selectedRow.key;

    const row = this.getObject(newData, key);

    if(row) {
      if(!row.children) row.children = [];
      row.children.push({
        key: `newData_${row.key}_${row.children.length}`,
        rowType: type,
        editable: true,
        caseIndex: '',
        caseTitle: ''
      });

      this.setState({
        data: newData
      })
    }
  };

  onNomenclatureChange = value => {
    this.setState({ nomenclature: value })
  };

  stopPropagation = e => {
    e.stopPropagation();
  };

  edit = key => {
    return e => {
      e.stopPropagation();
      const newData = this.state.data.slice();
      const target = this.getObject(newData, key);

      if (target) {
        target.editable = true;
        this.setState({ data: newData });
      }
    }
  };
  save = key => {
    return e => {
      e.stopPropagation();
      const newData = this.state.data.slice();
      const target = this.getObject(newData, key);

      if (target) {
        target.key = uuid();
        delete target.editable;
        this.setState({ data: newData });
      }
    }
  };
  remove = key => {
    const newData = this.state.data.slice();
    this.removeObject(newData, key);
    this.setState({ data: newData });
  };
  cancel = key => {
    const newData = this.state.data.slice();
    if(key.includes('newData')) {
      this.removeObject(newData, key);
      this.setState({data: newData, selectedRow: {} });
      return;
    }
    const target = this.getObject(newData, key);
    if (target) {
      delete target.editable;
      this.setState({ data: newData, selectedRow: {} });
    }
  };

  onRowClick = record => {
    this.setState({ selectedRow: record });
  };

  renderTableHeader = () => {
    return <div className="table-header">
      <div className="table-header-btns">
        <Button type='primary' onClick={this.addNew}>{this.props.t('ADD')}</Button>
        <Dropdown overlay={this.menu}>
          <Button style={{ marginLeft: 8 }}>
            {this.props.t('ADD_CHILD')} <Icon type="down" />
          </Button>
        </Dropdown>
      </div>
    </div>
  };
  handleMenuClick = e => {
    if(e.key === 'first') {
      this.addNewChild('firstLevel')
    } else if(e.key === 'second') {
      this.addNewChild('secondLevel')
    }
  };
  menu = (
    <Menu onClick={this.handleMenuClick}>
      <Menu.Item key="first">{this.props.t('ADD_FIRST_LEVEL_CHILD')}</Menu.Item>
      <Menu.Item key="second">{this.props.t('ADD_SECOND_LEVEL_CHILD')}</Menu.Item>
    </Menu>
  );

  render() {
    if(isEmpty(this.props.tofiConstants)) return null;
    this.lng = localStorage.getItem('i18nextLng');

    const { caseIndex, caseTitle, nomenclature } = this.state;
    const { t, tofiConstants: { numberOfNomenCases, shelfLifeOfNomenCases, nomenCasesNote } } = this.props;

    return (
      <div className="CaseNomenclatureCard">
        <div className="label-select">
          <p>{t('NOMENCLATURE')}</p>
          <Select
            name="nomenclature"
            isSearchable={false}
            value={nomenclature}
            onChange={this.onNomenclatureChange}
            options={[
              { value: 'one', label: 'One' },
              { value: 'two', label: 'Two' },
            ]}
          />
        </div>
        <Table
          loading={false}
          columns={[
            {
              key: 'caseIndex',
              title: caseIndex[this.lng],
              dataIndex: 'caseIndex',
              width: '16%',
              render: (value, record) => this.renderColumns(value, record, 'caseIndex')
            },
            {
              key: 'caseTitle',
              title: caseTitle[this.lng],
              dataIndex: 'caseTitle',
              width: '30%',
              render: (value, rec) => {
                const obj = {
                  children: this.renderColumns(value, rec, 'caseTitle'),
                  props: {}
                };
                if(rec.rowType === 'firstLevel') {
                  obj.props.colSpan = 4;
                }
                return obj;
              }
            },
            {
              key: 'numberOfNomenCases',
              title: numberOfNomenCases.name[this.lng],
              dataIndex: 'numberOfNomenCases',
              width: '10%',
              render: (value, rec) => {
                const obj = {
                  children: this.renderColumns(value, rec, 'numberOfNomenCases'),
                  props: {}
                };
                if(rec.rowType === 'firstLevel') {
                  obj.props.colSpan = 0;
                }
                return obj;
              }
            },
            {
              key: 'shelfLifeOfNomenCases',
              title: shelfLifeOfNomenCases.name[this.lng],
              dataIndex: 'shelfLifeOfNomenCases',
              width: '17%',
              render: (value, rec) => {
                const obj = {
                  children: this.renderColumns(value, rec, 'shelfLifeOfNomenCases'),
                  props: {}
                };
                if(rec.rowType === 'firstLevel') {
                  obj.props.colSpan = 0;
                }
                return obj;
              }
            },
            {
              key: 'nomenCasesNote',
              title: nomenCasesNote.name[this.lng],
              dataIndex: 'nomenCasesNote',
              width: '20%',
              render: (value, rec) => {
                const obj = {
                  children: this.renderColumns(value, rec, 'nomenCasesNote'),
                  props: {}
                };
                if(rec.rowType === 'firstLevel') {
                  obj.props.colSpan = 0;
                }
                return obj;
              }
            },
            {
              key: 'action',
              title: 'action',
              dataIndex: '',
              width: '7%',
              render: (text, record) => {
                const { editable, caseIndex, caseTitle } = record;
                const disable = !caseIndex || !caseTitle;
                return (
                  <div className="editable-row-operations">
                    {
                      editable ?
                        <span>
                      <a onClick={this.save(record.key)} disabled={disable}><Icon type="check"/></a>
                      <Popconfirm title="Отменить?" onConfirm={() => this.cancel(record.key)}>
                        <a style={{marginLeft: '5px'}} onClick={this.stopPropagation}><Icon type="close"/></a>
                      </Popconfirm>
                    </span>
                        : <span>
                      <a><Icon type="edit" style={{fontSize: '14px'}} onClick={this.edit(record.key)}/></a>
                      <Popconfirm title={this.props.t('CONFIRM_REMOVE')} onConfirm={() => this.remove(record.key)}>
                        <a style={{color: '#f14c34', marginLeft: '10px', fontSize: '14px'}} onClick={this.stopPropagation}><Icon type="delete" className="editable-cell-icon"/></a>
                      </Popconfirm>
                    </span>
                    }
                  </div>
                );
              },
            },
          ]}
          title={this.renderTableHeader}
          bordered
          dataSource={this.state.data}
          pagination={false}
          onRowClick={this.onRowClick}
          scroll={{x: 1200}}
          rowClassName={record => this.state.selectedRow.key === record.key ? 'row-selected' : ''}
        />
      </div>
    )
  }
}

export default CaseNomenclatureCard;