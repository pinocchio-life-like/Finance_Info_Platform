import { useEffect, useState } from "react";
import { MdEditor } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import "md-editor-rt/lib/preview.css";
import { useSelector } from "react-redux";
import { Button, Modal } from "antd";
import api from "../../utils/api";

const Editor = () => {
  const { articleName, articleContent, category_Id, action } = useSelector(
    (state) => state.article
  );
  const { userName } = useSelector((state) => state.user);

  const [text, setText] = useState(articleContent ? articleContent : "");

  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const hideModal = () => {
    setOpen(false);
  };

  useEffect(() => {
    // console.log(text);
  }, []);

  const saveArticleHandler = async () => {
    try {
      if (action === "add") {
        const response = await api.post("/api/article", {
          articleTitle: articleName,
          articleContent: text,
          parent_Id: category_Id,
          userName: userName,
        });
        console.log("Add: ", response.data);
      }

      if (action === "edit") {
        console.log("Edit: ", articleName, text, category_Id);
      }
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
