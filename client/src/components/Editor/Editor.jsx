import { useEffect, useState } from "react";
import { MdEditor } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import "md-editor-rt/lib/preview.css";
import { useSelector } from "react-redux";
import { Button, Modal } from "antd";
import api from "../../../utils/api";
import { useNavigate, useParams } from "react-router-dom";
import { Bars } from "react-loader-spinner";
import store from "../../../redux/store";
import { addArticleState } from "../../../redux/slices/articleSlice";
const secretKey = import.meta.env.VITE_SECRET_KEY;
import { jwtDecode } from "jwt-decode";

const Editor = () => {
  const navigate = useNavigate();
  const { articleName, articleContent, category_Id, action } = useSelector(
    (state) => state.article
  );
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token, secretKey);
  const { userName } = decodedToken;
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState("");
  const param = useParams();

  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const hideModal = () => {
    setOpen(false);
  };

  useEffect(() => {
    const getMainArticle = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/api/article/${param.id}`);
        const { data } = res.data;

        setText(data.articleContent);
      } finally {
        setIsLoading(false);
      }
    };
    getMainArticle();
  }, [param.id]);

  useEffect(() => {
    setText(articleContent);
  }, [articleContent]);

  const saveArticleHandler = async () => {
    try {
      if (action === "add") {
        setIsLoading(true);
        const response = await api.post("/api/article", {
          articleTitle: articleName,
          articleContent: text,
          parent_Id: category_Id,
          userName: userName,
        });
        const categoryId = response.data.data.newCategory.category_Id;
        store.dispatch(
          addArticleState({
            articleName: articleName,
            category_Id: categoryId,
            action: "edit",
          })
        );
        navigate(`/wiki/edit/${categoryId}`);
        setIsLoading(false);
      }

      if (action === "edit") {
        setIsLoading(true);
        await api.put(`/api/article/${category_Id}`, {
          articleTitle: articleName,
          articleContent: text,
          category_Id: category_Id,
          userName: userName,
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error("An error occurred while saving the article: ", error);
    } finally {
      hideModal();
    }
  };

  const onUploadImg = async (files, callback) => {
    const res = await Promise.all(
      files.map((file) => {
        return new Promise((rev, rej) => {
          const form = new FormData();
          form.append("file", file);

          api
            .post("/api/img/upload", form, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((res) => rev(res))
            .catch((error) => rej(error));
        });
      })
    );
    callback(res.map((item) => item.data.urls[0]));
  };

  return (
    <div style={{ display: "flex", width: "100%" }}>
      {isLoading ? (
        <div
          style={{
            display: "flex",
            alignContent: "center",
            alignItems: "center",
            margin: "auto",
            height: "86vh",
          }}>
          <Bars
            height="100"
            width="100"
            color="#67C6E3"
            ariaLabel="bars-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      ) : (
        <>
          <MdEditor
            style={{
              height: "80vh",
            }}
            modelValue={text}
            onChange={setText}
            language="en-US"
            onSave={() => {
              showModal();
            }}
            showCodeRowNumber
            onUploadImg={onUploadImg}
          />
          <Modal
            title="Save Article:"
            open={open}
            onCancel={hideModal}
            footer={(_, { CancelBtn }) => (
              <>
                <CancelBtn />
                <Button
                  style={{ background: "#3B82f6", color: "white" }}
                  onClick={saveArticleHandler}>
                  Save
                </Button>
              </>
            )}>
            <p>Do you want to save this article?</p>
          </Modal>
        </>
      )}
    </div>
  );
};

export default Editor;