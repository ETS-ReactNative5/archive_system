import React from "react";
import Select, { createFilter, components } from "react-select";
import CreatableSelectComp from 'react-select/lib/Creatable';

const stringify = option => option.label;
export const customFilter = createFilter({
  ignoreCase: true,
  trim: false,
  stringify
});

export const MultiValueLabel = props => {
  const { children } = props;
  return (
    <div title={children} children={children.slice(0, 5) + '...'} />
  );
};

export const SingleValue = ({ children, ...props }) => (
  <components.SingleValue {...props}>
    <span title={children}>{children}</span>
  </components.SingleValue>
);

export default (props) => <Select
  components={{ MultiValueLabel, SingleValue }}
  className={'react-select-container ' + (props.selectClassName || '')}
  classNamePrefix='react-select'
  isClearable
  isDisabled={!!props.disabled}
  {...props}
  filterOption={customFilter}
/>

export const CreatableSelect = props => <CreatableSelectComp
  components={{ MultiValueLabel }}
  className={'react-select-container ' + (props.selectClassName || '')}
  classNamePrefix='react-select'
  isClearable
  isDisabled={!!props.disabled}
  {...props}
/>

