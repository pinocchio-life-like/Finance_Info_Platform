import { Button, Modal, Input, List, Avatar } from "antd";
import { useRef, useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import { LockFilled } from "@ant-design/icons";
import { FaUnlockAlt } from "react-icons/fa";
import { IoMdCheckboxOutline } from "react-icons/io";
import { DeleteOutlined } from "@ant-design/icons";

const dummyData = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
  },
  {
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
  },
  {
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
  },
  {
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
  },
  {
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
  },
];

const ShareModal = (props) => {
  const [submitActive, setSubmitActive] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const searchRef = useRef();
  const [showOptions, setShowOptions] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownAccessOpen, setDropdownAccessOpen] = useState(null);
  const [selectedOption, setSelectedOption] = useState("Restricted");
  const [selectedAccessOption, setSelectedAccessOption] = useState("Read Only");
  const [data, setData] = useState(dummyData);

  const handleDropdownClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleDropdownAccessClick = (index) => {
    setDropdownAccessOpen(dropdownAccessOpen === index ? null : index);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setDropdownOpen(false);
  };

  const handleAccessOptionClick = (option) => {
    setSelectedAccessOption(option);
    setDropdownAccessOpen(null);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setSubmitActive(e.target.value !== "");
  };

  return (
    <div>
      <Modal
        onCancel={props.onCancelHandler}
        footer={null}
        title={`Share "${props.data.name}"`}
        centered
        visible={props.isOpen}>
        <div
          className="flex w-full rounded bg-white h-full relative border border-gray-200"
          ref={searchRef}>
          <div className="relative w-full">
            <input
              className="w-full border-none bg-transparent px-4 py-2 items-center text-black outline-none focus:outline-none"
              type="search"
              name="search"
              placeholder="Search..."
              //   value={search}
              //   onChange={handleSearchChange}
            />
            {showOptions && (
              <div
                className="absolute w-full bg-white border border-gray-200 rounded mt-1 overflow-y-auto z-50"
                style={{ maxHeight: "80vh" }}>
                <div className="px-4 py-2 font-bold">Contacts</div>
                {/* {questions
                  .filter((question) =>
                    question.label.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((question, index) => (
                    <Link
                      key={index}
                      to={`/question/${question.value}`}
                      onClick={() => handleOptionClick(question.label)}
                      className="block px-4 py-2 hover:bg-gray-200 cursor-pointer">
                      {question.label}
                    </Link>
                  ))}  */}
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 mb-2 px-1 font-semibold text-[15px]">
          People with access
        </div>
        <List
          itemLayout="horizontal"
          className="ml-2 max-h-80 overflow-auto"
          dataSource={data}
          renderItem={(item, index) => (
            <List.Item
              actions={[
                <div
                  key={1}
                  onClick={() => handleDropdownAccessClick(index)}
                  className="pt-1">
                  <span className="font-semibold text-[15px] flex items-center hover:bg-gray-300 w-fit h-fit px-1 rounded">
                    {selectedAccessOption}
                    <span
                      className="flex justify-center"
                      style={{ fontSize: "15px" }}>
                      &#9662;
                    </span>
                  </span>
                </div>,
              ]}>
              {dropdownAccessOpen === index && (
                <div className="absolute bg-white border border-gray-200 rounded mt-28 right-4 py-2 w-64 z-50">
                  <div
                    className="hover:bg-gray-200 px-1 py-2 flex flex-row items-center"
                    onClick={() => handleAccessOptionClick("Read Only")}>
                    {selectedAccessOption === "Read Only" && (
                      <IoMdCheckboxOutline
                        size={20}
                        color="green"
                        className="mr-1"
                      />
                    )}
                    <span
                      className={`pl-${
                        selectedAccessOption === "Read Only" ? 0 : 7
                      }`}>
                      Read Only
                    </span>
                  </div>
                  <div
                    className="hover:bg-gray-200 px-1 py-2 flex flex-row items-center"
                    onClick={() => handleAccessOptionClick("Read and Write")}>
                    {selectedAccessOption !== "Read Only" && (
                      <IoMdCheckboxOutline
                        size={20}
                        color="green"
                        className="mr-1"
                      />
                    )}
                    <span
                      className={`pl-${
                        selectedAccessOption === "Read Only" ? 7 : 0
                      }`}>
                      Read and Write
                    </span>
                  </div>
                </div>
              )}
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={item.name}
                description={item.email}
              />
            </List.Item>
          )}
        />
        <div className="mt-4 mb-2 px-1 font-semibold text-[15px]">
          General access
        </div>
        <div className="flex w-full hover:bg-gray-200 items-center rounded mt-2">
          <div className=" ml-1 w-10 h-10 flex items-center bg-gray-200 justify-center rounded-full">
            <FaUnlockAlt className="w-5 h-5" />
          </div>
          <div className="ml-3 flex flex-col">
            <div onClick={handleDropdownClick} className="pt-1">
              <span className="font-semibold text-[15px] flex items-center hover:bg-gray-300 w-fit h-fit px-1 rounded">
                {selectedOption}
                <span
                  className="flex justify-center"
                  style={{ fontSize: "15px" }}>
                  &#9662;
                </span>
              </span>
            </div>
            {dropdownOpen && (
              <div className="absolute bg-white border border-gray-200 rounded mt-7 py-2 w-64 z-50">
                <div
                  className="hover:bg-gray-200 px-1 py-3 flex flex-row items-center"
                  onClick={() => handleOptionClick("Restricted")}>
                  {selectedOption === "Restricted" && (
                    <IoMdCheckboxOutline
                      size={20}
                      color="green"
                      className="mr-1"
                    />
                  )}
                  <span
                    className={`pl-${selectedOption === "Restricted" ? 0 : 7}`}>
                    Restricted
                  </span>
                </div>
                <div
                  className="hover:bg-gray-200 px-1 py-3 flex flex-row items-center"
                  onClick={() => handleOptionClick("Anyone with the link")}>
                  {selectedOption !== "Restricted" && (
                    <IoMdCheckboxOutline
                      size={20}
                      color="green"
                      className="mr-1"
                    />
                  )}
                  <span
                    className={`pl-${selectedOption === "Restricted" ? 7 : 0}`}>
                    Anyone with the link
                  </span>
                </div>
              </div>
            )}
            <div className="px-1">
              Only people added can open with this link
            </div>
          </div>
        </div>
        <div
          className="flex flex-row justify-between"
          style={{ textAlign: "right", marginTop: "1rem" }}>
          <Button
            onClick={props.onCancelHandler}
            style={{ marginRight: "1rem", width: "50%" }}>
            Cancel
          </Button>
          <Button
            disabled={!submitActive}
            style={{ background: "#3B82f6", color: "white", width: "50%" }}
            // onClick=
          >
            Done
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ShareModal;
