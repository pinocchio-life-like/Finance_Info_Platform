import { useEffect, useState } from "react";
import { MdPreview, MdCatalog } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import "md-editor-rt/lib/preview.css";
import { useSelector } from "react-redux";

const Preview = () => {
  const articleContent = useSelector((state) => state.article.articleContent);
  const [state, setState] = useState({
    text: articleContent ? articleContent : "",
    scrollElement: document.documentElement,
  });
  useEffect(() => {
    setState({
      text: articleContent,
      scrollElement: document.documentElement,
    });
  }, [articleContent]);

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
