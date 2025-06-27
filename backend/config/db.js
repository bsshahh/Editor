import mongoose from 'mongoose';

const connectDB= async(req,res)=>{
    try{
            await mongoose.connect(process.env.DB_URL)
            console.log("MongoDB connected");
    }catch(e){
        console.error("Erron in connecting db "+e.message);
        process.exit(1);
    }
}
export default connectDB;