import { useState, useEffect } from "react";

const Pagination = () => {
  const [activePage, setActivePage] = useState(1);
  const min = 1;
  const max = 16;
  const pageLimit = 7;

  const handlePrevNextClick = (type) => {
    if (type === "prev" && activePage > min) {
      setActivePage(activePage - 1);
    } else if (type === "next" && activePage < max) {
      setActivePage(activePage + 1);
    }
  };

  const getPaginationNumbers = () => {
    if (activePage < 10) {
      return [
        ...Array.from({ length: pageLimit - 2 }, (_, i) => i + 1),
        "...",
        max,
      ];
    } else {
      return [
        min,
        "...",
        ...Array.from(
          { length: pageLimit - 2 },
          (_, i) => max - pageLimit + i + 3
        ),
      ];
    }
  };

  useEffect(() => {
    if (activePage >= 10) {
      setActivePage(10);
    }
  }, [activePage]);

  return (
    <div className="bg-white flex justify-center items-center min-h-screen">
      <div id="mainContainer" className="flex gap-x-4">
        <button
          className="goPrev w-8 h-8 rounded-full"
          onClick={() => handlePrevNextClick("prev")}>
          <i className="fa-solid fa-angle-left w-4 h-4 inline-flex justify-center"></i>
        </button>
        <div className="pagination flex gap-x-2">
          {getPaginationNumbers().map((num, index) =>
            num === "..." ? (
              <span key={index}>...</span>
            ) : (
              <button
                key={num}
                className={`py-1 px-3 rounded-sm hover:bg-slate-200 min-w-[2.625rem] ${
                  num === activePage ? "bg-slate-100" : ""
                }`}
                onClick={() => setActivePage(num)}>
                {num}
              </button>
            )
          )}
        </div>
        <button
          className="goNext w-8 h-8 rounded-full"
          onClick={() => handlePrevNextClick("next")}>
          <i className="fa-solid fa-angle-right w-4 h-4 inline-flex justify-center"></i>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
