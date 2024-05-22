import { useState } from "react";
import { FaGoogleDrive } from "react-icons/fa6";
// import { BsCloudUploadFill } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { RiFolderReceivedFill } from "react-icons/ri";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { CgTemplate } from "react-icons/cg";
import Upload_modal from "../FTPComponents/modal/Upload_modal/";
import { Dropdown, Menu } from "antd";

const FTPCommon = (props) => {
  const [activeIndex, setActiveIndex] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [folderName, setFolderName] = useState("");

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleAddFolder = () => {
    console.log(folderName);
  };

  const menu = (
    <Menu className="border-[1px] shadow-lg border-gray-400">
      <Menu.Item key="1" onClick={() => setModalOpen(true)}>
        New Folder
      </Menu.Item>
      <Menu.Item key="2" onClick={() => setModalOpen(true)}>
        Upload File
      </Menu.Item>
      <Menu.Item key="3" onClick={() => setModalOpen(true)}>
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
                  {/* <Link
                    className={`w-full flex items-center py-3 md:px-4 px-2 shadow rounded hover:bg-[#155CA2] hover:text-white font-light`}
                    onClick={() => setModalOpen(true)}>
                    <FaPlus size={20} style={{ marginRight: 10 }} /> New
                  </Link> */}
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
                  <li className="w-full">
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
                  </li>
                  <li className="w-full">
                    <Link
                      className={`flex items-center py-3 md:px-4 px-2 rounded hover:bg-gray-200 font-light ${
                        activeIndex === 4 ? "text-[#155CA2] " : ""
                      }`}
                      onClick={() => {
                        setActiveIndex(4);
                      }}>
                      <CgTemplate size={20} style={{ marginRight: 10 }} />{" "}
                      Templates
                    </Link>
                  </li>
                </li>
              </ul>
            </nav>
          </div>
          <div className="w-5/6 md:mt-0 mt-2">{props.children}</div>
        </div>
      </div>
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
