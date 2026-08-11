import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    // mtlb user is not logged in so we didnt find a token
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }
    // we verified the token ki sahi hai ya nahi 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }
    // we found the user and passed the user with request its just we removed the password field for security reasons 
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    // now the request contains user data so it can be sent to the actual request from the user like changing profile photo or sending message
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};