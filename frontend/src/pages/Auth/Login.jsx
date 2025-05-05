import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import toast from "react-hot-toast";
import { Mail, Lock } from "lucide-react"; // Icons

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      toast.error("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Invalid email format");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, { email, password });
      const { token, ...userData } = response.data;

      if (token) {
        const fullUser = { ...userData, token };
        localStorage.setItem("user", JSON.stringify(fullUser));
        setUser(fullUser);
        navigate("/user/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center animate-fade-in-up">
        <h3 className="text-2xl font-bold text-gray-800 mb-1">Welcome Back....</h3>
        <p className="text-sm text-slate-600 mb-6">Enter your credentials to continue</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            icon={<Mail className="w-4 h-4 text-gray-500" />}
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="alex@example.com"
            type="email"
          />
          <Input
            icon={<Lock className="w-4 h-4 text-gray-500" />}
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="********"
            type="password"
          />

          <button
            type="submit"
            className={`w-full bg-blue-600 text-white py-2 rounded-lg font-semibold transition hover:bg-blue-700 duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-sm text-slate-600 mt-3 text-center">
            Don&apos;t have an account?{" "}
            <Link className="text-blue-600 hover:underline font-medium" to="/signUp">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
