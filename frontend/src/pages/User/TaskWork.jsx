import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-toastify";

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusStyles = {
    Pending: "bg-purple-100 text-purple-700",
    "In Progress": "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
  };

  return (
    <span className={`px-3 py-1 rounded-md text-xs font-medium ${statusStyles[status]}`}>
      {status}
    </span>
  );
};

const TaskWork = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId));
        const taskData = res.data.task;

        const normalizedChecklist = taskData.checklist.map(item => ({
          title: item.title || item.text,
          completed: item.completed,
        }));

        setTask({
          ...taskData,
          checklist: normalizedChecklist,
        });
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
      const url = API_PATHS.TASKS.UPDATE_TASK_CHECKLIST(taskId);
      const sanitizedChecklist = updatedTask.checklist.map(item => ({
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
      console.error("❌ PATCH failed", error?.response || error);
      toast.error("Failed to save changes");
    }
  };

  const handleChecklistToggle = async (index) => {
    const updatedChecklist = [...task.checklist];
    updatedChecklist[index].completed = !updatedChecklist[index].completed;

    const completedCount = updatedChecklist.filter(item => item.completed).length;
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
      <DashboardLayout activeMenu="View Tasks">
        <div className="text-center mt-10 text-gray-500">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="View Tasks">
      <div className="max-w-3xl mx-auto mt-8 px-4">
        {/* Task Header */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">{task.title}</h1>
              <p className="text-gray-600 mt-1">{task.description}</p>
            </div>
            <StatusBadge status={task.status} />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mt-4">
            <div>
              <p className="font-medium">Priority</p>
              <p>{task.priority}</p>
            </div>
            <div>
              <p className="font-medium">Due Date</p>
              <p>{new Date(task.dueDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                task.progress === 100 ? "bg-green-500" : "bg-blue-500"
              }`}
              style={{ width: `${task.progress || 0}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-1 text-right">{task.progress || 0}% Completed</p>
        </div>

        {/* Checklist */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-sm">
          <h2 className="font-semibold text-gray-800 text-base mb-4">Todo Checklist</h2>
          {task.checklist.length > 0 ? (
            <ul className="space-y-3">
              {task.checklist.map((item, index) => (
                <li key={index} className="flex items-center justify-between border px-4 py-2 rounded-lg bg-gray-50">
                  <span className={`text-sm ${item.completed ? "line-through text-gray-400" : "text-gray-700"}`}>
                    {item.title}
                  </span>
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => handleChecklistToggle(index)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">No checklist items.</p>
          )}
        </div>

        {/* Attachments */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-sm">
          <h2 className="font-semibold text-gray-800 text-base mb-4">Attachments</h2>
          {task.attachments?.length > 0 ? (
            <ul className="list-disc list-inside text-blue-600 space-y-2">
              {task.attachments.map((file, idx) => (
                <li key={idx}>
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
