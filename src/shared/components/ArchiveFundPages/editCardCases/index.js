import React from 'react'
import {Button, Icon, Input, Popconfirm, message} from 'antd';
import { connect } from 'react-redux';
import moment from "moment/moment";
import {isEmpty, map} from "lodash";

import {
  dObj,
  getAllObjOfCls,
  getCasesCount,
  getCube, getObjListNew,
  getPropVal,
  updateCubeData
} from '../../../actions/actions';
import {getPropMeta, parseCube_new, parseForTable} from '../../../utils/cubeParser';
import {
  CUBE_FOR_AF_CASE,
  CUBE_FOR_AF_DOCS,
  DO_FOR_CASE,
  DP_FOR_CASE
} from "../../../constants/tofiConstants";
import Select from "../../Select";
import Table_invTypePerm_uprDoc from "./invTypePerm_urpDoc/Table_invTypePerm_uprDoc";
import Table_invTypePerm_uprNTD from "./Table_invTypePerm_uprNTD";
import Table_invTypePhoto_photoDoc from "./Table_invTypePhoto_photoDoc";
import Table_invTypePhonoMag_phonoDoc from "./Table_invTypePhonoMag_phonoDoc";
import Table_invTypePhonoGram_phonoDoc from "./Table_invTypePhonoGram_phonoDoc";
import Table_invTypeVideo_videoDoc from "./Table_invTypeVideo_videoDoc";
import Table_invTypeMovie_movieDoc from "./Table_invTypeMovie_movieDoc";
import Table_invTypeDigital_uprDoc from "./Table_invTypeDigital_uprDoc";

/*eslint eqeqeq:0*/
class EditCardCases extends React.Component {

  state = {
    caseData: [],
    docData: [],
    caseLoading: false,
    docLoading: false,
    structuralSubdivisionList: [],
    structuralSubdivisionListLoading: false,
    fundFeature: [],
    fundFeatureLoading: false
  };

