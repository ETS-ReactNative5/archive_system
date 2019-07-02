import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AntTabs from '../../AntTabs';
import FundMaker from './FundMaker';
import FMIndividuals from './FMIndividuals';
import {getCube} from '../../../actions/actions';
import {
  CUBE_FOR_LP_FUNDMAKER,
  CUBE_FOR_ORG_FUNDMAKER,
  DO_FOR_ORG_FUNDMAKER,
  dpForOrgFundmakers
} from '../../../constants/tofiConstants';
import {DatePicker} from 'antd';
import moment from 'moment';

class FundMakerPage extends React.PureComponent {

  state = {
      idfunMarker:"",
    globalDate: moment()
  };

  handleTabChange = key => {
    switch (key) {
      case 'organizations':
        if (!this.props.cubeForOrgFundmaker) {this.loadOrgFundmaker()}
        break;
      case 'individuals':
        if(!this.props.cubeForLPFundmaker) {
          this.props.getCube('cubeForLPFundmaker');
        }
        break;
      default: break;
    }
  };

  componentDidMount() {
    if(!this.props.cubeForOrgFundmaker) {
      this.loadOrgFundmaker()
    }
      let idfunMarker = this.props.location.state && this.props.location.state.data.idDimObj
      this.setState({
          idfunMarker
      })

  }

  // Загрузка данных из куба
  // если id не задан, загружаем все объекты куба CUBE_FOR_ORG_FUNDMAKER и 5 пропов, если id задан, то загружаем 1 объект и все пропы.
  loadOrgFundmaker = async (id) => {

    try {
      const filters = {
        filterDOAnd: id ? [
          {
            dimConst: 'doForOrgFundmakers',
            concatType: "and",
            conds: [{
              ids: id
            }
            ]}
        ] : null,
        filterDPAnd: !id ? [
          {
            dimConst: 'dpForOrgFundmakers',
            concatType: "and",
            conds: [
              {
                consts: 'formOfAdmission,dateFormation,dateRename,liquidation,dateElimination,reasonFundmaker,departmentalAccessory,reasonFundmakerFile,legalStatus,orgRightReceiver,fundmakerArchive,orgIndustry,isActive'
              }
            ]
          }
        ] : null,
      };
      return this.props.getCube('cubeForOrgFundmaker', JSON.stringify(filters), id ? {
        customKey: 'cubeForOrgFundmakerSingle',
        parent: id
      } : {customKey: 'cubeForOrgFundmaker'});
    } catch (err) {
      return Promise.reject();
    }
  };

  onDateChange = date => {this.setState({globalDate: date})};

  render() {
    const { globalDate } = this.state;
    const { t, cubeForOrgFundmaker, tofiConstants, cubeForLPFundmaker, getCube } = this.props;
    return (
      <div className="FundMakerPage">
        <div className="title">
          <h2>{t('FUND_MAKERS')}</h2>
          <DatePicker onChange={this.onDateChange} value={globalDate}/>
        </div>
        <AntTabs type="card" onChange={this.handleTabChange} tabs={[
          {
            tabKey: 'organizations',
            tabName: t('ORGANIZATIONS'),
            tabContent: <FundMaker
              t={t}
              idfunMarker={this.state.idfunMarker}
              cubeForOrgFundmaker={cubeForOrgFundmaker}
              tofiConstants={tofiConstants}
              loadOrgFundmaker={this.loadOrgFundmaker}
              globalDate={globalDate}
                {...this.props}
            />
          },
          {
            tabKey: 'individuals',
            tabName: t('INDIVIDUALS'),
            tabContent: <FMIndividuals
              t={t}
              cubeForLPFundmaker={cubeForLPFundmaker}
              tofiConstants={tofiConstants}
              globalDate={globalDate}
              getCube={getCube}/>
          }
        ]}/>
      </div>
    )
  }
}

FundMakerPage.propTypes = {
  t: PropTypes.func.isRequired,
  cubeForOrgFundmaker: PropTypes.shape(),
  cubeForLPFundmaker: PropTypes.shape(),
  tofiConstants: PropTypes.shape().isRequired
};

function mapStateToProps(state) {
  return {
    cubeForOrgFundmaker: state.cubes['cubeForOrgFundmaker'],
    cubeForOrgFundmakerSingle: state.cubes['cubeForOrgFundmakerSingle'],
    cubeForLPFundmaker: state.cubes['cubeForLPFundmaker'],
    cubeForLPFundmakerSingle: state.cubes['cubeForLPFundmakerSingle'],
    tofiConstants: state.generalData.tofiConstants || {}
  }
}

export default connect(mapStateToProps, { getCube })(FundMakerPage);