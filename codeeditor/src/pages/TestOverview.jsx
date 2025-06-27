// /src/pages/TestOverview.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const TestOverview = () => {
  const { testId } = useParams();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [remainingTime, setRemainingTime] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchTest = async () => {
      try {
        const res = await axiosInstance.get(`/utest/test/${testId}`);
        setTest(res.data);
      } catch (err) {
        console.error("Failed to fetch test:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [testId]);
  useEffect(() => {
    if (!test) return;
    const endTime = new Date(test.startTime).getTime() + test.duration * 60000;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, endTime - now);
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setRemainingTime(`${minutes}m ${seconds}s`);
      if (diff <= 0) {
        clearInterval(interval);
        handleFinishTest();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [test]);

  const handleFinishTest = async () => {
    if (hasSubmitted) return;
    setHasSubmitted(true);
    try {
      await axiosInstance.post(`/utest/submit/${testId}`);
      alert("✅ Test submitted successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error submitting test:", err);
      alert("❌ Failed to submit the test.");
      // navigate("/dashboard");
    }
  };
  if (loading) return <div className="p-6 text-center">Loading Test...</div>;

  if (!test)
    return <div className="p-6 text-center text-red-600">Test not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-3">
          <h1 className="text-2xl font-bold text-indigo-700 font-serif">
            {test.title}
          </h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto items-end sm:items-center">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 font-serif hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg shadow text-sm font-semibold flex items-center gap-2">
              ⏳ Time Left :
              <span className="font-sans font-bold">{remainingTime}</span>
            </div>
            <button
              onClick={handleFinishTest}
              className="bg-gradient-to-r from-purple-500 to-pink-500 font-serif hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg text-sm font-bold"
            >
              Finish Test
            </button>
          </div>
        </div>
        <p className="text-gray-600 mb-4">{test.description}</p>
        <p className="text-sm text-gray-500 mb-6">
          Duration : {test.duration} minutes | Total Marks : {test.totalMarks}
        </p>

        <h2 className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 font-serif font-bold bg-clip-text text-transparent mb-3">
          Questions :
        </h2>
        <div className="space-y-4">
          {test.questions.map((q, index) => {
            const isAnswered =
              localStorage.getItem(`answered_${q._id}`) === "true";

            return (
              <div
                key={q._id}
                className="bg-indigo-50 p-4 rounded-lg shadow-sm flex justify-between items-center"
              >
                <div>
                  <div className="flex items-center gap-3 font-serif mb-2">
                    <button className="w-8 h-8 flex items-center justify-center bg-purple-600 text-white font-semibold rounded-full text-sm shadow">
                      Q{index + 1}
                    </button>
                    <h3 className="text-lg font-bold text-blue-800">
                      {" "}
                      {q.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{q.description}</p>
                  <span className="text-xs text-gray-600">
                    Marks : {q.marks}
                  </span>
                </div>
                {isAnswered ? (
                  <button
                    disabled
                    className="bg-gradient-to-r from-purple-500 via-purple-500 to-pink-500 font-serif font-semibold hover:from-purple-700 hover:to-pink-700  cursor-not-allowed text-white px-4 py-2 rounded text-sm "
                  >
                    ✅Answered
                  </button>
                ) : (
                  <Link
                    to={`/solve/${q._id}/${test._id}`}
                    className="bg-gradient-to-r from-purple-500 via-purple-500 to-pink-500 font-serif font-semibold hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded text-sm"
                  >
                    Solve
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TestOverview;
