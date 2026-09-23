// middleware/crmAuth.js — JWT authentication + role authorization for CrmUser.
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

export const SAFE_USER_FIELDS = { id: true, email: true, role: true, isActive: true, createdAt: true };

export async function authenticate(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.crmUser.findUnique({ where: { id: payload.id }, select: SAFE_USER_FIELDS });
    if (!user || !user.isActive) return res.status(401).json({ error: "Not authenticated" });
    req.crmUser = user;
    next();
  } catch {
    res.status(401).json({ error: "Not authenticated" });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.crmUser.role)) return res.status(403).json({ error: "Not authorized" });
    next();
  };
}
