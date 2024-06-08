import { Button, Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";

const FilterDrop = () => {
  const handleMenuClick = (e) => {
    console.log(e.key);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="All">All</Menu.Item>
      <Menu.Item key="Images">Images</Menu.Item>
      <Menu.Item key="Videos">Videos</Menu.Item>
      <Menu.Item key="Documents">Documents</Menu.Item>
      {/* Add more options here */}
    </Menu>
  );

  return (
    <div className="flex py-2">
      {/* <Dropdown
        overlay={menu}
        className="flex items-center mr-2 font-semibold"
        trigger={["click"]}>
        <Button>
          Type <DownOutlined />
        </Button>
      </Dropdown>
      <Dropdown
        overlay={menu}
        className="flex items-center mr-2 font-semibold"
        trigger={["click"]}>
        <Button>
          People <DownOutlined />
        </Button>
      </Dropdown>
      <Dropdown
        overlay={menu}
        className="flex items-center mr-2 font-semibold"
        trigger={["click"]}>
        <Button>
          Modified <DownOutlined />
        </Button>
      </Dropdown>
      <Dropdown
        overlay={menu}
        className="flex items-center mr-2 font-semibold"
        trigger={["click"]}>
        <Button>
          Company <DownOutlined />
        </Button>
      </Dropdown> */}
    </div>
  );
};

export default FilterDrop;
