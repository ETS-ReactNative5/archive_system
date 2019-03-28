import React from 'react'
import {Button, DatePicker, Icon, Input, message} from 'antd';
import { connect } from 'react-redux';
import {isEmpty, isEqual, map} from "lodash";
import {CSSTransition} from "react-transition-group";

import {
  getCube, getObjListNew,
  getPropVal} from '../../../actions/actions';
import {parseCube_new, parseForTable} from '../../../utils/cubeParser';
import {CUBE_FOR_AF_CASE, DO_FOR_CASE} from "../../../constants/tofiConstants";
import Select from "../../Select";
import Table_invTypePerm_urpDoc from "./invTypePerm_urpDoc/Table_invTypePerm_urpDoc";
import Table_invTypeLS_LSDoc from "./invTypeLS_LSDoc/Table_invTypeLS_LSDoc";
import Table_invTypePerm_uprNTD from "./invTypePerm_uprNTD/Table_invTypePerm_uprNTD";
import Table_invTypePhoto_photoDoc from "./invTypePhoto_photoDoc/Table_invTypePhoto_photoDoc";
import Table_invTypePhonoMag_phonoDoc from "./invTypePhonoMag_phonoDoc/Table_invTypePhonoMag_phonoDoc";
import Table_invTypePhonoGram_phonoDoc from "./invTypePhonoGram_phonoDoc/Table_invTypePhonoGram_phonoDoc";
import Table_invTypeVideo_videoDoc from "./invTypeVideo_videoDoc/Table_invTypeVideo_videoDoc";
import Table_invTypeMovie_movieDoc from "./invTypeMovie_movieDoc/Table_invTypeMovie_movieDoc";
import Table_invTypeDigital_uprDoc from "./invTypeDigital_uprDoc/Table_invTypeDigital_uprDoc";
import Table_invTypeAlbum_photoDoc from "./invTypeAlbum_photoDoc/Table_invTypeAlbum_photoDoc";
import {Link} from "react-router-dom";

/*eslint eqeqeq:0*/
class EditCardDocuments extends React.Component {

  state = {
    data: [],
    loading: false
  };

  async componentDidMount () {
    const filters = {
      filterDOAnd: [
        {
          dimConst: 'doDocuments',
          concatType: "and",
          conds: [{
            data: {
              valueRef: {
                id: this.props.match.params.idCaseCard
              }
            }
          }]
        }
      ]
    };
    this.setState({ loading: true });
    await this.props.getCube('cubeDocuments', JSON.stringify((filters)));
    this.setState({ loading: false })
  }
  componentDidUpdate(prevProps) {
    if(isEmpty(this.props.tofiConstants)) return;
    if(prevProps.cubeDocuments !== this.props.cubeDocuments) {
      const { doCubeDocuments, dpCubeDocuments} = this.props.tofiConstants;
      this.setState(
        {
          loading: false,
          data: parseCube_new(
            this.props.cubeDocuments['cube'],
            [],
            'dp',
            'do',
            this.props.cubeDocuments[`do_${doCubeDocuments.id}`],
            this.props.cubeDocuments[`dp_${dpCubeDocuments.id}`],
            `do_${doCubeDocuments.id}`, `dp_${dpCubeDocuments.id}`).map(this.renderTableData)
        }
      );
    }
  }
  renderTableData = item => {
    const constArr = ['caseDbeg', 'caseDend', 'caseNotes', 'caseStructuralSubdivision',
      'pageNumberStart', 'turnoverSheetStart', 'pageNumberEnd', 'turnoverSheetEnd', 'documentPapers'];
    const result = {
      key: item.id,
      name: item.name
    };
    parseForTable(item.props, this.props.tofiConstants, result, constArr);
    return result;
  };

