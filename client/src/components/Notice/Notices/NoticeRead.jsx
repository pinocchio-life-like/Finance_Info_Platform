import { Button } from "antd";
import { Link, useParams } from "react-router-dom";
import { RollbackOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
import ReactQuill from "react-quill";

const NoticeRead = () => {
  const { id } = useParams();
  const [notice, setNotice] = useState({});
  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const response = await api.get(`/api/notice/${id}`);
        setNotice(response.data.data);
      } catch (error) {
        console.error("Failed to fetch notice:", error);
      }
    };
    fetchNotice();
  }, [id]);

  return (
    <div className=" main-diff flex w-full justify-center lg:mt-6 mt-3">
      <div className="w-full lg:mx-14 mx-1 mb-8">
        <div className="border-b border-gray-200 flex justify-between">
          <div>
            <h2 className="text-xl font-semibold">{`${notice.noticeTitle}`}</h2>
            <div className="flex justify-between">
              <span className="italic text-gray-500">{`Date Posted: ${new Date(
                notice.createdAt
              ).toLocaleDateString()}`}</span>
              <span className="italic text-gray-500">{`By: ${notice.userName}`}</span>
            </div>
          </div>
          <div className="button">
            {" "}
            <Link to={`/notice`}>
              <Button className="" icon={<RollbackOutlined />}>
                Back
              </Button>
            </Link>
          </div>
        </div>
        <div className="diff-viewer-container">
          <ReactQuill
            readOnly
            value={notice.noticeDescription}
            theme="bubble"
            className="mt-auto bg-white"
            style={{
              marginLeft: -14,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default NoticeRead;
