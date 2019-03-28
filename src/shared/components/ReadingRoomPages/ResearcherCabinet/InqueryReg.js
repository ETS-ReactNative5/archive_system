import React from 'react';
import {Button, message, Icon, DatePicker, Modal} from 'antd';
import {CSSTransition} from "react-transition-group";
import {connect} from "react-redux";
import AntTable from '../../AntTable';
import InqueryRegCard from './InqueryRegCard';
import {onSaveCubeData, parseCube_new, parseForTable} from "../../../utils/cubeParser";
import {createObj, getCube} from "../../../actions/actions";
import SiderCard from "../../SiderCard";
import {isEmpty, isEqual} from "lodash";
import Select from "../../Select";
import moment from "moment/moment";
import Viewer from "../../Viewer";

class InquiryReq extends React.Component {

  state = {
    loading: false,
    selectedRow: null,
    openCard: false,
    openModal: false,
    initialValues: {},
    data: [],
    viewerList: [],
    filter: {
      workDate: {
        dbeg: null,
        dend: null
      },
      workEndDate: {
        dbeg: null,
        dend: null
      },
      researchTypeClass: [],
      personLastName: ''
    }
  };

  componentDidMount() {
    if(isEmpty(this.props.tofiConstants)) return;
    const getClsId = c => this.props.tofiConstants[c].id;

    this.clsThemeMap = {
      [getClsId('clsArchivalReferences')]: 'requestSubject',
      [getClsId('clsResearches')]: 'propStudy',
      [getClsId('clsOrders')]: 'propStudy',
    };
    this.getCubeAct();
  }
  onDateChange = (name, dateType) => {
    return date => {
      this.setState({filter: {...this.state.filter, [name]: {...this.state.filter[name], [dateType]: date}}})
    }
  };
  onInputChange = e => {
    this.setState({
      filter: {
        ...this.state.filter,
        [e.target.name]: e.target.value
      }
    })
  };
  emitEmpty = e => {
    this.setState({filter: {
        ...this.state.filter,
        [e.target.dataset.name]: ''
      }})
  };
  onResearchClassChange = s => this.setState(prevState => ({ filter: {...prevState.filter, researchTypeClass: s }}));

  getCubeAct() {
    this.setState({ loading: true });
    this.props.getCube('cubeStudy');
  }

  componentDidUpdate(prevProps) {
    if(isEmpty(this.props.tofiConstants)) return;
    const {tofiConstants: {doCubeStudy, dpCubeStudy}} = this.props;
    if(prevProps.cubeStudy !== this.props.cubeStudy) {
      try {
        this.setState(
          {
            loading: false,
            data: parseCube_new(
              this.props.cubeStudy['cube'],
              [],
              'dp',
              'do',
              this.props.cubeStudy[`do_${doCubeStudy.id}`],
              this.props.cubeStudy[`dp_${dpCubeStudy.id}`],
              `do_${doCubeStudy.id}`,
              `dp_${dpCubeStudy.id}`).map(this.renderTableData)
          }
        );
      } catch(err) {
        console.log(err);
        this.setState({ loading: false, data: [] })
      }
    }
  }

  changeSelectedRow = rec => {
    if(isEmpty(this.state.selectedRow) || (!isEqual(this.state.selectedRow, rec) && !this.state.openCard)){
      this.setState({ selectedRow: rec })
    } else {
      this.setState({ initialValues: rec, openCard: true, selectedRow: rec })
    }
  };

  renderTableData = (item, idx) => {
    const researchTypeClasses = ['clsResearches', 'clsOrders', 'clsArchivalReferences'];
    const constArr = ['workDate', 'workAuthor', 'researcheStatus', 'workEndDate', 'propStudy', 'resultResearch',
      'workDescription', 'requestSubject', 'formulationResearch', 'casesResearch', 'docsResearch', 'requestSource'];
    const researchTypeClass = researchTypeClasses.find(cls => this.props.tofiConstants[cls].id == item.clsORtr);
    const result = {
      key: item.id,
      name: item.name,
      researchTypeClass,
      researchType: researchTypeClass ?
        {
          value: this.props.tofiConstants[researchTypeClass].id,
          label: this.props.tofiConstants[researchTypeClass].name[this.lng],
          researchTypeClass
        } : null,
    };
    parseForTable(item.props, this.props.tofiConstants, result, constArr);
    // Here hoes some data massage
    result.researchTheme = result[this.clsThemeMap[item.clsORtr]];
    return result;
  };

  closeCard = () => {
    this.setState({ openCard: false })
  };

