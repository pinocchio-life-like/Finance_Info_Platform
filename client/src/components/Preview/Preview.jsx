import { useState } from "react";
import { MdPreview, MdCatalog } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import "md-editor-rt/lib/preview.css";

const scrollElement = document.documentElement;
const Preview = () => {
  const [text] = useState(
    "## 😲 md-editor Markdown Editor for React, developed in jsx and typescript, support different themes、beautify content by prettier."
  );
  const [id] = useState("preview-only");

  return (
    <>
      <MdPreview editorId={id} modelValue={text} />
      <MdCatalog editorId={id} scrollElement={scrollElement} />
    </>
  );
};

export default Preview;
