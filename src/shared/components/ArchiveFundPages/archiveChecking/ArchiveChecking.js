import React from 'react';
import {Button, Icon, Input, Popconfirm, Table} from 'antd';
import {isEmpty} from 'lodash';
import { connect } from 'react-redux';
import uuid from 'uuid';
import { CUBE_FOR_FUND_CHECK } from '../../../constants/tofiConstants';
import {getCube} from '../../../actions/actions';
import {parseCube_new} from '../../../utils/cubeParser';

const EditableCell = ({ editable, value, onChange }) => (
  <div>
    {editable
      ? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
      : value
    }
  </div>
);

/* eslint eqeqeq:0 */
class ArchiveChecking extends React.Component {

  state = {
    data: [],
    loading: true
  };

  renderTableHeader = () => {
    return (
      <div className="table-header">
        <div className="table-header-btns">
          <Button
            icon='plus'
            shape='circle'
            type='primary'
            style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            onClick={this.addNew}
          />
        </div>
      </div>
    )
  };

  componentDidMount() {
    this.props.getCube(CUBE_FOR_FUND_CHECK)
  }

  componentWillReceiveProps(nextProps) {
    if(!isEmpty(nextProps.checkingPlanCube) && !isEmpty(nextProps.tofiConstants) && this.props.checkingPlanCube !== nextProps.checkingPlanCube) {
      const { doForFundCheck, dpForFundCheck } = nextProps.tofiConstants;
      this.setState(
        {
          loading: false,
          data: parseCube_new(
            nextProps.checkingPlanCube['cube'],
            [],
            'dp',
            'do',
            nextProps.checkingPlanCube[`do_${doForFundCheck.id}`],
            nextProps.checkingPlanCube[`dp_${dpForFundCheck.id}`],
            `do_${doForFundCheck.id}`,
            `dp_${dpForFundCheck.id}`).map(this.renderTableData)
        }
      );
    } else {
      this.setState({ loading: false });
    }
  }

  renderTableData = (item, idx) => {
    const { fundCheckNote, fundCheckYear } = this.props.tofiConstants;
    const fundCheckNoteObj = item.props.find(element => element.prop == fundCheckNote.id),
      fundCheckYearObj = item.props.find(element => element.prop == fundCheckYear.id)
    return {
      key: item.id,
      numb: idx + 1,
      fundCheckYear: !!fundCheckYearObj ? fundCheckYearObj.value || '' : '',
      fundCheckNote: !!fundCheckNoteObj ? fundCheckNoteObj.value || '' : '',
      fundNumber: Math.floor(Math.random()*2000),
      fundCategory: Math.floor(Math.random()*3),
      fundNumberOfCases: Math.floor(Math.random()*20000) + 10000
    }
  };

  renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.key, column)}
      />
    );
  }

  handleChange(value, key, column) {
    const newData = [...this.state.data];
    const target = newData.find(item => key === item.key);
    if (target) {
      target[column] = value;
      this.setState({ data: newData });
    }
  }
  edit = key => {
    const newData = [...this.state.data];
    const target = newData.find(item => key === item.key);
    if (target) {
      target.editable = true;
      this.setState({ data: newData });
    }
  };
  save(key) {
    const newData = [...this.state.data];
    const target = newData.find(item => key === item.key);
    if (target) {
      target.key = uuid();
      delete target.editable;
      this.setState({ data: newData });
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
  addNew = () => {
    this.setState({
      data: [
        ...this.state.data,
        {
          key: `newData_${this.state.data.length}`,
          editable: true,
          numb: this.state.data.length + 1,
          fundCheckYear: '',
          fundCheckNote: ''
        }]
    })
  };

  render() {
    const { tofiConstants, t } = this.props;
    if(isEmpty(tofiConstants)) return null;

    this.lng = localStorage.getItem('i18nextLng');

    const { fundNumber, fundCategory, fundNumberOfCases } = tofiConstants;

    return (
      <div className="CheckingPlan">
        <div className="title">
          <h2>График проверки наличия</h2>
        </div>
        <Table
          columns={[
            {
              key: 'numb',
              title: '№',
              dataIndex: 'numb',
              width: '5%'
            },
            {
              key: 'fundCheckYear',
              // title: fundCheckYear.name[this.lng],
              title: t('FUND_CHECK_YEAR'),
              dataIndex: 'fundCheckYear',
              width: '20%',
              render: (obj, record) => this.renderColumns(obj, record, 'fundCheckYear'),
            },
            {
              key: 'fundNumber',
              title: fundNumber.name[this.lng],
              dataIndex: 'fundNumber',
              width: '10%',
              render: (obj, record) => this.renderColumns(obj, record, 'fundNumber'),
            },
            {
              key: 'fundCategory',
              title: fundCategory.name[this.lng],
              dataIndex: 'fundCategory',
              width: '15%',
              render: (obj, record) => this.renderColumns(obj, record, 'fundCategory'),
            },
            {
              key: 'fundNumberOfCases',
              title: fundNumberOfCases.name[this.lng],
              dataIndex: 'fundNumberOfCases',
              width: '10%',
              render: (obj, record) => this.renderColumns(obj, record, 'fundNumberOfCases'),
            },
            {
              key: 'isValuable',
              title: t('IS_VALUABLE'),
              dataIndex: 'isValuable',
              width: '10%',
              render: (obj, record) => this.renderColumns(obj, record, 'isValuable'),
            },
            {
              key: 'fundCheckNote',
              // title: fundCheckNote.name[this.lng],
              title: t('FUND_CHECK_NOTE'),
              dataIndex: 'fundCheckNote',
              width: '20%',
              render: (obj, record) => this.renderColumns(obj, record, 'fundCheckNote'),
            },
            {
              key: 'action',
              title: '',
              dataIndex: '',
              width: '10%',
              render: (text, record) => {
                const { editable } = record;
                const disable = false;
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
          title={this.renderTableHeader}
          bordered
          size="small"
          dataSource={this.state.data}
          loading={this.state.loading}
          scroll={{x: 1200, y: '100%'}}
        />

      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    checkingPlanCube: state.cubes[CUBE_FOR_FUND_CHECK],
    tofiConstants: state.generalData.tofiConstants
  }
}

export default connect(mapStateToProps, { getCube })(ArchiveChecking)