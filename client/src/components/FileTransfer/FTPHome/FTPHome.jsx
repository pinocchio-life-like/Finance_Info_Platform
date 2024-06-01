import TableComponent from "../FTPComponents/TableComponent/TableComponent";
import FilterDrop from "../FTPComponents/filterdrop/FilterDrop";
import { Input } from "antd";
import ShareModal from "../FTPComponents/modal/ShareModal";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
import { jwtDecode } from "jwt-decode";
import { useLocation } from "react-router-dom";
const { Search } = Input;

const FTPHome = () => {
  const location = useLocation();
  const currentURL = location.pathname;
  const onSearch = (value, _e, info) => console.log(info?.source, value);
  const [currentFolder, setCurrentFolder] = useState({});
  const [data, setData] = useState([]); // [folders, files]
  const shareHandler = (file) => {
    setOpenModal(!openModal);
    setCurrentFolder(file);
  };
  const [openModal, setOpenModal] = useState(false);
  const onCancelHandler = () => setOpenModal(false);

  const token = localStorage.getItem("token");
  let userName = null;
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userName = decodedToken.userName;
    } catch (error) {
      console.error("Invalid token");
    }
  }

  useEffect(() => {
    const fetchUserFolders = async () => {
      try {
        const response = await api.get(`/api/folders/userFolder`, {
          params: {
            userName: userName,
            folder_parent_id: currentURL.includes("home")
              ? String(null)
              : currentURL.split("/").pop(),
          },
        });
        console.log(response.data.data);

        const mergedData = [
          ...response.data.data.folders.map((folder) => ({
            updatedAt: folder.updatedAt,
            id: folder.folder_id,
            name: folder.folder_name,
            owner: folder.owner,
            type: folder.type,
            size: "...",
          })),
          ...response.data.data.files.map((file) => ({
            updatedAt: file.updatedAt,
            id: file.file_id,
            name: file.file_name,
            owner: file.user_name,
            type: file.mime_type,
            size: "5MB",
          })),
        ];

        setData(mergedData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserFolders();
  }, [currentURL, userName]);

  return (
    <div className="flex flex-col p-3 text-lg">
      <div className="flex justify-between">
        <h1 className="text-lg font-semibold">Home</h1>
        <div className="flex-grow max-w-lg">
          <Search
            placeholder="input search text"
            onSearch={onSearch}
            style={{}}
          />
        </div>
      </div>
      <FilterDrop />
      <div>
        <TableComponent data={data} shareHandler={shareHandler} />
      </div>
      <ShareModal
        isOpen={openModal}
        onCancelHandler={onCancelHandler}
        data={currentFolder}
      />
    </div>
  );
};

export default FTPHome;
