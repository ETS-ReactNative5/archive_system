import React from 'react';
import {Button, InputNumber, Table, Form, Input, DatePicker, Spin} from 'antd';
import moment from "moment";
import {SYSTEM_LANG_ARRAY} from "../../../constants/constants";
import {parseForTable} from "../../../utils/cubeParser";
import {ArchiveFund} from '../../../utils/axios_config'
import {getFile, getValuesOfObjsWithProps} from "../../../actions/actions";
const dateFormat = 'DD/MM/YYYY';

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

class IdDataTab extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cardLoading: false,
            iin: '',
            personLastName: '',
            personName: '',
            personPatronymic: '',
            dateOfBirth: '',
            gender: '',
            nationality: '',
            copyUdl: '',
            photo: '',
            userAvatar: '',
            userDocScan:'',
            propStudy:''
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.initialValues !== this.props.initialValues) {
            this.setState({cardLoading: true})
            var userId = this.props.initialValues.workAuthor ? this.props.initialValues.workAuthor.value : '';
            this.getUserProps(userId);
        }
    }

    componentDidMount() {
        this.setState({cardLoading: true})
        var userId = this.props.initialValues.workAuthor ? this.props.initialValues.workAuthor.value : '';
        this.getUserProps(userId);
    }


    getUserProps = userId => {
        var datas = [{
            objs: String(userId),
            propConsts: 'iin,personLastName,personName,personPatronymic,dateOfBirth,gender,nationality,copyUdl,photo,propStudy'
        }];
        const userFD = new FormData();
        userFD.append('datas', JSON.stringify(datas));

        userId != '' && getValuesOfObjsWithProps(userFD).then(
        res => {
            if (res.success) {
                var data = res.data[0];
                this.setState({
                    iin: data.iin[this.lng],
                    personLastName: data.personLastName ? data.personLastName[this.lng] : '',
                    personName: data.personName ? data.personName[this.lng] : '',
                    personPatronymic: data.personPatronymic ? data.personPatronymic[this.lng] : '',
                    dateOfBirth: data.dateOfBirth,
                    gender: data.gender ? data.gender[this.lng] : '',
                    nationality:data.nationality ? data.nationality[this.lng]:'',
                    photo: data.photo ? data.photo.ru :'',
                    copyUdl:data.copyUdl ? data.copyUdl.ru :'',
                    propStudy:data.propStudy ? data.propStudy[this.lng]:''
                });
                this.state.photo != '0' ? getFile(this.state.photo).then(res => {
                    var fileReaderInstance = new FileReader();
                    fileReaderInstance.readAsDataURL(res.data);
                    fileReaderInstance.onload = () => {
                        var base64data = fileReaderInstance.result;
                        this.setState({userAvatar: base64data});
                    }
                }
                ) : this.setState({userAvatar: ''});

                this.state.copyUdl != '0' ? getFile(this.state.copyUdl).then(res => {
                    var fileReaderInstance = new FileReader();
                    fileReaderInstance.readAsDataURL(res.data);
                    fileReaderInstance.onload = () => {
                        var base64data = fileReaderInstance.result;
                        this.setState({userDocScan: base64data});
                    }
                }
                ) : this.setState({userDocScan: ''});

            }
            this.setState({cardLoading: false})
        }).catch(err => {
            console.error(err);
            this.setState({cardLoading: false})
        });
    };


    render() {
        const date = moment(this.state.dateOfBirth).subtract(10, 'days').calendar();
        const {tofiConstants, t, saveProps, initialValues} = this.props;
        const {iin, personLastName, personName, personPatronymic, dateOfBirth, gender, nationality, copyUdl, photo,propStudy} = this.props.tofiConstants
        this.lng = localStorage.getItem('i18nextLng');
        return (
        <div>
            <Spin spinning={this.state.cardLoading}>
                <Form>
                    <Form.Item {...formItemLayout} label={propStudy.name[this.lng]}>
                        <Input readOnly value={this.state.propStudy}/>
                    </Form.Item>
                    <Form.Item {...formItemLayout} label={iin.name[this.lng]}>
                        <Input readOnly value={this.state.iin}/>
                    </Form.Item>
                    <Form.Item {...formItemLayout} label={personLastName.name[this.lng]}>
                        <Input readOnly value={this.state.personLastName}/>
                    </Form.Item>
                    <Form.Item {...formItemLayout} label={personName.name[this.lng]}>
                        <Input readOnly value={this.state.personName}/>
                    </Form.Item>
                    <Form.Item {...formItemLayout}
                               label={personPatronymic.name[this.lng]}>
                        <Input readOnly value={this.state.personPatronymic}/>
                    </Form.Item>
                    <Form.Item {...formItemLayout} label={dateOfBirth.name[this.lng]}>
                        <Input readOnly value={date.toString()}/>

                        {/*  <DatePicker readOnly defaultValue={moment((this.state.dateOfBirth).toString(), dateFormat)} format={dateFormat} />*/}
                    </Form.Item>
                    <Form.Item {...formItemLayout} label={gender.name[this.lng]}>
                        <Input readOnly value={this.state.gender}/>
                    </Form.Item>
                    <Form.Item {...formItemLayout} label={nationality.name[this.lng]}>
                        <Input readOnly value={this.state.nationality}/>
                    </Form.Item>
                    <Form.Item {...formItemLayout} label={copyUdl.name[this.lng]}>
                        <img className="cardAvatar" src={this.state.userDocScan}/>
                    </Form.Item>
                    <Form.Item {...formItemLayout} label={photo.name[this.lng]}>
                        <img className="cardAvatar" src={this.state.userAvatar}/>
                    </Form.Item>

                </Form>
            </Spin>
        </div>
        )
    }
}

export default IdDataTab;