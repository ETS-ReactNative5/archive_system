import React from 'react';
import {Button, Popconfirm, message, Icon, Input} from 'antd';
import {CSSTransition} from "react-transition-group";
import {connect} from "react-redux";
import AntTable from '../../AntTable';
import AntTabs from '../../AntTabs';

import ResearchersCard from './ResearchersCard';
import StaffCard from './StaffCard';
import {onSaveCubeData, parseCube_new, parseForTable} from "../../../utils/cubeParser";
import {createObj, dObj, getCube} from "../../../actions/actions";
import SiderCard from "../../SiderCard";
import {isEmpty, isEqual} from "lodash";
import Select from "../../Select";

class Researchers extends React.Component {

  state = {
    loading: false,
    selectedRow: null,
    openCard: false,
    initialValues: {},
    staff: [],
    researchers: [],
    filter: {
      staffClass: [],
      researcherClass: [],
      nameStaff: '',
      nameResearchers: '',
    }
  };

  componentDidMount() {
    this.getCubeAct();
  }
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
  
  onStaffClassChange = s => this.setState(prevState => ({ filter: {...prevState.filter, staffClass: s }}));
  onResearcherClassChange = s => this.setState(prevState => ({ filter: {...prevState.filter, researcherClass: s }}));

  getCubeAct() {
    this.setState({ loading: true });
    this.props.getCube('cubeUsers');
  }

