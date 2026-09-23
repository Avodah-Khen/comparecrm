// controllers/crm/activitiesController.js — LeadActivity audit trail/notes.
import prisma from "../../config/prisma.js";

export async function listActivities(req, res) {
  const { leadId } = req.query;
  if (!leadId) return res.status(400).json({ error: "leadId is required" });

  const activities = await prisma.leadActivity.findMany({
    where: { leadId },
    orderBy: { createdAt: "desc" },
    include: { crmUser: { select: { id: true, email: true } } },
  });
  res.json({ activities });
}

export async function createActivity(req, res) {
  const { leadId, activityType, notes } = req.body;
  if (!leadId || !activityType) return res.status(400).json({ error: "leadId and activityType are required" });

  const activity = await prisma.leadActivity.create({
    data: { leadId, activityType, notes, crmUserId: req.crmUser.id },
    include: { crmUser: { select: { id: true, email: true } } },
  });
  res.status(201).json({ activity });
}
