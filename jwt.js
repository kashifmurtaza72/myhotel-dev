const jwt = require("jsonwebtoken");

const jsonwebtoken = (req, res, next) => {
  // Extract the jwt token from the request headers
  const token = req.headers.authorization.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    // verify the jwt token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: "Invalid Token" });
  }
};

// Function to generate JWT Token
const generateToken = (userData) => {
    // generate a new JWT token using user data
    return jwt.sign(userData, process.env.JWT_SECRET);
}

//module.exports = jwtAuthMiddleware;
module.exports = {jwtAuthMiddleware, generateToken};