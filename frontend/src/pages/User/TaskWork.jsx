import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-toastify";
import { FiFile, FiArrowLeft } from "react-icons/fi";

const StatusBadge = ({ status }) => {
  const statusColors = {
    Pending: "bg-purple-100 text-purple-700 dark:bg-purple-700 dark:text-purple-100",
    "In Progress": "bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100",
    Completed: "bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100",
  };

  return (
    <span
      className={`px-3 py-1 text-sm rounded-lg font-medium select-none ${statusColors[status]}`}
      aria-label={`Status: ${status}`}
    >
      {status}
    </span>
  );
};

const TaskWork = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId));
        const taskData = res.data.task;

        const normalizedChecklist = taskData.checklist.map((item) => ({
          title: item.title || item.text,
          completed: item.completed,
        }));

        setTask({ ...taskData, checklist: normalizedChecklist });
      } catch (error) {
        toast.error("Failed to fetch task");
        navigate("/user/tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId, navigate]);

  const updateTaskOnServer = async (updatedTask) => {
    try {
      setSaving(true);
      const url = API_PATHS.TASKS.UPDATE_TASK_CHECKLIST(taskId);
      const sanitizedChecklist = updatedTask.checklist.map((item) => ({
        title: item.title,
        completed: item.completed,
      }));

      await axiosInstance.patch(url, {
        checklist: sanitizedChecklist,
        progress: updatedTask.progress,
        status: updatedTask.status,
      });

      toast.success("Checklist saved");
    } catch (error) {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleChecklistToggle = async (index) => {
    const updatedChecklist = [...task.checklist];
    updatedChecklist[index].completed = !updatedChecklist[index].completed;

    const completedCount = updatedChecklist.filter((item) => item.completed).length;
    const progress = Math.round((completedCount / updatedChecklist.length) * 100);
    const status =
      completedCount === updatedChecklist.length
        ? "Completed"
        : completedCount === 0
        ? "Pending"
        : "In Progress";

    const updatedTask = {
      ...task,
      checklist: updatedChecklist,
      progress,
      status,
    };

    setTask(updatedTask);
    await updateTaskOnServer(updatedTask);
  };

  if (loading || !task) {
    return (
      <DashboardLayout activeMenu="My Tasks">
        <div className="text-center text-gray-500 dark:text-gray-400 mt-20">Loading task details...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md transition-colors duration-300">
        {/* Back Button + Header */}
        <div className="flex items-center mb-6 space-x-4">
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            <FiArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{task.title || "Untitled Task"}</h1>
        </div>

        {/* Description and status */}
        <div className="flex justify-between items-start sm:items-center mb-6 gap-4">
          <p className="text-gray-600 dark:text-gray-300 mt-2 flex-1">{task.description || "No description provided."}</p>
          <StatusBadge status={task.status} />
        </div>

        {/* Meta Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700 dark:text-gray-300 mb-6">
          <div>
            <p className="font-medium">Priority</p>
            <p>{task.priority}</p>
          </div>
          <div>
            <p className="font-medium">Due Date</p>
            <p>{new Date(task.dueDate).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6" aria-label={`Progress: ${task.progress || 0}%`}>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ease-in-out ${
                task.progress === 100 ? "bg-green-500" : "bg-blue-500"
              }`}
              style={{ width: `${task.progress || 0}%` }}
              role="progressbar"
              aria-valuenow={task.progress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <p className="text-right text-sm text-gray-500 dark:text-gray-400 mt-1">{task.progress || 0}% Completed</p>
        </div>

        {/* Checklist */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Todo Checklist</h2>
            {saving && <span className="text-blue-600 dark:text-blue-400 text-sm animate-pulse select-none">Saving...</span>}
          </div>

          {task.checklist.length > 0 ? (
            <ul className="space-y-3 sm:space-y-2">
              {task.checklist.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-4 py-2 rounded-lg hover:shadow-sm transition cursor-pointer"
                >
                  <label className="flex items-center justify-between w-full cursor-pointer select-none" aria-label={`Mark ${item.title} as ${item.completed ? "incomplete" : "complete"}`}>
                    <span
                      className={`text-sm ${
                        item.completed ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {item.title}
                    </span>
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleChecklistToggle(index)}
                      disabled={saving}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600"
                      aria-checked={item.completed}
                    />
                  </label>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500">No checklist items.</p>
          )}
        </div>

        {/* Attachments */}
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Attachments</h2>
          {task.attachments?.length > 0 ? (
            <ul className="space-y-2">
              {task.attachments.map((file, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-blue-700 dark:text-blue-400 hover:underline transition"
                >
                  <a
                    href={file.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 w-full"
                  >
                    <FiFile className="text-lg" />
                    <span>{file.name || file}</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500">No attachments found.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TaskWork;
