import React, { useState } from 'react';
import { Upload, Button, message, Modal, Input } from 'antd';
import { UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import api from '../../utils/api';

const { confirm } = Modal;

const FolderUpload = () => {
  const [files, setFiles] = useState([]);
  const [foldername, setFoldername] = useState('');
  const [visible, setVisible] = useState(false);

  const handleFolderInput = (info) => {
    const selectedFiles = info.fileList.map(file => file.originFileObj);
    setFiles(selectedFiles);
  };

  const showConfirm = () => {
    confirm({
      title: 'Are you sure you want to upload the files?',
      icon: <ExclamationCircleOutlined className='bg-500' />,
      content: 'This action cannot be undone.',
      onOk: handleSubmit,
      okButtonProps: { className: 'bg-red-500' },
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file, file.webkitRelativePath);
    });

    try {
      const response = await api.post('api/upload/folder', formData);

      if (response.ok) {
        message.success('Files uploaded successfully!');
      } else {
        message.error('Error uploading files');
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      message.error('Error uploading files');
    }
  };

  const handleOk = () => {
   api.post('http://localhost/api/createfolder',foldername,)
    setVisible(false);
  };

  const handleCancel = () => {
    // Handle Cancel button click
    setVisible(false);
  };

  return (
    <div>
      <Modal
        title="Create New Folder"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input placeholder="Enter folder name" value={foldername} onChange={(e) => setFoldername(e.target.value)} />
      </Modal>
      <div>
        <Button className='m-2' onClick={() => setVisible(true)}>Create New Folder</Button>
      </div>
      <Upload
        multiple
        directory
        onChange={handleFolderInput}
        beforeUpload={() => false} // Disable automatic upload
      >
        <Button className='m-2' icon={<UploadOutlined />}>Select Folder</Button>
      </Upload>
      <Button type="danger" onClick={showConfirm} className="ml-2">Upload</Button>
    </div>
  );
};

export default FolderUpload;
