import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { PRIORITY_DATA } from "../../utils/data";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { LuTrash2 } from "react-icons/lu";
import SelectDropdown from "../../components/Inputs/SelectDropdown";
import TodoListInput from "../../components/Inputs/TodoListInput";
import AddAttachmentsInput from "../../components/Inputs/AddAttachmentsInput";
import Modal from "../../components/Modal";
import DeleteAlert from "../../components/DeleteAlert";
import Progress from "../../components/layouts/Progress";

const CreateTask = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: "",
    checklist: [],
    attachments: [],
  });

  const [currentTask, setCurrentTask] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleValueChange = (key, value) => {
    setTaskData((prev) => ({ ...prev, [key]: value }));
  };

  const clearData = () => {
    setTaskData({
      title: "",
      description: "",
      priority: "Low",
      dueDate: "",
      checklist: [],
      attachments: [],
    });
  };

  const createTask = async () => {
    setLoading(true);
    try {
      const checklist = taskData.checklist.map((item) => ({
        title: item,
        completed: false,
      }));

      await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        checklist,
      });

      toast.success("Task created successfully");
      clearData();
      setTimeout(() => navigate("/user/tasks"), 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating task");
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async () => {
    setLoading(true);
    try {
      const checklist = taskData.checklist.map((item) => {
        const matched = currentTask?.checklist?.find((t) => t.title === item);
        return {
          title: item,
          completed: matched ? matched.completed : false,
        };
      });

      await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId), {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        checklist,
      });

      toast.success("Task updated successfully");
      setTimeout(() => navigate("/user/tasks"), 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating task");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!taskData.title.trim()) return setError("Title is required.");
    if (!taskData.description.trim()) return setError("Description is required.");
    if (!taskData.dueDate) return setError("Due date is required.");
    if (moment(taskData.dueDate).isBefore(moment(), "day"))
      return setError("Due date must be today or in the future.");
    if (taskData.checklist.length === 0) return setError("Add at least one todo.");

    setError("");
    taskId ? updateTask() : createTask();
  };

  const getTaskDetailsByID = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId));
      const taskInfo = response.data.task;
      setCurrentTask(taskInfo);

      setTaskData({
        title: taskInfo.title || "",
        description: taskInfo.description || "",
        priority: taskInfo.priority || "Low",
        dueDate: taskInfo.dueDate ? moment(taskInfo.dueDate).format("YYYY-MM-DD") : "",
        checklist: Array.isArray(taskInfo.checklist)
          ? taskInfo.checklist.map((item) => item.title)
          : [],
        attachments: Array.isArray(taskInfo.attachments) ? taskInfo.attachments : [],
      });
    } catch {
      toast.error("Error fetching task data.");
    }
  };

  const deleteTask = async () => {
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));
      toast.success("Task deleted successfully");
      navigate("/user/tasks");
    } catch {
      toast.error("Error deleting task");
    } finally {
      setOpenDeleteAlert(false);
    }
  };

  const liveProgress =
    taskData.checklist.length > 0
      ? Math.round(
          (taskData.checklist.filter((item) =>
            currentTask?.checklist?.find((c) => c.title === item && c.completed)
          ).length / taskData.checklist.length) * 100
        )
      : 0;

  useEffect(() => {
    if (taskId) getTaskDetailsByID();
  }, [taskId]);

  return (
    <DashboardLayout activeMenu="Create Task">
      <div className="flex justify-center items-center min-h-[85vh] px-4 sm:px-6">
        <div className="w-full max-w-4xl bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
              {taskId ? "Update Task" : "Create Task"}
            </h2>
            {taskId && (
              <button
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded hover:bg-red-200 dark:hover:bg-red-800/30"
                onClick={() => setOpenDeleteAlert(true)}
                disabled={loading}
              >
                <LuTrash2 className="text-base" /> Delete
              </button>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Task Title</label>
              <input
                type="text"
                className="w-full mt-1 px-3 py-2 text-sm rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Design Homepage"
                value={taskData.title}
                onChange={(e) => handleValueChange("title", e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <textarea
                rows={4}
                className="mt-1 w-full px-3 py-2 text-sm rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the task..."
                value={taskData.description}
                onChange={(e) => handleValueChange("description", e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
                <SelectDropdown
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(value) => handleValueChange("priority", value)}
                  placeholder="Select Priority"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
                <input
                  type="date"
                  className="mt-2 w-full px-3 py-2 text-sm rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                  value={taskData.dueDate}
                  min={moment().format("YYYY-MM-DD")}
                  onChange={(e) => handleValueChange("dueDate", e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Todo Checklist</label>
              <TodoListInput
                todoList={taskData.checklist}
                setTodoList={(val) => handleValueChange("checklist", val)}
                disabled={loading}
              />
            </div>

            {taskId && taskData.checklist.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Progress</label>
                <Progress value={liveProgress} />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Attachments</label>
              <AddAttachmentsInput
                attachments={taskData.attachments}
                setAttachments={(val) => handleValueChange("attachments", val)}
                disabled={loading}
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex justify-end gap-4">
              <button
                onClick={() => navigate("/user/tasks")}
                className="px-4 py-2 border text-sm rounded-md text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-white font-medium transition ${
                  loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? (taskId ? "Updating..." : "Creating...") : taskId ? "Update Task" : "Create Task"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={openDeleteAlert} onClose={() => setOpenDeleteAlert(false)} title="Delete Task">
        <DeleteAlert content="Are you sure you want to delete this task?" onDelete={deleteTask} />
      </Modal>
    </DashboardLayout>
  );
};

export default CreateTask;
