import { Timeline } from "antd";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
import { jwtDecode } from "jwt-decode";
import ReactQuill from "react-quill";
import { Link } from "react-router-dom";

const Notices = () => {
  const token = localStorage.getItem("token");
  const [notices, setNotices] = useState([]);
  const [isFull, setIsFull] = useState([]);

  let userName = null;
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userName = decodedToken.userName;
    } catch (error) {
      console.error("Invalid token");
    }
  }

  const toggleDescription = (index) => {
    setIsFull((prev) => {
      const newIsFull = [...prev];
      newIsFull[index] = !newIsFull[index];
      return newIsFull;
    });
  };

  useEffect(() => {
    const getNotice = async () => {
      const response = await api.get(`/api/notices/${userName}`);
      setNotices(response.data.data);
    };
    getNotice();
  }, []);

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
              key={notice.noticeId}
              className="w-full border-gray-400 font"
              style={{
                position: "relative",
                background: "",
              }}>
              <div className="w-full flex-row">
                <div className="w-full font-bold text-lg text-[#008DDA] flex border-b pb-1 border-gray-400">
                  <Link to={`/notice/${notice.noticeId}`}>
                    {notice.noticeTitle}
                  </Link>
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
