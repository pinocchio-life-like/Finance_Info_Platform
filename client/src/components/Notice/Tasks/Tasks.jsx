import { useState } from "react";
import { Link } from "react-router-dom";
import { BiTask } from "react-icons/bi";
import { MdOutlinePendingActions } from "react-icons/md";
import { BiTaskX } from "react-icons/bi";
import api from "../../../utils/api";
import ReactQuill from "react-quill";
import { Button, Popconfirm, Popover } from "antd";
import { FaEllipsisV } from "react-icons/fa";
const Tasks = ({ tasks, userName, setRefetch, setTaskData, setTaskStatus }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFull, setIsFull] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  const toggleDescription = (index) => {
    setIsFull((prev) => {
      const newIsFull = [...prev];
      newIsFull[index] = !newIsFull[index];
      return newIsFull;
    });
  };

  const updateStatus = async (id, user, status) => {
    try {
      if (user === userName) {
        const response = await api.put(`/api/generalStatus/${id}`, {
          status,
        });
        if (response.status === 200) {
          setRefetch((prev) => !prev);
        } else {
          console.error("Update failed", response.status, response.data);
        }
        return;
      }
      const response = await api.put(`/api/task/${id}`, { status, userName });
      if (response.status === 200) {
        setRefetch((prev) => !prev);
      } else {
        console.error("Update failed", response.status, response.data);
      }
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await api.delete(`/api/task/${id}`);
      if (response.status === 200) {
        setRefetch((prev) => !prev);
      } else {
        console.error("Delete failed", response.status, response.data);
      }
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };

  return (
    <>
      <nav className="bg-[#D6D6D6] z-50 py-2">
        <ul className="flex flex-row items-center justify-between px-1 space-x-2 text-m">
          <li>
            <Link
              className={`flex items-center px-2 rounded hover:bg-gray-200 font-light ${
                activeIndex === 0 ? "text-[#155CA2] " : ""
              }`}
              onClick={() => {
                setActiveIndex(0);
              }}>
              <MdOutlinePendingActions size={21} style={{ marginRight: 10 }} />{" "}
              Pending
            </Link>
          </li>
          <li>
            <Link
              className={`flex items-center px-2 rounded hover:bg-gray-200 font-light ${
                activeIndex === 1 ? "text-[#155CA2] " : ""
              }`}
              onClick={() => {
                setActiveIndex(1);
              }}>
              <BiTask size={21} style={{ marginRight: 10 }} />
              Completed
            </Link>
          </li>
          <li>
            <Link
              className={`flex items-center px-2 rounded hover:bg-gray-200 font-light ${
                activeIndex === 2 ? "text-[#155CA2] " : ""
              }`}
              onClick={() => {
                setActiveIndex(2);
              }}>
              <BiTaskX size={20} style={{ marginRight: 10 }} /> Overdue
            </Link>
          </li>
        </ul>
      </nav>
      <div
        style={{
          height: "84vh",
          overflowY: "auto",
          scrollbarWidth: "none" /* For Firefox */,
          msOverflowStyle: "none" /* For Internet Explorer and Edge */,
        }}>
        {tasks
          .filter((task) =>
            activeIndex === 0
              ? task.taskUserStatus === "pending"
              : activeIndex === 1
              ? task.taskUserStatus === "completed"
              : task.taskUserStatus === "overdue"
          )
          .map((task, i) => {
            let matches = task.task_description.match(/<[^>]*>[^<]*<\/[^>]*>/g);
            let description = matches ? matches.slice(0, 4).join("") : "";
            return (
              <div
                onMouseOver={() => setIsHovered(true)}
                onMouseOut={() => setIsHovered(false)}
                key={task.task_id}
                className={`w-full py-2 px-1 mb-2 ${isHovered ? "group" : ""}`}
                style={{
                  position: "relative",
                  background: "",
                }}>
                <div className="w-full flex-row">
                  <div className="w-full font-bold text-lg text-[#008DDA] flex border-b pb-1 justify-between items-center">
                    <Link
                      to={`/task/${task.task_id}`}>{`${task.task_name}`}</Link>
                    <Popover
                      className="opacity-0 group-hover:opacity-100"
                      position="bottom"
                      content={
                        <div className="flex flex-col gap-1">
                          {task.taskUserStatus !== "completed" && (
                            <Popconfirm
                              title="Mark as completed"
                              description="Do you want to mark as complete?"
                              onConfirm={() => {
                                updateStatus(
                                  task.task_id,
                                  task.userName,
                                  "completed"
                                );
                              }}
                              okText="Yes"
                              cancelText="No"
                              okButtonProps={{
                                style: {
                                  backgroundColor: "#155CA2",
                                  color: "white",
                                },
                              }}>
                              <Button>mark as completed</Button>
                            </Popconfirm>
                          )}
                          {task.userName === userName && (
                            <>
                              {task.task_status !== "Completed" && (
                                <Button
                                  onClick={() => {
                                    setTaskData(task);
                                    setTaskStatus("edit");
                                  }}>
                                  Edit
                                </Button>
                              )}
                              <Popconfirm
                                title="Delete Task"
                                description="Do you want to delete task?"
                                onConfirm={() => {
                                  deleteTask(task.task_id);
                                }}
                                okText="Yes"
                                cancelText="No"
                                okButtonProps={{
                                  style: {
                                    backgroundColor: "#155CA2",
                                    color: "white",
                                  },
                                }}>
                                <Button>Delete</Button>
                              </Popconfirm>
                            </>
                          )}
                        </div>
                      }>
                      <FaEllipsisV className="cursor-pointer" />
                    </Popover>
                  </div>
                  <div className="w-full">
                    <ReactQuill
                      readOnly
                      value={isFull[i] ? task.task_description : description}
                      theme="bubble"
                      className="mt-auto bg-white"
                      style={{
                        marginLeft: -14,
                      }}
                    />
                  </div>
                  <div
                    style={{ position: "absolute", bottom: 30, left: 0 }}
                    className="w-full flex justify-between pr-2">
                    <button
                      className="text-[#008DDA]"
                      onClick={() => {
                        toggleDescription(i);
                      }}>
                      {isFull[i] ? "see less" : "...see more"}
                    </button>
                    <button className="text-gray-500 text-sm font-normal">
                      Due date:{" "}
                      {new Date(task.task_due_date).toLocaleDateString()}
                    </button>
                  </div>
                  <button
                    className="text-[#008DDA] text-sm"
                    style={{ position: "absolute", bottom: 0, left: 0 }}>
                    assigned by: {task.userName} @{" "}
                    {new Date(task.createdAt).toLocaleString()}
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default Tasks;
