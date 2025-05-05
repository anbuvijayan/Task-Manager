import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import TaskListTable from "../../components/TaskListTable";
import TasksStatusTabs from "../../components/TasksStatusTabs";
import TaskCard from "../../components/Cards/TaskCard";
import DeleteAlert from "../../components/DeleteAlert";
import { toast } from "react-toastify";
import { debounce } from "lodash";

const ManageTask = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [viewMode, setViewMode] = useState("card");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const savedFilter = localStorage.getItem("filterStatus");
    const savedView = localStorage.getItem("viewMode");
    if (savedFilter) setFilterStatus(savedFilter);
    if (savedView) setViewMode(savedView);
  }, []);

  useEffect(() => {
    localStorage.setItem("filterStatus", filterStatus);
    localStorage.setItem("viewMode", viewMode);
  }, [filterStatus, viewMode]);

  const deriveStatus = (checklist = []) => {
    const total = checklist.length;
    const completed = checklist.filter((c) => c.completed).length;
    if (completed === total && total > 0) return "Completed";
    if (completed > 0) return "In Progress";
    return "Pending";
  };

  const getAllTasks = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS);
      let tasks = response.data?.tasks || [];

      tasks = tasks.map((task) => ({
        ...task,
        status: deriveStatus(task.checklist),
      }));

      let filtered = tasks;

      if (filterStatus !== "All") {
        filtered = filtered.filter((task) => task.status === filterStatus);
      }

      if (searchTerm) {
        filtered = filtered.filter(
          (task) =>
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (sortBy) {
        if (sortBy === "priority") {
          const priorityOrder = { High: 1, Medium: 2, Low: 3 };
          filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        } else {
          filtered.sort((a, b) => new Date(a[sortBy]) - new Date(b[sortBy]));
        }
      }

      filtered.sort((a, b) => (b.isPinned === true ? 1 : 0) - (a.isPinned === true ? 1 : 0));

      setAllTasks(filtered);

      const statusCounts = tasks.reduce(
        (acc, task) => {
          acc.all += 1;
          acc[task.status] = (acc[task.status] || 0) + 1;
          return acc;
        },
        { all: 0, Pending: 0, "In Progress": 0, Completed: 0 }
      );

      const statusArray = [
        { label: "All", count: statusCounts.all },
        { label: "Pending", count: statusCounts.Pending },
        { label: "In Progress", count: statusCounts["In Progress"] },
        { label: "Completed", count: statusCounts.Completed },
      ];

      setTabs(statusArray);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debouncedSearch = debounce(() => {
      getAllTasks();
    }, 400);

    debouncedSearch();
    return () => debouncedSearch.cancel();
  }, [filterStatus, searchTerm, sortBy]);

  const handleClick = (task) => {
    navigate(`/user/Work/${task._id}`);
  };

  const handleUpdate = (task) => {
    navigate(`/user/edit-task/${task._id}`);
  };

  const confirmDelete = (taskId) => {
    setTaskToDelete(taskId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskToDelete));
      toast.success("Task deleted successfully.");
      setTaskToDelete(null);
      setShowDeleteModal(false);
      getAllTasks();

      setTimeout(() => {
        navigate("/user/tasks"); // Delay navigation to show toast
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete task.");
    }
  };

  const handleSelect = (taskId) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const handleTogglePin = async (taskId) => {
    try {
      await axiosInstance.patch(API_PATHS.TASKS.TOGGLE_PINNED(taskId));
      toast.success("Task pin status updated.");
      getAllTasks();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update pin status.");
    }
  };

  const handleMarkCompleted = async () => {
    try {
      const taskPromises = selectedTasks.map(async (taskId) => {
        const task = allTasks.find((t) => t._id === taskId);
        const updatedChecklist = task.checklist?.map((item) => ({
          ...item,
          completed: true,
        })) || [];

        return axiosInstance.patch(`${API_PATHS.TASKS.UPDATE_TASK}/${taskId}`, {
          checklist: updatedChecklist,
        });
      });

      await Promise.all(taskPromises);
      toast.success("Selected tasks marked as completed.");
      setSelectedTasks([]);
      getAllTasks();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update tasks.");
    }
  };

  return (
    <DashboardLayout activeMenu="My Tasks">
      <div className="my-5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-xl font-medium">My Task</h2>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
              {tabs?.[0]?.count > 0 && (
                <TasksStatusTabs
                  tabs={tabs}
                  activeTab={filterStatus}
                  setActiveTab={setFilterStatus}
                />
              )}
              <select
                className="border text-sm px-3 py-2 rounded w-full sm:w-auto"
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
              >
                <option value="card">Card View</option>
                <option value="table">Table View</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 my-4">
            <input
              type="text"
              placeholder="Search tasks..."
              className="border px-3 py-2 rounded w-full sm:w-60"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="border px-3 py-2 rounded w-full sm:w-48"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">Sort by</option>
              <option value="dueDate">Due Date</option>
              <option value="createdAt">Created At</option>
              <option value="priority">Priority</option>
            </select>
          </div>

          {selectedTasks.length > 0 && (
            <div className="my-3">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={handleMarkCompleted}
              >
                Mark {selectedTasks.length} Task(s) as Completed
              </button>
            </div>
          )}

          {loading ? (
            <div className="text-center text-gray-400 mt-10">Loading tasks...</div>
          ) : allTasks.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              No tasks found for this status.
            </div>
          ) : viewMode === "card" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {allTasks.map((item) => (
                <TaskCard
                  key={item._id}
                  title={item.title}
                  description={item.description}
                  priority={item.priority}
                  status={item.status}
                  progress={item.progress}
                  createdAt={item.createdAt}
                  dueDate={item.dueDate}
                  attachmentCount={item.attachments?.length || 0}
                  completedTodoCount={
                    item.checklist?.filter((c) => c.completed).length || 0
                  }
                  todoCheckList={item.checklist || []}
                  onClick={() => handleClick(item)}
                  onTogglePin={() => handleTogglePin(item._id)}
                  onUpdate={() => handleUpdate(item)}
                  onDelete={() => confirmDelete(item._id)}
                  isPinned={item.pinned}
                  user={currentUser}
                />
              ))}
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <TaskListTable
                tableData={allTasks}
                onUpdate={handleUpdate}
                onDelete={confirmDelete}
                onSelect={handleSelect}
                selectedTasks={selectedTasks}
              />
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#2C3E50] text-white rounded-md p-6 w-[90%] max-w-md shadow-lg relative">
            {/* Close (X) Button */}
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 text-white text-xl hover:text-gray-300"
              aria-label="Close"
            >
              &times;
            </button>

            {/* Title */}
            <h2 className="text-lg font-semibold mb-4">Delete Task</h2>

            {/* Confirmation Text */}
            <p className="text-sm mb-6">Are you sure you want to delete this task?</p>

            {/* Delete Button */}
            <div className="flex justify-end">
              <button
                onClick={handleConfirmDelete}
                className="bg-pink-500 text-white text-sm px-4 py-2 rounded hover:bg-pink-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ManageTask;
