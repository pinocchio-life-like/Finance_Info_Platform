import { useEffect, useState } from "react";
import { MdEditor } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import "md-editor-rt/lib/preview.css";

const Editor = () => {
  const [text, setText] = useState(
    "# Hello Editor \n **This is a markdown editor**"
  );
  useEffect(() => {
    // console.log(text);
  }, []);

  return (
    <div>
      <MdEditor
        modelValue={text}
        onChange={setText}
        language="en-US"
        // onSave={(val) => {}}
        showCodeRowNumber
      />
    </div>
  );
};

export default Editor;
