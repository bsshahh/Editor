import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema({
  input: { 
    type: String, 
    required: true 
  },

  expectedOutput: { 
    type: String, 
    required: true 
  },
});

export default testCaseSchema;
