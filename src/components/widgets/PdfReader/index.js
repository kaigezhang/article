import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Spin, Row, Col } from 'antd'
import { AutoSizer, List, WindowScroller } from 'react-virtualized'
import 'react-virtualized/styles.css'

import { CommentsList } from 'components'
import { Comment, Annotation } from 'containers'

/* text selection stuff */
import isEqual from 'lodash/isEqual'
import pick from 'lodash/pick'
import uniq from 'lodash/uniq'
import flatten from 'lodash/flatten'
import rangy from 'rangy/lib/rangy-core'
// import 'loaders.css/loaders.css'

// import Buttons from './Buttons'
// import Outline from './reader/Outline'

import {
  getTextPositionSelector,
  getTextQuoteSelector,
  getRectanglesSelector,
} from './shared/selectors'

// import { getMinZoomScale, getFitWidthScale, callIfDefined } from './shared/util'

import { Document, Page, Outline, ToolsBar } from './components/entry.webpack'
import './less/index.less'

require('rangy/lib/rangy-textrange')

class PdfReader extends Component {
  constructor(props) {
    super(props)
    const { paperId } = this.props
    this.state = {
      paperId,
      pdf: null,
      scale: 2,
      originalScale: 2,
      numPages: null,
      lastSelectors: undefined,
      selectors: undefined,
      popupTarget: undefined,
      lastSimpleSelection: undefined,
      tempHighlightsByPage: {},
      highlightsByPage: {},
      showComment: false,
      pageCoordinates: {},
      currentPage: 1,
      annotationType: 'new',

      // vitualized
      cachedPageHeights: null,
      responsiveScale: null,
    }
    // TODO: page coordinaates from comment display
    this.pageCoordinates = {}

    this.onDocumentLoadSuccess = this.onDocumentLoadSuccess.bind(this)
    this.inputRef = this.inputRef.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onTextSelect = this.onTextSelect.bind(this)
    this.onSelect = this.onSelect.bind(this)
    this.onLoadPages = this.onLoadPages.bind(this)
    this.highlightSelectors = this.highlightSelectors.bind(this)
    this.renderHighlights = this.renderHighlights.bind(this)
    this.saveHighlight = this.saveHighlight.bind(this)
    this.commentOnHighlight = this.commentOnHighlight.bind(this)
    this.clearTempHighlightsByPage = this.clearTempHighlightsByPage.bind(this)
    this.getPageCoordinates = this.getPageCoordinates.bind(this)

    // virualized
    // cache all the rendered page
    this._pages = new Map()
    this.updateCurrentVisiblePage = this.updateCurrentVisiblePage.bind(this)
    this.computeRowHeight = this.computeRowHeight.bind(this)
    this.rowRenderer = this.rowRenderer.bind(this)
    this.handleResize = this.handleResize.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.rowRenderer = this.rowRenderer.bind(this)
    this.calResponsiveScale = this.calResponsiveScale.bind(this)
    // not known function
    // this._callOrientationChangeHandler = this.handleResize.bind(this)
  }

  componentDidMount() {
    this._mounted = true
    this.renderHighlights(this.props.annotations)
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (this.props.annotations.length !== nextProps.annotations.length) {
      this.renderHighlights(nextProps.annotations)
    }
  }


  componentDidUpdate() {
    this.calResponsiveScale()
  }


  componentWillUnmount() {
    this._mounted = false
  }


  onDocumentLoadSuccess(pdf) {
    this.setState({
      pdf,
      numPages: pdf.numPages,
    })

    this.cachePageHeights(pdf)
  }


  inputRef(ref) {
    this.pages = ref
  }

  onLoadPages(pages) {
    this.elements = pages
    console.log(this.elements, 'this.elements')
    this.getPageCoordinates()
  }

  // onLoadPageRef = (pageIndex, ref) => {
  //   const { pageCoordinates } = this.state
  //   const { offsetTop, clientHeight } = ref.parentNode.parentNode
  //   pageCoordinates[pageIndex] = {
  //     offsetTop,
  //     sizeHeight: clientHeight,
  //   }
  //   this.setState({
  //     pageCoordinates,
  //   })
  //   console.log(this.state.pageCoordinates, 'page Corrs')
  // }

  getPageCoordinates = () => {
    if (Object.keys(this.state.pageCoordinates).length === 0) {
      const { pageCoordinates } = this.state
      this._pages.forEach((value, key) => {
        const { offsetTop, clientHeight } = value
        pageCoordinates[key - 1] = {
          offsetTop,
          sizeHeight: clientHeight,
        }
      }, this._pages)
      this.setState({
        pageCoordinates,
      })
      console.log(this.state.pageCoordinates, 'page Corrs')
    }
  }

