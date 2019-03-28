import React, {Component} from 'react';
import {Form, Button, Icon, Input} from 'antd';
import {restorePassword} from "../actions/actions";
import * as message from "antd";

const FormItem = Form.Item;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}


class forgot_password extends Component {


    state = {
        newPass:''
    };

    updateNewPass = (e) => {
        this.setState({
            newPass: e.target.value
        })
    };





    render() {
        return (
            <div className="login-container">
                <h2>Восстановление пароля</h2>
                <Form layout="inline">
                    <FormItem>
                        <Input placeholder="Введите ваш Email" type="email" onChange={this.updateNewPass} required/>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit" icon="arrow-right" onClick={() => restorePassword(this.state.newPass)}> </Button>
                    </FormItem>
                </Form>
            </div>
        )
    };
}


export default forgot_password;