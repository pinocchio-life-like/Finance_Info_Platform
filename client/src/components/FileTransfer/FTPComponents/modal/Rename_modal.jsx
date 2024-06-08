import React, { useState, useEffect } from "react";
import { Button, Form, Input, Modal } from "antd";
import PropTypes from "prop-types";

const Update_modal = (props) => {
  const [submitActive, setSubmitActive] = useState(false);


  useEffect(() => {
    if (props.folderName.trim().length > 0) {
      setSubmitActive(true);
    } else {
      setSubmitActive(false);
    }
  }, [props.folderName]);

  const handleAction = () => {
    props.handleUpdate(props.folderName);
    // setFolderName(""); 
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
         
              onChange={(e) => props.setFolderName(e.target.value)}
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
