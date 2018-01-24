import React, { Component } from 'react'
import {
  Editor,
  EditorState,
  RichUtils,
  AtomicBlockUtils,
  Modifier,
} from 'draft-js'
import 'draft-js/dist/Draft.css'
import extendedBlockRenderMap from './components/Entities/Wrapper'
// import { MediaBlock, blockRenderer } from './components/Entities/Block'
import { utils } from './utils/utils'

import Image from './components/Entities/Image'
import SideToolbar from './components/Toolbars/SideToolbar'
import InlineToolbar from './components/Toolbars/InlineToolbar'

import './less/index.less'

class Note extends Component {
  constructor(props) {
    super(props)

    // this.sideToolbarTimeout = null
    this.state = {
      editorState: EditorState.createEmpty(),
      inlineToolbar: { show: false },
      sideToolbar: { show: false, isExpanded: false },
    }

    this.onChange = this.onChange.bind(this)
    this.focus = this.focus.bind(this)
    this.blur = this.blur.bind(this)
    this.handleKeyCommand = this.handleKeyCommand.bind(this)
    // this.toggleSideToolbar = this.toggleSideToolbar.bind(this)
    this.handleUploadImage = this.handleUploadImage.bind(this)
    this.updateSelection = this.updateSelection.bind(this)

    this.handleFileInput = this.handleFileInput.bind(this)
    this.insertImage = this.insertImage.bind(this)

    this.blockRenderer = this.blockRenderer.bind(this)
    this.myBlockStyleFn = this.myBlockStyleFn.bind(this)
    this.onTab = this.onTab.bind(this)
    this.removeImage = this.removeImage.bind(this)
    // sideToolbar function
    this.onToggleExpand = this.onToggleExpand.bind(this)

    // inlineToolbar function
    this.toggleInlineStyle = this.toggleInlineStyle.bind(this)
    this.toggleBlockType = this.toggleBlockType.bind(this)
    this.toggleHeader = this.toggleHeader.bind(this)
    this.insertDashLine = this.insertDashLine.bind(this)
  }

  focus() {
    this.refs.editor.focus()
  }
  blur() {
    this.refs.editor.blur()
  }

  onToggleExpand() {
    const isExpanded = this.state.sideToolbar.isExpanded
    this.setState({
      sideToolbar: {
        isExpanded: !isExpanded,
      },
    })
  }

  handleKeyCommand(command) {
    const { editorState } = this.state
    const newState = RichUtils.handleKeyCommand(editorState, command)
    if (newState) {
      this.onChange(newState)
      return 'handled'
    }
    return 'not-handled'
  }

  onChange(editorState) {
    // const { updateContent, saveContents, disabled } = this.props

    // 如果存在selection, 显示工具栏进行格式化
    const selection = utils.selection.getSelection()
    if (!selection.isCollapsed && !editorState.getSelection().isCollapsed() && selection.range) {
      const offset = utils.selection.getSelectionCoords(this.container, selection.range)

      this.setState({
        inlineToolbar: {
          show: true,
          position: {
            top: offset.top,
            left: offset.left,
          },
        },
      })
    } else {
      this.setState({
        inlineToolbar: { show: false },
        sideToolbar: { isExpanded: false },
      })
    }
    this.setState({ editorState })

    // const newContentState = editorState.getCurrentContent()
    // const newHtmlContent = this.contentStateToHTML(newContentState)
    // const oldHtmlContent = this.state.htmlContent
    // const rawContent = convertToRaw(editorState.getCurrentContent())
    // this.setState({
    //   htmlContent: newHtmlContent,
    // })

    // update redux state
    // updateContent(this.addCompositeDecorator(editorState))

    // add save function on change

    // if (!disabled && saveContents && newHtmlContent !== oldHtmlContent && editorState !== this.props.editorState) {
    //   saveContents(rawContent, newHtmlContent)
    // }

    setTimeout(() => {
      this.updateSelection()
    }, 0)
  }

