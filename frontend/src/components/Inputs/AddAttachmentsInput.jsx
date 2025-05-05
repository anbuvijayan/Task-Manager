// components/AddAttachmentsInput.jsx
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
        <div>
            {/* List attachments */}
            {attachments.map((item, index) => (
                <div
                    key={index}
                    className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-2"
                >
                    <div className="flex items-center gap-2 overflow-hidden">
                        <LuPaperclip className="text-gray-400" />
                        <a href={item} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 truncate underline">
                            {item}
                        </a>
                    </div>
                    <button onClick={() => handleDelete(index)} title="Delete">
                        <HiOutlineTrash className="text-lg text-red-500" />
                    </button>
                </div>
            ))}

            {/* Input link */}
            <div className="flex items-center gap-3 mt-3">
                <div className="flex-1 flex items-center gap-2 border border-gray-100 rounded-md px-3">
                    <LuPaperclip className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Add File Link"
                        value={option}
                        onChange={(e) => setOption(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddLink()}
                        className="w-full text-sm text-black outline-none bg-white py-2"
                    />
                </div>
                <button onClick={handleAddLink} className="card-btn" aria-label="Add attachment link">
                    <HiMiniPlus />
                </button>
            </div>
        </div>
    );
};

export default AddAttachmentsInput;
