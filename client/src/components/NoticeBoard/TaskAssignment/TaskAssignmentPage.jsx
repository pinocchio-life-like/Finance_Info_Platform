import React, { useEffect, useState } from "react";
import { Card, Col, List, Row, Typography, Button } from "antd";
import api from "../../../utils/api";
import { jwtDecode } from "jwt-decode";

const { Title } = Typography;

const TaskAssignmentPage = () => {
  const [tasks, setTasks] = useState([]);
  const [updateFlag, setUpdateFlag] = useState(false);
  const [taskId, setTaskId] = useState(null);

  const token = localStorage.getItem("token");
  let userId = null;
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken.userId;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  useEffect(() => {
    async function fetchTask(id) {
      try {
        const response = await api.get(`api/task/${id}`);
        if (response) {
          setTasks(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }

    if (userId) {
      fetchTask(userId);
    }
  }, [userId]);

  const toggleTaskStatus = async (index) => {
    const updatedTasks = [...tasks];
    const task = updatedTasks[index];
    task.task_status = "Completed";
    setTasks(updatedTasks);
  
  
    try {
      const res = await api.put(`/api/task/${task.task_id}`, { task_status: task.task_status });
      if (res.status === 200) {
        console.log('Task status updated successfully');
      } else {
        console.error('Failed to update task status');
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };
  

  const renderTaskByStatus = () => {
    const statuses = ["Pending", "Completed", "Not Started"];

    return statuses.map((status, index) => {
      const filteredTasks = tasks.filter(
        (task) => task.task_status === status
      );

      return (
        <Col span={8} key={index}>
          <Card
            title={
              <Title level={3} className="font-bold">
                {status}
              </Title>
            }
            style={{ marginBottom: "20px" }}
          >
            <List
              dataSource={filteredTasks}
              renderItem={(item, itemIndex) => (
                <List.Item key={itemIndex}>
                  <Card title={item.task_name}>
                    <p>
                      <strong>Task Description: </strong>
                      {item.task_description}
                    </p>
                    <p>
                      <strong>Posted Date: </strong>
                      {item.posted_date}
                    </p>
                    <p>
                      <strong>Deadline: </strong>
                      {item.task_due_date}
                    </p>
                    {item.task_status !== "Completed" && (
                      <Button className="float-right mt-4 bg-red-500"
                        type="primary"
                        onClick={() =>
                          toggleTaskStatus(
                            tasks.findIndex((t) => t === item)
                          )
                        }
                      >
                        Mark as Completed
                      </Button>
                    )}
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      );
    });
  };

  return (
    <div className="flex flex-col h-screen m-5 p-4">
      <h1 className="text-center mb-8 font-bold text-2xl">
        Tasks Assignment to Me
      </h1>
      <div className="flex">
        <Row gutter={[16, 16]}>{renderTaskByStatus()}</Row>
      </div>
    </div>
  );
};

export default TaskAssignmentPage;
