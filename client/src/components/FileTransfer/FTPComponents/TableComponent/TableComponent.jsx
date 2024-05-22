import { Table } from "antd";
import { UserOutlined, FileOutlined } from "@ant-design/icons";
import { DotsVerticalIcon, UserAddIcon } from "@heroicons/react/solid";
import { useRef, useState } from "react";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/solid";

const TableComponent = (props) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const dropdownRef = useRef(null);

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
      render: (text) => (
        <>
          <FileOutlined /> {text}
        </>
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
      dataIndex: "lastModified",
      key: "lastModified",
    },
    {
      title: "File Size",
      dataIndex: "fileSize",
      key: "fileSize",
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

  const data = [
    {
      key: "1",
      name: "File 1",
      owner: "Owner 1",
      lastModified: "2022-01-01",
      fileSize: "1MB",
    },
    {
      key: "2",
      name: "File 2",
      owner: "Owner 1",
      lastModified: "2022-01-01",
      fileSize: "1MB",
    },
    {
      key: "3",
      name: "File 3",
      owner: "Owner 3",
      lastModified: "2022-01-01",
      fileSize: "1MB",
    },
    {
      key: "4",
      name: "File 4",
      owner: "Owner 4",
      lastModified: "2022-01-01",
      fileSize: "1MB",
    },
    {
      key: "5",
      name: "File 5",
      owner: "Owner 5",
      lastModified: "2022-01-01",
      fileSize: "1MB",
    },
    // Add more data here
  ];

  return <Table columns={columns} dataSource={data} />;
};

export default TableComponent;
