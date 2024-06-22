import React, { useEffect, useState } from "react";
import { Timeline, Pagination } from "antd";
import api from "../../../utils/api";
import DOMPurify from 'dompurify';

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6); // Number of notices per page

  useEffect(() => {
    const getNotices = async () => {
      try {
        const res = await api.get('/api/notice');
        setNotices(res.data.data);
      } catch (error) {
        console.error("Error fetching notices:", error);
      }
    };
    getNotices();
  }, []);

  const stripHtml = (html) => {
    const cleanHtml = DOMPurify.sanitize(html);
    return cleanHtml.replace(/<[^>]*>/g, '');
  };

  const getRandomColor = () => {
    const colors = ["green", "red", "blue", "purple", "orange", "gray"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const items = notices.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  ).map((notice, index) => ({
    color: getRandomColor(),
    children: (
      <div key={index}>
        <h2 className="font-bold">Title: {notice.noticeTitle}</h2>
        <p className="whitespace-pre-wrap">Description: {stripHtml(notice.noticeDescription)}</p>
        <p>Date: {new Date(notice.createdAt).toLocaleDateString()}</p>
      </div>
    ),
  }));

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  return (
    <div className="flex flex-col m-5 pl-5 h-screen">
      <h1 className="flex justify-center items-center mb-5 font-roboto text-3xl">NoticeBoard</h1>
      <Timeline className="ml-9 pl-12">
        {items.map((item, index) => (
          <Timeline.Item key={index} color={item.color} dot={item.dot}>
            {item.children}
          </Timeline.Item>
        ))}
      </Timeline>
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={notices.length}
        onChange={handlePageChange}
        style={{ textAlign: "center", marginTop: "20px" }}
      />
    </div>
  );
};

export default NoticeBoard;
