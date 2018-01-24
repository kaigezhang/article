import React from 'react'
import { connect } from 'react-redux'
import { fromUser, fromComment } from 'store/selectors'
import CommentIndex from 'components'
import {
  resourceCreateRequest, resourceDeleteRequest, resourceDetailReadRequest,
  resourceUpdateRequest,
} from 'store/actions'

const CommentIndexContainer = props => <CommentIndex {...props} />

const mapStateToProps = (state) => ({
  currentUser: fromUser.getUser(state),
  errors: fromComment.getErrors(state),
})

const mapDispatchToProps = dispatch => ({
  createComment: comment => dispatch(resourceCreateRequest('comments', comment)),
  deleteComment: id => dispatch(resourceDeleteRequest('comments', id)),
  updateComment: comment => dispatch(resourceUpdateRequest('comments', comment)),
  fetchComment: id => dispatch(resourceDetailReadRequest('comments', id)),
  // clearErrors: () => dispatch(cl)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentIndexContainer)