  /*
  *  Pdfpopup function group
  * */
  onMouseUp() {
    this.onTextSelect()
  }


  onSelect(selectors) {
    console.log(selectors, 'selectors')
    if (isEqual(selectors, this.state.lastSelectors)) return
    this.setState({
      lastSelectors: selectors,
      selectors,
      popupTarget: { selectors },
    })
    this.highlightSelectors()
  }

  async onTextSelect() {
    const selection = rangy.getSelection()

    // no selection object or no anchor/focus
    if (!selection || !selection.anchorNode || !selection.focusNode) {
      return this.onSelect(undefined)
    }
    // selection not contained in element?
    if (!rangy.dom.isAncestorOf(this.pages, selection.anchorNode) ||
      !rangy.dom.isAncestorOf(this.pages, selection.focusNode)) {
      return this.onSelect(undefined)
    }

    // do not allow collapsed / empty selections
    if (!selection.toString()) {
      return this.onSelect(undefined)
    }

    // do not allow selections with zero or more than one ranges
    if (selection.rangeCount !== 1) {
      return this.onSelect(undefined)
    }

    // do nothing if start and end are equal to last selection
    // NOTE: this currently does not work because getRectanglesSelector
    //       creates new TextNodes in order to measure selections
    const simpleSelection = pick(
      selection,
      'anchorNode', 'anchorOffset', 'focusNode', 'focusOffset'
    )
    if (isEqual(simpleSelection, this.state.lastSimpleSelection)) return null
    this.setState({
      lastSimpleSelection: simpleSelection,
    })

    const range = selection.getAllRanges()[0]
    const pageRanges = []


    this._pages.forEach((value, key) => {
      console.log(value, 'value')
      if (value) {
        if (!range.intersectsNode(value)) return null
        const pageRange = rangy.createRange()
        pageRange.selectNodeContents(value)
        pageRanges.push({
          pageNumber: key,
          range: range.intersection(pageRange),
        })
      }
    }, this._pages)


    const selectors = {
      textQuote: await getTextQuoteSelector(range, this.pages),
      isBackwards: selection.isBackwards(),
      pdfTextQuotes: await pageRanges.map((pageRange) => {
        const selector = getTextQuoteSelector(pageRange.range, this._pages.get(pageRange.pageNumber))
        selector.pageNumber = pageRange.pageNumber
        return selector
      }),
      pdfTextPosition: await pageRanges.map((pageRange) => {
        const selector = getTextPositionSelector(pageRange.range, this._pages.get(pageRange.pageNumber))
        selector.pageNumber = pageRange.pageNumber
        return selector
      }),
      pdfRectangles: await flatten(pageRanges.map((pageRange) => {
        const rectSelectors = getRectanglesSelector(range, this._pages.get(pageRange.pageNumber).childNodes[0])
        rectSelectors.forEach(selector => selector.pageNumber = pageRange.pageNumber)
        return rectSelectors
      })),
    }

    console.log(selectors, 'this.selectors')
    return this.onSelect(selectors)
  }

  highlightSelectors() {
    const { selectors, tempHighlightsByPage } = this.state
    if (!selectors || !selectors.pdfRectangles) return
    const pageNumbers = uniq(selectors.pdfRectangles.map(rec => rec.pageNumber))
    pageNumbers.forEach((pageNumber) => {
      if (!tempHighlightsByPage[pageNumber]) {
        tempHighlightsByPage[pageNumber] = []
      }
      tempHighlightsByPage[pageNumber].push({ selectors })
    })
    this.setState({
      tempHighlightsByPage,
    })
  }

  renderHighlights(annotations) {
    const { highlightsByPage } = this.state
    // const { annotations } = this.props
    console.log(annotations, 'apge anntation')
    annotations.forEach((annotation) => {
      if (!annotation.selectors || !annotation.selectors.pdfRectangles) return
      const pageNumbers = uniq(annotation.selectors.pdfRectangles.map(rect => rect.pageNumber))
      pageNumbers.forEach((pageNumber) => {
        if (!highlightsByPage[pageNumber]) {
          highlightsByPage[pageNumber] = []
        }
        highlightsByPage[pageNumber].push(annotation)
      })
    })
    this.setState({
      highlightsByPage,
    })
    console.log(highlightsByPage, 'highlightsByPage')
  }

  saveHighlight(e) {
    e.preventDefault()
    const { selectors, paperId } = this.state

    if (selectors.pdfRectangles) {
      try {
        this.props.saveSelectors({
          paperId,
          body: '',
          color: 0,
          selectors,
        })
        this.setState({
          popupTarget: undefined,
        })
        // this.highlightSelectors()
      } catch (e) {
        console.error(e)
      }
    }
  }

