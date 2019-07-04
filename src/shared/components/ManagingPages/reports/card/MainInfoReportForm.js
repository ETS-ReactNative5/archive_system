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

    getOpton = (data, val) => {
        if(!!data.disabled){
            const fd = new FormData();
            fd.append("dte", this.props.dateReport);
            fd.append("periodType", this.props.periodType);
            fd.append("formReportParam", data.id);
            for(let val of data.disabled ){
                if (Array.isArray(this.state.data[val.nameParam])) {
                    let data = this.state.data[val.nameParam].join(',')
                    fd.append(val.nameParam,data);
                }else{
                    let data = this.state.data[val.nameParam]
                    fd.append(val.nameParam,data);
                }
            }
            axios.post(`/${localStorage.getItem('i18nextLng')}/report/getReportParamValues`, fd)
                .then(res => {
                    if (res.data.success===false && res.data.errors){
                        for(let val of  res.data.errors){
                            message.error(val.text)
                        }
                        return false
                    }
                    const contact = this.state.dataOptons;
                    contact[val] = res.data.data

                    this.setState({dataOptons: contact,});

                })
                .catch(err => {
                    console.log(err)
                })
        }else {
            const fd = new FormData();
            fd.append("dte", this.props.dateReport);
            fd.append("periodType", this.props.periodType);
            fd.append("formReportParam", data.id);
            axios.post(`/${localStorage.getItem('i18nextLng')}/report/getReportParamValues`, fd)
                .then(res => {
                    if (res.data.success===false && res.data.errors){
                        for(let val of  res.data.errors){
                            message.error(val.text)
                        }
                        return false
                    }
                    const contact = this.state.dataOptons;
                    contact[val] = res.data.data

                    this.setState({dataOptons: contact,});

                })
                .catch(err => {
                    console.log(err)
                })
        }

        // for (let key in keys) {
        //     if (String(key) === "factorVal") {
        //         if (Array.isArray(keys[key])) {
        //             let data = keys[key].join(',')
        //             const fd = new FormData();
        //             fd.append("factorValIds", data);
        //             axios.post(`/${localStorage.getItem('i18nextLng')}/entity/getFactorValByIds`, fd)
        //                 .then(res => {
        //                     const contact = this.state.dataOptons;
        //                     contact[val] = res.data.data
        //
        //                     this.setState({dataOptons: contact,});
        //
        //                 })
        //                 .catch(err => {
        //                     console.log(err)
        //                 })
        //         } else {
        //             let data = keys[key]
        //             const fd = new FormData();
        //             fd.append("factorId", data);
        //             axios.post(`/${localStorage.getItem('i18nextLng')}/entity/getFactorVal`, fd)
        //                 .then(res => {
        //                     const contact = this.state.dataOptons;
        //                     contact[val] = res.data.data
        //
        //                     this.setState({dataOptons: contact,});
        //
        //                 })
        //                 .catch(err => {
        //                     console.log(err)
        //                 })
        //         }
        //         break
        //     }
        //     if (String(key) === "factor") {
        //         if (Array.isArray(keys[key])) {
        //             let data = keys[key].join(',')
        //             const fd = new FormData();
        //             fd.append("factorValIds", data);
        //             axios.post(`/${localStorage.getItem('i18nextLng')}/entity/getFactorValByIds`, fd)
        //                 .then(res => {
        //                     const contact = this.state.dataOptons;
        //                     contact[val] = res.data.data
        //
        //                     this.setState({dataOptons: contact,});
        //
        //                 })
        //                 .catch(err => {
        //                     console.log(err)
        //                 })
        //         } else {
        //             let data = keys[key]
        //             const fd = new FormData();
        //             fd.append("factorId", data);
        //             axios.post(`/${localStorage.getItem('i18nextLng')}/entity/getFactorVal`, fd)
        //                 .then(res => {
        //                     const contact = this.state.dataOptons;
        //                     contact[val] = res.data.data
        //
        //                     this.setState({dataOptons: contact,});
        //
        //                 })
        //                 .catch(err => {
        //                     console.log(err)
        //                 })
        //         }
        //         break
        //     }
        //     if (String(key) === "prop") {
        //         if (Array.isArray(keys[key])) {
        //             let data = keys[key].join(',')
        //             const fd = new FormData();
        //             fd.append("propIds", data);
        //             axios.post(`/${localStorage.getItem('i18nextLng')}/entity/getPropByIds`, fd)
        //                 .then(res => {
        //                     const contact = this.state.dataOptons;
        //                     contact[val] = res.data.data
        //
        //                     this.setState({dataOptons: contact,});
        //
        //                 })
        //                 .catch(err => {
        //                     console.log(err)
        //                 })
        //         } else {
        //             let data = keys[key]
        //             const fd = new FormData();
        //             fd.append("dimPropId", data);
        //             axios.post(`/${localStorage.getItem('i18nextLng')}/entity/getPropByDimProp`, fd)
        //                 .then(res => {
        //                     const contact = this.state.dataOptons;
        //                     contact[val] = res.data.data
        //
        //                     this.setState({dataOptons: contact,});
        //
        //                 })
        //                 .catch(err => {
        //                     console.log(err)
        //                 })
        //         }
        //         break
        //     }
        //     if (String(key) === "obj") {
        //         if (Array.isArray(keys[key])) {
        //             let data = keys[key].join(',')
        //             const fd = new FormData();
        //             fd.append("objIds", data);
        //             axios.post(`/${localStorage.getItem('i18nextLng')}/entity/getObjListByIds`, fd)
        //                 .then(res => {
        //                     const contact = this.state.dataOptons;
        //                     contact[val] = res.data.data
        //
        //                     this.setState({dataOptons: contact,});
        //
        //                 })
        //                 .catch(err => {
        //                     console.log(err)
        //                 })
        //         } else {
        //             let data = keys[key]
        //             const fd = new FormData();
        //             fd.append("objIds", data);
        //             axios.post(`/${localStorage.getItem('i18nextLng')}/entity/getObjListByIds`, fd)
        //                 .then(res => {
        //                     const contact = this.state.dataOptons;
        //                     contact[val] = res.data.data
        //
        //                     this.setState({dataOptons: contact,});
        //
        //                 })
        //                 .catch(err => {
        //                     console.log(err)
        //                 })
        //         }
        //         break
        //     }
        //     if (String(key) === "cls") {
        //         if (val === "fundType"){
        //             if (Array.isArray(keys[key])) {
        //
        //                 let data = keys[key].join(',')
        //                 const fd = new FormData();
        //                 fd.append("clsIds", data);
        //                 axios.post(`/${localStorage.getItem('i18nextLng')}/entity/getClsListByIds`, fd)
        //                     .then(res => {
        //                         const contact = this.state.dataOptons;
        //                         contact[val] = res.data.data
        //
        //                         this.setState({dataOptons: contact,});
        //
        //                     })
        //                     .catch(err => {
        //                         console.log(err)
        //                     })
        //             }
        //             }
        //         else if (Array.isArray(keys[key])) {
        //             let data = keys[key].join(',')
        //             const fd = new FormData();
        //             fd.append("clsIds", data);
        //             axios.post(`/${localStorage.getItem('i18nextLng')}/entity/getObjListByCls`, fd)
        //                 .then(res => {
        //                     const contact = this.state.dataOptons;
        //                     contact[val] = res.data.data
        //
        //                     this.setState({dataOptons: contact,});
        //
        //                 })
        //                 .catch(err => {
        //                     console.log(err)
        //                 })
        //         } else {
        //             let data = keys[key]
        //             const fd = new FormData();
        //             fd.append("clsIds", data);
        //             axios.post(`/${localStorage.getItem('i18nextLng')}/entity/getObjListByCls`, fd)
        //                 .then(res => {
        //                     const contact = this.state.dataOptons;
        //                     contact[val] = res.data.data;
        //                     this.setState({dataOptons: contact,});
        //
        //                 })
        //                 .catch(err => {
        //                     console.log(err)
        //                 })
        //         }
        //         break
        //     }
        //     if (String(key) === "typ") {
        //         if (Array.isArray(keys[key])) {
        //             let data = keys[key].join(',')
        //             const fd = new FormData();
        //             fd.append("typIds", data);
        //             axios.post(`/${localStorage.getItem('i18nextLng')}/entity/getObjListByTyp`, fd)
        //                 .then(res => {
        //                     const contact = this.state.dataOptons;
        //                     contact[val] = res.data.data
        //
        //                     this.setState({dataOptons: contact,});
        //
        //                 })
        //                 .catch(err => {
        //                     console.log(err)
        //                 })
        //         } else {
        //             let data = keys[key]
        //             const fd = new FormData();
        //             fd.append("typIds", data);
        //             axios.post(`/${localStorage.getItem('i18nextLng')}/entity/getObjListByTyp`, fd)
        //                 .then(res => {
        //                     const contact = this.state.dataOptons;
        //                     contact[val] = res.data.data;
        //                     this.setState({dataOptons: contact,});
        //
        //                 })
        //                 .catch(err => {
        //                     console.log(err)
        //                 })
        //         }
        //         break
        //     }
        // }
    }
    disabledProp = (obj)=>{
        if (!!obj.disabled){
            let arrBooleon = []
            for (let val of obj.disabled){
                if (!!this.state.data[val.nameParam]){
                    arrBooleon.push(false)
                }else {
                    arrBooleon.push(true)
                }
            }
            for (let val of arrBooleon){
                if (val === true){
                    return true
                }
            }
        }
        return false
    }
    showProop = (object) => {
        const {getFieldDecorator} = this.props.form;
        if ( object.val.nameParam !== "fundIndexKey"&& object.val.asgnType === 3 || object.val.asgnType === 4 || object.val.asgnType === 5 || object.val.asgnType === 6  || object.val.asgnType === 9 || object.val.asgnType === 10 || object.val.asgnType === 11 || object.val.asgnType === 12 || object.val.asgnType === 13 || object.val.asgnType === 14) {
            return (

                <FormItem {...formItemLayout} label={object.val.name[this.lng]}>
                    {getFieldDecorator(object.val.nameParam, {
                        rules: [{
                            required: object.val.paramCateg === 2,
                            message: 'Поле обязательно',
                        }],
                    })(
                        <Select
                            mode={object.val.isUniq === 2 ? "multiple" : ""}
                            placeholder={object.val.name[this.lng]}
                            disabled ={this.disabledProp(object.val)}
                            optionFilterProp="label"
                            onFocus={() => this.getOpton(object.val, object.val.nameParam)}
                            onChange={object.val.isUniq === 2 ? (e) => this.onChangeMultiSelect(e, object.val.nameParam) : (e) => this.onChangeSelect(e, object.val.nameParam)}
                        >
                            {this.state.dataOptons[object.val.nameParam] && this.state.dataOptons[object.val.nameParam].map(el => {
                                return (
                                    <Option key={el.id} label={el.name[this.lng]} value={el.id}>
                                        {el.name[this.lng]}
                                    </Option>
                                )
                            })}
                        </Select>
                    )}
                </FormItem>
            )
        }
        if (object.val.nameParam === "fundIndexKey") {
            return (

                <FormItem {...formItemLayout} label={object.val.name[this.lng]}>
                    {getFieldDecorator(object.val.nameParam, {
                        rules: [{
                            required: object.val.paramCateg === 2,
                            message: 'Поле обязательно',
                        }],
                    })(
                        <Select
                            mode={object.val.isUniq === 2 ? "multiple" : ""}
                            placeholder={object.val.name[this.lng]}
                            disabled ={this.disabledProp(object.val)}
                            onFocus={() => this.getOpton(object.val, object.val.nameParam)}
                            onChange={object.val.isUniq === 2 ? (e) => this.onChangeMultiSelect(e, object.val.nameParam) : (e) => this.onChangeSelect(e, object.val.nameParam)}
                        >
                            <Option value="all">Все</Option>
                            <Option value={true}>Да</Option>
                            <Option value={false}>Нет</Option>
                        </Select>
                    )}
                </FormItem>
            )
        }


        if (object.val.asgnType === 1) {
            return (
                <FormItem {...formItemLayout} label={object.val.name[this.lng]}>
                    {getFieldDecorator(object.val.nameParam, {
                        rules: [{
                            required: object.val.paramCateg === 2,
                            message: 'Поле обязательно',
                        }],
                    })(
                        <DatePicker
                            onChange={(e, date) => this.onChangedate(e, date, object.val.nameParam)}
                            placeholder={object.val.name[this.lng]}
                            disabled ={this.disabledProp(object.val)}


                        />
                    )}
                </FormItem>
            )
        }
        if (object.val.asgnType === 15) {
            return (
                <FormItem {...formItemLayout} label={object.val.name[this.lng]}>
                    {getFieldDecorator(object.val.nameParam, {
                        rules: [{
                            required: object.val.paramCateg === 2,
                            message: 'Поле обязательно',
                        }],
                    })(
                        <Input
                            onChange={(e) => this.onChangeInput(e, object.val.nameParam)}
                            placeholder={object.val.name[this.lng]}
                            disabled ={this.disabledProp(object.val)}


                        />
                    )}
                </FormItem>
            )
        }
        if (object.val.asgnType === 16) {
            const props = {
                onChange: (e) => this.handleChangeFile(e, object.val.nameParam),
                multiple: object.val.isUniq === 2 ? true : false,
            };
            return (
                <FormItem {...formItemLayout} label={object.val.name[this.lng]}>
                    {getFieldDecorator(object.val.nameParam, {
                        rules: [{
                            required: object.val.paramCateg === 2,
                            message: 'Поле обязательно',
                        }],
                    })(
                        <Upload
                            disabled ={this.disabledProp(object.val)}
                            {...props} fileList={this.state.fileList}>
                            <Button>
                                <Icon type="upload"/> Зарузка файла
                            </Button>
                        </Upload>
                    )}
                </FormItem>
            )
        }
        if (object.val.asgnType === 8 ) {
            return (
                <FormItem {...formItemLayout} label={object.val.name[this.lng]}>
                    {getFieldDecorator(object.val.nameParam, {
                        rules: [{
                            required: object.val.paramCateg === 2,
                            message: 'Поле обязательно',
                        }],
                    })(
                        <Select
                            mode={object.val.isUniq === 2 ? "multiple" : ""}
                            placeholder={object.val.name[this.lng]}
                            optionFilterProp="label"
                            onFocus={() => this.getOpton(object.val, object.val.nameParam)}
                            disabled ={this.disabledProp(object.val)}
                            onChange={object.val.isUniq === 2 ? (e) => this.onChangeMultiSelect(e, object.val.nameParam) : (e) => this.onChangeSelect(e, object.val.nameParam)}
                        >
                            {this.state.dataOptons[object.val.nameParam] && this.state.dataOptons[object.val.nameParam].map(el => {
                                return (
                                    <Option key={el.id} label={el.name[this.lng]} value={el.id}>
                                        {el.name[this.lng]}
                                    </Option>
                                )
                            })}
                        </Select>
                    )}
                </FormItem>
            )
        }
            if (object.val.asgnType === 7) {
            if (object.typeProp === 41 || object.typeProp ===11 || object.typeProp ===51 || object.typeProp ===60 ) {
                return (
                    <FormItem {...formItemLayout} label={object.val.name[this.lng]}>
                        {getFieldDecorator(object.val.nameParam, {
                            rules: [{
                                required: object.val.paramCateg === 2,
                                message: 'Поле обязательно',
                            }],
                        })(
                            <Select
                                mode={object.val.isUniq === 2 ? "multiple" : ""}
                                placeholder={object.val.name[this.lng]}
                                onFocus={() => this.getOpton(object.val, object.val.nameParam)}
                                disabled ={this.disabledProp(object.val)}
                                onChange={object.val.isUniq === 2 ? (e) => this.onChangeMultiSelect(e, object.val.nameParam) : (e) => this.onChangeSelect(e, object.val.nameParam)}
                                optionFilterProp="label"
                            >
                                {this.state.dataOptons[object.val.nameParam] && this.state.dataOptons[object.val.nameParam].map(el => {
                                    return (
                                        <Option key={el.id} label={el.name[this.lng]} value={el.id}>
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
                    <FormItem {...formItemLayout} label={object.val.name[this.lng]}>
                        {getFieldDecorator(object.val.nameParam, {
                            rules: [{
                                required: object.val.paramCateg === 2,
                                message: 'Поле обязательно',
                            }],
                        })(
                            <Input
                                onChange={(e) => this.onChangeInput(e, object.val.nameParam)}
                                placeholder={object.val.name[this.lng]}
                                disabled ={this.disabledProp(object.val)}

                            />
                        )}
                    </FormItem>
                )
            }
            if (object.typeProp === 312 || object.typeProp === 313 || object.typeProp === 314 ) {
                return (
                    <FormItem {...formItemLayout} label={object.val.name[this.lng]}>
                        {getFieldDecorator(object.val.nameParam, {
                            rules: [{
                                required: object.val.paramCateg === 2,
                                message: 'Поле обязательно',
                            }],
                        })(
                            <DatePicker
                                disabled ={this.disabledProp(object.val)}
                                onChange={(e, date) => this.onChangedate(e, date, object.val.nameParam)}
                                placeholder={object.val.name[this.lng]}
                            />
                        )}
                    </FormItem>
                )
            }
            if (object.typeProp === 317  ) {
                const props = {
                    onChange: (e) => this.handleChangeFile(e, object.val.nameParam),
                    multiple: object.val.isUniq === 2 ? true : false,
                };
                return (
                    <FormItem {...formItemLayout} label={object.val.name[this.lng]}>
                        {getFieldDecorator(object.val.nameParam, {
                            rules: [{
                                required: object.val.paramCateg === 2,
                                message: 'Поле обязательно',
                            }],
                        })(
                            <Upload
                                disabled ={this.disabledProp(object.val)}
                                {...props} fileList={this.state.fileList}>
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
                const fd = new FormData();
                let item = this.state.data
                    for (let key in item){
                        if(key==='typeReport') continue
                        if(key==='fundIndexKey'){
                            if (item[key]==="all"){
                                fd.append(key, "");
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
        contact[val] = moment(date ,"YYYY-MM-DD").format("YYYY-MM-DD")
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
                        height: "calc(88vh - 81px)"
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
                        height: "calc(88vh - 81px)"

                    }}>
                        {!!this.state.reportDate && this.state.data.typeReport === "pdf" ?(
                            <div style={{height:"100#"}}>
                                <iframe style={{height: "calc(86vh - 81px)"}} height={"100%"} width={"100%"} src={`${process.env.PUBLIC_URL}/${this.state.reportDate[this.state.data.typeReport]}`} />
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


