import { Select } from 'antd';
import React from 'react';

const Option = Select.Option;

const _renderOptions = (item, idx) => {
  return <Option key={idx}> {item} </Option>
};

const MultipleSelect = (props) => {
  const { placeholder, defaultValue, onChange, data, className } = props;
  return(
    <Select
      className={className}
      mode="multiple"
      placeholder={placeholder}
      defaultValue={defaultValue}
      onChange={onChange}
    >
      {data.map(_renderOptions)}
    </Select>
  )
};

export default MultipleSelect;
