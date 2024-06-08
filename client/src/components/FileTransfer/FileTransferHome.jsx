import PropTypes from "prop-types";
import FTPCommon from "./FTPCommon/FTPCommon";

const FileTransferHome = (props) => {
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
