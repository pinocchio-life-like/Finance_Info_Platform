import { useEffect, useState } from "react";
import { MdPreview, MdCatalog } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import "md-editor-rt/lib/preview.css";
import api from "../../utils/api";

const scrollElement = document.documentElement;
const Preview = () => {
  const [text] = useState(
    "## 😲 md-editor Markdown Editor for React, developed in jsx and typescript, support different themes、beautify content by prettier."
  );
  const [id] = useState("preview-only");
  const[articles,setAricle]=useState()
  console.log(articles)
  useEffect(()=>{

  const fetchArticle=async()=>{
    try{
      const art=await api.get('/api/articles')
      setAricle(art.data.data)
    }
    catch(error){
      console.log(error)
      
    }
  };
  fetchArticle()

  },[])
  // if (props.status === 'editor') {
  //   const markdownContent = articles.map((art) => (
  //     `# ${art.articleTitle}\n\n${art.articleContent}\n\n`
  //   )).join('');

  //   return markdownContent;
  // }

  return (
    <>
    
      <MdPreview
  editorId={id}
  modelValue={text}
/>
      <MdCatalog editorId={id} scrollElement={scrollElement} />
    </>
  );
};

export default Preview;
