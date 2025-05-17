import React, { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import Input from "../../components/Inputs/Input";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import toast from "react-hot-toast";

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!fullName || !email || !password) {
      toast.error("All fields are required.");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", fullName);
      formData.append("email", email);
      formData.append("password", password);
      if (profilePic) {
        formData.append("profileImage", profilePic);
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { token, ...userData } = response.data;
      if (token) {
        const fullUser = { ...userData, token };
        localStorage.setItem("user", JSON.stringify(fullUser));
        setUser(fullUser);
        navigate("/user/dashboard");
      }
    } catch (error) {
      console.error("Sign up error:", error);
      toast.error(error.response?.data?.message || "An error occurred during sign up.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col justify-center animate-fade-in-up">
        <h3 className="text-xl font-semibold text-center text-gray-800 dark:text-white mb-1">
          Create an Account
        </h3>
        <p className="text-sm text-center text-slate-600 dark:text-slate-300 mb-6">
          Please enter your details to register.
        </p>

        <form onSubmit={handleSignUp} className="space-y-4">
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <Input
            label="Full Name"
            placeholder="Alex"
            type="text"
            value={fullName}
            onChange={({ target }) => setFullName(target.value)}
          />
          <Input
            label="Email Address"
            placeholder="alex@example.com"
            type="email"
            value={email}
            onChange={({ target }) => setEmail(target.value)}
          />
          <Input
            label="Password"
            placeholder="********"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />

          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>

          <p className="text-sm text-center text-slate-600 dark:text-slate-300 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
