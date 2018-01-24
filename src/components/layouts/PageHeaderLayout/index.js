import React from 'react'
import PropTypes from 'prop-types'
import { DefaultLayout, PageHeader } from 'components'
import './index.less'

const PageHeaderLayout = ({
  children,
  wrapperClassName,
  top,
  ...restProps
}) => (
  <DefaultLayout>
    <div style={{ margin: '-24px -24px 0' }} className={wrapperClassName}>
      { top }
      <PageHeader {...restProps} />
      {
        children ? <div className="content">{ children }</div> : null
      }
    </div>
  </DefaultLayout>

)

PageHeaderLayout.propTypes = {
  children: PropTypes.any,
  top: PropTypes.any,
  wrapperClassName: PropTypes.any,
}
export default PageHeaderLayout