  onSelectChange = c => s => this.setState({[c]: s});
  changeSelectedRow = rec => {
    if(isEmpty(this.state.selectedRow) || !isEqual(this.state.selectedRow, rec)){
      this.setState({ selectedRow: rec, openCard: false });
    } else {
      this.setState({
        openCard: true,
        selectedRow: rec
      })
    }
  };
  loadOptions = c => {
    return () => {
      if(!this.props[c + 'Options']) {
        this.setState({[c+'Loading']: true});
        this.props.getPropVal(c)
          .then(() => this.setState({[c+'Loading']: false}))
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
    this.setState({filter: {
        ...this.state.filter,
        [e.target.dataset.name]: ''
      }})
  };
  getRespTable(invType, docType) {
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
      tofiConstants: this.props.tofiConstants,
      lng: this.lng,
      loading: this.state.loading
    };
    switch (true) {
      case invType == invTypePerm.id && docType == uprDoc.id:
        return <Table_invTypePerm_urpDoc {...params} />;
      case invType == invTypePerm.id && docType == uprNTD.id:
        return <Table_invTypePerm_uprNTD {...params} />;
      case invType == invTypeVideo.id && docType == videoDoc.id:
        return <Table_invTypeVideo_videoDoc {...params} />;
      case invType == invTypeMovie.id && docType == movieDoc.id:
        return <Table_invTypeMovie_movieDoc {...params} />;
      case invType == invTypePhonoGram.id && docType == phonoDoc.id:
        return <Table_invTypePhonoGram_phonoDoc {...params} />;
      case invType == invTypePhonoMag.id && docType == phonoDoc.id:
        return <Table_invTypePhonoMag_phonoDoc {...params} />;
      case invType == invTypeAlbum.id && docType == photoDoc.id:
        return <Table_invTypeAlbum_photoDoc {...params} />;
      case invType == invTypePhoto.id && docType == photoDoc.id:
        return <Table_invTypePhoto_photoDoc {...params} />;
      case invType == invTypeDigital.id && docType == uprDoc.id:
        return <Table_invTypeDigital_uprDoc {...params} />;
      case invType == invTypeLS.id && docType == LSDoc.id:
        return <Table_invTypeLS_LSDoc {...params} />;
      default: return null;
    }
  }
  render() {
    if(isEmpty(this.props.tofiConstants)) return null;
    const { t, fundFeatureOptions, tofiConstants: {structuralSubdivisionList, fundFeature} } = this.props;
    const { structuralSubdivisionListOptions, filter, data, selectedRow } = this.state;
    this.lng = localStorage.getItem('i18nextLng');

    this.filteredData = data.filter(item => {
      return (
        item.name[this.lng].toLowerCase().includes(filter.name.toLowerCase()) &&
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
          <div className="label-select">
            <Select
              name="structuralSubdivisionList"
              isMulti
              isSearchable={false}
              value={this.state.structuralSubdivisionList}
              onChange={this.onSelectChange('structuralSubdivisionList')}
              isLoading={this.state.structuralSubdivisionListLoading}
              options={structuralSubdivisionListOptions ? structuralSubdivisionListOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
              placeholder={structuralSubdivisionList.name[this.lng]}
              onFocus={async () => {
                if(this.state.structuralSubdivisionList) {
                  this.setState({ structuralSubdivisionListLoading: true });
                  const fd = new FormData();
                  fd.append('parent', this.props.location.state.inv.key.split('_')[1]);
                  fd.append('clsConsts', 'structuralSubdivisionList');
                  const res = await getObjListNew(fd);
                  if(!res.success) {
                    res.errors.forEach(err => {
                      message.error(err.text);
                      return this.setState({ loading: false })
                    })
                  }
                  this.setState({ structuralSubdivisionListLoading: false, structuralSubdivisionListOptions: res.data })
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
              options={fundFeatureOptions ? fundFeatureOptions.map(option => ({value: option.id, label: option.name[this.lng]})) : []}
              placeholder={fundFeature.name[this.lng]}
              onFocus={this.loadOptions(['fundFeature'])}
            />
          </div>
        </div>
        {this.getRespTable(this.props.invType, this.props.docType)}
      </div>
    )
  }

}

function mapStateToProps(state) {
  return {
    cubeDocuments: state.cubes[CUBE_FOR_AF_CASE],
    fundFeatureOptions: state.generalData.fundFeature,
    tofiConstants: state.generalData.tofiConstants
  }
}

export default connect(mapStateToProps, {getCube, getPropVal})(EditCardDocuments)