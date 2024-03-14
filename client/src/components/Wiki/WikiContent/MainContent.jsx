import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaPlus, FaTimes, FaChevronDown } from "react-icons/fa";
import PropTypes from "prop-types";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Modal, Form, Input, Button } from "antd";
import api from "../../../utils/api";
import store from "../../../redux/store";
import { addArticleState } from "../../../redux/slices/articleSlice";

const MainContent = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [open, setOpen] = useState(false);
  const [openArticleModal, setOpenArticleModal] = useState(false);
  const [submitActive, setSubmitActive] = useState(false);
  const [addArtCategory_Id, setAddArt_Category_Id] = useState(null);
  const [categories, setCategories] = useState([]);
  const [currentId, setCurrentId] = useState();
  const [articleTitle, setArticleTitle] = useState("");
  const [form] = Form.useForm();
  const [articleForm] = Form.useForm();
  const [activeLink, setActiveLink] = useState({ left: 0, right: 0 }); // Set Link 1 and Link 3 to be selected by default
  const buttonRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const currentUrl = location.pathname;

  const currentArticle = useSelector((state) => state.article);

  useEffect(() => {
    const getCategories = async () => {
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
    };
    getCategories();
  }, []);

  useEffect(() => {
    const getFirstArticle = async () => {
      const sortedCategories = [...categories].sort(
        (a, b) => a.parent_Id - b.parent_Id
      );
      const categoryWithSmallestParentId = sortedCategories[0];

      if (categoryWithSmallestParentId) {
        const sortedSubCategories = [
          ...categoryWithSmallestParentId.subCategories,
        ].sort((a, b) => a.order_within_parent - b.order_within_parent);
        const subCategoryWithSmallestOrder = sortedSubCategories[0];

        if (subCategoryWithSmallestOrder) {
          const response = await api.get(
            `/api/article/${
              currentArticle.category_Id
                ? currentArticle.category_Id
                : subCategoryWithSmallestOrder.category_Id
            }`
          );
          const { data } = response.data;
          // Dispatch the addarticle action
          store.dispatch(
            addArticleState({
              articleName: data.articleTitle,
              articleContent: data.articleContent,
              category_Id: data.category_Id,
              action: "edit",
            })
          );
          setCurrentId(data.category_Id);
          setArticleTitle(data.articleTitle);
        }
      }
    };

    getFirstArticle();
  }, [currentArticle]);

  useEffect(() => {
    switch (currentUrl) {
      case "/wiki/articles":
        setActiveLink({ left: 0, right: 0 });
        break;
      case "/wiki/edit":
        setActiveLink({ left: 0, right: 1 });
        break;
      case "/wiki/history":
        setActiveLink({ left: 0, right: 2 });
        break;
      default:
        setActiveLink({ left: 0, right: 0 }); // default case
    }
  }, [currentUrl]);

  useEffect(() => {
    const getArticle = async () => {
      const response = await api.get(`/api/article/${currentId}`);
      const { data } = response.data;
      store.dispatch(
        addArticleState({
          articleName: data.articleTitle,
          articleContent: data.articleContent,
          category_Id: data.category_Id,
          action: "edit",
        })
      );
    };
    getArticle();
  }, [currentId]);

  const userRole = useSelector((state) => state.user.userRole);

  const handleDropdown = (index) => {
    if (activeDropdown === index) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(index);
    }
  };

  const handleLink = (side, index) => {
    setActiveLink((prevState) => ({ ...prevState, [side]: index }));
    if (side === "right") {
      switch (index) {
        case 0:
          navigate("/wiki/articles");
          break;
        case 1:
          navigate("/wiki/edit");
          break;
        case 2:
          navigate("/wiki/history");
          break;
        default:
          break;
      }
    }
  };

  const addCategory = async (values) => {
    console.log(values);
    const response = await api.post("/api/category/addCategory", {
      category: values.category,
    });
    console.log(response);
    setSubmitActive(true);
    form.resetFields();
  };

  const addArticle = async (values) => {
    setArticleTitle(values.article);
    store.dispatch(
      addArticleState({
        articleName: values.article,
        articleContent: "",
        category_Id: addArtCategory_Id,
        action: "add",
      })
    );
    const response = await api.post("/api/category/addCategory", {
      category: values.category,
    });
    console.log(response);
    setSubmitActive(true);
    articleForm.resetFields();
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

  return (
    <div className="flex-grow flex flex-col items-center bg-white">
      <div className="flex justify-between items-center w-3/5 border-b border-gray-600 relative pt-4">
        <h1 className="text-xl font-bold">
          {articleTitle ? articleTitle : "Current Title"}
        </h1>
        <button
          ref={buttonRef}
          className="flex items-center text-sm font-bold"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex flex-col space-y-1">
            <span className="w-4 h-0.5 bg-black"></span>
            <span className="w-4 h-0.5 bg-black"></span>
            <span className="w-4 h-0.5 bg-black"></span>
          </div>
        </button>
        {isOpen && (
          <div
            className="bg-gray-100 flex flex-col space-y-2 absolute left-full p-4 ml-1 text-black"
            style={{ width: "300px", top: buttonRef.current?.offsetTop }}
          >
            <div className="flex justify-between items-center">
              <div className="flex justify-start items-center">
                {userRole === "admin" &&
                  activeLink.left === 0 &&
                  activeLink.right === 1 && (
                    <button className="mr-2 text-black" onClick={showModal}>
                      <FaPlus size={12} color="#2D9596" />
                    </button>
                  )}
                <h2 className="text-lg font-bold">Contents</h2>
              </div>
              <button
                className="text-red-500 rounded-full w-6 h-6 flex items-center justify-center"
                onClick={() => setIsOpen(false)}
              >
                <FaTimes size={12} />
              </button>
            </div>
            {categories.map((category, index) => (
              <div key={index}>
                <div className="flex justify-start items-center">
                  {userRole === "admin" &&
                    activeLink.left === 0 &&
                    activeLink.right === 1 && (
                      <button
                        className="mr-2 text-black"
                        onClick={() => addArticleHandler(category)}
                      >
                        <FaPlus size={12} color="#2D9596" />
                      </button>
                    )}
                  <a key={category.category_Id} href="#" className="text-black">
                    {category.category}
                  </a>
                  <button
                    className="text-black rounded-full w-6 h-6 flex items-center justify-center ml-auto"
                    onClick={() => handleDropdown(index)}
                  >
                    <FaChevronDown size={12} />
                  </button>
                </div>
                {activeDropdown === index && (
                  <div
                    className={`flex flex-col space-y-2 ${
                      userRole === "admin" &&
                      activeLink.left === 0 &&
                      activeLink.right === 1
                        ? "pl-8"
                        : "pl-4"
                    }`}
                  >
                    {category.subCategories.map((subCategory) => (
                      <Link
                        key={subCategory.category_Id}
                        className="text-black"
                        onClick={() => {
                          setArticleTitle(subCategory.category);
                          setCurrentId(subCategory.category_Id);
                        }}
                      >
                        {subCategory.category}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-between items-center w-3/5 border-b border-gray-600 pb-1">
        <div>
          {["Article", "Files"].map((link, index) => (
            <a
              key={index}
              className={`p-2 cursor-pointer ${
                activeLink.left === index
                  ? "border-b-2 border-black font-bold"
                  : ""
              }`}
              style={{ lineHeight: "2rem" }}
              onClick={() => handleLink("left", index)}
            >
              {link}
            </a>
          ))}
        </div>
        <div>
          {["Read", "Edit", "History"].map((link, index) => (
            <a
              key={index}
              className={`p-2 cursor-pointer ${
                activeLink.right === index
                  ? "border-b-2 border-black font-bold"
                  : ""
              }`}
              style={{ lineHeight: "2rem" }}
              onClick={() => handleLink("right", index)}
            >
              {link}
            </a>
          ))}
        </div>
      </div>
      <div className="w-3/5">{props.children}</div>
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
              onClick={handleSubmit}
            >
              Add
            </Button>
          </>
        )}
      >
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
          }}
        >
          <Form.Item
            label="Category Title"
            name="category"
            rules={[
              {
                required: true,
                message: "Please input Title!",
              },
            ]}
          >
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
              onClick={handleArticleSubmit}
            >
              Add
            </Button>
          </>
        )}
      >
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
          }}
        >
          <Form.Item
            label="Article Title"
            name="article"
            rules={[
              {
                required: true,
                message: "Please input Title!",
              },
            ]}
          >
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
