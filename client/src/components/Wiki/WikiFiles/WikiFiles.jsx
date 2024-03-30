import { Card, Tooltip } from "antd";
import { FaPlus, FaTimes, FaChevronDown } from "react-icons/fa";
import { FiCopy } from "react-icons/fi";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
const { Meta } = Card;

const WikiFiles = () => {
  const [categories, setCategories] = useState([]);
  const [initiateContent, setInitiateContent] = useState(false);
  const param = useParams();
  const { status, drop } = useSelector((state) => state.contents);
  const [isOpen, setIsOpen] = useState(status);
  const [copied, setCopied] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(drop);
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

  const handleDropdown = (index) => {
    if (activeDropdown === index) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(index);
    }
  };
  return (
    <div className="w-full border-x border-b h-[80vh] px-6 pt-5">
      <div className="w-full flex justify-start items-center">
        <h1 className="font-bold text-2xl">Overview</h1>
        <div className="flex px-4">
          <Card
            hoverable
            style={{
              width: 240,
              margin: 10,
            }}>
            <Meta title="Europe Street beat" description="www.instagram.com" />
          </Card>
          <Card
            hoverable
            style={{
              width: 240,
              margin: 10,
            }}>
            <Meta title="Europe Street beat" description="www.instagram.com" />
          </Card>
          <Card
            hoverable
            style={{
              width: 240,
              margin: 10,
            }}>
            <Meta title="Europe Street beat" description="www.instagram.com" />
          </Card>
          <Card
            hoverable
            style={{
              width: 240,
              margin: 10,
            }}>
            <Meta title="Europe Street beat" description="www.instagram.com" />
          </Card>
        </div>
      </div>
      <div className="w-full flex justify-start items-center border-t">
        <div className="border-r h-[65.3vh] w-[16%] pt-2">
          <div className="w-full flex flex-col">
            <div className="flex justify-between items-center">
              <div className="flex justify-start items-center">
                <h2 style={{ color: "#070F2B" }} className="text-lg font-bold">
                  Article Files
                </h2>
              </div>
              <button
                className="text-red-500 rounded-full w-6 h-6 flex items-center justify-center"
                //   onClick={() => setIsOpen(false)}
              >
                {/* <FaTimes size={12} /> */}
              </button>
            </div>
            {categories.map((category, index) => (
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
                      {
                        /* const linkAddress = currentUrl.includes("edit")
                        ? `/wiki/edit/${subCategory.category_Id}`
                        : currentUrl.includes("articles")
                        ? `/wiki/articles/${subCategory.category_Id}`
                        : `/wiki/history/${subCategory.category_Id}`; */
                      }

                      return (
                        <div
                          key={subCategory.category_Id}
                          className="flex justify-between items-center mt-2 group hover:bg-white">
                          <Link
                            style={{ color: "#070F2B" }}
                            key={subCategory.category_Id}
                            className="text-black"
                            to="">
                            {subCategory.category}
                          </Link>
                          {/* <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-100">
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
                          </div> */}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="h-[65.3vh] w-[84%]">hello</div>
      </div>
    </div>
  );
};

export default WikiFiles;
