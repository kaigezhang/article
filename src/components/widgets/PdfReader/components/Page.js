import React, { Component } from 'react'
import PropTypes from 'prop-types'
import mergeClassNames from 'merge-class-names'
import { PagePopup } from 'containers'
// import 'waypoints/lib/noframework.waypoints'
// import 'waypoints/lib/shortcuts/inview'
import PageCanvas from './PageCanvas'
import PageHighlights from './PageHighlights'
import PageTextLayer from './PageTextLayer'
import PageAnnotations from './PageAnnotations'

import {
  callIfDefined,
  errorOnDev,
  isProvided,
  makeCancellable,
} from '../shared/util'
import { makeEventProps } from '../shared/events'

import { eventsProps, linkServiceProp, pdfProp } from '../shared/propTypes'

// const { Waypoint } = window

export default class Page extends Component {
  state = {
    page: null,
    // isInview: false,
  }

  componentDidMount() {
    this.loadPage()
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.pdf !== this.props.pdf ||
      this.getPageNumber(nextProps) !== this.getPageNumber()
    ) {
      callIfDefined(
        this.props.unregisterPage,
        this.state.page.pageIndex,
      )

      this.loadPage(nextProps)
    }

    if (nextProps.selectors !== this.props.selectors) {
      this.props.clearTempHighlightsByPage()
    }
  }


  componentWillUnmount() {
    callIfDefined(
      this.props.unregisterPage,
      this.state.page.pageIndex,
    )

    if (this.runningTask && this.runningTask.cancel) {
      this.runningTask.cancel()
    }
  }


  /**
   * Called when a page is loaded successfully
   */
  onLoadSuccess = (page) => {
    this.setState({ page })

    const { pageCallback } = this

    callIfDefined(
      this.props.onLoadSuccess,
      pageCallback,
    )

    callIfDefined(
      this.props.registerPage,
      page.pageIndex,
      this.ref,
    )
    callIfDefined(
      this.props.onLoadPageRef,
      page.pageIndex,
      this.ref
    )
    // console.log(this.ref.childNodes[0].height, 'ref height')
    // this.initWaypoint(this.ref.childNodes[0].height)
  }


  /**
   * Called when a page failed to load
   */
  onLoadError = (error) => {
    if ((error.message || error) === 'cancelled') {
      return
    }

    errorOnDev(error.message, error)

    callIfDefined(
      this.props.onLoadError,
      error,
    )

    this.setState({ page: false })
  }


  get temHighlights() {
    const { tempHighlightsByPage } = this.props
    if (isProvided(tempHighlightsByPage)) {
      return tempHighlightsByPage
    }
    return []
  }

  get highlights() {
    const { highlightsByPage } = this.props
    if (isProvided(highlightsByPage)) {
      return highlightsByPage
    }
    return []
  }

  get pageIndex() {
    return this.getPageIndex()
  }

  get pageNumber() {
    return this.getPageNumber()
  }

  get rotate() {
    const { rotate } = this.props

    if (isProvided(rotate)) {
      return rotate
    }

    const { page } = this.state

    return page.rotate
  }

  get scale() {
    const { scale, width } = this.props
    const { page } = this.state
    const { rotate } = this

    // Be default, we'll render page at 100% * scale width.
    let pageScale = 1

    // If width is defined, calculate the scale of the page so it could be of desired width.
    if (width) {
      const viewport = page.getViewport(scale, rotate)
      pageScale = width / viewport.width
    }

    return scale * pageScale
  }

  get pageCallback() {
    const { page } = this.state
    const { scale } = this

    return {
      ...page,
      // Legacy callback params
      get width() { return page.view[2] * scale },
      get height() { return page.view[3] * scale },
      scale,
      get originalWidth() { return page.view[2] },
      get originalHeight() { return page.view[3] },
    }
  }

  get eventProps() {
    return makeEventProps(this.props, this.pageCallback)
  }

  get pageKey() {
    return `${this.state.page.pageIndex}@${this.scale}/${this.rotate}`
  }

  get pageProps() {
    return {
      page: this.state.page,
      rotate: this.rotate,
      scale: this.scale,
    }
  }


  getPageIndex(props = this.props) {
    if (isProvided(props.pageIndex)) {
      return props.pageIndex
    }

    if (isProvided(props.pageNumber)) {
      return props.pageNumber - 1
    }

    return null
  }

  getPageNumber(props = this.props) {
    if (isProvided(props.pageNumber)) {
      return props.pageNumber
    }

    if (isProvided(props.pageIndex)) {
      return props.pageIndex + 1
    }

    return null
  }

  // initWaypoint = (pageHeight) => {
  //   const { pageNumber, onVisibleOnViewport } = this.props
  //   const context = document.querySelector('.pdf-viewer')
  //   this.waypoints = [
  //     new Waypoint({
  //       offset: pageHeight / 4,
  //       element: this.ref,
  //       context,
  //       handler: (direction) => {
  //         if (direction === 'down') {
  //           onVisibleOnViewport(pageNumber - 1)
  //         }
  //       },
  //     }),
  //
  //     new Waypoint({
  //       offset: -pageHeight / 3,
  //       element: this.ref,
  //       context,
  //       handler: (direction) => {
  //         if (direction === 'up') {
  //           onVisibleOnViewport(pageNumber - 1)
  //         }
  //       },
  //     }),
  //
  //     new Waypoint.Inview({
  //       element: this.ref,
  //       context,
  //       enter: () => {
  //         this.setState({ isInview: true }, () => {
  //           if (!this.pageRendered) {
  //             this.renderCanvas()
  //           } else if (this.state.scaleChange) {
  //             this.setState({ scaleChange: false }, () => {
  //               this.renderCanvas()
  //             })
  //           }
  //         })
  //       },
  //       exited: () => {
  //         this.setState({ isInview: false })
  //       },
  //     }),
  //   ]
  // };

  // get eventProps() {
  //   return makeEventProps(this.props, this.state.pdf)
  // }

  loadPage(props = this.props) {
    const { pdf } = props
    const pageNumber = this.getPageNumber(props)

    if (!pdf) {
      throw new Error('Attempted to load a page, but no document was specified.')
    }

    if (this.state.page !== null) {
      this.setState({ page: null })
    }

    this.runningTask = makeCancellable(pdf.getPage(pageNumber))

    return this.runningTask.promise
      .then(this.onLoadSuccess)
      .catch(this.onLoadError)
  }

  renderPopup = () => {
    const { popupTarget, saveHighlight, commentOnHighlight, closeAnnotation, paperId } = this.props
    const { pageNumber } = this
    return (
      popupTarget &&
      popupTarget.selectors &&
      (<PagePopup
        key={`${this.pageKey}_popup`}
        target={popupTarget}
        paperId={paperId}
        pageNumber={pageNumber}
        closeAnnotation={closeAnnotation}
        onSaveHighlight={saveHighlight}
        commentOnHighlight={commentOnHighlight}
      />)
    )
  }

  renderTextLayer = () => {
    const { renderTextLayer } = this.props

    if (!renderTextLayer) {
      return null
    }

    const {
      onGetTextError,
      onGetTextSuccess,
    } = this.props

    return (
      <PageTextLayer
        key={`${this.pageKey}_text`}
        onGetTextError={onGetTextError}
        onGetTextSuccess={onGetTextSuccess}
        onMouseUp={this.props.onTextMouseUp}
        {...this.pageProps}
      />
    )
  }

  renderAnnotations = () => {
    const { renderAnnotations } = this.props

    if (!renderAnnotations) {
      return null
    }

    const { linkService } = this.props

    return (
      <PageAnnotations
        key={`${this.pageKey}_annotations`}
        linkService={linkService}
        {...this.pageProps}
      />
    )
  }

  renderHighlights = () => {
    const { temHighlights, highlights } = this
    return (
      <PageHighlights
        key={`${this.pageKey}_highlights`}
        temHighlights={temHighlights}
        highlights={highlights}
        openAnnotation={this.props.openAnnotation}
        {...this.pageProps}
      />
    )
  }

  renderCanvas = () => {
    const {
      onRenderError,
      onRenderSuccess,
    } = this.props

    return [
      <PageCanvas
        key={`${this.pageKey}_canvas`}
        onRenderError={onRenderError}
        onRenderSuccess={onRenderSuccess}
        {...this.pageProps}
      />,
      this.renderTextLayer(),
      this.renderAnnotations(),
      this.renderHighlights(),
      this.renderPopup(),
    ]
  }

  render() {
    const { pdf } = this.props
    const { page } = this.state
    const { pageIndex } = this

    if (
      (!pdf || !page) ||
      (pageIndex < 0 || pageIndex > pdf.numPages)
    ) {
      return null
    }

    const {
      children,
      className,
    } = this.props

    return (
      <div
        className={mergeClassNames('ReactPDF__Page', className)}
        ref={(ref) => {
          const { inputRef } = this.props
          if (inputRef) {
            inputRef(ref)
          }

          this.ref = ref
        }}
        // style={{ position: 'relative' }}
        data-page-number={this.pageNumber}
        id={`pdf-page-${this.pageIndex}`}
        {...this.eventProps}
      >
        {
          this.renderCanvas()
        }
        {children}
      </div>
    )
  }
}

