import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  try {
    // Read cookie
    let token = req.cookies?.token;

    // If no cookie, check Authorization header (optional fallback)
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "Not Authorized" });
    }

    // Verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error("AUTH ERROR:", error.message);
    return res.status(401).json({ success: false, message: "Not Authorized" });
  }
};

export default authUser;
