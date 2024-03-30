import { useState, useEffect } from "react";
import DiffViewer from "react-diff-viewer-continued";
import { Link, useParams } from "react-router-dom";
import api from "../../utils/api";
import { RollbackOutlined } from "@ant-design/icons";
import { Button } from "antd";
function Difference() {
  const [oldValue, setOldValue] = useState("");
  const [newValue, setNewValue] = useState("");
  const [title, setTitle] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  // const { id1, id2 } = useParams();
  const { category_Id, id1, id2 } = useParams();
  useEffect(() => {
    Promise.all([
      api.get(`/api/articleversion/${id1}`).then((response) => ({
        content: response.data.articleVersionContent,
        id: response.data.articleVersionId,
        title: response.data.articleVersionTitle,
        updatedAt: response.data.updatedAt,
      })),
      api.get(`/api/articleversion/${id2}`).then((response) => ({
        content: response.data.articleVersionContent,
        id: response.data.articleVersionId,
        updatedAt: response.data.updatedAt,
        title: response.data.articleVersionTitle,
      })),
    ])
      .then(([oldArticle, newArticle]) => {
        const newerArticle =
          oldArticle.id > newArticle.id ? oldArticle : newArticle;
        setTitle(newerArticle.title);
        setUpdatedAt(newerArticle.updatedAt);
        if (oldArticle.id < newArticle.id) {
          setOldValue(oldArticle.content);
          setNewValue(newArticle.content);
        } else {
          setOldValue(newArticle.content);
          setNewValue(oldArticle.content);
        }
      })
      .catch((error) =>
        console.error("Failed to fetch version contents:", error)
      );
  }, [id1, id2]);
  const formattedUpdatedAt = updatedAt
    ? new Date(updatedAt).toLocaleDateString()
    : "";
  return (
    <div className=" main-diff flex  justify-center m-10">
      <div className="container  w-4/5">
        <div className="article-title border-b border-gray-200 flex justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              {`Article Title: ${title}`}
            </h2>
            <span className="italic text-gray-300 pb-4">{`Date Modified: ${formattedUpdatedAt}`}</span>
          </div>
          <div className="button">
            {" "}
            <Link to={`/wiki/history/${category_Id}`}>
              <Button className="" icon={<RollbackOutlined />}>
                Back
              </Button>
            </Link>
          </div>
        </div>
        <div className="diff-viewer-container mt-8">
          <DiffViewer
            oldValue={oldValue}
            newValue={newValue}
            splitView={true}
          />
        </div>
      </div>
    </div>
  );
}

export default Difference;
