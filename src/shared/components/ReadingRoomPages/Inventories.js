import React from 'react';
import { connect } from 'react-redux';
// import {Breadcrumb, Input} from 'antd';
import { Button } from 'antd';
import PropTypes from 'prop-types';

import AntTable from '../AntTable';
import AntTabs from '../AntTabs';
import {parseCube_new} from '../../utils/cubeParser';
import {getCube, inventoriesLoaded} from '../../actions/actions'; //getCasesCount, 
// import {CUBE_FOR_INV, DBEG, DEND, DO_FOR_INV, INVENTNUMB} from '../../constants/tofiConstants';
import CSSTransition from 'react-transition-group/CSSTransition'
import { isEmpty, isEqual } from 'lodash';

const testData = [{
  key: 'key1',
  fundTitle: 'title1',
  fundNumb: 'numb1',
  fundAnnotation: 'annotation1',
  deadline: 'deadline1',
  amount: 'amount1',
  cases: 'cases1'
}, {
  key: 'key2',
  fundTitle: '',
  fundNumb: 'numb2',
  fundAnnotation: '',
  deadline: '',
  amount: '',
  cases: '',
  children:[{
    key: 'key2-2',
    fundTitle: 'title2-2',
    fundNumb: 'numb2-2',
    fundAnnotation: 'annotation2-2',
    deadline: 'deadline2-2',
    amount: 'amount2-2',
    cases: 'cases2-2',
  }]
}, {
  key: 'key3',
  fundTitle: 'title3',
  fundNumb: 'numb3',
  fundAnnotation: 'annotation3',
  deadline: 'deadline3',
  amount: 'amount3',
  cases: 'cases3'
}, {
  key: 'key4',
  fundTitle: 'title4',
  fundNumb: 'numb4',
  fundAnnotation: 'annotation4',
  deadline: 'deadline4',
  amount: 'amount4',
  cases: 'cases4'
}];


