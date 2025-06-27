import runcode from "../controller/runcodecontroller.js";
import express from "express";

const router=express.Router();
router.post("/run-code", runcode);

export default router;