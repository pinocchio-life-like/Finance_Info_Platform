import { useEffect, useRef, useState } from "react";
import { MdEditor, NormalToolbar } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import "md-editor-rt/lib/preview.css";
import { useSelector } from "react-redux";
import { Button, Popconfirm, message } from "antd";
import api from "../../../utils/api";
import { useNavigate, useParams } from "react-router-dom";
import { Bars } from "react-loader-spinner";
import store from "../../../redux/store";
import { addArticleState } from "../../../redux/slices/articleSlice";
import { jwtDecode } from "jwt-decode";
import { UploadOutlined } from "@ant-design/icons";

const Editor = () => {
  const editorRef = useRef();
  const fileInputRef = useRef();
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const { articleName, articleContent, category_Id, action } = useSelector(
    (state) => state.article
  );
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
  const [isLoading, setIsLoading] = useState(false);
  const [isPreview, setIsPreview] = useState(true);
  const [text, setText] = useState("");
  const param = useParams();

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
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsPreview(false);
      } else {
        setIsPreview(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    }
  };

  const onUploadImg = async (files, callback) => {
    const res = await Promise.all(
      files.map((file) => {
        return new Promise((rev, rej) => {
          const form = new FormData();
          form.append("file", file);

          api
            .post("/api/article/img/upload", form, {
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

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const form = new FormData();
    form.append("file", file);
    form.append("category_Id", param.id);
    form.append("user", userName);
    setUploading(true);
    try {
      const response = await api.post("/api/article/file/upload", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      message.success(`file uploaded successfully`);

      editorRef.current.insert((selectedText) => {
        return {
          targetValue: `${selectedText}[${file.name}](${response.data.url})`,
          select: true,
          deviationStart: 0,
          deviationEnd: 0,
        };
      });
    } catch (error) {
      message.error(`file upload failed.`);
      console.error(error);
    } finally {
      setUploading(false);
      event.target.value = null;
    }
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
            preview={isPreview}
            ref={editorRef}
            toolbars={[
              "bold",
              "underline",
              "italic",
              "-",
              "strikeThrough",
              "sub",
              "sup",
              "quote",
              "unorderedList",
              "orderedList",
              "task",
              "-",
              "codeRow",
              "code",
              "link",
              "-",
              "image",
              1,
              "-",
              "table",
              "mermaid",
              "katex",
              "-",
              "revoke",
              "next",
              "-",
              0,
              "=",
              "pageFullscreen",
              "preview",
              "catalog",
            ]}
            style={{
              height: "80vh",
            }}
            modelValue={text}
            onChange={setText}
            language="en-US"
            onUploadImg={onUploadImg}
            defToolbars={[
              // eslint-disable-next-line react/jsx-key
              <NormalToolbar
                title="post"
                trigger={
                  <Popconfirm
                    title="Do you want to post this Article?"
                    onConfirm={saveArticleHandler}
                    okText="Yes"
                    cancelText="No"
                    okButtonProps={{
                      style: { backgroundColor: "#155CA2", color: "white" },
                    }}>
                    <span className="px-2 flex items-center justify-center text-center bg-[#155CA2] text-white rounded hover:bg-[#214355]">
                      Post
                    </span>
                  </Popconfirm>
                }
              />,
              // eslint-disable-next-line react/jsx-key
              <NormalToolbar
                title="upload"
                trigger={
                  <div className="flex">
                    <Button
                      disabled={uploading}
                      icon={<UploadOutlined />}
                      className="border-none mt-[0.5px]"
                      onClick={handleButtonClick}
                      loading={uploading}></Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                    />
                  </div>
                }
              />,
            ]}
          />
        </>
      )}
    </div>
  );
};

export default Editor;
