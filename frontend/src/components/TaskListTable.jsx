import React from 'react';
import moment from 'moment';
import { LuPin } from 'react-icons/lu';

const sampleData = [
  {
    _id: '1',
    title: 'Design Login Page',
    status: 'In Progress',
    priority: 'High',
    createdAt: new Date(),
    pinned: true,
  },
  {
    _id: '2',
    title: 'Write API Docs',
    status: 'Completed',
    priority: 'Medium',
    createdAt: new Date('2024-12-20'),
    pinned: false,
  },
  {
    _id: '3',
    title: 'Client Feedback Review',
    status: 'Pending',
    priority: 'Low',
    createdAt: new Date('2025-01-12'),
    pinned: false,
  },
];

const TaskListTable = ({ tableData = sampleData }) => {
  if (!tableData.length) {
    return <p className="text-center text-gray-500 mt-5">No tasks found</p>;
  }

  const sortedData = [...tableData].sort((a, b) =>
    b.pinned === a.pinned ? 0 : b.pinned ? -1 : 1
  );

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-600 border border-green-200';
      case 'Pending':
        return 'bg-purple-100 text-purple-600 border border-purple-200';
      case 'In Progress':
        return 'bg-cyan-100 text-cyan-600 border border-cyan-200';
      default:
        return 'bg-gray-100 text-gray-500 border border-gray-200';
    }
  };

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-600 border border-red-200';
      case 'Medium':
        return 'bg-orange-100 text-orange-600 border border-orange-200';
      case 'Low':
        return 'bg-green-100 text-green-600 border border-green-200';
      default:
        return 'bg-gray-100 text-gray-500 border border-gray-200';
    }
  };

  const convertBsonDateToJsDate = (dateValue) => {
    if (!dateValue) return null;
    if (typeof dateValue === 'string' || dateValue instanceof Date) {
      return new Date(dateValue);
    }
    if (dateValue?.$date?.$numberLong) {
      return new Date(parseInt(dateValue.$date.$numberLong, 10));
    }
    return null;
  };

  return (
    <div className="overflow-x-auto mt-4 w-full">
      {/* Desktop Table */}
      <table className="min-w-full hidden md:table">
        <thead>
          <tr className="text-left text-sm text-gray-700">
            <th className="py-3 px-4 font-medium">Name</th>
            <th className="py-3 px-4 font-medium">Status</th>
            <th className="py-3 px-4 font-medium">Priority</th>
            <th className="py-3 px-4 font-medium">Created On</th>
            <th className="py-3 px-4 font-medium">Pinned</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((task, index) => {
            const createdDate = convertBsonDateToJsDate(task.createdAt);
            return (
              <tr key={task._id || index} className="border-t border-gray-200 hover:bg-gray-50 text-sm">
                <td className="py-4 px-4 text-gray-800 max-w-xs truncate">{task.title}</td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(task.status)}`}>
                    {task.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadgeColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </td>
                <td className="py-4 px-4 text-gray-600">
                  {createdDate && !isNaN(createdDate)
                    ? moment(createdDate).format('Do MMM YYYY')
                    : 'N/A'}
                </td>
                <td className="py-4 px-4">
                  {task.pinned && (
                    <LuPin className="text-yellow-500" title="Pinned" aria-label="Pinned task" />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4 mt-4">
        {sortedData.map((task, index) => {
          const createdDate = convertBsonDateToJsDate(task.createdAt);
          return (
            <div
              key={task._id || index}
              className="border border-gray-200 rounded-xl p-4 shadow-sm bg-white"
            >
              <div className="flex justify-between items-start">
                <div className="w-5/6">
                  <h3 className="text-base font-semibold text-gray-900 break-words line-clamp-1">
                    {task.title}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2 items-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(task.status)}`}>
                      {task.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadgeColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
                {task.pinned && (
                  <LuPin className="text-yellow-500" title="Pinned" aria-label="Pinned task" />
                )}
              </div>
              <div className="mt-3 text-xs text-gray-600">
                {createdDate && !isNaN(createdDate)
                  ? moment(createdDate).format('Do MMM YYYY')
                  : 'N/A'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskListTable;
