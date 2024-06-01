import { Table } from "antd";
import PropTypes from "prop-types";
import { UserOutlined } from "@ant-design/icons";
import { DotsVerticalIcon, UserAddIcon } from "@heroicons/react/solid";
import { useRef, useState } from "react";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/solid";
import { FcFolder } from "react-icons/fc";
import { PiFilePdfBold } from "react-icons/pi";
import { TbFileTypeDocx } from "react-icons/tb";
import { FaRegImages } from "react-icons/fa6";
import { PiFilePptBold } from "react-icons/pi";
import { LuTextSelect } from "react-icons/lu";
import { GrStatusUnknown } from "react-icons/gr";

const getIconForMimeType = (mimeType) => {
  switch (mimeType) {
    case "folder":
      return <FcFolder size={25} className="mr-4" />;
    case "application/pdf":
      return <PiFilePdfBold size={25} color="#00215E" className="mr-4" />;
    case "application/msword":
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return <TbFileTypeDocx color="#0B60B0" size={25} className="mr-4" />;
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return <PiFilePptBold color="#E72929" size={25} className="mr-4" />;
    case "text/plain":
      return <LuTextSelect color="#0C0C0C" size={25} className="mr-4" />;
    case "image/jpeg":
    case "image/png":
      return <FaRegImages color="#0C0C0C" size={25} className="mr-4" />;
    // Add more cases as needed....
    default:
      return <GrStatusUnknown size={25} className="mr-4" />;
  }
};

const TableComponent = (props) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const dropdownRef = useRef(null);
  const data = props.data;

  const shareHandler = (record) => {
    setDropdownVisible(false);
    props.shareHandler(record);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["descend", "ascend"],
      render: (text, record) => (
        <span className="flex flex-row items-center">
          {getIconForMimeType(record.type)} {text}
        </span>
      ),
    },
    {
      title: "Owner",
      dataIndex: "owner",
      key: "owner",
      render: (text) => (
        <>
          <UserOutlined /> {text}
        </>
      ),
    },
    {
      title: "Last Modified",
      dataIndex: "updatedAt",
      key: "updatedAt",
    },
    {
      title: "File Size",
      dataIndex: "size",
      key: "size",
    },
    {
      title: (
        <div className="flex justify-end">
          <DotsVerticalIcon className="h-6 w-6 p-1" aria-hidden="true" />
        </div>
      ),
      key: "options",
      render: (text, record, index) => (
        <div className="flex justify-end">
          <button
            ref={dropdownRef}
            onClick={() => {
              setDropdownVisible(!dropdownVisible);
              setActiveIndex(index);
            }}>
            <DotsVerticalIcon
              className="h-6 w-6 rounded-full hover:bg-gray-600 hover:text-white p-1 cursor-pointer"
              aria-hidden="true"
            />
          </button>
          {dropdownVisible && activeIndex === index && (
            <div
              style={{
                position: "absolute",
                top: 19,
                right: 36,
                backgroundColor: "white",
                border: "1px solid #ccc",
                borderRadius: "5px",
                zIndex: 1000,
              }}
              className="w-64 flex flex-col items-start shadow-lg py-2">
              <button
                className="hover:bg-gray-200 w-full p-2 text-left flex justify-between items-center"
                onClick={() => shareHandler(record)}>
                Share
                <UserAddIcon className="h-4 w-4 mr-1" aria-hidden="true" />
              </button>
              <button
                className="hover:bg-gray-200 w-full p-2 text-left flex justify-between items-center"
                onClick={() => console.log("Option 2 clicked")}>
                Rename
                <PencilAltIcon className="h-4 w-4 mr-1" aria-hidden="true" />
              </button>
              <button
                className="hover:bg-gray-200 w-full p-2 text-left flex justify-between items-center"
                onClick={() => console.log("Option 3 clicked")}>
                Delete
                <TrashIcon className="h-4 w-4 mr-1" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      onRow={(record) => {
        return {
          onClick: () => {
            console.log("Row key:", record.id);
          },
        };
      }}
      columns={columns}
      dataSource={data}
    />
  );
};

TableComponent.propTypes = {
  shareHandler: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
};

export default TableComponent;
