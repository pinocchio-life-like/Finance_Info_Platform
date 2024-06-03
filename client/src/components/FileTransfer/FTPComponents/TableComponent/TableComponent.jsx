import { Table } from "antd";
import PropTypes from "prop-types";
import { UserOutlined } from "@ant-design/icons";
import { DotsVerticalIcon, UserAddIcon } from "@heroicons/react/solid";
import { createRef, useEffect, useRef, useState } from "react";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/solid";
import { FcFolder } from "react-icons/fc";
import { PiFilePdfBold } from "react-icons/pi";
import { TbFileTypeDocx } from "react-icons/tb";
import { FaRegImages } from "react-icons/fa6";
import { PiFilePptBold } from "react-icons/pi";
import { LuTextSelect } from "react-icons/lu";
import { GrStatusUnknown } from "react-icons/gr";
import { DownloadIcon } from "@heroicons/react/solid";
import { FiCopy } from "react-icons/fi";
import { Link } from "react-router-dom";
import { RiFileExcel2Line } from "react-icons/ri";

const getIconForMimeType = (mimeType) => {
  switch (mimeType) {
    case "folder":
      return <FcFolder size={25} className="mr-4" />;
    case "application/pdf":
      return <PiFilePdfBold size={25} color="red" className="mr-4" />;
    case "application/msword":
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return <TbFileTypeDocx color="#0B60B0" size={25} className="mr-4" />;
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return <PiFilePptBold color="#FC4100" size={25} className="mr-4" />;
    case "text/plain":
      return <LuTextSelect color="#0C0C0C" size={25} className="mr-4" />;
    case "image/jpeg":
    case "image/png":
      return <FaRegImages color="#0C0C0C" size={25} className="mr-4" />;
    case "application/vnd.ms-excel":
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return <RiFileExcel2Line color="green" size={25} className="mr-4" />;
    // more cases ....
    default:
      return <GrStatusUnknown size={25} className="mr-4" />;
  }
};

const TableComponent = (props) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const dropdownRefs = useRef([]);
  const data = props.data;

  const [dropdownVisibleIndices, setDropdownVisibleIndices] = useState(
    new Array(data.length).fill(false)
  );

  useEffect(() => {
    // Create a ref for each row
    dropdownRefs.current = new Array(data.length)
      .fill(null)
      .map((_, i) => dropdownRefs.current[i] ?? createRef());
  }, [data.length]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside of any dropdown
      if (
        dropdownRefs.current.every(
          (ref) => ref.current && !ref.current.contains(event.target)
        )
      ) {
        // Set all values in dropdownVisibleIndices to false
        setDropdownVisibleIndices(new Array(data.length).fill(false));
      }
    };

    // Add event listener when component mounts
    document.addEventListener("click", handleClickOutside);

    // Remove event listener when component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownRefs, data.length]);

  const shareHandler = (record) => {
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
          {getIconForMimeType(record.type)}
          {record.type === "folder" ? (
            <Link to={`/ftp/directories/${record.id}`}>{text}</Link>
          ) : (
            <a
              style={{ color: "#008DDA" }}
              href={record.url}
              target="_blank"
              rel="noopener noreferrer">
              {text}
            </a>
          )}
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
      title: "",
      key: "download",
      render: (text, record, index) => (
        <div className="flex flex-row opacity-0 group-hover:opacity-100 gap-2">
          <FiCopy
            className="h-6 w-6 rounded-sm hover:bg-gray-600 hover:text-white p-1 cursor-pointer"
            aria-hidden="true"
            onClick={() => console.log("Copy clicked")}
          />
          <DownloadIcon
            className="h-6 w-6 rounded-sm hover:bg-gray-600 hover:text-white p-1 cursor-pointer"
            aria-hidden="true"
            onClick={() => console.log("Download clicked")}
          />
          <PencilAltIcon
            className="h-6 w-6 rounded-sm hover:bg-gray-600 hover:text-white p-1 cursor-pointer"
            aria-hidden="true"
            onClick={() => console.log("Rename clicked")}
          />
        </div>
      ),
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
            ref={dropdownRefs.current[index]}
            onClick={() => {
              const newDropdownVisibleIndices = new Array(data.length).fill(
                false
              );
              // Toggle the dropdown visibility for the current row
              newDropdownVisibleIndices[index] = !dropdownVisibleIndices[index];
              setDropdownVisibleIndices(newDropdownVisibleIndices);
            }}>
            <DotsVerticalIcon
              className="h-6 w-6 rounded-full hover:bg-gray-600 hover:text-white p-1 cursor-pointer"
              aria-hidden="true"
            />
          </button>
          {dropdownVisibleIndices[index] && (
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
              {record.type === "folder" && (
                <button
                  className="hover:bg-gray-200 w-full p-2 text-left flex justify-between items-center"
                  onClick={() => shareHandler(record)}>
                  Share
                  <UserAddIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                </button>
              )}
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
            setSelectedRow(record.id);
          },
          className: "group", // Add this line
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
