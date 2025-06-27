import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const Form = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    mobile: "",
    role: "user",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e, role = "user") => {
    e.preventDefault();

    const { firstname, lastname, email, password, mobile } = formData;

    if (!firstname || !lastname || !email || !password || !mobile) {
      setError("Please fill in all fields");
      return;
    }

    const submitData = { ...formData, role };

    if (role === "admin") {
      const admincode = prompt("Enter Admin Secret Code:");
      if (!admincode) {
        alert("Admin code is required");
        return;
      }
      submitData.admincode = admincode;
    }

    try {
      const response = await axiosInstance.post("/user/register", submitData);
      console.log("Registration successful:", response.data);
      navigate("/login");
    } catch (error) {
      console.error("Error during registration:", error);
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.msg ||
        "Registration failed. Please try again.";
      setError(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-yellow-50 via-pink-50 to-purple-50">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        <h2 className="text-3xl font-bold font-serif text-center text-blue-700 mb-6">
          Register
        </h2>
        <form onSubmit={(e) => handleSubmit(e, "user")} className="space-y-4">
          <input
            type="text"
            name="firstname"
            placeholder="First Name"
            value={formData.firstname}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
          />
          <input
            type="text"
            name="lastname"
            placeholder="Last Name"
            value={formData.lastname}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
          />
          <input
            type="tel"
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
          />

          <select name="designation" value={formData.designation} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
            <option value="">Select your role</option>
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="hr">HR</option>
            <option value="other">Other</option>
          </select>

          {formData.designation && (
            <input
              name="organization"
              placeholder={
                formData.designation === "student"
                  ? "College Name"
                  : formData.designation === "faculty"
                  ? "College (Teaching)"
                  : formData.designation === "hr"
                  ? "Company Name"
                  : "Organization Name"
              }
              value={formData.organization}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          )}

          <button
            type="submit"
            className="w-full bg-green-600 font-serif text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Register
          </button>

          <button
            type="button"
            onClick={(e) => handleSubmit(e, "admin")}
            className="w-full font-serif bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Register as Admin
          </button>
        </form>

        {error && (
          <div className="mt-4 text-sm text-red-600 text-center">{error}</div>
        )}

        <div className="mt-6 text-center text-sm">
          <button
            onClick={() => navigate("/login")}
            className="text-gray-600 hover:underline"
          >
            Already registered?{" "}
            <span className="text-blue-600 font-semibold">Login here</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Form;
