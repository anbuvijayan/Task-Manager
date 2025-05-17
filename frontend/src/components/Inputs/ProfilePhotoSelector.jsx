import React, { useState, useRef, useEffect } from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (image && typeof image === "object") {
      const preview = URL.createObjectURL(image);
      setPreviewUrl(preview);
      return () => {
        URL.revokeObjectURL(preview);
        setPreviewUrl(null);
      };
    }
  }, [image]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = null;
  };

  const onChooseFile = () => {
    inputRef.current?.click();
  };

  return (
    <div className="flex justify-center mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      <div
        className="relative group"
        role="button"
        tabIndex={0}
        onClick={onChooseFile}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onChooseFile();
        }}
        aria-label="Upload profile photo"
      >
        {!previewUrl ? (
          <div className="w-20 h-20 flex items-center justify-center bg-blue-100/60 dark:bg-gray-700 rounded-full cursor-pointer">
            <LuUser className="text-4xl text-primary dark:text-white" />
          </div>
        ) : (
          <img
            src={previewUrl}
            alt="Profile preview"
            className="w-20 h-20 object-cover rounded-full border border-gray-300 dark:border-gray-600"
          />
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onChooseFile();
          }}
          className="absolute -bottom-1 -right-1 w-8 h-8 bg-sky-600 hover:bg-sky-700 text-white rounded-full flex items-center justify-center shadow"
          aria-label="Upload photo"
        >
          <LuUpload className="w-4 h-4" />
        </button>

        {previewUrl && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveImage();
            }}
            className="absolute -bottom-1 -left-1 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow"
            aria-label="Remove photo"
          >
            <LuTrash className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfilePhotoSelector;
