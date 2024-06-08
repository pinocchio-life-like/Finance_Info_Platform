import { Form, Input, Modal, Skeleton, Table, Tooltip, message } from "antd";
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
import { ExclamationCircleOutlined } from "@ant-design/icons";
import api from "../../../../utils/api";

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
  const dropdownRefs = useRef([]);
  const [copied, setCopied] = useState(null);
  const [modal, contextHolder] = Modal.useModal();
  const [renameForm] = Form.useForm();

  const data = props.data.filter((item) =>
    item.name.toLowerCase().includes(props.search.toLowerCase())
  );

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

  const deleteHandler = async (id, type) => {
    if (type === "folder") {
      const response = await api.delete(`api/folder/delete/${id}`);
      if (response.status === 200) {
        message.success("Folder deleted successfully");
        props.setRefetch((prev) => !prev);
      } else {
        message.error("Error deleting folder");
        console.error("Error deleting folder with id: ", id);
      }
    } else {
      const response = await api.delete(`api/files/${id}`);
      if (response.status === 200) {
        message.success("File deleted successfully");
        props.setRefetch((prev) => !prev);
      } else {
        message.error("Error deleting file");
        console.error("Error deleting file with id: ", id);
      }
    }
  };

  const showConfirm = (type, id) => {
    modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete this ${type}?`,
      okText: "delete",
      cancelText: "cancel",
      okButtonProps: {
        type: "primary",
        style: {
          borderColor: "red",
          backgroundColor: "red",
          color: "white",
        },
      },
      onOk() {
        deleteHandler(id, type);
      },
    });
  };

  const renameHandler = async (id, type, newName) => {
    if (type === "folder") {
      const response = await api.put(`api/folder/rename/${id}`, {
        newFolderName: newName,
      });
      if (response.status === 200) {
        message.success("Folder renamed successfully");
        props.setRefetch((prev) => !prev);
        renameForm.resetFields();
      } else {
        message.error("Error renaming folder");
        console.error("Error renaming folder with id: ", id);
      }
    } else {
      const response = await api.put(`api/files/rename/${id}`, {
        newFileName: newName,
      });
      if (response.status === 200) {
        message.success("File renamed successfully");
        props.setRefetch((prev) => !prev);
        renameForm.resetFields();
      } else {
        message.error("Error renaming file");
        console.error("Error renaming file with id: ", id);
      }
    }
  };

  const showRenameModal = (name, type, id) => {
    modal.confirm({
      title: `Rename "${name} to: `,
      // icon: <ExclamationCircleOutlined />,
      content: (
        <Form className="w-full" name="renameForm" form={renameForm}>
          <Form.Item
            className="w-full"
            name="newName"
            rules={[{ required: true, message: "Please input the new name!" }]}>
            <Input className="w-full" placeholder="Enter new name" />
          </Form.Item>
        </Form>
      ),
      okText: "Rename",
      cancelText: "Cancel",
      okButtonProps: {
        type: "primary",
        style: {
          borderColor: "#155CA2",
          backgroundColor: "#155CA2",
          color: "white",
        },
      },
      onOk() {
        renameForm
          .validateFields()
          .then((values) => {
            renameHandler(id, type, values.newName);
          })
          .catch((info) => {
            console.log("Validation failed:", info);
          });
      },
    });
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
      render: (text, record) => (
        <div className="flex flex-row opacity-0 group-hover:opacity-100 gap-2">
          <Tooltip
            open={copied === record.id}
            placement="left"
            color="#00224D"
            title={"Copied!"}
            arrow>
            <FiCopy
              className="h-6 w-6 rounded-sm hover:bg-gray-600 hover:text-white p-1 cursor-pointer"
              aria-hidden="true"
              onClick={(event) => {
                event.preventDefault();
                if (navigator.clipboard && window.isSecureContext) {
                  // Use the Clipboard API if available
                  navigator.clipboard
                    .writeText(
                      record.type === "folder"
                        ? `http://63.35.242.213:4000/ftp/directories/${record.id}`
                        : record.url
                    )
                    .then(() => {
                      setCopied(record.id);
                      setTimeout(() => setCopied(null), 2000);
                    })
                    .catch((err) =>
                      console.error("Could not copy text: ", err)
                    );
                } else if (document.queryCommandSupported("copy")) {
                  // Fallback to document.execCommand('copy')
                  const textarea = document.createElement("textarea");
                  textarea.value =
                    record.type === "folder"
                      ? `http://63.35.242.213:4000/ftp/directories/${record.id}`
                      : record.url;
                  document.body.appendChild(textarea);
                  textarea.select();
                  try {
                    document.execCommand("copy");
                    setCopied(record.id);
                    setTimeout(() => setCopied(null), 2000);
                  } catch (err) {
                    console.error("Could not copy text: ", err);
                  }
                  document.body.removeChild(textarea);
                } else {
                  console.error(
                    "Clipboard API or HTTPS is required to copy text."
                  );
                }
              }}
            />
          </Tooltip>
          {record.type !== "folder" && (
            <a href={record.url} target="_blank" rel="noopener noreferrer">
              <DownloadIcon
                className="h-6 w-6 rounded-sm hover:bg-gray-600 hover:text-white p-1 cursor-pointer"
                aria-hidden="true"
              />
            </a>
          )}

          {record.type === "folder"
            ? record.users.some(
                (user) =>
                  user.userName === props.userName && user.permission !== "read"
              ) && (
                <PencilAltIcon
                  className="h-6 w-6 rounded-sm hover:bg-gray-600 hover:text-white p-1 cursor-pointer"
                  aria-hidden="true"
                  onClick={() =>
                    showRenameModal(record.name, record.type, record.id)
                  }
                />
              )
            : record.permission !== "read" && (
                <PencilAltIcon
                  className="h-6 w-6 rounded-sm hover:bg-gray-600 hover:text-white p-1 cursor-pointer"
                  aria-hidden="true"
                  onClick={() =>
                    showRenameModal(record.name, record.type, record.id)
                  }
                />
              )}
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
          {dropdownVisibleIndices[index] &&
            (record.type === "folder"
              ? record.users.some(
                  (user) =>
                    user.userName === props.userName &&
                    user.permission !== "read"
                )
              : record.permission !== "read") && (
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
                {record.type === "folder" &&
                  record.users.some(
                    (user) =>
                      user.userName === props.userName &&
                      user.permission !== "read"
                  ) && (
                    <button
                      className="hover:bg-gray-200 w-full p-2 text-left flex justify-between items-center"
                      onClick={() => {
                        shareHandler(record);
                      }}>
                      Share
                      <UserAddIcon
                        className="h-4 w-4 mr-1"
                        aria-hidden="true"
                      />
                    </button>
                  )}
                {record.type === "folder"
                  ? record.users.some(
                      (user) =>
                        user.userName === props.userName &&
                        user.permission !== "read"
                    ) && (
                      <button
                        className="hover:bg-gray-200 w-full p-2 text-left flex justify-between items-center"
                        onClick={() =>
                          showRenameModal(record.name, record.type, record.id)
                        }>
                        Rename
                        <PencilAltIcon
                          className="h-4 w-4 mr-1"
                          aria-hidden="true"
                        />
                      </button>
                    )
                  : record.permission !== "read" && (
                      <button
                        className="hover:bg-gray-200 w-full p-2 text-left flex justify-between items-center"
                        onClick={() =>
                          showRenameModal(record.name, record.type, record.id)
                        }>
                        Rename
                        <PencilAltIcon
                          className="h-4 w-4 mr-1"
                          aria-hidden="true"
                        />
                      </button>
                    )}
                {record.type === "folder"
                  ? record.users.some(
                      (user) =>
                        user.userName === props.userName &&
                        user.permission !== "read"
                    ) && (
                      <button
                        className="hover:bg-gray-200 w-full p-2 text-left flex justify-between items-center"
                        onClick={() => showConfirm(record.type, record.id)}>
                        Delete
                        <TrashIcon
                          className="h-4 w-4 mr-1"
                          aria-hidden="true"
                        />
                      </button>
                    )
                  : record.permission !== "read" && (
                      <button
                        className="hover:bg-gray-200 w-full p-2 text-left flex justify-between items-center"
                        onClick={() => showConfirm(record.type, record.id)}>
                        Delete
                        <TrashIcon
                          className="h-4 w-4 mr-1"
                          aria-hidden="true"
                        />
                      </button>
                    )}
              </div>
            )}
        </div>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      {props.isLoading ? (
        <Skeleton active />
      ) : (
        <Table
          rowKey="id"
          onRow={() => {
            return {
              className: "group", // Add this line
            };
          }}
          columns={columns}
          dataSource={data}
        />
      )}
    </>
  );
};

TableComponent.propTypes = {
  shareHandler: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  search: PropTypes.string,
  setRefetch: PropTypes.func,
  userName: PropTypes.string,
  isLoading: PropTypes.bool,
};

export default TableComponent;
