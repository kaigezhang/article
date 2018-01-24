import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Editor, EditorState, convertFromRaw } from 'draft-js'
import { Button, Icon } from 'antd'

import AnnotationField from './AnnotationField'


class Annotation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showAnnotationForm: false,
      editorState: EditorState.createEmpty(),
      readOnly: true,
    }

    this.readOnly = 'true'
    this.onChange = editorState => this.setState(editorState)

    this.newAnnotation = this.newAnnotation.bind(this)
    this.showAnnotation = this.showAnnotation.bind(this)
    this.editAnnotation = this.editAnnotation.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
  }

  componentDidMount() {
    /* 如果用户是靠点击注解进入的话, 获取到用户点击的注解, 并获取相应的评论 */

    const { currentAnnotation } = this.props
    if (currentAnnotation && currentAnnotation.id) {
      this.props.fetchAnnotationComments(currentAnnotation.id)
      const raw = convertFromRaw(JSON.parse(currentAnnotation.body))
      this.setState({
        editorState: EditorState.createWithContent(raw),
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentAnnotation && nextProps.currentAnnotation.id) {
      const raw = convertFromRaw(JSON.parse(nextProps.currentAnnotation.body))
      this.setState({
        editorState: EditorState.createWithContent(raw),
        type: nextProps.annotationType,
      })
    }

    // 如果用户点击了其他区域,选择框消失时,侧边栏同时关闭

    if (this.props.selectors !== nextProps.selectors) {
      this.props.closeAnnotation()
    }
  }

  newAnnotation() {
    // return this.props.showAnnotationForm && (
    return (
      <section className="annotation new-annotation">
        <form>
          <AnnotationField
            formType="new"
            user={this.props.currentUser}
            paperId={this.props.paperId}
            selectors={this.props.selectors}
            createAnnotation={this.props.createAnnotation}
            closeAnnotation={this.props.closeAnnotation}
            fetchAnnotations={this.props.fetchAnnotations}
            updateAnnotation={this.props.updateAnnotation}
          />
        </form>
      </section>
    )
  }

  handleDelete() {
    this.props.deleteAnnotation(this.props.currentAnnotation.id)
      .then(() => this.props.fetchAnnotations())
      .then(() => this.props.closeAnnotation())
  }

  handleEdit() {
    // 新建改为修改
    this.props.changeAnnotationType('edit')
  }
  showAnnotation() {
    let deleteButton = ''
    let editButton = ''
    let author = ''

    if (this.props.currentUser && this.props.currentUser.id === this.props.currentAnnotation.author_id) {
      deleteButton = <Button icon="delete" onClick={this.handleDelete} />
      editButton = <Button icon="edit" onClick={this.handleEdit} />
    } else {
      author = (
        <span style={{ fontStyle: 'italic', color: '#9a9a9a' }}>
          作者: { this.props.currentAnnotation.author.username }
        </span>
      )
    }

    return (
      <section className="annotation show-annotation">
        <Editor
          editorState={this.state.editorState}
          readOnly={this.readOnly}
        />
        { author }
        <div className="annotation-controls">
          { deleteButton }
          { editButton }
        </div>
      </section>
    )
  }

  editAnnotation() {
    return (
      <section className="annotation new-annotation">
        <form>
          <AnnotationField
            formType="edit"
            currentAnnotation={this.props.currentAnnotation}
            user={this.props.currentUser}
            paperId={this.props.paperId}
            selectors={this.props.selectors}
            closeAnnotation={this.props.closeAnnotation}
            fetchAnnotations={this.props.fetchAnnotations}
            updateAnnotation={this.props.updateAnnotation}
          />
        </form>
      </section>
    )
  }

  render() {
    const {
      currentUser, showAnnotation, closeAnnotation, annotationType,
    } = this.props
    return (
      <div className={`pdf-comment-wrapper ${showAnnotation ? 'active' : ''}`} style={{ padding: '12px 24px' }}>
        <div className="comment-header">
          <Icon type="close" onClick={closeAnnotation} style={{ float: 'left', cursor: 'pointer', fontSize: 18 }} />
        </div>
        { annotationType === 'new' && this.newAnnotation() }
        { annotationType === 'show' && this.showAnnotation() }
        { annotationType === 'eidt' && this.editAnnotation() }
      </div>
    )
  }
}

Annotation.propTypes = {
  annotationType: PropTypes.any,
  changeAnnotationType: PropTypes.any,
  closeAnnotation: PropTypes.any,
  closeComment: PropTypes.any,
  createAnnotation: PropTypes.any,
  currentAnnotation: PropTypes.any,
  currentUser: PropTypes.any,
  deleteAnnotation: PropTypes.any,
  fetchAnnotationComments: PropTypes.any,
  fetchAnnotations: PropTypes.any,
  handleEdit: PropTypes.any,
  paperId: PropTypes.any,
  selectors: PropTypes.any,
  showAnnotation: PropTypes.any,
  showAnnotationForm: PropTypes.any,
  updateAnnotation: PropTypes.any,
  openLoginModal: PropTypes.any,
  position: PropTypes.any,
}

export default Annotation

