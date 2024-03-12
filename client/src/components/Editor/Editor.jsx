import React, { useEffect, useState } from "react";
import { MdEditor } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import "md-editor-rt/lib/preview.css";
import api from "../../utils/api";
import useAuth from "../../hooks/useAuth";

const Editor = () => {
  const [text, setText] = useState("");
  const [articleId, setArticleId] = useState();
  const [title, setTitle] = useState();
  const [updateFlag, setUpdateFlag] = useState(false);
  const [userId, setUserId] = useState();

  useEffect(() => {
    const fetchArticles = async () => {
      const user = useAuth.login();
      setUserId(user.userId); //it should be passed from the backend to the payload

      if(articleId){
        const response = await api.get(`/api/article${articleId}`);
      console.log(response);
      const fetchedArticles = response.data.data;
      if (fetchedArticles && fetchedArticles.length !== 0) {
        setUpdateFlag(!updateFlag);

        const markdownContent = fetchedArticles
          .map((art) => `# ${art.articleTitle}\n\n${art.articleContent}\n\n`)
          .join("");

        setText(markdownContent);
      } 
    }
      else {
     setText("# now you are in create mode");
      }
    }

    fetchArticles();
  }, [articleId]);

  const handleUserInput = () => {
    const userInput = window.prompt("Enter the title:");

    if (userInput !== null) {
      setTitle(userInput);
      alert(`You entered: ${userInput}`);
    }
  };

  const updateArticle = async () => {
    try {
      const response = await api.put(`/api/update${articleId}`, {
        title,
        text,
        userId,
      });
      alert("Article Update success");
    } catch (error) {
      console.error("Error updating article:", error.message);
    }
  };

  const createArticle = async () => {
    try {
      const response = await api.post("/api/article", { title, text, userId });
      alert("Article created success");
    } catch (error) {
      console.error("Error creating article:", error.message);
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
        onSave={async () => {
          if (updateFlag) {
            updateArticle();
          } else {
            handleUserInput();
            createArticle();
          }
        }}
        showCodeRowNumber
      />
    </div>
  );
};

export default Editor;