class Inventories extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      search: '',
      loading: false,
      errors: {},
      openCard: false,
      selectedRow: null,
      countData: {
        countFund: 0,
        countDelo: 0,
        countDeloFile: 0
      }
    }
  }

  componentDidMount() {    
    // if(isEmpty(this.props.inventories)) {
    //     this.setState({loading: true});
    //     this.props.getCube(CUBE_FOR_INV, JSON.stringify(filters), {customKey: 'CubeRRInv', parent: this.props.fund.key});
    // } else if(this.props.inventories.parent !== this.props.fund.key){
    //     this.setState({loading: true});
    //     this.props.getCube(CUBE_FOR_INV, JSON.stringify(filters), {customKey: 'CubeRRInv', parent: this.props.fund.key});
    // } else {
    //     const { inventories, tofiConstants: { doForInv, dpForInv } } = this.props;
    //     this.setState({ 
    //       loading: false, 
    //       data: parseCube_new(
    //         inventories['cube'], 
    //         [], 
    //         'dp', 
    //         'do', 
    //         inventories[`do_${doForInv.id}`], 
    //         inventories[`dp_${dpForInv.id}`], 
    //         `do_${doForInv.id}`, 
    //         `dp_${dpForInv.id}`
    //       ).map(this.dataSet) 
    //     });
    // }
  }

  // componentWillReceiveProps(nextProps) {
  //   if(!isEmpty(nextProps.inventories) && !isEmpty(nextProps.tofiConstants)) {
  //     const { doForRR, dpForRR } = nextProps.tofiConstants;
  //     this.setState({ loading: false, data: parseCube_new(nextProps.inventories['cube'], [], 'dp', 'do', nextProps.inventories[`do_${doForRR.id}`], nextProps.inventories[`dp_${dpForRR.id}`], `do_${doForRR.id}`, `dp_${dpForRR.id}`).map(this.dataSet) });
  //   } else {
  //     this.setState({ loading: false });
  //   }
  //   try {
  //     const ids = nextProps.inventories[`do_${nextProps.tofiConstants.doForRR.id}`].map(dimObj => dimObj.id);
  //     getCasesCount(JSON.stringify(ids), 'CubeForRR', 'doForRR')
  //       .then(caseData => {
  //         this.setState({
  //           countData: {
  //             ...this.state.countData,
  //             countFund: 1,
  //             countDelo: caseData.cntCases,
  //             countDeloFile: caseData.cntEO
  //           }
  //         })
  //       })
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  // dataSet = item => {
  //   const inventNumbObj = item.props.find(element => element.prop === INVENTNUMB),
  //         dendObj = item.props.find(element => element.prop === DEND),
  //         dbegObj = item.props.find(element => element.prop === DBEG);
  //   return {
  //     key: item.id,
  //     inventNumb: !!inventNumbObj ? inventNumbObj.value : '',
  //     inventName : item.name[localStorage.i18nextLng],
  //     dend: !!dendObj ? dendObj.value : '',
  //     dbeg: !!dbegObj ? dbegObj.value: '',
  //     inventInfo: ''
  //   }
  // };
  
  openCard = () => {
    this.setState({ openCard: true });
  };

  closeCard = () => {
    this.setState({ openCard: false });
  };

  changeSelectedRow = rec => {
    if(isEmpty(this.state.selectedRow) || (!isEqual(this.state.selectedRow, rec) && !this.state.openCard)){
      this.setState({ selectedRow: rec })
    } else {
      const initialValues = {
        key: rec.key,
        shortName: rec.orgList,
        name: rec.name
      };
      this.setState({ initialValues, openCard: true, selectedRow: rec })
    }
  };
  
  render() {
    const { data, loading, search } = this.state;
    const { t } = this.props;
    this.filteredData = data.filter(item =>
      (
        item.inventName.toLowerCase().includes(search.toLowerCase()) ||
        item.inventNumb.includes(search.toLowerCase()) ||
        item.dend.toLowerCase().includes(search.toLowerCase()) ||
        item.dbeg.toLowerCase().includes(search.toLowerCase())
      )
    );
    return (
      <div className="Inventories">
        <div className="Inventories__header">
          {/* <Breadcrumb>
            <Breadcrumb.Item><a role="button" tabIndex={0} data-index="0" onClick={this.props.handleTapClick}>{ t('FUNDS') }</a></Breadcrumb.Item>
            <Breadcrumb.Item>{this.props.fund.fundName}</Breadcrumb.Item>
          </Breadcrumb>
          <Search onChange={this.searchUpdate}/> */}
        </div>
        <div className="Inventories__body">
          <AntTable
            openedBy='Inventories'
            loading={ loading }
            columns={
              [
                {
                  key: 'fundNumb',
                  title: t('FUNDNUMB'),
                  dataIndex: 'fundNumb',
                  width: '30%'
                },
                {
                  key: 'fundTitle',
                  title: t('FUNDTITLE'),
                  dataIndex: 'fundTitle',
                  width: '15%'
                },
                {
                  key: 'deadline',
                  title: t('DEADLINES'),
                  dataIndex: 'deadline',
                  width: '15%'
                },
                {
                  key: 'amount',
                  title: t('AMOUNT'),
                  dataIndex: 'amount',
                  width: '15%'
                },
                {
                  key: 'cases',
                  title: t('CASES'),
                  dataIndex: 'cases',
                  width: '15%'
                }
              ]
            }
            dataSource = { testData }
            changeSelectedRow={this.changeSelectedRow}
          />
          <CSSTransition
            in={this.state.openCard}
            timeout={300}
            classNames="card"
            unmountOnExit
          >
            <div className="card">
                <Button type='danger' onClick={this.closeCard} shape="circle" icon="close"/>
                <AntTabs tabs={[
                    {
                    tabKey: 'tab1',
                    tabName: 'tab1',
                    tabContent: <div>{JSON.stringify(this.state.selectedRow)}</div>
                    },
                    {
                    tabKey: 'tab2',
                    tabName: 'tab2',
                    tabContent: <div>tab2</div>
                    }
                ]}/>
            </div>
          </CSSTransition>
        </div>
      </div>
    )
  }
}

Inventories.propTypes = {
  inventoriesLoaded: PropTypes.func.isRequired,
  nextState: PropTypes.func.isRequired,
  inventories: PropTypes.shape(),
  fund: PropTypes.shape({
    key: PropTypes.string.isRequired,
    fundName: PropTypes.string.isRequired
  }).isRequired,
  tofiConstants: PropTypes.shape({
    doForInv: PropTypes.shape(),
    dpForInv: PropTypes.shape()
  }).isRequired
};

function mapStateToProps(state) {
  return {
    inventories: state.cubes['CubeRRInv'],
    tofiConstants: state.generalData.tofiConstants
  }
}

export default connect(mapStateToProps, { inventoriesLoaded, getCube })(Inventories);
