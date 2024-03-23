import { useState, useEffect } from "react";
import DiffViewer from "react-diff-viewer";
import { useParams } from "react-router-dom";

function Difference() {
  const [oldValue, setOldValue] = useState("");
  const [newValue, setNewValue] = useState("");
  const { id1, id2 } = useParams()
  useEffect(() => {
    Promise.all([
      api.get(`/api/versions/${id1}`).then((response) => response.data), // Assuming the endpoint returns the content directly
      api.get(`/api/versions/${id2}`).then((response) => response.data),
    ]).then(([oldText, newText]) => {
      setOldValue(oldText); // Set the content of the first version
      setNewValue(newText); // Set the content of the second version
    }).catch(error => console.error("Failed to fetch version contents:", error));
  }, [id1, id2]);

  return (
    <div>
      <h1>Diff Page</h1>
      <DiffViewer oldValue={oldValue} newValue={newValue} splitView={true}/>
    </div>
  );
}

export default Difference;
