'use client'; // Client component for animations

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function UserTable({ users, onEdit, onDelete }) {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const sortedUsers = [...users].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 shadow-md rounded-xl">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th
              className="py-4 px-6 text-left font-semibold text-gray-700 dark:text-gray-300 cursor-pointer"
              onClick={() => handleSort('name')}
            >
              Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th
              className="py-4 px-6 text-left font-semibold text-gray-700 dark:text-gray-300 cursor-pointer"
              onClick={() => handleSort('email')}
            >
              Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th className="py-4 px-6 text-left font-semibold text-gray-700 dark:text-gray-300">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((user, index) => (
            <motion.tr
              key={user?.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <td className="py-4 px-6 text-gray-800 dark:text-gray-100">{user.name}</td>
              <td className="py-4 px-6 text-gray-800 dark:text-gray-100">{user.email}</td>
              <td className="py-4 px-6 text-gray-800 dark:text-gray-100">
                <div className="flex space-x-4">
                  <button
                    onClick={() => onEdit(user)}
                    className="cursor-pointer text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    aria-label="Edit user"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(user)}
                    className="cursor-pointer text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    aria-label="Delete user"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0h4m-7 4h10" />
                    </svg>
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}