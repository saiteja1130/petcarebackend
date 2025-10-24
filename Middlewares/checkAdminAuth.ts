import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "your_admin_secret_key";

export const checkAdminAuth = (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({
        message: "No token provided",
        success: false,
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, JWT_SECRET);

    req.adminId = decoded.adminId;
    next();
  } catch (error) {
    console.error("Admin auth error:", error);
    res.status(401).send({
      message: "Invalid or expired token",
      success: false,
    });
  }
};
