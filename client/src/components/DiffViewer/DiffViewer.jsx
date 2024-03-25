import { useState, useEffect } from "react";
import DiffViewer from "react-diff-viewer";
import { useParams } from "react-router-dom";
import api from "../../utils/api";
function Difference() {
  const [oldValue, setOldValue] = useState("");
  const [newValue, setNewValue] = useState("");
  const [title, setTitle] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const { id1, id2 } = useParams();
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
      <div className="container lg ">
        <div className="article-title">
          <h2 className="text-xl font-semibold">
            {`Article Title: ${title}`} 
          </h2>
          <span className="italic text-gray-300">{`Date Modified: ${formattedUpdatedAt}`}</span>
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
