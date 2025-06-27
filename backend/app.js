import expressApp from "../backend/config/express.js";
import connectDB from "./config/db.js";
if(process.env.NODE_ENV !== "production"){
    (await import('dotenv')).config();
}
const App=async()=>{
    try{
        await connectDB();
        return expressApp;
    }catch(err){
        console.log("error",err);
        process.exit(1);
    }
}
export default App;