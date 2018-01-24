import { EditorState } from 'draft-js'

export const getSelection = () => {
  const selection = window.getSelection()
  return {
    isCollapsed: selection.isCollapsed,
    range: (selection.rangeCount === 0 ? null : selection.getRangeAt(0)),
  }
}

export const getSelectedBlockElement = (selectionRange) => {
  let node = selectionRange.startContainer
  do {
    const nodeIsDataBlock = node.getAttribute
      ? node.getAttribute('data-block')
      : null
    if (nodeIsDataBlock) {
      return node
    }
    node = node.parentNode
  } while (node !== null)
  return null
}

export const getSelectionCoords = (editor, selectionRange) => {
  const editorBounds = editor.getBoundingClientRect()
  const rangeBounds = selectionRange.getBoundingClientRect()
  const rangeWidth = rangeBounds.right - rangeBounds.left

  const INLINE_TOOLBAR_WIDTH = 320
  const offsetLeft = (rangeBounds.left - editorBounds.left)
    + (rangeWidth / 2)
    - (INLINE_TOOLBAR_WIDTH / 2)

  const INLINE_TOOLBAR_HEIGHT = 40
  const CENTER_TRIANGLE_HEIGHT = 6
  const SPACING = 8
  const offsetTop = rangeBounds.top - editorBounds.top - (INLINE_TOOLBAR_HEIGHT + CENTER_TRIANGLE_HEIGHT + SPACING)

  return {
    top: offsetTop,
    left: offsetLeft,
  }
}

export const getEntityRange = (editorState, entityKey) => {
  const blocks = editorState.getCurrentContent().getBlocksAsArray()

  let entityRange = null
  blocks.some((block) => {
    block.findEntityRanges(
      value => value.get('entity') === entityKey,
      (start, end) => {
        entityRange = {
          start,
          end,
          blockKey: block.getKey(),
          text: block.get('text').slice(start, end),
        }
      }
    )
    if (entityRange) {
      return true
    }

    return false
  })

  return entityRange
}

export const selectEntity = (editorState, entityKey) => {
  const entityRange = getEntityRange(editorState, entityKey)

  const selection = editorState.getSelection()
  const entitySelection = selection.merge({
    anchorKey: entityRange.blockKey,
    anchorOffset: entityRange.start,
    focusKey: entityRange.blockKey,
    focusOffset: entityRange.end,
  })

  return EditorState.forceSelection(editorState, entitySelection)
}
