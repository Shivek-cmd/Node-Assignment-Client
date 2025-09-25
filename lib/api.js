// frontend/lib/api.js
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export async function getUsers() {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch users');
  }
}

export async function addUser(name, email) {
  try {
    const response = await axios.post(`${API_URL}/users`, { name, email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add user');
  }
}