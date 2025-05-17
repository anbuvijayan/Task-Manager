import React, { useState } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";
import { LuPaperclip } from "react-icons/lu";

const AddAttachmentsInput = ({ attachments, setAttachments }) => {
  const [option, setOption] = useState("");

  const handleAddLink = () => {
    const trimmed = option.trim();
    if (trimmed && !attachments.includes(trimmed)) {
      setAttachments([...attachments, trimmed]);
      setOption("");
    }
  };

  const handleDelete = (index) => {
    const updated = attachments.filter((_, i) => i !== index);
    setAttachments(updated);
  };

  return (
    <div className="space-y-2 mt-2">
      {/* Render Attachments */}
      {attachments.map((item, index) => (
        <div
          key={index}
          className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-md"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <LuPaperclip className="text-gray-400 dark:text-gray-500 shrink-0" />
            <a
              href={item}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 dark:text-blue-400 truncate underline"
            >
              {item}
            </a>
          </div>
          <button
            onClick={() => handleDelete(index)}
            className="text-red-500 hover:text-red-600 dark:hover:text-red-400 transition"
            aria-label="Remove attachment"
          >
            <HiOutlineTrash className="text-lg" />
          </button>
        </div>
      ))}

      {/* Input + Add Button */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <div className="flex flex-grow items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-md px-3 bg-white dark:bg-gray-800">
          <LuPaperclip className="text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Add file link"
            value={option}
            onChange={(e) => setOption(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddLink()}
            className="w-full py-2 text-sm bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none"
          />
        </div>

        <button
          onClick={handleAddLink}
          disabled={!option.trim()}
          className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <HiMiniPlus className="text-base" />
          <span className="ml-1 text-sm">Add</span>
        </button>
      </div>
    </div>
  );
};

export default AddAttachmentsInput;
