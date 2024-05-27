import React, { useState } from "react";
import { Button, message, Modal, Input } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import api from "./../../utils/api";

const { confirm } = Modal;

const FolderUpload = () => {
  const [formData, setFormData] = useState({
    files: [],
    folder_name: "",
    folder_url: "",
    visible: false,
  });

  const handleFolderInput = (event) => {
    const selectedFiles = Array.from(event.target.files);
    console.log("Selected Files:", selectedFiles);

    if (selectedFiles.length > 0) {
      const directoryPath = selectedFiles[0].webkitRelativePath;
      const directoryParts = directoryPath.split("/");
      const folderURL = directoryParts.slice(0, -1).join("/");
      const folderName = directoryParts.slice(-2, -1)[0];

      setFormData({
        ...formData,
        files: selectedFiles,
        folder_name: folderName,
        folder_url: folderURL,
      });
    } else {
      setFormData({
        ...formData,
        files: selectedFiles,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const showConfirm = () => {
    if (!formData.folder_name || !formData.folder_url) {
      message.error("Folder URL and name are required.");
      return;
    }

    confirm({
      title: "Are you sure you want to upload the folder?",
      icon: <ExclamationCircleOutlined className="bg-500" />,
      content: "This action cannot be undone.",
      onOk: handleSubmit,
      okButtonProps: { className: "bg-red-500" },
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.folder_name || !formData.folder_url) {
      message.error("Folder URL and name are required.");
      return;
    }

    const formDataObject = new FormData();
    formData.files.forEach((file) => {
      formDataObject.append("files", file);
    });
    formDataObject.append("folder_name", formData.folder_name);
    formDataObject.append("folder_url", formData.folder_url);

    try {
      const response = await api.post("/api/upload/folder", formDataObject, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response) {
        message.success("Folder uploaded successfully!");
      } else {
        message.error("Error uploading folder");
      }
    } catch (error) {
      console.error("Error uploading folder:", error);
      if (error.response) {
        message.error(error.response.data || "Error uploading folder");
      } else {
        message.error("Error uploading folder.");
      }
    }
  };

  const handleOk = () => {
    setFormData({
      ...formData,
      visible: false,
    });
  };

  const handleCancel = () => {
    setFormData({
      ...formData,
      visible: false,
    });
  };

  return (
    <div>
      <Modal
        title="Create New Folder"
        visible={formData.visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          placeholder="Enter folder name"
          name="folder_name"
          value={formData.folder_name}
          onChange={handleInputChange}
        />
        <Input
          placeholder="Enter folder URL"
          name="folder_url"
          value={formData.folder_url}
          onChange={handleInputChange}
          style={{ marginTop: "10px" }}
        />
      </Modal>
      <div>
        <Button
          className="m-2"
          onClick={() => setFormData({ ...formData, visible: true })}
        >
          Create New Folder
        </Button>
      </div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="file"
          name="files[]"
          id="files"
          multiple
          webkitdirectory="true"
          onChange={handleFolderInput}
        />
        <Button type="primary" htmlType="submit" className="ml-2">
          Upload
        </Button>
      </form>
    </div>
  );
};

export default FolderUpload;
