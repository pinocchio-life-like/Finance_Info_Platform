import TableComponent from "../FTPComponents/TableComponent/TableComponent";
import FilterDrop from "../FTPComponents/filterdrop/FilterDrop";
import { Input } from "antd";
import ShareModal from "../FTPComponents/modal/ShareModal";
import { useState } from "react";
const { Search } = Input;

const FTPHome = () => {
  const onSearch = (value, _e, info) => console.log(info?.source, value);
  const [currentFolder, setCurrentFolder] = useState({});
  const shareHandler = (file) => {
    setOpenModal(!openModal);
    setCurrentFolder(file);
  };
  const [openModal, setOpenModal] = useState(false);
  const onCancelHandler = () => setOpenModal(false);

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
        <TableComponent shareHandler={shareHandler} />
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
