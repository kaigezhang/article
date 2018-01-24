import React from 'react'
import PropTypes from 'prop-types'
import { Button as AtButton } from 'antd'

const Button = ({
  classname, icon, clickHandler,
}) => (
  <AtButton className={classname} onClick={clickHandler} icon={icon} />
)

Button.propTypes = {
  classname: PropTypes.string,
  icon: PropTypes.string,
  clickHandler: PropTypes.func.isRequired,
}

Button.defaultProps = {
  classname: '',
  icon: 'gear',
}

export default Button
