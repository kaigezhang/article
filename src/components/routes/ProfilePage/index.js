import React, { PureComponent } from 'react'
import { PageHeaderLayout } from 'components'
import { Switch, Route } from 'react-router-dom'
import { Input } from 'antd'
import Articles from './Articles'
import Papers from './Papers'
import Annotations from './Annotations'

class ProfilePage extends PureComponent {
  handleFormSearch = (e) => {
    console.log(e)
  }
  handleTabChange = (key) => {
    const { redirect, match } = this.props

    switch (key) {
      case 'papers':
        redirect(`${match.url}`)
        break
      case 'articles':
        redirect(`${match.url}/articles`)
        break
      case 'annotations':
        redirect(`${match.url}/annotations`)
        break
      default:
        break
    }
  }
  render() {
    const tabList = [{
      key: 'papers',
      tab: '文献库',
    }, {
      key: 'articles',
      tab: '文章',
    }, {
      key: 'annotations',
      tab: '注解',
    }]

    const mainSearch = (
      <div style={{ textAlign: 'center' }}>
        <Input.Search
          placeholder="请输入"
          enterButton="搜索"
          size="large"
          onSearch={this.handleFormSearch}
          style={{ width: 522 }}
        />
      </div>
    )
    return (
      <PageHeaderLayout
        content={mainSearch}
        tabList={tabList}
        onTabChange={this.handleTabChange}
      >

        <Switch>
          <Route path={`${this.props.match.url}/`} component={Papers} exact />
          <Route path={`${this.props.match.url}/articles`} component={Articles} />
          <Route path={`${this.props.match.url}/annotations`} component={Annotations} />
        </Switch>
      </PageHeaderLayout>
    )
  }
}

export default ProfilePage
