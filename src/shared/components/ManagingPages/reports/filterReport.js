import React from 'react';
import Select from "../../Select";

import {Button, Input} from 'antd';
import './ReportStyle.css';
import {DatePicker} from 'antd';
import {
    getCube,
    getFundCountData,
    getPropValWithChilds,
    getPropVal,
    createObj,
    updateCubeData,
    dObj,
    getObjListNew
} from "../../../actions/actions";
import connect from "react-redux/es/connect/connect";
import {isEmpty} from "lodash";
import {parseCube_new, parseForTable} from "../../../utils/cubeParser";
import moment from "moment";


class FilterReport extends React.Component {
    state = {
        reportArchiveOptions: [],
        typeFondsOptions: [],
        reportAvailabilityOptions: [],
        reportIndexOptions: [],
        fondCategoryOptions: [],
        fundIndexOptions: [],
        dateFirstEntryOptions: [],
        filter: {
            fundIndex:"",
            fundCategory:[],
            fundArchive:[],
            fundFeature:[],
            fundType:[],
            dateFirstEntry:""
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.filterType.reportType !== this.props.filterType.reportType) {
            if (!!this.props.filterType.reportType.data) {
                this.getCubeAct()
            }
        }
        if (prevState.filter !== this.state.filter){
            this.props.updateTable(this.state.filter)
        }
    }

    //
    // data:
    //     cobe: "cubeForFundAndIK"
    // do: "doForFundAndIK"
    // dp: "dpForFundAndIK"
    // prop: "fundArchive,fundF

    getCubeAct = () => {
        this.props.getSpiner(true)
        const filters = {
            filterDOAnd: [
                {
                    dimConst: this.props.filterType.reportType.data.do,
                    concatType: "and",
                    conds: [
                        {
                            clss: this.props.filterType.reportType.data.clss
                        }
                    ]
                }
            ],
            filterDPAnd: [
                {
                    dimConst: this.props.filterType.reportType.data.dp,
                    concatType: "and",
                    conds: [
                        {
                            consts: this.props.filterType.reportType.data.prop
                        }
                    ]
                }
            ]

        };
        this.setState({loading: true});
        this.props.getCube(this.props.filterType.reportType.data.cube, JSON.stringify(filters))
            .then((res) => {
                this.parse(res.cube)
            })
            .catch(err => {
                console.error(err);
                this.setState({loading: false})
            })
    }

    onFundCategoryChange = s => {
        this.setState({filter: {...this.state.filter, fundCategory: s}});
    };
    onFundArchiveChange = s => {
        this.setState({filter: {...this.state.filter, fundArchive: s}});
    };
    onFundTypeChange = s => {
        this.setState({filter: {...this.state.filter, fundType: s}});
    };
    onFundFeatureChange = s => {
        this.setState({filter: {...this.state.filter, fundFeature: s}});
    };
    onFundIndexChange = e => {
        this.setState({filter: {...this.state.filter, fundIndex: e.target.value}});
    };
    onFundDateChange = (date, dateString) => {
        this.setState({filter: {...this.state.filter, dateFirstEntry: dateString}});
    };

    loadOptions = c => {
        return () => {
            if (!this.props[c + "Options"]) {
                this.setState({
                    filter: {...this.state.filter, [c + "Loading"]: true}
                });
                this.props.getPropVal(c).then(() =>
                    this.setState({
                        filter: {
                            ...this.state.filter,
                            [c + "Loading"]: false
                        }
                    })
                );
            }
        };
    };
    renderTableData = item => {
        let prop = this.props.filterType.reportType.data.prop
        const constArr = prop.split(",")
        const fundTypeObj = this.props.tofiConstants[
            [
                "fundOrg",
                "fundLP",
                "collectionOrg",
                "collectionLP",
                "jointOrg",
                "jointLP"
            ].find(c => this.props.tofiConstants[c].id == item.clsORtr)]
        const result = {
            key: item.id,
            name: item.name,
            fundType: fundTypeObj
                ? {
                    value: fundTypeObj.id,
                    label: fundTypeObj.name[this.lng],
                    fundTypeClass: fundTypeObj.constName
                }
                : null
        };
        parseForTable(item.props, this.props.tofiConstants, result, constArr);
        return result;
    };


    parse = (cube) => {
        const doCont = this.props.tofiConstants[this.props.filterType.reportType.data.constTofi1];
        const dpCont = this.props.tofiConstants[this.props.filterType.reportType.data.constTofi2];
        this.setState(
            {

                data: parseCube_new(
                    cube['cube'],
                    [],
                    'dp',
                    'do',
                    cube[`do_${doCont.id}`],
                    cube[`dp_${dpCont.id}`],
                    `do_${doCont.id}`, `dp_${dpCont.id}`).map(this.renderTableData)
            }, () => {
                this.props.getData(this.state.data)
                this.props.getSpiner(false)

            }
        );
    }
    // onSubmitCube = () => {
    //     var localConstant = Object.values(this.props.tofiConstants);
    //     /*старт Собираем классы объектов ТИПЫ ФОНДОВ*/
    //     var fundTypesArrayVal=this.state.filter.fundType.map(ft => ft.value);
    //     var fundTypeConsts = localConstant.filter(el => {if (fundTypesArrayVal.includes(el.id) && el.cod.startsWith('_C_')){return el}}).map(name =>name.constName);
    //     /*конец Собираем классы объектов ТИПЫ ФОНДОВ*/
    //
    //     var fundFeatureArrayVal=this.state.filter.fundFeature.map(ft =>{return {data:{dimPropConst:'dpForFundAndIK',propConst:'fundType',value:ft.value}}});
    //
    //
    //
    //     let cubeFilter =
    //         [
    //             {clss: fundTypeConsts.join(',')},
    //         ]
    // };

