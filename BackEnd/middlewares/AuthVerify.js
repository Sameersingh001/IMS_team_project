import jwt from "jsonwebtoken";

// ✅ Verify JWT token from cookie
export const verifyToken = (req, res, next) => {
  const token = req.headers.cookie?.split('token=')[1]; // Extract token from cookie
  if (!token)
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach decoded user info to request
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};
