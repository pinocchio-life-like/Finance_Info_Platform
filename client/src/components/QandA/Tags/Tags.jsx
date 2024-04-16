import { Pagination } from "antd";
import Search from "antd/es/transfer/search";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
import { Link } from "react-router-dom";

const Tags = () => {
  const [activeLink, setActiveLink] = useState("Popular");
  const [tags, setTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const itemsPerPage = 50; // Number of questions per page
  const [searchTerm, setSearchTerm] = useState("");

  const getTags = async (type) => {
    console.log("type", type);
    try {
      const response = await api.get("/api/tags/getall");
      let data = response.data.data;
      console.log("response", response);
      if (response.data && response.data.data) {
        if (type === "Popular") {
          data.sort((a, b) => b.useCount - a.useCount);
        } else if (type === "Name") {
          data.sort((a, b) => a.tag_name.localeCompare(b.tag_name));
        } else if (type === "New") {
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
          data = data.filter((tag) => new Date(tag.createdAt) > oneMonthAgo);
          data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }
        setTags(data);
      } else {
        console.error("Unexpected API response:", response);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };
  useEffect(() => {
    getTags(activeLink);
  }, [activeLink]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getTagsForPage = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return tags
      .filter((tag) =>
        tag.tag_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(startIndex, endIndex);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between w-full p-4 pt-8 pb-3">
        <h1 className="font-bold text-2xl">
          Tags <span>|</span>{" "}
          <span className="font-light text-xl">{tags.length}</span>
        </h1>
      </div>
      <p className="px-4">
        A tag is a keyword or label that categorizes your question with other,
        similar questions. Using the right tags makes it easier for others to
        find and answer your question.
      </p>
      <div className="flex p-4 justify-between">
        <div>
          <Search
            placeholder="input search text"
            // onSearch={onSearch}
            onChange={handleSearch}
            style={{
              width: 200,
            }}
          />
        </div>
        <ul
          className="flex justify-between items-center border cursor-pointer border-gray-300 rounded-lg px-1 py-[5px]"
          style={{
            width: 200,
          }}>
          <li
            className={`w-1/3 rounded text-sm flex justify-center ${
              activeLink === "Popular" ? "bg-[#D9D9D9]" : ""
            }`}
            onClick={() => setActiveLink("Popular")}>
            Popular
          </li>
          <li
            className={`w-1/3 rounded text-sm flex justify-center ${
              activeLink === "Name" ? "bg-[#D9D9D9]" : ""
            }`}
            onClick={() => setActiveLink("Name")}>
            Name
          </li>
          <li
            className={`w-1/3 rounded text-sm flex justify-center ${
              activeLink === "Hello" ? "bg-[#D9D9D9]" : ""
            }`}
            onClick={() => setActiveLink("New")}>
            New
          </li>
        </ul>
      </div>
      <div className="w-full pb-4 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {getTagsForPage().map((tag) => (
          <div key={tag.tag_id} className="bg-white p-4 rounded border">
            <Link
              to={`/qa/questions/${tag.tag_name}`}
              className="inline-block border text-sm text-blue-600 bg-blue-100 rounded px-1">
              {tag.tag_name}
            </Link>
            <div className="flex justify-between pt-4">
              <div>Total Questions</div>
              <div>{tag.useCount}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="relative flex justify-center items-end h-full pt-5">
        <Pagination
          current={currentPage}
          total={tags.length} // Total number of questions
          pageSize={itemsPerPage}
          onChange={handlePageChange} // Handle page changes
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default Tags;
