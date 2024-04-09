import React, { useState, useEffect } from "react";
import "../Styles/component.css";
import { BASE_URL } from "../Services/service";
// import TaskCard from './taskCard';
import StatusCard from "./statusCard";

const TaskBoard = ({ userData }) => {
  // console.log(userData._id, "2222222222");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userD, setUserD] = useState(userData);

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    team: "",
    user: userD._id,
    assignee: "",
    priority: "",
    status: "Pending",
  });

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();

  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${BASE_URL}/task`);
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const tasksData = await response.json();
      setTasks(tasksData);
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
      // Handle error (e.g., set an error state)
    }
  };

  const handleAddTaskClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePriorityChange = (event) => {
    const priorityValue = event.target.value;
    setTaskData((prevTaskData) => ({
      ...prevTaskData,
      priority: priorityValue,
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTaskData((prevTaskData) => ({
      ...prevTaskData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(taskData);
      const response = await fetch(`${BASE_URL}/task/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        console.log("Task created successfully");
        fetchTasks(); 
        setTaskData({
          title: "",
          description: "",
          team: "",
          assignee: "",
          priority: "",
          user: userD._id,
          status: "Pending",
        });
        setIsModalOpen(false);
      } else {
        console.error("Failed to create task:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating task:", error.message);
    }
  };

  const handleLogout = () => {
    window.location.href = "/login";
    alert("Logout Successfully");
  };

  return (
    <div className="task_board">
      <h1>Task Board</h1>
      <div className="logout_btn">
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div className="add_task">
        <button onClick={handleAddTaskClick}>Add Task</button>
      </div>
      {isModalOpen && (
        <div className="modal_overlay">
          <div className="modal_content">
            <span className="close_button" onClick={handleCloseModal}>
              &times;
            </span>
            <h2>Create Task</h2>
            <form onSubmit={handleSubmit}>
              <div className="input_flex">
                <div className="input_container">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={taskData.title}
                    onChange={handleChange}
                  />
                </div>
                <div className="input_container">
                  <label htmlFor="desc">Description</label>
                  <textarea
                    name="description"
                    id="desc"
                    rows="6"
                    cols="50"
                    value={taskData.description}
                    onChange={handleChange}
                  />
                </div>
                <div className="input_container">
                  <label htmlFor="team">Team</label>
                  <input
                    type="text"
                    name="team"
                    id="team"
                    value={taskData.team}
                    onChange={handleChange}
                  />
                </div>
                <div className="input_container">
                  <label htmlFor="assignees">Assignees</label>
                  <input
                    type="text"
                    name="assignee"
                    id="assignee"
                    value={taskData.assignee}
                    onChange={handleChange}
                  />
                </div>
                <div className="input_container">
                  <label htmlFor="priority">Priority</label>
                  <select
                    id="priority"
                    name="priority"
                    value={taskData.priority}
                    onChange={handlePriorityChange}
                  >
                    <option value="">Select Priority</option>
                    <option value="P0">P0</option>
                    <option value="P1">P1</option>
                    <option value="P2">P2</option>
                  </select>
                </div>
                <div className="input_container">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={taskData.status}
                    onChange={handleChange}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Deployed">Deployed</option>
                    <option value="Deferred">Deferred</option>
                  </select>
                </div>
                <div className="create">
                  <button type="submit">Create Task</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      <StatusCard tasks={tasks}  fetchTasks={fetchTasks} />
    </div>
  );
};

export default TaskBoard;
