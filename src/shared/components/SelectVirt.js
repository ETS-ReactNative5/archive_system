import React from "react";
import { List } from "react-virtualized";
import Select, { createFilter } from "react-select";
import {customFilter, MultiValueLabel, SingleValue} from "./Select";

const MenuList = props => {
  return (
    <List
      width={300}
      height={props.options.length > 1 ? 300 : 40}
      rowCount={props.options.length}
      rowHeight={40}
      rowRenderer={({ key, index, style }) => {
        return (
          <div title={props.children[index] && props.children[index].props.children} key={key} style={{...style, whiteSpace: 'nowrap'}}>
            {props.children[index]}
          </div>
        );
      }}
    />
  );
};

export default (props) => <Select
  isClearable
  filterOption={customFilter}
  components={{ MenuList, MultiValueLabel, SingleValue }}
  className={'react-select-container long-selected-menu ' + (props.selectClassName || '')}
  classNamePrefix='react-select'
  isDisabled={!!props.disabled}
  {...props}
/>
