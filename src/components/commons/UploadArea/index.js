import React from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, Upload, Icon, message } from 'antd'
import { apiUrl } from 'config'

const { Dragger } = Upload

const UploadArea = ({
  user,
  showUploadModal,
  uploadModalVisible,
  hideUploadModal,
}) => {
  const { token } = user
  const config = {
    name: 'files',
    multiple: true,
    action: `${apiUrl}/papers`,
    headers: {
      Authorization: `Token ${token}`,
    },
    onChange(info) {
      const { status } = info.file
      if (status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (status === 'done') {
        message.success(`${info.file.name} 上传成功`)
      } else if (status === 'error') {
        message.error(`${info.file.name} 上传失败`)
      }
    },
  }
  return (
    <div>
      <Button
        type="primary"
        onClick={showUploadModal}
        icon="upload"
      >上传文献
      </Button>
      <Modal
        title="上传文献"
        width={500}
        visible={uploadModalVisible}
        footer={null}
        onCancel={hideUploadModal}
      >
        <Dragger
          {...config}
        >
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">点击或拖动文件到本区域上传</p>
          <p className="ant-upload-hint">
              仅支持上传PDF文件上传
          </p>
        </Dragger>
      </Modal>
    </div>


  )
}

UploadArea.propTypes = {
  hideUploadModal: PropTypes.any,
  showUploadModal: PropTypes.any,
  uploadModalVisible: PropTypes.any,
  user: PropTypes.any,
}

export default UploadArea

