// controllers/crm/leadsController.js — viewing/updating Lead records.
// Leads are created by the site's own ingestion pipeline; this file only
// reads and updates rows that already exist.
import prisma from "../../config/prisma.js";
import { LeadStage } from "@prisma/client";

const STAGES = Object.values(LeadStage);

export async function listLeads(req, res) {
  const { leadType, stage, search, assignedTo, page = 1, limit = 20 } = req.query;

  const where = {};
  if (leadType) {
    const types = leadType.split(",");
    where.leadType = types.length > 1 ? { in: types } : types[0];
  }
  if (stage) where.stage = stage;
  if (assignedTo) where.assignedTo = assignedTo;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ];
  }

  const take = Math.min(Number(limit) || 20, 100);
  const currentPage = Math.max(Number(page) || 1, 1);

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * take,
      take,
      include: { assignee: { select: { id: true, email: true } } },
    }),
    prisma.lead.count({ where }),
  ]);

  res.json({ leads, total, page: currentPage, pages: Math.ceil(total / take) });
}

export async function getLead(req, res) {
  const lead = await prisma.lead.findUnique({
    where: { id: req.params.id },
    include: {
      assignee: { select: { id: true, email: true } },
      activities: { orderBy: { createdAt: "desc" }, include: { crmUser: { select: { id: true, email: true } } } },
      siteVisits: { orderBy: { scheduledAt: "desc" }, include: { crmUser: { select: { id: true, email: true } } } },
    },
  });
  if (!lead) return res.status(404).json({ error: "Lead not found" });
  res.json({ lead });
}

export async function updateLead(req, res) {
  const { stage, assignedTo } = req.body;
  const data = {};

  if (stage !== undefined) {
    if (!STAGES.includes(stage)) return res.status(400).json({ error: "Invalid stage" });
    data.stage = stage;
  }
  if (assignedTo !== undefined) data.assignedTo = assignedTo || null;

  if (Object.keys(data).length === 0) return res.status(400).json({ error: "No valid fields to update" });

  try {
    const lead = await prisma.lead.update({
      where: { id: req.params.id },
      data,
      include: { assignee: { select: { id: true, email: true } } },
    });
    res.json({ lead });
  } catch {
    res.status(404).json({ error: "Lead not found" });
  }
}
