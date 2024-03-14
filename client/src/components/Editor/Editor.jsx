import { useEffect, useState } from "react";
import { MdEditor } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import "md-editor-rt/lib/preview.css";
import { useSelector } from "react-redux";
import { Button, Modal } from "antd";
import api from "../../utils/api";

const Editor = () => {
  const { userName } = useSelector((state) => state.user);

  const [text, setText] = useState("");
  useEffect(() => {
    const getMainArticle = async () => {
      const res = await api.get("/api/article/main/1");
      const { data } = res.data;

      setText(data.articleContent);
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

  return (
    <div>
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
    </div>
  );
};

export default Editor;
