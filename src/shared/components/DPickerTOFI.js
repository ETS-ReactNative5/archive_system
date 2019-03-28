/**
 * Created by Mars.Gabbasov on 27.01.2019.
 */
import React from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';

export const acceptedTOFIDate = value => (value.isAfter(moment('1800-01-01')) && value.isBefore(moment('3333-12-31')))

const DPickerTOFI = ({ value, ...rest }) => {
  const tofiValue = value
  &&  acceptedTOFIDate(value)
    ? value
    : null
  return <DatePicker value={tofiValue} {...rest} />
}
export default DPickerTOFI
