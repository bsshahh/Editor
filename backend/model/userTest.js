import mongoose from "mongoose";

const userTestSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    testId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test",
        required: true,
    },
    joinedAt: {
        type: Date,
        default: Date.now,
    },
    submitted: {
        type: Boolean,
        default: false,
    },
    submittedAt: {
        type: Date,
    },
    score: {
        type: Number,
        default: 0
    },
    responses: [
        {
            questionId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
            },
            code: {
                type: String,
                required: true,
            },
            language: {
                type: String,
                required: true,
            },
            passedCount: {
                type: Number,
                required: true,
            },
            totalCases: {
                type: Number,
                required: true,
            },
            marksEarned: {
                type: Number,
                required: true,
            },
            submittedAt: {
                type: Date,
                default: Date.now,
            },
        }
    ]
});
 
export default mongoose.model("UserTest",userTestSchema);