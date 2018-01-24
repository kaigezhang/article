import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ToolbarIcon from './ToolbarIcon'

const IMAGE = 6
const DASH_LINE = 7

const SIDE_ICONS = [
  // {
  //   typeId: 'IMAGE',
  //   icon: 'image',
  //   styleType: IMAGE
  // },
  // {
  //   typeId: 'EMBED',
  //   icon: 'embed',
  //   styleType: BLOCK_STYLE
  // },
  // {
  //   typeId: 'CODE_BLOCK',
  //   icon: 'codeBlock',
  //   styleType: BLOCK_STYLE
  // },
  // {
  //   typeId: 'TABLE',
  //   icon: 'table',
  //   styleType: BLOCK_STYLE
  // },
  {
    typeId: 'DIVIDER',
    icon: 'divider',
    styleType: DASH_LINE,
  },
]


export default class SideToolbar extends PureComponent {
  constructor(props) {
    super(props)
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onToggle = this.onToggle.bind(this)
  }

  onToggle(id, styleType) {
    console.log(styleType, 'type')
    switch (styleType) {
      case IMAGE:
        this.props.onUploadImage()
        break
      case DASH_LINE:
        this.props.insertDashLine()
        break
      default:
        break
    }
    // this.props.toggleBlockType(styleType)
  }

  onMouseDown(e) {
    // e.stopPropagation( )
    e.preventDefault()
    this.props.onToggleExpand()
  }

  render() {
    const { editorState, position, isExpanded } = this.props
    const selection = editorState.getSelection()
    const currentBlockType = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType()

    return (
      <div className="side-toolbar" style={{ top: position.top }}>
        <button className="expand-button" onMouseDown={this.onMouseDown}>
          <svg viewBox="0 0 24 24">
            <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
          </svg>
        </button>
        {(
          isExpanded ? (
            <div className="toolbar-wrapper">
              <ul className="toolbar-icons">
                {
                  SIDE_ICONS.map(item => (
                    <ToolbarIcon
                      key={item.typeId}
                      type={item.typeId}
                      styleType={item.styleType}
                      icon={item.icon}
                      active={currentBlockType === item.typeId}
                      onToggle={this.onToggle}
                    />
                  ))
                }
              </ul>
            </div>
          ) : null
        )}

      </div>
    )
  }
}

SideToolbar.propTypes = {
  editorState: PropTypes.object.isRequired,
  position: PropTypes.object.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onUploadImage: PropTypes.func.isRequired,
  insertDashLine: PropTypes.func.isRequired,
}
