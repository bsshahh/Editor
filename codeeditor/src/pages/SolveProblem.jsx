import { useNavigate, useParams } from "react-router-dom";
import { problems } from "../data/problems";
import CodeEditor from "../components/CodeEditor";
import OutputBox from "../components/OutputBox";
import { runCode } from "../utils/judgeapi";
import { useState, useEffect } from "react";

const SolveProblem = () => {
  const { id } = useParams();
  const problem = problems.find((p) => p.id.toString() === id);
  const navigate=useNavigate();
  const [language, setLanguage] = useState("javascript");
  const [userCode, setUserCode] = useState(problem?.defaultCode?.[language] || "");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitloading, setSubmitLoading] = useState(false);
  
  useEffect(() => {
    if (problem) {
      setUserCode(problem.defaultCode[language]);
    }
  }, [language, problem]);

  const handleSubmit = async () => {
    setSubmitLoading(true);
    try {
      let allPassed = true;
      let failedCase = null;

      for (let i = 0; i < problem.testCases.length; i++) {
        const { stdin, expected_output } = problem.testCases[i];
        const result = await runCode(userCode, stdin, language);
        const actual = result.trim();
        const expected = expected_output.trim();

        if (actual !== expected) {
          allPassed = false;
          failedCase = {
            input: stdin,
            expected,
            actual,
            passed: false,
            caseNumber: i + 1,
          };
          break;
        }
      }

      if (allPassed) {
        setStatus("🎉 Question Solved ✅");
        setOutput("");
        // localStorage.setItem(`answered_${question._id}`, "true");

        // Redirect to overview after 3s
        setTimeout(() => {
          navigate(`/dashboard`);
        }, 3000);
      } else {
        setOutput([
          {
            input: failedCase.input,
            expected: failedCase.expected,
            actual: failedCase.actual,
            passed: false,
          },
        ]);
        setStatus(`❌ Test Case ${failedCase.caseNumber} Failed`);
      }
    } catch (err) {
      setStatus("❌ Error submitting solution");
      setOutput("Error");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleRun = async () => {
    setLoading(true);
    try {
      const { stdin, expected_output } = problem.testCases[0];
      const result = await runCode(userCode, stdin, language);

      const actual = result.trim();
      const expected = expected_output.trim();

      const runResult = [
        {
          input: stdin,
          expected,
          actual,
          passed: actual === expected,
        },
      ];

      setOutput(runResult);
      setStatus("");
    } catch (err) {
      setStatus("❌ Error executing code");
      setOutput("Error");
    } finally {
      setLoading(false);
    }
  };

  if (!problem) return <div className="p-4 text-red-500">Problem not found</div>;
  const problemIndex = problems.findIndex((p) => p.id === id);

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-50 via-pink-50 to-purple-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Problem Details */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4 ">
            <button className="w-10 h-10 flex items-center justify-center bg-purple-600 text-white font-semibold rounded-full text-lg shadow">
                Q{problemIndex+1}
              </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-pink-500 bg-clip-text text-transparent font-serif">{problem.title}</h1>
          </div>
           <button
              onClick={() => navigate(`/dashboard`)}
              className="text-sm sm:text-base bg-gradient-to-r from-purple-700 to-pink-500 hover:from-purple-700 hover:to-pink-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-semibold shadow transition"
            >
              ← Back
            </button>
            </div>
          <p className="text-gray-700 mb-4 whitespace-pre-wrap">{problem.description}</p>

          <div className="mb-6">
            {problem.examples.map((ex, idx) => (
              <pre
                key={idx}
                className="bg-gray-100 p-3 rounded mb-2 text-sm font-mono border"
              >
                <strong>Input:</strong> {ex.input}{"\n"}
                <strong>Output:</strong> {ex.output}
              </pre>
            ))}
          </div>
        </div>

        {/* Code Editor Panel */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <CodeEditor
            language={language}
            setLanguage={setLanguage}
            defaultCode={problem.defaultCode}
            userCode={userCode}
            setUserCode={setUserCode}
          />

          <div className="mt-4 flex gap-4">
            <button
              onClick={handleRun}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 font-serif transition-all duration-200 text-white px-5 py-2 rounded-lg font-semibold"
            >
              {loading ? "Running..." : "Run"}
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-700 hover:to-pink-700 font-serif  transition-all duration-200 text-white px-5 py-2 rounded-lg font-semibold"
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

export default SolveProblem;
