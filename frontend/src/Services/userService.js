// src/Services/userService.js
import { BASE_URL } from '../Services/service';
export const fetchAssignedTasks = async (assigneeId) => {
    try {
        const response = await fetch(`${BASE_URL}/task/assigned/${assigneeId}`);
        if (!response.ok) {
            // Check for specific status codes if needed, e.g., 404 for no tasks found
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch assigned tasks');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching assigned tasks:', error);
        throw error; // Re-throw to be caught by the component
    }
};

export const fetchUserData = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token not found');

    const res = await fetch(`${BASE_URL}/api/home`, {
      headers: { 'x-access-token': token },
    });

    if (!res.ok) throw new Error('Failed to fetch user');
    const data = await res.json();
    return data.user;
  } catch (err) {
    console.error('User fetch failed:', err.message);
    localStorage.removeItem('token');
    window.location.href = '/login';
    return null;
  }
};
