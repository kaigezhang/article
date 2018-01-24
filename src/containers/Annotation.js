import React from 'react'
import { connect } from 'react-redux'
import { fromResource, fromUser } from 'store/selectors'
import { Annotation } from 'components'
import { resourceCreateRequest, resourceSubListReadRequest } from 'store/actions'
import { resourceDeleteRequest, resourceListReadRequest, resourceUpdateRequest } from '../store/resource/actions'

const AnnotationContainer = props => <Annotation {...props} />

const mapStateToProps = state => ({
  currentAnnotation: fromResource.getDetail(state, 'annotations'),
  currentUser: fromUser.getUser(state),
  currentPaper: fromResource.getDetail(state, 'papers'),
  annotationComments: fromResource.getList(state, 'comments'),
})

const mapDispatchToProps = dispatch => ({
  createAnnotation: data => dispatch(resourceCreateRequest('annotations', data)),
  deleteAnnotation: aid => dispatch(resourceDeleteRequest('annotations', aid)),
  updateAnnotation: annotation => dispatch(resourceUpdateRequest('annotations', annotation.id, annotation)),
  fetchAnnotations: params => dispatch(resourceListReadRequest('annotations', params)),
  fetchAnnotationComments: (aid, params) => dispatch(resourceSubListReadRequest('comments', `annotations/${aid}`, params)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnnotationContainer)
