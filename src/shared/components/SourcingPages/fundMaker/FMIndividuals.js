import React from 'react';
import {Button, Icon, Input, message, Popconfirm} from 'antd';
import CSSTransition from 'react-transition-group/CSSTransition'
import Select from '../../Select';

import AntTable from '../../AntTable';
import {isEmpty, isEqual, map} from 'lodash';
import SiderCard_FMIndividuals from './SiderCard_FMIndividuals';
import moment from 'moment';
import {getPropMeta, onSaveCubeData, parseCube_new} from '../../../utils/cubeParser';
import {createObj, dFundMaker, dObj, getCube, getPropVal, insPropVal, updateCubeData} from '../../../actions/actions';
import {
  CUBE_FOR_FUND_AND_IK, CUBE_FOR_LP_FUNDMAKER, PERSON_ACADEMIC_DEGREE, PERSON_ACADEMIC_TITLE, PERSON_SPECIALTY
} from '../../../constants/tofiConstants';
import {connect} from 'react-redux';

/*eslint eqeqeq:0*/
class FMIndividuals extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      openCard: false,
      loading: false,
      search: '',
      filter: {
        personList: '',
        personAcademicDegree: [],
        personAcademicDegreeLoading: false,
        personAcademicTitle: [],
        personAcademicTitleLoading: false,
        personSpecialty: [],
        personSpecialtyLoading: false
      },
      selectedRow: null,
      initialValues: {dateOfBirth: moment()}
    }
  }

  changeSelectedRow = rec => {
    if(isEmpty(this.state.selectedRow) || (!isEqual(this.state.selectedRow, rec) && !this.state.openCard)){
      this.setState({ selectedRow: rec })
    } else {
      const initialValues = {
        ...rec,
        personLastName: rec.personLastNameObj,
        personName: rec.personNameObj,
        personPatronymic: rec.personPatronymicObj,
        dateOfBirth: rec.dateOfBirthObj,
        dateOfDeath: rec.dateOfDeathObj,
        personAddress: rec.personAddressObj,
        ownerLastName: rec.ownerLastNameObj,
        ownerName: rec.ownerNameObj,
        ownerPatronymic: rec.ownerPatronymicObj,
        ownerStatus: rec.ownerStatusObj,
        ownerAddress: rec.ownerAddressObj,
      };
      this.setState({ initialValues, openCard: true, selectedRow: rec })
    }
  };

  getFmCube = async () => {
    this.setState({ loading: true });
    await this.props.getCube(CUBE_FOR_LP_FUNDMAKER);
    this.setState({ loading: false });
  };

  componentDidMount() {
    if(isEmpty(this.props.tofiConstants) || !this.props.cubeForLPFundmaker) return;
    const { doForLPFundmakers, dpForLPFundmakers } = this.props.tofiConstants;
    this.setState(
      {
        loading: false,
        data: parseCube_new(
              this.props.cubeForLPFundmaker['cube'],
              [],
              'dp',
              'do',
              this.props.cubeForLPFundmaker[`do_${doForLPFundmakers.id}`],
              this.props.cubeForLPFundmaker[`dp_${dpForLPFundmakers.id}`],
              `do_${doForLPFundmakers.id}`, `dp_${dpForLPFundmakers.id}`)
      }
    )
  }

  componentWillReceiveProps(nextProps) {
    if(!isEmpty(nextProps.cubeForLPFundmaker) && !isEmpty(nextProps.tofiConstants) && this.props.cubeForLPFundmaker !== nextProps.cubeForLPFundmaker) {
      const { doForLPFundmakers, dpForLPFundmakers } = nextProps.tofiConstants;
      this.setState(
        {
          loading: false,
          data: parseCube_new(nextProps.cubeForLPFundmaker['cube'], [], 'dp', 'do', nextProps.cubeForLPFundmaker[`do_${doForLPFundmakers.id}`], nextProps.cubeForLPFundmaker[`dp_${dpForLPFundmakers.id}`], `do_${doForLPFundmakers.id}`, `dp_${dpForLPFundmakers.id}`)
        }
      );
    } else {
      this.setState({ loading: false });
    }
  }

  onPersonAcademicDegreeChange = s => {this.setState({filter: {...this.state.filter, personAcademicDegree: s}})};
  onPersonAcademicTitleChange = s => {this.setState({filter: {...this.state.filter, personAcademicTitle: s}})};
  onPersonSpecialtyChange = s => {this.setState({filter: {...this.state.filter, personSpecialty: s}})};

  onCreateObj = async ({cube, obj}, v) => {
    let hideCreateObj;
    try {
      const objIK = {...obj, clsConst: 'sourceLPList'};
      hideCreateObj = message.loading(this.props.t('CREATING_NEW_OBJECT'), 30);
      //Making two parallel request to create obj;
      const [resFM, resIK] = await Promise.all(
        [
          createObj({cubeSConst: CUBE_FOR_LP_FUNDMAKER}, obj),
          createObj({ cubeSConst: CUBE_FOR_FUND_AND_IK }, objIK)
        ]
      );
      hideCreateObj();
      if(!resFM.success) {
        resFM.errors.forEach(err => {
          message.error(err.text)
        });
        return Promise.reject(resFM);
      }
      if(!resIK.success) {
        resIK.errors.forEach(err => {
          message.error(err.text)
        });
        return Promise.reject(resIK);
      }
      // Capture newly created obj to be able to find it later
      this.newObj = resFM.data.idItemDO;
      // Saving IK prop separately, because of lack of IK cube here
      const datas = [{
        own: [{doConst: 'doForFundAndIK', doItem: resIK.data.idItemDO, isRel: "0", objData: {}}],
        props: [{propConst: 'fundmakerOfIK', val: resFM.data.idItemDO.split('_')[1], typeProp: '41', periodDepend: "0", isUniq: '1'}],
        periods: [{ periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31' }]
      }];
      updateCubeData(CUBE_FOR_FUND_AND_IK, this.props.globalDate.format('YYYY-MM-DD'), JSON.stringify(datas));
      obj.doItem = resFM.data.idItemDO;
      return this.saveProps(
        {cube, obj},
        v,
        this.props.tofiConstants
      );
    }
    catch (e) {
      typeof hideCreateObj === 'function' && hideCreateObj();
      console.warn(e);
    }
  };

  saveProps = async (c, v, t, objData) => {
    let hideLoading;
    try {
      c.cube.data = this.props.cubeForLPFundmaker;
      hideLoading = message.loading(this.props.t('UPDATING_PROPS'), 0);
      const resSaveFM = await onSaveCubeData(c, v, t, objData);
      hideLoading();
      if(!resSaveFM.success) {
        message.error(this.props.t('PROPS_UPDATING_ERROR'));
        resSaveFM.errors.forEach(err => {
          message.error(err.text)
        });
        return Promise.reject(resSaveFM);
      }
      message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'));
      this.setState({loading: true, openCard: false});
      await this.props.getCube(CUBE_FOR_LP_FUNDMAKER);
      this.setState({ loading: false });
      return resSaveFM;
    }
    catch (e) {
      typeof hideLoading === 'function' && hideLoading();
      this.setState({ loading: false });
      console.warn(e);
    }
  };

  remove = key => {
    const newData = this.state.data.filter(item => item.key !== key);
    this.setState({ data: newData });
  };
  renderTableData = (item, idx) => {
    const { personLastName, personName, personPatronymic,
      dateOfBirth, dateOfDeath, personAcademicDegree, personAcademicTitle, personSpecialty, personAddress, personPhone, personEmail,
      ownerLastName, ownerName, ownerPatronymic, ownerStatus, ownerAddress, ownerPhone, ownerEmail,
      personLaborBeginYear, personLaborEndYear, personLaborPosition, personLaborOrg, personLaborActivity} = this.props.tofiConstants;
    const personLastNameObj = item.props.find(element => element.prop == personLastName.id),
      personNameObj = item.props.find(element => element.prop == personName.id),
      personPatronymicObj = item.props.find(element => element.prop == personPatronymic.id),
      dateOfBirthObj = item.props.find(element => element.prop == dateOfBirth.id),
      dateOfDeathObj = item.props.find(element => element.prop == dateOfDeath.id),
      personAcademicDegreeObj = item.props.find(element => element.prop == personAcademicDegree.id),
      personAcademicTitleObj = item.props.find(element => element.prop == personAcademicTitle.id),
      personSpecialtyObj = item.props.find(element => element.prop == personSpecialty.id),
      personAddressObj = item.props.find(element => element.prop == personAddress.id),
      personPhoneObj = item.props.find(element => element.prop == personPhone.id),
      personEmailObj = item.props.find(element => element.prop == personEmail.id),
      ownerLastNameObj = item.props.find(element => element.prop == ownerLastName.id),
      ownerNameObj = item.props.find(element => element.prop == ownerName.id),
      ownerPatronymicObj = item.props.find(element => element.prop == ownerPatronymic.id),
      ownerStatusObj = item.props.find(element => element.prop == ownerStatus.id),
      ownerAddressObj = item.props.find(element => element.prop == ownerAddress.id),
      ownerPhoneObj = item.props.find(element => element.prop == ownerPhone.id),
      ownerEmailObj = item.props.find(element => element.prop == ownerEmail.id),
      personLaborBeginYearObj = item.props.find(element => element.prop == personLaborBeginYear.id),
      personLaborEndYearObj = item.props.find(element => element.prop == personLaborEndYear.id),
      personLaborPositionObj = item.props.find(element => element.prop == personLaborPosition.id),
      personLaborOrgObj = item.props.find(element => element.prop == personLaborOrg.id),
      personLaborActivityObj = item.props.find(element => element.prop == personLaborActivity.id);

    const accessLevelObj = this.props.accessLevelOptions.find(al => al.id === item.accessLevel);

    return {
      key: item.id,
      numb: idx + 1,
      accessLevel: accessLevelObj && {value: accessLevelObj.id, label: accessLevelObj.name[this.lng]},
      personList: !!item.name ? item.name : {kz: '', ru: '', en: ''},
      personLastNameObj: !!personLastNameObj ? personLastNameObj.valueLng || '' : '',
      personNameObj: !!personNameObj ? personNameObj.valueLng || '' : '',
      personPatronymicObj: !!personPatronymicObj ? personPatronymicObj.valueLng || '' : '',
      dateOfBirthObj: !!dateOfBirthObj && dateOfBirthObj.value ? moment(dateOfBirthObj.value, 'DD-MM-YYYY') : null,
      dateOfDeathObj: !!dateOfDeathObj && dateOfDeathObj.value ? moment(dateOfDeathObj.value, 'DD-MM-YYYY') : null,
      personAcademicDegree: !!personAcademicDegreeObj && personAcademicDegreeObj.refId ? {value: personAcademicDegreeObj.refId, label: personAcademicDegreeObj.value} : null,
      personAcademicTitle: !!personAcademicTitleObj && personAcademicTitleObj.refId ? {value: personAcademicTitleObj.refId, label: personAcademicTitleObj.value} : null,
      personSpecialty: !!personSpecialtyObj && personSpecialtyObj.values ? personSpecialtyObj.values : [],
      personAddressObj: !!personAddressObj ? personAddressObj.valueLng || '' : '',
      personPhone: !!personPhoneObj ? personPhoneObj.value || '' : '',
      personEmail: !!personEmailObj ? personEmailObj.value || '' : '',
      ownerLastNameObj: !!ownerLastNameObj ? ownerLastNameObj.valueLng || '' : '',
      ownerNameObj: !!ownerNameObj ? ownerNameObj.valueLng || '' : '',
      ownerPatronymicObj: !!ownerPatronymicObj ? ownerPatronymicObj.valueLng || '' : '',
      ownerStatusObj: !!ownerStatusObj ? ownerStatusObj.refId || '' : '',
      ownerAddressObj: !!ownerAddressObj ? ownerAddressObj.valueLng || '' : '',
      ownerPhone: !!ownerPhoneObj ? ownerPhoneObj.value || '' : '',
      ownerEmail: !!ownerEmailObj ? ownerEmailObj.value || '' : '',
      personLaborBeginYear: personLaborBeginYearObj && personLaborBeginYearObj.complexChildValues ? personLaborBeginYearObj.complexChildValues : {},
      personLaborEndYear: personLaborEndYearObj && personLaborEndYearObj.complexChildValues ? personLaborEndYearObj.complexChildValues : {},
      personLaborPosition: personLaborPositionObj && personLaborPositionObj.complexChildValues ? personLaborPositionObj.complexChildValues : {},
      personLaborOrg: personLaborOrgObj && personLaborOrgObj.complexChildValues ? personLaborOrgObj.complexChildValues : {},
      personLaborActivity: personLaborActivityObj && personLaborActivityObj.values ? personLaborActivityObj.values : []
    }
  };

  loadOptions = c => {
    return () => {
      if(!this.props[c + 'Options']) {
        this.setState({filter: {...this.state.filter, [c+'Loading']: true}});
        this.props.getPropVal(c)
          .then(() => this.setState({filter: {...this.state.filter, [c+'Loading']: false}}));
      }
    }
  };

  openCard = () => {
    const accessLevelObj = this.props.accessLevelOptions.find(al => al.id === 1);
    this.setState({ openCard: true, initialValues: {accessLevel: {value: accessLevelObj.id, label: accessLevelObj.name[this.lng]}} })
  };

  closeCard = () => {
    this.setState({ openCard: false })
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

  render() {
    const { t, tofiConstants, personAcademicDegreeOptions, personAcademicTitleOptions, personSpecialtyOptions } = this.props;
    const { filter, data } = this.state;
    if(isEmpty(tofiConstants)) return null;
    this.lng = localStorage.getItem('i18nextLng');

    this.filteredData = data.map(this.renderTableData).filter(item => {
      return (
        item.personList[this.lng].toLowerCase().includes(filter.personList.toLowerCase()) &&
        ( filter.personAcademicDegree.length === 0  || filter.personAcademicDegree.some(p => item.personAcademicDegree && p.value == item.personAcademicDegree.value) ) &&
        ( filter.personAcademicTitle.length === 0  || filter.personAcademicTitle.some(p => item.personAcademicTitle && p.value == item.personAcademicTitle.value) ) &&
        ( filter.personSpecialty.length === 0  || filter.personSpecialty.some(p => item.personSpecialty.some(v => v.value == p.value) ))
      )
    });

    return (
      <div className="FMIndividuals">
        <div className="FMIndividuals__heading">
          <div className="table-header">
            <div className="table-header-btns">
              <Button onClick={this.openCard}>{t('ADD')}</Button>
            </div>
            <div className="label-select">
              <Select
                name="personAcademicDegree"
                isMulti
                isSearchable={false}
                value={filter.personAcademicDegree}
                onChange={this.onPersonAcademicDegreeChange}
                onMenuOpen={this.loadOptions(PERSON_ACADEMIC_DEGREE)}
                isLoading={filter.personAcademicDegreeLoading}
                options={personAcademicDegreeOptions ? personAcademicDegreeOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
                placeholder={t('PERSON_ACADEMIC_DEGREE')}
              />
            </div>
            <div className="label-select">
              <Select
                name="personAcademicTitle"
                isMulti
                isSearchable={false}
                value={filter.personAcademicTitle}
                onChange={this.onPersonAcademicTitleChange}
                onMenuOpen={this.loadOptions(PERSON_ACADEMIC_TITLE)}
                isLoading={filter.personAcademicTitleLoading}
                options={personAcademicTitleOptions ? personAcademicTitleOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
                placeholder={t('PERSON_ACADEMIC_TITLE')}
              />
            </div>
            <div className="label-select">
              <Select
                name="personSpecialty"
                isMulti
                isSearchable={false}
                value={filter.personSpecialty}
                onChange={this.onPersonSpecialtyChange}
                onMenuOpen={this.loadOptions(PERSON_SPECIALTY)}
                isLoading={filter.personSpecialtyLoading}
                options={personSpecialtyOptions ? personSpecialtyOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
                placeholder={t('PERSON_SPECIALTY')}
              />
            </div>
          </div>
        </div>
        <div className="FMIndividuals__body">
          <AntTable
            loading={this.state.loading}
            columns={[
              {
                key: 'numb',
                title: '№',
                dataIndex: 'numb',
                width: '10%'
              },
              {
                key: 'personList',
                title: t('NAME'),
                dataIndex: 'personList',
                width: '87%',
                filterDropdown: (
                  <div className="custom-filter-dropdown">
                    <Input
                      name="personList"
                      suffix={filter.personList ? <Icon type="close-circle" data-name="personList" onClick={this.emitEmpty} /> : null}
                      ref={ele => this.personList = ele}
                      placeholder="Поиск"
                      value={filter.personList}
                      onChange={this.onInputChange}
                    />
                  </div>
                ),
                filterIcon: <Icon type="filter" style={{ color: filter.personList ? '#ff9800' : '#aaa' }} />,
                onFilterDropdownVisibleChange: (visible) => {
                  this.setState({
                    filterDropdownVisible: visible,
                  }, () => this.personList.focus());
                },
                render: obj => obj[this.lng]
              },
              {
                key: 'action',
                title: '',
                dataIndex: '',
                width: '3%',
                render: (text, record) => {
                  return (
                    <div className="editable-row-operations">
                      <Popconfirm title={this.props.t('CONFIRM_REMOVE')} onConfirm={() => {
                        const hideLoading = message.loading(this.props.t('REMOVING'), 30);
                        dFundMaker(record.key.split('_')[1])
                          .then(res => {
                            hideLoading();
                            if(res.success) {
                              message.success(this.props.t('SUCCESSFULLY_REMOVED'));
                              this.remove(record.key)
                            } else {
                              throw res
                            }
                          }).catch(err => {
                          hideLoading();
                          console.error(err);
                          if(err.funds) {
                            err.funds.forEach(err => message.error(`${t('EXISTS_FUND_1')} ${err.name[this.lng]} ${t('EXISTS_FUND_2')}`, 8))
                          } else {
                            message.error(this.props.t('REMOVING_ERROR'))
                          }
                        })
                      }}>
                        <a style={{color: '#f14c34', marginLeft: '10px', fontSize: '14px'}} onClick={e => e.stopPropagation()}><Icon type="delete" className="editable-cell-icon"/></a>
                      </Popconfirm>
                    </div>
                  );
                },
              }
            ]}
            dataSource={this.filteredData}
            changeSelectedRow={this.changeSelectedRow}
            openedBy="FMIndividuals"
          />
          <CSSTransition
            in={this.state.openCard}
            timeout={300}
            classNames="card"
            unmountOnExit
          >
            <SiderCard_FMIndividuals
              t={t}
              tofiConstants={tofiConstants}
              initialValues={this.state.initialValues}
              getFmCube={this.getFmCube}
              closer={<Button type='danger' onClick={this.closeCard} shape="circle" icon="arrow-right"/>}
              saveProps={this.saveProps}
              onCreateObj={this.onCreateObj}
              cubeForLPFundmaker={this.props.cubeForLPFundmaker}
              recKey={this.state.selectedRow ? this.state.selectedRow.key : ''}
            />
          </CSSTransition>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    personAcademicDegreeOptions: state.generalData[PERSON_ACADEMIC_DEGREE],
    personAcademicTitleOptions: state.generalData[PERSON_ACADEMIC_TITLE],
    personSpecialtyOptions: state.generalData[PERSON_SPECIALTY],
    accessLevelOptions: state.generalData.accessLevel
  }
}

export default connect(mapStateToProps, { getPropVal, getCube })(FMIndividuals);