  changeStatus = (key, name) => {
    const obj = { doItem: key };
    return e => {
      e.stopPropagation();
      const newData = this.state.data.slice();
      const target = newData.find(el => el.key === key);
      if(target) {
        this.saveProps({obj}, {values: {researcheStatus: {value: this.props.tofiConstants[name].id}}})
      }
      this.setState({ data: newData });
    };
  };

  onCreateObj = async ({cube, obj}, v) => {
    let hideCreateObj;
    try {
      hideCreateObj = message.loading(this.props.t('CREATING_NEW_OBJECT'), 0);
      const res = await createObj({cubeSConst: 'cubeStudy'}, obj);
      hideCreateObj();
      if(!res.success) {
        res.errors.forEach(err => {
          message.error(err.text)
        });
        return Promise.reject(res)
      }
      obj.doItem = res.data.idItemDO;
      return this.saveProps(
        {cube, obj},
        v,
        this.props.tofiConstants
      );
    } catch (e) {
      typeof hideCreateObj === 'function' && hideCreateObj();
      console.warn(e)
    }
  };
  saveProps = async (c, v, t = this.props.tofiConstants, objData) => {
    let hideLoading;
    try {
      if(!c.cube) c.cube = {
        cubeSConst: 'cubeStudy',
        doConst: 'doCubeStudy',
        dpConst: 'dpCubeStudy',
      };
      if(!c.cube.data) c.cube.data = this.props.cubeStudy;
      hideLoading = message.loading(this.props.t('UPDATING_PROPS'), 0);
      const resSave = await onSaveCubeData(c, v, t, objData);
      hideLoading();
      if(!resSave.success) {
        message.error(this.props.t('PROPS_UPDATING_ERROR'));
        resSave.errors.forEach(err => {
          message.error(err.text)
        });
        return Promise.reject(resSave);
      }
      message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'));
      this.setState({loading: true, openCard: false});
      await this.getCubeAct();
      return resSave;
    }
    catch (e) {
      typeof hideLoading === 'function' && hideLoading();
      this.setState({ loading: false });
      console.warn(e);
    }
  };

