import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { v4 as generateId } from 'uuid'

const propTypes = {
  highlights: PropTypes.array,
  temHighlights: PropTypes.array,
  emphasized: PropTypes.bool,
  pageNumber: PropTypes.number,
  onClickHighlight: PropTypes.func,
  openAnnotation: PropTypes.func,
}

const defaultProps = {
  emphasized: false,
}

const PageHighlights = (props) => {
  const {
    highlights,
    temHighlights,
    emphasized,
    pageNumber,
    openAnnotation,
  } = props
  console.log(highlights, 'highlights')
  const getColor = (color) => {
    switch (color) {
      case 0:
        return 'rgba(255, 255, 0, .75)'
      case 1:
        return 'rgba(255, 0, 255, .75)'
      case 2:
        return 'rgba(0, 255, 255, .75)'
      default:
        return 'yellow'
    }
  }
  return (
    <div
      className="PDF_Highlights_layer"
    >
      {
        highlights && highlights.map(highlight => (
          highlight.selectors &&
          highlight.selectors.pdfRectangles.map(rectangle => (
            <div
              key={generateId()}
              className={
                classNames('PDF_Highlight', {
                  'PDF_Highlight-emphasize': emphasized,
                })}
              style={{
                backgroundColor: getColor(highlight.color),
                cursor: 'pointer',
                position: 'absolute',
                top: `${rectangle.top * 100}%`,
                left: `${rectangle.left * 100}%`,
                height: `${rectangle.height * 100}%`,
                width: `${rectangle.width * 100}%`,
              }}
              onMouseDown={openAnnotation(highlight.id)}
            />
          ))
        ))
      }
      {
        temHighlights && temHighlights.map(highlight => (
          highlight.selectors &&
          highlight.selectors.pdfRectangles.map(rectangle => (
            <div
              key={generateId()}
              className={
                classNames('PDF_Highlight', {
                  'PDF_Highlight-emphasize': emphasized,
                })}
              style={{
                backgroundColor: getColor(highlight.color),
                position: 'absolute',
                top: `${rectangle.top * 100}%`,
                left: `${rectangle.left * 100}%`,
                height: `${rectangle.height * 100}%`,
                width: `${rectangle.width * 100}%`,
              }}
            />
          ))
        ))
      }
    </div>
  )
}


PageHighlights.propTypes = propTypes

PageHighlights.defaultProps = defaultProps

export default PageHighlights
