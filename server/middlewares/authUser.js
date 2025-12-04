import jwt from "jsonwebtoken";
const authUser = async (req, res, next) => {
  try {
    
    const token = req.cookies.token;

    if (!token){
      return res.status(401).json({ success: false, message: "Not Authorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;   // <--- THIS is where your error came from
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Not Authorized" });
  }
};
export default authUser;