import React from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import Workbook from 'react-excel-workbook'

const renderColumns = item =>
  <Workbook.Column
    key={item.key}
    label={item.title}
    value={item.render
      ? row => item.render(row[item.dataIndex], row)
      : item.dataIndex}
  />;

export const ExcelLoader = ({ columns, data, el, filename, sheetName }) => (
  <Workbook filename={filename || 'no-name.xlsx'} element={el || <Button icon='download'>Excel</Button>} >
    <Workbook.Sheet data={data} name={sheetName || 'first'}>
      {columns.map(renderColumns)}
    </Workbook.Sheet>
  </Workbook>
);

ExcelLoader.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string,
      dataIndex: PropTypes.any,
      render: PropTypes.any
    }).isRequired,
  ).isRequired,
  data: PropTypes.array.isRequired,
  sheetName: PropTypes.string,
  filename: PropTypes.string,
  el: PropTypes.element
};