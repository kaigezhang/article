import React, { PureComponent } from 'react'
import ToolbarIcon from './ToolbarIcon'

const INLINE_STYLE = 0
const LINK = 1
const BLOCK_TYPE = 2
const HEADER = 3

const TOOLBAR_ICONS = [
  {
    typeId: 'header',
    icon: 'head',
    styleType: HEADER,
  },
  {
    typeId: 'BOLD',
    icon: 'bold',
    styleType: INLINE_STYLE,
  },
  {
    typeId: 'ITALIC',
    icon: 'italic',
    styleType: INLINE_STYLE,
  },
  {
    typeId: 'LINK',
    icon: 'link',
    styleType: LINK,
  },
  {
    typeId: 'blockquote',
    icon: 'quote',
    styleType: BLOCK_TYPE,
  },
  {
    typeId: 'unordered-list-item',
    icon: 'unordered',
    styleType: BLOCK_TYPE,
  },
  {
    typeId: 'ordered-list-item',
    icon: 'orderer',
    styleType: BLOCK_TYPE,
  },
  // {
  //   typeId: 'code-block',
  //   icon: 'code',
  //   styleType: BLOCK_TYPE,
  // },
]

export default class InlineToolbar extends PureComponent {
  constructor(props) {
    super(props)
    this.onToggle = this.onToggle.bind(this)
  }

  onToggle(typeId, styleType) {
    switch (styleType) {
      case INLINE_STYLE:
        this.props.toggleStyle(typeId)
        break
      case LINK:
        const url = prompt('Enter url', 'http://www.')
        if (url !== null) {
          this.props.toggleLink(url)
        }
        break
      case BLOCK_TYPE:
        this.props.toggleBlockType(typeId)
        break
      case HEADER:
        this.props.toggleHeader()
        break
      default:
        console.log(typeId, 'not handled')
    }
  }


  render() {
    const { editorState } = this.props
    const currentStyle = editorState.getCurrentInlineStyle()

    const selectionState = editorState.getSelection()
    const selectionKey = selectionState.getStartKey()
    const contentState = editorState.getCurrentContent()
    // get the block where the cursor is
    const block = contentState.getBlockForKey(selectionKey)
    const blockType = block.getType()
    // get the entity where the cursor is
    const entityKey = block.getEntityAt(selectionState.getStartOffset())
    console.log('blockType', blockType)
    console.log('entityKey', entityKey)
    let entityType = ''

    if (entityKey && blockType !== 'atomic') {
      const entityInstance = contentState.getEntity(entityKey)
      entityType = entityInstance.getType()
    }

    const {
      position = {
        top: 0,
        left: 0,
      },
    } = this.props

    const styleExp = {
      top: position.top,
      left: position.left,
      transform: `scale(${this.props.showToolbar ? '1' : '0'})`,
    }

    return (

      this.props.showToolbar ? (
        <div className="inline-toolbar" style={styleExp}>
          <ul className="toolbar-icons">
            {
              TOOLBAR_ICONS.map(item => (
                <ToolbarIcon
                  key={item.typeId}
                  type={item.typeId}
                  styleType={item.styleType}
                  icon={item.icon}
                  active={currentStyle.has(item.typeId) || entityType === item.typeId || blockType === item.typeId}
                  onToggle={this.onToggle}
                />
              ))
            }
          </ul>
        </div>
      ) : null

    )
  }
}
