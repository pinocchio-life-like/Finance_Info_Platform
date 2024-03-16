import { useEffect, useState } from "react";
import { MdEditor } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import "md-editor-rt/lib/preview.css";
import { useSelector } from "react-redux";
import { Button, Modal } from "antd";
import api from "../../utils/api";
import { Bars } from "react-loader-spinner";

const Editor = () => {
  const { userName } = useSelector((state) => state.user);

  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [originalText, setOriginalText] = useState("");
  useEffect(() => {
    const getMainArticle = async () => {
      setIsLoading(true);
      try {
        const res = await api.get("/api/article/main/1");
        const { data } = res.data;

        setText(data.articleContent);
        setOriginalText(data.articleContent);
      } finally {
        setIsLoading(false);
      }
    };
    getMainArticle();
  }, []);

  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const hideModal = () => {
    setOpen(false);
  };

  const saveArticleHandler = async () => {
    try {
      const response = await api.put(`/api/article/main/1`, {
        articleTitle: "Main",
        articleContent: text,
        userName: userName,
      });
      console.log("Edit: ", response.data);
    } catch (error) {
      console.error("An error occurred while saving the article: ", error);
    } finally {
      hideModal();
    }
  };
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const filteredText = originalText
      .split("\n")
      .filter((line) => line.toLowerCase().includes(e.target.value.toLowerCase()))
      .join("\n");
    setText(filteredText);
  };


  return (
    <>
    <label htmlFor="search">Search:</label>
      <input type="text" id="search" value={searchQuery} onChange={handleSearch} />
    <div
      style={{
        width: "100%",
        display: "flex",
      }}>
        
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
        <label htmlFor="search">search</label>
        <input type="text" />
          <MdEditor
            style={{
              height: "85vh",
            }}
            modelValue={text}
            onChange={setText}
            language="en-US"
            onSave={() => {
              showModal();
            }}
            showCodeRowNumber
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
    </>
  );
};

export default Editor;