import React, { useState, useEffect } from "react";
import { Button, Form, Input, Modal } from "antd";
import PropTypes from "prop-types";

const Update_modal = (props) => {
  const [submitActive, setSubmitActive] = useState(false);
  const [folderName, setFolderName] = useState("");

  useEffect(() => {
    if (folderName.trim().length > 0) {
      setSubmitActive(true);
    } else {
      setSubmitActive(false);
    }
  }, [folderName]);

  const handleAction = () => {
    props.handleUpdate(folderName);
    setFolderName(""); // Clear folder name after action
  };

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
              onClick={handleAction}
            >
              Rename
            </Button>
          </>
        )}
        title="Rename Folder"
        centered
        visible={props.isOpen}
      >
        <Form>
          <Form.Item
            label="Folder Name"
            name="folderName"
            rules={[
              {
                required: true,
                message: "Please input your folder name!",
              },
            ]}
          >
            <Input
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Enter folder name"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

Update_modal.propTypes = {
  close: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setFolderName: PropTypes.func.isRequired,
  folderName: PropTypes.string.isRequired,

 
};

export default Update_modal;
