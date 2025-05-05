// components/TaskCard.jsx
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
      case "In Progress": return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";
      case "Completed": return "text-lime-500 bg-lime-50 border border-lime-500/20";
      default: return "text-violet-500 bg-violet-50 border border-violet-500/10";
    }
  };

  const getPriorityTagColor = () => {
    switch (priority) {
      case "Low": return "text-emerald-500 bg-emerald-50 border border-emerald-500/10";
      case "Medium": return "text-amber-500 bg-amber-50 border border-amber-500/20";
      default: return "text-rose-500 bg-rose-50 border border-rose-500/10";
    }
  };

  return (
    <div className='bg-white rounded-xl py-4 shadow-md shadow-gray-100 border border-gray-200/50'>
      <div className="flex items-start justify-between px-4">
        <div className="flex gap-3">
          <div className={`text-[11px] font-medium ${getStatusTagColor()} px-4 py-0.5 rounded`}>
            {status}
          </div>
          <div className={`text-[11px] font-medium ${getPriorityTagColor()} px-4 py-0.5 rounded`}>
            {priority} priority
          </div>
        </div>
        <div className="flex items-center gap-2">
          {status !== "Completed" && (
            <button
              onClick={onClick}
              className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
            >
              Go to Work
            </button>
          )}
          <button
            onClick={onTogglePin}
            className="p-1 rounded-full hover:bg-gray-100 transition text-gray-500"
            title={isPinned ? "Unpin Task" : "Pin Task"}
            aria-pressed={isPinned}
          >
            {isPinned ? <LuPin className="text-yellow-500" /> : <LuPinOff />}
          </button>
        </div>
      </div>

      <div className={`px-4 border-l-[3px] ${
        status === "In Progress" ? "border-cyan-500" :
        status === "Completed" ? "border-indigo-500" : "border-violet-500"
      }`}>
        <p className="text-sm font-medium text-gray-800 mt-4 line-clamp-2">{title}</p>
        <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-[18px]">{description}</p>
        <p className="text-[13px] text-gray-700/80 font-medium mt-2 mb-2 leading-[18px]">
          Task Done:{" "}
          <span className="font-semibold text-gray-700">
            {completedTodoCount || 0} / {todoCheckList.length}
          </span>
        </p>
        <Progress progress={progress ?? 0} status={status} />
      </div>

      <div className='px-4'>
        <div className='flex items-center justify-between my-1'>
          <div>
            <label className='text-xs text-gray-500'>Start Date</label>
            <p className='text-[13px] font-medium text-gray-900'>
              {createdAt ? moment(createdAt).format("Do MMM YYYY") : '—'}
            </p>
          </div>
          <div>
            <label className='text-xs text-gray-500'>Due Date</label>
            <p className='text-[13px] font-medium text-gray-900'>
              {dueDate ? moment(dueDate).format("Do MMM YYYY") : '—'}
            </p>
          </div>
        </div>

        {attachmentCount > 0 && (
          <div className='flex items-center gap-2 bg-blue-50 px-2.5 py-1.5 rounded-lg mt-3 w-max'>
            <LuPaperclip className='text-blue-500' />
            <span className='text-xs text-gray-900'>{attachmentCount}</span>
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

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onUpdate}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 text-xs rounded"
          >
            Update
          </button>
          <button
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-xs rounded"
          >
            Delete
          </button>
        </div>
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
