// import FileTransfer from "../components/FileTransfer/FTPComponents/FileTransfer";
import FTPHome from "../components/FileTransfer/FTPHome/FTPHome";
import FTPTemplates from "../components/FileTransfer/FTPTemplates/FTPTemplates";
import FileTransferHome from "../components/FileTransfer/FileTransferHome";
import PrivateRoute from "../components/PrivateRoute";

export const FTPRoutes = [
  {
    path: "ftp/home",
    element: (
      <PrivateRoute>
        <FileTransferHome>
          <FTPHome />
        </FileTransferHome>
      </PrivateRoute>
    ),
  },
  {
    path: "ftp/templates",
    element: (
      <PrivateRoute>
        <FileTransferHome>
          <FTPTemplates />
        </FileTransferHome>
      </PrivateRoute>
    ),
  },
  {
    path: "ftp/directories/:id",
    element: (
      <PrivateRoute>
        <FileTransferHome>
          <FTPHome />
        </FileTransferHome>
      </PrivateRoute>
    ),
  },
];
