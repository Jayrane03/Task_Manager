import React, { useState } from 'react';
import '../Styles/component.css';
import { BASE_URL } from '../Services/service';

const TaskCard = ({ task, fetchTasks }) => {
  const [updateModel, setUpdateModel] = useState(false);
  const [taskData, setTaskData] = useState({
    title: task.title,
    description: task.description,
    team: task.team,
    assignee: task.assignee,
    priority: task.priority,
    status: task.status,
  });

  const handleUpdateModel = () => {
    setUpdateModel(true);
  };

  const handleCloseModal = () => {
    setUpdateModel(false);
  };

  const handleDelete = async (id) => {
    try {
      if (window.confirm(`Are you sure you want to delete the task assigned to ${task.assignee.toUpperCase()}?`)) {
        await fetch(`${BASE_URL}/task/delete/${id}`, {
          method: 'DELETE',
        });
        fetchTasks(prevTasks => prevTasks.filter(t => t._id !== id));
        console.log('Task deleted successfully');
      } else {
        console.error('Failed to delete task:');
      }
    } catch (error) {
      console.error('Error deleting task:', error.message);
    }
  };

  const handleUpdate = async (event, id) => {
    event.preventDefault();
  
    try {
      const res = await fetch(`${BASE_URL}/task/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
  
      if (res.status === 200) {
        const updatedTask = { ...task, ...taskData };
        setUpdateModel(false);
        setTaskData(updatedTask);
        fetchTasks(prevTasks => prevTasks.filter(t => t._id !== id));
        console.log('Task updated successfully');
      } else {
        throw new Error('Failed to update task');
      }
      } catch (error) {     }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTaskData({
      ...taskData,
      [name]: value,
    });
  
    if (name === 'status') {
      const updatedTask = { ...taskData, status: value };
      fetchTasks(updatedTask);
    }
  };

  const getStatusClassName = (status) => {
    switch (status) {
      case 'Pending':
        return 'pending';
      case 'In Progress':
        return 'in-progress';
      case 'Completed':
        return 'completed';
      case 'Deployed':
        return 'deployed';
      case 'Deferred':
        return 'deferred';
      default:
        return '';
    }
  };


  return (
    <div className="task-cards" key={task._id}>
      <div className={`task-card ${getStatusClassName(taskData.status)}`}>
        <h3>{taskData.title}</h3>
        <span>Description: {taskData.description}</span>
        <div className="task-details">
          <span className="status">Status: {taskData.status}</span>
          <span className="assignee">Assignee: {taskData.assignee}</span>
          <span className="priority">Priority: {taskData.priority}</span>
          <span className="team">Team: {taskData.team}</span>
        </div>
        <div className="task_button">
          <button className='edit-task' onClick={handleUpdateModel}>Edit</button>
          <button className='delete-task' onClick={() => handleDelete(task._id)}>Delete</button>
        </div>
        {updateModel && (
          <div className="modal_overlay">
            <div className="modal_content">
              <span className="close_button" onClick={handleCloseModal}>&times;</span>
              <h2>Edit Task</h2>
              <form onSubmit={(event) => handleUpdate(event, task._id)}>
                <div className="input_flex">
                  <div className="input_container">
                    <label htmlFor="title">Title</label>
                    <input type="text" name="title" id="title" value={taskData.title} onChange={handleChange} />
                  </div>
                  <div className="input_container">
                    <label htmlFor="desc">Description</label>
                    <textarea name="description" id="desc" rows="6" cols="50" value={taskData.description} onChange={handleChange} />
                  </div>
                  <div className="input_container">
                    <label htmlFor="team">Team</label>
                    <input type="text" name="team" id="team" value={taskData.team} onChange={handleChange} />
                  </div>
                  <div className="input_container">
                    <label htmlFor="assignees">Assignees</label>
                    <input type="text" name="assignee" id="assignee" value={taskData.assignee} onChange={handleChange} />
                  </div>
                  <div className="input_container">
                    <label htmlFor="priority">Priority</label>
                    <select id="priority" name="priority" value={taskData.priority} onChange={handleChange}>
                      <option value="">Select Priority</option>
                      <option value="P0">P0</option>
                      <option value="P1">P1</option>
                      <option value="P2">P2</option>
                    </select>
                  </div>
                  <div className="input_container">
                    <label htmlFor="status">Status</label>
                    <select id="status" name="status" value={taskData.status} onChange={handleChange}>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Deployed">Deployed</option>
                      <option value="Deferred">Deferred</option>
                    </select>
                  </div>
                  <div className="create">
                    <button type="submit">Edit Task</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