  render() {
    if(isEmpty(this.props.tofiConstants)) return null;
    this.lng = localStorage.getItem('i18nextLng');
    const { loading, data, researchTypeClass, filter } = this.state;
    const { t, tofiConstants, tofiConstants: { workDate, workAuthor, propStudy, researcheStatus, workEndDate, resultResearch } } = this.props;

    this.filteredData = data.filter(item => {
      return (
        (filter.researchTypeClass.length === 0 || filter.researchTypeClass.some(p => (p.researchTypeClass == item.researchTypeClass))) &&
        ( !filter.workDate.dbeg || moment(item.workDate, 'DD-MM-YYYY').isSameOrAfter(filter.workDate.dbeg, 'day') ) &&
        ( !filter.workDate.dend || moment(item.workDate, 'DD-MM-YYYY').isSameOrBefore(filter.workDate.dend, 'day') ) &&
        ( !filter.workEndDate.dbeg || moment(item.workEndDate, 'DD-MM-YYYY').isSameOrAfter(filter.workEndDate.dbeg, 'day') ) &&
        ( !filter.workEndDate.dend || moment(item.workEndDate, 'DD-MM-YYYY').isSameOrBefore(filter.workEndDate.dend, 'day') )
      )
    });

    return (
      <div className='Works'>
        <div className="Works__heading">
          <div className="table-header" style={{ justifyContent: 'unset' }}>
            <Button style={{ margin: '0 3px' }} onClick={() => this.setState({ openCard: true, initialValues: {} })}>{t('ADD')}</Button>
            {/*<Button style={{ margin: '0 3px' }} onClick={() => this.setState({ openCard: true })}>{t('RECEIVE_FROM_EGOV')}</Button>
            <Button style={{ margin: '0 3px' }} onClick={() => this.setState({ openCard: true })}>{t('SEND_TO_EGOV')}</Button>*/}
            <div className="label-select" style={{ flex: '0 0 20%' }}>
              <Select
                name="researchTypeClass"
                isMulti
                isSearchable={false}
                value={researchTypeClass}
                onChange={this.onResearchClassChange}
                options={['clsResearches', 'clsOrders', 'clsArchivalReferences']
                  .map(c => ({value: tofiConstants[c].id, label: tofiConstants[c].name[this.lng], researchTypeClass: c}))}
                placeholder={t('RESEARCH_CLASS')}
              />
            </div>
          </div>
        </div>
        <div className="Works__body">
          <AntTable
            loading={loading}
            dataSource={this.filteredData}
            changeSelectedRow={this.changeSelectedRow}
            openedBy="Works"
            columns={[
              {
                key: 'researchType',
                title: t('RESEARCH_CLASS'),
                dataIndex: 'researchType',
                width: '10%',
                render: obj => obj && obj.label
              },
              {
                key: 'name',
                title: t('NAME'),
                dataIndex: 'name',
                width: '10%',
                render: obj => obj && obj[this.lng]
              },
              {
                key: 'workDate',
                title: workDate.name[this.lng],
                dataIndex: 'workDate',
                width: '13%',
                filterDropdown: (
                  <div className="custom-filter-dropdown">
                    <div className="flex">
                      <DatePicker
                        format="DD-MM-YYYY"
                        value={this.state.filter.workDate.dbeg}
                        style={{marginRight: '16px'}}
                        showToday={false}
                        onChange={this.onDateChange('workDate', 'dbeg')}
                      />
                      <DatePicker
                        format="DD-MM-YYYY"
                        value={this.state.filter.workDate.dend}
                        showToday={false}
                        onChange={this.onDateChange('workDate', 'dend')}
                      />
                    </div>
                  </div>
                ),
                filterIcon: <Icon type="filter" style={{ color: (filter.workDate.dbeg || filter.workDate.dend) ? '#ff9800' : '#aaa' }} />,
                render: obj => obj && obj.format('DD-MM-YYYY')
              },
              {
                key: 'workAuthor',
                title: workAuthor.name[this.lng],
                dataIndex: 'workAuthor',
                width: '10%',
                render: obj => obj && obj.label
              },
              {
                key: 'researchTheme',
                title: propStudy.name[this.lng],
                dataIndex: 'researchTheme',
                width: '10%',
                render: obj => obj && obj.label
              },
              {
                key: 'researcheStatus',
                title: researcheStatus.name[this.lng],
                dataIndex: 'researcheStatus',
                width: '10%',
                render: obj => obj && obj.label
              },
              {
                key: 'workEndDate',
                title: workEndDate.name[this.lng],
                dataIndex: 'workEndDate',
                width: '13%',
                filterDropdown: (
                  <div className="custom-filter-dropdown">
                    <div className="flex">
                      <DatePicker
                        format="DD-MM-YYYY"
                        value={this.state.filter.workEndDate.dbeg}
                        style={{marginRight: '16px'}}
                        showToday={false}
                        onChange={this.onDateChange('workEndDate', 'dbeg')}
                      />
                      <DatePicker
                        format="DD-MM-YYYY"
                        value={this.state.filter.workEndDate.dend}
                        showToday={false}
                        onChange={this.onDateChange('workEndDate', 'dend')}
                      />
                    </div>
                  </div>
                ),
                filterIcon: <Icon type="filter" style={{ color: (filter.workEndDate.dbeg || filter.workEndDate.dend) ? '#ff9800' : '#aaa' }} />,
                render: obj => obj && obj.format('DD-MM-YYYY')
              },
              {
                key: 'resultResearch',
                title: resultResearch.name[this.lng],
                dataIndex: 'resultResearch',
                width: '8%',
                render: vals => vals && vals.length &&
                  <Button
                    title={t('SHOW_FILES')}
                    icon="paper-clip"
                    className='green-btn'
                    onClick={e => {
                      e.stopPropagation();
                      this.setState({openModal: true, viewerList: vals})
                    }}
                  />,
              },
              {
                key: 'action',
                title: '',
                dataIndex: 'action',
                width: '6%',
                render: (text, record) => {
                  return (
                    <div className="editable-row-operations">
                      <span>
                        <Button title={t('CANCELED')} icon="close" className='green-btn' onClick={this.changeStatus(record.key, 'canceled')} />
                      </span>
                    </div>
                  );
                },
              },
            ]}
          />
          {<CSSTransition
            in={this.state.openCard}
            timeout={300}
            classNames="card"
            unmountOnExit
          >
            <SiderCard
              closer={<Button type='danger' onClick={this.closeCard} shape="circle" icon="arrow-right"/>}
            >
              <InqueryRegCard
                t={t}
                tofiConstants={tofiConstants}
                initialValues={this.state.initialValues}
                onCreateObj={this.onCreateObj}
                saveProps={this.saveProps}
                clsThemeMap={this.clsThemeMap}
              />
            </SiderCard>
          </CSSTransition>}
        </div>
        {<Modal
          visible={this.state.openModal}
          footer={null}
          title={t('VIEWER_INQUERY')}
          wrapClassName={'full-screen'}
          onCancel={() => this.setState({ openModal: false })}
        >
          <Viewer key={this.state.viewerList.toString()} viewerList={this.state.viewerList}/>
        </Modal>}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    cubeStudy: state.cubes.cubeStudy,
    tofiConstants: state.generalData.tofiConstants
  }
}

export default connect(mapStateToProps, { getCube })(InquiryReq);
