import { useEffect, useState } from "react";
import { MdCatalog, MdPreview } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import "md-editor-rt/lib/preview.css";
import { useSelector } from "react-redux";
const editorId = "my-editor";

const Preview = () => {
  const articleContent = useSelector((state) => state.article.articleContent);
  const [text, setText] = useState(articleContent ? articleContent : "");
  useEffect(() => {
    setText(articleContent);
  }, [articleContent]);

  const [id] = useState("preview-only");

  const [state] = useState({
    text: "# heading",
    scrollElement: document.documentElement,
  });

  return (
    <>
      <div style={{ display: "flex", width: "100%" }}>
        <MdPreview
          style={{
            borderLeft: "1px solid #EEEEEE",
            borderRight: "1px solid #EEEEEE",
            overflowY: "hidden",
            // boxShadow:
            //   "1px 0px 5px rgba(0, 0, 0, 0.1), -1px 0px 5px rgba(0, 0, 0, 0.1)",
          }}
          editorId={id}
          modelValue={text}
        />
        <MdCatalog
          scrollElementOffsetTop={false}
          editorId={id}
          scrollElement={state.scrollElement}
          style={{
            width: "20%",
            borderLeft: "1px solid #EEEEEE",
            borderRight: "1px solid #EEEEEE",
          }}
        />
      </div>
    </>
  );
};

export default Preview;
