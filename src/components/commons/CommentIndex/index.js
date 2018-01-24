import React, { Component } from 'react'
import { CommentIndexItem } from './Comment_index_item'


class CommentIndex extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: '',
    }

    this.annotationComment = ''
    this.update = this.update.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    if (this.props.overRide) {
      this.annotationComment = 'annotation-comment'
    }
  }

  handleSubmit(e) {}
  update(e) {}
  render() {
    let comments = []
    const unSortedComments = this.props.comments
    let sortedComments = []

    if (this.porps.comments[0]) {
      sortedComments = this.props.comments.sort((a, b) => { return b.id - a.id })

      comments = sortedComments.map(comment => (
        <CommentIndexItem
          key={comment.id}
          comment={comment}
          currentUser={this.props.currentUser}
          deleteComment={this.props.deleteComment}
        />
      ))
    }

    let form = ''
    if (this.props.currentUser) {
      form = (<form className="comment-form">
        <textarea className="comment-body" placeholder="Add a comment" onChange={this.update} value={this.state.text} />
        <button className="annotation-submit" onClick={this.handleSubmit}>Submit</button>
              </form>)
    }

    return (
      <section className={`comments-container ${this.annotationComment}`} style={this.styles}>
        <section className="comments">
          <span className="annotation-error">
            { this.props.errors }
          </span>
          { form }
          <h2>Comments:</h2>
          <h1>{ comments }</h1>
        </section>
      </section>
    )
  }
}


export default CommentIndex
