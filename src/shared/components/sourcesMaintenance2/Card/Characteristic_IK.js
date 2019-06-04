import React from "react"
import {
    renderDatePicker, renderFileUploadBtn,
    renderInput
} from "../../../utils/form_components";
import {Field, reduxForm} from "redux-form";
import {Button} from "antd";
import {onSaveCubeData, parseCube_new, parseForTable} from "../../../utils/cubeParser";
import {isEqual, pickBy} from 'lodash';
import  {message} from "antd";
import {connect} from "react-redux";
import axios from 'axios';
import {moment} from "moment";
import Form from "antd/es/form/Form";
import Row from "antd/es/grid/row";
import SMForm from "./Forms/SMForm";

class SourcesMaintenanceForm extends React.Component {
    state = {
        data: {},
        cubeData: {}
    };

    buildOmponent = () => {
        const filters = {
            filterDPAnd: [
                {
                    dimConst: 'dpForFundAndIK',
                    concatType: "and",
                    conds: [
                        {
                            consts: "dateIncludeOfIk,reasonInclusion,reasonInclusionFile,numberOfIK,indexOfIK,dateExcludeOfIk,reasonExclusion,reasonExclusionFile,isActive,fundArchive,orgDocType,formOfAdmission,dateContract,contractNumber,contractFile"
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
            ]
        };
        const fd = new FormData();
        fd.append("cubeSConst", 'cubeForFundAndIK');
        fd.append("filters", JSON.stringify(filters));
        axios.post(`/${localStorage.getItem('i18nextLng')}/cube/getCubeData`, fd).then(res => {
            var cubeData = res.data.data;
            const parsedCube = parseCube_new(
            cubeData["cube"],
            [],
            "dp",
            "do",
            cubeData['do_' + this.props.tofiConstants.doForFundAndIK.id],
            cubeData['dp_' + this.props.tofiConstants.dpForFundAndIK.id],
            ['do_' + this.props.tofiConstants.doForFundAndIK.id],
            ['dp_' + this.props.tofiConstants.dpForFundAndIK.id]
            );
            var tableData = parsedCube.map(this.renderTableData);
            tableData[0].key = this.props.selectedIK.id;
            tableData[0].name = this.props.selectedIK.name;
            this.setState({
                cubeData: cubeData,
                loading: false,
                data: tableData
            });
        });
    }

    componentDidMount() {
        this.buildOmponent();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.selectedIK.id !== this.props.selectedIK.id) {
            this.buildOmponent();
        }

    }

    renderTableData = (item, idx) => {
        const result = {};
        const constArr = ['dateIncludeOfIk', 'reasonInclusion', 'reasonInclusionFile', 'numberOfIK', 'indexOfIK', 'dateExcludeOfIk', 'reasonExclusion', 'reasonExclusionFile', 'isActive', 'fundArchive', 'orgDocType', 'formOfAdmission', 'dateContract', 'contractNumber', 'contractFile'];
        parseForTable(item.props, this.props.tofiConstants, result, constArr);
        return result;
    };


    render() {
        return (
        <div>
            <SMForm initialValues={this.state.data[0]}
                    tofiConstants={this.props.tofiConstants}
                    cubeData={this.state.cubeData}
                    selectedIK={this.props.selectedIK}
                    t={this.props.t}/>
        </div>
        );
    }

}
export default SourcesMaintenanceForm;