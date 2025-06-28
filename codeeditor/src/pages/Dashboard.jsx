import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { problems } from "../data/problems";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [liveTests, setLiveTests] = useState([]);
  const [loading, setLoading] = useState(true); // <-- NEW
  const [submittedTests, setSubmittedTests] = useState([]);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout", {});
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  useEffect(() => {
    const fetchUserAndTests = async () => {
      try {
        const res = await axiosInstance.get("/auth/login-check");
        const userData = res.data.user;
        setUser(userData);

        const [testRes, userTestRes] = await Promise.all([
          axiosInstance.get("/utest/tests"),
          axiosInstance.get("/utest/user-submissions"),
        ]);
        const allTests = testRes.data || [];
        const userTests = userTestRes.data || [];

        const submittedMap = new Map();
        userTests.forEach((ut) => submittedMap.set(ut.testId, ut));
        //  console.log(allTests);
        
        const completed = [];
        const upcoming = [];
        const now = new Date();
        allTests.forEach((test) => {
          
          if (test.college === userData.organization) {
            const userSubmission = submittedMap.get(test._id);
            // console.log(userSubmission);
            const isSubmitted = userSubmission?.submitted===true;
            
            // console.log(userSubmission);
            if (isSubmitted) {
              completed.push({ ...test, ...userSubmission });
            } else {
              upcoming.push(test); // Only push live tests
            }
          }
        });

        setLiveTests(upcoming);
        setSubmittedTests(completed);
        setLoading(false);
      } catch (err) {
        console.error(
          "Not authenticated or test fetch failed:",
          err?.response?.data || err.message
        );
        if (err.response?.data?.message === "Invalid token.") {
          alert("Session expired. Please login again.");
          navigate("/login");
        } else {
          setLoading(false); // Still stop loading if error
        }
        navigate("/login");
      }
    };

    fetchUserAndTests();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl p-8 border border-gray-100">
        {user ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold font-serif text-indigo-700">
                  Coding Dashboard
                </h1>
                <p className="text-sm text-black-500">
                  Welcome,{" "}
                  <span className="font-bold">{user.firstname}</span>
                </p>
              </div>
              <div className="flex flex-wrap gap-3 justify-end">
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-purple-500 to-pink-500 font-serif hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              >
                Logout
              </button>
              </div>
            </div>

            {/* Problems Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {problems.map((p) => (
                <div
                  key={p.id}
                  className="bg-gradient-to-r from-indigo-100 to-purple-100 p-6 rounded-2xl shadow hover:shadow-md transition border border-indigo-200"
                >
                  <h3 className="text-xl font-semibold font-serif text-purple-800 mb-2">
                    {p.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {p.description?.slice(0, 150) ||
                      "Solve the coding problem."}
                  </p>
                  <Link
                    to={`/problem/${p.id}`}
                    className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-700 hover:to-pink-700 font-serif text-white px-4 py-2 rounded-lg font-semibold text-sm transition"
                  >
                    Solve Problem
                  </Link>
                </div>
              ))}
            </div>

            {/* Live Tests Section */}
            <h2 className="text-2xl font-bold font-serif text-indigo-700 mt-10 mb-4">
              Live Tests
            </h2>
            {liveTests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {liveTests.map((test) => (
                  <div
                    key={test._id}
                    className="bg-gradient-to-r from-indigo-100 to-purple-100 p-4 rounded-xl shadow hover:shadow-md transition border border-indigo-200"
                  >
                    <h3 className="text-lg font-semibold font-serif text-purple-800 mb-1">
                      {test.title}
                    </h3>
                    <p className="text-sm text-gray-700 mb-1">
                      {test.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      Starts: {new Date(test.startTime).toLocaleString()} <br />
                      Ends: {new Date(test.endTime).toLocaleString()}
                    </p>
                    <Link
                      to={`/test/${test._id}`}
                      className="inline-block mt-3 bg-gradient-to-r from-purple-500 to-pink-500 font-serif hover:bg-purple-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Join Test
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center font-serif text-gray-500 mt-4">
                📭 No live test available now.
              </p>
            )}

            {/* Completed Test Section */}
            <h2 className="text-2xl font-serif font-bold text-indigo-700 mt-10 mb-4">
              Completed Tests
            </h2>
            {submittedTests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {submittedTests.map((test) => (
                  <div
                    key={test._id}
                    className="bg-gradient-to-r from-indigo-100 to-purple-100 p-4 rounded-xl shadow hover:shadow-md transition border border-indigo-200"
                  >
                    <h3 className="text-lg font-semibold font-serif text-purple-800 mb-1">
                      {test.title}
                    </h3>
                    <p className="text-sm text-gray-700 mb-1">
                      {test.description}
                    </p>
                    <p className="text-xs font-serif text-gray-600 mb-1">
                      🕒 Submitted At :{" "}
                      <span className="font-medium">
                        {new Date(test.submittedAt).toLocaleString()}
                      </span>
                    </p>
                    <p className="text-sm font-serif font-semibold text-purple-700 ">
                      ✅ Score :{" "}
                      <span className="text-black-700">{test.score}</span>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center font-serif text-gray-500 mt-4">
                🕒 No completed tests yet.
              </p>
            )}
          </>
        ) : (
          <p className="text-center text-gray-700 text-lg">
            User info not found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
