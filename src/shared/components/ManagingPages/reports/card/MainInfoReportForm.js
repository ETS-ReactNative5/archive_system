import React, {Component} from "react";
import {Button, Spin, Form, Col,Row, message, Input, Icon, DatePicker, Upload, Select, Collapse} from "antd";
import axios from "axios"
import {
    getObjChildsById,
    getPropValById,
    getPropVal,
    factorValLoaded,
    getPropValByConst
} from "../../../../actions/actions";
import {connect} from "react-redux";
import moment from "moment";
const {Option} = Select;
const formItemLayout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16},
};
const formTailLayout = {
    wrapperCol: {span: 8, offset: 8},
};
const FormItem = Form.Item;

class MainInfoReportForm extends Component {
    state = {
        loading: false,
        data: {},
        dataOptons: [],
        reportDate:null
    }


    getPropType = (prop, val, flag) => {
        const fd = new FormData();
        fd.append("idProp", prop.prop);
        axios.post(`/${localStorage.getItem('i18nextLng')}/entity/getPropById`, fd)
            .then(res => {
                const contact = this.state.typeProp;
                contact[val] = res.data.data

                this.setState({dataoption: contact,});

            })
            .catch(err => {
                console.log(err)
            })
    }


    getFactorVal = (id, val) => {

        const fd = new FormData();
        fd.append("factorId", String(id));
        axios.post(`/${localStorage.getItem('i18nextLng')}/entity/getFactorVa`, fd).then((res) => {

        })
    }
    getOpton = (keys, val) => {
        for (let key in keys) {
            if (String(key) === "factorVal") {
                if (Array.isArray(keys[key])) {
                    let data = keys[key].join(',')
                    const fd = new FormData();
                    fd.append("factorValIds", data);
                    axios.post(`/${localStorage.getItem('i18nextLng')}/entity/getFactorValByIds`, fd)
                        .then(res => {
                            const contact = this.state.dataOptons;
                            contact[val] = res.data.data

                            this.setState({dataOptons: contact,});

                        })
                        .catch(err => {
                            console.log(err)
                        })
                } else {
                    let data = keys[key]
                    const fd = new FormData();
                    fd.append("factorId", data);
                    axios.post(`/${localStorage.getItem('i18nextLng')}/entity/getFactorVal`, fd)
                        .then(res => {
                            const contact = this.state.dataOptons;
                            contact[val] = res.data.data

                            this.setState({dataOptons: contact,});

                        })
                        .catch(err => {
                            console.log(err)
                        })
                }
                break
            }
            if (String(key) === "factor") {
                if (Array.isArray(keys[key])) {
                    let data = keys[key].join(',')
                    const fd = new FormData();
                    fd.append("factorValIds", data);
                    axios.post(`/${localStorage.getItem('i18nextLng')}/entity/getFactorValByIds`, fd)
                        .then(res => {
                            const contact = this.state.dataOptons;
                            contact[val] = res.data.data

                            this.setState({dataOptons: contact,});

                        })
                        .catch(err => {
                            console.log(err)
                        })
                } else {
                    let data = keys[key]
                    const fd = new FormData();
                    fd.append("factorId", data);
                    axios.post(`/${localStorage.getItem('i18nextLng')}/entity/getFactorVal`, fd)
                        .then(res => {
                            const contact = this.state.dataOptons;
                            contact[val] = res.data.data

                            this.setState({dataOptons: contact,});

                        })
                        .catch(err => {
                            console.log(err)
                        })
                }
                break
            }
            if (String(key) === "prop") {
                if (Array.isArray(keys[key])) {
                    let data = keys[key].join(',')
                    const fd = new FormData();
                    fd.append("propIds", data);
                    axios.post(`/${localStorage.getItem('i18nextLng')}/entity/getPropByIds`, fd)
                        .then(res => {
                            const contact = this.state.dataOptons;
                            contact[val] = res.data.data

                            this.setState({dataOptons: contact,});

                        })
                        .catch(err => {
                            console.log(err)
                        })
                } else {
                    let data = keys[key]
                    const fd = new FormData();
                    fd.append("dimPropId", data);
                    axios.post(`/${localStorage.getItem('i18nextLng')}/entity/getPropByDimProp`, fd)
                        .then(res => {
                            const contact = this.state.dataOptons;
                            contact[val] = res.data.data

                            this.setState({dataOptons: contact,});

                        })
                        .catch(err => {
                            console.log(err)
                        })
                }
                break
            }
            if (String(key) === "obj") {
                if (Array.isArray(keys[key])) {
                    let data = keys[key].join(',')
                    const fd = new FormData();
                    fd.append("objIds", data);
                    axios.post(`/${localStorage.getItem('i18nextLng')}/entity/getObjListByIds`, fd)
                        .then(res => {
                            const contact = this.state.dataOptons;
                            contact[val] = res.data.data

                            this.setState({dataOptons: contact,});

                        })
                        .catch(err => {
                            console.log(err)
                        })
                } else {
                    let data = keys[key]
                    const fd = new FormData();
                    fd.append("objIds", data);
                    axios.post(`/${localStorage.getItem('i18nextLng')}/entity/getObjListByIds`, fd)
                        .then(res => {
                            const contact = this.state.dataOptons;
                            contact[val] = res.data.data

                            this.setState({dataOptons: contact,});

                        })
                        .catch(err => {
                            console.log(err)
                        })
                }
                break
            }
            if (String(key) === "cls") {
                if (val === "fundType"){
                    if (Array.isArray(keys[key])) {

                        let data = keys[key].join(',')
                        const fd = new FormData();
                        fd.append("clsIds", data);
                        axios.post(`/${localStorage.getItem('i18nextLng')}/entity/getClsListByIds`, fd)
                            .then(res => {
                                const contact = this.state.dataOptons;
                                contact[val] = res.data.data

                                this.setState({dataOptons: contact,});

                            })
                            .catch(err => {
                                console.log(err)
                            })
                    }
                    }
                else if (Array.isArray(keys[key])) {
                    let data = keys[key].join(',')
                    const fd = new FormData();
                    fd.append("clsIds", data);
                    axios.post(`/${localStorage.getItem('i18nextLng')}/entity/getObjListByCls`, fd)
                        .then(res => {
                            const contact = this.state.dataOptons;
                            contact[val] = res.data.data

                            this.setState({dataOptons: contact,});

                        })
                        .catch(err => {
                            console.log(err)
                        })
                } else {
                    let data = keys[key]
                    const fd = new FormData();
                    fd.append("clsIds", data);
                    axios.post(`/${localStorage.getItem('i18nextLng')}/entity/getObjListByCls`, fd)
                        .then(res => {
                            const contact = this.state.dataOptons;
                            contact[val] = res.data.data;
                            this.setState({dataOptons: contact,});

                        })
                        .catch(err => {
                            console.log(err)
                        })
                }
                break
            }
            if (String(key) === "typ") {
                if (Array.isArray(keys[key])) {
                    let data = keys[key].join(',')
                    const fd = new FormData();
                    fd.append("typIds", data);
                    axios.post(`/${localStorage.getItem('i18nextLng')}/entity/getObjListByTyp`, fd)
                        .then(res => {
                            const contact = this.state.dataOptons;
                            contact[val] = res.data.data

                            this.setState({dataOptons: contact,});

                        })
                        .catch(err => {
                            console.log(err)
                        })
                } else {
                    let data = keys[key]
                    const fd = new FormData();
                    fd.append("typIds", data);
                    axios.post(`/${localStorage.getItem('i18nextLng')}/entity/getObjListByTyp`, fd)
                        .then(res => {
                            const contact = this.state.dataOptons;
                            contact[val] = res.data.data;
                            this.setState({dataOptons: contact,});

                        })
                        .catch(err => {
                            console.log(err)
                        })
                }
                break
            }
        }
    }
    showProop = (object) => {

        const {getFieldDecorator} = this.props.form;
        if ( object.nameParam !== "fundIndexKey"&& object.asgnType === 3 || object.asgnType === 4 || object.asgnType === 5 || object.asgnType === 6  || object.asgnType === 9 || object.asgnType === 10 || object.asgnType === 11 || object.asgnType === 12 || object.asgnType === 13 || object.asgnType === 14) {
            return (

                <FormItem {...formItemLayout} label={object.name[this.lng]}>
                    {getFieldDecorator(object.nameParam, {
                        rules: [{
                            required: object.paramCateg === 2,
                            message: 'Поле обязательно',
                        }],
                    })(
                        <Select
                            mode={object.isUniq === 2 ? "tags" : ""}
                            placeholder={object.name[this.lng]}
                            onFocus={() => this.getOpton(object.keyType, object.nameParam)}
                            onChange={object.isUniq === 2 ? (e) => this.onChangeMultiSelect(e, object.nameParam) : (e) => this.onChangeSelect(e, object.nameParam)}
                        >
                            {this.state.dataOptons[object.nameParam] && this.state.dataOptons[object.nameParam].map(el => {
                                return (
                                    <Option key={el.id} value={el.id}>
                                        {el.name[this.lng]}
                                    </Option>
                                )
                            })}
                        </Select>
                    )}
                </FormItem>
            )
        }
        if (object.nameParam === "fundIndexKey") {
            return (

                <FormItem {...formItemLayout} label={object.name[this.lng]}>
                    {getFieldDecorator(object.nameParam, {
                        rules: [{
                            required: object.paramCateg === 2,
                            message: 'Поле обязательно',
                        }],
                    })(
                        <Select
                            mode={object.isUniq === 2 ? "tags" : ""}
                            placeholder={object.name[this.lng]}
                            onFocus={() => this.getOpton(object.keyType, object.nameParam)}
                            onChange={object.isUniq === 2 ? (e) => this.onChangeMultiSelect(e, object.nameParam) : (e) => this.onChangeSelect(e, object.nameParam)}
                        >
                            <Option value="all">Все</Option>
                            <Option value={true}>Да</Option>
                            <Option value={false}>Нет</Option>
                        </Select>
                    )}
                </FormItem>
            )
        }


        if (object.asgnType === 1) {
            return (
                <FormItem {...formItemLayout} label={object.name[this.lng]}>
                    {getFieldDecorator(object.nameParam, {
                        rules: [{
                            required: object.paramCateg === 2,
                            message: 'Поле обязательно',
                        }],
                    })(
                        <DatePicker
                            onChange={(e, date) => this.onChangedate(e, date, object.nameParam)}
                            placeholder={object.name[this.lng]}

                        />
                    )}
                </FormItem>
            )
        }
        if (object.asgnType === 15) {
            return (
                <FormItem {...formItemLayout} label={object.name[this.lng]}>
                    {getFieldDecorator(object.nameParam, {
                        rules: [{
                            required: object.paramCateg === 2,
                            message: 'Поле обязательно',
                        }],
                    })(
                        <Input
                            onChange={(e) => this.onChangeInput(e, object.nameParam)}
                            placeholder={object.name[this.lng]}

                        />
                    )}
                </FormItem>
            )
        }
        if (object.asgnType === 16) {
            const props = {
                onChange: (e) => this.handleChangeFile(e, object.nameParam),
                multiple: object.isUniq === 2 ? true : false,
            };
            return (
                <FormItem {...formItemLayout} label={object.name[this.lng]}>
                    {getFieldDecorator(object.nameParam, {
                        rules: [{
                            required: object.paramCateg === 2,
                            message: 'Поле обязательно',
                        }],
                    })(
                        <Upload {...props} fileList={this.state.fileList}>
                            <Button>
                                <Icon type="upload"/> Зарузка файла
                            </Button>
                        </Upload>
                    )}
                </FormItem>
            )
        }
        if (object.asgnType === 8 || object.asgnType === 7) {
            if (object.typeProp === 41 || object.typeProp ===11 || object.typeProp ===51 || object.typeProp ===60 ) {
                return (
                    <FormItem {...formItemLayout} label={object.name[this.lng]}>
                        {getFieldDecorator(object.nameParam, {
                            rules: [{
                                required: object.paramCateg === 2,
                                message: 'Поле обязательно',
                            }],
                        })(
                            <Select
                                mode={object.isUniq === 2 ? "tags" : ""}
                                placeholder={object.name[this.lng]}
                                onFocus={() => this.getOpton(object.keyType, object.nameParam)}


                            >
                                {this.state.dataOptons[object.nameParam] && this.state.dataOptons[object.nameParam].map(el => {
                                    return (
                                        <Option key={el.id} value={el.id}>
                                            {el.name[this.lng]}
                                        </Option>
                                    )
                                })}
                            </Select>
                        )}
                    </FormItem>
                )
            }
            if (object.typeProp === 21 || object.typeProp === 22 || object.typeProp === 311 ||object.typeProp === 315 || object.typeProp === 316) {
                return (
                    <FormItem {...formItemLayout} label={object.name[this.lng]}>
                        {getFieldDecorator(object.nameParam, {
                            rules: [{
                                required: object.paramCateg === 2,
                                message: 'Поле обязательно',
                            }],
                        })(
                            <Input
                                onChange={(e) => this.onChangeInput(e, object.nameParam)}
                                placeholder={object.name[this.lng]}

                            />
                        )}
                    </FormItem>
                )
            }
            if (object.typeProp === 312 || object.typeProp === 313 || object.typeProp === 314 ) {
                return (
                    <FormItem {...formItemLayout} label={object.name[this.lng]}>
                        {getFieldDecorator(object.nameParam, {
                            rules: [{
                                required: object.paramCateg === 2,
                                message: 'Поле обязательно',
                            }],
                        })(
                            <DatePicker
                                onChange={(e, date) => this.onChangedate(e, date, object.nameParam)}
                                placeholder={object.name[this.lng]}

                            />
                        )}
                    </FormItem>
                )
            }
            if (object.typeProp === 317  ) {
                const props = {
                    onChange: (e) => this.handleChangeFile(e, object.nameParam),
                    multiple: object.isUniq === 2 ? true : false,
                };
                return (
                    <FormItem {...formItemLayout} label={object.name[this.lng]}>
                        {getFieldDecorator(object.nameParam, {
                            rules: [{
                                required: object.paramCateg === 2,
                                message: 'Поле обязательно',
                            }],
                        })(
                            <Upload {...props} fileList={this.state.fileList}>
                                <Button>
                                    <Icon type="upload"/> Зарузка файла
                                </Button>
                            </Upload>
                        )}
                    </FormItem>
                )
            }else {
                return""
            }
        }else {
            return ""
        }

    }
    showFilter = (e) => {
        this.lng = localStorage.getItem("i18nextLng");

        let content = this.props.reportTypeOptions.map(el => {

            return (
                <div>
                    {this.showProop(el)}
                </div>
            )
        })
        return content
    }

