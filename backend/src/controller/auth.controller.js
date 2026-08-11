import bcrypt from "bcryptjs"
import User from "../models/user.model.js"
import { generateToken } from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.js"
import { config } from "dotenv"

config();
export const signup = async (req, res) => {
    const { fullname, email, password } = req.body;
    try {
        // agar koi bhi field empty hai to error 
        if (!fullname || !email || !password) {
            return res.status(400).json({ message: "all fieldsare required" });
        }
        //if pass length less than 6 to error
        if (password.length < 6) {
            return res.status(400).json({ message: "password length should be at least 6" })
        }
        // now we chexxk if there exist a user with same email as email is the differentiating point of every user 
        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "user already exists" });
        // now if thee doesnt exist a user we use bcrypt to hash password 
        const salt = await bcrypt.genSalt(10);
        const hashedpass = await bcrypt.hash(password, salt);
         // create a new user
        const newuser = new User({
            email,
            password: hashedpass,
            fullname,

        })
        // if new user generated successfully we print successs status
        if (newuser) {
            generateToken(newuser._id, res);
            await newuser.save();
            res.status(201).json({
                _id: newuser._id,
                fullname: newuser.fullname,
                email: newuser.email,
                profilePic: newuser.profilePic,
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }


    } catch (error) {

        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });

    }

};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        //if everything is correct we generate a tokemn and send it to browser through cookies  
        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }

};

export const logout = (req, res) => {
    try {
        // we change the other primary cookie with "" and set its maxAge to zero that is delete it on the spot 
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }

};

export const updateProfile = async (req,res)=>{
    try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }

};

export const checkAuth=async (req,res)=>{
    try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
    
};
