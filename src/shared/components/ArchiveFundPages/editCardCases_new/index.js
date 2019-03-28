import React from 'react'
import {Button, Icon, Input, message, Modal} from 'antd';
import {connect} from 'react-redux';
import {isEmpty, isEqual, map} from "lodash";
import {CSSTransition} from "react-transition-group";

import {getCube, getObjListNew, getPropVal} from '../../../actions/actions';
import {onSaveCubeData, parseCube_new, parseForTable} from '../../../utils/cubeParser';
import {
  CUBE_FOR_AF_CASE,
  DO_FOR_CASE,
  DP_FOR_CASE
} from "../../../constants/tofiConstants";
import Select from "../../Select";
import DPickerTOFI from '../../DPickerTOFI';
import CardCase_invTypePerm_urpDoc from "./invTypePerm_urpDoc/CardCase_invTypePerm_urpDoc";
import CardCase_invTypeLS_LSDoc from "./invTypeLS_LSDoc/CardCase_invTypeLS_LSDoc";
import CardCase_invTypePerm_uprNTD from "./invTypePerm_uprNTD/CardCase_invTypePerm_uprNTD";
import CardCase_invTypePhoto_photoDoc from "./invTypePhoto_photoDoc/CardCase_invTypePhoto_photoDoc";
import CardCase_invTypePhonoMag_phonoDoc from "./invTypePhonoMag_phonoDoc/CardCase_invTypePhonoMag_phonoDoc";
import CardCase_invTypePhonoGram_phonoDoc from "./invTypePhonoGram_phonoDoc/CardCase_invTypePhonoGram_phonoDoc";
import CardCase_invTypeVideo_videoDoc from "./invTypeVideo_videoDoc/CardCase_invTypeVideo_videoDoc";
import CardCase_invTypeMovie_movieDoc from "./invTypeMovie_movieDoc/CardCase_invTypeMovie_movieDoc";
import CardCase_invTypeDigital_uprDoc from "./invTypeDigital_uprDoc/CardCase_invTypeDigital_uprDoc";
import CardCase_invTypeAlbum_photoDoc from "./invTypeAlbum_photoDoc/CardCase_invTypeAlbum_photoDoc";
import SiderCard from "../../SiderCard";
import AntTable from "../../AntTable";
import {Link} from "react-router-dom";
import Viewer from "../../Viewer";

/*eslint eqeqeq:0*/
class EditCardCases extends React.Component {

  state = {
    data: [],
    loading: false,
    openCard: false,
    openModal: false,
    viewerList: [],
    structuralSubdivisionList: [],
    structuralSubdivisionListLoading: false,
    fundFeature: [],
    fundFeatureLoading: false,
    selectedRow: {},
    filter: {
      name: '',
      fundNumber: '',
      caseDbeg: {
        dbeg: null,
        dend: null
      },
      caseDend: {
        dbeg: null,
        dend: null
      }
    }
  };

  componentDidMount() {
    this.getCubeAct();
  }

  getCubeAct = () => {
    const filters = {
      filterDOAnd: [
        {
          dimConst: DO_FOR_CASE,
          concatType: "and",
          conds: [
            {
              //ids: '1007_144376'
              data: {
                valueRef: {
                  id: this.props.match.params.idInventCard
                }
              }
            }
          ]
        }
      ]
    };
    this.setState({loading: true});
    this.props.getCube(CUBE_FOR_AF_CASE, JSON.stringify(filters))
      .then(() => this.setState({loading: false}))
      .catch(err => {
        console.error(err);
        this.setState({loading: false})
      })
  }

  componentWillReceiveProps(nextProps) {
    if (isEmpty(this.props.tofiConstants)) return;
    if (this.props.CubeForAF_Case !== nextProps.CubeForAF_Case) {
      const {doForCase, dpForCase} = nextProps.tofiConstants;
      this.setState(
        {
          loading: false,
          data: parseCube_new(
            nextProps.CubeForAF_Case['cube'],
            [],
            'dp',
            'do',
            nextProps.CubeForAF_Case[`do_${doForCase.id}`],
            nextProps.CubeForAF_Case[`dp_${dpForCase.id}`],
            `do_${doForCase.id}`, `dp_${dpForCase.id}`).map(this.renderTableData)
        }
      );
    }
  }

  renderTableData = item => {
    const constArr = ['fundNumber', 'fundIndex', 'caseDbeg', 'caseDend', 'caseStructuralSubdivision', 'caseNotes', 'documentFile'];
    const result = {
      key: item.id,
      name: item.name
    };
    parseForTable(item.props, this.props.tofiConstants, result, constArr);
    return result;
  };

