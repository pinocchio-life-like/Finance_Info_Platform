import React, { useEffect, useState } from "react";
import { Button, Table } from "antd";
import api from "../../utils/api";
import { useParams } from "react-router-dom";

const History = () => {
  const articleId = useParams()
  const [versions, setVersions] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchArticleVersions = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/api/versions/${articleId}");
        console.log(response.data);
        const formattedData = Array.isArray(response.data)
          ? response.data.map((version, index) => ({
              key: index,
              name: version.articleVersionTitle,
              author: version.userName,
              dateModified: version.updatedAt,
            }))
          : [];
        setVersions(formattedData);
      } catch (error) {
        console.error("Failed to fetch article versions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticleVersions();
  }, [articleId]);

  const columns = [
    {
      title: "Article Title",
      dataIndex: "articleVersionTitle",
    },
    {
      title: "Date Created",
      dataIndex: "userId",
    },
    {
      title: "Date Modified",
      dataIndex: "updatedAt",
      render: (date) => (date ? new Date(date).toLocaleDateString() : ""),
    },
  ];

  const start = () => {
    setLoading(true);
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };
  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  return (
    <div className="mt-10">
      <div
        style={{
          marginBottom: 16,
        }}
      >
        <Button
          type="primary"
          onClick={start}
          disabled={!hasSelected}
          loading={loading}
        >
          Compare Selected Versions
        </Button>
        <span
          style={{
            marginLeft: 8,
          }}
        >
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
        </span>
      </div>
      <Table
        loading={isLoading}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={versions}
      />
    </div>
  );
};

export default History;
