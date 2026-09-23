// controllers/crm/authController.js — CrmUser login/session, against CrmUser model.
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../config/prisma.js";
import { SAFE_USER_FIELDS } from "../../middleware/crmAuth.js";

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

  const user = await prisma.crmUser.findUnique({ where: { email } });
  if (!user || !user.isActive) return res.status(401).json({ error: "Invalid email or password" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid email or password" });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
  const safeUser = { id: user.id, email: user.email, role: user.role, isActive: user.isActive, createdAt: user.createdAt };
  res.json({ token, user: safeUser });
}

export function logout(_req, res) {
  res.json({ success: true });
}

export function me(req, res) {
  res.json({ user: req.crmUser });
}
