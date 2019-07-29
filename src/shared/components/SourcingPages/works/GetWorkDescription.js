import React from 'react';
import {Button, Input, message, Radio} from 'antd';
import axios from "axios";
import {getValueOfMultiText, saveValueOfMultiText} from "../../../actions/actions";
import moment from "moment";

const TextArea = Input.TextArea;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
class GetWorkDescription extends React.PureComponent {

    state = {
        workDescription: {
            kz: '',
            en: '',
            ru: ''
        },
        multiTextDPV: '',
        lang: localStorage.getItem('i18nextLng'),
        dirty: false
    };




    onLangChange = e => {
        this.setState({lang: e.target.value})
    };
    initialState = this.state;
    cancel = () => {
        this.setState(this.initialState);
    };

    onChange = e => {
        this.setState({
            workDescription: {
                ...this.state.workDescription,
                [this.state.lang]: e.target.value
            },
            dirty: true
        })
    };

    saveWorkDescription = () => {
        const dataToSend = [];
        var mod = 'ins';
        if (!!this.state.multiTextDPV) {
            mod = 'upd'
        };
        let constant
        if (this.props.typeWork ==="caseSearch"){
            constant = "absenceCase"
        }else {
            constant="workDescription"
        }

        dataToSend.push(
            {
                propConst: constant,
                vals: [
                    {
                        idDataPropVal: this.state.multiTextDPV,
                        mode: mod,
                        val: {
                            kz: this.state.workDescription.kz,
                            ru: this.state.workDescription.ru,
                            en: this.state.workDescription.en,
                        }
                    }
                ],
            },
        );
        if (dataToSend.length > 0) {
            let data = JSON.stringify(dataToSend);
            saveValueOfMultiText(this.props.initialValues.key.split('_')[1], data, moment().format('YYYY-DD-MM')).then(res => {
                message.success(this.props.t("PROPS_SUCCESSFULLY_UPDATED"));
                //console.log(res)
            }).catch(err => {
                console.warn(err);
            })
        }
    };
    componentDidMount() {
        let constant
        if (this.props.typeWork ==="caseSearch"){
            constant = "absenceCase"
        }else {
            constant="workDescription"
        }
        getValueOfMultiText(String(this.props.initialValues.key.split('_')[1]), constant).then(
            res => {
                !!res.data[0] && this.setState({
                    multiTextDPV: res.data[0].idDataPropVal,
                    workDescription: {
                        kz: res.data[0].valueMultiStr.kz,
                        en: res.data[0].valueMultiStr.en,
                        ru: res.data[0].valueMultiStr.ru
                    },

                })
            }
        )
    }
    render() {
        const {t} = this.props;
        let lng =localStorage.getItem('i18nextLng')
        return (
            <div style={{width:'100%'}}>
                <h2 className="fs12">{this.props.typeWork === "caseSearch"?this.props.tofiConstants["absenceCase"].name[lng]:"Описание"}</h2>
                <div className="work-description p20">
                    <TextArea placeholder="Description" autosize={{minRows: 2}}
                              value={this.state.workDescription[this.state.lang]} onChange={this.onChange}
                              />
                    <RadioGroup onChange={this.onLangChange} className="ttl" defaultValue="ru" size="large">
                        <RadioButton className="padding0_6" value="kz">KZ</RadioButton>
                        <RadioButton className="padding0_6" value="ru">RU</RadioButton>
                        <RadioButton className="padding0_6" value="en">EN</RadioButton>
                    </RadioGroup>
                    <Button style={{marginRight: 'auto', marginBottom: '15px', marginTop:'5px'}}onClick={this.saveWorkDescription} className="signup-form__btn" type="primary">
                        {t('SAVE')}
                    </Button>
                </div>
            </div>
        )
    }
}
export default GetWorkDescription;