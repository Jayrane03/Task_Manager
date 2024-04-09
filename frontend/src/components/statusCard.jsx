import React from 'react';
import TaskCard from './taskCard';


const StatusCard = ({ tasks , fetchTasks }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'gray'; // Light red
      case 'In Progress':
        return 'orange'; // Light yellow
      case 'Completed':
        return 'green'; // Light green
      case 'Deployed':
        return 'rgb(78, 78, 172)'; // Light blue
      case 'Deferred':
        return 'palevioletred'; // Light gray
      default:
        return '#ffffff'; // White (default)
    }
  };

  return (
    <div className="status-card">
   
      {Object.entries(tasks).map(([status, statusTasks]) => (
        <div key={status} className="status-pillar">
          <h2  style={{ backgroundColor: getStatusColor(status) , color:"black",borderRadius:"10px",margin:"20px", width:"16vw" }}>{status}</h2>
          <div className="task-cards">
            {statusTasks.map((task, index) => (
              <TaskCard key={index} task={task} fetchTasks={fetchTasks}/>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatusCard;
