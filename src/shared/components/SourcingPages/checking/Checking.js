import React from 'react';
import { Button } from 'antd';
import Select from '../../Select';
import {connect} from 'react-redux';
import CSSTransition from 'react-transition-group/CSSTransition'

import AntTable from '../../AntTable';
import {isEmpty, isEqual} from 'lodash';
import SiderCard_Checking from './SiderCard_Checking';
import {getCube} from '../../../actions/actions';
import { CUBE_FOR_CHECK } from '../../../constants/tofiConstants';
import {parseCube_new} from '../../../utils/cubeParser';
import moment from 'moment';

/* eslint eqeqeq:0 */
class Checking extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      sourcing: null,
      status: null,
      openCard: false,
      selectedRow: null,
      initialValues: {}
    }
  }

  onPriorityChange = s => {this.setState({sourcing: s})};
  onStatusChange = s => {this.setState({status: s})};

  changeSelectedRow = rec => {
    if(isEmpty(this.state.selectedRow) || !isEqual(this.state.selectedRow, rec)){
      this.setState({ selectedRow: rec })
    } else {
      const initialValues = {
        checkSource: rec.checkSourceObj,
        checkType: rec.checkTypeObj,
        checkDate: rec.checkDateObj,
        checkAuthor: rec.checkAuthorObj,
        checkFile: rec.checkFile
      };
      this.setState({ initialValues, openCard: true })
    }
  };

  openCard = e => {
    if(e.target.name === 'add') {
      this.setState({ openCard: true, initialValues: {} })
    } else {
      const initialValues = {
        checkSource: this.state.selectedRow.checkSourceObj,
        checkType: this.state.selectedRow.checkTypeObj,
        checkDate: this.state.selectedRow.checkDateObj,
        checkAuthor: this.state.selectedRow.checkAuthorObj,
        checkFile: this.state.selectedRow.checkFile
      };
      this.setState({ openCard: true, initialValues })
    }
  };

  closeCard = () => {
    this.setState({ openCard: false })
  };

  componentDidMount() {
    this.props.getCube(CUBE_FOR_CHECK)
  }

  componentWillReceiveProps(nextProps) {
    if(!isEmpty(nextProps.checkCube) && !isEmpty(nextProps.tofiConstants) && this.props.checkCube !== nextProps.checkCube) {
      const { doForCheck, dpForCheck } = nextProps.tofiConstants;
      this.setState(
        {
          loading: false,
          data: parseCube_new(nextProps.checkCube['cube'], [], 'dp', 'do', nextProps.checkCube[`do_${doForCheck.id}`], nextProps.checkCube[`dp_${dpForCheck.id}`], `do_${doForCheck.id}`, `dp_${dpForCheck.id}`)
        }
      );
    } else {
      this.setState({ loading: false });
    }
  }

  renderTableData = (item, idx) => {
    const { checkSource, checkDate, checkType, checkAuthor, checkFile } = this.props.tofiConstants;
    const checkTypeObj = item.props.find(element => element.prop == checkType.id),
      checkSourceObj = item.props.find(element => element.prop == checkSource.id),
      checkDateObj = item.props.find(element => element.prop == checkDate.id),
      checkAuthorObj = item.props.find(element => element.prop == checkAuthor.id),
      checkFileObj = item.props.find(element => element.prop == checkFile.id);
      // checkResultObj = item.props.find(element => element.prop == checkResult.id),
      // checkOfferingObj = item.props.find(element => element.prop == checkOffering.id),
      // checkOfferingResultObj = item.props.find(element => element.prop == checkOfferingResult.id),
    return {
      key: item.id,
      numb: idx + 1,
      checkSourceName: !!item.name ? item.name[this.lng] || '' : '',
      checkType: !!checkTypeObj ? checkTypeObj.value || '' : '',
      checkDate: !!checkDateObj ? checkDateObj.value || '' : '',
      checkAuthor: !!checkAuthorObj ? checkAuthorObj.value || '' : '',
      checkSourceObj: !!checkSourceObj ? checkSourceObj.cube.idRef || '' : '',
      checkTypeObj: !!checkTypeObj ? checkTypeObj.refId || '' : '',
      checkDateObj: !!checkDateObj && checkDateObj.value ? moment(checkDateObj.value, 'DD-MM-YYYY') : null,
      checkAuthorObj: !!checkAuthorObj ? checkAuthorObj.refId || '' : '',
      checkFile: checkFileObj,
      // checkResult: !!checkResultObj ? checkResultObj.value || '' : '',
      // checkOffering: !!checkOfferingObj ? checkOfferingObj.cube.idRef || '' : '',
      // checkOfferingResult: !!checkOfferingResultObj ? checkOfferingResultObj.refId || '' : '',
    }
  };

  render() {
    const { t, tofiConstants } = this.props;
    if(!tofiConstants) return null;

    const lng = localStorage.getItem('i18nextLng');
    const { checkSource, checkType, checkDate, checkAuthor } = tofiConstants;

    return (
      <div className="Checking">
        <div className="title">
          <h2>Комплектование: "Проверки источников комплектования"</h2>
        </div>
        <div className="Checking__heading">
          <div className="table-header">
            <div className="table-header-btns">
              <Button onClick={this.openCard} name="add">{t('ADD')}</Button>
              <Button onClick={this.openCard} disabled={isEmpty(this.state.selectedRow)}>{t('EDIT_CARD')}</Button>
            </div>
            <div className="label-select">
              <p>{checkSource.name[lng]}</p>
              <Select
                name="sourcing"
                isSearchable={false}
                value={this.state.sourcing}
                onChange={this.onPriorityChange}
                options={[
                  { value: 'one', label: 'One' },
                  { value: 'two', label: 'Two' },
                ]}
              />
            </div>
            <div className="label-select">
              <p>{checkType.name[lng]}</p>
              <Select
                name="status"
                isSearchable={false}
                value={this.state.status}
                onChange={this.onStatusChange}
                options={[
                  { value: 'one', label: 'One' },
                  { value: 'two', label: 'Two' },
                ]}
              />
            </div>
          </div>
        </div>
        <div className="Checking__body">
          <AntTable
            loading={false}
            columns={[
              {
                key: 'numb',
                title: '№',
                dataIndex: 'numb',
                width: '10%'
              },
              {
                key: 'checkSource',
                title: checkSource.name[lng],
                dataIndex: 'checkSourceName',
                width: '30%'
              },
              {
                key: 'checkType',
                title: checkType.name[lng],
                dataIndex: 'checkType',
                width: '20%'
              },
              {
                key: 'checkDate',
                title: checkDate.name[lng],
                dataIndex: 'checkDate',
                width: '20%'
              },
              {
                key: 'checkAuthor',
                title: checkAuthor.name[lng],
                dataIndex: 'checkAuthor',
                width: '20%'
              }
            ]}
            dataSource={this.state.data.map(this.renderTableData)}
            changeSelectedRow={this.changeSelectedRow}
            openedBy="Checking"
          />
          <CSSTransition
            in={this.state.openCard}
            timeout={300}
            classNames="card"
            unmountOnExit
          >
            <SiderCard_Checking t={t} tofiConstants={tofiConstants} initialValues={this.state.initialValues} // eslint-disable-line
                                closer={<Button type='danger' onClick={this.closeCard} shape="circle" icon="arrow-right"/>}/>
          </CSSTransition>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    tofiConstants: state.generalData.tofiConstants,
    checkCube: state.cubes[CUBE_FOR_CHECK]
  }
}

export default connect(mapStateToProps, { getCube })(Checking);