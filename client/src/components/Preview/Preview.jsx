import { useEffect, useState } from "react";
import { MdPreview } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import "md-editor-rt/lib/preview.css";
import { useSelector } from "react-redux";

const Preview = () => {
  const articleContent = useSelector((state) => state.article.articleContent);
  const [text, setText] = useState(articleContent ? articleContent : "");
  useEffect(() => {
    setText(articleContent);
  }, [articleContent]);

  const [id] = useState("preview-only");

  return (
    <>
      <MdPreview editorId={id} modelValue={text} />
    </>
  );
};

export default Preview;
