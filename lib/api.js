import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const getUsers = async (page = 1, limit = 10) => {
  const response = await axios.get(`${API_URL}/users?page=${page}&limit=${limit}`);
  console.log("responsee",response)
  return response.data;
};

export async function getUserById(id) {
  try {
    const response = await axios.get(`${API_URL}/users/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user');
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

export async function updateUser(id, name, email) {
  try {
    const response = await axios.put(`${API_URL}/users/${id}`, { name, email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update user');
  }
}

export async function deleteUser(id) {
  try {
    const response = await axios.delete(`${API_URL}/users/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete user');
  }
}