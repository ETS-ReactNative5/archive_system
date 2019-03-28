import React from 'react';
import { Button, Radio, Input } from 'antd';
import Select from '../Select';
import {connect} from 'react-redux';
import CSSTransition from 'react-transition-group/CSSTransition'
import moment from 'moment';

import AntTable from '../AntTable';
import SiderCard from './SiderCard';
import {isEmpty, isEqual} from 'lodash';
import {CUBE_FOR_SOURCE_WORK} from '../../constants/tofiConstants';
import { getCube } from '../../actions/actions';
import {parseCube_new} from '../../utils/cubeParser';

const RadioGroup = Radio.Group;
const Search = Input.Search;

class Works extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      priority: null,
      status: null,
      sourcing: null,
      form: null,
      search: '',
      openCard: false,
      selectedRow: null,
      initialValues: {},
      loading: true
    }
  }

  onRadioChange = e => {
    console.log(e.target.value)
  };

  onPriorityChange = s => {this.setState({priority: s})};
  onStatusChange = s => {this.setState({status: s})};
  onSourcingChange = s => {this.setState({sourcing: s})};
  onFormChange = s => {this.setState({form: s})};

  onSearch = e => { this.setState({search: e.target.value}) };

  changeSelectedRow = rec => {
    if(isEmpty(this.state.selectedRow) || !isEqual(this.state.selectedRow, rec) && !this.state.openCard){
      this.setState({ selectedRow: rec })
    } else {
      const initialValues = {
        workListName: rec.workListNameObj,
        workType: rec.workTypeObj,
        workPlannedEndDate: rec.workPlannedEndDateObj,
        workPriority: rec.workPriority,
        workStatus: rec.workStatusObj,
        workSource: rec.workSource,
        workAuthor: rec.workAuthor,
        workDate: rec.workDate,
        workAssignedTo: rec.workAssignedTo,
        workPlannedStartDate: rec.workPlannedStartDate,
        workActualStartDate: rec.workActualStartDate,
        workActualEndDate: rec.workActualEndDate
      };
      this.setState({ initialValues, openCard: true })
    }
  };

  openCard = () => {
    this.setState({ openCard: true, initialValues: {} })
  };

  closeCard = () => {
    this.setState({ openCard: false })
  };

  componentDidMount() {
    this.setState({loading: true});
    this.props.getCube(CUBE_FOR_SOURCE_WORK);
  }

  componentWillReceiveProps(nextProps) {
    if(!isEmpty(nextProps.works) && !isEmpty(nextProps.tofiConstants) && this.props.works !== nextProps.works) {
      const { doForSourceWork, dpForSourceWork } = nextProps.tofiConstants;
      this.setState(
        {
          loading: false,
          data: parseCube_new(nextProps.works['cube'], [], 'dp', 'do', nextProps.works[`do_${doForSourceWork.id}`], nextProps.works[`dp_${dpForSourceWork.id}`], `do_${doForSourceWork.id}`, `dp_${dpForSourceWork.id}`)
        }
      );
    } else {
      this.setState({ loading: false });
    }
  }

  renderTableData = (item, idx) => {
    const { workType, workPlannedEndDate, workStatus, workAuthor, workSource,
      workPriority, workDate, workAssignedTo, workPlannedStartDate, workActualStartDate, workActualEndDate } = this.props.tofiConstants;
    const workTypeObj = item.props.find(element => element.prop == workType.id),
      workPlannedEndDateObj = item.props.find(element => element.prop == workPlannedEndDate.id),
      workStatusObj = item.props.find(element => element.prop == workStatus.id),
      workAuthorObj = item.props.find(element => element.prop == workAuthor.id),
      workSourceObj = item.props.find(element => element.prop == workSource.id),
      workPriorityObj = item.props.find(element => element.prop == workPriority.id),
      workDateObj = item.props.find(element => element.prop == workDate.id),
      workAssignedToObj = item.props.find(element => element.prop == workAssignedTo.id),
      workPlannedStartDateObj = item.props.find(element => element.prop == workPlannedStartDate.id),
      workActualStartDateObj = item.props.find(element => element.prop == workActualStartDate.id),
      workActualEndDateObj = item.props.find(element => element.prop == workActualEndDate.id);
    return {
      key: item.id,
      numb: idx + 1,
      workListName: !!item.name ? item.name[this.lng] || '' : '',
      workType: !!workTypeObj ? workTypeObj.value || '' : '',
      workTypeObj: !!workTypeObj ? workTypeObj.refId || '' : '',
      workPlannedEndDate: !!workPlannedEndDateObj ? workPlannedEndDateObj.value || '' : '',
      workPlannedEndDateObj: !!workPlannedEndDateObj && workPlannedEndDateObj.value ? moment(workPlannedEndDateObj.value, 'DD-MM-YYYY') : null,
      workStatus: !!workStatusObj ? workStatusObj.value || '' : '',
      workStatusObj: !!workStatusObj ? workStatusObj.refId || '' : '',
      workListNameObj: item.name,
      workPriority: !!workPriorityObj ? workPriorityObj.refId || '' : '',
      workSource: !!workSourceObj ? workSourceObj.cube.idRef || '' : '',
      workAuthor: !!workAuthorObj ? workAuthorObj.value || '' : '',
      workDate: !!workDateObj && workDateObj.value ? moment(workDateObj.value, 'DD-MM-YYYY') : null,
      workAssignedTo: !!workAssignedToObj ? workAssignedToObj.cube.idRef || '' : '',
      workPlannedStartDate: !!workPlannedStartDateObj && workPlannedStartDateObj.value ? moment(workPlannedStartDateObj.value, 'DD-MM-YYYY') : null,
      workActualStartDate: !!workActualStartDateObj && workActualStartDateObj.value ? moment(workActualStartDateObj.value, 'DD-MM-YYYY') : null,
      workActualEndDate: !!workActualEndDateObj && workActualEndDateObj.value ? moment(workActualEndDateObj.value, 'DD-MM-YYYY') : null
    }
  };

  render() {
    const { search, loading, data } = this.state;
    const { t, tofiConstants } = this.props;
    if(!tofiConstants) return null;

    this.lng = localStorage.getItem('i18nextLng');
    const { workListName, workType, workPlannedEndDate, workStatus } = tofiConstants;

    this.filteredData = data.map(this.renderTableData).filter(item => {
      return (
        item.numb === Number(search) ||
        item.workListName.toLowerCase().includes(search.toLowerCase()) ||
        item.workType.toLowerCase().includes(search.toLowerCase()) ||
        item.workPlannedEndDate.toLowerCase().includes(search.toLowerCase()) ||
        item.workStatus.toLowerCase().includes(search.toLowerCase())
      )
    });

    return (
      <div className="Works">
        <div className="Works__heading">
          <div className="table-header">
            <Button onClick={this.openCard}>{this.props.t('ADD')}</Button>
            <RadioGroup defaultValue={1} onChange={this.onRadioChange}>
              <Radio value={1}>Только мои работы</Radio>
              <Radio value={2}>Все работы</Radio>
            </RadioGroup>
            <div className="label-select">
              <p>{t('PRIORITY')}</p>
              <Select
                name="priority"
                isSearchable={false}
                value={this.state.priority}
                onChange={this.onPriorityChange}
                options={[
                  { value: 'one', label: 'One' },
                  { value: 'two', label: 'Two' },
                ]}
              />
            </div>
            <div className="label-select">
              <p>{t('STATUS')}</p>
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
            <div className="label-select">
              <p>{t('SOURCING')}</p>
              <Select
                name="sourcing"
                isSearchable={false}
                value={this.state.sourcing}
                onChange={this.onSourcingChange}
                options={[
                  { value: 'one', label: 'One' },
                  { value: 'two', label: 'Two' },
                ]}
              />
            </div>
            <div className="label-select">
              <p>{t('FORM')}</p>
              <Select
                name="form"
                isSearchable={false}
                value={this.state.form}
                onChange={this.onFormChange}
                options={[
                  { value: 'one', label: 'One' },
                  { value: 'two', label: 'Two' },
                ]}
              />
            </div>
            <Search
              placeholder="search"
              onChange={this.onSearch}
              value={this.state.search}
            />
          </div>
        </div>
        <div className="Works__body">
          <AntTable
              rowClassName={rec => rec.workStatusUses ? rec.workStatusUses.value == '1192' || rec.workStatusUses.value == '1368' || rec.workStatusUses.value == '1369' || rec.workStatusUses.value == '1367' || rec.workStatusUses.value == '1545' ? 'completed' : rec.workStatusUses.value == '1190' || rec.nsaWorkStatus.value == '1191' || rec.workStatusUses.value == '1528' ? 'appointed' : rec.workStatusUses.value == '1190' ? '1502' : '' : ''}

              loading={loading}
            columns={[
              {
                key: 'numb',
                title: '№',
                dataIndex: 'numb',
                width: '10%'
              },
              {
                key: 'workListName',
                title: workListName.name[this.lng],
                dataIndex: 'workListName',
                width: '30%'
              },
              {
                key: 'workType',
                title: workType.name[this.lng],
                dataIndex: 'workType',
                width: '20%'
              },
              {
                key: 'workPlannedEndDate',
                title: workPlannedEndDate.name[this.lng],
                dataIndex: 'workPlannedEndDate',
                width: '20%'
              },
              {
                key: 'workStatus',
                title: workStatus.name[this.lng],
                dataIndex: 'workStatus',
                width: '20%'
              }
            ]}
            dataSource={this.filteredData}
            changeSelectedRow={this.changeSelectedRow}
            openedBy="Works"
          />
          <CSSTransition
            in={this.state.openCard}
            timeout={300}
            classNames="card"
            unmountOnExit
          >
            <SiderCard t={t} tofiConstants={tofiConstants} initialValues={this.state.initialValues}
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
    works: state.archiveFund[CUBE_FOR_SOURCE_WORK]
  }
}

export default connect(mapStateToProps, {getCube})(Works);