  componentDidUpdate(prevProps) {
    if(isEmpty(this.props.tofiConstants)) return;
    const {tofiConstants: {doUsers, dpUsers}} = this.props;
    if(prevProps.cubeUsers !== this.props.cubeUsers) {
      try {
        const parseCubeData = parseCube_new(
          this.props.cubeUsers['cube'],
          [],
          'dp',
          'do',
          this.props.cubeUsers[`do_${doUsers.id}`],
          this.props.cubeUsers[`dp_${dpUsers.id}`],
          `do_${doUsers.id}`,
          `dp_${dpUsers.id}`).map(this.renderTableData);
        
        const researchers = parseCubeData.filter(item => 
          item.researcherClassObj.researcherClass === 'clsResearchers' || item.researcherClassObj.researcherClass === 'clsTempUsers' 
        );
        const staff = parseCubeData.filter(item => 
          item.researcherClassObj.researcherClass !== 'clsResearchers' && item.researcherClassObj.researcherClass !== 'clsTempUsers' 
        );
        
        //console.log(parseCubeData, staff, researchers);

        this.setState(
          {
            loading: false,
            staff: staff,
            researchers: researchers,
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
    const researcherClasses = ['clsResearchers', 'clsHead', 'clsAdminDepartment', 'clsDepInformTech', 'staff',
      'clsTempUsers', 'workAssignedToReg', 'workAssignedToNID', 'workAssignedToSource', 'workAssignedToIPS'];
    const constArr = ['iin', 'roles', 'personLastName', 'personName', 'personPatronymic', 'dateOfBirth', 'gender', 'nationality',
      'directUseDocument', 'goalSprav', 'formResultRealization', 'location', 'photo', 'copyUdl', 'propStudy',
      'personAcademicDegree', 'job', 'position', 'education', 'personAcademicTitle', 'staffRole'];
    const researcherClass = researcherClasses.find(cls => this.props.tofiConstants[cls].id == item.clsORtr);
    const result = {
      key: item.id,
      name: item.name,
      researcherClassObj: {
        researcherClass,
        value: this.props.tofiConstants[researcherClass] ? this.props.tofiConstants[researcherClass].id : '',
        label: this.props.tofiConstants[researcherClass] ? this.props.tofiConstants[researcherClass].name[this.lng] : '',
      }
    };
    // debugger;
    parseForTable(item.props, this.props.tofiConstants, result, constArr);
    // Don't know how to handle both array and obj in uploadImage component. Sorry kinda my fault🤷
    // if(result.copyUdl && result.copyUdl.length) result.copyUdl = result.copyUdl[0].name;
    // if(result.photo) result.photo = result.photo.name;
    result.personFullName = result.personLastName + ' ' + result.personName + ' ' + result.personPatronymic;
    return result;
  };

  closeCard = () => {
    this.setState({ openCard: false })
  };

  onCreateObj = async ({cube, obj}, v) => {
    let hideCreateObj;
    try {
      hideCreateObj = message.loading(this.props.t('CREATING_NEW_OBJECT'), 0);
      const res = await createObj({cubeSConst: 'cubeUsers'}, obj);
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
        cubeSConst: 'cubeUsers',
        doConst: 'doUsers',
        dpConst: 'dpUsers',
      };
      if(!c.cube.data) c.cube.data = this.props.cubeUsers;
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
    const { loading, staff, researchers, researcherClass, filter } = this.state;
    const { t, tofiConstants, tofiConstants: { iin, personLastName } } = this.props;

    this.filteredDataStaff = staff.filter(item => {
      //console.log(item)
      return (
        item.name[this.lng].toLowerCase().includes(filter.nameStaff.toLowerCase()) &&
        (filter.staffClass.length === 0 || filter.staffClass.some(p => (p.researcherClass == item.researcherClassObj.researcherClass)))
      )
    });
    //console.log(this.filteredDataStaff)
    this.filteredDataReseachers = researchers.filter(item => {
      return (
        item.name[this.lng].toLowerCase().includes(filter.nameResearchers.toLowerCase()) &&
        (filter.researcherClass.length === 0 || filter.researcherClass.some(p => (p.researcherClass == item.researcherClassObj.researcherClass)))
      )
    });

    return (
      <div className='Works'>
        <div className="title">
          <h2>{t('USERS_OF_SYSTEM')}</h2>
        </div>
        <AntTabs
          onChange={() => this.setState({openCard: false})}
          tabs={[
            {
              tabKey: 'researchers',
              tabName: t('USERS_RESEARCHERS'),
              tabContent: (
                <div className='Works'>
                {/* <div style={{height:'100%',display:'flex',flexDirection:'column'}}> */}
                  <div className="Works__heading">
                    <div className="table-header">
                      <div className="label-select" style={{ flex: '0 0 20%' }}>
                        <Select
                          name="researcherClass"
                          isMulti
                          disabled={this.state.openCard || this.state.loading}
                          isSearchable={false}
                          value={researcherClass}
                          onChange={this.onResearcherClassChange}
                          options={['clsResearchers', 'clsTempUsers']
                            .map(c => ({value: tofiConstants[c].id, label: tofiConstants[c].name[this.lng], researcherClass: c}))}
                          placeholder={t('RESEARCHER_CLASS')}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="Works__body">
                    <AntTable
                      loading={loading}
                      dataSource={this.filteredDataReseachers}
                      changeSelectedRow={this.changeSelectedRow}
                      openedBy="Works"
                      columns={[
                        {
                          key: 'iin',
                          title: iin.name[this.lng],
                          dataIndex: 'iin',
                          width: '15%',
                          render: obj =>{ return obj ? obj.value: ''}
                        },
                        {
                          key: 'personFullName',
                          title: t('FIO'), // personLastName.name[this.lng],
                          dataIndex: 'personLastName',
                          width: '40%',
                          render: (obj, record) => (record ?  record.name[this.lng] : ''),
                          filterDropdown: (
                            <div className="custom-filter-dropdown">
                              <Input
                                disabled={this.state.openCard}
                                name="nameResearchers"
                                suffix={filter.nameResearchers && !this.state.openCard ? <Icon type="close-circle" data-name="nameResearchers" onClick={this.emitEmpty} /> : null}
                                ref={ele => this.nameResearchers = ele}
                                placeholder="Поиск"
                                value={filter.nameResearchers}
                                onChange={this.onInputChange}
                              />
                            </div>
                          ),
                          filterIcon: <Icon type="filter" style={{ color: filter.nameResearchers ? '#ff9800' : '#aaa' }} />,
                          onFilterDropdownVisibleChange: (visible) => {
                            this.setState({
                              filterDropdownVisible: visible,
                            }, () => this.nameResearchers.focus());
                          },
                        },
                        {
                          key: 'class',
                          title: t('USER_CLASS'),
                          dataIndex: 'class',
                          width: '15%',
                          render: (obj, record) =>  record.researcherClassObj.label, //record.name[this.lng],
                        },
                        {
                          key: 'job',
                          title: tofiConstants.job.name[this.lng],
                          dataIndex: 'job',
                          width: '25%',
                          render: (obj, record) =>  {return record && record.job ? record.job.value : ''}, //record.name[this.lng],
                        },
                        {
                          key: 'action',
                          title: '',
                          dataIndex: 'action',
                          width: '5%',
                          render: (text, record) => {
                            return (
                              <div className="editable-row-operations">
                                <span>
                                  <Popconfirm title={this.props.t('CONFIRM_REMOVE')} onConfirm={() => {
                                    const fd = new FormData();
                                    fd.append("cubeSConst", 'cubeUsers');
                                    fd.append("dimObjConst", 'doUsers');
                                    fd.append("objId", record.key.split('_')[1]);
                                    const hideLoading = message.loading(this.props.t('REMOVING'), 30);
                                    dObj(fd)
                                      .then(res => {
                                        hideLoading();
                                        if(res.success) {
                                          message.success(this.props.t('SUCCESSFULLY_REMOVED'));
                                          this.getCubeAct()
                                        } else {
                                          throw res
                                        }
                                      }).catch(err => {
                                      console.log(err);
                                      message.error(this.props.t('REMOVING_ERROR'))
                                    })
                                  }}>
                                    <Button title="Удалить" icon="delete" onClick={e => e.stopPropagation()} disabled={!!record.workActualStartDate} className='green-btn yellow-bg'/>
                                  </Popconfirm>
                                </span>
                              </div>
                            );
                          },
                        },
                      ]}
                    />
                    <CSSTransition
                      in={this.state.openCard}
                      timeout={300}
                      classNames="card"
                      unmountOnExit
                    >
                      <SiderCard
                        closer={<Button type='danger' onClick={this.closeCard} shape="circle" icon="arrow-right"/>}
                      >
                        <ResearchersCard
                          t={t}
                          tofiConstants={tofiConstants}
                          initialValues={this.state.initialValues}
                          onCreateObj={this.onCreateObj}
                          saveProps={this.saveProps}
                        />
                      </SiderCard>
                    </CSSTransition>
                  </div>
                </div>
              )
            },
            {
              tabKey: 'staff',
              tabName: t('USERS_STAFF'),
              tabContent: (
                <div className='Works'>
                  <div className="Works__heading">
                    <div className="table-header">
                      <div className="label-select" style={{ flex: '0 0 20%' }}>
                        <Select
                          name="researcherClass"
                          isMulti
                          disabled={this.state.openCard || this.state.loading}
                          isSearchable={false}
                          value={researcherClass}
                          onChange={this.onStaffClassChange}
                          options={['clsHead', 'clsAdminDepartment', 'clsDepInformTech', 'staff',
                            'workAssignedToReg', 'workAssignedToNID', 'workAssignedToSource', 'workAssignedToIPS']
                            .map(c => ({value: tofiConstants[c].id, label: tofiConstants[c].name[this.lng], researcherClass: c}))}
                          placeholder={t('RESEARCHER_CLASS')}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="Works__body">
                    <AntTable
                      loading={loading}
                      dataSource={this.filteredDataStaff}
                      changeSelectedRow={this.changeSelectedRow}
                      openedBy="Works"
                      columns={[
                        {
                          key: 'iin',
                          title: iin.name[this.lng],
                          dataIndex: 'iin',
                          width: '15%',
                          render: obj =>{ return  obj ? obj.value : ''}
                        },
                        {
                          key: 'name',
                          title: t('FIO'), // personLastName.name[this.lng],
                          dataIndex: 'personFullName',
                          width: '40%',
                          render: (obj, record) => record.name[this.lng],
                          filterDropdown: (
                            <div className="custom-filter-dropdown">
                              <Input
                                disabled={this.state.openCard}
                                name="nameStaff"
                                suffix={filter.nameStaff && !this.state.openCard ? <Icon type="close-circle" data-name="nameStaff" onClick={this.emitEmpty} /> : null}
                                ref={ele => this.nameStaff = ele}
                                placeholder="Поиск"
                                value={filter.nameStaff}
                                onChange={this.onInputChange}
                              />
                            </div>
                          ),
                          filterIcon: <Icon type="filter" style={{ color: filter.nameStaff ? '#ff9800' : '#aaa' }} />,
                          onFilterDropdownVisibleChange: (visible) => {
                            this.setState({
                              filterDropdownVisible: visible,
                            }, () => this.nameStaff.focus());
                          },
                        },
                        {
                          key: 'class',
                          title: t('USER_CLASS'),
                          dataIndex: 'class',
                          width: '25%',
                          render: (obj, record) =>  record.researcherClassObj.label, //record.name[this.lng],
                        },
                        {
                          key: 'position',
                          title: tofiConstants.position.name[this.lng],
                          dataIndex: 'position',
                          width: '15%',
                          render: (obj, record) =>  {return obj ? obj.value : ''}, //record.name[this.lng],
                        },
                        {
                          key: 'action',
                          title: '',
                          dataIndex: 'action',
                          width: '5%',
                          render: (text, record) => {
                            return (
                              <div className="editable-row-operations">
                                <span>
                                  <Popconfirm title={this.props.t('CONFIRM_REMOVE')} onConfirm={() => {
                                    const fd = new FormData();
                                    fd.append("cubeSConst", 'cubeUsers');
                                    fd.append("dimObjConst", 'doUsers');
                                    fd.append("objId", record.key.split('_')[1]);
                                    const hideLoading = message.loading(this.props.t('REMOVING'), 30);
                                    dObj(fd)
                                      .then(res => {
                                        hideLoading();
                                        if(res.success) {
                                          message.success(this.props.t('SUCCESSFULLY_REMOVED'));
                                          this.getCubeAct()
                                        } else {
                                          throw res
                                        }
                                      }).catch(err => {
                                      console.log(err);
                                      message.error(this.props.t('REMOVING_ERROR'))
                                    })
                                  }}>
                                    <Button title="Удалить" icon="delete" onClick={e => e.stopPropagation()} disabled={!!record.workActualStartDate} className='green-btn yellow-bg'/>
                                  </Popconfirm>
                                </span>
                              </div>
                            );
                          },
                        },
                      ]}
                    />
                    <CSSTransition
                      in={this.state.openCard}
                      timeout={300}
                      classNames="card"
                      unmountOnExit
                    >
                      <SiderCard
                        closer={<Button type='danger' onClick={this.closeCard} shape="circle" icon="arrow-right"/>}
                      >
                        <StaffCard
                          t={t}
                          tofiConstants={tofiConstants}
                          initialValues={this.state.initialValues}
                          onCreateObj={this.onCreateObj}
                          saveProps={this.saveProps}
                        />
                      </SiderCard>
                    </CSSTransition>
                  </div>
                </div>
              ) 
            },
          ]}
        />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    cubeUsers: state.cubes.cubeUsers,
    user: state.auth.user,
    tofiConstants: state.generalData.tofiConstants
  }
}

export default connect(mapStateToProps, { getCube,  })(Researchers);
