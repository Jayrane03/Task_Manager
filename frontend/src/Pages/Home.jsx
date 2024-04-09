import React, { useEffect, useState } from 'react';
// import Sidebar from '../components/sideBar';
import TaskBoard from '../components/taskBoard';
import { BASE_URL } from '../Services/service';

const Home = () => {
  const [userData, setUserData] = useState({});
  

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found in localStorage');
        }

        const response = await fetch(`${BASE_URL}/api/home`, {
          headers: {
            'x-access-token': token,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData(data.user);
        
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    fetchUserData();
  }, []);

  

  return (
    <div className="home">
      <h1 className="welcome">Welcome {userData.name}</h1>
      {/* <Sidebar /> */}
      <TaskBoard  userData={userData} />
    </div>
  );
};

export default Home;
