import { useState, useEffect } from "react";
import DiffViewer from "react-diff-viewer-continued";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../../../utils/api";
import { RollbackOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import { jwtDecode } from "jwt-decode";

function Difference() {
  const token = localStorage.getItem("token");
  let userName = null;
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userName = decodedToken.userName;
    } catch (error) {
      console.error("Invalid token");
    }
  }
  const [oldValue, setOldValue] = useState("");
  const [newValue, setNewValue] = useState("");
  const [title, setTitle] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [isMobile, setIsMobile] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(false);
      } else {
        setIsMobile(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const success = () => {
    messageApi.open({
      type: "success",
      content: "Article Restored to previous version successfully",
    });
  };

  const handleRestore = async () => {
    try {
      await api.put(`/api/article/${category_Id}`, {
        articleTitle: title,
        articleContent: oldValue,
        userName: userName,
      });

      success();
      navigate(`/wiki/articles/${category_Id}`);
    } catch (error) {
      console.error("Failed to restore article:", error);
    }
  };
  return (
    <div className=" main-diff flex w-full justify-center lg:mt-6 mt-3">
      {contextHolder}
      <div className="w-full lg:mx-14 mx-1 mb-8">
        <div className="border-b border-gray-200 flex justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              {`Article Title: ${title}`}
            </h2>
            <span className="italic text-gray-300 pb-4">{`Date Modified: ${formattedUpdatedAt}`}</span>
          </div>
          <div className="flex justify-between gap-1">
            <div className="button">
              {" "}
              <Link to={`/wiki/history/${category_Id}`}>
                <Button className="" icon={<RollbackOutlined />}>
                  Back
                </Button>
              </Link>
            </div>
            <Button onClick={handleRestore} className="">
              Restore Version
            </Button>
          </div>
        </div>
        <div className="diff-viewer-container">
          <DiffViewer
            oldValue={oldValue}
            newValue={newValue}
            splitView={isMobile}
          />
        </div>
      </div>
    </div>
  );
}

export default Difference;
