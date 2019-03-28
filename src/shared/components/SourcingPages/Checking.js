import React from 'react';
import { Button } from 'antd';
import Select from '../Select';
import {connect} from 'react-redux';
import CSSTransition from 'react-transition-group/CSSTransition'

import AntTable from '../AntTable';
import {isEmpty, isEqual} from 'lodash';
import SiderCard_Checking from './SiderCard_Checking';

class Checking extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
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
      this.setState({ openCard: true })
    }
  };

  openCard = () => {
    this.setState({ openCard: true })
  };

  closeCard = () => {
    this.setState({ openCard: false })
  };

  render() {
    const { t, tofiConstants } = this.props;
    if(!tofiConstants) return null;

    const lng = localStorage.getItem('i18nextLng');
    const { checkSource, checkType, checkDate, checkAuthor } = tofiConstants;

    return (
      <div className="Checking">
        <div className="Checking__heading">
          <div className="table-header">
            <div className="table-header-btns">
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
                key: 'workList',
                title: checkSource.name[lng],
                dataIndex: 'workListName',
                width: '30%'
              },
              {
                key: 'workType',
                title: checkType.name[lng],
                dataIndex: 'workType',
                width: '20%'
              },
              {
                key: 'workPlannedEndDate',
                title: checkDate.name[lng],
                dataIndex: 'workPlannedEndDate',
                width: '20%'
              },
              {
                key: 'workStatus',
                title: checkAuthor.name[lng],
                dataIndex: 'workStatus',
                width: '20%'
              }
            ]}
            dataSource={[
              {
                key: '1',
                numb: 1,
                checkSource: 'Работа 1',
                checkType: 'Добавить опись',
                checkDate: '29.06.2018',
                checkAuthor: 'Создана'
              }
            ]}
            changeSelectedRow={this.changeSelectedRow}
            openedBy="Checking"
          />
          <CSSTransition
            in={this.state.openCard}
            timeout={300}
            classNames="card"
            unmountOnExit
          >
            <SiderCard_Checking t={t} tofiConstants={tofiConstants} initialValues={this.state.initialValues}
                                closer={<Button type='danger' onClick={this.closeCard} shape="circle" icon="arrow-right"/>}/>
          </CSSTransition>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    tofiConstants: state.generalData.tofiConstants
  }
}

export default connect(mapStateToProps)(Checking);