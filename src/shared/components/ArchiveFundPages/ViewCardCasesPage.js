import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { translate } from 'react-i18next';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import AntTabs from '../AntTabs';
import ViewCardCasesMain from './ViewCardCasesMain';
import {Breadcrumb, Spin} from 'antd';
import ViewCardCasesState from './ViewCardCasesState';
import ViewCardCasesTheCase from './ViewCardCasesTheCase';
import DialogBox from '../DialogBox';
import {CUBE_FOR_AF_CASE, CUBE_FOR_AF_DOCS, DO_FOR_CASE, DO_FOR_DOCS} from '../../constants/tofiConstants';
import { getCube } from '../../actions/actions';
import {isEmpty} from 'lodash';
import {parseCube_new} from '../../utils/cubeParser';
import EditDialogBody from '../EditDialogBody';
import ViewCardCasesDocumentsList from './ViewCardCasesDocumentsList';

/* eslint eqeqeq:0 */
class ViewCardCases extends Component {

  state = {
    loading: true,
    caseCard: {},
    dialogBox: {
      visible: false
    }
  };

  handleTabChange = key => {
    switch (key) {
      case 'ViewCardCasesMain':
        break;
      case 'ViewCardCasesState':
        break;
      case 'ViewCardCasesTheCase':
        break;
      case 'ViewCardCasesDocumentsList':
        const filters = {
          filterDOAnd: [
            {
              dimConst: DO_FOR_DOCS,
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
        this.props.getCube('cubeDocuments', JSON.stringify(filters));
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
          dimConst: DO_FOR_CASE,
          concatType: "and",
          conds: [
            {
              ids: this.props.match.params.idCaseCard
            }
          ]
        }
      ]
    };
    this.props.getCube(CUBE_FOR_AF_CASE, JSON.stringify(filters))
      .then(() => this.setState({ loading: false }))
      .catch(err => {
        console.error(err);
        this.setState({ loading: false })
      });
  }

  componentWillReceiveProps(nextProps) {
    if(!isEmpty(nextProps.caseCard) && !isEmpty(nextProps.tofiConstants)) {
      try {
        const { doForCase, dpForCase } = nextProps.tofiConstants;
        this.setState(
          {
            loading: false,
            caseCard: parseCube_new(
              nextProps.caseCard['cube'],
              [],
              'dp',
              'do',
              nextProps.caseCard[`do_${doForCase.id}`],
              nextProps.caseCard[`dp_${dpForCase.id}`],
              `do_${doForCase.id}`,
              `dp_${dpForCase.id}`
            )[0] //only one case
          }
        );
      } catch(err) {
        console.log(err);
        this.setState({ loading: false });
      }
    } else {
      this.setState({ loading: false });
    }
  }

  getVOES = obj => {
    return !!obj ? obj['value'] : '';
  };

  render() {
    const { loading, caseCard, dialogBox: { visible } } = this.state;
    const { t, tofiConstants, match: {params: { idFundCard, idInventCard, idCaseCard }} } = this.props;

    const { fundNumber, caseNumberOfPages, caseNumberOfDocs,
      caseDbeg, caseDend, caseNotes, caseStatus, caseDateOfDeposit, caseDocsLang, caseOCD,
      caseInsurance, caseFundOfUse, caseStorage, caseBarcode, caseStructuralSubdivision } = tofiConstants ? tofiConstants : {};

    const lng = localStorage.getItem('i18nextLng');

    const mainFormData = isEmpty(caseCard) ? {} : {
      caseName: caseCard.name[lng],
      fundNumber: this.getVOES(caseCard.props.find(prop => prop.prop == fundNumber.id)),
      caseNumberOfPages: this.getVOES(caseCard.props.find(prop => prop.prop == caseNumberOfPages.id)),
      caseDbeg: this.getVOES(caseCard.props.find(prop => prop.prop == caseDbeg.id)),
      caseDend: this.getVOES(caseCard.props.find(prop => prop.prop == caseDend.id)),
      caseNumberOfDocs: this.getVOES(caseCard.props.find(prop => prop.prop == caseNumberOfDocs.id)),
      caseNotes: this.getVOES(caseCard.props.find(prop => prop.prop == caseNotes.id)),
      caseStatus: this.getVOES(caseCard.props.find(prop => prop.prop == caseStatus.id)),
      caseDateOfDeposit: this.getVOES(caseCard.props.find(prop => prop.prop == caseDateOfDeposit.id)),
      caseStructuralSubdivision: this.getVOES(caseCard.props.find(prop => prop.prop == caseStructuralSubdivision.id)),
      caseDocsLang: this.getVOES(caseCard.props.find(prop => prop.prop == caseDocsLang.id)),
      caseOCD: this.getVOES(caseCard.props.find(prop => prop.prop == caseOCD.id)),
      caseInsurance: this.getVOES(caseCard.props.find(prop => prop.prop == caseInsurance.id)),
      caseFundOfUse: this.getVOES(caseCard.props.find(prop => prop.prop == caseFundOfUse.id)),
      caseStorage: this.getVOES(caseCard.props.find(prop => prop.prop == caseStorage.id)),
      caseBarcode: this.getVOES(caseCard.props.find(prop => prop.prop == caseBarcode.id)),
      accessLevel: caseCard.accessLevel
    };

    const caseCardName = caseCard.name ? caseCard.name[lng] : '';

    return (
      <div className="ViewCardCases">
        <h2>{ t('CASE_CARD') + ':' } <Link to={`/archiveFund/editFundCard/${idFundCard}/${idInventCard}`}>{ caseCardName }</Link></h2>
        <Breadcrumb>
          <Breadcrumb.Item><Link to={`/archiveFund/editFundCard/${idFundCard}`}>{ t('FUND') + ': ' + idFundCard}</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to={`/archiveFund/editFundCard/${idFundCard}/${idInventCard}`}>{ t('INVENTORY') + ': ' + idInventCard}</Link></Breadcrumb.Item>
          <Breadcrumb.Item><b>{ idCaseCard }</b></Breadcrumb.Item>
        </Breadcrumb>
        <AntTabs
          tabs={[
            {
              tabName: t('MAIN'),
              tabKey: 'ViewCardCasesMain',
              tabContent: (loading ?
                <Spin  size='large' style={{ position: 'relative', left: '50%', top: '50%', transform: "translateX(-50%)" }}/> :
                <ViewCardCasesMain
                  t={ t }
                  openDialogBox={this.openDialogBox}
                  initialValues={mainFormData}
                  tofiConstants={tofiConstants}
                />
              )
            },
            {
              tabName: t('VIEW_CASE'),
              tabKey: 'ViewCardCasesTheCase',
              tabContent: <ViewCardCasesTheCase t={ t }/>
            }
            /*{
              tabName: t('DOCS_LIST'),
              tabKey: 'ViewCardCasesDocumentsList',
              tabContent: <ViewCardCasesDocumentsList
                idFundCard = {this.props.match.params.idFundCard}
                idInventCard={this.props.match.params.idInventCard}
                idCaseCard={this.props.match.params.idCaseCard}
                t={ t }
              />
            }*/
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

ViewCardCases.propTypes = {
  t: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      idFundCard: PropTypes.string.isRequired,
      idInventCard: PropTypes.string.isRequired,
      idCaseCard: PropTypes.string.isRequired
    }).isRequired,
  }).isRequired,
  tofiConstants: PropTypes.shape().isRequired,
  caseCard: PropTypes.shape().isRequired
};

function mapStateToProps(state) {
  return {
    tofiConstants: state.generalData.tofiConstants,
    caseCard: state.cubes[CUBE_FOR_AF_CASE]
  }
}


export default connect(mapStateToProps, { getCube })(translate('archiveFund')(ViewCardCases));
