import React from 'react';
import {Button, Form, Input} from "antd";
import {isEmpty, isEqual, pickBy} from "lodash";
import AntTable from "../../AntTable";


class RenameFormFoundMaker extends React.PureComponent {

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
        const {
            t, tofiConstants: {dateRename, reasonFundmaker, reasonFundmakerFile}
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
                            width: '5%'
                        },
                        {
                            key: 'dateRename',
                            title: dateRename.name[lng],
                            dataIndex: 'dateRename',
                            width: '20%'
                        }, {
                            key: 'fullName',
                            title: t('NAME'),
                            dataIndex: 'fullName',
                            width: '15%'
                        },
                        {
                            key: 'name',
                            title: t('SHORT_NAME'),
                            dataIndex: 'name',
                            width: '20%'
                        },
                        {
                            key: 'reasonFundmaker',
                            title: reasonFundmaker.name[lng],
                            dataIndex: 'reasonFundmaker',
                            width: '25%'
                        },
                        {
                            key: 'reasonFundmakerFile',
                            title: reasonFundmakerFile.name[lng],
                            dataIndex: 'reasonFundmakerFile',
                            width: '15%'
                        }
                    ]}
                    hidePagination
                    changeSelectedRow={this.changeSelectedRow}
                    openedBy="RenameFormFoundMaker"
                />
            </div>
        )
    }
}
export default RenameFormFoundMaker;