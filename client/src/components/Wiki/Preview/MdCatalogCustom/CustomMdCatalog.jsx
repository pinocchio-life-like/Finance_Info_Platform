import { useState } from "react";
import PropTypes from "prop-types";
import { MdCatalog } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import "md-editor-rt/lib/preview.css";
import { CiSearch } from "react-icons/ci";

const CustomMdCatalog = ({ editorId, scrollElement, scrollChange }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.trim().toLowerCase());
  };

  const executeSearch = (event) => {
    event.preventDefault();
    const headers = document.querySelectorAll(
      ".md-editor-preview h1, .md-editor-preview h2, .md-editor-preview h3, .md-editor-preview h4, .md-editor-preview h5, .md-editor-preview h6"
    );
    const catalogItems = document.querySelectorAll(".md-editor-catalog-link");
    headers.forEach((header) => {
      header.style.backgroundColor = "";
      header.classList.remove("search-highlight");
    });
    catalogItems.forEach((item) => {
      item.classList.remove("catalog-highlight");
    });

    if (!searchQuery) return;
    const matchingHeaders = Array.from(headers).filter((header) =>
      header.textContent.toLowerCase().includes(searchQuery)
    );
    let firstMatchCatalogItem = null;

    if (matchingHeaders.length > 0) {
      matchingHeaders.forEach((header) => {
        header.classList.add("search-highlight");

        const matchingCatalogItem = Array.from(catalogItems).find(
          (item) =>
            item.querySelector("span").textContent.trim().toLowerCase() ===
            header.textContent.trim().toLowerCase()
        );

        if (matchingCatalogItem && !firstMatchCatalogItem) {
          firstMatchCatalogItem = matchingCatalogItem;
          matchingCatalogItem.classList.add("catalog-highlight");
        }
      });
      matchingHeaders[0].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      if (firstMatchCatalogItem) {
        firstMatchCatalogItem.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        scrollChange(firstMatchCatalogItem);
      }
    }
  };
  return (
    <div>
      <form
        className="flex items-center justify-center px-2 mb-2 mt-1 pr-1 bg-white rounded border-b"
        onSubmit={executeSearch}>
        <input
          className="outline-none "
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search..."
          style={{
            width: "100%",
            padding: "0.5rem",
          }}
        />
        <button type="submit" className="ml-2 rounded  px-4  text-gray">
          <CiSearch size={26} color="gray" />
        </button>
      </form>
      <MdCatalog editorId={editorId} scrollElement={scrollElement} />
    </div>
  );
};

CustomMdCatalog.propTypes = {
  editorId: PropTypes.string.isRequired,
  scrollElement: PropTypes.object,
  scrollChange: PropTypes.func,
};

export default CustomMdCatalog;
