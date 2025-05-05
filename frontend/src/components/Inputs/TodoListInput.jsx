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
        <div>
            {/* Todo Items */}
            {todoList.map((item, index) => (
                <div
                    key={index}
                    className="flex justify-between items-center bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mt-2 mb-3"
                >
                    <p className="text-xs text-black">
                        <span className="text-xs text-gray-400 font-semibold mr-2">
                            {index < 9 ? `0${index + 1}` : index + 1}
                        </span>
                        {item}
                    </p>

                    <button
                        className="cursor-pointer hover:text-red-700 transition"
                        onClick={() => handleDeleteOption(index)}
                    >
                        <HiOutlineTrash className="text-lg text-red-500" />
                    </button>
                </div>
            ))}

            {/* Input + Add Button */}
            <div className="flex items-center gap-5 mt-4">
                <input
                    type="text"
                    placeholder="Enter Task"
                    value={option}
                    onChange={({ target }) => setOption(target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddOption();
                    }}
                    className="w-full text-[13px] text-black outline-none bg-white border border-gray-100 px-3 py-2 rounded-md"
                />

                <button
                    className="card-btn text-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                    onClick={handleAddOption}
                    disabled={!option.trim()}
                >
                    <HiMiniPlus className="text-lg" />
                    Add
                </button>
            </div>
        </div>
    );
};

export default TodoListInput;
