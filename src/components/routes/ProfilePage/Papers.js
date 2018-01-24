import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { List, Icon, Badge } from 'antd'
import { connect } from 'react-redux'
import { resourceListReadRequest } from 'store/actions'
import { fromEntities, fromResource } from 'store/selectors'
import { UploadArea } from 'containers'

class Papers extends PureComponent {
  constructor(props) {
    super(props)
    this.getPapers = this.getPapers.bind(this)
  }
  componentDidMount() {
    this.getPapers()
  }

  getPapers() {
    if (this.props.getPapersForUser) {
      this.props.getPapersForUser()
    }
  }
  render() {
    const { papers } = this.props

    return (
      <div className="papersList">

        <UploadArea />
        <div style={{ margin: 12 }} />
        {
          papers.length > 0 ? (
            <List
              actions={[
                <a href="#">Delete</a>,
              ]}
              itemLayout="horizontal"
              dataSource={papers}
              renderItem={
                item => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Icon type="file-pdf" style={{ fontSize: 36 }} />}
                      title={<a href={`/papers/${item.id}`}>{item.original_filename.split('.')[0]}</a>}
                      description={ moment(item.createdAt).format('YYYY-MM-DD hh:mm')}
                    />
                    <div>
                      <Badge count={item.annotationsCount} style={{ backgroundColor: '#52c41a' }} />
                    </div>
                  </List.Item>
                )
              }
            />
          ) : (
            <div>
              <h2>你还没有上传任何文献</h2>
            </div>
          )
        }

      </div>
    )
  }
}

Papers.propTypes = {
  getPapersForUser: PropTypes.any,
  papers: PropTypes.any,
}

export default connect(
  state => ({
    papers: fromEntities.getList(state, 'papers', fromResource.getList(state, 'papers')),
  }),
  dispatch => ({
    getPapersForUser: params => dispatch(resourceListReadRequest('papers', params)),
  })
)(Papers)

