import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const configureApp=async(app)=>{
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors(
        {
            origin:"http://localhost:5173",
            credentials:true,
        }
    ));
    app.use(cookieParser());
}
export default configureApp;


