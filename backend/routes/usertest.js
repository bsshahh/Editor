import express from "express";
import { verifyUser } from "../middleware/verifyUser.js";
import { getAvailableTests,getTestById,getUserSubmissions,saveUserResponse,submitTestSolution } from "../controller/testcontroller.js";

const router =express.Router();

router.get("/tests",verifyUser,getAvailableTests);
router.get("/test/:id", verifyUser, getTestById);
router.get("/user-submissions", verifyUser, getUserSubmissions);
router.post("/submit/:testId", verifyUser, submitTestSolution);
router.post("/save-response",verifyUser,saveUserResponse);

export default router;