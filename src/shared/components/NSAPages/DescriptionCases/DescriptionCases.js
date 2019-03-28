import React, {Component} from 'react';
import {connect} from 'react-redux';
import Select from '../../Select';
import {Button, Input, Checkbox, InputNumber, Icon, message, Popconfirm, DatePicker, Modal} from 'antd'
import SelectVirt from "../../SelectVirt";
import {getCube, getObjByProp, getPropVal, dObj} from "../../../actions/actions";
import AntTable from '../../AntTable';
import {CUBE_FOR_AF_CASE, DO_FOR_CASE} from "../../../constants/tofiConstants";
import {parseCube_new, parseForTable} from "../../../utils/cubeParser";
import {isEmpty, isEqual} from "lodash";
import DescriptionCasesCard from './DescriptionCasesCard';
import CSSTransition from 'react-transition-group/CSSTransition';
import SiderCard from '../../SiderCard';




class DescriptionCases extends Component {

  state = {
    loading: false,
    filterLoading: {},
    filter: {
      fundmakerArchive: null,
      fundType: null,
      fundList: null,
      invList: null,
      fundsName: null,
      permCasesDbeg: {
        dbeg: null,
        dend: null,
      },
      permCasesDend: {
        dbeg: null,
        dend: null,
      }
    },
    openNewRec: false,
    openCard: false,
    openModal: true,
    tableData: [],
    selectedRow: null,
    initialValues: {},
    fundListOptions: [],
    invListOptions: [],
  };

  onChangeFundmakerArchive = (item) => {
    const {filter} = this.state;
    this.setState({
      filter: {...filter, fundmakerArchive: item, fundType: null, fundList: null, invList: null},
      fundListOptions: [],
      invListOptions: [],
      tableData: [],
    })
  };
  onChangeFundType = (item) => {
    const {filter} = this.state;
    this.setState({
      filter: {...filter, fundType: item, fundList: null, invList: null},
      fundListOptions: [],
      invListOptions: [],
      tableData: [],
    })
  };
  onChangeFundList = (item) => {
    const {filter} = this.state;
    this.setState({
      filter: {...filter, fundList: item, invList: null},
      invListOptions: [],
      tableData: [],
    })
  };
  onChangeInvList = (item) => {
    this.setState({
      filter: {...(this.state.filter), invList: item},
      tableData: []
    });
    if(item) {
      const filters = {
        filterDOAnd: [{
          dimConst: DO_FOR_CASE,
          concatType: "and",
          conds: [{
            data: {
              valueRef: {
                id: `wa_${item.value}`
              }
            }
          }]
        }]
      };
      this.setState({loading: true})
      this.props.getCube(CUBE_FOR_AF_CASE, JSON.stringify(filters))
    }
  };

  changeSelectedRow = rec => {
    if (isEmpty(this.state.selectedRow) || (!isEqual(this.state.selectedRow, rec) && !this.state.openCard)) {
      this.setState({selectedRow: rec})
    } else {
      this.setState({initialValues: rec, openCard: true, selectedRow: rec})
    }
  };


  componentDidUpdate(prevProps) {
    if(isEmpty(this.props.tofiConstants)) return;
    const {tofiConstants: {doForCase, dpForCase}} = this.props;
    if(prevProps.CubeForAF_Case !== this.props.CubeForAF_Case) {
      this.setState(
        {
          loading: false,
          tableData: parseCube_new(
            this.props.CubeForAF_Case['cube'],
            [],
            'dp',
            'do',
            this.props.CubeForAF_Case[`do_${doForCase.id}`],
            this.props.CubeForAF_Case[`dp_${dpForCase.id}`],
            `do_${doForCase.id}`,
            `dp_${dpForCase.id}`).map(this.renderTableData)
        }
      );
    }
  }

  renderTableData = (item) => {
    const constArr = ['fundmakerArchive','fundIndex','caseNumber','archiveCipher','bunchNumber','documentFile',
      'permCasesDbeg','permCasesDend','caseNumberOfPages','caseStructuralSubdivision'];

    const result = {
      key: item.id,
      name: item.name,
    };
    parseForTable(item.props, this.props.tofiConstants, result, constArr);
    return result;
  };

