import React from 'react'
import PropTypes from 'prop-types';
import {isEmpty, isEqual} from 'lodash';
import {Button, Input} from 'antd';

import AntTable from '../../AntTable';
import {connect} from 'react-redux';
import {CUBE_FOR_FUND_AND_IK, DO_FOR_FUND_AND_IK} from '../../../constants/tofiConstants';

import {getCube} from '../../../actions/actions';
import {parseCube_new} from '../../../utils/cubeParser';

const Search = Input.Search;

class Individuals extends React.Component {

  state = {
    data: [],
    loading: true,
    selectedRow: {}
  };

  changeSelectedRow = rec => {
    if(isEmpty(this.state.selectedRow) || !isEqual(this.state.selectedRow, rec)){
      this.setState({ selectedRow: rec })
    } else {
      this.props.history.push(`/sourcing/sourcesMaintenance/individuals/${this.state.selectedRow.key}`);
      this.props.loadInd(this.state.selectedRow.key);
    }
  };

  async componentDidMount() {
    if (isEmpty(this.props.tofiConstants) || (this.props.indSourceCube !== undefined && !this.props.indSourceCube)) return;
    await this.props.loadInd();
/*
    const filters = {
      filterDOAnd: [
        {
          dimConst: DO_FOR_FUND_AND_IK,
          concatType: "and",
          conds: [
            {
              clss: "sourceLPList"
            }
          ]
        }
      ]
    };
    this.props.getCube(CUBE_FOR_FUND_AND_IK, JSON.stringify(filters));
*/
  }
  componentWillReceiveProps(nextProps) {
    if(!isEmpty(nextProps.indSourceCube) && !isEmpty(nextProps.tofiConstants) && this.props.indSourceCube !== nextProps.indSourceCube) {
      const { doForFundAndIK, dpForFundAndIK } = this.props.tofiConstants;
      this.setState(
        {
          loading: false,
          data: parseCube_new(nextProps.indSourceCube['cube'], [], 'dp', 'do', nextProps.indSourceCube[`do_${doForFundAndIK.id}`], nextProps.indSourceCube[`dp_${dpForFundAndIK.id}`], `do_${doForFundAndIK.id}`, `dp_${dpForFundAndIK.id}`)
        }
      );
    } else if(this.props.loading !== nextProps.loading){
      this.setState({ loading: nextProps.loading });
    }
  }
  onDelete = key => {
    return function inter(e) {
      e.preventDefault();
      console.log(key);
    }
  };

  stopPropagation = e => {
    e.stopPropagation();
  };

  renderTableHeader = () => {
    return (
      <div className="table-header">
        <Search />
      </div>
    )
  };

  handleClick = (rec, name) => {
    return e => {
      e.stopPropagation();
      switch (name) {
        case 'acts':
          this.selectedKey !== rec.key && this.props.loadInd(rec.key);
          this.props.history.push(`/sourcing/sourcesMaintenance/individuals/${rec.key}/acts`);
          this.selectedKey = rec.key;
          break;
        case 'inventories' :
          this.selectedKey !== rec.key && this.props.loadInd(rec.key);
          this.props.history.push(`/sourcing/sourcesMaintenance/individuals/${rec.key}/inventories`);
          this.selectedKey = rec.key;
          break;
        case 'providerInfo':
          this.selectedKey !== rec.key && this.props.loadInd(rec.key);
          this.props.history.push(`/sourcing/sourcesMaintenance/individuals/${rec.key}/providerInfo`);
          this.selectedKey = rec.key;
          break;
        default: break;
      }
    }
  };

  renderTableData = (item, idx) => {
    // const { orgFundNumber, formOfAdmission } = this.props.tofiConstants;
    //
    // const orgFundNumberObj = item.props.find(element => element.prop == orgFundNumber.id),
    //   formOfAdmissionObj = item.props.find(element => element.prop == formOfAdmission.id);

    return {
      key: item.id,
      number: idx + 1,
      name: !!item.name ? item.name[this.lng] || '' : ''
      // orgFundNumber: !!orgFundNumberObj ? orgFundNumberObj.value || '' : '',
      // formOfAdmission: !!formOfAdmissionObj ? formOfAdmissionObj.value || '' : '',
    }
  };

  render() {
    const { loading, data } = this.state;
    const { t } = this.props;
    this.lng = localStorage.getItem('i18nextLng');

    return (
      <div className="Individuals">
        <AntTable
          columns={[
            {
              key: 'number',
              title: '№',
              dataIndex: 'number',
              width: '5%'
            },
            {
              key: 'fundNumber',
              title: t('FUND_NUMBER'),
              dataIndex: 'fundNumber',
              width: '7%'
            },
            {
              key: 'name',
              title: t('NAME'),
              dataIndex: 'name',
              width: '30%'
            },
            {
              key: 'legalStatus',
              title: t('LEGAL_STATUS'),
              dataIndex: 'legalStatus',
              width: '15%'
            },
            {
              key: 'providerInfo',
              title: 'Сведения о комплектовании фонда',
              className: 'td-center td-btn-half',
              dataIndex: '',
              width: '13%',
              render: (text, record) => (
                <Button icon="right-square" className='green-btn' onClick={this.handleClick(record, 'providerInfo')}/>
              )
            },
            {
              key: 'acts',
              title: 'Акты',
              className: 'td-center td-btn-half',
              dataIndex: '',
              width: '10%',
              render: (text, record) => (
                <Button icon="right-square" className='green-btn' onClick={this.handleClick(record, 'acts')}/>
              )
            },
            {
              key: 'inventories',
              title: 'Описи',
              className: 'td-center td-btn-half',
              dataIndex: '',
              width: '10%',
              render: (text, record) => (
                <Button icon="right-square" className='green-btn' onClick={this.handleClick(record, 'inventories')}/>
              )
            }
            /*{
              key: 'actions',
              title: '',
              width: '10%',
              dataIndex: 'actions',
              render: (text, record) => (
                <div>
                  <Button icon='edit' disabled={this.state.selectedRow.key !== record.key} type='primary' style={{marginRight: '5px'}}/>
                  <Popconfirm title="Sure to delete?" onConfirm={this.onDelete(record.key)}>
                    <Button icon='delete' type='danger' disabled={this.state.selectedRow.key !== record.key} onClick={this.stopPropagation}/>
                  </Popconfirm>
                </div>
              )
            }*/
          ]}
          loading={loading}
          dataSource={data.map(this.renderTableData)}
          // openedBy="Individuals"
          // changeSelectedRow={this.changeSelectedRow}
          title={this.renderTableHeader}
        />
      </div>
    )
  }
}

Individuals.propTypes = {
  t: PropTypes.func.isRequired,
  indSourceCube: PropTypes.shape(),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

function mapStateToProps(state) {
  return {
    indSourceCube: state.cubes.indSourceCube
  }
}

export default connect(mapStateToProps, {getCube})(Individuals);