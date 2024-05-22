import { useState } from "react";
import api from "../../../utils/api";

const FileTransfer = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFolderUpload = (event) => {
    setSelectedFiles(event.target.files);
  };

  const uploadFiles = async () => {
    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append(`paths[${i}]`, selectedFiles[i].webkitRelativePath);
      formData.append(`files[${i}]`, selectedFiles[i]);
    }

    await api.post("/test_upload/file", formData);
  };

  return (
    <div>
      <input type="file" webkitdirectory="" onChange={handleFolderUpload} />
      <button onClick={uploadFiles}>Upload</button>
    </div>
  );
};

export default FileTransfer;
