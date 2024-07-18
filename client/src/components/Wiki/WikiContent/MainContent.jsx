import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  FaTimes,
  FaChevronDown,
  FaEllipsisV,
  FaChevronUp,
} from "react-icons/fa";
import PropTypes from "prop-types";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Modal, Form, Input, Button, Tooltip } from "antd";
import api from "../../../utils/api";
import store from "../../../redux/store";
import { addArticleState } from "../../../redux/slices/articleSlice";
import { changeTableOfContentsState } from "../../../redux/slices/contentsSlice";
import { jwtDecode } from "jwt-decode";
import { FiCopy } from "react-icons/fi";
import { GrArticle } from "react-icons/gr";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { ImDownload2 } from "react-icons/im";

const MainContent = (props) => {
  const { status, drop } = useSelector((state) => state.contents);
  const [isOpen, setIsOpen] = useState(status);
  const [showOptions, setShowOptions] = useState([]);
  const [showFolderOptions, setShowFolderOptions] = useState(false);
  const [initiateContent, setInitiateContent] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(
    Array.isArray(drop) ? drop : []
  );
  const [open, setOpen] = useState(false);
  const [openArticleModal, setOpenArticleModal] = useState(false);
  const [submitActive, setSubmitActive] = useState(false);
  const [addArtCategory_Id, setAddArt_Category_Id] = useState(null);
  const [categories, setCategories] = useState([]);
  const param = useParams();
  const [articleTitle, setArticleTitle] = useState("");
  const [form] = Form.useForm();
  const [articleForm] = Form.useForm();
  const [addSubForm] = Form.useForm();
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
  const [exportState, setExportState] = useState(false);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await api.get("/api/category/getCategories");
        // console.log(response.data);

        const buildNestedCategories = (parentId = null) => {
          return response.data
            .filter((category) => category.parent_Id === parentId)
            .sort((a, b) => {
              // If both categories are of the same type, sort based on order_within_parent
              if (a.type === b.type) {
                return a.order_within_parent - b.order_within_parent;
              }
              // If a is of type "sub" and b is of type "article", a should come first
              if (a.type === "sub" && b.type === "article") {
                return -1;
              }
              // If a is of type "article" and b is of type "sub", b should come first
              if (a.type === "article" && b.type === "sub") {
                return 1;
              }
              // If none of the above conditions are met, don't change the order
              return 0;
            })
            .map((category) => ({
              ...category,
              subCategories: buildNestedCategories(category.category_Id),
            }));
        };

        const nestedCategories = buildNestedCategories();
        nestedCategories.sort((a, b) => a.order - b.order);
        setCategories(nestedCategories);
        setShowOptions(Array(nestedCategories.length).fill(false));
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

  const handleDropdown = (index, level) => {
    if (activeDropdown[level] === index) {
      const newActiveDropdown = [...activeDropdown];
      newActiveDropdown[level] = null;
      setActiveDropdown(newActiveDropdown);
    } else {
      const newActiveDropdown = [...activeDropdown];
      newActiveDropdown[level] = index;
      setActiveDropdown(newActiveDropdown);
      store.dispatch(
        changeTableOfContentsState({ status: true, drop: newActiveDropdown })
      );
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
  const handleAddFolderCancel = () => {
    setAddFolderOpen(false);
    setSubmitActive(false);
    addSubForm.resetFields();
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

  const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: "none",
    background: isDragging ? "lightblue" : "white",
    ...draggableStyle,
  });

  const onSaveAsPdf = () => {
    setExportState(true);
  };

  const onDragMainEnd = async (result) => {
    const { source, destination } = result;

    // Ignore the case when the droppable is outside of the list
    if (!destination) {
      return;
    }

    // Ignore the case when the item is dropped in the same place
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Create a copy of the categories array
    const categoriesCopy = Array.from(categories);

    // Remove the dragged category from the source position
    const [removed] = categoriesCopy.splice(source.index, 1);

    // Add the dragged category to the destination position
    categoriesCopy.splice(destination.index, 0, removed);

    // Update the state
    setCategories(categoriesCopy);

    // Prepare the data to be sent to the backend
    const updatedCategories = categoriesCopy.map((category, index) => ({
      ...category,
      order: index,
    }));

    // Send the updated order to the backend
    try {
      await api.put("/api/categories/updateMainOrder", {
        categories: updatedCategories,
      });
    } catch (error) {
      console.error("An error occurred while updating the order: ", error);
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;

    // Ignore the case when the droppable is outside of the list
    if (!destination) {
      return;
    }

    // Ignore the case when the item is dropped in the same place
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Recursive function to find a category by its ID
    const findCategory = (categories, id) => {
      for (let category of categories) {
        if (category.category_Id === id) {
          return category;
        }

        if (category.subCategories) {
          const found = findCategory(category.subCategories, id);
          if (found) {
            return found;
          }
        }
      }

      return null;
    };

    // Create a copy of the categories array
    const categoriesCopy = Array.from(categories);

    // Find the source and destination categories
    const sourceCategory = findCategory(
      categoriesCopy,
      Number(source.droppableId)
    );
    const destinationCategory = findCategory(
      categoriesCopy,
      Number(destination.droppableId)
    );

    // Check if sourceCategory and destinationCategory are not undefined
    if (!sourceCategory || !destinationCategory) {
      console.error("Source or destination category not found");
      return;
    }

    // Find the dragged article
    const [removed] = sourceCategory.subCategories.splice(source.index, 1);

    // Add the dragged article to the destination category
    destinationCategory.subCategories.splice(destination.index, 0, removed);

    // Update the state
    setCategories(categoriesCopy);

    // Recursive function to update the order_within_parent for each category and its subcategories
    const updateOrderWithinParent = (categories, parentId) => {
      return categories
        .filter((category) => category.parent_Id === parentId)
        .map((category, index) => {
          const updatedCategory = {
            id: category.category_Id,
            order_within_parent: index,
          };

          if (category.subCategories) {
            updatedCategory.subCategories = updateOrderWithinParent(
              category.subCategories,
              category.category_Id
            );
          }

          return updatedCategory;
        });
    };

    // Prepare the data to be sent to the backend
    const updatedCategories = updateOrderWithinParent(categoriesCopy, null);

    // Send the updated order to the backend
    try {
      await api.put("/api/category/updateOrder", {
        categories: updatedCategories,
      });
    } catch (error) {
      console.error("An error occurred while updating the order: ", error);
    }
  };

  const [addFolderOpen, setAddFolderOpen] = useState(false);
  const [addFolder_Id, setAddFolder_Id] = useState(null);

  const addFolderId = (id) => {
    setAddFolder_Id(id);
    setAddFolderOpen(true);
  };

  const handleAddSubFolder = () => {
    setAddFolderOpen(false);
    addSubForm.submit();
  };

  const addSubFolder = async (values) => {
    try {
      const response = await api.post("/api/categories/addSubCategories", {
        category: values.category,
        parent_Id: addFolder_Id,
      });
      console.log(response);
      setInitiateContent(!initiateContent);
      setSubmitActive(true);
      addSubForm.resetFields();
    } catch (error) {
      console.error("An error occurred while adding category: ", error);
      addSubForm.resetFields();
    }
  };

  const renderCategory = (category, index, level = 0) => {
    return (
      <Droppable
        key={String(category.category_Id)}
        droppableId={String(category.category_Id)}>
        {(provided) => (
          <div ref={provided.innerRef} key={index} className="mt-1">
            {level === 0 ? (
              <Draggable
                key={String(category.category_Id)}
                draggableId={String(category.category_Id)}
                index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    key={category.category_Id}
                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style
                    )}
                    className="flex justify-start items-center px-1 rounded">
                    {userRole !== "reader" &&
                      activeLink.left === 0 &&
                      activeLink.right === 1 && (
                        <div
                          className="relative"
                          onMouseEnter={(e) => {
                            e.stopPropagation();
                            const newShowOptions = { ...showOptions };
                            if (!newShowOptions[level]) {
                              newShowOptions[level] = [];
                            }
                            newShowOptions[level][index] = true;
                            setShowOptions(newShowOptions);
                          }}
                          onMouseLeave={(e) => {
                            e.stopPropagation();
                            const newShowOptions = { ...showOptions };
                            if (!newShowOptions[level]) {
                              newShowOptions[level] = [];
                            }
                            newShowOptions[level][index] = false;
                            setShowOptions(newShowOptions);
                          }}>
                          <button className="mr-2 text-black border-b-2 border-transparent hover:bg-white py-1 rounded">
                            <FaEllipsisV size={13} />
                          </button>
                          {showOptions[level] && showOptions[level][index] && (
                            <div className="absolute left-0 mt-0 w-40 bg-white rounded-md shadow-lg py-1 z-50">
                              <button
                                className="block w-full text-left px-4 py-2 text-sm hover:bg-[#070F2B] hover:text-white "
                                onClick={() => {
                                  addArticleHandler(category);
                                  handleDropdown(index, level);
                                }}>
                                Add New Article
                              </button>
                              <button
                                onClick={() => {
                                  addFolderId(category.category_Id);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm hover:bg-[#070F2B] hover:text-white">
                                Add Sub Folder
                              </button>
                              {/* <button className="block w-full text-left px-4 py-2 text-sm hover:bg-[#070F2B] hover:text-white">
                                Rename Folder
                              </button>
                              <button className="block w-full text-left px-4 py-2 text-sm hover:bg-[#d34949] hover:text-white">
                                Delete Folder
                              </button> */}
                            </div>
                          )}
                        </div>
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
                      onClick={() => handleDropdown(index, level)}>
                      {activeDropdown[level] === index ? (
                        <FaChevronUp size={12} />
                      ) : (
                        <FaChevronDown size={12} />
                      )}
                    </button>
                  </div>
                )}
              </Draggable>
            ) : (
              <div
                style={{ background: "white" }}
                key={category.category_Id}
                className="flex justify-start items-center px-1 rounded">
                {userRole !== "reader" &&
                  activeLink.left === 0 &&
                  activeLink.right === 1 && (
                    <div
                      className="relative"
                      onMouseEnter={(e) => {
                        e.stopPropagation();
                        const newShowOptions = { ...showOptions };
                        if (!newShowOptions[level]) {
                          newShowOptions[level] = [];
                        }
                        newShowOptions[level][index] = true;
                        setShowOptions(newShowOptions);
                      }}
                      onMouseLeave={(e) => {
                        e.stopPropagation();
                        const newShowOptions = { ...showOptions };
                        if (!newShowOptions[level]) {
                          newShowOptions[level] = [];
                        }
                        newShowOptions[level][index] = false;
                        setShowOptions(newShowOptions);
                      }}>
                      <button className="mr-2 text-black border-b-2 border-transparent hover:bg-white py-1 rounded">
                        <FaEllipsisV size={13} />
                      </button>
                      {showOptions[level] && showOptions[level][index] && (
                        <div className="absolute left-0 mt-0 w-40 bg-white rounded-md shadow-lg py-1 z-50">
                          <button
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-[#070F2B] hover:text-white "
                            onClick={() => {
                              addArticleHandler(category);
                              handleDropdown(index, level);
                            }}>
                            Add New Article
                          </button>
                          <button
                            onClick={() => {
                              addFolderId(category.category_Id);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-[#070F2B] hover:text-white">
                            Add Sub Folder
                          </button>
                          {/* <button className="block w-full text-left px-4 py-2 text-sm hover:bg-[#070F2B] hover:text-white">
                            Rename Folder
                          </button>
                          <button className="block w-full text-left px-4 py-2 text-sm hover:bg-[#d34949] hover:text-white">
                            Delete Folder
                          </button> */}
                        </div>
                      )}
                    </div>
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
                  onClick={() => handleDropdown(index, level)}>
                  {activeDropdown[level] === index ? (
                    <FaChevronUp size={12} />
                  ) : (
                    <FaChevronDown size={12} />
                  )}
                </button>
              </div>
            )}

            {activeDropdown[level] === index && (
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable
                  droppableId={String(category.category_Id)}
                  key={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      className={`flex flex-col space-y-1 ${
                        activeLink.left === 0 && activeLink.right === 1
                          ? "pl-4"
                          : "pl-4"
                      }`}>
                      {category.subCategories.map((subCategory, subIndex) => {
                        if (subCategory.type === "sub") {
                          // If the subcategory is a folder, render it as a category
                          return renderCategory(
                            subCategory,
                            subIndex,
                            level + 1
                          );
                        } else {
                          // If the subcategory is not a folder, render it as an article
                          const linkAddress = currentUrl.includes("edit")
                            ? `/wiki/edit/${subCategory.category_Id}`
                            : currentUrl.includes("articles")
                            ? `/wiki/articles/${subCategory.category_Id}`
                            : currentUrl.includes("files")
                            ? `/wiki/files/${subCategory.category_Id}`
                            : `/wiki/history/${subCategory.category_Id}`;

                          return (
                            <Draggable
                              key={subCategory.category_Id}
                              draggableId={String(subCategory.category_Id)}
                              index={subIndex}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  key={subCategory.category_Id}
                                  style={getItemStyle(
                                    snapshot.isDragging,
                                    provided.draggableProps.style
                                  )}
                                  className="flex justify-between items-center mt-2 group hover:bg-white px-1 rounded">
                                  <Link
                                    style={{ color: "#070F2B" }}
                                    key={subCategory.category_Id}
                                    className="text-black flex items-center"
                                    onClick={() =>
                                      setTimeout(() => setIsOpen(false), 300)
                                    }
                                    to={linkAddress}>
                                    <GrArticle style={{ marginRight: 6 }} />
                                    {subCategory.category}
                                  </Link>
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-100">
                                    <Tooltip
                                      open={copied === subCategory.category_Id}
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
                                          const link =
                                            window.location.origin +
                                            `/wiki/articles/${subCategory?.category_Id}`;
                                          if (
                                            navigator.clipboard &&
                                            window.isSecureContext
                                          ) {
                                            // Use the Clipboard API if available
                                            navigator.clipboard
                                              .writeText(link)
                                              .then(() => {
                                                setCopied(
                                                  subCategory?.category_Id
                                                );
                                                setTimeout(
                                                  () => setCopied(null),
                                                  2000
                                                );
                                              })
                                              .catch((err) =>
                                                console.error(
                                                  "Could not copy text: ",
                                                  err
                                                )
                                              );
                                          } else if (
                                            document.queryCommandSupported(
                                              "copy"
                                            )
                                          ) {
                                            // Fallback to document.execCommand('copy')
                                            const textarea =
                                              document.createElement(
                                                "textarea"
                                              );
                                            textarea.value = link;
                                            document.body.appendChild(textarea);
                                            textarea.select();
                                            try {
                                              document.execCommand("copy");
                                              setCopied(
                                                subCategory?.category_Id
                                              );
                                              setTimeout(
                                                () => setCopied(null),
                                                2000
                                              );
                                            } catch (err) {
                                              console.error(
                                                "Could not copy text: ",
                                                err
                                              );
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
                                </div>
                              )}
                            </Draggable>
                          );
                        }
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  };

  return (
    <div className="flex-grow flex flex-col items-center lg:mx-14 mx-1 bg-white">
      <div className="flex justify-between items-center w-full border-b border-gray-600 pb-1 pt-3">
        <div>
          {["Article", "Files"].map((link, index) => {
            if (userRole !== "admin" && link === "Files") {
              return null;
            }
            return (
              <a
                key={index}
                className={`lg:p-2 px-1 py-2 cursor-pointer ${
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
                className={`lg:p-2 px-1 py-2  cursor-pointer ${
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
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">
            {articleTitle ? articleTitle : "Current Title"}
          </h1>
          <ImDownload2
            size={25}
            className="font-bold text-[#155CA2] rounded hover:bg-black hover:text-white p-1 cursor-pointer"
            onClick={() => onSaveAsPdf()}
          />
        </div>
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
            className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 bg-nav-bg flex flex-col space-y-2 absolute right-0 p-4 text-black z-50 mt-6 "
            style={{ top: buttonRef.current?.offsetTop }}>
            <div className="flex justify-between items-center px-1">
              <div className="flex justify-start items-center">
                {userRole !== "reader" &&
                  activeLink.left === 0 &&
                  activeLink.right === 1 && (
                    <div
                      className="relative"
                      onMouseEnter={() => setShowFolderOptions(true)}
                      onMouseLeave={() => setShowFolderOptions(false)}>
                      <button className="mr-2 text-black border-b-2 border-transparent hover:bg-white py-1 rounded">
                        <FaEllipsisV size={13} />
                      </button>
                      {showFolderOptions && (
                        <div className="absolute left-0 mt-0 w-40 bg-white rounded-md shadow-lg py-1 z-50">
                          <button
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-[#070F2B] hover:text-white "
                            onClick={showModal}>
                            Add New Folder
                          </button>
                          {/* <button className="block w-full text-left px-4 py-2 text-sm hover:bg-[#070F2B] hover:text-white">
                            Order Folders
                          </button> */}
                          {/* Add more options here */}
                        </div>
                      )}
                    </div>
                  )}
                <h2 style={{ color: "#070F2B" }} className="text-lg font-bold">
                  Content Folders
                </h2>
              </div>
              <button
                className="text-red-500 rounded-full w-6 h-6 flex items-center justify-center"
                onClick={() => setIsOpen(false)}>
                <FaTimes size={12} />
              </button>
            </div>
            <DragDropContext onDragEnd={onDragMainEnd}>
              {categories.map((category, index) =>
                renderCategory(category, index)
              )}
            </DragDropContext>
          </div>
        )}
      </div>
      <div className="w-full">
        {React.Children.map(props.children, (child) => {
          return React.cloneElement(child, {
            exportState,
            setExportState,
            articleTitle,
          });
        })}
      </div>
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
      <Modal
        title="Add SubFolder"
        open={addFolderOpen}
        onCancel={handleAddFolderCancel}
        footer={(_, { CancelBtn }) => (
          <>
            <CancelBtn />
            <Button
              disabled={!submitActive}
              style={{ background: "#3B82f6", color: "white" }}
              onClick={handleAddSubFolder}>
              Add
            </Button>
          </>
        )}>
        <Form
          onFinish={addSubFolder}
          form={addSubForm}
          name="category"
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: false,
          }}>
          <Form.Item
            label="Folder Name"
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
    </div>
  );
};

export default MainContent;

MainContent.propTypes = {
  children: PropTypes.node,
};
