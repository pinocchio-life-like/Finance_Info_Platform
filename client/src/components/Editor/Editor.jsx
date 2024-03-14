import React, { useEffect, useState } from "react";
import { MdEditor } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import "md-editor-rt/lib/preview.css";
import useAuth from "../../hooks/useAuth";
import { useSelector } from "react-redux";


import { Button, Modal } from "antd";
import api from "../../utils/api";
import { Bars } from "react-loader-spinner";

const Editor = () => {
  const { userName } = useSelector((state) => state.user);

  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getMainArticle = async () => {
      setIsLoading(true);
      try {
        const res = await api.get("/api/article/main/1");
        const { data } = res.data;

        setText(data.articleContent);
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
