import { Button, Modal, List, Avatar, Radio, Skeleton, message } from "antd";
import { useEffect, useRef, useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import { FaUnlockAlt } from "react-icons/fa";
import api from "../../../../utils/api";
import PropTypes from "prop-types";

const ShareModal = (props) => {
  const searchRef = useRef();
  const [showOptions, setShowOptions] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownAccessOpen, setDropdownAccessOpen] = useState(null);
  const [selectedOption, setSelectedOption] = useState("Restricted");
  const [search, setSearch] = useState("");
  const [folderUsers, setFolderUsers] = useState([]);
  const [data, setData] = useState([]);
  const [initLoading, setInitLoading] = useState(true);

  const handleAccessOptionChange = (userId, value) => {
    console.log(userId, value);

    if (value === "Revoke") {
      // Find the user to be revoked
      const userToRevoke = folderUsers.find((user) => user.userId === userId);

      // Remove the user from folderUsers
      setFolderUsers(folderUsers.filter((user) => user.userId !== userId));

      // Add the user back to data
      setData([
        ...data,
        {
          label: userToRevoke.firstName,
          value: userToRevoke.userId,
          permission: null,
          companyName: userToRevoke.companyName,
          companyId: userToRevoke.companyId,
        },
      ]);
    } else {
      // Update the permission of the user with the given userId
      setFolderUsers(
        folderUsers.map((user) => {
          if (user.userId === userId) {
            return { ...user, permission: value };
          } else {
            return user;
          }
        })
      );
    }

    setDropdownAccessOpen(null);
  };

  const handleOptionClick = (e) => {
    setSelectedOption(e.target.value);
    setDropdownOpen(false);

    if (e.target.value === "Anyone") {
      setFolderUsers((prevFolderUsers) => {
        // Create a new array that includes all unique items from data and prevFolderUsers
        const newFolderUsers = [
          ...prevFolderUsers,
          ...data.map((item) => ({
            userId: item.value,
            userName: item.label,
            permission: item.permission ? item.permission : "read",
            firstName: item.label,
            companyId: item.companyId,
            companyName: item.companyName,
          })),
        ].filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.userId === item.userId)
        );

        return newFolderUsers;
      });

      setData([]);
    }
  };

  useEffect(() => {
    const fetch_Company_and_Users = async () => {
      try {
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

        // Set folderUsers from the response data where the userId matches with props.users.users
        setFolderUsers(
          data
            .filter((user) =>
              props.users.users.some((u) => u.userId === user.value)
            )
            .map((item) => ({
              userId: item.value,
              userName: item.label,
              permission: item.permission,
              firstName: item.label,
              companyId: item.companyId,
              companyName: item.companyName,
            }))
        );

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
            companyId: item.companyId,
            companyName: item.companyName,
          };
        }),
    ]);
  };

  const onSubmitHandler = async () => {
    try {
      await api.post("/api/assignUser/assign", {
        folder_id: props.users.folder_id,
        users: folderUsers,
      });

      props.onCancelHandler();
      props.setRefetch((prev) => !prev);

      // Show success message
      message.success("Users assigned successfully");
    } catch (error) {
      // Handle error here. For example:
      console.error("An error occurred while assigning users:", error);

      // Show error message
      message.error("An error occurred while assigning users");
    }
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
                    dataSource={data.filter(
                      (item) =>
                        item.label
                          .toLowerCase()
                          .includes(search.toLowerCase()) ||
                        item.companyName
                          .toLowerCase()
                          .includes(search.toLowerCase())
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
                              <a>{item.label}</a>
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
                <div className="absolute bg-white border border-gray-200 rounded mt-40 right-4 py-1 z-40 px-1">
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
                description={item.companyName}
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
                    value="Anyone">
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
            onClick={onSubmitHandler}
            style={{ background: "#3B82f6", color: "white", width: "50%" }}>
            Done
          </Button>
        </div>
      </Modal>
    </div>
  );
};

ShareModal.propTypes = {
  users: PropTypes.any,
  onCancelHandler: PropTypes.func,
  isOpen: PropTypes.bool,
  setRefetch: PropTypes.func,
};

export default ShareModal;
