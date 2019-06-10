import React from "react"
import {
    renderDatePicker, renderFileUploadBtn,
    renderInput, renderSelect
} from "../../../utils/form_components";
import {Field, reduxForm} from "redux-form";
import {Button, Col} from "antd";
import {onSaveCubeData, parseCube_new, parseForTable, parseForTableComplex} from "../../../utils/cubeParser";
import {isEqual, pickBy} from 'lodash';
import {message, } from "antd";
import {connect} from "react-redux";
import axios from 'axios';
import moment from "moment";
import Form from "antd/es/form/Form";
import Row from "antd/es/grid/row";
import {requiredArr, requiredLabel} from "../../../utils/form_validations";
import {getPropVal} from "../../../actions/actions";
import PiNMD_IK_FORM from "./Forms/PiNMD_IK_FORM"
class PiNMD_IK extends React.Component {
    state = {
        data: [],
        cubeData: {}
    };

    componentDidMount() {
        this.updateCube()
    }
updateCube=()=>{
    const {normativeDocType, doForFundAndIK, dpForFundAndIK,  docFile, archiveInfoDate1, archiveInfoDate2, file3} = this.props.tofiConstants;
    const filters = {
            filterDPAnd: [
                {
                    dimConst: 'dpForFundAndIK',
                    concatType: "and",
                    conds: [
                        {
                            consts: "normativeDocType,docFile,archiveInfoDate1,archiveInfoDate2,file3,normMethDocs,numberNmd"
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
        debugger
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
        debugger
        // var arrConst = ['normativeDocType', 'docFile', 'archiveInfoDate1', 'archiveInfoDate2', 'file3','numberNmd'];
        // var result = parseForTableComplex(cubeData, 'doForFundAndIK', 'dpForFundAndIK', 'dtForFundAndIK', this.props.tofiConstants, arrConst, this.props.dateIncludeOfIk);
        // this.setState({
        //     data:result
        // })

    }).catch(e=>{
        console.log(e)
    });
}
    renderTableData = item => {
        const result = {};
        const constArr = ['normativeDocType', 'docFile', 'archiveInfoDate1', 'archiveInfoDate2', 'file3','numberNmd'];
        parseForTable(item.props, this.props.tofiConstants, result, constArr);
        return result;
    };

    render() {
        return (
            <PiNMD_IK_FORM updateCube={this.updateCube} data={this.state.data} {...this.props}/>
        )
    }

}

export default PiNMD_IK;