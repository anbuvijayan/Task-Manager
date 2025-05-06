import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-toastify";

const StatusBadge = ({ status }) => {
  const statusColors = {
    Pending: "bg-purple-100 text-purple-700",
    "In Progress": "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
  };

  return (
    <span className={`px-3 py-1 text-sm rounded-lg font-medium ${statusColors[status]}`}>
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
        <div className="text-center text-gray-500 mt-20">Loading task details...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{task.title || "Untitled Task"}</h1>
            <p className="text-gray-600 mt-2">{task.description || "No description provided."}</p>
          </div>
          <StatusBadge status={task.status} />
        </div>

        {/* Meta Info */}
        <div className="grid grid-cols-2 gap-6 text-sm text-gray-700 mb-6">
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
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-full rounded-full ${
                task.progress === 100 ? "bg-green-500" : "bg-blue-500"
              } transition-all duration-300`}
              style={{ width: `${task.progress || 0}%` }}
            />
          </div>
          <p className="text-right text-sm text-gray-500 mt-1">{task.progress || 0}% Completed</p>
        </div>

        {/* Checklist */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-semibold text-gray-900">Todo Checklist</h2>
            {saving && <span className="text-blue-600 text-sm animate-pulse">Saving...</span>}
          </div>

          {task.checklist.length > 0 ? (
            <ul className="space-y-3">
              {task.checklist.map((item, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-50 border px-4 py-2 rounded-lg">
                  <label className="flex items-center justify-between w-full cursor-pointer">
                    <span
                      className={`text-sm ${
                        item.completed ? "line-through text-gray-400" : "text-gray-800"
                      }`}
                    >
                      {item.title}
                    </span>
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleChecklistToggle(index)}
                      disabled={saving}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                    />
                  </label>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">No checklist items.</p>
          )}
        </div>

        {/* Attachments */}
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-4">Attachments</h2>
          {task.attachments?.length > 0 ? (
            <ul className="space-y-2">
              {task.attachments.map((file, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between px-4 py-2 bg-gray-100 rounded-lg text-blue-700"
                >
                  <a
                    href={file.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {file.name || file}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">No attachments found.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TaskWork;
