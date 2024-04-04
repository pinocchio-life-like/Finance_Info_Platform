import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaPlus, FaTimes, FaChevronDown } from "react-icons/fa";
import PropTypes from "prop-types";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Modal, Form, Input, Button, Tooltip } from "antd";
import api from "../../../utils/api";
import store from "../../../redux/store";
import { addArticleState } from "../../../redux/slices/articleSlice";
import { changeTableOfContentsState } from "../../../redux/slices/contentsSlice";
import { jwtDecode } from "jwt-decode";
import { FiCopy } from "react-icons/fi";

const MainContent = (props) => {
  const { status, drop } = useSelector((state) => state.contents);
  const [isOpen, setIsOpen] = useState(status);
  const [initiateContent, setInitiateContent] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(drop);
  const [open, setOpen] = useState(false);
  const [openArticleModal, setOpenArticleModal] = useState(false);
  const [submitActive, setSubmitActive] = useState(false);
  const [addArtCategory_Id, setAddArt_Category_Id] = useState(null);
  const [categories, setCategories] = useState([]);
  const param = useParams();
  const [articleTitle, setArticleTitle] = useState("");
  const [form] = Form.useForm();
  const [articleForm] = Form.useForm();
  const [activeLink, setActiveLink] = useState({ left: 0, right: 0 }); // Set article and read to be selected by default
  const buttonRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const currentUrl = location.pathname;
  const token = localStorage.getItem("token");
  let userRole = null;
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userRole = decodedToken.userRole;
    } catch (error) {
      console.error("Invalid token");
    }
  }
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await api.post("/api/category/getCategories");

        const mainCategories = response.data.filter(
          (category) => category.parent_Id === null
        );
        const subCategories = response.data.filter(
          (category) => category.parent_Id !== null
        );

        mainCategories.sort((a, b) => a.order - b.order);
        subCategories.sort(
          (a, b) => a.order_within_parent - b.order_within_parent
        );

        mainCategories.forEach((mainCategory) => {
          mainCategory.subCategories = subCategories.filter(
            (subCategory) => subCategory.parent_Id === mainCategory.category_Id
          );
        });
        setCategories(mainCategories);
      } catch (error) {
        console.error("An error occurred while fetching: ", error);
      }
    };
    getCategories();
  }, [initiateContent, param.id]);

  useEffect(() => {
    if (currentUrl.includes("/wiki/articles")) {
      setActiveLink({ left: 0, right: 0 });
    } else if (currentUrl.includes("/wiki/edit")) {
      setActiveLink({ left: 0, right: 1 });
    } else if (currentUrl.includes("/wiki/history")) {
      setActiveLink({ left: 0, right: 2 });
    } else if (currentUrl.includes("/wiki/files")) {
      setActiveLink({ left: 1, right: 0 });
    } else {
      setActiveLink({ left: 0, right: 0 });
    }
  }, [currentUrl]);

  useEffect(() => {
    const getArticle = async () => {
      try {
        const response = await api.get(`/api/article/${param.id}`);
        const { data } = response.data;
        store.dispatch(
          addArticleState({
            articleName: data.articleTitle,
            category_Id: data.category_Id,
            action: "edit",
          })
        );
        setArticleTitle(data.articleTitle);
      } catch (error) {
        console.error("An error occurred while fetching: ", error);
      }
    };
    getArticle();
  }, [param.id]);

  const handleDropdown = (index) => {
    if (activeDropdown === index) {
      setActiveDropdown(null);
    } else {
      store.dispatch(changeTableOfContentsState({ status: true, drop: index }));
      setActiveDropdown(index);
    }
  };

  const handleLink = (side, index) => {
    setActiveLink((prevState) => ({ ...prevState, [side]: index }));
    if (side === "right") {
      switch (index) {
        case 0:
          navigate(`/wiki/articles/${param.id}`);
          break;
        case 1:
          navigate(`/wiki/edit/${param.id}`);
          break;
        case 2:
          navigate(`/wiki/history/${param.id}`);
          break;
        default:
          break;
      }
    }
    if (side === "left") {
      switch (index) {
        case 0:
          navigate(`/wiki/articles/${param.id}`);
          break;
        case 1:
          navigate(`/wiki/files/${param.id}`);
          break;
        default:
          break;
      }
    }
  };

  const addCategory = async (values) => {
    try {
      const response = await api.post("/api/category/addCategory", {
        category: values.category,
      });
      console.log(response);
      setInitiateContent(!initiateContent);
      setSubmitActive(true);
      form.resetFields();
    } catch (error) {
      console.error("An error occurred while adding category: ", error);
      form.resetFields();
    }
  };

  const addArticle = async (values) => {
    try {
      setArticleTitle(values.article);
      store.dispatch(
        addArticleState({
          articleName: values.article,
          articleContent: "",
          category_Id: addArtCategory_Id,
          action: "add",
        })
      );
      setSubmitActive(true);
      articleForm.resetFields();
    } catch (error) {
      console.error("An error occurred while adding category: ", error);
      articleForm.resetFields();
    }
  };

  const showModal = () => {
    setOpen(true);
  };

  const handleSubmit = () => {
    setOpen(false);
    form.submit();
  };
  const handleCancel = () => {
    setOpen(false);
    setSubmitActive(false);
    form.resetFields();
  };
  const handleArticleCancel = () => {
    setOpenArticleModal(false);
    setSubmitActive(false);
    articleForm.resetFields();
  };

  const addArticleHandler = (category) => {
    setOpenArticleModal(true);
    setAddArt_Category_Id(category.category_Id);
  };

  const handleArticleSubmit = () => {
    setOpenArticleModal(false);
    articleForm.submit();
  };

  useEffect(() => {
    store.dispatch(
      changeTableOfContentsState({ status: isOpen, drop: activeDropdown })
    );
  }, [isOpen, activeDropdown]);

  useEffect(() => {
    setActiveDropdown(drop);
  }, [drop]);

  return (
    <div className="flex-grow flex flex-col items-center mx-14 bg-white">
      <div className="flex justify-between items-center w-full border-b border-gray-600 pb-1 pt-3">
        <div>
          {["Article", "Files"].map((link, index) => {
            if (userRole !== "admin" && link === "Files") {
              return null;
            }
            return (
              <a
                key={index}
                className={`p-2 cursor-pointer ${
                  activeLink.left === index
                    ? "border-b-2 border-black font-bold"
                    : ""
                }`}
                style={{ lineHeight: "2rem" }}
                onClick={() => handleLink("left", index)}>
                {link}
              </a>
            );
          })}
        </div>
        <div>
          {["Read", "Edit", "History"].map((link, index) => {
            if (userRole === "reader" && link === "Edit") {
              return null;
            }

            return (
              <a
                key={index}
                className={`p-2 cursor-pointer ${
                  activeLink.right === index
                    ? "border-b-2 border-black font-bold"
                    : ""
                }`}
                style={{ lineHeight: "2rem" }}
                onClick={() => handleLink("right", index)}>
                {link}
              </a>
            );
          })}
        </div>
      </div>
      <div className="flex justify-between items-center w-full border-b px-2 border-gray-600 relative pt-1 pb-1">
        <h1 className="text-xl font-bold">
          {articleTitle ? articleTitle : "Current Title"}
        </h1>
        <button
          ref={buttonRef}
          className="flex items-center text-sm font-bold"
          onClick={() => {
            setIsOpen((state) => !state);
          }}>
          <div className="flex flex-col space-y-1">
            <span className="w-4 h-0.5 bg-black"></span>
            <span className="w-4 h-0.5 bg-black"></span>
            <span className="w-4 h-0.5 bg-black"></span>
          </div>
        </button>
        {isOpen && (
          <div
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 bg-gray-200 flex flex-col space-y-2 absolute right-0 p-4 text-black z-50 mt-6 "
            style={{ width: "320px", top: buttonRef.current?.offsetTop }}>
            <div className="flex justify-between items-center">
              <div className="flex justify-start items-center">
                {userRole !== "reader" &&
                  activeLink.left === 0 &&
                  activeLink.right === 1 && (
                    <button className="mr-2 text-black" onClick={showModal}>
                      <FaPlus size={12} color="#2D9596" />
                    </button>
                  )}
                <h2 style={{ color: "#070F2B" }} className="text-lg font-bold">
                  Contents
                </h2>
              </div>
              <button
                className="text-red-500 rounded-full w-6 h-6 flex items-center justify-center"
                onClick={() => setIsOpen(false)}>
                <FaTimes size={12} />
              </button>
            </div>
            {categories.map((category, index) => (
              <div key={index}>
                <div className="flex justify-start items-center">
                  {userRole !== "reader" &&
                    activeLink.left === 0 &&
                    activeLink.right === 1 && (
                      <button
                        className="mr-2 text-black"
                        onClick={() => {
                          addArticleHandler(category);
                          handleDropdown(index);
                        }}>
                        <FaPlus size={12} color="#2D9596" />
                      </button>
                    )}
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
                  <div
                    className={`flex flex-col space-y-2 ${
                      activeLink.left === 0 && activeLink.right === 1
                        ? "pl-8"
                        : "pl-4"
                    }`}>
                    {category.subCategories.map((subCategory) => {
                      const linkAddress = currentUrl.includes("edit")
                        ? `/wiki/edit/${subCategory.category_Id}`
                        : currentUrl.includes("articles")
                        ? `/wiki/articles/${subCategory.category_Id}`
                        : currentUrl.includes("files")
                        ? `/wiki/articles/${subCategory.category_Id}`
                        : `/wiki/history/${subCategory.category_Id}`;

                      return (
                        <div
                          key={subCategory.category_Id}
                          className="flex justify-between items-center mt-2 group hover:bg-white">
                          <Link
                            style={{ color: "#070F2B" }}
                            key={subCategory.category_Id}
                            className="text-black"
                            onClick={() =>
                              setTimeout(() => setIsOpen(false), 1000)
                            }
                            to={linkAddress}>
                            {subCategory.category}
                          </Link>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-100">
                            <Tooltip
                              visible={copied === subCategory.category_Id}
                              placement="right"
                              color="#00224D"
                              title={
                                copied === subCategory.category_Id
                                  ? "Copied!"
                                  : ""
                              }
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
                                  navigator.clipboard.writeText(
                                    window.location.origin +
                                      `/wiki/articles/${subCategory.category_Id}`
                                  );
                                  setCopied(subCategory.category_Id);
                                  setTimeout(() => setCopied(null), 2000);
                                }}
                              />
                            </Tooltip>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="w-full">{props.children}</div>
      <Modal
        title="Add New Category"
        open={open}
        onCancel={handleCancel}
        footer={(_, { CancelBtn }) => (
          <>
            <CancelBtn />
            <Button
              disabled={!submitActive}
              style={{ background: "#3B82f6", color: "white" }}
              onClick={handleSubmit}>
              Add
            </Button>
          </>
        )}>
        <Form
          onFinish={addCategory}
          form={form}
          name="category"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: false,
          }}>
          <Form.Item
            label="Category Title"
            name="category"
            rules={[
              {
                required: true,
                message: "Please input Title!",
              },
            ]}>
            <Input
              onChange={(e) => {
                if (e.target.value !== "") setSubmitActive(true);
                else setSubmitActive(false);
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Add New Article"
        open={openArticleModal}
        onCancel={handleArticleCancel}
        footer={(_, { CancelBtn }) => (
          <>
            <CancelBtn />
            <Button
              disabled={!submitActive}
              style={{ background: "#3B82f6", color: "white" }}
              onClick={handleArticleSubmit}>
              Add
            </Button>
          </>
        )}>
        <Form
          onFinish={addArticle}
          form={articleForm}
          name="article"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: false,
          }}>
          <Form.Item
            label="Article Title"
            name="article"
            rules={[
              {
                required: true,
                message: "Please input Title!",
              },
            ]}>
            <Input
              onChange={(e) => {
                if (e.target.value !== "") setSubmitActive(true);
                else setSubmitActive(false);
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MainContent;

MainContent.propTypes = {
  children: PropTypes.node,
};
