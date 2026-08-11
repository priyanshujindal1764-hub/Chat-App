import jwt from "jsonwebtoken"

export const generateToken = (userId, res) => {
  // we create a token with a secret in our environment variables 
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "6d",
  });
  // pack the token in a cookie and sent the cookie to browser
  res.cookie("jwt", token, {
    maxAge: 6*24*60*60*1000, 
    httpOnly: true, 
    sameSite: "strict", 
    secure: process.env.NODE_ENV !== "development",
  });

  return token; 
};