import React from 'react'

const ImageToolbar = props => (
  <div className="settings-menu">
    {/* <div onClick={props.scaleToOriginalSize}><img src={require('./img/original-size.png')}/></div>
    <div onClick={props.scaleIn}><img src={require('./img/scale-in.png')}/></div>
    <div onClick={props.scaleOut}><img src={require('./img/scale-out.png')}/></div>
    <div onClick={props.alignLeft}><img src={require('./img/align-left.png')}/></div>
    <div onClick={props.alignCenter}><img src={require('./img/align-center.png')}/></div>
    <div onClick={props.alignRight}><img src={require('./img/align-right.png')}/></div> */}
    <div onClick={props.removeImage}>X</div>
  </div>
)

export default ImageToolbar
