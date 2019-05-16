import React from 'react';
import {Button, Icon, Input, Modal, Radio, Table} from 'antd';
import {getPropValByConst} from '../../../actions/actions'
import AntTable from "../../AntTable";
import PrintAct from "./PrintAct.js";

const TextArea = Input.TextArea;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;


const columns = [
    {
        width: '4%',
        title: '#',
        dataIndex: 'idx',
        key: 'idx',
        render: (text, rec, i) => {
            return i + 1
        }
    },
    {
        width: '75%',
        title: 'Наименование акта',
        dataIndex: 'name',
        key: 'name',
    },
    {
        width: '13%',
        title: '№ Акта',
        dataIndex: 'actNumber',
        key: 'actNumber',
    },
    {
        width: '8%',
        title: '',
        dataIndex: "showAct",
        key: 'showAct'
    }
];


class WorkDescription extends React.PureComponent {
    state = {
        visible: false,
        selectedRow: '',
        workDescription: {
            kz: '',
            en: '',
            ru: ''
        },
        dataSource: [],
        lang: localStorage.getItem('i18nextLng'),
        dirty: false,
        type: ''
    };
    handleOk = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };
    onLangChange = e => {
        this.setState({lang: e.target.value})
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

    showAct = (type, actNumber) => {
        console.log(this.props.initialValues.key, type);
        this.setState({visible: true, type: type, actNumber: actNumber})
    };

    componentDidMount() {
        console.log(this.props.initialValues);
        var fundName = this.props.initialValues.workRegFund.labelFull;

        var filterOfActs = [];

        this.props.initialValues.workType.workTypeClass == 'caseAvailabilityCheck' && filterOfActs.push({
            idx: '1',
            name: 'Акт проверки наличия и состояния архивных документов: ' + fundName,
            actNumber: this.props.initialValues.key.slice(-4) + '_1',
            showAct: <Button
            onClick={() => this.showAct('damage', this.props.initialValues.key.slice(-4) + '_1')}
            type="primary"
            shape="circle"><Icon type="eye"/></Button>
        });

        this.props.initialValues.workType.workTypeClass == 'caseAvailabilityCheck' && filterOfActs.push({
            idx: '2',
            name: 'Акт об обнаружении архивных документов',
            actNumber: this.props.initialValues.key.slice(-4) + '_2',
            showAct: <Button
            onClick={() => this.showAct('irrDamage', this.props.initialValues.key.slice(-4) + '_2')}
            type="primary"
            shape="circle"><Icon type="eye"/></Button>
        });
        (this.props.initialValues.workType.workTypeClass == 'caseExamination' ||  this.props.initialValues.workType.workTypeClass == 'caseDisposal') && filterOfActs.push({
            idx: '3',
            name: 'Акт о выделении к уничтожению документов, не подлежащих хранению',
            actNumber: this.props.initialValues.key.slice(-4) + '_3',
            showAct: <Button
            onClick={() => this.showAct('lightToDestroy', this.props.initialValues.key.slice(-4) + '_3')}
            type="primary"
            shape="circle"><Icon type="eye"/></Button>
        });
        (this.props.initialValues.workType.workTypeClass == 'caseExamination' || this.props.initialValues.workType.workTypeClass == 'caseDisposal') && filterOfActs.push({
            idx: '4',
            name: 'Акт о неисправимых повреждениях документов',
            actNumber: this.props.initialValues.key.slice(-4) + '_4',
            showAct: <Button
            onClick={() => this.showAct('CrashedAct', this.props.initialValues.key.slice(-4) + '_4')}
            type="primary"
            shape="circle"><Icon type="eye"/></Button>
        });
        this.props.initialValues.workType.workTypeClass == 'caseRegistration' && filterOfActs.push({
            idx: '5',
            name: 'Акт приема-передачи документов на хранение',
            actNumber: this.props.initialValues.key.slice(-4) + '_5',
            showAct: <Button
            onClick={() => this.showAct('TransferAct', this.props.initialValues.key.slice(-4) + '_5')}
            type="primary"
            shape="circle"><Icon type="eye"/></Button>
        });
        this.props.initialValues.workType.workTypeClass == 'caseRegistration' && filterOfActs.push({
            idx: '6',
            name: 'Акт приема на хранение документов личного происхождения',
            actNumber: this.props.initialValues.key.slice(-4) + '_6',
            showAct: <Button
            onClick={() => this.showAct('TransferLPAct', this.props.initialValues.key.slice(-4) + '_6')}
            type="primary"
            shape="circle"><Icon type="eye"/></Button>
        });




        this.setState({
            dataSource: filterOfActs
        });
        getPropValByConst('workDescription')
        .then(data => console.log(data))
        .catch(err => console.error(err))
    }

    componentDidUpdate(prevProps) {
        if (prevProps.initialValues !== this.props.initialValues) {
            console.log(document.getElementById("root"));
        }
    }

    initialState = this.state;


    cancel = () => {
        this.setState(this.initialState);
    };

    changeSelectedRow = record => {
        this.setState({selectedRow: record})
    };

    render() {
        const {t} = this.props;
        return (
        <div>
            <div className="work-description">
                <RadioGroup onChange={this.onLangChange} value={this.state.lang}>
                    <RadioButton value="kz">KZ</RadioButton>
                    <RadioButton value="ru">RU</RadioButton>
                    <RadioButton value="en">EN</RadioButton>
                </RadioGroup>
                <TextArea placeholder="Description" autosize={{minRows: 2}}
                          value={this.state.workDescription[this.state.lang]}
                          onChange={this.onChange} style={{marginTop: '10px'}}/>
                {this.state.dirty && (
                <div className="ant-form-btns">
                    <Button className="signup-form__btn" type="primary">
                        { t('SAVE') }
                    </Button>
                    <Button className="signup-form__btn" type="danger"
                            style={{marginLeft: '10px'}} onClick={this.cancel}>
                        { t('CANCEL') }
                    </Button>
                </div>
                )}
            </div>
            <div>

                {this.props.initialValues.workStatusReg && (this.props.initialValues.workStatusReg.value == this.props.tofiConstants.accepted.id) ?
                <AntTable
                size='small'
                rowClassName={record => this.state.selectedRow && this.state.selectedRow.key === record.key ? 'row-selected' : ''}
                dataSource={this.state.dataSource} columns={columns}/> : '' }
            </div>
            <Modal
            className="ant-modal w-845"
            visible={this.state.visible}
            cancelText="Закрыть"
            onCancel={this.handleCancel}
            footer={false}
            >

                <PrintAct
                tofiConstants={this.props.tofiConstants}
                initialValues={this.props.initialValues}
                workId={this.props.initialValues.key}
                type={this.state.type}
                actNumber={this.state.actNumber}
                />
            </Modal>
        </div>
        )
    }
}

export default WorkDescription;