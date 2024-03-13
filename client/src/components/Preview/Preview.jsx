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
      <MdPreview editorId={id} modelValue={text} />
    </>
  );
};

export default Preview;
