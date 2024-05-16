import { Button, List, Popconfirm, Tooltip, message } from "antd";
import { AiOutlineDelete } from "react-icons/ai";
import { FiDownload } from "react-icons/fi";
// import { FaChevronDown } from "react-icons/fa";
import { useCallback, useEffect, useRef, useState } from "react";
import api from "../../../utils/api";
import { useParams } from "react-router";
// import { useSelector } from "react-redux";
// import { Link } from "react-router-dom";
import { FiCopy } from "react-icons/fi";
import { UploadOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";
// import store from "../../../redux/store";
// import { changeTableOfContentsState } from "../../../redux/slices/contentsSlice";

const WikiFiles = () => {
  // const [categories, setCategories] = useState([]);
  const param = useParams();
  // const { drop } = useSelector((state) => state.contents);
  // const [activeDropdown, setActiveDropdown] = useState(drop);
  const [data, setData] = useState([]);
  const [position] = useState("bottom");
  const [align] = useState("center");
  const [copied, setCopied] = useState(null);
  const fileInputRef = useRef();
  const [uploading, setUploading] = useState(false);

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

  const fetchData = useCallback(async () => {
    try {
      const response = await api.get(`/api/article/file/${param.id}`);
      console.log(response.data);
      const sortedData = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setData(sortedData);
    } catch (error) {
      console.error("An error occurred while fetching: ", error);
    }
  }, [param.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // useEffect(() => {
  //   const getCategories = async () => {
  //     try {
  //       const response = await api.post("/api/category/getCategories");

  //       const mainCategories = response.data.filter(
  //         (category) => category.parent_Id === null
  //       );
  //       const subCategories = response.data.filter(
  //         (category) => category.parent_Id !== null
  //       );

  //       mainCategories.sort((a, b) => a.order - b.order);
  //       subCategories.sort(
  //         (a, b) => a.order_within_parent - b.order_within_parent
  //       );

  //       mainCategories.forEach((mainCategory) => {
  //         mainCategory.subCategories = subCategories.filter(
  //           (subCategory) => subCategory.parent_Id === mainCategory.category_Id
  //         );
  //       });
  //       setCategories(mainCategories);
  //     } catch (error) {
  //       console.error("An error occurred while fetching: ", error);
  //     }
  //   };
  //   getCategories();
  // }, [param.id]);

  // const handleDropdown = (index) => {
  //   if (activeDropdown === index) {
  //     setActiveDropdown(null);
  //   } else {
  //     setActiveDropdown(index);
  //   }
  // };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const form = new FormData();
    form.append("file", file);
    form.append("category_Id", param.id);
    form.append("user", userName);
    setUploading(true);
    try {
      await api.post("/api/article/file/upload", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      fetchData();
      message.success(`file uploaded successfully`);
    } catch (error) {
      message.error(`file upload failed.`);
      console.error(error);
    } finally {
      setUploading(false);
      event.target.value = null;
    }
  };

  const handleFileDelete = async (key) => {
    try {
      await api.delete(`/api/article/file/delete/`, { data: { key } });
      message.success(`file deleted successfully`);
      fetchData();
    } catch (error) {
      message.error(`file deletion failed.`);
      console.error(error);
    }
  };

  // useEffect(() => {
  //   store.dispatch(changeTableOfContentsState({ drop: activeDropdown }));
  // }, [activeDropdown]);

  return (
    <div className="w-full border-x border-b px-2">
      <div className="w-full flex justify-start">
        {/* <div className="border-r w-[16%] pt-4">
          <div className="w-full flex flex-col"> */}
        {/* <div className="flex justify-between items-center">
              <div className="flex justify-start items-center">
                <h2
                  style={{ color: "#070F2B" }}
                  className="text-lg font-bold mb-4">
                  Shared Article Files
                </h2>
              </div>
            </div> */}
        {/* {categories.map((category, index) => (
              <div key={index}>
                <div className="flex justify-start items-center">
                  <a
                    style={{ color: "#070F2B", fontWeight: "bold" }}
                    key={category.category_Id}
                    href="#"
                    className="text-black">
                    {category.category}
                  </a>
                  <button
                    className="text-black rounded-full w-6 h-6 flex items-center justify-center ml-auto"
                    onClick={() => handleDropdown(index)}>
                    <FaChevronDown size={12} />
                  </button>
                </div>
                {activeDropdown === index && (
                  <div className={`flex flex-col space-y-2 pl-4 $`}>
                    {category.subCategories.map((subCategory) => {
                      const linkAddress = `/wiki/files/${subCategory.category_Id}`;
                      return (
                        <div
                          key={subCategory.category_Id}
                          className="flex justify-between items-center mt-2 group hover:bg-white">
                          <Link
                            style={{ color: "#070F2B" }}
                            key={subCategory.category_Id}
                            className="text-black"
                            to={linkAddress}>
                            {subCategory.category}
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))} */}
        {/* </div>
        </div> */}
        <div className="w-full flex flex-col">
          <div className="w-full flex justify-between border-b">
            <h2
              style={{ color: "#070F2B" }}
              className="text-lg pl-4 font-bold pt-4">
              {data.length} Files
            </h2>
            <div className="flex">
              <Button
                disabled={uploading}
                icon={<UploadOutlined />}
                className="m-3 px-5 bg-[#155CA2] text-white right-0"
                onClick={handleButtonClick}
                loading={uploading}>
                Click to Upload
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
              />
            </div>
          </div>

          <List
            className="pb-2"
            size="small"
            pagination={{ position, align, pageSize: 10 }}
            dataSource={data}
            renderItem={(item) => (
              <List.Item key={item.upload_id}>
                <List.Item.Meta
                  // avatar={<Avatar src={item.picture.large} />}
                  title={
                    <a
                      style={{ color: "#008DDA" }}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer">
                      {item.originalname}
                    </a>
                  }
                  description={
                    <div className="flex">
                      <p className="pr-4">by: {item.user}</p>
                      <p className="pr-4">date: {item.createdAt}</p>
                    </div>
                  }
                />
                <div className="pr-3">
                  <Tooltip
                    open={copied === item.upload_id}
                    placement="left"
                    color="#00224D"
                    title={"Copied!"}
                    arrow>
                    <FiCopy
                      color="#00224D"
                      fontSize={18}
                      style={{
                        cursor: "pointer",
                        marginRight: "2px",
                      }}
                      onClick={(event) => {
                        event.preventDefault();
                        if (navigator.clipboard && window.isSecureContext) {
                          // Use the Clipboard API if available
                          navigator.clipboard
                            .writeText(item.url)
                            .then(() => {
                              setCopied(item.upload_id);
                              setTimeout(() => setCopied(null), 2000);
                            })
                            .catch((err) =>
                              console.error("Could not copy text: ", err)
                            );
                        } else if (document.queryCommandSupported("copy")) {
                          // Fallback to document.execCommand('copy')
                          const textarea = document.createElement("textarea");
                          textarea.value = item.url;
                          document.body.appendChild(textarea);
                          textarea.select();
                          try {
                            document.execCommand("copy");
                            setCopied(item.upload_id);
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
                </div>
                <div className="pr-3">
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    <FiDownload
                      color="#00224D"
                      fontSize={18}
                      style={{
                        cursor: "pointer",
                        marginRight: "2px",
                      }}
                    />
                  </a>
                </div>
                <div className="pr-3">
                  <Popconfirm
                    title="Are you sure to delete?"
                    onConfirm={() => handleFileDelete(item.url)}
                    okText="Yes"
                    cancelText="No"
                    okButtonProps={{
                      style: { backgroundColor: "#155CA2", color: "white" },
                    }}>
                    <AiOutlineDelete
                      color="red"
                      fontSize={18}
                      style={{
                        cursor: "pointer",
                        marginRight: "2px",
                      }}
                    />
                  </Popconfirm>
                </div>
              </List.Item>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default WikiFiles;
