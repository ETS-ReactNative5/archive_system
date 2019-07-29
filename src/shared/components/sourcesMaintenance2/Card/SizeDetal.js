import React from "react"
import {
    renderDatePicker, renderFileUploadBtn,
    renderInput, renderSelect
} from "../../../utils/form_components";
import {Field, reduxForm} from "redux-form";
import {Button, Col} from "antd";
import {onSaveCubeData, parseCube_new, parseForTable, parseForTableComplex} from "../../../utils/cubeParser";
import {isEqual, pickBy} from 'lodash';
import {message,} from "antd";
import {connect} from "react-redux";
import axios from 'axios';
import moment from "moment";
import Form from "antd/es/form/Form";
import Row from "antd/es/grid/row";
import {requiredArr, requiredLabel} from "../../../utils/form_validations";
import {getPropVal} from "../../../actions/actions";
import SizeDetalis from "./Forms/SizeDetal"

class SizeDetal extends React.Component {
    state = {
        data: [],
        cubeData: {}
    };

    componentDidMount() {
        this.updateCube()
    }

    updateCube = () => {
        const {normativeDocType, doForFundAndIK, dpForFundAndIK, docFile, archiveInfoDate1, archiveInfoDate2, file3} = this.props.tofiConstants;
        const filters = {
                filterDPAnd: [
                    {
                        dimConst: 'dpForFundAndIK',
                        concatType: "and",
                        conds: [
                            {
                                consts: "detailsComplex,detailsDocumentType,detailsSubtypeDoc,detailsStatus,detailsMeasure,detailsVolume,detailsReportDate,detailsEarlyDate,detailsLateDate"
                            }
                        ]
                    }
                ],
                filterDOAnd: [
                    {
                        dimConst: 'doForFundAndIK',
                        concatType: "and",
                        conds: [
                            {
                                ids: String(this.props.selectedIK.id)
                            }
                        ]
                    }
                ],
                filterDTOr: [
                    {
                        dimConst: 'dtForFundAndIK',
                        conds: [
                            {
                                ids: String(this.props.dateIncludeOfIk.slice(-4)) + '0101' + String(this.props.dateIncludeOfIk.slice(-4)) + '1231'
                            }
                        ]
                    }
                ]
            }
        ;
        const fd = new FormData();
        fd.append("cubeSConst", 'cubeForFundAndIK');
        fd.append("filters", JSON.stringify(filters));
        axios.post(`/${localStorage.getItem('i18nextLng')}/cube/getCubeData`, fd).then(res => {
            var cubeData = res.data.data;
            let parseCube = parseCube_new(
                cubeData.cube,
                [],
                'dp',
                'do',
                cubeData[`do_${doForFundAndIK.id}`],
                cubeData[`dp_${dpForFundAndIK.id}`],
                `do_${doForFundAndIK.id}`, `dp_${dpForFundAndIK.id}`)

            let tableData = parseCube.map(this.renderTableData);
            let dataArr =[]
            let arrCons = ["detailsComplex"]
            for (let val of arrCons) {
                for (let complexVal of tableData) {
                    if (!!complexVal[val]){
                        for (let v of complexVal[val]){
                            dataArr.push({
                                detailsComplex:{
                                    idDataPropVal:v.idDataPropVal
                                },
                                detailsDocumentType:!!v[this.props.tofiConstants["detailsDocumentType"].id] && v[this.props.tofiConstants["detailsDocumentType"].id][0],
                                detailsSubtypeDoc:!!v[this.props.tofiConstants["detailsSubtypeDoc"].id] && v[this.props.tofiConstants["detailsSubtypeDoc"].id][0],
                                detailsStatus:!!v[this.props.tofiConstants["detailsStatus"].id] && v[this.props.tofiConstants["detailsStatus"].id][0],
                                detailsMeasure:!!v[this.props.tofiConstants["detailsMeasure"].id] && v[this.props.tofiConstants["detailsMeasure"].id][0],
                                detailsVolume:!!v[this.props.tofiConstants["detailsVolume"].id] && v[this.props.tofiConstants["detailsVolume"].id][0],
                                detailsReportDate:!!v[this.props.tofiConstants["detailsReportDate"].id] && v[this.props.tofiConstants["detailsReportDate"].id][0],
                                detailsEarlyDate:!!v[this.props.tofiConstants["detailsEarlyDate"].id] && v[this.props.tofiConstants["detailsEarlyDate"].id][0],
                                detailsLateDate:!!v[this.props.tofiConstants["detailsLateDate"].id] && v[this.props.tofiConstants["detailsLateDate"].id][0],

                            })
                        }

                        debugger
                    }

                }
            }
            this.setState({
                data:dataArr
            })
            //
            // var arrConst = ['normativeDocType', 'docFile', 'archiveInfoDate1', 'archiveInfoDate2', 'file3', 'numberNmd'];
            // var result = parseForTableComplex(cubeData, 'doForFundAndIK', 'dpForFundAndIK', 'dtForFundAndIK', this.props.tofiConstants, arrConst, this.props.dateIncludeOfIk);
            // debugger


        }).catch(e => {
            console.log(e)
        });
    }
    renderTableData = item => {
        const result = {
            key:item.id
        };
        const constArr = ['detailsComplex'];
        parseForTable(item.props, this.props.tofiConstants, result, constArr);
        return result;
    };

    render() {
        return (
            <SizeDetalis updateCube={this.updateCube} data={this.state.data} {...this.props}/>
        )
    }

}

export default SizeDetal;