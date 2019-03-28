import React from 'react';
import Icon from "antd/es/icon/index";

export const UploadWithButton = ({ onChange, multiple, text, accept }) => (
  <label>
    <input type="file" multiple={multiple} style={{ display: 'none' }} onChange={onChange} accept={accept}/>
    <span className='ant-btn ant-btn-primary'><Icon type='upload'/> <span>{text}</span></span>
  </label>
);