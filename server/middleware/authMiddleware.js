import jwt from "jsonwebtoken"; 
export function authMiddleware(req, res, next) {
  let token = req.cookies?.token;

  // Fallback to Authorization Header (Bearer token)
  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");
    if (parts.length === 2 && parts[0] === "Bearer") {
      token = parts[1];
    }
  }

  if (!token) {
    res.status(401).json({
      error: "Access denied. No session token provided.",
    });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret",
    );

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({
      error: "Session expired or invalid. Please sign in again.",
    });
    // we return the value
  }
}
