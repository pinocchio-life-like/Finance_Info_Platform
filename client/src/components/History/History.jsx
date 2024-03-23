import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { Checkbox } from "antd";

function History() {
  const [versions, setVersions] = useState([]);
  const [article, setArticle] = useState();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await api.get("/api/article");
        setArticle(response.data.data);
      } catch (error) {
        console.error("Error fetching article:", error);
      }
    };

    fetchArticle();
  }, []);

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const response = await api.get("/api/article/versions");
        setVersions(response.data.data);
      } catch (error) {
        console.error("Error fetching versions:", error);
      }
    };

    if (article) {
      fetchVersion();
    }
  }, [article]);

  function onChange(checkedValues) {
    console.log("Checked values:", checkedValues);
  }

  return (
    <div>
      {versions.map((ver) => (
        <Checkbox key={ver.articleversionId} onChange={onChange}>
          {ver.updatedAt}
        </Checkbox>
      ))}
    </div>
  );
}

export default History;
