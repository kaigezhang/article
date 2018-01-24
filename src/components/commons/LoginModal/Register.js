import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button } from 'antd'

const FormItem = Form.Item

class Register extends PureComponent {
  checkConfirm = (rule, value, callback) => {
    const { form } = this.props
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不匹配!')
    } else {
      callback()
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        try {
          this.props.register(values)
          this.props.hideLoginModal()
        } catch (err) {
          console.error(err, 'error')
        }
      }
    })
  }
  render() {
    const { form } = this.props
    const { getFieldDecorator } = form

    return (
      <div className="main">
        <h3>注册</h3>
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {
              getFieldDecorator('username', {
                rules: [
                  {
                    required: true,
                    message: '请输入用户名',
                  },
                ],
              })(<Input size="large" placeholder="用户名" />)
            }
          </FormItem>
          <FormItem>
            {
              getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    message: '请输入邮箱',
                  }, {
                    type: 'email',
                    message: '邮箱地址错误',
                  },
                ],
              })(<Input size="large" placeholder="邮箱" />)
            }
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: '请输入密码',
                },
              ],
            })(<Input
              size="large"
              type="password"
              placeholder="至少6位密码，区分大小写"
            />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: '请确认密码！',
                },
                {
                  validator: this.checkConfirm,
                },
              ],
            })(<Input size="large" type="password" placeholder="确认密码" />)}
          </FormItem>
          <FormItem>
            <Button
              size="large"
              className="submit"
              type="primary"
              htmlType="submit"
            >
              注册
            </Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}

export default Form.create()(Register)

Register.propTypes = {
  form: PropTypes.any,
  hideLoginModal: PropTypes.any,
  register: PropTypes.any,
}
