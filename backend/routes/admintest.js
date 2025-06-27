import express from "express";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import { createTest, getAllTests, deleteTest, updateTest } from "../controller/admintestcontroller.js";

const router = express.Router();

router.get("/",()=>{
    console.log("hii");
})
router.post("/create-test", verifyAdmin, createTest);
router.get("/tests", verifyAdmin, getAllTests);
router.delete("/delete-test/:id", verifyAdmin, deleteTest);
router.put("/update-test/:testId", verifyAdmin, updateTest);

export default router;
