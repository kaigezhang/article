import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Icon from '../Svg'

const buttonIcons = {
  bold: <Icon size={18} className="icon" name="bold" />,
  italic: <Icon size={18} className="icon" name="italic" />,
  head: <Icon size={18} className="icon" name="head" />,
  link: <Icon size={18} className="icon" name="link" />,
  quote: <Icon size={18} className="icon" name="quote" />,
  unordered: <Icon size={18} className="icon" name="unordered" />,
  orderer: <Icon size={18} className="icon" name="ordered" />,
  code: <Icon size={18} className="icon" name="code" />,
  image: <Icon size={18} className="icon" name="image" />,
  codeBlock: <Icon size={18} className="icon" name="codeBlock" />,
  embed: <Icon size={18} className="icon" name="embed" />,
  table: <Icon size={18} className="icon" name="table" />,
  divider: <Icon size={18} className="icon" name="divider" />,
}

export default class ToolbarIcon extends PureComponent {
  constructor(props) {
    super(props)
    this.onMouseDown = this.onMouseDown.bind(this)
  }
  onMouseDown(e) {
    e.preventDefault()
    this.props.onToggle(this.props.type, this.props.styleType)
  }
  
  render() {
    const {
      active,
      icon,
    } = this.props
    return (
      <li
        onMouseDown={this.onMouseDown}
      >
        <button
          className={active ? 'active' : ''}
        >
          { buttonIcons[icon] }
        </button>
      </li>
    )
  }
}

ToolbarIcon.propTypes = {
  type: PropTypes.string.isRequired,
  styleType: PropTypes.number.isRequired,
  active: PropTypes.bool.isRequired,
  icon: PropTypes.string.isRequired,
  onToggle: PropTypes.func.isRequired,
}

