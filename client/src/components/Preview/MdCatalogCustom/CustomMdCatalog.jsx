import React, { useState, useEffect } from "react";
import { MdCatalog } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import "md-editor-rt/lib/preview.css";
import { CiSearch } from "react-icons/ci";

const CustomMdCatalog = ({ editorId, scrollElement }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.trim().toLowerCase());
  };
  // useEffect(() => {
  //   const highlightMatches = () => {
  //     const headers = document.querySelectorAll(
  //       ".md-editor-preview h1, .md-editor-preview h2, .md-editor-preview h3, .md-editor-preview h4, .md-editor-preview h5, .md-editor-preview h6"
  //     );

  //     headers.forEach((header) => {
  //       header.style.backgroundColor = "";
  //       header.classList.remove("search-highlight");
  //     });

  //     if (!searchQuery) return;

  //     const matchingHeaders = Array.from(headers).filter((header) =>
  //       header.textContent.toLowerCase().includes(searchQuery)
  //     );

  //     if (matchingHeaders.length > 0) {
  //       // Highlight matching headers
  //       matchingHeaders.forEach((header) => {
  //         header.style.backgroundColor = " #b2f1dc";
  //         header.classList.add("search-highlight");
  //       });

  //       // Scroll the first matching header into view
  //       matchingHeaders[0].scrollIntoView({
  //         behavior: "smooth",
  //         block: "center",
  //       });
  //     }
  //   };

  //   highlightMatches();
  // }, [searchQuery]);
  const executeSearch = () => {
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
      }
    }
  };
  return (
    <div style={{ position: "relative" }}>
      <div className="flex items-center justify-center px-4 mb-2 mt-4 pr-5 bg-white rounded border-b">
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
        <button
          onClick={executeSearch}
          className="ml-2 rounded  px-4  text-gray"
        >
          <CiSearch size={26} color="gray" />
        </button>
      </div>
      <MdCatalog
        editorId={editorId}
        scrollElement={scrollElement}
        style={{
          height: "100vh",
          overflow: "auto",
          position: "sticky",
          top: 0,
        }}
      />
    </div>
  );
};

export default CustomMdCatalog;
