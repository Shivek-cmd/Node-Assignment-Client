// frontend/app/users/page.js
'use client'; // Make this a client component for dynamic updates

import { useState } from 'react';
import UserTable from '../../components/UserTable';
import AddUserForm from '../../components/AddUserForm';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import Toaster from 'react-hot-toast';

// Dummy users data (since no backend)
const dummyUsers = [
  { id: 1, name: 'Amit Sharma', email: 'amit.sharma@example.com' },
  { id: 2, name: 'Priya Singh', email: 'priya.singh@example.com' },
  { id: 3, name: 'Rahul Verma', email: 'rahul.verma@example.com' },
];

export default function UsersPage() {
  // State to manage users dynamically
  const [users, setUsers] = useState(dummyUsers);
  const [error, setError] = useState(null);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
        User Management
      </h1>

      <AddUserForm
        onUserAdded={(newUser) => {
          // Add new user to the state (no backend needed)
          setUsers([...users, { id: users.length + 1, ...newUser }]);
        }}
      />

      {error ? (
        <ErrorMessage message={error} />
      ) : users.length === 0 ? (
        <LoadingSpinner />
      ) : (
        <UserTable users={users} />
      )}
    </div>
  );
}