import jwt from "jsonwebtoken";

const optionalAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next();
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      msg: "Invalid authorization header"
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.SECRET
    );

    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({
      msg: "Invalid or expired token"
    });
  }
};

export default optionalAuthMiddleware;