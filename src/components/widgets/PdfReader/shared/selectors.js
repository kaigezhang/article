import jquery from 'jquery'
import rangy from 'rangy'
import filter from 'lodash/filter'

require('rangy/lib/rangy-serializer')
require('rangy/lib/rangy-selectionsaverestore')

export function getTextPositionSelector(range, container) {
  return range.toCharacterRange(container)
}

// compute textQuote selector for a range (relies on rangy's textRange)
export function getTextQuoteSelector(range, container) {
  // create prefix/suffix range
  console.log(container, 'select container')
  const prefixRange = range.cloneRange()
  const suffixRange = range.cloneRange()


  // move ranges to the left/right
  prefixRange.moveStart('character', -10)
  suffixRange.moveEnd('character', 10)

  // restrict ranges to element
  if (!rangy.dom.isAncestorOf(container, prefixRange.startContainer)) {
    prefixRange.setStart(container, 0)
  }
  if (!rangy.dom.isAncestorOf(container, suffixRange.endContainer)) {
    suffixRange.setEndAfter(container)
  }

  // move end/start of ranges to start/end of original range
  prefixRange.setEnd(range.startContainer, range.startOffset)
  suffixRange.setStart(range.endContainer, range.endOffset)

  return {
    content: range.text(),
    prefix: prefixRange.text(),
    suffix: suffixRange.text(),
  }
}

// returns all leaf text nodes that are descendants of node or are node
export function getTextNodes(node) {
  if (!node) { return [] }
  if (node.nodeType === Node.TEXT_NODE) { return [node] }

  // process childs
  let nodes = []
  jquery(node).contents().each((index, el) => {
    nodes = nodes.concat(getTextNodes(el))
  })
  return nodes
}

export function getRectanglesSelector(range, container, restoreSelection = true) {
  const containerRect = container.getBoundingClientRect()

  // preserve current selection to work around browser bugs that result
  // in a changed selection
  // see https://github.com/timdown/rangy/issues/93
  // and https://github.com/timdown/rangy/issues/282
  const currentSelection = restoreSelection && rangy.serializeSelection(rangy.getSelection(), true)
  // split start container if necessary
  range.splitBoundaries()

  // get TextNodes inside the range
  const textNodes = filter(
    getTextNodes(container),
    range.containsNodeText.bind(range),
  )


  // wrap each TextNode in a span to measure it
  // See this discussion:
  // https://github.com/paperhive/paperhive-frontend/pull/68#discussion_r25970589
  const rects = textNodes.map((node) => {
    const $node = jquery(node)
    const $span = $node.wrap('<span/>').parent()
    const rect = $span.get(0).getBoundingClientRect()
    $node.unwrap()

    return {
      top: (rect.top - containerRect.top) / containerRect.height,
      left: (rect.left - containerRect.left) / containerRect.width,
      height: rect.height / containerRect.height,
      width: rect.width / containerRect.width,
    }
  })

  // re-normalize to undo splitBoundaries
  range.normalizeBoundaries()

  // restore selection (see above)
  if (restoreSelection && currentSelection) {
    rangy.deserializeSelection(currentSelection)
  }
  return rects
}
