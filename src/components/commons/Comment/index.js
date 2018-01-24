import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Button, Input, Icon, Row, Col, Card, Radio} from 'antd'
import { Note, UserAvatar } from 'components'
import { EditorState } from 'draft-js'
import {
  editorStateToJSON,
  editorStateFromRaw,
} from '../../../utils/convert'

import './index.less'

const RadioButton = Radio.Button
const RadioGroup = Radio.Group

class Comment extends PureComponent {
  constructor(props) {
    super(props)

    const INITAL_STATE = this.props.raw ? editorStateFromRaw(raw) : EditorState.createEmpty()
    this.state = {
      fullscreen: false,
      editorState: INITAL_STATE,
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.saveComment = this.saveComment.bind(this)
    this.toggleFullScreen = this.toggleFullScreen.bind(this)
    this.onChange = this.onChange.bind(this)
  }


  // componentDidMount() {
  //   if (!this.props.selectors) {
  //     this.closeComment()
  //   }
  // }

  componentWillReceiveProps(nextProps) {
    if (this.props.selectors !== nextProps.selectors) {
      this.props.closeComment()
    }
  }

  onChange = (editorState) => {
    this.setState({ editorState })
    console.log(editorStateToJSON(editorState))
  }

  handleInputChange(field) {
    return (e) => {
      this.setState({
        [field]: e.target.value,
      })
    }
  }
  saveComment() {
    try {
      this.props.saveComment({
        filename: this.props.filename,
        body: this.state.editorState,
        selectors: this.props.selectors,
      })
      this.props.highlightSelectors()
      this.props.closeComment()
      this.setState({
        title: '',
        body: '',
      })
    } catch (e) {
      console.error(e)
    }
  }

  toggleFullScreen() {
    this.setState({
      fullscreen: !this.state.fullscreen,
    })
  }

  onScroll = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }
  
  onColorChange = (e) => {
    console.log(`radio checked:${e.target.value}`);
  }
  render() {
    const { fullscreen, editorState } = this.state
    const { user, showComment, closeComment } = this.props
    return (
      <div className={`pdf-comment-wrapper ${showComment ? 'active' : ''} ${fullscreen ? 'fullscreen' : ''}`} style={{ padding: '12px 24px' }}>
        <div className="comment-header">
          <Icon type="close" onClick={closeComment} style={{ float: 'left', cursor: 'pointer', fontSize: 18 }} />
          <Icon type={fullscreen ? 'shrink' : 'arrows-alt'} onClick={this.toggleFullScreen} style={{ float: 'right', cursor: 'pointer', fontSize: 18 }} />
        </div>
        <div className="comment-edtor" onScroll={this.onScroll}>
          <Card
            title={
              <UserAvatar src={user.image} size={36} username={user.username} />
          }
            extra={
              <RadioGroup onChange={this.onColorChange} defaultValue="0">
                <RadioButton value="0">笔记</RadioButton>
                <RadioButton value="1">问题</RadioButton>
                <RadioButton value="2">文章</RadioButton>
              </RadioGroup>
            }
            style={{ width: 400, display: 'block', margin: '0 auto' }}
            bordered={false}
          >
            <Note
              editorState={editorState}
              placeholder="Drop some idea"
              onChange={this.onChange}
            />
          </Card>

        </div>


        <Button icon="save" onClick={this.saveComment} type="primary" style={{ position: 'absolute', bottom: '1rem', right: '10%' }}>保存</Button>
      </div>
    )
  }
}

Comment.propTypes = {
  user: PropTypes.object,
  showComment: PropTypes.bool.isRequired,
  closeComment: PropTypes.func.isRequired,
  selectors: PropTypes.any,
  filename: PropTypes.string,
  saveComment: PropTypes.func.isRequired,
  highlightSelectors: PropTypes.func.isRequired,
}

export default Comment
