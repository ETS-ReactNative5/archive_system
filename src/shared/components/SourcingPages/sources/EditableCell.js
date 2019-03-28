/**
 * Created by Mars on 29.11.2018.
 */

import React from 'react';
import {Icon, Input} from 'antd';
import { General } from '../../../utils/axios_config';



class EditableCell extends React.Component {
  state = {
    value: this.props.value,
    editable: false,
  };
  handleChange = (e) => {
    const value = e.target.value;
    this.setState({ value });
  };
  check = () => {
    this.setState({ editable: false });
    if (this.props.onChange) {
      General.saveValueCell();

      console.log(this.state.value);
    }
  };
  edit = () => {
    this.setState({ editable: true });
  };
  componentWillReceiveProps(nextProps) {
    if(nextProps.value) {
      this.setState({ value: nextProps.value })
    }
  }
  render() {
    const { value, editable } = this.state;
    return ( <div className="editable-cell">
        {
          editable ?
            <div className="editable-cell-input-wrapper">
              <Input
                value={value}
                onChange={this.handleChange}
                onPressEnter={this.check}
                />
              <Icon
                type="check"
                className="editable-cell-icon-check"
                onClick={this.check}
                />
            </div>
            :
            <div className="editable-cell-text-wrapper">
              {value || ' '}
              <Icon
                type="edit"
                className="editable-cell-icon"
                onClick={this.edit}
                />
            </div>
        }
      </div>
    );
  }
}

export default EditableCell;
