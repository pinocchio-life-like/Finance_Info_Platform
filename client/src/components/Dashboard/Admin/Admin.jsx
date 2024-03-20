// import { AndroidOutlined, AppleOutlined } from "@ant-design/icons";
// import { Tabs } from "antd";
import { Table } from "antd";
import { useState } from "react";
// import { useNavigate } from "react-router-dom";
//
// const { TabPane } = Tabs;

const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
  },
  {
    key: "4",
    name: "Disabled User",
    age: 99,
    address: "Sydney No. 1 Lake Park",
  },
];
const columns = [
  {
    title: "Name",
    dataIndex: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Age",
    dataIndex: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
  },
];

const Admin = () => {
  const [activeLink, setActiveLink] = useState({ left: 1, right: 0 });
  // const navigate = useNavigate();
  const handleLink = (side, index) => {
    setActiveLink((prevState) => ({ ...prevState, [side]: index }));
  };
  return (
    <div
      style={{ width: "100%" }}
      className="flex-grow flex flex-col items-center bg-white">
      <div
        style={{ width: "95%" }}
        className="flex justify-between items-center border-b mt-3 border-gray-600 pb-1">
        <div>
          {["Company", "User"].map((link, index) => (
            <a
              key={index}
              className={`p-2 cursor-pointer ${
                activeLink.left === index
                  ? "border-b-2 border-black font-bold"
                  : ""
              }`}
              style={{ lineHeight: "2rem" }}
              onClick={() => handleLink("left", index)}>
              {link}
            </a>
          ))}
        </div>
      </div>
      <div style={{ width: "95%" }}>
        {activeLink.left === 0 ? (
          <div>Company</div>
        ) : (
          <div style={{ width: "100%" }} className="flex flex-row">
            <div style={{ width: "15%" }}>
              <div
                style={{ width: "100%" }}
                className="flex justify-between items-center mt-6 pl-2 border-b border-gray-600 pb-1">
                <div>Soon ...</div>
              </div>
            </div>
            <div style={{ width: "85%" }} className="border-l border-gray-600">
              <div
                style={{ width: "100%" }}
                className="flex justify-between items-center pl-2">
                <Table
                  style={{ width: "100%" }}
                  //   rowSelection={{
                  //     type: selectionType,
                  //     ...rowSelection,
                  //   }}
                  columns={columns}
                  dataSource={data}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
