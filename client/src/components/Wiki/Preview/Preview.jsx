import { useEffect, useState } from "react";
import { MdPreview } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import "md-editor-rt/lib/preview.css";
import api from "../../../utils/api";
import { Bars } from "react-loader-spinner";
import CustomMdCatalog from "./MdCatalogCustom/CustomMdCatalog";
import { LuPanelRightClose, LuPanelRightOpen } from "react-icons/lu";
import { useParams } from "react-router-dom";

const Preview = () => {
  const param = useParams();
  const [state, setState] = useState({
    text: "",
    scrollElement: document.documentElement,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  useEffect(() => {
    const getMainArticle = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/api/article/${param.id}`);
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
  }, [param.id]);

  const [id] = useState("preview-only");

  return (
    <div style={{ position: "relative" }}>
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
          <div style={{ overflow: "hidden", height: "100vh" }}>
            <MdPreview
              style={{
                borderLeft: "1px solid #EEEEEE",
                // borderRight: "1px solid #EEEEEE",
              }}
              className="h-screen z-10"
              editorId={id}
              modelValue={state.text}
              showCodeRowNumber={true}
            />
            <div
              className="absolute top-0 right-0 flex z-10"
              style={{
                // borderLeft: "1px solid #EEEEEE",
                borderRight: "1px solid #EEEEEE",
                height: "100vh",
              }}>
              <div className={`mr-1 right-2"`}>
                <button
                  className="mt-[2px] mr-[2px]"
                  onClick={() => setIsCatalogOpen(!isCatalogOpen)}>
                  {isCatalogOpen ? (
                    <LuPanelRightClose className="bg-white rounded" size={22} />
                  ) : (
                    <LuPanelRightOpen className="bg-white rounded" size={22} />
                  )}
                </button>
              </div>

              {isCatalogOpen && (
                <div className="px-1 overflow-auto w-60 bg-[#F6F6F6] scrollbar-thin scrollbar-thumb-[#888] scrollbar-track-[#f2f2f2]">
                  <CustomMdCatalog
                    editorId={id}
                    scrollElement={state.scrollElement}
                    scrollChange={(element) => {
                      setState({ ...state, scrollElement: element });
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Preview;
