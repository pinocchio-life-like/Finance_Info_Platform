import PropTypes from "prop-types";
import FTPCommon from "./FTPCommon/FTPCommon";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const FileTransferHome = (props) => {
  const location = useLocation();
  const [isTransferInProgress, setTransferInProgress] = useState(false);

  useEffect(() => {
    const handler = (event) => {
      if (isTransferInProgress) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handler);

    return () => {
      window.removeEventListener("beforeunload", handler);
    };
  }, [isTransferInProgress]);

  return (
    <div className="flex flex-col h-screen">
      <FTPCommon
        setTransferInProgress={setTransferInProgress}
        key={location.pathname}>
        {props.children}
      </FTPCommon>
    </div>
  );
};

FileTransferHome.propTypes = {
  children: PropTypes.node,
};

export default FileTransferHome;
