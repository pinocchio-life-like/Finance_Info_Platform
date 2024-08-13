import "./NoticeCommon.css";
import Tasks from "../Tasks/Tasks";
import Notices from "../Notices/Notices";
import { useEffect, useState } from "react";
import TasksDrawer from "./TasksDrawer";
import NoticeDrawer from "./NoticeDrawer";
import api from "../../../utils/api";
import { CiSquarePlus } from "react-icons/ci";
import { jwtDecode } from "jwt-decode";
import { Skeleton } from "antd";

const NoticeCommon = () => {
  const [openTask, setOpenTask] = useState(false);
  const [openNotice, setOpenNotice] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const [users, setUsers] = useState([]);
  const [notices, setNotices] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isTaskLoading, setIsTaskLoading] = useState(true);
  const [isNoticeLoading, setIsNoticeLoading] = useState(true);
  const [data, setData] = useState({});
  const [taskData, setTaskData] = useState({});
  const [status, setStatus] = useState("");
  const [taskStatus, setTaskStatus] = useState("");

  const token = localStorage.getItem("token");
  let userName = null;
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userName = decodedToken.userName;
    } catch (error) {
      console.error("Invalid token");
    }
  }

  const showTaskDrawer = () => {
    setOpenTask(true);
  };

  const showNoticeDrawer = () => {
    setOpenNotice(true);
  };

  useEffect(() => {
    const getAllCompanies = async () => {
      try {
        const response = await api.get("/api/companies/getAll");
        const data = response.data.data;
        setCompanies(
          data.map((company) => ({
            label: company.company_Name,
            value: company.company_Id,
          }))
        );
      } catch (error) {
        console.error(error);
      }
    };
    const fetch_Company_and_Users = async () => {
      try {
        const response = await api.get("/api/company_users/getall");

        let data = response.data.data.map((company) => {
          return company.Users.map((user) => {
            return {
              label: user.firstName,
              value: user.userId,
              companyName: company.company_Name,
              companyId: company.company_Id,
            };
          });
        });

        // Flatten the array
        data = [].concat(...data);

        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    };

    getAllCompanies();
    fetch_Company_and_Users();
  }, []);

  useEffect(() => {
    const getNotice = async () => {
      try {
        const response = await api.get(`/api/notices/${userName}`);
        const noticesWithMappedCompanies = response.data.data
          .map((notice) => ({
            ...notice,
            companies: notice.Companies.map((company) => ({
              label: company.company_Name,
              value: company.company_Id,
            })),
            Companies: undefined,
          }))
          .map(({ Companies, ...rest }) => rest);
        setNotices(
          noticesWithMappedCompanies.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
      } catch (error) {
        console.error("Failed to fetch notices:", error);
        setNotices([]);
      } finally {
        setIsNoticeLoading(false);
      }
    };
    getNotice();
  }, [refetch]);

  useEffect(() => {
    const getTasks = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const overDueIds = [];
      try {
        const response = await api.get(`/api/tasks/${userName}`);
        const tasksWithMappedUsers = response.data.data
          .map((task) => {
            const taskDueDate = new Date(task.task_due_date);
            taskDueDate.setHours(0, 0, 0, 0);
            const isOverdue = taskDueDate < today;
            const mappedTask = {
              ...task,
              users: task.Users.map((user) => ({
                label: user.firstName,
                value: user.userId,
              })),
              Users: undefined,
              taskUserStatus:
                isOverdue && task.task_status !== "completed"
                  ? "overdue"
                  : task.taskUserStatus,
            };
            return mappedTask;
          })
          .map(({ Users, ...rest }) => rest);
        setTasks(tasksWithMappedUsers);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setIsTaskLoading(false);
        if (overDueIds.length === 0) {
          const updateStatusPromises = overDueIds.map((id) =>
            api.put(`/api/generalStatus/${id}`, { status })
          );
          await Promise.all(updateStatusPromises);
        }
      }
    };
    getTasks();
  }, [refetch]);

  useEffect(() => {
    if (status === "edit") {
      setOpenNotice(true);
    }
    if (taskStatus === "edit") {
      setOpenTask(true);
    }
  }, [status, taskStatus]);

  return (
    <div>
      <div className="flex-grow flex flex-col items-center lg:mx-14 mx-1 bg-white">
        <div className="flex justify-between items-center w-full pt-3">
          <div className="w-[65%] border-b border-gray-600 flex items-center pb-1">
            <CiSquarePlus
              className="hover:bg-[#008DDA] hover:text-white rounded-full p-1 cursor-pointer"
              size={40}
              onClick={() => {
                showNoticeDrawer();
                setStatus("");
              }}
            />
            <a className={`px-1 cursor-pointer`} style={{ lineHeight: "2rem" }}>
              Notices
            </a>
          </div>
          <div className="w-[35%] border-b border-gray-600 ml-1 flex items-center pb-1">
            <CiSquarePlus
              className="hover:bg-[#008DDA] hover:text-white rounded-full p-1 cursor-pointer"
              size={40}
              onClick={() => showTaskDrawer()}
            />
            <a className={`px-1 cursor-pointer`} style={{ lineHeight: "2rem" }}>
              Tasks
            </a>
          </div>
        </div>
        <div className="timeline_container w-full flex justify-between">
          {isNoticeLoading ? (
            <div className="w-[65%] flex flex-col gap-3 mt-4 p-2">
              <Skeleton active />
              <Skeleton active />
              <Skeleton active />
              <Skeleton active />
              <Skeleton active />
              <Skeleton active />
            </div>
          ) : (
            <div
              className="w-[65%] scrollable border-r"
              style={{ maxHeight: "86.2vh", overflowY: "auto" }}
            >
              <Notices
                notices={notices}
                setRefetch={setRefetch}
                setData={setData}
                setStatus={setStatus}
                userName={userName}
              />
            </div>
          )}
          {isTaskLoading ? (
            <div className="w-[35%] flex flex-col gap-3 mt-4 p-2">
              <Skeleton active />
              <Skeleton active />
              <Skeleton active />
              <Skeleton active />
              <Skeleton active />
              <Skeleton active />
            </div>
          ) : (
            <div
              className="w-[35%] ml-1 scrollable"
              style={{ maxHeight: "86.2vh", overflowY: "auto" }}
            >
              <Tasks
                tasks={tasks}
                userName={userName}
                setRefetch={setRefetch}
                setTaskData={setTaskData}
                setTaskStatus={setTaskStatus}
              />
            </div>
          )}
        </div>
      </div>
      <NoticeDrawer
        key={data && data.task_id ? data.task_id : Math.random().toString()}
        companies={companies}
        open={openNotice}
        setOpen={setOpenNotice}
        setRefetch={setRefetch}
        data={data}
        status={status}
        setStatus={setStatus}
        userName={userName}
        setData={setData}
      />
      <TasksDrawer
        key={
          taskData && taskData.task_id
            ? taskData.task_id
            : Math.random().toString()
        }
        open={openTask}
        setOpen={setOpenTask}
        users={users}
        setRefetch={setRefetch}
        userName={userName}
        taskData={taskData}
        setTaskStatus={setTaskStatus}
        taskStatus={taskStatus}
        setTaskData={setTaskData}
      />
    </div>
  );
};

export default NoticeCommon;