  commentOnHighlight() {
    this.setState({
      showComment: true,
      annotationType: 'new',
    })
  }

  closeComment = () => {
    this.setState({
      showComment: false,
      popupTarget: undefined,
      tempHighlightsByPage: {},
      selectors: undefined,
      annotationType: 'new',
    })
  }
  openAnnotation = (aid) => {
    console.log(aid, 'aid')
    this.setState({
      showComment: true,
    })
  }
  clearTempHighlightsByPage() {
    this.setState({
      tempHighlightsByPage: {},
    })
  }

  /*
   *  Virtualized group function
   * */
  calResponsiveScale() {
    if (this.state.cachedPageHeights && !this.state.responsiveScale) {
      //
      const node = this._pages.get(this.state.currentPage)
      if (node) {
        this.setState({
          responsiveScale: this.state.cachedPageHeights.get(1) / node.clientHeight,
        }, () => this._list.recomputeRowHeights())
      }
    }
  }
  cachePageHeights = (pdf) => {
    const promises = Array
      .from({ length: pdf.numPages }, (v, i) => i + 1)
      .map(pageNumber => pdf.getPage(pageNumber))

    // 假设所有页面的高度都不相同
    Promise.all(promises).then((values) => {
      if (!this._mounted) {
        return null
      }

      const pageHeights = values.reduce((accPageHeights, page) => {
        accPageHeights.set(page.pageIndex + 1, page.pageInfo.view[3] * this.state.originalScale)
        return accPageHeights
      }, new Map())

      this.setState({ cachedPageHeights: pageHeights })
    })
  }
  // ugly hack, 为了保持文章页面的间距
  reCacheHeights = () => {
    const { cachedPageHeights, scale, originalScale } = this.state
    cachedPageHeights.forEach((value, key) => {
      cachedPageHeights.set(key, value * (scale / originalScale))
    })
    this.setState({ cachedPageHeights }, () => {
      const node = this._pages.get(this.state.currentPage)
      if (node) {
        this.setState({
          responsiveScale: this.state.cachedPageHeights.get(1) / node.clientHeight,
        }, () => this._list.recomputeRowHeights())
      }
      this.handleResize()
    })
    console.log(this.state.cachedPageHeights)
  }

  computeRowHeight({ index }) {
    const { cachedPageHeights, responsiveScale } = this.state
    if (cachedPageHeights && responsiveScale) {
      return (cachedPageHeights.get(index + 1) / responsiveScale)
    }
    return 768
  }

  updateCurrentVisiblePage({ stopIndex }) {
    this.setState({ currentPage: stopIndex + 1 })
  }

  handleResize() {
    // compute the responive scale function on window resize
    const node = this._pages.get(this.state.currentPage)
    const responsiveScale = this.state.cachedPageHeights.get(this.state.currentPage) / node.clientHeight
    if (responsiveScale !== this.state.responsiveScale) {
      this.setState({ responsiveScale }, () => this._list.recomputeRowHeights())
    }
  }

  handleClick(index) {
    this._list.scrollToRow(index)
  }

  rowRenderer({ key, index, style }) {
    const pageNumber = index + 1
    const {
      pdf, scale, tempHighlightsByPage, popupTarget, selectors, highlightsByPage, paperId
    } = this.state
    const {
      saveHighlight, commentOnHighlight, clearTempHighlightsByPage, closeComment, openAnnotation
    } = this

    return (
      <div key={key} style={style}>
        <div ref={ref => this._pages.set(pageNumber, ref)}>
          <Page
            key={`page_${pageNumber}`}
            pageNumber={pageNumber}
            pdf={pdf}
            scale={scale}
            onLoadError={error => console.error(error, 'error')}
            className="pdf-page"
            tempHighlightsByPage={tempHighlightsByPage[pageNumber]}
            highlightsByPage={highlightsByPage[pageNumber]}
            onTextMouseUp={this.onMouseUp}
            popupTarget={popupTarget}
            saveHighlight={saveHighlight}
            commentOnHighlight={commentOnHighlight}
            closeAnnotation={closeComment}
            openAnnotation={openAnnotation}
            paperId={paperId}
            selectors={selectors}
            clearTempHighlightsByPage={clearTempHighlightsByPage}
          />
        </div>
      </div>
    )
  }

  // toolsbar function
  changePage = (pageIndex) => {
    this.setState({ currentPage: pageIndex })
  }

