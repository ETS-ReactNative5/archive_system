import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {Breadcrumb, Spin} from 'antd';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import AntTabs from '../AntTabs';
import ViewInventCardCases from './ViewInventCardCases';
import ViewInventCardMain from './ViewInventCardMain';
import ViewInventCardSize from './ViewInventCardSize';
import ViewInventCardStorage from './ViewInventCardStorage';
import {connect} from 'react-redux';
import DialogBox from '../DialogBox';
import {
  CUBE_FOR_AF_CASE,
  CUBE_FOR_AF_INV, DO_FOR_CASE, DO_FOR_INV
} from '../../constants/tofiConstants';
import {getCube} from '../../actions/actions';
import {parseCube_new} from '../../utils/cubeParser';
import {isEmpty} from 'lodash';
import EditDialogBody from '../EditDialogBody';

/*eslint eqeqeq:0*/
class ViewInventCardPage extends Component {

  state = {
    loading: true,
    invCard: {},
    dialogBox: {
      visible: false
    }
  };

  handleTabChange = key => {
    switch (key) {
      case 'ViewInventCardMain':
        break;
      case 'ViewInventCardSize':
        break;
      case 'ViewInventCardStorage':
        break;
      case 'ViewInventCardCases':
        const filters = {
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
        this.props.getCube(CUBE_FOR_AF_CASE, JSON.stringify(filters));
        break;
      default: break;
    }
  };

  openDialogBox = () => {
    this.setState({ dialogBox: {...this.state.dialogBox, visible: true} })
  };

  closeDialogBox = () => {
    this.setState({ dialogBox: {...this.state.dialogBox, visible: false} })
  };

  componentDidMount() {
    const filters = {
      filterDOAnd: [
        {
          dimConst: DO_FOR_INV,
          concatType: "and",
          conds: [
            {
              ids: this.props.match.params.idInventCard
            }
          ]
        }
      ]
    };
    this.props.getCube(CUBE_FOR_AF_INV, JSON.stringify(filters))
      .then(() => this.setState({ loading: false }))
      .catch(err => {
        console.error(err);
        this.setState({ loading: false })
      });
  }

  componentWillReceiveProps(nextProps) {
    if(!isEmpty(nextProps.inv) && !isEmpty(nextProps.tofiConstants)) {
      const { doForInv, dpForInv } = nextProps.tofiConstants;
      this.setState(
        {
          loading: false,
          invCard: parseCube_new(
            nextProps.inv['cube'],
            [],
            'dp',
            'do',
            nextProps.inv[`do_${doForInv.id}`],
            nextProps.inv[`dp_${dpForInv.id}`],
            `do_${doForInv.id}`,
            `dp_${dpForInv.id}`
          )[0] //only one inv
        }
      );
    } else {
      this.setState({ loading: false });
    }
  }

  render() {
    if(isEmpty(this.props.tofiConstants)) return <div>No constants</div>;

    const { dialogBox: { visible }, invCard, loading } = this.state;
    const { t, tofiConstants, match: { params: { idInventCard, idFundCard } } } = this.props;

    const { invNumber, invType, invDates, invCaseSystem } = tofiConstants;
    const lng = localStorage.getItem('i18nextLng');

    // const fundCardName = fundCardCube ? fundCardCube[`do_${doForFundAndIK.id}`][0].name[lng] : '';
    const invCardName = invCard.name ? invCard.name[lng] : '';

    const mainFormData = isEmpty(invCard) ? {} : {
      inventName: invCard.name[lng],
      invNumber: invCard.props.find(prop => prop.prop == invNumber.id)['value'],
      invType: invCard.props.find(prop => prop.prop == invType.id)['value'],
      invDates: invCard.props.find(prop => prop.prop == invDates.id)['value'],
      invCaseSystem: invCard.props.find(prop => prop.prop == invCaseSystem.id)['value'],
      accessLevel: invCard.accessLevel
    };

    return (
      <div className="ViewInventCardPage">
        <h2>{t('INVENT_CARD') + ': '}<Link to={`/archiveFund/editFundCard/${idFundCard}`}>{ invCardName }</Link></h2>
        <Breadcrumb>
          <Breadcrumb.Item><Link to={`/archiveFund/editFundCard/${idFundCard}`}>{ t('FUND') + ': '}</Link></Breadcrumb.Item>
          <Breadcrumb.Item><b>{ t('INVENTORY') + ': ' + invCardName }</b></Breadcrumb.Item>
        </Breadcrumb>
        <AntTabs
          tabs={[
            {
              tabName: t('MAIN'),
              tabKey: 'ViewInventCardMain',
              tabContent: (
                loading ?
                  <Spin  size='large' style={{ position: 'relative', left: '50%', top: '50%', transform: "translateX(-50%)" }}/> :
                  <ViewInventCardMain
                    t={ t }
                    tofiConstants={tofiConstants}
                    openDialogBox={this.openDialogBox}
                    initialValues={mainFormData}
                  />
              )
            },
            {
              tabName: t('SIZE'),
              tabKey: 'ViewInventCardSize',
              tabContent: <ViewInventCardSize t={ t } tofiConstants={tofiConstants}/>
            },
            {
              tabName: t('STORAGE'),
              tabKey: 'ViewInventCardStorage',
              tabContent: <ViewInventCardStorage />
            },
            {
              tabName: t('CASES'),
              tabKey: 'ViewInventCardCases',
              tabContent: <ViewInventCardCases idFundCard={idFundCard} idInventCard={idInventCard} t={ t } />
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
          <EditDialogBody/>
        </DialogBox>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    tofiConstants: state.generalData.tofiConstants,
    inv: state.cubes[CUBE_FOR_AF_INV],
    fundCardCube: state.cubes[CUBE_FOR_AF_INV]
  }
}

ViewInventCardPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      idFundCard: PropTypes.string,
      idInventCard: PropTypes.string
    }).isRequired,
  }).isRequired,
  t: PropTypes.func.isRequired,
  tofiConstants: PropTypes.shape(),
  inv: PropTypes.shape(),
  fundCardCube: PropTypes.object
};

export default connect(mapStateToProps, { getCube })(translate('archiveFund')(ViewInventCardPage));
