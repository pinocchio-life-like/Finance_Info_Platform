import React, { useEffect, useRef, useState } from "react";
import { FaGoogleDrive } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { RiFolderReceivedFill } from "react-icons/ri";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
// import { CgTemplate } from "react-icons/cg";
import Upload_modal from "../FTPComponents/modal/Upload_modal/";
import { Dropdown, Menu } from "antd";
import { jwtDecode } from "jwt-decode";
import api from "../../../utils/api";

const FTPCommon = (props) => {
  const location = useLocation();
  const currentURL = location.pathname;
  const folderInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [folderName, setFolderName] = useState("");
  const [activeIndex, setActiveIndex] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [showProgress, setShowProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [lastSegment, setLastSegment] = useState();
  const [parentFolder, setParentFolder] = useState(null);
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    const fetchFolder = async () => {
      if (currentURL.includes("home")) {
        setLastSegment("home");
      } else {
        const response = await api.get(
          `/api/folder/folder_url/${currentURL.split("/").pop()}`
        );
        setLastSegment(response.data.data);
        setParentFolder(currentURL.split("/").pop());
      }
    };
    fetchFolder();
  }, [currentURL, refetch]);

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

  const handleUploadClick = () => {
    folderInputRef.current.click();
  };

  const handleFileUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    setShowProgress(true);
    setUploadStatus("Uploading...");

    const formData = new FormData();

    formData.append("userName", userName);
    formData.append("folder_parent_id", parentFolder);

    formData.append("folder_url", lastSegment);

    for (let i = 0; i < event.target.files.length; i++) {
      formData.append(`paths[${i}]`, event.target.files[i].webkitRelativePath);
      formData.append(`files[${i}]`, event.target.files[i]);
    }

    const config = {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(percentCompleted);
      },
    };

    try {
      await api.post("/api/folders/upload", formData, config);
      setUploadStatus("Upload complete!");
      setRefetch(!refetch);
    } catch (error) {
      setUploadStatus("Upload failed!");
    } finally {
      setTimeout(() => {
        setShowProgress(false);
      }, 3000);
    }
  };

  const handleFileUploadChange = async (event) => {
    setShowProgress(true);
    setUploadStatus("Uploading...");

    const formData = new FormData();

    formData.append("userName", userName);
    formData.append("folder_id", parentFolder);
    formData.append("folder_url", lastSegment);

    for (let i = 0; i < event.target.files.length; i++) {
      formData.append(`files[${i}]`, event.target.files[i]);
    }

    const config = {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(percentCompleted);
      },
    };

    try {
      const response = await api.post("/api/files/upload", formData, config);

      if (response.status === 200) {
        setUploadStatus("Upload complete!");
        setRefetch(!refetch);
      } else if (response.status === 400) {
        setUploadStatus("Upload failed: File already exists");
      } else {
        setUploadStatus(`Upload failed: ${response.data.message}`);
      }
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setUploadStatus(`Upload failed: ${error.response.data.message}`);
      } else if (error.request) {
        // The request was made but no response was received
        setUploadStatus("Upload failed: No response from server");
      } else {
        // Something happened in setting up the request that triggered an Error
        setUploadStatus(`Upload failed: ${error.message}`);
      }
    } finally {
      setTimeout(() => {
        setShowProgress(false);
      }, 3000);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleAddFolder = async () => {
    const folderData = {
      user_name: userName,
      folder_parent_id: parentFolder,
      folder_name: folderName,
      folder_url: `${lastSegment}/${folderName}`,
    };

    try {
      await api.post("/api/folder/create", folderData);
      setRefetch(!refetch);
    } catch (error) {
      console.error("Failed to create folder", error);
    }
  };

  const menu = (
    <Menu className="border-[1px] shadow-lg border-gray-400">
      {!currentURL.includes("home") && (
        <Menu.Item key="2" onClick={handleFileUpload}>
          Upload File
        </Menu.Item>
      )}
      <Menu.Item key="1" onClick={() => setModalOpen(true)}>
        New Folder
      </Menu.Item>
      <Menu.Item key="3" onClick={handleUploadClick}>
        Upload Folder
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="flex justify-center lg:px-14 px-1 flex-col bg-white">
      <div className="flex w-full justify-between items-center border-b border-gray-300 relative pb-1"></div>
      <div className="flex w-full justify-center items-center relative border-x pb-2">
        <div className="w-full flex">
          <div className="w-1/6 h-screen sticky top-0 border-r z-40 mr-1 shadow-lg">
            <nav className="w-full bg-white z-50">
              <ul className="w-full flex items-start justify-start text-m flex-col space-x-0">
                <li className="w-full">
                  <Dropdown overlay={menu} trigger={["click"]}>
                    <Link
                      className={`w-full flex items-center py-3 md:px-4 px-2 shadow rounded-sm hover:bg-[#155CA2] hover:text-white font-light`}>
                      <FaPlus size={20} style={{ marginRight: 10 }} /> New
                    </Link>
                  </Dropdown>
                </li>
                <li className="w-full">
                  <Link
                    className={`flex items-center py-3 md:px-4 px-2 rounded hover:bg-gray-200 font-light ${
                      activeIndex === 1 ? "text-[#155CA2] " : ""
                    }`}
                    onClick={() => {
                      setActiveIndex(1);
                    }}>
                    <IoHome size={21} style={{ marginRight: 10 }} />
                    Home
                  </Link>
                </li>
                <li className="w-full">
                  <Link
                    className={`flex items-center py-3 md:px-4 px-2 rounded hover:bg-gray-200 font-light ${
                      activeIndex === 2 ? "text-[#155CA2] " : ""
                    }`}
                    onClick={() => {
                      setActiveIndex(2);
                    }}>
                    <FaGoogleDrive size={20} style={{ marginRight: 10 }} /> My
                    Folders
                  </Link>
                  {/* <li className="w-full"> */}
                  <Link
                    className={`flex items-center py-3 md:px-4 px-2 rounded hover:bg-gray-200 font-light ${
                      activeIndex === 3 ? "text-[#155CA2] " : ""
                    }`}
                    onClick={() => {
                      setActiveIndex(3);
                    }}>
                    <RiFolderReceivedFill
                      size={20}
                      style={{ marginRight: 10 }}
                    />{" "}
                    Shared
                  </Link>
                  {/* </li> */}
                  {/* <li className="w-full"> */}
                  {/* <Link
                    className={`flex items-center py-3 md:px-4 px-2 rounded hover:bg-gray-200 font-light ${
                      activeIndex === 4 ? "text-[#155CA2] " : ""
                    }`}
                    onClick={() => {
                      setActiveIndex(4);
                    }}>
                    <CgTemplate size={20} style={{ marginRight: 10 }} />{" "}
                    Templates
                  </Link> */}
                  {/* </li> */}
                </li>
              </ul>
            </nav>
          </div>
          <div className="w-5/6 md:mt-0 mt-2">
            {React.Children.map(props.children, (child) => {
              return React.cloneElement(child, {
                refetch: refetch,
                setRefetch,
              });
            })}
          </div>
        </div>
      </div>
      <input
        type="file"
        ref={folderInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        webkitdirectory=""
      />
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileUploadChange}
      />
      {showProgress && (
        <div className="fixed bottom-5 right-5 bg-[#01204E] text-white p-3 rounded-md shadow-md">
          {uploadStatus}: {uploadProgress}%
        </div>
      )}
      <Upload_modal
        isOpen={modalOpen}
        close={closeModal}
        handleAddFolder={handleAddFolder}
        setFolderName={setFolderName}
        folderName={folderName}
      />
    </div>
  );
};

FTPCommon.propTypes = {
  children: PropTypes.node,
};

export default FTPCommon;
