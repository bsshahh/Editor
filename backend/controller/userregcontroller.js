import User from "../model/Register.js";
import bcrypt from "bcrypt";

const userregcontroller = {
  createUser: async (req, res) => {
    console.log("hii",req.body);
    try {
      const { firstname, lastname, email, password, mobile, role,designation, organization, admincode } =
        req.body;

      if (role === "admin") {
        // console.log(admincode+" "+process.env.ADMIN_CODE);
        if (admincode !== process.env.ADMIN_CODE) {
          return res.status(403).json({
            message: "Invalid admin code",
          });
        }
      }
      const userDetails = await User.create({
        firstname,
        lastname,
        email,
        password,
        mobile,
        role,
        designation,
        organization
      });
      return res.status(201).json({
        status: "success",
        data: userDetails,
        message: "user registered",
      });
    } catch (err) {
      console.error("Registration error:", err);

      if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({
          message: messages.join(", "),
        });
      }

      if (err.code === 11000) {
        return res.status(400).json({
          message: "Email or Mobile already exists",
        });
      }

      return res.status(500).json({
        message: "Something went wrong. Please try again later.",
      });
    }
  },

  // Alluser: async (req, res) => {
  //   try {
  //     const users = await User.find({ role: "user" }).select("-password");
  //     if (!users || users.length === 0)
  //       return res.status(404).json({
  //         userDetails: [],
  //         message: "No user available",
  //       });
  //     return res.status(200).json({
  //       userDetails: users,
  //       message: "Users fetched ",
  //     });
  //   } catch (err) {
  //     console.log("error in fetch user", err);
  //     return res.status(500).json({
  //       message: "Internal server error",
  //     });
  //   }
  // },
  
  // deleteUser: async (req, res) => {
  //   try {
  //     const userId = req.params.id;
  //     const duser = await User.findByIdAndDelete(userId);
  //     if (!duser) {
  //       return res.status(404).json({
  //         message: "User not found",
  //       });
  //     }
  //     return res.status(200).json({
  //       message: "User deleted succussfully",
  //     });
  //   } catch (err) {
  //     console.error("Error deleting user:", err);
  //     res.status(500).json({ message: "Server error while deleting user." });
  //   }
  // },

  // updateUser: async (req, res) => {
  //   try {
  //     const userId = req.params.id;
  //     const { firstname, lastname, mobile } = req.body;

  //     const updateuser = await User.findByIdAndUpdate(
  //       userId,
  //       {
  //         firstname,
  //         lastname,
  //         mobile,
  //       },
  //       {
  //         runValidators: true,
  //         new: true,
  //       }
  //     );
  //     if (!updateuser)
  //       return res.status(404).json({
  //         message: "User not found",
  //       });
  //     return res.status(200).json({
  //       message: "User updated succussfully",
  //     });
  //   } catch (err) {
  //     console.error("Error updating user:", err);
  //     res.status(500).json({ message: "Server error while updating user." });
  //   }
  // },

  forgetPassword: async (req, res) => {
    try {
      console.log(req.body.email);
      const { email, oldpassword, newpassword } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      const ismatch = await bcrypt.compare(oldpassword, user.password);
      if (!ismatch) {
        return res.status(401).json({
          message: "Invalid password",
        });
      }
      const hashedpassword = await bcrypt.hash(newpassword, 10);
      await User.findOneAndUpdate(
        { email },
        {
          password: hashedpassword,
        }
      );
      res.status(200).json({ message: "Password updated successfully!" });
    } catch (err) {
      console.log("Error in change password" + err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  // logout: async(req,res)=>{
  //   const userToken = req.cookies.token;
  //   console.log(userToken)
  //   res.cookie("token", "")

  //   return res.status(200).json({
  //     status:"success",
  //     message: "Logout succesfully"
  //   })
  // }
};
export default userregcontroller;