  zoom = (direction) => {
    const { scale } = this.state
    switch (direction) {
      case 'in':
        this.setState({ scale: (scale + 0.1) < 2 ? (scale + 0.1) : 2 })
        this.reCacheHeights()
        break
      case 'out':
        this.setState({ scale: (scale - 0.1) > 1 ? (scale - 0.1) : 1 })
        this.reCacheHeights()
        break
      case 'fitWidth':
        this.setState({ scale: 2 })
        this.reCacheHeights()
        break
      default:
        break
    }
  }
  scrollToPage = (pageIndex) => {
    this._list.scrollToRow(pageIndex)
  }
  toggleThumbnailsView() {}

  render() {
    const { file } = this.props
    const {
      numPages, selectors, showComment, paperId, currentPage,　annotationType
    } = this.state
    const {
      annotations,
      btnToggle,
      btnUp,
      btnDown,
      btnZoomIn,
      btnZoomOut,
      btnFitWidth,
      pageCountLabel,
    } = this.props
    return (
      <Row>
        <div className="pdf-reader">
          <Document
            file={file}
            loading={<div style={{ textAlign: 'center' }}><Spin size="large" /></div>}
            onLoadSuccess={this.onDocumentLoadSuccess}
            onLoadPages={this.onLoadPages}
            onLoadError={error => console.error(error, 'load error')}
            className="pdf-viewer"
            inputRef={this.inputRef}
          >
            <WindowScroller onResize={this.handleResize}>
              {
                  ({
                     height, isScrolling, onChildScroll, scrollTop,
                   }) => (
                     <AutoSizer disableHeight>
                       {({ width }) => (
                         <List
                           autoheight
                           height={height}
                           width={width}
                           isScrolling={isScrolling}
                           onRowsRendered={this.updateCurrentVisiblePage}
                           onScroll={onChildScroll}
                           scrollToAlignment="start"
                           scrollTop={scrollTop}
                           overscanRowCount={5}
                           rowCount={new Array(numPages).length}
                           rowHeight={this.computeRowHeight}
                           rowRenderer={this.rowRenderer}
                           style={{ outline: 'none' }}
                           ref={ref => this._list = ref}
                         />)
                      }
                     </AutoSizer>
                  )
                }
            </WindowScroller>

            <ToolsBar
              btnToggle={btnToggle}
              toggleHandler={this.toggleThumbnailsView}
              btnUp={btnUp}
              btnDown={btnDown}
              scrollToPageHandler={this.scrollToPage}
              btnZoomIn={btnZoomIn}
              btnZoomOut={btnZoomOut}
              btnFitWidth={btnFitWidth}
              zoomHandler={this.zoom}
              currentPage={currentPage - 1}
              numPages={new Array(numPages).length}
              pageCountLabel={pageCountLabel}
            />

          </Document>

          {/* {
            showComment ?
              <Comment
                showComment={showComment}
                closeComment={this.closeComment}
                selectors={selectors}
                paperId={paperId}
                highlightSelectors={this.highlightSelectors}
              /> : null
          } */}

          {
            showComment ?
              <Annotation
                showAnnotation={showComment}
                annotationType={annotationType}
                closeAnnotation={this.closeComment}
                selectors={selectors}
                paperId={paperId}
                highlightSelectors={this.highlightSelectors}
              /> : null
          }

          {
            Object.keys(this.state.pageCoordinates).length === numPages && annotations ?
              <CommentsList
                annotations={annotations}
                pageCoordinates={this.state.pageCoordinates}
              /> : null
          }
        </div>

      </Row>
    )
  }
}

const btnProp = PropTypes.oneOfType([
  PropTypes.shape({
    label: PropTypes.string,
    classname: PropTypes.string,
    iconClassname: PropTypes.string,
    iconButton: PropTypes.bool,
  }),
  PropTypes.element,
])

PdfReader.propTypes = {
  file: PropTypes.any,
  paperId: PropTypes.any,
  saveSelectors: PropTypes.func,
  annotations: PropTypes.array,
  // scale: PropTypes.number,
  // toolsbar
  btnToggle: btnProp,
  btnUp: btnProp,
  btnDown: btnProp,
  btnZoomIn: btnProp,
  btnZoomOut: btnProp,
  btnFitWidth: btnProp,
  pageCountLabel: PropTypes.string,
}

PdfReader.defaultProps = {
  // scale: 2,
  btnToggle: {
    label: 'toggle panel',
    icon: 'bars',
  },
  btnUp: {
    label: 'Up',
    icon: 'up',
  },
  btnDown: {
    label: 'Down',
    icon: 'down',
  },
  btnZoomIn: {
    label: 'Zoom In',
    icon: 'plus',
  },
  btnZoomOut: {
    label: 'Zoom Out',
    icon: 'minus',
  },
  btnFitWidth: {
    label: 'Fit Width',
    icon: 'arrows-alt',
  },
  pageCountLabel: '/',
}

export default PdfReader
