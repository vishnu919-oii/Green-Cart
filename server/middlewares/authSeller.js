import jwt from "jsonwebtoken";

const authSeller = (req, res, next) => {
  try {
    const token = req.cookies.sellerToken;
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.seller = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid Token" });
  }
};

export default authSeller;
