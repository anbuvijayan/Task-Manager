import React from "react";
import moment from "moment";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const TaskListTable = ({ tableData = [], onUpdate, onDelete }) => {
  const navigate = useNavigate();

  if (!tableData.length) {
    return (
      <p className="text-center text-gray-500 mt-5 text-base md:text-lg">
        No tasks found
      </p>
    );
  }

  const getStatusColor = (status) => {
    const base = "px-2 py-1 rounded-full text-xs font-semibold border inline-block";
    switch (status) {
      case "Completed":
        return `${base} bg-green-100 text-green-700 border-green-300`;
      case "Pending":
        return `${base} bg-purple-100 text-purple-700 border-purple-300`;
      case "In Progress":
        return `${base} bg-cyan-100 text-cyan-700 border-cyan-300`;
      default:
        return `${base} bg-gray-100 text-gray-500 border-gray-300`;
    }
  };

  const getPriorityColor = (priority) => {
    const base = "px-2 py-1 rounded-full text-xs font-semibold border inline-block";
    switch (priority) {
      case "High":
        return `${base} bg-red-100 text-red-700 border-red-300`;
      case "Medium":
        return `${base} bg-orange-100 text-orange-700 border-orange-300`;
      case "Low":
        return `${base} bg-green-100 text-green-700 border-green-300`;
      default:
        return `${base} bg-gray-100 text-gray-500 border-gray-300`;
    }
  };

  const convertDate = (dateValue) => {
    if (!dateValue) return null;
    if (typeof dateValue === "string" || dateValue instanceof Date) {
      return new Date(dateValue);
    }
    if (dateValue?.$date?.$numberLong) {
      return new Date(Number(dateValue.$date.$numberLong));
    }
    return null;
  };

  return (
    <div className="mt-4 w-full">
      <div className="overflow-x-auto rounded-lg shadow-md hidden md:block">
        <table
          className="min-w-full table-auto border-collapse border border-gray-200 dark:border-gray-700"
          role="table"
          aria-label="Task list"
        >
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr className="text-left text-sm text-gray-700 dark:text-gray-300 border-b border-gray-300 dark:border-gray-700">
              <th className="py-3 px-5 font-semibold whitespace-nowrap">Name</th>
              <th className="py-3 px-5 font-semibold whitespace-nowrap">Status</th>
              <th className="py-3 px-5 font-semibold whitespace-nowrap">Priority</th>
              <th className="py-3 px-5 font-semibold whitespace-nowrap">Start Date</th>
              <th className="py-3 px-5 font-semibold whitespace-nowrap">Due Date</th>
              <th className="py-3 px-5 font-semibold whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((task, index) => {
              const dueDate = convertDate(task.dueDate);
              const startDate = convertDate(task.createdAt);

              return (
                <tr
                  key={task._id || index}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm cursor-pointer"
                  tabIndex={0}
                  onClick={() => navigate(`/user/Work/${task._id}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      navigate(`/user/Work/${task._id}`);
                    }
                  }}
                  aria-label={`View task ${task.title}`}
                >
                  <td className="py-4 px-5 text-gray-800 dark:text-gray-200 max-w-xs truncate font-medium whitespace-nowrap">
                    {task.title}
                  </td>
                  <td className="py-4 px-5 whitespace-nowrap">
                    <span className={getStatusColor(task.status)}>{task.status}</span>
                  </td>
                  <td className="py-4 px-5 whitespace-nowrap">
                    <span className={getPriorityColor(task.priority)}>{task.priority}</span>
                  </td>
                  <td className="py-4 px-5 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {startDate ? moment(startDate).format("Do MMM YYYY") : "—"}
                  </td>
                  <td className="py-4 px-5 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {dueDate ? moment(dueDate).format("Do MMM YYYY") : "—"}
                  </td>
                  <td className="py-4 px-5 text-gray-500 flex gap-3 justify-center whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdate(task);
                      }}
                      aria-label={`Update task ${task.title}`}
                      className="p-1 rounded hover:bg-yellow-100 dark:hover:bg-yellow-600 dark:text-yellow-400"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(task._id);
                      }}
                      aria-label={`Delete task ${task.title}`}
                      className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-600 dark:text-red-400"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="md:hidden flex flex-col gap-4">
        {tableData.map((task, index) => {
          const dueDate = convertDate(task.dueDate);
          const startDate = convertDate(task.createdAt);
          return (
            <div
              key={task._id || index}
              tabIndex={0}
              role="button"
              onClick={() => navigate(`/user/Work/${task._id}`)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate(`/user/Work/${task._id}`);
                }
              }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
              aria-label={`View task ${task.title}`}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                {task.title}
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className={getStatusColor(task.status)}>{task.status}</span>
                <span className={getPriorityColor(task.priority)}>{task.priority}</span>
              </div>

              <div className="mt-3 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p>
                  <strong>Start Date:</strong>{" "}
                  {startDate ? moment(startDate).format("Do MMM YYYY") : "—"}
                </p>
                <p>
                  <strong>Due Date:</strong>{" "}
                  {dueDate ? moment(dueDate).format("Do MMM YYYY") : "—"}
                </p>
              </div>

              <div className="mt-4 flex gap-6 text-gray-500">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdate(task);
                  }}
                  aria-label={`Update task ${task.title}`}
                  className="hover:text-yellow-500 transition-colors"
                >
                  <FiEdit size={20} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(task._id);
                  }}
                  aria-label={`Delete task ${task.title}`}
                  className="hover:text-red-500 transition-colors"
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskListTable;
