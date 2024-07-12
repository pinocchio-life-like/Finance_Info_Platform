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
        setNotices(response.data.data);
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
      try {
        const response = await api.get(`/api/tasks/${userName}`);
        setTasks(response.data.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setIsTaskLoading(false);
      }
    };
    getTasks();
  }, [refetch]);

  return (
    <div>
      <div className="flex-grow flex flex-col items-center lg:mx-14 mx-1 bg-white">
        <div className="flex justify-between items-center w-full pt-3">
          <div className="w-[65%] border-b border-gray-600 flex items-center pb-1">
            <CiSquarePlus
              className="hover:bg-[#008DDA] hover:text-white rounded-full p-1 cursor-pointer"
              size={40}
              onClick={() => showNoticeDrawer()}
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
              className="w-[65%] scrollable"
              style={{ maxHeight: "86.2vh", overflowY: "auto" }}>
              <Notices notices={notices} />
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
              style={{ maxHeight: "86.2vh", overflowY: "auto" }}>
              <Tasks
                tasks={tasks}
                userName={userName}
                setRefetch={setRefetch}
              />
            </div>
          )}
        </div>
      </div>
      <NoticeDrawer
        companies={companies}
        open={openNotice}
        setOpen={setOpenNotice}
        setRefetch={setRefetch}
      />
      <TasksDrawer
        open={openTask}
        setOpen={setOpenTask}
        users={users}
        setRefetch={setRefetch}
      />
    </div>
  );
};

export default NoticeCommon;
