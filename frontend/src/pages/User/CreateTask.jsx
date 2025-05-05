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
        checklist: taskInfo.checklist?.map((item) => item.title) || [],
        attachments: taskInfo.attachments || [],
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
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="col-span-3 bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-xl font-semibold">
                {taskId ? "Update Task" : "Create Task"}
              </h2>
              {taskId && (
                <button
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-rose-600 bg-rose-100 border border-rose-200 rounded hover:bg-rose-200 disabled:opacity-50"
                  onClick={() => setOpenDeleteAlert(true)}
                  disabled={loading}
                >
                  <LuTrash2 className="text-base" />
                  Delete
                </button>
              )}
            </div>

            {taskId && currentTask?.createdAt && (
              <div className="mb-4">
                <label className="text-xs font-medium text-gray-500">Created At</label>
                <p className="text-sm text-gray-700">
                  {moment(currentTask.createdAt).format("Do MMM YYYY")}
                </p>
              </div>
            )}

            <div className="mt-4 space-y-4">
              {/* Title */}
              <div>
                <label className="text-xs font-medium text-slate-700">Task Title</label>
                <input
                  type="text"
                  className={`w-full px-2.5 py-3 border rounded-md text-sm text-black focus:ring-2 outline-none transition placeholder:text-gray-500 ${
                    loading ? "bg-gray-100 border-gray-300 cursor-not-allowed" : "bg-white border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="e.g. Design Homepage"
                  value={taskData.title}
                  onChange={({ target }) => handleValueChange("title", target.value)}
                  disabled={loading}
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  rows={4}
                  className={`mt-2 w-full px-4 py-2 border rounded-md text-sm resize-none focus:ring-2 focus:outline-none transition ${
                    loading ? "bg-gray-100 border-gray-300 cursor-not-allowed" : "bg-white border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="Describe the task..."
                  value={taskData.description}
                  onChange={({ target }) => handleValueChange("description", target.value)}
                  disabled={loading}
                />
              </div>

              {/* Priority & Due Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Priority</label>
                  <SelectDropdown
                    options={PRIORITY_DATA}
                    value={taskData.priority}
                    onChange={(value) => handleValueChange("priority", value)}
                    placeholder="Select Priority"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Due Date</label>
                  <input
                    type="date"
                    className={`mt-2 w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:outline-none ${
                      loading ? "bg-gray-100 cursor-not-allowed" : "bg-white border-gray-300 focus:ring-blue-500"
                    }`}
                    value={taskData.dueDate}
                    min={moment().format("YYYY-MM-DD")}
                    onChange={({ target }) => handleValueChange("dueDate", target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Checklist */}
              <div>
                <label className="text-sm font-medium text-gray-700">Todo Checklist</label>
                <TodoListInput
                  todoList={taskData.checklist}
                  setTodoList={(val) => handleValueChange("checklist", val)}
                  disabled={loading}
                />
                {taskData.checklist.length === 0 && (
                  <p className="text-xs text-gray-400 mt-1">No checklist items added</p>
                )}
              </div>

              {/* Progress */}
              {taskId && taskData.checklist.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Progress</label>
                  <Progress value={liveProgress} />
                </div>
              )}

              {/* Attachments */}
              <div>
                <label className="text-sm font-medium text-gray-700">Add Attachments</label>
                <AddAttachmentsInput
                  attachments={taskData.attachments}
                  setAttachments={(val) => handleValueChange("attachments", val)}
                  disabled={loading}
                />
              </div>

              {/* Error */}
              {error && <p className="text-sm text-red-500">{error}</p>}

              {/* Submit */}
              <div className="flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-white font-medium transition ${
                    loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {loading && (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  )}
                  {loading
                    ? taskId
                      ? "Updating..."
                      : "Creating..."
                    : taskId
                    ? "Update Task"
                    : "Create Task"}
                </button>
              </div>
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
