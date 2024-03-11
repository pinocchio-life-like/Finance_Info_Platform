import { useEffect, useState } from "react";
import { MdEditor } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import "md-editor-rt/lib/preview.css";
import api from "../../utils/api";
// import Preview from "../Preview/Preview";

const Editor = (props) => {
  const [text, setText] = useState(
    "# Hello Editor \n **This is a markdown editor**"
   
  );
  const[article,setArtcile]=useState()
  console.log(article)
  useEffect(()=>{

    const fetchArticle=async()=>{
      try{
        const art=await api.get('/api/articles')
        console.log(art)
        setArtcile(art.data.data)
        
      }
      catch(error){
        console.log(error)
        
      }
    };
  
     fetchArticle()
    
  
    },[])
    const generateMarkdomnText=()=>{
      const markdownContent = article?.map((art) => (
        `# ${art.articleTitle}\n\n${art.articleContent}\n\n`
      )).join('');
  
      return markdownContent;

    }
    const generatedMarkdown = generateMarkdomnText()
    // setText(generatedMarkdown)
    // setText("#dgfhbfbgg ")

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
    </div>
  );
};

export default Editor;
