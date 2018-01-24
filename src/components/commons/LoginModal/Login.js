import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Icon, Button, Checkbox } from 'antd'

const FormItem = Form.Item

class Login extends PureComponent {
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        try {
          this.props.login(values)
          this.props.hideLoginModal()
        } catch (err) {
          console.error(err, 'error')
        }
      }
    })
  }
  render () {
    const { form } = this.props
    const { getFieldDecorator } = form
    return (
      <div className="main">
        <h3>登录</h3>
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            { getFieldDecorator('email', {
              rules: [{
                required: true, message: '请输入注册邮箱',
              }],
            })(<Input
              size="large"
              prefix={<Icon type="mail" className="prefixIcon" />}
              placeholder="注册邮箱"
            />)
            }
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{
                required: true, message: '请输入密码！',
              }],
            })(<Input
              size="large"
              prefix={<Icon type="lock" className="prefixIcon" />}
              type="password"
              placeholder="888888"
            />)}
          </FormItem>
          <FormItem className="additional">
            {
              getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(<Checkbox className="autoLogin">自动登录</Checkbox>)
            }
            <a className="forgot" href="">忘记密码</a>
            <Button size="large" className="submit" type="primary" htmlType="submit">
              登录
            </Button>
          </FormItem>
        </Form>
      </div>
    )
  }
  
}

Login.propTypes = {
  form: PropTypes.any,
  hideLoginModal: PropTypes.any,
  login: PropTypes.any,
}


export default Form.create()(Login)

