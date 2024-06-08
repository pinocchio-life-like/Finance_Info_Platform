import PropTypes from "prop-types";
import FTPCommon from "./FTPCommon/FTPCommon";
import { useEffect } from "react";

const FileTransferHome = (props) => {
  useEffect(() => {
    window.onpopstate = function () {
      window.location.reload();
    };
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <FTPCommon>{props.children}</FTPCommon>
    </div>
  );
};

FileTransferHome.propTypes = {
  children: PropTypes.node,
};

export default FileTransferHome;
