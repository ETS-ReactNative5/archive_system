import React from 'react';
import FilterReport from './FilterReport';
import ViewReports from './reportTable/ViewReports';
import './ReportStyle.css';
import {Spin, Input, Button, message, Select, DatePicker} from 'antd';
import moment from "moment";
import Axios from "axios"
import connect from "react-redux/es/connect/connect";
import AntTable from "../../AntTable";
import {CSSTransition} from "react-transition-group";
import SiderCard from "./SiderCardReport";
import Card from "./card/CardReport"
import {isEqual} from "lodash";

const {Option} = Select;

class Report2 extends React.Component {

    state = {
        loading: false,
        columns: [],
        data: [],
        openCard: false,
        apiTypeReport: `/${localStorage.getItem('i18nextLng')}/report/getReports`,
        reportTypeOptions: [],
        periodSlovar: [],
        filter: {
            reportType: {
                value: '',
                label: ''
            },
            periodValue: null,
            periodType: null
        },
        showReport: false,
        filterTable: {},
        starttDate: "",
        selectedRow: [],
        endDate: "",
        yerrDate: "",
        quarter: 11,
        year: "",
        objDefult: {},
        dateReport: moment().format("YYYY-MM-DD")

    };

    componentDidMount() {
        this.lng = localStorage.getItem("i18nextLng");
        Axios.get(`/${localStorage.getItem('i18nextLng')}/dict/getPeriodType`).then(res => {
            if (!!res.data.errors) {
                for (let val of res.data.errors) {
                    message.error(val.text)

                }
                return false
            }
            let newObj ={
                label:res.data.data[0].name[this.lng],
                value:res.data.data[0].id
            }
            this.setState({
                periodSlovar: res.data.data,
                objDefult:newObj
            })
        }).catch(e => {
            console.log(e)
        })
        this.getReportType()
    }

    getReportType = () => {
        this.setState({
            loading: true
        })
        const fd = new FormData();
        fd.append("authUser", this.props.user.id);
        fd.append("dte", this.state.dateReport);
        Axios.post(this.state.apiTypeReport, fd)
            .then(res => {
                if (res.data.success===false && res.data.errors){
                    for(let val of  res.data.errors){
                        message.error(val.text)
                    }
                    return false
                }
                this.setState({
                    reportTypeOptions: res.data.data,
                    loading: false
                })
            })
            .catch(err => {
                this.setState({
                    loading: false
                })
                console.log(err)
            })
    }
    getQuarterRange = (quarter) => {
        this.lng = localStorage.getItem("i18nextLng");

        if (quarter === null) {
            this.setState({
                starttDate: "",
                endDate: "",
                year: "",
                quarter: null
            })
            return false
        }
        let defOption = this.state.periodSlovar.find(el=>el.id === quarter)
        this.setState({
            quarter: quarter,
            objDefult:{label:defOption.name[this.lng]}
        })
    }

    dateReport = (mom, data) => {
        this.setState({
            dateReport: data
        }, () => {
            this.getReportType()

        })

    }
    getStartDate = (period, day) => {

        if (!!period && !!String(day)) {
            if (period === 11) {
                return moment().startOf('year').add(day, 'days').format("YYYY-MM-DD");
            }
            if (period === 31) {
                return moment().startOf('quarter').add(day, 'days').format("YYYY-MM-DD");

            }
        } else {
            return "Без даты"
        }
    }
    getEndDate = (period, day) => {

        if (!!period && !!String(day)) {
            if (period === 11) {
                return moment().endOf('year').add(day, 'days').format("YYYY-MM-DD");
            }
            if (period === 31) {
                return moment().endOf('quarter').add(day, 'days').format("YYYY-MM-DD");

            }
        }
        else {
            return "Без даты"
        }
    }
    changeSelectedRow = rec => {
        if (!!this.state.quarter) {
            this.setState({selectedRow: rec});
            this.setState({openCard: true});
        } else {
            message.info("Надо выбрать период ")
        }

    };

