import { Button, Popconfirm, Popover, Timeline } from "antd";
import { useState } from "react";
import ReactQuill from "react-quill";
import { Link } from "react-router-dom";
import { FaEllipsisV } from "react-icons/fa";
import api from "../../../utils/api";

const Notices = ({ notices, setRefetch, setData, setStatus, userName }) => {
  const [isFull, setIsFull] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  const toggleDescription = (index) => {
    setIsFull((prev) => {
      const newIsFull = [...prev];
      newIsFull[index] = !newIsFull[index];
      return newIsFull;
    });
  };

  const deleteNotice = async (id) => {
    try {
      const response = await api.delete(`/api/notice/${id}`);
      if (response.status === 200) {
        setRefetch((prev) => !prev);
      } else {
        console.error("Delete failed", response.status, response.data);
      }
    } catch (error) {
      console.error("Error deleting notice", error);
    }
  };

  return (
    <Timeline
      className="w-full mt-5"
      mode="left"
      items={notices.map((notice, i) => {
        let matches = notice.noticeDescription.match(/<[^>]*>[^<]*<\/[^>]*>/g);
        let description = matches ? matches.slice(0, 4).join("") : "";
        return {
          color: "black", // Assuming all items are red, adjust as needed
          children: (
            <div
              onMouseOver={() => setIsHovered(true)}
              onMouseOut={() => setIsHovered(false)}
              key={notice.noticeId}
              className={`w-full border-gray-400 font ${
                isHovered ? "group" : ""
              }`}
              style={{
                position: "relative",
                background: "",
              }}>
              <div className="w-full flex-row">
                <div className="w-full font-bold text-lg text-[#008DDA] flex border-b pb-1 border-gray-400 justify-between">
                  <Link to={`/notice/${notice.noticeId}`}>
                    {notice.noticeTitle}
                  </Link>
                  {userName === notice.userName && (
                    <Popover
                      className="opacity-0 group-hover:opacity-100"
                      position="bottom"
                      content={
                        <div className="flex flex-col gap-1">
                          <Button
                            onClick={() => {
                              setData(notice);
                              setStatus("edit");
                            }}>
                            Edit
                          </Button>
                          <Popconfirm
                            title="Delete Task"
                            description="Do you want to delete task?"
                            onConfirm={() => {
                              deleteNotice(notice.noticeId);
                            }}
                            okText="Yes"
                            cancelText="No"
                            okButtonProps={{
                              style: {
                                backgroundColor: "#155CA2",
                                color: "white",
                              },
                            }}>
                            <Button>Delete</Button>
                          </Popconfirm>
                        </div>
                      }>
                      <FaEllipsisV className="cursor-pointer" />
                    </Popover>
                  )}
                </div>
                <div className="w-full">
                  <ReactQuill
                    readOnly
                    value={isFull[i] ? notice.noticeDescription : description}
                    theme="bubble"
                    className="mt-auto bg-white"
                    style={{
                      marginLeft: -14,
                    }}
                  />
                </div>
                <button
                  className="text-[#008DDA]"
                  style={{ position: "absolute", bottom: 30, left: 0 }}
                  onClick={() => {
                    toggleDescription(i);
                  }}>
                  {isFull[i] ? "see less" : "...see more"}
                </button>
                <div className="flex flex-row justify-between">
                  <button
                    className="text-[#008DDA]"
                    style={{ position: "absolute", bottom: 0, left: 0 }}>
                    Posted by: {notice.userName}
                  </button>
                  <button
                    className="text-[#008DDA]"
                    style={{ position: "absolute", bottom: 0, right: 10 }}>
                    Date posted: {new Date(notice.createdAt).toLocaleString()}
                  </button>
                </div>
              </div>
            </div>
          ),
        };
      })}
    />
  );
};

export default Notices;
