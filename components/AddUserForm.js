'use client';

import { useForm } from 'react-hook-form';
import { addUser, updateUser } from '../lib/api';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function AddUserForm({ onUserSubmitted, initialData }) {
  const isEditing = !!initialData;
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: isEditing ? { name: initialData.name, email: initialData.email } : {},
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const onSubmit = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setApiError(null);

    try {
      let user;
      if (isEditing) {
        user = await updateUser(initialData._id, data.name, data.email);
      } else {
        user = await addUser(data.name, data.email);
      }
      await onUserSubmitted(user);
      reset();
      toast.success(isEditing ? 'User updated successfully!' : 'User added successfully!');
    } catch (error) {
      const errorMessage = error.message || (isEditing ? 'Failed to update user' : 'Failed to add user');
      setApiError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {apiError && (
        <div className="text-sm text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200 p-3 rounded-md">
          {apiError}
        </div>
      )}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Name
        </label>
        <input
          id="name"
          {...register('name', { required: 'Name is required' })}
          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
          disabled={isSubmitting}
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' },
          })}
          className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
          disabled={isSubmitting}
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full cursor-pointer bg-indigo-600 text-white px-4 py-3 rounded-md hover:bg-indigo-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update User' : 'Add User')}
      </button>
    </form>
  );
}