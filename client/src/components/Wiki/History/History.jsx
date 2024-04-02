import { useEffect, useState } from "react";
import { Button, Table } from "antd";
import api from "../../../utils/api";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const History = () => {
  const param = useParams();
  const navigate = useNavigate();
  const [versions, setVersions] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectionError, setSelectionError] = useState("");
  useEffect(() => {
    const fetchArticleVersions = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/api/versions/${param.id}`);
        const formattedData = Array.isArray(response.data.data)
          ? response.data.data.map((version) => ({
              key: version.articleVersionId,
              articleVersionTitle: version.articleVersionTitle,
              createdAt: version.createdAt,
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
  }, [param.id]);

  const columns = [
    {
      title: "Article Title",
      dataIndex: "articleVersionTitle",
    },
    {
      title: "Date Created",
      dataIndex: "createdAt",
      render: (date) => (date ? new Date(date).toLocaleDateString() : ""),
    },
    {
      title: "Date Modified",
      dataIndex: "dateModified",
      render: (date) => (date ? new Date(date).toLocaleDateString() : ""),
    },
  ];

  // const start = () => {
  //   setLoading(true);
  //   setTimeout(() => {
  //     setSelectedRowKeys([]);
  //     setLoading(false);
  //   }, 1000);
  // };
  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    if (newSelectedRowKeys.length > 2) {
      newSelectedRowKeys = newSelectedRowKeys.slice(0, 2);
    }
    setSelectedRowKeys(newSelectedRowKeys);
    if (newSelectedRowKeys.length === 2) {
      setSelectionError("");
    } else {
      const remainingSelections = 2 - newSelectedRowKeys.length;
      setSelectionError(
        `Selected ${newSelectedRowKeys.length} item, ${remainingSelections} selection left.`
      );
    }
  };
  const compareSelectedVersions = () => {
    if (selectedRowKeys.length === 2) {
      navigate(
        `/wiki/diffviewer/${param.id}/${selectedRowKeys[0]}/${selectedRowKeys[1]}`
      );
    } else {
      alert("Please select exactly two versions to compare.");
    }
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record) => ({
      disabled:
        selectedRowKeys.length === 2 && !selectedRowKeys.includes(record.key),
    }),
  };
  const hasSelected = selectedRowKeys.length > 0;

  return (
    <div className="mt-4">
      <div className="mb-4">
        <Button
          //type="primary"
          onClick={compareSelectedVersions}
          disabled={selectedRowKeys.length !== 2}
          // loading={loading}
        >
          Compare Versions
        </Button>
        <span className="ml-4">{hasSelected ? selectionError : ""}</span>
      </div>
      <Table
        size="small"
        loading={isLoading}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={versions}
      />
    </div>
  );
};

export default History;
