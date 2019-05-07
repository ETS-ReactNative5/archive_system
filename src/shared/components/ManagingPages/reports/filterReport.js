import React from 'react';
import Select from "../../Select";
import { Button } from 'antd';

class FilterReport extends React.Component {
        state = {
            reportArchiveOptions: [],
            typeFondsOptions: [],
            reportAvailabilityOptions: [],
            reportIndexOptions: [],
            reportCategoryOptions: [],
            dateFirstEntryOptions: [],
            filter: {
                reportArchive: null,
                typeFonds: null,
                reportAvailability: null,
                reportIndex: null,
                reportCategory: null,
                dateFirstEntry: null,
            }
    }
    render (){
        // this.lng = localStorage.getItem('i18nextLng');
        //
        // const { data, columns, loading } = this.state;
        // const { t } = this.props;

        return(
                <div className="public_filters">
                    <p>Фильтры данных</p>
                    <div className="label-select">
                        <Select
                            name="reportArchive"
                            isSearchable={false}
                            value={this.state.filter.reportArchive}
                            // onChange={this.onSelectChange("reportType")}
                            options={this.state.reportArchiveOptions}
                            placeholder={'Архив'}
                        />
                    </div>
                    <div className="label-select">
                        <Select
                            name="reportArchive"
                            isSearchable={false}
                            value={this.state.filter.typeFonds}
                            // onChange={this.onSelectChange("reportType")}
                            options={this.state.typeFondsOptions}
                            placeholder={'Тип фонда'}
                        />
                    </div>
                    <div className="label-select">
                        <Select
                            name="reportArchive"
                            isSearchable={false}
                            value={this.state.filter.reportAvailability}
                            // onChange={this.onSelectChange("reportType")}
                            options={this.state.reportAvailabilityOptions}
                            placeholder={'Признак наличия в учете'}
                        />
                    </div>
                    <div className="label-select">
                        <Select
                            name="reportArchive"
                            isSearchable={false}
                            value={this.state.filter.reportIndex}
                            // onChange={this.onSelectChange("reportType")}
                            options={this.state.reportIndexOptions}
                            placeholder={'Индекс'}
                        />
                    </div>
                    <div className="label-select">
                        <Select
                            name="reportArchive"
                            isSearchable={false}
                            value={this.state.filter.reportCategory}
                            // onChange={this.onSelectChange("reportType")}
                            options={this.state.reportCategoryOptions}
                            placeholder={'Категория фонда'}
                        />
                    </div>
                    <div className="label-select">
                        <Select
                            name="reportArchive"
                            isSearchable={false}
                            value={this.state.filter.dateFirstEntry}
                            // onChange={this.onSelectChange("reportType")}
                            options={this.state.dateFirstEntryOptions}
                            placeholder={'Дата первого поступления'}
                        />
                    </div>
                    <div className="report_button">
                        <Button>Сформировать</Button>
                        <Button>Отменить</Button>
                    </div>
                </div>
        )
    }
}




export default FilterReport;