import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTestId, setEditingTestId] = useState(null);

  const [tests, setTests] = useState([]);

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    college: "",
    startTime: "",
    endTime: "",
  });
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout", {});
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleDeleteTest = async (testId) => {
    if (window.confirm("Are you sure you want to delete?")) {
      try {
        await axiosInstance.delete(`/admin/delete-test/${testId}`);
        setTests((prevTests) =>
          prevTests.filter((test) => test._id !== testId)
        );
      } catch (err) {
        console.error("Error deleting test:", err);
      }
    }
  };
  const formatDateForInput = (date) => {
    const d = new Date(date);
    const offset = d.getTimezoneOffset();
    const localDate = new Date(d.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
  };

  const handleEditClick = (test) => {
    setEditingTestId(test._id);
    setEditForm({
      title: test.title,
      description: test.description,
      college: test.college,
      startTime: formatDateForInput(test.startTime), // for datetime-local
      endTime: formatDateForInput(test.endTime),
    });
  };

  // const handleSave = async (userId) => {
  //   try {
  //     const res = await axiosInstance.put(`/user/updatedetail/${userId}`,editedUser);
  //     setUsers((prevUsers) =>
  //       prevUsers.map((user) =>
  //         user._id === userId ? { ...user, ...editedUser } : user
  //       )
  //     );
  //     setEditing(null);
  //   } catch (err) {
  //     console.error("Failed to update user:", err);
  //   }
  // };

  // const handleCancel = () => {
  //   setEditing(null);
  //   setEditedUser({ firstname: "", lastname: "", mobile: "" });
  // };

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await axiosInstance.get("/auth/login-check");
        console.log(res.data.user.role);
        if (res.data.user.role !== "admin") {
          navigate("/dashboard"); // Not an admin? Redirect to user dashboard
        } else {
          setAdmin(res.data.user);
        }
      } catch (err) {
        console.error("Not authenticated:", err);
        navigate("/login");
      }
    };
    fetchAdmin();
  }, [navigate]);

  const fetchTests = async () => {
    try {
      const res = await axiosInstance.get("/admin/tests");
      setTests(res.data);
    } catch (err) {
      console.error("Error fetching tests", err);
    }
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdateTest = async () => {
    try {
      await axiosInstance.put(`/admin/update-test/${editingTestId}`, editForm);
      setEditingTestId(null);
      fetchTests(); // Refresh test list
    } catch (err) {
      console.error("Error updating test", err);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-3xl p-8 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold font-serif text-indigo-700">
              Admin Dashboard
            </h1>
            <p className="text-sm text-black-500">
              Welcome,{" "}
              <span className="font-bold">
                {admin?.firstname || "Admin"}
              </span>
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-end">
            <button
              onClick={() => navigate("/admin/create-test")}
              className="bg-blue-600 font-serif hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
            >
              Create Test
            </button>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-xl text-sm font-serif hover:shadow-lg font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>

      {tests.length === 0 ? (
  <div className="text-center mt-10 p-8 bg-gradient-to-r from-pink-100 via-yellow-100 to-purple-100 border border-purple-300 rounded-xl shadow-lg animate-fade-in">
    <h2 className="text-2xl font-serif font-bold text-indigo-800 mb-4">📭 No Tests Available</h2>
    <p className="text-gray-700 text-md font-medium mb-6">
      You haven't created any tests yet. Start assessing your students by creating a new test.
    </p>
    <button
      onClick={() => navigate("/admin/create-test")}
      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-serif font-semibold px-6 py-2 rounded-lg shadow hover:scale-105 hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
    >
      <span className="text-xl font-bold">+</span> Create Your First Test
    </button>
  </div>
) : (
  <>
    <h2 className="text-2xl font-bold text-indigo-800 mb-4 font-serif">
      📚 Created Tests
    </h2>
        {tests.map((test) =>
          editingTestId === test._id ? (
            <div
              key={test._id}
              className="bg-yellow-50 p-6 rounded-2xl shadow-md mb-6"
            >
              <input
                name="title"
                value={editForm.title}
                onChange={handleEditChange}
                className="block w-full mb-2 p-2 border border-gray-300 rounded"
                placeholder="Title"
              />
              <input
                name="description"
                value={editForm.description}
                onChange={handleEditChange}
                className="block w-full mb-2 p-2 border border-gray-300 rounded"
                placeholder="Description"
              />
              <input
                name="college"
                value={editForm.college}
                onChange={handleEditChange}
                className="block w-full mb-2 p-2 border border-gray-300 rounded"
                placeholder="College"
              />
              <input
                type="datetime-local"
                name="startTime"
                value={editForm.startTime}
                onChange={handleEditChange}
                className="block w-full mb-2 p-2 border border-gray-300 rounded"
              />
              <input
                type="datetime-local"
                name="endTime"
                value={editForm.endTime}
                onChange={handleEditChange}
                className="block w-full mb-4 p-2 border border-gray-300 rounded"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleUpdateTest}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingTestId(null)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div
              key={test._id}
              className="bg-gradient-to-r from-indigo-100 to-purple-100 p-6 rounded-2xl shadow-lg hover:shadow-md transition-all duration-300 mb-6 border border-indigo-200"
            >
              <h2 className="text-xl font-serif font-semibold text-purple-800 mb-2">
                {test.title}
              </h2>
              <p className="text-sm text-gray-700 mb-1">{test.description}</p>
              <div className="text-sm text-black-100 mb-3 font-serif leading-relaxed space-y-1">
                <p>
                  🎓 <span className="font-semibold">College :</span>{" "}
                  <span className="text-indigo-900 ">{test.college}</span>
                </p>
                <p>
                  🕒 <span className="font-semibold">Start :</span>{" "}
                  <span className="text-indigo-900">
                    {new Date(test.startTime).toLocaleString()}
                  </span>
                </p>
                <p>
                  ⏱️ <span className="font-semibold">End :</span>{" "}
                  <span className="text-indigo-900">
                    {new Date(test.endTime).toLocaleString()}
                  </span>
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditClick(test)}
                  className="bg-yellow-500 hover:bg-yellow-600 font-serif text-white text-sm font-semibold px-3 py-1 rounded-lg transition duration-200"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDeleteTest(test._id)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 font-serif hover:from-purple-700 hover:to-pink-700 text-sm font-semibold text-white px-3 py-1 rounded-lg transition"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          )
        )}
        </>
    )}
      </div>
    </div>
  );
};

export default AdminDashboard;
