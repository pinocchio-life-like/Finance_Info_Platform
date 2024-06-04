import { Button, Modal, Input, List, Avatar, Radio, Skeleton } from "antd";
import { useEffect, useRef, useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import { LockFilled } from "@ant-design/icons";
import { FaUnlockAlt } from "react-icons/fa";
import { IoMdCheckboxOutline } from "react-icons/io";
import { DeleteOutlined } from "@ant-design/icons";
import api from "../../../../utils/api";
import { Link } from "react-router-dom";
import { Checkbox } from "antd";

const ShareModal = (props) => {
  const [submitActive, setSubmitActive] = useState(false);
  const searchRef = useRef();
  const [showOptions, setShowOptions] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownAccessOpen, setDropdownAccessOpen] = useState(null);
  const [selectedOption, setSelectedOption] = useState("Restricted");
  const [selectedAccessOption, setSelectedAccessOption] = useState("Read Only");
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [checkedValues, setCheckedValues] = useState([]);
  const [allCheckedValues, setAllCheckedValues] = useState([]);
  const [folderUsers, setFolderUsers] = useState([]);
  const [data, setData] = useState([]);
  const [initLoading, setInitLoading] = useState(true);

  const handleAccessOptionChange = (userId, value) => {
    console.log(userId, value);
    // setSelectedAccessOption(e.target.value);
    setDropdownAccessOpen(null);
  };

  const handleOptionClick = (e) => {
    setSelectedOption(e.target.value);
    setDropdownOpen(false);
  };

  useEffect(() => {
    const fetch_Company_and_Users = async () => {
      try {
        setFolderUsers(props.users.users);
        const response = await api.get("/api/company_users/getall");
        const permissions = [];

        let data = response.data.data.map((company) => {
          return company.Users.map((user) => {
            const permissionUser = props.users.users.find(
              (p) => p.userId === user.userId
            );

            if (permissionUser) {
              permissions.push(user.userId);
            }

            return {
              label: user.firstName,
              value: user.userId,
              permission: permissionUser ? permissionUser.permission : null,
              companyName: company.company_Name,
              companyId: company.company_Id,
            };
          });
        });

        // Flatten the array
        data = [].concat(...data);

        console.log(props.users.users);

        // Filter out users that exist in folderUsers
        data = data.filter(
          (user) => !props.users.users.some((u) => u.userId === user.value)
        );

        setData(data);

        setInitLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetch_Company_and_Users();
  }, [props.users.users]);

  const handleDropdownClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setShowOptions(true);
    setSubmitActive(e.target.value !== "");
  };

  const handleDropdownAccessClick = (index) => {
    setDropdownAccessOpen(dropdownAccessOpen === index ? null : index);
  };

  // Handle click outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddClick = (id) => {
    //Remove the clicked user from the data array
    const newData = data.filter((item) => item.value !== id);
    setData(newData);

    // Add the clicked item to the folderUsers array
    setFolderUsers([
      ...folderUsers,
      ...data
        .filter((item) => item.value === id)
        .map((item) => {
          return {
            userId: item.value,
            userName: item.label,
            permission: "read",
            firstName: item.label,
          };
        }),
    ]);
  };

  return (
    <div>
      <Modal
        onCancel={props.onCancelHandler}
        footer={null}
        title={`Share "${props.users.name}"`}
        centered
        open={props.isOpen}>
        <div
          className="flex w-full rounded bg-white h-full relative border border-gray-200"
          ref={searchRef}>
          <div className="relative w-full">
            <input
              className="w-full border-none bg-transparent px-4 py-2 items-center text-black outline-none focus:outline-none"
              type="search"
              name="search"
              placeholder="Search..."
              value={search}
              onChange={handleSearchChange}
            />
            {showOptions && (
              <div
                className="absolute w-full bg-white border border-gray-200 rounded mt-1 overflow-y-auto z-50 drop-shadow-lg"
                style={{ maxHeight: 450 }}>
                <div className="flex flex-col p-2">
                  <List
                    className="demo-loadmore-list"
                    loading={initLoading}
                    itemLayout="horizontal"
                    dataSource={data.filter((item) =>
                      item.label.toLowerCase().includes(search.toLowerCase())
                    )}
                    renderItem={(item) => (
                      <List.Item
                        actions={[
                          <Button
                            key={item.value}
                            onClick={() => handleAddClick(item.value)}>
                            add
                          </Button>,
                        ]}>
                        <Skeleton avatar title={false} loading={false} active>
                          <List.Item.Meta
                            avatar={<Avatar icon={<UserOutlined />} />}
                            title={
                              <a href="https://ant.design">{item.label}</a>
                            }
                            description={item.companyName}
                          />
                        </Skeleton>
                      </List.Item>
                    )}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 mb-2 px-1 font-semibold text-[15px]">
          People with access
        </div>
        <List
          itemLayout="horizontal"
          className="ml-2 max-h-80 overflow-auto py-10"
          dataSource={folderUsers}
          renderItem={(item, index) => (
            <List.Item
              className="flex items-center"
              actions={[
                <div
                  key={index}
                  onClick={() => handleDropdownAccessClick(item.userId)}>
                  <span className="font-semibold text-[15px] flex items-center hover:bg-gray-300 w-fit h-fit px-1 rounded">
                    {item.permission === "read"
                      ? "Read Only"
                      : "Read and Write"}
                    <span
                      className="flex justify-center"
                      style={{ fontSize: "15px" }}>
                      &#9662;
                    </span>
                  </span>
                </div>,
              ]}>
              {dropdownAccessOpen === item.userId && (
                <div className="absolute bg-white border border-gray-200 rounded mt-40 right-4 py-1 z-50 px-1">
                  <Radio.Group
                    className="flex flex-col"
                    onChange={(e) =>
                      handleAccessOptionChange(item.userId, e.target.value)
                    }
                    value={
                      item.permission === "admin" ? "write" : item.permission
                    }>
                    <Radio
                      className="hover:bg-gray-200 px-1 py-2 flex flex-row items-center"
                      value="read"
                      disabled={item.permission === "admin"}>
                      Read Only
                    </Radio>
                    <Radio
                      className="hover:bg-gray-200 px-1 py-2 flex flex-row items-center"
                      value="write"
                      disabled={item.permission === "admin"}>
                      Read and Write
                    </Radio>
                    <Radio
                      className="hover:bg-gray-200 px-1 py-2 flex flex-row items-center"
                      value="Revoke"
                      disabled={item.permission === "admin"}>
                      Remove User Access
                    </Radio>
                  </Radio.Group>
                </div>
              )}
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={item.userName}
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
              <div className="absolute bg-white border border-gray-200 rounded mt-7 py-2 z-50 px-1">
                <Radio.Group
                  className="flex flex-col"
                  onChange={handleOptionClick}
                  value={selectedOption}>
                  <Radio
                    className="hover:bg-gray-200 px-1 py-3 flex flex-row items-center"
                    value="Restricted">
                    Restricted
                  </Radio>
                  <Radio
                    className="hover:bg-gray-200 px-1 py-3 flex flex-row items-center"
                    value="Anyone with the link">
                    Anyone with the link
                  </Radio>
                </Radio.Group>
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
            style={{ background: "#3B82f6", color: "white", width: "50%" }}>
            Done
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ShareModal;
