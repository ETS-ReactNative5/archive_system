import React from 'react';
import { Table } from 'antd';
import AntTable from "../../AntTable";

class ViewReports extends React.Component {
    render (){
        const columns = [{
            title: 'Номер фонда',
            className: 'column-money',
            dataIndex: 'numbFond',
        }, {
            title: 'Дата первого поступления',
            className: 'column-money',
            dataIndex: 'dataFEntry',
        }, {
            title: 'Название фонда',
            className: 'column-money',
            dataIndex: 'nameFond',
        },  {
            title: 'Отметка о выбытии',
            className: 'column-money',
            dataIndex: 'retMark',
        }, {
            title: 'Примечания',
            className: 'column-money',
            dataIndex: 'notes',
        },
        ];
        const data = [{
            key: '1',
            numbFond: 'John Brown',
            dataFEntry: '￥300,000.00',
            nameFond: 'New York No. 1 Lake Park',
            retMark: '',
            notes: ''
        }, {
            key: '2',
            numbFond: 'Jim Green',
            dataFEntry: '￥1,256,000.00',
            nameFond: 'London No. 1 Lake Park',
            retMark: '',
            notes: ''
        }, {
            key: '3',
            numbFond: 'Joe Black',
            dataFEntry: '￥120,000.00',
            nameFond: 'Sidney No. 1 Lake Park',
            retMark: '',
            notes: ''
        }];
        return(
            <div className='common_report'>
                <AntTable
                    loading={false}
                    columns={columns}
                    dataSource={data}
                    bordered
                />
            </div>
        )
    }
}
export default ViewReports;