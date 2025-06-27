import express from "express";
import userregcontroller from "../controller/userregcontroller.js";


const {createUser,forgetPassword}=userregcontroller;


const router=express.Router();

// router.get("/fetchuser", Alluser);

router.post("/register",createUser);
router.put("/forgetpassword",forgetPassword);
// router.delete("/udelete/:id",deleteUser);
// router.put("/updatedetail/:id",updateUser);



export default router;