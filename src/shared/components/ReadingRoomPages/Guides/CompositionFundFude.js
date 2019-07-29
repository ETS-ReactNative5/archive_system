import React from "react";
import {connect} from "react-redux";
import {isEmpty, isEqual} from "lodash";
import {Input, Tabs, Form} from "antd";
import axios from 'axios';
import {parseCube_new, parseForTable} from "../../../utils/cubeParser";
import { reduxForm, Field } from 'redux-form';
import {getCube, getPropVal} from "../../../actions/actions";
import {
    CUBE_FOR_AF_INV,
    CUBE_FOR_FUND_AND_IK,
    DO_FOR_INV
} from "../../../constants/tofiConstants";
import {renderFileUploadBtn} from "../../../utils/form_components";
import Row from "antd/es/grid/row";
import Col from "antd/es/grid/col";
const { TextArea } = Input;
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
    },
};
class CompositionFundFude extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            visibleFundModal: false,
            lang: {
                annotationContentOfDocument: this.lng,
                invMulti: this.lng,
                fundHistoricalNoteMulti: this.lng,
                fundBiographArcheographNoteMulti:this.lng,
            }
        }
    }

    fileToRedux = (val, prevVal, file, str) => {
        let newFile = val.filter(el => el instanceof File);
        if (newFile.length > 0) {
            var copyVal = prevVal ? [...prevVal] : [];
            newFile.map(el => {
                copyVal.push({
                    value: el
                });
            });
            return copyVal;
        } else {
            return val.length == 0 ? [] : val;
        }
    };

    renderTableData = item => {

        const constArr = ['fundDbeg', 'fundDend', 'fundNumber', 'locationOfSupplementaryMaterials','fundIndex', 'fundCategory','fundAnnotationFile', 'fundNumberOfCases','fundBiographArcheographNote','fundHistoricalNote','invFile',
            'fundArchive', 'accessDocument'];
        const result = {
            key: item.id,
            name: item.name ? item.name : {kz: '', ru: '', en: ''}
        };
        parseForTable(item.props, this.props.tofiConstants, result, constArr);
        // deadline need to be computed
        result.deadline = result.fundDbeg && result.fundDend ? (result.fundDbeg.value + '-' + result.fundDend.value) : null
        return result
    };
    emitEmpty = e => {
        this.setState({
            search: {
                ...this.state.search,
                [e.target.dataset.name]: ''
            }
        })
    };
    render() {
        console.log(this.props.initialValues )
        if(isEmpty(this.props.tofiConstants)) return null;
        const {data} = this.props;
        const {annotationContentOfDocument,fundHistoricalNoteMulti,fundAnnotationFile, invMulti, invFile,fundHistoricalNote,
            fundBiographArcheographNoteMulti, fundBiographArcheographNote}=this.props.tofiConstants;
        this.lng = localStorage.getItem('i18nextLng');
        return (
            <Form>
                <Form.Item {...formItemLayout} label={annotationContentOfDocument.name[this.lng]}>
                    <TextArea disabled value={this.props.modalAnnotationContentOfDocument} />
                </Form.Item>
                <Row>
                    <Col span={10}></Col>
                    <Col span={14}>
                        <Field
                            name='fundAnnotationFile'
                            component={renderFileUploadBtn}
                            disabled
                            normalize={this.fileToRedux}
                            formItemLayout={
                                {
                                    labelCol: { span: 10 },
                                    wrapperCol: { span: 14 }
                                }
                            }
                        />
                    </Col>
                </Row>
                <Form.Item {...formItemLayout} label={invMulti.name[this.lng]}>
                    <TextArea disabled value={this.props.modalInvMulti} />
                </Form.Item>
                <Row>
                    <Col span={10}></Col>
                    <Col span={14}>
                        <Field
                        name='invFile'
                        component={renderFileUploadBtn}
                        disabled
                        normalize={this.fileToRedux}
                        formItemLayout={
                            {
                                labelCol: { span: 10 },
                                wrapperCol: { span: 14 }
                            }
                        }
                    />
                </Col>
                </Row>
                <Form.Item {...formItemLayout} label={fundHistoricalNoteMulti.name[this.lng]}>
                    <TextArea disabled value={this.props.modalFundHistoricalNoteMulti} />
                </Form.Item>
                <Row>
                    <Col span={10}></Col>
                    <Col span={14}>
                        <Field
                        name='fundHistoricalNote'
                        component={renderFileUploadBtn}
                        normalize={this.fileToRedux}
                        disabled
                        formItemLayout={
                            {
                                labelCol: { span: 10 },
                                wrapperCol: { span: 14 }
                            }
                        }
                        />
                    </Col>
                </Row>
                <Form.Item {...formItemLayout} label={fundBiographArcheographNoteMulti.name[this.lng]}>
                    <TextArea disabled value={this.props.modalFundBiographArcheographNoteMulti} />
                </Form.Item>
                <Row>
                    <Col span={10}></Col>
                    <Col span={14}>
                        <Field
                            name='fundBiographArcheographNote'
                            component={renderFileUploadBtn}
                            disabled
                            normalize={this.fileToRedux}
                            formItemLayout={
                                {
                                    labelCol: { span: 10 },
                                    wrapperCol: { span: 14 }
                                }
                            }
                        />
                    </Col>
                </Row>
            </Form>
        );
    }
}
export default connect(state => {
    return {
        funds: state.cubes[CUBE_FOR_FUND_AND_IK],
        tofiConstants: state.generalData.tofiConstants,
        singleExtraInfoFund:state.cubes.singleExtraInfoFund

    }
}, { getPropVal,getCube })(reduxForm({ form: 'CompositionFundFude', enableReinitialize: true })(CompositionFundFude));