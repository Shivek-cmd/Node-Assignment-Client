'use client'; // Client component for animations

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function UserTable({ users }) {
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
        <thead className="bg-indigo-100 dark:bg-indigo-900">
          <tr>
            <th 
              className="py-4 px-6 text-left font-semibold text-indigo-700 dark:text-indigo-300 cursor-pointer" 
              onClick={() => handleSort('name')}
            >
              Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th 
              className="py-4 px-6 text-left font-semibold text-indigo-700 dark:text-indigo-300 cursor-pointer" 
              onClick={() => handleSort('email')}
            >
              Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
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
              className="border-b hover:bg-indigo-50 dark:hover:bg-indigo-800 transition-colors"
            >
              <td className="py-4 px-6 text-gray-800 dark:text-gray-100">{user.name}</td>
              <td className="py-4 px-6 text-gray-800 dark:text-gray-100">{user.email}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}