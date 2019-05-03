/**
 * Created by Mars.Gabbasov on 27.01.2019.
 */
import React from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';

export const acceptedTOFIDate = value => {
  if(value instanceof moment){
      return   value.isAfter(moment('1800-01-01')) && value.isBefore(moment('3333-12-31'))
  }else {
    return moment(value.value).isAfter(moment('1800-01-01')) && moment(value.value).isBefore(moment('3333-12-31'))

  }
}

const DPickerTOFI = ({ value, ...rest }) => {
     if (!!value){
        if (!!value.value ){
            value.value= moment(value.value,"DD-MM-YYYY")

        }else{
            value= moment(value,"DD-MM-YYYY")

        }
    }

   const tofiValue = value
  &&  acceptedTOFIDate(value)
    ? value
    : null
    if(value instanceof moment){
        return <DatePicker value={tofiValue} {...rest} />

    }if (tofiValue ===null){
        return <DatePicker value={tofiValue} {...rest} />

    } if(tofiValue.value!== undefined){
        return <DatePicker value={tofiValue.value} {...rest} />

    }if(tofiValue.value === undefined){
        return <DatePicker value={tofiValue} {...rest} />
    }
}
export default DPickerTOFI
