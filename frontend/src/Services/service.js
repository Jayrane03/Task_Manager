const BASE_URL = import.meta.env.MODE === 'production'
    ? 'https://task-manager-id0g.onrender.com'
    : 'http://localhost:5000';

export { BASE_URL };
