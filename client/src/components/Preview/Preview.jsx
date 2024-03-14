import { useEffect, useState } from "react";
import { MdPreview, MdCatalog } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import "md-editor-rt/lib/preview.css";
import api from "../../utils/api";

const Preview = () => {
  const [state, setState] = useState({
    text: "",
    scrollElement: document.documentElement,
  });
  useEffect(() => {
    const getMainArticle = async () => {
      const res = await api.get("/api/article/main/1");
      const { data } = res.data;

      setState({
        text: data.articleContent,
        scrollElement: document.documentElement,
      });
    };
    getMainArticle();
  }, []);

  const [id] = useState("preview-only");

  return (
    <>
      <div style={{ display: "flex", width: "100%" }}>
        <MdPreview
          style={{
            borderLeft: "1px solid #EEEEEE",
            borderRight: "1px solid #EEEEEE",
          }}
          editorId={id}
          modelValue={state.text}
        />
        <MdCatalog
          editorId={id}
          scrollElement={state.scrollElement}
          style={{
            width: "20%",
            borderRight: "1px solid #EEEEEE",
            fontSize: "0.9rem",
            paddingTop: "0.6rem",
            height: "100vh",
            overflow: "auto",
            position: "sticky",
            top: 0,
          }}
        />
      </div>
    </>
  );
};

export default Preview;
