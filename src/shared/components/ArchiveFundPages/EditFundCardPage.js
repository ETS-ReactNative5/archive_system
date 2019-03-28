import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { Spin  } from 'antd';

import DialogBox from '../DialogBox';
import AntTabs from '../AntTabs';
import EditCardMain from './EditCardMain';
import EditCardInventories from './EditCardInventories';
import EditCardFundMaker from './EditCardFundMaker';
import EditCardAnnotations from './EditCardAnnotations';
import EditCardFundsize from './EditCardFundsize';
import {getCube, getPropValById, getObjVer} from '../../actions/actions';
import {
  CUBE_FOR_AF_INV, CUBE_FOR_AF_FUND, DO_FOR_INV, DO_FOR_FUND
} from '../../constants/tofiConstants';
import {parseCube_new} from '../../utils/cubeParser';
import EditDialogBody from '../EditDialogBody';

/*eslint eqeqeq:0*/
class EditFundCardPage extends Component {

  state = {
    fundCard: {},
    fundCardAnnotation: {
      tofiConstants: {},
      list: {}
    },
    loading: true,
    dialogBox: {
      visible: false
    }
  };

  handleTabChange = key => {
    switch (key) {
      case 'EditCardMain':
        break;
      case 'EditCardFundMaker':
        if(!!this.state.fundCard.props) {
          const id = this.state.fundCard.props.find(prop => prop.prop == this.props.tofiConstants.fundmakerOfIK.id).cube.idRef;
          this.setState({ loading: true });
          this.props.getObjVer(id, 'fundMakerVer')
            .then(() => this.setState({ loading: false }))
            .catch(err => {
              console.log(err);
              this.setState({loading: false})
            });
        }
        break;
      case 'EditCardAnnotations':
        break;
      case 'EditCardFundsize':
        break;
      case 'EditCardChangesFixingActs':
        const ids = this.state.fundCard.props.filter(prop => prop.prop == this.props.tofiConstants.fundActs.id);
        console.log(ids);
        getPropValById(ids[0].cube.idRef).then(obj => console.log(obj));
        break;
      case 'EditCardInventories':
        const filters = {
          filterDOAnd: [
            {
              dimConst: DO_FOR_INV,
              concatType: "and",
              conds: [
                {
                  data: {
                    valueRef: {
                      id: this.props.match.params.idFundCard
                    }
                  }
                }
              ]
            }
          ]
        };
        this.props.getCube(CUBE_FOR_AF_INV, JSON.stringify(filters));
        break;
      default: break;
    }
  };
  componentDidMount() {
    const filters = {
      filterDOAnd: [
        {
          dimConst: DO_FOR_FUND,
          concatType: "and",
          conds: [
            {
              ids: this.props.match.params.idFundCard
            }
          ]
        }
      ]
    };
    this.props.getCube(CUBE_FOR_AF_FUND, JSON.stringify(filters))
      .then(() => this.setState({ loading: false }))
      .catch(err => {
        console.error(err);
        this.setState({ loading: false })
      })
  }

  componentWillReceiveProps(nextProps) {
    if(!isEmpty(nextProps.fund) && !isEmpty(nextProps.tofiConstants)) {
      const { doForFund, dpForFund } = nextProps.tofiConstants;
      this.setState(
        {
          loading: false,
          fundCard: parseCube_new(
            nextProps.fund['cube'],
            [],
            'dp',
            'do',
            nextProps.fund[`do_${doForFund.id}`],
            nextProps.fund[`dp_${dpForFund.id}`],
            `do_${doForFund.id}`,
            `dp_${dpForFund.id}`
          )[0] //only one fund
        }
      );
    } else {
      this.setState({ loading: false });
    }
  }

  openDialogBox = () => {
    this.setState({ dialogBox: {...this.state.dialogBox, visible: true} })
  };

  closeDialogBox = () => {
    this.setState({ dialogBox: {...this.state.dialogBox, visible: false} })
  };

