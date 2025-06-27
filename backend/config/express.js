
import express from "express";
import setupMiddleware from "../middleware/SetUpmiddleware.js";
import routes from "../routes/routes.js";
const app=express();
const configureApp = async () => {
  await setupMiddleware(app); 
  routes(app);                
};

await configureApp(); 

export default app;