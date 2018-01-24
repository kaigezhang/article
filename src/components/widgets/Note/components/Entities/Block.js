import React, { PureComponent } from 'react'
import Image from './Image'

export class MediaBlock extends PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    // const entityKey = this.props.block.getEntityAt(0)
    // const entity = this.props.contentState.getEntity(entityKey)
    const entityKey = this.props.contentState.getLastCreatedEntityKey()
    const entity = this.props.contentState.getEntity(entityKey)
    const entityData = entity.getData()
    const entityType = entity.getType()

    let media = null
    if (entityType === 'IMAGE') {
      media = <Image src={entityData.src} align={entityData.align} entityKey={entityKey} contentState={this.props.contentState} removeImage={this.removeImage} />
    } else if (entityType === 'DASH') {
      media = <div className="dash"><hr /></div>
    }
    return media
  }
}

export const blockRenderer = (block) => {
  if (block.getType() === 'atomic') {
    return {
      component: MediaBlock,
      editable: false,
    }
  }
}
