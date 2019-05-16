import React, { Component } from 'react';
import MainInfoCaseForm from "./MainInfoReportForm";
import AntTabs from "../../../AntTabs";
import {Button, Spin, Form, Input, Icon, DatePicker, Upload, Select, Collapse} from "antd";
import axios from "axios"
import moment from "moment";

class CardReport_invTypeDigital_uprDoc extends Component {
    state={
        dataoption:{},
        fileList:[],
        reportTypeOptions: [],

        loading: false
    }
    componentDidMount() {
        this.getReportFilter()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.initialValues !== this.props.initialValues) {
            this.getReportFilter()
        }
    }

    getReportFilter = async () => {
        this.setState({
            loading: true
        })
        const fd = new FormData();
        fd.append("formReport", this.props.initialValues.id);
        axios.post(`/${localStorage.getItem('i18nextLng')}/report/getReportParams`, fd)
            .then (async (res)  => {
                let propsObj =[]
                let dara = [...res.data.data]
                for (let val of dara){
                    let keyType
                    for(let key in val) {
                        if (String(key) === "factorVal") {
                            keyType = {[key]: val[key]}
                            break
                        }
                        if (String(key) === "factor") {
                            keyType = {[key]: val[key]}
                            break
                        }
                        if (String(key) === "prop") {
                            keyType = {[key]: val[key]}
                            break
                        }
                        if (String(key) === "obj") {
                            keyType = {[key]: val[key]}
                            break
                        }
                        if (String(key) === "cls") {
                            keyType = {[key]: val[key]}
                            break
                        }
                        if (String(key) === "typ") {
                            keyType = {[key]: val[key]}
                            break
                        }
                    }
                    if(val.asgnType !==8) {
                        propsObj.push({
                            asgnType: val.asgnType,
                            name: val.name,
                            nameParam: val.nameParam,
                            paramCateg: val.paramCateg,
                            isUniq: val.isUniq,
                            keyType:keyType
                        })
                    }
                    else {
                        let da = await this.getPropType(val.prop)
                        propsObj.push({
                            asgnType: val.asgnType,
                            name: val.name,
                            nameParam: val.nameParam,
                            paramCateg: val.paramCateg,
                            isUniq: val.isUniq,
                            typeProp:!!da?da:"",
                            keyType:keyType

                        })
                    }
                }


                this.setState({
                    reportTypeOptions:propsObj,
                    loading: false

                })
            })
            .catch(err => {
                this.setState({
                    loading: false
                })
                console.log(err)
            })
    }


           getPropType =  async (prop) => {
               const fd = new FormData();
               fd.append("idProp", prop);
               let promResp =  await  axios.post(`/${localStorage.getItem('i18nextLng')}/entity/getPropById`, fd)


       let da = !!promResp.data.data?promResp.data.data.typeProp:""
        return promResp;
    }



  render() {
      const { t, tofiConstants, saveProps, initialValues, keyInv, invType,docType } = this.props;
    return <Spin spinning={this.state.loading}>
        <AntTabs
      tabs={[
        {
          tabKey: 'mainInfo',
            tabName: t('MAIN_INFO'),
          tabContent: <MainInfoCaseForm
              initialValues={initialValues}
              tofiConstants={tofiConstants}
              reportTypeOptions={!!this.state.reportTypeOptions? this.state.reportTypeOptions:[]}
          />
        },

      ]}
    />
    </Spin>
  }
}

export default CardReport_invTypeDigital_uprDoc;