    render() {
        const {t} = this.props;
        this.lng = localStorage.getItem("i18nextLng");

        return (
            <div className='Works'>
                <Spin spinning={this.state.loading}>

                    <div className="title"><h2>{t('REPORT')}</h2></div>
                    <div className="Works__heading ">
                        <div className="table-header ">

                            <div className="label-select">
                                <DatePicker
                                    name="periodType"
                                    onChange={this.dateReport}
                                    defaultValue={moment()}
                                    placeholder={'Период'}
                                />
                            </div>


                            <div className="label-select">
                                <Select
                                    name="periodType"
                                    isSearchable={false}
                                    onChange={this.getQuarterRange}
                                    placeholder={t('Тип периода')}
                                    style={{width: "100%"}}
                                    value={this.state.objDefult.label}
                                >
                                    {this.state.periodSlovar && this.state.periodSlovar.map(el => {

                                        return (
                                            <Option key={el.id} value={el.id}>
                                                {el.name[this.lng]}
                                            </Option>
                                        )
                                    })}

                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className='fundsList__body'>
                        {this.state.openCard === false ? (
                            <AntTable

                                loading={false}
                                columns={[{
                                    width: '10%',
                                    title: '№',
                                    className: 'column-money',
                                    dataIndex: 'id',
                                    key: "id",
                                    render: val => {
                                        return val
                                    }
                                },
                                    {
                                        width: '20%',
                                        title: 'Наименование',
                                        className: 'column-money',
                                        dataIndex: 'name',
                                        key: "name",
                                        render: val => {
                                            return val[this.lng]
                                        }

                                    },
                                    {
                                        width: '20%',
                                        title: 'Регулярный',
                                        className: 'column-money',
                                        dataIndex: 'isReg',
                                        key: "isReg",
                                        render: val => {
                                            return val === 1 ? "Да" : "Нет"
                                        }

                                    },

                                    {
                                        width: '20%',
                                        title: 'Период',
                                        className: 'column-money',
                                        dataIndex: 'periodType',
                                        key: "periodType",
                                        render: val => {
                                            let name = ""
                                            for (let item of this.state.periodSlovar) {
                                                if (item.id === val) {
                                                    name = item.name[this.lng]
                                                    break
                                                }
                                            }
                                            if (!!name)
                                                return name
                                            else return "Без периода"
                                        }

                                    }, {
                                        width: '20%',
                                        title: 'Дата начала формирования',
                                        className: 'column-money',
                                        dataIndex: 'lagBegDEnd',
                                        key: "lagBegDEnd",
                                        render: (val, objk) => this.getStartDate(objk.periodType, val)
                                    }, {
                                        width: '20%',
                                        title: 'Дата окончания формирования',
                                        className: 'column-money',
                                        dataIndex: 'lagEndDEnd',
                                        key: "lagEndDEnd",
                                        render: (val, objk) => this.getEndDate(objk.periodType, val)
                                    },
                                ]}
                                dataSource={this.state.reportTypeOptions}
                                bordered
                                onRowClick={this.changeSelectedRow}

                            />
                        ) : ""}

                        <CSSTransition
                            in={this.state.openCard}
                            timeout={1000}
                            classNames="card"
                            unmountOnExit
                        >
                            <SiderCard

                                closer={
                                    <Button
                                        type="danger"
                                        onClick={() => this.setState({openCard: false})}
                                        shape="circle"
                                        style={{left: 0, top: 20}}
                                        icon="arrow-right"
                                    />
                                }
                            >
                                <Card periodType={this.state.quarter} dateReport={this.state.dateReport}
                                      initialValues={this.state.selectedRow} {...this.props}/>

                            </SiderCard>
                        </CSSTransition>
                    </div>
                </Spin>

            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.auth.user,
        tofiConstants: state.generalData.tofiConstants,
    };
}

export default connect(
    mapStateToProps,
    {}
)(Report2);