Page.defaultProps = {
  renderAnnotations: true,
  renderTextLayer: true,
}

Page.propTypes = {
  children: PropTypes.node,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  inputRef: PropTypes.func,
  linkService: linkServiceProp,
  onGetTextError: PropTypes.func,
  onGetTextSuccess: PropTypes.func,
  onLoadError: PropTypes.func,
  onLoadSuccess: PropTypes.func,
  onRenderError: PropTypes.func,
  onRenderSuccess: PropTypes.func,
  pageIndex: PropTypes.number, // eslint-disable-line react/no-unused-prop-types
  pageNumber: PropTypes.number, // eslint-disable-line react/no-unused-prop-types
  pdf: pdfProp,
  registerPage: PropTypes.func,
  renderAnnotations: PropTypes.bool,
  renderTextLayer: PropTypes.bool,
  rotate: PropTypes.number,
  scale: PropTypes.number,
  unregisterPage: PropTypes.func,
  width: PropTypes.number,
  onTextMouseUp: PropTypes.func,
  tempHighlightsByPage: PropTypes.array,
  highlightsByPage: PropTypes.array,
  popupTarget: PropTypes.any,
  saveHighlight: PropTypes.func,
  commentOnHighlight: PropTypes.func,
  clearTempHighlightsByPage: PropTypes.func,
  selectors: PropTypes.object,
  closeAnnotation: PropTypes.func,
  paperId: PropTypes.string,
  openAnnotation: PropTypes.func,
  ...eventsProps(),
}
