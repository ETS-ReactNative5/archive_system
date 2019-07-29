import React from "react"
import {
    renderDatePicker, renderFileUploadBtn,
    renderInput, renderSelect
} from "../../../../utils/form_components";
import {Field, reduxForm} from "redux-form";
import {Button, Col} from "antd";
import {onSaveCubeData, parseCube_new, parseForTable} from "../../../../utils/cubeParser";
import {isEqual, pickBy} from 'lodash';
import  {message} from "antd";
import {connect} from "react-redux";
import axios from 'axios';
import moment from "moment";
import Form from "antd/es/form/Form";
import Row from "antd/es/grid/row";
import {requiredArr, requiredLabel} from "../../../../utils/form_validations";
import {getPropVal} from "../../../../actions/actions";
import TableComplex from "./TableComplex"
class Index extends React.Component {

    state = {
        data: [],
        cubeData: []
    };

    updateCube = () => {
        const filters = {
            filterDPAnd: [
                {
                    dimConst: 'dpForWorks',
                    concatType: "and",
                    conds: [
                        {
                            consts: "markSearchCourse,markSearchCourseNumber,markSearchCourseDate,markSearchCourseAbout"
                        }
                    ]
                }
            ],
            filterDOAnd: [
                {
                    dimConst: 'doForWorks',
                    concatType: "and",
                    conds: [
                        {
                            ids: String(this.props.initialValues.key)
                        }
                    ]
                }
            ]
        };
        const fd = new FormData();
        fd.append("cubeSConst", 'cubeForWorks');
        fd.append("filters", JSON.stringify(filters));
        axios.post(`/${localStorage.getItem('i18nextLng')}/cube/getCubeData`, fd).then(res => {
            let cubeData = res.data.data;
            const parsedCube = parseCube_new(
            cubeData["cube"],
            [],
            "dp",
            "do",
            cubeData['do_' + this.props.tofiConstants.doForWorks.id],
            cubeData['dp_' + this.props.tofiConstants.dpForWorks.id],
            ['do_' + this.props.tofiConstants.doForWorks.id],
            ['dp_' + this.props.tofiConstants.dpForWorks.id]
            );
            let tableData = parsedCube.map(this.renderTableData);
            let arrCons = ["markSearchCourse"]
            for (let val of arrCons) {
                for (let complexVal of tableData) {

                    this.setState({
                        data: complexVal[val]
                    })
                }
            }
        });
    }

    componentDidMount() {
        this.updateCube();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.initialValues.key !== this.props.initialValues.key) {
            this.updateCube();
        }
    }

    renderTableData = (item, idx) => {
        const result = {};
        const constArr = ['markSearchCourse'];
        parseForTable(item.props, this.props.tofiConstants, result, constArr);
        return result;
    };

    render() {
        return <TableComplex updateCube={this.updateCube} data={this.state.data} {...this.props}/>

    }

}

export default Index;