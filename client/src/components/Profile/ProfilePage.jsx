import React from "react";
import { Avatar } from "antd";
import {
  Button,
  Cascader,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Switch,
  TreeSelect,
} from "antd";
const MyFormItemContext = React.createContext([]);
function toArr(str) {
  return Array.isArray(str) ? str : [str];
}
const MyFormItemGroup = ({ prefix, children }) => {
  const prefixPath = React.useContext(MyFormItemContext);
  const concatPath = React.useMemo(
    () => [...prefixPath, ...toArr(prefix)],
    [prefixPath, prefix]
  );
  return (
    <MyFormItemContext.Provider value={concatPath}>
      {children}
    </MyFormItemContext.Provider>
  );
};
const MyFormItem = ({ name, ...props }) => {
  const prefixPath = React.useContext(MyFormItemContext);
  const concatName =
    name !== undefined ? [...prefixPath, ...toArr(name)] : undefined;
  return <Form.Item name={concatName} {...props} />;
};
function ProfilePage() {
  const onFinish = (value) => {
    console.log(value);
  };
  return (
    <div className="w-2/5 pl-8">
      <Form name="form_item_path" layout="vertical" onFinish={onFinish}>
        <MyFormItemGroup prefix={["user"]}>
          <MyFormItemGroup prefix={["name"]}>
            <MyFormItem name="firstName" label="First Name">
              <Input className="p-2" />
            </MyFormItem>
            <MyFormItem name="userName" label="User Name">
              <Input className="p-2"/>
            </MyFormItem>
          </MyFormItemGroup>
          <Form.Item label="Select" >
            <Select className="">
              <Select.Option value="demo">Admin</Select.Option>
              <Select.Option value="demo">User</Select.Option>
              <Select.Option value="demo">Moderator</Select.Option>
            </Select>
          </Form.Item>

        </MyFormItemGroup>

        <Button type="" htmlType="submit">
          Update User
        </Button>
      </Form>
    </div>
  );
}

export default ProfilePage;
