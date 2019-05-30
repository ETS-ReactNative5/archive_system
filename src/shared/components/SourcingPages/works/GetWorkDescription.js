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
        }
        ;
        dataToSend.push(
            {
                propConst: 'workDescription',
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
        getValueOfMultiText(String(this.props.initialValues.key.split('_')[1]), 'workDescription').then(
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
        return (
            <div style={{width:'100%'}}>
                <h2>Описание</h2>
                <div className="work-description">
                    <RadioGroup onChange={this.onLangChange} defaultValue="ru" size="large">
                        <RadioButton value="kz">KZ</RadioButton>
                        <RadioButton value="ru">RU</RadioButton>
                        <RadioButton value="en">EN</RadioButton>
                    </RadioGroup>
                    <TextArea placeholder="Description" autosize={{minRows: 2}}
                              value={this.state.workDescription[this.state.lang]} onChange={this.onChange}
                              style={{marginTop: '10px'}}/>
                    <Button style={{marginRight: 'auto', marginBottom: '15px', marginTop:'5px'}}onClick={this.saveWorkDescription} className="signup-form__btn" type="primary">
                        {t('SAVE')}
                    </Button>
                </div>
            </div>
        )
    }
}
export default GetWorkDescription;