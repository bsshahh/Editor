import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    oldpassword: "",
    newpassword: "",
  });

   const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email ||!formData.newpassword || !formData.oldpassword) {
      alert("Please fill All fields");
      return;
    }

    try {
      const res = await axiosInstance.put("/user/forgetpassword", formData);
      alert(res.data.message || "Password changed successfully!");
      navigate("/login");
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      alert("Password changed failed " + (err.response?.data?.message || err.message));
    } 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-yellow-50 via-pink-50 to-purple-50">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">Reset Your Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
          />

          {/* Old Password with Eye */}
          <div className="relative">
            <input
              type={showOldPassword ? "text" : "password"}
              name="oldpassword"
              placeholder="Old Password"
              value={formData.oldpassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none pr-10"
            />
            <span
              onClick={() => setShowOldPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
            >
              {showOldPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {/* New Password with Eye */}
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              name="newpassword"
              placeholder="New Password"
              value={formData.newpassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none pr-10"
            />
            <span
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
            >
              {showNewPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Reset Password
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
