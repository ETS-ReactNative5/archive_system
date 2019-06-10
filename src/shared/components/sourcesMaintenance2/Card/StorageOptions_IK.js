import React from "react"
import {
    renderDatePicker, renderFileUploadBtn,
    renderInput, renderSelect
} from "../../../utils/form_components";
import {Field, reduxForm} from "redux-form";
import {Button, Col} from "antd";
import {onSaveCubeData, parseCube_new, parseForTable} from "../../../utils/cubeParser";
import {isEqual, pickBy} from 'lodash';
import  {message} from "antd";
import {connect} from "react-redux";
import axios from 'axios';
import moment from "moment";
import Form from "antd/es/form/Form";
import Row from "antd/es/grid/row";
import {requiredArr, requiredLabel} from "../../../utils/form_validations";
import {getPropVal} from "../../../actions/actions";
import ContactForm from "./Forms/ContactForm";
import StorageOptionsForm from "./Forms/StorageOptionsForm";

class StorageOptions_IK extends React.Component {

    state = {
        data: {},
        cubeData: {}
    };

    buildComponent = () => {
        const filters = {
            filterDPAnd: [
                {
                    dimConst: 'dpForFundAndIK',
                    concatType: "and",
                    conds: [
                        {
                            consts: "hasArchiveStore,fireExtTools,roomHeating,hasFireAlarm,hasSecurityAlarmSystem,hasDevices,lighting,lockers,hasReadingRoom,numberOfRooms,roomArea,roomOccupancy,lightingType,materialOfLockers,shelving"
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
        this.buildComponent();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.selectedIK.id !== this.props.selectedIK.id) {
            this.buildComponent();
        }
    }

    renderTableData = (item, idx) => {
        const result = {};
        const constArr = ['hasArchiveStore','fireExtTools','roomHeating','hasFireAlarm','hasSecurityAlarmSystem','hasDevices','lighting','lockers','hasReadingRoom','numberOfRooms','roomArea','roomOccupancy','lightingType','materialOfLockers','shelving'];
        parseForTable(item.props, this.props.tofiConstants, result, constArr);
        return result;
    };

    render() {
        return (<div><StorageOptionsForm initialValues={this.state.data[0]}
                                  tofiConstants={this.props.tofiConstants}
                                  cubeData={this.state.cubeData}
                                  selectedIK={this.props.selectedIK}
                                  dateIncludeOfIk={this.props.dateIncludeOfIk}
                                  t={this.props.t}/></div>)
    }

}

export default StorageOptions_IK;