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
  const[fileUpload,setFile]=useState({
    file_name:"",
    file_url:"",
    mime_type:"",
    folder_id:""

  })

  const handleFolderInput = (event) => {
    const selectedFiles = Array.from(event.target.files);
    console.log("Selected Files:", selectedFiles);

    const formDataArray = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const directoryPath = file.webkitRelativePath;
      const directoryParts = directoryPath.split("/");
      const folderURL = directoryParts.join("/");
      const folderName = directoryParts.slice(-2, -1)[0];
      const mime_type=file.type
      console.log(mime_type)

      console.log("File:", file);
      console.log("Parent Folder URL:", folderURL);

      formDataArray.push({
        file,
        folder_name: folderName,
        folder_url: folderURL,
      });
    }

    setFormData({
      ...formData,
      files: formDataArray,
      folder_name: formDataArray.length > 0 ? formDataArray[0].folder_name : "",
      folder_url: formDataArray.length > 0 ? formDataArray[0].folder_url : "",
    });
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

    console.log(formData.folder_name);
    console.log(formData.folder_url);

    if (!formData.folder_name || !formData.folder_url) {
      message.error("Folder URL and name are required.");
      return;
    }

    const formDataObject = new FormData();
    formData.files.forEach((file) => {
   
      formDataObject.append("files", file.file);
    });
    formDataObject.append("folder_name", formData.folder_name);
    formDataObject.append("folder_url", formData.folder_url.slice(0, -1));
    console.log(formDataObject,"testttttttttttt")

    try {
      const response = await api.post("/api/upload/folder", formDataObject, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response)
      if (response) {
        message.success("Folder uploaded successfully!");
        // formDataObject.files.map((file)=>{
        //   // setFile({
        //   //   ...file,
        //   //   folder_id:response.data.id,
        //   //   mime_type:file.type,
        //   //   file_name:file.name,
        //   //   file_url:response.data.url
        //   // })

        // })
        // const responseFile=await api.post('api/upload/file',fileUpload)
        //   if(responseFile){
        //     message.success("file uploaded successfully!");
        //   }
       
      } else {
        message.error("Error uploading folder");
      }
    } catch (error) {
      console.error("Error uploading folder:", error.message);
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