  componentDidMount() {
    this.filters = {
      filterDOAnd: [
        {
          dimConst: DO_FOR_CASE,
          concatType: "and",
          conds: [
            {
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
    this.setState({ caseLoading: true });
    this.props.getCube(CUBE_FOR_AF_CASE, JSON.stringify(this.filters))
      .then(() => this.setState({ caseLoading: false }))
      .catch(err => {
        console.error(err);
        this.setState({ caseLoading: false })
      })
  }
  componentWillReceiveProps(nextProps) {
    if(isEmpty(this.props.tofiConstants)) return;
    if(this.props.CubeForAF_Case !== nextProps.CubeForAF_Case) {
      const { doForCase, dpForCase} = nextProps.tofiConstants;
      this.setState(
        {
          caseLoading: false,
          caseData: parseCube_new(
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
    if(this.props.cubeDocuments !== nextProps.cubeDocuments) {
      const { doDocuments, dpDocuments} = nextProps.tofiConstants;
      this.setState(
        {
          docLoading: false,
          docData: parseCube_new(
            nextProps.cubeDocuments['cube'],
            [],
            'dp',
            'do',
            nextProps.cubeDocuments[`do_${doDocuments.id}`],
            nextProps.cubeDocuments[`dp_${dpDocuments.id}`],
            `do_${doDocuments.id}`, `dp_${dpDocuments.id}`).map(this.renderTableData)
        }
      );
    }
  }
  renderTableData = item => {
    const result = {
      key: item.id,
      name: item.name
    };
    parseForTable(item.props, this.props.tofiConstants, result);
    return result;
  };

  onSelectChange = c => s => this.setState({[c]: s});

  getAllObjOfCls = (cArr, dte = moment().format('YYYY-MM-DD')) => {
    return () => {
      cArr.forEach(c => {
        if(!this.props[c + 'Options']) {
          this.setState({[c+'Loading']: true});
          this.props.getAllObjOfCls(c, dte)
            .then(() => this.setState({[c+'Loading']: false}))
        }
      });
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
  onSaveCubeData = (values, doItemProp, objDataProp) => {
    let datas = [];
    try {
      datas = [{
        own: [{doConst: DO_FOR_CASE, doItem: doItemProp, isRel: "0", objData: objDataProp}],
        props: map(values, (val, key) => {
          const propMetaData = getPropMeta(this.props.CubeForAF_Case["dp_" + this.props.tofiConstants[DP_FOR_CASE].id], this.props.tofiConstants[key]);
          let value = val;
          if((propMetaData.typeProp === 315 || propMetaData.typeProp === 311 || propMetaData.typeProp === 317) && typeof val === 'string') value = {kz: val, ru: val, en: val};
          if(val && typeof val === 'object' && val.value) value = String(val.value);
          if(val && typeof val === 'object' && val.mode) propMetaData.mode = val.mode;
          if(propMetaData.isUniq === 2 && val[0] && val[0].value) {
            propMetaData.mode = val[0].mode;
            value = val.map(v => String(v.value)).join(",");
          }
          return {propConst: key, val: value, typeProp: String(propMetaData.typeProp), periodDepend: String(propMetaData.periodDepend), isUniq: String(propMetaData.isUniq), mode: propMetaData.mode}
        }),
        periods: [{ periodType: '0', dbeg: '1800-01-01', dend: '3333-12-31' }]
      }];
    } catch(err) {
      console.error(err);
      return Promise.reject();
    }
    const hideLoading = message.loading(this.props.t('UPDATING_PROPS'), 30);
    return updateCubeData(CUBE_FOR_AF_CASE, moment().format('YYYY-MM-DD'), JSON.stringify(datas))
      .then(res => {
        hideLoading();
        if(res.success) {
          message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'));
          this.setState({caseLoading: true});
          return this.props.getCube(CUBE_FOR_AF_CASE, JSON.stringify(this.filters))
            .then(() => {
              this.setState({caseLoading: false, openCard: false});
              return {success: true}
            })
        } else {
          message.error(this.props.t('PROPS_UPDATING_ERROR'));
          if(res.errors) {
            res.errors.forEach(err => {
              message.error(err.text);
            });
            return Promise.reject();
          }
        }
      })
  };

  getDocData = key => {
    const filters = {
      filterDOAnd: [
        {
          dimConst: 'doDocuments',
          concatType: "and",
          conds: [{
              data: {
                valueRef: {
                  id: key
                }
              }
          }]
        }
      ]
    };
    this.setState({ docLoading: true });
    this.props.getCube('cubeDocuments', JSON.stringify((filters)));
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
    switch (true) {
      case invType == invTypePerm.id && docType == uprDoc.id:
        return <Table_invTypePerm_uprDoc
          t={this.props.t}
          getDocData={this.getDocData}
          onSaveCubeData={this.onSaveCubeData}
          caseData={this.state.caseData}
          docData={this.state.docData}
          caseLoading={this.state.caseLoading}
          docLoading={this.state.docLoading}
          lng={this.lng}
          tofiConstants={this.props.tofiConstants}
        />;
      case invType == invTypePerm.id && docType == uprNTD.id:
        return <Table_invTypePerm_uprNTD t={this.props.t} getDocData={this.getDocData} data={this.state.data} lng={this.lng} tofiConstants={this.props.tofiConstants} />;
      case invType == invTypeVideo.id && docType == videoDoc.id:
        return <Table_invTypeVideo_videoDoc t={this.props.t} getDocData={this.getDocData} data={this.state.data} lng={this.lng} tofiConstants={this.props.tofiConstants} />;
      case invType == invTypeMovie.id && docType == movieDoc.id:
        return <Table_invTypeMovie_movieDoc t={this.props.t} getDocData={this.getDocData} data={this.state.data} lng={this.lng} tofiConstants={this.props.tofiConstants} />;
      case invType == invTypePhonoGram.id && docType == phonoDoc.id:
        return <Table_invTypePhonoGram_phonoDoc t={this.props.t} getDocData={this.getDocData} data={this.state.data} lng={this.lng} tofiConstants={this.props.tofiConstants} />;
      case invType == invTypePhonoMag.id && docType == phonoDoc.id:
        return <Table_invTypePhonoMag_phonoDoc t={this.props.t} getDocData={this.getDocData} data={this.state.data} lng={this.lng} tofiConstants={this.props.tofiConstants} />;
      // case invType == invTypeAlbum.id && docType == photoDoc.id:
      //   return <Table_invTypeAlbum_photoDoc t={this.props.t} getDocData=this.getDocData data=this.state.data lng={this.lng} tofiConstants={this.props.tofiConstants} />;
      case invType == invTypePhoto.id && docType == photoDoc.id:
        return <Table_invTypePhoto_photoDoc t={this.props.t} getDocData={this.getDocData} data={this.state.data} lng={this.lng} tofiConstants={this.props.tofiConstants} />;
      case invType == invTypeDigital.id && docType == uprDoc.id:
        return <Table_invTypeDigital_uprDoc t={this.props.t} getDocData={this.getDocData} data={this.state.data} lng={this.lng} tofiConstants={this.props.tofiConstants} />;
      // case invType == invTypeLS.id && docType == LSDoc.id:
      //   return <Table_invTypeLS_LSDoc t={this.props.t} getDocData=this.getDocData data=this.state.data lng={this.lng} tofiConstants={this.props.tofiConstants} />;
      default: return null;
    }
  }
  render() {
    if(isEmpty(this.props.tofiConstants)) return null;
    const { t, fundFeatureOptions, tofiConstants: {structuralSubdivisionList, fundFeature} } = this.props;
    const { structuralSubdivisionListOptions } = this.state;
    this.lng = localStorage.getItem('i18nextLng');

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
        <div className="EditCardCases__body">
          {this.getRespTable(this.props.invType, this.props.docType)}
        </div>
      </div>
    )
  }

}

function mapStateToProps(state) {
  return {
    CubeForAF_Case: state.cubes[CUBE_FOR_AF_CASE],
    cubeDocuments: state.cubes.cubeDocuments,
    fundFeatureOptions: state.generalData.fundFeature,
    tofiConstants: state.generalData.tofiConstants
  }
}

export default connect(mapStateToProps, {getCube, getPropVal, getAllObjOfCls})(EditCardCases)