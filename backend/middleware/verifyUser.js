import jwt from "jsonwebtoken";

export const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  // console.log("y1");
  if (!token) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT);
    // console.log("h1");
    if (decoded.role !== "user") {
      return res.status(403).json({ message: "Access denied. Users only." });
    }

    req.user = decoded;
    // console.log("h2");
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid token." });
  }
};
