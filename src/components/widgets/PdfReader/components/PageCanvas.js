import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  callIfDefined,
  errorOnDev,
  getPixelRatio,
} from '../shared/util'

import { pageProp, rotateProp } from '../shared/propTypes'

export default class PageCanvas extends Component {
  componentWillUnmount() {
    /* eslint-disable no-underscore-dangle */
    if (this.renderer && this.renderer._internalRenderTask.running) {
      this.renderer._internalRenderTask.cancel()
    }
    /* eslint-enable no-underscore-dangle */
  }
  /**
   * Called when a page is rendered successfully.
   */
  onRenderSuccess = () => {
    this.renderer = null

    callIfDefined(this.props.onRenderSuccess)

    callIfDefined(
      this.props.registerCanvas,
      this.props.page.pageIndex,
      this.ref,
    )
  }

  /**
   * Called when a page fails to render.
   */
  onRenderError = (error) => {
    if ((error.message || error) === 'cancelled') {
      return
    }

    errorOnDev(error.message, error)

    callIfDefined(
      this.props.onRenderError,
      error,
    )
  }

  get renderViewport() {
    const { page, rotate, scale } = this.props

    const pixelRatio = getPixelRatio()
    return page.getViewport(scale * pixelRatio, rotate)
  }

  get viewport() {
    const { page, rotate, scale } = this.props

    return page.getViewport(scale, rotate)
  }

  drawPageOnCanvas = (canvas) => {
    this.ref = canvas
    const _canvas = canvas
    if (!_canvas) {
      return null
    }

    const { page } = this.props
    const { renderViewport, viewport } = this

    _canvas.width = renderViewport.width
    _canvas.height = renderViewport.height

    _canvas.style.width = `${Math.floor(viewport.width)}px`
    _canvas.style.height = `${Math.floor(viewport.height)}px`

    const canvasContext = _canvas.getContext('2d')

    const renderContext = {
      canvasContext,
      viewport: renderViewport,
    }
    // If another render is in progress, let's cancel it
    /* eslint-disable no-underscore-dangle */
    if (this.renderer && this.renderer._internalRenderTask.running) {
      this.renderer._internalRenderTask.cancel()
    }
    /* eslint-enable no-underscore-dangle */

    this.renderer = page.render(renderContext)

    return this.renderer.then(this.onRenderSuccess).catch(this.onRenderError)
  }

  render() {
    return (
      <canvas
        className="ReactPDF__Page__canvas"
        ref={this.drawPageOnCanvas}
      />
    )
  }
}

PageCanvas.propTypes = {
  onRenderError: PropTypes.func,
  onRenderSuccess: PropTypes.func,
  registerCanvas: PropTypes.func,
  rotate: rotateProp,
  scale: PropTypes.number,
  pageProp,
}