  onTab(event) {
    const { editorState } = this.state

    const contentState = editorState.getCurrentContent()
    const selectionState = editorState.getSelection()
    const selectionKey = selectionState.getStartKey()
    const currentBlock = contentState.getBlockForKey(selectionKey)
    const blockType = currentBlock.getType()

    if (blockType === 'ordered-list-item' || blockType === 'unordered-list-item') {
      const maxDepth = 9
      this.onChange(RichUtils.onTab(event, editorState, maxDepth))
    } else {
      const rangeRemoved = Modifier.removeRange(
        contentState,
        selectionState,
        'backward'
      )
      const rangeRemovedState = EditorState.push(editorState, rangeRemoved, 'selection-removed')

      const tabAdded = Modifier.insertText(
        rangeRemovedState.getCurrentContent(),
        rangeRemovedState.getSelection(),
        '   '
      )

      const newState = EditorState.push(editorState, tabAdded, 'tab-added')
      this.onChange(newState)

      event.preventDefault()
    }
  }

  updateSelection() {
    const selectionRange = utils.selection.getSelection().range
    let selectedBlock = null
    if (selectionRange && selectionRange.collapsed) {
      selectedBlock = utils.selection.getSelectedBlockElement(selectionRange)
    }
    this.setState({
      selectedBlock,
      selectionRange,
    })
  }

  handleUploadImage() {
    this.refs.fileInput.click()
  }

  handleFileInput(e) {
    const fileList = e.target.files
    const file = fileList[0]
    this.insertImage(file)
  }

  insertImage(file) {
    const { editorState } = this.state
    const contentState = editorState.getCurrentContent()

    const entityKey = contentState.createEntity(
      'IMAGE',
      'IMMUTABLE',
      { src: URL.createObjectURL(file) }
    )
    const newState = AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ')
    this.onChange(newState)
  }

  insertDashLine() {
    const { editorState } = this.state
    const contentState = editorState.getCurrentContent()
    const entityKey = contentState.createEntity(
      'DASH',
      'IMMUTABLE',
      { }
    )
    const newState = AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ')
    this.onChange(newState)
  }

  toggleBlockType(blockType) {
    const { editorState } = this.state
    const newState = RichUtils.toggleBlockType(editorState, blockType)
    this.onChange(newState)
  }
  toggleInlineStyle(inlineStyle) {
    const { editorState } = this.state
    const newState = RichUtils.toggleInlineStyle(editorState, inlineStyle)
    this.onChange(newState)
  }

  toggleHeader() {
    const { editorState } = this.state
    const selectionKey = editorState.getSelection().getStartKey()
    // get the block where the cursor is
    const blockType = editorState.getCurrentContent().getBlockForKey(selectionKey).getType()
    const HeaderList = ['unstyled', 'header-two', 'header-three', 'header-four']
    let key = HeaderList.indexOf(blockType)
    let newBlockType = ''
    if (key < 3) {
      newBlockType = HeaderList[++key]
    } else if (key === 3) {
      newBlockType = HeaderList[0]
    }

    const newState = RichUtils.toggleBlockType(editorState, newBlockType)
    this.onChange(newState)
  }

  // eslint-disable-next-line consistent-return
  blockRenderer(block) {
    if (block.getType() === 'atomic') {
      return {
        component: this.mediaBlockRenderer,
        editable: false,
      }
    }
  }
  // eslint-disable-next-line consistent-return
  myBlockStyleFn(contentBlock) {
    const type = contentBlock.getType()
    // switch (type) {
    //   case 'code-block':
    //     return 'code'
    //     break;
    //   case 'blockquote':
    //     return 'blockquote'
    //     break
    //   case 'atomic':
    //     return 'atomic'
    //     break
    //   default:
    //     return 'paragraph'
    //     break;
    // }
    if (type === 'code-block') {
      return 'code'
    } else if (type === 'unstyled') {
      return 'paragraph'
    }
  }

