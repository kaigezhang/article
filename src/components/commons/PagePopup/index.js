import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import last from 'lodash/last'
import { Button } from 'antd'


class PagePopup extends PureComponent {
  getRect = () => {
    const { target, pageNumber } = this.props
    const { selectors } = target
    if (!selectors.pdfRectangles) {
      console.warn('selectors object does not have a pdfRectangles property')
      return null
    }
    const rect = selectors.isBackwards ? selectors.pdfRectangles[0] : last(selectors.pdfRectangles)
    if (rect.pageNumber !== pageNumber) return null
    return rect
  }

  saveHighlight= (e) => {
    e.preventDefault()
    const { target, paperId } = this.props
    const { selectors } = target
    if (selectors.pdfRectangles) {
      try {
        this.props.saveAnnotation({
          annotation: {
            paper_id: paperId,
            body: '',
            color: 0,
            selectors,
          },
        })
        this.props.closeAnnotation()
        // this.highlightSelectors()
      } catch (e) {
        console.error(e)
      }
    }
  }

  render() {
    const { target, commentOnHighlight } = this.props
    const rect = this.getRect()
    return rect && (
      <div
        style={{
          top: `${!target.selectors.isBackwards && (rect.top + rect.height) * 100}%`,
          left: `${!target.selectors.isBackwards && (rect.left + rect.width) * 100}%`,
          bottom: `${target.selectors.isBackwards && (1 - rect.top) * 100}%`,
          right: `${target.selectors.isBackwards && (1 - rect.left) * 100}%`,
        }}
        className="PDF_Popup-buttons"
      >
        <div className="PDF_Popup-content">
          { this.props.currentUser ? (
            <div className="PDF_Popup-button">
              <span>
                <button onMouseDown={this.saveHighlight}>
                  <svg viewBox="0 0 1024 1024" width="24" height="24"><path d="M1016.5248 493.8752a25.6 25.6 0 0 0-36.1984 0l-183.6032 183.6032a76.8512 76.8512 0 0 1-108.5952 0L448.9216 438.272c-14.4384-14.4384-22.3744-33.6896-22.3744-54.3232s7.936-39.8848 22.3744-54.3232l183.6032-183.6032a25.6 25.6 0 0 0-36.1984-36.1984L412.7232 293.4272a127.0272 127.0272 0 0 0-37.376 90.5216c0 14.592 2.4576 28.8256 7.0656 42.1888L7.5264 801.024a25.6 25.6 0 0 0-7.4752 18.1248v76.8a25.6 25.6 0 0 0 25.6 25.6h486.4c6.8096 0 13.312-2.7136 18.1248-7.4752l170.0864-170.0864a128 128 0 0 0 42.1888 7.0656c34.2528 0 66.4064-13.2608 90.5216-37.376l183.6032-183.6032a25.6 25.6 0 0 0 0-36.1984zM501.4016 870.4H51.2v-40.6016l358.5024-358.5024 3.0208 3.1744 239.2064 239.2064 3.1744 3.0208L501.4016 870.4z" /></svg>
                </button>
              </span>
              <span>
                <button onMouseDown={commentOnHighlight}>
                  <svg viewBox="0 0 1024 1024" width="24" height="24"><path d="M914.285714 73.142857 109.714286 73.142857C69.485714 73.142857 36.571429 106.057143 36.571429 146.285714l0 548.571429c0 40.228571 32.914286 73.142857 73.142857 73.142857l245.028571 0 157.257143 157.257143 157.257143-157.257143L914.285714 768c40.228571 0 73.142857-32.914286 73.142857-73.142857L987.428571 146.285714C987.428571 106.057143 954.514286 73.142857 914.285714 73.142857zM914.285714 694.857143l-245.028571 0-29.257143 0-21.942857 21.942857L512 822.857143l-106.057143-106.057143L384 694.857143 354.742857 694.857143 109.714286 694.857143 109.714286 146.285714l804.571429 0L914.285714 694.857143z" /><path d="M292.571429 475.428571c18.285714 0 36.571429-18.285714 36.571429-36.571429l0-36.571429c0-18.285714-18.285714-36.571429-36.571429-36.571429s-36.571429 18.285714-36.571429 36.571429l0 36.571429C256 457.142857 274.285714 475.428571 292.571429 475.428571z" /><path d="M512 475.428571c18.285714 0 36.571429-18.285714 36.571429-36.571429l0-36.571429c0-18.285714-18.285714-36.571429-36.571429-36.571429s-36.571429 18.285714-36.571429 36.571429l0 36.571429C475.428571 457.142857 493.714286 475.428571 512 475.428571z" /><path d="M731.428571 475.428571c18.285714 0 36.571429-18.285714 36.571429-36.571429l0-36.571429c0-18.285714-18.285714-36.571429-36.571429-36.571429s-36.571429 18.285714-36.571429 36.571429l0 36.571429C694.857143 457.142857 713.142857 475.428571 731.428571 475.428571z" /></svg>
                </button>
              </span>
            </div>
          ) : (
            <div className="PDF_Popup-button">
              <Button icon="login" size="small" type="primary" onClick={this.props.showLoginModal}>请先登录</Button>
            </div>
          )}
        </div>
      </div>)
  }
}

PagePopup.propTypes = {
  closeAnnotation: PropTypes.func,
  commentOnHighlight: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  pageNumber: PropTypes.number,
  saveAnnotation: PropTypes.any,
  showLoginModal: PropTypes.func,
  target: PropTypes.any,
  paperId: PropTypes.string,
}

export default PagePopup
