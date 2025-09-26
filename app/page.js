'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import UserTable from '../components/UserTable';
import AddUserForm from '../components/AddUserForm';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import toast from 'react-hot-toast';
import { getUsers, deleteUser } from '@/lib/api';

export default function Home() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    limit: 10,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [jumpToPage, setJumpToPage] = useState('');

  const fetchUsers = async (page = 1) => {
    setIsLoading(true);
    try {
      const data = await getUsers(page, pagination.limit, searchTerm);
      console.log('dataaa', data);
      setUsers(data.users || []);
      setPagination((prev) => ({
        ...prev,
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalUsers: data.totalUsers,
      }));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedMode);
    if (savedMode) {
      document.documentElement.classList.add('dark');
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers(1); // Reset to page 1 on search
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchUsers(newPage);
    }
  };

  const handleJumpToPage = () => {
    const page = parseInt(jumpToPage);
    if (page >= 1 && page <= pagination.totalPages && !isNaN(page)) {
      handlePageChange(page);
      setJumpToPage('');
    } else {
      toast.error('Invalid page number');
    }
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', newMode);
  };

  const handleUserAdded = async () => {
    try {
      await fetchUsers(pagination.currentPage);
      toast.success('User added successfully!');
    } catch (err) {
      toast.error('Failed to refresh user list');
    } finally {
      setShowModal(false);
      setSelectedUser(null);
    }
  };

  const handleUserEdited = async () => {
    try {
      await fetchUsers(pagination.currentPage);
      toast.success('User updated successfully!');
    } catch (err) {
      toast.error('Failed to refresh user list');
    } finally {
      setShowModal(false);
      setSelectedUser(null);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser(selectedUser._id);
      await fetchUsers(pagination.currentPage);
      toast.success('User deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete user');
    } finally {
      setShowDeleteModal(false);
      setSelectedUser(null);
    }
  };

  // Calculate pagination range
  const maxPagesToShow = 5; 
  const halfRange = Math.floor(maxPagesToShow / 2);
  let startPage = Math.max(1, pagination.currentPage - halfRange);
  let endPage = Math.min(pagination.totalPages, startPage + maxPagesToShow - 1);

  // Adjust startPage if endPage is at the maximum
  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans">
      <header className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            User Management
          </h1>
         
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center space-x-4">
              <svg className="w-8 h-8 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v1.5M7 20H2v-2a3 3 0 015.356-1.857M7 20v1.5m6-13l-2 3h4l-2 3m-2-6h.01M12 3V3m0 18v0" />
              </svg>
              <div>
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Total Users</h2>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{pagination.totalUsers}</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mb-8">
          <button
            onClick={() => {
              setSelectedUser(null);
              setShowModal(true);
            }}
            className="cursor-pointer bg-indigo-600 dark:bg-indigo-700 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-all duration-200 font-medium shadow-md"
          >
            Add New User
          </button>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : users.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-12 bg-white dark:bg-gray-900 rounded-2xl shadow-xl">
            <p className="text-xl font-medium">No users found. Add one using the button above!</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">User List</h2>
            <UserTable
              users={users}
              onEdit={(user) => {
                setSelectedUser(user);
                setShowModal(true);
              }}
              onDelete={(user) => {
                setSelectedUser(user);
                setShowDeleteModal(true);
              }}
            />
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-gray-600 dark:text-gray-300">
                Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{' '}
                {Math.min(pagination.currentPage * pagination.limit, pagination.totalUsers)} of{' '}
                {pagination.totalUsers} users
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={pagination.currentPage === 1}
                  className="cursor-pointer px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  First
                </button>
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="cursor-pointer px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex items-center space-x-2">
                  {pageNumbers.map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-xl ${
                        pagination.currentPage === page
                          ? 'bg-indigo-600 text-white cursor-pointer'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-pointer'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="cursor-pointer px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
                <button
                  onClick={() => handlePageChange(pagination.totalPages)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="cursor-pointer px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Last
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={jumpToPage}
                  onChange={(e) => setJumpToPage(e.target.value)}
                  placeholder="Go to page"
                  className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 w-24"
                />
                <button
                  onClick={handleJumpToPage}
                  className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                >
                  Go
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-md flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              {selectedUser ? 'Edit User' : 'Add New User'}
            </h2>
            <AddUserForm
              onUserSubmitted={selectedUser ? handleUserEdited : handleUserAdded}
              initialData={selectedUser}
            />
            <button
              onClick={() => {
                setShowModal(false);
                setSelectedUser(null);
              }}
              className="cursor-pointer mt-4 w-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm font-medium transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}

      {showDeleteModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-md flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Confirm Delete</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete <span className="font-semibold">{selectedUser?.name}</span>?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedUser(null);
                }}
                className="cursor-pointer px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 font-medium"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}