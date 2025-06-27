import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import CodeEditor from "../components/CodeEditor";
import OutputBox from "../components/OutputBox";
import { runCode } from "../utils/judgeapi";
import TestOverview from "./TestOverview";

const TestSolvePage = () => {
  const { questionId, testId } = useParams();
  const [test, setTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [language, setLanguage] = useState("javascript");
  const [userCode, setUserCode] = useState("");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitloading, setSubmitLoading] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchTestByQuestionId = async () => {
      try {
        const res = await axiosInstance.get("/utest/tests");
        for (const test of res.data) {
          const index = test.questions.findIndex((q) => q._id === questionId);
          if (index !== -1) {
            setTest(test);
            setCurrentQuestionIndex(index);
            setUserCode(test.questions[index].defaultCode[language]);
            break;
          }
        }
      } catch (err) {
        console.error("Error fetching test by questionId:", err);
      }
    };

    fetchTestByQuestionId();
  }, [questionId]);

  useEffect(() => {
    if (test) {
      setUserCode(test.questions[currentQuestionIndex].defaultCode[language]);
    }
  }, [language, currentQuestionIndex, test]);

  const handleRun = async () => {
    setLoading(true);
    try {
      const question = test.questions[currentQuestionIndex];
      const { input, expectedOutput } = question.testCases[0];
      const result = await runCode(userCode, input, language);
      const actual = result.trim();
      const expected = expectedOutput.trim();

      setOutput([
        {
          input,
          expected,
          actual,
          passed: actual === expected,
        },
      ]);
      setStatus("");
    } catch (err) {
      setStatus("❌ Error executing code");
      setOutput("Error");
    } finally {
      setLoading(false);
    }
  };
  const [remainingTime, setRemainingTime] = useState("");

  useEffect(() => {
    if (!test) return;

    const endTime = new Date(test.startTime).getTime() + test.duration * 60000;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, endTime - now);
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setRemainingTime(`${minutes}m ${seconds}s`);
      if (diff <= 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [test]);

  const handleSubmit = async () => {
    setSubmitLoading(true);
    try {
      const question = test.questions[currentQuestionIndex];
      const totalTestCases = question.testCases.length;
      const marksPerCase = question.marks / totalTestCases;

      let passedCount = 0;
      let failedCaseDetails = [];

      for (let i = 0; i < question.testCases.length; i++) {
        const { input, expectedOutput } = question.testCases[i];
        const result = await runCode(userCode, input, language);
        const actual = result.trim();
        const expected = expectedOutput.trim();

        if (actual === expected) {
          passedCount++;
        } else {
          failedCaseDetails.push({
            input,
            expected,
            actual,
            passed: false,
          });
          //  console.log("❌ Test case failed", {
          //   input,
          //   expectedOutput,
          //   actualOutput: actual,
          //   rawResult: result
          // });
        }
      }
      const marksEarned = passedCount * marksPerCase;

      await axiosInstance.post("/utest/save-response", {
        testId: test._id,
        questionId: question._id,
        code: userCode,
        language,
        passedCount,
        totalCases: totalTestCases,
        marksEarned: parseFloat(marksEarned.toFixed(2)), // for consistent format
      });

      if (passedCount === totalTestCases) {
        setStatus("🎉 Question Solved ✅");
        setOutput("");
        localStorage.setItem(`answered_${question._id}`, "true");

        // Redirect to overview after 3s
        setTimeout(() => {
          navigate(`/test/${testId}`);
        }, 3000);
      } else {
        setStatus(
          `✅ ${passedCount}/${totalTestCases} Test Cases Passed\nMarks Earned: ${marksEarned.toFixed(
            2
          )} / ${question.marks}`
        );
        setOutput(failedCaseDetails);
      }
    } catch (err) {
      setStatus("❌ Error submitting solution");
      setOutput("Error");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (!test)
    return <div className="p-8 text-center text-gray-600">Loading test...</div>;

  const currentQ = test.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Panel - Problem Statement */}

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4 ">
              <button className="w-10 h-10 flex items-center justify-center bg-purple-600 text-white font-semibold rounded-full text-lg shadow">
                Q{currentQuestionIndex + 1}
              </button>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-pink-500 bg-clip-text text-transparent">
                {currentQ.title}
              </h1>
            </div>

            <button
              onClick={() => navigate(`/test/${testId}`)}
              className="text-sm sm:text-base bg-gradient-to-r from-purple-700 to-pink-500 hover:from-purple-700 hover:to-pink-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-semibold shadow transition"
            >
              ← Back
            </button>
          </div>

          <p className="text-gray-700 mb-4 whitespace-pre-wrap">
            {currentQ.description}
          </p>

          <div className="mb-6">
            {currentQ.testCases?.slice(0, 2).map((ex, idx) => (
              <pre
                key={idx}
                className="bg-gray-100 text-sm p-3 rounded  mb-2 text-sm font-mono border"
              >
                <strong>Input:</strong> {ex.input}
                {"\n"}
                <strong>Output:</strong> {ex.expectedOutput}
              </pre>
            ))}
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          {/* Timer */}
          <div className="flex justify-end mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg shadow text-sm font-semibold flex items-center gap-2">
              ⏳ Time Left: <span className="font-mono">{remainingTime}</span>
            </div>
          </div>

          <CodeEditor
            language={language}
            setLanguage={setLanguage}
            defaultCode={currentQ.defaultCode}
            userCode={userCode}
            setUserCode={setUserCode}
          />
          <div className="mt-4 flex gap-4">
            <button
              onClick={handleRun}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 transition-all duration-200 text-white px-5 py-2 rounded-lg font-semibold"
            >
              {loading ? "Running..." : "Run"}
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-gradient-to-br from-purple-500  to-pink-500 hover:from-purple-700 hover:to-pink-700 transition-all duration-200 text-white px-5 py-2 rounded-lg font-semibold"
            >
              {submitloading ? "Checking..." : "Submit"}
            </button>
          </div>

          <div className="mt-4">
            <OutputBox output={loading ? "Running..." : output} />
            {status && (
              <div className="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded text-gray-800 whitespace-pre-wrap">
                {status}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestSolvePage;
