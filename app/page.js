'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import UserTable from '../components/UserTable';
import AddUserForm from '../components/AddUserForm';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import toast from 'react-hot-toast';
import { getUsers ,addUser } from '@/lib/api';

const dummyUsers = [
  { id: 1, name: 'Amit Sharma', email: 'amit.sharma@example.com' },
  { id: 2, name: 'Priya Singh', email: 'priya.singh@example.com' },
  { id: 3, name: 'Rahul Verma', email: 'rahul.verma@example.com' },
];

export default function Home() {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
  const savedMode = localStorage.getItem('darkMode') === 'true';
  setIsDarkMode(savedMode);
  if (savedMode) {
    document.documentElement.classList.add('dark');
  }

  const fetchUsers = async () => {
    try {
      const usersFromAPI = await getUsers();
      setUsers(usersFromAPI);
    } catch (err) {
      setError(err.message);
    }
  };

  fetchUsers();
}, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', newMode);
  };

  const filteredUsers = users?.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  if (!users) {
  return <LoadingSpinner />;
}

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <aside className="fixed top-0 left-0 h-full w-20 bg-gray-800 dark:bg-black shadow-lg transition-all duration-300 lg:w-56">
        <div className="p-4 flex justify-center lg:justify-start">
          <h2 className="text-xl font-bold text-white hidden lg:block">Dashboard</h2>
          <svg className="w-8 h-8 text-white lg:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <nav className="mt-4">
          <ul>
            <li className="p-4 text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-950 cursor-pointer flex justify-center lg:justify-start">
              <svg className="w-6 h-6 lg:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              <span className="hidden lg:block">Overview</span>
            </li>
            <li className="p-4 text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-950 cursor-pointer flex justify-center lg:justify-start">
              <svg className="w-6 h-6 lg:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="hidden lg:block">Users</span>
            </li>
            <li className="p-4 text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-950 cursor-pointer flex justify-center lg:justify-start">
              <svg className="w-6 h-6 lg:mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" />
              </svg>
              <span className="hidden lg:block">Settings</span>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="ml-20 lg:ml-56">
        <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
          <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
              User Management Dashboard
            </h1>
            <div className="flex items-center space-x-3 mt-3 sm:mt-0">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-gray-500 focus:border-gray-500 w-full sm:w-64"
              />
              <button
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                onClick={toggleDarkMode}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v1.5M7 20H2v-2a3 3 0 015.356-1.857M7 20v1.5m6-13l-2 3h4l-2 3m-2-6h.01M12 3V3m0 18v0" />
                </svg>
                <div>
                  <h2 className="text-md font-semibold text-gray-800 dark:text-gray-100">Total Users</h2>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{users?.length}</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                {/* <div>
                  <h2 className="text-md font-semibold text-gray-800 dark:text-gray-100">New Users (This Month)</h2>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">+{users?.length > 3 ? users?.length - 3 : 0}</p>
                </div> */}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {/* <div>
                  <h2 className="text-md font-semibold text-gray-800 dark:text-gray-100">Active Users</h2>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{Math.min(users?.length, 50)}</p>
                </div> */}
              </div>
            </motion.div>
          </div>

          <div className="mb-6">
            <button
              onClick={() => setShowModal(true)}
              className="bg-gray-900 dark:bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors shadow-md"
            >
              Add New User
            </button>
          </div>

          {error ? (
            <ErrorMessage message={error} />
          ) : filteredUsers?.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-300 py-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              No users found. Add one using the button above!
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">User List</h2>
              <UserTable users={filteredUsers} />
            </div>
          )}
        </main>
      </div>

      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm"
          >
            <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">Add New User</h2>
            <AddUserForm
            onUserAdded={async (newUser) => {
              try {
                const createdUser = await addUser(newUser.name, newUser.email);
                setUsers([...users, createdUser]);
                setShowModal(false);
                toast.success('User added successfully!');
              } catch (err) {
                toast.error(err.message);
              }
            }}
          />
            <button
              onClick={() => setShowModal(false)}
              className="mt-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}