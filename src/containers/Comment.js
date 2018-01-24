import React from 'react'
import { connect } from 'react-redux'
import { resourceCreateRequest } from 'store/actions'
import { fromUser } from 'store/selectors'
import { Comment } from 'components'

const CommentContainer = props => <Comment {...props} />


const mapStateToProps = state => ({
  user: fromUser.getUser(state),
})
const mapDispatchToProps = dispatch => ({
  saveComment: data => dispatch(resourceCreateRequest('annotations', data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CommentContainer)
