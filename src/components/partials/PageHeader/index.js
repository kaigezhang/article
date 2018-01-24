import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Tabs } from 'antd'
import classNames from 'classnames'

import './index.less'

const { TabPane } = Tabs

export default class PageHeader extends PureComponent {
  onChange = (key) => {
    if (this.props.onTabChange) {
      this.props.onTabChange(key)
    }
  }
  render() {
    const {
      title,
      logo,
      action,
      content,
      extraContent,
      tabList,
      className,

    } = this.props

    const clsString = classNames('pageHeader', className)

    const tabDefaultValue = tabList && (tabList.filter(item => item.default)[0] || tabList[0])

    return (
      <div className={clsString}>
        <div className="detail">
          { logo && <div className="logo">{ logo } </div> }
          <div className="main">
            <div className="row">
              {
                title && <h1 className="title">{ title }</h1>
              }
              {
                action && <div className="action">{action}</div>
              }
            </div>
            <div className="row">
              {
                content && <div className="content">{ content }</div>
              }
              {
                extraContent && <div className="extraContent">{ extraContent }</div>
              }
            </div>
          </div>
        </div>

        {
          tabList &&
          tabList.length &&
          <Tabs
            className="tabs"
            defaultActiveKey={(tabDefaultValue && tabDefaultValue.key)}
            onChange={this.onChange}
          >
            {
              tabList.map(item => <TabPane tab={item.tab} key={item.key} />)
            }
          </Tabs>
        }
      </div>
    )
  }
}

PageHeader.propTypes = {
  action: PropTypes.any,
  className: PropTypes.any,
  content: PropTypes.any,
  extraContent: PropTypes.any,
  logo: PropTypes.any,
  tabList: PropTypes.any,
  title: PropTypes.any,
  onTabChange: PropTypes.func,
}
