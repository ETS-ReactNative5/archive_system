import React from 'react';
import { Table } from 'antd';
import { connect } from 'react-redux';
import {getCube} from "../../../actions/actions";
import {DO_FOR_FUND_AND_IK, WORK_PRIORITY} from "../../../constants/tofiConstants";
import Select from "../../Select";
import {uniqBy} from "lodash";
import filterReport from './filterReport';
import viewReports from './viewReports';

class Reports extends React.Component {

    state = {
        loading: false,
        columns: [],
        data: [],
        reportTypeOptions: [
            {
                value:'otchet1',
                label:'Книга учета поступлений документ',
            },
            {
                value:'otchet2',
                label:'Список фондов',
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
        periodTypeOptions: [],
        filter: {
            reportType: null,
            periodValue: null,
            periodType: null
        }
    };

    componentDidMount() {
        this.setState({ loading: true });
        this.props.getCube('cubeReports');
    }

    getCubeAct = () => {
        this.setState({ loading: true });
        const { reportType, periodValue } = this.state.filter;
        const filters = {
            filterDOAnd: [{
                dimConst: 'doReports',
                concatType: "and",
                conds: [{
                    ids: reportType.value
                }]
            }],
            filterDTOr: [{
                dimConst: 'dtCubeArchive',
                concatType: 'and',
                conds: [{
                    ids: periodValue.value
                }]
            }]
        };
        this.props.getCube('cubeReports', JSON.stringify(filters));
    };

    onSelectChange = c => s => {
        if (c === 'periodType') {
            const dtCubeArchive = this.props.tofiConstants.dtCubeArchive;
            const periodValueOptions = s ? this.props.cubeReports[`dt_${dtCubeArchive.id}`]
                .filter(dt => dt.periodType == s.value)
                .map(dt => ({value: dt.id, label: dt.name[this.lng]})) : [];
            this.setState({periodValueOptions});
        }
        this.setState({filter: {...this.state.filter, [c]: s}});
        this.state.filter.reportType && this.state.filter.periodValue && this.getCubeAct()
    };

    componentDidUpdate(prevProps) {
        const { doReports, dpReportsProp, dpReportsFactor, dtCubeArchive } = this.props.tofiConstants;
        if(prevProps.cubeReports != this.props.cubeReports) {
            const dpReportsPropColumns = [
                {
                    key: 'name',
                    title: '',
                    dataIndex: 'name',
                    width: '15%'
                },
                {
                    key: 'nameMeasure',
                    title: '',
                    dataIndex: 'nameMeasure',
                    width: '10%'
                },
                {
                    key: 'value',
                    title: '',
                    dataIndex: 'value',
                    width: '5%'
                }
            ];
            debugger;
            console.log(this.props.cubeReports)
            const columns = dpReportsPropColumns.concat(this.props.cubeReports[`dp_${dpReportsFactor.id}`]
                .map((dp, _, arr) => ({
                    key: dp.id,
                    title: dp.name[this.lng],
                    dataIndex: dp.id,
                    width: `${70 / arr.length}%` //30% taken by dpReportsPropColumns
                })));
            const data = this.props.cubeReports[`dp_${dpReportsProp.id}`]
                .map(dp => ({
                    key: dp.id,
                    nameMeasure: dp.nameMeasure,
                    name: dp.name[this.lng]
                }));
            const reportTypeOptions = this.props.cubeReports[`do_${doReports.id}`]
                .map(dimObj => ({
                    value: dimObj.id,
                    label: dimObj.name[this.lng]
                }));
            const periodConsts = ['periodYear','periodHalfYear','periodQuarter','periodMonth'];
            const periodTypeOptions = uniqBy(this.props.cubeReports[`dt_${dtCubeArchive.id}`], 'periodType')
                .map(dimObj => {
                    const period = periodConsts.find(c => this.props.tofiConstants[c].id == dimObj.periodType);
                    return {
                        value: dimObj.periodType,
                        label: period ? this.props.tofiConstants[period].name[this.lng] : `no tofiConstant for ${dimObj.periodType}`
                    }
                });
            this.setState({ columns, data, reportTypeOptions, periodTypeOptions, loading: false })
        }
    }

    render() {
        this.lng = localStorage.getItem('i18nextLng');

        const { data, columns, loading } = this.state;
        const { t } = this.props;
        return (
            <div className='Works'>
                <div className="title"><h2>{t('REPORTS')}</h2></div>
                <div className="Works__heading">
                    <div className="table-header">
                        <div className="label-select">
                            <Select
                                name="reportType"
                                isSearchable={false}
                                value={this.state.filter.reportType}
                                onChange={this.onSelectChange("reportType")}
                                options={this.state.reportTypeOptions}
                                placeholder={t('Тип отчета')}
                            />
                        </div>
                        <div className="label-select">
                            <Select
                                name="periodType"
                                isSearchable={false}
                                value={this.state.filter.periodType}
                                onChange={this.onSelectChange("periodType")}
                                options={this.state.periodTypeOptions}
                                placeholder={t('Тип периода')}
                            />
                        </div>
                        <div className="label-select">
                            <Select
                                name="periodValue"
                                isSearchable={false}
                                value={this.state.filter.periodValue}
                                onChange={this.onSelectChange("periodValue")}
                                options={this.state.periodValueOptions}
                                placeholder={t('Значение периода')}
                            />
                        </div>
                    </div>
                </div>
                <div className="Works__body">
                    <Table
                        scroll={{ y: '100%' }}
                        loading={loading}
                        columns={columns}
                        dataSource={data}
                    >
                        <filterReport/>
                        <viewReports/>
                    </Table>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        cubeReports: state.cubes.cubeReports,
        tofiConstants: state.generalData.tofiConstants
    }
}

export default connect(mapStateToProps, { getCube })(Reports);