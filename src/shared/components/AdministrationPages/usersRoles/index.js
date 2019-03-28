import React from 'react';
import {isEmpty, isEqual} from "lodash";
import {CSSTransition} from "react-transition-group";

import {createRole, getAllPermis, getRoles} from "../../../actions/actions";
import AntTable from "../../AntTable";
import SiderCard from "../../SiderCard";
import UsersRolesCard from './UsersRolesCard';
import {Form, Icon, Input, Button, Modal} from 'antd';

import FormItem from "antd/es/form/FormItem";


class UsersRoles extends React.Component {
    state = {
        inputValue: '',
        visible: false,
        loading: false,
        data: [],
        privilege: [],
        acceptedRoles: [],
        selectedRow: null,
        pageNameTest: 'Роли пользователей'
    };

    updateInputValue = (e) => {
        this.setState({
            inputValue: e.target.value
        })
    }


    showModal = () => {
        this.setState({
            visible: true,
        });
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

    renderTableHeader = () => {
        return (
            <div className="table-header">
                <div className="table-header-btns">
                    <Button
                        icon='plus'
                        shape='circle'
                        type='primary'
                        style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                        onClick={this.showModal}
                    />
                </div>
            </div>
        )
    };


    initChildren = el => {
        const result = {
            key: el.id,
            title: el.txt[localStorage.getItem('i18nextLng')]
        }
        if (el.hasChild) {
            result.children = this.permis
                .filter(elem => elem.parent == el.id)
                .map(this.initChildren);
        }
        return result;
    };

    componentDidMount() {
        getRoles()
            .then(
                response => {
                    this.setState({
                        data: response.data.map(item => ({...item, key: item.id}))
                    })
                }
            );

    }


    componentDidUpdate(prevProps, prevState) {
        console.log('update');
    }

    componentWillMount() {
        console.log('start mount');

    }

    changeSelectedRow = rec => {
        if (isEmpty(this.state.selectedRow) || (!isEqual(this.state.selectedRow, rec) && !this.state.openCard)) {
            this.setState({selectedRow: rec})
        } else {
            this.setState({openCard: true, selectedRow: rec})
        }
    };

    closeCard = () => {
        this.setState({openCard: false})
    };

    render() {

        const {t, tofiConstants} = this.props;

        const columns = [
            {
                key: 'id',
                title: 'id',
                dataIndex: 'id',
                width: '10%'
            },
            {
                key: 'fullName',
                title: 'Название роли',
                dataIndex: 'fullName',
                render: obj => obj && obj[localStorage.getItem('i18nextLng')],
                width: '90%'
            }
        ];

        return (
            <div className="Works">
                <Modal
                    footer={null}
                    title="Добавить роль"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Form layout="inline">
                        <FormItem>
                            <Input value={this.state.inputValue} onChange={this.updateInputValue}/>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" onClick={() => createRole(this.state.inputValue)}>Добавить
                                роль</Button>
                        </FormItem>
                    </Form>
                </Modal>

                {this.state.pageNameTest}
                <div className="Works__body">
                    <AntTable
                        title={this.renderTableHeader}
                        dataSource={this.state.data}
                        loading={this.state.loading}
                        columns={columns}
                        changeSelectedRow={this.changeSelectedRow}
                        openedBy="Works"
                    />

                    <CSSTransition
                        in={this.state.openCard}
                        timeout={300}
                        classNames="card"
                        unmountOnExit
                    >
                        <SiderCard
                            closer={<Button type='danger' onClick={this.closeCard} shape="circle" icon="arrow-right"/>}
                        >
                            <UsersRolesCard
                                t={t}
                                tofiConstants={tofiConstants}
                                record={this.state.selectedRow}
                            />

                        </SiderCard>
                    </CSSTransition>
                </div>


            </div>

        )
    }
}

export default UsersRoles;