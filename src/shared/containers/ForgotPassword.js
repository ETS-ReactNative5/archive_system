import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';

class ForgotPassword extends Component {

  render() {
    return (
      <div id="ForgotPassword" className="forgot-password">
        <div className="forgot-password__header">

        </div>
        <div className="forgot-password__body">
          <Form>
            <Form.Item
              label="Ваша почта:"
              labelCol= {{ span: 10 }}
              wrapperCol= {{ span: 14 }}
            >
              <Input
                placeholder="login@email.com"
              />
            </Form.Item>
          </Form>
          Place for recapcha
        </div>

        <div className="forgot-password__footer">
          <Button>OK</Button>
          <Button>Cancel</Button>
        </div>
      </div>
    );
  }
}

export default ForgotPassword;
