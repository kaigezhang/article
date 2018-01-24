import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { resourceListReadRequest } from 'store/actions'
import { fromEntities } from 'store/selectors'

class Annotations extends PureComponent {
  constructor(props) {
    super(props)
    this.getAnnotations = this.getAnnotations.bind(this)
  }
  componentDidMount() {
    this.getAnnotations()
  }

  getAnnotations() {
    if (this.props.getAnnotationsForUser) {
      this.props.getAnnotationsForUser()
    }
  }
  render() {
    const { annotations } = this.props

    return (
      <div className="papersList">
        {
          annotations.length > 0 ? (
            <div>
              {
                annotations.map(annotation => (
                  <div className="paperDetail" key={annotation.createdAt}>
                    { annotation.createdAt }
                  </div>
                ))
              }
            </div>
          ) : <div><h2>你还没有写过任何注解</h2></div>
        }
      </div>
    )
  }
}

Annotations.propTypes = {
  getAnnotationsForUser: PropTypes.any,
  annotations: PropTypes.any,
}

export default connect(
  state => ({
    annotations: fromEntities.getDenormalizedList(state, 'annotations'),
  }),
  dispatch => ({
    getAnnotationsForUser: params => dispatch(resourceListReadRequest('annotations', params)),
  })
)(Annotations)

