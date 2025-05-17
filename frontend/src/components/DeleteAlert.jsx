import React from 'react';

const DeleteAlert = ({ content, onDelete, onCancel }) => {
  return (
    <div
      role="alertdialog"
      aria-modal="true"
      className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full shadow-lg">
        <p className="text-sm text-gray-800 dark:text-gray-200">{content}</p>

        <div className="flex justify-end mt-6 space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Cancel
          </button>

          <button
            type="button"
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-rose-500 bg-rose-50 border border-rose-100 hover:bg-rose-100 transition"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAlert;
