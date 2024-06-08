import { Button, Form, Input, Modal } from "antd";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const Upload_modal = (props) => {
  const [submitActive, setSubmitActive] = useState(false);

  useEffect(() => {
    if (props.folderName.length > 0) {
      setSubmitActive(true);
    } else {
      setSubmitActive(false);
    }
  }, [props.folderName]);

  return (
    <div>
      <Modal
        onCancel={props.close}
        footer={(_, { CancelBtn }) => (
          <>
            <CancelBtn />
            <Button
              disabled={!submitActive}
              style={{ background: "#3B82f6", color: "white" }}
              onClick={props.handleAddFolder}>
              Add
            </Button>
          </>
        )}
        title="New Folder"
        centered
        open={props.isOpen}>
        <Form>
          <Form.Item
            label="Folder Name"
            name="folderName"
            rules={[
              {
                required: true,
                message: "Please input your folder name!",
              },
            ]}>
            <Input
              onChange={(e) => {
                props.setFolderName(e.target.value);
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

Upload_modal.propTypes = {
  close: PropTypes.func.isRequired,
  handleAddFolder: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setFolderName: PropTypes.func.isRequired,
  folderName: PropTypes.string.isRequired,
};

export default Upload_modal;
