import React, { Component } from 'react';
import AntTable from "../../AntTable";
import MainInfoFundMaker from "./MainInfoFundMaker";
import RenameFormFoundMaker from "./RenameFormFoundMaker";
import LiquidationFoundMaker from "./LiquidationFoundMaker";
import AntTabs from "../../AntTabs";
import {Button, Col, Input, Row} from "antd";
import {isEmpty, isEqual} from "lodash";

class ReorganizationFoundMaker extends Component {


    changeSelectedRow = rec => {
        if(isEmpty(this.state.selectedRow) || !isEqual(this.state.selectedRow, rec)){
            this.setState({ selectedRow: rec })
        } else {
            this.props.history.push(`/sra/createDocument/${this.state.selectedRow.number}/${this.state.selectedRow.key}`);
        }
    };



    render(){
        const lng = localStorage.getItem('i18nextLng');
        const {tofiConstants: {dateReorganization,orgRightReceiver,reasonFundmaker,orgFunction,structure,orgIndustry,legalStatus,structureFundmaker,orgFunctionFundmaker,departmentalAccessory,}, t,orgRightReceiverOptions, handleSubmit, reset, dirty, error, submitting} = this.props;
        return(
            <div >
                <div className="table-header-btns"  style={{marginTop: "1vw", marginLeft: '5px', marginRight: '5px'}} >
                    <Row>
                        <Col span={16}>
                            <Input onChange={this.changeObjName} value={this.state.newObjName}/>
                        </Col>
                        <Col span={8}>
                            <Button type="primary" icon="plus-circle-o"
                                    loading={this.state.iconLoading}
                                    style={{margin: '5px'}}
                                    disabled={!this.state.newObjName}
                                    onClick={this.addRow}>
                                {this.props.t('ADD_REORGANIZATION')}
                            </Button>
                        </Col>
                    </Row>
                </div>
                <AntTable
                    style={{marginTop: "1vw"}}
                    loading={false}
                    columns={[
                        {
                            key: 'number',
                            title: '№',
                            dataIndex: 'number',
                            width: '5%'
                        },
                        {
                            key: 'dateReorganization',
                            title: t('DATE_REORGANIZATION'),
                            dataIndex: 'dateReorganization',
                            width: '12%'
                        },
                        {
                            key: 'orgRightReceiver',
                            title: t('ORG_RIGHT_RECEIVER'),
                            dataIndex: 'orgRightReceiver',
                            width: '15%'
                        },
                        {
                            key: 'reasonFundmaker',
                            title: t('REASON_FUNDMAKER'),
                            dataIndex: 'reasonFundmaker',
                            width: '15%'
                        },
                        {
                            key: 'orgIndustry',
                            title: orgIndustry.name[lng],
                            dataIndex: 'orgIndustry',
                            width: '10%'
                        },
                        {
                            key: 'legalStatus',
                            title: legalStatus.name[lng],
                            dataIndex: 'legalStatus',
                            width: '10%'
                        },
                        {
                            key: 'structureFundmaker',
                            title: structureFundmaker.name[lng],
                            dataIndex: 'structureFundmaker',
                            width: '10%'
                        },
                        {
                            key: 'orgFunctionFundmaker',
                            title: orgFunctionFundmaker.name[lng],
                            dataIndex: 'orgFunctionFundmaker',
                            width: '10%'
                        },
                    {
                        key: 'departmentalAccessory',
                        title: departmentalAccessory.name[lng],
                        dataIndex: 'departmentalAccessory',
                        width: '15%'
                    }
                    ]}
                    hidePagination
                    changeSelectedRow={this.changeSelectedRow}
                    openedBy="CreateDocument"
                />
            </div>
        )
    }
}


export default ReorganizationFoundMaker;