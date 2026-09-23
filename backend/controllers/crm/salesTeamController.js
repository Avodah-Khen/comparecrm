// controllers/crm/salesTeamController.js — CrmUser management: sales team
// roster, roles, active status.
import bcrypt from "bcryptjs";
import prisma from "../../config/prisma.js";
import { SAFE_USER_FIELDS } from "../../middleware/crmAuth.js";

export async function listSalesTeam(_req, res) {
  const users = await prisma.crmUser.findMany({ orderBy: { createdAt: "asc" }, select: SAFE_USER_FIELDS });
  res.json({ users });
}

export async function createSalesTeamMember(req, res) {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ error: "email, password and role are required" });
  }

  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.crmUser.create({
      data: { email, password: hashed, role },
      select: SAFE_USER_FIELDS,
    });
    res.status(201).json({ user });
  } catch (err) {
    if (err.code === "P2002") return res.status(409).json({ error: "Email already exists" });
    throw err;
  }
}

export async function updateSalesTeamMember(req, res) {
  const { role, isActive } = req.body;
  const data = {};
  if (role !== undefined) data.role = role;
  if (isActive !== undefined) data.isActive = isActive;

  if (Object.keys(data).length === 0) return res.status(400).json({ error: "No valid fields to update" });

  try {
    const user = await prisma.crmUser.update({ where: { id: req.params.id }, data, select: SAFE_USER_FIELDS });
    res.json({ user });
  } catch {
    res.status(404).json({ error: "User not found" });
  }
}
