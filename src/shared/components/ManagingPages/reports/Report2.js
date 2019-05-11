import React from 'react';
import Select from "../../Select";
import FilterReport from './FilterReport';
import ViewReports from './reportTable/ViewReports';
import './ReportStyle.css';
import { Spin, Input, Button, DatePicker } from 'antd';
import moment from "moment";
import Axios from"axios"
import connect from "react-redux/es/connect/connect";

class Report2 extends React.Component {

    state = {
        loading: false,
        columns: [],
        data: [],
        apiTypeReport:`/${localStorage.getItem('i18nextLng')}/report/getReports`,
        reportTypeOptions: [
            {
                value:'otchet1',
                label:'Книга учета поступлений документ',
            },
            {
                value:'cubeForFundAndIK',
                label:'Список фондов',
                data:{
                    cube:"cubeForFundAndIK",
                    dp:"dpForFundAndIK",
                    clss:"fundOrg,fundLP,collectionOrg,collectionLP,jointOrg,jointLP",
                    do:"doForFundAndIK",
                    constTofi1:"doForFundAndIK",
                    constTofi2:"dpForFundAndIK",
                    prop:"fundArchive,fundFeature,fundIndex,fundCategory,fundFirstDocFlow,fundNumber,foundFeature-excluded"
                }
            },
            {
                value:'otchet3',
                label:'Лист фонда',
            },
            {
                value:'otchet4',
                label:'Лист учета аудиовизиуальных документов',
            },
            {
                value:'otchet5',
                label:'Опись дел, документов',
            },
            {
                value:'otchet6',
                label:'Инвентарная  книга учета дел',
            },
            {
                value:'otchet7',
                label:'Паспорт архивохранилища',
            },
            {
                value:'otchet8',
                label:'Лист учета и описания документа',
            },
            {
                value:'otchet9',
                label:'Реестр описей дел',
            },
            {
                value:'otchet10',
                label:'Список фондов',
            },
            {
                value:'otchet11',
                label:'Опсиь особо ценных дел',
            },
            {
                value:'otchet12',
                label:'Реестр описей особо ценных дел',
            },
            {
                value:'otchet13',
                label:'Книга учета поступлений страхового фонда',
            },
            {
                value:'otchet14',
                label:'Опсиь страхового фонда',
            },
            {
                value:'otchet15',
                label:'Дело фонда',
            },
            {
                value:'otchet16',
                label:'Лист-заверитель дела-для учета',
            },
            {
                value:'otchet17',
                label:'Внутренняя опись документов дел',
            },
        ],
        periodValueOptions: [],
        quarters: [
            {
                value:1,
                label:"1 квартал"
            },
            {
                value:2,
                label:"2 квартал"
            },
            {
                value:3,
                label:"3 квартал"
            },
            {
                value:4,
                label:"4 квартал"
            },
            {
                value:5,
                label:"Год"
            },
        ],
        filter: {
            reportType: {
                value:'',
                label:''
            },
            periodValue: null,
            periodType: null
        },
        showReport:false,
        filterTable:{},
        starttDate:"",
        endDate:"",
        yerrDate:"",
        quarter:null,
        year:"",
        dateReport:moment().format("YYYY-MM-DD")

    };

    componentDidUpdate(){
        this.getReportType()
    }
    getReportType=()=>{
        const fd = new FormData();
        fd.append("authUser", this.props.user.id);
        fd.append("dte", this.state.dateReport);
        Axios.post(this.state.apiTypeReport,fd)
            .then(res=>{
                debugger
            })
            .catch(err=>{
                console.log(err)
            })
    }
    getQuarterRange=(quarter)=> {
        if (quarter === null){
            this.setState({
                starttDate:"",
                endDate:"",
                year:"",
                quarter:null
            })
            return false
        }
        if (quarter.value ===5){
            this.setState({
                starttDate:moment().startOf('year').format("YYYY-MM-DD"),
                endDate:moment().endOf('year').format("YYYY-MM-DD"),
                quarter:quarter
        })
            return false
        }
        const start = moment().quarter(quarter.value).startOf('quarter').format("YYYY-MM-DD");

        const end = moment().quarter(quarter.value).endOf('quarter').format("YYYY-MM-DD");
        this.setState({
            starttDate:start,
            endDate:end,
           quarter:quarter
        })
    }
    onChangeYear=(e)=>{
        if (!!e.target.value) {


            let year = e.target.value.replace(/\D/g, '').substr(0, 4)
            if (!!year) {

                this.setState({
                    year: year
                })
            } else {
                this.getQuarterRange(this.state.quarter)
            }
        }else {
            this.setState({
                year: ""
            })
        }

    }
    onSelectChangeReoprtType=(e)=>{
        let filter = {...this.state.filter}

        if(!!e){
            filter.reportType = e
            this.setState({
                filter:filter,
            })
        }else {
            filter.reportType = {
                value:"",
                label:""
            }
        }


    }
    submitFilt=()=>{
        if (this.state.year.length <4){
            return false
        }
        if (this.state.quarter.value ===5){
            let startDate = this.state.year + this.state.starttDate.slice(4)
            let newYar = Number(this.state.year) +1
            let endDate = String(newYar) + this.state.endDate.slice(4)
            this.setState({
                starttDate:startDate,
                endDate:endDate,
            })
            return false

        }
        let startDate = this.state.year + this.state.starttDate.slice(4)
        let endDate = this.state.year + this.state.endDate.slice(4)
        this.setState({
            starttDate:startDate,
            endDate:endDate,
        })
    }
    updateTable=(filter)=>{
        this.setState({
            filterTable:filter
        })
    }
    getData=(data)=>{
        this.setState({
            data:data,
            showReport:true
        })
    }
    getSpiner=(data)=>{
        this.setState({
            loading:data
        })
    }
    dateReport=(mom, data)=>{
        this.setState({
            dateReport:data
        },()=>{
            this.getReportType()

        })

    }
    render() {
        const { t } = this.props;
        return (
            <div className='Works'>
                <Spin spinning={this.state.loading}  >

                <div className="title"><h2>{t('REPORTS')}</h2></div>
                <div className="Works__heading">
                    <div className="table-header ">
                        <div className="label-select">
                            <Select
                                name="reportType"
                                isSearchable={false}
                                onChange={this.onSelectChangeReoprtType}
                                options={this.state.reportTypeOptions}
                                placeholder={'Тип отчета'}
                            />
                        </div>

                        <div className="label-select">
                            <DatePicker
                                name="periodType"
                                onChange={this.dateReport}
                                defaultValue={moment()}
                                placeholder={t('Период')}
                            />
                        </div>


                        {/*<div className="label-select">*/}
                            {/*<Select*/}
                                {/*name="periodType"*/}
                                {/*isSearchable={false}*/}
                                {/*onChange={this.getQuarterRange}*/}
                                {/*options={this.state.quarters}*/}
                                {/*placeholder={t('Тип периода')}*/}
                            {/*/>*/}
                        {/*</div>*/}
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
                    <div className="report_body">
                        <FilterReport updateTable={this.updateTable} getSpiner={this.getSpiner} getData={this.getData} filterType={this.state.filter} {...this.props}/>{this.state.showReport === true? <ViewReports filterType={this.state.filter} filter={this.state.filterTable} data={this.state.data} />  :""}
                    </div>

                </Spin>

            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.auth.user,
    };
}

export default connect(
    mapStateToProps,
    {}
)(Report2);

