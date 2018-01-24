import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Velocity from 'velocity-animate'
import { Spin, Row, Col } from 'antd'
import { AutoSizer, List, WindowScroller } from 'react-virtualized'
import 'react-virtualized/styles.css'

import { CommentsList } from 'components'
import { Comment } from 'containers'

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
// import Loader from './Loader'
import './less/index.less'
// import PageCanvas from './reader/PageCanvas'
// import { makeCancellable } from './shared/util'

require('rangy/lib/rangy-textrange')

class PdfReader extends Component {
  constructor(props) {
    super(props)
    const { filename } = this.props
    this.state = {
      filename,
      pdf: null,
      scale: 2,
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

      // vitualized
      cachedPageHeights: null,
      responsiveScale: null,
    }
    this.onDocumentLoadSuccess = this.onDocumentLoadSuccess.bind(this)
    this.pageCoordinates = {}
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

    // virualized
    this._pages = new Map()
    this.updateCurrentVisiblePage = this.updateCurrentVisiblePage.bind(this)
    this.computeRowHeight = this.computeRowHeight.bind(this)
    this.rowRenderer = this.rowRenderer.bind(this)
    this.handleResize = this.handleResize.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.rowRenderer = this.rowRenderer.bind(this)
  }

  componentDidMount() {
    this._mounted = true
    this.renderHighlights(this.props.annotations)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.annotations.length !== nextProps.annotations.length) {
      this.renderHighlights(nextProps.annotations)
    }

