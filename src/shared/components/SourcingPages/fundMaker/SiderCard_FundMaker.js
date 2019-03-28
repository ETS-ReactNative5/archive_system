import React from 'react';
import moment from 'moment';
import AntTabs from '../../AntTabs';
import MainInfoFundMaker from './MainInfoFundMaker';
import ManagingFormFundMaker from './ManagingFormFundMaker';
import FundMakerContent from './FundMakerContent';
//import {getObjVer_new} from '../../../actions/actions';
import {parseCube_new, parseForTable} from '../../../utils/cubeParser.js';

class SiderCard_FundMaker extends React.PureComponent {

  state = {
    fundMakerVer: null,
    data: {},
    initialValues: this.props.initialValues
  };

  /*
   handleTabChange = key => {
   switch (key) {
   case 'versions':
   if(this.props.initialValues.key)
   getObjVer_new(this.props.initialValues.key.split('_')[1])
   .then(res => {
   if(res.success) {
   this.setState({ fundMakerVer: res.data })
   }
   });
   break;
   default: break;
   }
   };
   */


  componentDidMount() {
    if (this.props.initialValues.key) {
      this.props.loadOrgFundmaker(this.props.initialValues.key);
    } else {
      return;
    }
    if (this.props.cubeForOrgFundmakerSingle !== undefined) {
      const {doForOrgFundmakers, dpForOrgFundmakers} = this.props.tofiConstants;
      const data = parseCube_new(this.props.cubeForOrgFundmakerSingle['cube'],
        [],
        'dp',
        'do',
        this.props.cubeForOrgFundmakerSingle[`do_${doForOrgFundmakers.id}`],
        this.props.cubeForOrgFundmakerSingle[`dp_${dpForOrgFundmakers.id}`],
        `do_${doForOrgFundmakers.id}`,
        `dp_${dpForOrgFundmakers.id}`).map(this.renderTableData)[0];
      this.setState(
        {
          loading: false,
          data: data,
          initialValues: data
        }
      );
    }
  }


  componentDidUpdate(prevProps) {
    if (prevProps.cubeForOrgFundmakerSingle !== this.props.cubeForOrgFundmakerSingle) {
      const {doForOrgFundmakers, dpForOrgFundmakers} = this.props.tofiConstants;
      const data = parseCube_new(this.props.cubeForOrgFundmakerSingle['cube'],
        [],
        'dp',
        'do',
        this.props.cubeForOrgFundmakerSingle[`do_${doForOrgFundmakers.id}`],
        this.props.cubeForOrgFundmakerSingle[`dp_${dpForOrgFundmakers.id}`],
        `do_${doForOrgFundmakers.id}`,
        `dp_${dpForOrgFundmakers.id}`).map(this.renderTableData)[0];
      this.setState(
        {
          loading: false,
          data: data,
          initialValues: data
        }
      );
    }
    if (this.props.initialValues.key && this.props.initialValues.key !== prevProps.initialValues.key) {
      return this.props.loadOrgFundmaker(this.props.initialValues.key);
    }
    if (this.props.initialValues !== prevProps.initialValues) {
      this.setState({
        initialValues: this.props.initialValues
      });
    }
  }

  renderTableData = (item) => {

    const constArr = ['fundNumber', 'contractNumber', 'legalStatus', 'formOfAdmission', 'orgDocType', 'orgIndustry', 'isActive', 'fundmakerArchive',
      'orgFunction', 'structure', 'orgAddress', 'orgPhone', 'orgFax', 'orgEmail', 'orgFormationDoc', 'orgReorganizationDoc', 'orgLiquidationDoc',
      'leaderFIO', 'leaderPosition', 'leaderPhone', 'depLeaderFIO', 'depLeaderPosition', 'depLeaderPhone', 'responsibleFIO', 'responsiblePosition',
      'responsiblePhone', 'responsibleAppointmentDate', 'archiveLeaderFIO', 'archiveLeaderPosition', 'archiveLeaderPhone', 'archiveLeaderAppointmentDate',
      'commissionLeaderFIO', 'commissionLeaderPosition', 'commissionLeaderPhone'];

    const accessLevelObj = this.props.accessLevelOptions.find(al => al.id == item.accessLevel);
    const result = {
      key: item.id,
      shortName: item.name,
      name: item.fullName,
      dbeg: moment(item.dbeg, 'YYYY-MM-DD'),
      dend: moment(item.dend, 'YYYY-MM-DD'),
      accessLevel: {value: item.accessLevel, label: accessLevelObj.name[this.lng]}
    };
    this.withIdDPV = parseForTable(item.props, this.props.tofiConstants, result, constArr);
    result.orgAddress = result.orgAddressLng;
    result.orgFormationDoc = result.orgFormationDocLng;
    result.orgReorganizationDoc = result.orgReorganizationDocLng;
    result.orgLiquidationDoc = result.orgLiquidationDocLng;
    result.leaderFIO = result.leaderFIOLng;
    result.leaderPosition = result.leaderPositionLng;
    result.depLeaderFIO = result.depLeaderFIOLng;
    result.depLeaderPosition = result.depLeaderPositionLng;
    result.responsibleFIO = result.responsibleFIOLng;
    result.responsiblePosition = result.responsiblePositionLng;
    result.archiveLeaderFIO = result.archiveLeaderFIOLng;
    result.archiveLeaderPosition = result.archiveLeaderPositionLng;
    result.commissionLeaderFIO = result.commissionLeaderFIOLng;
    result.commissionLeaderPosition = result.commissionLeaderPositionLng;
    return result;
  };

  render() {
    this.lng = localStorage.getItem('i18nextLng');
    const {t, tofiConstants, saveProps, saveIKProps, onCreateObj} = this.props;
    const {initialValues} = this.state;
    return (
      <div className="card">
        {this.props.closer}
        <AntTabs
          tabs={[
            {
              tabKey: 'props',
              tabName: t('MAIN_INFO'),
              tabContent: <MainInfoFundMaker
                tofiConstants={tofiConstants}
                t={t}
                saveProps={saveProps}
                saveIKProps={saveIKProps}
                onCreateObj={onCreateObj}
                withIdDPV={this.withIdDPV}
                initialValues={initialValues}
              />
            },
            {
              tabKey: 'Description',
              disabled: !initialValues.key,
              tabName: t('MANAGING'),
              tabContent: <ManagingFormFundMaker
                tofiConstants={tofiConstants}
                saveProps={saveProps}
                t={t}
                withIdDPV={this.withIdDPV}
                initialValues={initialValues}/>
            },
            {
              tabKey: 'versions',
              disabled: !initialValues.key,
              tabName: t('VERSIONS'),
              tabContent: <FundMakerContent
                tofiConstants={tofiConstants}
                t={t}
                id={initialValues.key}/>
            }
          ]}
          //onChange={this.handleTabChange}
        />
      </div>
    )
  }
}

export default SiderCard_FundMaker;
