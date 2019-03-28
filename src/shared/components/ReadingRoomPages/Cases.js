import React from 'react';
import {Input, Button, Breadcrumb, Modal} from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {casesLoaded, addCaseToBasket, removeCaseFromBasket, getCube} from '../../actions/actions';
import {parseCube_new} from '../../utils/cubeParser';
import AntTable from '../AntTable';
import {CASE_NUMB, CASES_DBEG, CASES_DEND, CUBE_FOR_RR, DO_FOR_RR, STATUS} from '../../constants/tofiConstants';
import {isEmpty} from 'lodash';

const Search = Input.Search;

class Cases extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      search: '',
      loading: true,
      errors: {}
    }
  }

  componentDidMount() {
    this._isMounted = true;
    const filters = {
      filterDOAnd: [
        {
          dimConst: DO_FOR_RR,
          concatType: "and",
          conds: [
            {
              parents: this.props.invent.key
            }
          ]
        }
      ]
    };
    if(isEmpty(this.props.cases)) {
      this.setState({loading: true});
      this.props.getCube(CUBE_FOR_RR, JSON.stringify(filters), {customKey: 'CubeRRCase', parent: this.props.invent.key})
        .then(() => {
          const { cases, tofiConstants: {doForRR, dpForRR} } = this.props;
          this.setState({ loading: false, data: parseCube_new(cases['cube'], [], 'dp', 'do', cases[`do_${doForRR.id}`], cases[`dp_${dpForRR.id}`], `do_${doForRR.id}`, `dp_${dpForRR.id}`).map(this.dataSet) });
        })
    } else if(this.props.cases.parent !== this.props.invent.key){
        this.setState({loading: true});
        this.props.getCube(CUBE_FOR_RR, JSON.stringify(filters), {customKey: 'CubeRRCase', parent: this.props.invent.key});
    } else {
        const { cases, tofiConstants: { doForRR, dpForRR } } = this.props;
        this.setState({ loading: false, data: parseCube_new(cases['cube'], [], 'dp', 'do', cases[`do_${doForRR.id}`], cases[`dp_${dpForRR.id}`], `do_${doForRR.id}`, `dp_${dpForRR.id}`).map(this.dataSet) });
    }
  }

  componentWillReceiveProps(nextProps) {
    if(!isEmpty(nextProps.cases) && !isEmpty(nextProps.tofiConstants)) {
      const { doForRR, dpForRR } = nextProps.tofiConstants;
      this.setState({ loading: false, data: parseCube_new(nextProps.cases['cube'], [], 'dp', 'do', nextProps.cases[`do_${doForRR.id}`], nextProps.cases[`dp_${dpForRR.id}`], `do_${doForRR.id}`, `dp_${dpForRR.id}`).map(this.dataSet) });
    } else {
      this.setState({ loading: false });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  dataSet = item => {
    const caseNumbObj = item.props.find(element => element.prop === CASE_NUMB),
          dendObj = item.props.find(element => element.prop === CASES_DEND),
          dbegObj = item.props.find(element => element.prop === CASES_DBEG),
          status = item.props.find(element => element.prop === STATUS);
    return {
      key: item.id,
      caseNumb: !!caseNumbObj ? caseNumbObj.value : '',
      caseName : item.name[localStorage.i18nextLng],
      dend: !!dendObj ? dendObj.value : '',
      dbeg: !!dbegObj ? dbegObj.value: '',
      status: !!status ? status.value : '',
    }
  };

  rowSelection = () => {
    let that = this;
    return {
      onSelect: (record, selected) => {
        const { t } = this.props;
        if(selected) {
          if(this.props.basket.length < 20) {
            this.props.addCaseToBasket({...record, fundNumb: this.props.fund.fundNumb, inventNumb: this.props.invent.inventNumb});
          } else {
            Modal.info({
              title: t('ABOVE_20_CASES_TITLE'),
              content: t('ABOVE_20_CASES_TEXT'),
              onOk() {},
              okText: t('OK')
            });
          }
        } else {
          this.props.removeCaseFromBasket(record);
        }
      },
      selectedRowKeys: that.props.basket.map(elem => elem.key)
    }
  };

  searchUpdate = e => {
    this.setState({ search: e.target.value })
  };

  renderTableFooter = () => {
    const { t } = this.props;
    return (
      <div className="table-footer">
        <div className="flex">
          <div className="label"><label htmlFor="">{t('COUNT_FUNDS')}</label><Input size='small' type="text" readOnly/></div>
          <div className="label"><label htmlFor="">{t('COUNT_INVENT')}</label><Input size='small' type="text" readOnly/></div>
          <div className="label"><label htmlFor="">{t('COUNT_CASES')}</label><Input size='small' type="text" readOnly/></div>
          <div className="label"><label htmlFor="">{t('COUNT_CASES_WITH_ELECTR')}</label><Input size='small' type="text" readOnly/></div>
        </div>
        <div className="data-length">
          <div className="label"><label htmlFor="">{t('COUNT_ITOG')}</label><Input size='small' type="text" readOnly value={this.filteredData.length + ' / ' + this.state.data.length}/></div>
        </div>
      </div>
    )
  };

  render() {

    const { data, loading, search } = this.state;
    const { handleTapClick, fund, invent, t } = this.props;

    this.filteredData = data.filter(item =>
      (
        item.caseName.toLowerCase().includes(search.toLowerCase()) ||
        item.caseNumb.includes(search.toLowerCase()) ||
        item.dend.toLowerCase().includes(search.toLowerCase()) ||
        item.dbeg.toLowerCase().includes(search.toLowerCase())
      )
    );
    return (
      <div className="Cases">
        <div className="Cases__header">
          <Breadcrumb>
            <Breadcrumb.Item><a role="button" tabIndex={0} data-index="0" onClick={handleTapClick}>{ t('FUNDS') }</a></Breadcrumb.Item>
            <Breadcrumb.Item><a role="button" tabIndex={1} data-index="1" onClick={handleTapClick}>{ fund.fundName }</a></Breadcrumb.Item>
            <Breadcrumb.Item>{ invent.inventName }</Breadcrumb.Item>
          </Breadcrumb>
          <Search onChange={this.searchUpdate}/>
          <div className="make-order">
            <Button type='primary'>Заказать</Button>
          </div>
        </div>
        <div className="Cases__body">
          <AntTable
            rowSelection={this.rowSelection()}
            openedBy='Cases'
            loading={ loading }
            columns={
              [
                {
                  key: 'caseNumb',
                  title: '№ дела',
                  dataIndex: 'caseNumb',
                  width: '15%'
                },
                {
                  key: 'caseName',
                  title: 'Название дела',
                  dataIndex: 'caseName',
                  width: '21%'
                },
                {
                  key: 'dbeg',
                  title: 'Начальная дата',
                  dataIndex: 'dbeg',
                  width: '21%'
                },
                {
                  key: 'dend',
                  title: 'Конечная дата',
                  dataIndex: 'dend',
                  width: '21%'
                },
                {
                  key: 'status',
                  title: 'Статус',
                  dataIndex: 'status',
                  width: '21%'
                }
              ]
            }
            dataSource = { this.filteredData }
            footer={ this.renderTableFooter }
          />
        </div>
      </div>
    )
  }
}

Cases.propTypes = {
  casesLoaded: PropTypes.func.isRequired,
  cases: PropTypes.object,
  fund: PropTypes.shape({
    key: PropTypes.string.isRequired,
    fundName: PropTypes.string.isRequired,
    fundNumb: PropTypes.string
  }).isRequired,
  invent: PropTypes.shape({
    key: PropTypes.string.isRequired,
    inventName: PropTypes.string.isRequired,
    inventNumb: PropTypes.string
  }).isRequired,
  addCaseToBasket: PropTypes.func.isRequired,
  basket: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  tofiConstants: PropTypes.shape().isRequired
};

function mapStateToProps(state) {
  return {
    cases: state.cubes['CubeRRCase'],
    basket: state.readingRoom.basket,
    tofiConstants: state.generalData.tofiConstants
  }
}

export default connect(mapStateToProps, { casesLoaded, addCaseToBasket, removeCaseFromBasket, getCube })(Cases);