    // if (this.props.scale !== nextProps.scale) {
    //   this.getPageCoordinates()
    // }
  }


  componentDidUpdate() {
    if (this.state.cachedPageHeights && !this.state.responsiveScale) {
      const node = this._pages.get(this.state.currentPage)

      if (node) {
        this.setState({
          responsiveScale: this.state.cachedPageHeights.get(1) / node.clientHeight,
        }, () => this._list.recomputeRowHeights())
      }
    }
  }


  componentWillUnmount() {
    this._mounted = false
  }

  // componentWillUpdate(nextProps, nextState) {
  //   return this.state.pageCoordinates !== nextState.pageCoordinates
  // }

  onDocumentLoadSuccess(pdf) {
    this.setState({
      pdf,
      numPages: pdf.numPages,
    })

    // this.getPageCoordinates()
    this.cachePageHeights(pdf)
  }

  cachePageHeights = (pdf) => {
    const promises = Array
      .from({ length: pdf.numPages }, (v, i) => i + 1)
      .map(pageNumber => pdf.getPage(pageNumber))

    Promise.all(promises).then((values) => {
      if (!this._mounted) {
        return null
      }

      const pageHeights = values.reduce((accPageHeights, page) => {
        accPageHeights.set(page.pageIndex + 1, page.pageInfo.view[3] * this.state.scale)
        return accPageHeights
      }, new Map())

      this.setState({ cachedPageHeights: pageHeights })
    })
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


  inputRef(ref) {
    this.pages = ref
    console.log(this.pages, 'this.pages')
  }

  onLoadPages(pages) {
    this.elements = pages
    console.log(this.elements, 'this.elements')
  }


  onLoadPageRef = (pageIndex, ref) => {
    console.log(pageIndex, ref, 'page change')
    // const { offsetTop, clientHeight } = ref
    // this.pageCoordinates[pageIndex] = {
    //   offsetTop,
    //   sizeHeight: clientHeight,
    // }
  }

  onMouseUp() {
    this.onTextSelect()
  }


  onSelect(selectors) {
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

    this.elements.map((element) => {
      if (element) {
        if (!range.intersectsNode(element)) return null
        const pageRange = rangy.createRange()
        pageRange.selectNodeContents(element)
        pageRanges.push({
          pageNumber: parseInt(element.dataset.pageNumber, 10),
          range: range.intersection(pageRange),
        })
      }
      return null
    })


    const selectors = {
      textQuote: await getTextQuoteSelector(range, this.pages),
      isBackwards: selection.isBackwards(),
      pdfTextQuotes: await pageRanges.map((pageRange) => {
        const selector = getTextQuoteSelector(pageRange.range, this.elements[pageRange.pageNumber - 1])
        selector.pageNumber = pageRange.pageNumber
        return selector
      }),
      pdfTextPosition: await pageRanges.map((pageRange) => {
        const selector = getTextPositionSelector(pageRange.range, this.elements[pageRange.pageNumber - 1])
        selector.pageNumber = pageRange.pageNumber
        return selector
      }),
      pdfRectangles: await flatten(pageRanges.map((pageRange) => {
        const rectSelectors = getRectanglesSelector(range, this.elements[pageRange.pageNumber - 1])
        rectSelectors.forEach(selector => selector.pageNumber = pageRange.pageNumber)
        return rectSelectors
      })),
    }


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
  }

  saveHighlight(e) {
    e.preventDefault()
    const { selectors, filename } = this.state

    if (selectors.pdfRectangles) {
      try {
        this.props.saveSelectors({
          filename,
          title: '',
          body: '',
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
    })
  }

  closeComment = () => {
    this.setState({
      showComment: false,
      popupTarget: undefined,
      tempHighlightsByPage: {},
      selectors: undefined,
    })
  }

  clearTempHighlightsByPage() {
    this.setState({
      tempHighlightsByPage: {},
    })
  }

  handleClick(pageIndex) {
    const page = this.elements[pageIndex]

    if (page) {
      // Scroll to the page automatically
      page.scrollIntoView()
    }
  }

  onVisibleOnViewport = (pageIndex) => {
    this.setState({ currentPage: pageIndex })
    console.log(this.state.currentPage, 'currentPage')
  }


  // toolsbar function
  changePage = (pageIndex) => {
    this.setState({ currentPage: pageIndex })
  }

  zoom = (direction) => {
    // const { scale, pages } = this.state
    // console.log(pages, 'state pages')
    // const container = document.querySelector('.ReactPDF__Page.pdf-page')
    // const container2 = document.querySelector('.pdf-viewer')
    // this.minZoomScale = getMinZoomScale(pages[0], container)
    //
    // console.log(this.minZoomScale, 'this.minZoomScale')
    //
    // switch (direction) {
    //   case 'in':
    //     this.setState({ scale: scale + 0.1 })
    //     break
    //   case 'out':
    //     this.setState(_state => ({
    //       scale: _state.scale - 0.1 > this.minZoomScale ? _state.scale - 0.1 : this.minZoomScale,
    //     }))
    //     break
    //   case 'fitWidth':
    //     this.setState({
    //       scale: getFitWidthScale(pages[0], container2),
    //     })
    //     break
    //   default:
    //     break
    // }
  }
  scrollToPage = (pageIndex) => {
    console.log(pageIndex, 'pageIndex')
    const page = document.getElementById(`pdf-page-${pageIndex}`)
    console.log(page, 'page')

    const context = document.querySelector('.pdf-viewer')
    console.log(context, 'context')

    Velocity(page, 'scroll', {
      container: context,
      duration: 0,
      queue: false,
    })
  }
  toggleThumbnailsView() {}


  rowRenderer({ key, index, style }) {
    const pageNumber = index + 1
    const {
      pdf, tempHighlightsByPage, popupTarget, selectors, highlightsByPage,
    } = this.state
    const { saveHighlight, commentOnHighlight, clearTempHighlightsByPage } = this

    return (
      <div key={key} style={style}>
        <div ref={ref => this._pages.set(pageNumber, ref)}>
          <Page
            key={`page_${pageNumber}`}
            pageNumber={pageNumber}
            pdf={pdf}
            onLoadError={error => console.error(error, 'error')}
            className="pdf-page"
            tempHighlightsByPage={tempHighlightsByPage[pageNumber]}
            highlightsByPage={highlightsByPage[pageNumber]}
            onTextMouseUp={this.onMouseUp}
            popupTarget={popupTarget}
            saveHighlight={saveHighlight}
            commentOnHighlight={commentOnHighlight}
            selectors={selectors}
            clearTempHighlightsByPage={clearTempHighlightsByPage}
          />
        </div>
      </div>
    )
  }
  render() {
    const { file } = this.props
    const {
      numPages, selectors, showComment, filename, currentPage,
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
        <Col span={18}>
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

            </Document>
            {
              showComment ?
                <Comment
                  showComment={showComment}
                  closeComment={this.closeComment}
                  selectors={selectors}
                  filename={filename}
                  highlightSelectors={this.highlightSelectors}
                /> : null
            }
          </div>
        </Col>
        <Col span={6}>
          {
            Object.keys(this.pageCoordinates).length === numPages && annotations ?
              <CommentsList
                annotations={annotations}
                pageCoordinates={this.pageCoordinates}
              /> : null
          }
        </Col>
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
  filename: PropTypes.any,
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
