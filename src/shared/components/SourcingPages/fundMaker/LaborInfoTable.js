import React from 'react';
import {Table, Input, Popconfirm, Button, Icon, message} from 'antd';
import {isEmpty, map} from 'lodash';
import uuid from 'uuid/v4';

import {four_digits} from '../../../utils/form_normalizing';
import {
  CUBE_FOR_FUND_AND_IK,
  CUBE_FOR_LP_FUNDMAKER,
  DO_FOR_FUND_AND_IK,
  DO_FOR_LP_FUNDMAKER, DP_FOR_LP_FUNDMAKER
} from '../../../constants/tofiConstants';
import {getPropMeta, onSaveCubeData} from '../../../utils/cubeParser';
import moment from 'moment';
import {updateCubeData} from '../../../actions/actions';

const EditableCell = ({ editable, value, onChange }) => (
  <div>
    {editable
      ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
      : value
    }
  </div>
);

const EditableYearCell = ({ editable, value: {personLaborBeginYear, personLaborEndYear}, onChange }) => (
    editable
      ? <div style={{display: 'flex', alignItems: 'center'}}>
          <Input style={{ margin: '-5px 0' }} size='small' value={personLaborBeginYear} onChange={onChange} name="personLaborBeginYear" placeholder="yyyy"/>
          <span> - </span>
          <Input style={{ margin: '-5px 0' }} size='small' value={personLaborEndYear} onChange={onChange} name="personLaborEndYear" placeholder="yyyy"/>
      </div>
      : <span>{personLaborBeginYear} - {personLaborEndYear}</span>
);

class LaborInfoTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  renderColumnYears(obj, record, column) {
    return <EditableYearCell
      editable={record.editable}
      value={obj}
      onChange={e => this.handleChangeYears(e, record.key, column)}
    />
  }
  handleChangeYears(e, key, column) {
    const newData = [...this.state.data];
    const target = newData.find(item => key === item.key);
    if (target) {
      target[column][e.target.name] = four_digits(e.target.value);
      this.setState({ data: newData });
    }
  }
  handleChange(value, key, column) {
    const newData = [...this.state.data];
    const target = newData.find(item => key === item.key);
    if (target) {
      target[column] = value;
      this.setState({ data: newData });
    }
  }
  renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.key, column)}
      />
    );
  }
  edit(key) {
    const newData = [...this.state.data];
    const target = newData.find(item => key === item.key);
    if (target) {
      target.editable = true;
      this.setState({ data: newData });
    }
  }
  save(key) {
    const newData = [...this.state.data];
    const target = newData.find(item => key === item.key);
    if (target) {
      const { years, key, editable, ...rest } = target;
      const values = { personLaborBeginYear: years.personLaborBeginYear, ...rest};
      if(years.personLaborEndYear) values.personLaborEndYear = years.personLaborEndYear;

      const cube = {
        cubeSConst: CUBE_FOR_LP_FUNDMAKER,
        doConst: DO_FOR_LP_FUNDMAKER,
        dpConst: DP_FOR_LP_FUNDMAKER,
        data: this.props.cubeForLPFundmaker
      };

      const obj = {
        doItem: this.props.recKey
      };
      const complex = {
        personLaborActivity: {
          mode: 'ins',
          values
        },
      };
      const hideLoading = message.loading(this.props.t('UPDATING_PROPS'), 0);
      return onSaveCubeData({cube, obj}, {complex}, this.props.tofiConstants)
        .then(res => {
          hideLoading();
          if(res.success) {
            this.props.getFmCube().catch(err => console.warn(err));
            message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'));
            delete target.editable;
            this.setState({ data: newData });
          }
          else {
            message.error(this.props.t('PROPS_UPDATING_ERROR'));
            res.errors.forEach(err => {
              message.error(err.text);
            });
            return {success: false}
          }
        })
        .catch(err => {
          hideLoading();
          console.warn(err);
        })
    }
  }
  remove = key => {
    const newData = this.state.data.filter(item => item.key !== key);
    this.setState({data: newData});
  };
  cancel = key => {
    const newData = [...this.state.data];
    if(key.includes('newData')) {
      this.setState({ data: newData.filter(item => item.key !== key) });
      return;
    }
    const target = newData.find(item => key === item.key);
    if (target) {
      delete target.editable;
      this.setState({ data: newData });
    }
  };
  renderTableHeader = () => {
    return (
      <div className="flex">
        <Button
          style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
          type="primary"
          shape='circle'
          icon='plus'
          onClick={() =>
            this.setState({
              data: [
                ...this.state.data,
                {
                  key: `newData_${this.state.data.length}`,
                  editable: true,
                  years: {
                    personLaborBeginYear: '',
                    personLaborEndYear: ''
                  },
                  personLaborPosition: '',
                  personLaborOrg: ''
                }]
            })}/>
      </div>
    )
  };

  componentDidMount() {
    if(isEmpty(this.props.initialValues)) return;
    this.setState({data: this.props.initialValues.personLaborActivity.map(this.renderTableData)})
  }

  componentDidUpdate(prevProps) {
    if(prevProps.initialValues !== this.props.initialValues) {
      this.setState({data: this.props.initialValues.personLaborActivity.map(this.renderTableData)})
    }
  }

  renderTableData = ({id}) => {
    const { personLaborBeginYear, personLaborEndYear, personLaborPosition, personLaborOrg } = this.props.initialValues;
    return {
      key: id,
      years: {
        personLaborBeginYear: personLaborBeginYear[id] ? personLaborBeginYear[id].value[this.lng] : '',
        personLaborEndYear: personLaborEndYear[id] ? personLaborEndYear[id].value[this.lng] : ''
      },
      personLaborPosition: personLaborPosition[id] ? personLaborPosition[id].value[this.lng]: '',
      personLaborOrg: personLaborOrg[id] ? personLaborOrg[id].value[this.lng]: ''
    }
  };

  render() {
    const { personLaborPosition, personLaborOrg } = this.props.tofiConstants;
    this.lng = localStorage.getItem('i18nextLng');
    return <Table
      bordered
      columns={[
        {
          key: 'years',
          title: <div dangerouslySetInnerHTML={{__html:this.props.year && this.props.year[this.lng]}}></div>,
          dataIndex: 'years',
          width: '20%',
          render: (obj, record) => this.renderColumnYears(obj, record, 'years'),
        }, {
          key: 'personLaborPosition',
          title: personLaborPosition.name[this.lng],
          dataIndex: 'personLaborPosition',
          width: '35%',
          render: (text, record) => this.renderColumns(text, record, 'personLaborPosition'),
        }, {
          key: 'personLaborOrg',
          title: personLaborOrg.name[this.lng],
          dataIndex: 'personLaborOrg',
          widht: '35%',
          render: (text, record) => this.renderColumns(text, record, 'personLaborOrg'),
        }, {
          key: 'action',
          title: '',
          dataIndex: '',
          width: '10%',
          render: (text, record) => {
            const { editable, personLaborPosition, personLaborOrg, years: {personLaborBeginYear, personLaborEndYear} } = record;
            const disable = !personLaborPosition || !personLaborOrg || !personLaborBeginYear;
            return (
              <div className="editable-row-operations">
                {
                  editable ?
                    <span>
                      <a onClick={() => this.save(record.key)} disabled={disable}><Icon type="check"/></a>
                      <Popconfirm title="Отменить?" onConfirm={() => this.cancel(record.key)}>
                        <a style={{marginLeft: '5px'}}><Icon type="close"/></a>
                      </Popconfirm>
                    </span>
                    : <span>
                      <a><Icon type="edit" style={{fontSize: '14px'}} onClick={() => this.edit(record.key)}/></a>
                      <Popconfirm title={this.props.t('CONFIRM_REMOVE')} onConfirm={() => this.remove(record.key)}>
                        <a style={{color: '#f14c34', marginLeft: '10px', fontSize: '14px'}}><Icon type="delete" className="editable-cell-icon"/></a>
                      </Popconfirm>
                    </span>
                }
              </div>
            );
          },
        }
      ]}
      dataSource={this.state.data}
      size='small'
      title={this.renderTableHeader}
      pagination={false}
      scroll={{y: '100%'}}
      style={{marginLeft: '5px'}}
    />;
  }
}

export default LaborInfoTable;