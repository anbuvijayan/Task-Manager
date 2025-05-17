import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../context/userContext";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-toastify";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import "react-toastify/dist/ReactToastify.css";

const ProfileEdit = () => {
  const { user, setUser } = useContext(UserContext);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPreviewUrl(user.profileImageUrl || "");
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = user.profileImageUrl;

      if (profileImage) {
        const formData = new FormData();
        formData.append("image", profileImage);

        const uploadRes = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD, formData);
        imageUrl = uploadRes.data.data.url;
      }

      const res = await axiosInstance.put(API_PATHS.USER.UPDATE_PROFILE, {
        name,
        password: password || undefined,
        profileImageUrl: imageUrl,
      });

      setUser(res.data.user);

      navigate("/user/dashboard", { state: { message: "Profile updated successfully!" } });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
      setPassword("");
    }
  };

  return (
    <DashboardLayout activeMenu="Edit Profile">
      <div className="max-w-2xl mx-auto mt-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg rounded-2xl p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image Upload */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600">
              <img
                src={previewUrl || "/default-user.png"}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="profileImage"
                className="cursor-pointer inline-block px-4 py-2 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-400 font-semibold rounded-lg shadow-sm hover:bg-blue-100 dark:hover:bg-blue-800"
              >
                Change Image
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Accepted formats: JPG, PNG</p>
            </div>
          </div>

          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm
                         focus:ring-2 focus:ring-blue-500 focus:outline-none
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              New Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              placeholder="Leave blank to keep current password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm
                         focus:ring-2 focus:ring-blue-500 focus:outline-none
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold shadow
                         transition disabled:opacity-60"
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ProfileEdit;
