import React, { useState } from 'react';
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";

const TodoListInput = ({ todoList, setTodoList }) => {
  const [option, setOption] = useState("");

  const handleAddOption = () => {
    if (option.trim()) {
      setTodoList([...todoList, option.trim()]);
      setOption("");
    }
  };

  const handleDeleteOption = (index) => {
    const updatedArr = todoList.filter((_, idx) => idx !== index);
    setTodoList(updatedArr);
  };

  return (
    <div className="space-y-3 mt-2">
      {/* Todo Items */}
      {todoList.map((item, index) => (
        <div
          key={index}
          className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-md"
        >
          <p className="text-sm text-gray-800 dark:text-gray-100">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold mr-2">
              {index < 9 ? `0${index + 1}` : index + 1}
            </span>
            {item}
          </p>

          <button
            className="text-red-500 hover:text-red-600 dark:hover:text-red-400 transition"
            onClick={() => handleDeleteOption(index)}
            aria-label={`Remove task ${item}`}
          >
            <HiOutlineTrash className="text-lg" />
          </button>
        </div>
      ))}

      {/* Input + Add Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <input
          type="text"
          placeholder="Enter Task"
          value={option}
          onChange={({ target }) => setOption(target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddOption()}
          className="flex-grow text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="button"
          onClick={handleAddOption}
          disabled={!option.trim()}
          className="inline-flex items-center justify-center gap-1 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <HiMiniPlus className="text-lg" />
          Add
        </button>
      </div>
    </div>
  );
};

export default TodoListInput;
