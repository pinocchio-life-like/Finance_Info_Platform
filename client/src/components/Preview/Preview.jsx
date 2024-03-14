import { useEffect, useState } from "react";
import { MdPreview, MdCatalog } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import "md-editor-rt/lib/preview.css";
import api from "../../utils/api";
import { Bars } from "react-loader-spinner";

const Preview = () => {
  const [state, setState] = useState({
    text: "",
    scrollElement: document.documentElement,
  });
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const getMainArticle = async () => {
      setIsLoading(true);
      try {
        const res = await api.get("/api/article/main/1");
        const { data } = res.data;

        setState({
          text: data.articleContent,
          scrollElement: document.documentElement,
        });
      } finally {
        setIsLoading(false);
      }
    };
    getMainArticle();
  }, []);

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
      <div style={{ display: "flex", width: "100%" }}>
        {isLoading ? (
          <div
            style={{
              display: "flex",
              alignContent: "center",
              alignItems: "center",
              margin: "auto",
              height: "86vh",
            }}>
            <Bars
              height="100"
              width="100"
              color="#67C6E3"
              ariaLabel="bars-loading"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </>
  );
};

export default Preview;
