import React from 'react';
import {Button, Form, Input} from "antd";
import {isEmpty, isEqual, pickBy} from "lodash";
import AntTable from "../../AntTable";


class ReorganizationFoundMaker extends React.PureComponent {

    changeSelectedRow = rec => {
        if(isEmpty(this.state.selectedRow) || !isEqual(this.state.selectedRow, rec)){
            this.setState({ selectedRow: rec })
        } else {
            this.props.history.push(`/sra/createDocument/${this.state.selectedRow.number}/${this.state.selectedRow.key}`);
        }
    };

    render() {
        if (!this.props.tofiConstants) return null;
        const lng = localStorage.getItem('i18nextLng');
        const {t, tofiConstants: {reasonFundmaker,orgIndustry,reasonFundmakerFile,legalStatus,structureFundmaker,orgFunctionFundmaker,departmentalAccessory,}
        } = this.props;

        return (
            <div >
                <div className="table-header-btns"  style={{marginTop: "1vw", marginLeft: '5px', marginRight: '5px'}} >
                    <Button >{this.props.t('ADD_RENAME')}</Button>
                </div>
                <AntTable
                    style={{marginTop: "1vw"}}
                    loading={false}
                    columns={[
                        {
                            key: 'number',
                            title: '№',
                            dataIndex: 'number',
                            width: '5%',
                        },
                        {
                            key: 'dateReorganization',
                            title: t('DATE_REORGANIZATION'),
                            dataIndex: 'dateReorganization',
                            width: '8%'
                        },
                        {
                            key: 'orgRightReceiver',
                            title: t('ORG_RIGHT_RECEIVER'),
                            dataIndex: 'orgRightReceiver',
                            width: '15%'
                        },
                        {
                            key: 'reasonFundmaker',
                            title: reasonFundmaker.name[lng],
                            dataIndex: 'reasonFundmaker',
                            width: '15%'
                        },
                        {
                            key: 'reasonFundmakerFile',
                            title:reasonFundmakerFile.name[lng],
                            dataIndex: 'reasonFundmakerFile',
                            width: '7%'
                        },
                        {
                            key: 'orgIndustry',
                            title: orgIndustry.name[lng],
                            dataIndex: 'orgIndustry',
                            width: '7%'
                        },
                        {
                            key: 'legalStatus',
                            title: legalStatus.name[lng],
                            dataIndex: 'legalStatus',
                            width: '12%'
                        },
                        {
                            key: 'structureFundmaker',
                            title: structureFundmaker.name[lng],
                            dataIndex: 'structureFundmaker',
                            width: '8%'
                        },{
                            key: 'structure',
                            title: structureFundmaker.name[lng],
                            dataIndex: 'structureFundmaker',
                            width: '8%'
                        },
                        {
                            key: 'orgFunctionFundmaker',
                            title: orgFunctionFundmaker.name[lng],
                            dataIndex: 'orgFunctionFundmaker',
                            width: '8%'
                        },
                        {
                            key: 'departmentalAccessory',
                            title: departmentalAccessory.name[lng],
                            dataIndex: 'departmentalAccessory',
                            width: '12%'
                        }
                    ]}
                    hidePagination
                    changeSelectedRow={this.changeSelectedRow}
                    openedBy="ReorganizationFoundMaker"
                />
            </div>
        )
    }
}
export default ReorganizationFoundMaker;
