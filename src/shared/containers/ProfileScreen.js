import React from 'react';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import ProfileForm from '../components/ProfilePages';
import { getCube } from '../actions/actions';
import {CUBE_FOR_WORKS, DO_FOR_FUND_AND_IK, DO_FOR_WORKS, DP_FOR_WORKS} from "../constants/tofiConstants";
import {onSaveCubeData, parseCube_new, parseForTable} from "../utils/cubeParser";
import {message} from "antd/lib/index";

class ProfileScreen extends React.Component {

  state = {
    data: []
  };

  componentDidMount() {
    const filters = {
      filterDOAnd: [
        {
          dimConst: 'doUsers',
          concatType: 'and',
          conds: [
            {
              obj: this.props.user.obj
            }
          ]
        }
      ]
    };
    this.props.getCube('cubeUsers', JSON.stringify(filters));
  }

  componentDidUpdate(prevProps) {
    if(prevProps.cubeUsers !== this.props.cubeUsers) {
      const { doUsers, dpUsers } = this.props.tofiConstants;
      const parsedCube = parseCube_new(this.props.cubeUsers['cube'],
        [],
        'dp',
        'do',
        this.props.cubeUsers[`do_${doUsers.id}`],
        this.props.cubeUsers[`dp_${dpUsers.id}`],
        `do_${doUsers.id}`,
        `dp_${dpUsers.id}`
      )[0]; // only one;
      this.withIdDPV = parseForTable(parsedCube.props, this.props.tofiConstants, {});
      this.setState({
        data: this.renderFormData(parsedCube)
      })
    }
  }

  renderFormData = item => {
    const constArr = ["gender", "education", "iin", "copyUdl", "location", "job", "position", "scanCopyLetter", "photo", "dateRegistration",
      "workEndDate", "nationality", "propStudy", "staffRole", "personAcademicDegree", "personAcademicTitle", "dateOfBirth", "personLastName",
      "personName", "personPatronymic", "regulationsAcquainted", "publishedWork", "bibliographicInform", "directUseDocument", "goalSprav",
      "chronologicalBegin", "chronologicalEnd", "formResultRealization"];

    const result = {
      key: item.id
    };

    this.withIdDPV = parseForTable(item.props, this.props.tofiConstants, result, constArr);
    // here goes some data massage
    return result;
  };

  submitChangePassword = () =>
    this.props.submit('ChangePasswordForm');

  saveProps = async (c, v, t = this.props.tofiConstants, objData) => {
    let hideLoading;
    try {
      if(!c.cube.data) c.cube.data = this.props.cubeUsers;
      hideLoading = message.loading(this.props.t('UPDATING_PROPS'), 0);
      const resSave = await onSaveCubeData(c, v, t, objData);
      hideLoading();
      if(!resSave.success) {
        message.error(this.props.t('PROPS_UPDATING_ERROR'));
        resSave.errors.forEach(err => {
          message.error(err.text)
        });
        return Promise.reject(resSave);
      }
      message.success(this.props.t('PROPS_SUCCESSFULLY_UPDATED'));
      this.setState({loading: true, openCard: false});
      const filters = {
        filterDOAnd: [
          {
            dimConst: 'doUsers',
            concatType: 'and',
            conds: [
              {
                obj: this.props.user.obj
              }
            ]
          }
        ]
      };
      await this.props.getCube('cubeUsers', JSON.stringify(filters));
      //await this.getCubeAct();
      return resSave;
    }
    catch (e) {
      typeof hideLoading === 'function' && hideLoading();
      this.setState({ loading: false });
      console.warn(e);
    }
  };

  render() {

    return (
      <div className="profileScreen">
        <div className="title">
          <h2>{this.props.t('PROFILE')}</h2>
        </div>
        <ProfileForm
          submitChangePassword={this.submitChangePassword}
          initialValues={this.state.data}
          saveProps={this.saveProps}
          withIdDPV={this.withIdDPV}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
  cubeUsers: state.cubes.cubeUsers,
  tofiConstants: state.generalData.tofiConstants
});

export default connect(mapStateToProps, { submit, getCube })(ProfileScreen);
