
import express from "express";
import setupMiddleware from "../middleware/SetUpmiddleware.js";
import routes from "../routes/routes.js";
const app=express();

setupMiddleware(app);
routes(app);
export default app;