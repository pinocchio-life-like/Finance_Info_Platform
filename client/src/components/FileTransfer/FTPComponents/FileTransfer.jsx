import { useState } from "react";
import api from "../../../utils/api";
import { jwtDecode } from "jwt-decode";

const FileTransfer = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const token = localStorage.getItem("token");
  let userName = null;
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userName = decodedToken.userName;
    } catch (error) {
      console.error("Invalid token");
    }
  }

  const handleFolderUpload = (event) => {
    setSelectedFiles(event.target.files);
  };

  const uploadFiles = async () => {
    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append(`paths[${i}]`, selectedFiles[i].webkitRelativePath);
      formData.append(`files[${i}]`, selectedFiles[i]);
    }

    formData.append("userName", userName);
    formData.append("folder_parent_id", 4);

    await api.post("/api/folders/upload", formData);
  };

  return (
    <div>
      <input type="file" webkitdirectory="" onChange={handleFolderUpload} />
      <button onClick={uploadFiles}>Upload</button>
    </div>
  );
};

export default FileTransfer;
