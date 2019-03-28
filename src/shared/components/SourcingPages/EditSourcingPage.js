import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import { Spin  } from 'antd';

import DialogBox from '../DialogBox';
import AntTabs from '../AntTabs';
import EditSourcingMain from './EditSourcingMain';
import EditSourcingDocsInfo from './EditSourcingDocsInfo';
import EditSourcingInspectionsInfo from './EditSourcingInspectionsInfo';
import EditSourcingArchiveDocsInfo from './EditSourcingArchiveDocsInfo';
import EditSourcingArchiveInfo from './EditSourcingArchiveInfo';
import {getCube} from '../../actions/actions';
import {
  CUBE_FOR_AF_INV, CUBE_FOR_AF_FUND, INV_FUND, DO_FOR_INV, DO_FOR_FUND
} from '../../constants/tofiConstants';
import EditDialogBody from '../EditDialogBody';

class EditSourcingPage extends Component {

  handleTabChange = key => {
    switch (key) {
      case 'EditSourcingMain':
        break;
      case 'EditSourcingDocsInfo':
        break;
      case 'EditSourcingArchiveDocsInfo':
        break;
      case 'EditSourcingArchiveInfo':
        break;
      case 'EditSourcingInspectionsInfo':
        break;
      case 'EditCardInventories':
        const filter = `[{tableNameConst:${DO_FOR_INV}, currCubeConst:${CUBE_FOR_AF_INV}, ref:{value:${this.props.match.params.idFundCard}, refCubeConst:${CUBE_FOR_AF_FUND}, refTableConst:${DO_FOR_FUND},propConst:${INV_FUND}}}]`;
        this.props.getCube(CUBE_FOR_AF_INV, filter);
        break;
      default: break;
    }
  };

  state = {
    loading: false,
    dialogBox: {
      visible: false
    }
  };


  /*componentDidMount() {
    getFundCard(this.props.match.params.idFundCard)
      .then(data => {
        this.setState({ fundCard: data, loading: false })
      })
      .catch(err => {
        console.log(err);
        this.setState({ loading: false })
      });
  }*/
  componentDidMount() {
    /*const filter = `[{tableNameConst:${DO_FOR_FUND}, ids:[${this.props.match.params.idFundCard}]}]`;
    this.props.getCube(CUBE_FOR_AF_FUND, filter)
      .then(() => this.setState({ loading: false }))
      .catch(err => {
        console.error(err);
        this.setState({ loading: false })
      })*/
  }

  componentWillReceiveProps(nextProps) {
    /*if(!isEmpty(nextProps.fund) && !isEmpty(nextProps.tofiConstants)) {
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
    }*/
  }

  openDialogBox = () => {
    this.setState({ dialogBox: {...this.state.dialogBox, visible: true} })
  };

  closeDialogBox = () => {
    this.setState({ dialogBox: {...this.state.dialogBox, visible: false} })
  };

  render() {
    const {
      loading,
      dialogBox: {visible}
    } = this.state;
    const { t, tofiConstants } = this.props;

    /*const mainFormData = isEmpty(fundCard) ? {} : {
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
    };*/

    return (
      <div className="EditSourcingPage">
        <h2>{t('SOURCING') + ': '} <Link to="/sourcing/legalEntities"> 123 </Link></h2>
        <AntTabs
          tabs={[
            {
              tabName: t('MAIN'),
              tabKey: 'EditSourcingMain',
              tabContent: (
                loading ?
                  <Spin  size='large' style={{ position: 'relative', left: '50%', top: '50%', transform: "translateX(-50%)" }}/> :
                  <EditSourcingMain
                    t={ t }
                    openDialogBox={this.openDialogBox}
                    tofiConstants={tofiConstants}
                  />
              )
            },
            {
              tabName: t('NAM_DOCS_INFO'),
              tabKey: 'EditSourcingDocsInfo',
              tabContent: (
                loading ?
                  <Spin  size='large' style={{ position: 'relative', left: '50%', transform: "translateX(-50%)" }}/> :
                  <EditSourcingDocsInfo
                    t={ t }
                  />
              )
            },
            {
              tabName: t('ARCHIVE_INFO'),
              tabKey: 'EditSourcingArchiveInfo',
              tabContent: <EditSourcingArchiveInfo t={ t } tofiConstants={ tofiConstants } />
            },
            {
              tabName: t('ARCHIVE_DOCS_INFO'),
              tabKey: 'EditSourcingArchiveDocsInfo',
              tabContent: (
                loading ?
                  <Spin  size='large' style={{ position: 'relative', left: '50%', transform: "translateX(-50%)" }}/> :
                  <EditSourcingArchiveDocsInfo t={ t } tofiConstants={ tofiConstants } />
              )
            },
            {
              tabName: t('INSPECTIONS_INFO'),
              tabKey: 'EditSourcingInspectionsInfo',
              tabContent: <EditSourcingInspectionsInfo t={ t } tofiConstants={ tofiConstants } />
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
    tofiConstants: state.generalData.tofiConstants
  }
}

EditSourcingPage.propTypes = {
  t: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
    }).isRequired
  }).isRequired,
  getCube: PropTypes.func.isRequired,
  tofiConstants: PropTypes.shape().isRequired
};

export default  connect(mapStateToProps, { getCube })(translate('sourcing')(EditSourcingPage));
