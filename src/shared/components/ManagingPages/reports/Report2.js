import React from 'react';
import Select from "../../Select";
import FilterReport from './FilterReport';
import ViewReports from './ViewReports';

class Report2 extends React.Component {

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

    render() {
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
                                // onChange={this.onSelectChange("reportType")}
                                options={this.state.reportTypeOptions}
                                placeholder={t('Тип отчета')}
                            />
                        </div>
                        <div className="label-select">
                            <Select
                                name="periodType"
                                isSearchable={false}
                                value={this.state.filter.periodType}
  //                              onChange={this.onSelectChange("periodType")}
                                options={this.state.periodTypeOptions}
                                placeholder={t('Тип периода')}
                            />
                        </div>
                        <div className="label-select">
                            <Select
                                name="periodValue"
                                isSearchable={false}
                                value={this.state.filter.periodValue}
    //                            onChange={this.onSelectChange("periodValue")}
                                options={this.state.periodValueOptions}
                                placeholder={t('Значение периода')}
                            />
                        </div>
                    </div>
                </div>
                <div className="Works__body">
                   <FilterReport/>
                   <ViewReports/>
                </div>
            </div>
        )
    }
}

export default Report2;