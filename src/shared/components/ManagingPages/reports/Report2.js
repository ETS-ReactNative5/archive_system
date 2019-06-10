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
        quarters: [
            {
                value: 1,
                label: "1 квартал"
            },
            {
                value: 2,
                label: "2 квартал"
            },
            {
                value: 3,
                label: "3 квартал"
            },
            {
                value: 4,
                label: "4 квартал"
            },
            {
                value: 5,
                label: "Год"
            },
        ],
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
        if (quarter === null) {
            this.setState({
                starttDate: "",
                endDate: "",
                year: "",
                quarter: null
            })
            return false
        }
        // if (quarter.value ===5){
        //     this.setState({
        //         starttDate:moment().startOf('year').format("YYYY-MM-DD"),
        //         endDate:moment().endOf('year').format("YYYY-MM-DD"),
        //         quarter:quarter
        // })
        //     return false
        // }
        // const start = moment().quarter(quarter.value).startOf('quarter').format("YYYY-MM-DD");
        //
        // const end = moment().quarter(quarter.value).endOf('quarter').format("YYYY-MM-DD");
        this.setState({
            quarter: quarter
        })
    }
    // onChangeYear=(e)=>{
    //     if (!!e.target.value) {
    //
    //
    //         let year = e.target.value.replace(/\D/g, '').substr(0, 4)
    //         if (!!year) {
    //
    //             this.setState({
    //                 year: year
    //             })
    //         } else {
    //             this.getQuarterRange(this.state.quarter)
    //         }
    //     }else {
    //         this.setState({
    //             year: ""
    //         })
    //     }
    //
    // }
    // onSelectChangeReoprtType=(e)=>{
    //     let filter = {...this.state.filter}
    //
    //     if(!!e){
    //         filter.reportType = e
    //         this.setState({
    //             filter:filter,
    //         })
    //     }else {
    //         filter.reportType = {
    //             value:"",
    //             label:""
    //         }
    //     }
    //
    //
    // }
    // submitFilt=()=>{
    //     if (this.state.year.length <4){
    //         return false
    //     }
    //     if (this.state.quarter.value ===5){
    //         let startDate = this.state.year + this.state.starttDate.slice(4)
    //         let newYar = Number(this.state.year) +1
    //         let endDate = String(newYar) + this.state.endDate.slice(4)
    //         this.setState({
    //             starttDate:startDate,
    //             endDate:endDate,
    //         })
    //         return false
    //
    //     }
    //     let startDate = this.state.year + this.state.starttDate.slice(4)
    //     let endDate = this.state.year + this.state.endDate.slice(4)
    //     this.setState({
    //         starttDate:startDate,
    //         endDate:endDate,
    //     })
    // }
    // updateTable=(filter)=>{
    //     this.setState({
    //         filterTable:filter
    //     })
    // }
    // getData=(data)=>{
    //     this.setState({
    //         data:data,
    //         showReport:true
    //     })
    // }
    // getSpiner=(data)=>{
    //     this.setState({
    //         loading:data
    //     })
    // }
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

                    <div className="title"><h2>{t('REPORTS')}</h2></div>
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
                            {/*<div className="label-select">*/}
                            {/*<Input*/}
                            {/*name="periodValue"*/}
                            {/*onChange={this.onChangeYear}*/}
                            {/*value={this.state.year}*/}
                            {/*disabled={!this.state.quarter}*/}
                            {/*placeholder={t('Значение периода')}*/}
                            {/*/>*/}
                            {/*</div>*/}
                            {/*<div className="">*/}

                            {/*<Button type="primary"  onClick={this.submitFilt}*/}
                            {/*>Применить</Button>*/}
                            {/*</div>*/}
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
                    {/*<div className="report_body">*/}
                    {/*<FilterReport updateTable={this.updateTable} getSpiner={this.getSpiner} getData={this.getData} filterType={this.state.filter} {...this.props}/>{this.state.showReport === true? <ViewReports filterType={this.state.filter} filter={this.state.filterTable} data={this.state.data} />  :""}*/}
                    {/*</div>*/}

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

