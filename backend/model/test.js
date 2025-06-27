import mongoose from "mongoose";
import questionSchema from "./question.js";

const testSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    duration: { type: Number, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    college: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    totalMarks: { type: Number, required: true },
    questions: [questionSchema],
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

testSchema.virtual("status").get(function () {
  const now = new Date();
  return this.endTime < now ? "Completed" : "Active";
});

export default mongoose.model("Test", testSchema);