    onClearFilter = () => {
        let newObject = {...this.state.filter}
        for (let prop in newObject) {
            newObject[prop] = []
        }
        this.setState({
            filter: newObject
        })
    };

    render() {
        if (isEmpty(this.props.tofiConstants)) return null;
        const {loading, selectedRow, data, filter, siderCardChild} = this.state;
        console.log(this.state.filter);
        const {
            t,
            filterType,
            tofiConstants,
            tofiConstants: {
                fundNumber,
                fundDbeg,
                fundIndex,
                fundDend,
                fundCategory,
                fundFeature,
                fundType,
                fundIndustry,
                fundArchive,
                affiliation
            }
        } = this.props;
        this.lng = localStorage.getItem("i18nextLng");

        return (
            <div className="public_filters">
                <p>Фильтры данных</p>
                {filterType.reportType.value === "cubeForFundAndIK" ?
                    <div className="label-select">
                        <Select
                            name="fundArchive"
                            isMulti
                            isSearchable={false}
                            value={filter.fundArchive}
                            onChange={this.onFundArchiveChange}
                            isLoading={filter.fundArchiveLoading}
                            options={
                                this.props.fundArchiveOptions
                                    ? this.props.fundArchiveOptions.map(option => ({
                                        value: option.id,
                                        label: option.name[this.lng]
                                    }))
                                    : []
                            }
                            placeholder={fundArchive.name[this.lng]}
                            onMenuOpen={this.loadOptions("fundArchive")}
                        />
                    </div> : ""}
                {filterType.reportType.value === "cubeForFundAndIK" ?
                    <div className="label-select">
                        <Select
                            name="fundType"
                            isMulti
                            isSearchable={false}
                            value={filter.fundType}
                            onChange={this.onFundTypeChange}
                            options={[
                                "fundOrg",
                                "fundLP",
                                "collectionOrg",
                                "collectionLP",
                                "jointOrg",
                                "jointLP"
                            ].map(c => ({
                                value: this.props.tofiConstants[c].id,
                                label: this.props.tofiConstants[c].name[this.lng]
                            }))}
                            placeholder="Тип фонда"
                        />
                    </div> : ""}
                {filterType.reportType.value === "cubeForFundAndIK" ?
                    <div className="label-select">
                        <Select
                            name="fundFeature"
                            isMulti
                            isSearchable={false}
                            value={filter.fundFeature}
                            onChange={this.onFundFeatureChange}
                            isLoading={filter.fundFeatureLoading}
                            options={
                                this.props.fundFeatureOptions
                                    ? this.props.fundFeatureOptions.map(option => ({
                                        value: option.id,
                                        label: option.name[this.lng]
                                    }))
                                    : []
                            }
                            placeholder={fundFeature.name[this.lng]}
                            onMenuOpen={this.loadOptions("fundFeature")}
                        />
                    </div> : ""}
                {filterType.reportType.value === "cubeForFundAndIK" ?
                    <div className="label-select">
                        <Input
                            name="fundIndex"
                            value={filter.fundIndex}
                            onChange={this.onFundIndexChange}
                            placeholder={fundIndex.name[this.lng]}

                        />
                    </div> : ""}
                {filterType.reportType.value === "cubeForFundAndIK" ?
                    <div className="label-select">
                        <Select
                            name="fundCategory"
                            isMulti
                            isSearchable={false}
                            value={filter.fundCategory}
                            onChange={this.onFundCategoryChange}
                            isLoading={filter.fundCategoryLoading}
                            options={
                                this.props.fundCategoryOptions
                                    ? this.props.fundCategoryOptions.map(option => ({
                                        value: option.id,
                                        label: option.name[this.lng]
                                    }))
                                    : []
                            }
                            placeholder={fundCategory.name[this.lng]}
                            onMenuOpen={this.loadOptions("fundCategory")}
                        />
                    </div> : ""}
                {filterType.reportType.value === "cubeForFundAndIK" ?
                    <div className="label-select report_text">
                        <p>Дата первого поступления</p><DatePicker format="DD-MM-YYYY" onChange={this.onFundDateChange}/>
                    </div> : ""}
                {/*<div className="report_button">*/}
                    {/*<Button onClick={this.onSubmitFilter}>Сформировать</Button>*/}
                    {/*<Button onClick={this.onClearFilter}>Отменить</Button>*/}
                {/*</div>*/}
            </div>
        )
    }
}


function mapStateToProps(state) {
    return {
        cubeForFundAndIK: state.cubes.cubeForFundAndIK,
        tofiConstants: state.generalData.tofiConstants,
        fundCategoryOptions: state.generalData.fundCategory,
        fundFeatureOptions: state.generalData.fundFeature,
        fundIndustryOptions: state.generalData.fundIndustry,
        accessLevelOptions: state.generalData.accessLevel,
        fundArchiveOptions: state.generalData.fundArchive,
        singleCube: state.cubes.singleCube
    };
}

export default connect(
    mapStateToProps,
    {
        getCube,
        getPropVal,
        getPropValWithChilds
    }
)(FilterReport);
