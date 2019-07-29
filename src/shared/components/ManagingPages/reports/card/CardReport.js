import React, { Component } from 'react';
import MainInfoReportForm from "./MainInfoReportForm";
import AntTabs from "../../../AntTabs";
import {Button, Spin,message, Form, Input, Icon, DatePicker, Upload, Select, Collapse} from "antd";
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
                if (res.data.success===false && res.data.errors){
                    for(let val of  res.data.errors){
                        message.error(val.text)
                    }
                    return false
                }
                let propsObj =[]
                let dara = [...res.data.data]

                dara.sort((a,b)=>{
                        return a.ord- b.ord
                    })
                for (let val of dara){
                    let keyType
                    for(let key in val) {
                        if (String(key) === "factorVal" && val[key] !==0) {
                            keyType = {[key]: val[key]}
                            break
                        }
                        if (String(key) === "factor" && val[key] !==0) {
                            keyType = {[key]: val[key]}
                            break
                        }
                        if (String(key) === "prop" && val[key] !==0 ) {
                            keyType = {[key]: val[key]}
                            break
                        }
                        if (String(key) === "obj" && val[key] !==0) {
                            keyType = {[key]: val[key]}
                            break
                        }

                        if (String(key) === "typ" && val[key] !==0) {
                            keyType = {[key]: val[key]}
                            break
                        }
                        if (String(key) === "cls" && val[key] !==0) {
                            keyType = {[key]: val[key]}
                            break
                        }
                    }
                    if(val.asgnType ===8  || val.asgnType ===7 ) {

                        propsObj.push({
                            val:val,
                            typeProp:val.typeProp,
                            keyType:keyType
                        })
                    }
                    else {

                        propsObj.push({
                            val:val,

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



  render() {
      const { t, tofiConstants, saveProps,dateReport, initialValues,periodType, keyInv, invType,docType } = this.props;
      this.lng = localStorage.getItem("i18nextLng");
    return <Spin spinning={this.state.loading}>
        <AntTabs
      tabs={[
        {
          tabKey: 'mainInfo',
          tabName:initialValues.name[this.lng],
          tabContent: <MainInfoReportForm
              initialValues={initialValues}
              tofiConstants={tofiConstants}
              periodType={periodType}
              dateReport={dateReport}
              reportTypeOptions={!!this.state.reportTypeOptions? this.state.reportTypeOptions:[]}
          />
        },

      ]}
    />
    </Spin>
  }
}

export default CardReport_invTypeDigital_uprDoc;