  onSelectChange = c => s => this.setState({[c]: s});
  changeSelectedRow = rec => {
    if (isEmpty(this.state.selectedRow) || !isEqual(this.state.selectedRow, rec)) {
      this.setState({selectedRow: rec});
    } else {
      this.setState({
        openCard: true,
        selectedRow: rec
      })
    }
  };

  renderTableFooter = () => {
    const {t} = this.props;
    return (
      <div className="table-footer">
        <div className="data-length">
          <div className="label"><label htmlFor="">{t('COUNT_ITOG')}</label><Input
            size='small' type="text" readOnly
            value={this.filteredData.length + ' / ' + this.state.data.length}/></div>
        </div>
      </div>

    )
  };


  loadOptions = c => {
    return () => {
      if (!this.props[c + 'Options']) {
        this.setState({[c + 'Loading']: true});
        this.props.getPropVal(c)
          .then(() => this.setState({[c + 'Loading']: false}))
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
  onDateChange = (name, dateType) => {
    return date => {
      this.setState({filter: {...this.state.filter, [name]: {...this.state.filter[name], [dateType]: date}}})
    }
  };
  emitEmpty = e => {
    this.setState({
      filter: {
        ...this.state.filter,
        [e.target.dataset.name]: ''
      }
    })
  };
  saveProps = async (c, v, t = this.props.tofiConstants, objData) => {
    let hideLoading;
    try {
      if (!c.cube) c.cube = {
        cubeSConst: CUBE_FOR_AF_CASE,
        doConst: DO_FOR_CASE,
        dpConst: DP_FOR_CASE,
      };
      if (!c.cube.data) c.cube.data = this.props.CubeForAF_Case;
      hideLoading = message.loading(this.props.t('UPDATING_PROPS'), 0);
      const resSave = await onSaveCubeData(c, v, t, objData);
      hideLoading();
      if (!resSave.success) {
        message.error(this.props.t('PROPS_UPDATING_ERROR'));
        resSave.errors.forEach(err => {
          message.error(err.text)
        });
        return Promise.reject(resSave);
      }
      message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'));
      /*this.setState({loading: true, openCard: false});
       await this.getCubeAct();*/
      return resSave;
    }
    catch (e) {
      typeof hideLoading === 'function' && hideLoading();
      this.setState({loading: false});
      console.warn(e);
    }
  };

  getRespCard(invType, docType) {
    const {
      invTypePerm,
      uprDoc,
      uprNTD,
      invTypeVideo,
      videoDoc,
      invTypeDigital,
      invTypeLS,
      invTypeAlbum,
      LSDoc,
      invTypePhoto,
      photoDoc,
      invTypePhonoGram,
      phonoDoc,
      invTypeMovie,
      movieDoc,
      invTypePhonoMag
    } = this.props.tofiConstants;
    const params = {
      t: this.props.t,
      saveProps: this.saveProps,
      initialValues: this.state.selectedRow,
      tofiConstants: this.props.tofiConstants
    };
    switch (true) {
      case invType == invTypePerm.id && docType == uprDoc.id:
        return <CardCase_invTypePerm_urpDoc {...params} />;
      case invType == invTypePerm.id && docType == uprNTD.id:
        return <CardCase_invTypePerm_uprNTD {...params} />;
      case invType == invTypeVideo.id && docType == videoDoc.id:
        return <CardCase_invTypeVideo_videoDoc {...params} />;
      case invType == invTypeMovie.id && docType == movieDoc.id:
        return <CardCase_invTypeMovie_movieDoc {...params} />;
      case invType == invTypePhonoGram.id && docType == phonoDoc.id:
        return <CardCase_invTypePhonoGram_phonoDoc {...params} />;
      case invType == invTypePhonoMag.id && docType == phonoDoc.id:
        return <CardCase_invTypePhonoMag_phonoDoc {...params} />;
      case invType == invTypeAlbum.id && docType == photoDoc.id:
        return <CardCase_invTypeAlbum_photoDoc {...params} />;
      case invType == invTypePhoto.id && docType == photoDoc.id:
        return <CardCase_invTypePhoto_photoDoc {...params} />;
      case invType == invTypeDigital.id && docType == uprDoc.id:
        return <CardCase_invTypeDigital_uprDoc {...params} />;
      case invType == invTypeLS.id && docType == LSDoc.id:
        return <CardCase_invTypeLS_LSDoc {...params} />;
      default:
        return null;
    }
  }

  render() {
    if (isEmpty(this.props.tofiConstants)) return null;
    const {
      t, fundFeatureOptions, tofiConstants: {
        structuralSubdivisionList, fundFeature, documentFile,
        fundNumber, fundIndex, caseDbeg, caseDend, caseNotes, caseStructuralSubdivision
      }
    } = this.props;
    const {structuralSubdivisionListOptions, filter, data, selectedRow} = this.state;
    this.lng = localStorage.getItem('i18nextLng');

    this.filteredData = data.filter(item => {
      return (
        item.name[this.lng].toLowerCase().includes(filter.name.toLowerCase()) &&
        item.fundNumber.toLowerCase().includes(filter.fundNumber.toLowerCase()) &&
        ( !filter.caseDbeg.dbeg || item.caseDbeg.isSameOrAfter(filter.caseDbeg.dbeg, 'day') ) &&
        ( !filter.caseDbeg.dend || item.caseDbeg.isSameOrBefore(filter.caseDbeg.dend, 'day') ) &&
        ( !filter.caseDend.dbeg || item.caseDend.isSameOrAfter(filter.caseDend.dbeg, 'day') ) &&
        ( !filter.caseDend.dend || item.caseDend.isSameOrBefore(filter.caseDend.dend, 'day') )
      )
    });

    return (
      <div className="EditCardCases">
        <div className="table-header">
          <Button icon="printer">{t('REPORTS')}</Button>
          <Link to={{
            pathname: `/archiveFund/editFundCard/${this.props.match.params.idFundCard}/${this.props.match.params.idInventCard}/${selectedRow.key}`,
            state: {
              ...this.props.location.state,
              cases: {
                key: selectedRow.key,
                name: selectedRow.name,
              },
              title: t('DOCUMENTS')
            }
          }}>
            <Button disabled={isEmpty(selectedRow) || !selectedRow.key}>{t('DOCUMENTS')}</Button>
          </Link>
          <div className="label-select">
            <Select
              name="structuralSubdivisionList"
              isMulti
              isSearchable={false}
              value={this.state.structuralSubdivisionList}
              onChange={this.onSelectChange('structuralSubdivisionList')}
              isLoading={this.state.structuralSubdivisionListLoading}
              options={structuralSubdivisionListOptions ? structuralSubdivisionListOptions.map(option => ({
                value: option.id,
                label: option.name[this.lng]
              })) : []}
              placeholder={structuralSubdivisionList.name[this.lng]}
              onFocus={async () => {
                if (this.state.structuralSubdivisionList) {
                  this.setState({structuralSubdivisionListLoading: true});
                  const fd = new FormData();
                  fd.append('parent', this.props.location.state.inv.key.split('_')[1]);
                  fd.append('clsConsts', 'structuralSubdivisionList');
                  const res = await getObjListNew(fd);
                  if (!res.success) {
                    res.errors.forEach(err => {
                      message.error(err.text);
                      return this.setState({loading: false})
                    })
                  }
                  this.setState({structuralSubdivisionListLoading: false, structuralSubdivisionListOptions: res.data})
                }
              }}
            />
          </div>
          <div className="label-select">
            <Select
              name="fundFeature"
              isMulti
              isSearchable={false}
              value={this.state.fundFeature}
              onChange={this.onSelectChange('fundFeature')}
              isLoading={this.state.fundFeatureLoading}
              options={fundFeatureOptions ? fundFeatureOptions.map(option => ({
                value: option.id,
                label: option.name[this.lng]
              })) : []}
              placeholder={fundFeature.name[this.lng]}
              onFocus={this.loadOptions(['fundFeature'])}
            />
          </div>
        </div>
        <div className="EditCardCases__body">
          <AntTable
            columns={[
              {
                key: 'fundNumber',
                title: t("CASE_NUMB"),
                dataIndex: 'fundNumber',
                width: '10%',

                sorter: (a, b) => ((a.fundNumber).replace(/[^0-9]/g, '')) - ((b.fundNumber).replace(/[^0-9]/g, '')),
                filterDropdown: (
                  <div className="custom-filter-dropdown">
                    <Input
                      name="fundNumber"
                      suffix={filter.fundNumber ?
                        <Icon type="close-circle" data-name="fundNumber" onClick={this.emitEmpty}/> : null}
                      ref={ele => this.fundNumber = ele}
                      placeholder="Поиск"
                      value={filter.fundNumber}
                      onChange={this.onInputChange}
                    />
                  </div>
                ),
                filterIcon: <Icon type="filter" style={{color: filter.fundNumber ? '#ff9800' : '#aaa'}}/>,
                onFilterDropdownVisibleChange: (visible) => {
                  this.setState({
                    filterDropdownVisible: visible,
                  }, () => this.fundNumber.focus());
                },
              },
              {
                key: 'fundIndex',
                title: fundIndex.name[this.lng],
                dataIndex: 'fundIndex',
                width: '9%'
              },
              {
                key: 'name',
                title: t('CASE_NAME'),
                dataIndex: 'name',
                width: '25%',
                filterDropdown: (
                  <div className="custom-filter-dropdown">
                    <Input
                      name="name"
                      suffix={filter.name ?
                        <Icon type="close-circle" data-name="name" onClick={this.emitEmpty}/> : null}
                      ref={ele => this.name = ele}
                      placeholder="Поиск"
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
                render: obj => obj && obj[this.lng]
              },
              {
                key: 'caseDbeg',
                title: caseDbeg.name[this.lng],
                dataIndex: 'caseDbeg',
                width: '9%',
                filterDropdown: (
                  <div className="custom-filter-dropdown">
                    <div className="flex">
                      <DPickerTOFI
                        format="DD-MM-YYYY"
                        value={this.state.filter.caseDbeg.dbeg}
                        style={{marginRight: '16px'}}
                        showToday={false}
                        onChange={this.onDateChange('caseDbeg', 'dbeg')}
                      />
                      <DPickerTOFI
                        format="DD-MM-YYYY"
                        value={this.state.filter.caseDbeg.dend}
                        showToday={false}
                        onChange={this.onDateChange('caseDbeg', 'dend')}
                      />
                    </div>
                  </div>
                ),
                filterIcon: <Icon type="filter"
                                  style={{color: (filter.caseDbeg.dbeg || filter.caseDbeg.dend) ? '#ff9800' : '#aaa'}}/>,
                render: obj => obj && obj.format('DD-MM-YYYY')
              },
              {
                key: 'caseDend',
                title: caseDend.name[this.lng],
                dataIndex: 'caseDend',
                width: '9%',
                filterDropdown: (
                  <div className="custom-filter-dropdown">
                    <div className="flex">
                      <DPickerTOFI
                        format="DD-MM-YYYY"
                        value={this.state.filter.caseDend.dbeg}
                        style={{marginRight: '16px'}}
                        showToday={false}
                        onChange={this.onDateChange('caseDend', 'dbeg')}
                      />
                      <DPickerTOFI
                        format="DD-MM-YYYY"
                        value={this.state.filter.caseDend.dend}
                        showToday={false}
                        onChange={this.onDateChange('caseDend', 'dend')}
                      />
                    </div>
                  </div>
                ),
                filterIcon: <Icon type="filter"
                                  style={{color: (filter.caseDend.dbeg || filter.caseDend.dend) ? '#ff9800' : '#aaa'}}/>,
                onFilterDropdownVisibleChange: (visible) => {
                  this.setState({
                    filterDropdownVisible: visible,
                  }, () => this.caseDend.focus());
                },
                render: obj => obj && obj.format('DD-MM-YYYY')
              },
              {
                key: 'caseStructuralSubdivision',
                title: caseStructuralSubdivision.name[this.lng],
                dataIndex: 'caseStructuralSubdivision',
                width: '15%',
              },
              {
                key: 'caseNotes',
                title: caseNotes.name[this.lng],
                dataIndex: 'caseNotes',
                width: '15%',
                render: obj => obj && obj.label
              },
              {
                key: 'documentFile',
                title: t('ELECTRONIC_CONTENT'),
                dataIndex: 'documentFile',
                width: '8%',
                render: vals => vals && vals.length !== 0 &&
                <Button
                  title={t('SHOW_FILES')}
                  icon="paper-clip"
                  className='green-btn'
                  onClick={e => {
                    e.stopPropagation();
                    this.setState({openModal: true, viewerList: vals});
                  }}
                />,
              }
            ]}
            openedBy="Cases"
            scroll={{y: '100%'}}
            changeSelectedRow={ this.changeSelectedRow }
            loading={ this.state.loading }
            dataSource={ this.filteredData }
            footer={ this.renderTableFooter }
          />
          <CSSTransition
            in={this.state.openCard}
            timeout={300}
            classNames="right card"
            unmountOnExit
          >
            <SiderCard
              closer={<Button type='danger' className='right' onClick={() => this.setState({openCard: false})}
                              shape="circle" icon="arrow-right"/>}
            >
              {this.getRespCard(this.props.invType, this.props.docType)}
            </SiderCard>
          </CSSTransition>
        </div>
        {<Modal
          visible={this.state.openModal}
          footer={null}
          title={t('VIEWER_CASE')}
          wrapClassName={'full-screen'}
          onCancel={() => this.setState({ openModal: false })}
        >
          <Viewer key={this.state.viewerList.toString()} t={t} viewerList={this.state.viewerList}/>
        </Modal>}
      </div>
    )
  }

}

function mapStateToProps(state) {
  return {
    CubeForAF_Case: state.cubes[CUBE_FOR_AF_CASE],
    fundFeatureOptions: state.generalData.fundFeature,
    tofiConstants: state.generalData.tofiConstants
  }
}

export default connect(mapStateToProps, {getCube, getPropVal})(EditCardCases)