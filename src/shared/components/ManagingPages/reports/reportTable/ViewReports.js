import React from 'react';
import { Table } from 'antd';
import AntTable from "../../../AntTable";
import '../ReportStyle.css';

class ViewReports extends React.Component {
    render (){
        this.lng = localStorage.getItem("i18nextLng");
        let {filter} = this.props
        console.log(filter)
        var FilteredData = this.props.data.filter(item => {
            if (Object.keys(filter).length !== 0){
                return(

                    // (!filter.fundNumber ||!item.fundNumber ||item.fundNumber.value == filter.fundNumber) &&
                     (item.fundIndex && filter.fundIndex ? item.fundIndex.value.toLowerCase().includes(filter.fundIndex.toLowerCase()) : filter.fundIndex === "") &&
                     ( item.fundFirstDocFlow ? item.fundFirstDocFlow.value.toLowerCase().includes(filter.dateFirstEntry.toLowerCase()) : true) &&
                    (filter.fundCategory.length === 0 || filter.fundCategory.some(p => item.fundCategory && p.value === item.fundCategory.value)) &&
                    (filter.fundArchive.length === 0 || filter.fundArchive.some( p => item.fundArchive && p.value === item.fundArchive.value )) &&

                    (filter.fundFeature.length === 0 ||filter.fundFeature.some(p => item.fundFeature && p.value === item.fundFeature.value)) &&
                     (filter.fundType.length === 0 ||filter.fundType.some(p => item.fundType && p.value === item.fundType.value)) //&&
                    // (filter.fundIndustryObj.length === 0 || filter.fundIndustryObj.some(p => p.value == item.fundIndustry.value))
                );
            }else {
                return true
            }

    });



        return(
            <div className='common_report'>
                <h1 style={{textAlign:"center",marginBottom:"10px"}}>{ this.props.filterType.reportType.label}</h1>
                <AntTable
                    loading={false}
                    columns = {[{
                        width:'20%',
                        title: 'Номер фонда',
                        className: 'column-money',
                        dataIndex: 'fundNumber',
                        key:"fundNumber",
                        render: (obj, val) => obj && obj.value
                    },
                        {
                width:'20%',
                title: 'Дата первого поступления',
                className: 'column-money',
                dataIndex: 'fundFirstDocFlow',
                key:"fundFirstDocFlow",
                render: obj => { return obj && obj.value}


            },
                        {
                            width:'10%',
                            title: 'Индекс',
                            className: 'column-money',
                            dataIndex: 'fundIndex',
                            key:"fundIndex",
                            render: obj => { return obj && obj.value}


                        },

                        {
                width:'20%',
                title: 'Название фонда',
                className: 'column-money',
                dataIndex: 'name',
                key:"name",
                render: obj => { return obj && obj[this.lng]}
            },  {
                width:'20%',
                title: 'Отметка о выбытии',
                className: 'column-money',
                dataIndex: 'fundFeature',
                key:"fundFeature",
                render: obj => obj && obj.label
            }, {
                width:'20%',
                title: 'Примечания',
                className: 'column-money',
                dataIndex: 'notes',
                key:"notes"
            },
                ]}
                    dataSource={FilteredData}
                    bordered
                    // pagination={false}
                />
                <div className='view_text'>
                    <p>Итоги на 01 01 года <span>  {FilteredData.length}  </span>фондов</p>
                    <p>в том числе поступило за .... года <span>Из работы по приему дел вытащить количество поступи </span>фондов</p>
                    <p>выбило за .... года <span>Из работы по выбытию дел вытащить количество поступи </span>фондов</p>

                </div>
            </div>
        )
    }
}
export default ViewReports;