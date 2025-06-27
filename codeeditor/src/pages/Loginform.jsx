import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const [error,setError]=useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please fill in both fields");
      return;
    }

    try {
      const res = await axiosInstance.post("/auth/login", formData);
      if (res.data.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg || 
        "Login failed. Please try again.";
      setError(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-yellow-50 via-pink-50 to-purple-50">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-blue-700 font-serif mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <div className="relative">
          <input
            type={showPassword?"text":"password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
            </div>
          <div className="mt-2 flex flex-col items-end space-y-2 text-sm sm:flex-row sm:justify-end sm:space-x-4 sm:space-y-0">
          <button type="button"
            onClick={() => navigate("/forgot-password")}
            className="text-blue-500 hover:underline "
          >
            Forgot Password?
          </button>
          </div>
          {error && (
          <div className="mt-4 text-sm text-red-600 text-center">{error}</div>
        )}
          <button
            type="submit"
            className="w-full bg-blue-600 font-serif text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <div className="mt-6 flex flex-col sm:flex-row justify-end items-center text-sm">
          
          <button
            onClick={() => navigate("/register")}
            className="text-gray-600 hover:underline mt-4 sm:mt-0"
          >
            Not registered? <span className="text-blue-600 font-semibold">Register here</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
