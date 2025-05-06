import React from 'react';
import Progress from '../layouts/Progress';
import { LuPaperclip, LuPin, LuPinOff } from 'react-icons/lu';
import moment from 'moment';
import PropTypes from 'prop-types';

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
  user
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

  return (
    <div
      onClick={onClick}
      className="flex flex-col justify-between h-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition cursor-pointer border border-gray-100"
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
            className="p-1 rounded-full hover:bg-gray-100 transition text-gray-500"
            title={isPinned ? "Unpin Task" : "Pin Task"}
            aria-pressed={isPinned}
          >
            {isPinned ? <LuPin className="text-yellow-500" /> : <LuPinOff />}
          </button>
        </div>

        <h3 className="text-base font-semibold text-gray-800 mt-4 line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{description}</p>

        <p className="text-sm font-medium text-gray-700 mt-3">
          Task Done:{" "}
          <span className="font-semibold text-gray-900">
            {completedTodoCount || 0} / {todoCheckList.length}
          </span>
        </p>
        <div className="mt-2">
          <Progress progress={progress ?? 0} status={status} />
        </div>

        <div className="flex justify-between mt-4">
          <div>
            <p className="text-xs text-gray-500">Start Date</p>
            <p className="text-sm font-medium text-gray-900">
              {createdAt ? moment(createdAt).format("Do MMM YYYY") : '—'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Due Date</p>
            <p className="text-sm font-medium text-gray-900">
              {dueDate ? moment(dueDate).format("Do MMM YYYY") : '—'}
            </p>
          </div>
        </div>

        {attachmentCount > 0 && (
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg mt-4 w-max text-blue-600 text-xs font-medium">
            <LuPaperclip />
            {attachmentCount} Attachment
          </div>
        )}

        {user?.avatar && (
          <div className="mt-3 flex items-center gap-2">
            <img
              src={user.avatar}
              alt="User Avatar"
              className="w-6 h-6 rounded-full border border-gray-200"
            />
            <span className="text-xs text-gray-600">{user.name || "You"}</span>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUpdate();
          }}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 text-xs rounded"
        >
          Update
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-xs rounded"
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
  user: PropTypes.object,
};

export default TaskCard;
