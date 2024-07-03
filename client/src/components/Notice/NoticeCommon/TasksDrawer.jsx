import { Button, Drawer, Space } from "antd";

const TasksDrawer = (props) => {
  const onClose = () => {
    props.setOpen(false);
  };

  return (
    <div>
      <Drawer
        title="Drawer with extra actions"
        placement="bottom"
        width={900}
        height="86%"
        onClose={onClose}
        open={props.open}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button className="qa-button" type="primary" onClick={onClose}>
              Submit
            </Button>
          </Space>
        }>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
    </div>
  );
};

export default TasksDrawer;
