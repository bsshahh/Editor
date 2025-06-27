import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Userschema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    minlength: [3, "first name length should be greater than two"],
    maxlength: [20, "first name length should be less than twenty"],
  },
  lastname: {
    type: String,
    required: true,
    minlength: [3, "Last name length should be greater than two"],
    maxlength: [20, "Last name length should be less than twenty"],
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    minlength: [10, "email length should be greater than nine"],
    maxlength: [30, "email length should be less than twenty"],
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: [8, "password length should be between 8-12 character"],
    maxlength: [12, "password length should be between 8-12 character"],
    validate: {
      validator: function (val) {
        return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*...]).{8,12}$/.test(val);
      },
      message:
        "Password must be 8–12 characters with uppercase, number & special character",
    },
  },
  mobile: {
    type: Number,
    required: true,
    trim: true,
    unique: true,
    minlength: [10, "number length should be ten"],
    maxlength: [10, "number length should be ten"],
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  designation: {
    type:String,
    enum: ["student","faculty", "hr","other"],
    required: true,
  },
  organization : {
    type : String,
    required: true,
    trim : true,
  },
});
Userschema.pre("save", async function (next) {
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});
const hashpassword = async () => {
  bcrypt.hash(Userschema.password, 10);
};
const User = mongoose.model("User", Userschema);
export default User;
