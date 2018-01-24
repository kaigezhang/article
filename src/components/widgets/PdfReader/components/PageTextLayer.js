import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { makeCancellable } from '../shared/util'
import { eventsProps } from '../shared/propTypes'
import { makeEventProps } from '../shared/events'

const propTypes = {
  page: PropTypes.any,
  viewportDefaultRatio: PropTypes.any,
  ...eventsProps(),
}
class PageTextLayer extends PureComponent {
  componentDidMount() {
    this.getTextContent()
    // this.renderPageTextLayer()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.page !== this.props.page) {
      this.getTextContent(nextProps)
    }
  }

  componentWillUnmount() {
    if (this.runningTask && this.runningTask.cancel) {
      this.runningTask.cancel()
    }
  }

  get unrotatedViewport() {
    const { page, scale } = this.props

    return page.getViewport(scale)
  }

  get eventProps() {
    return makeEventProps(this.props)
  }

  getTextContent(props = this.props) {
    this.runningTask = makeCancellable(props.page.getTextContent())

    return this.runningTask.promise.then((_textContent) => {
      this.renderTextLayer(_textContent)
    })
  }


  async renderTextLayer(_textContent) {
    const newTextContent = _textContent
    const { unrotatedViewport: viewport } = this

    newTextContent.innerHTML = ''
    this._textLayer = await PDFJS.renderTextLayer({
      container: this._textLayerDiv,
      textContent: newTextContent,
      viewport,
      enhanceTextSelection: true,
    })
    this._textLayer.expandTextDivs(true)
    this._textLayerDiv.normalize()
  }
  render() {
    const { page } = this.props
    return (
      <div
        ref={div => (this._textLayerDiv = div)}
        className="textLayer"
        {...this.eventProps}
        id={page.pageIndex}
      />
    )
  }
}

PageTextLayer.propTypes = propTypes

export default PageTextLayer
