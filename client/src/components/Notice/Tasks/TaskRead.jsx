import { Button } from "antd";
import { Link, useParams } from "react-router-dom";
import { RollbackOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import api from "../../../utils/api";
import ReactQuill from "react-quill";

const TaskRead = () => {
  const { id } = useParams();
  const [task, setTask] = useState({});

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await api.get(`/api/task/${id}`);
        setTask(response.data.data);
      } catch (error) {
        console.error("Failed to fetch task:", error);
      }
    };
    fetchTask();
  }, [id]);

  return (
    <div className=" main-diff flex w-full justify-center lg:mt-6 mt-3">
      <div className="w-full lg:mx-14 mx-1 mb-8">
        <div className="border-b border-gray-200 flex">
          <div className="button mr-5">
            {" "}
            <Link to={`/notice`}>
              <Button className="" icon={<RollbackOutlined />}>
                Back
              </Button>
            </Link>
          </div>
          <div>
            <h2 className="text-xl font-semibold">{`${task.task_name}`}</h2>
            <div className="flex justify-between">
              <span className="italic text-gray-500">{`Due date: ${new Date(
                task.task_due_date
              ).toLocaleDateString()}`}</span>
              <span className="italic text-gray-500">{`By: ${task.userName}`}</span>
            </div>
          </div>
        </div>
        <div className="diff-viewer-container">
          <ReactQuill
            readOnly
            value={task.task_description}
            theme="bubble"
            className="mt-auto bg-white"
            style={{
              marginLeft: -14,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskRead;
