import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from 'draft-js'
import 'draft-js/dist/Draft.css'
import { Button, Icon, Card, Radio } from 'antd'
import { UserAvatar } from 'containers'
import './index.less'

const RadioGroup = Radio.Group
const RadioButton = Radio.Button

class AnnotationField extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: '',
      editorState: EditorState.createEmpty(),
      color: 1,
    }


    this.onChange = editorState => this.setState({ editorState })
    this.handleSubmit = this.handleSubmit.bind(this)

    this.focus = this.focus.bind(this)
    this.onBoldClick = this.onBoldClick.bind(this)
    this.onItalicsClick = this.onItalicsClick.bind(this)
    this.onUnderlineClick = this.onUnderlineClick.bind(this)
    this.onHeaderClick = this.onHeaderClick.bind(this)
  }

  componentDidMount() {
    if (this.props.formType === 'edit') {
      const raw = convertFromRaw(JSON.parse(this.props.currentAnnotation.body))
      this.setState({
        editorState: EditorState.createWithContent(raw),
      })
    }
  }

  focus() {
    this.editor.focus()
  }
  onBoldClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'))
  }
  onItalicsClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'))
  }
  onUnderlineClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'))
  }
  onHeaderClick() {
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

  handleSubmit() {
    const text = this.state.editorState.getCurrentContent().getPlainText()
    if (text.length === 0) {
      const error = (
        <span className="annotation-error">
          注解不能为空
        </span>
      )
      this.setState({ errors: error })
    } else {
      const raw = convertToRaw(this.state.editorState.getCurrentContent())

      const string = JSON.stringify(raw)
      if (this.props.formType === 'new') {
        this.props.createAnnotation({
          annotation: {
            body: raw,
            paper_id: this.props.paperId,
            selectors: this.props.selectors,
            color: this.state.color,
          },
        }).then(() => this.props.fetchAnnotations(this.props.paperId))
      } else {
        this.props.updateAnnotation({
          annotation: {
            id: this.props.currentAnnotation.id,
            body: string,
          },
        })
      }

      this.props.closeAnnotation()
    }
  }

  onColorChange = (e) => {
    this.setState({
      color: e.target.value,
    })
  }

  render() {
    const header = this.props.formType === 'new' ? 'Drop some knowledge' : 'Edit this annotation'

    return (


      <Card
        title={(<div><UserAvatar size={32} /><h4 className="new-annotation-header">{ header }</h4></div>)}
        extra={
          <RadioGroup onChange={this.onColorChange} defaultValue="1">
            <RadioButton value="1">普通</RadioButton>
            <RadioButton value="2">问题</RadioButton>
          </RadioGroup>
        }
        bordered={false}
      >
        <div className="text-editor">
          <div className="toolbar">
            <span onMouseDown={this.onBoldClick}>
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M13.5,15.5H10V12.5H13.5A1.5,1.5 0 0,1 15,14A1.5,1.5 0 0,1 13.5,15.5M10,6.5H13A1.5,1.5 0 0,1 14.5,8A1.5,1.5 0 0,1 13,9.5H10M15.6,10.79C16.57,10.11 17.25,9 17.25,8C17.25,5.74 15.5,4 13.25,4H7V18H14.04C16.14,18 17.75,16.3 17.75,14.21C17.75,12.69 16.89,11.39 15.6,10.79Z" />
              </svg>
            </span>
            <span onMouseDown={this.onItalicsClick}>
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M10,4V7H12.21L8.79,15H6V18H14V15H11.79L15.21,7H18V4H10Z" />
              </svg>
            </span>
            <span onMouseDown={this.onUnderlineClick}>
              <svg viewBox="0 0 1024 1024" width="19" height="19">
                <path d="M708.022857 64.365714l127.268571 0 0 415.451429c0 157.988571-143.36 288.182857-320.365714 288.182857s-320.365714-128.731429-320.365714-288.182857L194.56 64.365714l127.268571 0 0 415.451429c0 39.497143 17.554286 78.994286 51.2 108.251429 36.571429 33.645714 86.308571 51.2 140.434286 51.2s103.862857-17.554286 140.434286-51.2c33.645714-29.257143 51.2-67.291429 51.2-108.251429L705.097143 64.365714 708.022857 64.365714zM196.022857 832.365714l639.268571 0 0 127.268571L196.022857 959.634286C196.022857 959.634286 196.022857 832.365714 196.022857 832.365714z" />
              </svg>
            </span>
            <span onMouseDown={this.onHeaderClick}>
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M2.5 4v3h5v12h3V7h5V4h-13zm19 5h-9v3h3v7h3v-7h3V9z" />
              </svg>
            </span>
          </div>
          { this.state.errors }
          <div className="draft-field" onClick={this.focus}>
            <Editor
              ref={div => this.editor = div}
              editorState={this.state.editorState}
              onChange={this.onChange}
            />
          </div>

          <div className="annotation-controls">
            <Button onClick={this.handleSubmit}>保存</Button>
            <Button onClick={this.props.closeAnnotation}>取消</Button>
          </div>
        </div>
      </Card>


    )
  }
}

export default AnnotationField

AnnotationField.propTypes = {
  closeAnnotation: PropTypes.any,
  createAnnotation: PropTypes.any,
  currentAnnotation: PropTypes.any,
  fetchAnnotations: PropTypes.any,
  formType: PropTypes.any,
  paperId: PropTypes.any,
  selectors: PropTypes.any,
  updateAnnotation: PropTypes.any,
  user: PropTypes.any,
}
