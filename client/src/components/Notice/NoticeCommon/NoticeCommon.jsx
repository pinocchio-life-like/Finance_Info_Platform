import "./NoticeCommon.css";
import Tasks from "../Tasks/Tasks";
import Notices from "../Notices/Notices";
const NoticeCommon = () => {
  return (
    <div>
      <div className="flex-grow flex flex-col items-center lg:mx-14 mx-1 bg-white">
        <div className="flex justify-between items-center w-full pb-1 pt-3">
          <div className="w-3/4 border-b border-gray-600 mr-2">
            <a
              className={`lg:p-2 px-1 py-2 cursor-pointer`}
              style={{ lineHeight: "2rem" }}>
              Notices
            </a>
          </div>
          <div className="w-1/4 border-b border-gray-600 ml-2">
            <a
              className={`lg:p-2 px-1 py-2 cursor-pointer`}
              style={{ lineHeight: "2rem" }}>
              Tasks
            </a>
          </div>
        </div>
        <div className="timeline_container w-full flex justify-between">
          <div className="w-3/4 mr-2">
            <Notices />
          </div>
          <div className="w-1/4 ml-2 mt-[13.5px]">
            <Tasks />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeCommon;
