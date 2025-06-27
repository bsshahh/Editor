import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const CreateTest = () => {
  const navigate = useNavigate();

  const [test, setTest] = useState({
    title: "",
    description: "",
    college: "",
    startTime: "",
    endTime: "",
    duration: "",
    totalMarks: "",
    questions: [],
  });

  const [editingIndex, setEditingIndex] = useState(null);
  const [editedQuestion, setEditedQuestion] = useState(null);

  const [question, setQuestion] = useState({
    title: "",
    description: "",
    marks: "",
    defaultCode: {
      javascript: "",
      cpp: "",
      java: "",
    },
    testCases: [],
  });

  const [testCase, setTestCase] = useState({ input: "", expectedOutput: "" });

  const handleTestChange = (e) => {
    setTest({ ...test, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    if (["javascript", "cpp", "java"].includes(name)) {
      setQuestion({
        ...question,
        defaultCode: { ...question.defaultCode, [name]: value },
      });
    } else {
      setQuestion({ ...question, [name]: value });
    }
  };

  const handleTestCaseChange = (e) => {
    setTestCase({ ...testCase, [e.target.name]: e.target.value });
  };

  const addTestCase = () => {
    if (!testCase.input || !testCase.expectedOutput) return;
    setQuestion((prev) => ({
      ...prev,
      testCases: [...prev.testCases, testCase],
    }));
    setTestCase({ input: "", expectedOutput: "" });
  };

  const addQuestion = () => {
    if (!question.title || question.testCases.length === 0) return;
    setTest((prev) => ({
      ...prev,
      questions: [...prev.questions, question],
    }));
    console.log("Question", question);
    setQuestion({
      title: "",
      description: "",
      defaultCode: { javascript: "", cpp: "", java: "" },
      testCases: [],
    });
  };

  const handleSubmit = async () => {
    try {
      await axiosInstance.post("/admin/create-test", test);
      alert("✅ Test Created");
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Test creation failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-100 p-6">
      <div className="max-w-6xl mx-auto p-8 bg-white rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold font-serif text-blue-700">
            Create Test
          </h1>
          <button
            onClick={() => navigate(`/admin/dashboard`)} // or navigate("/admin/dashboard")
            className="bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-600 hover:to-pink-700 text-white font-serif text-sm px-4 py-2 rounded-lg shadow transition"
          >
            ⬅️ Back
          </button>
        </div>

        {/* Test Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div>
            <label className="font-semibold text-gray-700">Test Title</label>
            <input
              type="text"
              name="title"
              value={test.title}
              onChange={handleTestChange}
              placeholder="Enter test title"
              className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="font-semibold text-gray-700">Description</label>
            <input
              type="text"
              name="description"
              value={test.description}
              onChange={handleTestChange}
              placeholder="Enter test description"
              className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="font-semibold text-gray-700">
              Target College
            </label>
            <input
              type="text"
              name="college"
              value={test.college}
              onChange={handleTestChange}
              placeholder="Enter college name"
              className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
        {/* Duration and Marks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="font-semibold text-gray-700">
              Test Duration (in minutes)
            </label>
            <input
              type="number"
              name="duration"
              value={test.duration}
              onChange={handleTestChange}
              placeholder="Enter duration e.g., 60"
              className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="font-semibold text-gray-700">Total Marks</label>
            <input
              type="number"
              name="totalMarks"
              value={test.totalMarks}
              onChange={handleTestChange}
              placeholder="Enter total marks"
              className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div>
            <label className="font-semibold text-gray-700">Start Time</label>
            <input
              type="datetime-local"
              name="startTime"
              value={test.startTime}
              onChange={handleTestChange}
              className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="font-semibold text-gray-700">End Time</label>
            <input
              type="datetime-local"
              name="endTime"
              value={test.endTime}
              onChange={handleTestChange}
              className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Add Question */}
        <h2 className="text-2xl font-bold font-serif text-black-800 mb-4">
          Add Question
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="font-semibold text-gray-700">
              Question Title
            </label>
            <input
              type="text"
              name="title"
              value={question.title}
              onChange={handleQuestionChange}
              placeholder="Enter question title"
              className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="font-semibold text-gray-700">Description</label>
            <textarea
              rows="3"
              name="description"
              value={question.description}
              onChange={handleQuestionChange}
              placeholder="Enter question description"
              className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-400"
            ></textarea>
          </div>
          <div>
            <label className="font-semibold text-gray-700">Marks</label>
            <input
              type="number"
              name="marks"
              value={question.marks}
              onChange={handleQuestionChange}
              placeholder="Enter marks for this question"
              className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="font-semibold text-gray-700">
              JavaScript Code
            </label>
            <textarea
              rows="3"
              name="javascript"
              value={question.defaultCode.javascript}
              onChange={handleQuestionChange}
              placeholder="Enter JS code"
              className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-400"
            ></textarea>
          </div>
          <div>
            <label className="font-semibold text-gray-700">C++ Code</label>
            <textarea
              rows="3"
              name="cpp"
              value={question.defaultCode.cpp}
              onChange={handleQuestionChange}
              placeholder="Enter C++ code"
              className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-400"
            ></textarea>
          </div>
          <div>
            <label className="font-semibold text-gray-700">Java Code</label>
            <textarea
              rows="3"
              name="java"
              value={question.defaultCode.java}
              onChange={handleQuestionChange}
              placeholder="Enter Java code"
              className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-400"
            ></textarea>
          </div>
        </div>

        {/* Add Test Case */}
        <h3 className="text-2xl font-bold text-black-800 mb-4 font-serif">
          Add Test Case
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="input"
            value={testCase.input}
            onChange={handleTestCaseChange}
            placeholder="Input"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            name="expectedOutput"
            value={testCase.expectedOutput}
            onChange={handleTestCaseChange}
            placeholder="Expected Output"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          onClick={addTestCase}
          className="bg-green-600 text-white font-serif font-semibold px-4 py-2 rounded hover:bg-green-700"
        >
          Add Test Case
        </button>

        {/* Submit */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={addQuestion}
            className="bg-blue-600 text-white font-serif font-semibold px-6 py-2 rounded hover:bg-blue-700"
          >
            Add Question to Test
          </button>

          <button
            onClick={handleSubmit}
            disabled={test.questions.length === 0}
            className={`${
              test.questions.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-700 hover:to-pink-700"
            } font-serif font-semibold text-white px-6 py-2 rounded transition`}
          >
            Submit Test
          </button>
        </div>

        <div className="mt-6 border-t pt-4">
          {test.questions.length === 0 ? (
            <p className="text-center text-gray-500 text-sm italic">
              ⚠️ No questions added yet. Please add at least one question to
              create a test.
            </p>
          ) : (
            <>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                ✅ Added Questions:
              </h3>

              {test.questions.map((q, index) => (
                <div key={index} className="p-4 border rounded mb-2 bg-gray-50">
                  {editingIndex === index ? (
                    <>
                      <input
                        className="block w-full mb-2 p-2 border"
                        value={editedQuestion.title}
                        onChange={(e) =>
                          setEditedQuestion({
                            ...editedQuestion,
                            title: e.target.value,
                          })
                        }
                      />
                      <textarea
                        className="block w-full mb-2 p-2 border"
                        value={editedQuestion.description}
                        onChange={(e) =>
                          setEditedQuestion({
                            ...editedQuestion,
                            description: e.target.value,
                          })
                        }
                      />
                      <input
                        type="number"
                        className="block w-full mb-2 p-2 border"
                        value={editedQuestion.marks}
                        onChange={(e) =>
                          setEditedQuestion({
                            ...editedQuestion,
                            marks: e.target.value,
                          })
                        }
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => {
                            const updated = [...test.questions];
                            updated[index] = editedQuestion;
                            setTest({ ...test, questions: updated });
                            setEditingIndex(null);
                          }}
                          className="bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingIndex(null)}
                          className="bg-gray-400 text-white px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h4 className="font-semibold">{q.title}</h4>
                      <p className="text-sm text-gray-600">{q.description}</p>
                      <p className="text-xs text-gray-500">
                        Test Cases: {q.testCases.length}
                      </p>
                      <button
                        onClick={() => {
                          setEditingIndex(index);
                          setEditedQuestion(q);
                        }}
                        className="mt-2 text-sm text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                    </>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateTest;
