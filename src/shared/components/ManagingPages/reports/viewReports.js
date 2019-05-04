import React from 'react';
import { Table } from 'antd';
import {connect} from "react-redux";
import {Component} from "react/lib/ReactBaseClasses";

class viewReports extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
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
            <Table
                columns={columns}
                dataSource={data}
                bordered
            />
        )
    }
}
export default connect (viewReports);