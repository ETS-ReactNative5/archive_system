import React from 'react';
import {Button, InputNumber, Table, Form, Input, DatePicker, Spin} from 'antd';
import moment from "moment";
import {SYSTEM_LANG_ARRAY} from "../../../constants/constants";
import {parseForTable} from "../../../utils/cubeParser";
import {ArchiveFund} from '../../../utils/axios_config'
import {getValuesOfObjsWithProps} from "../../../actions/actions";

const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 6},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 18},
    },
};

class UserStatusTab extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cardLoading: false,
            job:'' ,
            position:'',
            education: '',
            personAcademicDegree: '',
            personAcademicTitle: '',
            staffRole:'',
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.initialValues !== this.props.initialValues) {
            this.setState({cardLoading: true})
            var userId = this.props.initialValues.workAuthor ? this.props.initialValues.workAuthor.value : '';
            this.getUserStatus(userId);
        }
    }

    componentDidMount() {
        this.setState({cardLoading: true})
        var userId = this.props.initialValues.workAuthor ? this.props.initialValues.workAuthor.value : '';
        this.getUserStatus(userId);
    }


    getUserStatus = userId => {
        var datas = [{
            objs: String(userId),
            propConsts: 'job,position,education,personAcademicDegree,personAcademicTitle,staffRole'
        }];
        const userFD = new FormData();
        userFD.append('datas', JSON.stringify(datas));

        userId != '' && getValuesOfObjsWithProps(userFD).then(
        res => {
            if (res.success) {
                var data=res.data[0];
                this.setState({
                    job: data.job ? data.job[this.lng]:'',
                    position: data.position ? data.position[this.lng] : '',
                    education: data.education ? data.education[this.lng]:'',
                    personAcademicDegree: data.personAcademicDegree ? data.personAcademicDegree[this.lng]:'',
                    personAcademicTitle: data.personAcademicTitle ? data.personAcademicTitle[this.lng]:'',
                    staffRole: data.staffRole ? data.staffRole[this.lng]:'',
                })
            }
            this.setState({cardLoading: false})
        }).catch(err => {
            console.error(err);
            this.setState({cardLoading: false})
        });
    };



    render() {
        const {tofiConstants, t, saveProps, initialValues} = this.props;
        const {job,position,education,personAcademicDegree,personAcademicTitle,staffRole}=this.props.tofiConstants
        this.lng = localStorage.getItem('i18nextLng');
        return (
        <div>
            <Spin spinning={this.state.cardLoading}>
            <Form>
                <Form.Item {...formItemLayout} label={job.name[this.lng]}>
                    <Input readOnly value={this.state.job}/>
                </Form.Item>
                <Form.Item {...formItemLayout} label={position.name[this.lng]}>
                    <Input readOnly value={this.state.position}/>
                </Form.Item>
                <Form.Item {...formItemLayout} label={education.name[this.lng]}>
                    <Input readOnly value={this.state.education}/>
                </Form.Item>
                <Form.Item {...formItemLayout} label={personAcademicDegree.name[this.lng]}>
                    <Input readOnly value={this.state.personAcademicDegree}/>
                </Form.Item>
                <Form.Item {...formItemLayout} label={personAcademicTitle.name[this.lng]}>
                    <Input readOnly value={this.state.personAcademicTitle}/>
                </Form.Item>
                <Form.Item {...formItemLayout} label={staffRole.name[this.lng]}>
                    <Input readOnly value={this.state.staffRole}/>
                </Form.Item>

            </Form>
            </Spin>
        </div>
        )
    }
}

export default UserStatusTab;