  loadOptionsProp = c => {
    return () => {
      if (!this.props[c + 'Options']) {
        this.setState({filterLoading: {...this.state.filterLoading, [c]: true}});
        this.props.getPropVal(c)
          .then(() => this.setState({filterLoading: {...this.state.filterLoading, [c]: false}}))
      }
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
    this.setState({
      filter: {
        ...this.state.filter,
        [e.target.dataset.name]: ''
      }
    })
  };
  onDateChange = (name, dateType) => {
    return date => {
      this.setState({search: {...this.state.search, [name]: {...this.state.search[name], [dateType]: date}}})
    }
  };

  render() {
    const {t, tofiConstants, fundmakerArchiveOptions} = this.props;
    const {openNewRec, openCard, filterLoading, filter, fundListOptions, invListOptions, tableData, loading} = this.state;

    const disabledFundmakerArchive = openCard || openNewRec;
    const disabledFundType = openCard || openNewRec || filter.fundmakerArchive === null;
    const disabledFundList = openCard || openNewRec || filter.fundmakerArchive === null || filter.fundType === null;
    const disabledInvList = openCard || openNewRec || filter.fundList === null;

    const {fundmakerArchive, fundIndex, caseNumber, archiveCipher, bunchNumber, documentFile,
      permCasesDbeg, permCasesDend, caseNumberOfPages, caseStructuralSubdivision} = tofiConstants;

    this.lng = localStorage.getItem('i18nextLng');

    return (
      <div className='Works'>
        <div className='Works__heading'>
          <div className='title'>
            <h2>{t('DESCRIPTON_CASES')}</h2>
          </div>
          <div className="table-header">
            <Button onClick={() => this.setState({openCard: true})}>{this.props.t('ADD')}</Button>
            <div className="label-select">
              <Select
                name="fundmakerArchive"
                disabled={disabledFundmakerArchive}
                isLoading={filterLoading.fundmakerArchive}
                onFocus={this.loadOptionsProp('fundmakerArchive')}
                value={filter.fundmakerArchive}
                onChange={this.onChangeFundmakerArchive}
                options={fundmakerArchiveOptions ? fundmakerArchiveOptions.map(option => ({
                  value: option.id,
                  label: option.name[this.lng]
                })) : []}
                placeholder={fundmakerArchive.name[this.lng]}
              />
            </div>
            <div className="label-select">
              <Select
                name="fundType"
                disabled={disabledFundType}
                value={filter.fundType}
                onChange={this.onChangeFundType}
                options={['fundOrg', 'fundLP', 'collectionOrg', 'collectionLP', 'jointOrg', 'jointLP']
                  .map(c => ({value: c, label: tofiConstants[c].name[this.lng]}))}
                placeholder={t('FUND_TYPE')}
              />
            </div>
            <div className="label-select" style={{flex: 1}}>
              <SelectVirt
                name="fund"
                isSearchable
                disabled={disabledFundList}
                optionHeight={40}
                isLoading={filterLoading.fundList}
                onFocus={() => {
                  this.setState({filterLoading: {...this.state.filterLoading, fundList: true}});
                  const fd = new FormData();
                  fd.append('clsConsts', filter.fundType.value);
                  fd.append('propConst', 'fundArchive');
                  fd.append('withProps', 'fundNumber, fundIndex');
                  fd.append('value', this.state.filter.fundmakerArchive.value);
                  getObjByProp(fd)
                    .then(res => {
                      if (res.success) {
                        this.setState({fundListOptions: res.data})
                      } else {
                        this.setState({fundListOptions: []})
                        throw res
                      }
                      this.setState({filterLoading: {...this.state.filterLoading, fundList: false}});
                    }).catch(err => console.log(err))
                }}
                value={filter.fundList}
                onChange={this.onChangeFundList}
                options={fundListOptions ? fundListOptions.map(option => ({
                  value: option.id,
                  label: `${option.fundNumber[this.lng]} - ${option.fundIndex[this.lng]} - ${option.name[this.lng]}`,
                })) : []}
                placeholder={t('FUND')}
              />
            </div>
            <div className="label-select">
              <SelectVirt
                name="inventory"
                isSearchable
                disabled={disabledInvList}
                optionHeight={40}
                isLoading={filterLoading.invList}
                onFocus={() => {
                  this.setState({filterLoading: {...this.state.filterLoading, invList: true}});
                  const fd = new FormData();
                  fd.append('clsConsts', 'invList');
                  fd.append('propConst', 'invFund');
                  fd.append('withProps', 'invNumber, fundFeature, invType, documentType');
                  fd.append('value', this.state.filter.fundList.value);
                  getObjByProp(fd)
                    .then(res => {
                      if (res.success) {
                        this.setState({invListOptions: res.data})
                      } else {
                        this.setState({fundListOptions: []})
                        throw res
                      }
                      this.setState({filterLoading: {...this.state.filterLoading, invList: false}});
                    }).catch(err => console.log(err))
                }}
                value={filter.invList}
                onChange={this.onChangeInvList}
                options={invListOptions ? invListOptions.map(option => ({
                  value: option.id,
                  label: `${option.invNumber[this.lng]} - ${option.name[this.lng]}`,
                  invType: option.invType,
                  documentType: option.documentType
                })) : []}
                placeholder={t('INVENTORY')}>
              </SelectVirt>
            </div>
          </div>
        </div>
        <div className='Works__body'>
          <AntTable
            columns={
              [
                {
                  key: 'caseNumber',
                  title: caseNumber.name[this.lng],
                  dataIndex: 'caseNumber',
                  width: "5%",
                  filterDropdown: (
                    <div className="custom-filter-dropdown">
                      <Input
                        name="caseNumber"
                        suffix={filter.caseNumber ?
                          <Icon type="close-circle" data-name="caseNumber" onClick={this.emitEmpty}/> : null}
                        ref={ele => this.caseNumber = ele}
                        placeholder={caseNumber.name[this.lng]}
                        value={filter.caseNumber}
                        onChange={this.onInputChange}
                      />
                    </div>
                  ),
                  filterIcon: <Icon type="filter" style={{color: filter.caseNumber ? '#ff9800' : '#aaa'}}/>,
                  onFilterDropdownVisibleChange: (visible) => {
                    this.setState({
                      filterDropdownVisible: visible,
                    }, () => this.caseNumber.focus());
                  },
                },
                {
                  key: 'fundIndex',
                  title: fundIndex.name[this.lng],
                  dataIndex: 'fundIndex',
                  width: "5%",
                  filterDropdown: (
                    <div className="custom-filter-dropdown">
                      <Input
                        name="fundIndex"
                        suffix={filter.fundIndex ?
                          <Icon type="close-circle" data-name="fundIndex" onClick={this.emitEmpty}/> : null}
                        ref={ele => this.fundIndex = ele}
                        placeholder={fundIndex.name[this.lng]}
                        value={filter.fundIndex}
                        onChange={this.onInputChange}
                      />
                    </div>
                  ),
                  filterIcon: <Icon type="filter" style={{color: filter.fundIndex ? '#ff9800' : '#aaa'}}/>,
                  onFilterDropdownVisibleChange: (visible) => {
                    this.setState({
                      filterDropdownVisible: visible,
                    }, () => this.fundIndex.focus());
                  },
                },
                {
                  key: 'archiveCipher',
                  title: archiveCipher.name[this.lng],
                  dataIndex: 'archiveCipher',
                  width: '10%'
                },
                {
                  key: 'name',
                  title: t('NAME'),
                  dataIndex: 'name',
                  render: obj => obj && obj[this.lng],
                  width: "30%",
                  filterDropdown: (
                    <div className="custom-filter-dropdown">
                      <Input
                        name="name"
                        suffix={filter.name ?
                          <Icon type="close-circle" data-name="name" onClick={this.emitEmpty}/> : null}
                        ref={ele => this.name = ele}
                        placeholder={t('NAME')}
                        value={filter.name}
                        onChange={this.onInputChange}
                      />
                    </div>
                  ),
                  filterIcon: <Icon type="filter" style={{color: filter.name ? '#ff9800' : '#aaa'}}/>,
                  onFilterDropdownVisibleChange: (visible) => {
                    this.setState({
                      filterDropdownVisible: visible,
                    }, () => this.name.focus());
                  },
                },
                {
                  key: 'permCasesDbeg',
                  title: t('DATE_BEGIN'),
                  dataIndex: 'permCasesDbeg',
                  width: '10%',
                  filterDropdown: (
                    <div className="custom-filter-dropdown">
                      <div className="flex">
                        <DatePicker
                          format="DD-MM-YYYY"
                          value={filter.permCasesDbeg.dbeg}
                          style={{marginRight: '16px'}}
                          showToday={false}
                          onChange={this.onDateChange('permCasesDbeg', 'dbeg')}
                        />
                        <DatePicker
                          format="DD-MM-YYYY"
                          value={filter.permCasesDbeg.dend}
                          showToday={false}
                          onChange={this.onDateChange('permCasesDbeg', 'dend')}
                        />
                      </div>
                    </div>
                  ),
                  filterIcon: <Icon type="filter" style={{ color: (filter.permCasesDbeg.dbeg || filter.permCasesDbeg.dend) ? '#ff9800' : '#aaa' }} />,
                  render: obj => obj && obj.format('DD-MM-YYYY')
                },
                {
                  key: 'permCasesDend',
                  title: t('DATE_END'),
                  dataIndex: 'permCasesDend',
                  width: '10%',
                  filterDropdown: (
                    <div className="custom-filter-dropdown">
                      <div className="flex">
                        <DatePicker
                          format="DD-MM-YYYY"
                          value={filter.permCasesDend.dbeg}
                          style={{marginRight: '16px'}}
                          showToday={false}
                          onChange={this.onDateChange('permCasesDend', 'dbeg')}
                        />
                        <DatePicker
                          format="DD-MM-YYYY"
                          value={filter.permCasesDend.dend}
                          showToday={false}
                          onChange={this.onDateChange('permCasesDend', 'dend')}
                        />
                      </div>
                    </div>
                  ),
                  filterIcon: <Icon type="filter" style={{ color: (filter.permCasesDend.dbeg || filter.permCasesDend.dend) ? '#ff9800' : '#aaa' }} />,
                  render: obj => obj && obj.format('DD-MM-YYYY')
                },
/*
                {
                  key: 'caseNumberOfPages',
                  title: caseNumberOfPages.name[this.lng],
                  dataIndex: 'caseNumberOfPages',
                  width: '5%',
                },
                {
                  key: 'caseStructuralSubdivision',
                  title: caseStructuralSubdivision.name[this.lng],
                  dataIndex: 'caseStructuralSubdivision',
                  width: '10%',
                  render: obj => obj && obj.label
                },
*/
                {
                  key: 'bunchNumber',
                  title: bunchNumber.name[this.lng],
                  dataIndex: 'bunchNumber',
                  width: '10%',
                },
                {
                  key: 'documentFile',
                  title: documentFile.name[this.lng],
                  dataIndex: 'documentFile',
                  width: '5%',
                  render: (arr, rec) => {
                  if(arr && arr.length && arr.some(obj => (Number(obj.kz) || Number(obj.ru) || Number(obj.en)))) {
                    return <Button
                      title={t('SHOW_FILES')}
                      icon="paper-clip"
                      className='green-btn'
                      onClick={e => {
                        e.stopPropagation();
                        this.getDocs(rec.workRegCase.value)
                          .then(docs => {
                            this.setState({openModal: true, viewerList: docs.data.map((obj) => ({name: obj.id, title: obj.name[this.lng], fileType: 'document'}))})
                        }).catch(err => {
                          if (err === 'NO_DOCS_OF_CASE') {
                            this.setState({openModal: true, viewerList: arr.map((obj, idx) => ({name: obj[this.lng], title: idx+1 + ' ' + t('PAGE')}))})
                          }
                        })
                      }}
                    />
                  }
                  return ''
                }
                },
              ]
            }
            scroll={{y: '100%'}}
            loading={loading}
            dataSource={tableData}
            changeSelectedRow={this.changeSelectedRow}
            openedBy="Works"
            />
          <CSSTransition
            in={this.state.openCard}
            timeout={300}
            classNames="card"
            unmountOnExit
            >
            <SiderCard
              closer={<Button type='danger' onClick={() => this.setState({openCard: false})} shape="circle" icon="arrow-right"/>}
              >
              <DescriptionCasesCard
                t={t}
                tofiConstants={tofiConstants}
                initialValues={this.state.initialValues}
                onCreateObj={this.onCreateObj}
                saveProps={this.saveProps}
                />
            </SiderCard>
          </CSSTransition>
        </div>
        <Modal
          visible={this.state.openModal}
          footer={<Button type="primary" onClick={() => this.setState({ openModal: false })}>OK</Button>}
          title={t('CHOISE_INVENTORY')}
        >
          <div className="label-select-modal">
            <div className = "title-select">
              {fundmakerArchive.name[this.lng] + ':'}
            </div>
            <Select
              name="fundmakerArchive"
              disabled={disabledFundmakerArchive}
              isLoading={filterLoading.fundmakerArchive}
              onFocus={this.loadOptionsProp('fundmakerArchive')}
              value={filter.fundmakerArchive}
              onChange={this.onChangeFundmakerArchive}
              options={fundmakerArchiveOptions ? fundmakerArchiveOptions.map(option => ({
                    value: option.id,
                    label: option.name[this.lng]
                  })) : []}
              placeholder={fundmakerArchive.name[this.lng]}
              />
            </div>
            <div className="label-select-modal">
              <div className = "title-select">
                {t('FUND_TYPE') + ':'}
              </div>
              <Select
                name="fundType"
                disabled={disabledFundType}
                value={filter.fundType}
                onChange={this.onChangeFundType}
                options={['fundOrg', 'fundLP', 'collectionOrg', 'collectionLP', 'jointOrg', 'jointLP']
                    .map(c => ({value: c, label: tofiConstants[c].name[this.lng]}))}
                placeholder={t('FUND_TYPE')}
                />
            </div>
            <div className="label-select-modal">
              <div className = "title-select">
                {t('FUND') + ':'}
              </div>
              <SelectVirt
                name="fund"
                isSearchable
                disabled={disabledFundList}
                optionHeight={40}
                isLoading={filterLoading.fundList}
                onFocus={() => {
                    this.setState({filterLoading: {...this.state.filterLoading, fundList: true}});
                    const fd = new FormData();
                    fd.append('clsConsts', filter.fundType.value);
                    fd.append('propConst', 'fundArchive');
                    fd.append('withProps', 'fundNumber, fundIndex');
                    fd.append('value', this.state.filter.fundmakerArchive.value);
                    getObjByProp(fd)
                      .then(res => {
                        if (res.success) {
                          this.setState({fundListOptions: res.data})
                        } else {
                          this.setState({fundListOptions: []})
                          throw res
                        }
                        this.setState({filterLoading: {...this.state.filterLoading, fundList: false}});
                      }).catch(err => console.log(err))
                  }}
                value={filter.fundList}
                onChange={this.onChangeFundList}
                options={fundListOptions ? fundListOptions.map(option => ({
                    value: option.id,
                    label: `${option.fundNumber[this.lng]} - ${option.fundIndex[this.lng]} - ${option.name[this.lng]}`,
                  })) : []}
                placeholder={t('FUND')}
              />
            </div>
            <div className="label-select-modal">
              <div className = "title-select">
                {t('INVENTORY') + ':'}
              </div>
              <SelectVirt
                name="inventopy"
                isSearchable
                disabled={disabledInvList}
                optionHeight={40}
                isLoading={filterLoading.invList}
                onFocus={() => {
                  this.setState({filterLoading: {...this.state.filterLoading, invList: true}});
                  const fd = new FormData();
                  fd.append('clsConsts', 'invList');
                  fd.append('propConst', 'invFund');
                  fd.append('withProps', 'invNumber, fundFeature, invType, documentType');
                  fd.append('value', this.state.filter.fundList.value);
                  getObjByProp(fd)
                    .then(res => {
                      if (res.success) {
                        this.setState({invListOptions: res.data})
                      } else {
                        this.setState({fundListOptions: []})
                        throw res
                      }
                      this.setState({filterLoading: {...this.state.filterLoading, invList: false}});
                    }).catch(err => console.log(err))
                }}
                value={filter.invList}
                onChange={this.onChangeInvList}
                options={invListOptions ? invListOptions.map(option => ({
                  value: option.id,
                  label: `${option.invNumber[this.lng]} - ${option.name[this.lng]}`,
                  invType: option.invType,
                  documentType: option.documentType
                })) : []}
                placeholder={t('INVENTORY')} />
              </div>
        </Modal>
      </div>
    )
  }

}

const mapStateToProps = (state) => {
  return {
    CubeForAF_Case: state.cubes.CubeForAF_Case,
    fundmakerArchiveOptions: state.generalData.fundmakerArchive
  }
};

export default connect(mapStateToProps, {getPropVal, getCube})(DescriptionCases)
