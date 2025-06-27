import mongoose from "mongoose";
import testCaseSchema from "./testcase.js";

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  marks: { type: Number, required: true },
  defaultCode: {
    javascript: { type: String, default: "" },
    cpp: { type: String, default: "" },
    java: { type: String, default: "" },
  },
  testCases: [testCaseSchema],
});

export default questionSchema;
