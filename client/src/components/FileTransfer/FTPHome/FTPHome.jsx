import TableComponent from "../FTPComponents/TableComponent/TableComponent";
import FilterDrop from "../FTPComponents/filterdrop/FilterDrop";
import { Input } from "antd";
import ShareModal from "../FTPComponents/modal/ShareModal";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
import { jwtDecode } from "jwt-decode";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
const { Search } = Input;

const FTPHome = (props) => {
  const location = useLocation();
  const currentURL = location.pathname;
  const [data, setData] = useState([]); // [folders, files]
  const [currentUsers, setCurrentUsers] = useState({}); // [users, files]
  const [isLoading, setIsLoading] = useState(false);

  const shareHandler = (record) => {
    setOpenModal(!openModal);
    setCurrentUsers({
      users: record.users,
      folder_id: record.id,
      name: record.name,
    });
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
        setIsLoading(true);
        const response = await api.get(`/api/folders/userFolder`, {
          params: {
            userName: userName,
            folder_parent_id: currentURL.includes("home")
              ? String(null)
              : currentURL.split("/").pop(),
          },
        });

        const mergedData = [
          ...response.data.data.folders.map((folder) => ({
            updatedAt: new Date(folder.updatedAt).toLocaleString(),
            id: folder.folder_id,
            name: folder.folder_name,
            owner: folder.owner,
            type: folder.type,
            url: folder.folder_url,
            users: folder.Users,
          })),
          ...response.data.data.files.map((file) => ({
            updatedAt: new Date(file.updatedAt).toLocaleString(),
            id: file.file_id,
            name: file.file_name,
            owner: file.user_name,
            type: file.mime_type,
            url: file.file_url,
            permission: file.permission,
          })),
        ];

        setData(mergedData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserFolders();
  }, [currentURL, userName, props.refetch]);

  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="flex flex-col p-3 text-lg">
      <div className="flex justify-between">
        <h1 className="text-xl font-semibold ml-1">My Files</h1>
        <div className="flex-grow max-w-lg">
          <Search
            placeholder="input search text"
            // onSearch={onSearch}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{}}
          />
        </div>
      </div>
      <FilterDrop />
      <div>
        <TableComponent
          search={searchValue}
          data={data}
          shareHandler={shareHandler}
          setRefetch={props.setRefetch}
          userName={userName}
          isLoading={isLoading}
        />
      </div>
      <ShareModal
        isOpen={openModal}
        onCancelHandler={onCancelHandler}
        users={currentUsers}
        refetch={props.setRefetch}
        setRefetch={props.setRefetch}
      />
    </div>
  );
};

FTPHome.propTypes = {
  setRefetch: PropTypes.func.isRequired,
  refetch: PropTypes.bool.isRequired,
};

export default FTPHome;
