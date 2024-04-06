import { Pagination } from "antd";

const Tags = () => {
  return (
    <div className="w-full">
      <div className="flex justify-between w-full p-4 pt-8 pb-3">
        <h1 className="font-bold text-2xl">
          Unanswered Questions <span>|</span>{" "}
          <span className="font-light text-xl">648 questions</span>
        </h1>
        <button className="bg-[#008DDA] py-[1.5px] px-2 text-white rounded font-semibold">
          Ask Question
        </button>
      </div>
      <div className="w-full p-4 pt-3">
        <div className="border-t pt-3">
          <h2 className="font-bold text-lg">A question title...</h2>
          <p className="text-gray-700 truncate">
            A question description
            <button className="text-[#008DDA]">...see more</button>
          </p>
          <div className="pt-4 flex justify-between items-center">
            <div>
              <span className="inline-block bg-white rounded border border-[#008DDA] px-2 py-[0.2px] text-sm text-[#008DDA] mr-2 font-semibold">
                0 answers
              </span>
              <span className="inline-block bg-gray-200 rounded px-3 py-[0.2px] text-sm font-semibold text-gray-700 mr-2">
                Tag1
              </span>
              <span className="inline-block bg-gray-200 rounded  py-[0.2px] px-3 text-sm font-semibold text-gray-700 mr-2">
                Tag2
              </span>
              <span className="inline-block bg-gray-200 rounded  py-[0.2px] px-3 text-sm font-semibold text-gray-700">
                Tag3
              </span>
            </div>
            <div>
              <span className="mr-2">
                Name<span className="font-semibold"> | </span>
                Date
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full p-4">
        <div className="border-t pt-3">
          <h2 className="font-bold text-lg">A question title...</h2>
          <p className="text-gray-700 truncate">
            A question description
            <button className="text-[#008DDA]">...see more</button>
          </p>
          <div className="pt-4 flex justify-between items-center">
            <div>
              <span className="inline-block bg-white rounded border border-[#008DDA] px-2 py-[0.2px] text-sm text-[#008DDA] mr-2 font-semibold">
                0 answers
              </span>
              <span className="inline-block bg-gray-200 rounded px-3 py-[0.2px] text-sm font-semibold text-gray-700 mr-2">
                Tag1
              </span>
              <span className="inline-block bg-gray-200 rounded  py-[0.2px] px-3 text-sm font-semibold text-gray-700 mr-2">
                Tag2
              </span>
              <span className="inline-block bg-gray-200 rounded  py-[0.2px] px-3 text-sm font-semibold text-gray-700">
                Tag3
              </span>
            </div>
            <div>
              <span className="mr-2">
                Name<span className="font-semibold"> | </span>
                Date
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="relative flex justify-center items-end h-full pt-5">
        <Pagination
          total={50}
          itemRender={(_, type, originalElement) => {
            if (type === "prev") {
              return <a>Prev</a>;
            }
            if (type === "next") {
              return <a>Next</a>;
            }
            return originalElement;
          }}
        />
      </div>
    </div>
  );
};

export default Tags;
