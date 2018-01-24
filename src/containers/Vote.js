import React from 'react'
import { connect } from 'react-redux'
import Vote from 'components'
import { fromResource, fromUser } from 'store/selectors'
import { resourceUpdateRequest } from 'store/actions'

const VoteContainer = props => <Vote {...props} />
const mapStateToProps = state => ({
  currentAnnotation: fromResource.getDetail(state, 'annotations'),
  currentUser: fromUser.getUser(state),
})

const mapDispatchToProps = dispatch => ({
  updateAnnotation: (annotation, vote) => dispatch(resourceUpdateRequest('annotations', annotation, vote)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VoteContainer)
