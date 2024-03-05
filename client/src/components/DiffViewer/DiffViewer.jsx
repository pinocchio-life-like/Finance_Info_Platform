import { useState, useEffect } from "react";
import DiffViewer from "react-diff-viewer";

function Difference() {
  const [oldValue, setOldValue] = useState("");
  const [newValue, setNewValue] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/oldfile.txt").then((response) => response.text()),
      fetch("/newfile.txt").then((response) => response.text()),
    ]).then(([oldText, newText]) => {
      setOldValue(oldText);
      setNewValue(newText);
    });
  }, []);

  return (
    <div>
      <h1>Diff Page</h1>
      <DiffViewer oldValue={oldValue} newValue={newValue} />
    </div>
  );
}

export default Difference;
