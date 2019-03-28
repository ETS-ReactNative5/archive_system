import React from 'react';
import {Button, Input, Radio} from 'antd';

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

  initialState = this.state;

  cancel = () => {
    this.setState(this.initialState);
  };

  render() {
    const { tofiConstants: {workDescription}, t } = this.props;
    return (
      <div className="work-description">
        <RadioGroup onChange={this.onLangChange} value={this.state.lang}>
          <RadioButton value="kz">KZ</RadioButton>
          <RadioButton value="ru">RU</RadioButton>
          <RadioButton value="en">EN</RadioButton>
        </RadioGroup>
        <TextArea placeholder="Description" autosize={{ minRows: 2 }} value={this.state.workDescription[this.state.lang]} onChange={this.onChange} style={{marginTop: '10px'}}/>
        {this.state.dirty && (
          <div className="ant-form-btns">
            <Button className="signup-form__btn" type="primary">
              { t('SAVE') }
            </Button>
            <Button className="signup-form__btn" type="danger"style={{marginLeft: '10px'}} onClick={this.cancel}>
              { t('CANCEL') }
            </Button>
          </div>
        )}
      </div>
    )
  }
}

export default WorkDescription;