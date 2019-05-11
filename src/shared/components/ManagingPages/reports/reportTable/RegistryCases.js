import '../ReportStyle.css';
import React from 'react';
import AntTable from "../../../AntTable";


class  RegistryCases extends React.Component {

    render (){
        this.lng = localStorage.getItem("i18nextLng");
        return(
                <div className='common_report'>
                    <h1 style={{textAlign:"center",marginBottom:"10px"}}>Реестр описей дел, документов</h1>
                    <AntTable
                        loading={false}
                        columns = {[{
                            width:'8%',
                            title: 'Порядковый №',
                            className: 'column-money',
                            dataIndex: 'fundNumber',
                            key:"fundNumber",
                        }, {
                            width:'8%',
                            title: 'Номер фонда',
                            className: 'column-money',
                            dataIndex: 'fundFirstDocFlow',
                            key:"fundFirstDocFlow",


                        }, {
                            width:'10%',
                            title: 'Номер и название описи',
                            className: 'column-money',
                            dataIndex: 'name',
                            key:"name",
                        },  {
                            width:'14%',
                            title: 'Количество ед. хр.',
                            className: 'column-money',
                            dataIndex: 'fundFeature',
                            key:"fundFeature",
                            children:[{
                                width:'7%',
                                title: 'Всего',
                                className: 'column-money',
                            },{
                                width:'7%',
                                title: 'В том числе по личному составу',
                                className: 'column-money',
                            }
                            ]
                        }, {
                            width:'10%',
                            title: 'Крайние даты',
                            className: 'column-money',
                        }, {
                            width:'10%',
                            title: 'Количество экземпляров',
                        }, {
                            width:'10%',
                            title: 'Примечания',
                            className: 'column-money',
                        },
                        ]}
                        dataSource={this.props.data}
                        bordered
                        // pagination={false}
                    />
                <div className='view_text'>
                    <p>Итоги на 01 01 года <span>   ggggggggggggggggg </span>фондов</p>
                    <p>в том числе поступило за .... года <span>Из работы по приему дел вытащить количество поступи </span>фондов</p>
                    <p>выбило за .... года <span>Из работы по выбытию дел вытащить количество поступи </span>фондов</p>

                </div>
            </div>
        )
    }
}



export default RegistryCases;