    onSubmit =  (e) => {
        e.preventDefault();
        this.setState({
            loading: true,
            reportDate:null,
        })
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                const fd = new FormData();
                let item = this.state.data
                    for (let key in item){
                        if(key==='typeReport') continue
                        if(key==='fundIndexKey'){
                            if (item[key]==="all"){
                            }else {
                                fd.append(key, Array.isArray(item[key])?item[key].join(","):item[key]);

                            }
                        }else {
                            fd.append(key, Array.isArray(item[key])?item[key].join(","):item[key]);

                        }
                    }
                fd.append("periodType",this.props.periodType)
                fd.append("dte",this.props.dateReport)
                fd.append("formReport",this.props.initialValues.id)
                let config = {
                    headers:{
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                        'Accept': 'application/json; charset=utf-8'
                    }
                }
                axios.post(`/${localStorage.getItem('i18nextLng')}${this.props.initialValues.urlJasper}`,fd,config)
                        .then((res)=>{

                            if(!!res.data.errors){
                                for (let val of res.data.errors){
                                    message.error(val.text)
                                    this.setState({
                                        loading: false
                                    })
                                }
                            }
                            if(res.data.success===true){
                                if(this.state.data.typeReport !== "pdf"){
                                    window.open(`${process.env.PUBLIC_URL}/${res.data.data.excel}`)
                                }
                                this.setState({
                                    reportDate:res.data.data,
                                    loading:false
                                })
                            }
                        })
                        .catch((eror)=>{
                            this.setState({
                                loading: false
                            })
                            message.error(eror.response.data)
                        })
            }else {
                this.setState({
                    loading: false,
                    reportDate:null,
                })
            }

        });
    }

    onChangeInput = (e, val) => {
        const contact = this.state.data;
        contact[val] = e.target.value;
        this.setState({data: contact});

    }
    onChangeSelect = (e, val) => {
        const contact = this.state.data;
        contact[val] = e;
        this.setState({data: contact});

    }
    onChangedate = (mom, date, val) => {
        const contact = this.state.data;
        contact[val] = moment(date ,"YYYY-MM-DD").format("DD-MM-YYYY")
        this.setState({data: contact});
    }
    onChangeChecboks = (e, val) => {
        const contact = this.state.data;
        contact[val] = e.target.value;
        this.setState({data: contact});
    }
    onChangeMultiSelect = (e, val) => {
        const contact = this.state.data;
        contact[val] = e;
        this.setState({data: contact});
    }
    handleChangeFile = (info, val) => {
        let fileList = info.fileList;

        const contact = this.state.data;
        contact[val] = fileList;
        this.setState({data: contact});
        this.setState({fileList});
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        this.lng = localStorage.getItem("i18nextLng");
        return (
            <Spin spinning={this.state.loading}>
            <Row>
                <Col span={10}>
                    <div style={{
                        border:"2px solid rgba(204, 204, 204, 0.47)",
                        padding:"10px",
                        margin:"5px",
                        height: "calc(100vh - 81px)"
                    }}>
                        <Form
                            className="antForm-spaceBetween"
                            onSubmit={this.onSubmit}

                        >
                            {this.showFilter()}

                            <FormItem {...formItemLayout} label={"Тип отчета"}>
                                {getFieldDecorator("typeReport", {
                                    rules: [{
                                        required: true,
                                        message: 'Поле обязательно',
                                    }],
                                })(
                                    <Select
                                        placeholder={"Тип отчета"}
                                        onChange={e => this.onChangeSelect(e, "typeReport")}
                                    >
                                        <Option value="pdf">PDF</Option>
                                        <Option value="excel">EXCEL</Option>
                                    </Select>
                                )}
                            </FormItem>
                            <Row>
                                <Col  span={18} offset={6}>
                                    <Button type="primary" style={{marginLeft:"10px"}} onClick={this.onSubmit}>
                                        Показать
                                    </Button>
                                    <Button type="primary" style={{marginLeft:"10px"}} onClick={this.onSubmit}>
                                        Сформировать
                                    </Button>


                                </Col>
                            </Row>


                        </Form>
                    </div>
                </Col>
                <Col span={14}>
                    <div style={{textAlign:"center",
                        border:"2px solid rgba(204, 204, 204, 0.47)",
                        padding:"10px",
                        margin:"5px",
                        height: "calc(100vh - 81px)"

                    }}>
                        {!!this.state.reportDate && this.state.data.typeReport === "pdf" ?(
                            <div style={{height:"100#"}}>
                                <iframe style={{height: "calc(100vh - 81px)"}} height={"100%"} width={"100%"} src={`${process.env.PUBLIC_URL}/${this.state.reportDate[this.state.data.typeReport]}`} />
                            </div>
                        ):(
                            <h1>
                                Здесь будет ваш отчет
                            </h1>
                        )}
                    </div>
                </Col>
            </Row>
            </Spin>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

const WrappedDynamicRule = Form.create()(MainInfoReportForm);

export default connect(
    mapStateToProps,
    {
        getObjChildsById,
        getPropValByConst,
        factorValLoaded,
        getPropValById,
        getPropVal
    }
)(WrappedDynamicRule);


