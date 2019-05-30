import React from 'react';
import {Button, Input, Radio} from 'antd';
import { getPropValByConst } from '../../../actions/actions'
import GetWorkDescription from "./GetWorkDescription";

const TextArea = Input.TextArea;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class WorkDescription extends React.PureComponent {

  state = {
    workDescription: {
      kz: '',
      en: '',
      ru: ''
    },
    lang: localStorage.getItem('i18nextLng'),
    dirty: false
  };

  onLangChange = e => {
    this.setState({lang: e.target.value})
  };

  onChange = e => {
    this.setState({
      workDescription: {
        ...this.state.workDescription,
        [this.state.lang]: e.target.value
      },
      dirty: true
    })
  };

  componentDidMount() {

  }

  initialState = this.state;

  cancel = () => {
    this.setState(this.initialState);
  };

  render() {
    const { t } = this.props;
    return (
        <div>
          <GetWorkDescription
              initialValues={this.props.initialValues}
          t={t}
          />
        </div>
    )
  }
}

export default WorkDescription;