  render() {
    if(isEmpty(this.props.tofiConstants)) return <div>No constants</div>;

    const { fundCard,
      loading,
      dialogBox: {visible}
    } = this.state;
    const { t, tofiConstants } = this.props;
    const {
      fundNumber, fundIndex, fundDbeg, fundDend, fundCategory, fundJoint, fundExitDate, fundExitReason,
      fundHistoricalPeriod, fundFirstDocFlow, fundDateOfLastCheck, fundmakerOfIK } = tofiConstants;

    const lng = localStorage.getItem('i18nextLng');

    const mainFormData = isEmpty(fundCard) ? {} : {
      // fundName: fundCard.name[lng],
      fundShortName: fundCard.name[lng],
      fundNumber: fundCard.props.find(prop => prop.prop == fundNumber.id)['value'],
      fundIndex: fundCard.props.find(prop => prop.prop == fundIndex.id)['value'],
      fundDbeg: fundCard.props.find(prop => prop.prop == fundDbeg.id)['value'],
      fundDend: fundCard.props.find(prop => prop.prop == fundDend.id)['value'],
      fundCategory: fundCard.props.find(prop => prop.prop == fundCategory.id)['value'],
      accessLevel: fundCard.accessLevel,
      unitedFund: fundCard.props.find(prop => prop.prop == fundJoint.id)['value'],
      fundExitDate: fundCard.props.find(prop => prop.prop == fundExitDate.id)['value'],
      fundExitReason: fundCard.props.find(prop => prop.prop == fundExitReason.id)['value'],
      fundHistoricalPeriod: fundCard.props.find(prop => prop.prop == fundHistoricalPeriod.id)['value'],
      fundFirstDocFlow: fundCard.props.find(prop => prop.prop == fundFirstDocFlow.id)['value'],
      fundDateOfLastCheck: fundCard.props.find(prop => prop.prop == fundDateOfLastCheck.id)['value'],
      // fundAccess: fundCard.props.find(prop => prop.prop == fundAccess.id)['value']
    };

    const fundMakerData = !!fundCard.props ? fundCard.props.find(prop => prop.prop == fundmakerOfIK.id) : null;

    return (
      <div className="EditFundCardPage">
        <h2>{t('FUND_CARD') + ': '} <Link to="/archiveFund/fundsList">{ fundCard.name ? fundCard.name[lng] : '' }</Link></h2>
        <AntTabs
          tabs={[
            {
              tabName: t('MAIN'),
              tabKey: 'EditCardMain',
              tabContent: (
                loading ?
                  <Spin  size='large' style={{ position: 'relative', left: '50%', top: '50%', transform: "translateX(-50%)" }}/> :
                  <EditCardMain
                    t={ t }
                    fundCard={ fundCard }
                    initialValues={ mainFormData }
                    openDialogBox={this.openDialogBox}
                  />
              )
            },
            {
              tabName: t('FUND_MAKER'),
              tabKey: 'EditCardFundMaker',
              tabContent: (
                loading ?
                  <Spin  size='large' style={{ position: 'relative', left: '50%', transform: "translateX(-50%)" }}/> :
                  <EditCardFundMaker
                    t={ t }
                    fundMakerConst={ fundmakerOfIK }
                    fundMakerData={ fundMakerData ? fundMakerData['cube'] : {} }
                    fundMakerVer={this.props.fundMakerVer}
                  />
              )
            },
            {
              tabName: t('ANNOTATIONS'),
              tabKey: 'EditCardAnnotations',
              tabContent: (
                loading ?
                  <Spin  size='large' style={{ position: 'relative', left: '50%', transform: "translateX(-50%)" }}/> :
                  <EditCardAnnotations t={ t } tofiConstants={ tofiConstants } />
              )
            },
            {
              tabName: t('FUND_SIZE'),
              tabKey: 'EditCardFundsize',
              tabContent: <EditCardFundsize t={ t } tofiConstants={ tofiConstants } />
            },
            /*{
              tabName: t('ACTS_FIXING_CHANGES'),
              tabKey: 'EditCardChangesFixingActs',
              tabContent: <EditCardChangesFixingActs t={ t } tofiConstants={ tofiConstants } />
            },*/
            {
              tabName: t('INVENTORIES'),
              tabKey: 'EditCardInventories',
              tabContent: <EditCardInventories fundCardId={this.props.match.params.idFundCard} t={ t }/>
            }
          ]}
          type="line"
          onChange={this.handleTabChange}
        />
        <DialogBox
          visible={visible}
          handleClose={this.closeDialogBox}
          heading="EDIT"
        >
          <EditDialogBody />
        </DialogBox>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    fund: state.cubes[CUBE_FOR_AF_FUND],
    tofiConstants: state.generalData.tofiConstants,
    fundMakerVer: state.generalData.fundMakerVer
  }
}

EditFundCardPage.propTypes = {
  t: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      idFundCard: PropTypes.string
    }).isRequired
  }).isRequired,
  getCube: PropTypes.func.isRequired,
  tofiConstants: PropTypes.shape({
    fundActs: PropTypes.shape(),
  }),
  getObjVer: PropTypes.func,
  fundMakerVer: PropTypes.arrayOf(PropTypes.shape())
};

export default  connect(mapStateToProps, { getCube, getObjVer })(translate('archiveFund')(EditFundCardPage));
