import React from 'react';
import { Input } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash'

import {parseCube_new} from '../../utils/cubeParser';
import AntTable from '../AntTable';
import {getCube, getFundCountData} from '../../actions/actions';
import {
  CUBE_FOR_RR,
  DBEG, DEND, DO_FOR_RR, FUNDINDEX,
  FUNDNUMB
} from '../../constants/tofiConstants';

const Search = Input.Search;

class Fonds extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      search: '',
      loading: true,
      errors: {},
      countData: {
      countFund: 0,
        countInv: 0,
        countDelo: 0,
        countDeloFile: 0
    }
    }
  }

  componentWillReceiveProps(nextProps) {
    if(!isEmpty(nextProps.funds) && !isEmpty(nextProps.tofiConstants)) {
      const { doForRR, dpForRR } = nextProps.tofiConstants;
      this.setState({ loading: false, data: parseCube_new(nextProps.funds['cube'], [], 'dp', 'do', nextProps.funds[`do_${doForRR.id}`], nextProps.funds[`dp_${dpForRR.id}`], `do_${doForRR.id}`, `dp_${dpForRR.id}`).map(this.dataSet) });
    } else {
      this.setState({ loading: false });
    }
  }

  componentDidMount() {
    // this.setState({ loading: false, data: parseCube(this.props.funds).map(this.dataSet) });
    if(isEmpty(this.props.funds)) {
      const filters = {
        filterDOAnd: [
          {
            dimConst: DO_FOR_RR,
            concatType: "and",
            conds: [
              {
                parents: "0"
              }
            ]
          }
        ]
      };
      this.setState({loading: true});
      this.props.getCube(CUBE_FOR_RR, JSON.stringify(filters), {customKey: 'CubeRRFund', parent: "0"});
    } else {
      const { funds, tofiConstants: { doForRR, dpForRR } } = this.props;
      this.setState({ loading: false, data: parseCube_new(funds['cube'], [], 'dp', 'do', funds[`do_${doForRR.id}`], funds[`dp_${dpForRR.id}`], `do_${doForRR.id}`, `dp_${dpForRR.id}`).map(this.dataSet) });
    }
    getFundCountData()
      .then(data => {
        this.setState({countData: {...data}})
      })
  }

  dataSet = item => {
    const fundNumbObj = item.props.find(element => element.prop === FUNDNUMB),
          fundIndexObj = item.props.find(element => element.prop === FUNDINDEX),
          dendObj = item.props.find(element => element.prop === DEND),
          dbegObj = item.props.find(element => element.prop === DBEG);
    return {
      key: item.id,
      fundNumb: !!fundNumbObj ? fundNumbObj.value.toString() : '',
      fundIndex: !!fundIndexObj ? fundIndexObj.value || '' : '',
      fundName : item.name[localStorage.i18nextLng],
      dend: !!dendObj ? dendObj.value || '' : '',
      dbeg: !!dbegObj ? dbegObj.value || '' : '',
      fundInfo: ''
    }
  };

  // TODO: Make rendering columns dynamic
 /* renderColumns = ( item, idx ) => {
    return {
      key: 'fundNumb',
      title: '№ Фонда',
      dataIndex: 'fundNumb',
      width: '10%'
    }
  };*/

  changeState = (record, openedBy) => {
    this.props.nextState(record, openedBy)
  };

  searchUpdate = e => {
    this.setState({ search: e.target.value })
  };

  renderTableFooter = () => {
    const {countFund, countInv, countDelo, countDeloFile} = this.state.countData;
    return (
      <div className="table-footer">
        <div className="flex">
          <div className="label"><label htmlFor="">{t('COUNT_FUNDS')}</label><Input size='small' type="text" readOnly value={countFund}/></div>
          <div className="label"><label htmlFor="">{t('COUNT_INVENT')}</label><Input size='small' type="text" readOnly value={countInv}/></div>
          <div className="label"><label htmlFor="">{t('COUNT_CASES')}</label><Input size='small' type="text" readOnly value={countDelo}/></div>
          <div className="label"><label htmlFor="">{t('COUNT_CASES_WITH_ELECTR')}</label><Input size='small' type="text" readOnly value={countDeloFile}/></div>
        </div>
        <div className="data-length">
          <div className="label"><label htmlFor="">{t('COUNT_ITOG')}</label><Input size='small' type="text" readOnly value={this.filteredData.length + ' / ' + this.state.data.length}/></div>
        </div>
      </div>
    )
  };

  render() {
    const { data, loading, search } = this.state;
    this.filteredData = data.filter(item => {
      return (
        item.fundName.toLowerCase().includes(search.toLowerCase()) ||
        item.fundNumb.includes(search.toLowerCase()) ||
        item.dend.toLowerCase().includes(search.toLowerCase()) ||
        item.dbeg.toLowerCase().includes(search.toLowerCase())
      )
    });
    return (
      <div className="Fonds">
        <div className="Fonds__header">
          <Search onChange={this.searchUpdate}/>
        </div>
        <div className="Fonds__body">
          <AntTable
            openedBy='Funds'
            nextState={this.changeState}
            loading={ loading }
            columns={
              [
                {
                  key: 'fundNumb',
                  title: '№ фонда',
                  dataIndex: 'fundNumb',
                  width: '10%'
                },
                {
                  key: 'fundIndex',
                  title: 'Индекс фонда',
                  dataIndex: 'fundIndex',
                  width: '16%'
                },
                {
                  key: 'fundName',
                  title: 'Название фонда',
                  dataIndex: 'fundName',
                  width: '16%'
                },
                {
                  key: 'dbeg',
                  title: 'Начальная дата',
                  dataIndex: 'dbeg',
                  width: '16%'
                },
                {
                  key: 'dend',
                  title: 'Конечная дата',
                  dataIndex: 'dend',
                  width: '16%'
                },
                {
                  key: 'fundInfo',
                  title: 'Информация о фонде',
                  dataIndex: 'fundInfo',
                  width: '26%'
                }
              ]
            }
            dataSource={ this.filteredData }
            footer={this.renderTableFooter}
          />
        </div>
      </div>
    )
  }
}

Fonds.propTypes = {
  nextState: PropTypes.func.isRequired,
  tofiConstants: PropTypes.shape().isRequired,
  getCube: PropTypes.func.isRequired,
  funds: PropTypes.object
};

function mapStateToProps(state) {
  return {
    funds: state.cubes['CubeRRFund'],
    tofiConstants: state.generalData.tofiConstants
  }
}

export default connect(mapStateToProps, { getCube })(Fonds);
