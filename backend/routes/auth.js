import express from 'express';
import authcontroller from '../controller/authcontroller.js';

const {login,logout,logincheck}=authcontroller;
const router=express.Router();
router.post("/login",login);
router.post("/logout",logout);
router.get("/login-check",logincheck,(req, res) => {
  res.status(200).json({
    user: req.user,
  });
});
export default router;