  mediaBlockRenderer(props) {
    // const entityKey = props.block.getEntityAt(0)
    // const entity = props.contentState.getEntity(entityKey)
    // const entityKey = props.contentState.getLastCreatedEntityKey()
    // const entity = props.contentState.getEntity(entityKey)
    // const entityData = entity.getData()
    // const entityType = entity.getType()

    // let media = null
    // if (entity === 'IMAGE') {
    //   media = <Image src={entityData.src} align={entityData.align} entityKey={entityKey} contentState={props.contentState} removeImage={this.removeImage}/>;
    // } else if (entity === 'DASH') {
    //   media = <div className="dash"><hr/></div>
    // }
    // return media

    const entityKey = props.contentState.getLastCreatedEntityKey()
    const entity = props.contentState.getEntity(entityKey)
    const entityData = entity.getData()
    const entityType = entity.getType()

    let media = null
    if (entityType === 'IMAGE') {
      media = <Image src={entityData.src} align={entityData.align} entityKey={entityKey} contentState={this.props.contentState} removeImage={this.removeImage} />
    } else if (entityType === 'DASH') {
      media = <div className="dash"><hr /></div>
    }
    return media
  }

  removeImage(entityKey) {
    const { editorState } = this.state
    const entityRange = utils.selection.getEntityRange(editorState, entityKey)
    const selection = editorState.getSelection()
    const entitySelection = selection.merge({
      anchorKey: entityRange.blockKey,
      anchorOffset: entityRange.start,
      focusKey: entityRange.blockKey,
      focusOffset: entityRange.end,
    })

    const withoutImage = Modifier.removeRange(editorState.getCurrentContent(), entitySelection, 'backward')
    const resetBlock = Modifier.setBlockType(
      withoutImage,
      withoutImage.getSelectionAfter(),
      'unstyled'
    )
    const newState = EditorState.push(editorState, resetBlock, 'remove-range')

    this.onChange(EditorState.forceSelection(newState, resetBlock.getSelectionAfter()))
    setTimeout(() => {
      this.refs.editor.focus()
    }, 0)
  }

  render() {
    const {
      editorState, inlineToolbar, sideToolbar, selectedBlock, selectedRange,
    } = this.state
    const editor = this.container
    let sideToolbarOffsetTop = 0
    if (selectedBlock && ((parent, child) => {
      let node = child.parentNode
      while (node !== null) {
        if (node === parent) {
          return true
        }
        node = node.parentNode
      }
      return false
    })(editor, selectedBlock)
    ) {
      const editorBounds = editor.getBoundingClientRect()
      const blockBounds = selectedBlock.getBoundingClientRect()

      // eslint-disable-next-line no-magic-numbers
      sideToolbarOffsetTop = (blockBounds.top - editorBounds.top) - ((blockBounds.top - blockBounds.bottom) / 2) - 14
    }

    return (
      <div className="editor-wrapper">
        { selectedBlock &&
        <SideToolbar
          editorState={editorState}
          position={{ top: sideToolbarOffsetTop }}
          onToggle={this.toggleBlockType}
          onToggleExpand={this.onToggleExpand}
          toggleBlockType={this.toggleBlockType}
          onUploadImage={this.handleUploadImage}
          insertDashLine={this.insertDashLine}
          isExpanded={sideToolbar.isExpanded}
        />
        }
        { !sideToolbar.isExpanded &&
        <InlineToolbar
          editorState={editorState}
          toggleStyle={this.toggleInlineStyle}
          toggleBlockType={this.toggleBlockType}
          toggleHeader={this.toggleHeader}
          showToolbar={inlineToolbar.show}
          position={inlineToolbar.position}
        />
        }
        <div className="editor" id="richEditor" onClick={this.focus} ref={div => this.container = div}>
          <Editor
            ref="editor"
            editorState={editorState}
            blockRendererFn={this.blockRenderer}
            blockStyleFn={this.myBlockStyleFn}
            blockRenderMap={extendedBlockRenderMap}
            onTab={this.onTab}
            onChange={this.onChange}
            handleKeyCommand={this.handleKeyCommand}
            placeholder="drop some ideas..."
          />
        </div>

        <input type="file" ref="fileInput" style={{ display: 'none' }} onChange={this.handleFileInput} />
      </div>
    )
  }
}

export default Note
