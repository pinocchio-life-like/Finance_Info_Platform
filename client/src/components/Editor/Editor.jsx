import React, { useEffect, useState } from "react";
import { MdEditor } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import "md-editor-rt/lib/preview.css";
import useAuth from "../../hooks/useAuth";
import { useSelector } from "react-redux";



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
          // console.log("Save");
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
