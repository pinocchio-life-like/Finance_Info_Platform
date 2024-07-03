import "./NoticeCommon.css";
import Tasks from "../Tasks/Tasks";
import Notices from "../Notices/Notices";
import { Button } from "antd";
import { useEffect, useState } from "react";
import TasksDrawer from "./TasksDrawer";
import NoticeDrawer from "./NoticeDrawer";
import api from "../../../utils/api";

const NoticeCommon = () => {
  const [openTask, setOpenTask] = useState(false);
  const [openNotice, setOpenNotice] = useState(false);
  const [companies, setCompanies] = useState([]);
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
    getAllCompanies();
  }, []);

  return (
    <div>
      <div className="flex-grow flex flex-col items-center lg:mx-14 mx-1 bg-white">
        <div className="flex justify-between items-center w-full pt-3">
          <div className="w-3/4 border-b border-gray-600 mr-2 flex justify-between items-center pb-1">
            <a className={`px-1 cursor-pointer`} style={{ lineHeight: "2rem" }}>
              Notices
            </a>
            <Button
              onClick={() => showNoticeDrawer()}
              className="qa-button font-semibold">
              Add New Notice
            </Button>
          </div>
          <div className="w-1/4 border-b border-gray-600 ml-2 flex justify-between items-center pb-1">
            <a className={`px-1 cursor-pointer`} style={{ lineHeight: "2rem" }}>
              Tasks
            </a>
            <Button
              onClick={() => showTaskDrawer()}
              className="qa-button font-semibold">
              Create Task
            </Button>
          </div>
        </div>
        <div className="timeline_container w-full flex justify-between">
          <div className="w-3/4 mr-2">
            <Notices />
          </div>
          <div className="w-1/4 ml-2">
            <Tasks />
          </div>
        </div>
      </div>
      <NoticeDrawer
        companies={companies}
        open={openNotice}
        setOpen={setOpenNotice}
      />
      <TasksDrawer open={openTask} setOpen={setOpenTask} />
    </div>
  );
};

export default NoticeCommon;
