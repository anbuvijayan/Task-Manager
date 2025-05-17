import React from "react";
import Progress from "../layouts/Progress";
import { LuPaperclip, LuPin, LuPinOff } from "react-icons/lu";
import moment from "moment";
import PropTypes from "prop-types";

const TaskCard = ({
  title,
  description,
  priority,
  status,
  progress,
  createdAt,
  dueDate,
  attachmentCount,
  completedTodoCount,
  todoCheckList = [],
  onClick,
  onTogglePin,
  onUpdate,
  onDelete,
  isPinned,
  user,
}) => {
  const getStatusTagColor = () => {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";
      case "Completed":
        return "text-lime-500 bg-lime-50 border border-lime-500/20";
      default:
        return "text-violet-500 bg-violet-50 border border-violet-500/10";
    }
  };

  const getPriorityTagColor = () => {
    switch (priority) {
      case "Low":
        return "text-emerald-500 bg-emerald-50 border border-emerald-500/10";
      case "Medium":
        return "text-amber-500 bg-amber-50 border border-amber-500/20";
      default:
        return "text-rose-500 bg-rose-50 border border-rose-500/10";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`Task card for ${title}`}
      className="flex flex-col justify-between h-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition cursor-pointer border border-gray-100
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400
                 dark:bg-gray-800 dark:border-gray-700"
    >
      <div>
        <div className="flex items-start justify-between">
          <div className="flex gap-2 flex-wrap">
            <span className={`text-xs font-medium px-3 py-0.5 rounded ${getStatusTagColor()}`}>
              {status}
            </span>
            <span className={`text-xs font-medium px-3 py-0.5 rounded ${getPriorityTagColor()}`}>
              {priority} priority
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin();
            }}
            className="p-1 rounded-full hover:bg-gray-100 transition text-gray-500 dark:hover:bg-gray-700"
            title={isPinned ? "Unpin Task" : "Pin Task"}
            aria-pressed={isPinned}
            aria-label={isPinned ? "Unpin Task" : "Pin Task"}
          >
            {isPinned ? <LuPin className="text-yellow-500" /> : <LuPinOff />}
          </button>
        </div>

        <h3 className="text-base font-semibold text-gray-800 mt-4 line-clamp-1 dark:text-gray-100">
          {title}
        </h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2 dark:text-gray-300">{description}</p>

        <p className="text-sm font-medium text-gray-700 mt-3 dark:text-gray-200">
          Task Done:{" "}
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {completedTodoCount || 0} / {todoCheckList.length}
          </span>
        </p>
        <div className="mt-2">
          <Progress progress={progress ?? 0} status={status} />
        </div>

        <div className="flex justify-between mt-4 text-gray-900 dark:text-gray-200">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Start Date</p>
            <p className="text-sm font-medium">{createdAt ? moment(createdAt).format("Do MMM YYYY") : "—"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Due Date</p>
            <p className="text-sm font-medium">{dueDate ? moment(dueDate).format("Do MMM YYYY") : "—"}</p>
          </div>
        </div>

        {attachmentCount > 0 && (
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg mt-4 w-max text-blue-600 text-xs font-medium dark:bg-blue-900 dark:text-blue-300">
            <LuPaperclip />
            {attachmentCount} Attachment{attachmentCount > 1 ? "s" : ""}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUpdate();
          }}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 text-xs rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
          aria-label={`Update task ${title}`}
        >
          Update
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-xs rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
          aria-label={`Delete task ${title}`}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

TaskCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  priority: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  progress: PropTypes.number,
  createdAt: PropTypes.string.isRequired,
  dueDate: PropTypes.string.isRequired,
  attachmentCount: PropTypes.number.isRequired,
  completedTodoCount: PropTypes.number,
  todoCheckList: PropTypes.array,
  onClick: PropTypes.func.isRequired,
  onTogglePin: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isPinned: PropTypes.bool.isRequired,
};

export default TaskCard;
