import { useEffect, useState } from "react";
import { MdPreview, MdCatalog } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import "md-editor-rt/lib/preview.css";
import api from "../../utils/api";
import { Bars } from "react-loader-spinner";

const Preview = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [originalText, setOriginalText] = useState("");
  const [filteredText, setFilteredText] = useState("");

  const [id] = useState("preview-only");
  const [articles, setArticles] = useState();

  useEffect(() => {
    const fetchMainArticle = async () => {
      setIsLoading(true);
      try {
        const res = await api.get("/api/article/main/1");
        const { data } = res.data;
        setOriginalText(data.articleContent);
      } catch (error) {
        console.error("Error fetching main article:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMainArticle();
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await api.get("/api/articles");
        setArticles(response.data.data);
      } catch (error) {
        console.log("Error fetching articles:", error);
      }
    };
    fetchArticles();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const filteredText = originalText
      .split("\n")
      .filter((line) => line.toLowerCase().includes(e.target.value.toLowerCase()))
      .join("\n");
    setFilteredText(filteredText);
  };

  return (
    <>
      <label htmlFor="search">Search:</label>
      <input
        type="text"
        id="search"
        value={searchQuery}
        onChange={handleSearch}
      />
      <div style={{ display: "flex", width: "100%" }}>
        {isLoading ? (
          <div
            style={{
              display: "flex",
              alignContent: "center",
              alignItems: "center",
              margin: "auto",
              height: "86vh",
            }}
          >
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
              modelValue={filteredText || originalText}
            />
            <MdCatalog
              editorId={id}
              scrollElement={document.documentElement}
              articles={articles} 
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