import runcode from "./runcode.js";
import userreg from "./userregister.js";
import auth from "./auth.js";
import admintest from "./admintest.js";
import usertest from "./usertest.js";
const routes=(app)=>{
    app.get("/", (req, res) => {
    res.status(200).send("✅ Backend is live and healthy!");
  });
    app.use("/api/code",runcode);
    app.use("/api/user",userreg);
    app.use("/api/auth",auth);
    app.use("/api/admin",admintest);
    app.use("/api/utest",usertest);
}
export default routes;