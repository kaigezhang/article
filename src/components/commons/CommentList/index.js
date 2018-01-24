import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import clone from 'lodash/clone'
import moment from 'moment'
import { Card, Icon, Avatar, Button, Row, Col } from 'antd'
import './index.less'


const propTypes = {
  annotations: PropTypes.array.isRequired,
  pageCoordinates: PropTypes.object,
}
class CommentsList extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      positionedDiscussions: [],
    }

    this.getRawPosition = this.getRawPosition.bind(this)
    this.updateDiscussion = this.updateDiscussion.bind(this)
  }
  componentDidMount() {
    console.log(this.props.annotations)
    console.log(this.props.pageCoordinates)
    this.updateDiscussion(this.props.annotations)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.annotations !== nextProps.annotations || this.props.pageCoordinates !== nextProps.pageCoordinates) {
      this.updateDiscussion(nextProps.annotations)
    }
  }


  getRawPosition(selectors) {
    if (!selectors || !selectors.pdfRectangles) return

    // get top rect of selection
    const rects = clone(selectors.pdfRectangles)
    const topRect = rects.sort((rectA, rectB) => {
      if (rectA.pageNumber < rectB.pageNumber) return -1
      if (rectA.pageNumber > rectB.pageNumber) return 1
      if (rectA.top < rectB.top) return -1
      if (rectA.top > rectB.top) return 1
      return 0
    })[0]

    // get page offset

    console.log(this.props.pageCoordinates)
    const pageCoord = this.props.pageCoordinates[topRect.pageNumber - 1]

    if (!pageCoord) return
    // const top = Math.floor(pageCoord.offset.top + pageCoord.size.height * topRect.top)

    let { offsetTop, sizeHeight } = pageCoord

    // 为了解决定位问题的ugly code
    if (topRect.pageNumber > 1) {
      const defaultHeight = this.props.pageCoordinates[0].sizeHeight * (topRect.pageNumber - 1)
      offsetTop = offsetTop === 0 ? defaultHeight : offsetTop
      sizeHeight = sizeHeight === 0 ? defaultHeight : sizeHeight
    }
    const top = Math.floor(offsetTop + sizeHeight * topRect.top)

    // compute position
    return top
  }

  updateDiscussion(annotations) {
    // const { annotations } = this.props
    const positionedDiscussions = annotations
      .map(annotation => ({
        ...annotation,
        top: this.getRawPosition(annotation.selectors),
      }))
      .filter(positionedDiscussion => positionedDiscussion.top !== undefined)
      .sort((a, b) => a.top < b.top ? -1 : 1)
    this.setState({ positionedDiscussions })
  }
  render() {
    const { positionedDiscussions } = this.state
    // console.log(positionedDiscussions, 'comment list dis')
    return (
      <ul className="comments-list-wrapper">
        {
          positionedDiscussions.length > 0 && positionedDiscussions.map((discussion) => {
            return discussion.body ? (
              <li className="comment-box" key={discussion.id} style={{ top: discussion.top, marginBottom: 1 }}>
                {/* <Card */}
                {/* title={`kaige ${moment(discussion.createdAt).format('YYYY-MM-DD hh:mm')}`} */}
                {/* style={{ width: 350 }} */}
                {/* extra={<Button icon="like" type="primary" />} */}
                {/* > */}

                {/* <h3>{ discussion.title }</h3> */}
                {/* <p>{ discussion.body }</p> */}
                {/* </Card> */}
                <Row>
                  <Col span={4}><Icon type="like" /></Col>
                  <Col span={18}><h3>{ discussion.title }</h3></Col>
                  <Col span={2}><Icon type="down" /></Col>
                </Row>

                {/* <span> */}
                {/* <Icon type="like" /> */}
                {/* </span> */}

                {/* <span> */}
                {/* <h3>{ discussion.title }</h3> */}
                {/* </span> */}
                {/* <span> */}
                {/* <Icon type="down" /> */}
                {/* </span> */}

              </li>
            ) : null
          })
        }
      </ul>
    )
  }
}

CommentsList.propTypes = propTypes


export default CommentsList
